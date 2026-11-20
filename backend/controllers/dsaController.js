import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { db, isMockFirebase, memoryStore } from '../firebase/firebaseAdmin.js';
import { CodeRunnerService } from '../services/codeRunner.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { calculatePlacementReadiness } from '../utils/scoring.js';
import { isUnmodifiedStarterCode } from '../utils/codeGuard.js';

// In-memory rate limiter: 20 runs per minute per student
const studentRunTimestamps = new Map();

function checkRunRateLimit(userId) {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRuns = 20;

  if (!studentRunTimestamps.has(userId)) {
    studentRunTimestamps.set(userId, []);
  }

  const timestamps = studentRunTimestamps.get(userId).filter(t => now - t < windowMs);
  if (timestamps.length >= maxRuns) {
    return false;
  }

  timestamps.push(now);
  studentRunTimestamps.set(userId, timestamps);
  return true;
}

// In-memory high-speed cache for static curricular DSA data (5-minute TTL)
export const dsaCache = {
  topics: { data: null, expiresAt: 0 },
  topicProblems: new Map(), // topicId -> { topic, problems, expiresAt }
  problemDetails: new Map(), // problemId -> { data, expiresAt }
  visualizations: new Map() // problemId -> { data, expiresAt }
};
const DSA_CACHE_TTL = 5 * 60 * 1000;

export function invalidateDsaCache() {
  dsaCache.topics = { data: null, expiresAt: 0 };
  dsaCache.topicProblems.clear();
  dsaCache.problemDetails.clear();
  dsaCache.visualizations.clear();
}

/**
 * GET /api/technical/dsa/topics
 * Returns all 21 topics in learning order with student's solved count per topic
 */
export const getDsaTopics = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const now = Date.now();

    let rawTopics;
    if (dsaCache.topics.data && now < dsaCache.topics.expiresAt) {
      rawTopics = dsaCache.topics.data;
    } else {
      rawTopics = await FirestoreHelper.queryCollection('dsa_topics');
      if (rawTopics && rawTopics.length > 0) {
        dsaCache.topics = { data: rawTopics, expiresAt: now + DSA_CACHE_TTL };
      }
    }

    const userStatuses = userId
      ? await FirestoreHelper.queryCollection('dsa_problem_status', 'userId', userId)
      : [];

    const solvedProblemIds = new Set(
      userStatuses.filter(s => s.state === 'solved').map(s => s.problemId)
    );

    const topics = rawTopics
      .map(t => {
        const solvedCount = userStatuses.filter(s => s.topicId === t.topicId && s.state === 'solved').length;
        return {
          ...t,
          solvedCount
        };
      })
      .sort((a, b) => (a.order || 999) - (b.order || 999));

    return sendSuccess(res, { topics }, 'DSA topics fetched successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/technical/dsa/topic/:topicId
 * Returns topic concept, code examples, and problem list (without hidden test cases)
 */
export const getDsaTopicDetail = async (req, res, next) => {
  try {
    const { topicId } = req.params;
    const userId = req.user?.userId;
    const now = Date.now();

    let topic;
    let allProblems;

    const cachedEntry = dsaCache.topicProblems.get(topicId);
    if (cachedEntry && now < cachedEntry.expiresAt) {
      topic = cachedEntry.topic;
      allProblems = cachedEntry.problems;
    } else {
      [topic, allProblems] = await Promise.all([
        FirestoreHelper.getDoc('dsa_topics', topicId),
        FirestoreHelper.queryCollection('dsa_problems', 'topicId', topicId)
      ]);
      if (topic && allProblems) {
        dsaCache.topicProblems.set(topicId, {
          topic,
          problems: allProblems,
          expiresAt: now + DSA_CACHE_TTL
        });
      }
    }

    if (!topic) {
      return sendError(res, `Topic "${topicId}" not found`, 404);
    }

    const userStatuses = userId
      ? await FirestoreHelper.queryCollection('dsa_problem_status', 'userId', userId)
      : [];

    const statusMap = new Map();
    userStatuses.forEach(s => statusMap.set(s.problemId, s));

    const problems = allProblems
      .filter(p => p.status === 'approved')
      .map(p => {
        const userStatus = statusMap.get(p.problemId);
        // OMIT hidden test cases from the client payload
        const { hiddenTestCases: _, ...clientProblem } = p;
        return {
          ...clientProblem,
          hiddenTestCasesCount: Array.isArray(p.hiddenTestCases) ? p.hiddenTestCases.length : 0,
          userStatus: userStatus ? {
            state: userStatus.state,
            attemptCount: userStatus.attemptCount || 0,
            firstVerdict: userStatus.firstVerdict || null,
            solutionViewed: userStatus.solutionViewed || false
          } : {
            state: 'unseen',
            attemptCount: 0,
            firstVerdict: null,
            solutionViewed: false
          }
        };
      })
      .sort((a, b) => {
        const diffRank = { Easy: 1, Medium: 2, Hard: 3 };
        return (diffRank[a.difficulty] || 2) - (diffRank[b.difficulty] || 2);
      });

    return sendSuccess(res, { topic, problems }, 'Topic details fetched successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/technical/dsa/problem/:problemId
 * Returns full problem details (statement, constraints, examples, hints, starterCode, approaches)
 * Hidden test cases are strictly omitted.
 */
export const getDsaProblemDetail = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const userId = req.user?.userId;
    const now = Date.now();

    let problem;
    const cachedProb = dsaCache.problemDetails.get(problemId);
    if (cachedProb && now < cachedProb.expiresAt) {
      problem = cachedProb.data;
    } else {
      problem = await FirestoreHelper.getDoc('dsa_problems', problemId);
      if (problem) {
        dsaCache.problemDetails.set(problemId, {
          data: problem,
          expiresAt: now + DSA_CACHE_TTL
        });
      }
    }

    const userStatus = userId
      ? await FirestoreHelper.getDoc('dsa_problem_status', `${userId}_${problemId}`)
      : null;

    if (!problem || problem.status !== 'approved') {
      return sendError(res, 'Problem not found or not approved yet', 404);
    }

    // Strip hidden test cases
    const { hiddenTestCases: _, ...clientProblem } = problem;

    return sendSuccess(res, {
      problem: {
        ...clientProblem,
        hiddenTestCasesCount: Array.isArray(problem.hiddenTestCases) ? problem.hiddenTestCases.length : 0
      },
      userStatus: userStatus ? {
        state: userStatus.state || 'unseen',
        attemptCount: userStatus.attemptCount || 0,
        firstVerdict: userStatus.firstVerdict || null,
        solutionViewed: userStatus.solutionViewed || false
      } : {
        state: 'unseen',
        attemptCount: 0,
        firstVerdict: null,
        solutionViewed: false
      }
    }, 'Problem retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/technical/dsa/view-solution
 * Marks problem as "Solution viewed" so subsequent submissions cannot be scored for placement readiness.
 */
export const markDsaSolutionViewed = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { problemId } = req.body;

    if (!problemId) return sendError(res, 'problemId is required', 400);

    const statusId = `${userId}_${problemId}`;
    const problem = await FirestoreHelper.getDoc('dsa_problems', problemId);

    if (isMockFirebase || !db) {
      const existing = (await FirestoreHelper.getDoc('dsa_problem_status', statusId)) || {
        userId,
        problemId,
        topicId: problem?.topicId || 'general',
        state: 'attempted',
        attemptCount: 0,
        firstVerdict: null
      };
      existing.solutionViewed = true;
      await FirestoreHelper.setDoc('dsa_problem_status', statusId, existing, true);
      return sendSuccess(res, { solutionViewed: true }, 'Solution viewed recorded');
    }

    const statusRef = db.collection('dsa_problem_status').doc(statusId);
    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(statusRef);
      if (!doc.exists) {
        transaction.set(statusRef, {
          userId,
          problemId,
          topicId: problem?.topicId || 'general',
          state: 'attempted',
          attemptCount: 0,
          firstVerdict: null,
          solutionViewed: true,
          updatedAt: new Date().toISOString()
        });
      } else {
        transaction.update(statusRef, {
          solutionViewed: true,
          updatedAt: new Date().toISOString()
        });
      }
    });

    return sendSuccess(res, { solutionViewed: true }, 'Solution viewed recorded');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/technical/dsa/run
 * Runs code against visible sample test cases OR custom input
 * Does NOT evaluate hidden tests and does NOT touch scores
 */
export const runDsaCode = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!checkRunRateLimit(userId)) {
      return sendError(res, 'Rate limit reached: Maximum 20 runs per minute. Please wait a moment.', 429);
    }

    const { problemId, language = 'python', code, customInput = null, isCustom = false } = req.body;
    if (!code || !String(code).trim()) {
      return sendError(res, 'Code cannot be empty.', 400);
    }

    const problem = await FirestoreHelper.getDoc('dsa_problems', problemId);
    if (!problem) {
      return sendError(res, 'Problem not found', 404);
    }

    // Server-side guard: Prevent running empty code or unmodified starter code stub
    const guardCheck = isUnmodifiedStarterCode(code, problem.starterCode, language);
    if (guardCheck.isStub) {
      return sendError(res, 'Write your solution first', 400);
    }

    const result = await CodeRunnerService.run({
      language,
      code,
      testCases: problem.testCases || [],
      customInput,
      isCustom,
      timeLimit: problem.timeLimit || 2000
    });

    return sendSuccess(res, result, 'Code executed');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/technical/dsa/submit
 * Submits code against ALL visible AND hidden test cases.
 * Enforces first-attempt-only scoring via a Firestore transaction.
 */
export const submitDsaCode = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!checkRunRateLimit(userId)) {
      return sendError(res, 'Rate limit reached: Maximum 20 submissions per minute. Please wait a moment.', 429);
    }

    const { problemId, language = 'python', code } = req.body;
    if (!code || !String(code).trim()) {
      return sendError(res, 'Code cannot be empty.', 400);
    }

    const problem = await FirestoreHelper.getDoc('dsa_problems', problemId);
    if (!problem) {
      return sendError(res, 'Problem not found', 404);
    }

    // Server-side guard: Prevent submitting empty code or unmodified starter code stub
    const guardCheck = isUnmodifiedStarterCode(code, problem.starterCode, language);
    if (guardCheck.isStub) {
      return sendError(res, 'Write your solution first', 400);
    }

    // 1. Evaluate code against both visible and hidden test cases
    const execResult = await CodeRunnerService.submit({
      language,
      code,
      visibleTestCases: problem.testCases || [],
      hiddenTestCases: problem.hiddenTestCases || [],
      timeLimit: problem.timeLimit || 2000
    });

    const isAccepted = execResult.verdict === 'Accepted';
    const statusId = `${userId}_${problemId}`;
    let isScored = false;
    let scoringMessage = '';
    let attemptNumber = 1;

    // 2. Enforce Scoring Rule via Firestore Transaction
    if (!isMockFirebase && db) {
      const statusRef = db.collection('dsa_problem_status').doc(statusId);
      await db.runTransaction(async (transaction) => {
        const doc = await transaction.get(statusRef);
        const nowIso = new Date().toISOString();

        if (!doc.exists) {
          // First attempt ever
          isScored = true;
          scoringMessage = isAccepted
            ? 'First attempt accepted! Placement readiness score updated.'
            : 'First attempt recorded.';
          attemptNumber = 1;

          transaction.set(statusRef, {
            userId,
            problemId,
            topicId: problem.topicId,
            state: isAccepted ? 'solved' : 'attempted',
            firstVerdict: execResult.verdict,
            attemptCount: 1,
            solutionViewed: false,
            lastAttemptAt: nowIso,
            updatedAt: nowIso
          });
        } else {
          const current = doc.data();
          attemptNumber = (current.attemptCount || 0) + 1;

          if (current.attemptCount === 0 || !current.firstVerdict) {
            // First formal submission
            if (current.solutionViewed) {
              isScored = false;
              scoringMessage = 'Solution viewed prior to submission (Practice attempt, not scored).';
            } else {
              isScored = true;
              scoringMessage = isAccepted
                ? 'First attempt accepted! Placement readiness score updated.'
                : 'First attempt recorded.';
            }

            transaction.update(statusRef, {
              state: isAccepted ? 'solved' : (current.state || 'attempted'),
              firstVerdict: execResult.verdict,
              attemptCount: attemptNumber,
              lastAttemptAt: nowIso,
              updatedAt: nowIso
            });
          } else {
            // Subsequent practice attempts
            isScored = false;
            scoringMessage = 'Practice attempt, not scored.';
            transaction.update(statusRef, {
              state: isAccepted ? 'solved' : current.state,
              attemptCount: attemptNumber,
              lastAttemptAt: nowIso,
              updatedAt: nowIso
            });
          }
        }
      });
    } else {
      // Mock / In-Memory Mode fallback
      const existing = (await FirestoreHelper.getDoc('dsa_problem_status', statusId)) || {
        userId,
        problemId,
        topicId: problem.topicId,
        state: 'unseen',
        attemptCount: 0,
        solutionViewed: false
      };

      attemptNumber = (existing.attemptCount || 0) + 1;
      if (existing.attemptCount === 0) {
        isScored = !existing.solutionViewed;
        scoringMessage = isScored
          ? (isAccepted ? 'First attempt accepted!' : 'First attempt recorded.')
          : 'Solution viewed prior to submission (Practice attempt, not scored).';
        existing.firstVerdict = execResult.verdict;
      } else {
        isScored = false;
        scoringMessage = 'Practice attempt, not scored.';
      }

      existing.attemptCount = attemptNumber;
      if (isAccepted) existing.state = 'solved';
      else if (existing.state === 'unseen') existing.state = 'attempted';
      existing.lastAttemptAt = new Date().toISOString();

      await FirestoreHelper.setDoc('dsa_problem_status', statusId, existing, true);
    }

    // 3. Update student technical score if this submission is scored
    if (isScored && isAccepted) {
      try {
        const readiness = (await FirestoreHelper.getDoc('placement_readiness', 'readiness_' + userId)) || {};
        const prevTech = typeof readiness.technicalScore === 'number' ? readiness.technicalScore : 0;
        const newTechScore = Math.min(100, Math.round(prevTech === 0 ? 80 : (prevTech + 100) / 2));

        const updatedStats = {
          ...readiness,
          technicalScore: newTechScore
        };
        updatedStats.overallReadiness = calculatePlacementReadiness(updatedStats);
        await FirestoreHelper.setDoc('placement_readiness', 'readiness_' + userId, updatedStats, true);
      } catch (scoreErr) {
        console.warn('[submitDsaCode] Readiness score update notice:', scoreErr.message);
      }
    }

    // 4. Save attempt history record
    const attemptId = `att_${userId}_${problemId}_${Date.now()}`;
    await FirestoreHelper.setDoc('dsa_problem_attempts', attemptId, {
      attemptId,
      userId,
      problemId,
      topicId: problem.topicId,
      attemptNumber,
      language,
      code,
      verdict: execResult.verdict,
      testsPassed: execResult.testsPassed,
      totalTests: execResult.totalTests,
      time: execResult.time,
      memory: execResult.memory,
      isScored,
      submittedAt: new Date().toISOString()
    });

    return sendSuccess(res, {
      verdict: execResult.verdict,
      testsPassed: execResult.testsPassed,
      totalTests: execResult.totalTests,
      time: execResult.time,
      memory: execResult.memory,
      isScored,
      scoringMessage,
      failedTestCase: execResult.failedTestCase || null,
      testResults: execResult.testResults
    }, 'Submission evaluated');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/technical/dsa/submissions
 * Returns user's submissions for a problem or topic
 */
export const getDsaSubmissions = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { problemId, topicId } = req.query;

    let attempts = await FirestoreHelper.queryCollection('dsa_problem_attempts', 'userId', userId);

    if (problemId) {
      attempts = attempts.filter(a => a.problemId === problemId);
    } else if (topicId) {
      attempts = attempts.filter(a => a.topicId === topicId);
    }

    attempts.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    return sendSuccess(res, { submissions: attempts }, 'Submissions retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/technical/dsa/problem/:problemId/tutor-chat
 * Real-time AI algorithm tutor / coach for the Understanding & Visualizer page
 * Answers questions, explains lines, explains custom targets or when solutions are not found,
 * and provides friendly, non-coder accessible analogies.
 */
// Rate limiter: 30 messages per hour per student for AI Tutor Coach
const tutorChatTimestamps = new Map();

function checkTutorRateLimit(userId) {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const maxChats = 30;

  if (!tutorChatTimestamps.has(userId)) {
    tutorChatTimestamps.set(userId, []);
  }

  const timestamps = tutorChatTimestamps.get(userId).filter(t => now - t < windowMs);
  if (timestamps.length >= maxChats) {
    return false;
  }

  timestamps.push(now);
  tutorChatTimestamps.set(userId, timestamps);
  return true;
}

// Generates 3 contextual quick buttons for any problem & step
function getDynamicQuickButtons(problem, currentStepData) {
  const title = (problem?.title || '').toLowerCase();
  const topic = (problem?.topicId || '').toLowerCase();

  if (title.includes('two sum') || title.includes('pair')) {
    return [
      'Why complement = target - num?',
      'What does the hash map store?',
      'Why is the lookup O(1) time?'
    ];
  }
  if (title.includes('stock') || title.includes('buy and sell')) {
    return [
      'Why do we update min_price?',
      'Can we buy and sell on the same day?',
      'Why does this need only O(1) memory?'
    ];
  }
  if (title.includes('palindrome')) {
    return [
      'Why do we skip punctuation and spaces?',
      'Why do two pointers meet in the middle?',
      'What happens if the string has odd length?'
    ];
  }
  if (title.includes('binary search') || topic === 'binary-search') {
    return [
      'Why mid = (left + right) // 2?',
      'What if the target is not in the array?',
      'Why is the time complexity O(log N)?'
    ];
  }
  if (title.includes('kadane') || title.includes('subarray')) {
    return [
      'Why reset current sum when it drops < 0?',
      'What if all numbers in the array are negative?',
      'Why can this be solved in a single pass?'
    ];
  }
  if (title.includes('single number') || topic === 'bit-manipulation') {
    return [
      'Why does X ^ X = 0 cancel duplicate pairs?',
      'Why does X ^ 0 preserve the single number?',
      'Why does XOR order not matter?'
    ];
  }
  if (topic === 'linked-list') {
    return [
      'How does fast and slow pointer detect cycles?',
      'Why do we need a dummy head node?',
      'How to reverse next pointers without losing nodes?'
    ];
  }
  if (topic === 'stack') {
    return [
      'Why is stack LIFO ideal for matching brackets?',
      'What is stored on top of the stack?',
      'Why is push/pop O(1) time?'
    ];
  }
  if (topic === 'sliding-window') {
    return [
      'When do we expand the right boundary?',
      'When do we shrink the left boundary?',
      'Why is total time O(N) instead of O(N²)?'
    ];
  }
  return [
    'Can you explain this step simply?',
    'What is the core invariant here?',
    'What is the time and space complexity?'
  ];
}

/**
 * POST /api/technical/dsa/problem/:problemId/tutor-chat
 * Real-time AI algorithm tutor / coach for the Understanding & Visualizer page
 * Socratic, beginner-friendly Sarah persona.
 * Never gives the full solution code before student's first scored submission.
 * Enforces rate limiting (30 msg/hr) and never falls back to canned/fake answers on error.
 */
export const askDsaTutorChat = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const { message, currentStepData = null, selectedLanguage = 'python', studentCode = null, chatHistory = [] } = req.body;
    const userId = req.user?.uid || req.user?.id || 'guest';

    if (!message || !message.trim()) {
      return sendError(res, 'Message is required', 400);
    }

    // Rate limiting: 30 messages per hour per student
    if (!checkTutorRateLimit(userId)) {
      return sendError(res, 'Rate limit exceeded: maximum 30 AI Coach messages per hour. Please wait a bit before asking again.', 429);
    }

    const problem = await FirestoreHelper.getDoc('dsa_problems', problemId);
    if (!problem) {
      return sendError(res, 'Problem not found', 404);
    }

    // Check student's submission status to enforce scoring fairness rule
    let hasSubmitted = false;
    try {
      if (userId !== 'guest') {
        const attemptDoc = await FirestoreHelper.getDoc('dsa_attempts', `${userId}_${problemId}`);
        if (attemptDoc && (attemptDoc.attemptCount > 0 || attemptDoc.state === 'solved')) {
          hasSubmitted = true;
        }
      }
    } catch (_) {}

    const optimalApproach = Array.isArray(problem.approaches)
      ? problem.approaches.find(a => (a.type || a.name || '').toLowerCase().includes('optimal')) || problem.approaches[problem.approaches.length - 1]
      : null;

    const systemInstruction = `You are Sarah, a warm, friendly, and expert DSA Placement Coach at PlacementAI.
Your mission is to help beginner students and non-coders truly understand data structures and algorithms step-by-step.

STRICT PEDAGOGICAL & SECURITY RULES:
1. Socratic Teaching: Ask a guiding question or give an intuitive hint first before explaining deeper.
2. First-Attempt Fairness Rule: ${
      hasSubmitted
        ? 'The student has already made their first submission on this problem. You may freely discuss optimal code lines, edge cases, and complete implementations.'
        : 'CRITICAL FAIRNESS RULE: The student HAS NOT made their first scored submission yet! To protect their score and learning integrity, DO NOT reveal or write the complete solution code. Guide them with logic, invariants, small examples, and algorithmic hints only.'
    }
3. Stay on Topic: Only answer about THIS specific problem (${problem.title}), the visualizer step, and algorithms. If the student asks something outside this problem, politely guide them back.
4. Non-repetitive: Never repeat an answer verbatim. If asked again, explain from a fresh, relatable real-world analogy.
5. Use Problem Data: Use the actual numbers, parameters, and variable values from this problem's data and current step.

Problem Details:
- Title: ${problem.title} (${problem.difficulty})
- Topic: ${problem.topicId} | Pattern: ${problem.pattern || 'Algorithmic Invariant'}
- Statement: ${problem.statement}
- Constraints: ${JSON.stringify(problem.constraints || [])}
- Optimal Approach Idea: ${optimalApproach?.idea || 'Maintain optimal invariant in single pass'}
- Time Complexity: ${problem.timeComplexity || optimalApproach?.timeComplexity || 'O(N)'}
- Space Complexity: ${problem.spaceComplexity || optimalApproach?.spaceComplexity || 'O(1)'}
${currentStepData ? `- Current Visualizer Step: ${JSON.stringify({
  stepIndex: currentStepData.stepIndex,
  title: currentStepData.title,
  activeLine: currentStepData.activeLine,
  explanation: currentStepData.explanation,
  formula: currentStepData.formula,
  variables: currentStepData.variables,
  pointers: currentStepData.pointers
})}` : ''}
${selectedLanguage ? `- Language: ${selectedLanguage}` : ''}
${studentCode ? `- Student Editor Code Snippet: ${String(studentCode).slice(0, 500)}` : ''}
`;

    // Build chat conversation context (last 10 messages)
    const formattedHistory = Array.isArray(chatHistory)
      ? chatHistory.slice(-10).map(m => `${m.sender === 'user' ? 'Student' : 'Sarah'}: ${m.text}`).join('\n')
      : '';

    const userPromptText = formattedHistory
      ? `Recent Conversation:\n${formattedHistory}\n\nStudent: "${message}"\n\nSarah:`
      : `Student: "${message}"\n\nSarah:`;

    let replyText = '';
    try {
      const { generateCompletion } = await import('../services/grokService.js');
      const response = await generateCompletion(userPromptText, {
        systemPrompt: systemInstruction,
        temperature: 0.7,
        maxTokens: 800
      });
      replyText = typeof response === 'string' ? response : (response?.content || response?.message || '');
    } catch (aiErr) {
      console.error('[askDsaTutorChat] AI API call failed:', aiErr.message);
      // Return clear error - NEVER return canned or fake answers
      return sendError(res, 'AI Coach service is temporarily busy. Please click Retry in a few seconds.', 503);
    }

    if (!replyText || !replyText.trim()) {
      return sendError(res, 'AI Coach service returned an empty response. Please try again.', 503);
    }

    const quickButtons = getDynamicQuickButtons(problem, currentStepData);

    return sendSuccess(res, {
      reply: String(replyText).trim(),
      quickButtons
    }, 'Tutor reply generated');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/technical/dsa/problem/:problemId/trace
 * Custom input & target sandbox simulation runner
 * Validates input against constraints (max 20 elements) and returns deterministic step-by-step trace
 */
export const getDsaCustomTrace = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const { input, target } = req.body;

    if (!input || typeof input !== 'string' || !input.trim()) {
      return sendError(res, 'Valid input string is required', 400);
    }

    // Constraint: Limit input size to 20 elements for live animation
    const tokens = input.trim().split(/[\s,]+/);
    if (tokens.length > 20) {
      return sendError(res, 'Input exceeds maximum allowed 20 elements for animated visualizer', 400);
    }

    const problem = await FirestoreHelper.getDoc('dsa_problems', problemId);
    if (!problem) {
      return sendError(res, 'Problem not found', 404);
    }

    const { generateExecutionTrace } = await import('../services/traceGenerator.js');
    const trace = generateExecutionTrace(problem, input, target);

    return sendSuccess(res, {
      trace,
      totalSteps: trace.length,
      visualType: trace[0]?.visualType || 'array'
    }, 'Custom execution trace generated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/technical/dsa/problem/:problemId/ai-visualization
 * Fetches problem-specific visualizer data & beginner analogy.
 * Reads from dsa_visualizations or problem data.
 * If not generated yet, returns clean notGenerated flag (never borrowed text).
 */
export const getDsaAiVisualization = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const now = Date.now();

    // 1. Check in-memory cache
    const cached = dsaCache.visualizations.get(problemId);
    if (cached && now < cached.expiresAt) {
      return sendSuccess(res, { visualization: cached.data }, 'Visualization fetched from cache');
    }

    // 2. Check Firestore dsa_visualizations
    const stored = await FirestoreHelper.getDoc('dsa_visualizations', problemId);
    if (stored && (stored.story || (Array.isArray(stored.steps) && stored.steps.length > 0))) {
      dsaCache.visualizations.set(problemId, {
        data: stored,
        expiresAt: now + (24 * 60 * 60 * 1000)
      });
      return sendSuccess(res, { visualization: stored }, 'Visualization fetched from database');
    }

    // 3. Fall back to problem's own stored analogy & steps in dsa_problems
    const problem = await FirestoreHelper.getDoc('dsa_problems', problemId);
    if (!problem) {
      return sendError(res, 'Problem not found', 404);
    }

    if (problem.analogy && problem.analogy.story) {
      const synthesized = {
        problemId,
        topicId: problem.topicId,
        analogyTitle: problem.analogy.analogyTitle || `🧩 ${problem.title} Intuition`,
        story: problem.analogy.story,
        whyBruteForceFails: problem.analogy.whyBruteForceFails || 'Quadratic checks exceed time limit on large constraints.',
        ahaMoment: problem.analogy.ahaMoment || 'Maintain optimal invariant in a single pass.',
        interviewPitch: problem.analogy.interviewPitch || '',
        steps: Array.isArray(problem.steps) ? problem.steps : []
      };

      dsaCache.visualizations.set(problemId, {
        data: synthesized,
        expiresAt: now + (24 * 60 * 60 * 1000)
      });
      return sendSuccess(res, { visualization: synthesized }, 'Visualization loaded from problem record');
    }

    // 4. Return clean notGenerated state if neither is available
    return sendSuccess(res, {
      visualization: {
        notGenerated: true,
        problemId,
        problemTitle: problem.title,
        message: 'Beginner analogy and custom steps not yet generated for this problem.'
      }
    }, 'Visualization status check');
  } catch (err) {
    next(err);
  }
};

import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { db, isMockFirebase, memoryStore } from '../firebase/firebaseAdmin.js';
import { CodeRunnerService } from '../services/codeRunner.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { calculatePlacementReadiness } from '../utils/scoring.js';

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
  problemDetails: new Map() // problemId -> { data, expiresAt }
};
const DSA_CACHE_TTL = 5 * 60 * 1000;

export function invalidateDsaCache() {
  dsaCache.topics = { data: null, expiresAt: 0 };
  dsaCache.topicProblems.clear();
  dsaCache.problemDetails.clear();
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
export const askDsaTutorChat = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const { message, currentStepData = null } = req.body;

    if (!message || !message.trim()) {
      return sendError(res, 'Message is required', 400);
    }

    const problem = await FirestoreHelper.getDoc('dsa_problems', problemId);
    if (!problem) {
      return sendError(res, 'Problem not found', 404);
    }

    const systemInstruction = `You are Sarah, an expert friendly DSA teacher and Placement AI Coach.
Your goal is to explain algorithms so clearly and warmly that ANY non-coder or beginner student can instantly grasp it.
- Always use clear, everyday, intuitive real-world analogies (e.g. grocery shopping, mirrors, bus stops, game rules).
- Keep explanations structured, encouraging, concise (2-4 short paragraphs), and easy to read.
- If asked about custom inputs or targets:
  - If a target is NOT found or impossible, explain clearly WHY it cannot be formed, what the algorithm did, and why returning [] or 0 is safe and correct.
  - If a target IS found, explain the exact matching pair or optimal buy/sell days.
- When referencing code lines, explain what the line does in simple plain English without confusing jargon.

Problem Context:
Title: ${problem.title}
Difficulty: ${problem.difficulty}
Topic: ${problem.topicId}
Statement: ${problem.statement}
Constraints: ${JSON.stringify(problem.constraints || [])}
Approaches: ${JSON.stringify((problem.approaches || []).map(a => ({ name: a.name, idea: a.idea, time: a.timeComplexity, space: a.spaceComplexity })))}

${currentStepData ? `Current Visual Step Context: ${JSON.stringify(currentStepData)}` : ''}
`;

    let replyText = '';
    try {
      const { generateCompletion } = await import('../services/grokService.js');
      const response = await generateCompletion({
        systemPrompt: systemInstruction,
        userPrompt: `Student Question: "${message}"\n\nPlease answer as a friendly, warm teacher.`,
        temperature: 0.7,
        maxTokens: 800
      });
      replyText = typeof response === 'string' ? response : (response?.content || response?.message || '');
    } catch (aiErr) {
      console.warn('[askDsaTutorChat] AI engine notice, using heuristic pedagogical response:', aiErr.message);
      const qLower = message.toLowerCase();
      if (qLower.includes('not found') || qLower.includes('target') || qLower.includes('impossible')) {
        replyText = `Great question! When a target or solution cannot be found in the array, the algorithm checks every element according to its invariant. For example, if no two numbers sum to your target, the loop finishes cleanly and returns an empty list \`[]\` or \`-1\`. This ensures your program never crashes and gracefully informs the caller that no valid pair exists!`;
      } else if (qLower.includes('line') || qLower.includes('code') || qLower.includes('how')) {
        replyText = `Here is what this code does in simple terms: It inspects one element at a time from left to right. Instead of checking every pair twice (which is slow and takes O(N²)), it remembers what it has seen so far in memory. This lets it make an instant decision in O(1) time!`;
      } else if (qLower.includes('space') || qLower.includes('time') || qLower.includes('complexity')) {
        replyText = `Time Complexity measures how many operations we perform as the input grows. A single pass loop takes O(N) linear time (e.g., 100 items take ~100 operations). Space Complexity measures extra helper memory: if we only use 2 or 3 pointer variables, that is O(1) constant space (uses virtually zero extra RAM)!`;
      } else {
        replyText = `Think of this problem like a real-world task: rather than guessing randomly, the algorithm keeps track of the best decision so far. As it scans each element, it asks: "Does this element improve my best outcome?" If yes, it updates its record; if not, it keeps moving forward smoothly.`;
      }
    }

    return sendSuccess(res, { reply: String(replyText) }, 'Tutor reply generated');
  } catch (err) {
    next(err);
  }
};

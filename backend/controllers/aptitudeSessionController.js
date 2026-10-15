import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { GrokService } from '../services/grokService.js';
import { getStudentContext } from '../services/studentContext.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { calculatePlacementReadiness } from '../utils/scoring.js';
import { APTITUDE_CONFIG } from '../config/aptitudeConfig.js';
import { generateQuestionFingerprint } from '../utils/questionFingerprint.js';
import { AptitudeQuestionBank } from '../services/aptitudeQuestionBank.js';

/**
 * Normalizes stage input to one of: beginner, intermediate, advanced, mock-expert
 */
function normalizeStage(stage) {
  const s = String(stage || '').toLowerCase().trim();
  if (s.includes('inter')) return 'intermediate';
  if (s.includes('adv')) return 'advanced';
  if (s.includes('mock') || s.includes('expert')) return 'mock-expert';
  return 'beginner';
}

/**
 * Normalizes category input to Quantitative, Logical Reasoning, or Verbal Ability
 */
function normalizeCategory(category) {
  const c = String(category || '').toLowerCase().trim();
  if (c.includes('logic') || c.includes('reason')) return 'Logical Reasoning';
  if (c.includes('verb')) return 'Verbal Ability';
  return 'Quantitative';
}

/**
 * Starts a new secure Aptitude Test Session
 * POST /api/aptitude/start
 */
export const startTest = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return sendError(res, 'Authentication required to start a test', 401);
    }

    const category = normalizeCategory(req.body.category);
    const stage = normalizeStage(req.body.stage);
    let questionCount = Number(req.body.questionCount) || APTITUDE_CONFIG.DEFAULT_QUESTION_COUNT;
    if (!APTITUDE_CONFIG.ALLOWED_QUESTION_COUNTS.includes(questionCount)) {
      questionCount = APTITUDE_CONFIG.DEFAULT_QUESTION_COUNT;
    }

    // 1. Rate limiting check (e.g. max 15 test starts per hour per user)
    const oneHourAgo = new Date(Date.now() - 3600 * 1000).toISOString();
    const recentTests = await FirestoreHelper.queryCollection('aptitude_tests', 'userId', userId);
    const testsThisHour = recentTests.filter(t => t.createdAt >= oneHourAgo);
    if (testsThisHour.length >= APTITUDE_CONFIG.MAX_TESTS_PER_HOUR) {
      return sendError(res, 'Hourly test generation limit reached. Please complete existing tests or try again in an hour.', 429);
    }

    // 2. Question Deduplication: Query user's previously seen question fingerprints
    const historyDocs = await FirestoreHelper.queryCollection('aptitude_history', 'userId', userId);
    const existingFingerprints = new Set(historyDocs.map(h => h.questionFingerprint).filter(Boolean));
    const recentSnippets = historyDocs.slice(-30).map(h => h.questionText).filter(Boolean);

    // 3. Resolve topics and difficulty
    const topicsToCover = APTITUDE_CONFIG.TOPICS_BY_CATEGORY[category] || [];
    const stageObj = APTITUDE_CONFIG.STAGES.find(s => s.id === stage) || APTITUDE_CONFIG.STAGES[0];
    const difficulty = stageObj.difficulty;

    // 4. Fetch student context for personalization
    const studentContext = await getStudentContext(userId);

    // 5. Generate with Grok AI (with seamless fallback to AptitudeQuestionBank)
    let generatedQuestions = [];
    try {
      generatedQuestions = await GrokService.generateAptitudeQuestions({
        category,
        stage,
        difficulty,
        count: questionCount,
        studentContext,
        topicsToCover,
        recentQuestionsToAvoid: recentSnippets
      });
    } catch (aiErr) {
      console.warn('[Aptitude] AI generation unavailable, falling back to QuestionBank:', aiErr.message);
      generatedQuestions = AptitudeQuestionBank.getQuestions({
        category,
        count: questionCount,
        stage,
        excludeFingerprints: existingFingerprints
      });
    }

    // 6. Deduplicate against user history
    const uniqueQuestions = [];
    for (const q of generatedQuestions) {
      const fp = generateQuestionFingerprint(q.question);
      if (!existingFingerprints.has(fp)) {
        existingFingerprints.add(fp);
        uniqueQuestions.push({ ...q, fingerprint: fp });
      }
    }

    // If duplicates or short AI response dropped count below questionCount, top up instantly from QuestionBank
    if (uniqueQuestions.length < questionCount) {
      const deficit = questionCount - uniqueQuestions.length;
      console.log(`[Aptitude] Topping up ${deficit} question(s) from QuestionBank`);
      const bankQuestions = AptitudeQuestionBank.getQuestions({
        category,
        count: deficit,
        stage,
        excludeFingerprints: existingFingerprints
      });
      for (const bq of bankQuestions) {
        existingFingerprints.add(bq.fingerprint);
        uniqueQuestions.push(bq);
        if (uniqueQuestions.length >= questionCount) break;
      }
    }

    let finalQuestions = uniqueQuestions.slice(0, questionCount);
    // Guarantee that finalQuestions has at least questionCount questions
    if (finalQuestions.length < questionCount) {
      const emergency = AptitudeQuestionBank.getQuestions({
        category,
        count: questionCount - finalQuestions.length,
        stage
      });
      finalQuestions = [...finalQuestions, ...emergency].slice(0, questionCount);
    }

    // 7. Calculate timer and expiry
    const timeLimitSeconds = finalQuestions.length * APTITUDE_CONFIG.SECONDS_PER_QUESTION;
    const now = Date.now();
    const startedAt = new Date(now).toISOString();
    const expiresAt = new Date(now + timeLimitSeconds * 1000).toISOString();
    const testId = `test_apt_${userId}_${now}`;

    // 8. Store FULL test document server-side in `aptitude_tests`
    const testDoc = {
      testId,
      userId,
      category,
      stage,
      status: 'in_progress',
      startedAt,
      expiresAt,
      timeLimitSeconds,
      totalQuestions: finalQuestions.length,
      questions: finalQuestions, // Contains correctIndex & explanation SERVER-SIDE ONLY
      createdAt: startedAt
    };
    await FirestoreHelper.setDoc('aptitude_tests', testId, testDoc);

    // 9. Record fingerprints in `aptitude_history` to prevent repeats in future
    for (const fq of finalQuestions) {
      const histId = `hist_${userId}_${fq.fingerprint}`;
      await FirestoreHelper.setDoc('aptitude_history', histId, {
        userId,
        questionFingerprint: fq.fingerprint,
        questionText: fq.question.slice(0, 120),
        category,
        topic: fq.topic,
        askedAt: startedAt
      });
    }

    // 10. Return client-safe questions payload (NO correctIndex, NO explanation)
    const clientQuestions = finalQuestions.map((q, idx) => ({
      index: idx,
      id: q.questionId,
      question: q.question,
      options: q.options,
      topic: q.topic,
      difficulty: q.difficulty
    }));

    return sendSuccess(res, {
      testId,
      category,
      stage,
      totalQuestions: finalQuestions.length,
      timeLimitSeconds,
      startedAt,
      expiresAt,
      questions: clientQuestions
    }, 'Aptitude test started successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Checks for currently active in_progress test (for page refresh mid-test)
 * GET /api/aptitude/active
 */
export const getActiveTest = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const allTests = await FirestoreHelper.queryCollection('aptitude_tests', 'userId', userId);
    
    // Find latest in_progress test
    const active = allTests
      .filter(t => t.status === 'in_progress')
      .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))[0];

    if (!active) {
      return sendSuccess(res, null, 'No active test found');
    }

    const expiryTime = new Date(active.expiresAt).getTime();
    if (Date.now() > expiryTime + APTITUDE_CONFIG.SUBMIT_GRACE_PERIOD_SECONDS * 1000) {
      // Test has expired
      await FirestoreHelper.setDoc('aptitude_tests', active.testId, { status: 'expired' }, true);
      return sendSuccess(res, null, 'Previous test expired');
    }

    const clientQuestions = active.questions.map((q, idx) => ({
      index: idx,
      id: q.questionId,
      question: q.question,
      options: q.options,
      topic: q.topic,
      difficulty: q.difficulty
    }));

    return sendSuccess(res, {
      testId: active.testId,
      category: active.category,
      stage: active.stage,
      totalQuestions: active.totalQuestions,
      timeLimitSeconds: active.timeLimitSeconds,
      startedAt: active.startedAt,
      expiresAt: active.expiresAt,
      questions: clientQuestions
    }, 'Active test retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Abandons an active test (Quit Test)
 * POST /api/aptitude/abandon
 */
export const abandonTest = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { testId } = req.body;
    if (!testId) {
      return sendError(res, 'testId is required', 400);
    }

    const testDoc = await FirestoreHelper.getDoc('aptitude_tests', testId);
    if (!testDoc || testDoc.userId !== userId) {
      return sendError(res, 'Test session not found', 404);
    }

    if (testDoc.status === 'in_progress') {
      await FirestoreHelper.setDoc('aptitude_tests', testId, {
        status: 'abandoned',
        abandonedAt: new Date().toISOString()
      }, true);
    }

    return sendSuccess(res, { abandoned: true }, 'Test abandoned');
  } catch (err) {
    next(err);
  }
};

/**
 * Grades and submits an Aptitude Test (Server-Side Grading Only)
 * POST /api/aptitude/submit
 */
export const submitTest = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { testId, answers = {} } = req.body;

    if (!testId) {
      return sendError(res, 'testId is required to submit test', 400);
    }

    const testDoc = await FirestoreHelper.getDoc('aptitude_tests', testId);
    if (!testDoc) {
      return sendError(res, 'Test not found or session has expired', 404);
    }

    // IDOR verification
    if (testDoc.userId !== userId) {
      return sendError(res, 'Access denied: You can only submit your own test', 403);
    }

    // Prevent double submission / replay
    if (testDoc.status === 'submitted') {
      // If already submitted, return the saved result without double-awarding XP
      const existingMock = await FirestoreHelper.getDoc('mock_tests', testId);
      if (existingMock) {
        return sendSuccess(res, existingMock, 'Test was already submitted');
      }
      return sendError(res, 'This test has already been submitted', 400);
    }

    const questions = testDoc.questions || [];
    const totalQuestions = questions.length;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let unanswered = 0;

    const topicStats = {};

    const perQuestionResults = questions.map((q, idx) => {
      const topic = q.topic || 'General Aptitude';
      if (!topicStats[topic]) {
        topicStats[topic] = { total: 0, correct: 0, wrong: 0, unanswered: 0 };
      }
      topicStats[topic].total++;

      // User's answer can be keyed by question index (0..N) or by questionId
      let userChoice = answers[idx];
      if (userChoice === undefined && q.questionId) {
        userChoice = answers[q.questionId];
      }

      // Resolve user's option index (0..3)
      let selectedOptionIndex = null;
      if (typeof userChoice === 'number' && userChoice >= 0 && userChoice <= 3) {
        selectedOptionIndex = userChoice;
      } else if (typeof userChoice === 'string') {
        const found = q.options.findIndex(o => o.trim().toLowerCase() === userChoice.trim().toLowerCase());
        if (found !== -1) selectedOptionIndex = found;
      }

      const isUnanswered = selectedOptionIndex === null || selectedOptionIndex === undefined;
      const isCorrect = !isUnanswered && selectedOptionIndex === q.correctIndex;

      if (isUnanswered) {
        unanswered++;
        topicStats[topic].unanswered++;
      } else if (isCorrect) {
        correctAnswers++;
        topicStats[topic].correct++;
      } else {
        wrongAnswers++;
        topicStats[topic].wrong++;
      }

      return {
        questionIndex: idx + 1,
        questionId: q.questionId,
        question: q.question,
        topic,
        difficulty: q.difficulty,
        options: q.options,
        selectedOptionIndex,
        selectedOption: selectedOptionIndex !== null ? q.options[selectedOptionIndex] : null,
        correctOptionIndex: q.correctIndex,
        correctOption: q.options[q.correctIndex],
        isCorrect,
        isUnanswered,
        explanation: q.explanation || 'Step-by-step solution provided.'
      };
    });

    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    const passed = accuracy >= APTITUDE_CONFIG.PASS_PERCENTAGE;
    const xpGained = (correctAnswers * APTITUDE_CONFIG.XP_PER_CORRECT) + (passed ? APTITUDE_CONFIG.XP_PASS_BONUS : 0);

    // Topic breakdown calculation
    const topicBreakdown = Object.keys(topicStats).map(t => {
      const s = topicStats[t];
      const acc = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
      return {
        topic: t,
        total: s.total,
        correct: s.correct,
        wrong: s.wrong,
        unanswered: s.unanswered,
        accuracy: acc
      };
    });

    // Identify weakest topic (lowest accuracy with at least 1 question)
    let weakestTopic = 'None';
    if (topicBreakdown.length > 0) {
      const sortedByAcc = [...topicBreakdown].sort((a, b) => a.accuracy - b.accuracy);
      if (sortedByAcc[0].accuracy < 100) {
        weakestTopic = sortedByAcc[0].topic;
      }
    }

    const completedAt = new Date().toISOString();
    const timeTakenSeconds = Math.max(0, Math.round((new Date(completedAt).getTime() - new Date(testDoc.startedAt).getTime()) / 1000));

    // Construct full result document
    const resultDoc = {
      testId,
      userId,
      category: testDoc.category,
      stage: testDoc.stage,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      unanswered,
      accuracy,
      score: accuracy,
      passed,
      passThreshold: APTITUDE_CONFIG.PASS_PERCENTAGE,
      xpGained,
      timeTakenSeconds,
      topicBreakdown,
      weakestTopic,
      perQuestionResults,
      completedAt
    };

    // 1. Mark test session as submitted
    await FirestoreHelper.setDoc('aptitude_tests', testId, {
      status: 'submitted',
      submittedAt: completedAt,
      accuracy,
      passed
    }, true);

    // 2. Save in official `mock_tests` collection (defined in firestore.rules)
    await FirestoreHelper.setDoc('mock_tests', testId, resultDoc);

    // 3. Save additive record in `aptitude_attempts` for legacy compatibility
    await FirestoreHelper.setDoc('aptitude_attempts', testId, {
      testId,
      userId,
      category: testDoc.category,
      stage: testDoc.stage,
      score: accuracy,
      correctCount: correctAnswers,
      totalQuestions,
      passed,
      userAnswers: answers,
      completedAt
    });

    // 4. Update User Placement Readiness & Stage Progression
    const readiness = (await FirestoreHelper.getDoc('placement_readiness', 'readiness_' + userId)) || {};
    const testsCompleted = (readiness.testsCompleted || 0) + 1;
    const testsPassed = (readiness.testsPassed || 0) + (passed ? 1 : 0);

    // Stage progression map (unlocks stages only when test is passed)
    const stagesPassed = readiness.stagesPassed || {
      beginner: false,
      intermediate: false,
      advanced: false,
      'mock-expert': false
    };
    if (passed && testDoc.stage) {
      stagesPassed[testDoc.stage] = true;
    }

    // Recompute Aptitude Score as average of user's submitted tests (last 5 tests)
    const userTests = await FirestoreHelper.queryCollection('mock_tests', 'userId', userId);
    const validScores = [...userTests.map(t => t.accuracy || t.score), accuracy].filter(s => typeof s === 'number');
    const recentScores = validScores.slice(-5);
    const newAptitudeScore = recentScores.length > 0
      ? Math.round(recentScores.reduce((a, b) => a + b, 0) / recentScores.length)
      : accuracy;

    const updatedStats = {
      ...readiness,
      aptitudeScore: newAptitudeScore,
      testsCompleted,
      testsPassed,
      stagesPassed
    };
    updatedStats.overallReadiness = calculatePlacementReadiness(updatedStats);
    await FirestoreHelper.setDoc('placement_readiness', 'readiness_' + userId, updatedStats);

    // 5. Add to User Activity Feed
    const activityId = `act_apt_${userId}_${Date.now()}`;
    await FirestoreHelper.setDoc('activities', activityId, {
      userId,
      activityType: 'Aptitude Test',
      description: `${passed ? 'Passed' : 'Completed'} ${testDoc.category} (${accuracy}%)`,
      score: accuracy,
      createdAt: completedAt
    });

    return sendSuccess(res, {
      ...resultDoc,
      updatedStats
    }, 'Aptitude test graded and submitted successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Returns comprehensive student aptitude stats & real roadmap progress
 * GET /api/aptitude/stats
 */
export const getAptitudeStats = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const readiness = (await FirestoreHelper.getDoc('placement_readiness', 'readiness_' + userId)) || {};
    
    // Fetch user's submitted tests from mock_tests to compute verified progress
    const submittedTests = await FirestoreHelper.queryCollection('mock_tests', 'userId', userId);
    
    // Check which stages have been passed
    const passedStages = new Set();
    submittedTests.forEach(t => {
      if (t.passed === true || (typeof t.accuracy === 'number' && t.accuracy >= APTITUDE_CONFIG.PASS_PERCENTAGE)) {
        if (t.stage) passedStages.add(t.stage);
      }
    });

    // Determine current unlocked stage
    let currentStage = 'beginner';
    if (passedStages.has('beginner')) currentStage = 'intermediate';
    if (passedStages.has('intermediate')) currentStage = 'advanced';
    if (passedStages.has('advanced')) currentStage = 'mock-expert';

    return sendSuccess(res, {
      aptitudeScore: readiness.aptitudeScore || 0,
      testsCompleted: submittedTests.length,
      testsPassed: submittedTests.filter(t => t.passed === true).length,
      passedStages: Array.from(passedStages),
      currentStage,
      passThreshold: APTITUDE_CONFIG.PASS_PERCENTAGE
    }, 'Aptitude stats retrieved');
  } catch (err) {
    next(err);
  }
};

import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { db, isMockFirebase } from '../firebase/firebaseAdmin.js';
import { CodeRunnerService, normalizeOutput } from '../services/codeRunner.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { calculatePlacementReadiness } from '../utils/scoring.js';

// Timer allocations in minutes by problem difficulty
const DIFFICULTY_MINUTES = {
  Easy: 15,
  Medium: 25,
  Hard: 35
};

/**
 * Heuristic approach analyzer for submitted DSA code
 * Evaluates approach complexity (Optimal vs Better vs Brute Force) and code quality
 */
function analyzeCodeApproach(code, language, difficulty) {
  const codeStr = String(code || '').toLowerCase();
  let approachScore = 15; // default moderate
  let detectedApproach = 'Standard Iterative Approach';
  let complexityEstimate = 'O(N)';
  let feedback = 'Solution logic executes correctly.';

  // Hash Map / Set detection
  if (/hashmap|hashset|dict\(|\bset\(|\bmap\b|\{\}|unordered_map|unordered_set/i.test(codeStr)) {
    approachScore = 25;
    detectedApproach = 'Optimal: Hash Table / Set (O(1) amortized lookup)';
    complexityEstimate = 'O(N) Time, O(N) Space';
    feedback = 'Excellent use of Hash Table to eliminate quadratic search bottlenecks.';
  }
  // Two Pointers / Binary Search detection
  else if (/while\s*\(?.*<\s*.*|left\s*<=?\s*right|low\s*<=?\s*high|mid\s*=|l\s*<\s*r/i.test(codeStr)) {
    approachScore = 25;
    detectedApproach = 'Optimal: Two Pointers / Binary Search';
    complexityEstimate = difficulty === 'Easy' ? 'O(N) Time, O(1) Space' : 'O(log N) Time, O(1) Space';
    feedback = 'Optimal pointer manipulation minimizing auxiliary space allocation.';
  }
  // Nested Loop / Brute Force detection
  else if (/for[\s\S]+?for|while[\s\S]+?while/i.test(codeStr)) {
    approachScore = 12;
    detectedApproach = 'Brute Force: Nested Loops';
    complexityEstimate = 'O(N^2) Time, O(1) Space';
    feedback = 'Nested loops detected. For campus placements, aim to optimize with Hashing or Two Pointers.';
  }
  // Kadane's / Greedy detection
  else if (/max_sum|cur_sum|min_price|max_profit/i.test(codeStr)) {
    approachScore = 25;
    detectedApproach = 'Optimal: Single-Pass Greedy / Kadane Pattern';
    complexityEstimate = 'O(N) Time, O(1) Space';
    feedback = 'Clean single pass greedy optimization.';
  }

  return {
    approachScore,
    detectedApproach,
    complexityEstimate,
    feedback
  };
}

/**
 * GET /api/technical/dsa/topic/:topicId/test
 * Prepares a 3-question comprehensive assessment for the topic with a dynamic countdown timer
 */
export const getTopicTest = async (req, res, next) => {
  try {
    const { topicId } = req.params;
    const userId = req.user?.userId;

    const [topic, allProblems, userStatusList, existingBadge] = await Promise.all([
      FirestoreHelper.getDoc('dsa_topics', topicId),
      FirestoreHelper.queryCollection('dsa_problems', 'topicId', topicId),
      userId ? FirestoreHelper.queryCollection('dsa_problem_status', 'userId', userId) : Promise.resolve([]),
      userId ? FirestoreHelper.getDoc('dsa_topic_badges', `${userId}_${topicId}`) : Promise.resolve(null)
    ]);

    if (!topic) {
      return sendError(res, `Topic "${topicId}" not found`, 404);
    }

    const approvedProblems = allProblems.filter(p => p.status === 'approved');
    if (approvedProblems.length === 0) {
      return sendError(res, 'No questions currently available for this topic assessment', 400);
    }

    // Partition problems by difficulty
    const easyPool = approvedProblems.filter(p => p.difficulty === 'Easy');
    const medPool = approvedProblems.filter(p => p.difficulty === 'Medium');
    const hardPool = approvedProblems.filter(p => p.difficulty === 'Hard');

    // Select 3 problems: 1 Easy, 1 Medium, 1 Hard (or 2 Medium if Hard unavailable)
    const selected = [];
    if (easyPool.length > 0) selected.push(easyPool[0]);
    if (medPool.length > 0) selected.push(medPool[0]);
    if (hardPool.length > 0) selected.push(hardPool[0]);
    else if (medPool.length > 1) selected.push(medPool[1]);
    else if (easyPool.length > 1) selected.push(easyPool[1]);

    // Calculate dynamic time limit in minutes based on selected problem difficulties
    let totalMinutes = 0;
    selected.forEach(p => {
      totalMinutes += DIFFICULTY_MINUTES[p.difficulty] || 25;
    });

    // Strip hidden test cases from client payload
    const testQuestions = selected.map((p, idx) => {
      const { hiddenTestCases: _, approaches: __, hints: ___, ...clientP } = p;
      return {
        ...clientP,
        questionIndex: idx + 1,
        timeAllocationMinutes: DIFFICULTY_MINUTES[p.difficulty] || 25
      };
    });

    const testId = `test_${topicId}_${Date.now()}`;

    return sendSuccess(res, {
      testId,
      topicId,
      topicTitle: topic.title,
      questions: testQuestions,
      totalQuestions: testQuestions.length,
      durationMinutes: totalMinutes,
      durationSeconds: totalMinutes * 60,
      passingThresholdPercent: 80,
      hasStarBadge: Boolean(existingBadge?.hasStarBadge),
      previousBestScore: existingBadge?.bestScore || 0
    }, 'Topic assessment initialized');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/technical/dsa/topic/:topicId/test/submit
 * Submits the topic assessment answers.
 * Evaluates each answer against 20 test cases, analyzes code approach, computes score out of 100,
 * and awards a Star Badge if score >= 80%.
 */
export const submitTopicTest = async (req, res, next) => {
  try {
    const { topicId } = req.params;
    const userId = req.user?.userId;
    const { answers = [], durationSpentSeconds = 0 } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return sendError(res, 'No answers submitted for evaluation', 400);
    }

    const topic = await FirestoreHelper.getDoc('dsa_topics', topicId);
    let totalQuestionPoints = 0;
    const maxQuestionPoints = answers.length * 100;
    const evaluationBreakdown = [];

    // Evaluate each submitted code against all test cases
    for (let i = 0; i < answers.length; i++) {
      const ans = answers[i];
      const problem = await FirestoreHelper.getDoc('dsa_problems', ans.problemId);

      if (!problem) {
        evaluationBreakdown.push({
          questionIndex: i + 1,
          problemId: ans.problemId,
          title: 'Problem',
          testsPassed: 0,
          totalTests: 20,
          score: 0,
          verdict: 'Error: Problem not found'
        });
        continue;
      }

      // 1. Run all visible and hidden test cases (approx 20 test cases total)
      const visible = problem.testCases || [];
      const hidden = problem.hiddenTestCases || [];
      const totalTestsCount = visible.length + hidden.length;

      let execResult;
      if (!ans.code || !String(ans.code).trim()) {
        execResult = {
          verdict: 'Unattempted',
          testsPassed: 0,
          totalTests: totalTestsCount || 20,
          time: '0ms'
        };
      } else {
        execResult = await CodeRunnerService.submit({
          language: ans.language || 'python',
          code: ans.code,
          visibleTestCases: visible,
          hiddenTestCases: hidden,
          timeLimit: problem.timeLimit || 2000
        });
      }

      // 2. Multi-Criteria Scoring (Out of 100 per question):
      // - Test Cases Passed: 60 points max
      // - Approach & Algorithmic Efficiency: 25 points max
      // - Code Quality & Completion: 15 points max
      const testsRatio = totalTestsCount > 0 ? (execResult.testsPassed / totalTestsCount) : 0;
      const testCasesScore = Math.round(testsRatio * 60);

      // Analyze approach
      const approachAnalysis = analyzeCodeApproach(ans.code, ans.language, problem.difficulty);
      const approachScore = execResult.testsPassed > 0 ? approachAnalysis.approachScore : 0;

      // Quality score
      const qualityScore = execResult.verdict === 'Accepted' ? 15 : (testsRatio > 0.5 ? 10 : 5);

      const questionTotalScore = testCasesScore + approachScore + qualityScore;
      totalQuestionPoints += questionTotalScore;

      evaluationBreakdown.push({
        questionIndex: i + 1,
        problemId: problem.problemId,
        title: problem.title,
        difficulty: problem.difficulty,
        language: ans.language || 'python',
        code: ans.code || '',
        verdict: execResult.verdict,
        testsPassed: execResult.testsPassed,
        totalTests: totalTestsCount || 20,
        testCasesScore,
        approachScore,
        qualityScore,
        totalScore: questionTotalScore,
        detectedApproach: approachAnalysis.detectedApproach,
        complexityEstimate: approachAnalysis.complexityEstimate,
        feedback: approachAnalysis.feedback
      });
    }

    // Overall Percentage Score (0 - 100%)
    const overallPercentage = Math.round((totalQuestionPoints / maxQuestionPoints) * 100);
    const hasPassed = overallPercentage >= 80;
    const badgeKey = `${userId}_${topicId}`;
    const reportId = `report_${userId}_${topicId}_${Date.now()}`;
    const nowIso = new Date().toISOString();

    // Star Badge record
    let awardedNewBadge = false;
    const existingBadge = await FirestoreHelper.getDoc('dsa_topic_badges', badgeKey);

    if (hasPassed) {
      if (!existingBadge?.hasStarBadge) {
        awardedNewBadge = true;
      }
      await FirestoreHelper.setDoc('dsa_topic_badges', badgeKey, {
        badgeId: badgeKey,
        userId,
        topicId,
        topicTitle: topic?.title || topicId,
        hasStarBadge: true,
        bestScore: Math.max(overallPercentage, existingBadge?.bestScore || 0),
        earnedAt: existingBadge?.earnedAt || nowIso,
        lastTestAt: nowIso
      }, true);
    } else {
      await FirestoreHelper.setDoc('dsa_topic_badges', badgeKey, {
        badgeId: badgeKey,
        userId,
        topicId,
        topicTitle: topic?.title || topicId,
        hasStarBadge: existingBadge?.hasStarBadge || false,
        bestScore: Math.max(overallPercentage, existingBadge?.bestScore || 0),
        lastTestAt: nowIso
      }, true);
    }

    // Comprehensive Test Report Document
    const testReport = {
      reportId,
      userId,
      topicId,
      topicTitle: topic?.title || topicId,
      overallScore: overallPercentage,
      hasPassed,
      hasStarBadge: hasPassed || Boolean(existingBadge?.hasStarBadge),
      awardedNewBadge,
      passingThresholdPercent: 80,
      durationSpentSeconds,
      evaluationBreakdown,
      overallRecommendations: hasPassed
        ? `Superb performance! You demonstrated mastery in ${topic?.title || topicId} with an impressive score of ${overallPercentage}%. You are ready for campus placement rounds covering this topic!`
        : `Good effort! You scored ${overallPercentage}%. Review optimal approaches with O(1) auxiliary space or two-pointer logic and retake the test to earn the ⭐ Mastery Star.`,
      submittedAt: nowIso
    };

    await FirestoreHelper.setDoc('dsa_test_reports', reportId, testReport, true);

    // Update Placement Readiness technical score if test passed
    if (hasPassed) {
      try {
        const readiness = (await FirestoreHelper.getDoc('placement_readiness', 'readiness_' + userId)) || {};
        const prevTech = typeof readiness.technicalScore === 'number' ? readiness.technicalScore : 0;
        const updatedTech = Math.min(100, Math.max(prevTech, overallPercentage));
        const updatedStats = { ...readiness, technicalScore: updatedTech };
        updatedStats.overallReadiness = calculatePlacementReadiness(updatedStats);
        await FirestoreHelper.setDoc('placement_readiness', 'readiness_' + userId, updatedStats, true);
      } catch (scoreErr) {
        console.warn('[submitTopicTest] Placement readiness notice:', scoreErr.message);
      }
    }

    return sendSuccess(res, { report: testReport }, 'Assessment evaluated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/technical/dsa/topic/:topicId/test/reports
 * Returns past test reports for the topic
 */
export const getTopicTestReports = async (req, res, next) => {
  try {
    const { topicId } = req.params;
    const userId = req.user.userId;

    const allReports = await FirestoreHelper.queryCollection('dsa_test_reports', 'userId', userId);
    const topicReports = allReports
      .filter(r => r.topicId === topicId)
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    return sendSuccess(res, { reports: topicReports }, 'Topic test reports retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/technical/dsa/badges
 * Returns all earned topic badges and stars for current student
 */
export const getUserTopicBadges = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const badges = await FirestoreHelper.queryCollection('dsa_topic_badges', 'userId', userId);
    return sendSuccess(res, { badges }, 'Topic badges retrieved');
  } catch (err) {
    next(err);
  }
};

import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { GrokService } from '../services/grokService.js';
import { getStudentContext } from '../services/studentContext.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { calculatePlacementReadiness } from '../utils/scoring.js';

const ROUND_PASS_THRESHOLD = 60; // avg score >= 60 to clear a round
const ROUND_MIN_ANSWERS = 2;     // must answer at least 2 questions to be eligible for clearance

/**
 * Compute per-round progress for a user from their hr_interviews records.
 * Returns { [round]: { answered, totalScore, avgScore, cleared } }
 */
async function getRoundProgress(userId) {
  const allInterviews = await FirestoreHelper.queryCollection('hr_interviews', 'userId', userId);
  const roundMap = {};
  for (const iv of allInterviews) {
    const r = iv.round || 1;
    if (!roundMap[r]) roundMap[r] = { answered: 0, totalScore: 0, avgScore: 0, cleared: false };
    roundMap[r].answered++;
    roundMap[r].totalScore += iv.score || 0;
  }
  for (const r of Object.keys(roundMap)) {
    const rm = roundMap[r];
    rm.avgScore = rm.answered > 0 ? Math.round(rm.totalScore / rm.answered) : 0;
    rm.cleared = rm.answered >= ROUND_MIN_ANSWERS && rm.avgScore >= ROUND_PASS_THRESHOLD;
  }
  return roundMap;
}

export const getHRQuestions = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const round = req.query.round ? Number(req.query.round) : 1;
    const forceGenerate = req.query.generate === 'true';

    // Round gating: round > 1 requires previous round to be cleared
    if (round > 1) {
      const progress = await getRoundProgress(userId);
      const prevRound = round - 1;
      const prevStatus = progress[prevRound];
      if (!prevStatus || !prevStatus.cleared) {
        return sendError(res, `Round ${prevRound} must be cleared first. Answer at least ${ROUND_MIN_ANSWERS} questions with an average score of ${ROUND_PASS_THRESHOLD}% or above.`, 403);
      }
    }

    const studentContext = await getStudentContext(userId);

    // Fetch last 3 previous answers from this round to build context for follow-up questions
    const allInterviews = await FirestoreHelper.queryCollection('hr_interviews', 'userId', userId);
    const roundInterviews = allInterviews
      .filter(iv => iv.round === round)
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, 3);

    const previousContext = roundInterviews.map(iv => ({
      question: iv.questionTitle,
      answer: iv.userResponse,
      score: iv.score
    }));

    const profile = await FirestoreHelper.getDoc('profiles', 'prof_' + userId) || {};
    const userDoc = await FirestoreHelper.getDoc('users', userId) || {};
    const resumes = await FirestoreHelper.queryCollection('resumes', 'userId', userId);
    const latestResume = resumes[resumes.length - 1] || {};

    const effectiveRole = req.query.role || profile.targetRole || profile.role || userDoc.targetRole || userDoc.role || studentContext.targetRole || latestResume.role || '';

    let questions = [];

    if (!forceGenerate) {
      // Query questions specifically belonging to this user
      const userQuestions = await FirestoreHelper.queryCollection('hr_questions', 'userId', userId);
      const matching = userQuestions.filter(q => 
        q.round === round &&
        (!effectiveRole || !q.targetRole || q.targetRole.toLowerCase() === effectiveRole.toLowerCase())
      );
      if (matching.length >= 2) {
        questions = matching.slice(0, 4);
      }
    }

    if (questions.length === 0 || forceGenerate) {
      const userContext = {
        role: effectiveRole,
        skills: profile.skills || latestResume.skills || studentContext.skills || ['Problem Solving'],
        projects: profile.projects || latestResume.projects || [{ title: 'Academic Project' }],
        interests: profile.interests || ['Technology']
      };

      questions = await GrokService.generateHRQuestions(userContext, studentContext, round, previousContext);

      for (const q of questions) {
        const questionDoc = {
          ...q,
          userId,
          targetRole: effectiveRole,
          round,
          createdAt: new Date().toISOString()
        };
        await FirestoreHelper.setDoc('hr_questions', q.id, questionDoc);
      }
    }

    return sendSuccess(res, { round, questions }, `Round ${round} questions fetched`);
  } catch (err) {
    next(err);
  }
};

export const evaluateHRAnswer = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { questionId, questionTitle, userResponse, round = 1 } = req.body;

    if (!userResponse || userResponse.trim().length === 0) {
      return sendError(res, 'Answer cannot be empty', 400);
    }

    const studentContext = await getStudentContext(userId);
    const evaluation = await GrokService.evaluateHRAnswer(questionTitle || 'HR Question', userResponse, studentContext);

    const interviewId = 'hr_int_' + userId + '_' + Date.now();
    const interviewData = {
      interviewId,
      userId,
      round,
      questionId,
      questionTitle,
      userResponse,
      score: evaluation.overallScore,
      evaluateScores: evaluation.scores,
      feedback: evaluation.feedback,
      completedAt: new Date().toISOString()
    };

    await FirestoreHelper.setDoc('hr_interviews', interviewId, interviewData);

    // Recompute round progress after saving
    const progress = await getRoundProgress(userId);
    const roundStatus = progress[round] || { answered: 0, avgScore: 0, cleared: false };

    // Update Placement Readiness
    const readiness = await FirestoreHelper.getDoc('placement_readiness', 'readiness_' + userId) || {};
    const mockInterviews = (readiness.mockInterviews || 0) + 1;
    const prevHr = typeof readiness.hrScore === 'number' ? readiness.hrScore : null;
    const newHrScore = prevHr !== null
      ? Math.round((prevHr * (mockInterviews - 1) + evaluation.overallScore) / mockInterviews)
      : evaluation.overallScore;

    const updatedStats = { ...readiness, hrScore: newHrScore, mockInterviews };
    updatedStats.overallReadiness = calculatePlacementReadiness(updatedStats);
    await FirestoreHelper.setDoc('placement_readiness', 'readiness_' + userId, updatedStats);

    return sendSuccess(res, {
      interviewId,
      evaluation,
      roundStatus,
      updatedStats
    }, 'HR answer evaluated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/hr/history
 * Returns all HR interview records for the user, grouped by round.
 */
export const getHRHistory = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const allInterviews = await FirestoreHelper.queryCollection('hr_interviews', 'userId', userId);
    allInterviews.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

    // Group by round
    const byRound = {};
    for (const iv of allInterviews) {
      const r = iv.round || 1;
      if (!byRound[r]) byRound[r] = [];
      byRound[r].push({
        interviewId: iv.interviewId,
        round: r,
        questionTitle: iv.questionTitle,
        userResponse: iv.userResponse,
        score: iv.score,
        scores: iv.evaluateScores || {},
        feedback: iv.feedback,
        completedAt: iv.completedAt
      });
    }

    const progress = await getRoundProgress(userId);

    return sendSuccess(res, { byRound, progress }, 'HR interview history retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/hr/progress
 * Returns which rounds are cleared and current round status.
 */
export const getHRProgress = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const progress = await getRoundProgress(userId);
    return sendSuccess(res, { progress, passThreshold: ROUND_PASS_THRESHOLD, minAnswers: ROUND_MIN_ANSWERS }, 'HR round progress retrieved');
  } catch (err) {
    next(err);
  }
};

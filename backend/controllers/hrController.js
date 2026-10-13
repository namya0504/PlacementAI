import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { GrokService } from '../services/grokService.js';
import { getStudentContext } from '../services/studentContext.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { calculatePlacementReadiness } from '../utils/scoring.js';

export const getHRQuestions = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const round = req.query.round ? Number(req.query.round) : 1;
    const studentContext = await getStudentContext(userId);

    let questions = [];

    // Check if we should generate fresh questions via Grok
    const forceGenerate = req.query.generate === 'true';

    if (!forceGenerate && round === 1) {
      const allQuestions = await FirestoreHelper.queryCollection('hr_questions');
      if (allQuestions && allQuestions.length > 0) {
        const shuffled = allQuestions.sort(() => 0.5 - Math.random());
        questions = shuffled.slice(0, 4);
      }
    }

    if (questions.length === 0 || forceGenerate) {
      const profile = await FirestoreHelper.getDoc('profiles', 'prof_' + userId) || {};
      const resumes = await FirestoreHelper.queryCollection('resumes', 'userId', userId);
      const latestResume = resumes[resumes.length - 1] || {};

      const userContext = {
        role: req.query.role || profile.role || profile.targetRole || latestResume.role || studentContext.targetRole || '',
        skills: profile.skills || latestResume.skills || studentContext.skills || ['Problem Solving'],
        projects: profile.projects || latestResume.projects || [{ title: 'Academic Project' }],
        interests: profile.interests || ['Technology']
      };

      questions = await GrokService.generateHRQuestions(userContext, studentContext);

      // Save to hr_questions for persistence
      for (const q of questions) {
        await FirestoreHelper.setDoc('hr_questions', q.id, q);
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

    // Update Placement Readiness without hardcoded 80 fallback
    const readiness = await FirestoreHelper.getDoc('placement_readiness', 'readiness_' + userId) || {};
    const mockInterviews = (readiness.mockInterviews || 0) + 1;
    
    const prevHr = typeof readiness.hrScore === 'number' ? readiness.hrScore : null;
    const newHrScore = prevHr !== null
      ? Math.round((prevHr * (mockInterviews - 1) + evaluation.overallScore) / mockInterviews)
      : evaluation.overallScore;

    const updatedStats = {
      ...readiness,
      hrScore: newHrScore,
      mockInterviews
    };
    updatedStats.overallReadiness = calculatePlacementReadiness(updatedStats);

    await FirestoreHelper.setDoc('placement_readiness', 'readiness_' + userId, updatedStats);

    return sendSuccess(res, {
      interviewId,
      evaluation,
      updatedStats
    }, 'HR answer evaluated successfully');
  } catch (err) {
    next(err);
  }
};

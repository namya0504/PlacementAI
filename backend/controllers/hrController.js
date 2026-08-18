import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { GeminiService } from '../services/geminiService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { calculatePlacementReadiness } from '../utils/scoring.js';

export const getHRQuestions = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const round = req.query.round ? Number(req.query.round) : 1;

    let aiQuestions = [];

    if (round === 1) {
      const allQuestions = await FirestoreHelper.queryCollection('hr_questions');
      if (allQuestions && allQuestions.length > 0) {
        const shuffled = allQuestions.sort(() => 0.5 - Math.random());
        aiQuestions = shuffled.slice(0, 4);
      }
    }

    if (aiQuestions.length === 0) {
      // Round 2+ or fallback: Fetch user profile, skills, projects to generate dynamic AI questions using Gemini
      const profile = await FirestoreHelper.getDoc('profiles', 'prof_' + userId) || {};
      const resumes = await FirestoreHelper.queryCollection('resumes', 'userId', userId);
      const latestResume = resumes[resumes.length - 1] || {};

      const userContext = {
        role: req.query.role || profile.role || latestResume.role || 'Software Developer',
        skills: profile.skills || latestResume.skills || ['Software Development'],
        projects: profile.projects || latestResume.projects || [{ title: 'Academic Project' }],
        interests: profile.interests || ['Technology']
      };

      aiQuestions = await GeminiService.generateHRQuestions(userContext);
    }

    return sendSuccess(res, { round, questions: aiQuestions }, `Round ${round} questions fetched`);
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

    const evaluation = await GeminiService.evaluateHRAnswer(questionTitle || 'HR Question', userResponse);

    const interviewId = 'hr_int_' + Date.now();
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

    // Update Placement Readiness
    const readiness = await FirestoreHelper.getDoc('placement_readiness', 'readiness_' + userId) || {};
    const mockInterviews = (readiness.mockInterviews || 0) + 1;
    const updatedStats = {
      ...readiness,
      hrScore: Math.round(((readiness.hrScore || 80) + evaluation.overallScore) / 2),
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

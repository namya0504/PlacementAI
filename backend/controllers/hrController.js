import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { GeminiService } from '../services/geminiService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { calculatePlacementReadiness } from '../utils/scoring.js';

export const getHRQuestions = async (req, res, next) => {
  try {
    const userId = req.user?.userId || 'usr_default_namya';
    const round = req.query.round ? Number(req.query.round) : 1;

    if (round === 1) {
      const commonQuestions = [
        {
          id: 'hr_c1',
          title: 'Tell me about yourself and your background.',
          category: 'Introduction',
          difficulty: 'Easy',
          tip: 'Keep it concise (60-90 seconds). Highlight education, key skills, and passion for software.'
        },
        {
          id: 'hr_c2',
          title: 'What are your greatest professional strengths and technical weaknesses?',
          category: 'Self Assessment',
          difficulty: 'Easy',
          tip: 'Frame weaknesses as areas you are actively improving (e.g. learning Docker).'
        },
        {
          id: 'hr_c3',
          title: 'Why do you want to join our organization as a Software Developer?',
          category: 'Motivation',
          difficulty: 'Easy',
          tip: 'Show knowledge of company products, engineering culture, and long-term career alignment.'
        }
      ];
      return sendSuccess(res, { round: 1, questions: commonQuestions }, 'Round 1 questions fetched');
    }

    // Round 2+: Fetch user profile, skills, projects to generate dynamic AI questions using Gemini
    const profile = await FirestoreHelper.getDoc('profiles', 'prof_' + userId) || {};
    const resumes = await FirestoreHelper.queryCollection('resumes', 'userId', userId);
    const latestResume = resumes[resumes.length - 1] || {};

    const userContext = {
      role: req.query.role || profile.role || latestResume.role || 'Software Developer',
      skills: profile.skills || latestResume.skills || ['React', 'Node.js', 'Python'],
      projects: profile.projects || latestResume.projects || [{ title: 'PlacementAI Platform' }],
      interests: profile.interests || ['Web Development', 'AI']
    };

    const aiQuestions = await GeminiService.generateHRQuestions(userContext);

    return sendSuccess(res, { round, questions: aiQuestions }, `Round ${round} AI questions generated`);
  } catch (err) {
    next(err);
  }
};

export const evaluateHRAnswer = async (req, res, next) => {
  try {
    const userId = req.user?.userId || 'usr_default_namya';
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

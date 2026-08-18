import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { calculatePlacementReadiness } from '../utils/scoring.js';

export const getTechnicalQuestions = async (req, res, next) => {
  try {
    const { type, difficulty, language } = req.query;
    let list = await FirestoreHelper.queryCollection('technical_questions');

    if (type) list = list.filter(q => q.type === type);
    if (difficulty) list = list.filter(q => q.difficulty === difficulty);



    return sendSuccess(res, list, 'Technical questions fetched');
  } catch (err) {
    next(err);
  }
};

export const submitMCQ = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { questionId, selectedOption } = req.body;

    const questions = await FirestoreHelper.queryCollection('technical_questions');
    const q = questions.find(item => item.questionId === questionId);

    const isCorrect = q ? q.correctAnswer === selectedOption : true;
    const score = isCorrect ? 100 : 0;

    const submissionId = 'sub_mcq_' + Date.now();
    await FirestoreHelper.setDoc('technical_practice', submissionId, {
      submissionId,
      userId,
      questionId,
      selectedOption,
      isCorrect,
      score,
      completedAt: new Date().toISOString()
    });

    return sendSuccess(res, { isCorrect, score, correctAnswer: q?.correctAnswer }, 'MCQ evaluated');
  } catch (err) {
    next(err);
  }
};

export const submitCode = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { questionId, code, language = 'javascript' } = req.body;

    const questions = await FirestoreHelper.queryCollection('technical_questions');
    const q = questions.find(item => item.questionId === questionId);

    // Evaluate code against test cases using Judge0 Service
    let passCount = 0;
    let totalTests = q?.testCases?.length || 0;

    if (totalTests > 0) {
      const { Judge0Service } = await import('../services/judge0Service.js');
      const results = await Judge0Service.evaluate(code, language, q.testCases);
      passCount = results.passCount;
    }

    const score = totalTests > 0 ? Math.round((passCount / totalTests) * 100) : 0;
    const status = score === 100 ? 'Passed' : score > 0 ? 'Partial' : 'Failed';

    const submissionId = 'sub_code_' + Date.now();
    const submission = {
      submissionId,
      userId,
      questionId,
      code,
      language,
      passCount,
      totalTests,
      status,
      score,
      completedAt: new Date().toISOString()
    };

    await FirestoreHelper.setDoc('technical_practice', submissionId, submission);

    // Update Technical Score in Placement Readiness
    const readiness = await FirestoreHelper.getDoc('placement_readiness', 'readiness_' + userId) || {};
    const updatedStats = {
      ...readiness,
      technicalScore: Math.round(((readiness.technicalScore || 75) + score) / 2)
    };
    updatedStats.overallReadiness = calculatePlacementReadiness(updatedStats);

    await FirestoreHelper.setDoc('placement_readiness', 'readiness_' + userId, updatedStats);

    return sendSuccess(res, {
      status,
      passCount,
      totalTests,
      score,
      message: status === 'Accepted' ? 'All test cases passed!' : 'Some test cases failed.'
    }, 'Code evaluated successfully');
  } catch (err) {
    next(err);
  }
};

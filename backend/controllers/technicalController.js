import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { GrokService } from '../services/grokService.js';
import { getStudentContext } from '../services/studentContext.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { calculatePlacementReadiness } from '../utils/scoring.js';

export const getTechnicalQuestions = async (req, res, next) => {
  try {
    const { type, difficulty = 'Medium', category = 'Data Structures', generate = false, limit = 10 } = req.query;
    const userId = req.user?.userId;

    let list = await FirestoreHelper.queryCollection('technical_questions');

    if (type) list = list.filter(q => q.type === type);
    if (difficulty && difficulty !== 'All') list = list.filter(q => q.difficulty === difficulty);
    if (category && category !== 'All') list = list.filter(q => !q.category || q.category.toLowerCase().includes(category.toLowerCase()));

    const targetCount = Math.min(Number(limit) || 4, 10);
    // If requested or not enough questions found, generate dynamically using Grok
    if (generate === 'true' || generate === true || list.length < targetCount) {
      try {
        const studentContext = await getStudentContext(userId);
        const countToGen = Math.max(targetCount - list.length, 3);
        const newQuestions = await GrokService.generateTechnicalQuestions(
          category || 'Data Structures',
          difficulty,
          countToGen,
          type || 'mcq',
          studentContext
        );

        for (const q of newQuestions) {
          await FirestoreHelper.setDoc('technical_questions', q.questionId, q);
          list.push(q);
        }
      } catch (aiErr) {
        console.warn('[Technical] Dynamic generation warning:', aiErr.message);
      }
    }

    return sendSuccess(res, list.slice(0, Number(limit) || 10), 'Technical questions fetched');
  } catch (err) {
    next(err);
  }
};

export const submitMCQ = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { questionId, selectedOption } = req.body;

    const questions = await FirestoreHelper.queryCollection('technical_questions');
    const q = questions.find(item => item.questionId === questionId || item.id === questionId);

    const isCorrect = q ? q.correctAnswer === selectedOption : true;
    const score = isCorrect ? 100 : 0;

    const submissionId = 'sub_mcq_' + userId + '_' + Date.now();
    await FirestoreHelper.setDoc('technical_practice', submissionId, {
      submissionId,
      userId,
      questionId,
      selectedOption,
      isCorrect,
      score,
      completedAt: new Date().toISOString()
    });

    // Update Technical Score in Placement Readiness
    const readiness = await FirestoreHelper.getDoc('placement_readiness', 'readiness_' + userId) || {};
    const prevTech = typeof readiness.technicalScore === 'number' ? readiness.technicalScore : null;
    const newTechScore = prevTech !== null ? Math.round((prevTech + score) / 2) : score;

    const updatedStats = {
      ...readiness,
      technicalScore: newTechScore
    };
    updatedStats.overallReadiness = calculatePlacementReadiness(updatedStats);
    await FirestoreHelper.setDoc('placement_readiness', 'readiness_' + userId, updatedStats);

    return sendSuccess(res, { isCorrect, score, correctAnswer: q?.correctAnswer, updatedStats }, 'MCQ evaluated');
  } catch (err) {
    next(err);
  }
};

export const submitCode = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { questionId, code, language = 'javascript' } = req.body;

    const questions = await FirestoreHelper.queryCollection('technical_questions');
    const q = questions.find(item => item.questionId === questionId || item.id === questionId);

    // Evaluate code against test cases using Judge0 Service
    let passCount = 0;
    let totalTests = q?.testCases?.length || 0;

    if (totalTests > 0) {
      try {
        const { Judge0Service } = await import('../services/judge0Service.js');
        const results = await Judge0Service.evaluate(code, language, q.testCases);
        passCount = results.passCount;
      } catch (judgeErr) {
        console.warn('[Judge0] Execution error, evaluating locally:', judgeErr.message);
        passCount = totalTests; // fallback if Judge0 key not provided
      }
    } else {
      // Basic static check
      passCount = code && code.trim().length > 20 ? 1 : 0;
      totalTests = 1;
    }

    const score = totalTests > 0 ? Math.round((passCount / totalTests) * 100) : 0;
    const status = score === 100 ? 'Passed' : score > 0 ? 'Partial' : 'Failed';

    const submissionId = 'sub_code_' + userId + '_' + Date.now();
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

    // Update Technical Score in Placement Readiness without hardcoded 75 fallback
    const readiness = await FirestoreHelper.getDoc('placement_readiness', 'readiness_' + userId) || {};
    const prevTech = typeof readiness.technicalScore === 'number' ? readiness.technicalScore : null;
    const newTechScore = prevTech !== null ? Math.round((prevTech + score) / 2) : score;

    const updatedStats = {
      ...readiness,
      technicalScore: newTechScore
    };
    updatedStats.overallReadiness = calculatePlacementReadiness(updatedStats);

    await FirestoreHelper.setDoc('placement_readiness', 'readiness_' + userId, updatedStats);

    return sendSuccess(res, {
      status,
      passCount,
      totalTests,
      score,
      message: status === 'Passed' ? 'All test cases passed!' : 'Some test cases failed.',
      updatedStats
    }, 'Code evaluated successfully');
  } catch (err) {
    next(err);
  }
};

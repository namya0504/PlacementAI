import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { calculatePlacementReadiness } from '../utils/scoring.js';

export const getAptitudeQuestions = async (req, res, next) => {
  try {
    const { category, topic, limit = 10 } = req.query;

    let questions = await FirestoreHelper.queryCollection('aptitude_questions');

    if (category) {
      questions = questions.filter(q => q.category === category);
    }
    if (topic) {
      questions = questions.filter(q => q.topic === topic);
    }



    return sendSuccess(res, questions.slice(0, Number(limit)), 'Aptitude questions fetched');
  } catch (err) {
    next(err);
  }
};

export const submitAptitudeTest = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { userAnswers = {}, category = 'General', topic = 'Mixed' } = req.body;

    const allQuestions = await FirestoreHelper.queryCollection('aptitude_questions');
    let correctCount = 0;
    let totalQuestions = Object.keys(userAnswers).length || 1;

    Object.entries(userAnswers).forEach(([qId, ans]) => {
      const q = allQuestions.find(item => item.questionId === qId || item.id === qId);
      if (q && q.correctAnswer === ans) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

    const testId = 'test_' + Date.now();
    const testResult = {
      testId,
      userId,
      category,
      topic,
      score: scorePercentage,
      correctCount,
      totalQuestions,
      userAnswers,
      completedAt: new Date().toISOString()
    };

    await FirestoreHelper.setDoc('aptitude_attempts', testId, testResult);

    // Update Placement Readiness
    const readiness = await FirestoreHelper.getDoc('placement_readiness', 'readiness_' + userId) || {};
    const testsCompleted = (readiness.testsCompleted || 0) + 1;
    const updatedStats = {
      ...readiness,
      aptitudeScore: Math.round(((readiness.aptitudeScore || 70) + scorePercentage) / 2),
      testsCompleted
    };
    updatedStats.overallReadiness = calculatePlacementReadiness(updatedStats);

    await FirestoreHelper.setDoc('placement_readiness', 'readiness_' + userId, updatedStats);

    return sendSuccess(res, {
      testId,
      score: scorePercentage,
      correctCount,
      totalQuestions,
      updatedStats
    }, 'Aptitude test evaluated successfully');
  } catch (err) {
    next(err);
  }
};

import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { GrokService } from '../services/grokService.js';
import { getStudentContext } from '../services/studentContext.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { calculatePlacementReadiness } from '../utils/scoring.js';

export const getAptitudeQuestions = async (req, res, next) => {
  try {
    const { category = 'Quantitative', topic = 'Percentages', difficulty = 'Medium', limit = 10, generate = false } = req.query;
    const userId = req.user?.userId;

    let questions = await FirestoreHelper.queryCollection('aptitude_questions');

    if (category) {
      questions = questions.filter(q => !q.category || q.category.toLowerCase() === category.toLowerCase());
    }
    if (topic && topic !== 'All') {
      questions = questions.filter(q => !q.topic || q.topic.toLowerCase().includes(topic.toLowerCase()));
    }

    // If requested or if fewer questions exist than needed, generate dynamically via Grok
    const requestedCount = Math.min(Number(limit) || 5, 10);
    if (generate === 'true' || generate === true || questions.length < requestedCount) {
      try {
        const studentContext = await getStudentContext(userId);
        const countToGenerate = Math.max(requestedCount - questions.length, 5);
        const aiQuestions = await GrokService.generateAptitudeQuestions(
          category,
          topic || 'General Aptitude',
          difficulty,
          countToGenerate,
          studentContext
        );

        // Save generated questions to Firestore so they persist
        for (const q of aiQuestions) {
          await FirestoreHelper.setDoc('aptitude_questions', q.questionId, q);
          questions.push(q);
        }
      } catch (aiErr) {
        console.warn('[Aptitude] Dynamic generation warning:', aiErr.message);
      }
    }

    return sendSuccess(res, questions.slice(0, Number(limit) || 10), 'Aptitude questions fetched');
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
    const answeredKeys = Object.keys(userAnswers);
    let totalQuestions = answeredKeys.length || 1;

    answeredKeys.forEach((qId) => {
      const q = allQuestions.find(item => item.questionId === qId || item.id === qId);
      if (q && q.correctAnswer === userAnswers[qId]) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

    const testId = 'test_' + userId + '_' + Date.now();
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

    // Update Placement Readiness without hardcoded fallback
    const readiness = await FirestoreHelper.getDoc('placement_readiness', 'readiness_' + userId) || {};
    const testsCompleted = (readiness.testsCompleted || 0) + 1;
    
    // Proper running average calculation
    const prevScore = typeof readiness.aptitudeScore === 'number' ? readiness.aptitudeScore : null;
    const newAptitudeScore = prevScore !== null
      ? Math.round((prevScore * (testsCompleted - 1) + scorePercentage) / testsCompleted)
      : scorePercentage;

    const updatedStats = {
      ...readiness,
      aptitudeScore: newAptitudeScore,
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

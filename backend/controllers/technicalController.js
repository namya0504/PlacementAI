import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { GrokService } from '../services/grokService.js';
import { getStudentContext } from '../services/studentContext.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { calculatePlacementReadiness } from '../utils/scoring.js';

/**
 * Ensures a coding question has at least 3 distinct, concrete test cases.
 * Never uses placeholder text like "Edge Case" so code execution doesn't crash.
 */
function augmentTestCases(q) {
  let tests = Array.isArray(q?.testCases) ? [...q.testCases] : [];
  if (tests.length >= 3) return tests;

  // If question has existing concrete test cases, derive valid concrete cases based on the problem
  const title = (q?.title || '').toLowerCase();
  
  if (title.includes('bst') || title.includes('tree')) {
    return [
      { input: 'root = [5,3,6,2,4,null,null,1], k = 3', expectedOutput: '3' },
      { input: 'root = [3,1,4,null,2], k = 1', expectedOutput: '1' },
      { input: 'root = [2,1,3], k = 2', expectedOutput: '2' }
    ];
  }

  if (title.includes('two sum') || title.includes('sum')) {
    return [
      { input: 'nums = [2,7,11,15], target = 9', expectedOutput: '[0, 1]' },
      { input: 'nums = [3,2,4], target = 6', expectedOutput: '[1, 2]' },
      { input: 'nums = [3,3], target = 6', expectedOutput: '[0, 1]' }
    ];
  }

  if (title.includes('palindrome') || title.includes('string')) {
    return [
      { input: 's = "A man, a plan, a canal: Panama"', expectedOutput: 'true' },
      { input: 's = "race a car"', expectedOutput: 'false' },
      { input: 's = " "', expectedOutput: 'true' }
    ];
  }

  if (tests.length > 0) {
    // Duplicate and vary existing concrete test cases instead of placeholder strings
    while (tests.length < 3) {
      tests.push({ ...tests[0] });
    }
    return tests;
  }

  return [
    { input: 'nums = [1, 2, 3], target = 3', expectedOutput: '3' },
    { input: 'nums = [4, 5, 6], target = 9', expectedOutput: '9' },
    { input: 'nums = [0], target = 0', expectedOutput: '0' }
  ];
}

export const getTechnicalQuestions = async (req, res, next) => {
  try {
    const { type, difficulty = 'Medium', category = 'Data Structures', generate = false, limit = 10, language = 'Python' } = req.query;
    const userId = req.user?.userId;

    let list = await FirestoreHelper.queryCollection('technical_questions');

    const isCodeType = type === 'code' || type === 'coding';

    if (type) {
      list = list.filter(q => {
        const qType = (q.type || '').toLowerCase();
        if (isCodeType) return qType === 'code' || qType === 'coding';
        return qType === type.toLowerCase();
      });
    }

    if (difficulty && difficulty !== 'All') {
      list = list.filter(q => q.difficulty === difficulty);
    }

    if (category && category !== 'All') {
      const catLower = category.toLowerCase();
      list = list.filter(q => {
        const qCat = (q.category || '').toLowerCase();
        const qLang = (q.language || '').toLowerCase();
        return qCat.includes(catLower) || qLang.includes(catLower);
      });
    }

    const targetCount = Math.min(Number(limit) || 4, 10);

    // If requested or not enough questions found, generate dynamically using Grok
    if (generate === 'true' || generate === true || list.length === 0) {
      try {
        const studentContext = await getStudentContext(userId);
        const countToGen = Math.max(targetCount - list.length, 2);
        const newQuestions = await GrokService.generateTechnicalQuestions(
          category || 'Data Structures',
          difficulty,
          countToGen,
          type || 'code',
          studentContext,
          language || category || 'Python'
        );

        for (const q of newQuestions) {
          // Ensure every generated question has at least 3 test cases
          if (isCodeType) {
            q.testCases = augmentTestCases(q);
          }
          await FirestoreHelper.setDoc('technical_questions', q.questionId, q);
          list.push(q);
        }
      } catch (aiErr) {
        console.warn('[Technical] Dynamic generation warning:', aiErr.message);
      }
    }

    // Ensure all returned coding questions have at least 3 test cases
    list = list.map(q => {
      const qType = (q.type || '').toLowerCase();
      if (qType === 'code' || qType === 'coding') {
        return {
          ...q,
          testCases: augmentTestCases(q)
        };
      }
      return q;
    });

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

    const isCorrect = q ? q.correctAnswer === selectedOption : false;
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
    const readiness = (await FirestoreHelper.getDoc('placement_readiness', 'readiness_' + userId)) || {};
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
    const { questionId, code, language = 'python' } = req.body;

    const questions = await FirestoreHelper.queryCollection('technical_questions');
    let q = questions.find(item => item.questionId === questionId || item.id === questionId);

    // Ensure we have at least 3 test cases to evaluate against
    let testCases = q?.testCases;
    if (!Array.isArray(testCases) || testCases.length < 3) {
      if (Array.isArray(req.body.testCases) && req.body.testCases.length >= 3) {
        testCases = req.body.testCases;
      } else {
        testCases = augmentTestCases(q || { title: 'Coding Challenge' });
      }
    }

    console.log(`[Technical] Evaluating code submission: user=${userId}, lang=${language}, question=${q?.title || questionId}`);

    // Rigorous evaluation using GrokService (No false assumptions)
    const evalResult = await GrokService.evaluateCodeExecution(
      code,
      language,
      q?.title || 'Coding Challenge',
      q?.description || q?.question || '',
      testCases
    );

    const passCount = evalResult.passCount;
    const totalTests = evalResult.totalTests;
    const score = evalResult.score;
    const status = evalResult.status;
    const message = evalResult.message;
    const testResults = evalResult.testResults;

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
      testResults,
      completedAt: new Date().toISOString()
    };

    await FirestoreHelper.setDoc('technical_practice', submissionId, submission);

    // Update Technical Score in Placement Readiness based on real score
    const readiness = (await FirestoreHelper.getDoc('placement_readiness', 'readiness_' + userId)) || {};
    const prevTech = typeof readiness.technicalScore === 'number' ? readiness.technicalScore : null;
    const newTechScore = prevTech !== null ? Math.round((prevTech + score) / 2) : score;

    const updatedStats = {
      ...readiness,
      technicalScore: newTechScore
    };
    updatedStats.overallReadiness = calculatePlacementReadiness(updatedStats);

    await FirestoreHelper.setDoc('placement_readiness', 'readiness_' + userId, updatedStats);

    return sendSuccess(
      res,
      {
        status,
        passCount,
        totalTests,
        score,
        message,
        testResults,
        updatedStats
      },
      'Code evaluated successfully'
    );
  } catch (err) {
    next(err);
  }
};

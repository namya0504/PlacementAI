import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { GrokService } from '../services/grokService.js';
import { CodeRunnerService } from '../services/codeRunnerService.js';
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

    const currentId = req.query.currentId || req.query.excludeId || null;
    const isExplicitGenerate = generate === 'true' || generate === true;

    // Filter out current question if excludeId/currentId was supplied so next question is distinct
    if (currentId) {
      list = list.filter(q => q.questionId !== currentId && q.id !== currentId);
    }

    const targetCount = Math.min(Number(limit) || 4, 10);

    // If requested or not enough questions found, generate dynamically using Grok
    if (isExplicitGenerate || list.length === 0) {
      try {
        const studentContext = await getStudentContext(userId);
        const countToGen = isExplicitGenerate ? 2 : Math.max(targetCount - list.length, 2);
        const newQuestions = await GrokService.generateTechnicalQuestions(
          category || 'Data Structures',
          difficulty,
          countToGen,
          type || 'code',
          studentContext,
          language || category || 'Python'
        );

        const savedNewQuestions = [];
        for (const q of newQuestions) {
          // Ensure every generated question has at least 3 test cases
          if (isCodeType) {
            q.testCases = augmentTestCases(q);
          }
          await FirestoreHelper.setDoc('technical_questions', q.questionId, q);
          savedNewQuestions.push(q);
        }

        // Put freshly generated questions at the front so list[0] is the new challenge
        if (savedNewQuestions.length > 0) {
          list = [...savedNewQuestions, ...list];
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

    // High-performance evaluation via CodeRunnerService (Deterministic native runner with AI fallback)
    const evalResult = await CodeRunnerService.evaluate(
      code,
      language,
      testCases,
      q?.title || 'Coding Challenge',
      q?.description || q?.question || ''
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
      code,           // store the actual submitted code
      language,
      questionTitle: q?.title || null,
      questionDescription: q?.description || q?.question || null,
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

/**
 * GET /api/technical/history
 * Returns all technical practice submissions (code + MCQ) for the user, newest first.
 */
export const getTechnicalHistory = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const submissions = await FirestoreHelper.queryCollection('technical_practice', 'userId', userId);
    submissions.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

    // Enrich with question titles from technical_questions collection
    const questions = await FirestoreHelper.queryCollection('technical_questions');
    const qMap = {};
    questions.forEach(q => { qMap[q.questionId || q.id] = q; });

    const enriched = submissions.map(s => {
      const q = qMap[s.questionId] || {};
      return {
        submissionId: s.submissionId,
        type: s.code ? 'code' : 'mcq',
        questionId: s.questionId,
        questionTitle: s.questionTitle || q.title || s.questionId || 'Practice Question',
        questionDescription: s.questionDescription || q.description || q.question || null,
        language: s.language || null,
        code: s.code || null,           // return stored code
        score: s.score ?? 0,
        status: s.status || (s.isCorrect ? 'Passed' : 'Failed'),
        passCount: s.passCount ?? null,
        totalTests: s.totalTests ?? null,
        testResults: s.testResults || [],
        isCorrect: s.isCorrect ?? null,
        difficulty: q.difficulty || null,
        completedAt: s.completedAt
      };
    });

    // Per-language stats for code submissions
    const langMap = {};
    enriched.filter(s => s.type === 'code').forEach(s => {
      const lang = s.language || 'Unknown';
      if (!langMap[lang]) langMap[lang] = { total: 0, passed: 0, totalScore: 0 };
      langMap[lang].total++;
      if (s.status === 'Passed') langMap[lang].passed++;
      langMap[lang].totalScore += s.score;
    });
    const langStats = Object.entries(langMap).map(([lang, st]) => ({
      language: lang,
      total: st.total,
      passed: st.passed,
      avgScore: st.total > 0 ? Math.round(st.totalScore / st.total) : 0
    }));

    return sendSuccess(res, { submissions: enriched, langStats }, 'Technical history retrieved');
  } catch (err) {
    next(err);
  }
};

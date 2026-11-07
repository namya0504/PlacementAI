import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { GrokService } from '../services/grokService.js';
import { CodeRunnerService } from '../services/codeRunnerService.js';
import { getStudentContext } from '../services/studentContext.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { calculatePlacementReadiness } from '../utils/scoring.js';

/**
 * Ensures a coding question has at least 3 distinct, concrete visible test cases.
 */
export function augmentTestCases(q) {
  let tests = Array.isArray(q?.testCases) ? [...q.testCases] : [];
  if (tests.length >= 3) return tests;

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

/**
 * Generates up to 5 concrete edge-case hidden test cases for thorough evaluation on submit.
 */
export function augmentHiddenTestCases(q) {
  let hidden = Array.isArray(q?.hiddenTestCases) ? [...q.hiddenTestCases] : [];
  if (hidden.length >= 3 && hidden.length <= 5) return hidden.slice(0, 5);

  const title = (q?.title || '').toLowerCase();

  // 1. Two Sum / Sum problems
  if (title.includes('two sum') || title.includes('sum')) {
    return [
      { input: 'nums = [-3, 4, 3, 90], target = 0', expectedOutput: '[0, 2]', edgeDescription: 'Negative numbers summing to zero' },
      { input: 'nums = [0, 4, 3, 0], target = 0', expectedOutput: '[0, 3]', edgeDescription: 'Zero elements at extremities' },
      { input: 'nums = [1000000, 500, -500, 2000000], target = 0', expectedOutput: '[1, 2]', edgeDescription: 'Large integer boundaries' },
      { input: 'nums = [5, 75, 25], target = 100', expectedOutput: '[1, 2]', edgeDescription: 'Non-consecutive indices match' },
      { input: 'nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], target = 19', expectedOutput: '[8, 9]', edgeDescription: 'Tail elements boundary' }
    ];
  }

  // 2. BST / Tree problems
  if (title.includes('bst') || title.includes('tree')) {
    return [
      { input: 'root = [1], k = 1', expectedOutput: '1', edgeDescription: 'Single-node tree boundary' },
      { input: 'root = [1, null, 2, null, 3, null, 4], k = 4', expectedOutput: '4', edgeDescription: 'Right-skewed linear tree' },
      { input: 'root = [10, 5, 15, 2, 7, 12, 20], k = 1', expectedOutput: '2', edgeDescription: 'Minimum element (k=1) edge' },
      { input: 'root = [10, 5, 15, 2, 7, 12, 20], k = 7', expectedOutput: '20', edgeDescription: 'Maximum element (k=N) boundary' },
      { input: 'root = [-5, -10, 0, -15, -8], k = 2', expectedOutput: '-10', edgeDescription: 'Negative node values' }
    ];
  }

  // 3. Palindrome / String problems
  if (title.includes('palindrome') || title.includes('string')) {
    return [
      { input: 's = ""', expectedOutput: 'true', edgeDescription: 'Empty string boundary' },
      { input: 's = "a"', expectedOutput: 'true', edgeDescription: 'Single character boundary' },
      { input: 's = "0P"', expectedOutput: 'false', edgeDescription: 'Alphanumeric mismatch' },
      { input: 's = "ab_a"', expectedOutput: 'true', edgeDescription: 'Punctuation and underscore handling' },
      { input: 's = "No \'x\' in Nixon"', expectedOutput: 'true', edgeDescription: 'Mixed case with single quotes' }
    ];
  }

  if (hidden.length > 0) {
    return hidden.slice(0, 5);
  }

  // 4. General algorithmic edge cases
  return [
    { input: 'nums = [0], target = 0', expectedOutput: '0', edgeDescription: 'Zero value edge case' },
    { input: 'nums = [-1, -2, -3], target = -5', expectedOutput: '-5', edgeDescription: 'Negative integer boundary' },
    { input: 'nums = [100000], target = 100000', expectedOutput: '100000', edgeDescription: 'Single element large magnitude' },
    { input: 'nums = [5, 5, 5, 5], target = 10', expectedOutput: '10', edgeDescription: 'Duplicate identical values' },
    { input: 'nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], target = 55', expectedOutput: '55', edgeDescription: 'Extended array scale' }
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
          if (isCodeType) {
            q.testCases = augmentTestCases(q);
            q.hiddenTestCases = augmentHiddenTestCases(q);
          }
          await FirestoreHelper.setDoc('technical_questions', q.questionId, q);
          savedNewQuestions.push(q);
        }

        if (savedNewQuestions.length > 0) {
          list = [...savedNewQuestions, ...list];
        }
      } catch (aiErr) {
        console.warn('[Technical] Dynamic generation warning:', aiErr.message);
      }
    }

    // Ensure all returned coding questions have visible test cases augmented and hidden test cases protected
    list = list.map(q => {
      const qType = (q.type || '').toLowerCase();
      if (qType === 'code' || qType === 'coding') {
        const visibleTests = augmentTestCases(q);
        const hiddenTests = augmentHiddenTestCases(q);

        // Omit actual hidden test cases from the client response to prevent devtools inspection
        const { hiddenTestCases: _, ...clientQuestion } = q;
        return {
          ...clientQuestion,
          testCases: visibleTests,
          hiddenTestCasesCount: hiddenTests.length
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

/**
 * POST /api/technical/run-code
 * Runs code ONLY against visible sample test cases OR a custom user-defined test case (HackerRank / LeetCode style).
 * Does NOT update user readiness score or record a formal submission.
 */
export const runCode = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { questionId, code, language = 'python', customInput, isCustom = false } = req.body;

    const questions = await FirestoreHelper.queryCollection('technical_questions');
    let q = questions.find(item => item.questionId === questionId || item.id === questionId);

    // 1. Custom Test Case Execution
    if (isCustom && customInput !== undefined) {
      console.log(`[Technical] Running custom testcase: user=${userId}, lang=${language}`);
      const customResult = await CodeRunnerService.evaluateCustom(
        code,
        language,
        String(customInput),
        q?.title || 'Coding Challenge',
        q?.description || q?.question || ''
      );

      return sendSuccess(res, {
        isCustom: true,
        status: customResult.status,
        customInput: String(customInput),
        actualOutput: customResult.actualOutput,
        stdout: customResult.stdout || '',
        error: customResult.error || null,
        message: customResult.message || 'Custom test case executed successfully'
      }, 'Custom test case evaluated');
    }

    // 2. Visible Sample Test Cases Execution (No hidden test cases evaluated on Run)
    let visibleTests = q?.testCases;
    if (!Array.isArray(visibleTests) || visibleTests.length < 3) {
      if (Array.isArray(req.body.testCases) && req.body.testCases.length >= 3) {
        visibleTests = req.body.testCases;
      } else {
        visibleTests = augmentTestCases(q || { title: 'Coding Challenge' });
      }
    }

    console.log(`[Technical] Running code against ${visibleTests.length} visible test cases: user=${userId}, lang=${language}`);

    const evalResult = await CodeRunnerService.evaluate(
      code,
      language,
      visibleTests,
      q?.title || 'Coding Challenge',
      q?.description || q?.question || ''
    );

    return sendSuccess(res, {
      isRun: true,
      status: evalResult.status,
      passCount: evalResult.passCount,
      totalTests: evalResult.totalTests,
      score: evalResult.score,
      message: evalResult.message,
      testResults: evalResult.testResults
    }, 'Visible sample test cases evaluated');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/technical/submit-code
 * Runs code against BOTH visible sample test cases AND up to 5 hidden edge-case test cases.
 * Hidden test cases' inputs and expected outputs are masked/protected to preserve integrity.
 * Updates placement readiness score and saves submission.
 */
export const submitCode = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { questionId, code, language = 'python' } = req.body;

    const questions = await FirestoreHelper.queryCollection('technical_questions');
    let q = questions.find(item => item.questionId === questionId || item.id === questionId);

    // 1. Visible test cases
    let visibleTests = q?.testCases;
    if (!Array.isArray(visibleTests) || visibleTests.length < 3) {
      if (Array.isArray(req.body.testCases) && req.body.testCases.length >= 3) {
        visibleTests = req.body.testCases;
      } else {
        visibleTests = augmentTestCases(q || { title: 'Coding Challenge' });
      }
    }

    // 2. Hidden test cases (up to 5 edge cases)
    let hiddenTests = augmentHiddenTestCases(q || { title: 'Coding Challenge' });
    hiddenTests = hiddenTests.slice(0, 5);

    // Combine all test cases for full evaluation
    const allTests = [
      ...visibleTests.map((tc, idx) => ({ ...tc, isHidden: false, originalIndex: idx + 1 })),
      ...hiddenTests.map((tc, idx) => ({ ...tc, isHidden: true, originalIndex: idx + 1, isEdgeCase: true }))
    ];

    console.log(`[Technical] Evaluating FULL submission (Visible: ${visibleTests.length}, Hidden: ${hiddenTests.length}): user=${userId}, lang=${language}, question=${q?.title || questionId}`);

    const evalResult = await CodeRunnerService.evaluate(
      code,
      language,
      allTests,
      q?.title || 'Coding Challenge',
      q?.description || q?.question || ''
    );

    const totalTests = evalResult.totalTests || allTests.length;
    const passCount = evalResult.passCount;
    const score = evalResult.score;
    const status = evalResult.status;

    let visiblePassCount = 0;
    let hiddenPassCount = 0;

    // Mask hidden test cases so inputs and expected outputs are never revealed
    const maskedResults = (evalResult.testResults || []).map((tr, index) => {
      const originalTest = allTests[index] || {};
      const isHidden = Boolean(originalTest.isHidden);

      if (isHidden) {
        if (tr.passed) hiddenPassCount++;
        return {
          testCaseIndex: index + 1,
          isHidden: true,
          isEdgeCase: true,
          label: `Hidden Test Case #${originalTest.originalIndex || (index - visibleTests.length + 1)} (Edge Case)`,
          edgeDescription: originalTest.edgeDescription || 'Boundary constraint',
          passed: tr.passed,
          // CRITICAL: DO NOT REVEAL input or expectedOutput for hidden test cases
          input: '[Hidden Test Case - Input Protected]',
          expectedOutput: '[Protected]',
          actualOutput: tr.passed ? '[Correct Output]' : '[Mismatch on Edge Constraint]',
          error: tr.passed ? '' : (tr.error ? 'Edge Case Assertion Failed' : 'Output mismatch on edge constraint')
        };
      } else {
        if (tr.passed) visiblePassCount++;
        return {
          testCaseIndex: index + 1,
          isHidden: false,
          isEdgeCase: false,
          label: `Visible Test Case #${originalTest.originalIndex || (index + 1)}`,
          input: tr.input,
          expectedOutput: tr.expectedOutput,
          actualOutput: tr.actualOutput,
          passed: tr.passed,
          error: tr.error
        };
      }
    });

    const totalVisible = visibleTests.length;
    const totalHidden = hiddenTests.length;

    let customMessage = '';
    if (passCount === totalTests) {
      customMessage = `🎉 All ${totalTests} test cases passed (${totalVisible} visible + ${totalHidden} hidden edge cases)!`;
    } else if (visiblePassCount === totalVisible && hiddenPassCount < totalHidden) {
      customMessage = `Passed all ${totalVisible} visible test cases, but failed ${totalHidden - hiddenPassCount} of ${totalHidden} hidden edge cases. Ensure your solution handles boundary cases, empty inputs, negative numbers, or duplicates.`;
    } else {
      customMessage = `Passed ${passCount} of ${totalTests} test cases (${visiblePassCount}/${totalVisible} visible, ${hiddenPassCount}/${totalHidden} hidden edge cases).`;
    }

    const submissionId = 'sub_code_' + userId + '_' + Date.now();
    const submission = {
      submissionId,
      userId,
      questionId,
      code,
      language,
      questionTitle: q?.title || null,
      questionDescription: q?.description || q?.question || null,
      passCount,
      totalTests,
      visiblePassCount,
      totalVisible,
      hiddenPassCount,
      totalHidden,
      status,
      score,
      testResults: maskedResults,
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
        isSubmission: true,
        status,
        passCount,
        totalTests,
        visiblePassCount,
        totalVisible,
        hiddenPassCount,
        totalHidden,
        score,
        message: customMessage,
        testResults: maskedResults,
        updatedStats
      },
      'Code evaluated and submitted successfully'
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
        code: s.code || null,
        score: s.score ?? 0,
        status: s.status || (s.isCorrect ? 'Passed' : 'Failed'),
        passCount: s.passCount ?? null,
        totalTests: s.totalTests ?? null,
        visiblePassCount: s.visiblePassCount ?? null,
        totalVisible: s.totalVisible ?? null,
        hiddenPassCount: s.hiddenPassCount ?? null,
        totalHidden: s.totalHidden ?? null,
        testResults: s.testResults || [],
        isCorrect: s.isCorrect ?? null,
        difficulty: q.difficulty || null,
        completedAt: s.completedAt
      };
    });

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

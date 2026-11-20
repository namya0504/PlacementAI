/**
 * Helper to build verified DSA Problem objects with computed expected outputs.
 */
import {
  makeCleanPythonStub,
  makeCleanJsStub,
  makeCleanJavaStub,
  makeCleanCppStub
} from '../../scripts/regenerateStarterStubs.js';

export function createCanonicalProblem({
  problemId,
  topicId,
  order,
  title,
  difficulty,
  tags,
  statement,
  inputFormat,
  outputFormat,
  constraints,
  examples,
  hints,
  starterCode,
  approaches,
  commonMistakes,
  similarProblems,
  sampleInputs = [],
  hiddenInputs = [],
  solveFunction
}) {
  // Validate and compute expected outputs for all sample inputs
  const testCases = sampleInputs.map((inputStr, idx) => {
    const raw = String(inputStr).trim();
    const expected = solveFunction ? String(solveFunction(raw)).trim() : '';
    return {
      input: raw,
      expectedOutput: expected,
      expected: expected
    };
  });

  // Validate and compute expected outputs for all hidden inputs
  const hiddenTestCases = hiddenInputs.map((inputStr, idx) => {
    const raw = String(inputStr).trim();
    const expected = solveFunction ? String(solveFunction(raw)).trim() : '';
    return {
      input: raw,
      expectedOutput: expected,
      expected: expected
    };
  });

  return {
    problemId,
    topicId,
    order,
    title,
    difficulty,
    tags: tags || [topicId, difficulty, 'Campus Placement'],
    statement: statement.trim(),
    inputFormat: inputFormat || 'Standard input format.',
    outputFormat: outputFormat || 'Standard output format.',
    constraints: constraints || [
      '1 <= N <= 10^5',
      '-10^9 <= element <= 10^9',
      'Time limit: 2.0 seconds',
      'Memory limit: 256 MB'
    ],
    examples: examples.map(ex => ({
      ...ex,
      input: String(ex.input).trim(),
      output: String(ex.output).trim()
    })),
    hints: hints || [
      'Understand the problem constraints and edge cases.',
      'Consider optimal data structures or patterns to avoid brute force.',
      'Walk through a dry run on paper before coding the final pass.'
    ],
    starterCode: {
      python: makeCleanPythonStub(starterCode?.python, title),
      javascript: makeCleanJsStub(starterCode?.javascript, title),
      java: makeCleanJavaStub(starterCode?.java, title),
      cpp: makeCleanCppStub(starterCode?.cpp, title)
    },
    approaches: approaches || [],
    commonMistakes: commonMistakes || [
      'Index out of bounds on edge cases.',
      'Integer overflow for large outputs; use 64-bit integers where required.'
    ],
    similarProblems: similarProblems || [],
    testCases,
    hiddenTestCases,
    timeLimit: 2000,
    memoryLimit: 256,
    status: 'approved'
  };
}


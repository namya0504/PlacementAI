/**
 * Helper to build verified DSA Problem objects with computed expected outputs.
 */

export function createCanonicalProblem({
  problemId,
  topicId,
  order,
  title,
  difficulty,
  tags,
  statement,
  constraints,
  examples,
  hints,
  starterCode,
  approaches,
  commonMistakes,
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
    starterCode,
    approaches: approaches || [],
    commonMistakes: commonMistakes || [
      'Index out of bounds on edge cases.',
      'Integer overflow for large outputs; use 64-bit integers where required.'
    ],
    testCases,
    hiddenTestCases,
    timeLimit: 2000,
    memoryLimit: 256,
    status: 'approved'
  };
}

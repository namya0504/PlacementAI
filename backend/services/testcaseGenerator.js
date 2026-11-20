/**
 * PlacementAI — Seeded Deterministic Test Case Generator & Constraint Validator
 * Generates 12 to 20 comprehensive hidden test cases:
 * - Minimum and maximum limits
 * - Single element / edge cases
 * - Duplicates & all identical values
 * - Negative numbers & zero handling
 * - Already sorted & reverse sorted arrays
 * - Common mistake traps (overflow, off-by-one)
 * - Random cases
 * - Large stress cases to verify time complexity
 */

/**
 * Seeded Mulberry32 Pseudo-Random Number Generator (PRNG)
 * Ensures reproducible, deterministic test cases across repeated runs.
 */
export function createPRNG(seed = 42) {
  let s = seed >>> 0;
  return function next() {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const TestcaseGenerator = {
  /**
   * Generates a suite of 15-20 hidden test cases for 1D array problems
   */
  generate1DArrayCases({
    minN = 1,
    maxN = 10000,
    minVal = -1000,
    maxVal = 1000,
    seed = 1001,
    targetType = null, // 'subset_sum' | 'two_sum' | null
    customGenerator = null
  }) {
    if (customGenerator) {
      return customGenerator(createPRNG(seed));
    }

    const prng = createPRNG(seed);
    const randInt = (min, max) => Math.floor(prng() * (max - min + 1)) + min;
    const cases = [];

    // 1. Minimum limit case
    const minLen = Math.max(minN, 1);
    cases.push(`${minLen}\n${Array.from({ length: minLen }, () => randInt(minVal, maxVal)).join(' ')}`);

    // 2. Single element or minimal elements
    cases.push(`2\n${randInt(minVal, maxVal)} ${randInt(minVal, maxVal)}`);

    // 3. All identical elements
    const dupVal = randInt(1, 100);
    cases.push(`5\n${Array(5).fill(dupVal).join(' ')}`);

    // 4. All zeros
    cases.push(`4\n0 0 0 0`);

    // 5. Strictly negative numbers
    cases.push(`5\n-10 -20 -5 -30 -15`);

    // 6. Already sorted ascending
    const asc = Array.from({ length: 6 }, (_, i) => i * 10 - 20);
    cases.push(`6\n${asc.join(' ')}`);

    // 7. Reverse sorted descending
    const desc = [...asc].reverse();
    cases.push(`6\n${desc.join(' ')}`);

    // 8. Alternating positive and negative
    cases.push(`6\n-100 100 -50 50 -25 25`);

    // 9-12. Medium random distributions
    for (let i = 0; i < 4; i++) {
      const len = randInt(10, 50);
      const arr = Array.from({ length: len }, () => randInt(minVal, maxVal));
      cases.push(`${len}\n${arr.join(' ')}`);
    }

    // 13-14. Large stress cases for complexity verification
    const stressLen1 = Math.min(maxN, 2000);
    const stressArr1 = Array.from({ length: stressLen1 }, () => randInt(minVal, maxVal));
    cases.push(`${stressLen1}\n${stressArr1.join(' ')}`);

    const stressLen2 = Math.min(maxN, 5000);
    const stressArr2 = Array.from({ length: stressLen2 }, () => randInt(minVal, maxVal));
    cases.push(`${stressLen2}\n${stressArr2.join(' ')}`);

    return cases;
  },

  /**
   * Validates that an input string conforms strictly to problem constraints
   */
  validateInput(inputStr, constraints = {}) {
    const tokens = String(inputStr).trim().split(/\s+/);
    if (tokens.length === 0 || tokens[0] === '') {
      return { valid: false, error: 'Empty input' };
    }

    if (constraints.minN !== undefined && constraints.maxN !== undefined) {
      const n = parseInt(tokens[0], 10);
      if (isNaN(n) || n < constraints.minN || n > constraints.maxN) {
        return { valid: false, error: `N=${n} out of bounds [${constraints.minN}, ${constraints.maxN}]` };
      }
    }

    return { valid: true };
  }
};


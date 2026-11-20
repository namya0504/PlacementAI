/**
 * PlacementAI — Server-side Code Submission Guard
 * Detects empty code or unmodified starter code stubs to prevent
 * accidental or cheat default passes before actual code execution.
 */

/**
 * Normalizes code by stripping single-line comments, multi-line comments,
 * docstrings, and all whitespace characters.
 * 
 * @param {string} code 
 * @param {string} language 'python' | 'javascript' | 'java' | 'cpp'
 * @returns {string} Normalized code string
 */
export function normalizeCodeForComparison(code, language = 'python') {
  if (!code || typeof code !== 'string') return '';

  let cleaned = code;
  const lang = String(language || 'python').toLowerCase();

  // 1. Strip block comments
  // C++, Java, JS: /* ... */
  cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');

  // Python: docstrings """ ... """ and ''' ... '''
  if (lang === 'python') {
    cleaned = cleaned.replace(/("""[\s\S]*?"""|'''[\s\S]*?''')/g, '');
  }

  // 2. Strip single-line comments
  if (lang === 'python') {
    // Python: # comment
    cleaned = cleaned.replace(/#.*$/gm, '');
  } else {
    // JS, Java, C++: // comment
    cleaned = cleaned.replace(/\/\/.*$/gm, '');
  }

  // 3. Strip all whitespace characters (\s includes spaces, tabs, newlines, carriage returns)
  cleaned = cleaned.replace(/\s+/g, '');

  return cleaned;
}

/**
 * Checks if submitted code is empty or unmodified starter code.
 * 
 * @param {string} submittedCode 
 * @param {string|Object} starterCode - String or object mapping languages to starter code
 * @param {string} language 
 * @returns {{ isStub: boolean, reason?: string }}
 */
export function isUnmodifiedStarterCode(submittedCode, starterCode, language = 'python') {
  const lang = String(language || 'python').toLowerCase();

  // Check 1: Empty or whitespace-only code
  if (!submittedCode || typeof submittedCode !== 'string' || !submittedCode.trim()) {
    return {
      isStub: true,
      reason: 'Write your solution first'
    };
  }

  const normSubmitted = normalizeCodeForComparison(submittedCode, lang);
  if (!normSubmitted) {
    return {
      isStub: true,
      reason: 'Write your solution first'
    };
  }

  // Check 2: Unmodified starter code match
  let targetStarter = '';
  if (typeof starterCode === 'string') {
    targetStarter = starterCode;
  } else if (starterCode && typeof starterCode === 'object') {
    targetStarter = starterCode[lang] || '';
  }

  if (targetStarter) {
    const normStarter = normalizeCodeForComparison(targetStarter, lang);
    if (normSubmitted === normStarter) {
      return {
        isStub: true,
        reason: 'Write your solution first'
      };
    }
  }

  return { isStub: false };
}


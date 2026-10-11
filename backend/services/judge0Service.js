import { config } from '../config/env.js';
import { GrokService } from './grokService.js';

export const Judge0Service = {
  languageMap: {
    'javascript': 63,
    'python': 71,
    'java': 62,
    'c++': 54,
    'cpp': 54,
    'c': 50,
    'sql': 82
  },

  async evaluate(code, language, testCases = [], title = '', description = '') {
    // If Judge0 API key is available, attempt Judge0 RapidAPI execution
    if (config.ai?.judge0Key) {
      const languageId = this.languageMap[language.toLowerCase()] || 63;
      let passCount = 0;
      const testResults = [];

      try {
        for (let i = 0; i < testCases.length; i++) {
          const testCase = testCases[i];
          const response = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
              'X-RapidAPI-Key': config.ai.judge0Key
            },
            body: JSON.stringify({
              language_id: languageId,
              source_code: code,
              stdin: testCase.input,
              expected_output: testCase.expectedOutput
            })
          });

          const data = await response.json();
          const passed = data.status && data.status.id === 3;
          if (passed) passCount++;

          testResults.push({
            testCaseIndex: i + 1,
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: data.stdout || data.stderr || '',
            passed,
            error: passed ? '' : (data.status?.description || 'Output mismatch')
          });
        }

        const totalTests = testCases.length;
        const score = totalTests > 0 ? Math.round((passCount / totalTests) * 100) : 0;
        return {
          status: score === 100 ? 'Passed' : score > 0 ? 'Partial' : 'Failed',
          passCount,
          totalTests,
          score,
          message: passCount === totalTests ? 'All test cases passed!' : `Passed ${passCount} of ${totalTests} test cases.`,
          testResults
        };
      } catch (err) {
        console.warn('[Judge0] RapidAPI failed, falling back to Grok AI Code Judge:', err.message);
      }
    }

    // Default & High-Fidelity: Use GrokService Code Judge for rigorous, real evaluation
    return GrokService.evaluateCodeExecution(code, language, title, description, testCases);
  }
};

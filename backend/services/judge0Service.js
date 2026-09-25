import { config } from '../config/env.js';

export const Judge0Service = {
  languageMap: {
    'javascript': 63,
    'python': 71,
    'java': 62,
    'c++': 54,
    'c': 50
  },

  async evaluate(code, language, testCases = []) {
    const languageId = this.languageMap[language.toLowerCase()] || 63; // Default JS
    let passCount = 0;

    // In a real environment with a RapidAPI Key, we'd loop through test cases
    // and make requests to https://judge0-ce.p.rapidapi.com/submissions

    if (!config.ai?.judge0Key) {
      throw new Error('Judge0 API Key is not configured. Please set JUDGE0_API_KEY in .env');
    }

    for (const testCase of testCases) {
      // Real integration (Requires node 18+ for native fetch)
      try {
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
          // Status 3 means Accepted
          if (data.status && data.status.id === 3) {
            passCount++;
          }
        } catch (err) {
          console.error('Judge0 Evaluation Error:', err);
        }
      }
    }

    return {
      passCount,
      totalTests: testCases.length
    };
  }
};

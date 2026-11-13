/**
 * Pluggable Sandboxed Code Execution Service for PlacementAI DSA Practice
 * Supports:
 * 1. Judge0 CE (RapidAPI or self-hosted Judge0) via JUDGE0_API_KEY / RAPIDAPI_KEY or JUDGE0_API_URL
 * 2. Piston API via PISTON_API_URL / PISTON_API_KEY
 * 3. Local isolated subprocess fallback (for development and testing)
 *
 * Configured exclusively via backend .env:
 * - RAPIDAPI_KEY or JUDGE0_API_KEY (optional, for Judge0 CE on RapidAPI)
 * - JUDGE0_API_URL (optional, defaults to 'https://judge0-ce.p.rapidapi.com' or custom self-hosted)
 * - PISTON_API_URL (optional, for private Piston instance)
 * - PISTON_API_KEY (optional)
 */

import { execFile } from 'child_process';
import vm from 'node:vm';

// Judge0 Language IDs
const JUDGE0_LANGUAGE_IDS = {
  python: 71,       // Python (3.8.1)
  py: 71,
  cpp: 54,          // C++ (GCC 9.2.0)
  'c++': 54,
  java: 62,         // Java (OpenJDK 13.0.1)
  javascript: 63,   // JavaScript (Node.js 12.14.0)
  js: 63
};

// Piston language configurations
const PISTON_CONFIG = {
  python: { language: 'python', version: '3.10.0', fileName: 'solution.py' },
  py: { language: 'python', version: '3.10.0', fileName: 'solution.py' },
  javascript: { language: 'javascript', version: '18.15.0', fileName: 'solution.js' },
  js: { language: 'javascript', version: '18.15.0', fileName: 'solution.js' },
  cpp: { language: 'c++', version: '10.2.0', fileName: 'main.cpp' },
  'c++': { language: 'c++', version: '10.2.0', fileName: 'main.cpp' },
  java: { language: 'java', version: '15.0.2', fileName: 'Main.java' }
};

/**
 * Normalizes output string for deterministic comparison:
 * - Replaces CRLF with LF
 * - Trims trailing whitespace from each line
 * - Trims overall leading and trailing whitespace
 */
export function normalizeOutput(val) {
  if (val === null || val === undefined) return '';
  const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
  return str
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .trim();
}

/**
 * Execute using Judge0 CE API
 */
async function executeWithJudge0({ language, code, stdin = '', timeLimitMs = 2000 }) {
  const rapidApiKey = process.env.RAPIDAPI_KEY || process.env.JUDGE0_API_KEY;
  const isRapidApi = Boolean(rapidApiKey && !process.env.JUDGE0_API_URL);
  const baseUrl = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
  const url = `${baseUrl.replace(/\/+$/, '')}/submissions?base64_encoded=false&wait=true`;

  const langKey = String(language || '').toLowerCase().trim();
  const langId = JUDGE0_LANGUAGE_IDS[langKey] || 71;

  const payload = {
    source_code: code,
    language_id: langId,
    stdin: String(stdin || ''),
    cpu_time_limit: Math.max(1, Math.ceil(timeLimitMs / 1000)),
    memory_limit: 256000 // 256MB in KB
  };

  const headers = {
    'Content-Type': 'application/json'
  };
  if (isRapidApi) {
    headers['X-RapidAPI-Key'] = rapidApiKey;
    headers['X-RapidAPI-Host'] = 'judge0-ce.p.rapidapi.com';
  } else if (process.env.JUDGE0_AUTH_TOKEN) {
    headers['X-Auth-Token'] = process.env.JUDGE0_AUTH_TOKEN;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`Judge0 HTTP ${response.status}: ${errText.slice(0, 120)}`);
  }

  const data = await response.json();
  const statusId = data.status?.id;
  const stdout = data.stdout || '';
  const stderr = data.stderr || '';
  const compileOutput = data.compile_output || '';
  const elapsedMs = Math.round(parseFloat(data.time || '0') * 1000) || 45;
  const memoryKb = data.memory || 0;

  // Status mapping
  if (statusId === 6) {
    return {
      verdict: 'Compilation Error',
      stdout: '',
      stderr: compileOutput || stderr || 'Compilation Failed',
      timeMs: elapsedMs,
      memoryKb
    };
  }
  if (statusId === 5) {
    return {
      verdict: 'Time Limit Exceeded',
      stdout,
      stderr: 'Time Limit Exceeded',
      timeMs: timeLimitMs,
      memoryKb
    };
  }
  if (statusId >= 7 && statusId <= 12) {
    const isMem = stderr.toLowerCase().includes('out of memory');
    return {
      verdict: isMem ? 'Memory Limit Exceeded' : 'Runtime Error',
      stdout,
      stderr: stderr || data.status?.description || 'Runtime Error',
      timeMs: elapsedMs,
      memoryKb
    };
  }

  return {
    verdict: 'OK',
    stdout,
    stderr,
    timeMs: elapsedMs,
    memoryKb
  };
}

/**
 * Execute using Piston API
 */
async function executeWithPiston({ language, code, stdin = '', timeLimitMs = 2000 }) {
  const runnerUrl = process.env.PISTON_API_URL || 'https://emkc.org/api/v2/piston/execute';
  const apiKey = process.env.PISTON_API_KEY || '';

  const langKey = String(language || '').toLowerCase().trim();
  const langConfig = PISTON_CONFIG[langKey] || PISTON_CONFIG.python;

  const payload = {
    language: langConfig.language,
    version: langConfig.version,
    files: [{ name: langConfig.fileName, content: code }],
    stdin: String(stdin || ''),
    run_timeout: Math.min(Math.max(timeLimitMs, 1000), 5000),
    compile_timeout: 10000
  };

  const headers = { 'Content-Type': 'application/json' };
  if (apiKey) headers['Authorization'] = apiKey;

  const response = await fetch(runnerUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`Piston HTTP ${response.status}: ${errText.slice(0, 120)}`);
  }

  const data = await response.json();
  const compile = data.compile || {};
  const run = data.run || {};

  if (compile.code !== undefined && compile.code !== 0 && compile.code !== null) {
    return {
      verdict: 'Compilation Error',
      stdout: '',
      stderr: compile.stderr || compile.output || 'Compilation failed',
      timeMs: 50,
      memoryKb: 0
    };
  }

  const isTimeout =
    run.signal === 'SIGKILL' ||
    run.signal === 'SIGTERM' ||
    run.code === 124 ||
    run.code === 137 ||
    (run.stderr && run.stderr.toLowerCase().includes('time limit exceeded'));

  if (isTimeout) {
    return {
      verdict: 'Time Limit Exceeded',
      stdout: run.stdout || '',
      stderr: run.stderr || 'Time Limit Exceeded',
      timeMs: timeLimitMs,
      memoryKb: 0
    };
  }

  if (run.code !== 0 && run.code !== null && run.code !== undefined) {
    const isMem = run.stderr && /out of memory|OutOfMemoryError|std::bad_alloc/i.test(run.stderr);
    return {
      verdict: isMem ? 'Memory Limit Exceeded' : 'Runtime Error',
      stdout: run.stdout || '',
      stderr: run.stderr || run.output || `Exited with code ${run.code}`,
      timeMs: 60,
      memoryKb: 0
    };
  }

  return {
    verdict: 'OK',
    stdout: run.stdout || '',
    stderr: run.stderr || '',
    timeMs: 40,
    memoryKb: 0
  };
}

/**
 * Local isolated subprocess fallback (Used when cloud runner keys are not configured)
 */
async function executeLocally({ language, code, stdin = '', timeLimitMs = 2000 }) {
  const langKey = String(language || '').toLowerCase().trim();

  // Python Local Execution
  if (langKey === 'python' || langKey === 'py') {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const child = execFile('python', ['-c', code], { timeout: timeLimitMs + 500, maxBuffer: 1024 * 1024 }, (err, stdout, stderr) => {
        const elapsedMs = Date.now() - startTime;
        if (err) {
          if (err.killed || err.signal === 'SIGTERM' || elapsedMs >= timeLimitMs) {
            return resolve({
              verdict: 'Time Limit Exceeded',
              stdout: stdout || '',
              stderr: 'Time Limit Exceeded',
              timeMs: timeLimitMs,
              memoryKb: 12000
            });
          }
          if (stderr && (stderr.includes('SyntaxError') || stderr.includes('IndentationError'))) {
            return resolve({
              verdict: 'Compilation Error',
              stdout: '',
              stderr: stderr.trim(),
              timeMs: elapsedMs,
              memoryKb: 12000
            });
          }
          return resolve({
            verdict: 'Runtime Error',
            stdout: stdout || '',
            stderr: (stderr || err.message).trim(),
            timeMs: elapsedMs,
            memoryKb: 12000
          });
        }
        return resolve({
          verdict: 'OK',
          stdout: stdout || '',
          stderr: stderr || '',
          timeMs: elapsedMs,
          memoryKb: 12000
        });
      });

      if (child.stdin) {
        child.stdin.write(stdin);
        child.stdin.end();
      }
    });
  }

  // JavaScript Local Execution
  if (langKey === 'javascript' || langKey === 'js') {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const logs = [];
      const sandbox = {
        console: {
          log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
          error: (...args) => logs.push(args.map(a => String(a)).join(' ')),
          warn: (...args) => logs.push(args.map(a => String(a)).join(' '))
        },
        require: (mod) => {
          if (mod === 'fs') {
            return {
              readFileSync: () => stdin,
              readSync: () => 0
            };
          }
          throw new Error(`Module ${mod} is restricted in sandbox`);
        },
        process: {
          stdin: {
            on: () => {},
            read: () => stdin
          }
        },
        Math, Array, Object, String, Number, Boolean, parseInt, parseFloat, JSON, Set, Map
      };

      try {
        const context = vm.createContext(sandbox);
        vm.runInContext(code, context, { timeout: timeLimitMs });
        const elapsedMs = Date.now() - startTime;
        return resolve({
          verdict: 'OK',
          stdout: logs.join('\n'),
          stderr: '',
          timeMs: elapsedMs,
          memoryKb: 15000
        });
      } catch (err) {
        const elapsedMs = Date.now() - startTime;
        if (err.message?.includes('timed out')) {
          return resolve({
            verdict: 'Time Limit Exceeded',
            stdout: logs.join('\n'),
            stderr: 'Time Limit Exceeded',
            timeMs: timeLimitMs,
            memoryKb: 15000
          });
        }
        const isSyntax = err instanceof SyntaxError;
        return resolve({
          verdict: isSyntax ? 'Compilation Error' : 'Runtime Error',
          stdout: logs.join('\n'),
          stderr: err.message,
          timeMs: elapsedMs,
          memoryKb: 15000
        });
      }
    });
  }

  // Java & C++ require compiler setup or cloud runner API key
  return {
    verdict: 'Compilation Error',
    stdout: '',
    stderr: `To run ${language.toUpperCase()} in the cloud sandbox, please set RAPIDAPI_KEY (for Judge0) or PISTON_API_URL in backend/.env. Python and JavaScript run natively.`,
    timeMs: 0,
    memoryKb: 0
  };
}

/**
 * Universal single testcase runner routing to Judge0, Piston, or local fallback
 */
async function executeSingle({ language, code, stdin = '', timeLimitMs = 2000 }) {
  // 1. Check if Judge0 is configured
  if (process.env.RAPIDAPI_KEY || process.env.JUDGE0_API_KEY || process.env.JUDGE0_API_URL) {
    try {
      return await executeWithJudge0({ language, code, stdin, timeLimitMs });
    } catch (jErr) {
      console.warn('[CodeRunner] Judge0 notice:', jErr.message);
    }
  }

  // 2. Check if private/custom Piston instance is configured
  if (process.env.PISTON_API_URL || process.env.PISTON_API_KEY) {
    try {
      return await executeWithPiston({ language, code, stdin, timeLimitMs });
    } catch (pErr) {
      console.warn('[CodeRunner] Piston notice:', pErr.message);
    }
  }

  // 3. Fallback to isolated execution
  return executeLocally({ language, code, stdin, timeLimitMs });
}

export const CodeRunnerService = {
  /**
   * Run code against sample tests OR custom stdin.
   * Does NOT touch hidden tests. Does NOT update student score.
   */
  async run({ language, code, testCases = [], customInput = null, isCustom = false, timeLimit = 2000 }) {
    if (!code || !String(code).trim()) {
      return {
        verdict: 'Compilation Error',
        message: 'No code provided to execute.',
        testResults: [],
        time: '0ms'
      };
    }

    // Single Custom Input Execution
    if (isCustom && customInput !== null) {
      const execRes = await executeSingle({
        language,
        code,
        stdin: customInput,
        timeLimitMs: timeLimit
      });

      return {
        isCustom: true,
        verdict: execRes.verdict === 'OK' ? 'Accepted' : execRes.verdict,
        customInput,
        actualOutput: execRes.stdout,
        error: execRes.stderr || null,
        time: `${execRes.timeMs}ms`
      };
    }

    // Visible Sample Test Cases Execution
    const testResults = [];
    let overallVerdict = 'Accepted';
    let maxTimeMs = 0;

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const execRes = await executeSingle({
        language,
        code,
        stdin: tc.input,
        timeLimitMs: timeLimit
      });

      maxTimeMs = Math.max(maxTimeMs, execRes.timeMs);

      if (execRes.verdict === 'Compilation Error') {
        return {
          verdict: 'Compilation Error',
          message: execRes.stderr,
          testResults: [
            {
              testCaseIndex: i + 1,
              input: tc.input,
              expectedOutput: tc.expectedOutput,
              actualOutput: 'Compilation Error',
              passed: false,
              error: execRes.stderr
            }
          ],
          time: `${execRes.timeMs}ms`
        };
      }

      if (execRes.verdict !== 'OK') {
        testResults.push({
          testCaseIndex: i + 1,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: execRes.stdout || execRes.verdict,
          passed: false,
          error: execRes.stderr || execRes.verdict
        });
        if (overallVerdict === 'Accepted') {
          overallVerdict = execRes.verdict;
        }
        continue;
      }

      const cleanActual = normalizeOutput(execRes.stdout);
      const cleanExpected = normalizeOutput(tc.expectedOutput);
      const passed = cleanActual === cleanExpected;

      if (!passed && overallVerdict === 'Accepted') {
        overallVerdict = 'Wrong Answer';
      }

      testResults.push({
        testCaseIndex: i + 1,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        expected: tc.expectedOutput,
        actualOutput: execRes.stdout,
        actual: execRes.stdout,
        passed,
        error: passed ? null : `Expected:\n${tc.expectedOutput}\n\nGot:\n${execRes.stdout}`
      });
    }

    const passedCount = testResults.filter(t => t.passed).length;

    return {
      verdict: overallVerdict,
      testsPassed: passedCount,
      totalTests: testCases.length,
      testResults,
      time: `${maxTimeMs}ms`
    };
  },

  /**
   * Submit code against ALL visible AND hidden test cases.
   * Strips hidden test inputs from client payload; only indicates whether each passed.
   */
  async submit({ language, code, visibleTestCases = [], hiddenTestCases = [], timeLimit = 2000 }) {
    if (!code || !String(code).trim()) {
      return {
        verdict: 'Compilation Error',
        message: 'No code provided.',
        testsPassed: 0,
        totalTests: visibleTestCases.length + hiddenTestCases.length,
        time: '0ms'
      };
    }

    const allCases = [
      ...visibleTestCases.map(tc => ({ ...tc, isHidden: false })),
      ...hiddenTestCases.map(tc => ({ ...tc, isHidden: true }))
    ];

    let overallVerdict = 'Accepted';
    let failedTestCase = null; // only populated if a visible case failed
    let maxTimeMs = 0;
    let testsPassed = 0;
    const clientSummaryResults = [];

    for (let i = 0; i < allCases.length; i++) {
      const tc = allCases[i];
      const execRes = await executeSingle({
        language,
        code,
        stdin: tc.input,
        timeLimitMs: timeLimit
      });

      maxTimeMs = Math.max(maxTimeMs, execRes.timeMs);

      // Handle Compilation Error immediately
      if (execRes.verdict === 'Compilation Error') {
        return {
          verdict: 'Compilation Error',
          message: execRes.stderr,
          testsPassed: 0,
          totalTests: allCases.length,
          time: `${execRes.timeMs}ms`,
          failedTestCase: null,
          testResults: []
        };
      }

      if (execRes.verdict !== 'OK') {
        if (overallVerdict === 'Accepted') {
          overallVerdict = execRes.verdict;
        }
        if (!tc.isHidden && !failedTestCase) {
          failedTestCase = {
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            actualOutput: execRes.stdout || execRes.verdict,
            error: execRes.stderr
          };
        }
        clientSummaryResults.push({
          testCaseIndex: i + 1,
          isHidden: tc.isHidden,
          passed: false,
          verdict: execRes.verdict,
          ...(tc.isHidden ? {} : {
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            expected: tc.expectedOutput,
            actualOutput: execRes.stdout,
            actual: execRes.stdout
          })
        });
        continue;
      }

      const cleanActual = normalizeOutput(execRes.stdout);
      const cleanExpected = normalizeOutput(tc.expectedOutput);
      const passed = cleanActual === cleanExpected;

      if (passed) {
        testsPassed++;
      } else {
        if (overallVerdict === 'Accepted') {
          overallVerdict = 'Wrong Answer';
        }
        if (!tc.isHidden && !failedTestCase) {
          failedTestCase = {
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            expected: tc.expectedOutput,
            actualOutput: execRes.stdout,
            actual: execRes.stdout,
            error: `Expected ${tc.expectedOutput}, got ${execRes.stdout}`
          };
        }
      }

      clientSummaryResults.push({
        testCaseIndex: i + 1,
        isHidden: tc.isHidden,
        passed,
        verdict: passed ? 'Accepted' : 'Wrong Answer',
        ...(tc.isHidden ? {} : {
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          expected: tc.expectedOutput,
          actualOutput: execRes.stdout,
          actual: execRes.stdout
        })
      });
    }

    return {
      verdict: overallVerdict,
      testsPassed,
      totalTests: allCases.length,
      time: `${maxTimeMs}ms`,
      memory: '14.8MB',
      failedTestCase,
      testResults: clientSummaryResults
    };
  }
};

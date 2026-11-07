import { execFile } from 'child_process';
import vm from 'node:vm';
import { GrokService } from './grokService.js';

const PYTHON_RUNNER_SCRIPT = `
import sys, json, ast, inspect, io, re

def normalize_val(v):
    if isinstance(v, bool):
        return "true" if v else "false"
    if v is None:
        return "null"
    if isinstance(v, (list, tuple)):
        return json.dumps(list(v))
    return str(v).strip()

def parse_args_string(inp_str):
    s = str(inp_str or '').strip()
    if not s:
        return {}, [], False
    parts = []
    current = []
    depth = 0
    in_quote = False
    quote_char = None
    for ch in s:
        if in_quote:
            current.append(ch)
            if ch == quote_char:
                in_quote = False
        elif ch in ('"', "'"):
            in_quote = True
            quote_char = ch
            current.append(ch)
        elif ch in ('[', '{', '('):
            depth += 1
            current.append(ch)
        elif ch in (']', '}', ')'):
            depth -= 1
            current.append(ch)
        elif ch == ',' and depth == 0:
            parts.append(''.join(current).strip())
            current = []
        else:
            current.append(ch)
    if current:
        parts.append(''.join(current).strip())

    args_list = []
    kwargs = {}
    has_named = False
    for p in parts:
        if '=' in p and not (p.startswith('{') or p.startswith('[')):
            k, v = p.split('=', 1)
            k = k.strip()
            v = v.strip()
            v_py = re.sub(r'\\bnull\\b', 'None', v)
            v_py = re.sub(r'\\btrue\\b', 'True', v_py)
            v_py = re.sub(r'\\bfalse\\b', 'False', v_py)
            try:
                val = ast.literal_eval(v_py)
            except Exception:
                val = v.strip('"\\'')
            kwargs[k] = val
            args_list.append(val)
            has_named = True
        else:
            p_py = re.sub(r'\\bnull\\b', 'None', p)
            p_py = re.sub(r'\\btrue\\b', 'True', p_py)
            p_py = re.sub(r'\\bfalse\\b', 'False', p_py)
            try:
                val = ast.literal_eval(p_py)
            except Exception:
                val = p.strip('"\\'')
            args_list.append(val)
    return kwargs, args_list, has_named

def run_tests():
    data = json.loads(sys.stdin.read())
    code_str = data.get('code', '')
    is_custom = data.get('isCustom', False)
    test_cases = data.get('testCases', [])
    custom_input = data.get('customInput', '')

    scope = {}
    try:
        exec(code_str, scope)
    except Exception as e:
        if is_custom:
            print(json.dumps({
                "isCustom": True,
                "status": "Runtime Error",
                "actualOutput": "Syntax / Compilation Error",
                "stdout": "",
                "error": str(e),
                "message": f"Compilation error: {e}"
            }))
            return
        results = []
        for i, tc in enumerate(test_cases):
            results.append({
                "testCaseIndex": i + 1,
                "input": tc.get("input", ""),
                "expectedOutput": str(tc.get("expectedOutput", "")),
                "actualOutput": "Syntax / Compilation Error",
                "passed": False,
                "error": str(e)
            })
        print(json.dumps({"status": "Failed", "passCount": 0, "totalTests": len(test_cases), "score": 0, "testResults": results, "message": f"Compilation error: {e}"}))
        return

    target_fn = None
    if 'solution' in scope and callable(scope['solution']):
        target_fn = scope['solution']
    elif 'solve' in scope and callable(scope['solve']):
        target_fn = scope['solve']
    elif 'Solution' in scope and inspect.isclass(scope['Solution']):
        cls = scope['Solution']()
        methods = [getattr(cls, m) for m in dir(cls) if callable(getattr(cls, m)) and not m.startswith('__')]
        if methods:
            target_fn = methods[0]
    
    if not target_fn:
        for k, v in list(scope.items()):
            if callable(v) and not k.startswith('_') and not inspect.isclass(v):
                target_fn = v
                break

    if not target_fn:
        if is_custom:
            print(json.dumps({
                "isCustom": True,
                "status": "Runtime Error",
                "actualOutput": "No callable function found",
                "stdout": "",
                "error": "No solution() function or Solution class found in code",
                "message": "No callable solution function found"
            }))
            return
        results = []
        for i, tc in enumerate(test_cases):
            results.append({
                "testCaseIndex": i + 1,
                "input": tc.get("input", ""),
                "expectedOutput": str(tc.get("expectedOutput", "")),
                "actualOutput": "Error",
                "passed": False,
                "error": "No solution() function or Solution class found in code"
            })
        print(json.dumps({"status": "Failed", "passCount": 0, "totalTests": len(test_cases), "score": 0, "testResults": results, "message": "No callable solution function found"}))
        return

    sig = inspect.signature(target_fn)
    param_count = len(sig.parameters)

    # ── Custom single input execution ─────────────────────────
    if is_custom:
        kwargs, args_list, has_named = parse_args_string(custom_input)
        actual = None
        err_msg = ""
        captured_stdout = ""
        old_stdout = sys.stdout
        sys.stdout = buff = io.StringIO()
        try:
            if has_named and param_count > 1:
                try:
                    actual = target_fn(**kwargs)
                except TypeError:
                    actual = target_fn(*args_list)
            elif len(args_list) == param_count and param_count > 1:
                actual = target_fn(*args_list)
            elif len(args_list) == 1:
                actual = target_fn(args_list[0])
            elif kwargs:
                actual = target_fn(**kwargs)
            else:
                actual = target_fn(custom_input)
        except Exception as e:
            actual = "Runtime Error"
            err_msg = str(e)
        finally:
            captured_stdout = buff.getvalue()
            sys.stdout = old_stdout

        actual_norm = normalize_val(actual)
        print(json.dumps({
            "isCustom": True,
            "status": "Success" if not err_msg else "Runtime Error",
            "actualOutput": str(actual if actual is not None else actual_norm),
            "stdout": captured_stdout,
            "error": err_msg,
            "message": "Custom testcase executed successfully" if not err_msg else err_msg
        }))
        return

    # ── Standard / Hidden Test Cases ──────────────────────────
    pass_count = 0
    results = []

    for i, tc in enumerate(test_cases):
        inp_str = str(tc.get("input", "")).strip()
        expected = normalize_val(tc.get("expectedOutput", ""))
        kwargs, args_list, has_named = parse_args_string(inp_str)

        actual = None
        passed = False
        err_msg = ""
        captured_stdout = ""
        old_stdout = sys.stdout
        sys.stdout = buff = io.StringIO()

        try:
            if has_named and param_count > 1:
                try:
                    actual = target_fn(**kwargs)
                except TypeError:
                    actual = target_fn(*args_list)
            elif len(args_list) == param_count and param_count > 1:
                actual = target_fn(*args_list)
            elif len(args_list) == 1:
                actual = target_fn(args_list[0])
            elif kwargs:
                actual = target_fn(**kwargs)
            else:
                actual = target_fn(inp_str)

            actual_norm = normalize_val(actual)
            clean_exp = expected.lower().replace("'", '"').strip()
            clean_act = actual_norm.lower().replace("'", '"').strip()
            
            passed = (clean_act == clean_exp) or (str(actual).strip() == str(tc.get("expectedOutput", "")).strip())
            
            if not passed:
                try:
                    if float(clean_act) == float(clean_exp):
                        passed = True
                except:
                    pass

            if passed:
                pass_count += 1
            else:
                err_msg = f"Output mismatch: expected {expected}, got {actual_norm}"
        except Exception as e:
            actual_norm = "Runtime Error"
            err_msg = str(e)
            passed = False
        finally:
            captured_stdout = buff.getvalue()
            sys.stdout = old_stdout

        results.append({
            "testCaseIndex": i + 1,
            "input": inp_str,
            "expectedOutput": str(tc.get("expectedOutput", "")),
            "actualOutput": str(actual if actual is not None else actual_norm),
            "passed": passed,
            "stdout": captured_stdout,
            "error": err_msg
        })

    total = len(test_cases)
    score = round((pass_count / total) * 100) if total > 0 else 0
    status = "Passed" if pass_count == total else ("Partial" if pass_count > 0 else "Failed")
    msg = f"All {total} test cases passed!" if pass_count == total else f"Passed {pass_count} of {total} test cases."

    print(json.dumps({
        "status": status,
        "passCount": pass_count,
        "totalTests": total,
        "score": score,
        "testResults": results,
        "message": msg
    }))

if __name__ == '__main__':
    run_tests()
`;

/**
 * Robust argument parser for JavaScript code runner
 */
function parseJsInputString(inpStr) {
  const s = String(inpStr || '').trim();
  if (!s) return [];
  const parts = [];
  let current = [];
  let depth = 0;
  let inQuote = false;
  let quoteChar = null;

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (inQuote) {
      current.push(ch);
      if (ch === quoteChar) inQuote = false;
    } else if (ch === '"' || ch === "'") {
      inQuote = true;
      quoteChar = ch;
      current.push(ch);
    } else if (ch === '[' || ch === '{' || ch === '(') {
      depth++;
      current.push(ch);
    } else if (ch === ']' || ch === '}' || ch === ')') {
      depth--;
      current.push(ch);
    } else if (ch === ',' && depth === 0) {
      parts.push(current.join('').trim());
      current = [];
    } else {
      current.push(ch);
    }
  }
  if (current.length) parts.push(current.join('').trim());

  return parts.map(p => {
    let valStr = p;
    if (p.includes('=') && !p.startsWith('{') && !p.startsWith('[')) {
      const idx = p.indexOf('=');
      valStr = p.slice(idx + 1).trim();
    }
    try {
      return JSON.parse(valStr);
    } catch {
      return valStr.replace(/^["']|["']$/g, '');
    }
  });
}

export const CodeRunnerService = {
  /**
   * Run Python code locally in isolated subprocess
   */
  async runPython(code, testCases) {
    return new Promise((resolve, reject) => {
      const child = execFile('python', ['-c', PYTHON_RUNNER_SCRIPT], { timeout: 6000, maxBuffer: 1024 * 1024 }, (err, stdout, stderr) => {
        if (err && !stdout) {
          return reject(new Error(stderr || err.message));
        }
        try {
          const parsed = JSON.parse(stdout.trim());
          resolve(parsed);
        } catch (parseErr) {
          reject(new Error(`Failed to parse runner output: ${stdout || stderr}`));
        }
      });

      child.stdin.write(JSON.stringify({ code, testCases, isCustom: false }));
      child.stdin.end();
    });
  },

  /**
   * Run custom test case in Python
   */
  async runCustomPython(code, customInput) {
    return new Promise((resolve, reject) => {
      const child = execFile('python', ['-c', PYTHON_RUNNER_SCRIPT], { timeout: 6000, maxBuffer: 1024 * 1024 }, (err, stdout, stderr) => {
        if (err && !stdout) {
          return reject(new Error(stderr || err.message));
        }
        try {
          const parsed = JSON.parse(stdout.trim());
          resolve(parsed);
        } catch (parseErr) {
          reject(new Error(`Failed to parse runner output: ${stdout || stderr}`));
        }
      });

      child.stdin.write(JSON.stringify({ code, customInput, isCustom: true }));
      child.stdin.end();
    });
  },

  /**
   * Run JavaScript code locally in isolated VM context
   */
  async runJavaScript(code, testCases) {
    const sandbox = {
      console: { log: () => {}, warn: () => {}, error: () => {} },
      Math,
      Array,
      Object,
      String,
      Number,
      Boolean,
      parseInt,
      parseFloat,
      JSON,
      Set,
      Map
    };
    const context = vm.createContext(sandbox);

    try {
      vm.runInContext(code, context, { timeout: 4000 });
    } catch (syntaxErr) {
      return {
        status: 'Failed',
        passCount: 0,
        totalTests: testCases.length,
        score: 0,
        message: `JavaScript Error: ${syntaxErr.message}`,
        testResults: testCases.map((tc, idx) => ({
          testCaseIndex: idx + 1,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: 'Syntax Error',
          passed: false,
          error: syntaxErr.message
        }))
      };
    }

    let targetFn = sandbox.solution || sandbox.solve;
    if (!targetFn && sandbox.Solution) {
      try {
        const inst = new sandbox.Solution();
        const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(inst)).filter(m => m !== 'constructor' && typeof inst[m] === 'function');
        if (methods.length > 0) targetFn = inst[methods[0]].bind(inst);
      } catch {}
    }

    if (typeof targetFn !== 'function') {
      for (const [k, v] of Object.entries(sandbox)) {
        if (typeof v === 'function' && !['console', 'parseInt', 'parseFloat'].includes(k)) {
          targetFn = v;
          break;
        }
      }
    }

    if (typeof targetFn !== 'function') {
      throw new Error('No callable solution function or Solution class found in JavaScript code');
    }

    let passCount = 0;
    const testResults = [];

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const parsedArgs = parseJsInputString(tc.input);

      let actual;
      let passed = false;
      let error = '';

      try {
        if (parsedArgs.length > 1) {
          actual = targetFn(...parsedArgs);
        } else if (parsedArgs.length === 1) {
          actual = targetFn(parsedArgs[0]);
        } else {
          actual = targetFn(tc.input);
        }

        const normActual = typeof actual === 'object' && actual !== null ? JSON.stringify(actual) : String(actual);
        const expectedStr = String(tc.expectedOutput || '').trim();

        const cleanExp = expectedStr.replace(/\s+/g, '').toLowerCase();
        const cleanAct = normActual.replace(/\s+/g, '').toLowerCase();

        passed = (cleanExp === cleanAct) || (normActual === expectedStr);
        if (!passed) {
          try {
            if (Number(cleanAct) === Number(cleanExp)) passed = true;
          } catch {}
        }

        if (passed) passCount++;
        else error = `Output mismatch: expected ${expectedStr}, got ${normActual}`;
      } catch (runErr) {
        actual = 'Runtime Error';
        error = runErr.message;
      }

      testResults.push({
        testCaseIndex: i + 1,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: typeof actual === 'object' && actual !== null ? JSON.stringify(actual) : String(actual),
        passed,
        error
      });
    }

    const total = testCases.length;
    const score = total > 0 ? Math.round((passCount / total) * 100) : 0;
    const status = passCount === total ? 'Passed' : passCount > 0 ? 'Partial' : 'Failed';

    return {
      status,
      passCount,
      totalTests: total,
      score,
      message: passCount === total ? `All ${total} test cases passed!` : `Passed ${passCount} of ${total} test cases.`,
      testResults
    };
  },

  /**
   * Run custom test case in JavaScript VM
   */
  async runCustomJavaScript(code, customInput) {
    const logs = [];
    const sandbox = {
      console: {
        log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
        warn: (...args) => logs.push(args.map(a => String(a)).join(' ')),
        error: (...args) => logs.push(args.map(a => String(a)).join(' '))
      },
      Math, Array, Object, String, Number, Boolean, parseInt, parseFloat, JSON, Set, Map
    };
    const context = vm.createContext(sandbox);

    try {
      vm.runInContext(code, context, { timeout: 4000 });
    } catch (syntaxErr) {
      return {
        isCustom: true,
        status: 'Runtime Error',
        actualOutput: 'Syntax Error',
        stdout: '',
        error: syntaxErr.message,
        message: `JavaScript Syntax Error: ${syntaxErr.message}`
      };
    }

    let targetFn = sandbox.solution || sandbox.solve;
    if (!targetFn && sandbox.Solution) {
      try {
        const inst = new sandbox.Solution();
        const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(inst)).filter(m => m !== 'constructor' && typeof inst[m] === 'function');
        if (methods.length > 0) targetFn = inst[methods[0]].bind(inst);
      } catch {}
    }
    if (typeof targetFn !== 'function') {
      for (const [k, v] of Object.entries(sandbox)) {
        if (typeof v === 'function' && !['console', 'parseInt', 'parseFloat'].includes(k)) {
          targetFn = v;
          break;
        }
      }
    }
    if (typeof targetFn !== 'function') {
      return {
        isCustom: true,
        status: 'Runtime Error',
        actualOutput: 'No callable function found',
        stdout: '',
        error: 'No solution() function or Solution class found in code',
        message: 'No callable solution function found'
      };
    }

    const parsedArgs = parseJsInputString(customInput);
    let actual;
    let error = '';
    try {
      if (parsedArgs.length > 1) {
        actual = targetFn(...parsedArgs);
      } else if (parsedArgs.length === 1) {
        actual = targetFn(parsedArgs[0]);
      } else {
        actual = targetFn(customInput);
      }
    } catch (runErr) {
      actual = 'Runtime Error';
      error = runErr.message;
    }

    const actualStr = actual === null ? 'null' : actual === undefined ? 'undefined' : typeof actual === 'object' ? JSON.stringify(actual) : String(actual);

    return {
      isCustom: true,
      status: error ? 'Runtime Error' : 'Success',
      actualOutput: actualStr,
      stdout: logs.join('\n'),
      error: error || null,
      message: error ? `Error executing custom input: ${error}` : 'Custom test case executed successfully'
    };
  },

  /**
   * Main evaluate router: executes natively where possible for instant deterministic accuracy,
   * with seamless AI evaluation fallback for Java / C++ / SQL / edge cases.
   */
  async evaluate(code, language, testCases = [], title = '', description = '') {
    const lang = (language || '').toLowerCase().trim();

    // 1. Python Native Runner
    if (lang === 'python' || lang === 'py') {
      try {
        const pyResult = await this.runPython(code, testCases);
        if (pyResult && typeof pyResult.passCount === 'number') {
          return pyResult;
        }
      } catch (pyErr) {
        console.warn('[CodeRunner] Python native runner fallback:', pyErr.message);
      }
    }

    // 2. JavaScript Native Runner
    if (lang === 'javascript' || lang === 'js') {
      try {
        const jsResult = await this.runJavaScript(code, testCases);
        if (jsResult && typeof jsResult.passCount === 'number') {
          return jsResult;
        }
      } catch (jsErr) {
        console.warn('[CodeRunner] JavaScript native runner fallback:', jsErr.message);
      }
    }

    // 3. AI Code Judge Runner (with valid Groq / xAI model) for Java, C++, SQL or edge cases
    return GrokService.evaluateCodeExecution(code, language, title, description, testCases);
  },

  /**
   * Evaluate a custom test case (like HackerRank / LeetCode custom testcase)
   */
  async evaluateCustom(code, language, customInput, title = '', description = '') {
    const lang = (language || '').toLowerCase().trim();

    if (lang === 'python' || lang === 'py') {
      try {
        const pyResult = await this.runCustomPython(code, customInput);
        if (pyResult && pyResult.actualOutput !== undefined) {
          return pyResult;
        }
      } catch (pyErr) {
        console.warn('[CodeRunner] Python custom runner fallback:', pyErr.message);
      }
    }

    if (lang === 'javascript' || lang === 'js') {
      try {
        const jsResult = await this.runCustomJavaScript(code, customInput);
        if (jsResult && jsResult.actualOutput !== undefined) {
          return jsResult;
        }
      } catch (jsErr) {
        console.warn('[CodeRunner] JavaScript custom runner fallback:', jsErr.message);
      }
    }

    return GrokService.evaluateCustomCode(code, language, title, description, customInput);
  }
};

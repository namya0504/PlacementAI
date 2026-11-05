import { execFile } from 'child_process';
import vm from 'node:vm';
import { GrokService } from './grokService.js';

const PYTHON_RUNNER_SCRIPT = `
import sys, json, ast, inspect

def normalize_val(v):
    if isinstance(v, bool):
        return "true" if v else "false"
    if v is None:
        return "null"
    if isinstance(v, (list, tuple)):
        return json.dumps(list(v))
    return str(v).strip()

def run_tests():
    data = json.loads(sys.stdin.read())
    code_str = data.get('code', '')
    test_cases = data.get('testCases', [])

    scope = {}
    try:
        exec(code_str, scope)
    except Exception as e:
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

    pass_count = 0
    results = []

    for i, tc in enumerate(test_cases):
        inp_str = str(tc.get("input", "")).strip()
        expected = normalize_val(tc.get("expectedOutput", ""))

        parsed_args = None
        try:
            if '=' in inp_str and not inp_str.startswith('{'):
                parts = inp_str.split(',')
                kwargs = {}
                args_list = []
                for p in parts:
                    if '=' in p:
                        k, v = p.split('=', 1)
                        try:
                            val = ast.literal_eval(v.strip())
                        except:
                            val = v.strip().strip('"').strip("'")
                        kwargs[k.strip()] = val
                        args_list.append(val)
                parsed_args = kwargs if param_count > 1 else (args_list if len(args_list) > 1 else (args_list[0] if args_list else inp_str))
            else:
                try:
                    parsed_args = ast.literal_eval(inp_str)
                except:
                    parsed_args = inp_str
        except Exception:
            parsed_args = inp_str

        actual = None
        passed = False
        err_msg = ""

        try:
            if isinstance(parsed_args, dict) and param_count > 1:
                try:
                    actual = target_fn(**parsed_args)
                except TypeError:
                    actual = target_fn(*parsed_args.values())
            elif isinstance(parsed_args, (list, tuple)) and param_count > 1 and len(parsed_args) == param_count:
                actual = target_fn(*parsed_args)
            else:
                actual = target_fn(parsed_args)

            actual_norm = normalize_val(actual)
            
            # Smart comparison: direct string or numeric or boolean equivalence
            clean_exp = expected.lower().replace("'", '"').strip()
            clean_act = actual_norm.lower().replace("'", '"').strip()
            
            passed = (clean_act == clean_exp) or (str(actual).strip() == str(tc.get("expectedOutput", "")).strip())
            
            # Numeric fallback if both are numbers (e.g., 5 vs 5.0)
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

        results.append({
            "testCaseIndex": i + 1,
            "input": inp_str,
            "expectedOutput": str(tc.get("expectedOutput", "")),
            "actualOutput": str(actual if actual is not None else actual_norm),
            "passed": passed,
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

      child.stdin.write(JSON.stringify({ code, testCases }));
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
      const rawInput = String(tc.input || '').trim();
      let parsedArg;
      try {
        parsedArg = JSON.parse(rawInput);
      } catch {
        parsedArg = rawInput;
      }

      let actual;
      let passed = false;
      let error = '';

      try {
        actual = targetFn(parsedArg);
        const actualStr = actual === null ? 'null' : actual === undefined ? 'undefined' : typeof actual === 'object' ? JSON.stringify(actual) : String(actual);
        const expectedStr = String(tc.expectedOutput || '').trim();

        passed = (actualStr.toLowerCase() === expectedStr.toLowerCase()) || (actualStr === expectedStr);
        if (passed) passCount++;
        else error = `Output mismatch: expected ${expectedStr}, got ${actualStr}`;
      } catch (runErr) {
        actual = 'Runtime Error';
        error = runErr.message;
      }

      testResults.push({
        testCaseIndex: i + 1,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: String(actual),
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
  }
};


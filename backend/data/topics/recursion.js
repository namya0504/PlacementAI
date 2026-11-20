/**
 * Canonical DSA Placement Problems: RECURSION (20 Questions)
 * 7 Easy, 9 Medium, 4 Hard
 */

import { createCanonicalProblem } from './topicProblemHelper.js';

export const RECURSION_PROBLEMS = [
  // 1. Fibonacci Number (Easy)
  createCanonicalProblem({
    problemId: 'dsa_recursion_01',
    topicId: 'recursion',
    order: 1,
    title: 'Fibonacci Number',
    difficulty: 'Easy',
    tags: ['Recursion', 'Math', 'Dynamic Programming'],
    statement: `The **Fibonacci numbers**, commonly denoted \`F(n)\` form a sequence such that each number is the sum of the two preceding ones, starting from \`0\` and \`1\`. That is:
- \`F(0) = 0, F(1) = 1\`
- \`F(n) = F(n - 1) + F(n - 2)\`, for \`n > 1\`.

Given \`n\`, calculate \`F(n)\`.`,
    inputFormat: `First line: integer n.`,
    outputFormat: `Print F(n).`,
    constraints: ['0 <= n <= 30'],
    examples: [
      {
        input: '2',
        displayInput: 'n = 2',
        output: '1',
        displayOutput: '1',
        explanation: 'F(2) = F(1) + F(0) = 1 + 0 = 1.'
      },
      {
        input: '3',
        displayInput: 'n = 3',
        output: '2',
        displayOutput: '2',
        explanation: 'F(3) = F(2) + F(1) = 1 + 1 = 2.'
      },
      {
        input: '4',
        displayInput: 'n = 4',
        output: '3',
        displayOutput: '3',
        explanation: 'F(4) = F(3) + F(2) = 2 + 1 = 3.'
      }
    ],
    hints: [
      'Base cases: if n == 0 return 0; if n == 1 return 1.',
      'Recursive relation: fib(n) = fib(n - 1) + fib(n - 2).',
      'Memoize with a table or dictionary to avoid redundant computations.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t.length) return;\n    const n = parseInt(t[0], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['2', '3', '4'],
    hiddenInputs: ['0', '1', '10', '20'],
    solveFunction: (stdin) => {
      const n = parseInt(stdin.trim(), 10);
      if (n <= 0) return '0';
      if (n === 1) return '1';
      let a = 0, b = 1;
      for (let i = 2; i <= n; i++) {
        const c = a + b;
        a = b;
        b = c;
      }
      return String(b);
    }
  }),

  // 2. Factorial of a Number (Easy)
  createCanonicalProblem({
    problemId: 'dsa_recursion_02',
    topicId: 'recursion',
    order: 2,
    title: 'Factorial of a Number',
    difficulty: 'Easy',
    tags: ['Recursion', 'Math'],
    statement: `Given an integer \`N\`, calculate its factorial \`N!\` recursively.

Note that \`0! = 1\` and for \`N > 0\`, \`N! = N * (N - 1)!\`.`,
    inputFormat: `First line: integer N.`,
    outputFormat: `Print the factorial of N.`,
    constraints: ['0 <= N <= 18'],
    examples: [
      {
        input: '5',
        displayInput: 'N = 5',
        output: '120',
        displayOutput: '120',
        explanation: '5! = 5 * 4 * 3 * 2 * 1 = 120.'
      },
      {
        input: '0',
        displayInput: 'N = 0',
        output: '1',
        displayOutput: '1',
        explanation: '0! is defined as 1.'
      }
    ],
    hints: [
      'Base condition: if N <= 1 return 1.',
      'Recursive step: fact(N) = N * fact(N - 1).'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        long n = sc.nextLong();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    long long n; if (!(cin >> n)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t.length) return;\n    const n = BigInt(t[0]);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['5', '0'],
    hiddenInputs: ['1', '3', '7', '12'],
    solveFunction: (stdin) => {
      let n = BigInt(stdin.trim());
      if (n <= 1n) return '1';
      let res = 1n;
      for (let i = 2n; i <= n; i++) res *= i;
      return res.toString();
    }
  }),

  // 3. Sum of Digits of a Number (Easy)
  createCanonicalProblem({
    problemId: 'dsa_recursion_03',
    topicId: 'recursion',
    order: 3,
    title: 'Sum of Digits of a Number',
    difficulty: 'Easy',
    tags: ['Recursion', 'Math'],
    statement: `Given an integer \`n\`, calculate the sum of its digits recursively until a single digit or final sum is produced. Here, simply return the direct sum of its digits.`,
    inputFormat: `First line: integer n.`,
    outputFormat: `Print the sum of digits of n.`,
    constraints: ['0 <= n <= 10^9'],
    examples: [
      {
        input: '12345',
        displayInput: 'n = 12345',
        output: '15',
        displayOutput: '15',
        explanation: '1 + 2 + 3 + 4 + 5 = 15.'
      },
      {
        input: '0',
        displayInput: 'n = 0',
        output: '0',
        displayOutput: '0',
        explanation: 'Sum of digits of 0 is 0.'
      }
    ],
    hints: [
      'Base condition: if n == 0 return 0.',
      'Recursive step: sumDigits(n) = (n % 10) + sumDigits(Math.floor(n / 10)).'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    long long n; if (!(cin >> n)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t.length) return;\n    const n = parseInt(t[0], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['12345', '0'],
    hiddenInputs: ['999', '1000', '7'],
    solveFunction: (stdin) => {
      const str = stdin.trim();
      let sum = 0;
      for (const d of str) sum += parseInt(d, 10);
      return String(sum);
    }
  }),

  // 4. Power of Two (Easy)
  createCanonicalProblem({
    problemId: 'dsa_recursion_04',
    topicId: 'recursion',
    order: 4,
    title: 'Power of Two',
    difficulty: 'Easy',
    tags: ['Recursion', 'Math', 'Bit Manipulation'],
    statement: `Given an integer \`n\`, return \`true\` if it is a power of two. Otherwise, return \`false\`.

An integer \`n\` is a power of two, if there exists an integer \`x\` such that \`n == 2^x\`.`,
    inputFormat: `First line: integer n.`,
    outputFormat: `Print 'true' if n is a power of two, else 'false'.`,
    constraints: ['-2^31 <= n <= 2^31 - 1'],
    examples: [
      {
        input: '1',
        displayInput: 'n = 1',
        output: 'true',
        displayOutput: 'true',
        explanation: '2^0 = 1.'
      },
      {
        input: '16',
        displayInput: 'n = 16',
        output: 'true',
        displayOutput: 'true',
        explanation: '2^4 = 16.'
      },
      {
        input: '3',
        displayInput: 'n = 3',
        output: 'false',
        displayOutput: 'false',
        explanation: '3 is not a power of 2.'
      }
    ],
    hints: [
      'If n <= 0 return false. If n == 1 return true.',
      'If n is odd (n % 2 != 0), it cannot be a power of two.',
      'Recursively check isPowerOfTwo(n / 2).'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t.length) return;\n    const n = parseInt(t[0], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['1', '16', '3'],
    hiddenInputs: ['0', '-16', '1024', '6'],
    solveFunction: (stdin) => {
      const n = parseInt(stdin.trim(), 10);
      if (n <= 0) return 'false';
      return (n & (n - 1)) === 0 ? 'true' : 'false';
    }
  }),

  // 5. Power of Three (Easy)
  createCanonicalProblem({
    problemId: 'dsa_recursion_05',
    topicId: 'recursion',
    order: 5,
    title: 'Power of Three',
    difficulty: 'Easy',
    tags: ['Recursion', 'Math'],
    statement: `Given an integer \`n\`, return \`true\` if it is a power of three. Otherwise, return \`false\`.

An integer \`n\` is a power of three, if there exists an integer \`x\` such that \`n == 3^x\`.`,
    inputFormat: `First line: integer n.`,
    outputFormat: `Print 'true' if n is a power of three, else 'false'.`,
    constraints: ['-2^31 <= n <= 2^31 - 1'],
    examples: [
      {
        input: '27',
        displayInput: 'n = 27',
        output: 'true',
        displayOutput: 'true',
        explanation: '3^3 = 27.'
      },
      {
        input: '0',
        displayInput: 'n = 0',
        output: 'false',
        displayOutput: 'false',
        explanation: '0 is not a power of 3.'
      },
      {
        input: '-1',
        displayInput: 'n = -1',
        output: 'false',
        displayOutput: 'false',
        explanation: 'Negative numbers are not powers of 3.'
      }
    ],
    hints: [
      'If n <= 0 return false; if n == 1 return true.',
      'If n % 3 != 0 return false.',
      'Recursively check isPowerOfThree(n / 3).'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t.length) return;\n    const n = parseInt(t[0], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['27', '0', '-1'],
    hiddenInputs: ['1', '9', '45', '81'],
    solveFunction: (stdin) => {
      let n = parseInt(stdin.trim(), 10);
      if (n <= 0) return 'false';
      while (n % 3 === 0) n /= 3;
      return n === 1 ? 'true' : 'false';
    }
  }),

  // 6. Print 1 to N without Loop (Easy)
  createCanonicalProblem({
    problemId: 'dsa_recursion_06',
    topicId: 'recursion',
    order: 6,
    title: 'Print 1 to N without Loop',
    difficulty: 'Easy',
    tags: ['Recursion'],
    statement: `Print numbers from 1 to N without the help of loops. Use recursion to output space-separated numbers from 1 up to N.`,
    inputFormat: `First line: integer N.`,
    outputFormat: `Print numbers from 1 to N separated by spaces.`,
    constraints: ['1 <= N <= 1000'],
    examples: [
      {
        input: '5',
        displayInput: 'N = 5',
        output: '1 2 3 4 5',
        displayOutput: '1 2 3 4 5',
        explanation: 'Numbers from 1 to 5 printed sequentially.'
      },
      {
        input: '1',
        displayInput: 'N = 1',
        output: '1',
        displayOutput: '1',
        explanation: 'Single element 1.'
      }
    ],
    hints: [
      'Call recursive function printNos(N - 1) before printing N.',
      'Base condition: if N == 0 return.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t.length) return;\n    const n = parseInt(t[0], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['5', '1'],
    hiddenInputs: ['2', '10', '20'],
    solveFunction: (stdin) => {
      const n = parseInt(stdin.trim(), 10);
      const res = [];
      for (let i = 1; i <= n; i++) res.push(i);
      return res.join(' ');
    }
  }),

  // 7. Reverse an Array using Recursion (Easy)
  createCanonicalProblem({
    problemId: 'dsa_recursion_07',
    topicId: 'recursion',
    order: 7,
    title: 'Reverse an Array using Recursion',
    difficulty: 'Easy',
    tags: ['Recursion', 'Array', 'Two Pointers'],
    statement: `Given an array of integers \`nums\`, reverse the array using recursion.

Output the reversed array separated by spaces.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the reversed array separated by spaces.`,
    constraints: ['1 <= nums.length <= 1000', '-10^4 <= nums[i] <= 10^4'],
    examples: [
      {
        input: '4\n1 2 3 4',
        displayInput: 'nums = [1, 2, 3, 4]',
        output: '4 3 2 1',
        displayOutput: '[4, 3, 2, 1]',
        explanation: 'Array is reversed.'
      },
      {
        input: '1\n10',
        displayInput: 'nums = [10]',
        output: '10',
        displayOutput: '[10]',
        explanation: 'Single element remains same.'
      }
    ],
    hints: [
      'Define helper function rev(left, right).',
      'Base condition: if left >= right return.',
      'Swap nums[left] and nums[right], then call rev(left + 1, right - 1).'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['4\n1 2 3 4', '1\n10'],
    hiddenInputs: ['2\n5 9', '5\n1 2 3 4 5'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      return nums.reverse().join(' ');
    }
  }),

  // 8. Pow(x, n) (Binary Exponentiation) (Medium)
  createCanonicalProblem({
    problemId: 'dsa_recursion_08',
    topicId: 'recursion',
    order: 8,
    title: 'Pow(x, n) (Binary Exponentiation)',
    difficulty: 'Medium',
    tags: ['Recursion', 'Math', 'Divide and Conquer'],
    statement: `Implement \`pow(x, n)\`, which calculates \`x\` raised to the power \`n\` (i.e., \`x^n\`) using divide and conquer in **O(log N)** time. Format output to **5 decimal places**.`,
    inputFormat: `First line: float x.
Second line: integer n.`,
    outputFormat: `Print x^n formatted to 5 decimal places.`,
    constraints: ['-100.0 < x < 100.0', '-2^31 <= n <= 2^31 - 1', 'n is an integer.'],
    examples: [
      {
        input: '2.00000\n10',
        displayInput: 'x = 2.00000, n = 10',
        output: '1024.00000',
        displayOutput: '1024.00000',
        explanation: '2^10 = 1024.'
      },
      {
        input: '2.10000\n3',
        displayInput: 'x = 2.10000, n = 3',
        output: '9.26100',
        displayOutput: '9.26100',
        explanation: '2.1^3 = 9.261.'
      },
      {
        input: '2.00000\n-2',
        displayInput: 'x = 2.00000, n = -2',
        output: '0.25000',
        displayOutput: '0.25000',
        explanation: '2^-2 = 1/4 = 0.25.'
      }
    ],
    hints: [
      'If n < 0, compute 1.0 / pow(x, -n).',
      'If n % 2 == 0: pow(x, n) = pow(x * x, n / 2).',
      'If n % 2 == 1: pow(x, n) = x * pow(x * x, (n - 1) / 2).'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if len(t) < 2: return\n    x, n = float(t[0]), int(t[1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        double x = sc.nextDouble();\n        long n = sc.nextLong();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <iomanip>\nusing namespace std;\nint main() {\n    double x; long long n; if (!(cin >> x >> n)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const x = parseFloat(t[0]), n = parseInt(t[1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['2.00000\n10', '2.10000\n3', '2.00000\n-2'],
    hiddenInputs: ['1.0\n2147483647', '-1.0\n2', '-1.0\n3', '0.5\n4'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const x = parseFloat(t[0]), n = parseInt(t[1], 10);
      const myPow = (base, exp) => {
        if (exp === 0) return 1;
        if (exp < 0) return 1 / myPow(base, -exp);
        const half = myPow(base, Math.floor(exp / 2));
        if (exp % 2 === 0) return half * half;
        return half * half * base;
      };
      return myPow(x, n).toFixed(5);
    }
  }),

  // 9. K-th Symbol in Grammar (Medium)
  createCanonicalProblem({
    problemId: 'dsa_recursion_09',
    topicId: 'recursion',
    order: 9,
    title: 'K-th Symbol in Grammar',
    difficulty: 'Medium',
    tags: ['Recursion', 'Bit Manipulation', 'Math'],
    statement: `We build a table of \`n\` rows (1-indexed). We start by writing \`0\` in the 1st row. In every subsequent row, we look at the previous row and replace each occurrence of \`0\` with \`01\`, and each occurrence of \`1\` with \`10\`.

Given two integer \`n\` and \`k\`, return the \`k\`th (1-indexed) symbol in the \`n\`th row of a table of \`n\` rows.`,
    inputFormat: `First line: integers n and k.`,
    outputFormat: `Print the kth symbol (0 or 1).`,
    constraints: ['1 <= n <= 30', '1 <= k <= 2^(n - 1)'],
    examples: [
      {
        input: '1 1',
        displayInput: 'n = 1, k = 1',
        output: '0',
        displayOutput: '0',
        explanation: 'row 1: 0.'
      },
      {
        input: '2 1',
        displayInput: 'n = 2, k = 1',
        output: '0',
        displayOutput: '0',
        explanation: 'row 2: 01. 1st is 0.'
      },
      {
        input: '2 2',
        displayInput: 'n = 2, k = 2',
        output: '1',
        displayOutput: '1',
        explanation: 'row 2: 01. 2nd is 1.'
      }
    ],
    hints: [
      'Notice that the first half of row N is identical to row N - 1.',
      'The second half of row N is the bitwise inverse of row N - 1.',
      'If k <= 2^(N-2), answer is kthGrammar(n - 1, k). Else, answer is 1 - kthGrammar(n - 1, k - 2^(N-2)).'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if len(t) < 2: return\n    n, k = int(t[0]), int(t[1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt(), k = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    int n, k; if (!(cin >> n >> k)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10), k = parseInt(t[1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['1 1', '2 1', '2 2'],
    hiddenInputs: ['3 3', '4 5', '5 8'],
    solveFunction: (stdin) => {
      const [n, k] = stdin.trim().split(/\s+/).map(Number);
      const kth = (row, col) => {
        if (row === 1) return 0;
        const parent = kth(row - 1, Math.ceil(col / 2));
        const isOdd = col % 2 === 1;
        if (parent === 0) return isOdd ? 0 : 1;
        return isOdd ? 1 : 0;
      };
      return String(kth(n, k));
    }
  }),

  // 10. Subsets Generation (Power Set) (Medium)
  createCanonicalProblem({
    problemId: 'dsa_recursion_10',
    topicId: 'recursion',
    order: 10,
    title: 'Subsets Generation (Power Set)',
    difficulty: 'Medium',
    tags: ['Recursion', 'Backtracking', 'Bit Manipulation'],
    statement: `Given an integer array \`nums\` of **unique** elements, return all possible subsets (the power set).

The solution set must not contain duplicate subsets. Print each subset on a new line with elements sorted ascending separated by spaces. Print empty subsets as empty lines.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print each subset on a new line.`,
    constraints: ['1 <= nums.length <= 10', '-10 <= nums[i] <= 10', 'All numbers in nums are unique.'],
    examples: [
      {
        input: '3\n1 2 3',
        displayInput: 'nums = [1, 2, 3]',
        output: '\n1\n1 2\n1 2 3\n1 3\n2\n2 3\n3',
        displayOutput: '[[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]',
        explanation: 'All 2^3 = 8 subsets.'
      }
    ],
    hints: [
      'At each index, you have two choices: include nums[i] or exclude nums[i].',
      'Recursively explore both branches.',
      'Collect current subset when base condition (index == N) is reached.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['3\n1 2 3'],
    hiddenInputs: ['1\n0', '2\n1 2'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number).sort((a, b) => a - b);
      const res = [];
      const backtrack = (idx, path) => {
        res.push(path.join(' '));
        for (let i = idx; i < n; i++) {
          path.push(nums[i]);
          backtrack(i + 1, path);
          path.pop();
        }
      };
      backtrack(0, []);
      return res.join('\n');
    }
  }),

  // 11. Combination Sum (Medium)
  createCanonicalProblem({
    problemId: 'dsa_recursion_11',
    topicId: 'recursion',
    order: 11,
    title: 'Combination Sum',
    difficulty: 'Medium',
    tags: ['Recursion', 'Backtracking', 'Array'],
    statement: `Given an array of **distinct** integers \`candidates\` and a target integer \`target\`, return a list of all **unique combinations** of \`candidates\` where the chosen numbers sum to \`target\`. You may return the combinations in any order.

The **same** number may be chosen from \`candidates\` an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer target.`,
    outputFormat: `Print each combination space-separated on a new line.`,
    constraints: ['1 <= candidates.length <= 30', '2 <= candidates[i] <= 40', 'All elements of candidates are distinct.', '1 <= target <= 40'],
    examples: [
      {
        input: '4\n2 3 6 7\n7',
        displayInput: 'candidates = [2,3,6,7], target = 7',
        output: '2 2 3\n7',
        displayOutput: '[[2,2,3],[7]]',
        explanation: '2 and 3 can form 2+2+3 = 7. 7 is also a candidate.'
      },
      {
        input: '3\n2 3 5\n8',
        displayInput: 'candidates = [2,3,5], target = 8',
        output: '2 2 2 2\n2 3 3\n3 5',
        displayOutput: '[[2,2,2,2],[2,3,3],[3,5]]',
        explanation: 'Combinations that sum to 8.'
      }
    ],
    hints: [
      'Sort candidates first.',
      'At each recursive step, either take the current candidate again (target - candidate) without advancing the index, or move to the next index.',
      'Stop when target == 0 (found valid combination) or target < 0.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    cands = [int(x) for x in t[1:n+1]]\n    target = int(t[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int target = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int target; cin >> target;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const cands = t.slice(1, n + 1).map(Number);\n    const target = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['4\n2 3 6 7\n7', '3\n2 3 5\n8'],
    hiddenInputs: ['1\n2\n1', '2\n3 5\n11', '3\n2 4 6\n8'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const cands = t.slice(1, n + 1).map(Number).sort((a, b) => a - b);
      const target = parseInt(t[n + 1], 10);
      const res = [];
      const backtrack = (idx, rem, path) => {
        if (rem === 0) { res.push(path.join(' ')); return; }
        for (let i = idx; i < n; i++) {
          if (cands[i] > rem) break;
          path.push(cands[i]);
          backtrack(i, rem - cands[i], path);
          path.pop();
        }
      };
      backtrack(0, target, []);
      return res.join('\n');
    }
  }),

  // 12. Permutations of Array (Medium)
  createCanonicalProblem({
    problemId: 'dsa_recursion_12',
    topicId: 'recursion',
    order: 12,
    title: 'Permutations of Array',
    difficulty: 'Medium',
    tags: ['Recursion', 'Backtracking', 'Array'],
    statement: `Given an array \`nums\` of distinct integers, return all the possible **permutations**. You can return the answer in any order. Print each permutation space-separated on a new line in lexicographical order.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print each permutation on a new line.`,
    constraints: ['1 <= nums.length <= 6', '-10 <= nums[i] <= 10', 'All the integers of nums are unique.'],
    examples: [
      {
        input: '3\n1 2 3',
        displayInput: 'nums = [1, 2, 3]',
        output: '1 2 3\n1 3 2\n2 1 3\n2 3 1\n3 1 2\n3 2 1',
        displayOutput: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]',
        explanation: 'All 3! = 6 permutations.'
      },
      {
        input: '1\n1',
        displayInput: 'nums = [1]',
        output: '1',
        displayOutput: '[[1]]',
        explanation: 'Single element permutation.'
      }
    ],
    hints: [
      'Sort nums initially to produce permutations in lexicographical order.',
      'Use a boolean visited array to track which elements are currently chosen.',
      'Recursively build permutations of length N.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['3\n1 2 3', '1\n1'],
    hiddenInputs: ['2\n0 1', '3\n5 1 2'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number).sort((a, b) => a - b);
      const res = [];
      const used = new Array(n).fill(false);
      const backtrack = (path) => {
        if (path.length === n) { res.push(path.join(' ')); return; }
        for (let i = 0; i < n; i++) {
          if (used[i]) continue;
          used[i] = true;
          path.push(nums[i]);
          backtrack(path);
          path.pop();
          used[i] = false;
        }
      };
      backtrack([]);
      return res.join('\n');
    }
  }),

  // 13. Tower of Hanoi (Medium)
  createCanonicalProblem({
    problemId: 'dsa_recursion_13',
    topicId: 'recursion',
    order: 13,
    title: 'Tower of Hanoi',
    difficulty: 'Medium',
    tags: ['Recursion'],
    statement: `The **Tower of Hanoi** is a mathematical puzzle with 3 rods (from 1 to 3) and \`N\` disks. Given \`N\`, print the total number of moves followed by each step moving a disk from rod A to rod C using rod B as auxiliary.

Format for each move: \`move disk X from rod A to rod B\`.`,
    inputFormat: `First line: integer N.`,
    outputFormat: `First line: total number of moves (2^N - 1).
Next lines: each move description.`,
    constraints: ['1 <= N <= 16'],
    examples: [
      {
        input: '2',
        displayInput: 'N = 2',
        output: '3\nmove disk 1 from rod 1 to rod 2\nmove disk 2 from rod 1 to rod 3\nmove disk 1 from rod 2 to rod 3',
        displayOutput: '3 moves',
        explanation: 'Total moves is 2^2 - 1 = 3.'
      }
    ],
    hints: [
      'To move N disks from A to C using B:',
      '1. Move N - 1 disks from A to B using C.',
      '2. Move disk N from A to C.',
      '3. Move N - 1 disks from B to C using A.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t.length) return;\n    const n = parseInt(t[0], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['2'],
    hiddenInputs: ['1', '3', '4'],
    solveFunction: (stdin) => {
      const n = parseInt(stdin.trim(), 10);
      const moves = [];
      const hanoi = (disk, from, to, aux) => {
        if (disk === 0) return;
        hanoi(disk - 1, from, aux, to);
        moves.push(`move disk ${disk} from rod ${from} to rod ${to}`);
        hanoi(disk - 1, aux, to, from);
      };
      hanoi(n, 1, 3, 2);
      return `${moves.length}\n${moves.join('\n')}`;
    }
  }),

  // 14. Generate Parentheses (Medium)
  createCanonicalProblem({
    problemId: 'dsa_recursion_14',
    topicId: 'recursion',
    order: 14,
    title: 'Generate Parentheses',
    difficulty: 'Medium',
    tags: ['Recursion', 'Backtracking', 'String'],
    statement: `Given \`n\` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.

Print each valid combination on a new line.`,
    inputFormat: `First line: integer n.`,
    outputFormat: `Print each well-formed parentheses string on a new line.`,
    constraints: ['1 <= n <= 8'],
    examples: [
      {
        input: '3',
        displayInput: 'n = 3',
        output: '((()))\n(()())\n(())()\n()(())\n()()()',
        displayOutput: '["((()))","(()())","(())()","()(())","()()()"]',
        explanation: '5 valid combinations for n = 3.'
      },
      {
        input: '1',
        displayInput: 'n = 1',
        output: '()',
        displayOutput: '["()"]',
        explanation: 'Only 1 valid combination.'
      }
    ],
    hints: [
      'Maintain count of open and close brackets used so far.',
      'You can add \'(\' if open < n.',
      'You can add \')\' if close < open.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t.length) return;\n    const n = parseInt(t[0], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['3', '1'],
    hiddenInputs: ['2', '4'],
    solveFunction: (stdin) => {
      const n = parseInt(stdin.trim(), 10);
      const res = [];
      const backtrack = (open, close, cur) => {
        if (cur.length === 2 * n) { res.push(cur); return; }
        if (open < n) backtrack(open + 1, close, cur + '(');
        if (close < open) backtrack(open, close + 1, cur + ')');
      };
      backtrack(0, 0, '');
      return res.join('\n');
    }
  }),

  // 15. Flatten a Nested List using Recursion (Medium)
  createCanonicalProblem({
    problemId: 'dsa_recursion_15',
    topicId: 'recursion',
    order: 15,
    title: 'Flatten a Nested List using Recursion',
    difficulty: 'Medium',
    tags: ['Recursion', 'Array'],
    statement: `Given a string representing a nested list of integers, return the flat list of all integers in the order they appear.

Output the flat integers separated by spaces.`,
    inputFormat: `First line: string representing nested list (e.g. [[1,1],2,[1,1]]).`,
    outputFormat: `Print the space-separated integers in flattened order.`,
    constraints: ['1 <= string.length <= 10^4'],
    examples: [
      {
        input: '[[1,1],2,[1,1]]',
        displayInput: 'nestedList = [[1,1],2,[1,1]]',
        output: '1 1 2 1 1',
        displayOutput: '[1, 1, 2, 1, 1]',
        explanation: 'Flattened list.'
      },
      {
        input: '[1,[4,[6]]]',
        displayInput: 'nestedList = [1,[4,[6]]]',
        output: '1 4 6',
        displayOutput: '[1, 4, 6]',
        explanation: 'Recursively flattened.'
      }
    ],
    hints: [
      'Parse integers ignoring brackets and commas.',
      'Recursively traverse any nested array encountered.'
    ],
    starterCode: {
      python: `import sys\nimport re\n\ndef solve():\n    s = sys.stdin.read().strip()\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String s = sc.next();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s; if (!(cin >> s)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const s = fs.readFileSync(0, 'utf-8').trim();\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['[[1,1],2,[1,1]]', '[1,[4,[6]]]'],
    hiddenInputs: ['[]', '[1]', '[[-1],[-2]]'],
    solveFunction: (stdin) => {
      const s = stdin.trim();
      const matches = s.match(/-?\d+/g);
      return matches ? matches.join(' ') : '';
    }
  }),

  // 16. Count Good Numbers (Medium)
  createCanonicalProblem({
    problemId: 'dsa_recursion_16',
    topicId: 'recursion',
    order: 16,
    title: 'Count Good Numbers',
    difficulty: 'Medium',
    tags: ['Recursion', 'Math', 'Divide and Conquer'],
    statement: `A digit string is **good** if the digits (0-indexed) at even indices are **even** (0, 2, 4, 6, 8) and the digits at odd indices are **prime** (2, 3, 5, 7).

Given an integer \`n\`, return the **total number of good digit strings** of length \`n\`. Since the answer may be large, return it **modulo 10^9 + 7**.`,
    inputFormat: `First line: integer n.`,
    outputFormat: `Print the count modulo 10^9 + 7.`,
    constraints: ['1 <= n <= 10^15'],
    examples: [
      {
        input: '1',
        displayInput: 'n = 1',
        output: '5',
        displayOutput: '5',
        explanation: 'Even index 0 can be 0, 2, 4, 6, 8 (5 choices).'
      },
      {
        input: '4',
        displayInput: 'n = 4',
        output: '400',
        displayOutput: '400',
        explanation: '5 * 4 * 5 * 4 = 400.'
      },
      {
        input: '50',
        displayInput: 'n = 50',
        output: '564908303',
        displayOutput: '564908303',
        explanation: 'Calculated modulo 10^9 + 7.'
      }
    ],
    hints: [
      'Number of even positions is ceil(n / 2), each with 5 choices.',
      'Number of odd positions is floor(n / 2), each with 4 choices.',
      'Use modular binary exponentiation (5^even * 4^odd) % (10^9 + 7).'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLong()) return;\n        long n = sc.nextLong();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    long long n; if (!(cin >> n)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t.length) return;\n    const n = BigInt(t[0]);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['1', '4', '50'],
    hiddenInputs: ['2', '5', '1000'],
    solveFunction: (stdin) => {
      const n = BigInt(stdin.trim());
      const MOD = 1000000007n;
      const power = (base, exp) => {
        let res = 1n;
        base = base % MOD;
        while (exp > 0n) {
          if (exp % 2n === 1n) res = (res * base) % MOD;
          base = (base * base) % MOD;
          exp /= 2n;
        }
        return res;
      };
      const evenCount = (n + 1n) / 2n;
      const oddCount = n / 2n;
      const ans = (power(5n, evenCount) * power(4n, oddCount)) % MOD;
      return ans.toString();
    }
  }),

  // 17. Josephus Problem (Hard)
  createCanonicalProblem({
    problemId: 'dsa_recursion_17',
    topicId: 'recursion',
    order: 17,
    title: 'Josephus Problem',
    difficulty: 'Hard',
    tags: ['Recursion', 'Math'],
    statement: `There are \`N\` people standing in a circle waiting to be executed numbered from \`1\` to \`N\`. The counting begins at point 1 in the circle and proceeds around the circle in a fixed direction. In each step, a certain number of people are skipped and the next person is executed. The elimination proceeds around the circle (which is becoming smaller and smaller as the executed people are removed), until only the last person remains, who is given freedom.

Given the total number of persons \`N\` and a number \`K\` which indicates that \`K-1\` persons are skipped and the \`K\`th person is killed in circle, find the 1-based position of the safe person.`,
    inputFormat: `First line: integers N and K.`,
    outputFormat: `Print the 1-based position of the safe survivor.`,
    constraints: ['1 <= N, K <= 10^5'],
    examples: [
      {
        input: '5 2',
        displayInput: 'N = 5, K = 2',
        output: '3',
        displayOutput: '3',
        explanation: 'Elimination order: 2, 4, 1, 5. Person 3 survives.'
      },
      {
        input: '7 3',
        displayInput: 'N = 7, K = 3',
        output: '4',
        displayOutput: '4',
        explanation: 'Elimination order: 3, 6, 2, 7, 5, 1. Person 4 survives.'
      }
    ],
    hints: [
      'Josephus recurrence (0-based): J(1, K) = 0.',
      'J(N, K) = (J(N - 1, K) + K) % N.',
      'Convert to 1-based: J(N, K) + 1.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if len(t) < 2: return\n    n, k = int(t[0]), int(t[1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt(), k = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    int n, k; if (!(cin >> n >> k)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10), k = parseInt(t[1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['5 2', '7 3'],
    hiddenInputs: ['1 1', '4 2', '6 5'],
    solveFunction: (stdin) => {
      const [n, k] = stdin.trim().split(/\s+/).map(Number);
      let res = 0;
      for (let i = 2; i <= n; i++) res = (res + k) % i;
      return String(res + 1);
    }
  }),

  // 18. Word Search (Grid Recursion) (Hard)
  createCanonicalProblem({
    problemId: 'dsa_recursion_18',
    topicId: 'recursion',
    order: 18,
    title: 'Word Search (Grid Recursion)',
    difficulty: 'Hard',
    tags: ['Recursion', 'Backtracking', 'Matrix'],
    statement: `Given an \`m x n\` grid of characters \`board\` and a string \`word\`, return \`true\` if \`word\` exists in the grid.

The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.`,
    inputFormat: `First line: integers M and N.
Next M lines: N space-separated characters.
Last line: target word string.`,
    outputFormat: `Print 'true' if word exists in board, else 'false'.`,
    constraints: ['m == board.length', 'n = board[i].length', '1 <= m, n <= 6', '1 <= word.length <= 15'],
    examples: [
      {
        input: '3 4\nA B C E\nS F C S\nA D E E\nABCCED',
        displayInput: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"',
        output: 'true',
        displayOutput: 'true',
        explanation: 'Path: (0,0)->(0,1)->(0,2)->(1,2)->(2,2)->(2,1).'
      },
      {
        input: '3 4\nA B C E\nS F C S\nA D E E\nSEE',
        displayInput: 'word = "SEE"',
        output: 'true',
        displayOutput: 'true',
        explanation: 'Path: (1,3)->(2,3)->(2,2).'
      },
      {
        input: '3 4\nA B C E\nS F C S\nA D E E\nABCB',
        displayInput: 'word = "ABCB"',
        output: 'false',
        displayOutput: 'false',
        explanation: 'Cannot reuse same cell.'
      }
    ],
    hints: [
      'Iterate through every cell (r, c) as potential starting point.',
      'Use 4-directional DFS helper dfs(r, c, idx).',
      'Temporarily mark visited cell with \'#\', restore upon return.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    lines = sys.stdin.read().strip().splitlines()\n    if not lines: return\n    m, n = map(int, lines[0].split())\n    board = [lines[i].split() for i in range(1, m + 1)]\n    word = lines[m + 1].strip()\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int m = sc.nextInt(), n = sc.nextInt();\n        char[][] b = new char[m][n];\n        for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) b[i][j] = sc.next().charAt(0);\n        String word = sc.next();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\nint main() {\n    int m, n; if (!(cin >> m >> n)) return 0;\n    vector<vector<char>> b(m, vector<char>(n));\n    for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) cin >> b[i][j];\n    string word; cin >> word;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const lines = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/).filter(Boolean);\n    if (lines.length < 2) return;\n    const [m, n] = lines[0].split(/\\s+/).map(Number);\n    const board = lines.slice(1, m + 1).map(l => l.split(/\\s+/));\n    const word = lines[m + 1].trim();\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['3 4\nA B C E\nS F C S\nA D E E\nABCCED', '3 4\nA B C E\nS F C S\nA D E E\nSEE', '3 4\nA B C E\nS F C S\nA D E E\nABCB'],
    hiddenInputs: ['1 1\nA\nA', '1 1\nA\nB', '2 2\nA B\nC D\nACDB'],
    solveFunction: (stdin) => {
      const lines = stdin.trim().split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const [m, n] = lines[0].split(/\s+/).map(Number);
      const board = lines.slice(1, m + 1).map(l => l.split(/\s+/));
      const word = lines[m + 1].trim();
      const dfs = (r, c, k) => {
        if (k === word.length) return true;
        if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== word[k]) return false;
        const tmp = board[r][c];
        board[r][c] = '#';
        const found = dfs(r + 1, c, k + 1) || dfs(r - 1, c, k + 1) || dfs(r, c + 1, k + 1) || dfs(r, c - 1, k + 1);
        board[r][c] = tmp;
        return found;
      };
      for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
          if (dfs(i, j, 0)) return 'true';
        }
      }
      return 'false';
    }
  }),

  // 19. Predict the Winner (Minimax Recursion) (Hard)
  createCanonicalProblem({
    problemId: 'dsa_recursion_19',
    topicId: 'recursion',
    order: 19,
    title: 'Predict the Winner (Minimax Recursion)',
    difficulty: 'Hard',
    tags: ['Recursion', 'Minimax', 'Dynamic Programming', 'Game Theory'],
    statement: `You are given an integer array \`nums\`. Two players are playing a game with this array: player 1 and player 2.

Player 1 and player 2 take turns, with player 1 starting first. Both players begin with a score of 0. At each turn, a player can pick from either the beginning or the end of the array which reduces the size of the array by 1. The selected score is added to their total score.

Return \`true\` if Player 1 can win the game (or tie). If both players play optimally, return \`false\` otherwise.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print 'true' if Player 1 wins or ties, else 'false'.`,
    constraints: ['1 <= nums.length <= 20', '0 <= nums[i] <= 10^7'],
    examples: [
      {
        input: '3\n1 5 2',
        displayInput: 'nums = [1, 5, 2]',
        output: 'false',
        displayOutput: 'false',
        explanation: 'Player 1 will pick 1 or 2, leaving 5 for player 2. Player 2 wins.'
      },
      {
        input: '4\n1 5 233 7',
        displayInput: 'nums = [1, 5, 233, 7]',
        output: 'true',
        displayOutput: 'true',
        explanation: 'Player 1 picks 1, Player 2 picks 7, Player 1 picks 233 and wins.'
      }
    ],
    hints: [
      'Define scoreDiff(left, right) as the maximum score difference player 1 can achieve over player 2 on nums[left..right].',
      'Take left: nums[left] - scoreDiff(left + 1, right).',
      'Take right: nums[right] - scoreDiff(left, right - 1).',
      'Player 1 wins if scoreDiff(0, N - 1) >= 0.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['3\n1 5 2', '4\n1 5 233 7'],
    hiddenInputs: ['1\n5', '2\n1 2', '4\n1 1 1 1'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      const memo = new Map();
      const diff = (l, r) => {
        if (l === r) return nums[l];
        const key = `${l},${r}`;
        if (memo.has(key)) return memo.get(key);
        const pickL = nums[l] - diff(l + 1, r);
        const pickR = nums[r] - diff(l, r - 1);
        const ans = Math.max(pickL, pickR);
        memo.set(key, ans);
        return ans;
      };
      return diff(0, n - 1) >= 0 ? 'true' : 'false';
    }
  }),

  // 20. Special Binary String (Hard)
  createCanonicalProblem({
    problemId: 'dsa_recursion_20',
    topicId: 'recursion',
    order: 20,
    title: 'Special Binary String',
    difficulty: 'Hard',
    tags: ['Recursion', 'String', 'Divide and Conquer'],
    statement: `Special binary strings are binary strings with the following properties:
- The number of \`0\`'s is equal to the number of \`1\`'s.
- Every prefix of the binary string has at least as many \`1\`'s as \`0\`'s.

You are given a special binary string \`s\`. A move consists of choosing two consecutive, non-empty, special substrings of \`s\`, and swapping them.

Return the **lexicographically largest** resulting string possible after any number of moves.`,
    inputFormat: `First line: string s.`,
    outputFormat: `Print the lexicographically largest special binary string.`,
    constraints: ['1 <= s.length <= 50', 's consists of \'0\' and \'1\'.', 's is a special binary string.'],
    examples: [
      {
        input: '11011000',
        displayInput: 's = "11011000"',
        output: '11100100',
        displayOutput: '"11100100"',
        explanation: 'Decomposed components sorted descending to produce lexicographical maximum.'
      },
      {
        input: '10',
        displayInput: 's = "10"',
        output: '10',
        displayOutput: '"10"',
        explanation: 'Single primitive component.'
      }
    ],
    hints: [
      'Think of \'1\' as \'(\' and \'0\' as \')\'. Special binary strings are valid balanced parentheses sequences.',
      'Decompose s into primitive balanced components \'1\' + sub + \'0\'.',
      'Recursively solve each inner component, sort all components descending, and concatenate.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    s = sys.stdin.read().strip()\n    if not s: return\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String s = sc.next();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s; if (!(cin >> s)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const s = fs.readFileSync(0, 'utf-8').trim();\n    if (!s) return;\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['11011000', '10'],
    hiddenInputs: ['1100', '1010', '110010'],
    solveFunction: (stdin) => {
      const s = stdin.trim();
      const makeLargest = (str) => {
        let count = 0, i = 0;
        const res = [];
        for (let j = 0; j < str.length; j++) {
          if (str[j] === '1') count++;
          else count--;
          if (count === 0) {
            res.push('1' + makeLargest(str.substring(i + 1, j)) + '0');
            i = j + 1;
          }
        }
        res.sort((a, b) => b.localeCompare(a));
        return res.join('');
      };
      return makeLargest(s);
    }
  })
];


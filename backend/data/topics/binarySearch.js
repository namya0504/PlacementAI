/**
 * Canonical DSA Placement Problems: BINARY SEARCH (20 Questions)
 * 7 Easy, 9 Medium, 4 Hard
 */

import { createCanonicalProblem } from './topicProblemHelper.js';

export const BINARY_SEARCH_PROBLEMS = [
  // 1. Binary Search (Easy)
  createCanonicalProblem({
    problemId: 'dsa_binary-search_01',
    topicId: 'binary-search',
    order: 1,
    title: 'Binary Search',
    difficulty: 'Easy',
    tags: ['Binary Search', 'Array'],
    statement: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`.

If \`target\` exists, return its 0-based index. Otherwise, return \`-1\`.

You must write an algorithm with **O(log N)** runtime complexity.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers sorted in ascending order.
Third line: integer target.`,
    outputFormat: `Print the index of target, or -1.`,
    constraints: ['1 <= nums.length <= 10^5', '-10^4 < nums[i], target < 10^4', 'All integers in nums are unique.', 'nums is sorted in ascending order.'],
    examples: [
      {
        input: '6\n-1 0 3 5 9 12\n9',
        displayInput: 'nums = [-1,0,3,5,9,12], target = 9',
        output: '4',
        displayOutput: '4',
        explanation: '9 exists in nums and its index is 4.'
      },
      {
        input: '6\n-1 0 3 5 9 12\n2',
        displayInput: 'nums = [-1,0,3,5,9,12], target = 2',
        output: '-1',
        displayOutput: '-1',
        explanation: '2 does not exist in nums so return -1.'
      }
    ],
    hints: [
      'Maintain left = 0 and right = N - 1.',
      'Calculate mid = left + (right - left) // 2 to avoid integer overflow.',
      'If nums[mid] == target return mid; if nums[mid] < target search right half (left = mid + 1); else search left half (right = mid - 1).'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    target = int(t[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int target = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int target; cin >> target;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    const target = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['6\n-1 0 3 5 9 12\n9', '6\n-1 0 3 5 9 12\n2'],
    hiddenInputs: ['1\n5\n5', '1\n5\n0', '5\n1 2 3 4 5\n1', '5\n1 2 3 4 5\n5'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      const target = parseInt(t[n + 1], 10);
      let l = 0, r = n - 1;
      while (l <= r) {
        const mid = (l + r) >> 1;
        if (nums[mid] === target) return String(mid);
        if (nums[mid] < target) l = mid + 1;
        else r = mid - 1;
      }
      return '-1';
    }
  }),

  // 2. Search Insert Position (Easy)
  createCanonicalProblem({
    problemId: 'dsa_binary-search_02',
    topicId: 'binary-search',
    order: 2,
    title: 'Search Insert Position',
    difficulty: 'Easy',
    tags: ['Binary Search', 'Array'],
    statement: `Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.

You must write an algorithm with **O(log N)** runtime complexity.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers sorted in ascending order.
Third line: integer target.`,
    outputFormat: `Print the index or insertion position.`,
    constraints: ['1 <= nums.length <= 10^4', '-10^4 <= nums[i], target <= 10^4', 'nums contains distinct values sorted in ascending order.'],
    examples: [
      {
        input: '4\n1 3 5 6\n5',
        displayInput: 'nums = [1,3,5,6], target = 5',
        output: '2',
        displayOutput: '2',
        explanation: '5 is at index 2.'
      },
      {
        input: '4\n1 3 5 6\n2',
        displayInput: 'nums = [1,3,5,6], target = 2',
        output: '1',
        displayOutput: '1',
        explanation: '2 is inserted between 1 and 3, which is index 1.'
      },
      {
        input: '4\n1 3 5 6\n7',
        displayInput: 'nums = [1,3,5,6], target = 7',
        output: '4',
        displayOutput: '4',
        explanation: '7 is inserted at the end, index 4.'
      }
    ],
    hints: [
      'This problem is asking for the lower bound (first index with value >= target).',
      'If nums[mid] >= target, answer could be mid or to the left (right = mid - 1).',
      'Otherwise, search right half (left = mid + 1). Return left at the end.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    target = int(t[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int target = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int target; cin >> target;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    const target = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['4\n1 3 5 6\n5', '4\n1 3 5 6\n2', '4\n1 3 5 6\n7'],
    hiddenInputs: ['4\n1 3 5 6\n0', '1\n1\n0', '1\n1\n2'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      const target = parseInt(t[n + 1], 10);
      let l = 0, r = n - 1, ans = n;
      while (l <= r) {
        const mid = (l + r) >> 1;
        if (nums[mid] >= target) {
          ans = mid;
          r = mid - 1;
        } else {
          l = mid + 1;
        }
      }
      return String(ans);
    }
  }),

  // 3. Guess Number Higher or Lower (Easy)
  createCanonicalProblem({
    problemId: 'dsa_binary-search_03',
    topicId: 'binary-search',
    order: 3,
    title: 'Guess Number Higher or Lower',
    difficulty: 'Easy',
    tags: ['Binary Search', 'Interactive'],
    statement: `We are playing the Guess Game. The game is as follows:
I pick a number from \`1\` to \`n\`. You have to guess which number I picked.
Every time you guess wrong, I will tell you whether the number I picked is higher or lower than your guess.

Given \`n\` and the secret pick \`pick\`, return the number that I picked using binary search.`,
    inputFormat: `First line: integer n.
Second line: integer pick (1 <= pick <= n).`,
    outputFormat: `Print the picked number.`,
    constraints: ['1 <= pick <= n <= 2^31 - 1'],
    examples: [
      {
        input: '10\n6',
        displayInput: 'n = 10, pick = 6',
        output: '6',
        displayOutput: '6',
        explanation: 'The secret number is 6.'
      },
      {
        input: '1\n1',
        displayInput: 'n = 1, pick = 1',
        output: '1',
        displayOutput: '1',
        explanation: 'Only 1 number, pick is 1.'
      }
    ],
    hints: [
      'Binary search over the range [1, n].',
      'If mid < pick, the secret is higher (search right half).',
      'If mid > pick, the secret is lower (search left half).'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if len(t) < 2: return\n    n, pick = int(t[0]), int(t[1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt(), pick = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    int n, pick; if (!(cin >> n >> pick)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10), pick = parseInt(t[1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['10\n6', '1\n1'],
    hiddenInputs: ['2\n1', '2\n2', '100\n42', '1000\n789'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const pick = parseInt(t[1], 10);
      let l = 1, r = n;
      while (l <= r) {
        const mid = Math.floor(l + (r - l) / 2);
        if (mid === pick) return String(mid);
        if (mid < pick) l = mid + 1;
        else r = mid - 1;
      }
      return String(pick);
    }
  }),

  // 4. First Bad Version (Easy)
  createCanonicalProblem({
    problemId: 'dsa_binary-search_04',
    topicId: 'binary-search',
    order: 4,
    title: 'First Bad Version',
    difficulty: 'Easy',
    tags: ['Binary Search', 'Interactive'],
    statement: `You are a product manager and currently leading a team to develop a new product. Since each version is developed based on the previous version, all the versions after a bad version are also bad.

Suppose you have \`n\` versions \`[1, 2, ..., n]\` and you want to find out the first bad one, which causes all the following ones to be bad.

Given \`n\` and the first bad version \`bad\`, find and print the first bad version.`,
    inputFormat: `First line: integer n.
Second line: integer bad (1 <= bad <= n).`,
    outputFormat: `Print the first bad version number.`,
    constraints: ['1 <= bad <= n <= 2^31 - 1'],
    examples: [
      {
        input: '5\n4',
        displayInput: 'n = 5, bad = 4',
        output: '4',
        displayOutput: '4',
        explanation: 'Version 4 is the first bad version.'
      },
      {
        input: '1\n1',
        displayInput: 'n = 1, bad = 1',
        output: '1',
        displayOutput: '1',
        explanation: 'Version 1 is bad.'
      }
    ],
    hints: [
      'Search space is [1, n].',
      'If mid >= bad, then mid is bad, so first bad is mid or to the left (right = mid - 1).',
      'Otherwise mid is good, so first bad must be to the right (left = mid + 1).'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if len(t) < 2: return\n    n, bad = int(t[0]), int(t[1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt(), bad = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    int n, bad; if (!(cin >> n >> bad)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10), bad = parseInt(t[1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['5\n4', '1\n1'],
    hiddenInputs: ['10\n10', '10\n1', '100\n37'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const bad = parseInt(t[1], 10);
      let l = 1, r = n, ans = n;
      while (l <= r) {
        const mid = Math.floor(l + (r - l) / 2);
        if (mid >= bad) {
          ans = mid;
          r = mid - 1;
        } else {
          l = mid + 1;
        }
      }
      return String(ans);
    }
  }),

  // 5. Sqrt(x) (Easy)
  createCanonicalProblem({
    problemId: 'dsa_binary-search_05',
    topicId: 'binary-search',
    order: 5,
    title: 'Sqrt(x)',
    difficulty: 'Easy',
    tags: ['Binary Search', 'Math'],
    statement: `Given a non-negative integer \`x\`, return the square root of \`x\` rounded down to the nearest integer. The returned integer should be **non-negative** as well.

You **must not use** any built-in exponent function or operator.`,
    inputFormat: `First line: non-negative integer x.`,
    outputFormat: `Print floor(sqrt(x)).`,
    constraints: ['0 <= x <= 2^31 - 1'],
    examples: [
      {
        input: '4',
        displayInput: 'x = 4',
        output: '2',
        displayOutput: '2',
        explanation: 'The square root of 4 is 2.'
      },
      {
        input: '8',
        displayInput: 'x = 8',
        output: '2',
        displayOutput: '2',
        explanation: 'The square root of 8 is 2.82842..., and since we round down to the nearest integer, 2 is returned.'
      }
    ],
    hints: [
      'Search space is [0, x].',
      'For candidate mid, if mid * mid <= x, record mid as a possible answer and search right (left = mid + 1).',
      'Otherwise search left (right = mid - 1).'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    x = int(t[0])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int x = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    long long x; if (!(cin >> x)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t.length) return;\n    const x = parseInt(t[0], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['4', '8'],
    hiddenInputs: ['0', '1', '16', '2147395599', '25'],
    solveFunction: (stdin) => {
      const x = parseInt(stdin.trim(), 10);
      if (x <= 1) return String(x);
      let l = 1, r = x, ans = 0;
      while (l <= r) {
        const mid = Math.floor(l + (r - l) / 2);
        if (mid <= Math.floor(x / mid)) {
          ans = mid;
          l = mid + 1;
        } else {
          r = mid - 1;
        }
      }
      return String(ans);
    }
  }),

  // 6. Peak Index in a Mountain Array (Easy)
  createCanonicalProblem({
    problemId: 'dsa_binary-search_06',
    topicId: 'binary-search',
    order: 6,
    title: 'Peak Index in a Mountain Array',
    difficulty: 'Easy',
    tags: ['Binary Search', 'Array'],
    statement: `An array \`arr\` is a **mountain array** if:
- \`arr.length >= 3\`
- There exists some \`i\` with \`0 < i < arr.length - 1\` such that:
  - \`arr[0] < arr[1] < ... < arr[i - 1] < arr[i]\`
  - \`arr[i] > arr[i + 1] > ... > arr[arr.length - 1]\`

Given a mountain array \`arr\`, return the index \`i\` such that \`arr[0] < arr[1] < ... < arr[i - 1] < arr[i] > arr[i + 1] > ... > arr[arr.length - 1]\`.

You must solve it in **O(log N)** time complexity.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the index of the mountain peak.`,
    constraints: ['3 <= arr.length <= 10^5', '0 <= arr[i] <= 10^6', 'arr is guaranteed to be a mountain array.'],
    examples: [
      {
        input: '3\n0 1 0',
        displayInput: 'arr = [0, 1, 0]',
        output: '1',
        displayOutput: '1',
        explanation: 'Peak is 1 at index 1.'
      },
      {
        input: '4\n0 2 1 0',
        displayInput: 'arr = [0, 2, 1, 0]',
        output: '1',
        displayOutput: '1',
        explanation: 'Peak is 2 at index 1.'
      },
      {
        input: '4\n0 10 5 2',
        displayInput: 'arr = [0, 10, 5, 2]',
        output: '1',
        displayOutput: '1',
        explanation: 'Peak is 10 at index 1.'
      }
    ],
    hints: [
      'Compare arr[mid] with arr[mid + 1].',
      'If arr[mid] < arr[mid + 1], you are on the ascending slope (peak is to the right, left = mid + 1).',
      'Otherwise, you are on the descending slope or at the peak (right = mid).'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    arr = [int(x) for x in t[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const arr = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['3\n0 1 0', '4\n0 2 1 0', '4\n0 10 5 2'],
    hiddenInputs: ['5\n1 3 5 4 2', '6\n0 1 2 5 3 0', '5\n10 20 30 25 15'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const arr = t.slice(1, n + 1).map(Number);
      let l = 0, r = n - 1;
      while (l < r) {
        const mid = (l + r) >> 1;
        if (arr[mid] < arr[mid + 1]) l = mid + 1;
        else r = mid;
      }
      return String(l);
    }
  }),

  // 7. Count Negative Numbers in a Sorted Matrix (Easy)
  createCanonicalProblem({
    problemId: 'dsa_binary-search_07',
    topicId: 'binary-search',
    order: 7,
    title: 'Count Negative Numbers in a Sorted Matrix',
    difficulty: 'Easy',
    tags: ['Binary Search', 'Matrix', 'Array'],
    statement: `Given a \`m x n\` matrix \`grid\` which is sorted in non-increasing order both row-wise and column-wise, return the number of **negative** numbers in \`grid\`.

You should solve it in **O(M + N)** or **O(M log N)** time.`,
    inputFormat: `First line: integers M and N.
Next M lines: N space-separated integers per line.`,
    outputFormat: `Print the total count of negative numbers.`,
    constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 100', '-100 <= grid[i][j] <= 100'],
    examples: [
      {
        input: '4 4\n4 3 2 -1\n3 2 1 -1\n1 1 -1 -2\n-1 -1 -2 -3',
        displayInput: 'grid = [[4,3,2,-1],[3,2,1,-1],[1,1,-1,-2],[-1,-1,-2,-3]]',
        output: '8',
        displayOutput: '8',
        explanation: 'There are 8 negative numbers in the matrix.'
      },
      {
        input: '2 2\n3 2\n1 0',
        displayInput: 'grid = [[3,2],[1,0]]',
        output: '0',
        displayOutput: '0',
        explanation: 'There are 0 negative numbers.'
      }
    ],
    hints: [
      'Start from bottom-left corner (row = M - 1, col = 0) or top-right.',
      'If grid[r][c] < 0, all elements to its right in this row are also negative (add N - c), then move up (row--).',
      'Otherwise move right (col++).'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    lines = sys.stdin.read().strip().splitlines()\n    if not lines: return\n    m, n = map(int, lines[0].split())\n    grid = [list(map(int, line.split())) for line in lines[1:m+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int m = sc.nextInt(), n = sc.nextInt();\n        int[][] g = new int[m][n];\n        for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) g[i][j] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int m, n; if (!(cin >> m >> n)) return 0;\n    vector<vector<int>> g(m, vector<int>(n));\n    for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) cin >> g[i][j];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const lines = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/).filter(Boolean);\n    if (!lines.length) return;\n    const [m, n] = lines[0].split(/\\s+/).map(Number);\n    const grid = lines.slice(1, m + 1).map(l => l.split(/\\s+/).map(Number));\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['4 4\n4 3 2 -1\n3 2 1 -1\n1 1 -1 -2\n-1 -1 -2 -3', '2 2\n3 2\n1 0'],
    hiddenInputs: ['1 1\n-5', '1 3\n-1 -2 -3', '3 1\n5\n0\n-1'],
    solveFunction: (stdin) => {
      const lines = stdin.trim().split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const [m, n] = lines[0].split(/\s+/).map(Number);
      const grid = lines.slice(1, m + 1).map(l => l.split(/\s+/).map(Number));
      let r = m - 1, c = 0, count = 0;
      while (r >= 0 && c < n) {
        if (grid[r][c] < 0) {
          count += (n - c);
          r--;
        } else {
          c++;
        }
      }
      return String(count);
    }
  }),

  // 8. Search in Rotated Sorted Array (Medium)
  createCanonicalProblem({
    problemId: 'dsa_binary-search_08',
    topicId: 'binary-search',
    order: 8,
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Medium',
    tags: ['Binary Search', 'Array'],
    statement: `There is an integer array \`nums\` sorted in ascending order (with **distinct** values). Prior to being passed to your function, \`nums\` is possibly rotated at an unknown pivot index \`k\`.

Given the array \`nums\` after the possible rotation and an integer \`target\`, return the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not in \`nums\`.

You must write an algorithm with **O(log N)** runtime complexity.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer target.`,
    outputFormat: `Print the index of target, or -1.`,
    constraints: ['1 <= nums.length <= 5000', '-10^4 <= nums[i], target <= 10^4', 'All values of nums are unique.'],
    examples: [
      {
        input: '7\n4 5 6 7 0 1 2\n0',
        displayInput: 'nums = [4,5,6,7,0,1,2], target = 0',
        output: '4',
        displayOutput: '4',
        explanation: '0 is at index 4.'
      },
      {
        input: '7\n4 5 6 7 0 1 2\n3',
        displayInput: 'nums = [4,5,6,7,0,1,2], target = 3',
        output: '-1',
        displayOutput: '-1',
        explanation: '3 does not exist in nums.'
      },
      {
        input: '1\n1\n0',
        displayInput: 'nums = [1], target = 0',
        output: '-1',
        displayOutput: '-1',
        explanation: 'Target 0 not found.'
      }
    ],
    hints: [
      'In a rotated sorted array, at least one half (left or right of mid) is always sorted.',
      'Check if nums[left] <= nums[mid]: if so, left half is normally sorted. Check if target lies within [nums[left], nums[mid]].',
      'Otherwise, right half is sorted: check if target lies within [nums[mid], nums[right]].'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    target = int(t[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int target = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int target; cin >> target;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    const target = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['7\n4 5 6 7 0 1 2\n0', '7\n4 5 6 7 0 1 2\n3', '1\n1\n0'],
    hiddenInputs: ['5\n5 1 2 3 4\n1', '3\n3 1 2\n2', '4\n1 2 3 4\n3'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      const target = parseInt(t[n + 1], 10);
      let l = 0, r = n - 1;
      while (l <= r) {
        const mid = (l + r) >> 1;
        if (nums[mid] === target) return String(mid);
        if (nums[l] <= nums[mid]) {
          if (nums[l] <= target && target < nums[mid]) r = mid - 1;
          else l = mid + 1;
        } else {
          if (nums[mid] < target && target <= nums[r]) l = mid + 1;
          else r = mid - 1;
        }
      }
      return '-1';
    }
  }),

  // 9. Find First and Last Position of Element in Sorted Array (Medium)
  createCanonicalProblem({
    problemId: 'dsa_binary-search_09',
    topicId: 'binary-search',
    order: 9,
    title: 'Find First and Last Position of Element in Sorted Array',
    difficulty: 'Medium',
    tags: ['Binary Search', 'Array'],
    statement: `Given an array of integers \`nums\` sorted in non-decreasing order, find the starting and ending position of a given \`target\` value.

If \`target\` is not found in the array, return \`-1 -1\`.

You must write an algorithm with **O(log N)** runtime complexity.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer target.`,
    outputFormat: `Print the starting and ending index separated by a space.`,
    constraints: ['0 <= nums.length <= 10^5', '-10^9 <= nums[i], target <= 10^9', 'nums is sorted in non-decreasing order.'],
    examples: [
      {
        input: '6\n5 7 7 8 8 10\n8',
        displayInput: 'nums = [5,7,7,8,8,10], target = 8',
        output: '3 4',
        displayOutput: '[3, 4]',
        explanation: '8 first appears at index 3 and last at index 4.'
      },
      {
        input: '6\n5 7 7 8 8 10\n6',
        displayInput: 'nums = [5,7,7,8,8,10], target = 6',
        output: '-1 -1',
        displayOutput: '[-1, -1]',
        explanation: '6 is not in the array.'
      },
      {
        input: '0\n\n0',
        displayInput: 'nums = [], target = 0',
        output: '-1 -1',
        displayOutput: '[-1, -1]',
        explanation: 'Empty array returns -1 -1.'
      }
    ],
    hints: [
      'Run binary search twice: once for the first occurrence (bias left) and once for the last occurrence (bias right).',
      'For first occurrence: if nums[mid] == target, record mid and search left (right = mid - 1).',
      'For last occurrence: if nums[mid] == target, record mid and search right (left = mid + 1).'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    target = int(t[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int target = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int target; cin >> target;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    const target = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['6\n5 7 7 8 8 10\n8', '6\n5 7 7 8 8 10\n6', '0\n\n0'],
    hiddenInputs: ['1\n1\n1', '2\n2 2\n2', '5\n1 2 3 4 5\n3'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      if (!t || t.length < 2 || t[0] === '0') return '-1 -1';
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      const target = parseInt(t[n + 1], 10);
      const findFirst = () => {
        let l = 0, r = n - 1, ans = -1;
        while (l <= r) {
          const mid = (l + r) >> 1;
          if (nums[mid] === target) { ans = mid; r = mid - 1; }
          else if (nums[mid] < target) l = mid + 1;
          else r = mid - 1;
        }
        return ans;
      };
      const findLast = () => {
        let l = 0, r = n - 1, ans = -1;
        while (l <= r) {
          const mid = (l + r) >> 1;
          if (nums[mid] === target) { ans = mid; l = mid + 1; }
          else if (nums[mid] < target) l = mid + 1;
          else r = mid - 1;
        }
        return ans;
      };
      return `${findFirst()} ${findLast()}`;
    }
  }),

  // 10. Find Minimum in Rotated Sorted Array (Medium)
  createCanonicalProblem({
    problemId: 'dsa_binary-search_10',
    topicId: 'binary-search',
    order: 10,
    title: 'Find Minimum in Rotated Sorted Array',
    difficulty: 'Medium',
    tags: ['Binary Search', 'Array'],
    statement: `Suppose an array of length \`n\` sorted in ascending order with **unique** elements is rotated between \`1\` and \`n\` times.

Given the sorted rotated array \`nums\` of unique elements, return the **minimum element** of this array.

You must write an algorithm that runs in **O(log N)** time.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the minimum element in the array.`,
    constraints: ['n == nums.length', '1 <= n <= 5000', '-5000 <= nums[i] <= 5000', 'All the integers of nums are unique.'],
    examples: [
      {
        input: '5\n3 4 5 1 2',
        displayInput: 'nums = [3,4,5,1,2]',
        output: '1',
        displayOutput: '1',
        explanation: 'Original sorted array was [1,2,3,4,5] rotated 3 times.'
      },
      {
        input: '7\n4 5 6 7 0 1 2',
        displayInput: 'nums = [4,5,6,7,0,1,2]',
        output: '0',
        displayOutput: '0',
        explanation: 'Minimum is 0.'
      },
      {
        input: '4\n11 13 15 17',
        displayInput: 'nums = [11,13,15,17]',
        output: '11',
        displayOutput: '11',
        explanation: 'Array is not rotated, minimum is 11.'
      }
    ],
    hints: [
      'Compare nums[mid] with nums[right].',
      'If nums[mid] > nums[right], the inflection point (minimum) must be strictly to the right of mid (left = mid + 1).',
      'If nums[mid] <= nums[right], mid could be the minimum or minimum is to the left (right = mid).'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['5\n3 4 5 1 2', '7\n4 5 6 7 0 1 2', '4\n11 13 15 17'],
    hiddenInputs: ['1\n5', '2\n2 1', '3\n2 3 1'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      let l = 0, r = n - 1;
      while (l < r) {
        const mid = (l + r) >> 1;
        if (nums[mid] > nums[r]) l = mid + 1;
        else r = mid;
      }
      return String(nums[l]);
    }
  }),

  // 11. Search a 2D Matrix (Medium)
  createCanonicalProblem({
    problemId: 'dsa_binary-search_11',
    topicId: 'binary-search',
    order: 11,
    title: 'Search a 2D Matrix',
    difficulty: 'Medium',
    tags: ['Binary Search', 'Matrix', 'Array'],
    statement: `You are given an \`m x n\` integer matrix \`matrix\` with the following two properties:
- Each row is sorted in non-decreasing order.
- The first integer of each row is greater than the last integer of the previous row.

Given an integer \`target\`, return \`true\` if \`target\` is in \`matrix\` or \`false\` otherwise.

You must write a solution in **O(log(M * N))** time.`,
    inputFormat: `First line: integers M and N.
Next M lines: N space-separated integers per line.
Last line: integer target.`,
    outputFormat: `Print 'true' if target exists in matrix, else 'false'.`,
    constraints: ['m == matrix.length', 'n == matrix[i].length', '1 <= m, n <= 100', '-10^4 <= matrix[i][j], target <= 10^4'],
    examples: [
      {
        input: '3 4\n1 3 5 7\n10 11 16 20\n23 30 34 60\n3',
        displayInput: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3',
        output: 'true',
        displayOutput: 'true',
        explanation: '3 is present at (0, 1).'
      },
      {
        input: '3 4\n1 3 5 7\n10 11 16 20\n23 30 34 60\n13',
        displayInput: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13',
        output: 'false',
        displayOutput: 'false',
        explanation: '13 is not in the matrix.'
      }
    ],
    hints: [
      'Treat the entire matrix as a 1D sorted array of length M * N.',
      'A 1D index mid maps to row = Math.floor(mid / N) and col = mid % N.',
      'Perform standard binary search over range [0, M * N - 1].'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    lines = sys.stdin.read().strip().splitlines()\n    if not lines: return\n    m, n = map(int, lines[0].split())\n    matrix = [list(map(int, line.split())) for line in lines[1:m+1]]\n    target = int(lines[m+1].strip())\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int m = sc.nextInt(), n = sc.nextInt();\n        int[][] mat = new int[m][n];\n        for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) mat[i][j] = sc.nextInt();\n        int target = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int m, n; if (!(cin >> m >> n)) return 0;\n    vector<vector<int>> mat(m, vector<int>(n));\n    for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) cin >> mat[i][j];\n    int target; cin >> target;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const lines = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/).filter(Boolean);\n    if (lines.length < 2) return;\n    const [m, n] = lines[0].split(/\\s+/).map(Number);\n    const matrix = lines.slice(1, m + 1).map(l => l.split(/\\s+/).map(Number));\n    const target = parseInt(lines[m + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['3 4\n1 3 5 7\n10 11 16 20\n23 30 34 60\n3', '3 4\n1 3 5 7\n10 11 16 20\n23 30 34 60\n13'],
    hiddenInputs: ['1 1\n1\n1', '1 1\n1\n0', '1 2\n1 3\n3'],
    solveFunction: (stdin) => {
      const lines = stdin.trim().split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const [m, n] = lines[0].split(/\s+/).map(Number);
      const matrix = lines.slice(1, m + 1).map(l => l.split(/\s+/).map(Number));
      const target = parseInt(lines[m + 1], 10);
      let l = 0, r = m * n - 1;
      while (l <= r) {
        const mid = (l + r) >> 1;
        const row = Math.floor(mid / n);
        const col = mid % n;
        const val = matrix[row][col];
        if (val === target) return 'true';
        if (val < target) l = mid + 1;
        else r = mid - 1;
      }
      return 'false';
    }
  }),

  // 12. Koko Eating Bananas (Medium)
  createCanonicalProblem({
    problemId: 'dsa_binary-search_12',
    topicId: 'binary-search',
    order: 12,
    title: 'Koko Eating Bananas',
    difficulty: 'Medium',
    tags: ['Binary Search', 'Array'],
    statement: `Koko loves to eat bananas. There are \`n\` piles of bananas, the \`i\`th pile has \`piles[i]\` bananas. The guards have gone and will come back in \`h\` hours.

Koko can decide her bananas-per-hour eating speed of \`k\`. Each hour, she chooses some pile of bananas and eats \`k\` bananas from that pile. If the pile has less than \`k\` bananas, she eats all of them instead and will not eat any more bananas during this hour.

Return the minimum integer \`k\` such that she can eat all the bananas within \`h\` hours.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers representing piles.
Third line: integer h.`,
    outputFormat: `Print the minimum eating speed k.`,
    constraints: ['1 <= piles.length <= 10^4', 'piles.length <= h <= 10^9', '1 <= piles[i] <= 10^9'],
    examples: [
      {
        input: '4\n3 6 7 11\n8',
        displayInput: 'piles = [3, 6, 7, 11], h = 8',
        output: '4',
        displayOutput: '4',
        explanation: 'At speed 4, hours = ceil(3/4) + ceil(6/4) + ceil(7/4) + ceil(11/4) = 1 + 2 + 2 + 3 = 8 <= 8.'
      },
      {
        input: '5\n30 11 23 4 20\n5',
        displayInput: 'piles = [30, 11, 23, 4, 20], h = 5',
        output: '30',
        displayOutput: '30',
        explanation: 'Koko must eat at speed 30 to finish in 5 hours.'
      },
      {
        input: '5\n30 11 23 4 20\n6',
        displayInput: 'piles = [30, 11, 23, 4, 20], h = 6',
        output: '23',
        displayOutput: '23',
        explanation: 'At speed 23, total hours needed is 6.'
      }
    ],
    hints: [
      'The speed k is in range [1, max(piles)].',
      'For a speed candidate mid, total hours required is sum(ceil(pile / mid)).',
      'If hours <= h, mid is feasible! Try smaller speeds (right = mid - 1). Otherwise try faster speeds (left = mid + 1).'
    ],
    starterCode: {
      python: `import sys\nimport math\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    piles = [int(x) for x in t[1:n+1]]\n    h = int(t[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] p = new int[n];\n        for (int i = 0; i < n; i++) p[i] = sc.nextInt();\n        int h = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> p(n); for (int i = 0; i < n; i++) cin >> p[i];\n    int h; cin >> h;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const piles = t.slice(1, n + 1).map(Number);\n    const h = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['4\n3 6 7 11\n8', '5\n30 11 23 4 20\n5', '5\n30 11 23 4 20\n6'],
    hiddenInputs: ['1\n312884470\n312884469', '3\n1 1 1\n3', '4\n10 10 10 10\n4'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const piles = t.slice(1, n + 1).map(Number);
      const h = parseInt(t[n + 1], 10);
      let l = 1, r = Math.max(...piles), ans = r;
      while (l <= r) {
        const mid = Math.floor(l + (r - l) / 2);
        let hours = 0;
        for (const p of piles) hours += Math.ceil(p / mid);
        if (hours <= h) {
          ans = mid;
          r = mid - 1;
        } else {
          l = mid + 1;
        }
      }
      return String(ans);
    }
  }),

  // 13. Capacity To Ship Packages Within D Days (Medium)
  createCanonicalProblem({
    problemId: 'dsa_binary-search_13',
    topicId: 'binary-search',
    order: 13,
    title: 'Capacity To Ship Packages Within D Days',
    difficulty: 'Medium',
    tags: ['Binary Search', 'Array'],
    statement: `A conveyor belt has packages that must be shipped from one port to another within \`days\` days.

The \`i\`th package on the conveyor belt has a weight of \`weights[i]\`. Each day, we load the ship with packages on the conveyor belt (in the order given by weights). We may not load more weight than the maximum weight capacity of the ship.

Return the least weight capacity of the ship that will result in all the packages on the conveyor belt being shipped within \`days\` days.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers representing weights.
Third line: integer days.`,
    outputFormat: `Print the minimum ship capacity.`,
    constraints: ['1 <= days <= weights.length <= 5 * 10^4', '1 <= weights[i] <= 500'],
    examples: [
      {
        input: '10\n1 2 3 4 5 6 7 8 9 10\n5',
        displayInput: 'weights = [1,2,3,4,5,6,7,8,9,10], days = 5',
        output: '15',
        displayOutput: '15',
        explanation: 'A ship capacity of 15 allows packages to be shipped in 5 days: Day 1: 1..5 (15), Day 2: 6,7 (13), Day 3: 8 (8), Day 4: 9 (9), Day 5: 10 (10).'
      },
      {
        input: '6\n3 2 2 4 1 4\n3',
        displayInput: 'weights = [3,2,2,4,1,4], days = 3',
        output: '6',
        displayOutput: '6',
        explanation: 'A capacity of 6 allows shipping in 3 days.'
      }
    ],
    hints: [
      'Capacity range: minimum possible capacity is max(weights) (since every package must be shippable), maximum is sum(weights).',
      'Binary search over [max(weights), sum(weights)].',
      'Test if a candidate capacity can ship packages within days using a greedy running sum.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    weights = [int(x) for x in t[1:n+1]]\n    days = int(t[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] w = new int[n];\n        for (int i = 0; i < n; i++) w[i] = sc.nextInt();\n        int days = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <numeric>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> w(n); for (int i = 0; i < n; i++) cin >> w[i];\n    int days; cin >> days;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const weights = t.slice(1, n + 1).map(Number);\n    const days = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['10\n1 2 3 4 5 6 7 8 9 10\n5', '6\n3 2 2 4 1 4\n3'],
    hiddenInputs: ['3\n1 2 3\n1', '3\n1 2 3\n3', '5\n10 10 10 10 10\n5'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const weights = t.slice(1, n + 1).map(Number);
      const days = parseInt(t[n + 1], 10);
      let l = Math.max(...weights);
      let r = weights.reduce((a, b) => a + b, 0);
      let ans = r;
      while (l <= r) {
        const mid = Math.floor(l + (r - l) / 2);
        let curDays = 1, curLoad = 0;
        for (const w of weights) {
          if (curLoad + w > mid) {
            curDays++;
            curLoad = w;
          } else {
            curLoad += w;
          }
        }
        if (curDays <= days) {
          ans = mid;
          r = mid - 1;
        } else {
          l = mid + 1;
        }
      }
      return String(ans);
    }
  }),

  // 14. Single Element in a Sorted Array (Medium)
  createCanonicalProblem({
    problemId: 'dsa_binary-search_14',
    topicId: 'binary-search',
    order: 14,
    title: 'Single Element in a Sorted Array',
    difficulty: 'Medium',
    tags: ['Binary Search', 'Array'],
    statement: `You are given a sorted array consisting of only integers where every element appears exactly twice, except for one element which appears exactly once.

Return the single element that appears only once.

Your solution must run in **O(log N)** time and **O(1)** space.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the single unique element.`,
    constraints: ['1 <= nums.length <= 10^5', '0 <= nums[i] <= 10^5'],
    examples: [
      {
        input: '9\n1 1 2 3 3 4 4 8 8',
        displayInput: 'nums = [1, 1, 2, 3, 3, 4, 4, 8, 8]',
        output: '2',
        displayOutput: '2',
        explanation: '2 appears only once.'
      },
      {
        input: '7\n3 3 7 7 10 11 11',
        displayInput: 'nums = [3, 3, 7, 7, 10, 11, 11]',
        output: '10',
        displayOutput: '10',
        explanation: '10 appears only once.'
      }
    ],
    hints: [
      'Before the single element, pairs start at even indices (even, even+1).',
      'After the single element, pairs start at odd indices (odd, odd+1).',
      'If mid is even and nums[mid] == nums[mid + 1], the single element is to the right (left = mid + 2).'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['9\n1 1 2 3 3 4 4 8 8', '7\n3 3 7 7 10 11 11'],
    hiddenInputs: ['1\n5', '3\n1 2 2', '3\n2 2 3'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      let l = 0, r = n - 1;
      while (l < r) {
        let mid = (l + r) >> 1;
        if (mid % 2 === 1) mid--;
        if (nums[mid] === nums[mid + 1]) l = mid + 2;
        else r = mid;
      }
      return String(nums[l]);
    }
  }),

  // 15. Find Peak Element (Medium)
  createCanonicalProblem({
    problemId: 'dsa_binary-search_15',
    topicId: 'binary-search',
    order: 15,
    title: 'Find Peak Element',
    difficulty: 'Medium',
    tags: ['Binary Search', 'Array'],
    statement: `A peak element is an element that is strictly greater than its neighbors.

Given a **0-indexed** integer array \`nums\`, find a peak element, and return its index. If the array contains multiple peaks, return the index to **any of the peaks**.

You may imagine that \`nums[-1] = nums[n] = -infinity\`. In other words, an element is always considered to be strictly greater than a neighbor that is outside the array.

You must write an algorithm that runs in **O(log N)** time.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the index of any peak element.`,
    constraints: ['1 <= nums.length <= 1000', '-2^31 <= nums[i] <= 2^31 - 1', 'nums[i] != nums[i + 1] for all valid i.'],
    examples: [
      {
        input: '4\n1 2 3 1',
        displayInput: 'nums = [1, 2, 3, 1]',
        output: '2',
        displayOutput: '2',
        explanation: '3 is a peak element and its index is 2.'
      },
      {
        input: '7\n1 2 1 3 5 6 4',
        displayInput: 'nums = [1, 2, 1, 3, 5, 6, 4]',
        output: '5',
        displayOutput: '5',
        explanation: 'Your function can return either index number 1 where the peak element is 2, or index number 5 where the peak element is 6.'
      }
    ],
    hints: [
      'Compare nums[mid] with nums[mid + 1].',
      'If nums[mid] < nums[mid + 1], there must be a peak to the right of mid (left = mid + 1).',
      'Otherwise, there must be a peak at mid or to the left (right = mid).'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['4\n1 2 3 1', '7\n1 2 1 3 5 6 4'],
    hiddenInputs: ['1\n5', '2\n1 2', '2\n2 1'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      let l = 0, r = n - 1;
      while (l < r) {
        const mid = (l + r) >> 1;
        if (nums[mid] < nums[mid + 1]) l = mid + 1;
        else r = mid;
      }
      return String(l);
    }
  }),

  // 16. Aggressive Cows (Allocate Minimum Distance) (Medium)
  createCanonicalProblem({
    problemId: 'dsa_binary-search_16',
    topicId: 'binary-search',
    order: 16,
    title: 'Aggressive Cows (Allocate Minimum Distance)',
    difficulty: 'Medium',
    tags: ['Binary Search', 'Greedy', 'Array'],
    statement: `You are given an array of \`stalls\` of size \`N\` and an integer \`C\` (number of aggressive cows). Assign cows to stalls such that the **minimum distance** between any two of them is as large as possible.

Return the largest possible minimum distance.`,
    inputFormat: `First line: integers N and C.
Second line: N space-separated stall positions.`,
    outputFormat: `Print the maximum possible minimum distance between cows.`,
    constraints: ['2 <= N <= 10^5', '2 <= C <= N', '0 <= stalls[i] <= 10^9'],
    examples: [
      {
        input: '5 3\n1 2 8 4 9',
        displayInput: 'stalls = [1, 2, 8, 4, 9], C = 3',
        output: '3',
        displayOutput: '3',
        explanation: 'Place 3 cows at stall positions 1, 4, and 8. The minimum distance is min(4-1, 8-4) = 3.'
      }
    ],
    hints: [
      'Sort stalls in ascending order.',
      'Binary search over possible minimum distances d in [1, stalls[N-1] - stalls[0]].',
      'For distance d: place the first cow at stalls[0]. Greedily place each subsequent cow at the first stall >= lastStall + d.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n, c = int(t[0]), int(t[1])\n    stalls = [int(x) for x in t[2:2+n]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt(), c = sc.nextInt();\n        int[] s = new int[n];\n        for (int i = 0; i < n; i++) s[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n, c; if (!(cin >> n >> c)) return 0;\n    vector<int> s(n); for (int i = 0; i < n; i++) cin >> s[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10), c = parseInt(t[1], 10);\n    const stalls = t.slice(2, 2 + n).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['5 3\n1 2 8 4 9'],
    hiddenInputs: ['5 2\n1 2 4 8 9', '4 4\n1 2 3 4', '6 3\n0 3 4 7 10 9'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10), c = parseInt(t[1], 10);
      const s = t.slice(2, 2 + n).map(Number).sort((a, b) => a - b);
      let l = 1, r = s[n - 1] - s[0], ans = 1;
      const canPlace = (dist) => {
        let count = 1, last = s[0];
        for (let i = 1; i < n; i++) {
          if (s[i] - last >= dist) {
            count++;
            last = s[i];
            if (count >= c) return true;
          }
        }
        return false;
      };
      while (l <= r) {
        const mid = (l + r) >> 1;
        if (canPlace(mid)) {
          ans = mid;
          l = mid + 1;
        } else {
          r = mid - 1;
        }
      }
      return String(ans);
    }
  }),

  // 17. Median of Two Sorted Arrays (Hard)
  createCanonicalProblem({
    problemId: 'dsa_binary-search_17',
    topicId: 'binary-search',
    order: 17,
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    tags: ['Binary Search', 'Array', 'Divide and Conquer'],
    statement: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return the **median** of the two sorted arrays formatted to **5 decimal places**.

The overall run time complexity should be **O(log(min(M, N)))**.`,
    inputFormat: `First line: integers M and N.
Second line: M space-separated integers for nums1.
Third line: N space-separated integers for nums2.`,
    outputFormat: `Print the median value formatted to 5 decimal places.`,
    constraints: ['nums1.length == m', 'nums2.length == n', '0 <= m, n <= 1000', '1 <= m + n <= 2000', '-10^6 <= nums1[i], nums2[i] <= 10^6'],
    examples: [
      {
        input: '2 1\n1 3\n2',
        displayInput: 'nums1 = [1,3], nums2 = [2]',
        output: '2.00000',
        displayOutput: '2.00000',
        explanation: 'Merged array = [1,2,3] and median is 2.'
      },
      {
        input: '2 2\n1 2\n3 4',
        displayInput: 'nums1 = [1,2], nums2 = [3,4]',
        output: '2.50000',
        displayOutput: '2.50000',
        explanation: 'Merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.'
      }
    ],
    hints: [
      'Ensure binary search runs on the smaller array (swap if M > N).',
      'Partition nums1 at cut1 and nums2 at cut2 = (M + N + 1) / 2 - cut1.',
      'Check if maxLeft1 <= minRight2 and maxLeft2 <= minRight1.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    m, n = int(t[0]), int(t[1])\n    nums1 = [int(x) for x in t[2:2+m]]\n    nums2 = [int(x) for x in t[2+m:2+m+n]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int m = sc.nextInt(), n = sc.nextInt();\n        int[] a = new int[m], b = new int[n];\n        for (int i = 0; i < m; i++) a[i] = sc.nextInt();\n        for (int i = 0; i < n; i++) b[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <iomanip>\nusing namespace std;\nint main() {\n    int m, n; if (!(cin >> m >> n)) return 0;\n    vector<int> a(m), b(n);\n    for (int i = 0; i < m; i++) cin >> a[i];\n    for (int i = 0; i < n; i++) cin >> b[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const m = parseInt(t[0], 10), n = parseInt(t[1], 10);\n    const nums1 = t.slice(2, 2 + m).map(Number);\n    const nums2 = t.slice(2 + m, 2 + m + n).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['2 1\n1 3\n2', '2 2\n1 2\n3 4'],
    hiddenInputs: ['0 1\n\n1', '2 0\n2 3\n', '1 1\n1\n1'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const m = parseInt(t[0], 10), n = parseInt(t[1], 10);
      const a = t.slice(2, 2 + m).map(Number);
      const b = t.slice(2 + m, 2 + m + n).map(Number);
      const merged = [...a, ...b].sort((x, y) => x - y);
      const total = merged.length;
      let med = 0;
      if (total % 2 === 1) med = merged[Math.floor(total / 2)];
      else med = (merged[total / 2 - 1] + merged[total / 2]) / 2;
      return med.toFixed(5);
    }
  }),

  // 18. Split Array Largest Sum (Hard)
  createCanonicalProblem({
    problemId: 'dsa_binary-search_18',
    topicId: 'binary-search',
    order: 18,
    title: 'Split Array Largest Sum',
    difficulty: 'Hard',
    tags: ['Binary Search', 'Dynamic Programming', 'Array'],
    statement: `Given an integer array \`nums\` and an integer \`k\`, split \`nums\` into \`k\` non-empty subarrays such that the largest sum of any subarray is **minimized**.

Return the minimized largest sum of the split.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer k.`,
    outputFormat: `Print the minimized largest subarray sum.`,
    constraints: ['1 <= nums.length <= 1000', '0 <= nums[i] <= 10^6', '1 <= k <= min(50, nums.length)'],
    examples: [
      {
        input: '5\n7 2 5 10 8\n2',
        displayInput: 'nums = [7,2,5,10,8], k = 2',
        output: '18',
        displayOutput: '18',
        explanation: 'Split into [7,2,5] (sum 14) and [10,8] (sum 18). Largest sum among the 2 subarrays is 18.'
      },
      {
        input: '5\n1 2 3 4 5\n2',
        displayInput: 'nums = [1,2,3,4,5], k = 2',
        output: '9',
        displayOutput: '9',
        explanation: 'Split into [1,2,3] (sum 6) and [4,5] (sum 9). Minimized largest sum is 9.'
      }
    ],
    hints: [
      'The answer is bounded between max(nums) and sum(nums).',
      'Binary search on the answer: test if candidate sum mid can partition nums into <= k subarrays.',
      'If greedy partitioning needs <= k subarrays, mid is valid (try smaller, right = mid - 1).'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    k = int(t[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int k = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int k; cin >> k;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    const k = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['5\n7 2 5 10 8\n2', '5\n1 2 3 4 5\n2'],
    hiddenInputs: ['3\n1 4 4\n3', '1\n10\n1', '4\n2 3 1 1\n2'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      const k = parseInt(t[n + 1], 10);
      let l = Math.max(...nums);
      let r = nums.reduce((a, b) => a + b, 0);
      let ans = r;
      while (l <= r) {
        const mid = Math.floor(l + (r - l) / 2);
        let pieces = 1, cur = 0;
        for (const x of nums) {
          if (cur + x > mid) {
            pieces++;
            cur = x;
          } else {
            cur += x;
          }
        }
        if (pieces <= k) {
          ans = mid;
          r = mid - 1;
        } else {
          l = mid + 1;
        }
      }
      return String(ans);
    }
  }),

  // 19. Book Allocation Problem [Hard]
  createCanonicalProblem({
    problemId: 'dsa_binary-search_19',
    topicId: 'binary-search',
    order: 19,
    title: 'Book Allocation Problem',
    difficulty: 'Hard',
    tags: ['Binary Search', 'Greedy', 'Array'],
    statement: `You have \`N\` books, each with \`pages[i]\` pages. You must allocate all books to \`M\` students such that:
1. Each book is assigned to exactly one student.
2. Each student is assigned at least one book.
3. Book allocation must be contiguous.

Find the allocation that minimizes the maximum number of pages assigned to any student. If impossible, return \`-1\`.`,
    inputFormat: `First line: integers N and M.
Second line: N space-separated integers for pages.`,
    outputFormat: `Print the minimum possible maximum page allocation, or -1.`,
    constraints: ['1 <= N <= 10^5', '1 <= M <= N', '1 <= pages[i] <= 10^9'],
    examples: [
      {
        input: '4 2\n12 34 67 90',
        displayInput: 'N = 4, M = 2, pages = [12, 34, 67, 90]',
        output: '113',
        displayOutput: '113',
        explanation: 'Allocation: Student 1 gets [12, 34, 67] (113 pages), Student 2 gets [90] (90 pages). Max pages is 113.'
      }
    ],
    hints: [
      'If M > N, return -1 since each student must get at least one book.',
      'Search space is [max(pages), sum(pages)].',
      'Test mid: greedily pack books into each student without exceeding mid pages.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n, m = int(t[0]), int(t[1])\n    pages = [int(x) for x in t[2:2+n]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt(), m = sc.nextInt();\n        int[] p = new int[n];\n        for (int i = 0; i < n; i++) p[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n, m; if (!(cin >> n >> m)) return 0;\n    vector<int> p(n); for (int i = 0; i < n; i++) cin >> p[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10), m = parseInt(t[1], 10);\n    const pages = t.slice(2, 2 + n).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['4 2\n12 34 67 90'],
    hiddenInputs: ['4 4\n10 20 30 40', '3 4\n10 20 30', '5 2\n25 46 28 49 24'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10), m = parseInt(t[1], 10);
      const pages = t.slice(2, 2 + n).map(Number);
      if (m > n) return '-1';
      let l = Math.max(...pages);
      let r = pages.reduce((a, b) => a + b, 0);
      let ans = r;
      while (l <= r) {
        const mid = Math.floor(l + (r - l) / 2);
        let students = 1, cur = 0;
        for (const p of pages) {
          if (cur + p > mid) {
            students++;
            cur = p;
          } else {
            cur += p;
          }
        }
        if (students <= m) {
          ans = mid;
          r = mid - 1;
        } else {
          l = mid + 1;
        }
      }
      return String(ans);
    }
  }),

  // 20. Find in Mountain Array (Hard)
  createCanonicalProblem({
    problemId: 'dsa_binary-search_20',
    topicId: 'binary-search',
    order: 20,
    title: 'Find in Mountain Array',
    difficulty: 'Hard',
    tags: ['Binary Search', 'Interactive', 'Array'],
    statement: `You may recall that an array \`arr\` is a mountain array if it increases to a peak, then decreases.

Given a mountain array \`mountainArr\` and a target integer \`target\`, return the **minimum index** such that \`mountainArr[index] == target\`. If such an index does not exist, return \`-1\`.

You must make at most **100** element accesses.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers representing mountain array.
Third line: integer target.`,
    outputFormat: `Print the minimum index of target, or -1.`,
    constraints: ['3 <= mountain_arr.length() <= 10^4', '0 <= target <= 10^9', '0 <= mountain_arr.get(index) <= 10^9'],
    examples: [
      {
        input: '7\n1 2 3 4 5 3 1\n3',
        displayInput: 'array = [1,2,3,4,5,3,1], target = 3',
        output: '2',
        displayOutput: '2',
        explanation: '3 exists at index 2 and index 5. The minimum index is 2.'
      },
      {
        input: '7\n0 1 2 4 2 1 0\n3',
        displayInput: 'array = [0,1,2,4,2,1,0], target = 3',
        output: '-1',
        displayOutput: '-1',
        explanation: '3 is not in the array.'
      }
    ],
    hints: [
      'Phase 1: Binary search for the peak index where arr[mid] > arr[mid + 1].',
      'Phase 2: Binary search for target in the strictly ascending left half [0, peak]. If found, return index.',
      'Phase 3: If not found in left half, binary search in strictly descending right half [peak + 1, N - 1].'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    arr = [int(x) for x in t[1:n+1]]\n    target = int(t[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int target = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int target; cin >> target;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const arr = t.slice(1, n + 1).map(Number);\n    const target = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['7\n1 2 3 4 5 3 1\n3', '7\n0 1 2 4 2 1 0\n3'],
    hiddenInputs: ['5\n1 5 2 0 -1\n2', '3\n1 3 2\n3', '4\n0 2 1 0\n0'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const arr = t.slice(1, n + 1).map(Number);
      const target = parseInt(t[n + 1], 10);
      let l = 0, r = n - 1;
      while (l < r) {
        const mid = (l + r) >> 1;
        if (arr[mid] < arr[mid + 1]) l = mid + 1;
        else r = mid;
      }
      const peak = l;
      // Search left half
      let l1 = 0, r1 = peak;
      while (l1 <= r1) {
        const mid = (l1 + r1) >> 1;
        if (arr[mid] === target) return String(mid);
        if (arr[mid] < target) l1 = mid + 1;
        else r1 = mid - 1;
      }
      // Search right half
      let l2 = peak + 1, r2 = n - 1;
      while (l2 <= r2) {
        const mid = (l2 + r2) >> 1;
        if (arr[mid] === target) return String(mid);
        if (arr[mid] > target) l2 = mid + 1;
        else r2 = mid - 1;
      }
      return '-1';
    }
  })
];


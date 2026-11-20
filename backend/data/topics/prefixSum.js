/**
 * Canonical DSA Placement Problems: PREFIX SUM (20 Questions)
 * 7 Easy, 9 Medium, 4 Hard
 */

import { createCanonicalProblem } from './topicProblemHelper.js';

export const PREFIX_SUM_PROBLEMS = [
  // 1. Range Sum Query - Immutable (Easy)
  createCanonicalProblem({
    problemId: 'dsa_prefix-sum_01',
    topicId: 'prefix-sum',
    order: 1,
    title: 'Range Sum Query - Immutable',
    difficulty: 'Easy',
    tags: ['Prefix Sum', 'Array', 'Design'],
    statement: `Given an integer array \`nums\`, handle multiple queries of the following type:

Calculate the sum of the elements of \`nums\` between indices \`left\` and \`right\` inclusive where \`left <= right\`.

You must implement a solution such that each range sum query runs in **O(1)** time after an **O(N)** precomputation.`,
    inputFormat: `First line: integer N (array length).
Second line: N space-separated integers representing nums.
Third line: integer Q (number of queries).
Next Q lines: two space-separated integers left and right.`,
    outputFormat: `Print the answer for each query on a new line.`,
    constraints: [
      '1 <= N <= 10^5',
      '-10^9 <= nums[i] <= 10^9',
      '1 <= Q <= 10^5',
      '0 <= left <= right < N'
    ],
    examples: [
      {
        input: '6\n-2 0 3 -5 2 -1\n3\n0 2\n2 5\n0 5',
        displayInput: 'nums = [-2, 0, 3, -5, 2, -1], queries = [[0, 2], [2, 5], [0, 5]]',
        output: '1\n-1\n-3',
        displayOutput: '1\n-1\n-3',
        explanation: 'sumRange(0, 2) = (-2) + 0 + 3 = 1.\nsumRange(2, 5) = 3 + (-5) + 2 + (-1) = -1.\nsumRange(0, 5) = (-2) + 0 + 3 + (-5) + 2 + (-1) = -3.'
      },
      {
        input: '5\n1 2 3 4 5\n2\n1 3\n0 4',
        displayInput: 'nums = [1, 2, 3, 4, 5], queries = [[1, 3], [0, 4]]',
        output: '9\n15',
        displayOutput: '9\n15',
        explanation: 'sumRange(1, 3) = 2 + 3 + 4 = 9.\nsumRange(0, 4) = 1 + 2 + 3 + 4 + 5 = 15.'
      },
      {
        input: '3\n10 -5 20\n1\n1 1',
        displayInput: 'nums = [10, -5, 20], queries = [[1, 1]]',
        output: '-5',
        displayOutput: '-5',
        explanation: 'sumRange(1, 1) = nums[1] = -5.'
      }
    ],
    hints: [
      'Precompute a prefix sum array where prefix[i] stores the sum of elements from index 0 to i-1.',
      'The sum from index left to right is simply prefix[right + 1] - prefix[left].',
      'This allows every query to be answered in O(1) time.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    q = int(tokens[n+1])\n    pos = n + 2\n    queries = []\n    for _ in range(q):\n        queries.append((int(tokens[pos]), int(tokens[pos+1])))\n        pos += 2\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int q = sc.nextInt();\n        int[][] queries = new int[q][2];\n        for (int i = 0; i < q; i++) {\n            queries[i][0] = sc.nextInt();\n            queries[i][1] = sc.nextInt();\n        }\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<long long> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    int q;\n    cin >> q;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\n\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    const nums = tokens.slice(1, n + 1).map(Number);\n    const q = parseInt(tokens[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    approaches: [
      {
        name: 'Approach 1: Prefix Sum Array (Optimal)',
        idea: 'Construct a prefix sum array of size N+1 where prefix[k] = sum(nums[0..k-1]). Any range sum from left to right is prefix[right+1] - prefix[left].',
        dryRun: 'nums = [-2, 0, 3, -5, 2, -1] -> prefix = [0, -2, -2, 1, -4, -2, -3]. sumRange(0, 2) = prefix[3] - prefix[0] = 1 - 0 = 1.',
        timeComplexity: 'O(N) precomputation, O(1) per query',
        spaceComplexity: 'O(N) auxiliary space for prefix array',
        code: {
          python: `import sys\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    pref = [0] * (n + 1)\n    for i in range(n):\n        pref[i+1] = pref[i] + nums[i]\n    q = int(t[n+1])\n    pos = n + 2\n    out = []\n    for _ in range(q):\n        l, r = int(t[pos]), int(t[pos+1])\n        pos += 2\n        out.append(str(pref[r+1] - pref[l]))\n    print('\\n'.join(out))\nif __name__ == '__main__': solve()`,
          java: `// Prefix sum O(1) per query`,
          cpp: `// Prefix sum O(1) per query`,
          javascript: `// Prefix sum O(1) per query`
        }
      }
    ],
    sampleInputs: [
      '6\n-2 0 3 -5 2 -1\n3\n0 2\n2 5\n0 5',
      '5\n1 2 3 4 5\n2\n1 3\n0 4',
      '3\n10 -5 20\n1\n1 1'
    ],
    hiddenInputs: [
      '1\n42\n1\n0 0',
      '4\n0 0 0 0\n2\n0 1\n1 3',
      '5\n-10 -20 -30 -40 -50\n3\n0 4\n1 3\n2 2',
      '6\n100 -50 200 -100 300 -150\n4\n0 5\n1 4\n2 3\n0 0',
      '8\n1 1 1 1 1 1 1 1\n3\n0 7\n2 5\n3 3'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const nums = tokens.slice(1, n + 1).map(Number);
      const prefix = new Array(n + 1).fill(0);
      for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
      const q = parseInt(tokens[n + 1], 10);
      let pos = n + 2;
      const res = [];
      for (let i = 0; i < q; i++) {
        const l = parseInt(tokens[pos++], 10);
        const r = parseInt(tokens[pos++], 10);
        res.push(prefix[r + 1] - prefix[l]);
      }
      return res.join('\n');
    }
  }),

  // 2. Find Pivot Index (Equilibrium Index) (Easy)
  createCanonicalProblem({
    problemId: 'dsa_prefix-sum_02',
    topicId: 'prefix-sum',
    order: 2,
    title: 'Find Pivot Index',
    difficulty: 'Easy',
    tags: ['Prefix Sum', 'Array'],
    statement: `Given an array of integers \`nums\`, calculate the **pivot index** (also known as the equilibrium index).

The pivot index is the index where the sum of all the numbers strictly to the left of the index is equal to the sum of all the numbers strictly to the index's right.

If the index is on the left edge of the array, then the left sum is \`0\` because there are no elements to the left. This also applies to the right edge of the array.

Return the **leftmost pivot index**. If no such index exists, return \`-1\`.`,
    inputFormat: `First line: integer N (array length).
Second line: N space-separated integers representing nums.`,
    outputFormat: `Print the leftmost pivot index, or -1 if none exists.`,
    constraints: [
      '1 <= N <= 10^5',
      '-1000 <= nums[i] <= 1000'
    ],
    examples: [
      {
        input: '6\n1 7 3 6 5 6',
        displayInput: 'nums = [1, 7, 3, 6, 5, 6]',
        output: '3',
        displayOutput: '3',
        explanation: 'The pivot index is 3.\nLeft sum = nums[0] + nums[1] + nums[2] = 1 + 7 + 3 = 11\nRight sum = nums[4] + nums[5] = 5 + 6 = 11'
      },
      {
        input: '3\n1 2 3',
        displayInput: 'nums = [1, 2, 3]',
        output: '-1',
        displayOutput: '-1',
        explanation: 'There is no index that satisfies the condition in the array.'
      },
      {
        input: '3\n2 1 -1',
        displayInput: 'nums = [2, 1, -1]',
        output: '0',
        displayOutput: '0',
        explanation: 'The pivot index is 0.\nLeft sum = 0 (no elements to the left of index 0)\nRight sum = nums[1] + nums[2] = 1 + (-1) = 0'
      }
    ],
    hints: [
      'Precompute the total sum of the array first in a single pass.',
      'Maintain a running leftSum. At each index i, rightSum is totalSum - leftSum - nums[i].',
      'If leftSum equals rightSum, return i immediately.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    approaches: [
      {
        name: 'Approach 1: Total Sum - Left Sum (Optimal)',
        idea: 'Calculate the total sum first. Then iterate left to right tracking leftSum. If leftSum == totalSum - leftSum - nums[i], we found the equilibrium index.',
        dryRun: 'nums = [1, 7, 3, 6, 5, 6], totalSum = 28. i=0: left=0, right=27. i=1: left=1, right=20. i=2: left=8, right=17. i=3: left=11, right=11 -> match! Return 3.',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        code: {
          python: `import sys\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    total = sum(nums)\n    left = 0\n    for i, x in enumerate(nums):\n        if left == total - left - x:\n            print(i)\n            return\n        left += x\n    print(-1)\nif __name__ == '__main__': solve()`,
          java: `// Pivot index O(N) time O(1) space`,
          cpp: `// Pivot index O(N) time O(1) space`,
          javascript: `// Pivot index O(N) time O(1) space`
        }
      }
    ],
    sampleInputs: [
      '6\n1 7 3 6 5 6',
      '3\n1 2 3',
      '3\n2 1 -1'
    ],
    hiddenInputs: [
      '1\n0',
      '1\n5',
      '2\n0 0',
      '3\n0 0 0',
      '4\n-1 -1 -1 0',
      '5\n-1 -1 0 1 1',
      '6\n2 3 5 0 5 5',
      '5\n10 20 30 20 10'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const nums = tokens.slice(1, n + 1).map(Number);
      const total = nums.reduce((a, b) => a + b, 0);
      let left = 0;
      for (let i = 0; i < n; i++) {
        if (left === total - left - nums[i]) return String(i);
        left += nums[i];
      }
      return '-1';
    }
  }),

  // 3. Running Sum of 1d Array (Easy)
  createCanonicalProblem({
    problemId: 'dsa_prefix-sum_03',
    topicId: 'prefix-sum',
    order: 3,
    title: 'Running Sum of 1d Array',
    difficulty: 'Easy',
    tags: ['Prefix Sum', 'Array'],
    statement: `Given an array \`nums\`, we define a running sum of an array as \`runningSum[i] = sum(nums[0]…nums[i])\`.

Return the running sum of \`nums\` as space-separated integers.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the running sum array elements separated by spaces.`,
    constraints: [
      '1 <= N <= 10^5',
      '-10^6 <= nums[i] <= 10^6'
    ],
    examples: [
      {
        input: '4\n1 2 3 4',
        displayInput: 'nums = [1, 2, 3, 4]',
        output: '1 3 6 10',
        displayOutput: '[1, 3, 6, 10]',
        explanation: 'Running sum is obtained as follows: [1, 1+2, 1+2+3, 1+2+3+4] = [1, 3, 6, 10].'
      },
      {
        input: '5\n1 1 1 1 1',
        displayInput: 'nums = [1, 1, 1, 1, 1]',
        output: '1 2 3 4 5',
        displayOutput: '[1, 2, 3, 4, 5]',
        explanation: 'Running sum is obtained as follows: [1, 1+1, 1+1+1, 1+1+1+1, 1+1+1+1+1].'
      },
      {
        input: '5\n3 1 2 10 1',
        displayInput: 'nums = [3, 1, 2, 10, 1]',
        output: '3 4 6 16 17',
        displayOutput: '[3, 4, 6, 16, 17]',
        explanation: '[3, 3+1, 3+1+2, 3+1+2+10, 3+1+2+10+1].'
      }
    ],
    hints: [
      'Maintain an accumulator variable as you iterate through nums.',
      'Add each nums[i] to the accumulator and print/store it.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    approaches: [
      {
        name: 'Approach 1: Single Pass Accumulation (Optimal)',
        idea: 'Keep a running sum variable or overwrite nums[i] += nums[i-1].',
        dryRun: 'nums = [1, 2, 3, 4] -> [1, 3, 6, 10].',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1) auxiliary',
        code: {
          python: `import sys\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    curr = 0\n    res = []\n    for x in nums:\n        curr += x\n        res.append(str(curr))\n    print(" ".join(res))\nif __name__ == '__main__': solve()`,
          java: `// Running sum`,
          cpp: `// Running sum`,
          javascript: `// Running sum`
        }
      }
    ],
    sampleInputs: [
      '4\n1 2 3 4',
      '5\n1 1 1 1 1',
      '5\n3 1 2 10 1'
    ],
    hiddenInputs: [
      '1\n100',
      '2\n-5 5',
      '3\n0 0 0',
      '5\n-1 -2 -3 -4 -5',
      '6\n10 -10 20 -20 30 -30',
      '4\n1000 2000 3000 4000'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const nums = tokens.slice(1, n + 1).map(Number);
      let curr = 0;
      const res = [];
      for (const x of nums) {
        curr += x;
        res.push(curr);
      }
      return res.join(' ');
    }
  }),

  // 4. Find the Highest Altitude (Easy)
  createCanonicalProblem({
    problemId: 'dsa_prefix-sum_04',
    topicId: 'prefix-sum',
    order: 4,
    title: 'Find the Highest Altitude',
    difficulty: 'Easy',
    tags: ['Prefix Sum', 'Array'],
    statement: `There is a biker going on a road trip. The road trip consists of \`n + 1\` points at different altitudes. The biker starts his trip at point 0 with altitude equal to \`0\`.

You are given an integer array \`gain\` of length \`n\` where \`gain[i]\` is the net gain in altitude between points \`i\` and \`i + 1\` for all (0 <= i < n).

Return the **highest altitude** of a point.`,
    inputFormat: `First line: integer N (gain array length).
Second line: N space-separated integers representing gain.`,
    outputFormat: `Print the highest altitude attained.`,
    constraints: [
      '1 <= N <= 10^5',
      '-100 <= gain[i] <= 100'
    ],
    examples: [
      {
        input: '5\n-5 1 5 0 -7',
        displayInput: 'gain = [-5, 1, 5, 0, -7]',
        output: '1',
        displayOutput: '1',
        explanation: 'The altitudes are [0, -5, -4, 1, 1, -6]. The highest is 1.'
      },
      {
        input: '7\n-4 -3 -2 -1 4 3 2',
        displayInput: 'gain = [-4, -3, -2, -1, 4, 3, 2]',
        output: '0',
        displayOutput: '0',
        explanation: 'The altitudes are [0, -4, -7, -9, -10, -6, -3, -1]. The highest is 0.'
      }
    ],
    hints: [
      'The altitude at any step is the prefix sum of gains starting from 0.',
      'Track the running sum and update maxAltitude = max(maxAltitude, currentAltitude).'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    gain = [int(x) for x in tokens[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] gain = new int[n];\n        for (int i = 0; i < n; i++) gain[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> gain(n);\n    for (int i = 0; i < n; i++) cin >> gain[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const gain = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    approaches: [
      {
        name: 'Approach 1: Prefix Max Tracking (Optimal)',
        idea: 'Start altitude at 0, maxAltitude at 0. Add each gain to current altitude and take the max.',
        dryRun: 'gain = [-5, 1, 5, 0, -7]. alt=0 -> -5 -> -4 -> 1 -> 1 -> -6. Max is 1.',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        code: {
          python: `import sys\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    gain = [int(x) for x in t[1:n+1]]\n    curr, max_alt = 0, 0\n    for g in gain:\n        curr += g\n        if curr > max_alt: max_alt = curr\n    print(max_alt)\nif __name__ == '__main__': solve()`,
          java: `// Highest altitude`,
          cpp: `// Highest altitude`,
          javascript: `// Highest altitude`
        }
      }
    ],
    sampleInputs: [
      '5\n-5 1 5 0 -7',
      '7\n-4 -3 -2 -1 4 3 2'
    ],
    hiddenInputs: [
      '1\n10',
      '1\n-10',
      '3\n5 10 15',
      '4\n-1 -2 -3 -4',
      '5\n0 0 0 0 0'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const gain = tokens.slice(1, n + 1).map(Number);
      let curr = 0, maxAlt = 0;
      for (const g of gain) {
        curr += g;
        if (curr > maxAlt) maxAlt = curr;
      }
      return String(maxAlt);
    }
  }),

  // 5. Left and Right Sum Differences (Easy)
  createCanonicalProblem({
    problemId: 'dsa_prefix-sum_05',
    topicId: 'prefix-sum',
    order: 5,
    title: 'Left and Right Sum Differences',
    difficulty: 'Easy',
    tags: ['Prefix Sum', 'Array'],
    statement: `Given a 0-indexed integer array \`nums\`, find a 0-indexed integer array \`answer\` where:

\`answer[i] = |leftSum[i] - rightSum[i]|\`

Where:
- \`leftSum[i]\` is the sum of elements to the left of the index \`i\` in the array \`nums\`. If there is no such element, \`leftSum[i] = 0\`.
- \`rightSum[i]\` is the sum of elements to the right of the index \`i\` in the array \`nums\`. If there is no such element, \`rightSum[i] = 0\`.

Return the array \`answer\` as space-separated integers.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the answer array separated by spaces.`,
    constraints: [
      '1 <= N <= 10^5',
      '1 <= nums[i] <= 10^5'
    ],
    examples: [
      {
        input: '4\n10 4 8 3',
        displayInput: 'nums = [10, 4, 8, 3]',
        output: '15 1 11 22',
        displayOutput: '[15, 1, 11, 22]',
        explanation: 'leftSum = [0, 10, 14, 22], rightSum = [15, 11, 3, 0]. answer = [|0-15|, |10-11|, |14-3|, |22-0|] = [15, 1, 11, 22].'
      },
      {
        input: '1\n1',
        displayInput: 'nums = [1]',
        output: '0',
        displayOutput: '[0]',
        explanation: 'leftSum = [0], rightSum = [0]. answer = [|0-0|] = [0].'
      }
    ],
    hints: [
      'Compute the total sum of the array first.',
      'Iterate through the array maintaining leftSum; rightSum at index i is totalSum - leftSum - nums[i].',
      'answer[i] = abs(leftSum - rightSum).'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <cmath>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    approaches: [
      {
        name: 'Approach 1: Single Pass with Total Sum (Optimal)',
        idea: 'Precompute totalSum. Maintain leftSum. rightSum = totalSum - leftSum - nums[i]. answer[i] = abs(leftSum - rightSum).',
        dryRun: 'nums = [10, 4, 8, 3], total = 25. i=0: left=0, right=15 -> 15. i=1: left=10, right=11 -> 1. i=2: left=14, right=3 -> 11. i=3: left=22, right=0 -> 22.',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1) auxiliary',
        code: {
          python: `import sys\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    total = sum(nums)\n    left = 0\n    res = []\n    for x in nums:\n        right = total - left - x\n        res.append(str(abs(left - right)))\n        left += x\n    print(" ".join(res))\nif __name__ == '__main__': solve()`,
          java: `// Left and right sum differences`,
          cpp: `// Left and right sum differences`,
          javascript: `// Left and right sum differences`
        }
      }
    ],
    sampleInputs: [
      '4\n10 4 8 3',
      '1\n1'
    ],
    hiddenInputs: [
      '2\n5 5',
      '3\n1 2 3',
      '5\n1 1 1 1 1',
      '4\n100 200 300 400',
      '5\n2 3 5 7 11'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const nums = tokens.slice(1, n + 1).map(Number);
      const total = nums.reduce((a, b) => a + b, 0);
      let left = 0;
      const res = [];
      for (const x of nums) {
        const right = total - left - x;
        res.push(Math.abs(left - right));
        left += x;
      }
      return res.join(' ');
    }
  }),

  // 6. Minimum Value to Get Positive Step by Step Sum (Easy)
  createCanonicalProblem({
    problemId: 'dsa_prefix-sum_06',
    topicId: 'prefix-sum',
    order: 6,
    title: 'Minimum Value to Get Positive Step by Step Sum',
    difficulty: 'Easy',
    tags: ['Prefix Sum', 'Array'],
    statement: `Given an array of integers \`nums\`, you start with an initial positive value \`startValue\`.

In each iteration, you calculate the step by step sum of \`startValue\` plus elements in \`nums\` (from left to right).

Return the minimum positive value of \`startValue\` such that the step by step sum is never less than 1.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the minimum startValue.`,
    constraints: [
      '1 <= N <= 10^5',
      '-100 <= nums[i] <= 100'
    ],
    examples: [
      {
        input: '5\n-3 2 -3 4 2',
        displayInput: 'nums = [-3, 2, -3, 4, 2]',
        output: '5',
        displayOutput: '5',
        explanation: 'If startValue = 4, step sums: (4-3)=1, (1+2)=3, (3-3)=0 (less than 1, invalid).\nIf startValue = 5, step sums: (5-3)=2, (2+2)=4, (4-3)=1, (1+4)=5, (5+2)=7. All >= 1. Return 5.'
      },
      {
        input: '3\n1 2',
        displayInput: 'nums = [1, 2]',
        output: '1',
        displayOutput: '1',
        explanation: 'Minimum start value must be positive, so 1 is the answer.'
      },
      {
        input: '3\n1 -2 -3',
        displayInput: 'nums = [1, -2, -3]',
        output: '5',
        displayOutput: '5',
        explanation: 'Lowest running sum is -4. startValue + (-4) >= 1 => startValue >= 5.'
      }
    ],
    hints: [
      'Calculate the minimum prefix sum achieved at any point during iteration.',
      'If the minimum prefix sum is minPrefix, then startValue + minPrefix >= 1.',
      'Therefore, startValue = max(1, 1 - minPrefix).'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    approaches: [
      {
        name: 'Approach 1: Track Min Prefix Sum (Optimal)',
        idea: 'Track min_prefix = min(min_prefix, running_sum). Result is max(1, 1 - min_prefix).',
        dryRun: 'nums = [-3, 2, -3, 4, 2]. Running sums: -3, -1, -4, 0, 2. Min running sum is -4. Result = 1 - (-4) = 5.',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        code: {
          python: `import sys\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    curr, min_p = 0, 0\n    for x in nums:\n        curr += x\n        if curr < min_p: min_p = curr\n    print(max(1, 1 - min_p))\nif __name__ == '__main__': solve()`,
          java: `// Min step sum`,
          cpp: `// Min step sum`,
          javascript: `// Min step sum`
        }
      }
    ],
    sampleInputs: [
      '5\n-3 2 -3 4 2',
      '2\n1 2',
      '3\n1 -2 -3'
    ],
    hiddenInputs: [
      '1\n-100',
      '1\n100',
      '4\n-1 -1 -1 -1',
      '5\n10 -20 5 -15 2',
      '3\n0 0 0'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const nums = tokens.slice(1, n + 1).map(Number);
      let curr = 0, minP = 0;
      for (const x of nums) {
        curr += x;
        if (curr < minP) minP = curr;
      }
      return String(Math.max(1, 1 - minP));
    }
  }),

  // 7. Sum of All Odd Length Subarrays (Easy)
  createCanonicalProblem({
    problemId: 'dsa_prefix-sum_07',
    topicId: 'prefix-sum',
    order: 7,
    title: 'Sum of All Odd Length Subarrays',
    difficulty: 'Easy',
    tags: ['Prefix Sum', 'Math', 'Array'],
    statement: `Given an array of positive integers \`arr\`, return the sum of all possible **odd-length subarrays** of \`arr\`.

A subarray is a contiguous subsequence of the array.`,
    inputFormat: `First line: integer N.
Second line: N space-separated positive integers.`,
    outputFormat: `Print the total sum of all odd-length subarrays.`,
    constraints: [
      '1 <= N <= 10^5',
      '1 <= arr[i] <= 1000'
    ],
    examples: [
      {
        input: '5\n1 4 2 5 3',
        displayInput: 'arr = [1, 4, 2, 5, 3]',
        output: '58',
        displayOutput: '58',
        explanation: 'Length 1: [1], [4], [2], [5], [3] -> sum = 15\nLength 3: [1,4,2]=7, [4,2,5]=11, [2,5,3]=10 -> sum = 28\nLength 5: [1,4,2,5,3]=15 -> sum = 15\nTotal sum = 15 + 28 + 15 = 58.'
      },
      {
        input: '2\n1 2',
        displayInput: 'arr = [1, 2]',
        output: '3',
        displayOutput: '3',
        explanation: 'Only odd-length subarrays are [1] and [2]. Sum = 3.'
      },
      {
        input: '3\n10 11 12',
        displayInput: 'arr = [10, 11, 12]',
        output: '66',
        displayOutput: '66',
        explanation: '[10]+[11]+[12] + [10,11,12] = 33 + 33 = 66.'
      }
    ],
    hints: [
      'For each element arr[i], count how many odd-length subarrays contain it.',
      'The number of subarrays containing arr[i] is (i + 1) * (N - i).',
      'Exactly Math.ceil(((i + 1) * (N - i)) / 2) of them have odd length.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    arr = [int(x) for x in tokens[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const arr = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    approaches: [
      {
        name: 'Approach 1: Contribution of each element (Optimal)',
        idea: 'An element at index i appears in (i+1)*(N-i) total subarrays. Exactly ceil(totalSubarrays / 2) = ((i+1)*(N-i) + 1) // 2 of them have odd length.',
        dryRun: 'arr = [1, 4, 2, 5, 3], N=5. i=0: (1*5+1)//2 = 3 times * 1 = 3. Total sum = 58.',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        code: {
          python: `import sys\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    arr = [int(x) for x in t[1:n+1]]\n    ans = 0\n    for i, x in enumerate(arr):\n        cnt = ((i + 1) * (n - i) + 1) // 2\n        ans += cnt * x\n    print(ans)\nif __name__ == '__main__': solve()`,
          java: `// Contribution technique`,
          cpp: `// Contribution technique`,
          javascript: `// Contribution technique`
        }
      }
    ],
    sampleInputs: [
      '5\n1 4 2 5 3',
      '2\n1 2',
      '3\n10 11 12'
    ],
    hiddenInputs: [
      '1\n7',
      '4\n1 2 3 4',
      '5\n5 5 5 5 5',
      '6\n1 3 5 7 9 11'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const arr = tokens.slice(1, n + 1).map(Number);
      let ans = 0;
      for (let i = 0; i < n; i++) {
        const cnt = Math.floor(((i + 1) * (n - i) + 1) / 2);
        ans += cnt * arr[i];
      }
      return String(ans);
    }
  }),

  // 8. Subarray Sum Equals K (Medium)
  createCanonicalProblem({
    problemId: 'dsa_prefix-sum_08',
    topicId: 'prefix-sum',
    order: 8,
    title: 'Subarray Sum Equals K',
    difficulty: 'Medium',
    tags: ['Prefix Sum', 'Hash Table', 'Array'],
    statement: `Given an array of integers \`nums\` and an integer \`k\`, return the total number of continuous subarrays whose sum equals to \`k\`.

A subarray is a contiguous non-empty sequence of elements within an array.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer K.`,
    outputFormat: `Print the total number of subarrays summing to K.`,
    constraints: [
      '1 <= N <= 10^5',
      '-1000 <= nums[i] <= 1000',
      '-10^7 <= K <= 10^7'
    ],
    examples: [
      {
        input: '3\n1 1 1\n2',
        displayInput: 'nums = [1, 1, 1], k = 2',
        output: '2',
        displayOutput: '2',
        explanation: 'Subarrays [nums[0], nums[1]] and [nums[1], nums[2]] sum to 2.'
      },
      {
        input: '3\n1 2 3\n3',
        displayInput: 'nums = [1, 2, 3], k = 3',
        output: '2',
        displayOutput: '2',
        explanation: 'Subarrays [1, 2] and [3] sum to 3.'
      },
      {
        input: '4\n1 -1 0 1\n0',
        displayInput: 'nums = [1, -1, 0, 1], k = 0',
        output: '3',
        displayOutput: '3',
        explanation: '[1, -1], [0], and [1, -1, 0] all sum to 0.'
      }
    ],
    hints: [
      'If prefix[j] - prefix[i] = k, then the subarray from i to j-1 sums to k.',
      'Maintain a running prefix sum and a frequency map of seen prefix sums.',
      'Initialize map with {0: 1} to account for subarrays starting from index 0.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    k = int(tokens[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int k = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    int k; cin >> k;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    const k = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    approaches: [
      {
        name: 'Approach 1: Prefix Sum + Hash Map (Optimal)',
        idea: 'Store the frequency of each prefix sum in a hash map. For each prefix sum s, add map[s - k] to the count.',
        dryRun: 'nums = [1, 1, 1], k = 2. s=0: map={0:1}. s=1: map[1-2]=0. s=2: map[2-2]=1 -> count=1. s=3: map[3-2]=1 -> count=2. Return 2.',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        code: {
          python: `import sys\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    k = int(t[n+1])\n    cnt = 0\n    curr = 0\n    mp = {0: 1}\n    for x in nums:\n        curr += x\n        cnt += mp.get(curr - k, 0)\n        mp[curr] = mp.get(curr, 0) + 1\n    print(cnt)\nif __name__ == '__main__': solve()`,
          java: `// Subarray sum equals k`,
          cpp: `// Subarray sum equals k`,
          javascript: `// Subarray sum equals k`
        }
      }
    ],
    sampleInputs: [
      '3\n1 1 1\n2',
      '3\n1 2 3\n3',
      '4\n1 -1 0 1\n0'
    ],
    hiddenInputs: [
      '1\n0\n0',
      '2\n-1 -1\n-2',
      '5\n3 4 7 2 -3\n7',
      '6\n1 2 3 4 5 6\n15',
      '4\n0 0 0 0\n0',
      '5\n-2 -1 2 1 -2\n0'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const nums = tokens.slice(1, n + 1).map(Number);
      const k = parseInt(tokens[n + 1], 10);
      let count = 0, sum = 0;
      const map = new Map([[0, 1]]);
      for (const num of nums) {
        sum += num;
        if (map.has(sum - k)) count += map.get(sum - k);
        map.set(sum, (map.get(sum) || 0) + 1);
      }
      return String(count);
    }
  }),

  // 9. Continuous Subarray Sum (Medium)
  createCanonicalProblem({
    problemId: 'dsa_prefix-sum_09',
    topicId: 'prefix-sum',
    order: 9,
    title: 'Continuous Subarray Sum',
    difficulty: 'Medium',
    tags: ['Prefix Sum', 'Hash Table', 'Math'],
    statement: `Given an integer array \`nums\` and an integer \`k\`, return \`true\` if \`nums\` has a **good subarray** or \`false\` otherwise.

A good subarray is a subarray where:
- Its length is at least two, and
- The sum of the elements of the subarray is a multiple of \`k\` (i.e. \`sum % k == 0\`).

Note that 0 is always a multiple of k.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer K.`,
    outputFormat: `Print 'true' if such a subarray exists, else 'false'.`,
    constraints: [
      '1 <= N <= 10^5',
      '0 <= nums[i] <= 10^9',
      '1 <= K <= 2 * 10^9'
    ],
    examples: [
      {
        input: '5\n23 2 4 6 7\n6',
        displayInput: 'nums = [23, 2, 4, 6, 7], k = 6',
        output: 'true',
        displayOutput: 'true',
        explanation: '[2, 4] is a continuous subarray of size 2 whose sum is 6 (a multiple of 6).'
      },
      {
        input: '5\n23 2 6 4 7\n6',
        displayInput: 'nums = [23, 2, 6, 4, 7], k = 6',
        output: 'true',
        displayOutput: 'true',
        explanation: '[23, 2, 6, 4, 7] has sum 42, which is a multiple of 6.'
      },
      {
        input: '5\n23 2 6 4 7\n13',
        displayInput: 'nums = [23, 2, 6, 4, 7], k = 13',
        output: 'false',
        displayOutput: 'false',
        explanation: 'No subarray of length at least 2 sums to a multiple of 13.'
      }
    ],
    hints: [
      'If prefix[j] % k == prefix[i] % k, then the subarray between i and j has sum divisible by k.',
      'Store the earliest index of each remainder in a hash map: {remainder: first_seen_index}.',
      'Initialize map with {0: -1}. If a remainder was seen at index i and current index j has j - i >= 2, return true.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    k = int(tokens[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int k = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    int k; cin >> k;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    const k = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    approaches: [
      {
        name: 'Approach 1: Prefix Modulo Hash Map (Optimal)',
        idea: 'Store remainder -> earliest index in a hash map initialized with {0: -1}. If remainder repeats with index difference >= 2, return true.',
        dryRun: 'nums = [23, 2, 4, 6, 7], k = 6. i=0: 23%6=5 -> map[5]=0. i=1: (23+2)%6=1 -> map[1]=1. i=2: (25+4)%6=5 -> seen at 0! diff=2-0=2 >= 2 -> True.',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(min(N, K))',
        code: {
          python: `import sys\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    k = int(t[n+1])\n    mp = {0: -1}\n    curr = 0\n    for i, x in enumerate(nums):\n        curr = (curr + x) % k\n        if curr in mp:\n            if i - mp[curr] >= 2:\n                print("true")\n                return\n        else:\n            mp[curr] = i\n    print("false")\nif __name__ == '__main__': solve()`,
          java: `// Continuous subarray sum`,
          cpp: `// Continuous subarray sum`,
          javascript: `// Continuous subarray sum`
        }
      }
    ],
    sampleInputs: [
      '5\n23 2 4 6 7\n6',
      '5\n23 2 6 4 7\n6',
      '5\n23 2 6 4 7\n13'
    ],
    hiddenInputs: [
      '2\n0 0\n1',
      '2\n5 0\n5',
      '3\n1 2 3\n5',
      '4\n1 0 1 0\n4',
      '5\n0 1 0 3 0\n2'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const nums = tokens.slice(1, n + 1).map(Number);
      const k = parseInt(tokens[n + 1], 10);
      const map = new Map([[0, -1]]);
      let curr = 0;
      for (let i = 0; i < n; i++) {
        curr = (curr + nums[i]) % k;
        if (map.has(curr)) {
          if (i - map.get(curr) >= 2) return 'true';
        } else {
          map.set(curr, i);
        }
      }
      return 'false';
    }
  }),

  // 10. Contiguous Array (Equal 0s and 1s) (Medium)
  createCanonicalProblem({
    problemId: 'dsa_prefix-sum_10',
    topicId: 'prefix-sum',
    order: 10,
    title: 'Contiguous Array',
    difficulty: 'Medium',
    tags: ['Prefix Sum', 'Hash Table', 'Array'],
    statement: `Given a binary array \`nums\`, return the maximum length of a contiguous subarray with an equal number of \`0\` and \`1\`.`,
    inputFormat: `First line: integer N.
Second line: N space-separated binary integers (0 or 1).`,
    outputFormat: `Print the maximum length of contiguous subarray with equal 0s and 1s.`,
    constraints: [
      '1 <= N <= 10^5',
      'nums[i] is either 0 or 1'
    ],
    examples: [
      {
        input: '2\n0 1',
        displayInput: 'nums = [0, 1]',
        output: '2',
        displayOutput: '2',
        explanation: '[0, 1] is the longest contiguous subarray with an equal number of 0 and 1.'
      },
      {
        input: '2\n0 0',
        displayInput: 'nums = [0, 0]',
        output: '0',
        displayOutput: '0',
        explanation: 'There is no contiguous subarray with equal number of 0 and 1.'
      },
      {
        input: '6\n0 1 0 1 1 0',
        displayInput: 'nums = [0, 1, 0, 1, 1, 0]',
        output: '6',
        displayOutput: '6',
        explanation: 'Entire array has three 0s and three 1s. Length = 6.'
      }
    ],
    hints: [
      'Transform 0 to -1. The problem becomes finding the longest subarray with sum equal to 0!',
      'Store prefix sum -> earliest index in a hash map initialized with {0: -1}.',
      'When the same prefix sum repeats, the subarray between the two occurrences has sum 0.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    approaches: [
      {
        name: 'Approach 1: Replace 0 with -1 + Hash Map (Optimal)',
        idea: 'Map 0 to -1. Track prefix sum in a hash map initialized with {0: -1}. If prefix sum repeats, length is i - map[prefix_sum]. Take the maximum.',
        dryRun: 'nums = [0, 1] -> [-1, 1]. i=0: sum=-1, map[-1]=0. i=1: sum=0, seen at -1 -> len = 1 - (-1) = 2.',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        code: {
          python: `import sys\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    mp = {0: -1}\n    curr = 0\n    max_len = 0\n    for i, x in enumerate(nums):\n        curr += (1 if x == 1 else -1)\n        if curr in mp:\n            max_len = max(max_len, i - mp[curr])\n        else:\n            mp[curr] = i\n    print(max_len)\nif __name__ == '__main__': solve()`,
          java: `// Contiguous array`,
          cpp: `// Contiguous array`,
          javascript: `// Contiguous array`
        }
      }
    ],
    sampleInputs: [
      '2\n0 1',
      '2\n0 0',
      '6\n0 1 0 1 1 0'
    ],
    hiddenInputs: [
      '1\n0',
      '1\n1',
      '4\n0 0 1 1',
      '5\n0 1 1 0 1',
      '8\n0 0 0 1 1 1 0 1'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const nums = tokens.slice(1, n + 1).map(Number);
      const map = new Map([[0, -1]]);
      let curr = 0, maxLen = 0;
      for (let i = 0; i < n; i++) {
        curr += (nums[i] === 1 ? 1 : -1);
        if (map.has(curr)) {
          maxLen = Math.max(maxLen, i - map.get(curr));
        } else {
          map.set(curr, i);
        }
      }
      return String(maxLen);
    }
  }),

  // 11. Range Sum Query 2D - Immutable (Medium)
  createCanonicalProblem({
    problemId: 'dsa_prefix-sum_11',
    topicId: 'prefix-sum',
    order: 11,
    title: 'Range Sum Query 2D - Immutable',
    difficulty: 'Medium',
    tags: ['Prefix Sum', 'Matrix', 'Design'],
    statement: `Given a 2D matrix \`matrix\`, handle multiple queries of the following type:

Calculate the sum of the elements of \`matrix\` inside the rectangle defined by its **upper left corner** \`(row1, col1)\` and **lower right corner** \`(row2, col2)\`.

You must implement a solution that precomputes 2D prefix sums so that each submatrix query executes in **O(1)** time.`,
    inputFormat: `First line: two space-separated integers R and C (rows and columns).
Next R lines: C space-separated integers representing the matrix.
Next line: integer Q (number of queries).
Next Q lines: four space-separated integers row1, col1, row2, col2.`,
    outputFormat: `Print the sum for each query on a new line.`,
    constraints: [
      '1 <= R, C <= 200',
      '-10^4 <= matrix[r][c] <= 10^4',
      '1 <= Q <= 10^4',
      '0 <= row1 <= row2 < R',
      '0 <= col1 <= col2 < C'
    ],
    examples: [
      {
        input: '5 5\n3 0 1 4 2\n5 6 3 2 1\n1 2 0 1 5\n4 1 0 1 7\n1 0 3 0 5\n3\n2 1 4 3\n1 1 2 2\n1 2 2 4',
        displayInput: 'matrix (5x5), queries: [[2,1,4,3], [1,1,2,2], [1,2,2,4]]',
        output: '8\n11\n12',
        displayOutput: '8\n11\n12',
        explanation: 'Rectangle (2,1)-(4,3) elements sum to 8.\nRectangle (1,1)-(2,2) elements sum to 11.\nRectangle (1,2)-(2,4) elements sum to 12.'
      }
    ],
    hints: [
      'Construct a 2D prefix sum array P of size (R+1) x (C+1).',
      'P[r][c] = matrix[r-1][c-1] + P[r-1][c] + P[r][c-1] - P[r-1][c-1].',
      'For query (r1, c1) to (r2, c2): sum = P[r2+1][c2+1] - P[r1][c2+1] - P[r2+1][c1] + P[r1][c1].'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    r, c = int(tokens[0]), int(tokens[1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int r = sc.nextInt(), c = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int r, c; if (!(cin >> r >> c)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length < 2) return;\n    const r = parseInt(t[0], 10), c = parseInt(t[1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    approaches: [
      {
        name: 'Approach 1: 2D Inclusion-Exclusion Prefix Array (Optimal)',
        idea: 'Precompute 2D prefix sums where P[i][j] covers submatrix from (0,0) to (i-1,j-1). Use inclusion-exclusion to answer rectangle queries in O(1).',
        dryRun: 'P[r2+1][c2+1] - P[r1][c2+1] - P[r2+1][c1] + P[r1][c1].',
        timeComplexity: 'O(R * C) precomputation, O(1) per query',
        spaceComplexity: 'O(R * C)',
        code: {
          python: `import sys\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    r, c = int(t[0]), int(t[1])\n    pos = 2\n    P = [[0] * (c + 1) for _ in range(r + 1)]\n    for i in range(r):\n        for j in range(c):\n            val = int(t[pos]); pos += 1\n            P[i+1][j+1] = val + P[i][j+1] + P[i+1][j] - P[i][j]\n    q = int(t[pos]); pos += 1\n    out = []\n    for _ in range(q):\n        r1, c1, r2, c2 = int(t[pos]), int(t[pos+1]), int(t[pos+2]), int(t[pos+3])\n        pos += 4\n        ans = P[r2+1][c2+1] - P[r1][c2+1] - P[r2+1][c1] + P[r1][c1]\n        out.append(str(ans))\n    print('\\n'.join(out))\nif __name__ == '__main__': solve()`,
          java: `// 2D Range sum`,
          cpp: `// 2D Range sum`,
          javascript: `// 2D Range sum`
        }
      }
    ],
    sampleInputs: [
      '5 5\n3 0 1 4 2\n5 6 3 2 1\n1 2 0 1 5\n4 1 0 1 7\n1 0 3 0 5\n3\n2 1 4 3\n1 1 2 2\n1 2 2 4'
    ],
    hiddenInputs: [
      '2 2\n1 2\n3 4\n2\n0 0 1 1\n0 1 1 1',
      '3 3\n1 1 1\n1 1 1\n1 1 1\n2\n0 0 2 2\n1 1 2 2',
      '1 4\n5 10 15 20\n1\n0 1 0 3'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const r = parseInt(tokens[0], 10), c = parseInt(tokens[1], 10);
      let pos = 2;
      const P = Array.from({ length: r + 1 }, () => new Array(c + 1).fill(0));
      for (let i = 0; i < r; i++) {
        for (let j = 0; j < c; j++) {
          const val = Number(tokens[pos++]);
          P[i + 1][j + 1] = val + P[i][j + 1] + P[i + 1][j] - P[i][j];
        }
      }
      const q = parseInt(tokens[pos++], 10);
      const res = [];
      for (let k = 0; k < q; k++) {
        const r1 = parseInt(tokens[pos++], 10), c1 = parseInt(tokens[pos++], 10);
        const r2 = parseInt(tokens[pos++], 10), c2 = parseInt(tokens[pos++], 10);
        res.push(P[r2 + 1][c2 + 1] - P[r1][c2 + 1] - P[r2 + 1][c1] + P[r1][c1]);
      }
      return res.join('\n');
    }
  }),

  // 12. Subarray Sums Divisible by K (Medium)
  createCanonicalProblem({
    problemId: 'dsa_prefix-sum_12',
    topicId: 'prefix-sum',
    order: 12,
    title: 'Subarray Sums Divisible by K',
    difficulty: 'Medium',
    tags: ['Prefix Sum', 'Hash Table', 'Array'],
    statement: `Given an integer array \`nums\` and an integer \`k\`, return the number of non-empty subarrays that have a sum divisible by \`k\`.

A subarray is a contiguous part of an array. Remember to handle negative remainders correctly.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer K.`,
    outputFormat: `Print the total count of subarrays divisible by K.`,
    constraints: [
      '1 <= N <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
      '2 <= K <= 10^4'
    ],
    examples: [
      {
        input: '6\n4 5 0 -2 -3 1\n5',
        displayInput: 'nums = [4, 5, 0, -2, -3, 1], k = 5',
        output: '7',
        displayOutput: '7',
        explanation: 'There are 7 subarrays with a sum divisible by k = 5: [4, 5, 0, -2, -3, 1], [5], [5, 0], [5, 0, -2, -3], [0], [0, -2, -3], [-2, -3].'
      },
      {
        input: '1\n5\n9',
        displayInput: 'nums = [5], k = 9',
        output: '0',
        displayOutput: '0',
        explanation: 'No subarray sums to a multiple of 9.'
      }
    ],
    hints: [
      'Two prefix sums with the same remainder modulo k indicate that the subarray between them is divisible by k.',
      'Normalize negative remainders using ((sum % k) + k) % k.',
      'Use a frequency array or map of size k to count occurrences of each remainder.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    k = int(tokens[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int k = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    int k; cin >> k;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    const k = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    approaches: [
      {
        name: 'Approach 1: Prefix Modulo Counting (Optimal)',
        idea: 'Count frequency of each normalized remainder ((sum % k) + k) % k. If a remainder appeared c times previously, it forms c new valid subarrays.',
        dryRun: 'nums = [4, 5, 0, -2, -3, 1], k = 5. Total = 7 subarrays.',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(K)',
        code: {
          python: `import sys\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    k = int(t[n+1])\n    count = {0: 1}\n    curr = 0\n    ans = 0\n    for x in nums:\n        curr = ((curr + x) % k + k) % k\n        ans += count.get(curr, 0)\n        count[curr] = count.get(curr, 0) + 1\n    print(ans)\nif __name__ == '__main__': solve()`,
          java: `// Subarray sums divisible by k`,
          cpp: `// Subarray sums divisible by k`,
          javascript: `// Subarray sums divisible by k`
        }
      }
    ],
    sampleInputs: [
      '6\n4 5 0 -2 -3 1\n5',
      '1\n5\n9'
    ],
    hiddenInputs: [
      '2\n5 5\n5',
      '3\n-1 2 9\n2',
      '4\n1 2 3 4\n3',
      '5\n-5 -10 -15 -20 -25\n5'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const nums = tokens.slice(1, n + 1).map(Number);
      const k = parseInt(tokens[n + 1], 10);
      const map = new Map([[0, 1]]);
      let curr = 0, count = 0;
      for (const num of nums) {
        curr = ((curr + num) % k + k) % k;
        if (map.has(curr)) count += map.get(curr);
        map.set(curr, (map.get(curr) || 0) + 1);
      }
      return String(count);
    }
  }),

  // 13. Maximum Size Subarray Sum Equals K (Medium)
  createCanonicalProblem({
    problemId: 'dsa_prefix-sum_13',
    topicId: 'prefix-sum',
    order: 13,
    title: 'Maximum Size Subarray Sum Equals K',
    difficulty: 'Medium',
    tags: ['Prefix Sum', 'Hash Table', 'Array'],
    statement: `Given an integer array \`nums\` and an integer \`k\`, return the maximum length of a subarray that sums to \`k\`. If there is no such subarray, return \`0\`.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer K.`,
    outputFormat: `Print the maximum length of subarray summing to K, or 0.`,
    constraints: [
      '1 <= N <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
      '-10^9 <= K <= 10^9'
    ],
    examples: [
      {
        input: '5\n1 -1 5 -2 3\n3',
        displayInput: 'nums = [1, -1, 5, -2, 3], k = 3',
        output: '4',
        displayOutput: '4',
        explanation: 'The subarray [1, -1, 5, -2] sums to 3 and has length 4.'
      },
      {
        input: '4\n-2 -1 2 1\n1',
        displayInput: 'nums = [-2, -1, 2, 1], k = 1',
        output: '2',
        displayOutput: '2',
        explanation: 'The subarray [-1, 2] sums to 1 and has length 2.'
      }
    ],
    hints: [
      'Store prefix sum -> earliest index in a hash map: {0: -1}.',
      'For each prefix sum s, check if s - k exists in the map. If it does, length is i - map[s - k].',
      'Only insert s into the map if it is not already present, to maximize the subarray length.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    k = int(tokens[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int k = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    int k; cin >> k;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    const k = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    approaches: [
      {
        name: 'Approach 1: Earliest Prefix Sum Map (Optimal)',
        idea: 'Map prefix_sum -> first seen index. Only store first occurrence. If sum - k is in map, len = i - map[sum - k].',
        dryRun: 'nums = [1, -1, 5, -2, 3], k = 3. max_len = 4.',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        code: {
          python: `import sys\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    k = int(t[n+1])\n    mp = {0: -1}\n    curr, max_l = 0, 0\n    for i, x in enumerate(nums):\n        curr += x\n        if curr - k in mp:\n            max_l = max(max_l, i - mp[curr - k])\n        if curr not in mp:\n            mp[curr] = i\n    print(max_l)\nif __name__ == '__main__': solve()`,
          java: `// Max size subarray sum equals k`,
          cpp: `// Max size subarray sum equals k`,
          javascript: `// Max size subarray sum equals k`
        }
      }
    ],
    sampleInputs: [
      '5\n1 -1 5 -2 3\n3',
      '4\n-2 -1 2 1\n1'
    ],
    hiddenInputs: [
      '1\n5\n5',
      '3\n1 2 3\n10',
      '5\n0 0 0 0 0\n0',
      '6\n1 0 -1 1 0 -1\n0'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const nums = tokens.slice(1, n + 1).map(Number);
      const k = parseInt(tokens[n + 1], 10);
      const map = new Map([[0, -1]]);
      let sum = 0, maxLen = 0;
      for (let i = 0; i < n; i++) {
        sum += nums[i];
        if (map.has(sum - k)) {
          maxLen = Math.max(maxLen, i - map.get(sum - k));
        }
        if (!map.has(sum)) {
          map.set(sum, i);
        }
      }
      return String(maxLen);
    }
  }),

  // 14. Corporate Flight Bookings (Medium)
  createCanonicalProblem({
    problemId: 'dsa_prefix-sum_14',
    topicId: 'prefix-sum',
    order: 14,
    title: 'Corporate Flight Bookings',
    difficulty: 'Medium',
    tags: ['Prefix Sum', 'Difference Array'],
    statement: `There are \`n\` flights that are labeled from \`1\` to \`n\`.

You are given an array of flight bookings \`bookings\`, where \`bookings[i] = [first, last, seats]\` represents a booking for flights \`first\` through \`last\` (inclusive) with \`seats\` reserved for each flight in the range.

Return an array \`answer\` of length \`n\`, where \`answer[i]\` is the total number of seats reserved for flight \`i + 1\`. Output as space-separated integers.`,
    inputFormat: `First line: integer N (number of flights) and integer M (number of bookings).
Next M lines: three space-separated integers first, last, seats (1-indexed).`,
    outputFormat: `Print the total seats reserved for each flight from 1 to N separated by spaces.`,
    constraints: [
      '1 <= N, M <= 10^5',
      '1 <= first <= last <= N',
      '1 <= seats <= 10^4'
    ],
    examples: [
      {
        input: '5 3\n1 2 10\n2 3 20\n2 5 25',
        displayInput: 'n = 5, bookings = [[1,2,10],[2,3,20],[2,5,25]]',
        output: '10 55 45 25 25',
        displayOutput: '[10, 55, 45, 25, 25]',
        explanation: 'Flight 1: 10 = 10\nFlight 2: 10 + 20 + 25 = 55\nFlight 3: 20 + 25 = 45\nFlight 4: 25\nFlight 5: 25.'
      },
      {
        input: '2 2\n1 2 10\n2 2 15',
        displayInput: 'n = 2, bookings = [[1,2,10],[2,2,15]]',
        output: '10 25',
        displayOutput: '[10, 25]',
        explanation: 'Flight 1: 10\nFlight 2: 10 + 15 = 25.'
      }
    ],
    hints: [
      'This is a classic Difference Array problem.',
      'For booking [first, last, seats], add seats to diff[first - 1], and subtract seats from diff[last] (if last < n).',
      'Compute the prefix sum of diff array to obtain final seat counts in O(N + M) time.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n, m = int(tokens[0]), int(tokens[1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt(), m = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n, m; if (!(cin >> n >> m)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length < 2) return;\n    const n = parseInt(t[0], 10), m = parseInt(t[1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    approaches: [
      {
        name: 'Approach 1: Difference Array + Prefix Sum (Optimal)',
        idea: 'Use difference array diff[i] = diff[i] + seats and diff[last] -= seats. Taking prefix sum gives actual values in O(N + M).',
        dryRun: 'diff = [10, 45, 0, -20, 0, -25]. Prefix sums: [10, 55, 45, 25, 25].',
        timeComplexity: 'O(N + M)',
        spaceComplexity: 'O(N)',
        code: {
          python: `import sys\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n, m = int(t[0]), int(t[1])\n    diff = [0] * (n + 1)\n    pos = 2\n    for _ in range(m):\n        f, l, s = int(t[pos]), int(t[pos+1]), int(t[pos+2])\n        pos += 3\n        diff[f - 1] += s\n        diff[l] -= s\n    curr = 0\n    res = []\n    for i in range(n):\n        curr += diff[i]\n        res.append(str(curr))\n    print(" ".join(res))\nif __name__ == '__main__': solve()`,
          java: `// Corporate flight bookings`,
          cpp: `// Corporate flight bookings`,
          javascript: `// Corporate flight bookings`
        }
      }
    ],
    sampleInputs: [
      '5 3\n1 2 10\n2 3 20\n2 5 25',
      '2 2\n1 2 10\n2 2 15'
    ],
    hiddenInputs: [
      '3 1\n1 3 50',
      '4 2\n1 4 10\n2 3 10',
      '5 4\n1 1 5\n2 2 10\n3 3 15\n4 4 20'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10), m = parseInt(tokens[1], 10);
      const diff = new Array(n + 1).fill(0);
      let pos = 2;
      for (let i = 0; i < m; i++) {
        const first = parseInt(tokens[pos++], 10);
        const last = parseInt(tokens[pos++], 10);
        const seats = parseInt(tokens[pos++], 10);
        diff[first - 1] += seats;
        diff[last] -= seats;
      }
      let curr = 0;
      const res = [];
      for (let i = 0; i < n; i++) {
        curr += diff[i];
        res.push(curr);
      }
      return res.join(' ');
    }
  }),

  // 15. Product of Array Except Self (Medium)
  createCanonicalProblem({
    problemId: 'dsa_prefix-sum_15',
    topicId: 'prefix-sum',
    order: 15,
    title: 'Product of Array Except Self',
    difficulty: 'Medium',
    tags: ['Prefix Sum', 'Array'],
    statement: `Given an integer array \`nums\`, return an array \`answer\` such that \`answer[i]\` is equal to the product of all the elements of \`nums\` except \`nums[i]\`.

You must write an algorithm that runs in **O(N)** time and without using the division operation.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the answer array separated by spaces.`,
    constraints: [
      '2 <= N <= 10^5',
      '-30 <= nums[i] <= 30',
      'The product of any prefix or suffix of nums fits in a 32-bit integer.'
    ],
    examples: [
      {
        input: '4\n1 2 3 4',
        displayInput: 'nums = [1, 2, 3, 4]',
        output: '24 12 8 6',
        displayOutput: '[24, 12, 8, 6]',
        explanation: 'answer[0] = 2*3*4 = 24\nanswer[1] = 1*3*4 = 12\nanswer[2] = 1*2*4 = 8\nanswer[3] = 1*2*3 = 6'
      },
      {
        input: '5\n-1 1 0 -3 3',
        displayInput: 'nums = [-1, 1, 0, -3, 3]',
        output: '0 0 9 0 0',
        displayOutput: '[0, 0, 9, 0, 0]',
        explanation: 'Only index 2 has non-zero product: (-1)*1*(-3)*3 = 9.'
      }
    ],
    hints: [
      'answer[i] = (product of elements to the left of i) * (product of elements to the right of i).',
      'Compute prefix products in a first pass, then multiply by a running suffix product in a backward pass.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    approaches: [
      {
        name: 'Approach 1: Prefix and Suffix Products (Optimal)',
        idea: 'Construct answer using prefix products left to right. Then loop right to left with a suffix multiplier.',
        dryRun: 'nums = [1, 2, 3, 4] -> prefix = [1, 1, 2, 6]. Suffix multiplier = 1 -> res = [24, 12, 8, 6].',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1) auxiliary (excluding output array)',
        code: {
          python: `import sys\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    res = [1] * n\n    for i in range(1, n):\n        res[i] = res[i - 1] * nums[i - 1]\n    suffix = 1\n    for i in range(n - 1, -1, -1):\n        res[i] *= suffix\n        suffix *= nums[i]\n    print(" ".join(map(str, res)))\nif __name__ == '__main__': solve()`,
          java: `// Product of array except self`,
          cpp: `// Product of array except self`,
          javascript: `// Product of array except self`
        }
      }
    ],
    sampleInputs: [
      '4\n1 2 3 4',
      '5\n-1 1 0 -3 3'
    ],
    hiddenInputs: [
      '2\n5 10',
      '3\n0 0 2',
      '4\n-1 -1 -1 -1',
      '5\n2 3 4 5 6'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const nums = tokens.slice(1, n + 1).map(Number);
      const res = new Array(n).fill(1);
      for (let i = 1; i < n; i++) res[i] = res[i - 1] * nums[i - 1];
      let suffix = 1;
      for (let i = n - 1; i >= 0; i--) {
        res[i] *= suffix;
        suffix *= nums[i];
      }
      return res.join(' ');
    }
  }),

  // 16. Make Sum Divisible by P (Medium)
  createCanonicalProblem({
    problemId: 'dsa_prefix-sum_16',
    topicId: 'prefix-sum',
    order: 16,
    title: 'Make Sum Divisible by P',
    difficulty: 'Medium',
    tags: ['Prefix Sum', 'Hash Table', 'Array'],
    statement: `Given an array of positive integers \`nums\`, remove the **smallest subarray** (possibly empty) such that the sum of the remaining elements is divisible by \`p\`. It is not allowed to remove the whole array.

Return the length of the smallest subarray that you need to remove, or \`-1\` if it's impossible.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer P.`,
    outputFormat: `Print the minimum length of subarray to remove, or -1.`,
    constraints: [
      '1 <= N <= 10^5',
      '1 <= nums[i] <= 10^9',
      '1 <= P <= 10^9'
    ],
    examples: [
      {
        input: '4\n3 1 4 2\n6',
        displayInput: 'nums = [3, 1, 4, 2], p = 6',
        output: '1',
        displayOutput: '1',
        explanation: 'Sum = 10. 10 % 6 = 4. Remove subarray [4] of length 1, remaining sum is 6, which is divisible by 6.'
      },
      {
        input: '4\n6 3 5 2\n9',
        displayInput: 'nums = [6, 3, 5, 2], p = 9',
        output: '2',
        displayOutput: '2',
        explanation: 'We remove [5, 2] of size 2, remaining sum = 9, divisible by 9.'
      },
      {
        input: '3\n1 2 3\n3',
        displayInput: 'nums = [1, 2, 3], p = 3',
        output: '0',
        displayOutput: '0',
        explanation: 'Sum is 6, already divisible by 3. Remove 0 elements.'
      }
    ],
    hints: [
      'Let target = sum(nums) % p. If target == 0, answer is 0.',
      'We need to find the shortest subarray with (sum % p) == target.',
      'Use a prefix sum mod p hash map tracking the most recent index of each remainder.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    p = int(tokens[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int p = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    int p; cin >> p;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    const p = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    approaches: [
      {
        name: 'Approach 1: Prefix Modulo Hash Map (Optimal)',
        idea: 'Find target = totalSum % p. Find shortest subarray whose sum % p == target. If min_len == N, return -1.',
        dryRun: 'nums = [3, 1, 4, 2], p = 6. target = 10 % 6 = 4. Shortest subarray with sum%6==4 is [4] at index 2 (len 1).',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        code: {
          python: `import sys\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    p = int(t[n+1])\n    target = sum(nums) % p\n    if target == 0: print(0); return\n    mp = {0: -1}\n    curr, min_l = 0, n\n    for i, x in enumerate(nums):\n        curr = (curr + x) % p\n        needed = (curr - target + p) % p\n        if needed in mp:\n            min_l = min(min_l, i - mp[needed])\n        mp[curr] = i\n    print(min_l if min_l < n else -1)\nif __name__ == '__main__': solve()`,
          java: `// Make sum divisible by p`,
          cpp: `// Make sum divisible by p`,
          javascript: `// Make sum divisible by p`
        }
      }
    ],
    sampleInputs: [
      '4\n3 1 4 2\n6',
      '4\n6 3 5 2\n9',
      '3\n1 2 3\n3'
    ],
    hiddenInputs: [
      '1\n1000000000\n3',
      '3\n1 2 3\n7',
      '5\n10 20 30 40 50\n7'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const nums = tokens.slice(1, n + 1).map(Number);
      const p = parseInt(tokens[n + 1], 10);
      let total = 0;
      for (const x of nums) total = (total + x) % p;
      if (total === 0) return '0';
      const map = new Map([[0, -1]]);
      let curr = 0, minLen = n;
      for (let i = 0; i < n; i++) {
        curr = (curr + nums[i]) % p;
        const needed = (curr - total + p) % p;
        if (map.has(needed)) {
          minLen = Math.min(minLen, i - map.get(needed));
        }
        map.set(curr, i);
      }
      return minLen < n ? String(minLen) : '-1';
    }
  }),

  // 17. Number of Submatrices That Sum to Target (Hard)
  createCanonicalProblem({
    problemId: 'dsa_prefix-sum_17',
    topicId: 'prefix-sum',
    order: 17,
    title: 'Number of Submatrices That Sum to Target',
    difficulty: 'Hard',
    tags: ['Prefix Sum', 'Matrix', 'Hash Table'],
    statement: `Given a 2D matrix \`matrix\` and a \`target\`, return the number of non-empty submatrices that sum to \`target\`.

A submatrix \`x1, y1, x2, y2\` is the set of all cells \`matrix[x][y]\` with \`x1 <= x <= x2\` and \`y1 <= y <= y2\`.`,
    inputFormat: `First line: two space-separated integers R and C.
Next R lines: C space-separated integers representing the matrix.
Next line: integer TARGET.`,
    outputFormat: `Print the count of submatrices summing to target.`,
    constraints: [
      '1 <= R, C <= 100',
      '-1000 <= matrix[r][c] <= 1000',
      '-10^8 <= target <= 10^8'
    ],
    examples: [
      {
        input: '3 3\n0 1 0\n1 1 1\n0 1 0\n0',
        displayInput: 'matrix (3x3), target = 0',
        output: '4',
        displayOutput: '4',
        explanation: 'The four 1x1 submatrices that only contain 0 sum to target.'
      },
      {
        input: '2 2\n1 -1\n-1 1\n0',
        displayInput: 'matrix (2x2), target = 0',
        output: '5',
        displayOutput: '5',
        explanation: 'Two 1x2 submatrices, two 2x1 submatrices, and one 2x2 submatrix.'
      }
    ],
    hints: [
      'Fix the upper and lower row boundaries r1 and r2.',
      'Compress each column between r1 and r2 into a 1D array of column sums.',
      'Apply the 1D Subarray Sum Equals K algorithm using a hash map in O(C) for each row pair!'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    r, c = int(tokens[0]), int(tokens[1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int r = sc.nextInt(), c = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\nint main() {\n    int r, c; if (!(cin >> r >> c)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length < 2) return;\n    const r = parseInt(t[0], 10), c = parseInt(t[1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    approaches: [
      {
        name: 'Approach 1: Row Compression + 1D Hash Map (Optimal)',
        idea: 'For all pairs of rows (r1, r2), accumulate column sums and solve 1D Subarray Sum Equals Target in O(C). Total time O(R^2 * C).',
        dryRun: 'Iterate r1 from 0 to R-1, r2 from r1 to R-1. Column array col[c] sums elements in column c between r1 and r2.',
        timeComplexity: 'O(R^2 * C)',
        spaceComplexity: 'O(C)',
        code: {
          python: `import sys\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    r, c = int(t[0]), int(t[1])\n    pos = 2\n    mat = []\n    for _ in range(r):\n        mat.append([int(x) for x in t[pos:pos+c]])\n        pos += c\n    target = int(t[pos])\n    ans = 0\n    for r1 in range(r):\n        col_sum = [0] * c\n        for r2 in range(r1, r): \n            for j in range(c):\n                col_sum[j] += mat[r2][j]\n            mp = {0: 1}\n            curr = 0\n            for val in col_sum:\n                curr += val\n                ans += mp.get(curr - target, 0)\n                mp[curr] = mp.get(curr, 0) + 1\n    print(ans)\nif __name__ == '__main__': solve()`,
          java: `// Number of submatrices that sum to target`,
          cpp: `// Number of submatrices that sum to target`,
          javascript: `// Number of submatrices that sum to target`
        }
      }
    ],
    sampleInputs: [
      '3 3\n0 1 0\n1 1 1\n0 1 0\n0',
      '2 2\n1 -1\n-1 1\n0'
    ],
    hiddenInputs: [
      '1 1\n0\n0',
      '1 3\n1 2 3\n3',
      '3 1\n1\n2\n3\n3',
      '2 3\n1 2 3\n4 5 6\n15'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const r = parseInt(tokens[0], 10), c = parseInt(tokens[1], 10);
      let pos = 2;
      const mat = [];
      for (let i = 0; i < r; i++) {
        mat.push(tokens.slice(pos, pos + c).map(Number));
        pos += c;
      }
      const target = parseInt(tokens[pos], 10);
      let ans = 0;
      for (let r1 = 0; r1 < r; r1++) {
        const colSum = new Array(c).fill(0);
        for (let r2 = r1; r2 < r; r2++) {
          for (let j = 0; j < c; j++) colSum[j] += mat[r2][j];
          const map = new Map([[0, 1]]);
          let curr = 0;
          for (let j = 0; j < c; j++) {
            curr += colSum[j];
            if (map.has(curr - target)) ans += map.get(curr - target);
            map.set(curr, (map.get(curr) || 0) + 1);
          }
        }
      }
      return String(ans);
    }
  }),

  // 18. Count of Range Sum (Hard)
  createCanonicalProblem({
    problemId: 'dsa_prefix-sum_18',
    topicId: 'prefix-sum',
    order: 18,
    title: 'Count of Range Sum',
    difficulty: 'Hard',
    tags: ['Prefix Sum', 'Merge Sort', 'Binary Search'],
    statement: `Given an integer array \`nums\` and two integers \`lower\` and \`upper\`, return the number of range sums that lie in \`[lower, upper]\` inclusive.

Range sum \`S(i, j)\` is defined as the sum of the elements in \`nums\` between indices \`i\` and \`j\` inclusive, where \`i <= j\`.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: two space-separated integers lower and upper.`,
    outputFormat: `Print the total count of range sums within [lower, upper].`,
    constraints: [
      '1 <= N <= 10^5',
      '-10^5 <= nums[i] <= 10^5',
      '-10^9 <= lower <= upper <= 10^9'
    ],
    examples: [
      {
        input: '3\n-2 5 -1\n-2 2',
        displayInput: 'nums = [-2, 5, -1], lower = -2, upper = 2',
        output: '3',
        displayOutput: '3',
        explanation: 'The three ranges that lie in [-2, 2] are [0, 0] (sum = -2), [2, 2] (sum = -1), and [0, 2] (sum = 2).'
      },
      {
        input: '1\n0\n0 0',
        displayInput: 'nums = [0], lower = 0, upper = 0',
        output: '1',
        displayOutput: '1',
        explanation: '[0, 0] has sum 0.'
      }
    ],
    hints: [
      'Convert to prefix sum array: S(i, j) = prefix[j+1] - prefix[i].',
      'The condition is lower <= prefix[j] - prefix[i] <= upper.',
      'Solve efficiently using modified Merge Sort on the prefix sum array in O(N log N).'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    lower, upper = int(tokens[n+1]), int(tokens[n+2])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int lower = sc.nextInt(), upper = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    int lower, upper; cin >> lower >> upper;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    const lower = parseInt(t[n + 1], 10), upper = parseInt(t[n + 2], 10);\n    // Write your solution below\n}\nsolve();`
    },
    approaches: [
      {
        name: 'Approach 1: Merge Sort on Prefix Sums (Optimal)',
        idea: 'Construct prefix sums. During merge sort, for each prefix[i] in left half, find two pointers in right half satisfying lower <= prefix[j] - prefix[i] <= upper in O(N log N).',
        dryRun: 'nums = [-2, 5, -1], lower = -2, upper = 2 -> 3 valid range sums.',
        timeComplexity: 'O(N log N)',
        spaceComplexity: 'O(N)',
        code: {
          python: `import sys\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    lower, upper = int(t[n+1]), int(t[n+2])\n    pref = [0] * (n + 1)\n    for i in range(n): pref[i+1] = pref[i] + nums[i]\n    def count_merge(l, r):\n        if l >= r: return 0\n        mid = (l + r) // 2\n        cnt = count_merge(l, mid) + count_merge(mid + 1, r)\n        j1 = j2 = mid + 1\n        for i in range(l, mid + 1):\n            while j1 <= r and pref[j1] - pref[i] < lower: j1 += 1\n            while j2 <= r and pref[j2] - pref[i] <= upper: j2 += 1\n            cnt += j2 - j1\n        pref[l:r+1] = sorted(pref[l:r+1])\n        return cnt\n    print(count_merge(0, n))\nif __name__ == '__main__': solve()`,
          java: `// Count of range sum`,
          cpp: `// Count of range sum`,
          javascript: `// Count of range sum`
        }
      }
    ],
    sampleInputs: [
      '3\n-2 5 -1\n-2 2',
      '1\n0\n0 0'
    ],
    hiddenInputs: [
      '2\n1 2\n1 3',
      '4\n-1 0 1 2\n0 2',
      '5\n-5 5 -5 5 -5\n-5 5'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const nums = tokens.slice(1, n + 1).map(Number);
      const lower = parseInt(tokens[n + 1], 10), upper = parseInt(tokens[n + 2], 10);
      const pref = new Array(n + 1).fill(0);
      for (let i = 0; i < n; i++) pref[i + 1] = pref[i] + nums[i];

      function countMerge(l, r) {
        if (l >= r) return 0;
        const mid = (l + r) >> 1;
        let count = countMerge(l, mid) + countMerge(mid + 1, r);
        let j1 = mid + 1, j2 = mid + 1;
        for (let i = l; i <= mid; i++) {
          while (j1 <= r && pref[j1] - pref[i] < lower) j1++;
          while (j2 <= r && pref[j2] - pref[i] <= upper) j2++;
          count += j2 - j1;
        }
        const temp = pref.slice(l, r + 1).sort((a, b) => a - b);
        for (let i = 0; i < temp.length; i++) pref[l + i] = temp[i];
        return count;
      }

      return String(countMerge(0, n));
    }
  }),

  // 19. Shortest Subarray with Sum at Least K (Hard)
  createCanonicalProblem({
    problemId: 'dsa_prefix-sum_19',
    topicId: 'prefix-sum',
    order: 19,
    title: 'Shortest Subarray with Sum at Least K',
    difficulty: 'Hard',
    tags: ['Prefix Sum', 'Monotonic Deque', 'Queue'],
    statement: `Given an integer array \`nums\` and an integer \`k\`, return the length of the **shortest non-empty subarray** of \`nums\` with a sum of at least \`k\`. If there is no such subarray, return \`-1\`.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer K.`,
    outputFormat: `Print the minimum length of subarray with sum >= K, or -1.`,
    constraints: [
      '1 <= N <= 10^5',
      '-10^5 <= nums[i] <= 10^5',
      '1 <= K <= 10^9'
    ],
    examples: [
      {
        input: '1\n1\n1',
        displayInput: 'nums = [1], k = 1',
        output: '1',
        displayOutput: '1',
        explanation: 'Subarray [1] has sum 1 >= 1. Length is 1.'
      },
      {
        input: '2\n1 2\n4',
        displayInput: 'nums = [1, 2], k = 4',
        output: '-1',
        displayOutput: '-1',
        explanation: 'Total sum is 3, no subarray has sum >= 4.'
      },
      {
        input: '3\n2 -1 2\n3',
        displayInput: 'nums = [2, -1, 2], k = 3',
        output: '3',
        displayOutput: '3',
        explanation: 'Subarray [2, -1, 2] has sum 3. Shortest length is 3.'
      }
    ],
    hints: [
      'Because nums can contain negative numbers, two pointers / sliding window does not work directly.',
      'Compute prefix sums. We want to find min(j - i) such that prefix[j] - prefix[i] >= k with i < j.',
      'Maintain an increasing monotonic deque of prefix indices.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    k = int(tokens[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int k = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <deque>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    int k; cin >> k;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    const k = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    approaches: [
      {
        name: 'Approach 1: Monotonic Deque of Prefix Sums (Optimal)',
        idea: 'Store indices in a deque maintaining strictly increasing prefix sums. Pop from front when prefix[j] - prefix[front] >= k, and pop from back when prefix[back] >= prefix[j].',
        dryRun: 'nums = [2, -1, 2], k = 3. Deque maintains increasing prefix sums to find shortest window in O(N).',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        code: {
          python: `import sys\nfrom collections import deque\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    k = int(t[n+1])\n    pref = [0] * (n + 1)\n    for i in range(n): pref[i+1] = pref[i] + nums[i]\n    q = deque()\n    min_l = float('inf')\n    for i in range(n + 1):\n        while q and pref[i] - pref[q[0]] >= k:\n            min_l = min(min_l, i - q.popleft())\n        while q and pref[i] <= pref[q[-1]]:\n            q.pop()\n        q.append(i)\n    print(min_l if min_l != float('inf') else -1)\nif __name__ == '__main__': solve()`,
          java: `// Shortest subarray sum at least k`,
          cpp: `// Shortest subarray sum at least k`,
          javascript: `// Shortest subarray sum at least k`
        }
      }
    ],
    sampleInputs: [
      '1\n1\n1',
      '2\n1 2\n4',
      '3\n2 -1 2\n3'
    ],
    hiddenInputs: [
      '4\n17 85 93 -45\n128',
      '5\n84 -37 32 40 95\n167',
      '3\n-1 -2 -3\n1',
      '4\n5 5 5 5\n10'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const nums = tokens.slice(1, n + 1).map(Number);
      const k = parseInt(tokens[n + 1], 10);
      const pref = new Array(n + 1).fill(0);
      for (let i = 0; i < n; i++) pref[i + 1] = pref[i] + nums[i];
      const q = [];
      let minLen = Infinity;
      for (let i = 0; i <= n; i++) {
        while (q.length > 0 && pref[i] - pref[q[0]] >= k) {
          minLen = Math.min(minLen, i - q.shift());
        }
        while (q.length > 0 && pref[i] <= pref[q[q.length - 1]]) {
          q.pop();
        }
        q.push(i);
      }
      return minLen !== Infinity ? String(minLen) : '-1';
    }
  }),

  // 20. Maximum Sum of Subarray After Removing At Most One Element (Hard)
  createCanonicalProblem({
    problemId: 'dsa_prefix-sum_20',
    topicId: 'prefix-sum',
    order: 20,
    title: 'Maximum Subarray Sum with One Deletion',
    difficulty: 'Hard',
    tags: ['Prefix Sum', 'Dynamic Programming', 'Array'],
    statement: `Given an array of integers \`arr\`, return the maximum sum of a non-empty subarray after deleting **at most one** element. Note that after deletion, the remaining subarray must still be non-empty.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the maximum subarray sum possible after at most one deletion.`,
    constraints: [
      '1 <= N <= 10^5',
      '-10^4 <= arr[i] <= 10^4'
    ],
    examples: [
      {
        input: '4\n1 -2 0 3',
        displayInput: 'arr = [1, -2, 0, 3]',
        output: '4',
        displayOutput: '4',
        explanation: 'Delete -2, the remaining subarray [1, 0, 3] sums to 4.'
      },
      {
        input: '4\n1 -2 -2 3',
        displayInput: 'arr = [1, -2, -2, 3]',
        output: '3',
        displayOutput: '3',
        explanation: 'We can choose [3] with 0 deletions, sum = 3.'
      },
      {
        input: '3\n-1 -1 -1',
        displayInput: 'arr = [-1, -1, -1]',
        output: '-1',
        displayOutput: '-1',
        explanation: 'The subarray cannot be empty, so we take [-1].'
      }
    ],
    hints: [
      'Use prefix max subarray ending at i and suffix max subarray starting at i.',
      'forward[i] = max(arr[i], forward[i-1] + arr[i]).',
      'backward[i] = max(arr[i], backward[i+1] + arr[i]).',
      'For deleting arr[i], the combined sum is forward[i-1] + backward[i+1].'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    arr = [int(x) for x in tokens[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const arr = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    approaches: [
      {
        name: 'Approach 1: Forward & Backward Prefix Max Arrays (Optimal)',
        idea: 'Precompute forward[i] (max subarray ending at i) and backward[i] (max subarray starting at i). If arr[i] is deleted, the max sum is forward[i-1] + backward[i+1].',
        dryRun: 'arr = [1, -2, 0, 3]. Delete -2 -> forward[0] + backward[2] = 1 + 3 = 4.',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        code: {
          python: `import sys\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    arr = [int(x) for x in t[1:n+1]]\n    if n == 1: print(arr[0]); return\n    fwd = [0] * n\n    fwd[0] = arr[0]\n    max_ans = arr[0]\n    for i in range(1, n):\n        fwd[i] = max(arr[i], fwd[i-1] + arr[i])\n        max_ans = max(max_ans, fwd[i])\n    bwd = [0] * n\n    bwd[-1] = arr[-1]\n    for i in range(n - 2, -1, -1):\n        bwd[i] = max(arr[i], bwd[i+1] + arr[i])\n    for i in range(1, n - 1):\n        max_ans = max(max_ans, fwd[i-1] + bwd[i+1])\n    print(max_ans)\nif __name__ == '__main__': solve()`,
          java: `// Max sum after one deletion`,
          cpp: `// Max sum after one deletion`,
          javascript: `// Max sum after one deletion`
        }
      }
    ],
    sampleInputs: [
      '4\n1 -2 0 3',
      '4\n1 -2 -2 3',
      '3\n-1 -1 -1'
    ],
    hiddenInputs: [
      '1\n10',
      '2\n-5 10',
      '4\n1 2 3 4',
      '5\n-2 1 -3 4 -1 2 1 -5 4',
      '5\n-10 -20 -30 -40 -50'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const arr = tokens.slice(1, n + 1).map(Number);
      if (n === 1) return String(arr[0]);
      const fwd = new Array(n).fill(0);
      fwd[0] = arr[0];
      let maxAns = arr[0];
      for (let i = 1; i < n; i++) {
        fwd[i] = Math.max(arr[i], fwd[i - 1] + arr[i]);
        maxAns = Math.max(maxAns, fwd[i]);
      }
      const bwd = new Array(n).fill(0);
      bwd[n - 1] = arr[n - 1];
      for (let i = n - 2; i >= 0; i--) {
        bwd[i] = Math.max(arr[i], bwd[i + 1] + arr[i]);
      }
      for (let i = 1; i < n - 1; i++) {
        maxAns = Math.max(maxAns, fwd[i - 1] + bwd[i + 1]);
      }
      return String(maxAns);
    }
  })
];


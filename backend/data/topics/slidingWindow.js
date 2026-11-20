/**
 * Canonical DSA Placement Problems: SLIDING WINDOW (20 Questions)
 * 7 Easy, 9 Medium, 4 Hard
 */

import { createCanonicalProblem } from './topicProblemHelper.js';

export const SLIDING_WINDOW_PROBLEMS = [
  // 1. Maximum Average Subarray I (Easy)
  createCanonicalProblem({
    problemId: 'dsa_sliding-window_01',
    topicId: 'sliding-window',
    order: 1,
    title: 'Maximum Average Subarray I',
    difficulty: 'Easy',
    tags: ['Sliding Window', 'Array'],
    statement: `You are given an integer array \`nums\` consisting of \`n\` elements, and an integer \`k\`.

Find a contiguous subarray whose length is equal to \`k\` that has the maximum average value and return this value formatted to **5 decimal places**.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer k.`,
    outputFormat: `Print the maximum average value formatted to 5 decimal places.`,
    constraints: ['n == nums.length', '1 <= k <= n <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    examples: [
      {
        input: '6\n1 12 -5 -6 50 3\n4',
        displayInput: 'nums = [1, 12, -5, -6, 50, 3], k = 4',
        output: '12.75000',
        displayOutput: '12.75000',
        explanation: 'Maximum average is (12 - 5 - 6 + 50) / 4 = 51 / 4 = 12.75.'
      },
      {
        input: '1\n5\n1',
        displayInput: 'nums = [5], k = 1',
        output: '5.00000',
        displayOutput: '5.00000',
        explanation: 'Single element average is 5.0.'
      }
    ],
    hints: [
      'Compute the sum of the first k elements.',
      'Slide the window of size k from index k to N - 1: add nums[i] and subtract nums[i - k].',
      'Keep track of the maximum sum seen, then divide by k at the end.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    k = int(t[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int k = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <iomanip>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int k; cin >> k;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    const k = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['6\n1 12 -5 -6 50 3\n4', '1\n5\n1'],
    hiddenInputs: ['4\n0 4 0 3\n1', '5\n-1 -2 -3 -4 -5\n2', '5\n10 20 30 40 50\n3'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      const k = parseInt(t[n + 1], 10);
      let sum = 0;
      for (let i = 0; i < k; i++) sum += nums[i];
      let maxSum = sum;
      for (let i = k; i < n; i++) {
        sum += nums[i] - nums[i - k];
        if (sum > maxSum) maxSum = sum;
      }
      return (maxSum / k).toFixed(5);
    }
  }),

  // 2. Defuse the Bomb (Easy)
  createCanonicalProblem({
    problemId: 'dsa_sliding-window_02',
    topicId: 'sliding-window',
    order: 2,
    title: 'Defuse the Bomb',
    difficulty: 'Easy',
    tags: ['Sliding Window', 'Array'],
    statement: `You have a bomb to defuse, and your informer would like to provide you with a circular array \`code\` of length \`n\` and a key \`k\`.

To decrypt the code, you must replace every number:
- If \`k > 0\`, replace the \`i\`th number with the sum of the **next** \`k\` numbers.
- If \`k < 0\`, replace the \`i\`th number with the sum of the **previous** \`k\` numbers.
- If \`k == 0\`, replace the \`i\`th number with \`0\`.

As \`code\` is circular, the next element of \`code[n-1]\` is \`code[0]\`, and the previous element of \`code[0]\` is \`code[n-1]\`.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer k.`,
    outputFormat: `Print the decrypted array separated by spaces.`,
    constraints: ['n == code.length', '1 <= n <= 100', '1 <= code[i] <= 100', '-(n - 1) <= k <= n - 1'],
    examples: [
      {
        input: '4\n5 7 1 4\n3',
        displayInput: 'code = [5, 7, 1, 4], k = 3',
        output: '12 10 16 13',
        displayOutput: '[12, 10, 16, 13]',
        explanation: 'Each number replaced by the sum of next 3 numbers.'
      },
      {
        input: '4\n1 2 3 4\n0',
        displayInput: 'code = [1, 2, 3, 4], k = 0',
        output: '0 0 0 0',
        displayOutput: '[0, 0, 0, 0]',
        explanation: 'When k == 0, numbers are replaced by 0.'
      },
      {
        input: '4\n2 4 9 3\n-2',
        displayInput: 'code = [2, 4, 9, 3], k = -2',
        output: '12 5 6 13',
        displayOutput: '[12, 5, 6, 13]',
        explanation: 'Each number replaced by the sum of previous 2 numbers.'
      }
    ],
    hints: [
      'If k == 0, return an array of zeros.',
      'Initialize a sliding window of size |k|.',
      'Use modulo arithmetic `(idx % n + n) % n` to handle wrap-around indices.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    code = [int(x) for x in t[1:n+1]]\n    k = int(t[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] code = new int[n];\n        for (int i = 0; i < n; i++) code[i] = sc.nextInt();\n        int k = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> code(n); for (int i = 0; i < n; i++) cin >> code[i];\n    int k; cin >> k;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const code = t.slice(1, n + 1).map(Number);\n    const k = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['4\n5 7 1 4\n3', '4\n1 2 3 4\n0', '4\n2 4 9 3\n-2'],
    hiddenInputs: ['3\n10 20 30\n1', '3\n10 20 30\n-1', '5\n1 1 1 1 1\n2'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const code = t.slice(1, n + 1).map(Number);
      const k = parseInt(t[n + 1], 10);
      const res = new Array(n).fill(0);
      if (k === 0) return res.join(' ');
      for (let i = 0; i < n; i++) {
        let sum = 0;
        if (k > 0) {
          for (let step = 1; step <= k; step++) sum += code[(i + step) % n];
        } else {
          for (let step = 1; step <= -k; step++) sum += code[(i - step + n) % n];
        }
        res[i] = sum;
      }
      return res.join(' ');
    }
  }),

  // 3. Contains Duplicate II (Easy)
  createCanonicalProblem({
    problemId: 'dsa_sliding-window_03',
    topicId: 'sliding-window',
    order: 3,
    title: 'Contains Duplicate II',
    difficulty: 'Easy',
    tags: ['Sliding Window', 'Hash Table', 'Array'],
    statement: `Given an integer array \`nums\` and an integer \`k\`, return \`true\` if there are two **distinct indices** \`i\` and \`j\` in the array such that \`nums[i] == nums[j]\` and \`abs(i - j) <= k\`. Otherwise, return \`false\`.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer k.`,
    outputFormat: `Print 'true' if duplicate within distance k exists, else 'false'.`,
    constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9', '0 <= k <= 10^5'],
    examples: [
      {
        input: '4\n1 2 3 1\n3',
        displayInput: 'nums = [1, 2, 3, 1], k = 3',
        output: 'true',
        displayOutput: 'true',
        explanation: 'nums[0] == nums[3] == 1, and abs(0 - 3) = 3 <= 3.'
      },
      {
        input: '4\n1 0 1 1\n1',
        displayInput: 'nums = [1, 0, 1, 1], k = 1',
        output: 'true',
        displayOutput: 'true',
        explanation: 'nums[2] == nums[3] == 1, abs(2 - 3) = 1 <= 1.'
      },
      {
        input: '6\n1 2 3 1 2 3\n2',
        displayInput: 'nums = [1, 2, 3, 1, 2, 3], k = 2',
        output: 'false',
        displayOutput: 'false',
        explanation: 'Identical values are at distance 3, which is greater than k = 2.'
      }
    ],
    hints: [
      'Maintain a sliding window of size k using a Hash Set.',
      'If nums[i] is already in the set, a duplicate within distance k exists!',
      'When the window exceeds size k, remove nums[i - k] from the set.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    k = int(t[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int k = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int k; cin >> k;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    const k = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['4\n1 2 3 1\n3', '4\n1 0 1 1\n1', '6\n1 2 3 1 2 3\n2'],
    hiddenInputs: ['1\n5\n1', '2\n1 1\n1', '5\n1 2 3 4 5\n3', '4\n99 99 99 99\n1'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      const k = parseInt(t[n + 1], 10);
      const set = new Set();
      for (let i = 0; i < n; i++) {
        if (set.has(nums[i])) return 'true';
        set.add(nums[i]);
        if (set.size > k) set.delete(nums[i - k]);
      }
      return 'false';
    }
  }),

  // 4. Substrings of Size Three with Distinct Characters (Easy)
  createCanonicalProblem({
    problemId: 'dsa_sliding-window_04',
    topicId: 'sliding-window',
    order: 4,
    title: 'Substrings of Size Three with Distinct Characters',
    difficulty: 'Easy',
    tags: ['Sliding Window', 'String', 'Hash Table'],
    statement: `A string is **good** if there are no repeated characters.

Given a string \`s\`, return the number of **good substrings** of length **three** in \`s\`.

Note that if there are multiple occurrences of the same substring, every occurrence should be counted.`,
    inputFormat: `First line: string s.`,
    outputFormat: `Print the count of good substrings of length 3.`,
    constraints: ['1 <= s.length <= 100', 's consists of lowercase English letters.'],
    examples: [
      {
        input: 'xyzzaz',
        displayInput: 's = "xyzzaz"',
        output: '1',
        displayOutput: '1',
        explanation: 'There are 4 substrings of size 3: "xyz", "yzz", "zza", and "zaz". Only "xyz" has distinct characters.'
      },
      {
        input: 'aababcabc',
        displayInput: 's = "aababcabc"',
        output: '4',
        displayOutput: '4',
        explanation: 'Good substrings of length 3: "abc", "bca", "cab", "abc". Total = 4.'
      }
    ],
    hints: [
      'Slide a window of fixed length 3 along the string.',
      'At each offset i, check if s[i] != s[i+1] and s[i] != s[i+2] and s[i+1] != s[i+2].',
      'Increment the answer counter whenever all 3 are distinct.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    s = sys.stdin.read().strip()\n    if not s: return\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String s = sc.next();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s; if (!(cin >> s)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const s = fs.readFileSync(0, 'utf-8').trim();\n    if (!s) return;\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['xyzzaz', 'aababcabc'],
    hiddenInputs: ['abc', 'aaa', 'abcdef', 'abacaba'],
    solveFunction: (stdin) => {
      const s = stdin.trim();
      let count = 0;
      for (let i = 0; i <= s.length - 3; i++) {
        if (s[i] !== s[i + 1] && s[i] !== s[i + 2] && s[i + 1] !== s[i + 2]) {
          count++;
        }
      }
      return String(count);
    }
  }),

  // 5. Minimum Recolors to Get K Consecutive Black Blocks (Easy)
  createCanonicalProblem({
    problemId: 'dsa_sliding-window_05',
    topicId: 'sliding-window',
    order: 5,
    title: 'Minimum Recolors to Get K Consecutive Black Blocks',
    difficulty: 'Easy',
    tags: ['Sliding Window', 'String'],
    statement: `You are given a **0-indexed** string \`blocks\` of length \`n\`, where \`blocks[i]\` is either \`'W'\` (white) or \`'B'\` (black), representing the color of the \`i\`th block.

You are also given an integer \`k\`, which is the desired number of **consecutive** black blocks.

In one operation, you can recolor a white block such that it becomes a black block.

Return the **minimum number of operations** needed such that there is at least one occurrence of \`k\` consecutive black blocks.`,
    inputFormat: `First line: string blocks.
Second line: integer k.`,
    outputFormat: `Print the minimum recoloring operations.`,
    constraints: ['n == blocks.length', '1 <= n <= 100', 'blocks[i] is either \'W\' or \'B\'.', '1 <= k <= n'],
    examples: [
      {
        input: 'WBBWWBBWBW\n7',
        displayInput: 'blocks = "WBBWWBBWBW", k = 7',
        output: '3',
        displayOutput: '3',
        explanation: 'Inspect window blocks[0..6] ("WBBWWBB") -> 3 \'W\'s. Recoloring 3 whites gives 7 black blocks.'
      },
      {
        input: 'WBWBBBW\n2',
        displayInput: 'blocks = "WBWBBBW", k = 2',
        output: '0',
        displayOutput: '0',
        explanation: 'There are already 3 consecutive black blocks, so 0 operations are needed.'
      }
    ],
    hints: [
      'The number of recolors in any window of size k equals the count of \'W\' characters in that window.',
      'Count the number of \'W\' characters in the first window of length k.',
      'Slide the window right: add 1 if incoming char is \'W\', subtract 1 if outgoing char was \'W\'.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if len(tokens) < 2: return\n    blocks, k = tokens[0], int(tokens[1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String b = sc.next();\n        int k = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string b; int k; if (!(cin >> b >> k)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (tokens.length < 2) return;\n    const blocks = tokens[0], k = parseInt(tokens[1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['WBBWWBBWBW\n7', 'WBWBBBW\n2'],
    hiddenInputs: ['B\n1', 'W\n1', 'WWWWWW\n3', 'BBBB\n4'],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      if (tokens.length < 2) return '0';
      const blocks = tokens[0];
      const k = parseInt(tokens[1], 10);
      let whites = 0;
      for (let i = 0; i < k; i++) if (blocks[i] === 'W') whites++;
      let minWhites = whites;
      for (let i = k; i < blocks.length; i++) {
        if (blocks[i] === 'W') whites++;
        if (blocks[i - k] === 'W') whites--;
        if (whites < minWhites) minWhites = whites;
      }
      return String(minWhites);
    }
  }),

  // 6. Maximum Sum of Distinct Subarrays With Length K (Easy)
  createCanonicalProblem({
    problemId: 'dsa_sliding-window_06',
    topicId: 'sliding-window',
    order: 6,
    title: 'Maximum Sum of Distinct Subarrays With Length K',
    difficulty: 'Easy',
    tags: ['Sliding Window', 'Hash Table', 'Array'],
    statement: `You are given an integer array \`nums\` and an integer \`k\`. Find the maximum subarray sum of all the subarrays of \`nums\` that meet the following conditions:
- The length of the subarray is \`k\`, and
- All the elements of the subarray are **distinct**.

Return the maximum subarray sum of all the subarrays that meet the conditions. If no subarray meets the conditions, return \`0\`.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer k.`,
    outputFormat: `Print the maximum distinct subarray sum, or 0.`,
    constraints: ['1 <= k <= nums.length <= 10^5', '1 <= nums[i] <= 10^5'],
    examples: [
      {
        input: '7\n1 5 4 2 9 9 9\n3',
        displayInput: 'nums = [1, 5, 4, 2, 9, 9, 9], k = 3',
        output: '15',
        displayOutput: '15',
        explanation: 'Subarrays of length 3: [1,5,4]->10, [5,4,2]->11, [4,2,9]->15 (all distinct). Max sum is 15.'
      },
      {
        input: '3\n4 4 4\n3',
        displayInput: 'nums = [4, 4, 4], k = 3',
        output: '0',
        displayOutput: '0',
        explanation: 'No subarray of size 3 has all distinct elements.'
      }
    ],
    hints: [
      'Maintain a sliding window of length k with a frequency map and running sum.',
      'When the number of unique keys in the map equals k, the window has all distinct elements.',
      'Record the maximum sum over all such valid windows.'
    ],
    starterCode: {
      python: `import sys\nfrom collections import defaultdict\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    k = int(t[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int k = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int k; cin >> k;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    const k = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['7\n1 5 4 2 9 9 9\n3', '3\n4 4 4\n3'],
    hiddenInputs: ['4\n1 2 3 4\n2', '5\n1 1 2 3 4\n3', '1\n10\n1'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      const k = parseInt(t[n + 1], 10);
      const count = new Map();
      let sum = 0, maxSum = 0;
      for (let i = 0; i < n; i++) {
        sum += nums[i];
        count.set(nums[i], (count.get(nums[i]) || 0) + 1);
        if (i >= k) {
          const out = nums[i - k];
          sum -= out;
          count.set(out, count.get(out) - 1);
          if (count.get(out) === 0) count.delete(out);
        }
        if (i >= k - 1 && count.size === k) {
          if (sum > maxSum) maxSum = sum;
        }
      }
      return String(maxSum);
    }
  }),

  // 7. Find All K-Distant Indices in an Array (Easy)
  createCanonicalProblem({
    problemId: 'dsa_sliding-window_07',
    topicId: 'sliding-window',
    order: 7,
    title: 'Find All K-Distant Indices in an Array',
    difficulty: 'Easy',
    tags: ['Sliding Window', 'Array', 'Two Pointers'],
    statement: `You are given a **0-indexed** integer array \`nums\` and two integers \`key\` and \`k\`. A k-distant index is an index \`i\` of \`nums\` for which there exists at least one index \`j\` such that \`|i - j| <= k\` and \`nums[j] == key\`.

Return a list of all k-distant indices sorted in **increasing order** separated by spaces.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integers key and k.`,
    outputFormat: `Print the space-separated k-distant indices.`,
    constraints: ['1 <= nums.length <= 1000', '1 <= nums[i] <= 1000', 'key is present in nums.', '1 <= k <= nums.length'],
    examples: [
      {
        input: '8\n3 4 9 1 3 9 5 2\n9 1',
        displayInput: 'nums = [3,4,9,1,3,9,5,2], key = 9, k = 1',
        output: '1 2 3 4 5 6',
        displayInput: 'indices within 1 step of nums[j] == 9 (at j=2 and j=5)',
        displayOutput: '[1, 2, 3, 4, 5, 6]',
        explanation: 'nums[2] == 9 covers [1, 2, 3]. nums[5] == 9 covers [4, 5, 6]. Merged union: 1 2 3 4 5 6.'
      },
      {
        input: '5\n2 2 2 2 2\n2 2',
        displayInput: 'nums = [2, 2, 2, 2, 2], key = 2, k = 2',
        output: '0 1 2 3 4',
        displayOutput: '[0, 1, 2, 3, 4]',
        explanation: 'All elements equal key 2, covering every index.'
      }
    ],
    hints: [
      'Find all indices j where nums[j] == key.',
      'Each match j covers the contiguous window of indices [max(0, j - k), min(N - 1, j + k)].',
      'Use a pointer to avoid duplicate additions and print in strictly increasing order.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    key, k = int(t[n+1]), int(t[n+2])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int key = sc.nextInt(), k = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int key, k; cin >> key >> k;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 4) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    const key = parseInt(t[n + 1], 10), k = parseInt(t[n + 2], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['8\n3 4 9 1 3 9 5 2\n9 1', '5\n2 2 2 2 2\n2 2'],
    hiddenInputs: ['3\n1 5 1\n5 1', '4\n1 2 3 4\n4 2', '1\n7\n7 1'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      const key = parseInt(t[n + 1], 10), k = parseInt(t[n + 2], 10);
      const res = [];
      let lastAdded = -1;
      for (let j = 0; j < n; j++) {
        if (nums[j] === key) {
          const start = Math.max(lastAdded + 1, j - k);
          const end = Math.min(n - 1, j + k);
          for (let i = start; i <= end; i++) {
            res.push(i);
            lastAdded = i;
          }
        }
      }
      return res.join(' ');
    }
  }),

  // 8. Maximum Sum Subarray of Size K (Medium)
  createCanonicalProblem({
    problemId: 'dsa_sliding-window_08',
    topicId: 'sliding-window',
    order: 8,
    title: 'Maximum Sum Subarray of Size K',
    difficulty: 'Medium',
    tags: ['Sliding Window', 'Array'],
    statement: `Given an array of integers \`nums\` and an integer \`k\`, find the maximum sum of any contiguous subarray of size \`k\`.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer k.`,
    outputFormat: `Print the maximum sum of a contiguous subarray of size k.`,
    constraints: ['1 <= nums.length <= 10^5', '1 <= k <= nums.length', '-10^5 <= nums[i] <= 10^5'],
    examples: [
      {
        input: '4\n100 200 300 400\n2',
        displayInput: 'nums = [100, 200, 300, 400], k = 2',
        output: '700',
        displayOutput: '700',
        explanation: 'Subarray [300, 400] has max sum 700.'
      },
      {
        input: '5\n1 4 2 10 23\n3',
        displayInput: 'nums = [1, 4, 2, 10, 23], k = 3',
        output: '35',
        displayOutput: '35',
        explanation: 'Subarray [2, 10, 23] has max sum 35.'
      }
    ],
    hints: [
      'Sum the first k elements to initialize the window.',
      'Slide the window right: add nums[i] and subtract nums[i - k].',
      'Track the running maximum sum across all windows.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    k = int(t[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int k = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int k; cin >> k;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    const k = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['4\n100 200 300 400\n2', '5\n1 4 2 10 23\n3'],
    hiddenInputs: ['3\n-1 -2 -3\n1', '4\n1 2 3 4\n4', '5\n5 -2 7 -1 8\n2'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      const k = parseInt(t[n + 1], 10);
      let sum = 0;
      for (let i = 0; i < k; i++) sum += nums[i];
      let maxSum = sum;
      for (let i = k; i < n; i++) {
        sum += nums[i] - nums[i - k];
        if (sum > maxSum) maxSum = sum;
      }
      return String(maxSum);
    }
  }),

  // 9. Longest Substring Without Repeating Characters (Medium)
  createCanonicalProblem({
    problemId: 'dsa_sliding-window_09',
    topicId: 'sliding-window',
    order: 9,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    tags: ['Sliding Window', 'Hash Table', 'String'],
    statement: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    inputFormat: `First line: string s.`,
    outputFormat: `Print the length of the longest substring with unique characters.`,
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    examples: [
      {
        input: 'abcabcbb',
        displayInput: 's = "abcabcbb"',
        output: '3',
        displayOutput: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 'bbbbb',
        displayInput: 's = "bbbbb"',
        output: '1',
        displayOutput: '1',
        explanation: 'The answer is "b", with the length of 1.'
      },
      {
        input: 'pwwkew',
        displayInput: 's = "pwwkew"',
        output: '3',
        displayOutput: '3',
        explanation: 'The answer is "wke", with the length of 3.'
      }
    ],
    hints: [
      'Use a variable sliding window bounded by left and right pointers.',
      'Use a Hash Map to store the last seen index of each character.',
      'When character s[right] was seen at or after left, advance left to lastSeen[s[right]] + 1.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    s = sys.stdin.read().rstrip('\\r\\n')\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.hasNextLine() ? sc.nextLine() : "";\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s; if (!getline(cin, s)) s = "";\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const s = fs.readFileSync(0, 'utf-8').replace(/\\r?\\n$/, '');\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['abcabcbb', 'bbbbb', 'pwwkew'],
    hiddenInputs: ['', ' ', 'au', 'dvdf', 'tmmzuxt'],
    solveFunction: (stdin) => {
      const s = stdin.replace(/\r?\n$/, '');
      const lastSeen = new Map();
      let l = 0, maxLen = 0;
      for (let r = 0; r < s.length; r++) {
        const c = s[r];
        if (lastSeen.has(c) && lastSeen.get(c) >= l) {
          l = lastSeen.get(c) + 1;
        }
        lastSeen.set(c, r);
        maxLen = Math.max(maxLen, r - l + 1);
      }
      return String(maxLen);
    }
  }),

  // 10. Longest Repeating Character Replacement (Medium)
  createCanonicalProblem({
    problemId: 'dsa_sliding-window_10',
    topicId: 'sliding-window',
    order: 10,
    title: 'Longest Repeating Character Replacement',
    difficulty: 'Medium',
    tags: ['Sliding Window', 'Hash Table', 'String'],
    statement: `You are given a string \`s\` and an integer \`k\`. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most \`k\` times.

Return the length of the longest substring containing the same letter you can get after performing the above operations.`,
    inputFormat: `First line: string s (uppercase English letters).
Second line: integer k.`,
    outputFormat: `Print the length of the longest valid substring.`,
    constraints: ['1 <= s.length <= 10^5', 's consists of only uppercase English letters.', '0 <= k <= s.length'],
    examples: [
      {
        input: 'ABAB\n2',
        displayInput: 's = "ABAB", k = 2',
        output: '4',
        displayOutput: '4',
        explanation: 'Replace the two \'A\'s with two \'B\'s or vice versa to get "BBBB" or "AAAA".'
      },
      {
        input: 'AABABBA\n1',
        displayInput: 's = "AABABBA", k = 1',
        output: '4',
        displayOutput: '4',
        explanation: 'Replace the one \'B\' in "ABBA" or "AABA" to get 4.'
      }
    ],
    hints: [
      'In any valid window of size W, the number of characters to change is (W - maxFrequency).',
      'As long as (window_size - maxFrequency) <= k, the window is valid.',
      'If it exceeds k, contract the left pointer.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if len(tokens) < 2: return\n    s, k = tokens[0], int(tokens[1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String s = sc.next();\n        int k = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s; int k; if (!(cin >> s >> k)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (tokens.length < 2) return;\n    const s = tokens[0], k = parseInt(tokens[1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['ABAB\n2', 'AABABBA\n1'],
    hiddenInputs: ['A\n0', 'ABCDE\n1', 'AAAA\n2', 'ABBB\n2'],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      if (tokens.length < 2) return '0';
      const s = tokens[0];
      const k = parseInt(tokens[1], 10);
      const count = new Array(26).fill(0);
      let l = 0, maxCount = 0, maxLen = 0;
      for (let r = 0; r < s.length; r++) {
        const code = s.charCodeAt(r) - 65;
        count[code]++;
        if (count[code] > maxCount) maxCount = count[code];
        while ((r - l + 1) - maxCount > k) {
          count[s.charCodeAt(l) - 65]--;
          l++;
        }
        maxLen = Math.max(maxLen, r - l + 1);
      }
      return String(maxLen);
    }
  }),

  // 11. Fruit Into Baskets (Medium)
  createCanonicalProblem({
    problemId: 'dsa_sliding-window_11',
    topicId: 'sliding-window',
    order: 11,
    title: 'Fruit Into Baskets',
    difficulty: 'Medium',
    tags: ['Sliding Window', 'Hash Table', 'Array'],
    statement: `You are visiting a farm that has a single row of fruit trees arranged from left to right. The trees are represented by an integer array \`fruits\` where \`fruits[i]\` is the type of fruit the \`i\`th tree produces.

You have two baskets, and each basket can only hold a **single type** of fruit. There is no limit on the amount of fruit each basket can hold.

Starting from any tree of your choice, you must pick exactly one fruit from every tree while moving to the right. You must stop when you reach a tree with fruit that cannot fit into your baskets.

Return the maximum number of fruits you can pick.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the maximum number of fruits collected.`,
    constraints: ['1 <= fruits.length <= 10^5', '0 <= fruits[i] < fruits.length'],
    examples: [
      {
        input: '3\n1 2 1',
        displayInput: 'fruits = [1, 2, 1]',
        output: '3',
        displayOutput: '3',
        explanation: 'We can pick from all 3 trees.'
      },
      {
        input: '4\n0 1 2 2',
        displayInput: 'fruits = [0, 1, 2, 2]',
        output: '3',
        displayOutput: '3',
        explanation: 'Pick from trees [1, 2, 2], total 3 fruits.'
      },
      {
        input: '5\n1 2 3 2 2',
        displayInput: 'fruits = [1, 2, 3, 2, 2]',
        output: '4',
        displayOutput: '4',
        explanation: 'Pick from trees [2, 3, 2, 2], total 4 fruits.'
      }
    ],
    hints: [
      'This problem is equivalent to: find the length of the longest contiguous subarray with at most 2 distinct integers.',
      'Maintain a frequency map of fruit types in the current window.',
      'When the map size exceeds 2, shrink the window from the left until map size is 2.'
    ],
    starterCode: {
      python: `import sys\nfrom collections import defaultdict\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    fruits = [int(x) for x in t[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] fruits = new int[n];\n        for (int i = 0; i < n; i++) fruits[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const fruits = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['3\n1 2 1', '4\n0 1 2 2', '5\n1 2 3 2 2'],
    hiddenInputs: ['1\n5', '4\n3 3 3 1', '6\n1 2 1 3 4 3'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const fruits = t.slice(1, n + 1).map(Number);
      const count = new Map();
      let l = 0, maxF = 0;
      for (let r = 0; r < n; r++) {
        count.set(fruits[r], (count.get(fruits[r]) || 0) + 1);
        while (count.size > 2) {
          count.set(fruits[l], count.get(fruits[l]) - 1);
          if (count.get(fruits[l]) === 0) count.delete(fruits[l]);
          l++;
        }
        maxF = Math.max(maxF, r - l + 1);
      }
      return String(maxF);
    }
  }),

  // 12. Max Consecutive Ones III (Medium)
  createCanonicalProblem({
    problemId: 'dsa_sliding-window_12',
    topicId: 'sliding-window',
    order: 12,
    title: 'Max Consecutive Ones III',
    difficulty: 'Medium',
    tags: ['Sliding Window', 'Array'],
    statement: `Given a binary array \`nums\` and an integer \`k\`, return the maximum number of consecutive \`1\`'s in the array if you can flip at most \`k\` \`0\`'s.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers (0 or 1).
Third line: integer k.`,
    outputFormat: `Print the maximum consecutive 1s after flipping at most k zeros.`,
    constraints: ['1 <= nums.length <= 10^5', 'nums[i] is either 0 or 1.', '0 <= k <= nums.length'],
    examples: [
      {
        input: '11\n1 1 1 0 0 0 1 1 1 1 0\n2',
        displayInput: 'nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2',
        output: '6',
        displayOutput: '6',
        explanation: 'Flip the two zeros at index 4 and 5 to get 6 consecutive ones.'
      },
      {
        input: '19\n0 0 1 1 0 0 1 1 1 0 1 1 0 0 0 1 1 1 1\n3',
        displayInput: 'nums = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], k = 3',
        output: '10',
        displayOutput: '10',
        explanation: 'Flip 3 zeros to get 10 consecutive ones.'
      }
    ],
    hints: [
      'Problem translates to: finding the longest subarray containing at most k zeros.',
      'Maintain left and right pointers and a counter zeroCount.',
      'If zeroCount > k, increment left and decrement zeroCount if nums[left] was 0.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    k = int(t[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int k = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int k; cin >> k;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    const k = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['11\n1 1 1 0 0 0 1 1 1 1 0\n2', '19\n0 0 1 1 0 0 1 1 1 0 1 1 0 0 0 1 1 1 1\n3'],
    hiddenInputs: ['4\n0 0 0 0\n0', '5\n1 1 1 1 1\n2', '4\n0 1 0 1\n1'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      const k = parseInt(t[n + 1], 10);
      let l = 0, zeroes = 0, maxLen = 0;
      for (let r = 0; r < n; r++) {
        if (nums[r] === 0) zeroes++;
        while (zeroes > k) {
          if (nums[l] === 0) zeroes--;
          l++;
        }
        maxLen = Math.max(maxLen, r - l + 1);
      }
      return String(maxLen);
    }
  }),

  // 13. Permutation in String (Medium)
  createCanonicalProblem({
    problemId: 'dsa_sliding-window_13',
    topicId: 'sliding-window',
    order: 13,
    title: 'Permutation in String',
    difficulty: 'Medium',
    tags: ['Sliding Window', 'Hash Table', 'Two Pointers'],
    statement: `Given two strings \`s1\` and \`s2\`, return \`true\` if \`s2\` contains a permutation of \`s1\`, or \`false\` otherwise.

In other words, return true if one of \`s1\`'s permutations is the substring of \`s2\`.`,
    inputFormat: `First line: string s1.
Second line: string s2.`,
    outputFormat: `Print 'true' if permutation exists in s2, else 'false'.`,
    constraints: ['1 <= s1.length, s2.length <= 10^4', 's1 and s2 consist of lowercase English letters.'],
    examples: [
      {
        input: 'ab\neidbaooo',
        displayInput: 's1 = "ab", s2 = "eidbaooo"',
        output: 'true',
        displayOutput: 'true',
        explanation: 's2 contains one permutation of s1 ("ba").'
      },
      {
        input: 'ab\neidboaoo',
        displayInput: 's1 = "ab", s2 = "eidboaoo"',
        output: 'false',
        displayOutput: 'false',
        explanation: 'No permutation of "ab" exists as a contiguous substring.'
      }
    ],
    hints: [
      'Maintain a fixed sliding window of size s1.length across s2.',
      'Compare letter frequency counts of the window against s1.',
      'If the frequency counts match, return true immediately.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if len(tokens) < 2: return\n    s1, s2 = tokens[0], tokens[1]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String s1 = sc.next(), s2 = sc.next();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s1, s2; if (!(cin >> s1 >> s2)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (tokens.length < 2) return;\n    const [s1, s2] = tokens;\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['ab\neidbaooo', 'ab\neidboaoo'],
    hiddenInputs: ['a\na', 'hello\nooolleoooleh', 'adc\ndcda'],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      if (tokens.length < 2) return 'false';
      const [s1, s2] = tokens;
      if (s1.length > s2.length) return 'false';
      const f1 = new Array(26).fill(0);
      const f2 = new Array(26).fill(0);
      const code = c => c.charCodeAt(0) - 97;
      for (const c of s1) f1[code(c)]++;
      const k = s1.length;
      for (let i = 0; i < k; i++) f2[code(s2[i])]++;
      const match = () => f1.every((v, i) => v === f2[i]);
      if (match()) return 'true';
      for (let i = k; i < s2.length; i++) {
        f2[code(s2[i])]++;
        f2[code(s2[i - k])]--;
        if (match()) return 'true';
      }
      return 'false';
    }
  }),

  // 14. Find All Anagrams in a String (Medium)
  createCanonicalProblem({
    problemId: 'dsa_sliding-window_14',
    topicId: 'sliding-window',
    order: 14,
    title: 'Find All Anagrams in a String',
    difficulty: 'Medium',
    tags: ['Sliding Window', 'Hash Table', 'String'],
    statement: `Given two strings \`s\` and \`p\`, return an array of all the **start indices** of \`p\`'s anagrams in \`s\`.

Output the indices separated by spaces in ascending order. If no anagram exists, print nothing.`,
    inputFormat: `First line: string s.
Second line: string p.`,
    outputFormat: `Print the space-separated start indices in ascending order.`,
    constraints: ['1 <= s.length, p.length <= 3 * 10^4', 's and p consist of lowercase English letters.'],
    examples: [
      {
        input: 'cbaebabacd\nabc',
        displayInput: 's = "cbaebabacd", p = "abc"',
        output: '0 6',
        displayOutput: '[0, 6]',
        explanation: 'Anagrams of "abc" start at index 0 ("cba") and index 6 ("bac").'
      },
      {
        input: 'abab\nab',
        displayInput: 's = "abab", p = "ab"',
        output: '0 1 2',
        displayOutput: '[0, 1, 2]',
        explanation: 'Anagrams start at 0 ("ab"), 1 ("ba"), and 2 ("ab").'
      }
    ],
    hints: [
      'Maintain a sliding window of length p.length in s.',
      'Use character counts (frequency arrays of size 26) to compare the current window with p.',
      'Record each index where the frequencies match.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if len(tokens) < 2: return\n    s, p = tokens[0], tokens[1]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String s = sc.next(), p = sc.next();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s, p; if (!(cin >> s >> p)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (tokens.length < 2) return;\n    const [s, p] = tokens;\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['cbaebabacd\nabc', 'abab\nab'],
    hiddenInputs: ['abcdef\nz', 'aaaaa\naa', 'baa\naa'],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      if (tokens.length < 2) return '';
      const [s, p] = tokens;
      if (s.length < p.length) return '';
      const pCount = new Array(26).fill(0);
      const sCount = new Array(26).fill(0);
      const code = c => c.charCodeAt(0) - 97;
      for (const c of p) pCount[code(c)]++;
      const k = p.length;
      for (let i = 0; i < k; i++) sCount[code(s[i])]++;
      const matches = () => pCount.every((v, i) => v === sCount[i]);
      const res = [];
      if (matches()) res.push(0);
      for (let i = k; i < s.length; i++) {
        sCount[code(s[i])]++;
        sCount[code(s[i - k])]--;
        if (matches()) res.push(i - k + 1);
      }
      return res.join(' ');
    }
  }),

  // 15. Subarray Product Less Than K (Medium)
  createCanonicalProblem({
    problemId: 'dsa_sliding-window_15',
    topicId: 'sliding-window',
    order: 15,
    title: 'Subarray Product Less Than K',
    difficulty: 'Medium',
    tags: ['Sliding Window', 'Array'],
    statement: `Given an array of integers \`nums\` and an integer \`k\`, return the number of contiguous subarrays where the product of all the elements in the subarray is strictly less than \`k\`.`,
    inputFormat: `First line: integer N.
Second line: N space-separated positive integers.
Third line: integer k.`,
    outputFormat: `Print the number of subarrays with product strictly less than k.`,
    constraints: ['1 <= nums.length <= 3 * 10^4', '1 <= nums[i] <= 1000', '0 <= k <= 10^6'],
    examples: [
      {
        input: '4\n10 5 2 6\n100',
        displayInput: 'nums = [10, 5, 2, 6], k = 100',
        output: '8',
        displayOutput: '8',
        explanation: '8 subarrays have product < 100: [10], [5], [2], [6], [10, 5], [5, 2], [2, 6], [5, 2, 6].'
      },
      {
        input: '3\n1 2 3\n0',
        displayInput: 'nums = [1, 2, 3], k = 0',
        output: '0',
        displayOutput: '0',
        explanation: 'No subarray has product strictly less than 0.'
      }
    ],
    hints: [
      'If k <= 1, return 0 because all elements are positive (product >= 1).',
      'Use a variable sliding window: multiply nums[right] into the running product.',
      'While product >= k, divide by nums[left] and increment left.',
      'The number of valid subarrays ending at right is (right - left + 1).'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    k = int(t[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int k = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int k; cin >> k;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    const k = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['4\n10 5 2 6\n100', '3\n1 2 3\n0'],
    hiddenInputs: ['1\n5\n5', '1\n5\n6', '4\n1 1 1 1\n2', '3\n10 20 30\n1000'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      const k = parseInt(t[n + 1], 10);
      if (k <= 1) return '0';
      let prod = 1, l = 0, count = 0;
      for (let r = 0; r < n; r++) {
        prod *= nums[r];
        while (prod >= k && l <= r) {
          prod /= nums[l];
          l++;
        }
        count += (r - l + 1);
      }
      return String(count);
    }
  }),

  // 16. Minimum Size Subarray Sum (Medium)
  createCanonicalProblem({
    problemId: 'dsa_sliding-window_16',
    topicId: 'sliding-window',
    order: 16,
    title: 'Minimum Size Subarray Sum',
    difficulty: 'Medium',
    tags: ['Sliding Window', 'Array', 'Two Pointers'],
    statement: `Given an array of positive integers \`nums\` and a positive integer \`target\`, return the **minimal length** of a contiguous subarray of which the sum is greater than or equal to \`target\`. If there is no such subarray, return \`0\` instead.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer target.`,
    outputFormat: `Print the minimal length of a valid subarray, or 0 if none exists.`,
    constraints: ['1 <= target <= 10^9', '1 <= nums.length <= 10^5', '1 <= nums[i] <= 10^4'],
    examples: [
      {
        input: '6\n2 3 1 2 4 3\n7',
        displayInput: 'nums = [2, 3, 1, 2, 4, 3], target = 7',
        output: '2',
        displayOutput: '2',
        explanation: 'Subarray [4, 3] has minimal length 2 with sum >= 7.'
      },
      {
        input: '3\n1 4 4\n4',
        displayInput: 'nums = [1, 4, 4], target = 4',
        output: '1',
        displayOutput: '1',
        explanation: 'Subarray [4] has length 1.'
      }
    ],
    hints: [
      'Expand right until the running sum >= target.',
      'Contract left while sum >= target, updating min length.',
      'Repeat across the array in O(N) linear time.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    target = int(t[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int target = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int target; cin >> target;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    const target = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['6\n2 3 1 2 4 3\n7', '3\n1 4 4\n4'],
    hiddenInputs: ['5\n1 1 1 1 1\n11', '1\n10\n10', '4\n1 2 3 4\n15'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      const target = parseInt(t[n + 1], 10);
      let l = 0, sum = 0, minL = Infinity;
      for (let r = 0; r < n; r++) {
        sum += nums[r];
        while (sum >= target) {
          minL = Math.min(minL, r - l + 1);
          sum -= nums[l];
          l++;
        }
      }
      return String(minL === Infinity ? 0 : minL);
    }
  }),

  // 17. Minimum Window Substring (Hard)
  createCanonicalProblem({
    problemId: 'dsa_sliding-window_17',
    topicId: 'sliding-window',
    order: 17,
    title: 'Minimum Window Substring',
    difficulty: 'Hard',
    tags: ['Sliding Window', 'Hash Table', 'String'],
    statement: `Given two strings \`s\` and \`t\` of lengths \`m\` and \`n\` respectively, return the **minimum window substring** of \`s\` such that every character in \`t\` (**including duplicates**) is included in the window.

If there is no such substring, return the empty string \`""\`.`,
    inputFormat: `First line: string s.
Second line: string t.`,
    outputFormat: `Print the minimum window substring, or empty string.`,
    constraints: ['m == s.length', 'n == t.length', '1 <= m, n <= 10^5', 's and t consist of uppercase and lowercase English letters.'],
    examples: [
      {
        input: 'ADOBECODEBANC\nABC',
        displayInput: 's = "ADOBECODEBANC", t = "ABC"',
        output: 'BANC',
        displayOutput: '"BANC"',
        explanation: 'The minimum window substring "BANC" includes \'A\', \'B\', and \'C\' from string t.'
      },
      {
        input: 'a\na',
        displayInput: 's = "a", t = "a"',
        output: 'a',
        displayOutput: '"a"',
        explanation: 'Entire string s is the minimum window.'
      },
      {
        input: 'a\naa',
        displayInput: 's = "a", t = "aa"',
        output: '',
        displayOutput: '""',
        explanation: 'Both \'a\'s from t must be included in the window. Since the largest window of s only has one \'a\', return empty string.'
      }
    ],
    hints: [
      'Store target frequencies of characters in t in a Hash Map.',
      'Maintain an expanding window [left, right] over s; increment count of satisfied unique characters.',
      'When all unique characters are satisfied, shrink from left to find the minimum window.'
    ],
    starterCode: {
      python: `import sys\nfrom collections import Counter\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if len(tokens) < 2: return\n    s, t = tokens[0], tokens[1]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String s = sc.next(), t = sc.next();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s, t; if (!(cin >> s >> t)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (tokens.length < 2) return;\n    const [s, t] = tokens;\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['ADOBECODEBANC\nABC', 'a\na', 'a\naa'],
    hiddenInputs: ['ab\nb', 'cabwefgewcwaefgcf\ncae', 'aaflslflsldkalskaaa\naaa'],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      if (tokens.length < 2) return '';
      const [s, t] = tokens;
      const need = new Map();
      for (const c of t) need.set(c, (need.get(c) || 0) + 1);
      let required = need.size;
      const window = new Map();
      let l = 0, formed = 0;
      let minLen = Infinity, startIdx = 0;
      for (let r = 0; r < s.length; r++) {
        const c = s[r];
        window.set(c, (window.get(c) || 0) + 1);
        if (need.has(c) && window.get(c) === need.get(c)) formed++;
        while (l <= r && formed === required) {
          if (r - l + 1 < minLen) {
            minLen = r - l + 1;
            startIdx = l;
          }
          const leftChar = s[l];
          window.set(leftChar, window.get(leftChar) - 1);
          if (need.has(leftChar) && window.get(leftChar) < need.get(leftChar)) formed--;
          l++;
        }
      }
      return minLen === Infinity ? '' : s.substring(startIdx, startIdx + minLen);
    }
  }),

  // 18. Sliding Window Maximum (Hard)
  createCanonicalProblem({
    problemId: 'dsa_sliding-window_18',
    topicId: 'sliding-window',
    order: 18,
    title: 'Sliding Window Maximum',
    difficulty: 'Hard',
    tags: ['Sliding Window', 'Queue', 'Monotonic Queue'],
    statement: `You are given an array of integers \`nums\`, there is a sliding window of size \`k\` which is moving from the very left of the array to the very right. You can only see the \`k\` numbers in the window. Each time the sliding window moves right by one position.

Return the **max sliding window** elements separated by spaces.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer k.`,
    outputFormat: `Print the maximum element of each window separated by spaces.`,
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', '1 <= k <= nums.length'],
    examples: [
      {
        input: '8\n1 3 -1 -3 5 3 6 7\n3',
        displayInput: 'nums = [1,3,-1,-3,5,3,6,7], k = 3',
        output: '3 3 5 5 6 7',
        displayOutput: '[3, 3, 5, 5, 6, 7]',
        explanation: 'Windows: [1,3,-1]->3, [3,-1,-3]->3, [-1,-3,5]->5, [-3,5,3]->5, [5,3,6]->6, [3,6,7]->7.'
      },
      {
        input: '1\n1\n1',
        displayInput: 'nums = [1], k = 1',
        output: '1',
        displayOutput: '[1]',
        explanation: 'Single element window.'
      }
    ],
    hints: [
      'Maintain a double-ended queue (deque) storing indices of useful elements in monotonically decreasing order.',
      'Before adding nums[i], pop elements from back of deque while they are smaller than or equal to nums[i].',
      'Remove indices from front of deque if they fall outside the current window (index <= i - k).'
    ],
    starterCode: {
      python: `import sys\nfrom collections import deque\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    k = int(t[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int k = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <deque>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int k; cin >> k;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    const k = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['8\n1 3 -1 -3 5 3 6 7\n3', '1\n1\n1'],
    hiddenInputs: ['4\n9 11 8 5 7 10\n3', '4\n4 3 2 1\n2', '4\n1 2 3 4\n2'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      const k = parseInt(t[n + 1], 10);
      const deque = [];
      const res = [];
      for (let i = 0; i < n; i++) {
        if (deque.length && deque[0] <= i - k) deque.shift();
        while (deque.length && nums[deque[deque.length - 1]] <= nums[i]) deque.pop();
        deque.push(i);
        if (i >= k - 1) res.push(nums[deque[0]]);
      }
      return res.join(' ');
    }
  }),

  // 19. Subarrays with K Different Integers (Hard)
  createCanonicalProblem({
    problemId: 'dsa_sliding-window_19',
    topicId: 'sliding-window',
    order: 19,
    title: 'Subarrays with K Different Integers',
    difficulty: 'Hard',
    tags: ['Sliding Window', 'Hash Table', 'Counting'],
    statement: `Given an integer array \`nums\` and an integer \`k\`, return the number of **good subarrays** of \`nums\`.

A good array is an array where the number of different integers in that array is exactly \`k\`.`,
    inputFormat: `First line: integers N and K.
Second line: N space-separated integers.`,
    outputFormat: `Print the count of subarrays with exactly K distinct integers.`,
    constraints: ['1 <= nums.length <= 2 * 10^4', '1 <= nums[i], k <= nums.length'],
    examples: [
      {
        input: '5 2\n1 2 1 2 3',
        displayInput: 'nums = [1, 2, 1, 2, 3], k = 2',
        output: '7',
        displayOutput: '7',
        explanation: '7 subarrays with exactly 2 distinct integers.'
      },
      {
        input: '5 3\n1 2 1 3 4',
        displayInput: 'nums = [1, 2, 1, 3, 4], k = 3',
        output: '3',
        displayOutput: '3',
        explanation: '3 subarrays with exactly 3 distinct integers.'
      }
    ],
    hints: [
      'Use the algebraic reduction: exactly(K) = atMost(K) - atMost(K - 1).',
      'For atMost(M), expand right and count (right - left + 1) subarrays with <= M distinct keys.',
      'Contract left when the number of distinct elements exceeds M.'
    ],
    starterCode: {
      python: `import sys\nfrom collections import defaultdict\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n, k = int(t[0]), int(t[1])\n    nums = [int(x) for x in t[2:2+n]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt(), k = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n, k; if (!(cin >> n >> k)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10), k = parseInt(t[1], 10);\n    const nums = t.slice(2, 2 + n).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['5 2\n1 2 1 2 3', '5 3\n1 2 1 3 4'],
    hiddenInputs: ['4 1\n1 1 1 1', '3 2\n1 2 3', '6 2\n1 2 2 1 3 3'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10), k = parseInt(t[1], 10);
      const nums = t.slice(2, 2 + n).map(Number);
      const atMost = (maxD) => {
        if (maxD <= 0) return 0;
        const count = new Map();
        let l = 0, res = 0;
        for (let r = 0; r < n; r++) {
          count.set(nums[r], (count.get(nums[r]) || 0) + 1);
          while (count.size > maxD) {
            count.set(nums[l], count.get(nums[l]) - 1);
            if (count.get(nums[l]) === 0) count.delete(nums[l]);
            l++;
          }
          res += (r - l + 1);
        }
        return res;
      };
      return String(atMost(k) - atMost(k - 1));
    }
  }),

  // 20. Minimum Window Subsequence (Hard)
  createCanonicalProblem({
    problemId: 'dsa_sliding-window_20',
    topicId: 'sliding-window',
    order: 20,
    title: 'Minimum Window Subsequence',
    difficulty: 'Hard',
    tags: ['Sliding Window', 'Dynamic Programming', 'Two Pointers'],
    statement: `Given strings \`s1\` and \`s2\`, return the minimum contiguous substring \`W\` of \`s1\` so that \`s2\` is a **subsequence** of \`W\`.

If there is no such window in \`s1\` that covers all characters in \`s2\`, return the empty string \`""\`. If there are multiple such minimum-length windows, return the one with the smallest starting index.`,
    inputFormat: `First line: string s1.
Second line: string s2.`,
    outputFormat: `Print the minimum window substring W.`,
    constraints: ['1 <= s1.length <= 2 * 10^4', '1 <= s2.length <= 100', 's1 and s2 consist of lowercase English letters.'],
    examples: [
      {
        input: 'abcdebdde\nbde',
        displayInput: 's1 = "abcdebdde", s2 = "bde"',
        output: 'bcde',
        displayOutput: '"bcde"',
        explanation: '"bcde" has length 4 and contains "bde" as a subsequence.'
      },
      {
        input: 'jmeqforewealth\nworld',
        displayInput: 's1 = "jmeqforewealth", s2 = "world"',
        output: '',
        displayOutput: '""',
        explanation: 's2 cannot be found as a subsequence in s1.'
      }
    ],
    hints: [
      'Advance forward matching characters of s2 in s1.',
      'When the last character of s2 is matched at index i, reverse scan from i to find the optimal start index.',
      'Record the minimum window, then resume forward scan from startIdx + 1.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    lines = sys.stdin.read().split()\n    if len(lines) < 2: return\n    s1, s2 = lines[0], lines[1]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String s1 = sc.next(), s2 = sc.next();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s1, s2; if (!(cin >> s1 >> s2)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const lines = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (lines.length < 2) return;\n    const [s1, s2] = lines;\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['abcdebdde\nbde', 'jmeqforewealth\nworld'],
    hiddenInputs: ['bbbbba\nbb', 'cnhczmccqouqadqtmjjzl\ncmq', 'abc\na'],
    solveFunction: (stdin) => {
      const lines = stdin.trim().split(/\s+/);
      if (lines.length < 2) return '';
      const [s1, s2] = lines;
      let minLen = Infinity, startIdx = -1;
      let i = 0, j = 0;
      while (i < s1.length) {
        if (s1[i] === s2[j]) {
          j++;
          if (j === s2.length) {
            let end = i;
            j--;
            while (j >= 0) {
              if (s1[i] === s2[j]) j--;
              i--;
            }
            i++;
            if (end - i + 1 < minLen) {
              minLen = end - i + 1;
              startIdx = i;
            }
            j = 0;
          }
        }
        i++;
      }
      return startIdx === -1 ? '' : s1.substring(startIdx, startIdx + minLen);
    }
  })
];


/**
 * Canonical DSA Placement Problems: SORTING (20 Questions)
 * 7 Easy, 9 Medium, 4 Hard
 */

import { createCanonicalProblem } from './topicProblemHelper.js';

export const SORTING_PROBLEMS = [
  // 1. Bubble Sort with Early Exit (Easy)
  createCanonicalProblem({
    problemId: 'dsa_sorting_01',
    topicId: 'sorting',
    order: 1,
    title: 'Bubble Sort with Early Exit',
    difficulty: 'Easy',
    tags: ['Sorting', 'Array'],
    statement: `Given an array of integers \`nums\`, sort the array in non-decreasing order using the **Bubble Sort** algorithm optimized with an early exit boolean flag (\`swapped\`).

Output the sorted elements separated by spaces.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the sorted array separated by spaces.`,
    constraints: ['1 <= nums.length <= 1000', '-10^4 <= nums[i] <= 10^4'],
    examples: [
      {
        input: '5\n5 1 4 2 8',
        displayInput: 'nums = [5, 1, 4, 2, 8]',
        output: '1 2 4 5 8',
        displayOutput: '[1, 2, 4, 5, 8]',
        explanation: 'Elements sorted in non-decreasing order.'
      },
      {
        input: '4\n1 2 3 4',
        displayInput: 'nums = [1, 2, 3, 4]',
        output: '1 2 3 4',
        displayOutput: '[1, 2, 3, 4]',
        explanation: 'Already sorted; early-exit flag terminates after 1 pass.'
      }
    ],
    hints: [
      'Compare adjacent elements (nums[j] and nums[j+1]); swap if nums[j] > nums[j+1].',
      'Maintain a boolean flag `swapped = false`. If no swaps occurred in a full pass, the array is already sorted.',
      'Break early to achieve O(N) best-case runtime.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['5\n5 1 4 2 8', '4\n1 2 3 4'],
    hiddenInputs: ['1\n7', '3\n3 2 1', '6\n10 -5 20 -15 0 5'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - 1 - i; j++) {
          if (nums[j] > nums[j + 1]) {
            const tmp = nums[j]; nums[j] = nums[j + 1]; nums[j + 1] = tmp;
            swapped = true;
          }
        }
        if (!swapped) break;
      }
      return nums.join(' ');
    }
  }),

  // 2. Selection Sort (Easy)
  createCanonicalProblem({
    problemId: 'dsa_sorting_02',
    topicId: 'sorting',
    order: 2,
    title: 'Selection Sort',
    difficulty: 'Easy',
    tags: ['Sorting', 'Array'],
    statement: `Given an array of integers \`nums\`, sort the array using the **Selection Sort** algorithm. In each pass, find the minimum element in the unsorted suffix and swap it into its correct prefix position.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the sorted array separated by spaces.`,
    constraints: ['1 <= nums.length <= 1000', '-10^4 <= nums[i] <= 10^4'],
    examples: [
      {
        input: '5\n64 25 12 22 11',
        displayInput: 'nums = [64, 25, 12, 22, 11]',
        output: '11 12 22 25 64',
        displayOutput: '[11, 12, 22, 25, 64]',
        explanation: 'Selection sort places minimum values 11, 12, 22, 25, 64 in order.'
      }
    ],
    hints: [
      'For index i from 0 to N - 2, assume minIdx = i.',
      'Scan j from i + 1 to N - 1; if nums[j] < nums[minIdx], update minIdx = j.',
      'Swap nums[i] with nums[minIdx].'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['5\n64 25 12 22 11'],
    hiddenInputs: ['1\n9', '4\n4 3 2 1', '5\n1 1 1 1 1'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
          if (nums[j] < nums[minIdx]) minIdx = j;
        }
        const tmp = nums[i]; nums[i] = nums[minIdx]; nums[minIdx] = tmp;
      }
      return nums.join(' ');
    }
  }),

  // 3. Insertion Sort (Easy)
  createCanonicalProblem({
    problemId: 'dsa_sorting_03',
    topicId: 'sorting',
    order: 3,
    title: 'Insertion Sort',
    difficulty: 'Easy',
    tags: ['Sorting', 'Array'],
    statement: `Given an array of integers \`nums\`, sort the array using **Insertion Sort**. Build the sorted array one item at a time by shifting larger elements one position to the right.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the sorted array separated by spaces.`,
    constraints: ['1 <= nums.length <= 1000', '-10^4 <= nums[i] <= 10^4'],
    examples: [
      {
        input: '6\n12 11 13 5 6 7',
        displayInput: 'nums = [12, 11, 13, 5, 6, 7]',
        output: '5 6 7 11 12 13',
        displayOutput: '[5, 6, 7, 11, 12, 13]',
        explanation: 'Sorted order.'
      }
    ],
    hints: [
      'Iterate i from 1 to N - 1; store key = nums[i].',
      'Shift all elements in nums[0..i-1] that are greater than key to one position ahead.',
      'Insert key at its correct position j + 1.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['6\n12 11 13 5 6 7'],
    hiddenInputs: ['1\n3', '4\n4 3 2 1', '3\n1 2 3'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      for (let i = 1; i < n; i++) {
        const key = nums[i];
        let j = i - 1;
        while (j >= 0 && nums[j] > key) {
          nums[j + 1] = nums[j];
          j--;
        }
        nums[j + 1] = key;
      }
      return nums.join(' ');
    }
  }),

  // 4. Sort Array by Parity (Easy)
  createCanonicalProblem({
    problemId: 'dsa_sorting_04',
    topicId: 'sorting',
    order: 4,
    title: 'Sort Array by Parity',
    difficulty: 'Easy',
    tags: ['Sorting', 'Two Pointers', 'Array'],
    statement: `Given an integer array \`nums\`, move all the **even integers** at the beginning of the array followed by all the **odd integers**.

Return any array that satisfies this condition. To be deterministic, output even numbers sorted ascending, followed by odd numbers sorted ascending.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the even numbers followed by odd numbers separated by spaces.`,
    constraints: ['1 <= nums.length <= 5000', '0 <= nums[i] <= 5000'],
    examples: [
      {
        input: '4\n3 1 2 4',
        displayInput: 'nums = [3, 1, 2, 4]',
        output: '2 4 1 3',
        displayOutput: '[2, 4, 1, 3]',
        explanation: 'Even numbers [2, 4] placed before odd numbers [1, 3].'
      },
      {
        input: '1\n0',
        displayInput: 'nums = [0]',
        output: '0',
        displayOutput: '[0]',
        explanation: '0 is even.'
      }
    ],
    hints: [
      'Partition elements into two buckets: evens and odds.',
      'Sort each bucket and concatenate them.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['4\n3 1 2 4', '1\n0'],
    hiddenInputs: ['3\n2 4 6', '3\n1 3 5', '5\n1 2 3 4 5'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      const evens = nums.filter(x => x % 2 === 0).sort((a, b) => a - b);
      const odds = nums.filter(x => x % 2 !== 0).sort((a, b) => a - b);
      return [...evens, ...odds].join(' ');
    }
  }),

  // 5. How Many Numbers Are Smaller Than Current Number (Easy)
  createCanonicalProblem({
    problemId: 'dsa_sorting_05',
    topicId: 'sorting',
    order: 5,
    title: 'How Many Numbers Are Smaller Than Current Number',
    difficulty: 'Easy',
    tags: ['Sorting', 'Counting Sort', 'Array'],
    statement: `Given the array \`nums\`, for each \`nums[i]\` find out how many numbers in the array are smaller than it. That is, for each \`nums[i]\` you have to count the number of valid \`j\`'s such that \`j != i\` and \`nums[j] < nums[i]\`.

Output the counts separated by spaces.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the counts of smaller numbers separated by spaces.`,
    constraints: ['2 <= nums.length <= 500', '0 <= nums[i] <= 100'],
    examples: [
      {
        input: '5\n8 1 2 2 3',
        displayInput: 'nums = [8, 1, 2, 2, 3]',
        output: '4 0 1 1 3',
        displayOutput: '[4, 0, 1, 1, 3]',
        explanation: 'For 8 there are 4 smaller (1,2,2,3). For 1 there are 0. For 2 there is one (1). For 3 there are 3 (1,2,2).'
      },
      {
        input: '4\n6 5 4 8',
        displayInput: 'nums = [6, 5, 4, 8]',
        output: '2 1 0 3',
        displayOutput: '[2, 1, 0, 3]',
        explanation: 'Counts of smaller numbers.'
      }
    ],
    hints: [
      'Sort a copy of the array.',
      'In a sorted array, the first occurrence of an element indicates exactly how many numbers are strictly smaller than it.',
      'Use a Hash Map: value -> first_index_in_sorted_array.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['5\n8 1 2 2 3', '4\n6 5 4 8'],
    hiddenInputs: ['4\n7 7 7 7', '3\n1 2 3', '2\n10 0'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      const sorted = [...nums].sort((a, b) => a - b);
      const map = new Map();
      for (let i = 0; i < n; i++) {
        if (!map.has(sorted[i])) map.set(sorted[i], i);
      }
      return nums.map(x => map.get(x)).join(' ');
    }
  }),

  // 6. Rank Transform of an Array (Easy)
  createCanonicalProblem({
    problemId: 'dsa_sorting_06',
    topicId: 'sorting',
    order: 6,
    title: 'Rank Transform of an Array',
    difficulty: 'Easy',
    tags: ['Sorting', 'Hash Table', 'Array'],
    statement: `Given an array of integers \`arr\`, replace each element with its **rank**.

The rank represents how large the element is. The rank has the following rules:
- Rank is an integer starting from 1.
- The larger the element, the larger the rank. If two elements are equal, their rank must be the same.
- Rank should be as small as possible (consecutive ranks: 1, 2, 3...).`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the rank-transformed array separated by spaces.`,
    constraints: ['0 <= arr.length <= 10^5', '-10^9 <= arr[i] <= 10^9'],
    examples: [
      {
        input: '4\n40 10 20 30',
        displayInput: 'arr = [40, 10, 20, 30]',
        output: '4 1 2 3',
        displayOutput: '[4, 1, 2, 3]',
        explanation: '10 is smallest (rank 1), 20 is rank 2, 30 is rank 3, 40 is rank 4.'
      },
      {
        input: '3\n100 100 100',
        displayInput: 'arr = [100, 100, 100]',
        output: '1 1 1',
        displayOutput: '[1, 1, 1]',
        explanation: 'Same elements share rank 1.'
      }
    ],
    hints: [
      'Extract unique elements and sort them.',
      'Map each unique element to its 1-based rank using a Hash Map.',
      'Replace each element in original array with its mapped rank.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t or t[0] == '0': return\n    n = int(t[0])\n    arr = [int(x) for x in t[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n) || n == 0) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length === 0 || t[0] === '0') return;\n    const n = parseInt(t[0], 10);\n    const arr = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['4\n40 10 20 30', '3\n100 100 100'],
    hiddenInputs: ['0\n', '1\n-5', '5\n37 12 28 9 100'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      if (!t || !t.length || t[0] === '0' || t[0] === '') return '';
      const n = parseInt(t[0], 10);
      const arr = t.slice(1, n + 1).map(Number);
      const sortedUniq = Array.from(new Set(arr)).sort((a, b) => a - b);
      const ranks = new Map();
      sortedUniq.forEach((val, idx) => ranks.set(val, idx + 1));
      return arr.map(x => ranks.get(x)).join(' ');
    }
  }),

  // 7. Merge Two Sorted Arrays (Easy)
  createCanonicalProblem({
    problemId: 'dsa_sorting_07',
    topicId: 'sorting',
    order: 7,
    title: 'Merge Two Sorted Arrays',
    difficulty: 'Easy',
    tags: ['Sorting', 'Two Pointers', 'Array'],
    statement: `Given two sorted arrays \`nums1\` and \`nums2\`, merge them into a single sorted array in non-decreasing order.

Output the merged sorted elements separated by spaces.`,
    inputFormat: `First line: integers N and M.
Second line: N space-separated integers for nums1.
Third line: M space-separated integers for nums2.`,
    outputFormat: `Print the N + M merged sorted integers separated by spaces.`,
    constraints: ['0 <= N, M <= 10^5', '1 <= N + M <= 2 * 10^5', '-10^9 <= nums1[i], nums2[j] <= 10^9'],
    examples: [
      {
        input: '3 3\n1 3 5\n2 4 6',
        displayInput: 'nums1 = [1, 3, 5], nums2 = [2, 4, 6]',
        output: '1 2 3 4 5 6',
        displayOutput: '[1, 2, 3, 4, 5, 6]',
        explanation: 'Merged in non-decreasing order.'
      },
      {
        input: '2 1\n2 0\n1',
        displayInput: 'nums1 = [0, 2], nums2 = [1]',
        output: '0 1 2',
        displayOutput: '[0, 1, 2]',
        explanation: 'Merged sorted array.'
      }
    ],
    hints: [
      'Maintain two pointers i and j starting at 0 for both arrays.',
      'Append the smaller of nums1[i] and nums2[j] into the result array.',
      'Append any remaining elements from the unfinished array.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n, m = int(t[0]), int(t[1])\n    a = [int(x) for x in t[2:2+n]]\n    b = [int(x) for x in t[2+n:2+n+m]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt(), m = sc.nextInt();\n        int[] a = new int[n], b = new int[m];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        for (int i = 0; i < m; i++) b[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n, m; if (!(cin >> n >> m)) return 0;\n    vector<int> a(n), b(m);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    for (int i = 0; i < m; i++) cin >> b[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10), m = parseInt(t[1], 10);\n    const a = t.slice(2, 2 + n).map(Number);\n    const b = t.slice(2 + n, 2 + n + m).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['3 3\n1 3 5\n2 4 6', '2 1\n0 2\n1'],
    hiddenInputs: ['0 1\n\n5', '1 0\n10\n', '3 3\n1 1 1\n2 2 2'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10), m = parseInt(t[1], 10);
      const a = t.slice(2, 2 + n).map(Number);
      const b = t.slice(2 + n, 2 + n + m).map(Number);
      const res = [...a, ...b].sort((x, y) => x - y);
      return res.join(' ');
    }
  }),

  // 8. Merge Sort (Medium)
  createCanonicalProblem({
    problemId: 'dsa_sorting_08',
    topicId: 'sorting',
    order: 8,
    title: 'Merge Sort',
    difficulty: 'Medium',
    tags: ['Sorting', 'Divide and Conquer', 'Recursion'],
    statement: `Given an array of integers \`nums\`, sort the array in ascending order using the **Merge Sort** algorithm (divide and conquer).

You must achieve **O(N log N)** time complexity.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the sorted array separated by spaces.`,
    constraints: ['1 <= nums.length <= 5 * 10^4', '-5 * 10^4 <= nums[i] <= 5 * 10^4'],
    examples: [
      {
        input: '4\n5 2 3 1',
        displayInput: 'nums = [5, 2, 3, 1]',
        output: '1 2 3 5',
        displayOutput: '[1, 2, 3, 5]',
        explanation: 'Sorted in ascending order.'
      },
      {
        input: '6\n5 1 1 2 0 0',
        displayInput: 'nums = [5, 1, 1, 2, 0, 0]',
        output: '0 0 1 1 2 5',
        displayOutput: '[0, 0, 1, 1, 2, 5]',
        explanation: 'Sorted with duplicate values.'
      }
    ],
    hints: [
      'Divide: find mid = (left + right) / 2 and recursively sort left and right halves.',
      'Conquer: merge the two sorted halves into a temporary buffer in linear time.',
      'Copy merged elements back to original array.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['4\n5 2 3 1', '6\n5 1 1 2 0 0'],
    hiddenInputs: ['1\n5', '5\n10 9 8 7 6', '5\n-1 -5 0 2 1'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      const mergeSort = (arr) => {
        if (arr.length <= 1) return arr;
        const mid = Math.floor(arr.length / 2);
        const left = mergeSort(arr.slice(0, mid));
        const right = mergeSort(arr.slice(mid));
        const res = [];
        let i = 0, j = 0;
        while (i < left.length && j < right.length) {
          if (left[i] <= right[j]) res.push(left[i++]);
          else res.push(right[j++]);
        }
        return res.concat(left.slice(i)).concat(right.slice(j));
      };
      return mergeSort(nums).join(' ');
    }
  }),

  // 9. Quick Sort (Medium)
  createCanonicalProblem({
    problemId: 'dsa_sorting_09',
    topicId: 'sorting',
    order: 9,
    title: 'Quick Sort',
    difficulty: 'Medium',
    tags: ['Sorting', 'Divide and Conquer'],
    statement: `Given an array of integers \`nums\`, sort the array in ascending order using the in-place **Quick Sort** algorithm with Lomuto or Hoare partitioning.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the sorted array separated by spaces.`,
    constraints: ['1 <= nums.length <= 5 * 10^4', '-5 * 10^4 <= nums[i] <= 5 * 10^4'],
    examples: [
      {
        input: '6\n10 7 8 9 1 5',
        displayInput: 'nums = [10, 7, 8, 9, 1, 5]',
        output: '1 5 7 8 9 10',
        displayOutput: '[1, 5, 7, 8, 9, 10]',
        explanation: 'Quick sort partitions around pivot to sort elements.'
      }
    ],
    hints: [
      'Choose a pivot element (e.g. nums[right] or randomized).',
      'Partition array so elements < pivot are to the left, and elements > pivot are to the right.',
      'Recursively quick-sort left and right partitions.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['6\n10 7 8 9 1 5'],
    hiddenInputs: ['1\n3', '4\n4 3 2 1', '5\n1 1 1 1 1'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      nums.sort((a, b) => a - b);
      return nums.join(' ');
    }
  }),

  // 10. Sort Colors (Dutch National Flag) (Medium)
  createCanonicalProblem({
    problemId: 'dsa_sorting_10',
    topicId: 'sorting',
    order: 10,
    title: 'Sort Colors (Dutch National Flag)',
    difficulty: 'Medium',
    tags: ['Sorting', 'Two Pointers', 'Array'],
    statement: `Given an array \`nums\` with \`n\` objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red (0), white (1), and blue (2).

Solve without using library sort in a single pass.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers (0, 1, or 2).`,
    outputFormat: `Print the sorted 0s, 1s, and 2s separated by spaces.`,
    constraints: ['1 <= nums.length <= 300', 'nums[i] is either 0, 1, or 2.'],
    examples: [
      {
        input: '6\n2 0 2 1 1 0',
        displayInput: 'nums = [2, 0, 2, 1, 1, 0]',
        output: '0 0 1 1 2 2',
        displayOutput: '[0, 0, 1, 1, 2, 2]',
        explanation: 'Sorted colors.'
      }
    ],
    hints: [
      'Maintain pointers low, mid, high.',
      'Swap 0s to low and increment low and mid.',
      'Swap 2s to high and decrement high.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['6\n2 0 2 1 1 0'],
    hiddenInputs: ['1\n0', '3\n2 0 1', '4\n1 1 1 1'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      let low = 0, mid = 0, high = n - 1;
      while (mid <= high) {
        if (nums[mid] === 0) {
          const tmp = nums[low]; nums[low] = nums[mid]; nums[mid] = tmp;
          low++; mid++;
        } else if (nums[mid] === 1) mid++;
        else {
          const tmp = nums[high]; nums[high] = nums[mid]; nums[mid] = tmp;
          high--;
        }
      }
      return nums.join(' ');
    }
  }),

  // 11. Kth Largest Element in an Array (Quickselect) (Medium)
  createCanonicalProblem({
    problemId: 'dsa_sorting_11',
    topicId: 'sorting',
    order: 11,
    title: 'Kth Largest Element in an Array (Quickselect)',
    difficulty: 'Medium',
    tags: ['Sorting', 'Quickselect', 'Divide and Conquer'],
    statement: `Given an integer array \`nums\` and an integer \`k\`, return the \`k\`th largest element in the array.

Note that it is the \`k\`th largest element in sorted order, not the \`k\`th distinct element.

Can you solve it in **O(N)** average time using Hoare's Quickselect?`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer k.`,
    outputFormat: `Print the kth largest element.`,
    constraints: ['1 <= k <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    examples: [
      {
        input: '6\n3 2 1 5 6 4\n2',
        displayInput: 'nums = [3,2,1,5,6,4], k = 2',
        output: '5',
        displayOutput: '5',
        explanation: 'Sorted descending: [6, 5, 4, 3, 2, 1]. 2nd largest is 5.'
      },
      {
        input: '9\n3 2 3 1 2 4 5 5 6\n4',
        displayInput: 'nums = [3,2,3,1,2,4,5,5,6], k = 4',
        output: '4',
        displayOutput: '4',
        explanation: '4th largest element is 4.'
      }
    ],
    hints: [
      'The kth largest element is equivalent to the (N - k)th smallest element.',
      'Partition the array around a pivot.',
      'If pivot index == N - k, you found the answer; otherwise recurse into the relevant half.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    k = int(t[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int k = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int k; cin >> k;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    const k = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['6\n3 2 1 5 6 4\n2', '9\n3 2 3 1 2 4 5 5 6\n4'],
    hiddenInputs: ['1\n10\n1', '5\n5 5 5 5 5\n3', '4\n1 2 3 4\n1'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number).sort((a, b) => b - a);
      const k = parseInt(t[n + 1], 10);
      return String(nums[k - 1]);
    }
  }),

  // 12. Top K Frequent Elements (Medium)
  createCanonicalProblem({
    problemId: 'dsa_sorting_12',
    topicId: 'sorting',
    order: 12,
    title: 'Top K Frequent Elements',
    difficulty: 'Medium',
    tags: ['Sorting', 'Hash Table', 'Bucket Sort'],
    statement: `Given an integer array \`nums\` and an integer \`k\`, return the \`k\` most frequent elements sorted in ascending order separated by spaces.`,
    inputFormat: `First line: integers N and K.
Second line: N space-separated integers.`,
    outputFormat: `Print the k most frequent elements in ascending order.`,
    constraints: ['1 <= nums.length <= 10^5', 'k is in range [1, number of unique elements]'],
    examples: [
      {
        input: '6 2\n1 1 1 2 2 3',
        displayInput: 'nums = [1,1,1,2,2,3], k = 2',
        output: '1 2',
        displayOutput: '[1, 2]',
        explanation: '1 occurs 3 times, 2 occurs 2 times.'
      }
    ],
    hints: [
      'Tally frequencies using a Hash Map.',
      'Group numbers into frequency buckets [0..N].',
      'Collect from bucket N downwards until k elements are obtained.'
    ],
    starterCode: {
      python: `import sys\nfrom collections import Counter\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n, k = int(t[0]), int(t[1])\n    nums = [int(x) for x in t[2:2+n]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt(), k = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n, k; if (!(cin >> n >> k)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10), k = parseInt(t[1], 10);\n    const nums = t.slice(2, 2 + n).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['6 2\n1 1 1 2 2 3'],
    hiddenInputs: ['1 1\n5', '4 2\n4 4 2 2', '5 1\n10 10 10 20 30'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10), k = parseInt(t[1], 10);
      const nums = t.slice(2, 2 + n).map(Number);
      const count = {};
      for (const x of nums) count[x] = (count[x] || 0) + 1;
      const sorted = Object.keys(count).map(Number).sort((a, b) => count[b] - count[a] || a - b);
      return sorted.slice(0, k).sort((a, b) => a - b).join(' ');
    }
  }),

  // 13. Meeting Rooms II (Medium)
  createCanonicalProblem({
    problemId: 'dsa_sorting_13',
    topicId: 'sorting',
    order: 13,
    title: 'Meeting Rooms II',
    difficulty: 'Medium',
    tags: ['Sorting', 'Two Pointers', 'Sweep Line'],
    statement: `Given an array of meeting time intervals \`intervals\` where \`intervals[i] = [start_i, end_i]\`, return the minimum number of conference rooms required.`,
    inputFormat: `First line: integer N (number of meetings).
Next N lines: two space-separated integers start and end.`,
    outputFormat: `Print the minimum conference rooms needed.`,
    constraints: ['1 <= intervals.length <= 10^4', '0 <= start_i < end_i <= 10^6'],
    examples: [
      {
        input: '3\n0 30\n5 10\n15 20',
        displayInput: 'intervals = [[0,30],[5,10],[15,20]]',
        output: '2',
        displayOutput: '2',
        explanation: 'At time 5, meeting 1 and meeting 2 overlap. Room count = 2.'
      },
      {
        input: '2\n7 10\n2 4',
        displayInput: 'intervals = [[7,10],[2,4]]',
        output: '1',
        displayOutput: '1',
        explanation: 'No overlap, 1 room suffices.'
      }
    ],
    hints: [
      'Extract start times and end times into two separate arrays and sort both.',
      'Use two pointers startPtr and endPtr.',
      'If startTimes[startPtr] < endTimes[endPtr], a room is occupied (increment rooms, startPtr++); otherwise a room freed up (endPtr++, startPtr++).'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    lines = sys.stdin.read().strip().splitlines()\n    if not lines: return\n    n = int(lines[0])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const lines = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/).filter(Boolean);\n    if (!lines.length) return;\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['3\n0 30\n5 10\n15 20', '2\n7 10\n2 4'],
    hiddenInputs: ['1\n1 5', '3\n1 5\n2 6\n3 7', '3\n1 2\n2 3\n3 4'],
    solveFunction: (stdin) => {
      const lines = stdin.trim().split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const n = parseInt(lines[0], 10);
      const starts = [], ends = [];
      for (let i = 1; i <= n; i++) {
        const [s, e] = lines[i].split(/\s+/).map(Number);
        starts.push(s); ends.push(e);
      }
      starts.sort((a, b) => a - b);
      ends.sort((a, b) => a - b);
      let s = 0, e = 0, rooms = 0;
      while (s < n) {
        if (starts[s] < ends[e]) {
          rooms++;
        } else {
          e++;
        }
        s++;
      }
      return String(rooms);
    }
  }),

  // 14. Largest Number (Medium)
  createCanonicalProblem({
    problemId: 'dsa_sorting_14',
    topicId: 'sorting',
    order: 14,
    title: 'Largest Number',
    difficulty: 'Medium',
    tags: ['Sorting', 'String', 'Greedy'],
    statement: `Given a list of non-negative integers \`nums\`, arrange them such that they form the largest number and return it as a string.

Since the result may be very large, you need to return a string instead of an integer.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the largest number string.`,
    constraints: ['1 <= nums.length <= 100', '0 <= nums[i] <= 10^9'],
    examples: [
      {
        input: '2\n10 2',
        displayInput: 'nums = [10, 2]',
        output: '210',
        displayOutput: '"210"',
        explanation: 'Comparing "210" vs "102", "210" is larger.'
      },
      {
        input: '5\n3 30 34 5 9',
        displayInput: 'nums = [3, 30, 34, 5, 9]',
        output: '9534330',
        displayOutput: '"9534330"',
        explanation: 'Largest concatenated number.'
      }
    ],
    hints: [
      'Convert numbers to strings.',
      'Sort strings using custom comparator: compare (b + a) with (a + b).',
      'If the largest element after sorting is "0", the entire result is "0".'
    ],
    starterCode: {
      python: `import sys\nfrom functools import cmp_to_key\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = t[1:n+1]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        String[] a = new String[n];\n        for (int i = 0; i < n; i++) a[i] = sc.next();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<string> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['2\n10 2', '5\n3 30 34 5 9'],
    hiddenInputs: ['2\n0 0', '1\n99', '4\n1 2 3 4'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const strs = t.slice(1, n + 1);
      strs.sort((a, b) => (b + a).localeCompare(a + b));
      if (strs[0] === '0') return '0';
      return strs.join('');
    }
  }),

  // 15. Non-overlapping Intervals (Medium)
  createCanonicalProblem({
    problemId: 'dsa_sorting_15',
    topicId: 'sorting',
    order: 15,
    title: 'Non-overlapping Intervals',
    difficulty: 'Medium',
    tags: ['Sorting', 'Greedy', 'Intervals'],
    statement: `Given an array of intervals \`intervals\` where \`intervals[i] = [start_i, end_i]\`, return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.`,
    inputFormat: `First line: integer N.
Next N lines: two space-separated integers start and end.`,
    outputFormat: `Print the minimum number of intervals to remove.`,
    constraints: ['1 <= intervals.length <= 10^5', '-5 * 10^4 <= start_i < end_i <= 5 * 10^4'],
    examples: [
      {
        input: '4\n1 2\n2 3\n3 4\n1 3',
        displayInput: 'intervals = [[1,2],[2,3],[3,4],[1,3]]',
        output: '1',
        displayOutput: '1',
        explanation: 'Removing [1,3] leaves [1,2], [2,3], [3,4] non-overlapping.'
      },
      {
        input: '3\n1 2\n1 2\n1 2',
        displayInput: 'intervals = [[1,2],[1,2],[1,2]]',
        output: '2',
        displayOutput: '2',
        explanation: 'Remove two [1,2] intervals.'
      }
    ],
    hints: [
      'Sort intervals by end time in ascending order.',
      'Greedily select intervals that end as early as possible to maximize space for future intervals.',
      'Count overlapping intervals that must be skipped/removed.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    lines = sys.stdin.read().strip().splitlines()\n    if not lines: return\n    n = int(lines[0])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const lines = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/).filter(Boolean);\n    if (!lines.length) return;\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['4\n1 2\n2 3\n3 4\n1 3', '3\n1 2\n1 2\n1 2'],
    hiddenInputs: ['2\n1 2\n2 3', '1\n1 10', '3\n1 100\n11 22\n1 11'],
    solveFunction: (stdin) => {
      const lines = stdin.trim().split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const n = parseInt(lines[0], 10);
      const intervals = [];
      for (let i = 1; i <= n; i++) {
        intervals.push(lines[i].split(/\s+/).map(Number));
      }
      intervals.sort((a, b) => a[1] - b[1]);
      let removed = 0, lastEnd = -Infinity;
      for (const [start, end] of intervals) {
        if (start >= lastEnd) {
          lastEnd = end;
        } else {
          removed++;
        }
      }
      return String(removed);
    }
  }),

  // 16. Sort an Array (Heap Sort) (Medium)
  createCanonicalProblem({
    problemId: 'dsa_sorting_16',
    topicId: 'sorting',
    order: 16,
    title: 'Sort an Array (Heap Sort)',
    difficulty: 'Medium',
    tags: ['Sorting', 'Heap', 'Array'],
    statement: `Given an array of integers \`nums\`, sort the array in ascending order using **Heap Sort** in **O(N log N)** time and **O(1)** auxiliary space.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the sorted array separated by spaces.`,
    constraints: ['1 <= nums.length <= 5 * 10^4', '-5 * 10^4 <= nums[i] <= 5 * 10^4'],
    examples: [
      {
        input: '5\n5 2 3 1 4',
        displayInput: 'nums = [5, 2, 3, 1, 4]',
        output: '1 2 3 4 5',
        displayOutput: '[1, 2, 3, 4, 5]',
        explanation: 'Array sorted in ascending order.'
      }
    ],
    hints: [
      'Build a max heap in-place in O(N) time.',
      'Repeatedly swap root (maximum) with the last element and heapify the reduced heap.',
      'Requires zero extra array allocations.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['5\n5 2 3 1 4'],
    hiddenInputs: ['1\n10', '4\n4 3 2 1', '6\n-2 4 -1 0 3 -5'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      nums.sort((a, b) => a - b);
      return nums.join(' ');
    }
  }),

  // 17. Count Inversions in an Array (Hard)
  createCanonicalProblem({
    problemId: 'dsa_sorting_17',
    topicId: 'sorting',
    order: 17,
    title: 'Count Inversions in an Array',
    difficulty: 'Hard',
    tags: ['Sorting', 'Divide and Conquer', 'Merge Sort'],
    statement: `Given an array of integers \`arr\`, find the **inversion count** of the array.

Two array elements \`arr[i]\` and \`arr[j]\` form an inversion if \`arr[i] > arr[j]\` and \`i < j\`.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the total inversion count.`,
    constraints: ['1 <= arr.length <= 10^5', '0 <= arr[i] <= 10^9'],
    examples: [
      {
        input: '5\n2 4 1 3 5',
        displayInput: 'arr = [2, 4, 1, 3, 5]',
        output: '3',
        displayOutput: '3',
        explanation: 'Three inversions: (2, 1), (4, 1), (4, 3).'
      },
      {
        input: '5\n2 3 4 5 6',
        displayInput: 'arr = [2, 3, 4, 5, 6]',
        output: '0',
        displayOutput: '0',
        explanation: 'Already sorted, 0 inversions.'
      }
    ],
    hints: [
      'Modify Merge Sort to count inversions during the merge step.',
      'When left[i] > right[j], all remaining elements in left[i..mid] are also > right[j], adding (mid - i + 1) inversions.',
      'Achieves O(N log N) runtime.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    arr = [int(x) for x in t[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const arr = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['5\n2 4 1 3 5', '5\n2 3 4 5 6'],
    hiddenInputs: ['5\n5 4 3 2 1', '1\n10', '4\n1 2 2 1'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const arr = t.slice(1, n + 1).map(Number);
      let inv = 0;
      const sort = (a) => {
        if (a.length <= 1) return a;
        const mid = Math.floor(a.length / 2);
        const left = sort(a.slice(0, mid));
        const right = sort(a.slice(mid));
        const res = [];
        let i = 0, j = 0;
        while (i < left.length && j < right.length) {
          if (left[i] <= right[j]) res.push(left[i++]);
          else {
            inv += left.length - i;
            res.push(right[j++]);
          }
        }
        return res.concat(left.slice(i)).concat(right.slice(j));
      };
      sort(arr);
      return String(inv);
    }
  }),

  // 18. Reverse Pairs (Hard)
  createCanonicalProblem({
    problemId: 'dsa_sorting_18',
    topicId: 'sorting',
    order: 18,
    title: 'Reverse Pairs',
    difficulty: 'Hard',
    tags: ['Sorting', 'Divide and Conquer', 'Binary Indexed Tree'],
    statement: `Given an integer array \`nums\`, return the number of **reverse pairs** in the array.

A reverse pair is a pair \`(i, j)\` where \`0 <= i < j < nums.length\` and \`nums[i] > 2 * nums[j]\`.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the total number of reverse pairs.`,
    constraints: ['1 <= nums.length <= 5 * 10^4', '-2^31 <= nums[i] <= 2^31 - 1'],
    examples: [
      {
        input: '5\n1 3 2 3 1',
        displayInput: 'nums = [1, 3, 2, 3, 1]',
        output: '2',
        displayOutput: '2',
        explanation: 'Two reverse pairs: (1, 4) where 3 > 2 * 1, and (3, 4) where 3 > 2 * 1.'
      },
      {
        input: '5\n2 4 3 5 1',
        displayInput: 'nums = [2, 4, 3, 5, 1]',
        output: '3',
        displayOutput: '3',
        explanation: 'Reverse pairs: (1, 4) where 4 > 2, (2, 4) where 3 > 2, (3, 4) where 5 > 2.'
      }
    ],
    hints: [
      'Modify Merge Sort.',
      'Before merging two sorted halves left and right, use two pointers to count how many pairs satisfy left[i] > 2 * right[j].',
      'Then merge normally to preserve sorting order for upper levels.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['5\n1 3 2 3 1', '5\n2 4 3 5 1'],
    hiddenInputs: ['1\n5', '4\n1 2 3 4', '4\n8 4 2 1'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      let count = 0;
      const sort = (arr) => {
        if (arr.length <= 1) return arr;
        const mid = Math.floor(arr.length / 2);
        const left = sort(arr.slice(0, mid));
        const right = sort(arr.slice(mid));
        let j = 0;
        for (let i = 0; i < left.length; i++) {
          while (j < right.length && left[i] > 2 * right[j]) j++;
          count += j;
        }
        const res = [];
        let p1 = 0, p2 = 0;
        while (p1 < left.length && p2 < right.length) {
          if (left[p1] <= right[p2]) res.push(left[p1++]);
          else res.push(right[p2++]);
        }
        return res.concat(left.slice(p1)).concat(right.slice(p2));
      };
      sort(nums);
      return String(count);
    }
  }),

  // 19. Maximum Gap (Bucket Sort) (Hard)
  createCanonicalProblem({
    problemId: 'dsa_sorting_19',
    topicId: 'sorting',
    order: 19,
    title: 'Maximum Gap (Bucket Sort)',
    difficulty: 'Hard',
    tags: ['Sorting', 'Bucket Sort', 'Array'],
    statement: `Given an integer array \`nums\`, return the maximum difference between two successive elements in its sorted form. If the array contains less than two elements, return \`0\`.

You must write an algorithm that runs in **linear time O(N)** and uses linear extra space.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the maximum difference between successive sorted elements.`,
    constraints: ['1 <= nums.length <= 10^5', '0 <= nums[i] <= 10^9'],
    examples: [
      {
        input: '4\n3 6 9 1',
        displayInput: 'nums = [3, 6, 9, 1]',
        output: '3',
        displayOutput: '3',
        explanation: 'Sorted form is [1, 3, 6, 9], max difference is between 3 and 6 or 6 and 9, which is 3.'
      },
      {
        input: '1\n10',
        displayInput: 'nums = [10]',
        output: '0',
        displayOutput: '0',
        explanation: 'Array has fewer than 2 elements.'
      }
    ],
    hints: [
      'Pigeonhole Principle: with N elements and range [min, max], bucket size = max(1, floor((max - min) / (N - 1))).',
      'The maximum gap must occur between the maximum of one bucket and the minimum of the next non-empty bucket.',
      'Record min and max for each bucket to find the gap in linear time.'
    ],
    starterCode: {
      python: `import sys\nimport math\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['4\n3 6 9 1', '1\n10'],
    hiddenInputs: ['2\n1 1000', '5\n1 1 1 1 1', '3\n1 2 4'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      if (n < 2) return '0';
      const nums = t.slice(1, n + 1).map(Number).sort((a, b) => a - b);
      let maxGap = 0;
      for (let i = 1; i < n; i++) {
        maxGap = Math.max(maxGap, nums[i] - nums[i - 1]);
      }
      return String(maxGap);
    }
  }),

  // 20. Russian Doll Envelopes (Hard)
  createCanonicalProblem({
    problemId: 'dsa_sorting_20',
    topicId: 'sorting',
    order: 20,
    title: 'Russian Doll Envelopes',
    difficulty: 'Hard',
    tags: ['Sorting', 'Binary Search', 'Dynamic Programming'],
    statement: `You are given a 2D array of integers \`envelopes\` where \`envelopes[i] = [wi, hi]\` represents the width and the height of an envelope.

One envelope can fit into another if and only if both the width and height of one envelope are strictly greater than the other.

Return the maximum number of envelopes you can Russian doll (i.e., put one inside the other).`,
    inputFormat: `First line: integer N.
Next N lines: two space-separated integers width and height.`,
    outputFormat: `Print the maximum number of nested envelopes.`,
    constraints: ['1 <= envelopes.length <= 10^5', 'envelopes[i].length == 2', '1 <= wi, hi <= 10^5'],
    examples: [
      {
        input: '4\n5 4\n6 4\n6 7\n2 3',
        displayInput: 'envelopes = [[5,4],[6,4],[6,7],[2,3]]',
        output: '3',
        displayOutput: '3',
        explanation: 'Max nested envelopes: [2,3] => [5,4] => [6,7].'
      },
      {
        input: '3\n1 1\n1 1\n1 1',
        displayInput: 'envelopes = [[1,1],[1,1],[1,1]]',
        output: '1',
        displayOutput: '1',
        explanation: 'Cannot nest equal dimensions.'
      }
    ],
    hints: [
      'Sort envelopes primarily by width ascending.',
      'If widths are equal, sort height descending so identical widths cannot be nested.',
      'Find the Longest Increasing Subsequence (LIS) on the heights in O(N log N) using binary search patience sorting.'
    ],
    starterCode: {
      python: `import sys\nimport bisect\n\ndef solve():\n    lines = sys.stdin.read().strip().splitlines()\n    if not lines: return\n    n = int(lines[0])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const lines = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/).filter(Boolean);\n    if (!lines.length) return;\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['4\n5 4\n6 4\n6 7\n2 3', '3\n1 1\n1 1\n1 1'],
    hiddenInputs: ['1\n10 10', '4\n1 2\n2 3\n3 4\n4 5', '4\n4 5\n4 6\n6 7\n2 3'],
    solveFunction: (stdin) => {
      const lines = stdin.trim().split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const n = parseInt(lines[0], 10);
      const envs = [];
      for (let i = 1; i <= n; i++) {
        envs.push(lines[i].split(/\s+/).map(Number));
      }
      envs.sort((a, b) => a[0] === b[0] ? b[1] - a[1] : a[0] - b[0]);
      const heights = envs.map(e => e[1]);
      const lis = [];
      for (const h of heights) {
        let l = 0, r = lis.length - 1, pos = lis.length;
        while (l <= r) {
          const mid = (l + r) >> 1;
          if (lis[mid] >= h) { pos = mid; r = mid - 1; }
          else l = mid + 1;
        }
        if (pos === lis.length) lis.push(h);
        else lis[pos] = h;
      }
      return String(lis.length);
    }
  })
];


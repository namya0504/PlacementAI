/**
 * Canonical DSA Placement Problems: HASHING (20 Questions)
 * 7 Easy, 9 Medium, 4 Hard
 */

import { createCanonicalProblem } from './topicProblemHelper.js';

export const HASHING_PROBLEMS = [
  // 1. Two Sum with Hash Map (Easy)
  createCanonicalProblem({
    problemId: 'dsa_hashing_01',
    topicId: 'hashing',
    order: 1,
    title: 'Two Sum with Hash Map',
    difficulty: 'Easy',
    tags: ['Hash Table', 'Array', 'Two Pointers'],
    statement: `Given an array of integers \`nums\` and an integer \`target\`, find the **indices** of the two numbers such that they add up to \`target\`.

You may assume that each input has **exactly one solution**, and you may not use the same element twice.

Output the two 0-based indices separated by a space in ascending order (e.g. \`0 1\`).`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer target.`,
    outputFormat: `Print the two 0-based indices separated by a space in ascending order.`,
    constraints: [
      '2 <= nums.length <= 10^5',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Exactly one valid answer exists.'
    ],
    examples: [
      {
        input: '4\n2 7 11 15\n9',
        displayInput: 'nums = [2, 7, 11, 15], target = 9',
        output: '0 1',
        displayOutput: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 2 + 7 == 9, we return 0 1.'
      },
      {
        input: '3\n3 2 4\n6',
        displayInput: 'nums = [3, 2, 4], target = 6',
        output: '1 2',
        displayOutput: '[1, 2]',
        explanation: 'Because nums[1] + nums[2] == 2 + 4 == 6, we return 1 2.'
      },
      {
        input: '2\n3 3\n6',
        displayInput: 'nums = [3, 3], target = 6',
        output: '0 1',
        displayOutput: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 3 + 3 == 6, we return 0 1.'
      }
    ],
    hints: [
      'Can you check every pair? A nested loop runs in O(N^2) time.',
      'For each element x, its complement is (target - x). Can we look up if (target - x) was previously seen in O(1)?',
      'Use a Hash Map to store each element and its index as you iterate through the array.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    target = int(tokens[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int target = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    int target;\n    cin >> target;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\n\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 3) return;\n    const n = parseInt(tokens[0], 10);\n    const nums = tokens.slice(1, n + 1).map(Number);\n    const target = parseInt(tokens[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['4\n2 7 11 15\n9', '3\n3 2 4\n6', '2\n3 3\n6'],
    hiddenInputs: ['5\n1 5 3 7 9\n12', '4\n-3 4 3 90\n0', '4\n11 15 2 7\n9', '5\n100 200 500 800 1000\n1300'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      const target = parseInt(t[n + 1], 10);
      const map = new Map();
      for (let i = 0; i < nums.length; i++) {
        const comp = target - nums[i];
        if (map.has(comp)) {
          const first = map.get(comp);
          return `${Math.min(first, i)} ${Math.max(first, i)}`;
        }
        map.set(nums[i], i);
      }
      return '0 1';
    }
  }),

  // 2. Contains Duplicate (Easy)
  createCanonicalProblem({
    problemId: 'dsa_hashing_02',
    topicId: 'hashing',
    order: 2,
    title: 'Contains Duplicate',
    difficulty: 'Easy',
    tags: ['Hash Table', 'Array', 'Set'],
    statement: `Given an integer array \`nums\`, return \`true\` if any value appears **at least twice** in the array, and return \`false\` if every element is distinct.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print 'true' if duplicate exists, otherwise 'false'.`,
    constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    examples: [
      {
        input: '4\n1 2 3 1',
        displayInput: 'nums = [1, 2, 3, 1]',
        output: 'true',
        displayOutput: 'true',
        explanation: 'The element 1 occurs at index 0 and 3.'
      },
      {
        input: '4\n1 2 3 4',
        displayInput: 'nums = [1, 2, 3, 4]',
        output: 'false',
        displayOutput: 'false',
        explanation: 'All elements are distinct.'
      },
      {
        input: '10\n1 1 1 3 3 4 3 2 4 2',
        displayInput: 'nums = [1, 1, 1, 3, 3, 4, 3, 2, 4, 2]',
        output: 'true',
        displayOutput: 'true',
        explanation: 'Multiple elements appear more than once.'
      }
    ],
    hints: [
      'Can you sort the array and look for adjacent identical values?',
      'A Hash Set allows O(1) membership lookup. Insert each element as you traverse.',
      'If the current element is already present in the set, return true immediately.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    const nums = tokens.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['4\n1 2 3 1', '4\n1 2 3 4', '10\n1 1 1 3 3 4 3 2 4 2'],
    hiddenInputs: ['1\n99', '2\n5 5', '5\n10 20 30 40 50', '6\n-1 -2 -3 -1 0 5', '5\n0 0 0 0 0'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      const set = new Set(nums);
      return set.size !== nums.length ? 'true' : 'false';
    }
  }),

  // 3. Ransom Note (Easy)
  createCanonicalProblem({
    problemId: 'dsa_hashing_03',
    topicId: 'hashing',
    order: 3,
    title: 'Ransom Note',
    difficulty: 'Easy',
    tags: ['Hash Table', 'String', 'Counting'],
    statement: `Given two strings \`ransomNote\` and \`magazine\`, return \`true\` if \`ransomNote\` can be constructed by using the letters from \`magazine\` and \`false\` otherwise.

Each letter in \`magazine\` can only be used once in \`ransomNote\`.`,
    inputFormat: `First line: ransomNote string.
Second line: magazine string.`,
    outputFormat: `Print 'true' if ransomNote can be formed from magazine, else 'false'.`,
    constraints: [
      '1 <= ransomNote.length, magazine.length <= 10^5',
      'ransomNote and magazine consist of lowercase English letters.'
    ],
    examples: [
      {
        input: 'a\nb',
        displayInput: 'ransomNote = "a", magazine = "b"',
        output: 'false',
        displayOutput: 'false',
        explanation: 'magazine does not contain "a".'
      },
      {
        input: 'aa\nab',
        displayInput: 'ransomNote = "aa", magazine = "ab"',
        output: 'false',
        displayOutput: 'false',
        explanation: 'magazine contains only one "a", but ransomNote needs two.'
      },
      {
        input: 'aa\naab',
        displayInput: 'ransomNote = "aa", magazine = "aab"',
        output: 'true',
        displayOutput: 'true',
        explanation: 'magazine contains two "a"s, satisfying the ransom note.'
      }
    ],
    hints: [
      'Count the frequency of each character in magazine.',
      'For each character in ransomNote, decrement the frequency in magazine counter.',
      'If any character count drops below zero, magazine cannot supply enough letters.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if len(tokens) < 2:\n        return\n    ransomNote, magazine = tokens[0], tokens[1]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String r = sc.next(), m = sc.next();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string r, m; if (!(cin >> r >> m)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (tokens.length < 2) return;\n    const [r, m] = tokens;\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['a\nb', 'aa\nab', 'aa\naab'],
    hiddenInputs: ['abc\nabcdef', 'zz\nz', 'hello\nbilheoll', 'apple\nbanana', 'programming\ngnimmargorp'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      if (t.length < 2) return 'false';
      const [r, m] = t;
      const count = {};
      for (const ch of m) count[ch] = (count[ch] || 0) + 1;
      for (const ch of r) {
        if (!count[ch]) return 'false';
        count[ch]--;
      }
      return 'true';
    }
  }),

  // 4. Intersection of Two Arrays (Easy)
  createCanonicalProblem({
    problemId: 'dsa_hashing_04',
    topicId: 'hashing',
    order: 4,
    title: 'Intersection of Two Arrays',
    difficulty: 'Easy',
    tags: ['Hash Table', 'Array', 'Two Pointers'],
    statement: `Given two integer arrays \`nums1\` and \`nums2\`, return an array of their **intersection**. Each element in the result must be **unique** and you may return the result in **ascending sorted order** separated by spaces.`,
    inputFormat: `First line: integers N and M (sizes of nums1 and nums2).
Second line: N space-separated integers for nums1.
Third line: M space-separated integers for nums2.`,
    outputFormat: `Print the unique common integers in ascending sorted order separated by spaces. If intersection is empty, print nothing.`,
    constraints: ['1 <= nums1.length, nums2.length <= 1000', '0 <= nums1[i], nums2[i] <= 1000'],
    examples: [
      {
        input: '4 2\n1 2 2 1\n2 2',
        displayInput: 'nums1 = [1, 2, 2, 1], nums2 = [2, 2]',
        output: '2',
        displayOutput: '[2]',
        explanation: '2 is the only number present in both arrays.'
      },
      {
        input: '3 5\n4 9 5\n9 4 9 8 4',
        displayInput: 'nums1 = [4, 9, 5], nums2 = [9, 4, 9, 8, 4]',
        output: '4 9',
        displayOutput: '[4, 9]',
        explanation: '4 and 9 appear in both arrays.'
      }
    ],
    hints: [
      'Store all elements of the first array in a Hash Set for O(1) existence checks.',
      'Iterate through the second array; if an element is found in the set, add it to the result set.',
      'Sort the result set to produce canonical output.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t:\n        return\n    n, m = int(t[0]), int(t[1])\n    nums1 = [int(x) for x in t[2:2+n]]\n    nums2 = [int(x) for x in t[2+n:2+n+m]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt(), m = sc.nextInt();\n        int[] nums1 = new int[n], nums2 = new int[m];\n        for (int i = 0; i < n; i++) nums1[i] = sc.nextInt();\n        for (int i = 0; i < m; i++) nums2[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n, m; if (!(cin >> n >> m)) return 0;\n    vector<int> a(n), b(m);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    for (int i = 0; i < m; i++) cin >> b[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10), m = parseInt(t[1], 10);\n    const nums1 = t.slice(2, 2 + n).map(Number);\n    const nums2 = t.slice(2 + n, 2 + n + m).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['4 2\n1 2 2 1\n2 2', '3 5\n4 9 5\n9 4 9 8 4', '2 2\n1 2\n3 4'],
    hiddenInputs: ['1 1\n5\n5', '3 3\n1 1 1\n1 1 1', '4 3\n10 20 30 40\n20 40 60', '5 1\n1 2 3 4 5\n3'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10), m = parseInt(t[1], 10);
      const a = t.slice(2, 2 + n).map(Number);
      const b = t.slice(2 + n, 2 + n + m).map(Number);
      const s1 = new Set(a);
      const res = Array.from(new Set(b.filter(x => s1.has(x)))).sort((x, y) => x - y);
      return res.join(' ');
    }
  }),

  // 5. Unique Number of Occurrences (Easy)
  createCanonicalProblem({
    problemId: 'dsa_hashing_05',
    topicId: 'hashing',
    order: 5,
    title: 'Unique Number of Occurrences',
    difficulty: 'Easy',
    tags: ['Hash Table', 'Array', 'Counting'],
    statement: `Given an array of integers \`arr\`, return \`true\` if the number of occurrences of each value in the array is **unique** or \`false\` otherwise.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print 'true' if all frequencies are unique, else 'false'.`,
    constraints: ['1 <= arr.length <= 1000', '-1000 <= arr[i] <= 1000'],
    examples: [
      {
        input: '6\n1 2 2 1 1 3',
        displayInput: 'arr = [1, 2, 2, 1, 1, 3]',
        output: 'true',
        displayOutput: 'true',
        explanation: '1 occurs 3 times, 2 occurs 2 times, and 3 occurs 1 time. All frequencies are unique.'
      },
      {
        input: '2\n1 2',
        displayInput: 'arr = [1, 2]',
        output: 'false',
        displayOutput: 'false',
        explanation: '1 occurs 1 time, and 2 occurs 1 time. The frequency 1 is repeated.'
      },
      {
        input: '10\n-3 0 1 -3 1 1 1 -3 10 0',
        displayInput: 'arr = [-3, 0, 1, -3, 1, 1, 1, -3, 10, 0]',
        output: 'true',
        displayOutput: 'true',
        explanation: 'Occurrences: 1->4, -3->3, 0->2, 10->1. All unique.'
      }
    ],
    hints: [
      'First count occurrences of each distinct integer using a frequency map.',
      'Then insert all frequency counts into a Hash Set.',
      'If the size of the set matches the number of keys in the frequency map, frequencies are unique.'
    ],
    starterCode: {
      python: `import sys\nfrom collections import Counter\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t:\n        return\n    n = int(t[0])\n    arr = [int(x) for x in t[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const arr = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['6\n1 2 2 1 1 3', '2\n1 2', '10\n-3 0 1 -3 1 1 1 -3 10 0'],
    hiddenInputs: ['1\n5', '3\n4 4 4', '4\n1 1 2 2', '5\n1 2 2 3 3'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const arr = t.slice(1, n + 1).map(Number);
      const counts = {};
      for (const x of arr) counts[x] = (counts[x] || 0) + 1;
      const freqValues = Object.values(counts);
      const freqSet = new Set(freqValues);
      return freqValues.length === freqSet.size ? 'true' : 'false';
    }
  }),

  // 6. Word Pattern (Easy)
  createCanonicalProblem({
    problemId: 'dsa_hashing_06',
    topicId: 'hashing',
    order: 6,
    title: 'Word Pattern',
    difficulty: 'Easy',
    tags: ['Hash Table', 'String'],
    statement: `Given a \`pattern\` and a string \`s\`, return \`true\` if \`s\` follows the same pattern.

Here **follow** means a full match, such that there is a bijection between a letter in \`pattern\` and a non-empty word in \`s\`. Specifically, each letter of \`pattern\` maps to exactly one word, and no two letters map to the same word.`,
    inputFormat: `First line: pattern string.
Second line: space-separated words string s.`,
    outputFormat: `Print 'true' if s follows the pattern, else 'false'.`,
    constraints: ['1 <= pattern.length <= 300', '1 <= s.length <= 3000', 'pattern contains only lowercase letters, s contains lowercase letters and spaces.'],
    examples: [
      {
        input: 'abba\ndog cat cat dog',
        displayInput: 'pattern = "abba", s = "dog cat cat dog"',
        output: 'true',
        displayOutput: 'true',
        explanation: 'a -> dog, b -> cat. Consistent bijection.'
      },
      {
        input: 'abba\ndog cat cat fish',
        displayInput: 'pattern = "abba", s = "dog cat cat fish"',
        output: 'false',
        displayOutput: 'false',
        explanation: 'b is mapped to cat, but the last word is fish instead of dog.'
      },
      {
        input: 'aaaa\ndog cat cat dog',
        displayInput: 'pattern = "aaaa", s = "dog cat cat dog"',
        output: 'false',
        displayOutput: 'false',
        explanation: 'All letters are "a" but words vary.'
      }
    ],
    hints: [
      'Split string s by spaces into an array of words.',
      'Check if pattern length equals words length. If not, return false.',
      'Maintain two maps: char-to-word and word-to-char to ensure a true 1-to-1 bijection.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    lines = sys.stdin.read().strip().splitlines()\n    if len(lines) < 2: return\n    pattern, s = lines[0].strip(), lines[1].strip()\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLine()) return;\n        String p = sc.nextLine().trim();\n        if (!sc.hasNextLine()) return;\n        String s = sc.nextLine().trim();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string p, s; if (!getline(cin, p) || !getline(cin, s)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const lines = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/).filter(Boolean);\n    if (lines.length < 2) return;\n    const [pattern, s] = lines;\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['abba\ndog cat cat dog', 'abba\ndog cat cat fish', 'aaaa\ndog cat cat dog'],
    hiddenInputs: ['abba\ndog dog dog dog', 'abc\ncat dog bird', 'a\nonly', 'ab\none two three'],
    solveFunction: (stdin) => {
      const lines = stdin.trim().split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      if (lines.length < 2) return 'false';
      const p = lines[0];
      const words = lines[1].split(/\s+/);
      if (p.length !== words.length) return 'false';
      const pw = new Map(), wp = new Map();
      for (let i = 0; i < p.length; i++) {
        const c = p[i], w = words[i];
        if ((pw.has(c) && pw.get(c) !== w) || (wp.has(w) && wp.get(w) !== c)) return 'false';
        pw.set(c, w); wp.set(w, c);
      }
      return 'true';
    }
  }),

  // 7. Isomorphic Strings (Easy)
  createCanonicalProblem({
    problemId: 'dsa_hashing_07',
    topicId: 'hashing',
    order: 7,
    title: 'Isomorphic Strings',
    difficulty: 'Easy',
    tags: ['Hash Table', 'String'],
    statement: `Given two strings \`s\` and \`t\`, determine if they are **isomorphic**.

Two strings \`s\` and \`t\` are isomorphic if the characters in \`s\` can be replaced to get \`t\`.

All occurrences of a character must be replaced with another character while preserving the order of characters. No two characters may map to the same character, but a character may map to itself.`,
    inputFormat: `First line: string s.
Second line: string t.`,
    outputFormat: `Print 'true' if s and t are isomorphic, else 'false'.`,
    constraints: ['1 <= s.length <= 5 * 10^4', 't.length == s.length', 's and t consist of valid ASCII characters.'],
    examples: [
      {
        input: 'egg\nadd',
        displayInput: 's = "egg", t = "add"',
        output: 'true',
        displayOutput: 'true',
        explanation: 'e -> a, g -> d.'
      },
      {
        input: 'foo\nbar',
        displayInput: 's = "foo", t = "bar"',
        output: 'false',
        displayOutput: 'false',
        explanation: 'o cannot map to both a and r.'
      },
      {
        input: 'paper\ntitle',
        displayInput: 's = "paper", t = "title"',
        output: 'true',
        displayOutput: 'true',
        explanation: 'p -> t, a -> i, e -> l, r -> e.'
      }
    ],
    hints: [
      'Two strings are isomorphic if there is a bijective character mapping.',
      'Record the last seen position of each character in both strings.',
      'If the last seen index for s[i] and t[i] ever disagree, the strings are not isomorphic.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if len(tokens) < 2: return\n    s, t = tokens[0], tokens[1]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String s = sc.next(), t = sc.next();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s, t; if (!(cin >> s >> t)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (tokens.length < 2) return;\n    const [s, t] = tokens;\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['egg\nadd', 'foo\nbar', 'paper\ntitle'],
    hiddenInputs: ['badc\nbaba', 'ab\naa', 'a\na', 'abcdefghijklmnopqrstuvwxyz\nbcdefghijklmnopqrstuvwxyza'],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      if (tokens.length < 2) return 'false';
      const [s, t] = tokens;
      if (s.length !== t.length) return 'false';
      const m1 = {}, m2 = {};
      for (let i = 0; i < s.length; i++) {
        if (m1[s[i]] !== m2[t[i]]) return 'false';
        m1[s[i]] = i + 1;
        m2[t[i]] = i + 1;
      }
      return 'true';
    }
  }),

  // 8. Subarray Sum Equals K (Medium)
  createCanonicalProblem({
    problemId: 'dsa_hashing_08',
    topicId: 'hashing',
    order: 8,
    title: 'Subarray Sum Equals K',
    difficulty: 'Medium',
    tags: ['Hash Table', 'Prefix Sum', 'Array'],
    statement: `Given an array of integers \`nums\` and an integer \`k\`, return the total number of continuous subarrays whose sum equals to \`k\`.

A subarray is a contiguous non-empty sequence of elements within an array.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer k.`,
    outputFormat: `Print the total count of subarrays with sum equal to k.`,
    constraints: ['1 <= nums.length <= 2 * 10^4', '-1000 <= nums[i] <= 1000', '-10^7 <= k <= 10^7'],
    examples: [
      {
        input: '3\n1 1 1\n2',
        displayInput: 'nums = [1, 1, 1], k = 2',
        output: '2',
        displayOutput: '2',
        explanation: 'Subarrays [nums[0..1]] and [nums[1..2]] both sum to 2.'
      },
      {
        input: '3\n1 2 3\n3',
        displayInput: 'nums = [1, 2, 3], k = 3',
        output: '2',
        displayOutput: '2',
        explanation: 'Subarrays [1, 2] and [3] sum to 3.'
      }
    ],
    hints: [
      'Maintain a running prefix sum as you iterate through the array.',
      'If (current_prefix - k) was seen before, each prior occurrence marks a valid subarray ending at the current index.',
      'Use a Hash Map with prefix sum frequencies, initialized with {0: 1}.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    k = int(t[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int k = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> nums(n); for (int i = 0; i < n; i++) cin >> nums[i];\n    int k; cin >> k;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    const k = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['3\n1 1 1\n2', '3\n1 2 3\n3'],
    hiddenInputs: ['5\n1 -1 0 1 -1\n0', '4\n3 4 7 2\n7', '1\n5\n5', '3\n1 0 -1\n0'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      const k = parseInt(t[n + 1], 10);
      const map = new Map();
      map.set(0, 1);
      let sum = 0, count = 0;
      for (const x of nums) {
        sum += x;
        if (map.has(sum - k)) count += map.get(sum - k);
        map.set(sum, (map.get(sum) || 0) + 1);
      }
      return String(count);
    }
  }),

  // 9. Longest Consecutive Sequence (Medium)
  createCanonicalProblem({
    problemId: 'dsa_hashing_09',
    topicId: 'hashing',
    order: 9,
    title: 'Longest Consecutive Sequence',
    difficulty: 'Medium',
    tags: ['Hash Table', 'Array', 'Union Find'],
    statement: `Given an unsorted array of integers \`nums\`, return the length of the **longest consecutive elements sequence**.

You must write an algorithm that runs in **O(N)** time using a Hash Set.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the length of the longest consecutive sequence.`,
    constraints: ['0 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    examples: [
      {
        input: '6\n100 4 200 1 3 2',
        displayInput: 'nums = [100, 4, 200, 1, 3, 2]',
        output: '4',
        displayOutput: '4',
        explanation: 'The longest consecutive sequence is [1, 2, 3, 4], length 4.'
      },
      {
        input: '10\n0 3 7 2 5 8 4 6 0 1',
        displayInput: 'nums = [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]',
        output: '9',
        displayOutput: '9',
        explanation: 'Consecutive elements: [0, 1, 2, 3, 4, 5, 6, 7, 8], length 9.'
      }
    ],
    hints: [
      'Store all numbers in a Hash Set for O(1) existence checks.',
      'Only start counting from a number x if (x - 1) is NOT in the set (i.e. x is the start of a sequence).',
      'This guarantees each element is visited at most twice, yielding linear O(N) runtime.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t or t[0] == '0':\n        print(0); return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) { System.out.println(0); return; }\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n) || n == 0) { cout << 0 << "\\n"; return 0; }\n    vector<int> nums(n); for (int i = 0; i < n; i++) cin >> nums[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length === 0 || t[0] === '0') { console.log(0); return; }\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['6\n100 4 200 1 3 2', '10\n0 3 7 2 5 8 4 6 0 1', '0\n'],
    hiddenInputs: ['1\n5', '5\n1 2 3 4 5', '6\n9 1 4 7 3 -1 0 5 8 -1 6', '4\n10 20 30 40'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      if (!t || t.length === 0 || t[0] === '' || t[0] === '0') return '0';
      const n = parseInt(t[0], 10);
      if (n === 0) return '0';
      const nums = t.slice(1, n + 1).map(Number);
      const set = new Set(nums);
      let maxL = 0;
      for (const x of set) {
        if (!set.has(x - 1)) {
          let cur = x, count = 1;
          while (set.has(cur + 1)) { cur++; count++; }
          if (count > maxL) maxL = count;
        }
      }
      return String(maxL);
    }
  }),

  // 10. Group Anagrams (Medium)
  createCanonicalProblem({
    problemId: 'dsa_hashing_10',
    topicId: 'hashing',
    order: 10,
    title: 'Group Anagrams',
    difficulty: 'Medium',
    tags: ['Hash Table', 'String', 'Sorting'],
    statement: `Given an array of strings \`strs\`, group the **anagrams** together. You can return the answer in any order, with words in each group sorted lexicographically and groups ordered by first word.

An **Anagram** is a word formed by rearranging the letters of a different word.`,
    inputFormat: `First line: integer N.
Second line: N space-separated strings.`,
    outputFormat: `Print each group of anagrams on a new line with words separated by spaces.`,
    constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100', 'strs[i] consists of lowercase English letters.'],
    examples: [
      {
        input: '6\neat tea tan ate nat bat',
        displayInput: 'strs = ["eat", "tea", "tan", "ate", "nat", "bat"]',
        output: 'ate eat tea\nbat\nnat tan',
        displayOutput: '[["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]',
        explanation: 'Grouped by sorted signature: "aet" -> ate, eat, tea; "ant" -> nat, tan; "abt" -> bat.'
      },
      {
        input: '1\na',
        displayInput: 'strs = ["a"]',
        output: 'a',
        displayOutput: '[["a"]]',
        explanation: 'Single element group.'
      }
    ],
    hints: [
      'Two strings are anagrams if and only if their sorted character sequences are equal.',
      'Use the sorted word as the key in a Hash Map, where the value is the list of matching words.',
      'Iterate through the hash map values to collect the grouped anagrams.'
    ],
    starterCode: {
      python: `import sys\nfrom collections import defaultdict\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    strs = t[1:n+1]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        String[] strs = new String[n];\n        for (int i = 0; i < n; i++) strs[i] = sc.next();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<string> s(n); for (int i = 0; i < n; i++) cin >> s[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const strs = t.slice(1, n + 1);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['6\neat tea tan ate nat bat', '1\na'],
    hiddenInputs: ['3\nabc bca cab', '4\na b c d', '5\naab aba baa xyz zyx'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const strs = t.slice(1, n + 1);
      const map = new Map();
      for (const w of strs) {
        const key = w.split('').sort().join('');
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(w);
      }
      const groups = Array.from(map.values()).map(g => g.sort().join(' ')).sort();
      return groups.join('\n');
    }
  }),

  // 11. Top K Frequent Elements (Medium)
  createCanonicalProblem({
    problemId: 'dsa_hashing_11',
    topicId: 'hashing',
    order: 11,
    title: 'Top K Frequent Elements',
    difficulty: 'Medium',
    tags: ['Hash Table', 'Bucket Sort', 'Heap'],
    statement: `Given an integer array \`nums\` and an integer \`k\`, return the \`k\` most frequent elements in ascending sorted order separated by spaces.`,
    inputFormat: `First line: integers N and K.
Second line: N space-separated integers.`,
    outputFormat: `Print the k most frequent elements in ascending order separated by spaces.`,
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', 'k is in range [1, number of unique elements]'],
    examples: [
      {
        input: '6 2\n1 1 1 2 2 3',
        displayInput: 'nums = [1, 1, 1, 2, 2, 3], k = 2',
        output: '1 2',
        displayOutput: '[1, 2]',
        explanation: '1 occurs 3 times, 2 occurs 2 times. Top 2 are [1, 2].'
      },
      {
        input: '1 1\n1',
        displayInput: 'nums = [1], k = 1',
        output: '1',
        displayOutput: '[1]',
        explanation: 'Only element is 1.'
      }
    ],
    hints: [
      'Build a frequency map tallying the count of each element.',
      'Use Bucket Sort where bucket[f] stores all numbers with frequency f.',
      'Iterate backwards from bucket N down to 1 collecting numbers until k elements are found.'
    ],
    starterCode: {
      python: `import sys\nfrom collections import Counter\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n, k = int(t[0]), int(t[1])\n    nums = [int(x) for x in t[2:2+n]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt(), k = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n, k; if (!(cin >> n >> k)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10), k = parseInt(t[1], 10);\n    const nums = t.slice(2, 2 + n).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['6 2\n1 1 1 2 2 3', '1 1\n1'],
    hiddenInputs: ['4 2\n4 4 2 2', '7 3\n5 5 5 2 2 1 7', '6 1\n10 10 10 20 20 30'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10), k = parseInt(t[1], 10);
      const nums = t.slice(2, 2 + n).map(Number);
      const counts = {};
      for (const x of nums) counts[x] = (counts[x] || 0) + 1;
      const sorted = Object.keys(counts).map(Number).sort((a, b) => counts[b] - counts[a] || a - b);
      const topK = sorted.slice(0, k).sort((a, b) => a - b);
      return topK.join(' ');
    }
  }),

  // 12. 4Sum (Medium)
  createCanonicalProblem({
    problemId: 'dsa_hashing_12',
    topicId: 'hashing',
    order: 12,
    title: '4Sum',
    difficulty: 'Medium',
    tags: ['Hash Table', 'Two Pointers', 'Array'],
    statement: `Given an array \`nums\` of \`n\` integers and an integer \`target\`, return all **unique quadruplets** \`[nums[a], nums[b], nums[c], nums[d]]\` such that:
- \`0 <= a, b, c, d < n\`
- \`a, b, c, and d\` are **distinct**.
- \`nums[a] + nums[b] + nums[c] + nums[d] == target\`

Print each quadruplet in sorted order on a new line. If no quadruplet exists, print nothing.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer target.`,
    outputFormat: `Print each sorted quadruplet space-separated on a new line, sorted lexicographically.`,
    constraints: ['1 <= nums.length <= 200', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9'],
    examples: [
      {
        input: '6\n1 0 -1 0 -2 2\n0',
        displayInput: 'nums = [1, 0, -1, 0, -2, 2], target = 0',
        output: '-2 -1 1 2\n-2 0 0 2\n-1 0 0 1',
        displayOutput: '[[-2,-1,1,2], [-2,0,0,2], [-1,0,0,1]]',
        explanation: 'Three unique quadruplets add up to target 0.'
      },
      {
        input: '5\n2 2 2 2 2\n8',
        displayInput: 'nums = [2, 2, 2, 2, 2], target = 8',
        output: '2 2 2 2',
        displayOutput: '[[2, 2, 2, 2]]',
        explanation: 'Only one unique combination of four 2s adds to 8.'
      }
    ],
    hints: [
      'Sort the array first to easily avoid duplicate quadruplets.',
      'Use two nested loops for the first two elements, and two pointers (left and right) for the remaining two.',
      'Skip duplicate values at each step.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    target = int(t[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int target = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int target; cin >> target;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    const target = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['6\n1 0 -1 0 -2 2\n0', '5\n2 2 2 2 2\n8'],
    hiddenInputs: ['4\n1 2 3 4\n10', '4\n1 2 3 4\n100', '6\n-3 -1 0 2 4 5\n0'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number).sort((a, b) => a - b);
      const target = parseInt(t[n + 1], 10);
      const res = [];
      for (let i = 0; i < n - 3; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        for (let j = i + 1; j < n - 2; j++) {
          if (j > i + 1 && nums[j] === nums[j - 1]) continue;
          let l = j + 1, r = n - 1;
          while (l < r) {
            const sum = nums[i] + nums[j] + nums[l] + nums[r];
            if (sum === target) {
              res.push(`${nums[i]} ${nums[j]} ${nums[l]} ${nums[r]}`);
              while (l < r && nums[l] === nums[l + 1]) l++;
              while (l < r && nums[r] === nums[r - 1]) r--;
              l++; r--;
            } else if (sum < target) {
              l++;
            } else {
              r--;
            }
          }
        }
      }
      return res.join('\n');
    }
  }),

  // 13. Insert Delete GetRandom O(1) (Medium)
  createCanonicalProblem({
    problemId: 'dsa_hashing_13',
    topicId: 'hashing',
    order: 13,
    title: 'Insert Delete GetRandom O(1)',
    difficulty: 'Medium',
    tags: ['Hash Table', 'Array', 'Design'],
    statement: `Design a data structure that supports all following operations in average **O(1)** time:
1. \`insert(val)\`: Inserts val to the set if not already present. Output 'true' if inserted, 'false' if already existed.
2. \`remove(val)\`: Removes val from the set if present. Output 'true' if removed, 'false' if not present.
3. \`getRandom\`: Outputs an existing element at random (or in deterministic test harness, output the last inserted element).

Given Q operations, process each and print the result.`,
    inputFormat: `First line: integer Q.
Next Q lines: operation name and optional integer value.`,
    outputFormat: `Print the output of each operation on a new line.`,
    constraints: ['1 <= Q <= 10^5', '-2^31 <= val <= 2^31 - 1'],
    examples: [
      {
        input: '5\ninsert 1\nremove 2\ninsert 2\nremove 1\ninsert 2',
        displayInput: 'operations: insert(1), remove(2), insert(2), remove(1), insert(2)',
        output: 'true\nfalse\ntrue\ntrue\nfalse',
        displayOutput: '[true, false, true, true, false]',
        explanation: 'insert 1 succeeds (true), remove 2 fails (false), insert 2 succeeds (true), remove 1 succeeds (true), insert 2 fails (already present, false).'
      }
    ],
    hints: [
      'To achieve O(1) random access, elements must be stored in a contiguous array.',
      'To achieve O(1) deletion, look up the index using a Hash Map, swap the target element with the last element of the array, and pop.',
      'The Hash Map tracks val -> array_index.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    lines = sys.stdin.read().strip().splitlines()\n    if not lines: return\n    q = int(lines[0])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int q = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    int q; if (!(cin >> q)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const lines = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/).filter(Boolean);\n    if (!lines.length) return;\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['5\ninsert 1\nremove 2\ninsert 2\nremove 1\ninsert 2'],
    hiddenInputs: ['4\ninsert 10\ninsert 20\nremove 10\nremove 10', '3\nremove 5\ninsert 5\nremove 5'],
    solveFunction: (stdin) => {
      const lines = stdin.trim().split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const q = parseInt(lines[0], 10);
      const set = new Set();
      const out = [];
      for (let i = 1; i <= q; i++) {
        const parts = lines[i].split(/\s+/);
        const op = parts[0];
        const val = parts[1];
        if (op === 'insert') {
          if (set.has(val)) out.push('false');
          else { set.add(val); out.push('true'); }
        } else if (op === 'remove') {
          if (set.has(val)) { set.delete(val); out.push('true'); }
          else out.push('false');
        }
      }
      return out.join('\n');
    }
  }),

  // 14. Continuous Subarray Sum (Medium)
  createCanonicalProblem({
    problemId: 'dsa_hashing_14',
    topicId: 'hashing',
    order: 14,
    title: 'Continuous Subarray Sum',
    difficulty: 'Medium',
    tags: ['Hash Table', 'Prefix Sum', 'Math'],
    statement: `Given an integer array \`nums\` and an integer \`k\`, return \`true\` if \`nums\` has a **good subarray** or \`false\` otherwise.

A good subarray is a subarray where:
- its length is **at least two**, and
- the sum of the elements of the subarray is a multiple of \`k\` (i.e. \`sum % k == 0\`).`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer k.`,
    outputFormat: `Print 'true' if good subarray exists, else 'false'.`,
    constraints: ['1 <= nums.length <= 10^5', '0 <= nums[i] <= 10^9', '1 <= k <= 2 * 10^9'],
    examples: [
      {
        input: '5\n23 2 4 6 7\n6',
        displayInput: 'nums = [23, 2, 4, 6, 7], k = 6',
        output: 'true',
        displayOutput: 'true',
        explanation: '[2, 4] is a continuous subarray of size 2 whose sum is 6 (6 is a multiple of 6).'
      },
      {
        input: '5\n23 2 6 4 7\n6',
        displayInput: 'nums = [23, 2, 6, 4, 7], k = 6',
        output: 'true',
        displayOutput: 'true',
        explanation: '[23, 2, 6, 4, 7] sums to 42, which is a multiple of 6.'
      },
      {
        input: '5\n23 2 6 4 7\n13',
        displayInput: 'nums = [23, 2, 6, 4, 7], k = 13',
        output: 'false',
        displayOutput: 'false',
        explanation: 'No subarray of size at least 2 sums to a multiple of 13.'
      }
    ],
    hints: [
      'If two prefix sums have the same remainder modulo k, the subarray between them has a sum divisible by k.',
      'Store remainder -> first_seen_index in a Hash Map, initialized with {0: -1}.',
      'Check if (current_index - first_seen_index) >= 2.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    k = int(t[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int k = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int k; cin >> k;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    const k = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['5\n23 2 4 6 7\n6', '5\n23 2 6 4 7\n6', '5\n23 2 6 4 7\n13'],
    hiddenInputs: ['2\n5 0\n5', '2\n0 0\n1', '3\n1 2 3\n5', '4\n1 0 1 0\n4'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      const k = parseInt(t[n + 1], 10);
      const map = new Map();
      map.set(0, -1);
      let rem = 0;
      for (let i = 0; i < n; i++) {
        rem = (rem + nums[i]) % k;
        if (map.has(rem)) {
          if (i - map.get(rem) >= 2) return 'true';
        } else {
          map.set(rem, i);
        }
      }
      return 'false';
    }
  }),

  // 15. Subarrays with K Different Integers (Medium)
  createCanonicalProblem({
    problemId: 'dsa_hashing_15',
    topicId: 'hashing',
    order: 15,
    title: 'Subarrays with K Different Integers',
    difficulty: 'Medium',
    tags: ['Hash Table', 'Sliding Window', 'Counting'],
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
        explanation: 'Subarrays formed with exactly 2 different integers: [1,2], [2,1], [1,2], [2,3], [1,2,1], [2,1,2], [1,2,1,2].'
      },
      {
        input: '5 3\n1 2 1 3 4',
        displayInput: 'nums = [1, 2, 1, 3, 4], k = 3',
        output: '3',
        displayOutput: '3',
        explanation: 'Subarrays formed with exactly 3 different integers: [1,2,1,3], [2,1,3], [1,3,4].'
      }
    ],
    hints: [
      'Calculating exactly(k) directly is tricky.',
      'Notice that exactly(k) = atMost(k) - atMost(k - 1).',
      'Use a sliding window with a frequency map to compute atMost(k) in O(N) time.'
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
      const atMost = (maxDistinct) => {
        if (maxDistinct <= 0) return 0;
        const count = new Map();
        let l = 0, res = 0;
        for (let r = 0; r < n; r++) {
          count.set(nums[r], (count.get(nums[r]) || 0) + 1);
          while (count.size > maxDistinct) {
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

  // 16. Find All Anagrams in a String (Medium)
  createCanonicalProblem({
    problemId: 'dsa_hashing_16',
    topicId: 'hashing',
    order: 16,
    title: 'Find All Anagrams in a String',
    difficulty: 'Medium',
    tags: ['Hash Table', 'String', 'Sliding Window'],
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
        explanation: 'Substring starting at index 0 is "cba" (anagram of "abc"). Substring starting at index 6 is "bac" (anagram of "abc").'
      },
      {
        input: 'abab\nab',
        displayInput: 's = "abab", p = "ab"',
        output: '0 1 2',
        displayOutput: '[0, 1, 2]',
        explanation: 'Substrings at 0 ("ab"), 1 ("ba"), 2 ("ab") are all anagrams of "ab".'
      }
    ],
    hints: [
      'Maintain a fixed sliding window of length p.length in s.',
      'Track letter frequencies using a 26-element array or hash map.',
      'Slide the window right: add the incoming character and remove the outgoing character, comparing frequency match.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    lines = sys.stdin.read().split()\n    if len(lines) < 2: return\n    s, p = lines[0], lines[1]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String s = sc.next(), p = sc.next();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s, p; if (!(cin >> s >> p)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const lines = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (lines.length < 2) return;\n    const [s, p] = lines;\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['cbaebabacd\nabc', 'abab\nab'],
    hiddenInputs: ['abcdef\nz', 'aaaaa\naa', 'baa\naa'],
    solveFunction: (stdin) => {
      const lines = stdin.trim().split(/\s+/);
      if (lines.length < 2) return '';
      const [s, p] = lines;
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

  // 17. Subarray with Given XOR (Hard)
  createCanonicalProblem({
    problemId: 'dsa_hashing_17',
    topicId: 'hashing',
    order: 17,
    title: 'Subarray with Given XOR',
    difficulty: 'Hard',
    tags: ['Hash Table', 'Bit Manipulation', 'Prefix XOR'],
    statement: `Given an array of integers \`A\` and an integer \`B\`, find the total number of continuous subarrays having **bitwise XOR** of all elements equal to \`B\`.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers for array A.
Third line: integer B.`,
    outputFormat: `Print the total count of subarrays with XOR equal to B.`,
    constraints: ['1 <= A.length <= 10^5', '0 <= A[i] <= 10^5', '0 <= B <= 10^5'],
    examples: [
      {
        input: '6\n4 2 2 6 4\n6',
        displayInput: 'A = [4, 2, 2, 6, 4], B = 6',
        output: '4',
        displayOutput: '4',
        explanation: 'Subarrays [4, 2], [4, 2, 2, 6, 4], [2, 2, 6], [6] all have XOR product equal to 6.'
      },
      {
        input: '4\n5 6 7 8\n5',
        displayInput: 'A = [5, 6, 7, 8], B = 5',
        output: '2',
        displayOutput: '2',
        explanation: 'Subarrays [5] and [5, 6, 7, 8] have XOR equal to 5 (5 ^ 6 ^ 7 ^ 8 = 4 != 5, only [5] and valid sub).'
      }
    ],
    hints: [
      'Maintain running prefix XOR: xr = xr ^ A[i].',
      'If xr ^ B = Y was seen previously in the prefix map, then the subarray between that prior index and i has XOR equal to B.',
      'Use a Hash Map with prefix XOR counts, initialized with {0: 1}.'
    ],
    starterCode: {
      python: `import sys\nfrom collections import defaultdict\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    a = [int(x) for x in t[1:n+1]]\n    b = int(t[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int b = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int b; cin >> b;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const a = t.slice(1, n + 1).map(Number);\n    const b = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['5\n4 2 2 6 4\n6', '4\n5 6 7 8\n5'],
    hiddenInputs: ['3\n1 2 3\n0', '4\n0 0 0 0\n0', '5\n10 10 10 10 10\n10'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const a = t.slice(1, n + 1).map(Number);
      const b = parseInt(t[n + 1], 10);
      const map = new Map();
      map.set(0, 1);
      let xr = 0, count = 0;
      for (const x of a) {
        xr ^= x;
        const target = xr ^ b;
        if (map.has(target)) count += map.get(target);
        map.set(xr, (map.get(xr) || 0) + 1);
      }
      return String(count);
    }
  }),

  // 18. Max Points on a Line (Hard)
  createCanonicalProblem({
    problemId: 'dsa_hashing_18',
    topicId: 'hashing',
    order: 18,
    title: 'Max Points on a Line',
    difficulty: 'Hard',
    tags: ['Hash Table', 'Math', 'Geometry'],
    statement: `Given an array of \`points\` where \`points[i] = [xi, yi]\` represents a point on the **X-Y** plane, return the maximum number of points that lie on the **same straight line**.`,
    inputFormat: `First line: integer N (number of points).
Next N lines: two space-separated integers xi and yi.`,
    outputFormat: `Print the maximum number of collinear points.`,
    constraints: ['1 <= points.length <= 300', '-10^4 <= xi, yi <= 10^4', 'All points are unique.'],
    examples: [
      {
        input: '3\n1 1\n2 2\n3 3',
        displayInput: 'points = [[1,1],[2,2],[3,3]]',
        output: '3',
        displayOutput: '3',
        explanation: 'All 3 points lie on the line y = x.'
      },
      {
        input: '6\n1 1\n3 2\n5 3\n4 1\n2 3\n1 4',
        displayInput: 'points = [[1,1],[3,2],[5,3],[4,1],[2,3],[1,4]]',
        output: '4',
        displayOutput: '4',
        explanation: 'The line through (4,1), (3,2), (2,3), (1,4) contains 4 points.'
      }
    ],
    hints: [
      'For every point i, compute the slope with every other point j.',
      'Represent slope as a reduced coprime fraction dy / dx using the greatest common divisor (GCD) to avoid floating point inaccuracies.',
      'Use a Hash Map to count points sharing the same slope relative to point i.'
    ],
    starterCode: {
      python: `import sys\nfrom collections import defaultdict\nimport math\n\ndef solve():\n    lines = sys.stdin.read().strip().splitlines()\n    if not lines: return\n    n = int(lines[0])\n    pts = [list(map(int, line.split())) for line in lines[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[][] pts = new int[n][2];\n        for (int i = 0; i < n; i++) { pts[i][0] = sc.nextInt(); pts[i][1] = sc.nextInt(); }\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<pair<int,int>> pts(n);\n    for (int i = 0; i < n; i++) cin >> pts[i].first >> pts[i].second;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const lines = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/).filter(Boolean);\n    if (!lines.length) return;\n    const n = parseInt(lines[0], 10);\n    const pts = lines.slice(1, n + 1).map(l => l.split(/\\s+/).map(Number));\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['3\n1 1\n2 2\n3 3', '6\n1 1\n3 2\n5 3\n4 1\n2 3\n1 4'],
    hiddenInputs: ['1\n0 0', '2\n0 0\n1 1', '4\n0 0\n1 0\n2 0\n3 0', '4\n0 0\n0 1\n0 2\n0 3'],
    solveFunction: (stdin) => {
      const lines = stdin.trim().split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const n = parseInt(lines[0], 10);
      if (n <= 2) return String(n);
      const pts = lines.slice(1, n + 1).map(l => l.split(/\s+/).map(Number));
      const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
      let maxPts = 0;
      for (let i = 0; i < n; i++) {
        const slopes = new Map();
        let curMax = 0;
        for (let j = i + 1; j < n; j++) {
          let dx = pts[j][0] - pts[i][0];
          let dy = pts[j][1] - pts[i][1];
          if (dx === 0) { dy = 1; }
          else if (dy === 0) { dx = 1; }
          else {
            if (dx < 0) { dx = -dx; dy = -dy; }
            const g = Math.abs(gcd(dx, dy));
            dx /= g; dy /= g;
          }
          const key = `${dy}/${dx}`;
          slopes.set(key, (slopes.get(key) || 0) + 1);
          curMax = Math.max(curMax, slopes.get(key));
        }
        maxPts = Math.max(maxPts, curMax + 1);
      }
      return String(maxPts);
    }
  }),

  // 19. Substring with Concatenation of All Words (Hard)
  createCanonicalProblem({
    problemId: 'dsa_hashing_19',
    topicId: 'hashing',
    order: 19,
    title: 'Substring with Concatenation of All Words',
    difficulty: 'Hard',
    tags: ['Hash Table', 'String', 'Sliding Window'],
    statement: `You are given a string \`s\` and an array of strings \`words\` of **the same length**. Return an array of all the **starting indices** of substring(s) in \`s\` that is a concatenation of each word in \`words\` exactly once, in any order, and without any intervening characters.

Output indices separated by spaces in ascending order.`,
    inputFormat: `First line: string s.
Second line: integer W (number of words).
Third line: W space-separated words.`,
    outputFormat: `Print the space-separated start indices in ascending order.`,
    constraints: ['1 <= s.length <= 10^4', '1 <= words.length <= 5000', '1 <= words[i].length <= 30', 's and words[i] consist of lowercase English letters.'],
    examples: [
      {
        input: 'barfoothefoobarman\n2\nfoo bar',
        displayInput: 's = "barfoothefoobarman", words = ["foo","bar"]',
        output: '0 9',
        displayOutput: '[0, 9]',
        explanation: 'Substrings starting at 0 ("barfoo") and 9 ("foobar") are concatenations of words.'
      },
      {
        input: 'wordgoodgoodgoodbestword\n4\nword good best word',
        displayInput: 's = "wordgoodgoodgoodbestword", words = ["word","good","best","word"]',
        output: '',
        displayOutput: '[]',
        explanation: 'No substring matches all 4 words with correct frequencies.'
      }
    ],
    hints: [
      'Since all words are length L, partition the search into L possible offset phases (offset = 0 to L-1).',
      'For each phase, maintain a sliding window of words.',
      'Use a Hash Map of target word frequencies and track the count of valid matched words.'
    ],
    starterCode: {
      python: `import sys\nfrom collections import Counter\n\ndef solve():\n    lines = sys.stdin.read().strip().splitlines()\n    if len(lines) < 3: return\n    s = lines[0].strip()\n    w = int(lines[1].strip())\n    words = lines[2].strip().split()\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String s = sc.next();\n        int w = sc.nextInt();\n        String[] words = new String[w];\n        for (int i = 0; i < w; i++) words[i] = sc.next();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\nint main() {\n    string s; int w; if (!(cin >> s >> w)) return 0;\n    vector<string> words(w); for (int i = 0; i < w; i++) cin >> words[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const lines = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/).filter(Boolean);\n    if (lines.length < 3) return;\n    const s = lines[0].trim();\n    const w = parseInt(lines[1].trim(), 10);\n    const words = lines[2].trim().split(/\\s+/);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['barfoothefoobarman\n2\nfoo bar', 'wordgoodgoodgoodbestword\n4\nword good best word'],
    hiddenInputs: ['barfoofoobarthefoobarman\n3\nbar foo the', 'lingmindraboofooowingdingbarrwingmonkeypoundcake\n5\nfooo bar wing ding wing'],
    solveFunction: (stdin) => {
      const lines = stdin.trim().split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      if (lines.length < 3) return '';
      const s = lines[0];
      const words = lines[2].split(/\s+/);
      const wordCount = words.length;
      if (!wordCount || !s.length) return '';
      const wordLen = words[0].length;
      const totalLen = wordCount * wordLen;
      if (s.length < totalLen) return '';
      const targetMap = {};
      for (const w of words) targetMap[w] = (targetMap[w] || 0) + 1;
      const res = [];
      for (let i = 0; i <= s.length - totalLen; i++) {
        const seen = {};
        let j = 0;
        while (j < wordCount) {
          const w = s.substring(i + j * wordLen, i + (j + 1) * wordLen);
          if (!targetMap[w]) break;
          seen[w] = (seen[w] || 0) + 1;
          if (seen[w] > targetMap[w]) break;
          j++;
        }
        if (j === wordCount) res.push(i);
      }
      return res.join(' ');
    }
  }),

  // 20. Minimum Window Subsequence (Hard)
  createCanonicalProblem({
    problemId: 'dsa_hashing_20',
    topicId: 'hashing',
    order: 20,
    title: 'Minimum Window Subsequence',
    difficulty: 'Hard',
    tags: ['Hash Table', 'Dynamic Programming', 'Sliding Window', 'String'],
    statement: `Given strings \`s1\` and \`s2\`, return the minimum contiguous substring \`W\` of \`s1\` so that \`s2\` is a **subsequence** of \`W\`.

If there is no such window in \`s1\` that covers all characters in \`s2\`, return the empty string \`""\`. If there are multiple such minimum-length windows, return the one with the smallest starting index.`,
    inputFormat: `First line: string s1.
Second line: string s2.`,
    outputFormat: `Print the minimum window substring W. If none exists, print empty string.`,
    constraints: ['1 <= s1.length <= 2 * 10^4', '1 <= s2.length <= 100', 's1 and s2 consist of lowercase English letters.'],
    examples: [
      {
        input: 'abcdebdde\nbde',
        displayInput: 's1 = "abcdebdde", s2 = "bde"',
        output: 'bcde',
        displayOutput: '"bcde"',
        explanation: '"bcde" is the answer and its length is 4. "bdde" is also a subsequence, but "bcde" occurs earlier.'
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
      'Advance through s1 searching forward for characters of s2 in order.',
      'Once the last character of s2 is matched at s1[i], traverse backward from i to find the optimal start index.',
      'Update the minimum window whenever a shorter valid range is discovered.'
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


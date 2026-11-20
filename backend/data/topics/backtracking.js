/**
 * Canonical DSA Placement Problems: BACKTRACKING (20 Questions)
 * 7 Easy, 9 Medium, 4 Hard
 */

import { createCanonicalProblem } from './topicProblemHelper.js';

export const BACKTRACKING_PROBLEMS = [
  // 1. Binary Watch (Easy)
  createCanonicalProblem({
    problemId: 'dsa_backtracking_01',
    topicId: 'backtracking',
    order: 1,
    title: 'Binary Watch',
    difficulty: 'Easy',
    tags: ['Backtracking', 'Bit Manipulation'],
    statement: `A binary watch has 4 LEDs on the top to represent the hours (0-11), and 6 LEDs on the bottom to represent the minutes (0-59). Each LED represents a zero or one, with the least significant bit on the right.

Given an integer \`turnedOn\` which represents the number of LEDs that are currently on, return all possible times the watch could represent. You may return the answer in any order.

Output times separated by spaces, formatted as \`H:MM\` with no leading zero for hour and 2 digits for minutes.`,
    inputFormat: `First line: integer turnedOn.`,
    outputFormat: `Print all possible times separated by spaces.`,
    constraints: ['0 <= turnedOn <= 10'],
    examples: [
      {
        input: '1',
        displayInput: 'turnedOn = 1',
        output: '0:01 0:02 0:04 0:08 0:16 0:32 1:00 2:00 4:00 8:00',
        displayOutput: '["0:01","0:02","0:04","0:08","0:16","0:32","1:00","2:00","4:00","8:00"]',
        explanation: 'All single LED configurations.'
      },
      {
        input: '9',
        displayInput: 'turnedOn = 9',
        output: '',
        displayOutput: '[]',
        explanation: 'No valid hour (0-11) and minute (0-59) has 9 set bits.'
      }
    ],
    hints: [
      'Hours range from 0 to 11 (bitCount(h)).',
      'Minutes range from 0 to 59 (bitCount(m)).',
      'If bitCount(h) + bitCount(m) == turnedOn, format as `h:${m < 10 ? "0" : ""}${m}`.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t.length) return;\n    const n = parseInt(t[0], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['1', '9'],
    hiddenInputs: ['0', '2'],
    solveFunction: (stdin) => {
      const num = parseInt(stdin.trim(), 10);
      const res = [];
      const countBits = (x) => {
        let cnt = 0;
        while (x > 0) { cnt += (x & 1); x >>= 1; }
        return cnt;
      };
      for (let h = 0; h < 12; h++) {
        for (let m = 0; m < 60; m++) {
          if (countBits(h) + countBits(m) === num) {
            res.push(`${h}:${m < 10 ? '0' : ''}${m}`);
          }
        }
      }
      return res.join(' ');
    }
  }),

  // 2. Letter Combinations of a Phone Number (2 Digits) (Easy)
  createCanonicalProblem({
    problemId: 'dsa_backtracking_02',
    topicId: 'backtracking',
    order: 2,
    title: 'Letter Combinations of a Phone Number (2 Digits)',
    difficulty: 'Easy',
    tags: ['Backtracking', 'String', 'Hash Table'],
    statement: `Given a string containing digits from \`2-9\` inclusive, return all possible letter combinations that the number could represent. Return the answer in any order.

Mapping: 2->abc, 3->def, 4->ghi, 5->jkl, 6->mno, 7->pqrs, 8->tuv, 9->wxyz.

Output combinations separated by spaces in lexicographical order.`,
    inputFormat: `First line: string of digits (e.g. 23).`,
    outputFormat: `Print all letter combinations separated by spaces.`,
    constraints: ['0 <= digits.length <= 4', 'digits[i] is a digit in the range [\'2\', \'9\'].'],
    examples: [
      {
        input: '23',
        displayInput: 'digits = "23"',
        output: 'ad ae af bd be bf cd ce cf',
        displayOutput: '["ad","ae","af","bd","be","bf","cd","ce","cf"]',
        explanation: 'All 3 * 3 = 9 combinations.'
      },
      {
        input: '2',
        displayInput: 'digits = "2"',
        output: 'a b c',
        displayOutput: '["a","b","c"]',
        explanation: '3 letters mapped to digit 2.'
      }
    ],
    hints: [
      'Use a recursive backtracking function backtrack(index, currentCombination).',
      'For the current digit, loop through all mapped letters and recurse on index + 1.',
      'Base condition: if index == digits.length, add current combination to results.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    s = sys.stdin.read().strip()\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.hasNext() ? sc.next() : "";\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s; if (!(cin >> s)) s = "";\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const s = fs.readFileSync(0, 'utf-8').trim();\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['23', '2'],
    hiddenInputs: ['', '7', '29'],
    solveFunction: (stdin) => {
      const digits = stdin.trim();
      if (!digits) return '';
      const map = {
        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
      };
      const res = [];
      const backtrack = (idx, path) => {
        if (idx === digits.length) { res.push(path); return; }
        const letters = map[digits[idx]] || '';
        for (const ch of letters) backtrack(idx + 1, path + ch);
      };
      backtrack(0, '');
      return res.join(' ');
    }
  }),

  // 3. Sum of All Subset XOR Totals (Easy)
  createCanonicalProblem({
    problemId: 'dsa_backtracking_03',
    topicId: 'backtracking',
    order: 3,
    title: 'Sum of All Subset XOR Totals',
    difficulty: 'Easy',
    tags: ['Backtracking', 'Bit Manipulation', 'Recursion'],
    statement: `The **XOR total** of an array is defined as the bitwise XOR of all its elements, or \`0\` if the array is empty.

Given an array \`nums\`, return the **sum of all XOR totals** for every subset of \`nums\`.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the sum of XOR totals of all subsets.`,
    constraints: ['1 <= nums.length <= 12', '1 <= nums[i] <= 20'],
    examples: [
      {
        input: '2\n1 3',
        displayInput: 'nums = [1, 3]',
        output: '6',
        displayOutput: '6',
        explanation: 'Subsets: []->0, [1]->1, [3]->3, [1,3]->1^3=2. Sum = 0 + 1 + 3 + 2 = 6.'
      },
      {
        input: '3\n5 1 6',
        displayInput: 'nums = [5, 1, 6]',
        output: '28',
        displayOutput: '28',
        explanation: 'Sum of all 8 subset XORs is 28.'
      }
    ],
    hints: [
      'At each index, you can either include nums[i] into running XOR (curXOR ^ nums[i]) or exclude it.',
      'Sum the results from both choices recursively.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['2\n1 3', '3\n5 1 6'],
    hiddenInputs: ['1\n7', '4\n3 4 5 6'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      const getSum = (idx, currentXOR) => {
        if (idx === n) return currentXOR;
        return getSum(idx + 1, currentXOR ^ nums[idx]) + getSum(idx + 1, currentXOR);
      };
      return String(getSum(0, 0));
    }
  }),

  // 4. All Paths From Source to Target (DAG) (Easy)
  createCanonicalProblem({
    problemId: 'dsa_backtracking_04',
    topicId: 'backtracking',
    order: 4,
    title: 'All Paths From Source to Target (DAG)',
    difficulty: 'Easy',
    tags: ['Backtracking', 'Graph', 'DFS'],
    statement: `Given a directed acyclic graph (DAG) of \`n\` nodes labeled from \`0\` to \`n - 1\`, find all possible paths from node \`0\` to node \`n - 1\` and return them in any order.

Print each path space-separated on a new line.`,
    inputFormat: `First line: integer N (number of nodes).
Next N lines: first integer is edge count k, followed by k space-separated adjacent node IDs.`,
    outputFormat: `Print each path from 0 to N-1 on a new line.`,
    constraints: ['n == graph.length', '2 <= n <= 15', 'The graph is a DAG.'],
    examples: [
      {
        input: '4\n2 1 2\n1 3\n1 3\n0',
        displayInput: 'graph = [[1,2],[3],[3],[]]',
        output: '0 1 3\n0 2 3',
        displayOutput: '[[0,1,3],[0,2,3]]',
        explanation: 'Two paths from 0 to 3.'
      }
    ],
    hints: [
      'Start backtracking DFS from node 0 with path = [0].',
      'When current node is n - 1, save a copy of the path.',
      'For each neighbor, append neighbor to path, recurse, then pop neighbor.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    lines = sys.stdin.read().strip().splitlines()\n    if not lines: return\n    n = int(lines[0])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const lines = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/).filter(Boolean);\n    if (!lines.length) return;\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['4\n2 1 2\n1 3\n1 3\n0'],
    hiddenInputs: ['2\n1 1\n0', '3\n2 1 2\n1 2\n0'],
    solveFunction: (stdin) => {
      const lines = stdin.trim().split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const n = parseInt(lines[0], 10);
      const adj = [];
      for (let i = 1; i <= n; i++) {
        const parts = lines[i].split(/\s+/).map(Number);
        const k = parts[0];
        adj.push(parts.slice(1, 1 + k));
      }
      const paths = [];
      const dfs = (u, path) => {
        if (u === n - 1) { paths.push(path.join(' ')); return; }
        for (const v of adj[u]) {
          path.push(v);
          dfs(v, path);
          path.pop();
        }
      };
      dfs(0, [0]);
      return paths.join('\n');
    }
  }),

  // 5. Generate All Binary Strings of Length N (Easy)
  createCanonicalProblem({
    problemId: 'dsa_backtracking_05',
    topicId: 'backtracking',
    order: 5,
    title: 'Generate All Binary Strings of Length N',
    difficulty: 'Easy',
    tags: ['Backtracking', 'String'],
    statement: `Given an integer \`N\`, generate all binary strings of length \`N\` without consecutive 1's.

Output each valid binary string on a new line in lexicographical order.`,
    inputFormat: `First line: integer N.`,
    outputFormat: `Print each binary string on a new line.`,
    constraints: ['1 <= N <= 10'],
    examples: [
      {
        input: '3',
        displayInput: 'N = 3',
        output: '000\n001\n010\n100\n101',
        displayOutput: '["000","001","010","100","101"]',
        explanation: 'All binary strings of length 3 with no consecutive 1s.'
      },
      {
        input: '1',
        displayInput: 'N = 1',
        output: '0\n1',
        displayOutput: '["0","1"]',
        explanation: 'Binary strings of length 1.'
      }
    ],
    hints: [
      'At each position, you can always place \'0\'.',
      'You can only place \'1\' if the previous character was not \'1\'.',
      'Backtrack until length reaches N.'
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
      const backtrack = (cur) => {
        if (cur.length === n) { res.push(cur); return; }
        backtrack(cur + '0');
        if (!cur.endsWith('1')) backtrack(cur + '1');
      };
      backtrack('');
      return res.join('\n');
    }
  }),

  // 6. Permutations of Unique Characters (Easy)
  createCanonicalProblem({
    problemId: 'dsa_backtracking_06',
    topicId: 'backtracking',
    order: 6,
    title: 'Permutations of Unique Characters',
    difficulty: 'Easy',
    tags: ['Backtracking', 'String'],
    statement: `Given a string \`S\` containing distinct lowercase English letters, generate all permutations of the string in lexicographically sorted order.

Print each permutation on a new line.`,
    inputFormat: `First line: string S of unique characters.`,
    outputFormat: `Print each permutation on a new line.`,
    constraints: ['1 <= S.length <= 6'],
    examples: [
      {
        input: 'ABC',
        displayInput: 'S = "ABC"',
        output: 'ABC\nACB\nBAC\nBCA\nCAB\nCBA',
        displayOutput: '["ABC","ACB","BAC","BCA","CAB","CBA"]',
        explanation: 'All 3! = 6 permutations.'
      }
    ],
    hints: [
      'Sort characters of S first.',
      'Use a boolean visited array to construct permutations recursively.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    s = sys.stdin.read().strip()\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.hasNext() ? sc.next() : "";\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s; if (!(cin >> s)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const s = fs.readFileSync(0, 'utf-8').trim();\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['ABC'],
    hiddenInputs: ['A', 'AB', 'ABCD'],
    solveFunction: (stdin) => {
      const chars = stdin.trim().split('').sort();
      const n = chars.length;
      const res = [];
      const used = new Array(n).fill(false);
      const backtrack = (path) => {
        if (path.length === n) { res.push(path.join('')); return; }
        for (let i = 0; i < n; i++) {
          if (used[i]) continue;
          used[i] = true;
          path.push(chars[i]);
          backtrack(path);
          path.pop();
          used[i] = false;
        }
      };
      backtrack([]);
      return res.join('\n');
    }
  }),

  // 7. Subsets (Power Set via Backtracking) (Easy)
  createCanonicalProblem({
    problemId: 'dsa_backtracking_07',
    topicId: 'backtracking',
    order: 7,
    title: 'Subsets (Power Set via Backtracking)',
    difficulty: 'Easy',
    tags: ['Backtracking', 'Array'],
    statement: `Given an integer array \`nums\` of unique elements, return all possible subsets.

Print each subset space-separated on a new line, sorted lexicographically.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print each subset on a new line.`,
    constraints: ['1 <= nums.length <= 10'],
    examples: [
      {
        input: '3\n1 2 3',
        displayInput: 'nums = [1, 2, 3]',
        output: '\n1\n1 2\n1 2 3\n1 3\n2\n2 3\n3',
        displayOutput: '[[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]',
        explanation: 'All 8 subsets.'
      }
    ],
    hints: [
      'Loop i from start to N - 1: include nums[i], recurse on i + 1, backtrack.'
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

  // 8. Combination Sum (Medium)
  createCanonicalProblem({
    problemId: 'dsa_backtracking_08',
    topicId: 'backtracking',
    order: 8,
    title: 'Combination Sum',
    difficulty: 'Medium',
    tags: ['Backtracking', 'Array'],
    statement: `Given an array of distinct integers \`candidates\` and a target integer \`target\`, return a list of all unique combinations where numbers sum to \`target\`. The same number may be chosen unlimited times.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer target.`,
    outputFormat: `Print each combination space-separated on a new line.`,
    constraints: ['1 <= candidates.length <= 30', '1 <= target <= 40'],
    examples: [
      {
        input: '4\n2 3 6 7\n7',
        displayInput: 'candidates = [2,3,6,7], target = 7',
        output: '2 2 3\n7',
        displayOutput: '[[2,2,3],[7]]',
        explanation: 'Combinations summing to 7.'
      }
    ],
    hints: ['Sort candidates, recurse allowing same index choice until target == 0.'],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    cands = [int(x) for x in t[1:n+1]]\n    target = int(t[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int target = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int target; cin >> target;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const cands = t.slice(1, n + 1).map(Number);\n    const target = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['4\n2 3 6 7\n7'],
    hiddenInputs: ['3\n2 3 5\n8'],
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

  // 9. Combination Sum II (No Duplicates Allowed) (Medium)
  createCanonicalProblem({
    problemId: 'dsa_backtracking_09',
    topicId: 'backtracking',
    order: 9,
    title: 'Combination Sum II (No Duplicates Allowed)',
    difficulty: 'Medium',
    tags: ['Backtracking', 'Array'],
    statement: `Given a collection of candidate numbers (\`candidates\`) and a target number (\`target\`), find all unique combinations in \`candidates\` where the candidate numbers sum to \`target\`.

Each number in \`candidates\` may only be used **once** in the combination.

Note: The solution set must not contain duplicate combinations.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer target.`,
    outputFormat: `Print each unique combination space-separated on a new line.`,
    constraints: ['1 <= candidates.length <= 100', '1 <= candidates[i] <= 50', '1 <= target <= 30'],
    examples: [
      {
        input: '7\n10 1 2 7 6 1 5\n8',
        displayInput: 'candidates = [10,1,2,7,6,1,5], target = 8',
        output: '1 1 6\n1 2 5\n1 7\n2 6',
        displayOutput: '[[1,1,6],[1,2,5],[1,7],[2,6]]',
        explanation: 'Unique combinations summing to 8.'
      },
      {
        input: '5\n2 5 2 1 2\n5',
        displayInput: 'candidates = [2,5,2,1,2], target = 5',
        output: '1 2 2\n5',
        displayOutput: '[[1,2,2],[5]]',
        explanation: 'Combinations summing to 5.'
      }
    ],
    hints: [
      'Sort candidates first.',
      'Skip duplicates at the same recursion depth: if i > idx and candidates[i] == candidates[i - 1] continue.',
      'Recurse on i + 1 since each element can only be used once.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    cands = [int(x) for x in t[1:n+1]]\n    target = int(t[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int target = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int target; cin >> target;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const cands = t.slice(1, n + 1).map(Number);\n    const target = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['7\n10 1 2 7 6 1 5\n8', '5\n2 5 2 1 2\n5'],
    hiddenInputs: ['4\n1 1 1 1\n2', '3\n1 2 3\n5'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const cands = t.slice(1, n + 1).map(Number).sort((a, b) => a - b);
      const target = parseInt(t[n + 1], 10);
      const res = [];
      const backtrack = (idx, rem, path) => {
        if (rem === 0) { res.push(path.join(' ')); return; }
        for (let i = idx; i < n; i++) {
          if (i > idx && cands[i] === cands[i - 1]) continue;
          if (cands[i] > rem) break;
          path.push(cands[i]);
          backtrack(i + 1, rem - cands[i], path);
          path.pop();
        }
      };
      backtrack(0, target, []);
      return res.join('\n');
    }
  }),

  // 10. Permutations II (With Duplicates) (Medium)
  createCanonicalProblem({
    problemId: 'dsa_backtracking_10',
    topicId: 'backtracking',
    order: 10,
    title: 'Permutations II (With Duplicates)',
    difficulty: 'Medium',
    tags: ['Backtracking', 'Array'],
    statement: `Given a collection of numbers, \`nums\`, that might contain duplicates, return all possible **unique permutations** in any order.

Print each unique permutation space-separated on a new line in lexicographical order.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print each unique permutation on a new line.`,
    constraints: ['1 <= nums.length <= 8', '-10 <= nums[i] <= 10'],
    examples: [
      {
        input: '3\n1 1 2',
        displayInput: 'nums = [1, 1, 2]',
        output: '1 1 2\n1 2 1\n2 1 1',
        displayOutput: '[[1,1,2],[1,2,1],[2,1,1]]',
        explanation: 'Three unique permutations.'
      },
      {
        input: '3\n1 2 3',
        displayInput: 'nums = [1, 2, 3]',
        output: '1 2 3\n1 3 2\n2 1 3\n2 3 1\n3 1 2\n3 2 1',
        displayOutput: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]',
        explanation: '6 unique permutations.'
      }
    ],
    hints: [
      'Sort nums.',
      'Maintain boolean used array.',
      'Skip duplicate element if nums[i] == nums[i - 1] and !used[i - 1].'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['3\n1 1 2', '3\n1 2 3'],
    hiddenInputs: ['1\n5', '4\n2 2 1 1'],
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
          if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) continue;
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

  // 11. Subsets II (Unique Subsets from Duplicates) (Medium)
  createCanonicalProblem({
    problemId: 'dsa_backtracking_11',
    topicId: 'backtracking',
    order: 11,
    title: 'Subsets II (Unique Subsets from Duplicates)',
    difficulty: 'Medium',
    tags: ['Backtracking', 'Array'],
    statement: `Given an integer array \`nums\` that may contain duplicates, return all possible **subsets** (the power set).

The solution set must not contain duplicate subsets. Print each subset on a new line.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print each unique subset on a new line.`,
    constraints: ['1 <= nums.length <= 10', '-10 <= nums[i] <= 10'],
    examples: [
      {
        input: '3\n1 2 2',
        displayInput: 'nums = [1, 2, 2]',
        output: '\n1\n1 2\n1 2 2\n2\n2 2',
        displayOutput: '[[],[1],[1,2],[1,2,2],[2],[2,2]]',
        explanation: 'All unique subsets.'
      }
    ],
    hints: [
      'Sort nums first.',
      'If i > idx and nums[i] == nums[i - 1], skip candidate.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['3\n1 2 2'],
    hiddenInputs: ['1\n0', '4\n4 4 4 1'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number).sort((a, b) => a - b);
      const res = [];
      const backtrack = (idx, path) => {
        res.push(path.join(' '));
        for (let i = idx; i < n; i++) {
          if (i > idx && nums[i] === nums[i - 1]) continue;
          path.push(nums[i]);
          backtrack(i + 1, path);
          path.pop();
        }
      };
      backtrack(0, []);
      return res.join('\n');
    }
  }),

  // 12. Palindrome Partitioning (Medium)
  createCanonicalProblem({
    problemId: 'dsa_backtracking_12',
    topicId: 'backtracking',
    order: 12,
    title: 'Palindrome Partitioning',
    difficulty: 'Medium',
    tags: ['Backtracking', 'String', 'Dynamic Programming'],
    statement: `Given a string \`s\`, partition \`s\` such that every substring of the partition is a **palindrome**. Return all possible palindrome partitioning of \`s\`.

Print each partition on a new line with words separated by spaces.`,
    inputFormat: `First line: string s.`,
    outputFormat: `Print each valid partition on a new line.`,
    constraints: ['1 <= s.length <= 16', 's contains only lowercase English letters.'],
    examples: [
      {
        input: 'aab',
        displayInput: 's = "aab"',
        output: 'a a b\naa b',
        displayOutput: '[["a","a","b"],["aa","b"]]',
        explanation: 'Two valid palindrome partitionings.'
      },
      {
        input: 'a',
        displayInput: 's = "a"',
        output: 'a',
        displayOutput: '[["a"]]',
        explanation: 'Single character.'
      }
    ],
    hints: [
      'Iterate through possible partition cut points i from start to length.',
      'Check if substring s[start..i] is a palindrome.',
      'If so, recurse on i + 1.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    s = sys.stdin.read().strip()\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.hasNext() ? sc.next() : "";\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s; if (!(cin >> s)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const s = fs.readFileSync(0, 'utf-8').trim();\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['aab', 'a'],
    hiddenInputs: ['racecar', 'aba', 'bb'],
    solveFunction: (stdin) => {
      const s = stdin.trim();
      const res = [];
      const isPal = (str, i, j) => {
        while (i < j) {
          if (str[i] !== str[j]) return false;
          i++; j--;
        }
        return true;
      };
      const backtrack = (start, path) => {
        if (start === s.length) { res.push(path.join(' ')); return; }
        for (let i = start; i < s.length; i++) {
          if (isPal(s, start, i)) {
            path.push(s.substring(start, i + 1));
            backtrack(i + 1, path);
            path.pop();
          }
        }
      };
      backtrack(0, []);
      return res.join('\n');
    }
  }),

  // 13. Word Search (Medium)
  createCanonicalProblem({
    problemId: 'dsa_backtracking_13',
    topicId: 'backtracking',
    order: 13,
    title: 'Word Search',
    difficulty: 'Medium',
    tags: ['Backtracking', 'Matrix'],
    statement: `Given an \`m x n\` grid of characters \`board\` and a string \`word\`, return \`true\` if \`word\` exists in the grid, else \`false\`.`,
    inputFormat: `First line: integers M and N.
Next M lines: N space-separated characters.
Last line: string word.`,
    outputFormat: `Print 'true' if word exists, else 'false'.`,
    constraints: ['1 <= m, n <= 6', '1 <= word.length <= 15'],
    examples: [
      {
        input: '3 4\nA B C E\nS F C S\nA D E E\nABCCED',
        displayInput: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"',
        output: 'true',
        displayOutput: 'true',
        explanation: 'Path exists.'
      }
    ],
    hints: ['DFS 4-directionally, marking visited cell with \'#\'.'],
    starterCode: {
      python: `import sys\n\ndef solve():\n    lines = sys.stdin.read().strip().splitlines()\n    if not lines: return\n    m, n = map(int, lines[0].split())\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int m = sc.nextInt(), n = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    int m, n; if (!(cin >> m >> n)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const lines = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/).filter(Boolean);\n    if (!lines.length) return;\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['3 4\nA B C E\nS F C S\nA D E E\nABCCED'],
    hiddenInputs: ['1 1\nA\nA', '2 2\nA B\nC D\nACDB'],
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
      for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) if (dfs(i, j, 0)) return 'true';
      return 'false';
    }
  }),

  // 14. Restore IP Addresses (Medium)
  createCanonicalProblem({
    problemId: 'dsa_backtracking_14',
    topicId: 'backtracking',
    order: 14,
    title: 'Restore IP Addresses',
    difficulty: 'Medium',
    tags: ['Backtracking', 'String'],
    statement: `A **valid IP address** consists of exactly four integers separated by single dots. Each integer is between \`0\` and \`255\` (inclusive) and cannot have leading zeros.

Given a string \`s\` containing only digits, return all possible valid IP addresses that can be formed by inserting dots into \`s\`.

Output each valid IP address on a new line.`,
    inputFormat: `First line: string s of digits.`,
    outputFormat: `Print each valid IP address on a new line.`,
    constraints: ['1 <= s.length <= 20', 's consists of digits only.'],
    examples: [
      {
        input: '25525511135',
        displayInput: 's = "25525511135"',
        output: '255.255.11.135\n255.255.111.35',
        displayOutput: '["255.255.11.135","255.255.111.35"]',
        explanation: 'Two valid IP addresses.'
      },
      {
        input: '0000',
        displayInput: 's = "0000"',
        output: '0.0.0.0',
        displayOutput: '["0.0.0.0"]',
        explanation: 'Only one valid IP address.'
      },
      {
        input: '101023',
        displayInput: 's = "101023"',
        output: '1.0.10.23\n1.0.102.3\n10.1.0.23\n10.10.2.3\n101.0.2.3',
        displayOutput: '["1.0.10.23","1.0.102.3","10.1.0.23","10.10.2.3","101.0.2.3"]',
        explanation: '5 valid IP addresses.'
      }
    ],
    hints: [
      'Partition the string into 4 segments.',
      'Each segment must have length 1 to 3, value between 0 and 255, and no leading zero (unless value is "0").',
      'Backtrack until 4 segments are placed and full string is consumed.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    s = sys.stdin.read().strip()\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.hasNext() ? sc.next() : "";\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s; if (!(cin >> s)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const s = fs.readFileSync(0, 'utf-8').trim();\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['25525511135', '0000', '101023'],
    hiddenInputs: ['1111', '010010'],
    solveFunction: (stdin) => {
      const s = stdin.trim();
      const res = [];
      const backtrack = (idx, dots, path) => {
        if (dots === 4 && idx === s.length) { res.push(path.join('.')); return; }
        if (dots === 4 || idx === s.length) return;
        for (let len = 1; len <= 3 && idx + len <= s.length; len++) {
          const seg = s.substring(idx, idx + len);
          if (seg.length > 1 && seg[0] === '0') break;
          if (parseInt(seg, 10) > 255) break;
          path.push(seg);
          backtrack(idx + len, dots + 1, path);
          path.pop();
        }
      };
      backtrack(0, 0, []);
      return res.join('\n');
    }
  }),

  // 15. Beautiful Arrangement (Medium)
  createCanonicalProblem({
    problemId: 'dsa_backtracking_15',
    topicId: 'backtracking',
    order: 15,
    title: 'Beautiful Arrangement',
    difficulty: 'Medium',
    tags: ['Backtracking', 'Bit Manipulation'],
    statement: `Suppose you have \`n\` integers labeled \`1\` through \`n\`. A permutation of those \`n\` integers \`perm\` (1-indexed) is considered a **beautiful arrangement** if for every \`i\` (\`1 <= i <= n\`):
- \`perm[i]\` is divisible by \`i\`, or
- \`i\` is divisible by \`perm[i]\`.

Given an integer \`n\`, return the number of beautiful arrangements that you can construct.`,
    inputFormat: `First line: integer n.`,
    outputFormat: `Print the total count of beautiful arrangements.`,
    constraints: ['1 <= n <= 15'],
    examples: [
      {
        input: '2',
        displayInput: 'n = 2',
        output: '2',
        displayOutput: '2',
        explanation: 'Valid permutations: [1, 2] and [2, 1].'
      },
      {
        input: '1',
        displayInput: 'n = 1',
        output: '1',
        displayOutput: '1',
        explanation: 'Only [1].'
      }
    ],
    hints: [
      'Fill positions from n down to 1 (filling larger positions first prunes the search space much faster).',
      'For position pos, iterate through unused numbers num in 1..n.',
      'Only recurse if (num % pos == 0 || pos % num == 0).'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t.length) return;\n    const n = parseInt(t[0], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['2', '1'],
    hiddenInputs: ['3', '4', '5'],
    solveFunction: (stdin) => {
      const n = parseInt(stdin.trim(), 10);
      let count = 0;
      const visited = new Array(n + 1).fill(false);
      const backtrack = (pos) => {
        if (pos > n) { count++; return; }
        for (let i = 1; i <= n; i++) {
          if (!visited[i] && (i % pos === 0 || pos % i === 0)) {
            visited[i] = true;
            backtrack(pos + 1);
            visited[i] = false;
          }
        }
      };
      backtrack(1);
      return String(count);
    }
  }),

  // 16. Non-decreasing Subsequences (Medium)
  createCanonicalProblem({
    problemId: 'dsa_backtracking_16',
    topicId: 'backtracking',
    order: 16,
    title: 'Non-decreasing Subsequences',
    difficulty: 'Medium',
    tags: ['Backtracking', 'Hash Table', 'Array'],
    statement: `Given an integer array \`nums\`, return all the different possible non-decreasing subsequences of the given array with at least two elements. You may return the answer in any order.

Print each subsequence on a new line with elements separated by spaces.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print each non-decreasing subsequence on a new line.`,
    constraints: ['1 <= nums.length <= 15', '-100 <= nums[i] <= 100'],
    examples: [
      {
        input: '4\n4 6 7 7',
        displayInput: 'nums = [4, 6, 7, 7]',
        output: '4 6\n4 6 7\n4 6 7 7\n4 7\n4 7 7\n6 7\n6 7 7\n7 7',
        displayOutput: '[[4,6],[4,6,7],[4,6,7,7],[4,7],[4,7,7],[6,7],[6,7,7],[7,7]]',
        explanation: 'All non-decreasing subsequences of length >= 2.'
      }
    ],
    hints: [
      'At each recursion depth, use a Hash Set to avoid picking duplicate elements at the same position.',
      'Only append nums[i] if path is empty or nums[i] >= path[path.length - 1].',
      'If path length >= 2, record it as a valid subsequence.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['4\n4 6 7 7'],
    hiddenInputs: ['4\n4 4 3 2 1', '3\n1 2 3'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      const res = [];
      const backtrack = (idx, path) => {
        if (path.length >= 2) res.push(path.join(' '));
        const used = new Set();
        for (let i = idx; i < n; i++) {
          if (used.has(nums[i])) continue;
          if (path.length === 0 || nums[i] >= path[path.length - 1]) {
            used.add(nums[i]);
            path.push(nums[i]);
            backtrack(i + 1, path);
            path.pop();
          }
        }
      };
      backtrack(0, []);
      return res.join('\n');
    }
  }),

  // 17. N-Queens (Hard)
  createCanonicalProblem({
    problemId: 'dsa_backtracking_17',
    topicId: 'backtracking',
    order: 17,
    title: 'N-Queens',
    difficulty: 'Hard',
    tags: ['Backtracking'],
    statement: `The **n-queens** puzzle is the problem of placing \`n\` queens on an \`n x n\` chessboard such that no two queens attack each other.

Given an integer \`n\`, return the number of distinct solutions to the n-queens puzzle.`,
    inputFormat: `First line: integer n.`,
    outputFormat: `Print the total number of distinct solutions.`,
    constraints: ['1 <= n <= 9'],
    examples: [
      {
        input: '4',
        displayInput: 'n = 4',
        output: '2',
        displayOutput: '2',
        explanation: 'There are 2 distinct board configurations for 4-queens.'
      },
      {
        input: '1',
        displayInput: 'n = 1',
        output: '1',
        displayOutput: '1',
        explanation: 'Only 1 configuration.'
      }
    ],
    hints: [
      'Place one queen per row.',
      'Maintain three boolean sets: columns, diag1 (row - col), diag2 (row + col).',
      'When row == n, increment solution count.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t.length) return;\n    const n = parseInt(t[0], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['4', '1'],
    hiddenInputs: ['2', '3', '5', '8'],
    solveFunction: (stdin) => {
      const n = parseInt(stdin.trim(), 10);
      let count = 0;
      const cols = new Set(), d1 = new Set(), d2 = new Set();
      const backtrack = (r) => {
        if (r === n) { count++; return; }
        for (let c = 0; c < n; c++) {
          if (!cols.has(c) && !d1.has(r - c) && !d2.has(r + c)) {
            cols.add(c); d1.add(r - c); d2.add(r + c);
            backtrack(r + 1);
            cols.delete(c); d1.delete(r - c); d2.delete(r + c);
          }
        }
      };
      backtrack(0);
      return String(count);
    }
  }),

  // 18. Sudoku Solver (Hard)
  createCanonicalProblem({
    problemId: 'dsa_backtracking_18',
    topicId: 'backtracking',
    order: 18,
    title: 'Sudoku Solver',
    difficulty: 'Hard',
    tags: ['Backtracking', 'Matrix'],
    statement: `Write a program to solve a Sudoku puzzle by filling the empty cells (marked with \`0\`).

A sudoku solution must satisfy:
1. Each of the digits \`1-9\` must occur exactly once in each row.
2. Each of the digits \`1-9\` must occur exactly once in each column.
3. Each of the digits \`1-9\` must occur exactly once in each of the 9 \`3x3\` sub-boxes.

Output the solved 9x9 board with cells separated by spaces.`,
    inputFormat: `9 lines: 9 space-separated integers (0 for empty cell, 1-9 for filled).`,
    outputFormat: `Print the solved 9x9 board.`,
    constraints: ['Input is guaranteed to have a unique valid solution.'],
    examples: [
      {
        input: '5 3 0 0 7 0 0 0 0\n6 0 0 1 9 5 0 0 0\n0 9 8 0 0 0 0 6 0\n8 0 0 0 6 0 0 0 3\n4 0 0 8 0 3 0 0 1\n7 0 0 0 2 0 0 0 6\n0 6 0 0 0 0 2 8 0\n0 0 0 4 1 9 0 0 5\n0 0 0 0 8 0 0 7 9',
        displayInput: 'Standard 9x9 Sudoku grid',
        output: '5 3 4 6 7 8 9 1 2\n6 7 2 1 9 5 3 4 8\n1 9 8 3 4 2 5 6 7\n8 5 9 7 6 1 4 2 3\n4 2 6 8 5 3 7 9 1\n7 1 3 9 2 4 8 5 6\n9 6 1 5 3 7 2 8 4\n2 8 7 4 1 9 6 3 5\n3 4 5 2 8 6 1 7 9',
        displayOutput: 'Solved 9x9 Sudoku board',
        explanation: 'All rows, columns, and 3x3 boxes contain 1-9 without duplicates.'
      }
    ],
    hints: [
      'Find the next cell containing 0.',
      'Try placing digits 1 through 9: check row, column, and 3x3 box validity.',
      'If valid, recurse; if no digit leads to solution, backtrack.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    lines = sys.stdin.read().strip().splitlines()\n    board = [list(map(int, line.split())) for line in lines[:9]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int[][] b = new int[9][9];\n        for (int i = 0; i < 9; i++) for (int j = 0; j < 9; j++) b[i][j] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    vector<vector<int>> b(9, vector<int>(9));\n    for (int i = 0; i < 9; i++) for (int j = 0; j < 9; j++) cin >> b[i][j];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const lines = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/).filter(Boolean);\n    const board = lines.slice(0, 9).map(l => l.split(/\\s+/).map(Number));\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['5 3 0 0 7 0 0 0 0\n6 0 0 1 9 5 0 0 0\n0 9 8 0 0 0 0 6 0\n8 0 0 0 6 0 0 0 3\n4 0 0 8 0 3 0 0 1\n7 0 0 0 2 0 0 0 6\n0 6 0 0 0 0 2 8 0\n0 0 0 4 1 9 0 0 5\n0 0 0 0 8 0 0 7 9'],
    hiddenInputs: ['0 0 9 7 4 8 0 0 0\n7 0 0 0 0 0 0 0 0\n0 2 0 1 0 9 0 0 0\n0 0 7 0 0 0 2 4 0\n0 6 4 0 1 0 5 9 0\n0 9 8 0 0 0 3 0 0\n0 0 0 8 0 3 0 2 0\n0 0 0 0 0 0 0 0 6\n0 0 0 2 7 5 9 0 0'],
    solveFunction: (stdin) => {
      const lines = stdin.trim().split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const b = lines.slice(0, 9).map(l => l.split(/\s+/).map(Number));
      const isValid = (r, c, val) => {
        for (let i = 0; i < 9; i++) {
          if (b[r][i] === val || b[i][c] === val) return false;
          const br = 3 * Math.floor(r / 3) + Math.floor(i / 3);
          const bc = 3 * Math.floor(c / 3) + (i % 3);
          if (b[br][bc] === val) return false;
        }
        return true;
      };
      const solveSudoku = () => {
        for (let r = 0; r < 9; r++) {
          for (let c = 0; c < 9; c++) {
            if (b[r][c] === 0) {
              for (let val = 1; val <= 9; val++) {
                if (isValid(r, c, val)) {
                  b[r][c] = val;
                  if (solveSudoku()) return true;
                  b[r][c] = 0;
                }
              }
              return false;
            }
          }
        }
        return true;
      };
      solveSudoku();
      return b.map(row => row.join(' ')).join('\n');
    }
  }),

  // 19. Word Search II (Hard)
  createCanonicalProblem({
    problemId: 'dsa_backtracking_19',
    topicId: 'backtracking',
    order: 19,
    title: 'Word Search II',
    difficulty: 'Hard',
    tags: ['Backtracking', 'Trie', 'Matrix'],
    statement: `Given an \`m x n\` \`board\` of characters and a list of strings \`words\`, return all words on the board.

Each word must be constructed from letters of sequentially adjacent cells (horizontally or vertically neighboring). The same letter cell may not be used more than once in a word.

Output the found words in sorted order separated by spaces.`,
    inputFormat: `First line: integers M and N.
Next M lines: N space-separated characters.
Next line: integer W (number of words).
Last line: W space-separated words.`,
    outputFormat: `Print the matching words in sorted order separated by spaces.`,
    constraints: ['1 <= m, n <= 12', '1 <= words.length <= 100', '1 <= words[i].length <= 10'],
    examples: [
      {
        input: '4 4\no a a n\ne t a e\ni h k r\ni f l v\n4\noath pea eat rain',
        displayInput: 'board = 4x4, words = ["oath","pea","eat","rain"]',
        output: 'eat oath',
        displayOutput: '["eat", "oath"]',
        explanation: 'Both "eat" and "oath" can be constructed on the board.'
      }
    ],
    hints: [
      'Build a Trie from the words dictionary.',
      'Perform DFS from each cell on the board, walking down the matching Trie node.',
      'Prune dead-end branches immediately.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    lines = sys.stdin.read().strip().splitlines()\n    if not lines: return\n    m, n = map(int, lines[0].split())\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int m = sc.nextInt(), n = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int m, n; if (!(cin >> m >> n)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const lines = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/).filter(Boolean);\n    if (!lines.length) return;\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['4 4\no a a n\ne t a e\ni h k r\ni f l v\n4\noath pea eat rain'],
    hiddenInputs: ['2 2\na b\nc d\n1\nabcd', '2 2\na b\nc d\n1\nabdc'],
    solveFunction: (stdin) => {
      const lines = stdin.trim().split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const [m, n] = lines[0].split(/\s+/).map(Number);
      const board = lines.slice(1, m + 1).map(l => l.split(/\s+/));
      const w = parseInt(lines[m + 1], 10);
      const words = lines[m + 2].split(/\s+/);
      const found = new Set();
      const checkWord = (word) => {
        const dfs = (r, c, k) => {
          if (k === word.length) return true;
          if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== word[k]) return false;
          const tmp = board[r][c];
          board[r][c] = '#';
          const ok = dfs(r + 1, c, k + 1) || dfs(r - 1, c, k + 1) || dfs(r, c + 1, k + 1) || dfs(r, c - 1, k + 1);
          board[r][c] = tmp;
          return ok;
        };
        for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) if (dfs(i, j, 0)) return true;
        return false;
      };
      for (const word of words) {
        if (checkWord(word)) found.add(word);
      }
      return Array.from(found).sort().join(' ');
    }
  }),

  // 20. Word Break II (Hard)
  createCanonicalProblem({
    problemId: 'dsa_backtracking_20',
    topicId: 'backtracking',
    order: 20,
    title: 'Word Break II',
    difficulty: 'Hard',
    tags: ['Backtracking', 'Dynamic Programming', 'Trie'],
    statement: `Given a string \`s\` and a dictionary of strings \`wordDict\`, add spaces in \`s\` to construct a sentence where each word is a valid dictionary word. Return all such possible sentences in any order.

Print each valid sentence on a new line.`,
    inputFormat: `First line: string s.
Second line: integer W (number of words).
Third line: W space-separated words.`,
    outputFormat: `Print each valid sentence on a new line.`,
    constraints: ['1 <= s.length <= 20', '1 <= wordDict.length <= 1000', '1 <= wordDict[i].length <= 10'],
    examples: [
      {
        input: 'catsanddog\n5\ncat cats and sand dog',
        displayInput: 's = "catsanddog", wordDict = ["cat","cats","and","sand","dog"]',
        output: 'cat sand dog\ncats and dog',
        displayOutput: '["cat sand dog","cats and dog"]',
        explanation: 'Two valid sentences.'
      },
      {
        input: 'pineapplepenapple\n5\napple pen applepen pine pineapple',
        displayInput: 's = "pineapplepenapple", wordDict = ["apple","pen","applepen","pine","pineapple"]',
        output: 'pine apple pen apple\npine applepen apple\npineapple pen apple',
        displayOutput: '["pine apple pen apple","pine applepen apple","pineapple pen apple"]',
        explanation: 'Three valid sentence segmentations.'
      }
    ],
    hints: [
      'Use backtracking with memoization: memo[substring] stores all valid sentences formed from substring.',
      'Check if any prefix of s matches a word in wordDict.',
      'Recursively solve for the remainder suffix.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    lines = sys.stdin.read().strip().splitlines()\n    if not lines: return\n    s = lines[0].strip()\n    w = int(lines[1])\n    words = lines[2].split()\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String s = sc.next();\n        int w = sc.nextInt();\n        List<String> words = new ArrayList<>();\n        for (int i = 0; i < w; i++) words.add(sc.next());\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\nint main() {\n    string s; int w; if (!(cin >> s >> w)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const lines = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/).filter(Boolean);\n    if (lines.length < 3) return;\n    const s = lines[0].trim();\n    const w = parseInt(lines[1], 10);\n    const words = lines[2].trim().split(/\\s+/);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['catsanddog\n5\ncat cats and sand dog', 'pineapplepenapple\n5\napple pen applepen pine pineapple'],
    hiddenInputs: ['catsandog\n5\ncats dog sand and cat'],
    solveFunction: (stdin) => {
      const lines = stdin.trim().split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      if (lines.length < 3) return '';
      const s = lines[0];
      const words = new Set(lines[2].split(/\s+/));
      const memo = new Map();
      const dfs = (str) => {
        if (memo.has(str)) return memo.get(str);
        if (!str.length) return [''];
        const res = [];
        for (const w of words) {
          if (str.startsWith(w)) {
            const sub = dfs(str.substring(w.length));
            for (const s of sub) {
              res.push(s ? `${w} ${s}` : w);
            }
          }
        }
        memo.set(str, res);
        return res;
      };
      const out = dfs(s);
      return out.join('\n');
    }
  })
];


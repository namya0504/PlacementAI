/**
 * Canonical DSA Placement Problems: TWO POINTERS (20 Questions)
 * 7 Easy, 9 Medium, 4 Hard
 */

import { createCanonicalProblem } from './topicProblemHelper.js';

export const TWO_POINTERS_PROBLEMS = [
  // 1. Two Sum II - Input Array Is Sorted (Easy)
  createCanonicalProblem({
    problemId: 'dsa_two-pointers_01',
    topicId: 'two-pointers',
    order: 1,
    title: 'Two Sum II - Input Array Is Sorted',
    difficulty: 'Easy',
    tags: ['Two Pointers', 'Array', 'Binary Search'],
    statement: `Given a **1-indexed** array of integers \`numbers\` that is already **sorted in non-decreasing order**, find two numbers such that they add up to a specific \`target\` number.

Return the indices of the two numbers, \`index1\` and \`index2\`, added by one as an integer array \`[index1, index2]\` of length 2 separated by a space.

You may not use the same element twice. Your solution must use only **O(1) auxiliary space**.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers sorted in non-decreasing order.
Third line: integer target.`,
    outputFormat: `Print the two 1-based indices separated by a space in ascending order.`,
    constraints: ['2 <= numbers.length <= 3 * 10^4', '-1000 <= numbers[i] <= 1000', 'numbers is sorted in non-decreasing order.', '-1000 <= target <= 1000', 'Exactly one solution exists.'],
    examples: [
      {
        input: '4\n2 7 11 15\n9',
        displayInput: 'numbers = [2, 7, 11, 15], target = 9',
        output: '1 2',
        displayOutput: '[1, 2]',
        explanation: 'The sum of 2 and 7 is 9. index1 = 1, index2 = 2. We return [1, 2].'
      },
      {
        input: '3\n2 3 4\n6',
        displayInput: 'numbers = [2, 3, 4], target = 6',
        output: '1 3',
        displayOutput: '[1, 3]',
        explanation: 'The sum of 2 and 4 is 6. index1 = 1, index2 = 3. We return [1, 3].'
      },
      {
        input: '2\n-1 0\n-1',
        displayInput: 'numbers = [-1, 0], target = -1',
        output: '1 2',
        displayOutput: '[1, 2]',
        explanation: 'The sum of -1 and 0 is -1. index1 = 1, index2 = 2. We return [1, 2].'
      }
    ],
    hints: [
      'Initialize one pointer at the start (index 0) and one pointer at the end (index N - 1).',
      'Compute sum = numbers[left] + numbers[right]. If sum == target, you found the answer!',
      'If sum < target, increment left to increase the sum. If sum > target, decrement right to decrease the sum.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    target = int(t[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int target = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int target; cin >> target;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    const target = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['4\n2 7 11 15\n9', '3\n2 3 4\n6', '2\n-1 0\n-1'],
    hiddenInputs: ['5\n1 2 3 4 5\n9', '4\n-10 -5 0 20\n-15', '4\n1 2 5 9\n7'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      const target = parseInt(t[n + 1], 10);
      let l = 0, r = n - 1;
      while (l < r) {
        const sum = nums[l] + nums[r];
        if (sum === target) return `${l + 1} ${r + 1}`;
        if (sum < target) l++;
        else r--;
      }
      return '1 2';
    }
  }),

  // 2. Valid Palindrome II (Easy)
  createCanonicalProblem({
    problemId: 'dsa_two-pointers_02',
    topicId: 'two-pointers',
    order: 2,
    title: 'Valid Palindrome II',
    difficulty: 'Easy',
    tags: ['Two Pointers', 'String', 'Greedy'],
    statement: `Given a string \`s\`, return \`true\` if the \`s\` can be palindrome after deleting **at most one** character from it.`,
    inputFormat: `First line: string s.`,
    outputFormat: `Print 'true' if s can be made palindrome with at most 1 deletion, else 'false'.`,
    constraints: ['1 <= s.length <= 10^5', 's consists of lowercase English letters.'],
    examples: [
      {
        input: 'aba',
        displayInput: 's = "aba"',
        output: 'true',
        displayOutput: 'true',
        explanation: 'String is already a palindrome.'
      },
      {
        input: 'abca',
        displayInput: 's = "abca"',
        output: 'true',
        displayOutput: 'true',
        explanation: 'You could delete the character \'c\' to get "aba".'
      },
      {
        input: 'abc',
        displayInput: 's = "abc"',
        output: 'false',
        displayOutput: 'false',
        explanation: 'Deleting any single character will not make it a palindrome.'
      }
    ],
    hints: [
      'Use two pointers starting at both ends, converging inwards.',
      'When s[l] != s[r], you have two choices: delete s[l] (check if substring s[l+1..r] is palindrome) or delete s[r] (check s[l..r-1]).',
      'If either branch is a palindrome, return true; otherwise return false.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    s = sys.stdin.read().strip()\n    if not s: return\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String s = sc.next();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s; if (!(cin >> s)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const s = fs.readFileSync(0, 'utf-8').trim();\n    if (!s) return;\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['aba', 'abca', 'abc'],
    hiddenInputs: ['deeee', 'aguokepatgbnvfqmgmlcupuufxoohdfpgjdmysgvhmvffcnqxjjxqncffvmhvgsymdjgpfdhooxfuupuculmgmqfvnbgtapekouga', 'raceecar', 'abccba'],
    solveFunction: (stdin) => {
      const s = stdin.trim();
      const isPal = (str, i, j) => {
        while (i < j) {
          if (str[i] !== str[j]) return false;
          i++; j--;
        }
        return true;
      };
      let l = 0, r = s.length - 1;
      while (l < r) {
        if (s[l] !== s[r]) {
          return (isPal(s, l + 1, r) || isPal(s, l, r - 1)) ? 'true' : 'false';
        }
        l++; r--;
      }
      return 'true';
    }
  }),

  // 3. Reverse Vowels of a String (Easy)
  createCanonicalProblem({
    problemId: 'dsa_two-pointers_03',
    topicId: 'two-pointers',
    order: 3,
    title: 'Reverse Vowels of a String',
    difficulty: 'Easy',
    tags: ['Two Pointers', 'String'],
    statement: `Given a string \`s\`, reverse only all the vowels in the string and return it.

The vowels are \`'a'\`, \`'e'\`, \`'i'\`, \`'o'\`, and \`'u'\`, and they can appear in both lower and upper cases, more than once.`,
    inputFormat: `First line: string s.`,
    outputFormat: `Print the string with reversed vowels.`,
    constraints: ['1 <= s.length <= 3 * 10^5', 's consist of printable ASCII characters.'],
    examples: [
      {
        input: 'IceCreAm',
        displayInput: 's = "IceCreAm"',
        output: 'AceCreIm',
        displayOutput: '"AceCreIm"',
        explanation: 'Vowels: [\'I\', \'e\', \'e\', \'A\'] reversed become [\'A\', \'e\', \'e\', \'I\'].'
      },
      {
        input: 'leetcode',
        displayInput: 's = "leetcode"',
        output: 'leotcede',
        displayOutput: '"leotcede"',
        explanation: 'Vowels: [\'e\', \'e\', \'o\', \'e\'] reversed become [\'e\', \'o\', \'e\', \'e\'].'
      }
    ],
    hints: [
      'Initialize left pointer at 0 and right pointer at length - 1.',
      'Advance left until it points to a vowel; decrement right until it points to a vowel.',
      'Swap the characters at left and right, then move both pointers inward.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    s = sys.stdin.read().strip()\n    if not s: return\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLine()) return;\n        String s = sc.nextLine();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s; if (!getline(cin, s)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const s = fs.readFileSync(0, 'utf-8').trim();\n    if (!s) return;\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['IceCreAm', 'leetcode'],
    hiddenInputs: ['aA', 'hello', 'xyz', 'aeiou'],
    solveFunction: (stdin) => {
      const s = stdin.trim().split('');
      const vowels = new Set(['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U']);
      let l = 0, r = s.length - 1;
      while (l < r) {
        while (l < r && !vowels.has(s[l])) l++;
        while (l < r && !vowels.has(s[r])) r--;
        if (l < r) {
          const tmp = s[l];
          s[l] = s[r];
          s[r] = tmp;
          l++; r--;
        }
      }
      return s.join('');
    }
  }),

  // 4. Merge Sorted Array (In-Place from Back) (Easy)
  createCanonicalProblem({
    problemId: 'dsa_two-pointers_04',
    topicId: 'two-pointers',
    order: 4,
    title: 'Merge Sorted Array (In-Place from Back)',
    difficulty: 'Easy',
    tags: ['Two Pointers', 'Array', 'Sorting'],
    statement: `You are given two integer arrays \`nums1\` and \`nums2\`, sorted in **non-decreasing order**, and two integers \`m\` and \`n\`, representing the number of elements in \`nums1\` and \`nums2\` respectively.

Merge \`nums1\` and \`nums2\` into a single array sorted in non-decreasing order.

Output the merged array elements separated by spaces.`,
    inputFormat: `First line: integers M and N.
Second line: M space-separated integers for nums1.
Third line: N space-separated integers for nums2.`,
    outputFormat: `Print the M + N merged sorted elements separated by spaces.`,
    constraints: ['nums1.length == m + n', '0 <= m, n <= 200', '1 <= m + n <= 200', '-10^9 <= nums1[i], nums2[j] <= 10^9'],
    examples: [
      {
        input: '3 3\n1 2 3\n2 5 6',
        displayInput: 'nums1 = [1,2,3], m = 3, nums2 = [2,5,6], n = 3',
        output: '1 2 2 3 5 6',
        displayOutput: '[1, 2, 2, 3, 5, 6]',
        explanation: 'Merged array is [1, 2, 2, 3, 5, 6].'
      },
      {
        input: '1 0\n1\n',
        displayInput: 'nums1 = [1], m = 1, nums2 = [], n = 0',
        output: '1',
        displayOutput: '[1]',
        explanation: 'Array is [1].'
      }
    ],
    hints: [
      'Instead of starting from index 0 which causes element shifting, start from the back at index (m + n - 1).',
      'Compare nums1[m - 1] and nums2[n - 1], place the larger one at the back.',
      'Decrement the corresponding pointer and repeat until all elements are placed.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    m, n = int(t[0]), int(t[1])\n    nums1 = [int(x) for x in t[2:2+m]]\n    nums2 = [int(x) for x in t[2+m:2+m+n]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int m = sc.nextInt(), n = sc.nextInt();\n        int[] a = new int[m], b = new int[n];\n        for (int i = 0; i < m; i++) a[i] = sc.nextInt();\n        for (int i = 0; i < n; i++) b[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int m, n; if (!(cin >> m >> n)) return 0;\n    vector<int> a(m), b(n);\n    for (int i = 0; i < m; i++) cin >> a[i];\n    for (int i = 0; i < n; i++) cin >> b[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const m = parseInt(t[0], 10), n = parseInt(t[1], 10);\n    const a = t.slice(2, 2 + m).map(Number);\n    const b = t.slice(2 + m, 2 + m + n).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['3 3\n1 2 3\n2 5 6', '1 0\n1\n'],
    hiddenInputs: ['0 1\n\n1', '2 2\n4 5\n1 2', '3 3\n2 4 6\n1 3 5'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const m = parseInt(t[0], 10), n = parseInt(t[1], 10);
      const a = t.slice(2, 2 + m).map(Number);
      const b = t.slice(2 + m, 2 + m + n).map(Number);
      const res = [...a, ...b].sort((x, y) => x - y);
      return res.join(' ');
    }
  }),

  // 5. Remove Duplicates from Sorted Array (Easy)
  createCanonicalProblem({
    problemId: 'dsa_two-pointers_05',
    topicId: 'two-pointers',
    order: 5,
    title: 'Remove Duplicates from Sorted Array',
    difficulty: 'Easy',
    tags: ['Two Pointers', 'Array'],
    statement: `Given an integer array \`nums\` sorted in **non-decreasing order**, remove the duplicates **in-place** such that each unique element appears only **once**. The relative order of the elements should be kept the same.

Return the number of unique elements \`k\`, followed on the next line by the first \`k\` unique elements.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers sorted in non-decreasing order.`,
    outputFormat: `First line: integer k (number of unique elements).
Second line: k space-separated unique elements.`,
    constraints: ['1 <= nums.length <= 3 * 10^4', '-100 <= nums[i] <= 100', 'nums is sorted in non-decreasing order.'],
    examples: [
      {
        input: '3\n1 1 2',
        displayInput: 'nums = [1, 1, 2]',
        output: '2\n1 2',
        displayOutput: 'k = 2, nums = [1, 2]',
        explanation: 'The first 2 elements are [1, 2].'
      },
      {
        input: '10\n0 0 1 1 1 2 2 3 3 4',
        displayInput: 'nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]',
        output: '5\n0 1 2 3 4',
        displayOutput: 'k = 5, nums = [0, 1, 2, 3, 4]',
        explanation: 'There are 5 unique elements: [0, 1, 2, 3, 4].'
      }
    ],
    hints: [
      'Maintain a slow pointer (writer) tracking the end of the unique prefix.',
      'Iterate a fast pointer from index 1 to N - 1.',
      'Whenever nums[fast] != nums[slow], increment slow and set nums[slow] = nums[fast].'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['3\n1 1 2', '10\n0 0 1 1 1 2 2 3 3 4'],
    hiddenInputs: ['1\n7', '5\n1 1 1 1 1', '4\n1 2 3 4', '6\n-3 -3 -1 0 0 2'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      if (n === 0) return '0\n';
      const uniq = [nums[0]];
      for (let i = 1; i < n; i++) {
        if (nums[i] !== nums[i - 1]) uniq.push(nums[i]);
      }
      return `${uniq.length}\n${uniq.join(' ')}`;
    }
  }),

  // 6. Move Zeroes (Easy)
  createCanonicalProblem({
    problemId: 'dsa_two-pointers_06',
    topicId: 'two-pointers',
    order: 6,
    title: 'Move Zeroes',
    difficulty: 'Easy',
    tags: ['Two Pointers', 'Array'],
    statement: `Given an integer array \`nums\`, move all \`0\`'s to the end of it while maintaining the relative order of the non-zero elements.

Note that you must do this **in-place** without making a copy of the array.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the modified array with zeroes moved to the end separated by spaces.`,
    constraints: ['1 <= nums.length <= 10^4', '-2^31 <= nums[i] <= 2^31 - 1'],
    examples: [
      {
        input: '5\n0 1 0 3 12',
        displayInput: 'nums = [0, 1, 0, 3, 12]',
        output: '1 3 12 0 0',
        displayOutput: '[1, 3, 12, 0, 0]',
        explanation: 'Non-zero elements 1, 3, 12 maintain relative order; zeroes pushed to back.'
      },
      {
        input: '1\n0',
        displayInput: 'nums = [0]',
        output: '0',
        displayOutput: '[0]',
        explanation: 'Single element 0 remains unchanged.'
      }
    ],
    hints: [
      'Maintain a slow pointer (insertPos) for the position of the next non-zero element.',
      'Iterate through the array with a fast pointer.',
      'Whenever nums[i] != 0, swap nums[insertPos] with nums[i] and increment insertPos.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['5\n0 1 0 3 12', '1\n0'],
    hiddenInputs: ['4\n0 0 0 1', '4\n1 2 3 4', '5\n0 0 0 0 0', '6\n2 0 4 0 6 0'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      const nonZeros = nums.filter(x => x !== 0);
      while (nonZeros.length < n) nonZeros.push(0);
      return nonZeros.join(' ');
    }
  }),

  // 7. Backspace String Compare (Easy)
  createCanonicalProblem({
    problemId: 'dsa_two-pointers_07',
    topicId: 'two-pointers',
    order: 7,
    title: 'Backspace String Compare',
    difficulty: 'Easy',
    tags: ['Two Pointers', 'String', 'Stack'],
    statement: `Given two strings \`s\` and \`t\`, return \`true\` if they are equal when both are typed into empty text editors. \`'#'\` means a backspace character.

Note that after backspacing an empty text, the text will continue to be empty.

You must solve it in **O(N)** time and **O(1)** auxiliary space.`,
    inputFormat: `First line: string s.
Second line: string t.`,
    outputFormat: `Print 'true' if strings evaluate equally, else 'false'.`,
    constraints: ['1 <= s.length, t.length <= 200', 's and t only contain lowercase letters and \'#\' characters.'],
    examples: [
      {
        input: 'ab#c\nad#c',
        displayInput: 's = "ab#c", t = "ad#c"',
        output: 'true',
        displayOutput: 'true',
        explanation: 'Both s and t become "ac".'
      },
      {
        input: 'ab##\nc#d#',
        displayInput: 's = "ab##", t = "c#d#"',
        output: 'true',
        displayOutput: 'true',
        explanation: 'Both s and t become "".'
      },
      {
        input: 'a#c\nb',
        displayInput: 's = "a#c", t = "b"',
        output: 'false',
        displayOutput: 'false',
        explanation: 's becomes "c" while t becomes "b".'
      }
    ],
    hints: [
      'Iterate backwards from the end of both strings.',
      'Maintain a skip counter for \'#\' to know how many valid characters to bypass.',
      'Compare the next valid character from both strings. If they differ, return false.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if len(tokens) < 2: return\n    s, t = tokens[0], tokens[1]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String s = sc.next(), t = sc.next();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s, t; if (!(cin >> s >> t)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (tokens.length < 2) return;\n    const [s, t] = tokens;\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['ab#c\nad#c', 'ab##\nc#d#', 'a#c\nb'],
    hiddenInputs: ['bxj##tw\nbxj###tw', 'a##b\nb', '######\n#', 'y#fo##f\ny#f#o##f'],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      if (tokens.length < 2) return 'false';
      const [s, t] = tokens;
      const build = (str) => {
        const stk = [];
        for (const c of str) {
          if (c === '#') stk.pop();
          else stk.push(c);
        }
        return stk.join('');
      };
      return build(s) === build(t) ? 'true' : 'false';
    }
  }),

  // 8. 3Sum (Medium)
  createCanonicalProblem({
    problemId: 'dsa_two-pointers_08',
    topicId: 'two-pointers',
    order: 8,
    title: '3Sum',
    difficulty: 'Medium',
    tags: ['Two Pointers', 'Array', 'Sorting'],
    statement: `Given an integer array \`nums\`, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

Notice that the solution set must not contain duplicate triplets.

Output each triplet in sorted order on a new line.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print each unique triplet space-separated on a new line sorted in lexicographical order.`,
    constraints: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
    examples: [
      {
        input: '6\n-1 0 1 2 -1 -4',
        displayInput: 'nums = [-1, 0, 1, 2, -1, -4]',
        output: '-1 -1 2\n-1 0 1',
        displayOutput: '[[-1, -1, 2], [-1, 0, 1]]',
        explanation: 'nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0. nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0. nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0.'
      },
      {
        input: '3\n0 1 1',
        displayInput: 'nums = [0, 1, 1]',
        output: '',
        displayOutput: '[]',
        explanation: 'The only possible triplet does not sum up to 0.'
      },
      {
        input: '3\n0 0 0',
        displayInput: 'nums = [0, 0, 0]',
        output: '0 0 0',
        displayOutput: '[[0, 0, 0]]',
        explanation: 'The only possible triplet sums up to 0.'
      }
    ],
    hints: [
      'Sort the array first in non-decreasing order.',
      'Iterate with an outer loop variable i from 0 to N - 3. If nums[i] == nums[i - 1], skip to avoid duplicates.',
      'For each i, use two pointers (left = i + 1, right = N - 1) to find pairs that sum to -nums[i].'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['6\n-1 0 1 2 -1 -4', '3\n0 1 1', '3\n0 0 0'],
    hiddenInputs: ['4\n-2 0 1 1', '5\n-1 0 1 2 -1', '6\n-5 2 3 -2 0 2'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number).sort((a, b) => a - b);
      const res = [];
      for (let i = 0; i < n - 2; i++) {
        if (nums[i] > 0) break;
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        let l = i + 1, r = n - 1;
        while (l < r) {
          const sum = nums[i] + nums[l] + nums[r];
          if (sum === 0) {
            res.push(`${nums[i]} ${nums[l]} ${nums[r]}`);
            while (l < r && nums[l] === nums[l + 1]) l++;
            while (l < r && nums[r] === nums[r - 1]) r--;
            l++; r--;
          } else if (sum < 0) {
            l++;
          } else {
            r--;
          }
        }
      }
      return res.join('\n');
    }
  }),

  // 9. Container With Most Water (Medium)
  createCanonicalProblem({
    problemId: 'dsa_two-pointers_09',
    topicId: 'two-pointers',
    order: 9,
    title: 'Container With Most Water',
    difficulty: 'Medium',
    tags: ['Two Pointers', 'Array', 'Greedy'],
    statement: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i\`th line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers representing heights.`,
    outputFormat: `Print the maximum water area.`,
    constraints: ['2 <= n <= 10^5', '0 <= height[i] <= 10^4'],
    examples: [
      {
        input: '9\n1 8 6 2 5 4 8 3 7',
        displayInput: 'height = [1, 8, 6, 2, 5, 4, 8, 3, 7]',
        output: '49',
        displayOutput: '49',
        explanation: 'Max water between index 1 (height 8) and index 8 (height 7): area = min(8, 7) * (8 - 1) = 7 * 7 = 49.'
      },
      {
        input: '2\n1 1',
        displayInput: 'height = [1, 1]',
        output: '1',
        displayOutput: '1',
        explanation: 'Max water area is 1 * 1 = 1.'
      }
    ],
    hints: [
      'Start with the widest container: left pointer at 0, right pointer at N - 1.',
      'The area is limited by min(height[left], height[right]) * (right - left).',
      'Always move the pointer pointing to the shorter vertical bar inward, because keeping it could never yield a larger area with a smaller width.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    height = [int(x) for x in t[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] h = new int[n];\n        for (int i = 0; i < n; i++) h[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> h(n); for (int i = 0; i < n; i++) cin >> h[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const h = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['9\n1 8 6 2 5 4 8 3 7', '2\n1 1'],
    hiddenInputs: ['4\n4 3 2 1 4', '5\n1 2 4 3', '6\n1 1 1 1 1 1'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const h = t.slice(1, n + 1).map(Number);
      let l = 0, r = n - 1, maxArea = 0;
      while (l < r) {
        const area = Math.min(h[l], h[r]) * (r - l);
        if (area > maxArea) maxArea = area;
        if (h[l] < h[r]) l++;
        else r--;
      }
      return String(maxArea);
    }
  }),

  // 10. 3Sum Closest (Medium)
  createCanonicalProblem({
    problemId: 'dsa_two-pointers_10',
    topicId: 'two-pointers',
    order: 10,
    title: '3Sum Closest',
    difficulty: 'Medium',
    tags: ['Two Pointers', 'Array', 'Sorting'],
    statement: `Given an integer array \`nums\` of length \`n\` and an integer \`target\`, find three integers in \`nums\` such that the sum is closest to \`target\`.

Return the sum of the three integers.

You may assume that each input would have exactly one solution.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer target.`,
    outputFormat: `Print the sum of the three integers closest to target.`,
    constraints: ['3 <= nums.length <= 500', '-1000 <= nums[i] <= 1000', '-10^4 <= target <= 10^4'],
    examples: [
      {
        input: '4\n-1 2 1 -4\n1',
        displayInput: 'nums = [-1, 2, 1, -4], target = 1',
        output: '2',
        displayOutput: '2',
        explanation: 'The sum that is closest to the target is 2. (-1 + 2 + 1 = 2).'
      },
      {
        input: '3\n0 0 0\n1',
        displayInput: 'nums = [0, 0, 0], target = 1',
        output: '0',
        displayOutput: '0',
        explanation: 'The sum that is closest to the target is 0. (0 + 0 + 0 = 0).'
      }
    ],
    hints: [
      'Sort the array first.',
      'Iterate through the array fixing the first element, then use two pointers for the remaining two.',
      'Keep track of the closest sum seen so far; update when |current_sum - target| < |closest_sum - target|.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    target = int(t[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int target = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int target; cin >> target;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    const target = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['4\n-1 2 1 -4\n1', '3\n0 0 0\n1'],
    hiddenInputs: ['5\n1 1 1 1 1\n10', '4\n-3 -2 -5 3\n-4', '4\n1 2 4 8\n6'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number).sort((a, b) => a - b);
      const target = parseInt(t[n + 1], 10);
      let closest = nums[0] + nums[1] + nums[2];
      for (let i = 0; i < n - 2; i++) {
        let l = i + 1, r = n - 1;
        while (l < r) {
          const sum = nums[i] + nums[l] + nums[r];
          if (Math.abs(sum - target) < Math.abs(closest - target)) closest = sum;
          if (sum === target) return String(target);
          if (sum < target) l++;
          else r--;
        }
      }
      return String(closest);
    }
  }),

  // 11. Sort Colors (Dutch National Flag) (Medium)
  createCanonicalProblem({
    problemId: 'dsa_two-pointers_11',
    topicId: 'two-pointers',
    order: 11,
    title: 'Sort Colors (Dutch National Flag)',
    difficulty: 'Medium',
    tags: ['Two Pointers', 'Array', 'Sorting'],
    statement: `Given an array \`nums\` with \`n\` objects colored red, white, or blue, sort them **in-place** so that objects of the same color are adjacent, with the colors in the order red, white, and blue.

We will use the integers \`0\`, \`1\`, and \`2\` to represent the color red, white, and blue, respectively.

You must solve this problem without using the library's sort function in a single pass using **O(1)** extra memory.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers (each is 0, 1, or 2).`,
    outputFormat: `Print the sorted array separated by spaces.`,
    constraints: ['1 <= nums.length <= 300', 'nums[i] is either 0, 1, or 2.'],
    examples: [
      {
        input: '6\n2 0 2 1 1 0',
        displayInput: 'nums = [2, 0, 2, 1, 1, 0]',
        output: '0 0 1 1 2 2',
        displayOutput: '[0, 0, 1, 1, 2, 2]',
        explanation: 'All 0s first, then 1s, then 2s.'
      },
      {
        input: '3\n2 0 1',
        displayInput: 'nums = [2, 0, 1]',
        output: '0 1 2',
        displayOutput: '[0, 1, 2]',
        explanation: 'Sorted 0, 1, 2.'
      }
    ],
    hints: [
      'Maintain three pointers: low = 0 (boundary for 0s), mid = 0 (current element), high = N - 1 (boundary for 2s).',
      'If nums[mid] == 0: swap(nums[low], nums[mid]), low++, mid++.',
      'If nums[mid] == 1: mid++. If nums[mid] == 2: swap(nums[mid], nums[high]), high-- (do not advance mid yet!).'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['6\n2 0 2 1 1 0', '3\n2 0 1'],
    hiddenInputs: ['1\n0', '1\n2', '4\n0 0 0 0', '5\n2 2 2 1 0'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      let low = 0, mid = 0, high = n - 1;
      while (mid <= high) {
        if (nums[mid] === 0) {
          const tmp = nums[low]; nums[low] = nums[mid]; nums[mid] = tmp;
          low++; mid++;
        } else if (nums[mid] === 1) {
          mid++;
        } else {
          const tmp = nums[high]; nums[high] = nums[mid]; nums[mid] = tmp;
          high--;
        }
      }
      return nums.join(' ');
    }
  }),

  // 12. Boats to Save People (Medium)
  createCanonicalProblem({
    problemId: 'dsa_two-pointers_12',
    topicId: 'two-pointers',
    order: 12,
    title: 'Boats to Save People',
    difficulty: 'Medium',
    tags: ['Two Pointers', 'Greedy', 'Sorting'],
    statement: `You are given an array \`people\` where \`people[i]\` is the weight of the \`i\`th person, and an integer \`limit\` representing the maximum weight a boat can carry.

Each boat can carry at most **two people** at the same time, provided the sum of the weights of those people is at most \`limit\`.

Return the minimum number of boats to carry every given person.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers representing weights.
Third line: integer limit.`,
    outputFormat: `Print the minimum number of boats needed.`,
    constraints: ['1 <= people.length <= 5 * 10^4', '1 <= people[i] <= limit <= 3 * 10^4'],
    examples: [
      {
        input: '2\n1 2\n3',
        displayInput: 'people = [1, 2], limit = 3',
        output: '1',
        displayOutput: '1',
        explanation: '1 boat (1, 2).'
      },
      {
        input: '4\n3 2 2 1\n3',
        displayInput: 'people = [3, 2, 2, 1], limit = 3',
        output: '3',
        displayOutput: '3',
        explanation: '3 boats: (1, 2), (2), and (3).'
      },
      {
        input: '4\n3 5 3 4\n5',
        displayInput: 'people = [3, 5, 3, 4], limit = 5',
        output: '4',
        displayOutput: '4',
        explanation: '4 boats: (3), (3), (4), (5).'
      }
    ],
    hints: [
      'Sort people by weight in ascending order.',
      'Greedily attempt to pair the heaviest person (right) with the lightest person (left).',
      'If people[left] + people[right] <= limit, they share a boat (increment left). Regardless, the heaviest person gets a boat (decrement right).'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    people = [int(x) for x in t[1:n+1]]\n    limit = int(t[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] p = new int[n];\n        for (int i = 0; i < n; i++) p[i] = sc.nextInt();\n        int limit = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> p(n); for (int i = 0; i < n; i++) cin >> p[i];\n    int limit; cin >> limit;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const people = t.slice(1, n + 1).map(Number);\n    const limit = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['2\n1 2\n3', '4\n3 2 2 1\n3', '4\n3 5 3 4\n5'],
    hiddenInputs: ['1\n5\n5', '5\n2 4 3 1 5\n5', '4\n2 2 2 2\n3'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const p = t.slice(1, n + 1).map(Number).sort((a, b) => a - b);
      const limit = parseInt(t[n + 1], 10);
      let l = 0, r = n - 1, boats = 0;
      while (l <= r) {
        if (p[l] + p[r] <= limit) l++;
        r--;
        boats++;
      }
      return String(boats);
    }
  }),

  // 13. Partition Array According to Given Pivot (Medium)
  createCanonicalProblem({
    problemId: 'dsa_two-pointers_13',
    topicId: 'two-pointers',
    order: 13,
    title: 'Partition Array According to Given Pivot',
    difficulty: 'Medium',
    tags: ['Two Pointers', 'Array', 'Simulation'],
    statement: `You are given a **0-indexed** integer array \`nums\` and an integer \`pivot\`. Rearrange \`nums\` such that the following conditions are satisfied:
- Every element less than \`pivot\` appears **before** every element greater than \`pivot\`.
- Every element equal to \`pivot\` appears in between elements less than and greater than \`pivot\`.
- The **relative order** of elements less than \`pivot\` and greater than \`pivot\` is maintained.

Output the rearranged array separated by spaces.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer pivot.`,
    outputFormat: `Print the partitioned array separated by spaces.`,
    constraints: ['1 <= nums.length <= 10^5', '-10^6 <= nums[i], pivot <= 10^6', 'pivot is present in nums.'],
    examples: [
      {
        input: '7\n9 12 5 10 14 3 10\n10',
        displayInput: 'nums = [9, 12, 5, 10, 14, 3, 10], pivot = 10',
        output: '9 5 3 10 10 12 14',
        displayOutput: '[9, 5, 3, 10, 10, 12, 14]',
        explanation: 'Elements < 10: 9, 5, 3. Elements == 10: 10, 10. Elements > 10: 12, 14.'
      },
      {
        input: '3\n-3 4 3\n2',
        displayInput: 'nums = [-3, 4, 3], pivot = 2',
        output: '-3 4 3',
        displayOutput: '[-3, 4, 3]',
        explanation: 'Only -3 is < 2. 4 and 3 are > 2.'
      }
    ],
    hints: [
      'Count elements strictly less than pivot and strictly equal to pivot.',
      'Place less elements starting at index 0, equal elements starting at countLess, and greater elements starting at (countLess + countEqual).',
      'Iterate through nums to place each value into its designated partition preserving stable relative order.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    pivot = int(t[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int pivot = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int pivot; cin >> pivot;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    const pivot = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['7\n9 12 5 10 14 3 10\n10', '3\n-3 4 3\n2'],
    hiddenInputs: ['1\n5\n5', '5\n1 2 3 4 5\n3', '4\n2 2 2 2\n2'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      const pivot = parseInt(t[n + 1], 10);
      const less = [], eq = [], greater = [];
      for (const x of nums) {
        if (x < pivot) less.push(x);
        else if (x === pivot) eq.push(x);
        else greater.push(x);
      }
      return [...less, ...eq, ...greater].join(' ');
    }
  }),

  // 14. Rotate Array by K Steps (Medium)
  createCanonicalProblem({
    problemId: 'dsa_two-pointers_14',
    topicId: 'two-pointers',
    order: 14,
    title: 'Rotate Array by K Steps',
    difficulty: 'Medium',
    tags: ['Two Pointers', 'Array', 'Math'],
    statement: `Given an integer array \`nums\`, rotate the array to the right by \`k\` steps, where \`k\` is non-negative.

You must solve this **in-place** with **O(1) extra space** using the three-reversal algorithm.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer k.`,
    outputFormat: `Print the rotated array separated by spaces.`,
    constraints: ['1 <= nums.length <= 10^5', '-2^31 <= nums[i] <= 2^31 - 1', '0 <= k <= 10^5'],
    examples: [
      {
        input: '7\n1 2 3 4 5 6 7\n3',
        displayInput: 'nums = [1, 2, 3, 4, 5, 6, 7], k = 3',
        output: '5 6 7 1 2 3 4',
        displayOutput: '[5, 6, 7, 1, 2, 3, 4]',
        explanation: 'Rotate 1 step: [7,1,2,3,4,5,6]. Rotate 2 steps: [6,7,1,2,3,4,5]. Rotate 3 steps: [5,6,7,1,2,3,4].'
      },
      {
        input: '4\n-1 -100 3 99\n2',
        displayInput: 'nums = [-1, -100, 3, 99], k = 2',
        output: '3 99 -1 -100',
        displayOutput: '[3, 99, -1, -100]',
        explanation: 'Rotate 2 steps right.'
      }
    ],
    hints: [
      'Take k modulo N first: k = k % N.',
      'Reverse the entire array from 0 to N - 1.',
      'Reverse the first k elements (0 to k - 1), then reverse the remaining elements (k to N - 1).'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    k = int(t[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int k = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int k; cin >> k;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    const k = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['7\n1 2 3 4 5 6 7\n3', '4\n-1 -100 3 99\n2'],
    hiddenInputs: ['1\n5\n0', '3\n1 2 3\n4', '5\n10 20 30 40 50\n5'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      const k = parseInt(t[n + 1], 10) % n;
      const rev = (arr, i, j) => {
        while (i < j) {
          const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
          i++; j--;
        }
      };
      rev(nums, 0, n - 1);
      rev(nums, 0, k - 1);
      rev(nums, k, n - 1);
      return nums.join(' ');
    }
  }),

  // 15. Remove Duplicates from Sorted Array II (Medium)
  createCanonicalProblem({
    problemId: 'dsa_two-pointers_15',
    topicId: 'two-pointers',
    order: 15,
    title: 'Remove Duplicates from Sorted Array II',
    difficulty: 'Medium',
    tags: ['Two Pointers', 'Array'],
    statement: `Given an integer array \`nums\` sorted in **non-decreasing order**, remove some duplicates **in-place** such that each unique element appears **at most twice**. The relative order of the elements should be kept the same.

Return \`k\` (the length of the modified array) on the first line, followed by the first \`k\` elements on the second line.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `First line: integer k.
Second line: k space-separated elements.`,
    constraints: ['1 <= nums.length <= 3 * 10^4', '-10^4 <= nums[i] <= 10^4', 'nums is sorted in non-decreasing order.'],
    examples: [
      {
        input: '6\n1 1 1 2 2 3',
        displayInput: 'nums = [1, 1, 1, 2, 2, 3]',
        output: '5\n1 1 2 2 3',
        displayOutput: 'k = 5, nums = [1, 1, 2, 2, 3]',
        explanation: 'Each element appears at most twice.'
      },
      {
        input: '9\n0 0 1 1 1 1 2 3 3',
        displayInput: 'nums = [0, 0, 1, 1, 1, 1, 2, 3, 3]',
        output: '7\n0 0 1 1 2 3 3',
        displayOutput: 'k = 7, nums = [0, 0, 1, 1, 2, 3, 3]',
        explanation: 'Result has length 7.'
      }
    ],
    hints: [
      'If N <= 2, the array is already valid.',
      'Maintain an index writePos = 2.',
      'Iterate i from 2 to N - 1: if nums[i] != nums[writePos - 2], set nums[writePos] = nums[i] and increment writePos.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['6\n1 1 1 2 2 3', '9\n0 0 1 1 1 1 2 3 3'],
    hiddenInputs: ['2\n1 1', '4\n1 1 1 1', '5\n1 2 3 4 5'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      if (n <= 2) return `${n}\n${nums.join(' ')}`;
      let k = 2;
      for (let i = 2; i < n; i++) {
        if (nums[i] !== nums[k - 2]) {
          nums[k] = nums[i];
          k++;
        }
      }
      return `${k}\n${nums.slice(0, k).join(' ')}`;
    }
  }),

  // 16. Four Sum (Medium)
  createCanonicalProblem({
    problemId: 'dsa_two-pointers_16',
    topicId: 'two-pointers',
    order: 16,
    title: 'Four Sum',
    difficulty: 'Medium',
    tags: ['Two Pointers', 'Array', 'Sorting'],
    statement: `Given an array \`nums\` of \`n\` integers and an integer \`target\`, find all unique quadruplets \`[a, b, c, d]\` such that \`a + b + c + d == target\`.

Output each unique quadruplet in sorted order separated by spaces, one per line.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer target.`,
    outputFormat: `Print each unique quadruplet on a new line.`,
    constraints: ['1 <= nums.length <= 200', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9'],
    examples: [
      {
        input: '6\n1 0 -1 0 -2 2\n0',
        displayInput: 'nums = [1, 0, -1, 0, -2, 2], target = 0',
        output: '-2 -1 1 2\n-2 0 0 2\n-1 0 0 1',
        displayOutput: '[[-2,-1,1,2], [-2,0,0,2], [-1,0,0,1]]',
        explanation: 'Three unique quadruplets sum to 0.'
      }
    ],
    hints: [
      'Sort nums to facilitate two pointers and skipping duplicates.',
      'Two outer loops fix elements i and j.',
      'Two converging pointers l and r search the sorted remainder.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    target = int(t[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int target = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int target; cin >> target;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    const target = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['6\n1 0 -1 0 -2 2\n0'],
    hiddenInputs: ['5\n2 2 2 2 2\n8', '4\n1 2 3 4\n100'],
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
            } else if (sum < target) l++;
            else r--;
          }
        }
      }
      return res.join('\n');
    }
  }),

  // 17. Trapping Rain Water (Two Pointers) (Hard)
  createCanonicalProblem({
    problemId: 'dsa_two-pointers_17',
    topicId: 'two-pointers',
    order: 17,
    title: 'Trapping Rain Water (Two Pointers)',
    difficulty: 'Hard',
    tags: ['Two Pointers', 'Array', 'Dynamic Programming'],
    statement: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.

You must solve this in **O(N)** time and **O(1)** auxiliary space using the two-pointer approach.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers representing heights.`,
    outputFormat: `Print the total units of trapped rain water.`,
    constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    examples: [
      {
        input: '12\n0 1 0 2 1 0 1 3 2 1 2 1',
        displayInput: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        displayOutput: '6',
        explanation: '6 units of rain water are trapped between bars.'
      },
      {
        input: '6\n4 2 0 3 2 5',
        displayInput: 'height = [4,2,0,3,2,5]',
        output: '9',
        displayOutput: '9',
        explanation: '9 units of water are trapped.'
      }
    ],
    hints: [
      'Maintain two pointers left = 0, right = N - 1, and two tracking variables maxLeft = 0, maxRight = 0.',
      'Water trapped at any position is determined by the shorter of maxLeft and maxRight.',
      'If height[left] < height[right], process left (update maxLeft, add maxLeft - height[left]), otherwise process right.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    h = [int(x) for x in t[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] h = new int[n];\n        for (int i = 0; i < n; i++) h[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> h(n); for (int i = 0; i < n; i++) cin >> h[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const h = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['12\n0 1 0 2 1 0 1 3 2 1 2 1', '6\n4 2 0 3 2 5'],
    hiddenInputs: ['1\n5', '3\n3 0 3', '5\n5 4 3 2 1', '5\n1 2 3 4 5'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const h = t.slice(1, n + 1).map(Number);
      let l = 0, r = n - 1, maxL = 0, maxR = 0, water = 0;
      while (l < r) {
        if (h[l] <= h[r]) {
          if (h[l] >= maxL) maxL = h[l];
          else water += maxL - h[l];
          l++;
        } else {
          if (h[r] >= maxR) maxR = h[r];
          else water += maxR - h[r];
          r--;
        }
      }
      return String(water);
    }
  }),

  // 18. Smallest Range Covering Elements from K Lists (Hard)
  createCanonicalProblem({
    problemId: 'dsa_two-pointers_18',
    topicId: 'two-pointers',
    order: 18,
    title: 'Smallest Range Covering Elements from K Lists',
    difficulty: 'Hard',
    tags: ['Two Pointers', 'Sliding Window', 'Heap'],
    statement: `You have \`k\` lists of sorted integers in non-decreasing order. Find the **smallest range** \`[a, b]\` that includes at least one number from each of the \`k\` lists.

Range \`[a, b]\` is smaller than \`[c, d]\` if \`b - a < d - c\` or \`a < c\` if \`b - a == d - c\`.

Output the two integers \`a\` and \`b\` separated by a space.`,
    inputFormat: `First line: integer K (number of lists).
Next K lines: first integer is list size M, followed by M space-separated integers.`,
    outputFormat: `Print the two numbers a and b separated by a space.`,
    constraints: ['k == nums.length', '1 <= k <= 3500', '1 <= nums[i].length <= 50', '-10^5 <= nums[i][j] <= 10^5'],
    examples: [
      {
        input: '3\n5 4 10 15 24 26\n4 0 9 12 20\n5 5 18 22 30 35',
        displayInput: 'nums = [[4,10,15,24,26],[0,9,12,20],[5,18,22,30,35]]',
        output: '20 24',
        displayOutput: '[20, 24]',
        explanation: 'List 1: 24, List 2: 20, List 3: 22. Range [20, 24] covers at least one number from all 3 lists.'
      }
    ],
    hints: [
      'Combine all elements with their originating list ID into a single sorted array of pairs (val, listId).',
      'Use a sliding window (two pointers) over this combined sorted array.',
      'Expand right until the window contains at least one element from each of the K lists, then contract left to minimize range.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    lines = sys.stdin.read().strip().splitlines()\n    if not lines: return\n    k = int(lines[0])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int k = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int k; if (!(cin >> k)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const lines = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/).filter(Boolean);\n    if (!lines.length) return;\n    const k = parseInt(lines[0], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['3\n5 4 10 15 24 26\n4 0 9 12 20\n5 5 18 22 30 35'],
    hiddenInputs: ['2\n2 1 5\n2 2 6', '3\n1 1\n1 2\n1 3'],
    solveFunction: (stdin) => {
      const lines = stdin.trim().split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const k = parseInt(lines[0], 10);
      const items = [];
      for (let i = 1; i <= k; i++) {
        const parts = lines[i].split(/\s+/).map(Number);
        const m = parts[0];
        for (let j = 1; j <= m; j++) {
          items.push({ val: parts[j], listId: i - 1 });
        }
      }
      items.sort((a, b) => a.val - b.val);
      const count = new Map();
      let uniqueLists = 0, l = 0;
      let minRange = Infinity, bestA = -1, bestB = -1;
      for (let r = 0; r < items.length; r++) {
        const id = items[r].listId;
        count.set(id, (count.get(id) || 0) + 1);
        if (count.get(id) === 1) uniqueLists++;
        while (uniqueLists === k) {
          const diff = items[r].val - items[l].val;
          if (diff < minRange) {
            minRange = diff;
            bestA = items[l].val;
            bestB = items[r].val;
          }
          const leftId = items[l].listId;
          count.set(leftId, count.get(leftId) - 1);
          if (count.get(leftId) === 0) uniqueLists--;
          l++;
        }
      }
      return `${bestA} ${bestB}`;
    }
  }),

  // 19. Subarrays with Bounded Maximum (Hard)
  createCanonicalProblem({
    problemId: 'dsa_two-pointers_19',
    topicId: 'two-pointers',
    order: 19,
    title: 'Subarrays with Bounded Maximum',
    difficulty: 'Hard',
    tags: ['Two Pointers', 'Array'],
    statement: `Given an integer array \`nums\` and two integers \`left\` and \`right\`, return the number of contiguous non-empty subarrays such that the value of the maximum array element in that subarray is in the range \`[left, right]\`.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integers left and right.`,
    outputFormat: `Print the total count of valid subarrays.`,
    constraints: ['1 <= nums.length <= 10^5', '0 <= nums[i] <= 10^9', '0 <= left <= right <= 10^9'],
    examples: [
      {
        input: '4\n2 1 4 3\n2 3',
        displayInput: 'nums = [2, 1, 4, 3], left = 2, right = 3',
        output: '3',
        displayOutput: '3',
        explanation: 'Three subarrays meet the criteria: [2], [2, 1], [3].'
      },
      {
        input: '5\n2 9 2 5 6\n2 8',
        displayInput: 'nums = [2, 9, 2, 5, 6], left = 2, right = 8',
        output: '7',
        displayOutput: '7',
        explanation: 'Seven valid subarrays with maximum in [2, 8].'
      }
    ],
    hints: [
      'Notice count(left, right) = countWithMaxAtMost(right) - countWithMaxAtMost(left - 1).',
      'For countWithMaxAtMost(bound): count how many subarrays end at index i where every element is <= bound.',
      'Use a single two-pointer or running length variable to count in linear O(N) time.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    left, right = int(t[n+1]), int(t[n+2])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int left = sc.nextInt(), right = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int l, r; cin >> l >> r;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 4) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    const left = parseInt(t[n + 1], 10), right = parseInt(t[n + 2], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['4\n2 1 4 3\n2 3', '5\n2 9 2 5 6\n2 8'],
    hiddenInputs: ['3\n1 2 3\n1 3', '4\n5 5 5 5\n1 4', '4\n5 5 5 5\n5 5'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      const left = parseInt(t[n + 1], 10), right = parseInt(t[n + 2], 10);
      const countAtMost = (bound) => {
        let total = 0, cur = 0;
        for (const x of nums) {
          if (x <= bound) cur++;
          else cur = 0;
          total += cur;
        }
        return total;
      };
      return String(countAtMost(right) - countAtMost(left - 1));
    }
  }),

  // 20. Minimum Size Subarray Sum (Hard)
  createCanonicalProblem({
    problemId: 'dsa_two-pointers_20',
    topicId: 'two-pointers',
    order: 20,
    title: 'Minimum Size Subarray Sum',
    difficulty: 'Hard',
    tags: ['Two Pointers', 'Array', 'Binary Search', 'Sliding Window'],
    statement: `Given an array of positive integers \`nums\` and a positive integer \`target\`, return the **minimal length** of a contiguous subarray of which the sum is greater than or equal to \`target\`. If there is no such subarray, return \`0\` instead.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer target.`,
    outputFormat: `Print the minimal length of a valid subarray, or 0 if none exists.`,
    constraints: ['1 <= target <= 10^9', '1 <= nums.length <= 10^5', '1 <= nums[i] <= 10^4'],
    examples: [
      {
        input: '6\n2 3 1 2 4 3\n7',
        displayInput: 'target = 7, nums = [2, 3, 1, 2, 4, 3]',
        output: '2',
        displayOutput: '2',
        explanation: 'Subarray [4, 3] has minimal length 2 under problem condition.'
      },
      {
        input: '3\n1 4 4\n4',
        displayInput: 'target = 4, nums = [1, 4, 4]',
        output: '1',
        displayOutput: '1',
        explanation: 'Subarray [4] has length 1.'
      },
      {
        input: '5\n1 1 1 1 1\n11',
        displayInput: 'target = 11, nums = [1, 1, 1, 1, 1]',
        output: '0',
        displayOutput: '0',
        explanation: 'Total sum is 5, no subarray sums to >= 11.'
      }
    ],
    hints: [
      'Use a variable sliding window with two pointers left and right.',
      'Expand right adding elements to a running sum until sum >= target.',
      'Contract left to minimize the window size while sum >= target, updating the minimal length.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    target = int(t[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int target = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int target; cin >> target;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    const target = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['6\n2 3 1 2 4 3\n7', '3\n1 4 4\n4', '5\n1 1 1 1 1\n11'],
    hiddenInputs: ['1\n10\n10', '4\n1 2 3 4\n15', '5\n1 2 3 4 5\n15'],
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
  })
];


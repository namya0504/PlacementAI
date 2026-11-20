/**
 * Canonical DSA Placement Problems: LINKED LIST (20 Questions)
 * 7 Easy, 9 Medium, 4 Hard
 */

import { createCanonicalProblem } from './topicProblemHelper.js';

export const LINKED_LIST_PROBLEMS = [
  // 1. Reverse Linked List (Easy)
  createCanonicalProblem({
    problemId: 'dsa_linked-list_01',
    topicId: 'linked-list',
    order: 1,
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    tags: ['Linked List', 'Recursion'],
    statement: `Given the head of a singly linked list represented as space-separated integers, reverse the list, and return the reversed list.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers representing node values.`,
    outputFormat: `Print the reversed linked list values separated by spaces.`,
    constraints: ['0 <= N <= 5000', '-5000 <= Node.val <= 5000'],
    examples: [
      {
        input: '5\n1 2 3 4 5',
        displayInput: 'head = [1,2,3,4,5]',
        output: '5 4 3 2 1',
        displayOutput: '[5,4,3,2,1]',
        explanation: 'List reversed.'
      },
      {
        input: '2\n1 2',
        displayInput: 'head = [1,2]',
        output: '2 1',
        displayOutput: '[2,1]',
        explanation: 'Reversed [1, 2] is [2, 1].'
      },
      {
        input: '0\n',
        displayInput: 'head = []',
        output: '',
        displayOutput: '[]',
        explanation: 'Empty list remains empty.'
      }
    ],
    hints: [
      'Maintain three pointers: prev = null, curr = head, next = null.',
      'In each step: next = curr.next, curr.next = prev, prev = curr, curr = next.',
      'Return prev when curr becomes null.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t or t[0] == '0': return\n    n = int(t[0])\n    vals = t[1:n+1]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n) || n == 0) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length === 0 || t[0] === '0') return;\n    const n = parseInt(t[0], 10);\n    const a = t.slice(1, n + 1);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['5\n1 2 3 4 5', '2\n1 2', '0\n'],
    hiddenInputs: ['1\n99', '3\n10 20 30'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      if (!t || !t.length || t[0] === '0' || t[0] === '') return '';
      const n = parseInt(t[0], 10);
      const vals = t.slice(1, n + 1);
      return vals.reverse().join(' ');
    }
  }),

  // 2. Middle of the Linked List (Easy)
  createCanonicalProblem({
    problemId: 'dsa_linked-list_02',
    topicId: 'linked-list',
    order: 2,
    title: 'Middle of the Linked List',
    difficulty: 'Easy',
    tags: ['Linked List', 'Two Pointers'],
    statement: `Given the head of a singly linked list, return the **middle node** of the linked list.

If there are two middle nodes, return the **second middle** node. Output all values from the middle node to the end of the list separated by spaces.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the values from the middle node onwards separated by spaces.`,
    constraints: ['1 <= N <= 100', '1 <= Node.val <= 100'],
    examples: [
      {
        input: '5\n1 2 3 4 5',
        displayInput: 'head = [1,2,3,4,5]',
        output: '3 4 5',
        displayOutput: '[3,4,5]',
        explanation: 'The middle node of the list is node 3.'
      },
      {
        input: '6\n1 2 3 4 5 6',
        displayInput: 'head = [1,2,3,4,5,6]',
        output: '4 5 6',
        displayOutput: '[4,5,6]',
        explanation: 'Since the list has two middle nodes with values 3 and 4, we return the second one.'
      }
    ],
    hints: [
      'Use Floyd\'s slow and fast pointer technique.',
      'Initialize slow = head and fast = head.',
      'While fast and fast.next are non-null: slow = slow.next, fast = fast.next.next.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    vals = t[1:n+1]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const a = t.slice(1, n + 1);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['5\n1 2 3 4 5', '6\n1 2 3 4 5 6'],
    hiddenInputs: ['1\n10', '2\n10 20', '3\n1 2 3'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const vals = t.slice(1, n + 1);
      const mid = Math.floor(n / 2);
      return vals.slice(mid).join(' ');
    }
  }),

  // 3. Merge Two Sorted Lists (Easy)
  createCanonicalProblem({
    problemId: 'dsa_linked-list_03',
    topicId: 'linked-list',
    order: 3,
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    tags: ['Linked List', 'Recursion'],
    statement: `You are given the heads of two sorted linked lists \`list1\` and \`list2\`.

Merge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists.

Output the values of the merged linked list separated by spaces.`,
    inputFormat: `First line: integers N and M.
Second line: N space-separated integers for list1.
Third line: M space-separated integers for list2.`,
    outputFormat: `Print the merged sorted linked list values.`,
    constraints: ['0 <= N, M <= 50', '-100 <= Node.val <= 100'],
    examples: [
      {
        input: '3 3\n1 2 4\n1 3 4',
        displayInput: 'list1 = [1,2,4], list2 = [1,3,4]',
        output: '1 1 2 3 4 4',
        displayOutput: '[1,1,2,3,4,4]',
        explanation: 'Merged in ascending order.'
      },
      {
        input: '0 0\n\n',
        displayInput: 'list1 = [], list2 = []',
        output: '',
        displayOutput: '[]',
        explanation: 'Both lists empty.'
      }
    ],
    hints: [
      'Create a dummy head node to simplify edge cases.',
      'Iterate while both lists have remaining nodes; attach the smaller node to tail.',
      'Attach any remaining suffix from either list.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n, m = int(t[0]), int(t[1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt(), m = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n, m; if (!(cin >> n >> m)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['3 3\n1 2 4\n1 3 4', '0 0\n\n'],
    hiddenInputs: ['0 1\n\n0', '1 0\n5\n', '2 2\n2 5\n1 4'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      if (!t || t.length < 2) return '';
      const n = parseInt(t[0], 10), m = parseInt(t[1], 10);
      const a = t.slice(2, 2 + n).map(Number);
      const b = t.slice(2 + n, 2 + n + m).map(Number);
      const merged = [...a, ...b].sort((x, y) => x - y);
      return merged.join(' ');
    }
  }),

  // 4. Linked List Cycle Detection (Easy)
  createCanonicalProblem({
    problemId: 'dsa_linked-list_04',
    topicId: 'linked-list',
    order: 4,
    title: 'Linked List Cycle Detection',
    difficulty: 'Easy',
    tags: ['Linked List', 'Two Pointers', 'Hash Table'],
    statement: `Given \`head\`, the head of a linked list, determine if the linked list has a cycle in it.

There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the \`next\` pointer.

Return \`true\` if there is a cycle, otherwise \`false\`.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer pos (-1 if no cycle, or 0-indexed position where tail connects to).`,
    outputFormat: `Print 'true' if cycle exists, else 'false'.`,
    constraints: ['0 <= N <= 10^4', '-1 <= pos < N'],
    examples: [
      {
        input: '4\n3 2 0 -4\n1',
        displayInput: 'head = [3,2,0,-4], pos = 1',
        output: 'true',
        displayOutput: 'true',
        explanation: 'There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).'
      },
      {
        input: '2\n1 2\n0',
        displayInput: 'head = [1,2], pos = 0',
        output: 'true',
        displayOutput: 'true',
        explanation: 'Cycle connects tail to head.'
      },
      {
        input: '1\n1\n-1',
        displayInput: 'head = [1], pos = -1',
        output: 'false',
        displayOutput: 'false',
        explanation: 'No cycle.'
      }
    ],
    hints: [
      'Use Floyd\'s Tortoise and Hare algorithm.',
      'Slow moves 1 step, fast moves 2 steps.',
      'If slow and fast collide, a cycle exists; if fast reaches null, there is no cycle.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    pos = int(t[n+1]) if len(t) > n+1 else -1\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int pos = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int pos; cin >> pos;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const pos = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['4\n3 2 0 -4\n1', '2\n1 2\n0', '1\n1\n-1'],
    hiddenInputs: ['0\n\n-1', '5\n1 2 3 4 5\n-1', '3\n1 2 3\n2'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      if (!t || t.length === 0 || t[0] === '0') return 'false';
      const n = parseInt(t[0], 10);
      const pos = parseInt(t[n + 1], 10);
      return pos !== -1 ? 'true' : 'false';
    }
  }),

  // 5. Remove Duplicates from Sorted List (Easy)
  createCanonicalProblem({
    problemId: 'dsa_linked-list_05',
    topicId: 'linked-list',
    order: 5,
    title: 'Remove Duplicates from Sorted List',
    difficulty: 'Easy',
    tags: ['Linked List'],
    statement: `Given the head of a sorted linked list, delete all duplicates such that each element appears only **once**. Return the linked list **sorted** as well.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers in non-decreasing order.`,
    outputFormat: `Print the unique sorted list values separated by spaces.`,
    constraints: ['0 <= N <= 300', '-100 <= Node.val <= 100', 'The list is guaranteed to be sorted in ascending order.'],
    examples: [
      {
        input: '3\n1 1 2',
        displayInput: 'head = [1,1,2]',
        output: '1 2',
        displayOutput: '[1,2]',
        explanation: 'Duplicates removed.'
      },
      {
        input: '5\n1 1 2 3 3',
        displayInput: 'head = [1,1,2,3,3]',
        output: '1 2 3',
        displayOutput: '[1,2,3]',
        explanation: 'Only unique nodes kept.'
      }
    ],
    hints: [
      'Iterate curr through the list.',
      'If curr.val == curr.next.val, skip curr.next (curr.next = curr.next.next).',
      'Otherwise advance curr = curr.next.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t or t[0] == '0': return\n    n = int(t[0])\n    nums = t[1:n+1]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n) || n == 0) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length === 0 || t[0] === '0') return;\n    const n = parseInt(t[0], 10);\n    const a = t.slice(1, n + 1);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['3\n1 1 2', '5\n1 1 2 3 3'],
    hiddenInputs: ['0\n', '1\n10', '4\n1 1 1 1'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      if (!t || !t.length || t[0] === '0' || t[0] === '') return '';
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number);
      const uniq = Array.from(new Set(nums));
      return uniq.join(' ');
    }
  }),

  // 6. Delete Node in a Linked List (Without Head Pointer) (Easy)
  createCanonicalProblem({
    problemId: 'dsa_linked-list_06',
    topicId: 'linked-list',
    order: 6,
    title: 'Delete Node in a Linked List (Without Head Pointer)',
    difficulty: 'Easy',
    tags: ['Linked List'],
    statement: `There is a singly-linked list \`head\` and we want to delete a node in it. You are given the value of the node to be deleted \`val\` (it is not a tail node).

Delete the node by overwriting its value with the next node's value and bypassing the next node.

Output the modified linked list separated by spaces.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer val (value of node to delete).`,
    outputFormat: `Print the modified list values separated by spaces.`,
    constraints: ['2 <= N <= 1000', '-1000 <= Node.val <= 1000', 'The value of the node to be deleted is in the list and is not the last node.'],
    examples: [
      {
        input: '4\n4 5 1 9\n5',
        displayInput: 'head = [4,5,1,9], node = 5',
        output: '4 1 9',
        displayOutput: '[4,1,9]',
        explanation: 'Node with value 5 is deleted.'
      },
      {
        input: '4\n4 5 1 9\n1',
        displayInput: 'head = [4,5,1,9], node = 1',
        output: '4 5 9',
        displayOutput: '[4,5,9]',
        explanation: 'Node with value 1 is deleted.'
      }
    ],
    hints: [
      'Since you do not have access to head, copy the next node\'s value to the current node: node.val = node.next.val.',
      'Then delete the next node: node.next = node.next.next.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = t[1:n+1]\n    val = t[n+1]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int val = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int val; cin >> val;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const a = t.slice(1, n + 1);\n    const val = t[n + 1];\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['4\n4 5 1 9\n5', '4\n4 5 1 9\n1'],
    hiddenInputs: ['3\n1 2 3\n2', '2\n1 2\n1'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1);
      const val = t[n + 1];
      const idx = nums.indexOf(val);
      if (idx !== -1) nums.splice(idx, 1);
      return nums.join(' ');
    }
  }),

  // 7. Palindrome Linked List (Easy)
  createCanonicalProblem({
    problemId: 'dsa_linked-list_07',
    topicId: 'linked-list',
    order: 7,
    title: 'Palindrome Linked List',
    difficulty: 'Easy',
    tags: ['Linked List', 'Two Pointers', 'Stack'],
    statement: `Given the head of a singly linked list, return \`true\` if it is a **palindrome** or \`false\` otherwise.

Can you do it in **O(N)** time and **O(1)** auxiliary space?`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print 'true' if palindrome, else 'false'.`,
    constraints: ['1 <= N <= 10^5', '0 <= Node.val <= 9'],
    examples: [
      {
        input: '4\n1 2 2 1',
        displayInput: 'head = [1,2,2,1]',
        output: 'true',
        displayOutput: 'true',
        explanation: 'Reads same forwards and backwards.'
      },
      {
        input: '2\n1 2',
        displayInput: 'head = [1,2]',
        output: 'false',
        displayOutput: 'false',
        explanation: 'Not a palindrome.'
      }
    ],
    hints: [
      'Find the middle using slow and fast pointers.',
      'Reverse the second half of the linked list in-place.',
      'Compare first half and reversed second half node-by-node.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = t[1:n+1]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const a = t.slice(1, n + 1);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['4\n1 2 2 1', '2\n1 2'],
    hiddenInputs: ['1\n5', '3\n1 2 1', '5\n1 2 3 2 1'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1);
      let l = 0, r = n - 1;
      while (l < r) {
        if (nums[l] !== nums[r]) return 'false';
        l++; r--;
      }
      return 'true';
    }
  }),

  // 8. Remove Nth Node From End of List (Medium)
  createCanonicalProblem({
    problemId: 'dsa_linked-list_08',
    topicId: 'linked-list',
    order: 8,
    title: 'Remove Nth Node From End of List',
    difficulty: 'Medium',
    tags: ['Linked List', 'Two Pointers'],
    statement: `Given the head of a linked list, remove the \`n\`th node from the end of the list and return its head.

Output the values of the modified list separated by spaces.`,
    inputFormat: `First line: integer LEN (list size).
Second line: LEN space-separated integers.
Third line: integer n (1 <= n <= LEN).`,
    outputFormat: `Print the modified list separated by spaces.`,
    constraints: ['1 <= sz <= 30', '0 <= Node.val <= 100', '1 <= n <= sz'],
    examples: [
      {
        input: '5\n1 2 3 4 5\n2',
        displayInput: 'head = [1,2,3,4,5], n = 2',
        output: '1 2 3 5',
        displayOutput: '[1,2,3,5]',
        explanation: 'Removing 2nd from end (node 4).'
      },
      {
        input: '1\n1\n1',
        displayInput: 'head = [1], n = 1',
        output: '',
        displayOutput: '[]',
        explanation: 'Single node removed, list is empty.'
      },
      {
        input: '2\n1 2\n1',
        displayInput: 'head = [1,2], n = 1',
        output: '1',
        displayOutput: '[1]',
        explanation: 'Removing node 2.'
      }
    ],
    hints: [
      'Maintain two pointers fast and slow separated by n steps.',
      'Advance both pointers until fast reaches the end of the list.',
      'slow.next is now pointing to the node that must be deleted.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    sz = int(t[0])\n    vals = t[1:sz+1]\n    n = int(t[sz+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int sz = sc.nextInt();\n        int[] a = new int[sz];\n        for (int i = 0; i < sz; i++) a[i] = sc.nextInt();\n        int n = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int sz; if (!(cin >> sz)) return 0;\n    vector<int> a(sz); for (int i = 0; i < sz; i++) cin >> a[i];\n    int n; cin >> n;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const sz = parseInt(t[0], 10);\n    const a = t.slice(1, sz + 1);\n    const n = parseInt(t[sz + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['5\n1 2 3 4 5\n2', '1\n1\n1', '2\n1 2\n1'],
    hiddenInputs: ['2\n1 2\n2', '4\n10 20 30 40\n4'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const sz = parseInt(t[0], 10);
      const vals = t.slice(1, sz + 1);
      const n = parseInt(t[sz + 1], 10);
      const removeIdx = sz - n;
      vals.splice(removeIdx, 1);
      return vals.join(' ');
    }
  }),

  // 9. Odd Even Linked List (Medium)
  createCanonicalProblem({
    problemId: 'dsa_linked-list_09',
    topicId: 'linked-list',
    order: 9,
    title: 'Odd Even Linked List',
    difficulty: 'Medium',
    tags: ['Linked List'],
    statement: `Given the head of a singly linked list, group all the nodes with **odd indices** together followed by the nodes with **even indices**, and return the reordered list.

The first node is considered odd, and the second node is even, and so on.

Solve with **O(1)** auxiliary space and **O(N)** time complexity.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the reordered list separated by spaces.`,
    constraints: ['0 <= N <= 10^4', '-10^6 <= Node.val <= 10^6'],
    examples: [
      {
        input: '5\n1 2 3 4 5',
        displayInput: 'head = [1,2,3,4,5]',
        output: '1 3 5 2 4',
        displayOutput: '[1,3,5,2,4]',
        explanation: 'Odd indexed nodes (1, 3, 5) grouped before even indexed nodes (2, 4).'
      },
      {
        input: '7\n2 1 3 5 6 4 7',
        displayInput: 'head = [2,1,3,5,6,4,7]',
        output: '2 3 6 7 1 5 4',
        displayOutput: '[2,3,6,7,1,5,4]',
        explanation: 'Odd indices: 2, 3, 6, 7. Even indices: 1, 5, 4.'
      }
    ],
    hints: [
      'Maintain two pointers: odd pointing to odd nodes, even pointing to even nodes.',
      'Store evenHead = even to attach at the end of the odd list.',
      'Link odd.next = even.next, advance odd, link even.next = odd.next, advance even.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t or t[0] == '0': return\n    n = int(t[0])\n    vals = t[1:n+1]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n) || n == 0) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length === 0 || t[0] === '0') return;\n    const n = parseInt(t[0], 10);\n    const a = t.slice(1, n + 1);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['5\n1 2 3 4 5', '7\n2 1 3 5 6 4 7'],
    hiddenInputs: ['1\n10', '2\n1 2', '4\n1 2 3 4'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      if (!t || !t.length || t[0] === '0') return '';
      const n = parseInt(t[0], 10);
      const vals = t.slice(1, n + 1);
      const odds = [], evens = [];
      for (let i = 0; i < n; i++) {
        if (i % 2 === 0) odds.push(vals[i]);
        else evens.push(vals[i]);
      }
      return [...odds, ...evens].join(' ');
    }
  }),

  // 10. Add Two Numbers Represented by Linked Lists (Medium)
  createCanonicalProblem({
    problemId: 'dsa_linked-list_10',
    topicId: 'linked-list',
    order: 10,
    title: 'Add Two Numbers Represented by Linked Lists',
    difficulty: 'Medium',
    tags: ['Linked List', 'Math', 'Recursion'],
    statement: `You are given two **non-empty** linked lists representing two non-negative integers. The digits are stored in **reverse order**, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list in reverse order.`,
    inputFormat: `First line: integers N and M.
Second line: N space-separated digits for list1.
Third line: M space-separated digits for list2.`,
    outputFormat: `Print the resulting linked list digits separated by spaces.`,
    constraints: ['1 <= N, M <= 100', '0 <= Node.val <= 9'],
    examples: [
      {
        input: '3 3\n2 4 3\n5 6 4',
        displayInput: 'l1 = [2,4,3], l2 = [5,6,4]',
        output: '7 0 8',
        displayOutput: '[7,0,8]',
        explanation: '342 + 465 = 807. In reverse: 7 -> 0 -> 8.'
      },
      {
        input: '1 1\n0\n0',
        displayInput: 'l1 = [0], l2 = [0]',
        output: '0',
        displayOutput: '[0]',
        explanation: '0 + 0 = 0.'
      },
      {
        input: '7 4\n9 9 9 9 9 9 9\n9 9 9 9',
        displayInput: 'l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]',
        output: '8 9 9 9 0 0 0 1',
        displayOutput: '[8,9,9,9,0,0,0,1]',
        explanation: 'Simulated column addition with carry.'
      }
    ],
    hints: [
      'Initialize carry = 0.',
      'At each digit: sum = val1 + val2 + carry. New digit = sum % 10, carry = Math.floor(sum / 10).',
      'Continue while l1, l2, or carry exists.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n, m = int(t[0]), int(t[1])\n    l1 = [int(x) for x in t[2:2+n]]\n    l2 = [int(x) for x in t[2+n:2+n+m]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt(), m = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n, m; if (!(cin >> n >> m)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['3 3\n2 4 3\n5 6 4', '1 1\n0\n0', '7 4\n9 9 9 9 9 9 9\n9 9 9 9'],
    hiddenInputs: ['1 1\n5\n5', '2 1\n9 9\n1'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10), m = parseInt(t[1], 10);
      const l1 = t.slice(2, 2 + n).map(Number);
      const l2 = t.slice(2 + n, 2 + n + m).map(Number);
      let i = 0, j = 0, carry = 0;
      const res = [];
      while (i < n || j < m || carry > 0) {
        const sum = (i < n ? l1[i] : 0) + (j < m ? l2[j] : 0) + carry;
        res.push(sum % 10);
        carry = Math.floor(sum / 10);
        i++; j++;
      }
      return res.join(' ');
    }
  }),

  // 11. Copy List with Random Pointer (Medium)
  createCanonicalProblem({
    problemId: 'dsa_linked-list_11',
    topicId: 'linked-list',
    order: 11,
    title: 'Copy List with Random Pointer',
    difficulty: 'Medium',
    tags: ['Linked List', 'Hash Table'],
    statement: `A linked list of length \`n\` is given such that each node contains an additional random pointer, which could point to any node in the list, or null.

Construct a **deep copy** of the list. Output each copied node as \`[val, random_index]\` separated by space.`,
    inputFormat: `First line: integer N.
Next N lines: two space-separated integers val and random_index (-1 if null).`,
    outputFormat: `Print the copied list nodes formatted as [val,randomIndex] separated by spaces.`,
    constraints: ['0 <= n <= 1000', '-10^4 <= Node.val <= 10^4'],
    examples: [
      {
        input: '5\n7 -1\n13 0\n11 4\n10 2\n1 0',
        displayInput: '[[7,null],[13,0],[11,4],[10,2],[1,0]]',
        output: '[7,-1] [13,0] [11,4] [10,2] [1,0]',
        displayOutput: '[[7,null],[13,0],[11,4],[10,2],[1,0]]',
        explanation: 'Deep copy preserves node values and random references.'
      }
    ],
    hints: [
      'Pass 1: Interweave cloned nodes next to original nodes (curr.next = copyNode, copyNode.next = temp).',
      'Pass 2: Set copyNode.random = originalNode.random.next.',
      'Pass 3: Separate the two interwoven lists in O(1) space.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    lines = sys.stdin.read().strip().splitlines()\n    if not lines or lines[0] == '0': return\n    n = int(lines[0])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n) || n == 0) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const lines = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/).filter(Boolean);\n    if (!lines.length || lines[0] === '0') return;\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['5\n7 -1\n13 0\n11 4\n10 2\n1 0'],
    hiddenInputs: ['1\n3 -1', '2\n1 1\n2 1'],
    solveFunction: (stdin) => {
      const lines = stdin.trim().split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      if (!lines.length || lines[0] === '0') return '';
      const n = parseInt(lines[0], 10);
      const res = [];
      for (let i = 1; i <= n; i++) {
        const [v, r] = lines[i].split(/\s+/);
        res.push(`[${v},${r}]`);
      }
      return res.join(' ');
    }
  }),

  // 12. Reorder List (Medium)
  createCanonicalProblem({
    problemId: 'dsa_linked-list_12',
    topicId: 'linked-list',
    order: 12,
    title: 'Reorder List',
    difficulty: 'Medium',
    tags: ['Linked List', 'Two Pointers', 'Stack'],
    statement: `You are given the head of a singly linked-list: \`L0 -> L1 -> ... -> Ln - 1 -> Ln\`.

Reorder the list to be on the following form: \`L0 -> Ln -> L1 -> Ln - 1 -> L2 -> Ln - 2 -> ...\`.

Output the reordered list values separated by spaces.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the reordered list values.`,
    constraints: ['1 <= nums.length <= 5 * 10^4', '1 <= Node.val <= 1000'],
    examples: [
      {
        input: '4\n1 2 3 4',
        displayInput: 'head = [1,2,3,4]',
        output: '1 4 2 3',
        displayOutput: '[1,4,2,3]',
        explanation: 'Reordered list.'
      },
      {
        input: '5\n1 2 3 4 5',
        displayInput: 'head = [1,2,3,4,5]',
        output: '1 5 2 4 3',
        displayOutput: '[1,5,2,4,3]',
        explanation: 'Reordered list.'
      }
    ],
    hints: [
      'Find the middle of the list using slow/fast pointers.',
      'Reverse the second half of the list.',
      'Merge the first half and reversed second half alternately.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    vals = t[1:n+1]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const a = t.slice(1, n + 1);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['4\n1 2 3 4', '5\n1 2 3 4 5'],
    hiddenInputs: ['1\n10', '2\n1 2', '3\n1 2 3'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const vals = t.slice(1, n + 1);
      let l = 0, r = n - 1;
      const res = [];
      while (l <= r) {
        if (l === r) { res.push(vals[l]); break; }
        res.push(vals[l]);
        res.push(vals[r]);
        l++; r--;
      }
      return res.join(' ');
    }
  }),

  // 13. Rotate List by K Places (Medium)
  createCanonicalProblem({
    problemId: 'dsa_linked-list_13',
    topicId: 'linked-list',
    order: 13,
    title: 'Rotate List by K Places',
    difficulty: 'Medium',
    tags: ['Linked List', 'Two Pointers'],
    statement: `Given the head of a linked list, rotate the list to the right by \`k\` places.

Output the rotated list values separated by spaces.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer k.`,
    outputFormat: `Print the rotated list values.`,
    constraints: ['0 <= N <= 500', '-100 <= Node.val <= 100', '0 <= k <= 2 * 10^9'],
    examples: [
      {
        input: '5\n1 2 3 4 5\n2',
        displayInput: 'head = [1,2,3,4,5], k = 2',
        output: '4 5 1 2 3',
        displayOutput: '[4,5,1,2,3]',
        explanation: 'Rotate 2 steps right.'
      },
      {
        input: '3\n0 1 2\n4',
        displayInput: 'head = [0,1,2], k = 4',
        output: '2 0 1',
        displayOutput: '[2,0,1]',
        explanation: 'Rotate 4 mod 3 = 1 step right.'
      }
    ],
    hints: [
      'Find the length of the list N and connect tail.next = head to form a ring.',
      'Compute k = k % N.',
      'Traverse to the (N - k)th node, break the ring, and set new head = node.next.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t or t[0] == '0': return\n    n = int(t[0])\n    vals = t[1:n+1]\n    k = int(t[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int k = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n) || n == 0) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int k; cin >> k;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length === 0 || t[0] === '0') return;\n    const n = parseInt(t[0], 10);\n    const a = t.slice(1, n + 1);\n    const k = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['5\n1 2 3 4 5\n2', '3\n0 1 2\n4'],
    hiddenInputs: ['0\n\n5', '1\n10\n100'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      if (!t || !t.length || t[0] === '0') return '';
      const n = parseInt(t[0], 10);
      const vals = t.slice(1, n + 1);
      const k = parseInt(t[n + 1], 10) % n;
      if (k === 0) return vals.join(' ');
      const rotated = [...vals.slice(n - k), ...vals.slice(0, n - k)];
      return rotated.join(' ');
    }
  }),

  // 14. Intersection of Two Linked Lists (Medium)
  createCanonicalProblem({
    problemId: 'dsa_linked-list_14',
    topicId: 'linked-list',
    order: 14,
    title: 'Intersection of Two Linked Lists',
    difficulty: 'Medium',
    tags: ['Linked List', 'Two Pointers'],
    statement: `Given the heads of two singly linked-lists \`headA\` and \`headB\`, return the value of the node at which the two lists intersect. If the two linked lists have no intersection at all, return \`null\`.`,
    inputFormat: `First line: intersectVal, listA size, listB size, skipA, skipB.
Second line: listA values.
Third line: listB values.`,
    outputFormat: `Print the intersecting node value, or 'null'.`,
    constraints: ['1 <= listA.length, listB.length <= 3 * 10^4', '0 <= Node.val <= 10^5'],
    examples: [
      {
        input: '8 5 6 2 3\n4 1 8 4 5\n5 6 1 8 4 5',
        displayInput: 'intersectVal = 8, listA = [4,1,8,4,5], listB = [5,6,1,8,4,5]',
        output: '8',
        displayOutput: '8',
        explanation: 'The intersected node\'s value is 8.'
      },
      {
        input: '0 3 2 3 2\n2 6 4\n1 5',
        displayInput: 'intersectVal = 0, listA = [2,6,4], listB = [1,5]',
        output: 'null',
        displayOutput: 'null',
        explanation: 'No intersection.'
      }
    ],
    hints: [
      'Advance ptrA through listA and ptrB through listB.',
      'When ptrA reaches end of A, redirect to head of B; when ptrB reaches end of B, redirect to head of A.',
      'They will meet at the intersecting node after at most 2 passes, or both become null.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    lines = sys.stdin.read().strip().splitlines()\n    if not lines: return\n    meta = lines[0].split()\n    intersectVal = meta[0]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String iv = sc.next();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string iv; if (!(cin >> iv)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const lines = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/).filter(Boolean);\n    if (!lines.length) return;\n    const [iv] = lines[0].split(/\\s+/);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['8 5 6 2 3\n4 1 8 4 5\n5 6 1 8 4 5', '0 3 2 3 2\n2 6 4\n1 5'],
    hiddenInputs: ['2 3 3 1 1\n0 2 4\n3 2 4'],
    solveFunction: (stdin) => {
      const lines = stdin.trim().split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const meta = lines[0].split(/\s+/);
      const iv = meta[0];
      return iv === '0' ? 'null' : iv;
    }
  }),

  // 15. Sort List (Merge Sort on Linked List) (Medium)
  createCanonicalProblem({
    problemId: 'dsa_linked-list_15',
    topicId: 'linked-list',
    order: 15,
    title: 'Sort List (Merge Sort on Linked List)',
    difficulty: 'Medium',
    tags: ['Linked List', 'Two Pointers', 'Divide and Conquer', 'Sorting'],
    statement: `Given the head of a linked list, return the list after sorting it in **ascending order** in **O(N log N)** time and **O(log N)** space using Merge Sort.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the sorted linked list values.`,
    constraints: ['0 <= N <= 5 * 10^4', '-10^5 <= Node.val <= 10^5'],
    examples: [
      {
        input: '4\n4 2 1 3',
        displayInput: 'head = [4,2,1,3]',
        output: '1 2 3 4',
        displayOutput: '[1,2,3,4]',
        explanation: 'Sorted linked list.'
      },
      {
        input: '5\n-1 5 3 4 0',
        displayInput: 'head = [-1,5,3,4,0]',
        output: '-1 0 3 4 5',
        displayOutput: '[-1,0,3,4,5]',
        explanation: 'Sorted with negative numbers.'
      }
    ],
    hints: [
      'Split the list into two halves using fast and slow pointers.',
      'Recursively sort each half.',
      'Merge the two sorted sublists in O(N) time.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t or t[0] == '0': return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n) || n == 0) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length === 0 || t[0] === '0') return;\n    const n = parseInt(t[0], 10);\n    const a = t.slice(1, n + 1).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['4\n4 2 1 3', '5\n-1 5 3 4 0'],
    hiddenInputs: ['0\n', '1\n10', '4\n1 2 3 4'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      if (!t || !t.length || t[0] === '0' || t[0] === '') return '';
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1).map(Number).sort((a, b) => a - b);
      return nums.join(' ');
    }
  }),

  // 16. Flatten a Multilevel Doubly Linked List (Medium)
  createCanonicalProblem({
    problemId: 'dsa_linked-list_16',
    topicId: 'linked-list',
    order: 16,
    title: 'Flatten a Multilevel Doubly Linked List',
    difficulty: 'Medium',
    tags: ['Linked List', 'DFS', 'Stack'],
    statement: `You are given a doubly linked list, which contains nodes with a next pointer, a previous pointer, and an additional \`child\` pointer which may or may not point to a separate doubly linked list.

Flatten the list so that all the nodes appear in a single-level, doubly linked list in preorder DFS depth-first order.`,
    inputFormat: `First line: integer N.
Second line: N space-separated tokens describing flattened structure.`,
    outputFormat: `Print the flattened doubly linked list separated by spaces.`,
    constraints: ['0 <= N <= 1000'],
    examples: [
      {
        input: '12\n1 2 3 7 8 11 12 9 10 4 5 6',
        displayInput: 'head = [1,2,3,4,5,6,null,null,null,7,8,9,10,null,null,11,12]',
        output: '1 2 3 7 8 11 12 9 10 4 5 6',
        displayOutput: '[1,2,3,7,8,11,12,9,10,4,5,6]',
        explanation: 'Flattened preorder traversal.'
      }
    ],
    hints: [
      'Iterate curr through the list.',
      'If curr has a child: splice child list between curr and curr.next.',
      'Set curr.child = null.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t or t[0] == '0': return\n    n = int(t[0])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n) || n == 0) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length === 0 || t[0] === '0') return;\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['12\n1 2 3 7 8 11 12 9 10 4 5 6'],
    hiddenInputs: ['1\n1', '0\n'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      if (!t || !t.length || t[0] === '0') return '';
      const n = parseInt(t[0], 10);
      return t.slice(1, n + 1).join(' ');
    }
  }),

  // 17. Reverse Nodes in k-Group (Hard)
  createCanonicalProblem({
    problemId: 'dsa_linked-list_17',
    topicId: 'linked-list',
    order: 17,
    title: 'Reverse Nodes in k-Group',
    difficulty: 'Hard',
    tags: ['Linked List', 'Recursion'],
    statement: `Given the head of a linked list, reverse the nodes of the list \`k\` at a time, and return the modified list.

\`k\` is a positive integer and is less than or equal to the length of the linked list. If the number of nodes is not a multiple of \`k\` then left-out nodes, in the end, should remain as it is.

You may not alter the values in the list's nodes, only nodes themselves may be changed.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer k.`,
    outputFormat: `Print the modified linked list values separated by spaces.`,
    constraints: ['1 <= k <= sz <= 5000', '0 <= Node.val <= 1000'],
    examples: [
      {
        input: '5\n1 2 3 4 5\n2',
        displayInput: 'head = [1,2,3,4,5], k = 2',
        output: '2 1 4 3 5',
        displayOutput: '[2,1,4,3,5]',
        explanation: 'First two nodes reversed (2 1), next two reversed (4 3), node 5 remains.'
      },
      {
        input: '5\n1 2 3 4 5\n3',
        displayInput: 'head = [1,2,3,4,5], k = 3',
        output: '3 2 1 4 5',
        displayOutput: '[3,2,1,4,5]',
        explanation: 'First 3 nodes reversed (3 2 1), remaining 2 nodes unchanged.'
      }
    ],
    hints: [
      'Check if there are at least k nodes remaining.',
      'If so, reverse the k nodes and recursively call on the next group.',
      'Otherwise, leave remaining nodes as they are.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = t[1:n+1]\n    k = int(t[n+1])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int k = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int k; cin >> k;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 3) return;\n    const n = parseInt(t[0], 10);\n    const a = t.slice(1, n + 1);\n    const k = parseInt(t[n + 1], 10);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['5\n1 2 3 4 5\n2', '5\n1 2 3 4 5\n3'],
    hiddenInputs: ['4\n1 2 3 4\n4', '1\n1\n1'],
    solveFunction: (stdin) => {
      const t = stdin.trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1);
      const k = parseInt(t[n + 1], 10);
      const res = [];
      for (let i = 0; i < n; i += k) {
        if (i + k <= n) {
          const group = nums.slice(i, i + k).reverse();
          res.push(...group);
        } else {
          res.push(...nums.slice(i));
        }
      }
      return res.join(' ');
    }
  }),

  // 18. Merge k Sorted Lists (Hard)
  createCanonicalProblem({
    problemId: 'dsa_linked-list_18',
    topicId: 'linked-list',
    order: 18,
    title: 'Merge k Sorted Lists',
    difficulty: 'Hard',
    tags: ['Linked List', 'Divide and Conquer', 'Heap'],
    statement: `You are given an array of \`k\` linked-lists \`lists\`, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.`,
    inputFormat: `First line: integer K (number of lists).
Next K lines: first integer is list size M, followed by M space-separated integers.`,
    outputFormat: `Print the merged sorted list values.`,
    constraints: ['k == lists.length', '0 <= k <= 10^4', '0 <= lists[i].length <= 500', '-10^4 <= lists[i][j] <= 10^4'],
    examples: [
      {
        input: '3\n3 1 4 5\n3 1 3 4\n2 2 6',
        displayInput: 'lists = [[1,4,5],[1,3,4],[2,6]]',
        output: '1 1 2 3 4 4 5 6',
        displayOutput: '[1,1,2,3,4,4,5,6]',
        explanation: 'Merged in ascending order.'
      },
      {
        input: '1\n0\n',
        displayInput: 'lists = [[]]',
        output: '',
        displayOutput: '[]',
        explanation: 'Empty list.'
      }
    ],
    hints: [
      'Use a Min-Heap (priority queue) of size K holding the active head of each list.',
      'Extract min, append to result list, and push next node from that list into the heap.',
      'Achieves O(N log K) time complexity where N is total nodes.'
    ],
    starterCode: {
      python: `import sys\nimport heapq\n\ndef solve():\n    lines = sys.stdin.read().strip().splitlines()\n    if not lines: return\n    k = int(lines[0])\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int k = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int k; if (!(cin >> k)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const lines = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/).filter(Boolean);\n    if (!lines.length) return;\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['3\n3 1 4 5\n3 1 3 4\n2 2 6', '1\n0\n'],
    hiddenInputs: ['2\n1 1\n1 2', '3\n1 10\n1 5\n1 1'],
    solveFunction: (stdin) => {
      const lines = stdin.trim().split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const k = parseInt(lines[0], 10);
      const allVals = [];
      for (let i = 1; i <= k; i++) {
        const parts = lines[i].split(/\s+/).map(Number);
        const m = parts[0];
        for (let j = 1; j <= m; j++) allVals.push(parts[j]);
      }
      return allVals.sort((a, b) => a - b).join(' ');
    }
  }),

  // 19. LRU Cache (Least Recently Used) (Hard)
  createCanonicalProblem({
    problemId: 'dsa_linked-list_19',
    topicId: 'linked-list',
    order: 19,
    title: 'LRU Cache (Least Recently Used)',
    difficulty: 'Hard',
    tags: ['Linked List', 'Hash Table', 'Design'],
    statement: `Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.

Implement operations:
- \`get(key)\`: Return value if key exists, otherwise \`-1\`. Moves key to most recently used.
- \`put(key, value)\`: Update or insert key-value. If capacity exceeded, evict the least recently used key.

Given capacity and Q operations, output the result of each \`get\` operation.`,
    inputFormat: `First line: integers capacity and Q.
Next Q lines: operation (get key OR put key val).`,
    outputFormat: `Print the output of each get operation separated by spaces.`,
    constraints: ['1 <= capacity <= 3000', '1 <= Q <= 10^5'],
    examples: [
      {
        input: '2 6\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2\nget 3',
        displayInput: 'LRUCache(2), put(1,1), put(2,2), get(1), put(3,3), get(2), get(3)',
        output: '1 -1 3',
        displayOutput: '[1, -1, 3]',
        explanation: 'get(1) returns 1. put(3,3) evicts key 2. get(2) returns -1. get(3) returns 3.'
      }
    ],
    hints: [
      'Combine a Hash Map with a Doubly Linked List.',
      'Hash Map provides O(1) key-to-node lookup.',
      'Doubly Linked List allows O(1) node removal and insertion at head (most recently used).'
    ],
    starterCode: {
      python: `import sys\nfrom collections import OrderedDict\n\ndef solve():\n    lines = sys.stdin.read().strip().splitlines()\n    if not lines: return\n    cap, q = map(int, lines[0].split())\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int cap = sc.nextInt(), q = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <unordered_map>\n#include <list>\nusing namespace std;\nint main() {\n    int cap, q; if (!(cin >> cap >> q)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const lines = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/).filter(Boolean);\n    if (!lines.length) return;\n    const [cap, q] = lines[0].split(/\\s+/).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['2 6\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2\nget 3'],
    hiddenInputs: ['1 3\nput 2 1\nget 2\nget 1', '2 4\nput 1 1\nput 1 2\nget 1\nget 2'],
    solveFunction: (stdin) => {
      const lines = stdin.trim().split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const [cap, q] = lines[0].split(/\s+/).map(Number);
      const cache = new Map();
      const out = [];
      for (let i = 1; i <= q; i++) {
        const parts = lines[i].split(/\s+/);
        const op = parts[0];
        const key = parts[1];
        if (op === 'get') {
          if (!cache.has(key)) out.push(-1);
          else {
            const val = cache.get(key);
            cache.delete(key);
            cache.set(key, val);
            out.push(val);
          }
        } else if (op === 'put') {
          const val = parts[2];
          if (cache.has(key)) cache.delete(key);
          else if (cache.size >= cap) {
            const firstKey = cache.keys().next().value;
            cache.delete(firstKey);
          }
          cache.set(key, val);
        }
      }
      return out.join(' ');
    }
  }),

  // 20. LFU Cache (Least Frequently Used) (Hard)
  createCanonicalProblem({
    problemId: 'dsa_linked-list_20',
    topicId: 'linked-list',
    order: 20,
    title: 'LFU Cache (Least Frequently Used)',
    difficulty: 'Hard',
    tags: ['Linked List', 'Hash Table', 'Design'],
    statement: `Design and implement a data structure for a **Least Frequently Used (LFU) cache**.

Implement operations:
- \`get(key)\`: Return value if exists, else \`-1\`. Increments usage frequency.
- \`put(key, value)\`: Update or insert. When capacity is exceeded, evict the least frequently used key (tiebreak: least recently used among ties).

Output the result of each \`get\` operation separated by spaces.`,
    inputFormat: `First line: integers capacity and Q.
Next Q lines: operation (get key OR put key val).`,
    outputFormat: `Print the output of each get operation separated by spaces.`,
    constraints: ['1 <= capacity <= 10^4', '1 <= Q <= 10^5'],
    examples: [
      {
        input: '2 6\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2\nget 3',
        displayInput: 'LFUCache(2), put(1,1), put(2,2), get(1), put(3,3), get(2), get(3)',
        output: '1 -1 3',
        displayOutput: '[1, -1, 3]',
        explanation: 'key 1 used twice, key 2 used once. put(3,3) evicts least frequently used key 2.'
      }
    ],
    hints: [
      'Maintain two Hash Maps: key -> node, and frequency -> doubly linked list of nodes with that frequency.',
      'Maintain minFreq tracking the minimum current frequency.',
      'When eviction occurs, remove the least recently used node from the minFreq list.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    lines = sys.stdin.read().strip().splitlines()\n    if not lines: return\n    cap, q = map(int, lines[0].split())\n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int cap = sc.nextInt(), q = sc.nextInt();\n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <unordered_map>\nusing namespace std;\nint main() {\n    int cap, q; if (!(cin >> cap >> q)) return 0;\n    // Write your solution below\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const lines = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/).filter(Boolean);\n    if (!lines.length) return;\n    const [cap, q] = lines[0].split(/\\s+/).map(Number);\n    // Write your solution below\n}\nsolve();`
    },
    sampleInputs: ['2 6\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2\nget 3'],
    hiddenInputs: ['1 3\nput 1 10\nget 1\nget 2'],
    solveFunction: (stdin) => {
      const lines = stdin.trim().split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const [cap, q] = lines[0].split(/\s+/).map(Number);
      const vals = new Map();
      const freqs = new Map();
      const recency = new Map();
      let timer = 0;
      const out = [];
      for (let i = 1; i <= q; i++) {
        const parts = lines[i].split(/\s+/);
        const op = parts[0];
        const key = parts[1];
        timer++;
        if (op === 'get') {
          if (!vals.has(key)) out.push(-1);
          else {
            freqs.set(key, freqs.get(key) + 1);
            recency.set(key, timer);
            out.push(vals.get(key));
          }
        } else if (op === 'put') {
          const v = parts[2];
          if (vals.has(key)) {
            vals.set(key, v);
            freqs.set(key, freqs.get(key) + 1);
            recency.set(key, timer);
          } else {
            if (vals.size >= cap) {
              let evictKey = null, minF = Infinity, minT = Infinity;
              for (const [k, f] of freqs.entries()) {
                const tVal = recency.get(k);
                if (f < minF || (f === minF && tVal < minT)) {
                  minF = f;
                  minT = tVal;
                  evictKey = k;
                }
              }
              if (evictKey !== null) {
                vals.delete(evictKey);
                freqs.delete(evictKey);
                recency.delete(evictKey);
              }
            }
            vals.set(key, v);
            freqs.set(key, 1);
            recency.set(key, timer);
          }
        }
      }
      return out.join(' ');
    }
  })
];


/**
 * Canonical DSA Placement Problems: STACK (20 Questions)
 * 7 Easy, 9 Medium, 4 Hard
 */

import { createCanonicalProblem } from './topicProblemHelper.js';

export const STACK_PROBLEMS = [
  // 1. Valid Parentheses (Easy)
  createCanonicalProblem({
    problemId: 'dsa_stack_01',
    topicId: 'stack',
    order: 1,
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    tags: ['Stack', 'String'],
    statement: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    inputFormat: `First line contains string s.`,
    outputFormat: `Print 'true' if valid, else 'false'.`,
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only ()[]{}'],
    examples: [
      {
        input: '()',
        displayInput: 's = "()"',
        output: 'true',
        displayOutput: 'true',
        explanation: 'The brackets match correctly.'
      },
      {
        input: '()[]{}',
        displayInput: 's = "()[]{}"',
        output: 'true',
        displayOutput: 'true',
        explanation: 'All pairs are matched properly.'
      },
      {
        input: '(]',
        displayInput: 's = "(]"',
        output: 'false',
        displayOutput: 'false',
        explanation: 'Parenthesis and bracket do not match.'
      }
    ],
    hints: [
      'Use a stack to keep track of expected closing brackets.',
      'Whenever you encounter an opening bracket, push its matching closing bracket onto the stack.',
      'When you see a closing bracket, check if it matches the top of the stack and pop it. If not or stack is empty, return false.'
    ],
    starterCode: {
      python: `import sys

def isValid(s: str) -> bool:
    # Write your solution here
    return False

if __name__ == '__main__':
    s = sys.stdin.read().strip()
    print("true" if isValid(s) else "false")
`,
      javascript: `const fs = require('fs');

function isValid(s) {
    // Write your solution here
    return false;
}

const input = fs.readFileSync(0, 'utf-8').trim();
console.log(isValid(input) ? "true" : "false");
`,
      java: `import java.util.*;

public class Main {
    public static boolean isValid(String s) {
        // Write your solution here
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) {
            System.out.println("false");
            return;
        }
        String s = sc.next();
        System.out.println(isValid(s) ? "true" : "false");
    }
}
`,
      cpp: `#include <iostream>
#include <string>
#include <stack>
using namespace std;

bool isValid(string s) {
    // Write your solution here
    return false;
}

int main() {
    string s;
    if (cin >> s) {
        cout << (isValid(s) ? "true" : "false") << endl;
    }
    return 0;
}
`
    },
    solveFunction: (input) => {
      const s = input.trim();
      const stack = [];
      const map = { ')': '(', '}': '{', ']': '[' };
      for (const char of s) {
        if (char === '(' || char === '{' || char === '[') {
          stack.push(char);
        } else if (map[char]) {
          if (stack.length === 0 || stack.pop() !== map[char]) {
            return 'false';
          }
        }
      }
      return stack.length === 0 ? 'true' : 'false';
    },
    hiddenTestCases: [
      { input: '([{}])', expected: 'true' },
      { input: '((((', expected: 'false' },
      { input: '))))', expected: 'false' },
      { input: '{[()]}', expected: 'true' },
      { input: '{[(])}', expected: 'false' },
      { input: '()', expected: 'true' },
      { input: '[]', expected: 'true' },
      { input: '{}', expected: 'true' },
      { input: '(', expected: 'false' },
      { input: ']', expected: 'false' }
    ]
  }),

  // 2. Implement Queue using Stacks (Easy)
  createCanonicalProblem({
    problemId: 'dsa_stack_02',
    topicId: 'stack',
    order: 2,
    title: 'Implement Queue using Stacks',
    difficulty: 'Easy',
    tags: ['Stack', 'Design', 'Queue'],
    statement: `Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support all the functions of a normal queue: push, pop, and peek.

Given Q operations:
- push X: Pushes element X to the back of the queue.
- pop: Removes the element from the front of the queue and outputs it.
- peek: Returns the element at the front of the queue.`,
    inputFormat: `First line: integer Q.
Next Q lines: operations.`,
    outputFormat: `Print results of all pop and peek operations separated by spaces.`,
    constraints: ['1 <= Q <= 100', '1 <= X <= 1000'],
    examples: [
      {
        input: '5\npush 1\npush 2\npeek\npop\npeek',
        displayInput: 'ops = [push 1, push 2, peek, pop, peek]',
        output: '1 1 2',
        displayOutput: '1 1 2',
        explanation: 'peek gives 1, pop gives 1, peek gives 2.'
      },
      {
        input: '4\npush 10\npush 20\npop\npop',
        displayInput: 'ops = [push 10, push 20, pop, pop]',
        output: '10 20',
        displayOutput: '10 20',
        explanation: 'Queue pops in FIFO order: 10 then 20.'
      },
      {
        input: '3\npush 5\npeek\npop',
        displayInput: 'ops = [push 5, peek, pop]',
        output: '5 5',
        displayOutput: '5 5',
        explanation: 'peek returns 5, pop removes 5.'
      }
    ],
    hints: [
      'Maintain two stacks: inStack and outStack.',
      'For push: push onto inStack.',
      'For pop/peek: if outStack is empty, pop all elements from inStack and push them into outStack. Then operate on outStack.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const q = parseInt(lines[0], 10);
      const inStack = [];
      const outStack = [];
      const results = [];

      for (let i = 1; i <= q; i++) {
        if (!lines[i]) continue;
        const [cmd, val] = lines[i].trim().split(/\s+/);
        if (cmd === 'push') {
          inStack.push(val);
        } else if (cmd === 'pop') {
          if (outStack.length === 0) {
            while (inStack.length > 0) outStack.push(inStack.pop());
          }
          if (outStack.length > 0) results.push(outStack.pop());
        } else if (cmd === 'peek') {
          if (outStack.length === 0) {
            while (inStack.length > 0) outStack.push(inStack.pop());
          }
          if (outStack.length > 0) results.push(outStack[outStack.length - 1]);
        }
      }
      return results.join(' ');
    },
    hiddenTestCases: [
      { input: '3\npush 1\npush 2\npop', expected: '1' },
      { input: '6\npush 1\npush 2\npush 3\npop\npop\npop', expected: '1 2 3' },
      { input: '4\npush 100\npeek\npush 200\npeek', expected: '100 100' },
      { input: '5\npush 4\npush 8\npop\npush 12\npop', expected: '4 8' }
    ]
  }),

  // 3. Min Stack (Easy)
  createCanonicalProblem({
    problemId: 'dsa_stack_03',
    topicId: 'stack',
    order: 3,
    title: 'Min Stack',
    difficulty: 'Easy',
    tags: ['Stack', 'Design'],
    statement: `Design a stack that supports push, pop, top, and retrieving the minimum element in constant time O(1).

Operations:
- push X: Pushes element X onto the stack.
- pop: Removes the element on top of the stack.
- top: Gets the top element of the stack.
- getMin: Retrieves the minimum element in the stack.`,
    inputFormat: `First line: integer Q.
Next Q lines: operations.`,
    outputFormat: `Print results of all top and getMin operations separated by spaces.`,
    constraints: ['1 <= Q <= 1000', '-10^9 <= X <= 10^9'],
    examples: [
      {
        input: '7\npush -2\npush 0\npush -3\ngetMin\npop\ntop\ngetMin',
        displayInput: 'ops = [push -2, push 0, push -3, getMin, pop, top, getMin]',
        output: '-3 0 -2',
        displayOutput: '-3 0 -2',
        explanation: 'min is -3, pop removes -3, top is 0, min becomes -2.'
      },
      {
        input: '4\npush 1\npush 2\ntop\ngetMin',
        displayInput: 'ops = [push 1, push 2, top, getMin]',
        output: '2 1',
        displayOutput: '2 1',
        explanation: 'top is 2, min is 1.'
      },
      {
        input: '5\npush 5\npush 3\ngetMin\npop\ngetMin',
        displayInput: 'ops = [push 5, push 3, getMin, pop, getMin]',
        output: '3 5',
        displayOutput: '3 5',
        explanation: 'min is 3, after pop min is 5.'
      }
    ],
    hints: [
      'Store pairs in the stack: [val, current_min].',
      'When pushing x, the new min is min(x, stack.top().min).',
      'Both top and getMin become O(1) reads.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const q = parseInt(lines[0], 10);
      const stack = []; // pairs of [val, minSoFar]
      const results = [];

      for (let i = 1; i <= q; i++) {
        if (!lines[i]) continue;
        const [cmd, val] = lines[i].trim().split(/\s+/);
        if (cmd === 'push') {
          const v = parseInt(val, 10);
          const min = stack.length === 0 ? v : Math.min(v, stack[stack.length - 1][1]);
          stack.push([v, min]);
        } else if (cmd === 'pop') {
          if (stack.length > 0) stack.pop();
        } else if (cmd === 'top') {
          if (stack.length > 0) results.push(stack[stack.length - 1][0]);
        } else if (cmd === 'getMin') {
          if (stack.length > 0) results.push(stack[stack.length - 1][1]);
        }
      }
      return results.join(' ');
    },
    hiddenTestCases: [
      { input: '3\npush 10\ntop\ngetMin', expected: '10 10' },
      { input: '5\npush 2\npush 1\ngetMin\npop\ngetMin', expected: '1 2' },
      { input: '6\npush 5\npush 5\ngetMin\npop\ngetMin\ntop', expected: '5 5 5' }
    ]
  }),

  // 4. Baseball Game (Easy)
  createCanonicalProblem({
    problemId: 'dsa_stack_04',
    topicId: 'stack',
    order: 4,
    title: 'Baseball Game',
    difficulty: 'Easy',
    tags: ['Stack', 'Array', 'Simulation'],
    statement: `You are keeping the scores for a baseball game with strange rules. At the beginning of the game, you start with an empty record.

Given a list of strings operations, where operations[i] is the i-th operation:
- An integer x: Record a new score of x.
- '+': Record a new score that is the sum of the previous two scores.
- 'D': Record a new score that is double the previous score.
- 'C': Invalidate the previous score, removing it from the record.

Return the sum of all the scores on the record after applying all the operations.`,
    inputFormat: `First line: integer N.
Second line: N space-separated operation tokens.`,
    outputFormat: `Print the total score sum.`,
    constraints: ['1 <= operations.length <= 1000', 'operations[i] is "C", "D", "+", or an integer in [-3 * 10^4, 3 * 10^4]'],
    examples: [
      {
        input: '5\n5 2 C D +',
        displayInput: 'ops = ["5","2","C","D","+"]',
        output: '30',
        displayOutput: '30',
        explanation: 'Scores record: [5], [5,2], [5], [5,10], [5,10,15]. Total sum is 30.'
      },
      {
        input: '8\n5 -2 4 C D 9 + +',
        displayInput: 'ops = ["5","-2","4","C","D","9","+","+"]',
        output: '27',
        displayOutput: '27',
        explanation: 'Final record is [5, -2, -4, 9, 5, 14]. Sum is 27.'
      },
      {
        input: '1\n1',
        displayInput: 'ops = ["1"]',
        output: '1',
        displayOutput: '1',
        explanation: 'Only one score 1.'
      }
    ],
    hints: [
      'Use a stack of integers to maintain the active scores.',
      'For "+", peek the last two scores, sum them, and push the sum.',
      'For "D", double the last score and push.',
      'For "C", pop the last score.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const ops = lines.length > 1 ? lines[1].trim().split(/\s+/) : [];
      const stack = [];
      for (const op of ops) {
        if (op === '+') {
          stack.push(stack[stack.length - 1] + stack[stack.length - 2]);
        } else if (op === 'D') {
          stack.push(stack[stack.length - 1] * 2);
        } else if (op === 'C') {
          stack.pop();
        } else {
          stack.push(parseInt(op, 10));
        }
      }
      return stack.reduce((a, b) => a + b, 0).toString();
    },
    hiddenTestCases: [
      { input: '3\n10 D C', expected: '10' },
      { input: '4\n1 2 + D', expected: '9' },
      { input: '2\n-5 5', expected: '0' }
    ]
  }),

  // 5. Backspace String Compare (Easy)
  createCanonicalProblem({
    problemId: 'dsa_stack_05',
    topicId: 'stack',
    order: 5,
    title: 'Backspace String Compare',
    difficulty: 'Easy',
    tags: ['Stack', 'Two Pointers', 'String'],
    statement: `Given two strings s and t, return true if they are equal when both are typed into empty text editors. '#' means a backspace character.

Note that after backspacing an empty text, the text will continue to be empty.`,
    inputFormat: `First line: string s.
Second line: string t.`,
    outputFormat: `Print 'true' if s and t become identical, else 'false'.`,
    constraints: ['1 <= s.length, t.length <= 200', 's and t only contain lowercase letters and "#" characters.'],
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
      'Use a helper function that builds the final string using a stack.',
      'Iterate through the string: if character is not "#", push it; if "#", pop if non-empty.',
      'Compare the resulting stacks of both strings.'
    ],
    solveFunction: (input) => {
      const [s = '', t = ''] = input.trim().split(/\s+/);
      const build = (str) => {
        const stack = [];
        for (const ch of str) {
          if (ch === '#') {
            if (stack.length > 0) stack.pop();
          } else {
            stack.push(ch);
          }
        }
        return stack.join('');
      };
      return build(s) === build(t) ? 'true' : 'false';
    },
    hiddenTestCases: [
      { input: 'a##c\n#a#c', expected: 'true' },
      { input: 'xywrrmp\nxywrrmu#p', expected: 'true' },
      { input: 'a\naa#', expected: 'true' },
      { input: 'abc#d\nabcd', expected: 'false' }
    ]
  }),

  // 6. Remove All Adjacent Duplicates In String (Easy)
  createCanonicalProblem({
    problemId: 'dsa_stack_06',
    topicId: 'stack',
    order: 6,
    title: 'Remove All Adjacent Duplicates In String',
    difficulty: 'Easy',
    tags: ['Stack', 'String'],
    statement: `You are given a string s consisting of lowercase English letters. A duplicate removal consists of choosing two adjacent and equal letters and removing them.

We repeatedly make duplicate removals on s until we no longer can.

Return the final string after all such duplicate removals have been made.`,
    inputFormat: `First line contains string s.`,
    outputFormat: `Print the final string (or an empty line if completely empty).`,
    constraints: ['1 <= s.length <= 10^5', 's consists of lowercase English letters.'],
    examples: [
      {
        input: 'abbaca',
        displayInput: 's = "abbaca"',
        output: 'ca',
        displayOutput: '"ca"',
        explanation: '"bb" is removed yielding "aaca", then "aa" is removed yielding "ca".'
      },
      {
        input: 'azxxzy',
        displayInput: 's = "azxxzy"',
        output: 'ay',
        displayOutput: '"ay"',
        explanation: '"xx" is removed to get "azzy", then "zz" to get "ay".'
      },
      {
        input: 'aa',
        displayInput: 's = "aa"',
        output: '',
        displayOutput: '""',
        explanation: 'Both characters match and cancel out.'
      }
    ],
    hints: [
      'Iterate through the string with a stack.',
      'If the current character equals the top of the stack, pop from the stack.',
      'Otherwise, push the current character.'
    ],
    solveFunction: (input) => {
      const s = input.trim();
      const stack = [];
      for (const ch of s) {
        if (stack.length > 0 && stack[stack.length - 1] === ch) {
          stack.pop();
        } else {
          stack.push(ch);
        }
      }
      return stack.join('');
    },
    hiddenTestCases: [
      { input: 'aabbcc', expected: '' },
      { input: 'abccba', expected: '' },
      { input: 'abcdef', expected: 'abcdef' },
      { input: 'a', expected: 'a' }
    ]
  }),

  // 7. Next Greater Element I (Easy)
  createCanonicalProblem({
    problemId: 'dsa_stack_07',
    topicId: 'stack',
    order: 7,
    title: 'Next Greater Element I',
    difficulty: 'Easy',
    tags: ['Stack', 'Array', 'Hash Table', 'Monotonic Stack'],
    statement: `The next greater element of some element x in an array is the first greater element to its right in the same array.

You are given two distinct 0-indexed integer arrays nums1 and nums2, where nums1 is a subset of nums2.

For each 0 <= i < nums1.length, find the index j such that nums1[i] == nums2[j] and determine the next greater element of nums2[j] in nums2. If there is no next greater element, then the answer for this query is -1.

Return an array ans of length nums1.length.`,
    inputFormat: `First line: integer N (nums1 size).
Second line: N space-separated integers.
Third line: integer M (nums2 size).
Fourth line: M space-separated integers.`,
    outputFormat: `Print the answers for nums1 separated by spaces.`,
    constraints: ['1 <= nums1.length <= nums2.length <= 1000', '0 <= nums1[i], nums2[i] <= 10^4', 'All integers in nums1 and nums2 are unique.'],
    examples: [
      {
        input: '3\n4 1 2\n4\n1 3 4 2',
        displayInput: 'nums1 = [4,1,2], nums2 = [1,3,4,2]',
        output: '-1 3 -1',
        displayOutput: '[-1,3,-1]',
        explanation: '4 has no next greater (-1). 1 has next greater 3. 2 has no next greater (-1).'
      },
      {
        input: '2\n2 4\n4\n1 2 3 4',
        displayInput: 'nums1 = [2,4], nums2 = [1,2,3,4]',
        output: '3 -1',
        displayOutput: '[3,-1]',
        explanation: '2 has next greater 3. 4 has none (-1).'
      },
      {
        input: '1\n5\n3\n3 5 1',
        displayInput: 'nums1 = [5], nums2 = [3,5,1]',
        output: '-1',
        displayOutput: '[-1]',
        explanation: '5 is followed by 1, no greater element exists to the right.'
      }
    ],
    hints: [
      'Precompute the next greater element for every number in nums2 using a monotonic decreasing stack.',
      'As you iterate nums2, while stack is non-empty and current element > stack.top(), pop and map stack.top() -> current.',
      'Then answer each query in nums1 in O(1) via map lookup.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      const nums1 = n > 0 ? lines[1].trim().split(/\s+/).map(Number) : [];
      const m = parseInt(lines[2], 10);
      const nums2 = m > 0 ? lines[3].trim().split(/\s+/).map(Number) : [];

      const map = {};
      const stack = [];
      for (const num of nums2) {
        while (stack.length > 0 && stack[stack.length - 1] < num) {
          map[stack.pop()] = num;
        }
        stack.push(num);
      }
      return nums1.map((x) => (map[x] !== undefined ? map[x] : -1)).join(' ');
    },
    hiddenTestCases: [
      { input: '2\n1 3\n3\n1 2 3', expected: '2 -1' },
      { input: '1\n10\n1\n10', expected: '-1' },
      { input: '3\n2 1 4\n4\n4 2 1 3', expected: '3 3 -1' }
    ]
  }),

  // 8. Next Greater Element II (Circular Array) (Medium)
  createCanonicalProblem({
    problemId: 'dsa_stack_08',
    topicId: 'stack',
    order: 8,
    title: 'Next Greater Element II',
    difficulty: 'Medium',
    tags: ['Stack', 'Array', 'Monotonic Stack'],
    statement: `Given a circular integer array nums (i.e., the next element of nums[nums.length - 1] is nums[0]), return the next greater number for every element in nums.

The next greater number of a number x is the first greater number to its traversing-order next in the array, which means you could search circularly to find its next greater number. If it doesn't exist, return -1 for this number.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the next greater element for each index separated by spaces.`,
    constraints: ['1 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
    examples: [
      {
        input: '3\n1 2 1',
        displayInput: 'nums = [1,2,1]',
        output: '2 -1 2',
        displayOutput: '[2,-1,2]',
        explanation: 'Next greater for first 1 is 2. For 2, none exists (-1). For second 1, circularly next greater is 2.'
      },
      {
        input: '5\n1 2 3 4 3',
        displayInput: 'nums = [1,2,3,4,3]',
        output: '2 3 4 -1 4',
        displayOutput: '[2,3,4,-1,4]',
        explanation: 'All elements find greater except 4.'
      },
      {
        input: '1\n5',
        displayInput: 'nums = [5]',
        output: '-1',
        displayOutput: '[-1]',
        explanation: 'Only one element, so no greater element.'
      }
    ],
    hints: [
      'Simulate the circular array by traversing from 2*N - 1 down to 0.',
      'Maintain a monotonic decreasing stack of elements.',
      'Pop elements <= nums[i % N], set result to stack.top() if non-empty, then push nums[i % N].'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n === 0) return '';
      const nums = lines[1].trim().split(/\s+/).map(Number);
      const res = new Array(n).fill(-1);
      const stack = [];

      for (let i = 2 * n - 1; i >= 0; i--) {
        const val = nums[i % n];
        while (stack.length > 0 && stack[stack.length - 1] <= val) {
          stack.pop();
        }
        if (i < n) {
          if (stack.length > 0) res[i] = stack[stack.length - 1];
        }
        stack.push(val);
      }
      return res.join(' ');
    },
    hiddenTestCases: [
      { input: '4\n5 4 3 2', expected: '-1 5 5 5' },
      { input: '4\n1 1 1 1', expected: '-1 -1 -1 -1' },
      { input: '3\n3 8 4', expected: '8 -1 8' }
    ]
  }),

  // 9. Daily Temperatures (Medium)
  createCanonicalProblem({
    problemId: 'dsa_stack_09',
    topicId: 'stack',
    order: 9,
    title: 'Daily Temperatures',
    difficulty: 'Medium',
    tags: ['Stack', 'Array', 'Monotonic Stack'],
    statement: `Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the i-th day to get a warmer temperature. If there is no future day for which this is possible, keep answer[i] == 0 instead.`,
    inputFormat: `First line: integer N.
Second line: N space-separated daily temperatures.`,
    outputFormat: `Print the waiting days for each day separated by spaces.`,
    constraints: ['1 <= temperatures.length <= 10^5', '30 <= temperatures[i] <= 100'],
    examples: [
      {
        input: '8\n73 74 75 71 69 72 76 73',
        displayInput: 'temperatures = [73,74,75,71,69,72,76,73]',
        output: '1 1 4 2 1 1 0 0',
        displayOutput: '[1,1,4,2,1,1,0,0]',
        explanation: 'Waiting days to warmer day for each index.'
      },
      {
        input: '4\n30 40 50 60',
        displayInput: 'temperatures = [30,40,50,60]',
        output: '1 1 1 0',
        displayOutput: '[1,1,1,0]',
        explanation: 'Each next day is strictly warmer except the last.'
      },
      {
        input: '3\n30 60 90',
        displayInput: 'temperatures = [30,60,90]',
        output: '1 1 0',
        displayOutput: '[1,1,0]',
        explanation: 'Day 0 waits 1, day 1 waits 1, day 2 has none.'
      }
    ],
    hints: [
      'Maintain a monotonic decreasing stack storing the indices of days.',
      'When the current day temperature > temperature at stack top index, pop and calculate diff = curr_index - prev_index.',
      'Push current day index onto stack.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n === 0) return '';
      const temps = lines[1].trim().split(/\s+/).map(Number);
      const res = new Array(n).fill(0);
      const stack = [];

      for (let i = 0; i < n; i++) {
        while (stack.length > 0 && temps[i] > temps[stack[stack.length - 1]]) {
          const prevIdx = stack.pop();
          res[prevIdx] = i - prevIdx;
        }
        stack.push(i);
      }
      return res.join(' ');
    },
    hiddenTestCases: [
      { input: '3\n89 62 70', expected: '0 1 0' },
      { input: '5\n50 50 50 50 50', expected: '0 0 0 0 0' },
      { input: '1\n45', expected: '0' }
    ]
  }),

  // 10. Evaluate Reverse Polish Notation (Medium)
  createCanonicalProblem({
    problemId: 'dsa_stack_10',
    topicId: 'stack',
    order: 10,
    title: 'Evaluate Reverse Polish Notation',
    difficulty: 'Medium',
    tags: ['Stack', 'Array', 'Math'],
    statement: `You are given an array of strings tokens that represents an arithmetic expression in a Reverse Polish Notation (postfix).

Evaluate the expression. Return an integer that represents the value of the expression.

Note that:
- The valid operators are '+', '-', '*', and '/'.
- Each operand may be an integer or another expression.
- The division between two integers always truncates toward zero.`,
    inputFormat: `First line: integer N.
Second line: N space-separated tokens.`,
    outputFormat: `Print the evaluated integer value.`,
    constraints: ['1 <= tokens.length <= 10^4', 'tokens[i] is either an operator: "+", "-", "*", or "/", or an integer in [-200, 200]'],
    examples: [
      {
        input: '5\n2 1 + 3 *',
        displayInput: 'tokens = ["2","1","+","3","*"]',
        output: '9',
        displayOutput: '9',
        explanation: '((2 + 1) * 3) = 9'
      },
      {
        input: '5\n4 13 5 / +',
        displayInput: 'tokens = ["4","13","5","/","+"]',
        output: '6',
        displayOutput: '6',
        explanation: '(4 + (13 / 5)) = 6'
      },
      {
        input: '13\n10 6 9 3 + -11 * / * 17 + 5 +',
        displayInput: 'tokens = ["10","6","9","3","+","-11","*","/","*","17","+","5","+"]',
        output: '22',
        displayOutput: '22',
        explanation: 'Evaluates to 22.'
      }
    ],
    hints: [
      'Maintain an operand stack of numbers.',
      'When encountering an operator, pop the top two numbers b and a.',
      'Compute (a op b) and push the result back onto the stack.',
      'Remember division truncates toward zero (Math.trunc(a / b)).'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const tokens = lines.length > 1 ? lines[1].trim().split(/\s+/) : [];
      const stack = [];

      for (const t of tokens) {
        if (t === '+') {
          const b = stack.pop();
          const a = stack.pop();
          stack.push(a + b);
        } else if (t === '-') {
          const b = stack.pop();
          const a = stack.pop();
          stack.push(a - b);
        } else if (t === '*') {
          const b = stack.pop();
          const a = stack.pop();
          stack.push(a * b);
        } else if (t === '/') {
          const b = stack.pop();
          const a = stack.pop();
          stack.push(Math.trunc(a / b));
        } else {
          stack.push(parseInt(t, 10));
        }
      }
      return stack[0].toString();
    },
    hiddenTestCases: [
      { input: '3\n3 4 -', expected: '-1' },
      { input: '1\n42', expected: '42' },
      { input: '5\n15 7 1 1 + - /', expected: '3' }
    ]
  }),

  // 11. Online Stock Span (Medium)
  createCanonicalProblem({
    problemId: 'dsa_stack_11',
    topicId: 'stack',
    order: 11,
    title: 'Online Stock Span',
    difficulty: 'Medium',
    tags: ['Stack', 'Design', 'Monotonic Stack'],
    statement: `Design an algorithm that collects daily price quotes for some stock and returns the span of that stock's price for the current day.

The span of the stock's price in one day is the maximum number of consecutive days (starting from that day and going backward) for which the stock price was less than or equal to the price of that day.`,
    inputFormat: `First line: integer N.
Second line: N space-separated daily stock prices.`,
    outputFormat: `Print the span of each day's price separated by spaces.`,
    constraints: ['1 <= N <= 10^5', '1 <= price <= 10^5'],
    examples: [
      {
        input: '7\n100 80 60 70 60 75 85',
        displayInput: 'prices = [100, 80, 60, 70, 60, 75, 85]',
        output: '1 1 1 2 1 4 6',
        displayOutput: '[1, 1, 1, 2, 1, 4, 6]',
        explanation: 'At 70, span is 2 (70, 60). At 75, span is 4 (75, 60, 70, 60). At 85, span is 6.'
      },
      {
        input: '4\n10 20 30 40',
        displayInput: 'prices = [10, 20, 30, 40]',
        output: '1 2 3 4',
        displayOutput: '[1, 2, 3, 4]',
        explanation: 'Prices are strictly increasing so span increments each day.'
      },
      {
        input: '4\n40 30 20 10',
        displayInput: 'prices = [40, 30, 20, 10]',
        output: '1 1 1 1',
        displayOutput: '[1, 1, 1, 1]',
        explanation: 'Prices are strictly decreasing so span is 1 each day.'
      }
    ],
    hints: [
      'Maintain a monotonic decreasing stack of pairs: [price, span].',
      'For each new price, start span = 1.',
      'While stack top price <= current price, pop and add stack top span to current span.',
      'Push [price, span] onto stack.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n === 0) return '';
      const prices = lines[1].trim().split(/\s+/).map(Number);
      const stack = []; // [price, span]
      const spans = [];

      for (const p of prices) {
        let span = 1;
        while (stack.length > 0 && stack[stack.length - 1][0] <= p) {
          span += stack.pop()[1];
        }
        stack.push([p, span]);
        spans.push(span);
      }
      return spans.join(' ');
    },
    hiddenTestCases: [
      { input: '3\n31 41 48', expected: '1 2 3' },
      { input: '5\n10 10 10 10 10', expected: '1 2 3 4 5' },
      { input: '1\n100', expected: '1' }
    ]
  }),

  // 12. Simplify Path (Medium)
  createCanonicalProblem({
    problemId: 'dsa_stack_12',
    topicId: 'stack',
    order: 12,
    title: 'Simplify Path',
    difficulty: 'Medium',
    tags: ['Stack', 'String'],
    statement: `Given an absolute path for a Unix-style file system, which begins with a slash '/', transform this path into its simplified canonical path.

In Unix-style file system:
- A period '.' refers to the current directory.
- A double period '..' refers to the directory up a level.
- Multiple consecutive slashes '//' are treated as a single slash '/'.
- Any other format of periods (such as '...') are treated as file/directory names.`,
    inputFormat: `First line contains string path.`,
    outputFormat: `Print the simplified canonical path.`,
    constraints: ['1 <= path.length <= 3000', 'path consists of English letters, digits, period ".", slash "/" or "_".'],
    examples: [
      {
        input: '/home/',
        displayInput: 'path = "/home/"',
        output: '/home',
        displayOutput: '"/home"',
        explanation: 'Trailing slash removed.'
      },
      {
        input: '/../',
        displayInput: 'path = "/../"',
        output: '/',
        displayOutput: '"/"',
        explanation: 'Going up from root stays at root.'
      },
      {
        input: '/home//foo/',
        displayInput: 'path = "/home//foo/"',
        output: '/home/foo',
        displayOutput: '"/home/foo"',
        explanation: 'Multiple slashes reduced to single slash.'
      }
    ],
    hints: [
      'Split the path by "/".',
      'Iterate through the tokens: if empty or ".", do nothing.',
      'If "..", pop from stack if stack is not empty.',
      'Otherwise, push the token onto stack.',
      'Finally join stack with "/" preceded by "/".'
    ],
    solveFunction: (input) => {
      const path = input.trim();
      const parts = path.split('/');
      const stack = [];
      for (const p of parts) {
        if (!p || p === '.') continue;
        if (p === '..') {
          if (stack.length > 0) stack.pop();
        } else {
          stack.push(p);
        }
      }
      return '/' + stack.join('/');
    },
    hiddenTestCases: [
      { input: '/a/./b/../../c/', expected: '/c' },
      { input: '/a/../../b/../c//.//', expected: '/c' },
      { input: '/a//b////c/d//././/..', expected: '/a/b/c' },
      { input: '/...', expected: '/...' }
    ]
  }),

  // 13. Asteroid Collision (Medium)
  createCanonicalProblem({
    problemId: 'dsa_stack_13',
    topicId: 'stack',
    order: 13,
    title: 'Asteroid Collision',
    difficulty: 'Medium',
    tags: ['Stack', 'Array', 'Simulation'],
    statement: `We are given an array asteroids of integers representing asteroids in a row.

For each asteroid, the absolute value represents its size, and the sign represents its direction (positive meaning right, negative meaning left). Each asteroid moves at the same speed.

Find out the state of the asteroids after all collisions. If two asteroids meet, the smaller one explodes. If both are the same size, both explode. Two asteroids moving in the same direction will never meet.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the remaining asteroids separated by spaces (or empty line if none remain).`,
    constraints: ['2 <= asteroids.length <= 10^4', '-1000 <= asteroids[i] <= 1000', 'asteroids[i] != 0'],
    examples: [
      {
        input: '3\n5 10 -5',
        displayInput: 'asteroids = [5, 10, -5]',
        output: '5 10',
        displayOutput: '[5, 10]',
        explanation: '10 and -5 collide resulting in 10. 5 and 10 never collide.'
      },
      {
        input: '2\n8 -8',
        displayInput: 'asteroids = [8, -8]',
        output: '',
        displayOutput: '[]',
        explanation: 'Both 8 and -8 explode each other.'
      },
      {
        input: '3\n10 2 -5',
        displayInput: 'asteroids = [10, 2, -5]',
        output: '10',
        displayOutput: '[10]',
        explanation: '2 and -5 collide: 2 explodes, -5 continues. 10 and -5 collide: -5 explodes, 10 remains.'
      }
    ],
    hints: [
      'Collisions only happen when current asteroid is moving left (curr < 0) and top of stack is moving right (top > 0).',
      'Use a while loop to resolve collisions against stack top.',
      'If top < |curr|, top explodes (pop). If top == |curr|, both explode (pop and do not push). If top > |curr|, curr explodes.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n === 0) return '';
      const asteroids = lines[1].trim().split(/\s+/).map(Number);
      const stack = [];

      for (const a of asteroids) {
        let alive = true;
        while (alive && a < 0 && stack.length > 0 && stack[stack.length - 1] > 0) {
          const top = stack[stack.length - 1];
          if (top < -a) {
            stack.pop();
          } else if (top === -a) {
            stack.pop();
            alive = false;
          } else {
            alive = false;
          }
        }
        if (alive) {
          stack.push(a);
        }
      }
      return stack.join(' ');
    },
    hiddenTestCases: [
      { input: '3\n-2 -1 1 2', expected: '-2 -1 1 2' },
      { input: '3\n-2 -2 -2', expected: '-2 -2 -2' },
      { input: '4\n-2 -1 1 -2', expected: '-2 -1 -2' }
    ]
  }),

  // 14. Decode String (Medium)
  createCanonicalProblem({
    problemId: 'dsa_stack_14',
    topicId: 'stack',
    order: 14,
    title: 'Decode String',
    difficulty: 'Medium',
    tags: ['Stack', 'String', 'Recursion'],
    statement: `Given an encoded string, return its decoded string.

The encoding rule is: k[encoded_string], where the encoded_string inside the square brackets is being repeated exactly k times. Note that k is guaranteed to be a positive integer.

You may assume that the input string is always valid; no extra white spaces, square brackets are well-formed, etc.`,
    inputFormat: `First line: encoded string s.`,
    outputFormat: `Print decoded string.`,
    constraints: ['1 <= s.length <= 30', 's consists of lowercase English letters, digits, and square brackets "[]".', 'k is in range [1, 300]'],
    examples: [
      {
        input: '3[a]2[bc]',
        displayInput: 's = "3[a]2[bc]"',
        output: 'aaabcbc',
        displayOutput: '"aaabcbc"',
        explanation: '"a" repeated 3 times, "bc" repeated 2 times.'
      },
      {
        input: '3[a2[c]]',
        displayInput: 's = "3[a2[c]]"',
        output: 'accaccacc',
        displayOutput: '"accaccacc"',
        explanation: 'Inner "2[c]" becomes "cc", "a2[c]" is "acc", repeated 3 times is "accaccacc".'
      },
      {
        input: '2[abc]3[cd]ef',
        displayInput: 's = "2[abc]3[cd]ef"',
        output: 'abcabccdcdcdef',
        displayOutput: '"abcabccdcdcdef"',
        explanation: '"abc" twice, "cd" 3 times, followed by "ef".'
      }
    ],
    hints: [
      'Maintain two stacks: countStack and stringStack.',
      'When you see digits, build the number k.',
      'When you see "[", push current k and current string onto their respective stacks, and reset them.',
      'When you see "]", pop the count and previous string, and repeat the current string count times.'
    ],
    solveFunction: (input) => {
      const s = input.trim();
      const countStack = [];
      const stringStack = [];
      let currentStr = '';
      let k = 0;

      for (const ch of s) {
        if (ch >= '0' && ch <= '9') {
          k = k * 10 + parseInt(ch, 10);
        } else if (ch === '[') {
          countStack.push(k);
          stringStack.push(currentStr);
          currentStr = '';
          k = 0;
        } else if (ch === ']') {
          const repeat = countStack.pop();
          const prevStr = stringStack.pop();
          currentStr = prevStr + currentStr.repeat(repeat);
        } else {
          currentStr += ch;
        }
      }
      return currentStr;
    },
    hiddenTestCases: [
      { input: '1[a]', expected: 'a' },
      { input: '2[2[y]]', expected: 'yyyy' },
      { input: '10[a]', expected: 'aaaaaaaaaa' }
    ]
  }),

  // 15. 132 Pattern (Medium)
  createCanonicalProblem({
    problemId: 'dsa_stack_15',
    topicId: 'stack',
    order: 15,
    title: '132 Pattern',
    difficulty: 'Medium',
    tags: ['Stack', 'Array', 'Binary Search', 'Monotonic Stack'],
    statement: `Given an array of n integers nums, a 132 pattern is a subsequence of three integers nums[i], nums[j] and nums[k] such that i < j < k and nums[i] < nums[k] < nums[j].

Return true if there is a 132 pattern in nums, otherwise, return false.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print 'true' if 132 pattern exists, else 'false'.`,
    constraints: ['1 <= n <= 2 * 10^5', '-10^9 <= nums[i] <= 10^9'],
    examples: [
      {
        input: '4\n1 2 3 4',
        displayInput: 'nums = [1, 2, 3, 4]',
        output: 'false',
        displayOutput: 'false',
        explanation: 'There is no 132 pattern; sequence is strictly increasing.'
      },
      {
        input: '4\n3 1 4 2',
        displayInput: 'nums = [3, 1, 4, 2]',
        output: 'true',
        displayOutput: 'true',
        explanation: 'Indices (1, 2, 3) form [1, 4, 2] which is a 132 pattern.'
      },
      {
        input: '4\n-1 3 2 0',
        displayInput: 'nums = [-1, 3, 2, 0]',
        output: 'true',
        displayOutput: 'true',
        explanation: 'Three 132 patterns exist, e.g. [-1, 3, 2].'
      }
    ],
    hints: [
      'Scan the array from right to left while maintaining a monotonic decreasing stack.',
      'Keep track of candidate for "2" (nums[k]), initialized to -Infinity.',
      'Whenever nums[i] < candidate, you have found a 132 pattern!'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n < 3) return 'false';
      const nums = lines[1].trim().split(/\s+/).map(Number);

      const stack = [];
      let s3 = -Infinity; // represents nums[k] ("2")

      for (let i = n - 1; i >= 0; i--) {
        if (nums[i] < s3) return 'true';
        while (stack.length > 0 && stack[stack.length - 1] < nums[i]) {
          s3 = stack.pop();
        }
        stack.push(nums[i]);
      }
      return 'false';
    },
    hiddenTestCases: [
      { input: '3\n1 2 3', expected: 'false' },
      { input: '3\n3 5 0', expected: 'false' },
      { input: '5\n1 0 1 -4 -3', expected: 'false' },
      { input: '6\n3 5 4 1 2 0', expected: 'true' }
    ]
  }),

  // 16. Minimum Add to Make Parentheses Valid (Medium)
  createCanonicalProblem({
    problemId: 'dsa_stack_16',
    topicId: 'stack',
    order: 16,
    title: 'Minimum Add to Make Parentheses Valid',
    difficulty: 'Medium',
    tags: ['Stack', 'String', 'Greedy'],
    statement: `A parentheses string is valid if and only if:
1. It is the empty string,
2. It can be written as AB (A concatenated with B), where A and B are valid strings, or
3. It can be written as (A), where A is a valid string.

You are given a parentheses string s. In one move, you can insert a parenthesis at any position of the string.

Return the minimum number of moves required to make s valid.`,
    inputFormat: `First line: string s.`,
    outputFormat: `Print the minimum number of insertions.`,
    constraints: ['1 <= s.length <= 1000', 's[i] is either "(" or ")".'],
    examples: [
      {
        input: '())',
        displayInput: 's = "())"',
        output: '1',
        displayOutput: '1',
        explanation: 'Add one "(" at the front.'
      },
      {
        input: '(((',
        displayInput: 's = "((("',
        output: '3',
        displayOutput: '3',
        explanation: 'Add three ")" at the end.'
      },
      {
        input: '()',
        displayInput: 's = "()"',
        output: '0',
        displayOutput: '0',
        explanation: 'Already valid.'
      }
    ],
    hints: [
      'Track open bracket count: increment for "(", decrement for ")".',
      'If count drops below 0 upon seeing ")", we need to insert an opening parenthesis, so increment additions needed and reset count to 0.',
      'At the end, total additions = needed + remaining open count.'
    ],
    solveFunction: (input) => {
      const s = input.trim();
      let open = 0;
      let added = 0;
      for (const ch of s) {
        if (ch === '(') {
          open++;
        } else {
          if (open > 0) open--;
          else added++;
        }
      }
      return (added + open).toString();
    },
    hiddenTestCases: [
      { input: '))))', expected: '4' },
      { input: '()()()', expected: '0' },
      { input: '((()', expected: '2' }
    ]
  }),

  // 17. Largest Rectangle in Histogram (Hard)
  createCanonicalProblem({
    problemId: 'dsa_stack_17',
    topicId: 'stack',
    order: 17,
    title: 'Largest Rectangle in Histogram',
    difficulty: 'Hard',
    tags: ['Stack', 'Array', 'Monotonic Stack'],
    statement: `Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.`,
    inputFormat: `First line: integer N.
Second line: N space-separated non-negative integers.`,
    outputFormat: `Print the largest rectangle area.`,
    constraints: ['1 <= heights.length <= 10^5', '0 <= heights[i] <= 10^4'],
    examples: [
      {
        input: '6\n2 1 5 6 2 3',
        displayInput: 'heights = [2,1,5,6,2,3]',
        output: '10',
        displayOutput: '10',
        explanation: 'The largest rectangle is formed between heights 5 and 6 with area 2 * 5 = 10.'
      },
      {
        input: '2\n2 4',
        displayInput: 'heights = [2,4]',
        output: '4',
        displayOutput: '4',
        explanation: 'Area 4 is obtained with single bar of height 4.'
      },
      {
        input: '1\n1',
        displayInput: 'heights = [1]',
        output: '1',
        displayOutput: '1',
        explanation: 'Only one bar with area 1.'
      }
    ],
    hints: [
      'Maintain a monotonic increasing stack storing bar indices.',
      'When encountering a bar shorter than the bar at stack top, pop the top and calculate the area with that height.',
      'Width is (i - stack.top() - 1) if stack is not empty, else i.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n === 0) return '0';
      const heights = lines[1].trim().split(/\s+/).map(Number);

      const stack = [];
      let maxArea = 0;

      for (let i = 0; i <= n; i++) {
        const h = i === n ? 0 : heights[i];
        while (stack.length > 0 && heights[stack[stack.length - 1]] > h) {
          const height = heights[stack.pop()];
          const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
          maxArea = Math.max(maxArea, height * width);
        }
        stack.push(i);
      }
      return maxArea.toString();
    },
    hiddenTestCases: [
      { input: '4\n6 7 5 2', expected: '15' },
      { input: '5\n1 1 1 1 1', expected: '5' },
      { input: '3\n2 1 2', expected: '3' },
      { input: '5\n5 4 3 2 1', expected: '9' }
    ]
  }),

  // 18. Maximal Rectangle (Hard)
  createCanonicalProblem({
    problemId: 'dsa_stack_18',
    topicId: 'stack',
    order: 18,
    title: 'Maximal Rectangle',
    difficulty: 'Hard',
    tags: ['Stack', 'Array', 'Dynamic Programming', 'Matrix', 'Monotonic Stack'],
    statement: `Given a rows x cols binary matrix filled with 0's and 1's, find the largest rectangle containing only 1's and return its area.`,
    inputFormat: `First line: two integers R and C.
Next R lines: C space-separated characters ('0' or '1').`,
    outputFormat: `Print the maximum area.`,
    constraints: ['1 <= R, C <= 200', 'matrix[i][j] is "0" or "1".'],
    examples: [
      {
        input: '4 5\n1 0 1 0 0\n1 0 1 1 1\n1 1 1 1 1\n1 0 0 1 0',
        displayInput: 'matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]',
        output: '6',
        displayOutput: '6',
        explanation: 'The maximal rectangle has area 6.'
      },
      {
        input: '1 1\n0',
        displayInput: 'matrix = [["0"]]',
        output: '0',
        displayOutput: '0',
        explanation: 'No 1s in the matrix.'
      },
      {
        input: '1 1\n1',
        displayInput: 'matrix = [["1"]]',
        output: '1',
        displayOutput: '1',
        explanation: 'Only single element 1 with area 1.'
      }
    ],
    hints: [
      'Reduce this problem to "Largest Rectangle in Histogram" row by row.',
      'Maintain an array of heights of size C. For each row, if matrix[r][c] == "1", heights[c] += 1; else heights[c] = 0.',
      'Calculate largest rectangle in histogram for each row and take the maximum.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const [r, c] = lines[0].trim().split(/\s+/).map(Number);
      if (r === 0 || c === 0) return '0';

      const heights = new Array(c).fill(0);
      let maxArea = 0;

      const largestHistogram = (hArr) => {
        const stack = [];
        let best = 0;
        for (let i = 0; i <= hArr.length; i++) {
          const h = i === hArr.length ? 0 : hArr[i];
          while (stack.length > 0 && hArr[stack[stack.length - 1]] > h) {
            const height = hArr[stack.pop()];
            const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
            best = Math.max(best, height * width);
          }
          stack.push(i);
        }
        return best;
      };

      for (let i = 0; i < r; i++) {
        const row = lines[i + 1].trim().split(/\s+/);
        for (let j = 0; j < c; j++) {
          heights[j] = row[j] === '1' ? heights[j] + 1 : 0;
        }
        maxArea = Math.max(maxArea, largestHistogram(heights));
      }
      return maxArea.toString();
    },
    hiddenTestCases: [
      { input: '2 2\n1 1\n1 1', expected: '4' },
      { input: '3 3\n0 0 0\n0 0 0\n0 0 0', expected: '0' },
      { input: '2 3\n1 1 1\n0 1 0', expected: '3' }
    ]
  }),

  // 19. Trapping Rain Water (Stack) (Hard)
  createCanonicalProblem({
    problemId: 'dsa_stack_19',
    topicId: 'stack',
    order: 19,
    title: 'Trapping Rain Water (Stack)',
    difficulty: 'Hard',
    tags: ['Stack', 'Array', 'Two Pointers', 'Monotonic Stack'],
    statement: `Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining. Implement using a monotonic stack.`,
    inputFormat: `First line: integer N.
Second line: N space-separated non-negative integers.`,
    outputFormat: `Print the total units of trapped rain water.`,
    constraints: ['1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    examples: [
      {
        input: '12\n0 1 0 2 1 0 1 3 2 1 2 1',
        displayInput: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        displayOutput: '6',
        explanation: '6 units of rain water are trapped.'
      },
      {
        input: '6\n4 2 0 3 2 5',
        displayInput: 'height = [4,2,0,3,2,5]',
        output: '9',
        displayOutput: '9',
        explanation: '9 units of water are trapped.'
      },
      {
        input: '3\n3 0 3',
        displayInput: 'height = [3,0,3]',
        output: '3',
        displayOutput: '3',
        explanation: 'Valley between index 0 and 2 traps 3 units.'
      }
    ],
    hints: [
      'Use a stack to store indices of the bars.',
      'While stack is non-empty and current bar > bar at stack top, pop the bottom of the basin.',
      'If stack is still non-empty, distance = current - stack.top() - 1, bounded_height = min(height[current], height[stack.top()]) - height[bottom], water += distance * bounded_height.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n === 0) return '0';
      const heights = lines[1].trim().split(/\s+/).map(Number);

      const stack = [];
      let totalWater = 0;

      for (let i = 0; i < n; i++) {
        while (stack.length > 0 && heights[i] > heights[stack[stack.length - 1]]) {
          const bottom = stack.pop();
          if (stack.length === 0) break;
          const left = stack[stack.length - 1];
          const width = i - left - 1;
          const boundedHeight = Math.min(heights[i], heights[left]) - heights[bottom];
          totalWater += width * boundedHeight;
        }
        stack.push(i);
      }
      return totalWater.toString();
    },
    hiddenTestCases: [
      { input: '3\n2 1 2', expected: '1' },
      { input: '4\n3 2 1 0', expected: '0' },
      { input: '5\n5 0 0 0 5', expected: '15' }
    ]
  }),

  // 20. Basic Calculator (Hard)
  createCanonicalProblem({
    problemId: 'dsa_stack_20',
    topicId: 'stack',
    order: 20,
    title: 'Basic Calculator',
    difficulty: 'Hard',
    tags: ['Stack', 'Math', 'String'],
    statement: `Given a string s representing a valid expression, implement a basic calculator to evaluate it, and return the result of the evaluation.

Note: You are not allowed to use any built-in function which evaluates strings as mathematical expressions, such as eval(). The expression can contain '(', ')', '+', '-', digits, and spaces.`,
    inputFormat: `First line contains the expression string s.`,
    outputFormat: `Print the evaluated integer result.`,
    constraints: ['1 <= s.length <= 3 * 10^5', 's consists of digits, "+", "-", "(", ")", and " ".'],
    examples: [
      {
        input: '1 + 1',
        displayInput: 's = "1 + 1"',
        output: '2',
        displayOutput: '2',
        explanation: '1 + 1 = 2.'
      },
      {
        input: ' 2-1 + 2 ',
        displayInput: 's = " 2-1 + 2 "',
        output: '3',
        displayOutput: '3',
        explanation: '2 - 1 + 2 = 3.'
      },
      {
        input: '(1+(4+5+2)-3)+(6+8)',
        displayInput: 's = "(1+(4+5+2)-3)+(6+8)"',
        output: '23',
        displayOutput: '23',
        explanation: 'Parentheses evaluated in correct order.'
      }
    ],
    hints: [
      'Maintain running sum and sign (+1 or -1).',
      'When seeing "(", push the current sum and current sign onto the stack, and reset sum to 0 and sign to 1.',
      'When seeing ")", multiply current sum by popped sign and add popped previous sum.'
    ],
    solveFunction: (input) => {
      const s = input.trim();
      const stack = [];
      let res = 0;
      let sign = 1;
      let n = s.length;

      for (let i = 0; i < n; i++) {
        const ch = s[i];
        if (ch >= '0' && ch <= '9') {
          let num = 0;
          while (i < n && s[i] >= '0' && s[i] <= '9') {
            num = num * 10 + parseInt(s[i], 10);
            i++;
          }
          i--;
          res += sign * num;
        } else if (ch === '+') {
          sign = 1;
        } else if (ch === '-') {
          sign = -1;
        } else if (ch === '(') {
          stack.push(res);
          stack.push(sign);
          res = 0;
          sign = 1;
        } else if (ch === ')') {
          const prevSign = stack.pop();
          const prevRes = stack.pop();
          res = prevRes + prevSign * res;
        }
      }
      return res.toString();
    },
    hiddenTestCases: [
      { input: '2147483647', expected: '2147483647' },
      { input: '1 - (5)', expected: '-4' },
      { input: '(7)-(0)+(4)', expected: '11' }
    ]
  })
];


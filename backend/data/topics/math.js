/**
 * Canonical DSA Placement Problems: MATH (20 Questions)
 * 7 Easy, 9 Medium, 4 Hard
 */

import { createCanonicalProblem } from './topicProblemHelper.js';

export const MATH_PROBLEMS = [
  // 1. Palindrome Number (Easy)
  createCanonicalProblem({
    problemId: 'dsa_math_01',
    topicId: 'math',
    order: 1,
    title: 'Palindrome Number',
    difficulty: 'Easy',
    tags: ['Math'],
    statement: `Given an integer x, return true if x is a palindrome, and false otherwise.`,
    inputFormat: `First line: an integer X.`,
    outputFormat: `Print 'true' if palindrome, else 'false'.`,
    constraints: ['-2^31 <= x <= 2^31 - 1'],
    examples: [
      {
        input: '121',
        displayInput: 'x = 121',
        output: 'true',
        displayOutput: 'true',
        explanation: '121 reads as 121 from left to right and from right to left.'
      },
      {
        input: '-121',
        displayInput: 'x = -121',
        output: 'false',
        displayOutput: 'false',
        explanation: 'From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.'
      },
      {
        input: '10',
        displayInput: 'x = 10',
        output: 'false',
        displayOutput: 'false',
        explanation: 'Reads 01 from right to left.'
      }
    ],
    hints: [
      'Negative numbers are never palindromes.',
      'Numbers ending in 0 (other than 0 itself) cannot be palindromes.',
      'Reverse the second half of the number and compare with the first half.'
    ],
    solveFunction: (input) => {
      const x = parseInt(input.trim(), 10);
      if (x < 0 || (x % 10 === 0 && x !== 0)) return 'false';
      let rev = 0;
      let temp = x;
      while (temp > rev) {
        rev = rev * 10 + (temp % 10);
        temp = Math.floor(temp / 10);
      }
      return (temp === rev || temp === Math.floor(rev / 10)) ? 'true' : 'false';
    },
    hiddenTestCases: [
      { input: '0', expected: 'true' },
      { input: '12321', expected: 'true' },
      { input: '12345', expected: 'false' }
    ]
  }),

  // 2. Roman to Integer (Easy)
  createCanonicalProblem({
    problemId: 'dsa_math_02',
    topicId: 'math',
    order: 2,
    title: 'Roman to Integer',
    difficulty: 'Easy',
    tags: ['Hash Table', 'Math', 'String'],
    statement: `Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.
- I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000

Given a roman numeral, convert it to an integer.`,
    inputFormat: `First line: valid Roman numeral string S.`,
    outputFormat: `Print integer value.`,
    constraints: ['1 <= s.length <= 15', 's contains only the characters ("I", "V", "X", "L", "C", "D", "M").'],
    examples: [
      {
        input: 'III',
        displayInput: 's = "III"',
        output: '3',
        displayOutput: '3',
        explanation: 'III = 3.'
      },
      {
        input: 'LVIII',
        displayInput: 's = "LVIII"',
        output: '58',
        displayOutput: '58',
        explanation: 'L = 50, V = 5, III = 3.'
      },
      {
        input: 'MCMXCIV',
        displayInput: 's = "MCMXCIV"',
        output: '1994',
        displayOutput: '1994',
        explanation: 'M = 1000, CM = 900, XC = 90 and IV = 4.'
      }
    ],
    hints: [
      'Iterate through the string.',
      'If current numeral value is smaller than next numeral value, subtract it (e.g. IV -> -1 + 5 = 4).',
      'Otherwise add it.'
    ],
    solveFunction: (input) => {
      const s = input.trim();
      const val = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
      let sum = 0;
      for (let i = 0; i < s.length; i++) {
        const cur = val[s[i]];
        const next = val[s[i + 1]] || 0;
        if (cur < next) {
          sum -= cur;
        } else {
          sum += cur;
        }
      }
      return sum.toString();
    },
    hiddenTestCases: [
      { input: 'IV', expected: '4' },
      { input: 'IX', expected: '9' },
      { input: 'XL', expected: '40' }
    ]
  }),

  // 3. Power of Three (Easy)
  createCanonicalProblem({
    problemId: 'dsa_math_03',
    topicId: 'math',
    order: 3,
    title: 'Power of Three',
    difficulty: 'Easy',
    tags: ['Math', 'Recursion'],
    statement: `Given an integer n, return true if it is a power of three. Otherwise, return false.

An integer n is a power of three, if there exists an integer x such that n == 3^x.`,
    inputFormat: `First line: integer N.`,
    outputFormat: `Print 'true' if power of three, else 'false'.`,
    constraints: ['-2^31 <= n <= 2^31 - 1'],
    examples: [
      {
        input: '27',
        displayInput: 'n = 27',
        output: 'true',
        displayOutput: 'true',
        explanation: '27 = 3^3.'
      },
      {
        input: '0',
        displayInput: 'n = 0',
        output: 'false',
        displayOutput: 'false',
        explanation: 'There is no x where 3^x = 0.'
      },
      {
        input: '-1',
        displayInput: 'n = -1',
        output: 'false',
        displayOutput: 'false',
        explanation: 'Powers of three are strictly positive.'
      }
    ],
    hints: [
      'The largest 32-bit signed integer power of 3 is 3^19 = 1162261467.',
      'Since 3 is a prime number, n is a power of 3 if and only if n > 0 and 1162261467 % n == 0.'
    ],
    solveFunction: (input) => {
      const n = parseInt(input.trim(), 10);
      return (n > 0 && 1162261467 % n === 0) ? 'true' : 'false';
    },
    hiddenTestCases: [
      { input: '1', expected: 'true' },
      { input: '9', expected: 'true' },
      { input: '45', expected: 'false' }
    ]
  }),

  // 4. Excel Sheet Column Title (Easy)
  createCanonicalProblem({
    problemId: 'dsa_math_04',
    topicId: 'math',
    order: 4,
    title: 'Excel Sheet Column Title',
    difficulty: 'Easy',
    tags: ['Math', 'String'],
    statement: `Given an integer columnNumber, return its corresponding column title as it appears in an Excel sheet.

For example:
A -> 1, B -> 2, C -> 3, ..., Z -> 26, AA -> 27, AB -> 28, ...`,
    inputFormat: `First line: positive integer columnNumber.`,
    outputFormat: `Print Excel column title.`,
    constraints: ['1 <= columnNumber <= 2^31 - 1'],
    examples: [
      {
        input: '1',
        displayInput: 'columnNumber = 1',
        output: 'A',
        displayOutput: '"A"',
        explanation: '1 -> A.'
      },
      {
        input: '28',
        displayInput: 'columnNumber = 28',
        output: 'AB',
        displayOutput: '"AB"',
        explanation: '28 -> AB.'
      },
      {
        input: '701',
        displayInput: 'columnNumber = 701',
        output: 'ZY',
        displayOutput: '"ZY"',
        explanation: '701 -> ZY.'
      }
    ],
    hints: [
      'This is base 26 conversion, but 1-indexed rather than 0-indexed.',
      'In each step, subtract 1 from columnNumber before taking modulo 26: remainder = (columnNumber - 1) % 26.',
      'Map remainder to String.fromCharCode(65 + remainder).'
    ],
    solveFunction: (input) => {
      let n = parseInt(input.trim(), 10);
      let res = '';
      while (n > 0) {
        n--;
        const rem = n % 26;
        res = String.fromCharCode(65 + rem) + res;
        n = Math.floor(n / 26);
      }
      return res;
    },
    hiddenTestCases: [
      { input: '26', expected: 'Z' },
      { input: '27', expected: 'AA' },
      { input: '52', expected: 'AZ' }
    ]
  }),

  // 5. Add Digits (Easy)
  createCanonicalProblem({
    problemId: 'dsa_math_05',
    topicId: 'math',
    order: 5,
    title: 'Add Digits',
    difficulty: 'Easy',
    tags: ['Math', 'Simulation', 'Number Theory'],
    statement: `Given an integer num, repeatedly add all its digits until the result has only one digit, and return it.`,
    inputFormat: `First line: non-negative integer N.`,
    outputFormat: `Print single-digit digital root.`,
    constraints: ['0 <= num <= 2^31 - 1'],
    examples: [
      {
        input: '38',
        displayInput: 'num = 38',
        output: '2',
        displayOutput: '2',
        explanation: '3 + 8 = 11, 1 + 1 = 2.'
      },
      {
        input: '0',
        displayInput: 'num = 0',
        output: '0',
        displayOutput: '0',
        explanation: 'Digital root of 0 is 0.'
      },
      {
        input: '9',
        displayInput: 'num = 9',
        output: '9',
        displayOutput: '9',
        explanation: 'Already single digit.'
      }
    ],
    hints: [
      'Digital root formula: if num == 0 return 0.',
      'If num % 9 == 0 return 9.',
      'Else return num % 9.'
    ],
    solveFunction: (input) => {
      const num = parseInt(input.trim(), 10);
      if (num === 0) return '0';
      const mod = num % 9;
      return (mod === 0 ? 9 : mod).toString();
    },
    hiddenTestCases: [
      { input: '18', expected: '9' },
      { input: '100', expected: '1' }
    ]
  }),

  // 6. Count Primes (Easy)
  createCanonicalProblem({
    problemId: 'dsa_math_06',
    topicId: 'math',
    order: 6,
    title: 'Count Primes',
    difficulty: 'Easy',
    tags: ['Array', 'Math', 'Enumeration', 'Number Theory'],
    statement: `Given an integer n, return the number of prime numbers that are strictly less than n.`,
    inputFormat: `First line: non-negative integer N.`,
    outputFormat: `Print count of primes strictly less than N.`,
    constraints: ['0 <= n <= 5 * 10^6'],
    examples: [
      {
        input: '10',
        displayInput: 'n = 10',
        output: '4',
        displayOutput: '4',
        explanation: 'There are 4 prime numbers less than 10: 2, 3, 5, 7.'
      },
      {
        input: '0',
        displayInput: 'n = 0',
        output: '0',
        displayOutput: '0',
        explanation: 'No primes less than 0.'
      },
      {
        input: '1',
        displayInput: 'n = 1',
        output: '0',
        displayOutput: '0',
        explanation: 'No primes less than 1.'
      }
    ],
    hints: [
      'Use Sieve of Eratosthenes.',
      'Create a boolean array isPrime of size n initialized to true.',
      'For i from 2 up to sqrt(n): if isPrime[i], mark all i*i, i*i + i, ... as false.',
      'Count true values from 2 to n - 1.'
    ],
    solveFunction: (input) => {
      const n = parseInt(input.trim(), 10);
      if (n <= 2) return '0';

      const isPrime = new Uint8Array(n);
      isPrime.fill(1);
      isPrime[0] = 0;
      isPrime[1] = 0;

      for (let i = 2; i * i < n; i++) {
        if (isPrime[i]) {
          for (let j = i * i; j < n; j += i) {
            isPrime[j] = 0;
          }
        }
      }

      let count = 0;
      for (let i = 2; i < n; i++) {
        if (isPrime[i]) count++;
      }
      return count.toString();
    },
    hiddenTestCases: [
      { input: '2', expected: '0' },
      { input: '3', expected: '1' },
      { input: '20', expected: '8' }
    ]
  }),

  // 7. Happy Number (Easy)
  createCanonicalProblem({
    problemId: 'dsa_math_07',
    topicId: 'math',
    order: 7,
    title: 'Happy Number',
    difficulty: 'Easy',
    tags: ['Hash Table', 'Math', 'Two Pointers'],
    statement: `Write an algorithm to determine if a number n is happy.

A happy number is a number defined by the following process:
- Starting with any positive integer, replace the number by the sum of the squares of its digits.
- Repeat the process until the number equals 1 (where it will stay), or it loops endlessly in a cycle which does not include 1.
- Those numbers for which this process ends in 1 are happy.

Return true if n is a happy number, and false if not.`,
    inputFormat: `First line: positive integer N.`,
    outputFormat: `Print 'true' if happy, else 'false'.`,
    constraints: ['1 <= n <= 2^31 - 1'],
    examples: [
      {
        input: '19',
        displayInput: 'n = 19',
        output: 'true',
        displayOutput: 'true',
        explanation: '1^2 + 9^2 = 82; 8^2 + 2^2 = 68; 6^2 + 8^2 = 100; 1^2 + 0^2 + 0^2 = 1.'
      },
      {
        input: '2',
        displayInput: 'n = 2',
        output: 'false',
        displayOutput: 'false',
        explanation: 'Enters endless cycle: 4 -> 16 -> 37 -> 58 -> 89 -> 145 -> 42 -> 20 -> 4.'
      },
      {
        input: '1',
        displayInput: 'n = 1',
        output: 'true',
        displayOutput: 'true',
        explanation: '1 is trivially happy.'
      }
    ],
    hints: [
      'Write a helper sumOfSquares(n).',
      'Use Floyd cycle detection (slow and fast pointers), or a Set of seen numbers.',
      'If fast reaches 1, return true. If slow == fast, cycle detected, return false.'
    ],
    solveFunction: (input) => {
      let n = parseInt(input.trim(), 10);
      const getNext = (x) => {
        let sum = 0;
        while (x > 0) {
          const d = x % 10;
          sum += d * d;
          x = Math.floor(x / 10);
        }
        return sum;
      };

      const seen = new Set();
      while (n !== 1 && !seen.has(n)) {
        seen.add(n);
        n = getNext(n);
      }
      return n === 1 ? 'true' : 'false';
    },
    hiddenTestCases: [
      { input: '7', expected: 'true' },
      { input: '11', expected: 'false' }
    ]
  }),

  // 8. Pow(x, n) (Medium)
  createCanonicalProblem({
    problemId: 'dsa_math_08',
    topicId: 'math',
    order: 8,
    title: 'Pow(x, n)',
    difficulty: 'Medium',
    tags: ['Math', 'Recursion'],
    statement: `Implement pow(x, n), which calculates x raised to the power n (i.e., x^n). Formatted to 5 decimal places.`,
    inputFormat: `First line: float X.
Second line: integer N.`,
    outputFormat: `Print X^N formatted to 5 decimal places.`,
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
      'Use binary exponentiation in O(log N).',
      'If n < 0: x = 1 / x, n = -n.',
      'While n > 0: if n is odd, res *= x; x *= x; n = Math.floor(n / 2).'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      let x = parseFloat(lines[0]);
      let n = parseInt(lines[1], 10);

      if (n === 0) return (1).toFixed(5);
      if (n < 0) {
        x = 1 / x;
        n = -n;
      }

      let res = 1;
      while (n > 0) {
        if (n % 2 === 1) res *= x;
        x *= x;
        n = Math.floor(n / 2);
      }
      return res.toFixed(5);
    },
    hiddenTestCases: [
      { input: '1.0\n2147483647', expected: '1.00000' },
      { input: '2.0\n0', expected: '1.00000' }
    ]
  }),

  // 9. Sqrt(x) (Medium)
  createCanonicalProblem({
    problemId: 'dsa_math_09',
    topicId: 'math',
    order: 9,
    title: 'Sqrt(x)',
    difficulty: 'Medium',
    tags: ['Math', 'Binary Search'],
    statement: `Given a non-negative integer x, return the square root of x rounded down to the nearest integer. The returned integer should be non-negative as well.

You must not use any built-in exponent function or operator, such as pow(x, 0.5) or x ** 0.5.`,
    inputFormat: `First line: non-negative integer X.`,
    outputFormat: `Print integer square root.`,
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
      },
      {
        input: '0',
        displayInput: 'x = 0',
        output: '0',
        displayOutput: '0',
        explanation: 'Sqrt of 0 is 0.'
      }
    ],
    hints: [
      'Binary search over range [0, x].',
      'If mid * mid <= x, record ans = mid and search right (low = mid + 1).',
      'Otherwise search left (high = mid - 1).'
    ],
    solveFunction: (input) => {
      const x = parseInt(input.trim(), 10);
      if (x < 2) return x.toString();

      let low = 1;
      let high = Math.floor(x / 2);
      let ans = 1;

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (mid * mid <= x) {
          ans = mid;
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }
      return ans.toString();
    },
    hiddenTestCases: [
      { input: '1', expected: '1' },
      { input: '9', expected: '3' },
      { input: '16', expected: '4' }
    ]
  }),

  // 10. Integer to Roman (Medium)
  createCanonicalProblem({
    problemId: 'dsa_math_10',
    topicId: 'math',
    order: 10,
    title: 'Integer to Roman',
    difficulty: 'Medium',
    tags: ['Hash Table', 'Math', 'String'],
    statement: `Seven different symbols represent Roman numerals with the following values:
I: 1, IV: 4, V: 5, IX: 9, X: 10, XL: 40, L: 50, XC: 90, C: 100, CD: 400, D: 500, CM: 900, M: 1000.

Given an integer, convert it to a Roman numeral.`,
    inputFormat: `First line: integer num (1 <= num <= 3999).`,
    outputFormat: `Print Roman numeral string.`,
    constraints: ['1 <= num <= 3999'],
    examples: [
      {
        input: '3',
        displayInput: 'num = 3',
        output: 'III',
        displayOutput: '"III"',
        explanation: '3 is represented as 3 ones.'
      },
      {
        input: '58',
        displayInput: 'num = 58',
        output: 'LVIII',
        displayOutput: '"LVIII"',
        explanation: 'L = 50, V = 5, III = 3.'
      },
      {
        input: '1994',
        displayInput: 'num = 1994',
        output: 'MCMXCIV',
        displayOutput: '"MCMXCIV"',
        explanation: 'M = 1000, CM = 900, XC = 90 and IV = 4.'
      }
    ],
    hints: [
      'Store values and their Roman symbols in descending order.',
      'Greedily append symbols and subtract values while num >= val.'
    ],
    solveFunction: (input) => {
      let num = parseInt(input.trim(), 10);
      const val = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
      const sym = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];

      let res = '';
      for (let i = 0; i < val.length; i++) {
        while (num >= val[i]) {
          res += sym[i];
          num -= val[i];
        }
      }
      return res;
    },
    hiddenTestCases: [
      { input: '4', expected: 'IV' },
      { input: '9', expected: 'IX' },
      { input: '40', expected: 'XL' }
    ]
  }),

  // 11. Greatest Common Divisor of Strings (Medium)
  createCanonicalProblem({
    problemId: 'dsa_math_11',
    topicId: 'math',
    order: 11,
    title: 'Greatest Common Divisor of Strings',
    difficulty: 'Medium',
    tags: ['Math', 'String'],
    statement: `For two strings s and t, we say "t divides s" if and only if s = t + t + ... + t (i.e., t is concatenated with itself one or more times).

Given two strings str1 and str2, return the largest string x such that x divides both str1 and str2.`,
    inputFormat: `First line: string str1.
Second line: string str2.`,
    outputFormat: `Print greatest common divisor string (or empty line if none).`,
    constraints: ['1 <= str1.length, str2.length <= 1000', 'str1 and str2 consist of English uppercase letters.'],
    examples: [
      {
        input: 'ABCABC\nABC',
        displayInput: 'str1 = "ABCABC", str2 = "ABC"',
        output: 'ABC',
        displayOutput: '"ABC"',
        explanation: '"ABC" divides both.'
      },
      {
        input: 'ABABAB\nABAB',
        displayInput: 'str1 = "ABABAB", str2 = "ABAB"',
        output: 'AB',
        displayOutput: '"AB"',
        explanation: 'GCD string is "AB".'
      },
      {
        input: 'LEET\nCODE',
        displayInput: 'str1 = "LEET", str2 = "CODE"',
        output: '',
        displayOutput: '""',
        explanation: 'No common divisor string.'
      }
    ],
    hints: [
      'If str1 + str2 !== str2 + str1, then no common divisor string exists, return "".',
      'Otherwise, the length of the GCD string is gcd(str1.length, str2.length).',
      'Return str1.slice(0, gcd).'
    ],
    solveFunction: (input) => {
      const [str1 = '', str2 = ''] = input.trim().split(/\s+/);
      if (str1 + str2 !== str2 + str1) return '';

      const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
      const len = gcd(str1.length, str2.length);
      return str1.slice(0, len);
    },
    hiddenTestCases: [
      { input: 'AAAA\nAA', expected: 'AA' },
      { input: 'ABC\nDEF', expected: '' }
    ]
  }),

  // 12. Angle Between Hands of a Clock (Medium)
  createCanonicalProblem({
    problemId: 'dsa_math_12',
    topicId: 'math',
    order: 12,
    title: 'Angle Between Hands of a Clock',
    difficulty: 'Medium',
    tags: ['Math'],
    statement: `Given two numbers, hour and minutes, return the smaller angle (in degrees) formed between the hour and the minute hand. Formatted to 5 decimal places.`,
    inputFormat: `First line: integer hour (1 <= hour <= 12).
Second line: integer minutes (0 <= minutes <= 59).`,
    outputFormat: `Print acute angle formatted to 5 decimal places.`,
    constraints: ['1 <= hour <= 12', '0 <= minutes <= 59'],
    examples: [
      {
        input: '12\n30',
        displayInput: 'hour = 12, minutes = 30',
        output: '165.00000',
        displayOutput: '165.00000',
        explanation: 'Minute hand is at 180°, hour hand is at 15°. Angle = 165°.'
      },
      {
        input: '3\n30',
        displayInput: 'hour = 3, minutes = 30',
        output: '75.00000',
        displayOutput: '75.00000',
        explanation: 'Angle is 75°.'
      },
      {
        input: '3\n15',
        displayInput: 'hour = 3, minutes = 15',
        output: '7.50000',
        displayOutput: '7.50000',
        explanation: 'Angle is 7.5°.'
      }
    ],
    hints: [
      'Minute hand angle = minutes * 6°.',
      'Hour hand angle = (hour % 12) * 30° + minutes * 0.5°.',
      'Diff = abs(hourAngle - minAngle). Return min(diff, 360 - diff).'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split(/\s+/).map(Number);
      const hour = lines[0];
      const minutes = lines[1];

      const minAngle = minutes * 6;
      const hourAngle = (hour % 12) * 30 + minutes * 0.5;
      const diff = Math.abs(hourAngle - minAngle);
      const acute = Math.min(diff, 360 - diff);
      return acute.toFixed(5);
    },
    hiddenTestCases: [
      { input: '12\n0', expected: '0.00000' },
      { input: '6\n0', expected: '180.00000' }
    ]
  }),

  // 13. Factorial Trailing Zeroes (Medium)
  createCanonicalProblem({
    problemId: 'dsa_math_13',
    topicId: 'math',
    order: 13,
    title: 'Factorial Trailing Zeroes',
    difficulty: 'Medium',
    tags: ['Math'],
    statement: `Given an integer n, return the number of trailing zeroes in n!.

Note that n! = n * (n - 1) * (n - 2) * ... * 3 * 2 * 1.`,
    inputFormat: `First line: non-negative integer N.`,
    outputFormat: `Print trailing zeroes count.`,
    constraints: ['0 <= n <= 10^4'],
    examples: [
      {
        input: '3',
        displayInput: 'n = 3',
        output: '0',
        displayOutput: '0',
        explanation: '3! = 6, no trailing zero.'
      },
      {
        input: '5',
        displayInput: 'n = 5',
        output: '1',
        displayOutput: '1',
        explanation: '5! = 120, one trailing zero.'
      },
      {
        input: '0',
        displayInput: 'n = 0',
        output: '0',
        displayOutput: '0',
        explanation: '0! = 1, no trailing zero.'
      }
    ],
    hints: [
      'Trailing zeroes are contributed by factors of 10 = 2 * 5.',
      'Factors of 2 are always abundant; the count of trailing zeroes is determined by the number of factors of 5.',
      'Sum floor(n / 5) + floor(n / 25) + floor(n / 125) + ...'
    ],
    solveFunction: (input) => {
      let n = parseInt(input.trim(), 10);
      let count = 0;
      while (n >= 5) {
        count += Math.floor(n / 5);
        n = Math.floor(n / 5);
      }
      return count.toString();
    },
    hiddenTestCases: [
      { input: '25', expected: '6' },
      { input: '100', expected: '24' }
    ]
  }),

  // 14. Multiply Strings (Medium)
  createCanonicalProblem({
    problemId: 'dsa_math_14',
    topicId: 'math',
    order: 14,
    title: 'Multiply Strings',
    difficulty: 'Medium',
    tags: ['Math', 'String', 'Simulation'],
    statement: `Given two non-negative integers num1 and num2 represented as strings, return the product of num1 and num2, also represented as a string.

Note: You must not use any built-in BigInteger library or convert the inputs to integer directly.`,
    inputFormat: `First line: num1 string.
Second line: num2 string.`,
    outputFormat: `Print product string.`,
    constraints: ['1 <= num1.length, num2.length <= 200', 'num1 and num2 consist of digits only.', 'Both num1 and num2 do not contain any leading zero, except the number 0 itself.'],
    examples: [
      {
        input: '2\n3',
        displayInput: 'num1 = "2", num2 = "3"',
        output: '6',
        displayOutput: '"6"',
        explanation: '2 * 3 = 6.'
      },
      {
        input: '123\n456',
        displayInput: 'num1 = "123", num2 = "456"',
        output: '56088',
        displayOutput: '"56088"',
        explanation: '123 * 456 = 56088.'
      },
      {
        input: '0\n456',
        displayInput: 'num1 = "0", num2 = "456"',
        output: '0',
        displayOutput: '"0"',
        explanation: 'Multiplying by 0 gives 0.'
      }
    ],
    hints: [
      'Create an array pos of size num1.length + num2.length initialized to 0.',
      'For i from m - 1 down to 0, j from n - 1 down to 0: mul = num1[i] * num2[j]; add to pos[i + j + 1]; carry over to pos[i + j].'
    ],
    solveFunction: (input) => {
      const [num1 = '0', num2 = '0'] = input.trim().split(/\s+/);
      if (num1 === '0' || num2 === '0') return '0';

      const m = num1.length;
      const n = num2.length;
      const pos = new Array(m + n).fill(0);

      for (let i = m - 1; i >= 0; i--) {
        for (let j = n - 1; j >= 0; j--) {
          const mul = parseInt(num1[i], 10) * parseInt(num2[j], 10);
          const p1 = i + j;
          const p2 = i + j + 1;
          const sum = mul + pos[p2];

          pos[p2] = sum % 10;
          pos[p1] += Math.floor(sum / 10);
        }
      }

      while (pos.length > 0 && pos[0] === 0) pos.shift();
      return pos.join('');
    },
    hiddenTestCases: [
      { input: '9\n9', expected: '81' },
      { input: '99\n99', expected: '9801' }
    ]
  }),

  // 15. String to Integer (atoi) (Medium)
  createCanonicalProblem({
    problemId: 'dsa_math_15',
    topicId: 'math',
    order: 15,
    title: 'String to Integer (atoi)',
    difficulty: 'Medium',
    tags: ['String'],
    statement: `Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer (similar to C/C++'s atoi function).

Clamped within the 32-bit signed integer range: [-2^31, 2^31 - 1].`,
    inputFormat: `First line: string S.`,
    outputFormat: `Print 32-bit parsed integer.`,
    constraints: ['0 <= s.length <= 200', 's consists of English letters, digits, " ", "+", "-", and ".".'],
    examples: [
      {
        input: '42',
        displayInput: 's = "42"',
        output: '42',
        displayOutput: '42',
        explanation: '42 parsed.'
      },
      {
        input: '   -42',
        displayInput: 's = "   -42"',
        output: '-42',
        displayOutput: '-42',
        explanation: 'Leading spaces trimmed, "-" sign parsed.'
      },
      {
        input: '4193 with words',
        displayInput: 's = "4193 with words"',
        output: '4193',
        displayOutput: '4193',
        explanation: 'Stops parsing at first non-digit.'
      }
    ],
    hints: [
      'Trim leading whitespace.',
      'Check if next char is "+" or "-".',
      'Accumulate digits until first non-digit char.',
      'Clamp to [-2147483648, 2147483647].'
    ],
    solveFunction: (input) => {
      const s = input.trim();
      let i = 0;
      let sign = 1;
      let res = 0;
      const INT_MAX = 2147483647;
      const INT_MIN = -2147483648;

      if (i < s.length && (s[i] === '+' || s[i] === '-')) {
        sign = s[i] === '-' ? -1 : 1;
        i++;
      }

      while (i < s.length && s[i] >= '0' && s[i] <= '9') {
        const d = parseInt(s[i], 10);
        res = res * 10 + d;
        if (sign === 1 && res > INT_MAX) return INT_MAX.toString();
        if (sign === -1 && -res < INT_MIN) return INT_MIN.toString();
        i++;
      }
      return (sign * res).toString();
    },
    hiddenTestCases: [
      { input: '-91283472332', expected: '-2147483648' },
      { input: 'words and 987', expected: '0' }
    ]
  }),

  // 16. Reconstruct Original Digits from English (Medium)
  createCanonicalProblem({
    problemId: 'dsa_math_16',
    topicId: 'math',
    order: 16,
    title: 'Reconstruct Original Digits from English',
    difficulty: 'Medium',
    tags: ['Hash Table', 'Math', 'String'],
    statement: `Given a string s containing an out-of-order English representation of digits 0-9, return the digits in ascending order.`,
    inputFormat: `First line: string S.`,
    outputFormat: `Print digits string in ascending order.`,
    constraints: ['1 <= s.length <= 10^5', 's[i] is one of the characters ["e","g","f","i","h","o","n","s","r","u","t","w","v","x","z"].'],
    examples: [
      {
        input: 'owoztneoer',
        displayInput: 's = "owoztneoer"',
        output: '012',
        displayOutput: '"012"',
        explanation: 'zero, one, two -> 012.'
      },
      {
        input: 'fviefuro',
        displayInput: 's = "fviefuro"',
        output: '45',
        displayOutput: '"45"',
        explanation: 'four, five -> 45.'
      },
      {
        input: 'zero',
        displayInput: 's = "zero"',
        output: '0',
        displayOutput: '"0"',
        explanation: '0.'
      }
    ],
    hints: [
      'Deduce unique characters: "z" only in zero (0), "w" only in two (2), "u" only in four (4), "x" only in six (6), "g" only in eight (8).',
      'Then deduce 3 (from h - 8), 5 (from f - 4), 7 (from s - 6), 1 (from o - 0 - 2 - 4), 9 (from i - 5 - 6 - 8).'
    ],
    solveFunction: (input) => {
      const s = input.trim();
      const count = {};
      for (const ch of s) count[ch] = (count[ch] || 0) + 1;

      const out = new Array(10).fill(0);
      out[0] = count['z'] || 0;
      out[2] = count['w'] || 0;
      out[4] = count['u'] || 0;
      out[6] = count['x'] || 0;
      out[8] = count['g'] || 0;

      out[3] = (count['h'] || 0) - out[8];
      out[5] = (count['f'] || 0) - out[4];
      out[7] = (count['s'] || 0) - out[6];
      out[1] = (count['o'] || 0) - out[0] - out[2] - out[4];
      out[9] = (count['i'] || 0) - out[5] - out[6] - out[8];

      let res = '';
      for (let d = 0; d <= 9; d++) {
        res += d.toString().repeat(out[d]);
      }
      return res;
    },
    hiddenTestCases: [
      { input: 'zerozero', expected: '00' },
      { input: 'nine', expected: '9' }
    ]
  }),

  // 17. Max Points on a Line (Hard)
  createCanonicalProblem({
    problemId: 'dsa_math_17',
    topicId: 'math',
    order: 17,
    title: 'Max Points on a Line',
    difficulty: 'Hard',
    tags: ['Array', 'Hash Table', 'Math', 'Geometry'],
    statement: `Given an array of points where points[i] = [xi, yi] represents a point on the X-Y plane, return the maximum number of points that lie on the same straight line.`,
    inputFormat: `First line: integer N.
Next N lines: two space-separated integers X and Y.`,
    outputFormat: `Print maximum points on a line.`,
    constraints: ['1 <= points.length <= 300', 'points[i].length == 2', '-10^4 <= xi, yi <= 10^4', 'All the points are unique.'],
    examples: [
      {
        input: '3\n1 1\n2 2\n3 3',
        displayInput: 'points = [[1,1],[2,2],[3,3]]',
        output: '3',
        displayOutput: '3',
        explanation: 'All 3 points lie on y = x.'
      },
      {
        input: '6\n1 1\n3 2\n5 3\n4 1\n2 3\n1 4',
        displayInput: 'points = [[1,1],[3,2],[5,3],[4,1],[2,3],[1,4]]',
        output: '4',
        displayOutput: '4',
        explanation: 'Points (1,4), (2,3), (3,2), (4,1) lie on the line.'
      },
      {
        input: '1\n0 0',
        displayInput: 'points = [[0,0]]',
        output: '1',
        displayOutput: '1',
        explanation: 'Single point.'
      }
    ],
    hints: [
      'For each point i, calculate slope to every other point j.',
      'Represent slope as coprime reduced fraction (dy / gcd, dx / gcd) to prevent floating point inaccuracy.',
      'Store counts in map and track max points.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n <= 2) return n.toString();
      const points = [];
      for (let i = 1; i <= n; i++) {
        points.push(lines[i].trim().split(/\s+/).map(Number));
      }

      const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

      let maxPoints = 0;
      for (let i = 0; i < n; i++) {
        const slopes = {};
        let duplicate = 1;
        let curMax = 0;

        for (let j = i + 1; j < n; j++) {
          let dx = points[j][0] - points[i][0];
          let dy = points[j][1] - points[i][1];

          if (dx === 0 && dy === 0) {
            duplicate++;
            continue;
          }

          const g = gcd(Math.abs(dx), Math.abs(dy));
          dx /= g;
          dy /= g;

          if (dx < 0 || (dx === 0 && dy < 0)) {
            dx = -dx;
            dy = -dy;
          }

          const key = `${dy}/${dx}`;
          slopes[key] = (slopes[key] || 0) + 1;
          curMax = Math.max(curMax, slopes[key]);
        }
        maxPoints = Math.max(maxPoints, curMax + duplicate);
      }
      return maxPoints.toString();
    },
    hiddenTestCases: [
      { input: '2\n0 0\n1 1', expected: '2' },
      { input: '3\n0 0\n0 1\n0 2', expected: '3' }
    ]
  }),

  // 18. Basic Calculator (Math) (Hard)
  createCanonicalProblem({
    problemId: 'dsa_math_18',
    topicId: 'math',
    order: 18,
    title: 'Basic Calculator',
    difficulty: 'Hard',
    tags: ['Math', 'String', 'Stack', 'Recursion'],
    statement: `Given a string s representing a valid expression, implement a basic calculator to evaluate it, and return the result of the evaluation.

The expression can contain '(', ')', '+', '-', non-negative integers, and spaces.`,
    inputFormat: `First line: expression string s.`,
    outputFormat: `Print evaluated integer.`,
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
        explanation: '3.'
      },
      {
        input: '(1+(4+5+2)-3)+(6+8)',
        displayInput: 's = "(1+(4+5+2)-3)+(6+8)"',
        output: '23',
        displayOutput: '23',
        explanation: '23.'
      }
    ],
    hints: [
      'Maintain running sum and sign (+1 or -1).',
      'When seeing "(", push sum and sign to stack, reset sum = 0 and sign = 1.',
      'When seeing ")", sum = popped_sum + popped_sign * sum.'
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
      { input: '1 - (5)', expected: '-4' },
      { input: '2147483647', expected: '2147483647' }
    ]
  }),

  // 19. Integer to English Words (Hard)
  createCanonicalProblem({
    problemId: 'dsa_math_19',
    topicId: 'math',
    order: 19,
    title: 'Integer to English Words',
    difficulty: 'Hard',
    tags: ['Math', 'String', 'Recursion'],
    statement: `Convert a non-negative integer num to its English words representation.`,
    inputFormat: `First line: non-negative integer num.`,
    outputFormat: `Print English words representation.`,
    constraints: ['0 <= num <= 2^31 - 1'],
    examples: [
      {
        input: '123',
        displayInput: 'num = 123',
        output: 'One Hundred Twenty Three',
        displayOutput: '"One Hundred Twenty Three"',
        explanation: '123 in words.'
      },
      {
        input: '12345',
        displayInput: 'num = 12345',
        output: 'Twelve Thousand Three Hundred Forty Five',
        displayOutput: '"Twelve Thousand Three Hundred Forty Five"',
        explanation: '12345 in words.'
      },
      {
        input: '1234567',
        displayInput: 'num = 1234567',
        output: 'One Million Two Hundred Thirty Four Thousand Five Hundred Sixty Seven',
        displayOutput: '"One Million Two Hundred Thirty Four Thousand Five Hundred Sixty Seven"',
        explanation: '1234567 in words.'
      }
    ],
    hints: [
      'If num == 0, return "Zero".',
      'Split num into groups of 3 digits from right to left (Thousands, Millions, Billions).',
      'Write helper to convert 1 to 999 into words.'
    ],
    solveFunction: (input) => {
      let num = parseInt(input.trim(), 10);
      if (num === 0) return 'Zero';

      const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
        'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
      const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
      const thousands = ['', 'Thousand', 'Million', 'Billion'];

      const helper = (n) => {
        if (n === 0) return '';
        if (n < 20) return ones[n] + ' ';
        if (n < 100) return tens[Math.floor(n / 10)] + ' ' + helper(n % 10);
        return ones[Math.floor(n / 100)] + ' Hundred ' + helper(n % 100);
      };

      let res = '';
      let i = 0;
      while (num > 0) {
        if (num % 1000 !== 0) {
          res = helper(num % 1000) + thousands[i] + ' ' + res;
        }
        num = Math.floor(num / 1000);
        i++;
      }
      return res.trim().replace(/\s+/g, ' ');
    },
    hiddenTestCases: [
      { input: '0', expected: 'Zero' },
      { input: '1000000', expected: 'One Million' }
    ]
  }),

  // 20. Fraction to Recurring Decimal (Hard)
  createCanonicalProblem({
    problemId: 'dsa_math_20',
    topicId: 'math',
    order: 20,
    title: 'Fraction to Recurring Decimal',
    difficulty: 'Hard',
    tags: ['Hash Table', 'Math', 'String'],
    statement: `Given two integers representing the numerator and denominator of a fraction, return the fraction in string format.

If the fractional part is repeating, enclose the repeating part in parentheses.

If multiple answers are possible, return any of them.`,
    inputFormat: `First line: integer numerator.
Second line: integer denominator.`,
    outputFormat: `Print fraction string.`,
    constraints: ['-2^31 <= numerator, denominator <= 2^31 - 1', 'denominator != 0'],
    examples: [
      {
        input: '1\n2',
        displayInput: 'numerator = 1, denominator = 2',
        output: '0.5',
        displayOutput: '"0.5"',
        explanation: 'Terminates cleanly.'
      },
      {
        input: '2\n1',
        displayInput: 'numerator = 2, denominator = 1',
        output: '2',
        displayOutput: '"2"',
        explanation: 'Integer output.'
      },
      {
        input: '4\n333',
        displayInput: 'numerator = 4, denominator = 333',
        output: '0.(012)',
        displayOutput: '"0.(012)"',
        explanation: 'Recurring decimal.'
      }
    ],
    hints: [
      'Handle sign: result is negative if one of numerator or denominator is negative.',
      'Append integer part: Math.floor(abs(num) / abs(den)).',
      'For remainder: store remainder position in a hash map.',
      'If remainder repeats, wrap recurring substring in parentheses.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split(/\s+/).map(Number);
      let num = lines[0];
      let den = lines[1];

      if (num === 0) return '0';
      let res = '';
      if ((num < 0) ^ (den < 0)) res += '-';

      num = Math.abs(num);
      den = Math.abs(den);

      res += Math.floor(num / den).toString();
      let rem = num % den;
      if (rem === 0) return res;

      res += '.';
      const map = {};
      while (rem !== 0) {
        if (map[rem] !== undefined) {
          const idx = map[rem];
          res = res.slice(0, idx) + '(' + res.slice(idx) + ')';
          break;
        }
        map[rem] = res.length;
        rem *= 10;
        res += Math.floor(rem / den).toString();
        rem %= den;
      }
      return res;
    },
    hiddenTestCases: [
      { input: '2\n3', expected: '0.(6)' },
      { input: '-50\n8', expected: '-6.25' }
    ]
  })
];


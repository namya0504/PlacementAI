/**
 * Canonical DSA Placement Problems: GREEDY (20 Questions)
 * 7 Easy, 9 Medium, 4 Hard
 */

import { createCanonicalProblem } from './topicProblemHelper.js';

export const GREEDY_PROBLEMS = [
  // 1. Assign Cookies (Easy)
  createCanonicalProblem({
    problemId: 'dsa_greedy_01',
    topicId: 'greedy',
    order: 1,
    title: 'Assign Cookies',
    difficulty: 'Easy',
    tags: ['Array', 'Two Pointers', 'Greedy', 'Sorting'],
    statement: `Assume you are an awesome parent and want to give your children some cookies. But, you should give each child at most one cookie.

Each child i has a greed factor g[i], which is the minimum size of a cookie that the child will be content with; and each cookie j has a size s[j]. If s[j] >= g[i], we can assign the cookie j to the child i, and the child i will be content. Your goal is to maximize the number of your content children and output the maximum number.`,
    inputFormat: `First line: integer N (children).
Second line: N space-separated greed factors.
Third line: integer M (cookies).
Fourth line: M space-separated cookie sizes.`,
    outputFormat: `Print the maximum number of content children.`,
    constraints: ['1 <= g.length <= 3 * 10^4', '0 <= s.length <= 3 * 10^4', '1 <= g[i], s[j] <= 2^31 - 1'],
    examples: [
      {
        input: '3\n1 2 3\n2\n1 1',
        displayInput: 'g = [1,2,3], s = [1,1]',
        output: '1',
        displayOutput: '1',
        explanation: 'You have 3 children and 2 cookies. You can only make the child with greed factor 1 content.'
      },
      {
        input: '2\n1 2\n3\n1 2 3',
        displayInput: 'g = [1,2], s = [1,2,3]',
        output: '2',
        displayOutput: '2',
        explanation: 'Both children can be satisfied.'
      },
      {
        input: '2\n3 4\n1\n2',
        displayInput: 'g = [3,4], s = [2]',
        output: '0',
        displayOutput: '0',
        explanation: 'No cookie is large enough.'
      }
    ],
    hints: [
      'Sort both greed factors and cookie sizes in ascending order.',
      'Use two pointers i (for children) and j (for cookies).',
      'If s[j] >= g[i], child i is satisfied: increment i. Always increment j.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      const g = n > 0 ? lines[1].trim().split(/\s+/).map(Number) : [];
      const m = parseInt(lines[2], 10);
      const s = m > 0 ? lines[3].trim().split(/\s+/).map(Number) : [];

      g.sort((a, b) => a - b);
      s.sort((a, b) => a - b);

      let child = 0;
      let cookie = 0;
      while (child < g.length && cookie < s.length) {
        if (s[cookie] >= g[child]) {
          child++;
        }
        cookie++;
      }
      return child.toString();
    },
    hiddenTestCases: [
      { input: '1\n5\n1\n5', expected: '1' },
      { input: '2\n10 20\n2\n5 5', expected: '0' }
    ]
  }),

  // 2. Maximum Units on a Truck (Easy)
  createCanonicalProblem({
    problemId: 'dsa_greedy_02',
    topicId: 'greedy',
    order: 2,
    title: 'Maximum Units on a Truck',
    difficulty: 'Easy',
    tags: ['Array', 'Greedy', 'Sorting'],
    statement: `You are assigned to put some amount of boxes onto one truck. You are given a 2D array boxTypes, where boxTypes[i] = [numberOfBoxesi, numberOfUnitsPerBoxi]:
- numberOfBoxesi is the number of boxes of type i.
- numberOfUnitsPerBoxi is the number of units in each box of the type i.

You are also given an integer truckSize, which is the maximum number of boxes that can be put on the truck. You can choose any boxes to put on the truck as long as the number of boxes does not exceed truckSize.

Return the maximum total number of units that can be put on the truck.`,
    inputFormat: `First line: integer N (box types).
Next N lines: two space-separated integers numberOfBoxes and unitsPerBox.
Next line: truckSize.`,
    outputFormat: `Print the maximum total units.`,
    constraints: ['1 <= boxTypes.length <= 1000', '1 <= numberOfBoxesi, numberOfUnitsPerBoxi <= 1000', '1 <= truckSize <= 10^6'],
    examples: [
      {
        input: '3\n1 3\n2 2\n3 1\n4',
        displayInput: 'boxTypes = [[1,3],[2,2],[3,1]], truckSize = 4',
        output: '8',
        displayOutput: '8',
        explanation: 'Take 1 box of 3 units, 2 boxes of 2 units, and 1 box of 1 unit. Total = 3 + 4 + 1 = 8.'
      },
      {
        input: '4\n5 10\n2 5\n4 7\n3 9\n10',
        displayInput: 'boxTypes = [[5,10],[2,5],[4,7],[3,9]], truckSize = 10',
        output: '91',
        displayOutput: '91',
        explanation: 'Take 5 boxes of 10 units, 3 boxes of 9 units, and 2 boxes of 7 units = 50 + 27 + 14 = 91.'
      },
      {
        input: '1\n2 4\n1',
        displayInput: 'boxTypes = [[2, 4]], truckSize = 1',
        output: '4',
        displayOutput: '4',
        explanation: 'Take 1 box of 4 units.'
      }
    ],
    hints: [
      'Sort boxTypes descending by units per box.',
      'Greedily take as many boxes as possible from the highest unit type until truckSize is 0.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      const boxes = [];
      for (let i = 1; i <= n; i++) {
        boxes.push(lines[i].trim().split(/\s+/).map(Number));
      }
      let truckSize = parseInt(lines[n + 1], 10);

      boxes.sort((a, b) => b[1] - a[1]);
      let totalUnits = 0;

      for (const [count, units] of boxes) {
        const take = Math.min(truckSize, count);
        totalUnits += take * units;
        truckSize -= take;
        if (truckSize === 0) break;
      }
      return totalUnits.toString();
    },
    hiddenTestCases: [
      { input: '2\n3 1\n3 2\n3', expected: '6' },
      { input: '1\n10 5\n20', expected: '50' }
    ]
  }),

  // 3. Best Time to Buy and Sell Stock II (Easy)
  createCanonicalProblem({
    problemId: 'dsa_greedy_03',
    topicId: 'greedy',
    order: 3,
    title: 'Best Time to Buy and Sell Stock II',
    difficulty: 'Easy',
    tags: ['Array', 'Dynamic Programming', 'Greedy'],
    statement: `You are given an integer array prices where prices[i] is the price of a given stock on the ith day.

On each day, you may decide to buy and/or sell the stock. You can only hold at most one share of the stock at any time. However, you can buy it then immediately sell it on the same day.

Find and return the maximum profit you can achieve.`,
    inputFormat: `First line: integer N.
Second line: N space-separated daily stock prices.`,
    outputFormat: `Print maximum profit.`,
    constraints: ['1 <= prices.length <= 3 * 10^4', '0 <= prices[i] <= 10^4'],
    examples: [
      {
        input: '6\n7 1 5 3 6 4',
        displayInput: 'prices = [7,1,5,3,6,4]',
        output: '7',
        displayOutput: '7',
        explanation: 'Buy on day 2 (price = 1) and sell on day 3 (price = 5), profit = 4. Buy on day 4 (price = 3) and sell on day 5 (price = 6), profit = 3. Total = 7.'
      },
      {
        input: '5\n1 2 3 4 5',
        displayInput: 'prices = [1,2,3,4,5]',
        output: '4',
        displayOutput: '4',
        explanation: 'Buy on day 1 and sell on day 5, profit = 4.'
      },
      {
        input: '5\n7 6 4 3 1',
        displayInput: 'prices = [7,6,4,3,1]',
        output: '0',
        displayOutput: '0',
        explanation: 'Prices strictly decrease, 0 transactions made.'
      }
    ],
    hints: [
      'Whenever prices[i] > prices[i-1], add prices[i] - prices[i-1] to profit.',
      'Greedily collecting every upward price step gives the global maximum.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n <= 1) return '0';
      const prices = lines[1].trim().split(/\s+/).map(Number);

      let profit = 0;
      for (let i = 1; i < n; i++) {
        if (prices[i] > prices[i - 1]) {
          profit += prices[i] - prices[i - 1];
        }
      }
      return profit.toString();
    },
    hiddenTestCases: [
      { input: '2\n1 5', expected: '4' },
      { input: '3\n2 1 2', expected: '1' }
    ]
  }),

  // 4. Lemonade Change (Easy)
  createCanonicalProblem({
    problemId: 'dsa_greedy_04',
    topicId: 'greedy',
    order: 4,
    title: 'Lemonade Change',
    difficulty: 'Easy',
    tags: ['Array', 'Greedy'],
    statement: `At a lemonade stand, each lemonade costs $5. Customers are standing in a queue to buy from you and order one at a time. Each customer will only buy one lemonade and pay with either a $5, $10, or $20 bill. You must provide the correct change to each customer so that the net transaction is that the customer pays $5.

Note that you do not have any change in hand at first.

Given an integer array bills where bills[i] is the bill the ith customer pays, return true if you can provide every customer with the correct change, or false otherwise.`,
    inputFormat: `First line: integer N.
Second line: N space-separated bills (5, 10, or 20).`,
    outputFormat: `Print 'true' if possible, else 'false'.`,
    constraints: ['1 <= bills.length <= 10^5', 'bills[i] is either 5, 10, or 20.'],
    examples: [
      {
        input: '5\n5 5 5 10 20',
        displayInput: 'bills = [5,5,5,10,20]',
        output: 'true',
        displayOutput: 'true',
        explanation: 'All customers received proper change.'
      },
      {
        input: '5\n5 5 10 10 20',
        displayInput: 'bills = [5,5,10,10,20]',
        output: 'false',
        displayOutput: 'false',
        explanation: 'For the last $20 customer, we need $15 in change (a $10 and a $5, or three $5s), but we only have two $10s.'
      },
      {
        input: '1\n5',
        displayInput: 'bills = [5]',
        output: 'true',
        displayOutput: 'true',
        explanation: 'Exact payment, no change needed.'
      }
    ],
    hints: [
      'Maintain counts of five and ten dollar bills.',
      'For bill 5: five++.',
      'For bill 10: if five == 0 return false; else five--, ten++.',
      'For bill 20: prioritize ten-- and five--; otherwise five -= 3. If impossible, return false.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      const bills = lines[1].trim().split(/\s+/).map(Number);

      let five = 0;
      let ten = 0;

      for (const b of bills) {
        if (b === 5) {
          five++;
        } else if (b === 10) {
          if (five === 0) return 'false';
          five--;
          ten++;
        } else {
          // b === 20
          if (ten > 0 && five > 0) {
            ten--;
            five--;
          } else if (five >= 3) {
            five -= 3;
          } else {
            return 'false';
          }
        }
      }
      return 'true';
    },
    hiddenTestCases: [
      { input: '2\n5 10', expected: 'true' },
      { input: '2\n10 10', expected: 'false' },
      { input: '1\n20', expected: 'false' }
    ]
  }),

  // 5. Minimum Moves to Equal Array Elements II (Easy)
  createCanonicalProblem({
    problemId: 'dsa_greedy_05',
    topicId: 'greedy',
    order: 5,
    title: 'Minimum Moves to Equal Array Elements II',
    difficulty: 'Easy',
    tags: ['Array', 'Math', 'Sorting'],
    statement: `Given an integer array nums of size n, return the minimum number of moves required to make all array elements equal.

In one move, you can increment or decrement an element of the array by 1.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print minimum moves.`,
    constraints: ['n == nums.length', '1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    examples: [
      {
        input: '3\n1 2 3',
        displayInput: 'nums = [1,2,3]',
        output: '2',
        displayOutput: '2',
        explanation: 'Only two moves are needed (remember each move increments or decrements one element): [1,2,3] => [2,2,3] => [2,2,2].'
      },
      {
        input: '4\n1 10 2 9',
        displayInput: 'nums = [1,10,2,9]',
        output: '16',
        displayOutput: '16',
        explanation: 'Median is 2 (or 9). Moves: |1-2| + |10-2| + |2-2| + |9-2| = 1 + 8 + 0 + 7 = 16.'
      },
      {
        input: '1\n42',
        displayInput: 'nums = [42]',
        output: '0',
        displayOutput: '0',
        explanation: 'Single element requires 0 moves.'
      }
    ],
    hints: [
      'The sum of absolute deviations is minimized at the median.',
      'Sort nums in ascending order and pick median = nums[Math.floor(n / 2)].',
      'Sum |nums[i] - median| for all i.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n <= 1) return '0';
      const nums = lines[1].trim().split(/\s+/).map(Number);
      nums.sort((a, b) => a - b);

      const median = nums[Math.floor(n / 2)];
      let moves = 0;
      for (const num of nums) {
        moves += Math.abs(num - median);
      }
      return moves.toString();
    },
    hiddenTestCases: [
      { input: '2\n1 2', expected: '1' },
      { input: '3\n1 0 0 8 6', expected: '14' }
    ]
  }),

  // 6. Array Partition I (Easy)
  createCanonicalProblem({
    problemId: 'dsa_greedy_06',
    topicId: 'greedy',
    order: 6,
    title: 'Array Partition I',
    difficulty: 'Easy',
    tags: ['Array', 'Greedy', 'Sorting', 'Counting Sort'],
    statement: `Given an integer array nums of 2n integers, group these integers into n pairs (a1, b1), (a2, b2), ..., (an, bn) such that the sum of min(ai, bi) for all i is maximized. Return the maximized sum.`,
    inputFormat: `First line: integer N.
Second line: 2N space-separated integers.`,
    outputFormat: `Print the maximized sum.`,
    constraints: ['1 <= n <= 10^4', 'nums.length == 2 * n', '-10^4 <= nums[i] <= 10^4'],
    examples: [
      {
        input: '2\n1 4 3 2',
        displayInput: 'n = 2, nums = [1,4,3,2]',
        output: '4',
        displayOutput: '4',
        explanation: 'Pairs (1, 2) and (3, 4). Sum = min(1, 2) + min(3, 4) = 1 + 3 = 4.'
      },
      {
        input: '3\n6 2 6 5 1 2',
        displayInput: 'n = 3, nums = [6,2,6,5,1,2]',
        output: '9',
        displayOutput: '9',
        explanation: 'Pairs: (1, 2), (2, 5), (6, 6). Sum = 1 + 2 + 6 = 9.'
      },
      {
        input: '1\n1 2',
        displayInput: 'n = 1, nums = [1, 2]',
        output: '1',
        displayOutput: '1',
        explanation: 'Pair (1, 2) gives min 1.'
      }
    ],
    hints: [
      'Sort the array in ascending order.',
      'Pairing adjacent elements minimizes the sacrifice between each pair.',
      'Sum all elements at even indices: nums[0] + nums[2] + nums[4] + ...'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const nums = lines[1].trim().split(/\s+/).map(Number);
      nums.sort((a, b) => a - b);

      let sum = 0;
      for (let i = 0; i < nums.length; i += 2) {
        sum += nums[i];
      }
      return sum.toString();
    },
    hiddenTestCases: [
      { input: '2\n-1 -2 -3 -4', expected: '-6' },
      { input: '1\n10 20', expected: '10' }
    ]
  }),

  // 7. Split a String in Balanced Strings (Easy)
  createCanonicalProblem({
    problemId: 'dsa_greedy_07',
    topicId: 'greedy',
    order: 7,
    title: 'Split a String in Balanced Strings',
    difficulty: 'Easy',
    tags: ['String', 'Greedy', 'Counting'],
    statement: `Balanced strings are those that have an equal quantity of 'L' and 'R' characters.

Given a balanced string s, split it into some number of substrings such that:
- Each substring is balanced.

Return the maximum number of balanced strings you can obtain.`,
    inputFormat: `First line: string s.`,
    outputFormat: `Print the maximum count of balanced substrings.`,
    constraints: ['2 <= s.length <= 1000', 's[i] is either "L" or "R".', 's is a balanced string.'],
    examples: [
      {
        input: 'RLRRLLRLRL',
        displayInput: 's = "RLRRLLRLRL"',
        output: '4',
        displayOutput: '4',
        explanation: '"RL", "RRLL", "RL", "RL".'
      },
      {
        input: 'RLRRRLLRLL',
        displayInput: 's = "RLRRRLLRLL"',
        output: '2',
        displayOutput: '2',
        explanation: '"RL", "RRRLLRLL".'
      },
      {
        input: 'LLLLRRRR',
        displayInput: 's = "LLLLRRRR"',
        output: '1',
        displayOutput: '1',
        explanation: '"LLLLRRRR" can only be split into 1 balanced substring.'
      }
    ],
    hints: [
      'Maintain a balance counter: increment on "R", decrement on "L".',
      'Whenever balance reaches 0, you have completed a balanced substring.',
      'Greedily increment your count whenever balance == 0.'
    ],
    solveFunction: (input) => {
      const s = input.trim();
      let balance = 0;
      let count = 0;
      for (const ch of s) {
        if (ch === 'R') balance++;
        else balance--;
        if (balance === 0) count++;
      }
      return count.toString();
    },
    hiddenTestCases: [
      { input: 'RL', expected: '1' },
      { input: 'RLLR', expected: '1' },
      { input: 'RLLLLRRR', expected: '1' }
    ]
  }),

  // 8. Jump Game (Medium)
  createCanonicalProblem({
    problemId: 'dsa_greedy_08',
    topicId: 'greedy',
    order: 8,
    title: 'Jump Game',
    difficulty: 'Medium',
    tags: ['Array', 'Dynamic Programming', 'Greedy'],
    statement: `You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.

Return true if you can reach the last index, or false otherwise.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print 'true' if last index is reachable, else 'false'.`,
    constraints: ['1 <= nums.length <= 10^4', '0 <= nums[i] <= 10^5'],
    examples: [
      {
        input: '5\n2 3 1 1 4',
        displayInput: 'nums = [2,3,1,1,4]',
        output: 'true',
        displayOutput: 'true',
        explanation: 'Jump 1 step from index 0 to 1, then 3 steps to the last index.'
      },
      {
        input: '5\n3 2 1 0 4',
        displayInput: 'nums = [3,2,1,0,4]',
        output: 'false',
        displayOutput: 'false',
        explanation: 'You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.'
      },
      {
        input: '1\n0',
        displayInput: 'nums = [0]',
        output: 'true',
        displayOutput: 'true',
        explanation: 'Already at the last index.'
      }
    ],
    hints: [
      'Maintain maxReach = 0.',
      'Iterate through the array: if i > maxReach, return false.',
      'Update maxReach = max(maxReach, i + nums[i]).',
      'If maxReach >= nums.length - 1, return true.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n <= 1) return 'true';
      const nums = lines[1].trim().split(/\s+/).map(Number);

      let maxReach = 0;
      for (let i = 0; i < n; i++) {
        if (i > maxReach) return 'false';
        maxReach = Math.max(maxReach, i + nums[i]);
        if (maxReach >= n - 1) return 'true';
      }
      return 'true';
    },
    hiddenTestCases: [
      { input: '2\n1 0', expected: 'true' },
      { input: '2\n0 1', expected: 'false' },
      { input: '3\n2 0 0', expected: 'true' }
    ]
  }),

  // 9. Jump Game II (Medium)
  createCanonicalProblem({
    problemId: 'dsa_greedy_09',
    topicId: 'greedy',
    order: 9,
    title: 'Jump Game II',
    difficulty: 'Medium',
    tags: ['Array', 'Dynamic Programming', 'Greedy'],
    statement: `You are given a 0-indexed array of integers nums of length n. You are initially positioned at nums[0].

Each element nums[i] represents the maximum length of a forward jump from index i.

Return the minimum number of jumps to reach nums[n - 1]. The test cases are generated such that you can reach nums[n - 1].`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print minimum jumps.`,
    constraints: ['1 <= nums.length <= 10^4', '0 <= nums[i] <= 1000', 'It\'s guaranteed that you can reach nums[n - 1].'],
    examples: [
      {
        input: '5\n2 3 1 1 4',
        displayInput: 'nums = [2,3,1,1,4]',
        output: '2',
        displayOutput: '2',
        explanation: 'The minimum number of jumps to reach the last index is 2 (0 -> 1 -> 4).'
      },
      {
        input: '5\n2 3 0 1 4',
        displayInput: 'nums = [2,3,0,1,4]',
        output: '2',
        displayOutput: '2',
        explanation: 'Jump 0 -> 1 -> 4.'
      },
      {
        input: '1\n0',
        displayInput: 'nums = [0]',
        output: '0',
        displayOutput: '0',
        explanation: 'Already at the end.'
      }
    ],
    hints: [
      'Maintain curEnd (end of current jump window), curFarthest (max reach in window), and jumps count.',
      'Iterate i from 0 to n - 2: update curFarthest = max(curFarthest, i + nums[i]).',
      'When i == curEnd: jumps++, curEnd = curFarthest.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n <= 1) return '0';
      const nums = lines[1].trim().split(/\s+/).map(Number);

      let jumps = 0;
      let curEnd = 0;
      let curFarthest = 0;

      for (let i = 0; i < n - 1; i++) {
        curFarthest = Math.max(curFarthest, i + nums[i]);
        if (i === curEnd) {
          jumps++;
          curEnd = curFarthest;
        }
      }
      return jumps.toString();
    },
    hiddenTestCases: [
      { input: '2\n1 2', expected: '1' },
      { input: '3\n1 1 1', expected: '2' },
      { input: '4\n3 2 1 0', expected: '1' }
    ]
  }),

  // 10. Gas Station (Medium)
  createCanonicalProblem({
    problemId: 'dsa_greedy_10',
    topicId: 'greedy',
    order: 10,
    title: 'Gas Station',
    difficulty: 'Medium',
    tags: ['Array', 'Greedy'],
    statement: `There are n gas stations along a circular route, where the amount of gas at the ith station is gas[i].

You have a car with an unlimited gas tank and it costs cost[i] of gas to travel from the ith station to its next (i + 1)th station. You begin the journey with an empty tank at one of the gas stations.

Given two integer arrays gas and cost, return the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return -1. If there exists a solution, it is guaranteed to be unique.`,
    inputFormat: `First line: integer N.
Second line: N space-separated gas amounts.
Third line: N space-separated cost amounts.`,
    outputFormat: `Print starting index, or -1.`,
    constraints: ['n == gas.length == cost.length', '1 <= n <= 10^5', '0 <= gas[i], cost[i] <= 10^4'],
    examples: [
      {
        input: '5\n1 2 3 4 5\n3 4 5 1 2',
        displayInput: 'gas = [1,2,3,4,5], cost = [3,4,5,1,2]',
        output: '3',
        displayOutput: '3',
        explanation: 'Start at station 3 (index 3). Fill up with 4 unit of gas. Complete circuit.'
      },
      {
        input: '3\n2 3 4\n3 4 3',
        displayInput: 'gas = [2,3,4], cost = [3,4,3]',
        output: '-1',
        displayOutput: '-1',
        explanation: 'Total gas 9 < total cost 10, impossible to complete circuit.'
      },
      {
        input: '1\n2\n2',
        displayInput: 'gas = [2], cost = [2]',
        output: '0',
        displayOutput: '0',
        explanation: 'Single station with gas == cost.'
      }
    ],
    hints: [
      'If sum(gas) < sum(cost), impossible to complete circuit, return -1.',
      'Maintain tank = 0 and start = 0.',
      'Whenever tank + gas[i] - cost[i] < 0, reset start = i + 1 and tank = 0.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      const gas = lines[1].trim().split(/\s+/).map(Number);
      const cost = lines[2].trim().split(/\s+/).map(Number);

      let totalSurplus = 0;
      let tank = 0;
      let start = 0;

      for (let i = 0; i < n; i++) {
        const diff = gas[i] - cost[i];
        totalSurplus += diff;
        tank += diff;
        if (tank < 0) {
          start = i + 1;
          tank = 0;
        }
      }
      return totalSurplus >= 0 ? start.toString() : '-1';
    },
    hiddenTestCases: [
      { input: '2\n3 1\n2 2', expected: '0' },
      { input: '2\n1 3\n2 2', expected: '1' }
    ]
  }),

  // 11. Task Scheduler (Medium)
  createCanonicalProblem({
    problemId: 'dsa_greedy_11',
    topicId: 'greedy',
    order: 11,
    title: 'Task Scheduler',
    difficulty: 'Medium',
    tags: ['Array', 'Hash Table', 'Greedy', 'Sorting', 'Counting'],
    statement: `You are given an array of CPU tasks, each labeled with a letter from A to Z, and a number n. Each CPU interval can either execute a task or be idle. The same task must be separated by at least n intervals of cooling time.

Return the minimum number of CPU intervals required to complete all tasks.`,
    inputFormat: `First line: integer N.
Second line: N space-separated task characters.
Third line: integer cooldown N.`,
    outputFormat: `Print minimum CPU intervals.`,
    constraints: ['1 <= tasks.length <= 10^4', 'tasks[i] is an uppercase English letter.', '0 <= n <= 100'],
    examples: [
      {
        input: '6\nA A A B B B\n2',
        displayInput: 'tasks = ["A","A","A","B","B","B"], n = 2',
        output: '8',
        displayOutput: '8',
        explanation: 'A -> B -> idle -> A -> B -> idle -> A -> B takes 8 intervals.'
      },
      {
        input: '6\nA A A B B B\n0',
        displayInput: 'tasks = ["A","A","A","B","B","B"], n = 0',
        output: '6',
        displayOutput: '6',
        explanation: '6 intervals with 0 cooldown.'
      },
      {
        input: '6\nA A A A A A\n2',
        displayInput: 'tasks = ["A","A","A","A","A","A"], n = 2',
        output: '16',
        displayOutput: '16',
        explanation: '16 intervals.'
      }
    ],
    hints: [
      'Find the maximum frequency maxFreq among all tasks.',
      'Count how many tasks share this maxFreq (maxCount).',
      'The minimum intervals formula is Math.max(tasks.length, (maxFreq - 1) * (n + 1) + maxCount).'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const numTasks = parseInt(lines[0], 10);
      if (numTasks === 0) return '0';
      const tasks = lines[1].trim().split(/\s+/);
      const cooldown = parseInt(lines[2], 10);

      const freq = {};
      for (const t of tasks) freq[t] = (freq[t] || 0) + 1;

      let maxFreq = 0;
      for (const count of Object.values(freq)) {
        maxFreq = Math.max(maxFreq, count);
      }

      let maxCount = 0;
      for (const count of Object.values(freq)) {
        if (count === maxFreq) maxCount++;
      }

      const total = Math.max(tasks.length, (maxFreq - 1) * (cooldown + 1) + maxCount);
      return total.toString();
    },
    hiddenTestCases: [
      { input: '3\nA B C\n2', expected: '3' },
      { input: '4\nA A B B\n2', expected: '5' }
    ]
  }),

  // 12. Hand of Straights (Medium)
  createCanonicalProblem({
    problemId: 'dsa_greedy_12',
    topicId: 'greedy',
    order: 12,
    title: 'Hand of Straights',
    difficulty: 'Medium',
    tags: ['Array', 'Hash Table', 'Greedy', 'Sorting'],
    statement: `Alice has some number of cards and she wants to rearrange the cards into groups so that each group is of size groupSize, and consists of groupSize consecutive cards.

Given an integer array hand where hand[i] is the value written on the ith card and an integer groupSize, return true if she can rearrange the cards, or false otherwise.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer groupSize.`,
    outputFormat: `Print 'true' if possible, else 'false'.`,
    constraints: ['1 <= hand.length <= 10^4', '0 <= hand[i] <= 10^9', '1 <= groupSize <= hand.length'],
    examples: [
      {
        input: '9\n1 2 3 6 2 3 4 7 8\n3',
        displayInput: 'hand = [1,2,3,6,2,3,4,7,8], groupSize = 3',
        output: 'true',
        displayOutput: 'true',
        explanation: 'Groups: [1,2,3], [2,3,4], [6,7,8].'
      },
      {
        input: '5\n1 2 3 4 5\n4',
        displayInput: 'hand = [1,2,3,4,5], groupSize = 4',
        output: 'false',
        displayOutput: 'false',
        explanation: 'Length 5 not divisible by 4.'
      },
      {
        input: '3\n1 2 3\n1',
        displayInput: 'hand = [1,2,3], groupSize = 1',
        output: 'true',
        displayOutput: 'true',
        explanation: 'Groups of size 1 always valid.'
      }
    ],
    hints: [
      'If hand.length % groupSize != 0, return false.',
      'Count frequencies of each card in a map.',
      'Sort unique card values in ascending order.',
      'For each card with count > 0, decrement count for card, card + 1, ..., card + groupSize - 1. If any is missing, return false.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      const hand = lines[1].trim().split(/\s+/).map(Number);
      const groupSize = parseInt(lines[2], 10);

      if (n % groupSize !== 0) return 'false';
      const count = {};
      for (const card of hand) count[card] = (count[card] || 0) + 1;

      hand.sort((a, b) => a - b);

      for (const card of hand) {
        if (count[card] > 0) {
          for (let i = 0; i < groupSize; i++) {
            const next = card + i;
            if (!count[next] || count[next] <= 0) return 'false';
            count[next]--;
          }
        }
      }
      return 'true';
    },
    hiddenTestCases: [
      { input: '4\n1 2 3 4\n2', expected: 'true' },
      { input: '4\n1 2 4 5\n2', expected: 'true' }
    ]
  }),

  // 13. Non-overlapping Intervals (Medium)
  createCanonicalProblem({
    problemId: 'dsa_greedy_13',
    topicId: 'greedy',
    order: 13,
    title: 'Non-overlapping Intervals',
    difficulty: 'Medium',
    tags: ['Array', 'Dynamic Programming', 'Greedy', 'Sorting'],
    statement: `Given an array of intervals intervals where intervals[i] = [starti, endi], return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.`,
    inputFormat: `First line: integer N.
Next N lines: two space-separated integers start and end.`,
    outputFormat: `Print minimum intervals to remove.`,
    constraints: ['1 <= intervals.length <= 10^5', 'intervals[i].length == 2', '-5 * 10^4 <= starti < endi <= 5 * 10^4'],
    examples: [
      {
        input: '4\n1 2\n2 3\n3 4\n1 3',
        displayInput: 'intervals = [[1,2],[2,3],[3,4],[1,3]]',
        output: '1',
        displayOutput: '1',
        explanation: '[1,3] can be removed and the rest of the intervals are non-overlapping.'
      },
      {
        input: '3\n1 2\n1 2\n1 2',
        displayInput: 'intervals = [[1,2],[1,2],[1,2]]',
        output: '2',
        displayOutput: '2',
        explanation: 'You need to remove two [1,2] to make the rest of the intervals non-overlapping.'
      },
      {
        input: '2\n1 2\n2 3',
        displayInput: 'intervals = [[1,2],[2,3]]',
        output: '0',
        displayOutput: '0',
        explanation: 'Already non-overlapping.'
      }
    ],
    hints: [
      'Sort intervals by end time ascending.',
      'Maintain end time of the last kept interval.',
      'If current start < lastEnd, there is an overlap: increment removal count. Otherwise update lastEnd = current.end.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n <= 1) return '0';
      const intervals = [];
      for (let i = 1; i <= n; i++) {
        intervals.push(lines[i].trim().split(/\s+/).map(Number));
      }

      intervals.sort((a, b) => a[1] - b[1]);

      let removed = 0;
      let lastEnd = intervals[0][1];

      for (let i = 1; i < n; i++) {
        if (intervals[i][0] < lastEnd) {
          removed++;
        } else {
          lastEnd = intervals[i][1];
        }
      }
      return removed.toString();
    },
    hiddenTestCases: [
      { input: '3\n1 100\n11 22\n1 11', expected: '1' },
      { input: '2\n1 5\n2 3', expected: '1' }
    ]
  }),

  // 14. Minimum Number of Arrows to Burst Balloons (Medium)
  createCanonicalProblem({
    problemId: 'dsa_greedy_14',
    topicId: 'greedy',
    order: 14,
    title: 'Minimum Number of Arrows to Burst Balloons',
    difficulty: 'Medium',
    tags: ['Array', 'Greedy', 'Sorting'],
    statement: `There are some spherical balloons taped onto a flat wall that represents the XY-plane. The balloons are represented as a 2D integer array points where points[i] = [xstart, xend] denotes a balloon whose horizontal diameter stretches between xstart and xend.

Arrows can be shot up directly vertically (in the positive y-direction) from different points along the x-axis. A balloon with xstart and xend is burst by an arrow shot at x if xstart <= x <= xend.

Given the array points, return the minimum number of arrows that must be shot to burst all balloons.`,
    inputFormat: `First line: integer N.
Next N lines: two space-separated integers xstart and xend.`,
    outputFormat: `Print minimum arrows needed.`,
    constraints: ['1 <= points.length <= 10^5', 'points[i].length == 2', '-2^31 <= xstart < xend <= 2^31 - 1'],
    examples: [
      {
        input: '4\n10 16\n2 8\n1 6\n7 12',
        displayInput: 'points = [[10,16],[2,8],[1,6],[7,12]]',
        output: '2',
        displayOutput: '2',
        explanation: 'Shoot arrow at x = 6 (bursts [2,8] and [1,6]) and x = 11 (bursts [10,16] and [7,12]).'
      },
      {
        input: '4\n1 2\n3 4\n5 6\n7 8',
        displayInput: 'points = [[1,2],[3,4],[5,6],[7,8]]',
        output: '4',
        displayOutput: '4',
        explanation: '4 disjoint intervals require 4 arrows.'
      },
      {
        input: '4\n1 2\n2 3\n3 4\n4 5',
        displayInput: 'points = [[1,2],[2,3],[3,4],[4,5]]',
        output: '2',
        displayOutput: '2',
        explanation: 'Shoot at x = 2 (bursts [1,2] and [2,3]) and x = 4 (bursts [3,4] and [4,5]).'
      }
    ],
    hints: [
      'Sort balloons by their end coordinate ascending.',
      'Shoot the first arrow at the end coordinate of the first balloon.',
      'Whenever a balloon has start > current arrow position, shoot a new arrow at its end coordinate.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n <= 1) return n.toString();
      const points = [];
      for (let i = 1; i <= n; i++) {
        points.push(lines[i].trim().split(/\s+/).map(Number));
      }

      points.sort((a, b) => a[1] - b[1]);

      let arrows = 1;
      let arrowPos = points[0][1];

      for (let i = 1; i < n; i++) {
        if (points[i][0] > arrowPos) {
          arrows++;
          arrowPos = points[i][1];
        }
      }
      return arrows.toString();
    },
    hiddenTestCases: [
      { input: '1\n1 2', expected: '1' },
      { input: '2\n1 5\n2 6', expected: '1' }
    ]
  }),

  // 15. Partition Labels (Medium)
  createCanonicalProblem({
    problemId: 'dsa_greedy_15',
    topicId: 'greedy',
    order: 15,
    title: 'Partition Labels',
    difficulty: 'Medium',
    tags: ['Hash Table', 'Two Pointers', 'String', 'Greedy'],
    statement: `You are given a string s. We want to partition the string into as many parts as possible so that each letter appears in at most one part.

Note that the partition is done so that after concatenating all the parts in order, the resultant string should be s.

Return a list of integers representing the size of these parts, separated by spaces.`,
    inputFormat: `First line: string s.`,
    outputFormat: `Print partition lengths separated by spaces.`,
    constraints: ['1 <= s.length <= 500', 's consists of lowercase English letters.'],
    examples: [
      {
        input: 'ababcbacadefegdehijhklij',
        displayInput: 's = "ababcbacadefegdehijhklij"',
        output: '9 7 8',
        displayOutput: '[9, 7, 8]',
        explanation: 'The partition is "ababcbaca", "defegde", "hijhklij".'
      },
      {
        input: 'eccbbbbdec',
        displayInput: 's = "eccbbbbdec"',
        output: '10',
        displayOutput: '[10]',
        explanation: 'Entire string must be single partition because "e" appears at index 0 and 8, "c" at 1 and 9.'
      },
      {
        input: 'a',
        displayInput: 's = "a"',
        output: '1',
        displayOutput: '[1]',
        explanation: 'Single character.'
      }
    ],
    hints: [
      'Record the last occurrence index of each character in a map.',
      'Iterate through the string: expand end boundary = max(end, last[char]).',
      'When current index i reaches end, record partition size (end - start + 1) and reset start = i + 1.'
    ],
    solveFunction: (input) => {
      const s = input.trim();
      const last = {};
      for (let i = 0; i < s.length; i++) {
        last[s[i]] = i;
      }

      let start = 0;
      let end = 0;
      const res = [];

      for (let i = 0; i < s.length; i++) {
        end = Math.max(end, last[s[i]]);
        if (i === end) {
          res.push(end - start + 1);
          start = i + 1;
        }
      }
      return res.join(' ');
    },
    hiddenTestCases: [
      { input: 'abc', expected: '1 1 1' },
      { input: 'abccba', expected: '6' }
    ]
  }),

  // 16. Car Fleet (Medium)
  createCanonicalProblem({
    problemId: 'dsa_greedy_16',
    topicId: 'greedy',
    order: 16,
    title: 'Car Fleet',
    difficulty: 'Medium',
    tags: ['Array', 'Stack', 'Sorting', 'Monotonic Stack'],
    statement: `There are n cars at given miles away from the starting mile 0, traveling to reach the mile target.

You are given two integer array position and speed, both of length n, where position[i] is the starting position of the ith car and speed[i] is the speed of the ith car (in miles per hour).

A car cannot pass another car, but it can catch up and then travel at the speed of the slower car.

A car fleet is some non-empty set of cars driving at the same position and same speed. Note that a single car is also a car fleet.

Return the number of car fleets that will arrive at the destination.`,
    inputFormat: `First line: integer target.
Second line: integer N.
Third line: N space-separated positions.
Fourth line: N space-separated speeds.`,
    outputFormat: `Print the number of car fleets.`,
    constraints: ['n == position.length == speed.length', '1 <= n <= 10^5', '0 < target <= 10^6', '0 <= position[i] < target', 'All position values are unique.', '0 < speed[i] <= 10^6'],
    examples: [
      {
        input: '12\n5\n10 8 0 5 3\n2 4 1 1 3',
        displayInput: 'target = 12, position = [10,8,0,5,3], speed = [2,4,1,1,3]',
        output: '3',
        displayOutput: '3',
        explanation: 'Cars at 10 and 8 become a fleet, meeting at 12. Car at 0 arrives alone. Cars at 5 and 3 become a fleet. Total 3 fleets.'
      },
      {
        input: '10\n1\n3\n3',
        displayInput: 'target = 10, position = [3], speed = [3]',
        output: '1',
        displayOutput: '1',
        explanation: 'Only 1 car.'
      },
      {
        input: '100\n3\n0 2 4\n4 2 1',
        displayInput: 'target = 100, position = [0,2,4], speed = [4,2,1]',
        output: '1',
        displayOutput: '1',
        explanation: 'All cars catch up to the slowest lead car, forming 1 fleet.'
      }
    ],
    hints: [
      'Calculate time to reach target for each car: (target - position) / speed.',
      'Sort cars in descending order of starting position.',
      'Iterate through cars: if current car takes strictly more time than lead fleet car, it starts a new fleet.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const target = parseInt(lines[0], 10);
      const n = parseInt(lines[1], 10);
      if (n === 0) return '0';
      const pos = lines[2].trim().split(/\s+/).map(Number);
      const speed = lines[3].trim().split(/\s+/).map(Number);

      const cars = [];
      for (let i = 0; i < n; i++) {
        cars.push({ pos: pos[i], time: (target - pos[i]) / speed[i] });
      }
      cars.sort((a, b) => b.pos - a.pos);

      let fleets = 0;
      let maxTime = 0;

      for (const car of cars) {
        if (car.time > maxTime) {
          fleets++;
          maxTime = car.time;
        }
      }
      return fleets.toString();
    },
    hiddenTestCases: [
      { input: '10\n2\n6 8\n3 2', expected: '2' },
      { input: '10\n2\n0 5\n5 1', expected: '1' }
    ]
  }),

  // 17. Candy (Hard)
  createCanonicalProblem({
    problemId: 'dsa_greedy_17',
    topicId: 'greedy',
    order: 17,
    title: 'Candy',
    difficulty: 'Hard',
    tags: ['Array', 'Greedy'],
    statement: `There are n children standing in a line. Each child is assigned a rating value given in the integer array ratings.

You are giving candies to these children subjected to the following requirements:
- Each child must have at least one candy.
- Children with a higher rating get more candies than their neighbors.

Return the minimum number of candies you need to distribute.`,
    inputFormat: `First line: integer N.
Second line: N space-separated child ratings.`,
    outputFormat: `Print minimum total candies.`,
    constraints: ['n == ratings.length', '1 <= n <= 2 * 10^4', '0 <= ratings[i] <= 2 * 10^4'],
    examples: [
      {
        input: '3\n1 0 2',
        displayInput: 'ratings = [1,0,2]',
        output: '5',
        displayOutput: '5',
        explanation: 'Allocate candies: [2, 1, 2]. Total = 5.'
      },
      {
        input: '3\n1 2 2',
        displayInput: 'ratings = [1,2,2]',
        output: '4',
        displayOutput: '4',
        explanation: 'Allocate candies: [1, 2, 1]. Total = 4.'
      },
      {
        input: '1\n10',
        displayInput: 'ratings = [10]',
        output: '1',
        displayOutput: '1',
        explanation: 'Only 1 child gets 1 candy.'
      }
    ],
    hints: [
      'Initialize candies array of size N with 1s.',
      'Pass 1 (left to right): if ratings[i] > ratings[i-1], candies[i] = candies[i-1] + 1.',
      'Pass 2 (right to left): if ratings[i] > ratings[i+1], candies[i] = max(candies[i], candies[i+1] + 1).',
      'Sum all candies.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n === 0) return '0';
      const ratings = lines[1].trim().split(/\s+/).map(Number);

      const candies = new Array(n).fill(1);

      for (let i = 1; i < n; i++) {
        if (ratings[i] > ratings[i - 1]) {
          candies[i] = candies[i - 1] + 1;
        }
      }

      for (let i = n - 2; i >= 0; i--) {
        if (ratings[i] > ratings[i + 1]) {
          candies[i] = Math.max(candies[i], candies[i + 1] + 1);
        }
      }

      return candies.reduce((a, b) => a + b, 0).toString();
    },
    hiddenTestCases: [
      { input: '2\n1 2', expected: '3' },
      { input: '3\n1 2 3', expected: '6' },
      { input: '3\n3 2 1', expected: '6' }
    ]
  }),

  // 18. Minimum Number of Refueling Stops (Hard)
  createCanonicalProblem({
    problemId: 'dsa_greedy_18',
    topicId: 'greedy',
    order: 18,
    title: 'Minimum Number of Refueling Stops',
    difficulty: 'Hard',
    tags: ['Array', 'Dynamic Programming', 'Greedy', 'Heap (Priority Queue)'],
    statement: `A car travels from a starting position to a destination which is target miles east of the starting position.

There are gas stations along the way. The gas stations are represented as an array stations where stations[i] = [positioni, fueli] indicates that the ith gas station is positioni miles east of the starting position and has fueli liters of gas.

The car starts with an infinite tank of gas, which initially has startFuel liters of fuel in it. It uses one liter of gas per one mile that it drives. When the car reaches a gas station, it may stop and refuel, transferring all the gas from the station into the car.

Return the minimum number of refueling stops the car must make in order to reach its destination. If it cannot reach the destination, return -1.`,
    inputFormat: `First line: integer target.
Second line: integer startFuel.
Third line: integer N (stations count).
Next N lines: position fuel.`,
    outputFormat: `Print minimum stops, or -1.`,
    constraints: ['1 <= target, startFuel <= 10^9', '0 <= stations.length <= 500', '1 <= positioni < positioni+1 < target', '1 <= fueli <= 10^9'],
    examples: [
      {
        input: '1\n1\n0',
        displayInput: 'target = 1, startFuel = 1, stations = []',
        output: '0',
        displayOutput: '0',
        explanation: 'Already enough fuel to reach 1.'
      },
      {
        input: '100\n1\n1\n10 100',
        displayInput: 'target = 100, startFuel = 1, stations = [[10, 100]]',
        output: '-1',
        displayOutput: '-1',
        explanation: 'Car runs out of fuel at mile 1 before reaching first station at mile 10.'
      },
      {
        input: '100\n10\n4\n10 60\n20 30\n30 30\n60 40',
        displayInput: 'target = 100, startFuel = 10, stations = [[10,60],[20,30],[30,30],[60,40]]',
        output: '2',
        displayOutput: '2',
        explanation: 'Stop at mile 10 and mile 60 for total 2 stops.'
      }
    ],
    hints: [
      'Maintain max reach currentFuel and a max-heap of gas from passed stations.',
      'Drive forward station by station. While currentFuel < station.pos: refuel from the station with max gas in heap (stops++).',
      'If heap becomes empty and still currentFuel < station.pos, destination is unreachable (-1).'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const target = parseInt(lines[0], 10);
      let curFuel = parseInt(lines[1], 10);
      const n = parseInt(lines[2], 10);
      const stations = [];

      for (let i = 3; i < 3 + n; i++) {
        if (!lines[i]) continue;
        stations.push(lines[i].trim().split(/\s+/).map(Number));
      }
      stations.push([target, 0]);

      const passedFuel = [];
      let stops = 0;

      for (const [pos, fuel] of stations) {
        while (curFuel < pos && passedFuel.length > 0) {
          passedFuel.sort((a, b) => b - a);
          curFuel += passedFuel.shift();
          stops++;
        }
        if (curFuel < pos) return '-1';
        passedFuel.push(fuel);
      }
      return stops.toString();
    },
    hiddenTestCases: [
      { input: '100\n50\n1\n50 50', expected: '1' },
      { input: '100\n25\n2\n25 25\n50 50', expected: '2' }
    ]
  }),

  // 19. Course Schedule III (Hard)
  createCanonicalProblem({
    problemId: 'dsa_greedy_19',
    topicId: 'greedy',
    order: 19,
    title: 'Course Schedule III',
    difficulty: 'Hard',
    tags: ['Array', 'Greedy', 'Sorting', 'Heap (Priority Queue)'],
    statement: `There are n different online courses numbered from 1 to n. You are given an array courses where courses[i] = [durationi, lastDayi] indicate that the ith course should be taken continuously for durationi days and must be finished before or on lastDayi.

You will start on the 1st day and you cannot take two or more courses simultaneously.

Return the maximum number of courses that you can take.`,
    inputFormat: `First line: integer N.
Next N lines: duration and lastDay.`,
    outputFormat: `Print maximum courses that can be taken.`,
    constraints: ['1 <= courses.length <= 10^4', '1 <= durationi, lastDayi <= 10^4'],
    examples: [
      {
        input: '4\n100 200\n200 1300\n1000 1250\n2000 3200',
        displayInput: 'courses = [[100,200],[200,1300],[1000,1250],[2000,3200]]',
        output: '3',
        displayOutput: '3',
        explanation: 'Take course 1 (finish day 100), course 3 (finish day 1100), course 2 (finish day 1300). Total 3 courses.'
      },
      {
        input: '3\n1 2\n2 3\n3 4',
        displayInput: 'courses = [[1,2],[2,3],[3,4]]',
        output: '2',
        displayOutput: '2',
        explanation: 'Take first 2 courses.'
      },
      {
        input: '3\n3 2\n4 3\n5 4',
        displayInput: 'courses = [[3,2],[4,3],[5,4]]',
        output: '0',
        displayOutput: '0',
        explanation: 'All course durations exceed lastDay.'
      }
    ],
    hints: [
      'Sort courses by lastDay ascending.',
      'Maintain running total time and a max-heap of course durations taken so far.',
      'Add current course duration to time. If time > lastDay, evict the longest duration course from heap.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n === 0) return '0';
      const courses = [];

      for (let i = 1; i <= n; i++) {
        if (!lines[i]) continue;
        courses.push(lines[i].trim().split(/\s+/).map(Number));
      }

      courses.sort((a, b) => a[1] - b[1]);

      let time = 0;
      const heap = [];

      for (const [duration, lastDay] of courses) {
        time += duration;
        heap.push(duration);
        heap.sort((a, b) => b - a);

        if (time > lastDay) {
          time -= heap.shift();
        }
      }
      return heap.length.toString();
    },
    hiddenTestCases: [
      { input: '1\n10 10', expected: '1' },
      { input: '2\n5 5\n4 6', expected: '1' }
    ]
  }),

  // 20. Create Maximum Number (Hard)
  createCanonicalProblem({
    problemId: 'dsa_greedy_20',
    topicId: 'greedy',
    order: 20,
    title: 'Create Maximum Number',
    difficulty: 'Hard',
    tags: ['Stack', 'Greedy', 'Monotonic Stack'],
    statement: `You are given two integer arrays nums1 and nums2 of lengths m and n respectively. nums1 and nums2 represent the digits of two numbers. You are also given an integer k.

Create the maximum number of length k <= m + n from digits of the two numbers. The relative order of the digits from the same array must be preserved.

Return an array of the k digits of the maximum number separated by spaces.`,
    inputFormat: `First line: integer N.
Second line: N digits of nums1.
Third line: integer M.
Fourth line: M digits of nums2.
Fifth line: integer K.`,
    outputFormat: `Print K digits separated by spaces.`,
    constraints: ['m == nums1.length', 'n == nums2.length', '1 <= m, n <= 500', '0 <= nums1[i], nums2[i] <= 9', '1 <= k <= m + n'],
    examples: [
      {
        input: '4\n3 4 6 5\n6\n9 1 2 5 8 3\n5',
        displayInput: 'nums1 = [3,4,6,5], nums2 = [9,1,2,5,8,3], k = 5',
        output: '9 8 6 5 3',
        displayOutput: '[9, 8, 6, 5, 3]',
        explanation: 'Picked digits [6, 5] from nums1 and [9, 8, 3] from nums2.'
      },
      {
        input: '3\n6 7 5\n4\n4 8 1 3\n3',
        displayInput: 'nums1 = [6,7,5], nums2 = [4,8,1,3], k = 3',
        output: '8 7 5',
        displayOutput: '[8, 7, 5]',
        explanation: 'Max 3-digit number.'
      },
      {
        input: '2\n3 9\n3\n8 9 9\n3',
        displayInput: 'nums1 = [3,9], nums2 = [8,9,9], k = 3',
        output: '9 9 9',
        displayOutput: '[9, 9, 9]',
        explanation: 'Selected [9] and [9, 9].'
      }
    ],
    hints: [
      'Iterate over the number of digits i to take from nums1 (0 <= i <= k), with k - i from nums2.',
      'Use a monotonic decreasing stack to get the max i digits from nums1 and max (k - i) digits from nums2.',
      'Merge the two arrays greedily using a comparator and find the lexicographically maximum result.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      const nums1 = n > 0 ? lines[1].trim().split(/\s+/).map(Number) : [];
      const m = parseInt(lines[2], 10);
      const nums2 = m > 0 ? lines[3].trim().split(/\s+/).map(Number) : [];
      const k = parseInt(lines[4], 10);

      const maxArray = (nums, pick) => {
        const stack = [];
        let drop = nums.length - pick;
        for (const num of nums) {
          while (drop > 0 && stack.length > 0 && stack[stack.length - 1] < num) {
            stack.pop();
            drop--;
          }
          stack.push(num);
        }
        return stack.slice(0, pick);
      };

      const greater = (arr1, i, arr2, j) => {
        while (i < arr1.length && j < arr2.length && arr1[i] === arr2[j]) {
          i++;
          j++;
        }
        return j === arr2.length || (i < arr1.length && arr1[i] > arr2[j]);
      };

      const merge = (arr1, arr2) => {
        const res = [];
        let i = 0;
        let j = 0;
        while (i < arr1.length || j < arr2.length) {
          if (greater(arr1, i, arr2, j)) {
            res.push(arr1[i++]);
          } else {
            res.push(arr2[j++]);
          }
        }
        return res;
      };

      let best = [];
      for (let i = Math.max(0, k - m); i <= Math.min(k, n); i++) {
        const candidate = merge(maxArray(nums1, i), maxArray(nums2, k - i));
        if (greater(candidate, 0, best, 0)) {
          best = candidate;
        }
      }
      return best.join(' ');
    },
    hiddenTestCases: [
      { input: '2\n1 2\n2\n3 4\n2', expected: '3 4' },
      { input: '1\n9\n1\n8\n1', expected: '9' }
    ]
  })
];


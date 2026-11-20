/**
 * Canonical DSA Placement Problems: DYNAMIC PROGRAMMING (20 Questions)
 * 7 Easy, 9 Medium, 4 Hard
 */

import { createCanonicalProblem } from './topicProblemHelper.js';

export const DYNAMIC_PROGRAMMING_PROBLEMS = [
  // 1. Climbing Stairs (Easy)
  createCanonicalProblem({
    problemId: 'dsa_dynamic-programming_01',
    topicId: 'dynamic-programming',
    order: 1,
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    tags: ['Math', 'Dynamic Programming', 'Memoization'],
    statement: `You are climbing a staircase. It takes n steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
    inputFormat: `First line: positive integer N (1 <= N <= 45).`,
    outputFormat: `Print the total number of distinct ways.`,
    constraints: ['1 <= n <= 45'],
    examples: [
      {
        input: '2',
        displayInput: 'n = 2',
        output: '2',
        displayOutput: '2',
        explanation: 'There are two ways to climb to the top: 1. 1 step + 1 step, 2. 2 steps.'
      },
      {
        input: '3',
        displayInput: 'n = 3',
        output: '3',
        displayOutput: '3',
        explanation: '1+1+1, 1+2, 2+1.'
      },
      {
        input: '1',
        displayInput: 'n = 1',
        output: '1',
        displayOutput: '1',
        explanation: 'Only 1 step.'
      }
    ],
    hints: [
      'To reach step i, you could have come from step i - 1 or step i - 2.',
      'Therefore, ways[i] = ways[i - 1] + ways[i - 2].',
      'This matches the Fibonacci sequence.'
    ],
    solveFunction: (input) => {
      const n = parseInt(input.trim(), 10);
      if (n <= 2) return n.toString();
      let prev2 = 1;
      let prev1 = 2;
      for (let i = 3; i <= n; i++) {
        const cur = prev1 + prev2;
        prev2 = prev1;
        prev1 = cur;
      }
      return prev1.toString();
    },
    hiddenTestCases: [
      { input: '4', expected: '5' },
      { input: '5', expected: '8' },
      { input: '10', expected: '89' }
    ]
  }),

  // 2. Min Cost Climbing Stairs (Easy)
  createCanonicalProblem({
    problemId: 'dsa_dynamic-programming_02',
    topicId: 'dynamic-programming',
    order: 2,
    title: 'Min Cost Climbing Stairs',
    difficulty: 'Easy',
    tags: ['Array', 'Dynamic Programming'],
    statement: `You are given an integer array cost where cost[i] is the cost of ith step on a staircase. Once you pay the cost, you can either climb one or two steps.

You can either start from the step with index 0, or the step with index 1.

Return the minimum cost to reach the top of the floor.`,
    inputFormat: `First line: integer N.
Second line: N space-separated non-negative cost integers.`,
    outputFormat: `Print minimum cost.`,
    constraints: ['2 <= cost.length <= 1000', '0 <= cost[i] <= 999'],
    examples: [
      {
        input: '3\n10 15 20',
        displayInput: 'cost = [10, 15, 20]',
        output: '15',
        displayOutput: '15',
        explanation: 'Start on index 1 (pay 15) and climb 2 steps to reach the top.'
      },
      {
        input: '10\n1 100 1 1 1 100 1 1 100 1',
        displayInput: 'cost = [1,100,1,1,1,100,1,1,100,1]',
        output: '6',
        displayOutput: '6',
        explanation: 'Cheapest path pays 6 in total.'
      },
      {
        input: '2\n0 0',
        displayInput: 'cost = [0, 0]',
        output: '0',
        displayOutput: '0',
        explanation: 'Zero cost.'
      }
    ],
    hints: [
      'Let dp[i] be the minimum cost to reach step i.',
      'dp[i] = cost[i] + min(dp[i - 1], dp[i - 2]).',
      'The cost to reach the top is min(dp[n - 1], dp[n - 2]).'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      const cost = lines[1].trim().split(/\s+/).map(Number);

      let prev2 = cost[0];
      let prev1 = cost[1];

      for (let i = 2; i < n; i++) {
        const cur = cost[i] + Math.min(prev1, prev2);
        prev2 = prev1;
        prev1 = cur;
      }
      return Math.min(prev1, prev2).toString();
    },
    hiddenTestCases: [
      { input: '2\n10 15', expected: '10' },
      { input: '4\n1 2 3 4', expected: '4' }
    ]
  }),

  // 3. House Robber (Easy)
  createCanonicalProblem({
    problemId: 'dsa_dynamic-programming_03',
    topicId: 'dynamic-programming',
    order: 3,
    title: 'House Robber',
    difficulty: 'Easy',
    tags: ['Array', 'Dynamic Programming'],
    statement: `You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night.

Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.`,
    inputFormat: `First line: integer N.
Second line: N space-separated non-negative money integers.`,
    outputFormat: `Print maximum money.`,
    constraints: ['1 <= nums.length <= 100', '0 <= nums[i] <= 400'],
    examples: [
      {
        input: '4\n1 2 3 1',
        displayInput: 'nums = [1,2,3,1]',
        output: '4',
        displayOutput: '4',
        explanation: 'Rob house 1 (money = 1) and then rob house 3 (money = 3). Total = 4.'
      },
      {
        input: '5\n2 7 9 3 1',
        displayInput: 'nums = [2,7,9,3,1]',
        output: '12',
        displayOutput: '12',
        explanation: 'Rob house 1 (2), house 3 (9), and house 5 (1). Total = 12.'
      },
      {
        input: '1\n100',
        displayInput: 'nums = [100]',
        output: '100',
        displayOutput: '100',
        explanation: 'Only 1 house.'
      }
    ],
    hints: [
      'At house i, you have two choices: rob house i (and add money to best from i - 2) or skip house i (take best from i - 1).',
      'rob[i] = max(rob[i - 1], nums[i] + rob[i - 2]).'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n === 0) return '0';
      const nums = lines[1].trim().split(/\s+/).map(Number);
      if (n === 1) return nums[0].toString();

      let prev2 = 0;
      let prev1 = 0;

      for (const num of nums) {
        const cur = Math.max(prev1, prev2 + num);
        prev2 = prev1;
        prev1 = cur;
      }
      return prev1.toString();
    },
    hiddenTestCases: [
      { input: '2\n1 2', expected: '2' },
      { input: '3\n2 1 1', expected: '3' },
      { input: '4\n2 1 1 2', expected: '4' }
    ]
  }),

  // 4. Pascal's Triangle (Easy)
  createCanonicalProblem({
    problemId: 'dsa_dynamic-programming_04',
    topicId: 'dynamic-programming',
    order: 4,
    title: "Pascal's Triangle",
    difficulty: 'Easy',
    tags: ['Array', 'Dynamic Programming'],
    statement: `Given an integer numRows, return the first numRows of Pascal's triangle.

In Pascal's triangle, each number is the sum of the two numbers directly above it.`,
    inputFormat: `First line: integer numRows.`,
    outputFormat: `Print each row of Pascal's triangle on a new line with space-separated integers.`,
    constraints: ['1 <= numRows <= 30'],
    examples: [
      {
        input: '5',
        displayInput: 'numRows = 5',
        output: '1\n1 1\n1 2 1\n1 3 3 1\n1 4 6 4 1',
        displayOutput: '[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]',
        explanation: 'First 5 rows of Pascal triangle.'
      },
      {
        input: '1',
        displayInput: 'numRows = 1',
        output: '1',
        displayOutput: '[[1]]',
        explanation: 'Only root 1.'
      },
      {
        input: '2',
        displayInput: 'numRows = 2',
        output: '1\n1 1',
        displayOutput: '[[1],[1,1]]',
        explanation: 'First 2 rows.'
      }
    ],
    hints: [
      'Outer edges are always 1: row[0] = 1 and row[row.length - 1] = 1.',
      'Internal elements: row[j] = prevRow[j - 1] + prevRow[j].'
    ],
    solveFunction: (input) => {
      const n = parseInt(input.trim(), 10);
      const triangle = [];

      for (let i = 0; i < n; i++) {
        const row = new Array(i + 1).fill(1);
        for (let j = 1; j < i; j++) {
          row[j] = triangle[i - 1][j - 1] + triangle[i - 1][j];
        }
        triangle.push(row);
      }
      return triangle.map((r) => r.join(' ')).join('\n');
    },
    hiddenTestCases: [
      { input: '3', expected: '1\n1 1\n1 2 1' },
      { input: '4', expected: '1\n1 1\n1 2 1\n1 3 3 1' }
    ]
  }),

  // 5. Divisor Game (Easy)
  createCanonicalProblem({
    problemId: 'dsa_dynamic-programming_05',
    topicId: 'dynamic-programming',
    order: 5,
    title: 'Divisor Game',
    difficulty: 'Easy',
    tags: ['Math', 'Dynamic Programming', 'Brainteaser', 'Game Theory'],
    statement: `Alice and Bob take turns playing a game, with Alice starting first.

Initially, there is a number n on the chalkboard. On each player's turn, that player makes a move consisting of:
- Choosing any x with 0 < x < n and n % x == 0.
- Replacing the number n on the chalkboard with n - x.

Also, if a player cannot make a move, they lose the game.

Return true if and only if Alice wins the game, assuming both players play optimally.`,
    inputFormat: `First line: integer N.`,
    outputFormat: `Print 'true' if Alice wins, else 'false'.`,
    constraints: ['1 <= n <= 1000'],
    examples: [
      {
        input: '2',
        displayInput: 'n = 2',
        output: 'true',
        displayOutput: 'true',
        explanation: 'Alice chooses x = 1, and Bob has no more moves.'
      },
      {
        input: '3',
        displayInput: 'n = 3',
        output: 'false',
        displayOutput: 'false',
        explanation: 'Alice chooses x = 1, Bob chooses x = 1, and Alice loses.'
      },
      {
        input: '4',
        displayInput: 'n = 4',
        output: 'true',
        displayOutput: 'true',
        explanation: 'Alice chooses 1 leaving 3 (losing state for Bob).'
      }
    ],
    hints: [
      'If n is even, Alice can always pick x = 1 leaving Bob with an odd number.',
      'An odd number only has odd divisors, so Bob must subtract an odd number, handing an even number back to Alice.',
      'Hence, Alice wins if and only if n % 2 == 0.'
    ],
    solveFunction: (input) => {
      const n = parseInt(input.trim(), 10);
      return n % 2 === 0 ? 'true' : 'false';
    },
    hiddenTestCases: [
      { input: '1', expected: 'false' },
      { input: '6', expected: 'true' },
      { input: '7', expected: 'false' }
    ]
  }),

  // 6. Counting Bits (Easy)
  createCanonicalProblem({
    problemId: 'dsa_dynamic-programming_06',
    topicId: 'dynamic-programming',
    order: 6,
    title: 'Counting Bits',
    difficulty: 'Easy',
    tags: ['Dynamic Programming', 'Bit Manipulation'],
    statement: `Given an integer n, return an array ans of length n + 1 such that for each i (0 <= i <= n), ans[i] is the number of 1's in the binary representation of i.

Print the counts separated by spaces.`,
    inputFormat: `First line: integer N.`,
    outputFormat: `Print bit counts from 0 to N separated by spaces.`,
    constraints: ['0 <= n <= 10^5'],
    examples: [
      {
        input: '2',
        displayInput: 'n = 2',
        output: '0 1 1',
        displayOutput: '[0, 1, 1]',
        explanation: '0: 0, 1: 1, 2: 10 (one 1).'
      },
      {
        input: '5',
        displayInput: 'n = 5',
        output: '0 1 1 2 1 2',
        displayOutput: '[0, 1, 1, 2, 1, 2]',
        explanation: 'Counts of 1 bits for numbers 0 to 5.'
      },
      {
        input: '0',
        displayInput: 'n = 0',
        output: '0',
        displayOutput: '[0]',
        explanation: 'Only number 0.'
      }
    ],
    hints: [
      'Notice that dp[i] = dp[i >> 1] + (i & 1).',
      'Shifting right by 1 removes the least significant bit, which was already computed.'
    ],
    solveFunction: (input) => {
      const n = parseInt(input.trim(), 10);
      const dp = new Array(n + 1).fill(0);
      for (let i = 1; i <= n; i++) {
        dp[i] = dp[i >> 1] + (i & 1);
      }
      return dp.join(' ');
    },
    hiddenTestCases: [
      { input: '1', expected: '0 1' },
      { input: '4', expected: '0 1 1 2 1' }
    ]
  }),

  // 7. Maximum Subarray Sum (Kadane's DP) (Easy)
  createCanonicalProblem({
    problemId: 'dsa_dynamic-programming_07',
    topicId: 'dynamic-programming',
    order: 7,
    title: 'Maximum Subarray Sum',
    difficulty: 'Easy',
    tags: ['Array', 'Divide and Conquer', 'Dynamic Programming'],
    statement: `Given an integer array nums, find the subarray with the largest sum, and return its sum.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the maximum subarray sum.`,
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    examples: [
      {
        input: '9\n-2 1 -3 4 -1 2 1 -5 4',
        displayInput: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        displayOutput: '6',
        explanation: 'Subarray [4,-1,2,1] has the largest sum 6.'
      },
      {
        input: '1\n1',
        displayInput: 'nums = [1]',
        output: '1',
        displayOutput: '1',
        explanation: 'Subarray [1] has largest sum 1.'
      },
      {
        input: '5\n5 4 -1 7 8',
        displayInput: 'nums = [5,4,-1,7,8]',
        output: '23',
        displayOutput: '23',
        explanation: 'All elements sum to 23.'
      }
    ],
    hints: [
      'Maintain running currentSum and maxSum.',
      'currentSum = max(nums[i], currentSum + nums[i]).',
      'maxSum = max(maxSum, currentSum).'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n === 0) return '0';
      const nums = lines[1].trim().split(/\s+/).map(Number);

      let currentSum = nums[0];
      let maxSum = nums[0];

      for (let i = 1; i < n; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
      }
      return maxSum.toString();
    },
    hiddenTestCases: [
      { input: '2\n-1 -2', expected: '-1' },
      { input: '3\n-2 -3 -1', expected: '-1' }
    ]
  }),

  // 8. Longest Increasing Subsequence (Medium)
  createCanonicalProblem({
    problemId: 'dsa_dynamic-programming_08',
    topicId: 'dynamic-programming',
    order: 8,
    title: 'Longest Increasing Subsequence',
    difficulty: 'Medium',
    tags: ['Array', 'Binary Search', 'Dynamic Programming'],
    statement: `Given an integer array nums, return the length of the longest strictly increasing subsequence.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the length of the LIS.`,
    constraints: ['1 <= nums.length <= 2500', '-10^4 <= nums[i] <= 10^4'],
    examples: [
      {
        input: '8\n10 9 2 5 3 7 101 18',
        displayInput: 'nums = [10,9,2,5,3,7,101,18]',
        output: '4',
        displayOutput: '4',
        explanation: 'The longest increasing subsequence is [2,3,7,101], therefore the length is 4.'
      },
      {
        input: '6\n0 1 0 3 2 3',
        displayInput: 'nums = [0,1,0,3,2,3]',
        output: '4',
        displayOutput: '4',
        explanation: '[0, 1, 2, 3] of length 4.'
      },
      {
        input: '7\n7 7 7 7 7 7 7',
        displayInput: 'nums = [7,7,7,7,7,7,7]',
        output: '1',
        displayOutput: '1',
        explanation: 'Strictly increasing, so max length is 1.'
      }
    ],
    hints: [
      'Maintain tails array where tails[i] stores smallest tail of all increasing subsequences of length i + 1.',
      'For each x in nums, binary search for x in tails.',
      'If x > all elements in tails, append x; otherwise replace first element >= x.',
      'The length of tails is the length of LIS in O(N log N).'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n === 0) return '0';
      const nums = lines[1].trim().split(/\s+/).map(Number);

      const tails = [];
      for (const x of nums) {
        let low = 0;
        let high = tails.length;
        while (low < high) {
          const mid = Math.floor((low + high) / 2);
          if (tails[mid] < x) low = mid + 1;
          else high = mid;
        }
        if (low === tails.length) tails.push(x);
        else tails[low] = x;
      }
      return tails.length.toString();
    },
    hiddenTestCases: [
      { input: '1\n10', expected: '1' },
      { input: '4\n4 3 2 1', expected: '1' },
      { input: '5\n1 3 6 7 9', expected: '5' }
    ]
  }),

  // 9. Coin Change (Medium)
  createCanonicalProblem({
    problemId: 'dsa_dynamic-programming_09',
    topicId: 'dynamic-programming',
    order: 9,
    title: 'Coin Change',
    difficulty: 'Medium',
    tags: ['Array', 'Dynamic Programming', 'Breadth-First Search'],
    statement: `You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.

You may assume that you have an infinite number of each kind of coin.`,
    inputFormat: `First line: integer N.
Second line: N space-separated coin denominations.
Third line: target amount.`,
    outputFormat: `Print fewest coins, or -1.`,
    constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
    examples: [
      {
        input: '3\n1 2 5\n11',
        displayInput: 'coins = [1,2,5], amount = 11',
        output: '3',
        displayOutput: '3',
        explanation: '11 = 5 + 5 + 1 (3 coins).'
      },
      {
        input: '1\n2\n3',
        displayInput: 'coins = [2], amount = 3',
        output: '-1',
        displayOutput: '-1',
        explanation: 'Cannot form amount 3 with only coin of 2.'
      },
      {
        input: '1\n1\n0',
        displayInput: 'coins = [1], amount = 0',
        output: '0',
        displayOutput: '0',
        explanation: '0 amount requires 0 coins.'
      }
    ],
    hints: [
      'Initialize dp array of size amount + 1 with Infinity, and dp[0] = 0.',
      'For i from 1 to amount, for each coin in coins: if i - coin >= 0, dp[i] = min(dp[i], 1 + dp[i - coin]).',
      'Return dp[amount] === Infinity ? -1 : dp[amount].'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      const coins = lines[1].trim().split(/\s+/).map(Number);
      const amount = parseInt(lines[2], 10);

      const dp = new Array(amount + 1).fill(Infinity);
      dp[0] = 0;

      for (let i = 1; i <= amount; i++) {
        for (const c of coins) {
          if (i - c >= 0) {
            dp[i] = Math.min(dp[i], 1 + dp[i - c]);
          }
        }
      }
      return dp[amount] === Infinity ? '-1' : dp[amount].toString();
    },
    hiddenTestCases: [
      { input: '2\n2 5\n10', expected: '2' },
      { input: '1\n1\n5', expected: '5' }
    ]
  }),

  // 10. Maximum Product Subarray (Medium)
  createCanonicalProblem({
    problemId: 'dsa_dynamic-programming_10',
    topicId: 'dynamic-programming',
    order: 10,
    title: 'Maximum Product Subarray',
    difficulty: 'Medium',
    tags: ['Array', 'Dynamic Programming'],
    statement: `Given an integer array nums, find a subarray that has the largest product, and return the product.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the maximum product.`,
    constraints: ['1 <= nums.length <= 2 * 10^4', '-10 <= nums[i] <= 10', 'The product of any prefix or suffix of nums fits in a 32-bit integer.'],
    examples: [
      {
        input: '4\n2 3 -2 4',
        displayInput: 'nums = [2,3,-2,4]',
        output: '6',
        displayOutput: '6',
        explanation: '[2,3] has the largest product 6.'
      },
      {
        input: '3\n-2 0 -1',
        displayInput: 'nums = [-2,0,-1]',
        output: '0',
        displayOutput: '0',
        explanation: 'Subarray [0] has largest product 0.'
      },
      {
        input: '2\n-2 3',
        displayInput: 'nums = [-2,3]',
        output: '3',
        displayOutput: '3',
        explanation: 'Subarray [3] has largest product 3.'
      }
    ],
    hints: [
      'Maintain both maxProduct and minProduct ending at current index.',
      'When nums[i] is negative, swap maxProduct and minProduct.',
      'maxProduct = max(nums[i], maxProduct * nums[i]), minProduct = min(nums[i], minProduct * nums[i]).'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n === 0) return '0';
      const nums = lines[1].trim().split(/\s+/).map(Number);

      let maxProd = nums[0];
      let minProd = nums[0];
      let globalMax = nums[0];

      for (let i = 1; i < n; i++) {
        if (nums[i] < 0) {
          const tmp = maxProd;
          maxProd = minProd;
          minProd = tmp;
        }
        maxProd = Math.max(nums[i], maxProd * nums[i]);
        minProd = Math.min(nums[i], minProd * nums[i]);
        globalMax = Math.max(globalMax, maxProd);
      }
      return globalMax.toString();
    },
    hiddenTestCases: [
      { input: '2\n-2 -3', expected: '6' },
      { input: '3\n-2 -3 -4', expected: '12' }
    ]
  }),

  // 11. 0/1 Knapsack Problem (Medium)
  createCanonicalProblem({
    problemId: 'dsa_dynamic-programming_11',
    topicId: 'dynamic-programming',
    order: 11,
    title: '0/1 Knapsack Problem',
    difficulty: 'Medium',
    tags: ['Dynamic Programming'],
    statement: `You are given weights and values of N items. Put these items in a knapsack of capacity W to get the maximum total value in the knapsack. You cannot break an item, either pick the complete item or don’t pick it (0-1 property).`,
    inputFormat: `First line: two integers N and W.
Second line: N space-separated weights.
Third line: N space-separated values.`,
    outputFormat: `Print maximum value.`,
    constraints: ['1 <= N <= 1000', '1 <= W <= 1000', '1 <= wt[i] <= 1000', '1 <= val[i] <= 1000'],
    examples: [
      {
        input: '3 4\n4 5 1\n1 2 3',
        displayInput: 'N = 3, W = 4, wt = [4, 5, 1], val = [1, 2, 3]',
        output: '3',
        displayOutput: '3',
        explanation: 'Pick item with weight 1 and value 3.'
      },
      {
        input: '3 3\n1 2 3\n10 15 40',
        displayInput: 'N = 3, W = 3, wt = [1, 2, 3], val = [10, 15, 40]',
        output: '40',
        displayOutput: '40',
        explanation: 'Pick item with weight 3 and value 40.'
      },
      {
        input: '1 5\n10\n100',
        displayInput: 'N = 1, W = 5, wt = [10], val = [100]',
        output: '0',
        displayOutput: '0',
        explanation: 'Item weight 10 exceeds capacity 5.'
      }
    ],
    hints: [
      'Maintain dp array of size W + 1 initialized to 0.',
      'For each item (wt, val), iterate capacity w from W down to wt: dp[w] = max(dp[w], val + dp[w - wt]).',
      'Reverse traversal ensures each item is used at most once.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const [n, cap] = lines[0].trim().split(/\s+/).map(Number);
      const wt = lines[1].trim().split(/\s+/).map(Number);
      const val = lines[2].trim().split(/\s+/).map(Number);

      const dp = new Array(cap + 1).fill(0);

      for (let i = 0; i < n; i++) {
        for (let w = cap; w >= wt[i]; w--) {
          dp[w] = Math.max(dp[w], val[i] + dp[w - wt[i]]);
        }
      }
      return dp[cap].toString();
    },
    hiddenTestCases: [
      { input: '3 50\n10 20 30\n60 100 120', expected: '220' },
      { input: '2 10\n5 5\n10 20', expected: '30' }
    ]
  }),

  // 12. Longest Common Subsequence (Medium)
  createCanonicalProblem({
    problemId: 'dsa_dynamic-programming_12',
    topicId: 'dynamic-programming',
    order: 12,
    title: 'Longest Common Subsequence',
    difficulty: 'Medium',
    tags: ['String', 'Dynamic Programming'],
    statement: `Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.

A subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.`,
    inputFormat: `First line: string text1.
Second line: string text2.`,
    outputFormat: `Print length of LCS.`,
    constraints: ['1 <= text1.length, text2.length <= 1000', 'text1 and text2 consist of only lowercase English characters.'],
    examples: [
      {
        input: 'abcde\nace',
        displayInput: 'text1 = "abcde", text2 = "ace"',
        output: '3',
        displayOutput: '3',
        explanation: 'The longest common subsequence is "ace" and its length is 3.'
      },
      {
        input: 'abc\nabc',
        displayInput: 'text1 = "abc", text2 = "abc"',
        output: '3',
        displayOutput: '3',
        explanation: 'Strings are identical.'
      },
      {
        input: 'abc\ndef',
        displayInput: 'text1 = "abc", text2 = "def"',
        output: '0',
        displayOutput: '0',
        explanation: 'No common characters.'
      }
    ],
    hints: [
      'Create 2D table dp[m + 1][n + 1].',
      'If text1[i - 1] == text2[j - 1], dp[i][j] = 1 + dp[i - 1][j - 1].',
      'Otherwise dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]).'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split(/\s+/);
      const text1 = lines[0];
      const text2 = lines[1];
      const m = text1.length;
      const n = text2.length;

      const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          if (text1[i - 1] === text2[j - 1]) {
            dp[i][j] = 1 + dp[i - 1][j - 1];
          } else {
            dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
          }
        }
      }
      return dp[m][n].toString();
    },
    hiddenTestCases: [
      { input: 'oxcp\ncrxo', expected: '1' },
      { input: 'ezupkr\nubmrapg', expected: '2' }
    ]
  }),

  // 13. Word Break (Medium)
  createCanonicalProblem({
    problemId: 'dsa_dynamic-programming_13',
    topicId: 'dynamic-programming',
    order: 13,
    title: 'Word Break',
    difficulty: 'Medium',
    tags: ['Array', 'Hash Table', 'String', 'Dynamic Programming', 'Trie', 'Memoization'],
    statement: `Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.

Note that the same word in the dictionary may be reused multiple times in the segmentation.`,
    inputFormat: `First line: string S.
Second line: integer D (dict size).
Third line: D space-separated words.`,
    outputFormat: `Print 'true' if possible, else 'false'.`,
    constraints: ['1 <= s.length <= 300', '1 <= wordDict.length <= 1000', '1 <= wordDict[i].length <= 20', 'All strings consist of lowercase English letters.'],
    examples: [
      {
        input: 'leetcode\n2\nleet code',
        displayInput: 's = "leetcode", wordDict = ["leet","code"]',
        output: 'true',
        displayOutput: 'true',
        explanation: 'Return true because "leetcode" can be segmented as "leet code".'
      },
      {
        input: 'applepenapple\n2\napple pen',
        displayInput: 's = "applepenapple", wordDict = ["apple","pen"]',
        output: 'true',
        displayOutput: 'true',
        explanation: 'Segmented as "apple pen apple".'
      },
      {
        input: 'catsandog\n5\ncats dog sand and cat',
        displayInput: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]',
        output: 'false',
        displayOutput: 'false',
        explanation: 'Cannot segment.'
      }
    ],
    hints: [
      'Maintain dp boolean array of size s.length + 1, with dp[0] = true.',
      'For i from 1 to s.length: for j from 0 to i - 1: if dp[j] is true and wordDict has s[j..i], dp[i] = true.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const s = lines[0].trim();
      const d = parseInt(lines[1], 10);
      const dict = d > 0 ? new Set(lines[2].trim().split(/\s+/)) : new Set();

      const n = s.length;
      const dp = new Array(n + 1).fill(false);
      dp[0] = true;

      for (let i = 1; i <= n; i++) {
        for (let j = 0; j < i; j++) {
          if (dp[j] && dict.has(s.slice(j, i))) {
            dp[i] = true;
            break;
          }
        }
      }
      return dp[n] ? 'true' : 'false';
    },
    hiddenTestCases: [
      { input: 'a\n1\na', expected: 'true' },
      { input: 'a\n1\nb', expected: 'false' },
      { input: 'bb\n2\na b', expected: 'true' }
    ]
  }),

  // 14. House Robber II (Medium)
  createCanonicalProblem({
    problemId: 'dsa_dynamic-programming_14',
    topicId: 'dynamic-programming',
    order: 14,
    title: 'House Robber II',
    difficulty: 'Medium',
    tags: ['Array', 'Dynamic Programming'],
    statement: `You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. All houses at this place are arranged in a circle. That means the first house is the neighbor of the last one. Meanwhile, adjacent houses have a security system connected, and it will automatically contact the police if two adjacent houses were broken into on the same night.

Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.`,
    inputFormat: `First line: integer N.
Second line: N space-separated non-negative money integers.`,
    outputFormat: `Print maximum money.`,
    constraints: ['1 <= nums.length <= 100', '0 <= nums[i] <= 1000'],
    examples: [
      {
        input: '3\n2 3 2',
        displayInput: 'nums = [2,3,2]',
        output: '3',
        displayOutput: '3',
        explanation: 'You cannot rob house 1 (money = 2) and then rob house 3 (money = 2), because they are adjacent houses.'
      },
      {
        input: '4\n1 2 3 1',
        displayInput: 'nums = [1,2,3,1]',
        output: '4',
        displayOutput: '4',
        explanation: 'Rob house 1 (money = 1) and then rob house 3 (money = 3). Total = 4.'
      },
      {
        input: '1\n1',
        displayInput: 'nums = [1]',
        output: '1',
        displayOutput: '1',
        explanation: 'Single house.'
      }
    ],
    hints: [
      'Since house 0 and house N - 1 cannot be robbed together, decompose into two linear runs:',
      'Case 1: houses from 0 to N - 2.',
      'Case 2: houses from 1 to N - 1.',
      'Return max(Case 1, Case 2).'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n === 0) return '0';
      const nums = lines[1].trim().split(/\s+/).map(Number);
      if (n === 1) return nums[0].toString();

      const robLinear = (arr) => {
        let prev2 = 0;
        let prev1 = 0;
        for (const x of arr) {
          const cur = Math.max(prev1, prev2 + x);
          prev2 = prev1;
          prev1 = cur;
        }
        return prev1;
      };

      const c1 = robLinear(nums.slice(0, n - 1));
      const c2 = robLinear(nums.slice(1, n));
      return Math.max(c1, c2).toString();
    },
    hiddenTestCases: [
      { input: '2\n1 2', expected: '2' },
      { input: '3\n1 2 3', expected: '3' }
    ]
  }),

  // 15. Partition Equal Subset Sum (Medium)
  createCanonicalProblem({
    problemId: 'dsa_dynamic-programming_15',
    topicId: 'dynamic-programming',
    order: 15,
    title: 'Partition Equal Subset Sum',
    difficulty: 'Medium',
    tags: ['Array', 'Dynamic Programming'],
    statement: `Given an integer array nums, return true if you can partition the array into two subsets such that the sum of the elements in both subsets is equal or false otherwise.`,
    inputFormat: `First line: integer N.
Second line: N space-separated positive integers.`,
    outputFormat: `Print 'true' if possible, else 'false'.`,
    constraints: ['1 <= nums.length <= 200', '1 <= nums[i] <= 100'],
    examples: [
      {
        input: '4\n1 5 11 5',
        displayInput: 'nums = [1,5,11,5]',
        output: 'true',
        displayOutput: 'true',
        explanation: 'The array can be partitioned as [1, 5, 5] and [11].'
      },
      {
        input: '4\n1 2 3 5',
        displayInput: 'nums = [1,2,3,5]',
        output: 'false',
        displayOutput: 'false',
        explanation: 'Sum is 11 (odd), cannot be partitioned into two equal integer halves.'
      },
      {
        input: '2\n2 2',
        displayInput: 'nums = [2,2]',
        output: 'true',
        displayOutput: 'true',
        explanation: 'Equal subsets [2] and [2].'
      }
    ],
    hints: [
      'Compute sum of all elements. If sum is odd, return false immediately.',
      'Target is sum / 2. Use 0/1 knapsack subset sum DP: dp[j] |= dp[j - num].'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      const nums = lines[1].trim().split(/\s+/).map(Number);

      const total = nums.reduce((a, b) => a + b, 0);
      if (total % 2 !== 0) return 'false';
      const target = total / 2;

      const dp = new Array(target + 1).fill(false);
      dp[0] = true;

      for (const num of nums) {
        for (let j = target; j >= num; j--) {
          dp[j] = dp[j] || dp[j - num];
        }
      }
      return dp[target] ? 'true' : 'false';
    },
    hiddenTestCases: [
      { input: '3\n1 2 5', expected: 'false' },
      { input: '4\n2 2 3 5', expected: 'false' }
    ]
  }),

  // 16. Unique Paths (Medium)
  createCanonicalProblem({
    problemId: 'dsa_dynamic-programming_16',
    topicId: 'dynamic-programming',
    order: 16,
    title: 'Unique Paths',
    difficulty: 'Medium',
    tags: ['Math', 'Dynamic Programming', 'Combinatorics'],
    statement: `There is a robot on an m x n grid. The robot is initially located at the top-left corner (i.e., grid[0][0]). The robot tries to move to the bottom-right corner (i.e., grid[m - 1][n - 1]). The robot can only move either down or right at any point in time.

Given the two integers m and n, return the number of possible unique paths that the robot can take to reach the bottom-right corner.`,
    inputFormat: `First line: two integers M and N.`,
    outputFormat: `Print unique paths count.`,
    constraints: ['1 <= m, n <= 100'],
    examples: [
      {
        input: '3 7',
        displayInput: 'm = 3, n = 7',
        output: '28',
        displayOutput: '28',
        explanation: '28 unique paths.'
      },
      {
        input: '3 2',
        displayInput: 'm = 3, n = 2',
        output: '3',
        displayOutput: '3',
        explanation: 'From (0,0): 1. Right -> Down -> Down, 2. Down -> Down -> Right, 3. Down -> Right -> Down.'
      },
      {
        input: '1 1',
        displayInput: 'm = 1, n = 1',
        output: '1',
        displayOutput: '1',
        explanation: 'Only 1 path.'
      }
    ],
    hints: [
      'dp[r][c] = dp[r - 1][c] + dp[r][c - 1].',
      'Optimize space to a 1D row array: row[c] += row[c - 1].'
    ],
    solveFunction: (input) => {
      const [m, n] = input.trim().split(/\s+/).map(Number);
      const row = new Array(n).fill(1);
      for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
          row[j] += row[j - 1];
        }
      }
      return row[n - 1].toString();
    },
    hiddenTestCases: [
      { input: '3 3', expected: '6' },
      { input: '7 3', expected: '28' }
    ]
  }),

  // 17. Edit Distance (Hard)
  createCanonicalProblem({
    problemId: 'dsa_dynamic-programming_17',
    topicId: 'dynamic-programming',
    order: 17,
    title: 'Edit Distance',
    difficulty: 'Hard',
    tags: ['String', 'Dynamic Programming'],
    statement: `Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.

You have the following three operations permitted on a word:
- Insert a character
- Delete a character
- Replace a character`,
    inputFormat: `First line: word1 string.
Second line: word2 string.`,
    outputFormat: `Print minimum edit distance.`,
    constraints: ['0 <= word1.length, word2.length <= 500', 'word1 and word2 consist of lowercase English letters.'],
    examples: [
      {
        input: 'horse\nros',
        displayInput: 'word1 = "horse", word2 = "ros"',
        output: '3',
        displayOutput: '3',
        explanation: 'horse -> rorse (replace "h" with "r") -> rose (remove "r") -> ros (remove "e").'
      },
      {
        input: 'intention\nexecution',
        displayInput: 'word1 = "intention", word2 = "execution"',
        output: '5',
        displayOutput: '5',
        explanation: 'intention -> inention -> enention -> exention -> exection -> execution.'
      },
      {
        input: 'a\na',
        displayInput: 'word1 = "a", word2 = "a"',
        output: '0',
        displayOutput: '0',
        explanation: 'Identical strings.'
      }
    ],
    hints: [
      'Let dp[i][j] be min distance to convert word1[0..i] to word2[0..j].',
      'If word1[i - 1] == word2[j - 1], dp[i][j] = dp[i - 1][j - 1].',
      'Otherwise dp[i][j] = 1 + min(dp[i - 1][j] (delete), dp[i][j - 1] (insert), dp[i - 1][j - 1] (replace)).'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split(/\s+/);
      const w1 = lines[0] || '';
      const w2 = lines[1] || '';
      const m = w1.length;
      const n = w2.length;

      const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

      for (let i = 0; i <= m; i++) dp[i][0] = i;
      for (let j = 0; j <= n; j++) dp[0][j] = j;

      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          if (w1[i - 1] === w2[j - 1]) {
            dp[i][j] = dp[i - 1][j - 1];
          } else {
            dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
          }
        }
      }
      return dp[m][n].toString();
    },
    hiddenTestCases: [
      { input: 'zoologico\nzoologico', expected: '0' },
      { input: 'sunday\nsaturday', expected: '3' }
    ]
  }),

  // 18. Trapping Rain Water (Dynamic Programming Arrays) (Hard)
  createCanonicalProblem({
    problemId: 'dsa_dynamic-programming_18',
    topicId: 'dynamic-programming',
    order: 18,
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    tags: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack', 'Monotonic Stack'],
    statement: `Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining. Implement using DP prefix and suffix max arrays.`,
    inputFormat: `First line: integer N.
Second line: N space-separated non-negative integers.`,
    outputFormat: `Print total trapped water units.`,
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
        input: '3\n2 0 2',
        displayInput: 'height = [2,0,2]',
        output: '2',
        displayOutput: '2',
        explanation: '2 units trapped.'
      }
    ],
    hints: [
      'Precompute leftMax[i] = max(leftMax[i - 1], height[i]).',
      'Precompute rightMax[i] = max(rightMax[i + 1], height[i]).',
      'Water at index i is max(0, min(leftMax[i], rightMax[i]) - height[i]).'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n === 0) return '0';
      const height = lines[1].trim().split(/\s+/).map(Number);

      const leftMax = new Array(n);
      const rightMax = new Array(n);

      leftMax[0] = height[0];
      for (let i = 1; i < n; i++) leftMax[i] = Math.max(leftMax[i - 1], height[i]);

      rightMax[n - 1] = height[n - 1];
      for (let i = n - 2; i >= 0; i--) rightMax[i] = Math.max(rightMax[i + 1], height[i]);

      let total = 0;
      for (let i = 0; i < n; i++) {
        total += Math.min(leftMax[i], rightMax[i]) - height[i];
      }
      return total.toString();
    },
    hiddenTestCases: [
      { input: '3\n1 0 1', expected: '1' },
      { input: '4\n3 0 0 3', expected: '6' }
    ]
  }),

  // 19. Burst Balloons (Hard)
  createCanonicalProblem({
    problemId: 'dsa_dynamic-programming_19',
    topicId: 'dynamic-programming',
    order: 19,
    title: 'Burst Balloons',
    difficulty: 'Hard',
    tags: ['Array', 'Dynamic Programming'],
    statement: `You are given n balloons, indexed from 0 to n - 1. Each balloon is painted with a number on it represented by an array nums. You are asked to burst all the balloons.

If you burst the ith balloon, you will get nums[i - 1] * nums[i] * nums[i + 1] coins. If i - 1 or i + 1 goes out of bounds of the array, then treat it as if there is a balloon with a 1 painted on it.

Return the maximum coins you can collect by bursting the balloons wisely.`,
    inputFormat: `First line: integer N.
Second line: N space-separated positive integers.`,
    outputFormat: `Print maximum coins collected.`,
    constraints: ['n == nums.length', '1 <= n <= 300', '0 <= nums[i] <= 100'],
    examples: [
      {
        input: '4\n3 1 5 8',
        displayInput: 'nums = [3,1,5,8]',
        output: '167',
        displayOutput: '167',
        explanation: 'nums = [3,1,5,8] --> [3,5,8] --> [3,8] --> [8] --> [] coins = 3*1*5 + 3*5*8 + 1*3*8 + 1*8*1 = 15 + 120 + 24 + 8 = 167.'
      },
      {
        input: '2\n1 5',
        displayInput: 'nums = [1,5]',
        output: '10',
        displayOutput: '10',
        explanation: 'Burst 1 then 5: 1*1*5 + 1*5*1 = 5 + 5 = 10.'
      },
      {
        input: '1\n7',
        displayInput: 'nums = [7]',
        output: '7',
        displayOutput: '7',
        explanation: 'Only 1 balloon: 1*7*1 = 7.'
      }
    ],
    hints: [
      'Pad array with 1 at both ends: arr = [1, ...nums, 1].',
      'Think in reverse: instead of choosing which balloon bursts FIRST, choose which balloon k bursts LAST in interval (i, j).',
      'dp[i][j] = max(dp[i][j], dp[i][k] + dp[k][j] + arr[i] * arr[k] * arr[j]) for k in (i, j).'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n === 0) return '0';
      const nums = lines[1].trim().split(/\s+/).map(Number);

      const arr = [1, ...nums, 1];
      const m = arr.length;
      const dp = Array.from({ length: m }, () => new Array(m).fill(0));

      for (let len = 2; len < m; len++) {
        for (let i = 0; i < m - len; i++) {
          const j = i + len;
          for (let k = i + 1; k < j; k++) {
            dp[i][j] = Math.max(
              dp[i][j],
              dp[i][k] + dp[k][j] + arr[i] * arr[k] * arr[j]
            );
          }
        }
      }
      return dp[0][m - 1].toString();
    },
    hiddenTestCases: [
      { input: '3\n1 2 3', expected: '12' },
      { input: '2\n3 4', expected: '16' }
    ]
  }),

  // 20. Regular Expression Matching (Hard)
  createCanonicalProblem({
    problemId: 'dsa_dynamic-programming_20',
    topicId: 'dynamic-programming',
    order: 20,
    title: 'Regular Expression Matching',
    difficulty: 'Hard',
    tags: ['String', 'Dynamic Programming', 'Recursion'],
    statement: `Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where:
- '.' Matches any single character.
- '*' Matches zero or more of the preceding element.

The matching should cover the entire input string (not partial).`,
    inputFormat: `First line: input string S.
Second line: pattern string P.`,
    outputFormat: `Print 'true' if matches, else 'false'.`,
    constraints: ['1 <= s.length <= 20', '1 <= p.length <= 20', 's contains only lowercase English letters.', 'p contains only lowercase English letters, ".", and "*".'],
    examples: [
      {
        input: 'aa\na',
        displayInput: 's = "aa", p = "a"',
        output: 'false',
        displayOutput: 'false',
        explanation: '"a" does not match the entire string "aa".'
      },
      {
        input: 'aa\na*',
        displayInput: 's = "aa", p = "a*"',
        output: 'true',
        displayOutput: 'true',
        explanation: '"*" means zero or more of the preceding element, "a". Therefore, by repeating "a" once, it becomes "aa".'
      },
      {
        input: 'ab\n.*',
        displayInput: 's = "ab", p = ".*"',
        output: 'true',
        displayOutput: 'true',
        explanation: '".*" means "zero or more (*) of any character (.)".'
      }
    ],
    hints: [
      '2D boolean DP: dp[i][j] is true if s[0..i] matches p[0..j].',
      'dp[0][0] = true.',
      'For "*", check 0 matches: dp[i][j - 2], or if char matches p[j - 2], check 1+ matches: dp[i - 1][j].'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split(/\s+/);
      const s = lines[0] || '';
      const p = lines[1] || '';

      const m = s.length;
      const n = p.length;
      const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
      dp[0][0] = true;

      // Handle patterns like a*, a*b*, a*b*c* matching empty string
      for (let j = 2; j <= n; j += 2) {
        if (p[j - 1] === '*') {
          dp[0][j] = dp[0][j - 2];
        }
      }

      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          if (p[j - 1] === '*') {
            dp[i][j] = dp[i][j - 2]; // 0 occurrences
            if (p[j - 2] === '.' || p[j - 2] === s[i - 1]) {
              dp[i][j] = dp[i][j] || dp[i - 1][j]; // 1 or more occurrences
            }
          } else if (p[j - 1] === '.' || p[j - 1] === s[i - 1]) {
            dp[i][j] = dp[i - 1][j - 1];
          }
        }
      }
      return dp[m][n] ? 'true' : 'false';
    },
    hiddenTestCases: [
      { input: 'aab\nc*a*b', expected: 'true' },
      { input: 'mississippi\nmis*is*p*.', expected: 'false' }
    ]
  })
];


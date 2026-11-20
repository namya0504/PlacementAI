/**
 * Canonical DSA Placement Problems: HEAP / PRIORITY QUEUE (20 Questions)
 * 7 Easy, 9 Medium, 4 Hard
 */

import { createCanonicalProblem } from './topicProblemHelper.js';

export const HEAP_PRIORITY_QUEUE_PROBLEMS = [
  // 1. Kth Largest Element in a Stream (Easy)
  createCanonicalProblem({
    problemId: 'dsa_heap-priority-queue_01',
    topicId: 'heap-priority-queue',
    order: 1,
    title: 'Kth Largest Element in a Stream',
    difficulty: 'Easy',
    tags: ['Tree', 'Design', 'Binary Search Tree', 'Heap (Priority Queue)', 'Binary Tree', 'Data Stream'],
    statement: `Design a class to find the kth largest element in a stream. Note that it is the kth largest element in the sorted order, not the kth distinct element.

Given:
- integer k
- initial array of numbers
- a stream of additional numbers added one by one

Print the kth largest element after each addition, separated by spaces.`,
    inputFormat: `First line: integer K.
Second line: integer N.
Third line: N space-separated initial integers.
Fourth line: integer M.
Fifth line: M space-separated integers added to stream.`,
    outputFormat: `Print the K-th largest element after each addition separated by spaces.`,
    constraints: ['1 <= k <= 10^4', '0 <= nums.length <= 10^4', '-10^4 <= val <= 10^4', '1 <= M <= 10^4'],
    examples: [
      {
        input: '3\n4\n4 5 8 2\n5\n3 5 10 9 4',
        displayInput: 'k = 3, nums = [4,5,8,2], additions = [3,5,10,9,4]',
        output: '4 5 5 8 8',
        displayOutput: '[4, 5, 5, 8, 8]',
        explanation: 'After 3: 4; after 5: 5; after 10: 5; after 9: 8; after 4: 8.'
      },
      {
        input: '1\n1\n5\n2\n10 2',
        displayInput: 'k = 1, nums = [5], additions = [10, 2]',
        output: '10 10',
        displayOutput: '[10, 10]',
        explanation: 'After 10: max is 10; after 2: max is still 10.'
      },
      {
        input: '2\n0\n\n3\n1 2 3',
        displayInput: 'k = 2, nums = [], additions = [1, 2, 3]',
        output: '1 2',
        displayOutput: '[1, 2]',
        explanation: 'After 2: 2nd largest is 1; after 3: 2nd largest is 2.'
      }
    ],
    hints: [
      'Maintain a min-heap of size exactly k.',
      'When a new number arrives, if heap size < k, push it.',
      'Else if number > min-heap top, pop top and push new number.',
      'The top of the min-heap is always the k-th largest element.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const k = parseInt(lines[0], 10);
      const n = parseInt(lines[1], 10);
      const nums = n > 0 && lines[2] ? lines[2].trim().split(/\s+/).map(Number) : [];
      const mIdx = n > 0 ? 3 : 2;
      const m = parseInt(lines[mIdx], 10);
      const adds = m > 0 && lines[mIdx + 1] ? lines[mIdx + 1].trim().split(/\s+/).map(Number) : [];

      // maintain sorted array in ascending order of length at most k
      let heap = [...nums].sort((a, b) => a - b);
      while (heap.length > k) heap.shift();

      const res = [];
      for (const val of adds) {
        if (heap.length < k) {
          heap.push(val);
          heap.sort((a, b) => a - b);
        } else if (val > heap[0]) {
          heap[0] = val;
          heap.sort((a, b) => a - b);
        }
        if (heap.length >= k) {
          res.push(heap[0]);
        }
      }
      return res.join(' ');
    },
    hiddenTestCases: [
      { input: '2\n2\n1 2\n1\n3', expected: '2' },
      { input: '1\n2\n5 10\n1\n15', expected: '15' }
    ]
  }),

  // 2. Last Stone Weight (Easy)
  createCanonicalProblem({
    problemId: 'dsa_heap-priority-queue_02',
    topicId: 'heap-priority-queue',
    order: 2,
    title: 'Last Stone Weight',
    difficulty: 'Easy',
    tags: ['Array', 'Heap (Priority Queue)'],
    statement: `You are given an array of integers stones where stones[i] is the weight of the ith stone.

We are playing a game with the stones. On each turn, we choose the heaviest two stones with weights x and y with x <= y. The result of this smash is:
- If x == y, both stones are destroyed.
- If x != y, the stone of weight x is destroyed, and the stone of weight y has new weight y - x.

At the end of the game, there is at most one stone left. Return the weight of the last remaining stone. If there are no stones left, return 0.`,
    inputFormat: `First line: integer N.
Second line: N space-separated stone weights.`,
    outputFormat: `Print the weight of the last stone, or 0.`,
    constraints: ['1 <= stones.length <= 30', '1 <= stones[i] <= 1000'],
    examples: [
      {
        input: '6\n2 7 4 1 8 1',
        displayInput: 'stones = [2,7,4,1,8,1]',
        output: '1',
        displayOutput: '1',
        explanation: 'Smashing 7 & 8 leaves 1; then 2 & 4 leaves 2; then 1 & 2 leaves 1; 1 & 1 destroys both; last stone is 1.'
      },
      {
        input: '1\n1',
        displayInput: 'stones = [1]',
        output: '1',
        displayOutput: '1',
        explanation: 'Only 1 stone.'
      },
      {
        input: '2\n2 2',
        displayInput: 'stones = [2, 2]',
        output: '0',
        displayOutput: '0',
        explanation: 'Equal weights smash each other completely.'
      }
    ],
    hints: [
      'Insert all elements into a max-heap.',
      'Repeatedly pop the two largest elements y and x.',
      'If y > x, push (y - x) back into the heap.',
      'Continue until heap has 0 or 1 element.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n === 0) return '0';
      const stones = lines[1].trim().split(/\s+/).map(Number);

      while (stones.length > 1) {
        stones.sort((a, b) => b - a);
        const y = stones.shift();
        const x = stones.shift();
        if (y !== x) {
          stones.push(y - x);
        }
      }
      return (stones[0] || 0).toString();
    },
    hiddenTestCases: [
      { input: '3\n3 7 2', expected: '2' },
      { input: '4\n1 3 3 1', expected: '0' },
      { input: '2\n10 1', expected: '9' }
    ]
  }),

  // 3. Relative Ranks (Easy)
  createCanonicalProblem({
    problemId: 'dsa_heap-priority-queue_03',
    topicId: 'heap-priority-queue',
    order: 3,
    title: 'Relative Ranks',
    difficulty: 'Easy',
    tags: ['Array', 'Sorting', 'Heap (Priority Queue)'],
    statement: `You are given an integer array score of size n, where score[i] is the score of the ith athlete in a competition. All the scores are guaranteed to be unique.

The athletes are placed based on their scores, where the 1st place athlete's rank is "Gold Medal", the 2nd place athlete's rank is "Silver Medal", and the 3rd place athlete's rank is "Bronze Medal". For the 4th place to the nth place athlete, their rank is their placement number (i.e., the xth place athlete's rank is "x").

Return an array answer of size n where answer[i] is the rank of the ith athlete, separated by commas.`,
    inputFormat: `First line: integer N.
Second line: N space-separated distinct scores.`,
    outputFormat: `Print ranks separated by commas.`,
    constraints: ['n == score.length', '1 <= n <= 10^4', '0 <= score[i] <= 10^6', 'All scores are unique.'],
    examples: [
      {
        input: '5\n5 4 3 2 1',
        displayInput: 'score = [5,4,3,2,1]',
        output: 'Gold Medal,Silver Medal,Bronze Medal,4,5',
        displayOutput: '["Gold Medal","Silver Medal","Bronze Medal","4","5"]',
        explanation: 'Top 3 get medals, rest get numeric ranks.'
      },
      {
        input: '5\n10 3 8 9 4',
        displayInput: 'score = [10,3,8,9,4]',
        output: 'Gold Medal,5,Bronze Medal,Silver Medal,4',
        displayOutput: '["Gold Medal","5","Bronze Medal","Silver Medal","4"]',
        explanation: 'Rank assignments matching scores: 10->Gold, 9->Silver, 8->Bronze, 4->4, 3->5.'
      },
      {
        input: '1\n100',
        displayInput: 'score = [100]',
        output: 'Gold Medal',
        displayOutput: '["Gold Medal"]',
        explanation: 'Only 1 athlete gets Gold Medal.'
      }
    ],
    hints: [
      'Pair each score with its original index: [score, index].',
      'Sort pairs in descending order of score.',
      'Assign "Gold Medal", "Silver Medal", "Bronze Medal" to first 3 ranks, and rank number for subsequent indices.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n === 0) return '';
      const scores = lines[1].trim().split(/\s+/).map(Number);

      const pairs = scores.map((s, i) => [s, i]);
      pairs.sort((a, b) => b[0] - a[0]);

      const res = new Array(n);
      for (let rank = 0; rank < n; rank++) {
        const origIdx = pairs[rank][1];
        if (rank === 0) res[origIdx] = 'Gold Medal';
        else if (rank === 1) res[origIdx] = 'Silver Medal';
        else if (rank === 2) res[origIdx] = 'Bronze Medal';
        else res[origIdx] = (rank + 1).toString();
      }
      return res.join(',');
    },
    hiddenTestCases: [
      { input: '2\n2 3', expected: 'Silver Medal,Gold Medal' },
      { input: '3\n1 2 3', expected: 'Bronze Medal,Silver Medal,Gold Medal' }
    ]
  }),

  // 4. Take Gifts From the Richest Pile (Easy)
  createCanonicalProblem({
    problemId: 'dsa_heap-priority-queue_04',
    topicId: 'heap-priority-queue',
    order: 4,
    title: 'Take Gifts From the Richest Pile',
    difficulty: 'Easy',
    tags: ['Array', 'Heap (Priority Queue)', 'Simulation'],
    statement: `You are given an integer array gifts denoting the number of gifts in various piles. Every second, you do the following:
- Choose the pile with the maximum number of gifts.
- If there is more than one pile with the maximum number of gifts, choose any.
- Leave behind the floor of the square root of the number of gifts in the pile. Take the rest of the gifts.

Return the number of gifts remaining after k seconds.`,
    inputFormat: `First line: integer N.
Second line: N space-separated gift counts.
Third line: integer K (seconds).`,
    outputFormat: `Print total remaining gifts.`,
    constraints: ['1 <= gifts.length <= 1000', '1 <= gifts[i] <= 10^9', '1 <= k <= 1000'],
    examples: [
      {
        input: '5\n25 64 9 4 100\n4',
        displayInput: 'gifts = [25,64,9,4,100], k = 4',
        output: '29',
        displayOutput: '29',
        explanation: 'After 4 operations on max piles, piles become [5, 8, 9, 4, 3], total remaining = 29.'
      },
      {
        input: '3\n1 1 1\n4',
        displayInput: 'gifts = [1,1,1], k = 4',
        output: '3',
        displayOutput: '3',
        explanation: 'Floor sqrt(1) is 1, pile remains 1.'
      },
      {
        input: '1\n16\n1',
        displayInput: 'gifts = [16], k = 1',
        output: '4',
        displayOutput: '4',
        explanation: 'Floor sqrt(16) is 4.'
      }
    ],
    hints: [
      'Maintain a max-heap of gift counts.',
      'In each second, pop the maximum gift count x, replace it with Math.floor(Math.sqrt(x)), and push it back.',
      'Sum all elements after k operations.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n === 0) return '0';
      const gifts = lines[1].trim().split(/\s+/).map(Number);
      const k = parseInt(lines[2], 10);

      for (let sec = 0; sec < k; sec++) {
        gifts.sort((a, b) => b - a);
        gifts[0] = Math.floor(Math.sqrt(gifts[0]));
      }
      return gifts.reduce((a, b) => a + b, 0).toString();
    },
    hiddenTestCases: [
      { input: '2\n9 4\n1', expected: '7' },
      { input: '3\n49 16 25\n2', expected: '28' }
    ]
  }),

  // 5. Minimum Cost to Connect Sticks (Easy)
  createCanonicalProblem({
    problemId: 'dsa_heap-priority-queue_05',
    topicId: 'heap-priority-queue',
    order: 5,
    title: 'Minimum Cost to Connect Sticks',
    difficulty: 'Easy',
    tags: ['Array', 'Greedy', 'Heap (Priority Queue)'],
    statement: `You have some number of sticks with positive integer lengths. These lengths are given as an array sticks, where sticks[i] is the length of the ith stick.

You can connect any two sticks of lengths x and y into one stick by paying a cost. The cost is x + y. You must connect all the sticks until there is only one stick remaining.

Return the minimum cost of connecting all the given sticks into one stick in this way.`,
    inputFormat: `First line: integer N.
Second line: N space-separated stick lengths.`,
    outputFormat: `Print minimum total cost.`,
    constraints: ['1 <= sticks.length <= 10^4', '1 <= sticks[i] <= 10^4'],
    examples: [
      {
        input: '3\n2 4 3',
        displayInput: 'sticks = [2, 4, 3]',
        output: '14',
        displayOutput: '14',
        explanation: 'Connect 2 and 3 for cost 5 -> [5, 4]. Connect 5 and 4 for cost 9 -> [9]. Total cost = 5 + 9 = 14.'
      },
      {
        input: '4\n1 8 3 5',
        displayInput: 'sticks = [1, 8, 3, 5]',
        output: '30',
        displayOutput: '30',
        explanation: 'Connect 1+3=4 (cost 4), 4+5=9 (cost 9), 9+8=17 (cost 17). Total = 30.'
      },
      {
        input: '1\n5',
        displayInput: 'sticks = [5]',
        output: '0',
        displayOutput: '0',
        explanation: 'Already 1 stick, cost is 0.'
      }
    ],
    hints: [
      'This is Huffman coding greedy principle.',
      'Always connect the two shortest sticks available so their length contributes to as few subsequent sums as possible.',
      'Use a min-heap: pop two smallest, add their sum to total cost, and push the sum back.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n <= 1) return '0';
      const sticks = lines[1].trim().split(/\s+/).map(Number);

      sticks.sort((a, b) => a - b);
      let totalCost = 0;

      while (sticks.length > 1) {
        const first = sticks.shift();
        const second = sticks.shift();
        const cost = first + second;
        totalCost += cost;

        // binary insert cost
        let low = 0;
        let high = sticks.length;
        while (low < high) {
          const mid = Math.floor((low + high) / 2);
          if (sticks[mid] < cost) low = mid + 1;
          else high = mid;
        }
        sticks.splice(low, 0, cost);
      }
      return totalCost.toString();
    },
    hiddenTestCases: [
      { input: '2\n3 3', expected: '6' },
      { input: '5\n1 2 3 4 5', expected: '33' }
    ]
  }),

  // 6. Maximum Product of Two Elements in an Array (Easy)
  createCanonicalProblem({
    problemId: 'dsa_heap-priority-queue_06',
    topicId: 'heap-priority-queue',
    order: 6,
    title: 'Maximum Product of Two Elements in an Array',
    difficulty: 'Easy',
    tags: ['Array', 'Sorting', 'Heap (Priority Queue)'],
    statement: `Given the array of integers nums, you will choose two different indices i and j of that array. Return the maximum value of (nums[i]-1)*(nums[j]-1).`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the maximum product.`,
    constraints: ['2 <= nums.length <= 500', '1 <= nums[i] <= 10^3'],
    examples: [
      {
        input: '4\n3 4 5 2',
        displayInput: 'nums = [3,4,5,2]',
        output: '12',
        displayOutput: '12',
        explanation: 'Indices 1 and 2 (values 4 and 5): (4-1)*(5-1) = 3*4 = 12.'
      },
      {
        input: '4\n1 5 4 5',
        displayInput: 'nums = [1,5,4,5]',
        output: '16',
        displayOutput: '16',
        explanation: 'Two 5s: (5-1)*(5-1) = 16.'
      },
      {
        input: '2\n3 7',
        displayInput: 'nums = [3,7]',
        output: '12',
        displayOutput: '12',
        explanation: '(3-1)*(7-1) = 2*6 = 12.'
      }
    ],
    hints: [
      'Find the two largest elements in the array.',
      'Let them be max1 and max2.',
      'Return (max1 - 1) * (max2 - 1).'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n < 2) return '0';
      const nums = lines[1].trim().split(/\s+/).map(Number);
      nums.sort((a, b) => b - a);
      return ((nums[0] - 1) * (nums[1] - 1)).toString();
    },
    hiddenTestCases: [
      { input: '3\n2 2 2', expected: '1' },
      { input: '4\n10 10 2 3', expected: '81' }
    ]
  }),

  // 7. Seat Reservation Manager (Easy)
  createCanonicalProblem({
    problemId: 'dsa_heap-priority-queue_07',
    topicId: 'heap-priority-queue',
    order: 7,
    title: 'Seat Reservation Manager',
    difficulty: 'Easy',
    tags: ['Design', 'Heap (Priority Queue)'],
    statement: `Design a system that manages the reservation state of n seats that are numbered from 1 to n.

Operations:
- reserve: Fetches the smallest-numbered unreserved seat, reserves it, and returns its number.
- unreserve seatNumber: Unreserves the seat with the given seatNumber.`,
    inputFormat: `First line: integer N (total seats).
Second line: integer Q (queries).
Next Q lines: 'reserve' or 'unreserve seatNumber'.`,
    outputFormat: `Print the seat numbers returned by each reserve operation separated by spaces.`,
    constraints: ['1 <= n <= 10^5', '1 <= Q <= 10^5', 'For each call to unreserve, it is guaranteed seat is currently reserved.'],
    examples: [
      {
        input: '5\n6\nreserve\nreserve\nunreserve 2\nreserve\nreserve\nreserve',
        displayInput: 'n = 5, ops = [reserve, reserve, unreserve 2, reserve, reserve, reserve]',
        output: '1 2 2 3 4',
        displayOutput: '1 2 2 3 4',
        explanation: 'Reserves 1 then 2; unreserves 2; reserves 2 again; reserves 3 then 4.'
      },
      {
        input: '2\n2\nreserve\nreserve',
        displayInput: 'n = 2, ops = [reserve, reserve]',
        output: '1 2',
        displayOutput: '1 2',
        explanation: 'Reserves 1 then 2.'
      },
      {
        input: '3\n3\nreserve\nunreserve 1\nreserve',
        displayInput: 'n = 3, ops = [reserve, unreserve 1, reserve]',
        output: '1 1',
        displayOutput: '1 1',
        explanation: 'Seat 1 reserved, unreserved, and re-reserved.'
      }
    ],
    hints: [
      'Maintain nextAvailableSeat pointer starting at 1.',
      'Maintain a min-heap unreservedSeats for seats that were unreserved.',
      'When reserving: if unreservedSeats is non-empty, pop the minimum; else return nextAvailableSeat++.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      const q = parseInt(lines[1], 10);
      let nextSeat = 1;
      const unreserved = [];
      const res = [];

      for (let i = 2; i < 2 + q; i++) {
        if (!lines[i]) continue;
        const [cmd, val] = lines[i].trim().split(/\s+/);
        if (cmd === 'reserve') {
          if (unreserved.length > 0) {
            unreserved.sort((a, b) => a - b);
            res.push(unreserved.shift());
          } else {
            res.push(nextSeat++);
          }
        } else if (cmd === 'unreserve') {
          unreserved.push(parseInt(val, 10));
        }
      }
      return res.join(' ');
    },
    hiddenTestCases: [
      { input: '3\n2\nreserve\nreserve', expected: '1 2' },
      { input: '4\n4\nreserve\nreserve\nunreserve 1\nreserve', expected: '1 2 1' }
    ]
  }),

  // 8. Kth Largest Element in an Array (Medium)
  createCanonicalProblem({
    problemId: 'dsa_heap-priority-queue_08',
    topicId: 'heap-priority-queue',
    order: 8,
    title: 'Kth Largest Element in an Array',
    difficulty: 'Medium',
    tags: ['Array', 'Divide and Conquer', 'Sorting', 'Heap (Priority Queue)', 'Quickselect'],
    statement: `Given an integer array nums and an integer k, return the kth largest element in the array.

Note that it is the kth largest element in the sorted order, not the kth distinct element.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer K.`,
    outputFormat: `Print the Kth largest integer.`,
    constraints: ['1 <= k <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    examples: [
      {
        input: '6\n3 2 1 5 6 4\n2',
        displayInput: 'nums = [3,2,1,5,6,4], k = 2',
        output: '5',
        displayOutput: '5',
        explanation: 'Sorted order: [1,2,3,4,5,6]. 2nd largest is 5.'
      },
      {
        input: '9\n3 2 3 1 2 4 5 5 6\n4',
        displayInput: 'nums = [3,2,3,1,2,4,5,5,6], k = 4',
        output: '4',
        displayOutput: '4',
        explanation: '4th largest is 4.'
      },
      {
        input: '1\n10\n1',
        displayInput: 'nums = [10], k = 1',
        output: '10',
        displayOutput: '10',
        explanation: 'Only element is 10.'
      }
    ],
    hints: [
      'Maintain a min-heap of size K.',
      'Iterate through the array: for each element, push to heap; if heap size > K, pop minimum.',
      'The top of the min-heap at the end is the K-th largest element.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      const nums = lines[1].trim().split(/\s+/).map(Number);
      const k = parseInt(lines[2], 10);
      nums.sort((a, b) => b - a);
      return nums[k - 1].toString();
    },
    hiddenTestCases: [
      { input: '3\n1 2 3\n1', expected: '3' },
      { input: '3\n1 2 3\n3', expected: '1' },
      { input: '5\n7 10 4 3 20\n3', expected: '7' }
    ]
  }),

  // 9. Top K Frequent Elements (Medium)
  createCanonicalProblem({
    problemId: 'dsa_heap-priority-queue_09',
    topicId: 'heap-priority-queue',
    order: 9,
    title: 'Top K Frequent Elements',
    difficulty: 'Medium',
    tags: ['Array', 'Hash Table', 'Divide and Conquer', 'Sorting', 'Heap (Priority Queue)', 'Bucket Sort', 'Counting'],
    statement: `Given an integer array nums and an integer k, return the k most frequent elements. Sort the result in ascending order.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer K.`,
    outputFormat: `Print the K most frequent elements sorted ascending separated by spaces.`,
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', 'k is in range [1, number of unique elements]'],
    examples: [
      {
        input: '6\n1 1 1 2 2 3\n2',
        displayInput: 'nums = [1,1,1,2,2,3], k = 2',
        output: '1 2',
        displayOutput: '[1, 2]',
        explanation: '1 occurs 3 times, 2 occurs 2 times.'
      },
      {
        input: '1\n1\n1',
        displayInput: 'nums = [1], k = 1',
        output: '1',
        displayOutput: '[1]',
        explanation: 'Only element 1.'
      },
      {
        input: '4\n4 4 4 4\n1',
        displayInput: 'nums = [4,4,4,4], k = 1',
        output: '4',
        displayOutput: '[4]',
        explanation: '4 occurs 4 times.'
      }
    ],
    hints: [
      'Count frequency of each number using a hash map.',
      'Keep top K frequent pairs using a min-heap or sorting by frequency descending.',
      'Extract elements and sort in ascending order.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      const nums = lines[1].trim().split(/\s+/).map(Number);
      const k = parseInt(lines[2], 10);

      const freq = {};
      for (const num of nums) freq[num] = (freq[num] || 0) + 1;

      const pairs = Object.entries(freq).map(([num, count]) => [parseInt(num, 10), count]);
      pairs.sort((a, b) => b[1] - a[1]);

      const topK = pairs.slice(0, k).map((p) => p[0]);
      topK.sort((a, b) => a - b);
      return topK.join(' ');
    },
    hiddenTestCases: [
      { input: '3\n1 2 3\n1', expected: '1' },
      { input: '5\n5 5 2 2 3\n2', expected: '2 5' }
    ]
  }),

  // 10. Sort Characters By Frequency (Medium)
  createCanonicalProblem({
    problemId: 'dsa_heap-priority-queue_10',
    topicId: 'heap-priority-queue',
    order: 10,
    title: 'Sort Characters By Frequency',
    difficulty: 'Medium',
    tags: ['Hash Table', 'String', 'Sorting', 'Heap (Priority Queue)', 'Bucket Sort', 'Counting'],
    statement: `Given a string s, sort it in decreasing order based on the frequency of the characters. The frequency of a character is the number of times it appears in the string.

Return the sorted string.`,
    inputFormat: `First line: string s.`,
    outputFormat: `Print string sorted by frequency descending.`,
    constraints: ['1 <= s.length <= 5 * 10^5', 's consists of uppercase and lowercase English letters and digits.'],
    examples: [
      {
        input: 'tree',
        displayInput: 's = "tree"',
        output: 'eert',
        displayOutput: '"eert"',
        explanation: '"e" appears twice, "r" and "t" appear once.'
      },
      {
        input: 'cccaaa',
        displayInput: 's = "cccaaa"',
        output: 'aaaccc',
        displayOutput: '"aaaccc"',
        explanation: 'Both "c" and "a" appear 3 times.'
      },
      {
        input: 'Aabb',
        displayInput: 's = "Aabb"',
        output: 'bbAa',
        displayOutput: '"bbAa"',
        explanation: '"b" appears twice, "A" and "a" appear once.'
      }
    ],
    hints: [
      'Count frequencies of each character using a frequency map.',
      'Sort characters by frequency descending (break ties by character order).',
      'Repeat each character according to its count.'
    ],
    solveFunction: (input) => {
      const s = input.trim();
      const freq = {};
      for (const ch of s) freq[ch] = (freq[ch] || 0) + 1;

      const entries = Object.entries(freq);
      entries.sort((a, b) => {
        if (b[1] !== a[1]) return b[1] - a[1];
        return a[0].localeCompare(b[0]);
      });

      return entries.map(([ch, count]) => ch.repeat(count)).join('');
    },
    hiddenTestCases: [
      { input: 'a', expected: 'a' },
      { input: 'loveleetcode', expected: 'eeeeellooctv' }
    ]
  }),

  // 11. K Closest Points to Origin (Medium)
  createCanonicalProblem({
    problemId: 'dsa_heap-priority-queue_11',
    topicId: 'heap-priority-queue',
    order: 11,
    title: 'K Closest Points to Origin',
    difficulty: 'Medium',
    tags: ['Array', 'Math', 'Divide and Conquer', 'Geometry', 'Sorting', 'Heap (Priority Queue)', 'Quickselect'],
    statement: `Given an array of points where points[i] = [xi, yi] represents a point on the X-Y plane and an integer k, return the k closest points to the origin (0, 0).

The distance between two points on the X-Y plane is the Euclidean distance: sqrt((x1 - x2)^2 + (y1 - y2)^2).

Print each of the K closest points sorted by distance ascending on a new line.`,
    inputFormat: `First line: integer N.
Next N lines: two space-separated integers X and Y.
Next line: integer K.`,
    outputFormat: `Print K closest points, each as 'X Y' on a new line.`,
    constraints: ['1 <= k <= points.length <= 10^4', '-10^4 <= xi, yi <= 10^4'],
    examples: [
      {
        input: '2\n1 3\n-2 2\n1',
        displayInput: 'points = [[1,3],[-2,2]], k = 1',
        output: '-2 2',
        displayOutput: '[[-2, 2]]',
        explanation: 'Distance to (1, 3) is 10; distance to (-2, 2) is 8. Closest is (-2, 2).'
      },
      {
        input: '3\n3 3\n5 -1\n-2 4\n2',
        displayInput: 'points = [[3,3],[5,-1],[-2,4]], k = 2',
        output: '3 3\n-2 4',
        displayOutput: '[[3,3],[-2,4]]',
        explanation: 'Distances are 18, 26, 20. Closest two are (3, 3) and (-2, 4).'
      },
      {
        input: '1\n0 0\n1',
        displayInput: 'points = [[0, 0]], k = 1',
        output: '0 0',
        displayOutput: '[[0, 0]]',
        explanation: 'Origin itself.'
      }
    ],
    hints: [
      'Compare points by squared Euclidean distance: x^2 + y^2.',
      'Maintain a max-heap of size K, or sort points by squared distance.',
      'Take first K points and format output.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      const points = [];
      for (let i = 1; i <= n; i++) {
        points.push(lines[i].trim().split(/\s+/).map(Number));
      }
      const k = parseInt(lines[n + 1], 10);

      points.sort((a, b) => a[0] * a[0] + a[1] * a[1] - (b[0] * b[0] + b[1] * b[1]));
      return points.slice(0, k).map((p) => `${p[0]} ${p[1]}`).join('\n');
    },
    hiddenTestCases: [
      { input: '2\n0 1\n1 0\n2', expected: '0 1\n1 0' },
      { input: '3\n1 1\n2 2\n3 3\n1', expected: '1 1' }
    ]
  }),

  // 12. Task Scheduler (Medium)
  createCanonicalProblem({
    problemId: 'dsa_heap-priority-queue_12',
    topicId: 'heap-priority-queue',
    order: 12,
    title: 'Task Scheduler',
    difficulty: 'Medium',
    tags: ['Array', 'Hash Table', 'Greedy', 'Sorting', 'Heap (Priority Queue)', 'Counting'],
    statement: `You are given an array of CPU tasks, each labeled with a letter from A to Z, and a number n. Each CPU interval can either execute a task or be idle. The same task must be separated by at least n intervals of cooling time.

Return the minimum number of CPU intervals required to complete all tasks.`,
    inputFormat: `First line: integer N.
Second line: N space-separated uppercase task characters.
Third line: integer cooldown N.`,
    outputFormat: `Print the minimum CPU intervals.`,
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
        explanation: 'With 0 cooldown, tasks can run back to back in 6 intervals.'
      },
      {
        input: '6\nA A A A A A\n2',
        displayInput: 'tasks = ["A","A","A","A","A","A"], n = 2',
        output: '16',
        displayOutput: '16',
        explanation: 'A -> idle -> idle -> A -> idle -> idle -> A -> idle -> idle -> A -> idle -> idle -> A -> idle -> idle -> A (16 intervals).'
      }
    ],
    hints: [
      'Find the task with maximum frequency, maxFreq.',
      'Count how many tasks share this maximum frequency, maxCount.',
      'Formula: Math.max(tasks.length, (maxFreq - 1) * (n + 1) + maxCount).'
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

  // 13. Find K Pairs with Smallest Sums (Medium)
  createCanonicalProblem({
    problemId: 'dsa_heap-priority-queue_13',
    topicId: 'heap-priority-queue',
    order: 13,
    title: 'Find K Pairs with Smallest Sums',
    difficulty: 'Medium',
    tags: ['Array', 'Heap (Priority Queue)'],
    statement: `You are given two integer arrays nums1 and nums2 sorted in non-decreasing order and an integer k.

Define a pair (u, v) which consists of one element from nums1 and one element from nums2.

Return the k pairs (u1, v1), (u2, v2), ..., (uk, vk) with the smallest sums, each on a new line.`,
    inputFormat: `First line: integer N.
Second line: N space-separated sorted integers.
Third line: integer M.
Fourth line: M sorted integers.
Fifth line: integer K.`,
    outputFormat: `Print K pairs, each as 'u v' on a new line.`,
    constraints: ['1 <= nums1.length, nums2.length <= 10^5', '-10^9 <= nums1[i], nums2[i] <= 10^9', '1 <= k <= 10^4'],
    examples: [
      {
        input: '3\n1 7 11\n3\n2 4 6\n3',
        displayInput: 'nums1 = [1,7,11], nums2 = [2,4,6], k = 3',
        output: '1 2\n1 4\n1 6',
        displayOutput: '[[1,2],[1,4],[1,6]]',
        explanation: 'Smallest sums: 1+2=3, 1+4=5, 1+6=7.'
      },
      {
        input: '2\n1 1\n2\n2 3\n2',
        displayInput: 'nums1 = [1,1], nums2 = [2,3], k = 2',
        output: '1 2\n1 2',
        displayOutput: '[[1,2],[1,2]]',
        explanation: 'First two smallest sum pairs are (1,2) and (1,2).'
      },
      {
        input: '2\n1 2\n1\n3\n3',
        displayInput: 'nums1 = [1,2], nums2 = [3], k = 3',
        output: '1 3\n2 3',
        displayOutput: '[[1,3],[2,3]]',
        explanation: 'Only 2 pairs exist.'
      }
    ],
    hints: [
      'Initialize min-heap with pairs (nums1[i] + nums2[0], i, 0) for all i < min(nums1.length, k).',
      'Pop minimum pair [sum, i, j], emit [nums1[i], nums2[j]].',
      'If j + 1 < nums2.length, push (nums1[i] + nums2[j + 1], i, j + 1) onto the heap.',
      'Repeat k times.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      const nums1 = lines[1].trim().split(/\s+/).map(Number);
      const m = parseInt(lines[2], 10);
      const nums2 = lines[3].trim().split(/\s+/).map(Number);
      const k = parseInt(lines[4], 10);

      // min heap using simple sorted array for k items
      const heap = [];
      for (let i = 0; i < Math.min(n, k); i++) {
        heap.push([nums1[i] + nums2[0], i, 0]);
      }
      heap.sort((a, b) => a[0] - b[0]);

      const res = [];
      while (heap.length > 0 && res.length < k) {
        const [, i, j] = heap.shift();
        res.push(`${nums1[i]} ${nums2[j]}`);
        if (j + 1 < m) {
          const nextPair = [nums1[i] + nums2[j + 1], i, j + 1];
          // binary insert
          let low = 0;
          let high = heap.length;
          while (low < high) {
            const mid = Math.floor((low + high) / 2);
            if (heap[mid][0] < nextPair[0]) low = mid + 1;
            else high = mid;
          }
          heap.splice(low, 0, nextPair);
        }
      }
      return res.join('\n');
    },
    hiddenTestCases: [
      { input: '1\n1\n1\n1\n1', expected: '1 1' },
      { input: '2\n1 2\n2\n1 2\n2', expected: '1 1\n1 2' }
    ]
  }),

  // 14. Reorganize String (Medium)
  createCanonicalProblem({
    problemId: 'dsa_heap-priority-queue_14',
    topicId: 'heap-priority-queue',
    order: 14,
    title: 'Reorganize String',
    difficulty: 'Medium',
    tags: ['Hash Table', 'String', 'Greedy', 'Sorting', 'Heap (Priority Queue)', 'Counting'],
    statement: `Given a string s, rearrange the characters of s so that any two adjacent characters are not the same.

Return any possible rearrangement of s or return an empty string if not possible.`,
    inputFormat: `First line: string s.`,
    outputFormat: `Print reorganized string (or empty line if impossible).`,
    constraints: ['1 <= s.length <= 500', 's consists of lowercase English letters.'],
    examples: [
      {
        input: 'aab',
        displayInput: 's = "aab"',
        output: 'aba',
        displayOutput: '"aba"',
        explanation: 'Alternating characters.'
      },
      {
        input: 'aaab',
        displayInput: 's = "aaab"',
        output: '',
        displayOutput: '""',
        explanation: 'Impossible to separate three "a"s with only one "b".'
      },
      {
        input: 'vvvlo',
        displayInput: 's = "vvvlo"',
        output: 'vlvov',
        displayOutput: '"vlvov"',
        explanation: 'Valid rearrangement.'
      }
    ],
    hints: [
      'If max frequency > (s.length + 1) / 2, impossible, return empty string.',
      'Pop top 2 most frequent characters from max-heap.',
      'Append both to result string, decrement frequencies, and push back if still > 0.'
    ],
    solveFunction: (input) => {
      const s = input.trim();
      const n = s.length;
      const freq = {};
      for (const ch of s) freq[ch] = (freq[ch] || 0) + 1;

      const maxHeap = Object.entries(freq);
      maxHeap.sort((a, b) => b[1] - a[1]);

      if (maxHeap[0][1] > Math.ceil(n / 2)) return '';

      let res = '';
      while (maxHeap.length >= 2) {
        const [ch1, count1] = maxHeap.shift();
        const [ch2, count2] = maxHeap.shift();
        res += ch1 + ch2;
        if (count1 - 1 > 0) maxHeap.push([ch1, count1 - 1]);
        if (count2 - 1 > 0) maxHeap.push([ch2, count2 - 1]);
        maxHeap.sort((a, b) => b[1] - a[1]);
      }

      if (maxHeap.length > 0) {
        res += maxHeap[0][0];
      }
      return res;
    },
    hiddenTestCases: [
      { input: 'a', expected: 'a' },
      { input: 'aa', expected: '' },
      { input: 'ab', expected: 'ab' }
    ]
  }),

  // 15. Furthest Building You Can Reach (Medium)
  createCanonicalProblem({
    problemId: 'dsa_heap-priority-queue_15',
    topicId: 'heap-priority-queue',
    order: 15,
    title: 'Furthest Building You Can Reach',
    difficulty: 'Medium',
    tags: ['Array', 'Greedy', 'Heap (Priority Queue)'],
    statement: `You are given an integer array heights representing the heights of buildings, some bricks, and some ladders.

You start your journey from building 0 and move to the next building by possibly using bricks or ladders.

While moving from building i to building i+1 (0-indexed):
- If the current building's height is greater than or equal to the next building's height, you do not need a ladder or bricks.
- If the current building's height is less than the next building's height, you can either use one ladder or (h[i+1] - h[i]) bricks.

Return the furthest building index (0-indexed) you can reach if you use the given ladders and bricks optimally.`,
    inputFormat: `First line: integer N.
Second line: N space-separated building heights.
Third line: integer bricks.
Fourth line: integer ladders.`,
    outputFormat: `Print the furthest building index reached.`,
    constraints: ['1 <= heights.length <= 10^5', '1 <= heights[i] <= 10^6', '0 <= bricks <= 10^9', '0 <= ladders <= heights.length'],
    examples: [
      {
        input: '7\n4 2 7 6 9 14 12\n5\n1',
        displayInput: 'heights = [4,2,7,6,9,14,12], bricks = 5, ladders = 1',
        output: '4',
        displayOutput: '4',
        explanation: 'Reach index 4.'
      },
      {
        input: '6\n4 12 2 7 3 18\n10\n2',
        displayInput: 'heights = [4,12,2,7,3,18], bricks = 10, ladders = 2',
        output: '5',
        displayOutput: '5',
        explanation: 'Reach last building.'
      },
      {
        input: '3\n14 3 19\n17\n0',
        displayInput: 'heights = [14,3,19], bricks = 17, ladders = 0',
        output: '2',
        displayOutput: '2',
        explanation: 'Used 16 bricks to climb 16.'
      }
    ],
    hints: [
      'Maintain a min-heap storing ladder climb heights.',
      'For every positive climb diff = heights[i+1] - heights[i], push diff into heap.',
      'If heap size > ladders, pop smallest climb from heap and spend that many bricks.',
      'If bricks drop below 0, you cannot reach building i + 1, so return i.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      const heights = lines[1].trim().split(/\s+/).map(Number);
      let bricks = parseInt(lines[2], 10);
      const ladders = parseInt(lines[3], 10);

      const ladderClimbs = [];

      for (let i = 0; i < n - 1; i++) {
        const diff = heights[i + 1] - heights[i];
        if (diff > 0) {
          ladderClimbs.push(diff);
          ladderClimbs.sort((a, b) => a - b);
          if (ladderClimbs.length > ladders) {
            bricks -= ladderClimbs.shift();
            if (bricks < 0) return i.toString();
          }
        }
      }
      return (n - 1).toString();
    },
    hiddenTestCases: [
      { input: '2\n1 5\n4\n0', expected: '1' },
      { input: '2\n1 5\n3\n0', expected: '0' }
    ]
  }),

  // 16. Single-Threaded CPU (Medium)
  createCanonicalProblem({
    problemId: 'dsa_heap-priority-queue_16',
    topicId: 'heap-priority-queue',
    order: 16,
    title: 'Single-Threaded CPU',
    difficulty: 'Medium',
    tags: ['Array', 'Sorting', 'Heap (Priority Queue)'],
    statement: `You are given n tasks labeled from 0 to n - 1 represented by a 2D integer array tasks, where tasks[i] = [enqueueTimei, processingTimei] means that the ith task will be available to process at enqueueTimei and will take processingTimei to finish.

You have a single-threaded CPU that could process at most one task at a time and will act as follows:
- If the CPU is idle and there are no available tasks to process, the CPU remains idle.
- If the CPU is idle and there are available tasks, the CPU will choose the one with the shortest processing time. If multiple tasks have the same shortest processing time, it will choose the task with the smallest index.
- Once a task is started, the CPU will process the entire task without stopping.

Return the order in which the CPU will process the tasks separated by spaces.`,
    inputFormat: `First line: integer N.
Next N lines: two space-separated integers enqueueTime and processingTime.`,
    outputFormat: `Print task indices in execution order separated by spaces.`,
    constraints: ['tasks.length == n', '1 <= n <= 10^5', '1 <= enqueueTimei, processingTimei <= 10^9'],
    examples: [
      {
        input: '4\n1 2\n2 4\n3 2\n4 1',
        displayInput: 'tasks = [[1,2],[2,4],[3,2],[4,1]]',
        output: '0 2 3 1',
        displayOutput: '[0, 2, 3, 1]',
        explanation: 'At t=1, task 0 runs until t=3. Available tasks: 1, 2. Task 2 has shorter proc time. Order is 0, 2, 3, 1.'
      },
      {
        input: '5\n7 10\n7 12\n7 5\n7 4\n7 2',
        displayInput: 'tasks = [[7,10],[7,12],[7,5],[7,4],[7,2]]',
        output: '4 3 2 0 1',
        displayOutput: '[4, 3, 2, 0, 1]',
        explanation: 'All arrive at t=7, executed in increasing order of processing time.'
      },
      {
        input: '1\n1 5',
        displayInput: 'tasks = [[1,5]]',
        output: '0',
        displayOutput: '[0]',
        explanation: 'Only task 0.'
      }
    ],
    hints: [
      'Annotate tasks with original indices [enqueueTime, procTime, index].',
      'Sort tasks by enqueueTime.',
      'Maintain currentTime and a min-heap ordered by procTime, then index.',
      'Advance currentTime when heap is empty to next task enqueueTime.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n === 0) return '';
      const tasks = [];
      for (let i = 1; i <= n; i++) {
        const [eq, proc] = lines[i].trim().split(/\s+/).map(Number);
        tasks.push([eq, proc, i - 1]);
      }

      tasks.sort((a, b) => a[0] - b[0]);

      let time = 0;
      let taskIdx = 0;
      const heap = [];
      const order = [];

      while (order.length < n) {
        if (heap.length === 0 && time < tasks[taskIdx][0]) {
          time = tasks[taskIdx][0];
        }

        while (taskIdx < n && tasks[taskIdx][0] <= time) {
          const item = tasks[taskIdx];
          // binary insert into heap sorted by procTime asc, then index asc
          let low = 0;
          let high = heap.length;
          while (low < high) {
            const mid = Math.floor((low + high) / 2);
            if (heap[mid][1] < item[1] || (heap[mid][1] === item[1] && heap[mid][2] < item[2])) {
              low = mid + 1;
            } else {
              high = mid;
            }
          }
          heap.splice(low, 0, item);
          taskIdx++;
        }

        const [eq, proc, origIdx] = heap.shift();
        time += proc;
        order.push(origIdx);
      }
      return order.join(' ');
    },
    hiddenTestCases: [
      { input: '2\n1 2\n2 1', expected: '0 1' },
      { input: '2\n5 2\n1 2', expected: '1 0' }
    ]
  }),

  // 17. Find Median from Data Stream (Hard)
  createCanonicalProblem({
    problemId: 'dsa_heap-priority-queue_17',
    topicId: 'heap-priority-queue',
    order: 17,
    title: 'Find Median from Data Stream',
    difficulty: 'Hard',
    tags: ['Two Pointers', 'Design', 'Sorting', 'Heap (Priority Queue)', 'Data Stream'],
    statement: `The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values.

Implement the MedianFinder:
- addNum(num): Adds an integer num from the data stream.
- findMedian(): Returns the median of all elements so far formatted to 1 decimal place.

Print running medians separated by spaces.`,
    inputFormat: `First line: integer N.
Next N lines: integer numbers added to stream.`,
    outputFormat: `Print running medians separated by spaces.`,
    constraints: ['1 <= N <= 5 * 10^4', '-10^5 <= num <= 10^5'],
    examples: [
      {
        input: '3\n1\n2\n3',
        displayInput: 'stream = [1, 2, 3]',
        output: '1.0 1.5 2.0',
        displayOutput: '[1.0, 1.5, 2.0]',
        explanation: 'At 1 -> 1.0; at 2 -> (1+2)/2 = 1.5; at 3 -> 2.0.'
      },
      {
        input: '2\n2\n3',
        displayInput: 'stream = [2, 3]',
        output: '2.0 2.5',
        displayOutput: '[2.0, 2.5]',
        explanation: 'Medians after each insertion.'
      },
      {
        input: '1\n100',
        displayInput: 'stream = [100]',
        output: '100.0',
        displayOutput: '[100.0]',
        explanation: 'Single element median.'
      }
    ],
    hints: [
      'Maintain two heaps: max-heap for lower half and min-heap for upper half.',
      'Keep max-heap size equal to min-heap size or 1 larger.',
      'If sizes equal, median = (maxHeap.top + minHeap.top) / 2. If odd, median = maxHeap.top.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      const arr = [];
      const res = [];

      for (let i = 1; i <= n; i++) {
        if (!lines[i]) continue;
        const num = parseInt(lines[i].trim(), 10);
        // binary insert
        let low = 0;
        let high = arr.length;
        while (low < high) {
          const mid = Math.floor((low + high) / 2);
          if (arr[mid] < num) low = mid + 1;
          else high = mid;
        }
        arr.splice(low, 0, num);

        const sz = arr.length;
        if (sz % 2 === 1) {
          res.push(arr[Math.floor(sz / 2)].toFixed(1));
        } else {
          const med = (arr[sz / 2 - 1] + arr[sz / 2]) / 2;
          res.push(med.toFixed(1));
        }
      }
      return res.join(' ');
    },
    hiddenTestCases: [
      { input: '4\n5\n15\n1\n3', expected: '5.0 10.0 5.0 4.0' },
      { input: '2\n-1\n-2', expected: '-1.0 -1.5' }
    ]
  }),

  // 18. Merge k Sorted Lists (Hard)
  createCanonicalProblem({
    problemId: 'dsa_heap-priority-queue_18',
    topicId: 'heap-priority-queue',
    order: 18,
    title: 'Merge k Sorted Lists',
    difficulty: 'Hard',
    tags: ['Linked List', 'Divide and Conquer', 'Heap (Priority Queue)', 'Merge Sort'],
    statement: `You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.`,
    inputFormat: `First line: integer K (number of lists).
Next K lines: integer M followed by M space-separated sorted integers.`,
    outputFormat: `Print merged sorted array separated by spaces.`,
    constraints: ['k == lists.length', '0 <= k <= 10^4', '0 <= lists[i].length <= 500', '-10^4 <= lists[i][j] <= 10^4'],
    examples: [
      {
        input: '3\n3 1 4 5\n3 1 3 4\n2 2 6',
        displayInput: 'lists = [[1,4,5],[1,3,4],[2,6]]',
        output: '1 1 2 3 4 4 5 6',
        displayOutput: '[1,1,2,3,4,4,5,6]',
        explanation: 'All lists merged into one sorted list.'
      },
      {
        input: '1\n0',
        displayInput: 'lists = [[]]',
        output: '',
        displayOutput: '[]',
        explanation: 'Empty list.'
      },
      {
        input: '2\n1 2\n1 1',
        displayInput: 'lists = [[2],[1]]',
        output: '1 2',
        displayOutput: '[1, 2]',
        explanation: 'Merged [1, 2].'
      }
    ],
    hints: [
      'Maintain a min-heap containing the first element of each non-empty list.',
      'Extract the minimum element, append it to result.',
      'If the extracted node had a next element, push next element into min-heap.',
      'Runs in O(N log K) time where N is total elements.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const k = parseInt(lines[0], 10);
      const all = [];

      for (let i = 1; i <= k; i++) {
        if (!lines[i]) continue;
        const tokens = lines[i].trim().split(/\s+/).map(Number);
        const m = tokens[0];
        for (let j = 1; j <= m; j++) {
          all.push(tokens[j]);
        }
      }
      all.sort((a, b) => a - b);
      return all.join(' ');
    },
    hiddenTestCases: [
      { input: '2\n2 1 3\n2 2 4', expected: '1 2 3 4' },
      { input: '1\n3 10 20 30', expected: '10 20 30' }
    ]
  }),

  // 19. Minimum Cost to Hire K Workers (Hard)
  createCanonicalProblem({
    problemId: 'dsa_heap-priority-queue_19',
    topicId: 'heap-priority-queue',
    order: 19,
    title: 'Minimum Cost to Hire K Workers',
    difficulty: 'Hard',
    tags: ['Array', 'Greedy', 'Sorting', 'Heap (Priority Queue)'],
    statement: `There are n workers. You are given two integer arrays quality and wage where quality[i] is the quality of the ith worker and wage[i] is the minimum wage expectation for the ith worker.

We want to hire exactly k workers to form a paid group. To hire a group of k workers, we must pay them according to these rules:
1. Every worker in the paid group must be paid at least their minimum wage expectation.
2. In the group, each worker's pay must be directly proportional to their quality.

Return the least amount of money needed to form a paying group of k workers formatted to 5 decimal places.`,
    inputFormat: `First line: integer N.
Second line: N space-separated qualities.
Third line: N space-separated minimum wages.
Fourth line: integer K.`,
    outputFormat: `Print minimum cost formatted to 5 decimal places.`,
    constraints: ['n == quality.length == wage.length', '1 <= k <= n <= 10^4', '1 <= quality[i] <= 10^4', '1 <= wage[i] <= 10^4'],
    examples: [
      {
        input: '3\n10 20 5\n70 50 30\n2',
        displayInput: 'quality = [10,20,5], wage = [70,50,30], k = 2',
        output: '105.00000',
        displayOutput: '105.00000',
        explanation: 'Pay 70 to 1st worker, 35 to 2nd worker. Total = 105.'
      },
      {
        input: '5\n3 1 10 10 1\n4 8 2 2 7\n3',
        displayInput: 'quality = [3,1,10,10,1], wage = [4,8,2,2,7], k = 3',
        output: '30.66667',
        displayOutput: '30.66667',
        explanation: 'Min cost is 30.66667.'
      },
      {
        input: '1\n10\n100\n1',
        displayInput: 'quality = [10], wage = [100], k = 1',
        output: '100.00000',
        displayOutput: '100.00000',
        explanation: 'Single worker.'
      }
    ],
    hints: [
      'Each worker has a ratio = wage[i] / quality[i].',
      'Sort workers by ratio ascending.',
      'Maintain a max-heap of qualities of size K.',
      'For current worker ratio, cost = ratio * qualitySum; update minCost.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      const quality = lines[1].trim().split(/\s+/).map(Number);
      const wage = lines[2].trim().split(/\s+/).map(Number);
      const k = parseInt(lines[3], 10);

      const workers = [];
      for (let i = 0; i < n; i++) {
        workers.push({ q: quality[i], w: wage[i], ratio: wage[i] / quality[i] });
      }
      workers.sort((a, b) => a.ratio - b.ratio);

      const qHeap = []; // max-heap of qualities
      let qSum = 0;
      let minCost = Infinity;

      for (const w of workers) {
        qHeap.push(w.q);
        qSum += w.q;
        qHeap.sort((a, b) => b - a); // sort descending

        if (qHeap.length > k) {
          qSum -= qHeap.shift();
        }

        if (qHeap.length === k) {
          minCost = Math.min(minCost, qSum * w.ratio);
        }
      }
      return minCost.toFixed(5);
    },
    hiddenTestCases: [
      { input: '2\n10 20\n50 100\n1', expected: '50.00000' },
      { input: '2\n10 20\n50 100\n2', expected: '150.00000' }
    ]
  }),

  // 20. IPO (Maximize Capital) (Hard)
  createCanonicalProblem({
    problemId: 'dsa_heap-priority-queue_20',
    topicId: 'heap-priority-queue',
    order: 20,
    title: 'IPO',
    difficulty: 'Hard',
    tags: ['Array', 'Greedy', 'Sorting', 'Heap (Priority Queue)'],
    statement: `Suppose LeetCode will start its IPO soon. In order to sell a good price of its shares to Venture Capital, LeetCode would like to work on some projects to increase its capital before the IPO. Since it has limited resources, it can only finish at most k distinct projects before the IPO. Help LeetCode design the best way to maximize its total capital after finishing at most k distinct projects.

You are given n projects where the ith project has a pure profit profits[i] and a minimum capital of capital[i] is needed to start it.

Initially, you have w capital. When you finish a project, you will obtain its pure profit and the profit will be added to your total capital.

Pick a list of at most k distinct projects from given projects to maximize your final capital, and return the final maximized capital.`,
    inputFormat: `First line: integer K (max projects).
Second line: integer W (initial capital).
Third line: integer N.
Fourth line: N space-separated profits.
Fifth line: N space-separated capital requirements.`,
    outputFormat: `Print maximized final capital.`,
    constraints: ['1 <= k <= 10^5', '0 <= w <= 10^9', 'n == profits.length == capital.length', '1 <= n <= 10^5', '0 <= profits[i] <= 10^4', '0 <= capital[i] <= 10^9'],
    examples: [
      {
        input: '2\n0\n3\n1 2 3\n0 1 1',
        displayInput: 'k = 2, w = 0, profits = [1,2,3], capital = [0,1,1]',
        output: '4',
        displayOutput: '4',
        explanation: 'Start project 0 (capital 0) profit 1 -> w becomes 1. Next choose project 2 (capital 1) profit 3 -> w becomes 4.'
      },
      {
        input: '3\n0\n3\n1 2 3\n0 1 2',
        displayInput: 'k = 3, w = 0, profits = [1,2,3], capital = [0,1,2]',
        output: '6',
        displayOutput: '6',
        explanation: 'Pick projects 0, 1, 2 in order for total capital 6.'
      },
      {
        input: '1\n10\n1\n5\n10',
        displayInput: 'k = 1, w = 10, profits = [5], capital = [10]',
        output: '15',
        displayOutput: '15',
        explanation: 'Final capital is 15.'
      }
    ],
    hints: [
      'Sort projects by required capital ascending.',
      'Maintain a max-heap of profits for all projects whose capital <= current w.',
      'In each round, pop the project with maximum profit, add to w, and repeat k times.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const k = parseInt(lines[0], 10);
      let w = parseInt(lines[1], 10);
      const n = parseInt(lines[2], 10);
      const profits = lines[3].trim().split(/\s+/).map(Number);
      const capital = lines[4].trim().split(/\s+/).map(Number);

      const projects = [];
      for (let i = 0; i < n; i++) {
        projects.push([capital[i], profits[i]]);
      }
      projects.sort((a, b) => a[0] - b[0]);

      let projIdx = 0;
      const profitHeap = [];

      for (let round = 0; round < k; round++) {
        while (projIdx < n && projects[projIdx][0] <= w) {
          const p = projects[projIdx][1];
          // binary insert sorted descending
          let low = 0;
          let high = profitHeap.length;
          while (low < high) {
            const mid = Math.floor((low + high) / 2);
            if (profitHeap[mid] > p) low = mid + 1;
            else high = mid;
          }
          profitHeap.splice(low, 0, p);
          projIdx++;
        }

        if (profitHeap.length === 0) break;
        w += profitHeap.shift();
      }
      return w.toString();
    },
    hiddenTestCases: [
      { input: '1\n0\n2\n2 1\n0 0', expected: '2' },
      { input: '2\n1\n2\n10 20\n1 2', expected: '31' }
    ]
  })
];


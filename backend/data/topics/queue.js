/**
 * Canonical DSA Placement Problems: QUEUE (20 Questions)
 * 7 Easy, 9 Medium, 4 Hard
 */

import { createCanonicalProblem } from './topicProblemHelper.js';

export const QUEUE_PROBLEMS = [
  // 1. Implement Stack using Queues (Easy)
  createCanonicalProblem({
    problemId: 'dsa_queue_01',
    topicId: 'queue',
    order: 1,
    title: 'Implement Stack using Queues',
    difficulty: 'Easy',
    tags: ['Queue', 'Design', 'Stack'],
    statement: `Implement a last-in-first-out (LIFO) stack using only queues. The implemented stack should support normal stack operations: push, top, and pop.

Operations:
- push X: Pushes element X onto the stack.
- pop: Removes the element on top of the stack and returns it.
- top: Returns the element on the top of the stack.`,
    inputFormat: `First line: integer Q (number of operations).
Next Q lines: 'push X', 'pop', or 'top'.`,
    outputFormat: `Print the results of all pop and top operations separated by spaces.`,
    constraints: ['1 <= Q <= 100', '1 <= X <= 1000'],
    examples: [
      {
        input: '5\npush 1\npush 2\ntop\npop\ntop',
        displayInput: 'ops = [push 1, push 2, top, pop, top]',
        output: '2 2 1',
        displayOutput: '2 2 1',
        explanation: 'top returns 2, pop removes 2, new top is 1.'
      },
      {
        input: '4\npush 10\npush 20\npop\npop',
        displayInput: 'ops = [push 10, push 20, pop, pop]',
        output: '20 10',
        displayOutput: '20 10',
        explanation: 'Stack pops in LIFO order: 20 then 10.'
      },
      {
        input: '3\npush 5\ntop\npop',
        displayInput: 'ops = [push 5, top, pop]',
        output: '5 5',
        displayOutput: '5 5',
        explanation: 'top is 5, pop removes 5.'
      }
    ],
    hints: [
      'You can implement a stack with a single queue.',
      'When pushing an element X, enqueue it, then dequeue and re-enqueue all previous elements so the new element is at the front.',
      'Then pop and top are simple dequeue and peek operations in O(1).'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const q = parseInt(lines[0], 10);
      const queue = [];
      const results = [];

      for (let i = 1; i <= q; i++) {
        if (!lines[i]) continue;
        const [cmd, val] = lines[i].trim().split(/\s+/);
        if (cmd === 'push') {
          queue.push(val);
          const sz = queue.length;
          for (let k = 0; k < sz - 1; k++) {
            queue.push(queue.shift());
          }
        } else if (cmd === 'pop') {
          if (queue.length > 0) results.push(queue.shift());
        } else if (cmd === 'top') {
          if (queue.length > 0) results.push(queue[0]);
        }
      }
      return results.join(' ');
    },
    hiddenTestCases: [
      { input: '3\npush 1\npush 2\npop', expected: '2' },
      { input: '6\npush 10\npush 20\npush 30\npop\ntop\npop', expected: '30 20 20' },
      { input: '4\npush 100\ntop\npush 200\ntop', expected: '100 200' }
    ]
  }),

  // 2. Number of Recent Calls (Easy)
  createCanonicalProblem({
    problemId: 'dsa_queue_02',
    topicId: 'queue',
    order: 2,
    title: 'Number of Recent Calls',
    difficulty: 'Easy',
    tags: ['Queue', 'Design', 'Data Stream'],
    statement: `You have a RecentCounter class which counts the number of recent requests within a certain time frame.

Implement the RecentCounter class:
- ping(t): Adds a new request at time t, where t represents some time in milliseconds, and returns the number of requests that have happened in the past 3000 milliseconds (including the new request). Specifically, return the number of requests that have happened in the inclusive range [t - 3000, t].

It is guaranteed that every call to ping uses a strictly larger value of t than the previous call.`,
    inputFormat: `First line: integer N.
Second line: N space-separated increasing timestamps in milliseconds.`,
    outputFormat: `Print the count of recent calls after each ping separated by spaces.`,
    constraints: ['1 <= N <= 10^4', '1 <= t <= 10^9', 'Each ping has strictly larger t.'],
    examples: [
      {
        input: '4\n1 100 3001 3002',
        displayInput: 'pings = [1, 100, 3001, 3002]',
        output: '1 2 3 3',
        displayOutput: '[1, 2, 3, 3]',
        explanation: 'At 1 -> [1] (1), at 100 -> [1, 100] (2), at 3001 -> [1, 100, 3001] (3), at 3002 -> 1 expires, [100, 3001, 3002] (3).'
      },
      {
        input: '3\n1 2 3',
        displayInput: 'pings = [1, 2, 3]',
        output: '1 2 3',
        displayOutput: '[1, 2, 3]',
        explanation: 'All timestamps are within 3000 ms.'
      },
      {
        input: '2\n1 3002',
        displayInput: 'pings = [1, 3002]',
        output: '1 1',
        displayOutput: '[1, 1]',
        explanation: 'At 3002, 1 has expired (3002 - 3000 = 2 > 1).'
      }
    ],
    hints: [
      'Use a FIFO queue to store timestamps.',
      'For each timestamp t, enqueue t.',
      'Pop elements from the front of the queue while queue.front() < t - 3000.',
      'Return the queue size.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n === 0) return '';
      const timestamps = lines[1].trim().split(/\s+/).map(Number);
      const queue = [];
      const res = [];

      for (const t of timestamps) {
        queue.push(t);
        while (queue.length > 0 && queue[0] < t - 3000) {
          queue.shift();
        }
        res.push(queue.length);
      }
      return res.join(' ');
    },
    hiddenTestCases: [
      { input: '3\n1000 2000 5001', expected: '1 2 2' },
      { input: '1\n500', expected: '1' },
      { input: '5\n10 20 30 40 3050', expected: '1 2 3 4 2' }
    ]
  }),

  // 3. First Unique Character in a String (Easy)
  createCanonicalProblem({
    problemId: 'dsa_queue_03',
    topicId: 'queue',
    order: 3,
    title: 'First Unique Character in a String',
    difficulty: 'Easy',
    tags: ['Queue', 'Hash Table', 'String'],
    statement: `Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1.`,
    inputFormat: `First line contains string s.`,
    outputFormat: `Print the 0-based index of the first non-repeating character, or -1 if none exists.`,
    constraints: ['1 <= s.length <= 10^5', 's consists of only lowercase English letters.'],
    examples: [
      {
        input: 'leetcode',
        displayInput: 's = "leetcode"',
        output: '0',
        displayOutput: '0',
        explanation: 'The letter "l" at index 0 does not repeat.'
      },
      {
        input: 'loveleetcode',
        displayInput: 's = "loveleetcode"',
        output: '2',
        displayOutput: '2',
        explanation: '"v" at index 2 is the first unique character.'
      },
      {
        input: 'aabb',
        displayInput: 's = "aabb"',
        output: '-1',
        displayOutput: '-1',
        explanation: 'All characters repeat.'
      }
    ],
    hints: [
      'Store frequency counts of each character in an array or map.',
      'Enqueue indices or pairs [char, index].',
      'Pop elements from the front of the queue while the character frequency > 1.',
      'The front of the queue is the first unique character.'
    ],
    solveFunction: (input) => {
      const s = input.trim();
      const count = {};
      for (const ch of s) count[ch] = (count[ch] || 0) + 1;
      for (let i = 0; i < s.length; i++) {
        if (count[s[i]] === 1) return i.toString();
      }
      return '-1';
    },
    hiddenTestCases: [
      { input: 'z', expected: '0' },
      { input: 'aadadaad', expected: '-1' },
      { input: 'abcdefg', expected: '0' },
      { input: 'ccab', expected: '2' }
    ]
  }),

  // 4. Time Needed to Buy Tickets (Easy)
  createCanonicalProblem({
    problemId: 'dsa_queue_04',
    topicId: 'queue',
    order: 4,
    title: 'Time Needed to Buy Tickets',
    difficulty: 'Easy',
    tags: ['Queue', 'Array', 'Simulation'],
    statement: `There are n people in a line queuing to buy tickets, where the 0th person is at the front and the (n - 1)th person is at the back.

You are given a 0-indexed integer array tickets of length n where the number of tickets that the ith person would like to buy is tickets[i].

Each person takes exactly 1 second to buy a ticket. A person can only buy 1 ticket at a time and has to go back to the end of the line (which happens instantaneously) in order to buy more tickets. If a person finishes buying all their tickets, they leave the line.

Return the time taken for the person at index k (0-indexed) to finish buying tickets.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: target index K.`,
    outputFormat: `Print total seconds needed.`,
    constraints: ['n == tickets.length', '1 <= n <= 100', '1 <= tickets[i] <= 100', '0 <= k < n'],
    examples: [
      {
        input: '3\n2 3 2\n2',
        displayInput: 'tickets = [2,3,2], k = 2',
        output: '6',
        displayOutput: '6',
        explanation: 'Round 1: [1,2,1], Round 2: [0,1,0]. Person at index 2 takes 6 seconds.'
      },
      {
        input: '4\n5 1 1 1\n0',
        displayInput: 'tickets = [5,1,1,1], k = 0',
        output: '8',
        displayOutput: '8',
        explanation: 'Person at index 0 takes 8 seconds.'
      },
      {
        input: '1\n3\n0',
        displayInput: 'tickets = [3], k = 0',
        output: '3',
        displayOutput: '3',
        explanation: 'Only 1 person needing 3 tickets = 3 seconds.'
      }
    ],
    hints: [
      'Each person before or at k can buy up to tickets[k] tickets.',
      'Each person after k can buy up to tickets[k] - 1 tickets.',
      'Sum min(tickets[i], tickets[k]) for i <= k, plus min(tickets[i], tickets[k] - 1) for i > k.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      const tickets = lines[1].trim().split(/\s+/).map(Number);
      const k = parseInt(lines[2], 10);
      let time = 0;
      for (let i = 0; i < n; i++) {
        if (i <= k) {
          time += Math.min(tickets[i], tickets[k]);
        } else {
          time += Math.min(tickets[i], tickets[k] - 1);
        }
      }
      return time.toString();
    },
    hiddenTestCases: [
      { input: '3\n84 49 59\n0', expected: '192' },
      { input: '2\n1 1\n1', expected: '2' },
      { input: '3\n3 2 1\n1', expected: '4' }
    ]
  }),

  // 5. Design Circular Queue (Easy)
  createCanonicalProblem({
    problemId: 'dsa_queue_05',
    topicId: 'queue',
    order: 5,
    title: 'Design Circular Queue',
    difficulty: 'Easy',
    tags: ['Queue', 'Design', 'Array'],
    statement: `Design your implementation of the circular queue. A circular queue is a linear data structure in which the operations are performed based on FIFO (First In First Out) principle, and the last position is connected back to the first position to make a circle.

Operations:
- enQueue(value): Inserts an element into the circular queue. Return true if successful.
- deQueue(): Deletes an element from the circular queue. Return true if successful.
- Front(): Gets the front item from the queue. If empty, return -1.
- Rear(): Gets the last item from the queue. If empty, return -1.
- isEmpty(): Checks whether the queue is empty. Return 'true' or 'false'.
- isFull(): Checks whether the queue is full. Return 'true' or 'false'.`,
    inputFormat: `First line: integer capacity.
Second line: integer Q.
Next Q lines: operations.`,
    outputFormat: `Print results of Front, Rear, isEmpty, and isFull operations separated by spaces.`,
    constraints: ['1 <= k <= 1000', '0 <= value <= 1000', '1 <= Q <= 1000'],
    examples: [
      {
        input: '3\n7\nenQueue 1\nenQueue 2\nenQueue 3\nFront\nRear\nisFull\ndeQueue',
        displayInput: 'cap = 3, ops = [enQueue 1, 2, 3, Front, Rear, isFull, deQueue]',
        output: '1 3 true',
        displayOutput: '1 3 true',
        explanation: 'Front is 1, Rear is 3, isFull is true.'
      },
      {
        input: '2\n4\nenQueue 10\nFront\nRear\nisEmpty',
        displayInput: 'cap = 2, ops = [enQueue 10, Front, Rear, isEmpty]',
        output: '10 10 false',
        displayOutput: '10 10 false',
        explanation: 'Front is 10, Rear is 10, isEmpty is false.'
      },
      {
        input: '1\n3\nFront\nisEmpty\nisFull',
        displayInput: 'cap = 1, ops = [Front, isEmpty, isFull]',
        output: '-1 true false',
        displayOutput: '-1 true false',
        explanation: 'Empty queue returns -1 for Front, true for isEmpty, false for isFull.'
      }
    ],
    hints: [
      'Maintain an array buffer of fixed size k, along with front pointer, count, and capacity.',
      'rear index can be computed as (front + count - 1) % capacity.',
      'enQueue adds at (front + count) % capacity and increments count.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const cap = parseInt(lines[0], 10);
      const q = parseInt(lines[1], 10);
      const buffer = new Array(cap);
      let front = 0;
      let count = 0;
      const results = [];

      for (let i = 2; i < 2 + q; i++) {
        if (!lines[i]) continue;
        const [cmd, val] = lines[i].trim().split(/\s+/);
        if (cmd === 'enQueue') {
          if (count < cap) {
            buffer[(front + count) % cap] = parseInt(val, 10);
            count++;
          }
        } else if (cmd === 'deQueue') {
          if (count > 0) {
            front = (front + 1) % cap;
            count--;
          }
        } else if (cmd === 'Front') {
          results.push(count === 0 ? -1 : buffer[front]);
        } else if (cmd === 'Rear') {
          results.push(count === 0 ? -1 : buffer[(front + count - 1) % cap]);
        } else if (cmd === 'isEmpty') {
          results.push(count === 0 ? 'true' : 'false');
        } else if (cmd === 'isFull') {
          results.push(count === cap ? 'true' : 'false');
        }
      }
      return results.join(' ');
    },
    hiddenTestCases: [
      { input: '2\n3\nenQueue 5\nenQueue 6\nisFull', expected: 'true' },
      { input: '2\n4\nenQueue 1\ndeQueue\nisEmpty\nFront', expected: 'true -1' },
      { input: '3\n5\nenQueue 1\nenQueue 2\ndeQueue\nenQueue 3\nRear', expected: '3' }
    ]
  }),

  // 6. Design Circular Deque (Easy)
  createCanonicalProblem({
    problemId: 'dsa_queue_06',
    topicId: 'queue',
    order: 6,
    title: 'Design Circular Deque',
    difficulty: 'Easy',
    tags: ['Queue', 'Design', 'Array'],
    statement: `Design your implementation of the circular double-ended queue (deque).

Implement operations:
- insertFront(value): Adds an item at the front of Deque.
- insertLast(value): Adds an item at the rear of Deque.
- deleteFront(): Deletes an item from the front of Deque.
- deleteLast(): Deletes an item from the rear of Deque.
- getFront(): Gets the front item from the Deque. If empty, return -1.
- getRear(): Gets the last item from Deque. If empty, return -1.`,
    inputFormat: `First line: integer capacity.
Second line: integer Q.
Next Q lines: deque operations.`,
    outputFormat: `Print results of getFront and getRear queries separated by spaces.`,
    constraints: ['1 <= k <= 1000', '0 <= value <= 1000', '1 <= Q <= 1000'],
    examples: [
      {
        input: '3\n6\ninsertLast 1\ninsertLast 2\ninsertFront 3\ngetFront\ngetRear\ndeleteLast',
        displayInput: 'cap = 3, ops = [insertLast 1, 2, insertFront 3, getFront, getRear, deleteLast]',
        output: '3 2',
        displayOutput: '3 2',
        explanation: 'Deque is [3, 1, 2]. getFront gives 3, getRear gives 2.'
      },
      {
        input: '2\n4\ninsertFront 10\ngetFront\ngetRear\ndeleteFront',
        displayInput: 'cap = 2, ops = [insertFront 10, getFront, getRear, deleteFront]',
        output: '10 10',
        displayOutput: '10 10',
        explanation: 'Front and Rear are both 10.'
      },
      {
        input: '1\n2\ngetFront\ngetRear',
        displayInput: 'cap = 1, ops = [getFront, getRear]',
        output: '-1 -1',
        displayOutput: '-1 -1',
        explanation: 'Empty deque returns -1 for both.'
      }
    ],
    hints: [
      'Use a fixed size array of length k.',
      'insertFront updates front = (front - 1 + k) % k.',
      'insertLast updates rear = (rear + 1) % k.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const cap = parseInt(lines[0], 10);
      const q = parseInt(lines[1], 10);
      const buffer = new Array(cap);
      let front = 0;
      let count = 0;
      const results = [];

      for (let i = 2; i < 2 + q; i++) {
        if (!lines[i]) continue;
        const [cmd, val] = lines[i].trim().split(/\s+/);
        if (cmd === 'insertFront') {
          if (count < cap) {
            front = (front - 1 + cap) % cap;
            buffer[front] = parseInt(val, 10);
            count++;
          }
        } else if (cmd === 'insertLast') {
          if (count < cap) {
            buffer[(front + count) % cap] = parseInt(val, 10);
            count++;
          }
        } else if (cmd === 'deleteFront') {
          if (count > 0) {
            front = (front + 1) % cap;
            count--;
          }
        } else if (cmd === 'deleteLast') {
          if (count > 0) {
            count--;
          }
        } else if (cmd === 'getFront') {
          results.push(count === 0 ? -1 : buffer[front]);
        } else if (cmd === 'getRear') {
          results.push(count === 0 ? -1 : buffer[(front + count - 1) % cap]);
        }
      }
      return results.join(' ');
    },
    hiddenTestCases: [
      { input: '2\n3\ninsertFront 7\ninsertLast 9\ngetFront', expected: '7' },
      { input: '2\n3\ninsertFront 7\ninsertLast 9\ngetRear', expected: '9' },
      { input: '2\n5\ninsertLast 1\ninsertLast 2\ndeleteFront\ngetFront\ngetRear', expected: '2 2' }
    ]
  }),

  // 7. Reveal Cards In Increasing Order (Easy)
  createCanonicalProblem({
    problemId: 'dsa_queue_07',
    topicId: 'queue',
    order: 7,
    title: 'Reveal Cards In Increasing Order',
    difficulty: 'Easy',
    tags: ['Queue', 'Array', 'Sorting', 'Simulation'],
    statement: `You are given an integer array deck. There is a deck of cards where every card has a unique integer. The integer on the ith card is deck[i].

You can order the deck in any way you want. Initially, all the cards start face down in the deck.

You do the following steps repeatedly until all cards are revealed:
1. Take the top card of the deck, reveal it, and take it out of the deck.
2. If there are still cards in the deck, put the next top card of the deck at the bottom of the deck.
3. If there are still unrevealed cards, go back to step 1. Otherwise, stop.

Return an ordering of the deck that would reveal the cards in increasing order.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the ordering of the deck separated by spaces.`,
    constraints: ['1 <= deck.length <= 1000', '1 <= deck[i] <= 10^6', 'All values are unique.'],
    examples: [
      {
        input: '7\n17 13 11 2 3 5 7',
        displayInput: 'deck = [17,13,11,2,3,5,7]',
        output: '2 13 3 11 5 17 7',
        displayOutput: '[2,13,3,11,5,17,7]',
        explanation: 'Reveals 2, moves next to bottom, reveals 3, etc., giving [2,3,5,7,11,13,17].'
      },
      {
        input: '2\n1 1000',
        displayInput: 'deck = [1,1000]',
        output: '1 1000',
        displayOutput: '[1,1000]',
        explanation: 'Reveals 1, then reveals 1000.'
      },
      {
        input: '1\n42',
        displayInput: 'deck = [42]',
        output: '42',
        displayOutput: '[42]',
        explanation: 'Single card revealed immediately.'
      }
    ],
    hints: [
      'Sort deck in ascending order.',
      'Initialize a queue with indices [0, 1, 2, ..., n-1].',
      'For each card in sorted deck, take index from front of queue, assign result[index] = card, then move next front index to back.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n === 0) return '';
      const deck = lines[1].trim().split(/\s+/).map(Number);
      deck.sort((a, b) => a - b);

      const queue = [];
      for (let i = 0; i < n; i++) queue.push(i);

      const res = new Array(n);
      for (const card of deck) {
        res[queue.shift()] = card;
        if (queue.length > 0) {
          queue.push(queue.shift());
        }
      }
      return res.join(' ');
    },
    hiddenTestCases: [
      { input: '3\n1 2 3', expected: '1 3 2' },
      { input: '4\n1 2 3 4', expected: '1 3 2 4' },
      { input: '5\n10 20 30 40 50', expected: '10 40 20 50 30' }
    ]
  }),

  // 8. Rotting Oranges (Medium)
  createCanonicalProblem({
    problemId: 'dsa_queue_08',
    topicId: 'queue',
    order: 8,
    title: 'Rotting Oranges',
    difficulty: 'Medium',
    tags: ['Queue', 'Array', 'Breadth-First Search', 'Matrix'],
    statement: `You are given an m x n grid where each cell can have one of three values:
- 0 representing an empty cell,
- 1 representing a fresh orange, or
- 2 representing a rotten orange.

Every minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten.

Return the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return -1.`,
    inputFormat: `First line: two integers R and C.
Next R lines: C space-separated integers.`,
    outputFormat: `Print minimum minutes (or -1 if fresh oranges remain).`,
    constraints: ['1 <= R, C <= 10', 'grid[i][j] is 0, 1, or 2.'],
    examples: [
      {
        input: '3 3\n2 1 1\n1 1 0\n0 1 1',
        displayInput: 'grid = [[2,1,1],[1,1,0],[0,1,1]]',
        output: '4',
        displayOutput: '4',
        explanation: 'All oranges become rotten in 4 minutes.'
      },
      {
        input: '3 3\n2 1 1\n0 1 1\n1 0 1',
        displayInput: 'grid = [[2,1,1],[0,1,1],[1,0,1]]',
        output: '-1',
        displayOutput: '-1',
        explanation: 'The orange in the bottom left corner cannot be rotted.'
      },
      {
        input: '1 2\n0 2',
        displayInput: 'grid = [[0,2]]',
        output: '0',
        displayOutput: '0',
        explanation: 'No fresh oranges exist at time 0.'
      }
    ],
    hints: [
      'Count all fresh oranges and push all rotten orange coordinates into a queue.',
      'Perform multi-source BFS level-by-level.',
      'In each minute, process all currently rotten oranges and infect adjacent fresh oranges.',
      'If fresh oranges remain at the end, return -1.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const [r, c] = lines[0].trim().split(/\s+/).map(Number);
      const grid = [];
      const queue = [];
      let fresh = 0;

      for (let i = 0; i < r; i++) {
        const row = lines[i + 1].trim().split(/\s+/).map(Number);
        grid.push(row);
        for (let j = 0; j < c; j++) {
          if (row[j] === 2) queue.push([i, j]);
          else if (row[j] === 1) fresh++;
        }
      }

      if (fresh === 0) return '0';
      let minutes = 0;
      const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

      while (queue.length > 0 && fresh > 0) {
        const sz = queue.length;
        for (let k = 0; k < sz; k++) {
          const [cr, cc] = queue.shift();
          for (const [dr, dc] of dirs) {
            const nr = cr + dr;
            const nc = cc + dc;
            if (nr >= 0 && nr < r && nc >= 0 && nc < c && grid[nr][nc] === 1) {
              grid[nr][nc] = 2;
              fresh--;
              queue.push([nr, nc]);
            }
          }
        }
        minutes++;
      }
      return fresh === 0 ? minutes.toString() : '-1';
    },
    hiddenTestCases: [
      { input: '2 2\n1 2\n2 1', expected: '1' },
      { input: '1 1\n1', expected: '-1' },
      { input: '1 1\n2', expected: '0' }
    ]
  }),

  // 9. 01 Matrix (Medium)
  createCanonicalProblem({
    problemId: 'dsa_queue_09',
    topicId: 'queue',
    order: 9,
    title: '01 Matrix',
    difficulty: 'Medium',
    tags: ['Queue', 'Array', 'Dynamic Programming', 'Breadth-First Search', 'Matrix'],
    statement: `Given an m x n binary matrix mat, return the distance of the nearest 0 for each cell.

The distance between two adjacent cells is 1.`,
    inputFormat: `First line: two integers R and C.
Next R lines: C space-separated integers (0 or 1).`,
    outputFormat: `Print the distance matrix with R lines of C space-separated integers.`,
    constraints: ['1 <= m, n <= 10^4', '1 <= m * n <= 10^4', 'mat[i][j] is either 0 or 1.', 'There is at least one 0.'],
    examples: [
      {
        input: '3 3\n0 0 0\n0 1 0\n0 0 0',
        displayInput: 'mat = [[0,0,0],[0,1,0],[0,0,0]]',
        output: '0 0 0\n0 1 0\n0 0 0',
        displayOutput: '[[0,0,0],[0,1,0],[0,0,0]]',
        explanation: 'Center 1 is adjacent to 0s, distance 1.'
      },
      {
        input: '3 3\n0 0 0\n0 1 0\n1 1 1',
        displayInput: 'mat = [[0,0,0],[0,1,0],[1,1,1]]',
        output: '0 0 0\n0 1 0\n1 2 1',
        displayOutput: '[[0,0,0],[0,1,0],[1,2,1]]',
        explanation: 'Bottom center has distance 2 to closest 0.'
      },
      {
        input: '1 2\n0 1',
        displayInput: 'mat = [[0,1]]',
        output: '0 1',
        displayOutput: '[[0,1]]',
        explanation: 'Distance from 1 to 0 is 1.'
      }
    ],
    hints: [
      'Push all cells containing 0 into a BFS queue with distance 0.',
      'Initialize all 1 cells to infinity or -1 (unvisited).',
      'From each cell popped from the queue, update unvisited neighbors with dist[r][c] + 1 and push them into queue.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const [r, c] = lines[0].trim().split(/\s+/).map(Number);
      const dist = Array.from({ length: r }, () => new Array(c).fill(-1));
      const queue = [];

      for (let i = 0; i < r; i++) {
        const row = lines[i + 1].trim().split(/\s+/).map(Number);
        for (let j = 0; j < c; j++) {
          if (row[j] === 0) {
            dist[i][j] = 0;
            queue.push([i, j]);
          }
        }
      }

      const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
      let head = 0;
      while (head < queue.length) {
        const [cr, cc] = queue[head++];
        for (const [dr, dc] of dirs) {
          const nr = cr + dr;
          const nc = cc + dc;
          if (nr >= 0 && nr < r && nc >= 0 && nc < c && dist[nr][nc] === -1) {
            dist[nr][nc] = dist[cr][cc] + 1;
            queue.push([nr, nc]);
          }
        }
      }
      return dist.map((row) => row.join(' ')).join('\n');
    },
    hiddenTestCases: [
      { input: '2 2\n0 1\n1 1', expected: '0 1\n1 2' },
      { input: '1 1\n0', expected: '0' }
    ]
  }),

  // 10. Sliding Window Maximum (Medium)
  createCanonicalProblem({
    problemId: 'dsa_queue_10',
    topicId: 'queue',
    order: 10,
    title: 'Sliding Window Maximum',
    difficulty: 'Medium',
    tags: ['Queue', 'Array', 'Sliding Window', 'Monotonic Queue'],
    statement: `You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position.

Return the max sliding window.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.
Third line: integer K.`,
    outputFormat: `Print maximum values of each window separated by spaces.`,
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', '1 <= k <= nums.length'],
    examples: [
      {
        input: '8\n1 3 -1 -3 5 3 6 7\n3',
        displayInput: 'nums = [1,3,-1,-3,5,3,6,7], k = 3',
        output: '3 3 5 5 6 7',
        displayOutput: '[3,3,5,5,6,7]',
        explanation: 'Windows of size 3 maximums are 3, 3, 5, 5, 6, 7.'
      },
      {
        input: '1\n1\n1',
        displayInput: 'nums = [1], k = 1',
        output: '1',
        displayOutput: '[1]',
        explanation: 'Single element window is 1.'
      },
      {
        input: '4\n9 11 8 5\n2',
        displayInput: 'nums = [9,11,8,5], k = 2',
        output: '11 11 8',
        displayOutput: '[11,11,8]',
        explanation: 'Max of [9,11] is 11, [11,8] is 11, [8,5] is 8.'
      }
    ],
    hints: [
      'Maintain a deque storing indices in monotonically decreasing order of values.',
      'Pop elements from the back of deque while nums[back] <= nums[i].',
      'Remove front index if it has fallen out of the current window (index <= i - k).',
      'The front of the deque is always the maximum for the current window once i >= k - 1.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n === 0) return '';
      const nums = lines[1].trim().split(/\s+/).map(Number);
      const k = parseInt(lines[2], 10);

      const deque = []; // stores indices
      const res = [];

      for (let i = 0; i < n; i++) {
        // remove indices outside window
        while (deque.length > 0 && deque[0] <= i - k) {
          deque.shift();
        }
        // remove indices whose values are <= current
        while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) {
          deque.pop();
        }
        deque.push(i);
        if (i >= k - 1) {
          res.push(nums[deque[0]]);
        }
      }
      return res.join(' ');
    },
    hiddenTestCases: [
      { input: '4\n4 3 2 1\n2', expected: '4 3 2' },
      { input: '5\n1 2 3 4 5\n3', expected: '3 4 5' },
      { input: '2\n7 7\n1', expected: '7 7' }
    ]
  }),

  // 11. Open the Lock (Medium)
  createCanonicalProblem({
    problemId: 'dsa_queue_11',
    topicId: 'queue',
    order: 11,
    title: 'Open the Lock',
    difficulty: 'Medium',
    tags: ['Queue', 'Breadth-First Search', 'Hash Table', 'String'],
    statement: `You have a lock in front of you with 4 circular wheels. Each wheel has 10 slots: '0' to '9'. The wheels can rotate freely and wrap around: for example we can turn '9' to be '0', or '0' to be '9'. Each move consists of turning one wheel one slot.

The lock initially starts at '0000', a string representing the state of the 4 wheels.

You are given a list of deadends dead ends, meaning if the lock displays any of these codes, the wheels of the lock will stop turning and you will be unable to open it.

Given a target representing the value of the wheels that will unlock the lock, return the minimum total number of turns required to open the lock, or -1 if it is impossible.`,
    inputFormat: `First line: integer D (number of deadends).
Second line: D space-separated deadend strings.
Third line: target string.`,
    outputFormat: `Print minimum turns (or -1 if impossible).`,
    constraints: ['1 <= deadends.length <= 500', 'target.length == 4', 'target and deadends[i] consist of digits only.'],
    examples: [
      {
        input: '5\n0201 0101 0102 1212 2002\n0202',
        displayInput: 'deadends = ["0201","0101","0102","1212","2002"], target = "0202"',
        output: '6',
        displayOutput: '6',
        explanation: 'Shortest path sequence takes 6 turns.'
      },
      {
        input: '1\n8888\n0009',
        displayInput: 'deadends = ["8888"], target = "0009"',
        output: '1',
        displayOutput: '1',
        explanation: 'One turn from "0000" backward to "0009".'
      },
      {
        input: '1\n0000\n8888',
        displayInput: 'deadends = ["0000"], target = "8888"',
        output: '-1',
        displayOutput: '-1',
        explanation: 'Starting state is a deadend.'
      }
    ],
    hints: [
      'Model this as finding shortest path in an unweighted graph using BFS.',
      'From state "abcd", generate 8 neighbor states by adding/subtracting 1 modulo 10 for each of the 4 digits.',
      'Store visited states and deadends in a Set to avoid redundant cycles.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const dCount = parseInt(lines[0], 10);
      const deadends = dCount > 0 ? new Set(lines[1].trim().split(/\s+/)) : new Set();
      const target = lines[2] ? lines[2].trim() : lines[1].trim();

      if (deadends.has('0000')) return '-1';
      if (target === '0000') return '0';

      const visited = new Set(['0000']);
      const queue = [['0000', 0]];

      while (queue.length > 0) {
        const [curr, turns] = queue.shift();
        if (curr === target) return turns.toString();

        for (let i = 0; i < 4; i++) {
          const digit = parseInt(curr[i], 10);
          for (const diff of [-1, 1]) {
            const nextDigit = (digit + diff + 10) % 10;
            const nextState = curr.slice(0, i) + nextDigit + curr.slice(i + 1);
            if (!visited.has(nextState) && !deadends.has(nextState)) {
              visited.add(nextState);
              queue.push([nextState, turns + 1]);
            }
          }
        }
      }
      return '-1';
    },
    hiddenTestCases: [
      { input: '1\n8887\n8888', expected: '-1' },
      { input: '0\n\n0001', expected: '1' }
    ]
  }),

  // 12. Shortest Path in Binary Matrix (Medium)
  createCanonicalProblem({
    problemId: 'dsa_queue_12',
    topicId: 'queue',
    order: 12,
    title: 'Shortest Path in Binary Matrix',
    difficulty: 'Medium',
    tags: ['Queue', 'Array', 'Breadth-First Search', 'Matrix'],
    statement: `Given an n x n binary matrix grid, return the length of the shortest clear path in the matrix. If there is no clear path, return -1.

A clear path in a binary matrix is a path from the top-left cell (0, 0) to the bottom-right cell (n - 1, n - 1) such that:
- All the visited cells of the path are 0.
- All the adjacent cells of the path are 8-directionally connected.
The length of a clear path is the number of visited cells of this path.`,
    inputFormat: `First line: integer N.
Next N lines: N space-separated integers (0 or 1).`,
    outputFormat: `Print the length of the shortest clear path, or -1.`,
    constraints: ['n == grid.length == grid[i].length', '1 <= n <= 100', 'grid[i][j] is 0 or 1.'],
    examples: [
      {
        input: '2\n0 1\n1 0',
        displayInput: 'grid = [[0,1],[1,0]]',
        output: '2',
        displayOutput: '2',
        explanation: 'Path is (0,0) -> (1,1) of length 2.'
      },
      {
        input: '3\n0 0 0\n1 1 0\n1 1 0',
        displayInput: 'grid = [[0,0,0],[1,1,0],[1,1,0]]',
        output: '4',
        displayOutput: '4',
        explanation: 'Shortest path length is 4.'
      },
      {
        input: '3\n1 0 0\n1 1 0\n1 1 0',
        displayInput: 'grid = [[1,0,0],[1,1,0],[1,1,0]]',
        output: '-1',
        displayOutput: '-1',
        explanation: 'Starting cell is 1 (blocked).'
      }
    ],
    hints: [
      'If grid[0][0] != 0 or grid[n-1][n-1] != 0, return -1 immediately.',
      'Use BFS with an 8-directional neighbor step.',
      'Mark cells as visited (e.g. set grid[r][c] = 1) when enqueuing to prevent redundant visits.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      const grid = [];
      for (let i = 0; i < n; i++) {
        grid.push(lines[i + 1].trim().split(/\s+/).map(Number));
      }

      if (grid[0][0] !== 0 || grid[n - 1][n - 1] !== 0) return '-1';
      if (n === 1) return '1';

      const queue = [[0, 0, 1]];
      grid[0][0] = 1; // mark visited

      const dirs = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
      ];

      while (queue.length > 0) {
        const [r, c, dist] = queue.shift();
        if (r === n - 1 && c === n - 1) return dist.toString();

        for (const [dr, dc] of dirs) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] === 0) {
            grid[nr][nc] = 1;
            queue.push([nr, nc, dist + 1]);
          }
        }
      }
      return '-1';
    },
    hiddenTestCases: [
      { input: '1\n0', expected: '1' },
      { input: '2\n0 0\n0 0', expected: '2' },
      { input: '3\n0 1 0\n0 1 0\n0 0 0', expected: '4' }
    ]
  }),

  // 13. Walls and Gates (Medium)
  createCanonicalProblem({
    problemId: 'dsa_queue_13',
    topicId: 'queue',
    order: 13,
    title: 'Walls and Gates',
    difficulty: 'Medium',
    tags: ['Queue', 'Array', 'Breadth-First Search', 'Matrix'],
    statement: `You are given an m x n grid rooms initialized with these three possible values:
- -1: A wall or an obstacle.
- 0: A gate.
- 2147483647: An empty room.

Fill each empty room with the distance to its nearest gate. If it is impossible to reach a gate, leave it as 2147483647.`,
    inputFormat: `First line: two integers R and C.
Next R lines: C space-separated integers.`,
    outputFormat: `Print the updated grid with each room filled with its distance.`,
    constraints: ['1 <= m, n <= 250', 'rooms[i][j] is -1, 0, or 2147483647.'],
    examples: [
      {
        input: '4 4\n2147483647 -1 0 2147483647\n2147483647 2147483647 2147483647 -1\n2147483647 -1 2147483647 -1\n0 -1 2147483647 2147483647',
        displayInput: '4x4 grid with gates at (0,2) and (3,0)',
        output: '3 -1 0 1\n2 2 1 -1\n1 -1 2 -1\n0 -1 3 4',
        displayOutput: '3 -1 0 1\n2 2 1 -1\n1 -1 2 -1\n0 -1 3 4',
        explanation: 'Rooms filled with minimum steps to nearest gate.'
      },
      {
        input: '1 2\n0 2147483647',
        displayInput: 'rooms = [[0, 2147483647]]',
        output: '0 1',
        displayOutput: '0 1',
        explanation: 'Room adjacent to gate has distance 1.'
      },
      {
        input: '1 1\n0',
        displayInput: 'rooms = [[0]]',
        output: '0',
        displayOutput: '0',
        explanation: 'Single gate has distance 0.'
      }
    ],
    hints: [
      'Multi-source BFS: enqueue all gates (rooms[r][c] == 0) initially.',
      'Whenever exploring an empty room (value 2147483647), update its value to rooms[curr_r][curr_c] + 1 and push into queue.',
      'Because BFS expands by layer, the first time an empty room is reached is guaranteed to be its shortest distance.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const [r, c] = lines[0].trim().split(/\s+/).map(Number);
      const grid = [];
      const queue = [];
      const INF = 2147483647;

      for (let i = 0; i < r; i++) {
        const row = lines[i + 1].trim().split(/\s+/).map(Number);
        grid.push(row);
        for (let j = 0; j < c; j++) {
          if (row[j] === 0) queue.push([i, j]);
        }
      }

      const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
      let head = 0;
      while (head < queue.length) {
        const [cr, cc] = queue[head++];
        for (const [dr, dc] of dirs) {
          const nr = cr + dr;
          const nc = cc + dc;
          if (nr >= 0 && nr < r && nc >= 0 && nc < c && grid[nr][nc] === INF) {
            grid[nr][nc] = grid[cr][cc] + 1;
            queue.push([nr, nc]);
          }
        }
      }
      return grid.map((row) => row.join(' ')).join('\n');
    },
    hiddenTestCases: [
      { input: '2 2\n0 -1\n-1 2147483647', expected: '0 -1\n-1 2147483647' },
      { input: '1 3\n0 2147483647 0', expected: '0 1 0' }
    ]
  }),

  // 14. Course Schedule (Kahn's BFS) (Medium)
  createCanonicalProblem({
    problemId: 'dsa_queue_14',
    topicId: 'queue',
    order: 14,
    title: "Course Schedule (Kahn's BFS)",
    difficulty: 'Medium',
    tags: ['Queue', 'Graph', 'Topological Sort', 'Breadth-First Search'],
    statement: `There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.

Return true if you can finish all courses. Otherwise, return false. Implement using Kahn's algorithm (BFS queue).`,
    inputFormat: `First line: two integers N and P (courses and prerequisites count).
Next P lines: two integers ai and bi.`,
    outputFormat: `Print 'true' if possible to finish all courses, else 'false'.`,
    constraints: ['1 <= numCourses <= 2000', '0 <= prerequisites.length <= 5000'],
    examples: [
      {
        input: '2 1\n1 0',
        displayInput: 'numCourses = 2, prerequisites = [[1, 0]]',
        output: 'true',
        displayOutput: 'true',
        explanation: 'To take course 1 you must have finished course 0. So you can finish both.'
      },
      {
        input: '2 2\n1 0\n0 1',
        displayInput: 'numCourses = 2, prerequisites = [[1, 0], [0, 1]]',
        output: 'false',
        displayOutput: 'false',
        explanation: 'Circular dependency: impossible to finish.'
      },
      {
        input: '1 0',
        displayInput: 'numCourses = 1, prerequisites = []',
        output: 'true',
        displayOutput: 'true',
        explanation: 'No prerequisites to satisfy.'
      }
    ],
    hints: [
      'Calculate in-degree for each node and build adjacency list: graph[bi].push(ai).',
      'Push all nodes with in-degree 0 into a BFS queue.',
      'Pop each node, decrement neighbor in-degrees; if a neighbor reaches in-degree 0, enqueue it.',
      'Check if total popped nodes == numCourses.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const [n, p] = lines[0].trim().split(/\s+/).map(Number);
      const inDegree = new Array(n).fill(0);
      const adj = Array.from({ length: n }, () => []);

      for (let i = 1; i <= p; i++) {
        if (!lines[i]) continue;
        const [u, v] = lines[i].trim().split(/\s+/).map(Number);
        adj[v].push(u);
        inDegree[u]++;
      }

      const queue = [];
      for (let i = 0; i < n; i++) {
        if (inDegree[i] === 0) queue.push(i);
      }

      let count = 0;
      while (queue.length > 0) {
        const u = queue.shift();
        count++;
        for (const v of adj[u]) {
          inDegree[v]--;
          if (inDegree[v] === 0) queue.push(v);
        }
      }
      return count === n ? 'true' : 'false';
    },
    hiddenTestCases: [
      { input: '3 2\n1 0\n2 1', expected: 'true' },
      { input: '3 3\n1 0\n2 1\n0 2', expected: 'false' },
      { input: '4 3\n1 0\n2 0\n3 1', expected: 'true' }
    ]
  }),

  // 15. Pacific Atlantic Water Flow (Medium)
  createCanonicalProblem({
    problemId: 'dsa_queue_15',
    topicId: 'queue',
    order: 15,
    title: 'Pacific Atlantic Water Flow',
    difficulty: 'Medium',
    tags: ['Queue', 'Array', 'Breadth-First Search', 'Matrix'],
    statement: `There is an m x n rectangular island that borders both the Pacific Ocean and Atlantic Ocean. The Pacific Ocean touches the island's left and top edges, and the Atlantic Ocean touches the island's right and bottom edges.

Rain water can flow to neighboring cells directly north, south, east, and west if the neighboring cell's height is less than or equal to the current cell's height. Water can also flow into the ocean from any cell adjacent to it.

Return the number of grid coordinates where water can flow to both the Pacific and Atlantic oceans.`,
    inputFormat: `First line: two integers R and C.
Next R lines: C space-separated heights.`,
    outputFormat: `Print the total count of cells reachable to both oceans.`,
    constraints: ['1 <= m, n <= 200', '0 <= heights[i][j] <= 10^5'],
    examples: [
      {
        input: '5 5\n1 2 2 3 5\n3 2 3 4 4\n2 4 5 3 1\n6 7 1 4 5\n5 1 1 2 4',
        displayInput: '5x5 island heights grid',
        output: '7',
        displayOutput: '7',
        explanation: '7 cells can flow water to both oceans.'
      },
      {
        input: '1 1\n1',
        displayInput: 'heights = [[1]]',
        output: '1',
        displayOutput: '1',
        explanation: 'Single cell touches both oceans.'
      },
      {
        input: '2 2\n1 2\n2 1',
        displayInput: 'heights = [[1,2],[2,1]]',
        output: '4',
        displayOutput: '4',
        explanation: 'All cells can flow to both oceans.'
      }
    ],
    hints: [
      'Think in reverse: start BFS from ocean borders and climb upwards (neighbor height >= current height).',
      'Run BFS queue from Pacific borders (top row and left column).',
      'Run BFS queue from Atlantic borders (bottom row and right column).',
      'Count cells reachable in both searches.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const [r, c] = lines[0].trim().split(/\s+/).map(Number);
      const heights = [];
      for (let i = 0; i < r; i++) {
        heights.push(lines[i + 1].trim().split(/\s+/).map(Number));
      }

      const pacQueue = [];
      const atlQueue = [];
      const pacVis = Array.from({ length: r }, () => new Array(c).fill(false));
      const atlVis = Array.from({ length: r }, () => new Array(c).fill(false));

      for (let i = 0; i < r; i++) {
        pacQueue.push([i, 0]);
        pacVis[i][0] = true;
        atlQueue.push([i, c - 1]);
        atlVis[i][c - 1] = true;
      }
      for (let j = 0; j < c; j++) {
        pacQueue.push([0, j]);
        pacVis[0][j] = true;
        atlQueue.push([r - 1, j]);
        atlVis[r - 1][j] = true;
      }

      const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
      const bfs = (queue, visited) => {
        let head = 0;
        while (head < queue.length) {
          const [cr, cc] = queue[head++];
          for (const [dr, dc] of dirs) {
            const nr = cr + dr;
            const nc = cc + dc;
            if (nr >= 0 && nr < r && nc >= 0 && nc < c && !visited[nr][nc] && heights[nr][nc] >= heights[cr][cc]) {
              visited[nr][nc] = true;
              queue.push([nr, nc]);
            }
          }
        }
      };

      bfs(pacQueue, pacVis);
      bfs(atlQueue, atlVis);

      let common = 0;
      for (let i = 0; i < r; i++) {
        for (let j = 0; j < c; j++) {
          if (pacVis[i][j] && atlVis[i][j]) common++;
        }
      }
      return common.toString();
    },
    hiddenTestCases: [
      { input: '2 1\n1\n2', expected: '2' },
      { input: '3 3\n10 10 10\n10 1 10\n10 10 10', expected: '8' }
    ]
  }),

  // 16. Number of Islands (Medium)
  createCanonicalProblem({
    problemId: 'dsa_queue_16',
    topicId: 'queue',
    order: 16,
    title: 'Number of Islands',
    difficulty: 'Medium',
    tags: ['Queue', 'Array', 'Breadth-First Search', 'Matrix'],
    statement: `Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
    inputFormat: `First line: two integers R and C.
Next R lines: C space-separated characters ('0' or '1').`,
    outputFormat: `Print the total number of islands.`,
    constraints: ['1 <= m, n <= 300', 'grid[i][j] is "0" or "1".'],
    examples: [
      {
        input: '4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0',
        displayInput: 'grid with 1 connected island',
        output: '1',
        displayOutput: '1',
        explanation: 'All 1s connect into 1 single island.'
      },
      {
        input: '4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1',
        displayInput: 'grid with 3 separate islands',
        output: '3',
        displayOutput: '3',
        explanation: 'Top-left, middle, and bottom-right form 3 islands.'
      },
      {
        input: '1 1\n1',
        displayInput: 'grid = [["1"]]',
        output: '1',
        displayOutput: '1',
        explanation: 'Single island cell.'
      }
    ],
    hints: [
      'Iterate through every cell in the grid.',
      'When you encounter a "1", increment your island counter, and launch a BFS queue from this cell.',
      'In the BFS, turn all connected "1"s into "0"s so they will not be counted again.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const [r, c] = lines[0].trim().split(/\s+/).map(Number);
      const grid = [];
      for (let i = 0; i < r; i++) {
        grid.push(lines[i + 1].trim().split(/\s+/));
      }

      let islands = 0;
      const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

      for (let i = 0; i < r; i++) {
        for (let j = 0; j < c; j++) {
          if (grid[i][j] === '1') {
            islands++;
            grid[i][j] = '0';
            const queue = [[i, j]];
            let head = 0;
            while (head < queue.length) {
              const [cr, cc] = queue[head++];
              for (const [dr, dc] of dirs) {
                const nr = cr + dr;
                const nc = cc + dc;
                if (nr >= 0 && nr < r && nc >= 0 && nc < c && grid[nr][nc] === '1') {
                  grid[nr][nc] = '0';
                  queue.push([nr, nc]);
                }
              }
            }
          }
        }
      }
      return islands.toString();
    },
    hiddenTestCases: [
      { input: '2 2\n0 0\n0 0', expected: '0' },
      { input: '3 3\n1 0 1\n0 1 0\n1 0 1', expected: '5' },
      { input: '2 2\n1 1\n1 1', expected: '1' }
    ]
  }),

  // 17. Word Ladder (Hard)
  createCanonicalProblem({
    problemId: 'dsa_queue_17',
    topicId: 'queue',
    order: 17,
    title: 'Word Ladder',
    difficulty: 'Hard',
    tags: ['Queue', 'Breadth-First Search', 'Hash Table', 'String'],
    statement: `A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that:
- Every adjacent pair of words differs by a single letter.
- Every si for 1 <= i <= k is in wordList.
- sk == endWord.

Given two words, beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists.`,
    inputFormat: `First line: beginWord.
Second line: endWord.
Third line: integer N (wordList size).
Fourth line: N space-separated words.`,
    outputFormat: `Print shortest transformation length (or 0 if impossible).`,
    constraints: ['1 <= beginWord.length <= 10', 'endWord.length == beginWord.length', '1 <= wordList.length <= 5000'],
    examples: [
      {
        input: 'hit\ncog\n6\nhot dot dog lot log cog',
        displayInput: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]',
        output: '5',
        displayOutput: '5',
        explanation: 'One shortest transformation sequence is "hit" -> "hot" -> "dot" -> "dog" -> "cog", which is 5 words long.'
      },
      {
        input: 'hit\ncog\n5\nhot dot dog lot log',
        displayInput: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]',
        output: '0',
        displayOutput: '0',
        explanation: 'The endWord "cog" is not in wordList, so there is no valid transformation sequence.'
      },
      {
        input: 'a\nc\n3\na b c',
        displayInput: 'beginWord = "a", endWord = "c", wordList = ["a","b","c"]',
        output: '2',
        displayOutput: '2',
        explanation: '"a" -> "c" is 2 words.'
      }
    ],
    hints: [
      'Store wordList in a Hash Set for O(1) membership lookups.',
      'Use BFS starting with [beginWord, 1].',
      'For the current word, replace each letter with all 26 lowercase English letters and check if it exists in wordList.',
      'Remove matched words from the set to avoid cycles.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const beginWord = lines[0].trim();
      const endWord = lines[1].trim();
      const n = parseInt(lines[2], 10);
      const wordList = n > 0 ? new Set(lines[3].trim().split(/\s+/)) : new Set();

      if (!wordList.has(endWord)) return '0';

      const queue = [[beginWord, 1]];
      const visited = new Set([beginWord]);

      while (queue.length > 0) {
        const [curr, len] = queue.shift();
        if (curr === endWord) return len.toString();

        for (let i = 0; i < curr.length; i++) {
          for (let c = 97; c <= 122; c++) {
            const nextWord = curr.slice(0, i) + String.fromCharCode(c) + curr.slice(i + 1);
            if (wordList.has(nextWord) && !visited.has(nextWord)) {
              visited.add(nextWord);
              queue.push([nextWord, len + 1]);
            }
          }
        }
      }
      return '0';
    },
    hiddenTestCases: [
      { input: 'hot\ndog\n3\nhot dog dot', expected: '3' },
      { input: 'talk\ntail\n4\ntalk task took tail', expected: '0' }
    ]
  }),

  // 18. Jump Game IV (Hard)
  createCanonicalProblem({
    problemId: 'dsa_queue_18',
    topicId: 'queue',
    order: 18,
    title: 'Jump Game IV',
    difficulty: 'Hard',
    tags: ['Queue', 'Array', 'Hash Table', 'Breadth-First Search'],
    statement: `Given an array of integers arr, you are initially positioned at the first index of the array.

In one step you can jump from index i to index:
- i + 1 where: i + 1 < arr.length.
- i - 1 where: i - 1 >= 0.
- j where: arr[i] == arr[j] and i != j.

Return the minimum number of steps to reach the last index of the array.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print minimum jumps to reach the last index.`,
    constraints: ['1 <= arr.length <= 5 * 10^4', '-10^8 <= arr[i] <= 10^8'],
    examples: [
      {
        input: '10\n100 -23 -23 404 100 23 23 23 3 404',
        displayInput: 'arr = [100,-23,-23,404,100,23,23,23,3,404]',
        output: '3',
        displayOutput: '3',
        explanation: '0 -> 4 -> 9 (via same-value jump: 100 -> 100 -> 404).'
      },
      {
        input: '1\n7',
        displayInput: 'arr = [7]',
        output: '0',
        displayOutput: '0',
        explanation: 'Already at the last index.'
      },
      {
        input: '8\n7 6 9 6 9 6 9 7',
        displayInput: 'arr = [7,6,9,6,9,6,9,7]',
        output: '1',
        displayOutput: '1',
        explanation: 'Direct jump from index 0 to 7.'
      }
    ],
    hints: [
      'Group indices by value into a hash map graph[val] = [indices].',
      'Use BFS starting from index 0.',
      'Crucial optimization: after enqueuing all indices for graph[arr[i]], clear graph[arr[i]] to prevent redundant O(N^2) visits.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n <= 1) return '0';
      const arr = lines[1].trim().split(/\s+/).map(Number);

      const map = {};
      for (let i = 0; i < n; i++) {
        if (!map[arr[i]]) map[arr[i]] = [];
        map[arr[i]].push(i);
      }

      const visited = new Uint8Array(n);
      visited[0] = 1;
      const queue = [[0, 0]];
      let head = 0;

      while (head < queue.length) {
        const [idx, step] = queue[head++];
        if (idx === n - 1) return step.toString();

        // Check same-value jumps
        if (map[arr[idx]]) {
          for (const nextIdx of map[arr[idx]]) {
            if (!visited[nextIdx]) {
              visited[nextIdx] = 1;
              queue.push([nextIdx, step + 1]);
            }
          }
          delete map[arr[idx]]; // clear to avoid revisiting same value group
        }

        // Check neighbor jumps
        if (idx + 1 < n && !visited[idx + 1]) {
          visited[idx + 1] = 1;
          queue.push([idx + 1, step + 1]);
        }
        if (idx - 1 >= 0 && !visited[idx - 1]) {
          visited[idx - 1] = 1;
          queue.push([idx - 1, step + 1]);
        }
      }
      return '0';
    },
    hiddenTestCases: [
      { input: '3\n6 1 9', expected: '2' },
      { input: '4\n11 22 11 22', expected: '2' }
    ]
  }),

  // 19. Shortest Path to Get All Keys (Hard)
  createCanonicalProblem({
    problemId: 'dsa_queue_19',
    topicId: 'queue',
    order: 19,
    title: 'Shortest Path to Get All Keys',
    difficulty: 'Hard',
    tags: ['Queue', 'Bit Manipulation', 'Breadth-First Search', 'Matrix'],
    statement: `You are given an m x n grid grid where:
- '.' is an empty cell.
- '#' is a wall.
- '@' is the starting point.
- Lowercase letters ('a'-'f') represent keys.
- Uppercase letters ('A'-'F') represent locks.

You start at the starting point and one move consists of walking one space in one of the four cardinal directions. You cannot walk outside the grid, or walk into a wall. If you walk over a key, you pick it up. If you walk over a lock and have the matching key, you can unlock it.

Return the lowest number of moves to acquire all keys, or -1 if impossible.`,
    inputFormat: `First line: two integers R and C.
Next R lines: C characters (space-separated or contiguous string).`,
    outputFormat: `Print minimum moves to get all keys, or -1.`,
    constraints: ['1 <= m, n <= 30', 'grid[i][j] is ".", "#", "@", "a"-"f", or "A"-"F".', 'The number of keys is in the range [1, 6].'],
    examples: [
      {
        input: '3 8\n@ . a . # . . .\n# # # # # . # .\nb . A . B . . .',
        displayInput: '3x8 grid with keys a, b and locks A, B',
        output: '8',
        displayOutput: '8',
        explanation: 'Walk to pick key "a", pass lock "A", pick key "b" in 8 moves.'
      },
      {
        input: '3 3\n@ . a\n# # #\nb . A',
        displayInput: '3x3 grid blocked by wall',
        output: '-1',
        displayOutput: '-1',
        explanation: 'Path to key "b" is blocked completely.'
      },
      {
        input: '1 3\n@ a .',
        displayInput: 'grid = [["@","a","."]]',
        output: '1',
        displayOutput: '1',
        explanation: 'One move to pick up sole key "a".'
      }
    ],
    hints: [
      'Count total number of keys K. The target key bitmask is (1 << K) - 1.',
      'State in BFS queue is (row, col, keyMask, steps).',
      'Use a 3D visited boolean array: visited[row][col][mask].',
      'When landing on lock, verify (mask & (1 << (lock - "A"))) != 0 before proceeding.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const [r, c] = lines[0].trim().split(/\s+/).map(Number);
      const grid = [];
      let startR = 0;
      let startC = 0;
      let maxKeys = 0;

      for (let i = 0; i < r; i++) {
        const row = lines[i + 1].trim().split(/\s+/);
        grid.push(row);
        for (let j = 0; j < c; j++) {
          const ch = row[j];
          if (ch === '@') {
            startR = i;
            startC = j;
          } else if (ch >= 'a' && ch <= 'f') {
            maxKeys = Math.max(maxKeys, ch.charCodeAt(0) - 97 + 1);
          }
        }
      }

      const targetMask = (1 << maxKeys) - 1;
      const visited = new Set([`${startR},${startC},0`]);
      const queue = [[startR, startC, 0, 0]];
      const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

      while (queue.length > 0) {
        const [cr, cc, mask, steps] = queue.shift();
        if (mask === targetMask) return steps.toString();

        for (const [dr, dc] of dirs) {
          const nr = cr + dr;
          const nc = cc + dc;
          if (nr < 0 || nr >= r || nc < 0 || nc < c) continue;
          const ch = grid[nr][nc];
          if (ch === '#') continue;

          let nextMask = mask;
          if (ch >= 'a' && ch <= 'f') {
            nextMask |= (1 << (ch.charCodeAt(0) - 97));
          } else if (ch >= 'A' && ch <= 'F') {
            if ((mask & (1 << (ch.charCodeAt(0) - 65))) === 0) continue; // locked!
          }

          const state = `${nr},${nc},${nextMask}`;
          if (!visited.has(state)) {
            visited.add(state);
            queue.push([nr, nc, nextMask, steps + 1]);
          }
        }
      }
      return '-1';
    },
    hiddenTestCases: [
      { input: '2 2\n@ a\n# #', expected: '1' },
      { input: '1 5\n@ . a . b', expected: '4' }
    ]
  }),

  // 20. Minimum Genetic Mutation (Hard)
  createCanonicalProblem({
    problemId: 'dsa_queue_20',
    topicId: 'queue',
    order: 20,
    title: 'Minimum Genetic Mutation',
    difficulty: 'Hard',
    tags: ['Queue', 'Breadth-First Search', 'Hash Table', 'String'],
    statement: `A gene string can be represented by an 8-character long string, with choices from 'A', 'C', 'G', and 'T'.

Suppose we need to investigate a mutation from a gene string startGene to a gene string endGene where one mutation is defined as one single character changed in the gene string.

Given the two gene strings startGene and endGene and the gene bank bank that records all the valid gene mutations, return the minimum number of mutations needed to mutate from startGene to endGene. If there is no such a mutation, return -1.

Note that the starting point is assumed to be valid, so it might not be included in the bank.`,
    inputFormat: `First line: startGene.
Second line: endGene.
Third line: integer B (bank size).
Fourth line: B space-separated bank genes.`,
    outputFormat: `Print minimum mutations, or -1 if impossible.`,
    constraints: ['startGene.length == 8', 'endGene.length == 8', '0 <= bank.length <= 10', 'bank[i].length == 8'],
    examples: [
      {
        input: 'AACCGGTT\nAACCGGTA\n1\nAACCGGTA',
        displayInput: 'startGene = "AACCGGTT", endGene = "AACCGGTA", bank = ["AACCGGTA"]',
        output: '1',
        displayOutput: '1',
        explanation: 'Only 1 mutation: AACCGGTT -> AACCGGTA.'
      },
      {
        input: 'AACCGGTT\nAAACGGTA\n3\nAACCGGTA AACCGCTA AAACGGTA',
        displayInput: 'startGene = "AACCGGTT", endGene = "AAACGGTA", bank = ["AACCGGTA","AACCGCTA","AAACGGTA"]',
        output: '2',
        displayOutput: '2',
        explanation: 'AACCGGTT -> AACCGGTA -> AAACGGTA (2 mutations).'
      },
      {
        input: 'AAAAACCC\nAACCCCCC\n3\nAAAACCCC AAACCCCC AACCCCCC',
        displayInput: 'startGene = "AAAAACCC", endGene = "AACCCCCC", bank = ["AAAACCCC","AAACCCCC","AACCCCCC"]',
        output: '3',
        displayOutput: '3',
        explanation: 'Takes 3 mutations.'
      }
    ],
    hints: [
      'Store bank in a Hash Set for fast validation.',
      'Use BFS with state [gene, steps].',
      'For each position (0 to 7), replace character with "A", "C", "G", "T". If valid in bank and not visited, push to queue and delete from bank.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const startGene = lines[0].trim();
      const endGene = lines[1].trim();
      const b = parseInt(lines[2], 10);
      const bank = b > 0 ? new Set(lines[3].trim().split(/\s+/)) : new Set();

      if (!bank.has(endGene)) return '-1';

      const queue = [[startGene, 0]];
      const choices = ['A', 'C', 'G', 'T'];

      while (queue.length > 0) {
        const [curr, steps] = queue.shift();
        if (curr === endGene) return steps.toString();

        for (let i = 0; i < 8; i++) {
          for (const ch of choices) {
            if (ch === curr[i]) continue;
            const nextGene = curr.slice(0, i) + ch + curr.slice(i + 1);
            if (bank.has(nextGene)) {
              bank.delete(nextGene);
              queue.push([nextGene, steps + 1]);
            }
          }
        }
      }
      return '-1';
    },
    hiddenTestCases: [
      { input: 'AAAAAAAA\nCCCCCCCC\n1\nCCCCCCCC', expected: '-1' },
      { input: 'AACCGGTT\nAACCGGTA\n0\n', expected: '-1' }
    ]
  })
];


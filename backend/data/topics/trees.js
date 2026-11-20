/**
 * Canonical DSA Placement Problems: TREES (20 Questions)
 * 7 Easy, 9 Medium, 4 Hard
 */

import { createCanonicalProblem } from './topicProblemHelper.js';

// Tree building helper from level order array (-1 represents null)
function buildTree(arr) {
  if (!arr || arr.length === 0 || arr[0] === -1) return null;
  const root = { val: arr[0], left: null, right: null };
  const queue = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const curr = queue.shift();
    if (i < arr.length && arr[i] !== -1) {
      curr.left = { val: arr[i], left: null, right: null };
      queue.push(curr.left);
    }
    i++;
    if (i < arr.length && arr[i] !== -1) {
      curr.right = { val: arr[i], left: null, right: null };
      queue.push(curr.right);
    }
    i++;
  }
  return root;
}

export const TREES_PROBLEMS = [
  // 1. Maximum Depth of Binary Tree (Easy)
  createCanonicalProblem({
    problemId: 'dsa_trees_01',
    topicId: 'trees',
    order: 1,
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'Easy',
    tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
    statement: `Given the root of a binary tree, return its maximum depth.

A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node. Tree is given in level-order (-1 represents null).`,
    inputFormat: `First line: integer N.
Second line: N space-separated level-order integers (-1 for null).`,
    outputFormat: `Print the maximum depth.`,
    constraints: ['0 <= N <= 10^4', '-100 <= Node.val <= 100'],
    examples: [
      {
        input: '7\n3 9 20 -1 -1 15 7',
        displayInput: 'root = [3,9,20,null,null,15,7]',
        output: '3',
        displayOutput: '3',
        explanation: 'Path 3 -> 20 -> 15 has length 3.'
      },
      {
        input: '2\n1 -1 2',
        displayInput: 'root = [1,null,2]',
        output: '2',
        displayOutput: '2',
        explanation: 'Path 1 -> 2 has length 2.'
      },
      {
        input: '0\n',
        displayInput: 'root = []',
        output: '0',
        displayOutput: '0',
        explanation: 'Empty tree has depth 0.'
      }
    ],
    hints: [
      'If root is null, depth is 0.',
      'Recursively find max depth of left and right subtrees.',
      'Return 1 + Math.max(leftDepth, rightDepth).'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n === 0 || !lines[1]) return '0';
      const arr = lines[1].trim().split(/\s+/).map(Number);
      const root = buildTree(arr);

      const maxDepth = (node) => {
        if (!node) return 0;
        return 1 + Math.max(maxDepth(node.left), maxDepth(node.right));
      };
      return maxDepth(root).toString();
    },
    hiddenTestCases: [
      { input: '1\n10', expected: '1' },
      { input: '3\n1 2 3', expected: '2' },
      { input: '5\n1 2 -1 3 -1', expected: '3' }
    ]
  }),

  // 2. Same Tree (Easy)
  createCanonicalProblem({
    problemId: 'dsa_trees_02',
    topicId: 'trees',
    order: 2,
    title: 'Same Tree',
    difficulty: 'Easy',
    tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
    statement: `Given the roots of two binary trees p and q, write a function to check if they are the same or not.

Two binary trees are considered the same if they are structurally identical, and the nodes have the same value.`,
    inputFormat: `First line: level-order values of Tree 1 (-1 for null).
Second line: level-order values of Tree 2 (-1 for null).`,
    outputFormat: `Print 'true' if the trees are identical, else 'false'.`,
    constraints: ['The number of nodes in both trees is in range [0, 100].', '-10^4 <= Node.val <= 10^4'],
    examples: [
      {
        input: '1 2 3\n1 2 3',
        displayInput: 'p = [1,2,3], q = [1,2,3]',
        output: 'true',
        displayOutput: 'true',
        explanation: 'Both trees have the same structure and node values.'
      },
      {
        input: '1 2\n1 -1 2',
        displayInput: 'p = [1,2], q = [1,null,2]',
        output: 'false',
        displayOutput: 'false',
        explanation: 'Tree 1 has a left child while Tree 2 has a right child.'
      },
      {
        input: '1 2 1\n1 1 2',
        displayInput: 'p = [1,2,1], q = [1,1,2]',
        output: 'false',
        displayOutput: 'false',
        explanation: 'Node values do not match.'
      }
    ],
    hints: [
      'If both nodes are null, return true.',
      'If only one of them is null, return false.',
      'If their values differ, return false.',
      'Recursively check isSame(p.left, q.left) && isSame(p.right, q.right).'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const arr1 = lines[0] ? lines[0].trim().split(/\s+/).map(Number) : [];
      const arr2 = lines[1] ? lines[1].trim().split(/\s+/).map(Number) : [];
      const p = buildTree(arr1);
      const q = buildTree(arr2);

      const isSame = (n1, n2) => {
        if (!n1 && !n2) return true;
        if (!n1 || !n2) return false;
        if (n1.val !== n2.val) return false;
        return isSame(n1.left, n2.left) && isSame(n1.right, n2.right);
      };
      return isSame(p, q) ? 'true' : 'false';
    },
    hiddenTestCases: [
      { input: '1\n1', expected: 'true' },
      { input: '1 2\n1 3', expected: 'false' },
      { input: '-1\n-1', expected: 'true' }
    ]
  }),

  // 3. Invert Binary Tree (Easy)
  createCanonicalProblem({
    problemId: 'dsa_trees_03',
    topicId: 'trees',
    order: 3,
    title: 'Invert Binary Tree',
    difficulty: 'Easy',
    tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
    statement: `Given the root of a binary tree, invert the tree (mirror image), and return its level-order traversal.`,
    inputFormat: `First line: integer N.
Second line: N space-separated level-order integers (-1 for null).`,
    outputFormat: `Print the level-order traversal of the inverted tree separated by spaces.`,
    constraints: ['0 <= N <= 100', '-100 <= Node.val <= 100'],
    examples: [
      {
        input: '7\n4 2 7 1 3 6 9',
        displayInput: 'root = [4,2,7,1,3,6,9]',
        output: '4 7 2 9 6 3 1',
        displayOutput: '[4,7,2,9,6,3,1]',
        explanation: 'Every left and right child inverted.'
      },
      {
        input: '3\n2 1 3',
        displayInput: 'root = [2,1,3]',
        output: '2 3 1',
        displayOutput: '[2,3,1]',
        explanation: 'Children 1 and 3 swapped.'
      },
      {
        input: '0\n',
        displayInput: 'root = []',
        output: '',
        displayOutput: '[]',
        explanation: 'Empty tree stays empty.'
      }
    ],
    hints: [
      'Swap the left and right children of current node.',
      'Recursively invert left and right subtrees.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n === 0 || !lines[1]) return '';
      const arr = lines[1].trim().split(/\s+/).map(Number);
      const root = buildTree(arr);

      const invert = (node) => {
        if (!node) return null;
        const tmp = node.left;
        node.left = invert(node.right);
        node.right = invert(tmp);
        return node;
      };
      invert(root);

      if (!root) return '';
      const queue = [root];
      const res = [];
      while (queue.length > 0) {
        const curr = queue.shift();
        res.push(curr.val);
        if (curr.left) queue.push(curr.left);
        if (curr.right) queue.push(curr.right);
      }
      return res.join(' ');
    },
    hiddenTestCases: [
      { input: '1\n10', expected: '10' },
      { input: '3\n1 2 -1', expected: '1 -1 2' }
    ]
  }),

  // 4. Symmetric Tree (Easy)
  createCanonicalProblem({
    problemId: 'dsa_trees_04',
    topicId: 'trees',
    order: 4,
    title: 'Symmetric Tree',
    difficulty: 'Easy',
    tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
    statement: `Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).`,
    inputFormat: `First line: integer N.
Second line: N space-separated level-order integers (-1 for null).`,
    outputFormat: `Print 'true' if symmetric, else 'false'.`,
    constraints: ['The number of nodes in the tree is in range [1, 1000].', '-100 <= Node.val <= 100'],
    examples: [
      {
        input: '7\n1 2 2 3 4 4 3',
        displayInput: 'root = [1,2,2,3,4,4,3]',
        output: 'true',
        displayOutput: 'true',
        explanation: 'Tree is symmetric around root.'
      },
      {
        input: '5\n1 2 2 -1 3 -1 3',
        displayInput: 'root = [1,2,2,null,3,null,3]',
        output: 'false',
        displayOutput: 'false',
        explanation: 'Subtrees are not mirror images.'
      },
      {
        input: '1\n1',
        displayInput: 'root = [1]',
        output: 'true',
        displayOutput: 'true',
        explanation: 'Single node tree is trivially symmetric.'
      }
    ],
    hints: [
      'Write a helper isMirror(t1, t2).',
      'If both are null, return true.',
      'If one is null or values differ, return false.',
      'Return isMirror(t1.left, t2.right) && isMirror(t1.right, t2.left).'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n === 0 || !lines[1]) return 'true';
      const arr = lines[1].trim().split(/\s+/).map(Number);
      const root = buildTree(arr);

      const isMirror = (t1, t2) => {
        if (!t1 && !t2) return true;
        if (!t1 || !t2) return false;
        return t1.val === t2.val && isMirror(t1.left, t2.right) && isMirror(t1.right, t2.left);
      };
      return isMirror(root, root) ? 'true' : 'false';
    },
    hiddenTestCases: [
      { input: '3\n1 2 2', expected: 'true' },
      { input: '3\n1 2 3', expected: 'false' },
      { input: '5\n1 2 2 3 -1 -1 3', expected: 'true' }
    ]
  }),

  // 5. Diameter of Binary Tree (Easy)
  createCanonicalProblem({
    problemId: 'dsa_trees_05',
    topicId: 'trees',
    order: 5,
    title: 'Diameter of Binary Tree',
    difficulty: 'Easy',
    tags: ['Tree', 'Depth-First Search', 'Binary Tree'],
    statement: `Given the root of a binary tree, return the length of the diameter of the tree.

The diameter of a binary tree is the length of the longest path between any two nodes in a tree. This path may or may not pass through the root.

The length of a path between two nodes is represented by the number of edges between them.`,
    inputFormat: `First line: integer N.
Second line: N space-separated level-order integers (-1 for null).`,
    outputFormat: `Print the diameter length.`,
    constraints: ['The number of nodes in the tree is in range [1, 10^4].', '-100 <= Node.val <= 100'],
    examples: [
      {
        input: '5\n1 2 3 4 5',
        displayInput: 'root = [1,2,3,4,5]',
        output: '3',
        displayOutput: '3',
        explanation: 'Path [4,2,1,3] or [5,2,1,3] has 3 edges.'
      },
      {
        input: '2\n1 2',
        displayInput: 'root = [1,2]',
        output: '1',
        displayOutput: '1',
        explanation: 'Only 1 edge between 1 and 2.'
      },
      {
        input: '1\n1',
        displayInput: 'root = [1]',
        output: '0',
        displayOutput: '0',
        explanation: 'Single node has diameter 0.'
      }
    ],
    hints: [
      'For any node, the longest path passing through it is (left_height + right_height).',
      'Compute height recursively and maintain a global max diameter variable.',
      'Each node returns 1 + max(left_height, right_height).'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n === 0 || !lines[1]) return '0';
      const arr = lines[1].trim().split(/\s+/).map(Number);
      const root = buildTree(arr);

      let diameter = 0;
      const height = (node) => {
        if (!node) return 0;
        const lh = height(node.left);
        const rh = height(node.right);
        diameter = Math.max(diameter, lh + rh);
        return 1 + Math.max(lh, rh);
      };
      height(root);
      return diameter.toString();
    },
    hiddenTestCases: [
      { input: '3\n1 2 3', expected: '2' },
      { input: '4\n1 2 -1 3', expected: '2' },
      { input: '6\n1 2 3 4 5 -1', expected: '3' }
    ]
  }),

  // 6. Balanced Binary Tree (Easy)
  createCanonicalProblem({
    problemId: 'dsa_trees_06',
    topicId: 'trees',
    order: 6,
    title: 'Balanced Binary Tree',
    difficulty: 'Easy',
    tags: ['Tree', 'Depth-First Search', 'Binary Tree'],
    statement: `Given a binary tree, determine if it is height-balanced.

A height-balanced binary tree is a binary tree in which the depth of the two subtrees of every node never differs by more than one.`,
    inputFormat: `First line: integer N.
Second line: N space-separated level-order integers (-1 for null).`,
    outputFormat: `Print 'true' if balanced, else 'false'.`,
    constraints: ['The number of nodes is in range [0, 5000].', '-10^4 <= Node.val <= 10^4'],
    examples: [
      {
        input: '7\n3 9 20 -1 -1 15 7',
        displayInput: 'root = [3,9,20,null,null,15,7]',
        output: 'true',
        displayOutput: 'true',
        explanation: 'Height difference at every node is at most 1.'
      },
      {
        input: '7\n1 2 2 3 3 -1 -1',
        displayInput: 'root = [1,2,2,3,3,null,null]',
        output: 'false',
        displayOutput: 'false',
        explanation: 'Left subtree has depth 3, right subtree has depth 1. Difference > 1.'
      },
      {
        input: '0\n',
        displayInput: 'root = []',
        output: 'true',
        displayOutput: 'true',
        explanation: 'Empty tree is balanced.'
      }
    ],
    hints: [
      'Write a recursive function that returns the height of the tree, or -1 if unbalanced.',
      'If left or right subtree returns -1, or abs(lh - rh) > 1, return -1.',
      'Otherwise return 1 + max(lh, rh).'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n === 0 || !lines[1]) return 'true';
      const arr = lines[1].trim().split(/\s+/).map(Number);
      const root = buildTree(arr);

      const check = (node) => {
        if (!node) return 0;
        const lh = check(node.left);
        if (lh === -1) return -1;
        const rh = check(node.right);
        if (rh === -1) return -1;
        if (Math.abs(lh - rh) > 1) return -1;
        return 1 + Math.max(lh, rh);
      };
      return check(root) !== -1 ? 'true' : 'false';
    },
    hiddenTestCases: [
      { input: '1\n1', expected: 'true' },
      { input: '4\n1 2 -1 3', expected: 'false' },
      { input: '3\n1 2 3', expected: 'true' }
    ]
  }),

  // 7. Subtree of Another Tree (Easy)
  createCanonicalProblem({
    problemId: 'dsa_trees_07',
    topicId: 'trees',
    order: 7,
    title: 'Subtree of Another Tree',
    difficulty: 'Easy',
    tags: ['Tree', 'Depth-First Search', 'String Matching', 'Binary Tree'],
    statement: `Given the roots of two binary trees root and subRoot, return true if there is a subtree of root with the same structure and node values of subRoot and false otherwise.`,
    inputFormat: `First line: level-order values of main tree (-1 for null).
Second line: level-order values of subRoot tree (-1 for null).`,
    outputFormat: `Print 'true' if subRoot is a subtree, else 'false'.`,
    constraints: ['The number of nodes in root is in [1, 2000].', 'The number of nodes in subRoot is in [1, 1000].'],
    examples: [
      {
        input: '3 4 5 1 2\n4 1 2',
        displayInput: 'root = [3,4,5,1,2], subRoot = [4,1,2]',
        output: 'true',
        displayOutput: 'true',
        explanation: 'Subtree at node 4 matches subRoot.'
      },
      {
        input: '3 4 5 1 2 -1 -1 -1 -1 0\n4 1 2',
        displayInput: 'root = [3,4,5,1,2,null,null,null,null,0], subRoot = [4,1,2]',
        output: 'false',
        displayOutput: 'false',
        explanation: 'Node 2 has a child 0 in root, so it does not match exactly.'
      },
      {
        input: '1 1\n1',
        displayInput: 'root = [1,1], subRoot = [1]',
        output: 'true',
        displayOutput: 'true',
        explanation: 'Leaf 1 matches subRoot.'
      }
    ],
    hints: [
      'Write a helper isSameTree(s, t).',
      'For root, check if isSameTree(root, subRoot) is true.',
      'If not, recurse on isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot).'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const arr1 = lines[0].trim().split(/\s+/).map(Number);
      const arr2 = lines[1].trim().split(/\s+/).map(Number);
      const root = buildTree(arr1);
      const subRoot = buildTree(arr2);

      const isSame = (p, q) => {
        if (!p && !q) return true;
        if (!p || !q) return false;
        return p.val === q.val && isSame(p.left, q.left) && isSame(p.right, q.right);
      };

      const isSub = (r, s) => {
        if (!r) return false;
        if (isSame(r, s)) return true;
        return isSub(r.left, s) || isSub(r.right, s);
      };
      return isSub(root, subRoot) ? 'true' : 'false';
    },
    hiddenTestCases: [
      { input: '1\n1', expected: 'true' },
      { input: '1 2 3\n2', expected: 'true' },
      { input: '1 2 3\n4', expected: 'false' }
    ]
  }),

  // 8. Binary Tree Level Order Traversal (Medium)
  createCanonicalProblem({
    problemId: 'dsa_trees_08',
    topicId: 'trees',
    order: 8,
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    tags: ['Tree', 'Breadth-First Search', 'Binary Tree'],
    statement: `Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level). Print each level on a new line.`,
    inputFormat: `First line: integer N.
Second line: N space-separated level-order integers (-1 for null).`,
    outputFormat: `Print each level on a new line with space-separated values.`,
    constraints: ['The number of nodes in the tree is in range [0, 2000].', '-1000 <= Node.val <= 1000'],
    examples: [
      {
        input: '7\n3 9 20 -1 -1 15 7',
        displayInput: 'root = [3,9,20,null,null,15,7]',
        output: '3\n9 20\n15 7',
        displayOutput: '[[3],[9,20],[15,7]]',
        explanation: 'Level 0: 3, Level 1: 9, 20, Level 2: 15, 7.'
      },
      {
        input: '1\n1',
        displayInput: 'root = [1]',
        output: '1',
        displayOutput: '[[1]]',
        explanation: 'Single level with root 1.'
      },
      {
        input: '0\n',
        displayInput: 'root = []',
        output: '',
        displayOutput: '[]',
        explanation: 'Empty tree gives empty traversal.'
      }
    ],
    hints: [
      'Use a BFS queue.',
      'Record the queue length at the start of each level.',
      'Dequeue that many nodes, collecting their values and pushing their children.',
      'Join each level with spaces and print on separate lines.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n === 0 || !lines[1]) return '';
      const arr = lines[1].trim().split(/\s+/).map(Number);
      const root = buildTree(arr);
      if (!root) return '';

      const queue = [root];
      const levels = [];

      while (queue.length > 0) {
        const sz = queue.length;
        const currentLevel = [];
        for (let i = 0; i < sz; i++) {
          const node = queue.shift();
          currentLevel.push(node.val);
          if (node.left) queue.push(node.left);
          if (node.right) queue.push(node.right);
        }
        levels.push(currentLevel.join(' '));
      }
      return levels.join('\n');
    },
    hiddenTestCases: [
      { input: '3\n1 2 3', expected: '1\n2 3' },
      { input: '4\n1 2 -1 4', expected: '1\n2\n4' }
    ]
  }),

  // 9. Binary Tree Zigzag Level Order Traversal (Medium)
  createCanonicalProblem({
    problemId: 'dsa_trees_09',
    topicId: 'trees',
    order: 9,
    title: 'Binary Tree Zigzag Level Order Traversal',
    difficulty: 'Medium',
    tags: ['Tree', 'Breadth-First Search', 'Binary Tree'],
    statement: `Given the root of a binary tree, return the zigzag level order traversal of its nodes' values (i.e., from left to right, then right to left for the next level and alternate between). Print each level on a new line.`,
    inputFormat: `First line: integer N.
Second line: N space-separated level-order integers (-1 for null).`,
    outputFormat: `Print each zigzag level on a new line.`,
    constraints: ['The number of nodes in the tree is in range [0, 2000].', '-100 <= Node.val <= 100'],
    examples: [
      {
        input: '7\n3 9 20 -1 -1 15 7',
        displayInput: 'root = [3,9,20,null,null,15,7]',
        output: '3\n20 9\n15 7',
        displayOutput: '[[3],[20,9],[15,7]]',
        explanation: 'Level 0: left-to-right (3), Level 1: right-to-left (20, 9), Level 2: left-to-right (15, 7).'
      },
      {
        input: '1\n1',
        displayInput: 'root = [1]',
        output: '1',
        displayOutput: '[[1]]',
        explanation: 'Only 1 level.'
      },
      {
        input: '0\n',
        displayInput: 'root = []',
        output: '',
        displayOutput: '[]',
        explanation: 'Empty tree gives empty traversal.'
      }
    ],
    hints: [
      'Standard level order traversal using a queue.',
      'Maintain a boolean flag leftToRight = true.',
      'Reverse the level values if leftToRight is false, then invert the flag.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n === 0 || !lines[1]) return '';
      const arr = lines[1].trim().split(/\s+/).map(Number);
      const root = buildTree(arr);
      if (!root) return '';

      const queue = [root];
      const levels = [];
      let leftToRight = true;

      while (queue.length > 0) {
        const sz = queue.length;
        const currentLevel = [];
        for (let i = 0; i < sz; i++) {
          const node = queue.shift();
          currentLevel.push(node.val);
          if (node.left) queue.push(node.left);
          if (node.right) queue.push(node.right);
        }
        if (!leftToRight) currentLevel.reverse();
        levels.push(currentLevel.join(' '));
        leftToRight = !leftToRight;
      }
      return levels.join('\n');
    },
    hiddenTestCases: [
      { input: '3\n1 2 3', expected: '1\n3 2' },
      { input: '4\n1 2 3 4', expected: '1\n3 2\n4' }
    ]
  }),

  // 10. Lowest Common Ancestor of a Binary Tree (Medium)
  createCanonicalProblem({
    problemId: 'dsa_trees_10',
    topicId: 'trees',
    order: 10,
    title: 'Lowest Common Ancestor of a Binary Tree',
    difficulty: 'Medium',
    tags: ['Tree', 'Depth-First Search', 'Binary Tree'],
    statement: `Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree p and q.

According to the definition of LCA on Wikipedia: "The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself)."`,
    inputFormat: `First line: level-order tree values (-1 for null).
Second line: two space-separated node values p and q.`,
    outputFormat: `Print the value of the lowest common ancestor node.`,
    constraints: ['All node values are unique.', 'p != q', 'p and q will exist in the tree.'],
    examples: [
      {
        input: '3 5 1 6 2 0 8 -1 -1 7 4\n5 1',
        displayInput: 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1',
        output: '3',
        displayOutput: '3',
        explanation: 'LCA of 5 and 1 is 3.'
      },
      {
        input: '3 5 1 6 2 0 8 -1 -1 7 4\n5 4',
        displayInput: 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4',
        output: '5',
        displayOutput: '5',
        explanation: 'LCA of 5 and 4 is 5, since a node can be a descendant of itself.'
      },
      {
        input: '1 2\n1 2',
        displayInput: 'root = [1,2], p = 1, q = 2',
        output: '1',
        displayOutput: '1',
        explanation: 'LCA of 1 and 2 is 1.'
      }
    ],
    hints: [
      'If current node is null or equals p or q, return current node.',
      'Recursively search in left and right subtrees.',
      'If both left and right return non-null, root is LCA; else return whichever is non-null.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const arr = lines[0].trim().split(/\s+/).map(Number);
      const [p, q] = lines[1].trim().split(/\s+/).map(Number);
      const root = buildTree(arr);

      const lca = (node, v1, v2) => {
        if (!node || node.val === v1 || node.val === v2) return node;
        const left = lca(node.left, v1, v2);
        const right = lca(node.right, v1, v2);
        if (left && right) return node;
        return left || right;
      };
      const ans = lca(root, p, q);
      return ans ? ans.val.toString() : '';
    },
    hiddenTestCases: [
      { input: '1 2 3\n2 3', expected: '1' },
      { input: '2 1 3\n1 2', expected: '2' },
      { input: '5 3 6 2 4\n2 4', expected: '3' }
    ]
  }),

  // 11. Binary Tree Right Side View (Medium)
  createCanonicalProblem({
    problemId: 'dsa_trees_11',
    topicId: 'trees',
    order: 11,
    title: 'Binary Tree Right Side View',
    difficulty: 'Medium',
    tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
    statement: `Given the root of a binary tree, imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom.`,
    inputFormat: `First line: integer N.
Second line: N space-separated level-order integers (-1 for null).`,
    outputFormat: `Print the visible node values separated by spaces.`,
    constraints: ['The number of nodes in the tree is in range [0, 100].', '-100 <= Node.val <= 100'],
    examples: [
      {
        input: '5\n1 2 3 -1 5 -1 4',
        displayInput: 'root = [1,2,3,null,5,null,4]',
        output: '1 3 4',
        displayOutput: '[1, 3, 4]',
        explanation: 'Right side view sees 1 at level 0, 3 at level 1, 4 at level 2.'
      },
      {
        input: '3\n1 -1 3',
        displayInput: 'root = [1,null,3]',
        output: '1 3',
        displayOutput: '[1, 3]',
        explanation: 'View sees 1, 3.'
      },
      {
        input: '0\n',
        displayInput: 'root = []',
        output: '',
        displayOutput: '[]',
        explanation: 'Empty tree gives empty view.'
      }
    ],
    hints: [
      'Perform level order traversal.',
      'The last node in each level queue is visible from the right side.',
      'Alternatively, use reverse preorder DFS (Root, Right, Left) and add node when depth == view.length.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n === 0 || !lines[1]) return '';
      const arr = lines[1].trim().split(/\s+/).map(Number);
      const root = buildTree(arr);
      if (!root) return '';

      const queue = [root];
      const view = [];

      while (queue.length > 0) {
        const sz = queue.length;
        for (let i = 0; i < sz; i++) {
          const node = queue.shift();
          if (i === sz - 1) view.push(node.val);
          if (node.left) queue.push(node.left);
          if (node.right) queue.push(node.right);
        }
      }
      return view.join(' ');
    },
    hiddenTestCases: [
      { input: '4\n1 2 3 4', expected: '1 3 4' },
      { input: '1\n10', expected: '10' }
    ]
  }),

  // 12. Count Complete Tree Nodes (Medium)
  createCanonicalProblem({
    problemId: 'dsa_trees_12',
    topicId: 'trees',
    order: 12,
    title: 'Count Complete Tree Nodes',
    difficulty: 'Medium',
    tags: ['Tree', 'Binary Search', 'Binary Tree'],
    statement: `Given the root of a complete binary tree, return the number of the nodes in the tree.

In a complete binary tree every level, except possibly the last, is completely filled, and all nodes in the last level are as far left as possible. Design an algorithm that runs in less than O(n) time complexity.`,
    inputFormat: `First line: integer N.
Second line: N space-separated level-order integers (-1 for null).`,
    outputFormat: `Print the total node count.`,
    constraints: ['0 <= N <= 5 * 10^4', '0 <= Node.val <= 5 * 10^4', 'The tree is guaranteed to be complete.'],
    examples: [
      {
        input: '6\n1 2 3 4 5 6',
        displayInput: 'root = [1,2,3,4,5,6]',
        output: '6',
        displayOutput: '6',
        explanation: 'There are 6 nodes.'
      },
      {
        input: '0\n',
        displayInput: 'root = []',
        output: '0',
        displayOutput: '0',
        explanation: 'Empty tree has 0 nodes.'
      },
      {
        input: '1\n1',
        displayInput: 'root = [1]',
        output: '1',
        displayOutput: '1',
        explanation: 'Single root node.'
      }
    ],
    hints: [
      'Compute the leftmost height and rightmost height.',
      'If leftHeight == rightHeight, the tree is a full binary tree with (1 << leftHeight) - 1 nodes.',
      'Otherwise, count = 1 + countNodes(root.left) + countNodes(root.right) in O(log^2 N).'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n === 0 || !lines[1]) return '0';
      const arr = lines[1].trim().split(/\s+/).map(Number);
      const root = buildTree(arr);

      const count = (node) => {
        if (!node) return 0;
        let lh = 0;
        let curr = node;
        while (curr) {
          lh++;
          curr = curr.left;
        }
        let rh = 0;
        curr = node;
        while (curr) {
          rh++;
          curr = curr.right;
        }
        if (lh === rh) return (1 << lh) - 1;
        return 1 + count(node.left) + count(node.right);
      };
      return count(root).toString();
    },
    hiddenTestCases: [
      { input: '3\n1 2 3', expected: '3' },
      { input: '4\n1 2 3 4', expected: '4' },
      { input: '5\n1 2 3 4 5', expected: '5' }
    ]
  }),

  // 13. Construct Binary Tree from Preorder and Inorder Traversal (Medium)
  createCanonicalProblem({
    problemId: 'dsa_trees_13',
    topicId: 'trees',
    order: 13,
    title: 'Construct Binary Tree from Preorder and Inorder Traversal',
    difficulty: 'Medium',
    tags: ['Tree', 'Array', 'Hash Table', 'Divide and Conquer', 'Binary Tree'],
    statement: `Given two integer arrays preorder and inorder where preorder is the preorder traversal of a binary tree and inorder is the inorder traversal of the same tree, construct and return the binary tree postorder traversal.`,
    inputFormat: `First line: integer N.
Second line: N space-separated preorder integers.
Third line: N space-separated inorder integers.`,
    outputFormat: `Print the postorder traversal of the reconstructed tree separated by spaces.`,
    constraints: ['1 <= preorder.length <= 3000', 'inorder.length == preorder.length', 'All values are unique.'],
    examples: [
      {
        input: '5\n3 9 20 15 7\n9 3 15 20 7',
        displayInput: 'preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]',
        output: '9 15 7 20 3',
        displayOutput: '[9,15,7,20,3]',
        explanation: 'Reconstructed tree postorder is 9, 15, 7, 20, 3.'
      },
      {
        input: '1\n-1\n-1',
        displayInput: 'preorder = [-1], inorder = [-1]',
        output: '-1',
        displayOutput: '[-1]',
        explanation: 'Single node tree.'
      },
      {
        input: '3\n1 2 3\n2 1 3',
        displayInput: 'preorder = [1,2,3], inorder = [2,1,3]',
        output: '2 3 1',
        displayOutput: '[2,3,1]',
        explanation: 'Root 1 with left child 2 and right child 3.'
      }
    ],
    hints: [
      'The first element of preorder is the root.',
      'Locate this root in the inorder array: all elements to the left belong to the left subtree, all to the right belong to the right subtree.',
      'Recurse to construct left and right subtrees, then produce postorder.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n === 0) return '';
      const preorder = lines[1].trim().split(/\s+/).map(Number);
      const inorder = lines[2].trim().split(/\s+/).map(Number);

      const inMap = {};
      inorder.forEach((val, idx) => { inMap[val] = idx; });

      const build = (preStart, inStart, inEnd) => {
        if (preStart >= preorder.length || inStart > inEnd) return null;
        const val = preorder[preStart];
        const root = { val, left: null, right: null };
        const inIdx = inMap[val];
        const leftSize = inIdx - inStart;

        root.left = build(preStart + 1, inStart, inIdx - 1);
        root.right = build(preStart + 1 + leftSize, inIdx + 1, inEnd);
        return root;
      };

      const root = build(0, 0, n - 1);
      const post = [];
      const postorder = (node) => {
        if (!node) return;
        postorder(node.left);
        postorder(node.right);
        post.push(node.val);
      };
      postorder(root);
      return post.join(' ');
    },
    hiddenTestCases: [
      { input: '2\n1 2\n2 1', expected: '2 1' },
      { input: '2\n1 2\n1 2', expected: '2 1' }
    ]
  }),

  // 14. Flatten Binary Tree to Linked List (Medium)
  createCanonicalProblem({
    problemId: 'dsa_trees_14',
    topicId: 'trees',
    order: 14,
    title: 'Flatten Binary Tree to Linked List',
    difficulty: 'Medium',
    tags: ['Tree', 'Depth-First Search', 'Linked List', 'Binary Tree'],
    statement: `Given the root of a binary tree, flatten the tree into a "linked list":
- The "linked list" should use the same TreeNode class where the right child pointer points to the next node in the list and the left child pointer is always null.
- The "linked list" should be in the same order as a pre-order traversal of the binary tree.`,
    inputFormat: `First line: integer N.
Second line: N space-separated level-order integers (-1 for null).`,
    outputFormat: `Print the values along the flattened right-child list separated by spaces.`,
    constraints: ['The number of nodes in the tree is in range [0, 2000].', '-100 <= Node.val <= 100'],
    examples: [
      {
        input: '6\n1 2 5 3 4 -1 6',
        displayInput: 'root = [1,2,5,3,4,null,6]',
        output: '1 2 3 4 5 6',
        displayOutput: '[1,2,3,4,5,6]',
        explanation: 'Flattened along the right child pointers in preorder sequence.'
      },
      {
        input: '0\n',
        displayInput: 'root = []',
        output: '',
        displayOutput: '[]',
        explanation: 'Empty tree remains empty.'
      },
      {
        input: '1\n0',
        displayInput: 'root = [0]',
        output: '0',
        displayOutput: '[0]',
        explanation: 'Single node.'
      }
    ],
    hints: [
      'Traverse preorder to collect node values or pointers.',
      'Rewire pointers: for each node, left = null and right = next preorder node.',
      'Can also be done in O(1) space using Morris traversal threading.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n === 0 || !lines[1]) return '';
      const arr = lines[1].trim().split(/\s+/).map(Number);
      const root = buildTree(arr);
      if (!root) return '';

      const list = [];
      const preorder = (node) => {
        if (!node) return;
        list.push(node.val);
        preorder(node.left);
        preorder(node.right);
      };
      preorder(root);
      return list.join(' ');
    },
    hiddenTestCases: [
      { input: '2\n1 2', expected: '1 2' },
      { input: '3\n1 2 3', expected: '1 2 3' }
    ]
  }),

  // 15. Path Sum III (Medium)
  createCanonicalProblem({
    problemId: 'dsa_trees_15',
    topicId: 'trees',
    order: 15,
    title: 'Path Sum III',
    difficulty: 'Medium',
    tags: ['Tree', 'Depth-First Search', 'Binary Tree', 'Prefix Sum'],
    statement: `Given the root of a binary tree and an integer targetSum, return the number of paths where the sum of the values along the path equals targetSum.

The path does not need to start or end at the root or a leaf, but it must go downwards (i.e., traveling only from parent nodes to child nodes).`,
    inputFormat: `First line: level-order tree values (-1 for null).
Second line: targetSum integer.`,
    outputFormat: `Print the total number of paths equaling targetSum.`,
    constraints: ['The number of nodes in the tree is in range [0, 1000].', '-10^9 <= Node.val <= 10^9', '-1000 <= targetSum <= 1000'],
    examples: [
      {
        input: '10 5 -3 3 2 -1 11 3 -2 -1 1\n8',
        displayInput: 'root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8',
        output: '3',
        displayOutput: '3',
        explanation: 'Three paths sum to 8: (5,3), (5,2,1), (-3,11).'
      },
      {
        input: '5 4 8 11 -1 13 4 7 2 -1 -1 5 1\n22',
        displayInput: 'root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22',
        output: '3',
        displayOutput: '3',
        explanation: 'Three downward paths sum to 22.'
      },
      {
        input: '1 2\n3',
        displayInput: 'root = [1,2], targetSum = 3',
        output: '1',
        displayOutput: '1',
        explanation: 'Path 1 -> 2 sums to 3.'
      }
    ],
    hints: [
      'Maintain running prefix sum from the root down to the current node.',
      'Use a hash map to store frequencies of prefix sums.',
      'At current node with current_sum, add count of (current_sum - targetSum) from map to answer.',
      'Remember to backtrack (decrement count of current_sum in map) when returning from recursion.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const arr = lines[0].trim().split(/\s+/).map(Number);
      const targetSum = parseInt(lines[1], 10);
      const root = buildTree(arr);

      const map = { 0: 1 };
      let count = 0;

      const dfs = (node, currSum) => {
        if (!node) return;
        currSum += node.val;
        count += map[currSum - targetSum] || 0;
        map[currSum] = (map[currSum] || 0) + 1;
        dfs(node.left, currSum);
        dfs(node.right, currSum);
        map[currSum]--;
      };
      dfs(root, 0);
      return count.toString();
    },
    hiddenTestCases: [
      { input: '1\n1', expected: '1' },
      { input: '1\n2', expected: '0' },
      { input: '1 -2 -3\n-1', expected: '1' }
    ]
  }),

  // 16. All Nodes Distance K in Binary Tree (Medium)
  createCanonicalProblem({
    problemId: 'dsa_trees_16',
    topicId: 'trees',
    order: 16,
    title: 'All Nodes Distance K in Binary Tree',
    difficulty: 'Medium',
    tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
    statement: `Given the root of a binary tree, the value of a target node target, and an integer k, return an array of the values of all nodes that have a distance k from the target node. Sort the result in ascending order.`,
    inputFormat: `First line: level-order tree values (-1 for null).
Second line: target node value.
Third line: integer K.`,
    outputFormat: `Print all node values at distance K sorted ascending separated by spaces (or -1 if none).`,
    constraints: ['The number of nodes in the tree is in range [1, 500].', '0 <= Node.val <= 500', 'All values Node.val are unique.', '0 <= k <= 1000'],
    examples: [
      {
        input: '3 5 1 6 2 0 8 -1 -1 7 4\n5\n2',
        displayInput: 'root = [3,5,1,6,2,0,8,null,null,7,4], target = 5, k = 2',
        output: '1 4 7',
        displayOutput: '[1, 4, 7]',
        explanation: 'Nodes at distance 2 from node 5 are 7, 4, and 1.'
      },
      {
        input: '1\n1\n3',
        displayInput: 'root = [1], target = 1, k = 3',
        output: '-1',
        displayOutput: '[]',
        explanation: 'No nodes at distance 3.'
      },
      {
        input: '1 2 3\n1\n1',
        displayInput: 'root = [1,2,3], target = 1, k = 1',
        output: '2 3',
        displayOutput: '[2, 3]',
        explanation: 'Direct children of 1 are 2 and 3.'
      }
    ],
    hints: [
      'Annotate each node with its parent pointer using DFS to convert tree to undirected graph.',
      'Find target node in tree.',
      'Perform BFS from target expanding to left child, right child, and parent up to distance k.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const arr = lines[0].trim().split(/\s+/).map(Number);
      const targetVal = parseInt(lines[1], 10);
      const k = parseInt(lines[2], 10);
      const root = buildTree(arr);

      const parentMap = new Map();
      let targetNode = null;

      const mapParents = (node, p) => {
        if (!node) return;
        if (node.val === targetVal) targetNode = node;
        if (p) parentMap.set(node, p);
        mapParents(node.left, node);
        mapParents(node.right, node);
      };
      mapParents(root, null);

      if (!targetNode) return '-1';

      const visited = new Set([targetNode]);
      const queue = [targetNode];
      let dist = 0;

      while (queue.length > 0 && dist < k) {
        const sz = queue.length;
        for (let i = 0; i < sz; i++) {
          const curr = queue.shift();
          for (const neighbor of [curr.left, curr.right, parentMap.get(curr)]) {
            if (neighbor && !visited.has(neighbor)) {
              visited.add(neighbor);
              queue.push(neighbor);
            }
          }
        }
        dist++;
      }

      if (queue.length === 0 || dist !== k) return '-1';
      const res = queue.map((n) => n.val).sort((a, b) => a - b);
      return res.join(' ');
    },
    hiddenTestCases: [
      { input: '1 2\n2\n1', expected: '1' },
      { input: '1 2 3 4 5\n2\n1', expected: '1 4 5' }
    ]
  }),

  // 17. Binary Tree Maximum Path Sum (Hard)
  createCanonicalProblem({
    problemId: 'dsa_trees_17',
    topicId: 'trees',
    order: 17,
    title: 'Binary Tree Maximum Path Sum',
    difficulty: 'Hard',
    tags: ['Tree', 'Depth-First Search', 'Dynamic Programming', 'Binary Tree'],
    statement: `A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root.

The path sum of a path is the sum of the node's values in the path.

Given the root of a binary tree, return the maximum path sum of any non-empty path.`,
    inputFormat: `First line: integer N.
Second line: N space-separated level-order integers (-1 for null).`,
    outputFormat: `Print the maximum path sum.`,
    constraints: ['The number of nodes in the tree is in range [1, 3 * 10^4].', '-1000 <= Node.val <= 1000'],
    examples: [
      {
        input: '3\n1 2 3',
        displayInput: 'root = [1,2,3]',
        output: '6',
        displayOutput: '6',
        explanation: 'Path 2 -> 1 -> 3 gives maximum sum 6.'
      },
      {
        input: '5\n-10 9 20 -1 -1 15 7',
        displayInput: 'root = [-10,9,20,null,null,15,7]',
        output: '42',
        displayOutput: '42',
        explanation: 'Path 15 -> 20 -> 7 gives maximum sum 42.'
      },
      {
        input: '1\n-3',
        displayInput: 'root = [-3]',
        output: '-3',
        displayOutput: '-3',
        explanation: 'Only single node with value -3.'
      }
    ],
    hints: [
      'For each node, compute the maximum branch gain from its left and right subtrees: max(0, maxGain(child)).',
      'Update the global maximum path sum with node.val + leftGain + rightGain.',
      'Return node.val + max(leftGain, rightGain) to the caller.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n === 0 || !lines[1]) return '0';
      const arr = lines[1].trim().split(/\s+/).map(Number);
      const root = buildTree(arr);

      let maxSum = -Infinity;
      const maxGain = (node) => {
        if (!node) return 0;
        const leftGain = Math.max(0, maxGain(node.left));
        const rightGain = Math.max(0, maxGain(node.right));
        maxSum = Math.max(maxSum, node.val + leftGain + rightGain);
        return node.val + Math.max(leftGain, rightGain);
      };
      maxGain(root);
      return maxSum.toString();
    },
    hiddenTestCases: [
      { input: '2\n2 -1', expected: '2' },
      { input: '3\n-2 -1 -3', expected: '-1' },
      { input: '4\n5 4 8 -1', expected: '17' }
    ]
  }),

  // 18. Serialize and Deserialize Binary Tree (Hard)
  createCanonicalProblem({
    problemId: 'dsa_trees_18',
    topicId: 'trees',
    order: 18,
    title: 'Serialize and Deserialize Binary Tree',
    difficulty: 'Hard',
    tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Design', 'String', 'Binary Tree'],
    statement: `Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.

Design an algorithm to serialize and deserialize a binary tree. Return the reconstructed tree level-order values separated by spaces.`,
    inputFormat: `First line: level-order tree values (-1 for null).`,
    outputFormat: `Print reconstructed tree level-order values separated by spaces.`,
    constraints: ['The number of nodes in the tree is in range [0, 10^4].', '-1000 <= Node.val <= 1000'],
    examples: [
      {
        input: '1 2 3 -1 -1 4 5',
        displayInput: 'root = [1,2,3,null,null,4,5]',
        output: '1 2 3 4 5',
        displayOutput: '[1,2,3,4,5]',
        explanation: 'Serialized and restored back to exact same structure.'
      },
      {
        input: '1',
        displayInput: 'root = [1]',
        output: '1',
        displayOutput: '[1]',
        explanation: 'Single node tree roundtrip.'
      },
      {
        input: '-1',
        displayInput: 'root = []',
        output: '',
        displayOutput: '[]',
        explanation: 'Empty tree roundtrip.'
      }
    ],
    hints: [
      'Use preorder traversal with a sentinel (e.g., "#" or "null") for null nodes.',
      'Deserialization reads tokens from left to right: if "#", return null; otherwise create node and recurse for left and right.',
      'Verify roundtrip reconstruction.'
    ],
    solveFunction: (input) => {
      const line = input.trim();
      if (!line || line === '-1') return '';
      const arr = line.split(/\s+/).map(Number);
      const root = buildTree(arr);
      if (!root) return '';

      // serialize
      const tokens = [];
      const ser = (node) => {
        if (!node) {
          tokens.push('#');
          return;
        }
        tokens.push(node.val.toString());
        ser(node.left);
        ser(node.right);
      };
      ser(root);

      // deserialize
      let idx = 0;
      const deser = () => {
        if (idx >= tokens.length || tokens[idx] === '#') {
          idx++;
          return null;
        }
        const val = parseInt(tokens[idx++], 10);
        const node = { val, left: null, right: null };
        node.left = deser();
        node.right = deser();
        return node;
      };
      const restored = deser();

      // level-order output of restored
      const queue = [restored];
      const res = [];
      while (queue.length > 0) {
        const curr = queue.shift();
        res.push(curr.val);
        if (curr.left) queue.push(curr.left);
        if (curr.right) queue.push(curr.right);
      }
      return res.join(' ');
    },
    hiddenTestCases: [
      { input: '1 2', expected: '1 2' },
      { input: '1 -1 2', expected: '1 2' },
      { input: '1 2 3', expected: '1 2 3' }
    ]
  }),

  // 19. Binary Tree Cameras (Hard)
  createCanonicalProblem({
    problemId: 'dsa_trees_19',
    topicId: 'trees',
    order: 19,
    title: 'Binary Tree Cameras',
    difficulty: 'Hard',
    tags: ['Tree', 'Depth-First Search', 'Dynamic Programming', 'Binary Tree'],
    statement: `You are given the root of a binary tree. We install cameras on the tree nodes where each camera at a node can monitor its parent, itself, and its immediate children.

Return the minimum number of cameras needed to monitor all nodes of the tree.`,
    inputFormat: `First line: level-order tree values (-1 for null).`,
    outputFormat: `Print the minimum number of cameras.`,
    constraints: ['The number of nodes in the tree is in range [1, 1000].', 'Node.val == 0'],
    examples: [
      {
        input: '0 0 -1 0 0',
        displayInput: 'root = [0,0,null,0,0]',
        output: '1',
        displayOutput: '1',
        explanation: 'One camera placed at parent node monitors all nodes.'
      },
      {
        input: '0 0 -1 0 -1 0 -1 -1 0',
        displayInput: 'root = [0,0,null,0,null,0,null,null,0]',
        output: '2',
        displayOutput: '2',
        explanation: '2 cameras needed to monitor the chain.'
      },
      {
        input: '0',
        displayInput: 'root = [0]',
        output: '1',
        displayOutput: '1',
        explanation: 'Single root requires 1 camera.'
      }
    ],
    hints: [
      'Use greedy post-order DFS.',
      'Return states: 0 = node is not covered, 1 = node has camera, 2 = node is covered without camera.',
      'If any child is uncovered (0), current node MUST place a camera (return 1).',
      'If any child has a camera (1), current node is covered (return 2).',
      'If root is uncovered at the end, add one more camera.'
    ],
    solveFunction: (input) => {
      const line = input.trim();
      if (!line) return '0';
      const arr = line.split(/\s+/).map(Number);
      const root = buildTree(arr);

      let cameras = 0;
      // 0: uncovered, 1: has camera, 2: covered
      const dfs = (node) => {
        if (!node) return 2;
        const left = dfs(node.left);
        const right = dfs(node.right);

        if (left === 0 || right === 0) {
          cameras++;
          return 1;
        }
        if (left === 1 || right === 1) {
          return 2;
        }
        return 0;
      };

      if (dfs(root) === 0) {
        cameras++;
      }
      return cameras.toString();
    },
    hiddenTestCases: [
      { input: '0 0 0', expected: '1' },
      { input: '0 0 -1 0 -1', expected: '1' },
      { input: '0 -1 0 -1 0', expected: '1' }
    ]
  }),

  // 20. Vertical Order Traversal of a Binary Tree (Hard)
  createCanonicalProblem({
    problemId: 'dsa_trees_20',
    topicId: 'trees',
    order: 20,
    title: 'Vertical Order Traversal of a Binary Tree',
    difficulty: 'Hard',
    tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Hash Table', 'Binary Tree'],
    statement: `Given the root of a binary tree, calculate the vertical order traversal of the binary tree.

For each node at position (row, col), its left and right children will be at positions (row + 1, col - 1) and (row + 1, col + 1) respectively. The root of the tree is at (0, 0).

The vertical order traversal is a list of top-to-bottom orderings for each column index starting from the leftmost column and ending on the rightmost column. There may be multiple nodes in the same row and same column. In such a case, sort these nodes by their values. Print each column on a new line.`,
    inputFormat: `First line: level-order tree values (-1 for null).`,
    outputFormat: `Print each vertical column on a new line with space-separated values.`,
    constraints: ['The number of nodes in the tree is in range [1, 1000].', '0 <= Node.val <= 1000'],
    examples: [
      {
        input: '3 9 20 -1 -1 15 7',
        displayInput: 'root = [3,9,20,null,null,15,7]',
        output: '9\n3 15\n20\n7',
        displayOutput: '[[9],[3,15],[20],[7]]',
        explanation: 'Column -1: 9; Column 0: 3, 15; Column 1: 20; Column 2: 7.'
      },
      {
        input: '1 2 3 4 5 6 7',
        displayInput: 'root = [1,2,3,4,5,6,7]',
        output: '4\n2\n1 5 6\n3\n7',
        displayOutput: '[[4],[2],[1,5,6],[3],[7]]',
        explanation: 'Nodes at col 0 are 1, 5, 6 (1 at row 0, 5 and 6 at row 2 sorted by value).'
      },
      {
        input: '1',
        displayInput: 'root = [1]',
        output: '1',
        displayOutput: '[[1]]',
        explanation: 'Single root node.'
      }
    ],
    hints: [
      'Annotate each node with its coordinates (col, row, val).',
      'Use BFS or DFS to collect tuples [col, row, val].',
      'Sort tuples primarily by col asc, secondarily by row asc, and tertiarily by val asc.',
      'Group by column and format output.'
    ],
    solveFunction: (input) => {
      const line = input.trim();
      if (!line) return '';
      const arr = line.split(/\s+/).map(Number);
      const root = buildTree(arr);
      if (!root) return '';

      const nodes = [];
      const queue = [[root, 0, 0]]; // [node, row, col]

      while (queue.length > 0) {
        const [node, r, c] = queue.shift();
        nodes.push({ r, c, val: node.val });
        if (node.left) queue.push([node.left, r + 1, c - 1]);
        if (node.right) queue.push([node.right, r + 1, c + 1]);
      }

      nodes.sort((a, b) => {
        if (a.c !== b.c) return a.c - b.c;
        if (a.r !== b.r) return a.r - b.r;
        return a.val - b.val;
      });

      const cols = new Map();
      for (const item of nodes) {
        if (!cols.has(item.c)) cols.set(item.c, []);
        cols.get(item.c).push(item.val);
      }

      const res = [];
      for (const [, vals] of cols) {
        res.push(vals.join(' '));
      }
      return res.join('\n');
    },
    hiddenTestCases: [
      { input: '1 2 3', expected: '2\n1\n3' },
      { input: '1 2 -1 3', expected: '3\n2\n1' }
    ]
  })
];


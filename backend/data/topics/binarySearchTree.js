/**
 * Canonical DSA Placement Problems: BINARY SEARCH TREE (20 Questions)
 * 7 Easy, 9 Medium, 4 Hard
 */

import { createCanonicalProblem } from './topicProblemHelper.js';

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

export const BINARY_SEARCH_TREE_PROBLEMS = [
  // 1. Search in a Binary Search Tree (Easy)
  createCanonicalProblem({
    problemId: 'dsa_binary-search-tree_01',
    topicId: 'binary-search-tree',
    order: 1,
    title: 'Search in a Binary Search Tree',
    difficulty: 'Easy',
    tags: ['Tree', 'Binary Search Tree', 'Binary Tree'],
    statement: `You are given the root of a binary search tree (BST) and an integer val.

Find the node in the BST that the node's value equals val and return the subtree rooted with that node. If such a node does not exist, return null.`,
    inputFormat: `First line: level-order BST values (-1 for null).
Second line: target integer val.`,
    outputFormat: `Print the level-order traversal of the subtree rooted at target val, or 'null' if not found.`,
    constraints: ['The number of nodes in the tree is in range [1, 5000].', '1 <= Node.val <= 10^7', 'root is a valid BST.'],
    examples: [
      {
        input: '4 2 7 1 3\n2',
        displayInput: 'root = [4,2,7,1,3], val = 2',
        output: '2 1 3',
        displayOutput: '[2,1,3]',
        explanation: 'Subtree rooted at 2 is [2, 1, 3].'
      },
      {
        input: '4 2 7 1 3\n5',
        displayInput: 'root = [4,2,7,1,3], val = 5',
        output: 'null',
        displayOutput: 'null',
        explanation: '5 does not exist in the BST.'
      },
      {
        input: '1\n1',
        displayInput: 'root = [1], val = 1',
        output: '1',
        displayOutput: '[1]',
        explanation: 'Target 1 found at root.'
      }
    ],
    hints: [
      'In a BST, values in left subtree are smaller than root, and values in right subtree are larger.',
      'If val == root.val, return root.',
      'If val < root.val, search left; else search right.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const arr = lines[0].trim().split(/\s+/).map(Number);
      const target = parseInt(lines[1], 10);
      const root = buildTree(arr);

      let curr = root;
      while (curr && curr.val !== target) {
        if (target < curr.val) curr = curr.left;
        else curr = curr.right;
      }
      if (!curr) return 'null';

      const queue = [curr];
      const res = [];
      while (queue.length > 0) {
        const node = queue.shift();
        res.push(node.val);
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
      }
      return res.join(' ');
    },
    hiddenTestCases: [
      { input: '10 5 15\n15', expected: '15' },
      { input: '10 5 15\n20', expected: 'null' }
    ]
  }),

  // 2. Range Sum of BST (Easy)
  createCanonicalProblem({
    problemId: 'dsa_binary-search-tree_02',
    topicId: 'binary-search-tree',
    order: 2,
    title: 'Range Sum of BST',
    difficulty: 'Easy',
    tags: ['Tree', 'Depth-First Search', 'Binary Search Tree', 'Binary Tree'],
    statement: `Given the root node of a binary search tree and two integers low and high, return the sum of values of all nodes with a value in the inclusive range [low, high].`,
    inputFormat: `First line: level-order BST values (-1 for null).
Second line: two integers low and high.`,
    outputFormat: `Print the range sum.`,
    constraints: ['The number of nodes in the tree is in range [1, 2 * 10^4].', '1 <= Node.val <= 10^5', '1 <= low <= high <= 10^5'],
    examples: [
      {
        input: '10 5 15 3 7 -1 18\n7 15',
        displayInput: 'root = [10,5,15,3,7,null,18], low = 7, high = 15',
        output: '32',
        displayOutput: '32',
        explanation: 'Nodes 7, 10, and 15 are in range [7, 15]. Sum = 7 + 10 + 15 = 32.'
      },
      {
        input: '10 5 15 3 7 13 18 1 -1 6\n6 10',
        displayInput: 'root = [10,5,15,3,7,13,18,1,null,6], low = 6, high = 10',
        output: '23',
        displayOutput: '23',
        explanation: 'Nodes 6, 7, and 10 are in range. Sum = 6 + 7 + 10 = 23.'
      },
      {
        input: '5\n5 5',
        displayInput: 'root = [5], low = 5, high = 5',
        output: '5',
        displayOutput: '5',
        explanation: 'Only node 5 is in range.'
      }
    ],
    hints: [
      'If node is null, return 0.',
      'If node.val is within [low, high], include node.val and recurse on both children.',
      'If node.val < low, only the right subtree can have values in range.',
      'If node.val > high, only the left subtree can have values in range.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const arr = lines[0].trim().split(/\s+/).map(Number);
      const [low, high] = lines[1].trim().split(/\s+/).map(Number);
      const root = buildTree(arr);

      const rangeSum = (node) => {
        if (!node) return 0;
        let sum = 0;
        if (node.val >= low && node.val <= high) sum += node.val;
        if (node.val > low) sum += rangeSum(node.left);
        if (node.val < high) sum += rangeSum(node.right);
        return sum;
      };
      return rangeSum(root).toString();
    },
    hiddenTestCases: [
      { input: '10 5 15\n1 4', expected: '0' },
      { input: '10 5 15\n16 20', expected: '0' },
      { input: '10 5 15\n5 15', expected: '30' }
    ]
  }),

  // 3. Minimum Absolute Difference in BST (Easy)
  createCanonicalProblem({
    problemId: 'dsa_binary-search-tree_03',
    topicId: 'binary-search-tree',
    order: 3,
    title: 'Minimum Absolute Difference in BST',
    difficulty: 'Easy',
    tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Search Tree', 'Binary Tree'],
    statement: `Given the root of a Binary Search Tree (BST), return the minimum absolute difference between the values of any two different nodes in the tree.`,
    inputFormat: `First line: level-order BST values (-1 for null).`,
    outputFormat: `Print the minimum absolute difference.`,
    constraints: ['The number of nodes in the tree is in range [2, 10^4].', '0 <= Node.val <= 10^5'],
    examples: [
      {
        input: '4 2 6 1 3',
        displayInput: 'root = [4,2,6,1,3]',
        output: '1',
        displayOutput: '1',
        explanation: 'Min difference is 1 (e.g., between 1 and 2 or 2 and 3).'
      },
      {
        input: '1 0 48 -1 -1 12 49',
        displayInput: 'root = [1,0,48,null,null,12,49]',
        output: '1',
        displayOutput: '1',
        explanation: 'Min difference is 1 (between 48 and 49).'
      },
      {
        input: '5 1 7',
        displayInput: 'root = [5,1,7]',
        output: '2',
        displayOutput: '2',
        explanation: 'Differences are 4 and 2. Minimum is 2.'
      }
    ],
    hints: [
      'Inorder traversal of a BST yields values in ascending order.',
      'The minimum absolute difference must occur between two adjacent values in the inorder sequence.',
      'Maintain prevNode and update minDiff = min(minDiff, curr.val - prevNode.val).'
    ],
    solveFunction: (input) => {
      const arr = input.trim().split(/\s+/).map(Number);
      const root = buildTree(arr);

      let prev = null;
      let minDiff = Infinity;

      const inorder = (node) => {
        if (!node) return;
        inorder(node.left);
        if (prev !== null) {
          minDiff = Math.min(minDiff, node.val - prev);
        }
        prev = node.val;
        inorder(node.right);
      };
      inorder(root);
      return minDiff.toString();
    },
    hiddenTestCases: [
      { input: '10 1 20', expected: '9' },
      { input: '236 104 701 -1 227 -1 911', expected: '9' },
      { input: '2 1 3', expected: '1' }
    ]
  }),

  // 4. Lowest Common Ancestor of a BST (Easy)
  createCanonicalProblem({
    problemId: 'dsa_binary-search-tree_04',
    topicId: 'binary-search-tree',
    order: 4,
    title: 'Lowest Common Ancestor of a BST',
    difficulty: 'Easy',
    tags: ['Tree', 'Depth-First Search', 'Binary Search Tree', 'Binary Tree'],
    statement: `Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST p and q.

According to the definition of LCA: "The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself)."`,
    inputFormat: `First line: level-order BST values (-1 for null).
Second line: two space-separated node values p and q.`,
    outputFormat: `Print the value of the LCA node.`,
    constraints: ['All Node.val are unique.', 'p != q', 'p and q will exist in the BST.'],
    examples: [
      {
        input: '6 2 8 0 4 7 9 -1 -1 3 5\n2 8',
        displayInput: 'root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8',
        output: '6',
        displayOutput: '6',
        explanation: 'LCA of 2 and 8 is 6.'
      },
      {
        input: '6 2 8 0 4 7 9 -1 -1 3 5\n2 4',
        displayInput: 'root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4',
        output: '2',
        displayOutput: '2',
        explanation: 'LCA of 2 and 4 is 2.'
      },
      {
        input: '2 1\n2 1',
        displayInput: 'root = [2,1], p = 2, q = 1',
        output: '2',
        displayOutput: '2',
        explanation: 'LCA of 2 and 1 is 2.'
      }
    ],
    hints: [
      'Exploit BST property: if both p and q values are smaller than root.val, LCA is in left subtree.',
      'If both p and q values are greater than root.val, LCA is in right subtree.',
      'Otherwise, the split occurs at current root, which is the LCA!'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const arr = lines[0].trim().split(/\s+/).map(Number);
      const [p, q] = lines[1].trim().split(/\s+/).map(Number);
      const root = buildTree(arr);

      let curr = root;
      while (curr) {
        if (p < curr.val && q < curr.val) curr = curr.left;
        else if (p > curr.val && q > curr.val) curr = curr.right;
        else return curr.val.toString();
      }
      return '';
    },
    hiddenTestCases: [
      { input: '5 3 6 2 4\n2 4', expected: '3' },
      { input: '5 3 6 2 4\n2 6', expected: '5' }
    ]
  }),

  // 5. Convert Sorted Array to Binary Search Tree (Easy)
  createCanonicalProblem({
    problemId: 'dsa_binary-search-tree_05',
    topicId: 'binary-search-tree',
    order: 5,
    title: 'Convert Sorted Array to Binary Search Tree',
    difficulty: 'Easy',
    tags: ['Array', 'Divide and Conquer', 'Tree', 'Binary Search Tree', 'Binary Tree'],
    statement: `Given an integer array nums where the elements are sorted in ascending order, convert it to a height-balanced binary search tree. Return its preorder traversal.`,
    inputFormat: `First line: integer N.
Second line: N space-separated sorted integers.`,
    outputFormat: `Print preorder traversal of the balanced BST separated by spaces.`,
    constraints: ['1 <= nums.length <= 10^4', '-10^4 <= nums[i] <= 10^4', 'nums is sorted in strictly increasing order.'],
    examples: [
      {
        input: '5\n-10 -3 0 5 9',
        displayInput: 'nums = [-10, -3, 0, 5, 9]',
        output: '0 -3 -10 9 5',
        displayOutput: '[0, -3, -10, 9, 5]',
        explanation: '0 is root; left subtree [-10, -3], right subtree [5, 9].'
      },
      {
        input: '2\n1 3',
        displayInput: 'nums = [1, 3]',
        output: '3 1',
        displayOutput: '[3, 1]',
        explanation: 'Midpoint chosen as root.'
      },
      {
        input: '1\n42',
        displayInput: 'nums = [42]',
        output: '42',
        displayOutput: '[42]',
        explanation: 'Single element is root.'
      }
    ],
    hints: [
      'Choose the middle element as root: mid = Math.floor((left + right) / 2).',
      'Recursively construct left child from nums[left ... mid - 1].',
      'Recursively construct right child from nums[mid + 1 ... right].'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n === 0) return '';
      const nums = lines[1].trim().split(/\s+/).map(Number);

      const buildBST = (l, r) => {
        if (l > r) return null;
        // choose right mid if even length for standard balanced tree
        const mid = Math.floor((l + r + 1) / 2);
        const node = { val: nums[mid], left: null, right: null };
        node.left = buildBST(l, mid - 1);
        node.right = buildBST(mid + 1, r);
        return node;
      };
      const root = buildBST(0, n - 1);

      const pre = [];
      const preorder = (node) => {
        if (!node) return;
        pre.push(node.val);
        preorder(node.left);
        preorder(node.right);
      };
      preorder(root);
      return pre.join(' ');
    },
    hiddenTestCases: [
      { input: '3\n1 2 3', expected: '2 1 3' },
      { input: '4\n1 2 3 4', expected: '3 2 1 4' }
    ]
  }),

  // 6. Two Sum IV - Input is a BST (Easy)
  createCanonicalProblem({
    problemId: 'dsa_binary-search-tree_06',
    topicId: 'binary-search-tree',
    order: 6,
    title: 'Two Sum IV - Input is a BST',
    difficulty: 'Easy',
    tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Search Tree', 'Hash Table', 'Two Pointers', 'Binary Tree'],
    statement: `Given the root of a binary search tree and an integer k, return true if there exist two elements in the BST such that their sum is equal to k, or false otherwise.`,
    inputFormat: `First line: level-order BST values (-1 for null).
Second line: target integer K.`,
    outputFormat: `Print 'true' if such a pair exists, else 'false'.`,
    constraints: ['The number of nodes in the tree is in range [1, 10^4].', '-10^4 <= Node.val <= 10^4', '-10^5 <= k <= 10^5'],
    examples: [
      {
        input: '5 3 6 2 4 -1 7\n9',
        displayInput: 'root = [5,3,6,2,4,null,7], k = 9',
        output: 'true',
        displayOutput: 'true',
        explanation: 'Nodes 2 and 7 sum to 9 (also 4 and 5).'
      },
      {
        input: '5 3 6 2 4 -1 7\n28',
        displayInput: 'root = [5,3,6,2,4,null,7], k = 28',
        output: 'false',
        displayOutput: 'false',
        explanation: 'No two nodes sum to 28.'
      },
      {
        input: '2 1 3\n4',
        displayInput: 'root = [2,1,3], k = 4',
        output: 'true',
        displayOutput: 'true',
        explanation: 'Nodes 1 and 3 sum to 4.'
      }
    ],
    hints: [
      'Traverse the BST using DFS or BFS while storing visited node values in a Set.',
      'For each node, check if set has (k - node.val).',
      'If yes, return true; else add node.val to set.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const arr = lines[0].trim().split(/\s+/).map(Number);
      const k = parseInt(lines[1], 10);
      const root = buildTree(arr);

      const set = new Set();
      let found = false;

      const dfs = (node) => {
        if (!node || found) return;
        if (set.has(k - node.val)) {
          found = true;
          return;
        }
        set.add(node.val);
        dfs(node.left);
        dfs(node.right);
      };
      dfs(root);
      return found ? 'true' : 'false';
    },
    hiddenTestCases: [
      { input: '1\n2', expected: 'false' },
      { input: '2 1 3\n5', expected: 'true' },
      { input: '2 1 3\n6', expected: 'false' }
    ]
  }),

  // 7. Inorder Successor in BST (Easy)
  createCanonicalProblem({
    problemId: 'dsa_binary-search-tree_07',
    topicId: 'binary-search-tree',
    order: 7,
    title: 'Inorder Successor in BST',
    difficulty: 'Easy',
    tags: ['Tree', 'Depth-First Search', 'Binary Search Tree', 'Binary Tree'],
    statement: `Given the root of a binary search tree and a node value p in it, return the in-order successor of that node in the BST. If the given node has no in-order successor in the tree, return -1.

The successor of a node p is the node with the smallest key greater than p.val.`,
    inputFormat: `First line: level-order BST values (-1 for null).
Second line: target node value P.`,
    outputFormat: `Print the successor value, or -1.`,
    constraints: ['The number of nodes in the tree is in range [1, 10^4].', '-10^5 <= Node.val <= 10^5', 'All Node.val are unique.'],
    examples: [
      {
        input: '2 1 3\n1',
        displayInput: 'root = [2,1,3], p = 1',
        output: '2',
        displayOutput: '2',
        explanation: 'Inorder is [1, 2, 3], successor of 1 is 2.'
      },
      {
        input: '5 3 6 2 4 -1 -1 1\n6',
        displayInput: 'root = [5,3,6,2,4,null,null,1], p = 6',
        output: '-1',
        displayOutput: '-1',
        explanation: '6 is the largest node, so it has no successor.'
      },
      {
        input: '5 3 6 2 4 -1 -1 1\n4',
        displayInput: 'root = [5,3,6,2,4,null,null,1], p = 4',
        output: '5',
        displayOutput: '5',
        explanation: 'Successor of 4 is 5.'
      }
    ],
    hints: [
      'Start from root.',
      'If root.val <= p, successor must be in right subtree.',
      'If root.val > p, root could be the successor, so record successor = root and search in left subtree.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const arr = lines[0].trim().split(/\s+/).map(Number);
      const p = parseInt(lines[1], 10);
      const root = buildTree(arr);

      let successor = -1;
      let curr = root;
      while (curr) {
        if (curr.val > p) {
          successor = curr.val;
          curr = curr.left;
        } else {
          curr = curr.right;
        }
      }
      return successor.toString();
    },
    hiddenTestCases: [
      { input: '2 1 3\n2', expected: '3' },
      { input: '2 1 3\n3', expected: '-1' },
      { input: '10 5 15\n5', expected: '10' }
    ]
  }),

  // 8. Validate Binary Search Tree (Medium)
  createCanonicalProblem({
    problemId: 'dsa_binary-search-tree_08',
    topicId: 'binary-search-tree',
    order: 8,
    title: 'Validate Binary Search Tree',
    difficulty: 'Medium',
    tags: ['Tree', 'Depth-First Search', 'Binary Search Tree', 'Binary Tree'],
    statement: `Given the root of a binary tree, determine if it is a valid binary search tree (BST).

A valid BST is defined as follows:
- The left subtree of a node contains only nodes with keys strictly less than the node's key.
- The right subtree of a node contains only nodes with keys strictly greater than the node's key.
- Both the left and right subtrees must also be binary search trees.`,
    inputFormat: `First line: level-order binary tree values (-1 for null).`,
    outputFormat: `Print 'true' if valid BST, else 'false'.`,
    constraints: ['The number of nodes in the tree is in range [1, 10^4].', '-2^31 <= Node.val <= 2^31 - 1'],
    examples: [
      {
        input: '2 1 3',
        displayInput: 'root = [2,1,3]',
        output: 'true',
        displayOutput: 'true',
        explanation: 'Valid BST.'
      },
      {
        input: '5 1 4 -1 -1 3 6',
        displayInput: 'root = [5,1,4,null,null,3,6]',
        output: 'false',
        displayOutput: 'false',
        explanation: 'Root value is 5 but its right child value is 4 (less than 5).'
      },
      {
        input: '1',
        displayInput: 'root = [1]',
        output: 'true',
        displayOutput: 'true',
        explanation: 'Single node is a valid BST.'
      }
    ],
    hints: [
      'Do not just compare a node with its immediate children.',
      'Pass valid range bounds [minVal, maxVal] down the recursion tree.',
      'For left child: range is [minVal, node.val]. For right child: range is [node.val, maxVal].'
    ],
    solveFunction: (input) => {
      const arr = input.trim().split(/\s+/).map(Number);
      const root = buildTree(arr);

      const isValid = (node, min, max) => {
        if (!node) return true;
        if (node.val <= min || node.val >= max) return false;
        return isValid(node.left, min, node.val) && isValid(node.right, node.val, max);
      };
      return isValid(root, -Infinity, Infinity) ? 'true' : 'false';
    },
    hiddenTestCases: [
      { input: '2 2 2', expected: 'false' },
      { input: '10 5 15 -1 -1 6 20', expected: 'false' },
      { input: '10 5 15 2 7 12 20', expected: 'true' }
    ]
  }),

  // 9. Kth Smallest Element in a BST (Medium)
  createCanonicalProblem({
    problemId: 'dsa_binary-search-tree_09',
    topicId: 'binary-search-tree',
    order: 9,
    title: 'Kth Smallest Element in a BST',
    difficulty: 'Medium',
    tags: ['Tree', 'Depth-First Search', 'Binary Search Tree', 'Binary Tree'],
    statement: `Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.`,
    inputFormat: `First line: level-order BST values (-1 for null).
Second line: integer K.`,
    outputFormat: `Print the Kth smallest element.`,
    constraints: ['The number of nodes in the tree is n.', '1 <= k <= n <= 10^4', '0 <= Node.val <= 10^4'],
    examples: [
      {
        input: '3 1 4 -1 2\n1',
        displayInput: 'root = [3,1,4,null,2], k = 1',
        output: '1',
        displayOutput: '1',
        explanation: 'Smallest element is 1.'
      },
      {
        input: '5 3 6 2 4 -1 -1 1\n3',
        displayInput: 'root = [5,3,6,2,4,null,null,1], k = 3',
        output: '3',
        displayOutput: '3',
        explanation: 'Sorted order is [1, 2, 3, 4, 5, 6]. 3rd is 3.'
      },
      {
        input: '1\n1',
        displayInput: 'root = [1], k = 1',
        output: '1',
        displayOutput: '1',
        explanation: 'Only element is 1.'
      }
    ],
    hints: [
      'Inorder traversal of BST visits nodes in strictly ascending order.',
      'Perform iterative or recursive inorder traversal, decrementing k at each node.',
      'When k reaches 0, return the current node value.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const arr = lines[0].trim().split(/\s+/).map(Number);
      let k = parseInt(lines[1], 10);
      const root = buildTree(arr);

      let result = null;
      const inorder = (node) => {
        if (!node || result !== null) return;
        inorder(node.left);
        k--;
        if (k === 0) {
          result = node.val;
          return;
        }
        inorder(node.right);
      };
      inorder(root);
      return result !== null ? result.toString() : '';
    },
    hiddenTestCases: [
      { input: '2 1 3\n2', expected: '2' },
      { input: '2 1 3\n3', expected: '3' },
      { input: '4 2 5 1 3\n4', expected: '4' }
    ]
  }),

  // 10. Insert into a Binary Search Tree (Medium)
  createCanonicalProblem({
    problemId: 'dsa_binary-search-tree_10',
    topicId: 'binary-search-tree',
    order: 10,
    title: 'Insert into a Binary Search Tree',
    difficulty: 'Medium',
    tags: ['Tree', 'Binary Search Tree', 'Binary Tree'],
    statement: `You are given the root node of a binary search tree (BST) and a value to insert into the tree. The value does not exist in the original BST.

Insert the value into the BST and return the level-order traversal of the BST.`,
    inputFormat: `First line: level-order BST values (-1 for null).
Second line: integer val to insert.`,
    outputFormat: `Print the level-order traversal of the updated BST separated by spaces.`,
    constraints: ['The number of nodes in the tree is in range [0, 10^4].', '-10^8 <= Node.val <= 10^8', 'val does not exist in BST.'],
    examples: [
      {
        input: '4 2 7 1 3\n5',
        displayInput: 'root = [4,2,7,1,3], val = 5',
        output: '4 2 7 1 3 5',
        displayOutput: '[4,2,7,1,3,5]',
        explanation: '5 is inserted as the left child of 7.'
      },
      {
        input: '40 20 60 10 30 50 70\n25',
        displayInput: 'root = [40,20,60,10,30,50,70], val = 25',
        output: '40 20 60 10 30 50 70 25',
        displayOutput: '[40,20,60,10,30,50,70,null,null,25]',
        explanation: '25 inserted under 30.'
      },
      {
        input: '-1\n5',
        displayInput: 'root = [], val = 5',
        output: '5',
        displayOutput: '[5]',
        explanation: 'Inserted into empty tree.'
      }
    ],
    hints: [
      'If root is null, return new node with val.',
      'If val < root.val, recurse on root.left.',
      'If val > root.val, recurse on root.right.',
      'Return root after insertion.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const arr = lines[0].trim().split(/\s+/).map(Number);
      const val = parseInt(lines[1], 10);
      let root = buildTree(arr);

      const insert = (node, v) => {
        if (!node) return { val: v, left: null, right: null };
        if (v < node.val) node.left = insert(node.left, v);
        else node.right = insert(node.right, v);
        return node;
      };
      root = insert(root, val);

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
      { input: '4 2 7\n1', expected: '4 2 7 1' },
      { input: '4 2 7\n8', expected: '4 2 7 8' }
    ]
  }),

  // 11. Delete Node in a BST (Medium)
  createCanonicalProblem({
    problemId: 'dsa_binary-search-tree_11',
    topicId: 'binary-search-tree',
    order: 11,
    title: 'Delete Node in a BST',
    difficulty: 'Medium',
    tags: ['Tree', 'Binary Search Tree', 'Binary Tree'],
    statement: `Given a root node reference of a BST and a key, delete the node with the given key in the BST. Return the level-order traversal of the BST.

Deleting can be divided into two stages:
1. Search for a node to remove.
2. If the node is found, delete the node.`,
    inputFormat: `First line: level-order BST values (-1 for null).
Second line: integer key to delete.`,
    outputFormat: `Print the level-order traversal of the modified BST separated by spaces.`,
    constraints: ['The number of nodes in the tree is in range [0, 10^4].', '-10^5 <= Node.val <= 10^5', 'Each node has a unique value.'],
    examples: [
      {
        input: '5 3 6 2 4 -1 7\n3',
        displayInput: 'root = [5,3,6,2,4,null,7], key = 3',
        output: '5 4 6 2 7',
        displayOutput: '[5,4,6,2,null,null,7]',
        explanation: 'Node 3 is deleted and replaced by its inorder successor (4).'
      },
      {
        input: '5 3 6 2 4 -1 7\n0',
        displayInput: 'root = [5,3,6,2,4,null,7], key = 0',
        output: '5 3 6 2 4 7',
        displayOutput: '[5,3,6,2,4,null,7]',
        explanation: '0 is not found, tree remains unchanged.'
      },
      {
        input: '1\n1',
        displayInput: 'root = [1], key = 1',
        output: '',
        displayOutput: '[]',
        explanation: 'Only node deleted, tree becomes empty.'
      }
    ],
    hints: [
      'If key < root.val, root.left = deleteNode(root.left, key).',
      'If key > root.val, root.right = deleteNode(root.right, key).',
      'If key == root.val: if only one child exists, return that child. If both exist, find minimum in right subtree (inorder successor), replace root.val with it, and delete successor from right subtree.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const arr = lines[0].trim().split(/\s+/).map(Number);
      const key = parseInt(lines[1], 10);
      let root = buildTree(arr);

      const findMin = (node) => {
        while (node.left) node = node.left;
        return node;
      };

      const del = (node, k) => {
        if (!node) return null;
        if (k < node.val) {
          node.left = del(node.left, k);
        } else if (k > node.val) {
          node.right = del(node.right, k);
        } else {
          if (!node.left) return node.right;
          if (!node.right) return node.left;
          const minRight = findMin(node.right);
          node.val = minRight.val;
          node.right = del(node.right, minRight.val);
        }
        return node;
      };

      root = del(root, key);
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
      { input: '2 1 3\n1', expected: '2 3' },
      { input: '2 1 3\n3', expected: '2 1' },
      { input: '2 1 3\n2', expected: '3 1' }
    ]
  }),

  // 12. Binary Search Tree Iterator (Medium)
  createCanonicalProblem({
    problemId: 'dsa_binary-search-tree_12',
    topicId: 'binary-search-tree',
    order: 12,
    title: 'Binary Search Tree Iterator',
    difficulty: 'Medium',
    tags: ['Stack', 'Tree', 'Design', 'Binary Search Tree', 'Binary Tree', 'Iterator'],
    statement: `Implement the BSTIterator class that represents an iterator over the in-order traversal of a binary search tree (BST):
- BSTIterator(TreeNode root) Initializes an object of the BSTIterator class. The root of the BST is given as part of the constructor. The pointer should be initialized to a non-existent number smaller than any element in the BST.
- boolean hasNext() Returns true if there exists a number in the traversal to the right of the pointer, otherwise returns false.
- int next() Moves the pointer to the right, then returns the number at the pointer.

Print all elements emitted by next() separated by spaces.`,
    inputFormat: `First line: level-order BST values (-1 for null).`,
    outputFormat: `Print all emitted values separated by spaces.`,
    constraints: ['The number of nodes in the tree is in range [1, 10^5].', '0 <= Node.val <= 10^6'],
    examples: [
      {
        input: '7 3 15 -1 -1 9 20',
        displayInput: 'root = [7,3,15,null,null,9,20]',
        output: '3 7 9 15 20',
        displayOutput: '[3, 7, 9, 15, 20]',
        explanation: 'Inorder emitted values are sorted in ascending order.'
      },
      {
        input: '1',
        displayInput: 'root = [1]',
        output: '1',
        displayOutput: '[1]',
        explanation: 'Only single element emitted.'
      },
      {
        input: '2 1 3',
        displayInput: 'root = [2,1,3]',
        output: '1 2 3',
        displayOutput: '[1, 2, 3]',
        explanation: 'Inorder is 1, 2, 3.'
      }
    ],
    hints: [
      'Simulate inorder traversal using an explicit stack of node pointers.',
      'Initialize by pushing root and all its left descendants onto stack.',
      'For next(): pop top node, push its right child and all its left descendants, and return popped node value.'
    ],
    solveFunction: (input) => {
      const arr = input.trim().split(/\s+/).map(Number);
      const root = buildTree(arr);

      const stack = [];
      const pushAllLeft = (node) => {
        while (node) {
          stack.push(node);
          node = node.left;
        }
      };
      pushAllLeft(root);

      const res = [];
      while (stack.length > 0) {
        const curr = stack.pop();
        res.push(curr.val);
        pushAllLeft(curr.right);
      }
      return res.join(' ');
    },
    hiddenTestCases: [
      { input: '5 3 6', expected: '3 5 6' },
      { input: '10 5 15 2 7', expected: '2 5 7 10 15' }
    ]
  }),

  // 13. Construct BST from Preorder Traversal (Medium)
  createCanonicalProblem({
    problemId: 'dsa_binary-search-tree_13',
    topicId: 'binary-search-tree',
    order: 13,
    title: 'Construct BST from Preorder Traversal',
    difficulty: 'Medium',
    tags: ['Array', 'Stack', 'Tree', 'Binary Search Tree', 'Monotonic Stack', 'Binary Tree'],
    statement: `Given an array of integers preorder, which represents the preorder traversal of a BST, construct the tree and return its postorder traversal.`,
    inputFormat: `First line: integer N.
Second line: N space-separated preorder integers.`,
    outputFormat: `Print the postorder traversal of the constructed BST separated by spaces.`,
    constraints: ['1 <= preorder.length <= 100', '1 <= preorder[i] <= 1000', 'All values of preorder are unique.'],
    examples: [
      {
        input: '6\n8 5 1 7 10 12',
        displayInput: 'preorder = [8,5,1,7,10,12]',
        output: '1 7 5 12 10 8',
        displayOutput: '[1, 7, 5, 12, 10, 8]',
        explanation: 'Postorder of constructed BST.'
      },
      {
        input: '2\n1 3',
        displayInput: 'preorder = [1,3]',
        output: '3 1',
        displayOutput: '[3, 1]',
        explanation: '1 is root, 3 is right child.'
      },
      {
        input: '1\n5',
        displayInput: 'preorder = [5]',
        output: '5',
        displayOutput: '[5]',
        explanation: 'Single node.'
      }
    ],
    hints: [
      'Maintain an index pointer idx = 0 and an upper bound bound.',
      'If idx == preorder.length or preorder[idx] > bound, return null.',
      'Create node with val = preorder[idx++]. Left child upper bound is node.val, right child upper bound is bound.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const n = parseInt(lines[0], 10);
      if (n === 0) return '';
      const preorder = lines[1].trim().split(/\s+/).map(Number);

      let idx = 0;
      const build = (bound) => {
        if (idx >= preorder.length || preorder[idx] > bound) return null;
        const root = { val: preorder[idx++], left: null, right: null };
        root.left = build(root.val);
        root.right = build(bound);
        return root;
      };
      const root = build(Infinity);

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
      { input: '3\n2 1 3', expected: '1 3 2' },
      { input: '3\n3 2 1', expected: '1 2 3' }
    ]
  }),

  // 14. Recover Binary Search Tree (Medium)
  createCanonicalProblem({
    problemId: 'dsa_binary-search-tree_14',
    topicId: 'binary-search-tree',
    order: 14,
    title: 'Recover Binary Search Tree',
    difficulty: 'Medium',
    tags: ['Tree', 'Depth-First Search', 'Binary Search Tree', 'Binary Tree'],
    statement: `You are given the root of a binary search tree (BST), where the values of exactly two nodes of the tree were swapped by mistake. Recover the tree without changing its structure.

Print the values of the two swapped nodes sorted in ascending order.`,
    inputFormat: `First line: level-order values of corrupted BST (-1 for null).`,
    outputFormat: `Print the values of the two swapped nodes sorted ascending separated by spaces.`,
    constraints: ['The number of nodes in the tree is in range [2, 1000].', '-2^31 <= Node.val <= 2^31 - 1'],
    examples: [
      {
        input: '1 3 -1 -1 2',
        displayInput: 'root = [1,3,null,null,2]',
        output: '1 3',
        displayOutput: '[1, 3]',
        explanation: '3 and 1 were swapped.'
      },
      {
        input: '3 1 4 -1 -1 2',
        displayInput: 'root = [3,1,4,null,null,2]',
        output: '2 3',
        displayOutput: '[2, 3]',
        explanation: '2 and 3 were swapped.'
      },
      {
        input: '2 3 1',
        displayInput: 'root = [2,3,1]',
        output: '1 3',
        displayOutput: '[1, 3]',
        explanation: '1 and 3 were swapped.'
      }
    ],
    hints: [
      'Inorder traversal of valid BST should be strictly increasing.',
      'Track prev node during inorder traversal.',
      'When prev.val > curr.val: first anomaly is prev; second anomaly is curr. If a second dip occurs later, update second to new curr.'
    ],
    solveFunction: (input) => {
      const arr = input.trim().split(/\s+/).map(Number);
      const root = buildTree(arr);

      let first = null;
      let second = null;
      let prev = null;

      const inorder = (node) => {
        if (!node) return;
        inorder(node.left);
        if (prev !== null && prev.val > node.val) {
          if (!first) first = prev;
          second = node;
        }
        prev = node;
        inorder(node.right);
      };
      inorder(root);

      const v1 = first ? first.val : 0;
      const v2 = second ? second.val : 0;
      return [Math.min(v1, v2), Math.max(v1, v2)].join(' ');
    },
    hiddenTestCases: [
      { input: '4 2 6 5 3', expected: '3 5' },
      { input: '3 2 1', expected: '1 3' }
    ]
  }),

  // 15. Trim a Binary Search Tree (Medium)
  createCanonicalProblem({
    problemId: 'dsa_binary-search-tree_15',
    topicId: 'binary-search-tree',
    order: 15,
    title: 'Trim a Binary Search Tree',
    difficulty: 'Medium',
    tags: ['Tree', 'Depth-First Search', 'Binary Search Tree', 'Binary Tree'],
    statement: `Given the root of a binary search tree and the lowest and highest boundaries as low and high, trim the tree so that all its elements lie in [low, high]. Trimming the tree should not change the relative structure of the elements that will remain in the tree (i.e., any node's descendant should remain a descendant). Return the level-order traversal of the trimmed tree.`,
    inputFormat: `First line: level-order BST values (-1 for null).
Second line: two integers low and high.`,
    outputFormat: `Print the level-order traversal of the trimmed tree separated by spaces.`,
    constraints: ['The number of nodes in the tree is in range [1, 10^4].', '0 <= Node.val <= 10^4', '0 <= low <= high <= 10^4'],
    examples: [
      {
        input: '1 0 2\n1 2',
        displayInput: 'root = [1,0,2], low = 1, high = 2',
        output: '1 2',
        displayOutput: '[1,null,2]',
        explanation: '0 is trimmed away.'
      },
      {
        input: '3 0 4 -1 2 -1 -1 1\n1 3',
        displayInput: 'root = [3,0,4,null,2,null,null,1], low = 1, high = 3',
        output: '3 2 1',
        displayOutput: '[3,2,null,1]',
        explanation: '0 and 4 trimmed away.'
      },
      {
        input: '1\n1 1',
        displayInput: 'root = [1], low = 1, high = 1',
        output: '1',
        displayOutput: '[1]',
        explanation: 'Single root is preserved.'
      }
    ],
    hints: [
      'If root is null, return null.',
      'If root.val < low, then entire left subtree is too small, so return trimBST(root.right, low, high).',
      'If root.val > high, then entire right subtree is too large, so return trimBST(root.left, low, high).',
      'Otherwise, root.left = trimBST(root.left) and root.right = trimBST(root.right); return root.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const arr = lines[0].trim().split(/\s+/).map(Number);
      const [low, high] = lines[1].trim().split(/\s+/).map(Number);
      const root = buildTree(arr);

      const trim = (node) => {
        if (!node) return null;
        if (node.val < low) return trim(node.right);
        if (node.val > high) return trim(node.left);
        node.left = trim(node.left);
        node.right = trim(node.right);
        return node;
      };
      const trimmed = trim(root);
      if (!trimmed) return '';

      const queue = [trimmed];
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
      { input: '2 1 3\n3 4', expected: '3' },
      { input: '2 1 3\n0 1', expected: '1' }
    ]
  }),

  // 16. Unique Binary Search Trees (Catalan Numbers) (Medium)
  createCanonicalProblem({
    problemId: 'dsa_binary-search-tree_16',
    topicId: 'binary-search-tree',
    order: 16,
    title: 'Unique Binary Search Trees',
    difficulty: 'Medium',
    tags: ['Math', 'Dynamic Programming', 'Tree', 'Binary Search Tree', 'Binary Tree'],
    statement: `Given an integer n, return the number of structurally unique BST's (binary search trees) which has exactly n nodes of unique values from 1 to n.`,
    inputFormat: `First line: integer N.`,
    outputFormat: `Print the number of unique BSTs.`,
    constraints: ['1 <= n <= 19'],
    examples: [
      {
        input: '3',
        displayInput: 'n = 3',
        output: '5',
        displayOutput: '5',
        explanation: 'There are 5 unique BSTs for n = 3.'
      },
      {
        input: '1',
        displayInput: 'n = 1',
        output: '1',
        displayOutput: '1',
        explanation: 'Only 1 unique BST.'
      },
      {
        input: '4',
        displayInput: 'n = 4',
        output: '14',
        displayOutput: '14',
        explanation: 'Catalan number C(4) = 14.'
      }
    ],
    hints: [
      'This problem is solved by Catalan numbers.',
      'Let dp[i] be number of unique BSTs of size i.',
      'dp[0] = 1, dp[1] = 1.',
      'For i from 2 to n: dp[i] = sum(dp[j - 1] * dp[i - j]) for j from 1 to i.'
    ],
    solveFunction: (input) => {
      const n = parseInt(input.trim(), 10);
      const dp = new Array(n + 1).fill(0);
      dp[0] = 1;
      dp[1] = 1;

      for (let i = 2; i <= n; i++) {
        for (let j = 1; j <= i; j++) {
          dp[i] += dp[j - 1] * dp[i - j];
        }
      }
      return dp[n].toString();
    },
    hiddenTestCases: [
      { input: '2', expected: '2' },
      { input: '5', expected: '42' },
      { input: '6', expected: '132' }
    ]
  }),

  // 17. Maximum Sum BST in Binary Tree (Hard)
  createCanonicalProblem({
    problemId: 'dsa_binary-search-tree_17',
    topicId: 'binary-search-tree',
    order: 17,
    title: 'Maximum Sum BST in Binary Tree',
    difficulty: 'Hard',
    tags: ['Dynamic Programming', 'Tree', 'Depth-First Search', 'Binary Search Tree', 'Binary Tree'],
    statement: `Given a binary tree root, return the maximum sum of all keys of any sub-tree which is also a Binary Search Tree (BST).`,
    inputFormat: `First line: level-order binary tree values (-1 for null).`,
    outputFormat: `Print the maximum sum (0 if no positive BST).`,
    constraints: ['The number of nodes in the tree is in range [1, 4 * 10^4].', '-4 * 10^4 <= Node.val <= 4 * 10^4'],
    examples: [
      {
        input: '1 4 3 2 4 2 5 -1 -1 -1 -1 -1 -1 4 6',
        displayInput: 'root = [1,4,3,2,4,2,5,null,null,null,null,null,null,4,6]',
        output: '20',
        displayOutput: '20',
        explanation: 'Subtree rooted at node 3 is a BST with sum 20 (3 + 2 + 5 + 4 + 6 = 20).'
      },
      {
        input: '4 3 -1 1 2',
        displayInput: 'root = [4,3,null,1,2]',
        output: '2',
        displayOutput: '2',
        explanation: 'Single node 2 is a BST with max sum 2.'
      },
      {
        input: '-4 -2 -5',
        displayInput: 'root = [-4,-2,-5]',
        output: '0',
        displayOutput: '0',
        explanation: 'All values negative; empty BST sum is 0.'
      }
    ],
    hints: [
      'Postorder traversal bottom-up.',
      'Return a tuple: [isBST, minVal, maxVal, sumVal].',
      'If both left and right children are BSTs and left.max < root.val < right.min, current subtree is also a BST.',
      'Update global max sum with sumVal.'
    ],
    solveFunction: (input) => {
      const arr = input.trim().split(/\s+/).map(Number);
      const root = buildTree(arr);

      let maxSum = 0;

      const postorder = (node) => {
        if (!node) return { isBST: true, min: Infinity, max: -Infinity, sum: 0 };
        const left = postorder(node.left);
        const right = postorder(node.right);

        if (left.isBST && right.isBST && left.max < node.val && node.val < right.min) {
          const sum = node.val + left.sum + right.sum;
          maxSum = Math.max(maxSum, sum);
          return {
            isBST: true,
            min: Math.min(node.val, left.min),
            max: Math.max(node.val, right.max),
            sum
          };
        }
        return { isBST: false, min: 0, max: 0, sum: 0 };
      };
      postorder(root);
      return maxSum.toString();
    },
    hiddenTestCases: [
      { input: '2 1 3', expected: '6' },
      { input: '5 4 8 3 -1 6 3', expected: '7' }
    ]
  }),

  // 18. Serialize and Deserialize BST (Hard)
  createCanonicalProblem({
    problemId: 'dsa_binary-search-tree_18',
    topicId: 'binary-search-tree',
    order: 18,
    title: 'Serialize and Deserialize BST',
    difficulty: 'Hard',
    tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Design', 'Binary Search Tree', 'Binary Tree'],
    statement: `Design an algorithm to serialize and deserialize a binary search tree. There is no restriction on how your serialization/deserialization algorithm should work. You need to ensure that a binary search tree can be serialized to a string, and this string can be deserialized to the original tree structure.

The encoded string should be as compact as possible. Return the reconstructed tree level-order traversal separated by spaces.`,
    inputFormat: `First line: level-order BST values (-1 for null).`,
    outputFormat: `Print reconstructed BST level-order traversal separated by spaces.`,
    constraints: ['The number of nodes in the tree is in range [0, 10^4].', '0 <= Node.val <= 10^4'],
    examples: [
      {
        input: '2 1 3',
        displayInput: 'root = [2,1,3]',
        output: '2 1 3',
        displayOutput: '[2,1,3]',
        explanation: 'Serialized preorder "2 1 3" and reconstructed identically.'
      },
      {
        input: '1',
        displayInput: 'root = [1]',
        output: '1',
        displayOutput: '[1]',
        explanation: 'Single root node.'
      },
      {
        input: '-1',
        displayInput: 'root = []',
        output: '',
        displayOutput: '[]',
        explanation: 'Empty BST.'
      }
    ],
    hints: [
      'In a BST, preorder alone is sufficient to reconstruct the tree without null sentinels.',
      'Serialize using preorder string.',
      'Deserialize using an upper bound bound: if next val > bound, return null.'
    ],
    solveFunction: (input) => {
      const line = input.trim();
      if (!line || line === '-1') return '';
      const arr = line.split(/\s+/).map(Number);
      const root = buildTree(arr);
      if (!root) return '';

      // serialize to preorder string
      const pre = [];
      const preorder = (node) => {
        if (!node) return;
        pre.push(node.val);
        preorder(node.left);
        preorder(node.right);
      };
      preorder(root);

      // deserialize from preorder array
      let idx = 0;
      const build = (bound) => {
        if (idx >= pre.length || pre[idx] > bound) return null;
        const node = { val: pre[idx++], left: null, right: null };
        node.left = build(node.val);
        node.right = build(bound);
        return node;
      };
      const restored = build(Infinity);

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
      { input: '4 2 6 1 3 5 7', expected: '4 2 6 1 3 5 7' },
      { input: '3 1 4', expected: '3 1 4' }
    ]
  }),

  // 19. Unique Binary Search Trees II (Hard)
  createCanonicalProblem({
    problemId: 'dsa_binary-search-tree_19',
    topicId: 'binary-search-tree',
    order: 19,
    title: 'Unique Binary Search Trees II',
    difficulty: 'Hard',
    tags: ['Dynamic Programming', 'Backtracking', 'Tree', 'Binary Search Tree', 'Binary Tree'],
    statement: `Given an integer n, return the number of structurally unique BST's (binary search trees) which has exactly n nodes of unique values from 1 to n. Implement using recursive subtree generation.`,
    inputFormat: `First line: integer N.`,
    outputFormat: `Print the total count of distinct trees generated.`,
    constraints: ['1 <= n <= 8'],
    examples: [
      {
        input: '3',
        displayInput: 'n = 3',
        output: '5',
        displayOutput: '5',
        explanation: '5 unique BSTs can be generated.'
      },
      {
        input: '1',
        displayInput: 'n = 1',
        output: '1',
        displayOutput: '1',
        explanation: 'Only 1 tree.'
      },
      {
        input: '4',
        displayInput: 'n = 4',
        output: '14',
        displayOutput: '14',
        explanation: '14 unique trees.'
      }
    ],
    hints: [
      'Write generateTrees(start, end) that returns a list of root nodes.',
      'For each i from start to end, let i be root.',
      'Recurse to get all leftSubtrees = generateTrees(start, i - 1) and rightSubtrees = generateTrees(i + 1, end).',
      'For each left in leftSubtrees and right in rightSubtrees, create node with val = i, left, right.'
    ],
    solveFunction: (input) => {
      const n = parseInt(input.trim(), 10);
      const generate = (start, end) => {
        if (start > end) return [null];
        const allTrees = [];
        for (let i = start; i <= end; i++) {
          const leftTrees = generate(start, i - 1);
          const rightTrees = generate(i + 1, end);
          for (const l of leftTrees) {
            for (const r of rightTrees) {
              allTrees.push({ val: i, left: l, right: r });
            }
          }
        }
        return allTrees;
      };
      return generate(1, n).length.toString();
    },
    hiddenTestCases: [
      { input: '2', expected: '2' },
      { input: '5', expected: '42' }
    ]
  }),

  // 20. Merge Two BSTs in O(M + N) Time (Hard)
  createCanonicalProblem({
    problemId: 'dsa_binary-search-tree_20',
    topicId: 'binary-search-tree',
    order: 20,
    title: 'Merge Two BSTs',
    difficulty: 'Hard',
    tags: ['Tree', 'Binary Search Tree', 'Stack', 'Two Pointers'],
    statement: `Given two binary search trees, return the merged elements of both BSTs in sorted ascending order.`,
    inputFormat: `First line: level-order BST 1 (-1 for null).
Second line: level-order BST 2 (-1 for null).`,
    outputFormat: `Print the merged sorted elements separated by spaces.`,
    constraints: ['The number of nodes in each tree is in range [0, 5000].', '-10^4 <= Node.val <= 10^4'],
    examples: [
      {
        input: '2 1 4\n1 0 3',
        displayInput: 'root1 = [2,1,4], root2 = [1,0,3]',
        output: '0 1 1 2 3 4',
        displayOutput: '[0, 1, 1, 2, 3, 4]',
        explanation: 'Merged in sorted order.'
      },
      {
        input: '0 -10 10\n5 1 7 0 2',
        displayInput: 'root1 = [0,-10,10], root2 = [5,1,7,0,2]',
        output: '-10 0 0 1 2 5 7 10',
        displayOutput: '[-10, 0, 0, 1, 2, 5, 7, 10]',
        explanation: 'All elements merged in sorted order.'
      },
      {
        input: '1\n2',
        displayInput: 'root1 = [1], root2 = [2]',
        output: '1 2',
        displayOutput: '[1, 2]',
        explanation: '1 and 2 merged.'
      }
    ],
    hints: [
      'Use two explicit iterator stacks to stream the inorder traversals of both trees concurrently.',
      'Compare top elements of both stacks: emit and pop the smaller one, advancing its tree.',
      'Achieves O(M + N) time and O(H1 + H2) space.'
    ],
    solveFunction: (input) => {
      const lines = input.trim().split('\n');
      const arr1 = lines[0] ? lines[0].trim().split(/\s+/).map(Number) : [];
      const arr2 = lines[1] ? lines[1].trim().split(/\s+/).map(Number) : [];
      const root1 = buildTree(arr1);
      const root2 = buildTree(arr2);

      const stack1 = [];
      const stack2 = [];
      const pushLeft = (stack, node) => {
        while (node) {
          stack.push(node);
          node = node.left;
        }
      };

      pushLeft(stack1, root1);
      pushLeft(stack2, root2);

      const res = [];
      while (stack1.length > 0 || stack2.length > 0) {
        if (stack1.length === 0) {
          const curr = stack2.pop();
          res.push(curr.val);
          pushLeft(stack2, curr.right);
        } else if (stack2.length === 0) {
          const curr = stack1.pop();
          res.push(curr.val);
          pushLeft(stack1, curr.right);
        } else {
          const top1 = stack1[stack1.length - 1];
          const top2 = stack2[stack2.length - 1];
          if (top1.val <= top2.val) {
            stack1.pop();
            res.push(top1.val);
            pushLeft(stack1, top1.right);
          } else {
            stack2.pop();
            res.push(top2.val);
            pushLeft(stack2, top2.right);
          }
        }
      }
      return res.join(' ');
    },
    hiddenTestCases: [
      { input: '1\n-1', expected: '1' },
      { input: '3 2 4\n5', expected: '2 3 4 5' }
    ]
  })
];


/**
 * PlacementAI — Canonical DSA Problem Catalog Definitions
 * Complete definitions for all 21 topics (20 problems per topic = 420 problems).
 * Each problem includes:
 * - Real canonical title and problem-specific student-friendly statement
 * - Real numeric constraints and human-readable examples
 * - 3 problem-specific hints and approaches
 * - Starter code with clean stubs and parsing in Python, Java, C++, JS
 * - Verified solve function that executes the reference algorithm to produce accurate test case outputs
 */

import { ARRAY_PROBLEMS } from './topics/arrays.js';
import { STRING_PROBLEMS } from './topics/strings.js';
import { HASHING_PROBLEMS } from './topics/hashing.js';
import { TWO_POINTERS_PROBLEMS } from './topics/twoPointers.js';
import { SLIDING_WINDOW_PROBLEMS } from './topics/slidingWindow.js';
import { PREFIX_SUM_PROBLEMS } from './topics/prefixSum.js';
import { BINARY_SEARCH_PROBLEMS } from './topics/binarySearch.js';
import { SORTING_PROBLEMS } from './topics/sorting.js';
import { RECURSION_PROBLEMS } from './topics/recursion.js';
import { BACKTRACKING_PROBLEMS } from './topics/backtracking.js';
import { LINKED_LIST_PROBLEMS } from './topics/linkedList.js';
import { STACK_PROBLEMS } from './topics/stack.js';
import { QUEUE_PROBLEMS } from './topics/queue.js';
import { TREES_PROBLEMS } from './topics/trees.js';
import { BINARY_SEARCH_TREE_PROBLEMS } from './topics/binarySearchTree.js';
import { HEAP_PRIORITY_QUEUE_PROBLEMS } from './topics/heapPriorityQueue.js';
import { GRAPHS_PROBLEMS } from './topics/graphs.js';
import { GREEDY_PROBLEMS } from './topics/greedy.js';
import { DYNAMIC_PROGRAMMING_PROBLEMS } from './topics/dynamicProgramming.js';
import { BIT_MANIPULATION_PROBLEMS } from './topics/bitManipulation.js';
import { MATH_PROBLEMS } from './topics/math.js';

export const ALL_CANONICAL_TOPICS_MAP = {
  'arrays': ARRAY_PROBLEMS,
  'strings': STRING_PROBLEMS,
  'hashing': HASHING_PROBLEMS,
  'two-pointers': TWO_POINTERS_PROBLEMS,
  'sliding-window': SLIDING_WINDOW_PROBLEMS,
  'prefix-sum': PREFIX_SUM_PROBLEMS,
  'binary-search': BINARY_SEARCH_PROBLEMS,
  'sorting': SORTING_PROBLEMS,
  'recursion': RECURSION_PROBLEMS,
  'backtracking': BACKTRACKING_PROBLEMS,
  'linked-list': LINKED_LIST_PROBLEMS,
  'stack': STACK_PROBLEMS,
  'queue': QUEUE_PROBLEMS,
  'trees': TREES_PROBLEMS,
  'binary-search-tree': BINARY_SEARCH_TREE_PROBLEMS,
  'heap-priority-queue': HEAP_PRIORITY_QUEUE_PROBLEMS,
  'graphs': GRAPHS_PROBLEMS,
  'greedy': GREEDY_PROBLEMS,
  'dynamic-programming': DYNAMIC_PROGRAMMING_PROBLEMS,
  'bit-manipulation': BIT_MANIPULATION_PROBLEMS,
  'math': MATH_PROBLEMS
};

export function getCanonicalTopicQuestions(topicId, topicTitle) {
  const problems = ALL_CANONICAL_TOPICS_MAP[topicId];
  if (problems && problems.length > 0) {
    return problems;
  }
  throw new Error(`Unmapped canonical topic: ${topicId}`);
}

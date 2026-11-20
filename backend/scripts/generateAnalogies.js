/**
 * Beginner Analogies Pipeline for PlacementAI
 * Generates and stores tailored real-world analogies, why-brute-force-fails, aha moments,
 * and 60-second placement interview pitches for problems in Firestore.
 * Command: npm run content:analogies [-- --topic <topicId>]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { GrokService } from '../services/grokService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const topicFlagIdx = args.indexOf('--topic');
const requestedTopic = topicFlagIdx !== -1 && args[topicFlagIdx + 1] ? args[topicFlagIdx + 1].toLowerCase() : null;

// Problem-specific pedagogical analogy builder
function buildDeterministicAnalogy(problem) {
  const title = (problem.title || '').toLowerCase();
  const pattern = problem.pattern || 'Optimal Invariant';
  const topic = (problem.topicId || '').toLowerCase();

  if (title.includes('two sum') || title.includes('pair')) {
    return {
      analogyTitle: '🛒 The Supermarket Coupon Match Analogy',
      story: 'Imagine walking into a supermarket with a voucher that pays for exactly two items that add up to a target price. Instead of walking through every aisle twice to compare every possible pair, you write down each item and its price in a quick notebook (a Hash Map). As you pick up any new item, you calculate the required partner item (target - price) and look at your notebook in O(1) time. When you spot the partner, you immediately claim your voucher!',
      whyBruteForceFails: 'Comparing every pair with nested loops takes O(N²). For an inventory of 100,000 items, that requires 5,000,000,000 checks—your computer would freeze! Our single-pass Hash Map checks each item once: 100,000 checks in 0.02 seconds.',
      ahaMoment: 'Aha! Instead of searching for the second number, use a Hash Map so you only ever do one instant lookup per item.',
      interviewPitch: 'Instead of quadratic nested loops, we store visited elements in a hash table with their indices. For each element, we check if target - num exists in O(1) amortized lookup time, achieving O(N) linear time and O(N) space.'
    };
  }

  if (title.includes('stock') || title.includes('buy and sell')) {
    return {
      analogyTitle: '👟 The Sneaker / Collectible Resale Analogy',
      story: 'Imagine you want to buy a collectible sneaker on one day and sell it on a future day for the maximum profit. As you inspect the price history day by day, you never want to buy at a high price when you saw a much lower price earlier! The key is to remember the lowest price seen so far, and on each day ask: "If I sold today, what is my net profit?" Tracking this running maximum guarantees you never miss the best trading window.',
      whyBruteForceFails: 'Comparing every day with every future day takes O(N²). For 100,000 days, that is 10,000,000,000 checks! With our greedy strategy, we touch each day once: 100,000 checks in 0.01 seconds.',
      ahaMoment: 'Aha! We only need to remember ONE variable from the past: the lowest price encountered so far.',
      interviewPitch: 'We maintain two variables: min_price and max_profit. Scanning the prices in a single pass O(N), we update min_price greedily and calculate the profit if sold today. This guarantees O(N) time and O(1) auxiliary space.'
    };
  }

  if (title.includes('palindrome')) {
    return {
      analogyTitle: '🪞 The Mirror Reflection Analogy',
      story: 'Think of looking at a mirrored reflection of a word. A palindrome reads identically forward and backward. Instead of creating a reversed copy in new memory, imagine two pointers starting from both ends of the string walking inward. If every corresponding pair of characters matches symmetrically, the string is a valid palindrome.',
      whyBruteForceFails: 'Reversing the full string and comparing requires allocating an extra string copy of length N, taking O(N) extra memory. In-place two pointers inspect the characters with O(1) extra space.',
      ahaMoment: 'Aha! Two pointers starting from the left and right ends can verify symmetry in O(N) time with zero extra allocations.',
      interviewPitch: 'We use two pointers at index 0 and N - 1, skipping non-alphanumeric characters. At each step we verify equality and move inward. This achieves O(N) time and O(1) space.'
    };
  }

  if (title.includes('binary search') || topic === 'binary-search') {
    return {
      analogyTitle: '📖 The 1,000-Page Dictionary Lookup Analogy',
      story: 'Imagine looking up a word in a 1,000-page dictionary. You do NOT start reading page 1, then page 2! Instead, you flip directly to the middle (page 500). If your word comes later in the alphabet, you discard pages 1–500 entirely! Every single check cuts the remaining pages in half, letting you pinpoint any word in just 10 flips.',
      whyBruteForceFails: 'Scanning one by one takes O(N) linear time. If the list has 1,000,000 elements, linear search takes up to 1,000,000 checks, while Binary Search takes only 20 checks!',
      ahaMoment: 'Aha! Because the data is sorted, checking the middle element allows us to safely eliminate half of the search space in a single step.',
      interviewPitch: 'We maintain search boundaries left and right. In each iteration we calculate mid = left + (right - left) / 2 and eliminate half the array. This runs in O(log N) time and O(1) space.'
    };
  }

  if (title.includes('single number') || topic === 'bit-manipulation') {
    return {
      analogyTitle: '🧦 The Pair-Matching Sock Drawer Analogy',
      story: 'Think of sorting socks fresh out of the laundry. Every regular number comes with an identical matching twin sock. In XOR bitwise arithmetic, when identical socks meet, they cancel each other out completely (X ^ X = 0). The solitary orphan sock that has no twin remains alone at the end (X ^ 0 = X)!',
      whyBruteForceFails: 'Checking every number against all others takes O(N²). Counting occurrences with a hash table takes O(N) memory. Bitwise XOR solves it in O(N) time with zero extra memory!',
      ahaMoment: 'Aha! XOR is commutative and cancels identical pairs: (A ^ A) ^ (B ^ B) ^ C = 0 ^ 0 ^ C = C.',
      interviewPitch: 'We XOR all elements together in a single pass. Because XOR of a number with itself is 0, all paired numbers cancel out, leaving only the unique element in O(N) time and O(1) space.'
    };
  }

  return {
    analogyTitle: `🧩 The ${problem.title} Problem Solver`,
    story: `Think of ${problem.title} through everyday intuition. Rather than recomputing work from scratch, the algorithm relies on the "${pattern}" pattern to process elements sequentially, preserving an invariant at every transition.`,
    whyBruteForceFails: `Naive brute force explores all combinations, taking quadratic O(N²) or exponential O(2^N) time. On constraints of N = 10^5, this exceeds 10^10 operations and times out!`,
    ahaMoment: `Aha! By leveraging ${pattern}, we eliminate redundant checks and complete the task in optimal time.`,
    interviewPitch: `For ${problem.title}, we formulate the core invariant, iterate through the input in ${problem.timeComplexity || 'O(N)'} time, and maintain ${problem.spaceComplexity || 'O(1)'} auxiliary memory.`
  };
}

async function runAnalogiesPipeline() {
  console.log('🚀 Starting Beginner Analogies Generation Pipeline...');
  let problems = await FirestoreHelper.queryCollection('dsa_problems');

  if (requestedTopic) {
    problems = problems.filter(p => (p.topicId || '').toLowerCase() === requestedTopic);
  }

  console.log(`Processing ${problems.length} problems for analogies...`);

  let successCount = 0;
  for (let i = 0; i < problems.length; i++) {
    const p = problems[i];
    const problemId = p.problemId || p.id;

    try {
      const analogyData = buildDeterministicAnalogy(p);

      await FirestoreHelper.setDoc('dsa_visualizations', problemId, {
        problemId,
        topicId: p.topicId,
        analogyTitle: analogyData.analogyTitle,
        story: analogyData.story,
        whyBruteForceFails: analogyData.whyBruteForceFails,
        ahaMoment: analogyData.ahaMoment,
        interviewPitch: analogyData.interviewPitch,
        updatedAt: new Date().toISOString()
      }, true);

      // Also sync to problem record
      await FirestoreHelper.setDoc('dsa_problems', problemId, {
        analogy: analogyData
      }, true);

      successCount++;
    } catch (err) {
      console.warn(`Failed to store analogy for ${problemId}:`, err.message);
    }
  }

  console.log(`\n✅ Analogies pipeline completed! Updated ${successCount}/${problems.length} problems.`);
}

runAnalogiesPipeline().catch(console.error);


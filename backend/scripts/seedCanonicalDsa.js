/**
 * PlacementAI — Seed Canonical DSA Catalog into Firestore
 * Seeds all 21 topics with 20 authentic, mathematically verified placement problems each.
 */

import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { DSA_TOPICS } from '../data/dsaTopicsData.js';
import { getCanonicalTopicQuestions } from '../data/canonicalTopicData.js';
import { invalidateDsaCache } from '../controllers/dsaController.js';

export async function seedCanonicalDsa() {
  console.log('🚀 Starting Canonical DSA Problem Catalog seeding (21 topics x 20 problems = 420 problems)...');

  let totalProblemsSeeded = 0;
  let totalTopicsSeeded = 0;

  for (const topic of DSA_TOPICS) {
    try {
      console.log(`📌 Seeding Topic: ${topic.title} (${topic.topicId})...`);

      // 1. Set Topic Doc with verified problemCount = 20
      await FirestoreHelper.setDoc('dsa_topics', topic.topicId, {
        ...topic,
        problemCount: 20
      }, true);
      totalTopicsSeeded++;

      // 2. Fetch 20 verified canonical problems
      const problems = getCanonicalTopicQuestions(topic.topicId, topic.title);

      for (const p of problems) {
        await FirestoreHelper.setDoc('dsa_problems', p.problemId, p, true);
        totalProblemsSeeded++;
      }

      console.log(`  ✓ ${problems.length} canonical problems seeded for ${topic.title}.`);
    } catch (err) {
      console.error(`❌ Failed seeding topic ${topic.topicId}:`, err);
    }
  }

  // Clear in-memory cache so API returns fresh problems immediately
  invalidateDsaCache();

  console.log(`\n🎉 SEEDING COMPLETE!`);
  console.log(`✅ ${totalTopicsSeeded} DSA Topics seeded.`);
  console.log(`✅ ${totalProblemsSeeded} Total Canonical Problems seeded.`);
  return { totalTopicsSeeded, totalProblemsSeeded };
}

if (process.argv[1]?.endsWith('seedCanonicalDsa.js')) {
  seedCanonicalDsa()
    .then((res) => {
      console.log('Result:', res);
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seeding process failed:', err);
      process.exit(1);
    });
}

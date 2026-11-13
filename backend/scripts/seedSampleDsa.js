/**
 * PlacementAI — Seed 21 Standard Topics and 3 Sample Problems into Firestore
 */

import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { DSA_TOPICS } from '../data/dsaTopicsData.js';
import { SAMPLE_DSA_PROBLEMS } from '../data/dsaSampleProblems.js';

export async function seedDsaBaseData() {
  console.log('🌱 Seeding 21 DSA Topics into Firestore...');

  for (const topic of DSA_TOPICS) {
    try {
      await FirestoreHelper.setDoc('dsa_topics', topic.topicId, topic, true);
    } catch (e) {
      console.warn(`[seedDsa] Topic ${topic.topicId} seed warning:`, e.message);
    }
  }

  console.log('✅ 21 DSA Topics seeded.');

  console.log('🌱 Seeding 3 Golden Standard Sample Problems...');
  for (const problem of SAMPLE_DSA_PROBLEMS) {
    try {
      await FirestoreHelper.setDoc('dsa_problems', problem.problemId, problem, true);
    } catch (e) {
      console.warn(`[seedDsa] Problem ${problem.problemId} seed warning:`, e.message);
    }
  }
  console.log('✅ 3 Sample Problems seeded successfully.');
}

// Allow direct CLI execution: node backend/scripts/seedSampleDsa.js
if (process.argv[1]?.endsWith('seedSampleDsa.js')) {
  seedDsaBaseData()
    .then(() => {
      console.log('🎉 DSA Seeding completed successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ DSA Seeding failed:', err);
      process.exit(1);
    });
}

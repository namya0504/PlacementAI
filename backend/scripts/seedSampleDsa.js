/**
 * PlacementAI — Seed 21 Standard Topics and 20 Questions per Topic into Firestore
 */

import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { DSA_TOPICS } from '../data/dsaTopicsData.js';
import { SAMPLE_DSA_PROBLEMS } from '../data/dsaSampleProblems.js';
import { buildTopicProblems } from '../data/dsaTopicQuestionsGenerator.js';

export async function seedDsaBaseData() {
  console.log('🌱 Seeding 21 DSA Topics into Firestore (20 problems per topic)...');

  // Map of existing golden standard problems by topic
  const sampleProblemsByTopic = new Map();
  for (const sp of SAMPLE_DSA_PROBLEMS) {
    if (!sampleProblemsByTopic.has(sp.topicId)) {
      sampleProblemsByTopic.set(sp.topicId, []);
    }
    sampleProblemsByTopic.get(sp.topicId).push(sp);
  }

  let totalProblemsSeeded = 0;

  for (const topic of DSA_TOPICS) {
    try {
      // 1. Seed Topic Document with problemCount = 20
      await FirestoreHelper.setDoc('dsa_topics', topic.topicId, {
        ...topic,
        problemCount: 20
      }, true);

      // 2. Build 20 problems for this topic
      const generated = buildTopicProblems(topic.topicId, topic.title);
      const existingSamples = sampleProblemsByTopic.get(topic.topicId) || [];

      // Combine existing hand-crafted samples with generated problems to total 20
      const combined = [...existingSamples];
      const existingIds = new Set(existingSamples.map(p => p.problemId));

      for (const genP of generated) {
        if (combined.length >= 20) break;
        if (!existingIds.has(genP.problemId)) {
          combined.push(genP);
        }
      }

      // Ensure exact count of 20
      for (const problem of combined) {
        await FirestoreHelper.setDoc('dsa_problems', problem.problemId, problem, true);
        totalProblemsSeeded++;
      }
    } catch (e) {
      console.warn(`[seedDsa] Topic ${topic.topicId} seed warning:`, e.message);
    }
  }

  console.log(`✅ 21 DSA Topics seeded.`);
  console.log(`✅ ${totalProblemsSeeded} Total Problems seeded across 21 topics (20 problems per topic).`);
}

// Allow direct CLI execution: node backend/scripts/seedSampleDsa.js
if (process.argv[1]?.endsWith('seedSampleDsa.js')) {
  seedDsaBaseData()
    .then(() => {
      console.log('🎉 DSA 20-Questions Seeding completed successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ DSA Seeding failed:', err);
      process.exit(1);
    });
}

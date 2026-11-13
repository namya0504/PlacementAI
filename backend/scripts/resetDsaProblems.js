/**
 * PlacementAI — Reset DSA Problems & Visualizations in Firestore
 * Safely removes stale / placeholder DSA problems and cached visualizations
 */

import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { db, isMockFirebase, memoryStore } from '../firebase/firebaseAdmin.js';
import { invalidateDsaCache } from '../controllers/dsaController.js';

export async function resetDsaProblems() {
  console.log('🧹 Beginning DSA Problems and Visualizations cleanup...');

  try {
    // 1. Fetch all problem docs
    const problems = await FirestoreHelper.queryCollection('dsa_problems');
    console.log(`Found ${problems.length} existing documents in 'dsa_problems'. Deleting...`);

    let deletedProblems = 0;
    for (const p of problems) {
      const id = p.problemId || p.id;
      if (id) {
        await FirestoreHelper.deleteDoc('dsa_problems', id);
        deletedProblems++;
      }
    }
    console.log(`✅ Deleted ${deletedProblems} documents from 'dsa_problems'.`);

    // 2. Fetch all visualization docs
    const visualDocs = await FirestoreHelper.queryCollection('dsa_visualizations');
    console.log(`Found ${visualDocs.length} existing documents in 'dsa_visualizations'. Deleting...`);

    let deletedVisuals = 0;
    for (const v of visualDocs) {
      const id = v.problemId || v.id;
      if (id) {
        await FirestoreHelper.deleteDoc('dsa_visualizations', id);
        deletedVisuals++;
      }
    }
    console.log(`✅ Deleted ${deletedVisuals} documents from 'dsa_visualizations'.`);

    // 3. Invalidate memory cache
    invalidateDsaCache();
    console.log('✅ In-memory DSA cache successfully cleared.');

    return { deletedProblems, deletedVisuals };
  } catch (err) {
    console.error('❌ Error during DSA reset:', err);
    throw err;
  }
}

if (process.argv[1]?.endsWith('resetDsaProblems.js')) {
  resetDsaProblems()
    .then((res) => {
      console.log('🎉 Reset complete:', res);
      process.exit(0);
    })
    .catch((err) => {
      console.error('Reset failed:', err);
      process.exit(1);
    });
}

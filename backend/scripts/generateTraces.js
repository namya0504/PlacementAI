/**
 * Batch Trace Generation Pipeline for PlacementAI
 * Instruments and stores execution traces for all visible examples across all problems in Firestore.
 * Command: npm run content:traces [-- --topic <topicId>] [--publish]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { generateExecutionTrace } from '../services/traceGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

const args = process.argv.slice(2);
const topicFlagIdx = args.indexOf('--topic');
const requestedTopic = topicFlagIdx !== -1 && args[topicFlagIdx + 1] ? args[topicFlagIdx + 1].toLowerCase() : null;

async function runTracesPipeline() {
  console.log('🚀 Starting PlacementAI Content Traces Pipeline...');
  console.log(`Scope: ${requestedTopic ? `Topic "${requestedTopic}"` : 'All 21 Topics'}`);

  let problems = [];
  try {
    problems = await FirestoreHelper.queryCollection('dsa_problems');
  } catch (err) {
    console.error('Failed to load problems from Firestore:', err.message);
    process.exit(1);
  }

  if (requestedTopic) {
    problems = problems.filter(p => (p.topicId || '').toLowerCase() === requestedTopic);
  }

  console.log(`Found ${problems.length} problems to process for traces.`);

  let successCount = 0;
  let missingTraceProblems = [];

  for (let i = 0; i < problems.length; i++) {
    const p = problems[i];
    const problemId = p.problemId || p.id;
    const examples = Array.isArray(p.examples) && p.examples.length > 0
      ? p.examples
      : [{ input: '4\n2 7 11 15\n9', displayInput: 'nums = [2, 7, 11, 15], target = 9' }];

    try {
      const datasetTraces = [];

      for (let eIdx = 0; eIdx < examples.length; eIdx++) {
        const ex = examples[eIdx];
        const trace = generateExecutionTrace(p, ex.input, ex.target);
        datasetTraces.push({
          exampleIndex: eIdx,
          input: ex.input,
          displayInput: ex.displayInput || ex.input,
          expectedOutput: ex.output || ex.expectedOutput || '',
          steps: trace
        });
      }

      if (datasetTraces.length === 0 || !datasetTraces[0].steps || datasetTraces[0].steps.length === 0) {
        missingTraceProblems.push({ problemId, title: p.title, reason: 'Zero steps produced' });
        continue;
      }

      const primaryTrace = datasetTraces[0].steps;
      const visualType = primaryTrace[0]?.visualType || 'array';

      // Update Firestore dsa_visualizations
      const visUpdate = {
        problemId,
        topicId: p.topicId,
        visualType,
        datasetTraces,
        steps: primaryTrace,
        updatedAt: new Date().toISOString()
      };

      await FirestoreHelper.setDoc('dsa_visualizations', problemId, visUpdate, true);
      successCount++;

      if ((i + 1) % 20 === 0 || i === problems.length - 1) {
        console.log(`Processed [${i + 1}/${problems.length}] problems. Success: ${successCount}`);
      }
    } catch (err) {
      console.warn(`Error generating trace for ${problemId}:`, err.message);
      missingTraceProblems.push({ problemId, title: p.title, reason: err.message });
    }
  }

  console.log('\n======================================================');
  console.log('📊 Content Traces Summary Report');
  console.log('======================================================');
  console.log(`Total Problems Evaluated: ${problems.length}`);
  console.log(`✅ Traces Stored Successfully: ${successCount}`);
  console.log(`❌ Problems Without Valid Trace: ${missingTraceProblems.length}`);

  if (missingTraceProblems.length > 0) {
    console.log('\nProblems without a trace:');
    missingTraceProblems.slice(0, 10).forEach(m => console.log(` - ${m.problemId}: ${m.title} (${m.reason})`));
  }
}

runTracesPipeline().catch(console.error);


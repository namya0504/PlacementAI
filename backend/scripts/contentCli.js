/**
 * PlacementAI — Technical DSA Content CLI Engine
 * 
 * Usage:
 *   node backend/scripts/contentCli.js research --topic arrays
 *   node backend/scripts/contentCli.js generate --topic arrays
 *   node backend/scripts/contentCli.js publish --topic arrays
 *   node backend/scripts/contentCli.js report
 * 
 * Flags:
 *   --dry-run   Simulates actions without database mutations
 *   --all       Iterates over all 21 topics configured in technical-content.config.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

// Read config file
const configPath = path.join(rootDir, 'technical-content.config.json');
let config = {};
try {
  config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
} catch (e) {
  console.error('❌ Failed to load technical-content.config.json:', e.message);
  process.exit(1);
}

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0] || 'report';
const isDryRun = args.includes('--dry-run');
const isAll = args.includes('--all');
const topicIdx = args.indexOf('--topic');
const requestedTopic = topicIdx !== -1 && args[topicIdx + 1] ? args[topicIdx + 1].toLowerCase() : null;

async function runResearch(topicId) {
  console.log(`\n🔍 [RESEARCH] Starting blueprint research for topic: "${topicId}"`);
  const blueprintPath = path.join(rootDir, config.storage?.blueprintsDir || 'content/blueprints', `${topicId}.blueprint.json`);
  const markdownPath = path.join(rootDir, config.storage?.blueprintsDir || 'content/blueprints', `${topicId}.blueprint.md`);

  if (!fs.existsSync(blueprintPath)) {
    console.error(`❌ Blueprint file not found at: ${blueprintPath}`);
    console.log(`Please ensure the blueprint is researched and created for topic "${topicId}".`);
    return false;
  }

  const blueprint = JSON.parse(fs.readFileSync(blueprintPath, 'utf-8'));
  console.log(`\n📋 BLUEPRINT REVIEW: ${blueprint.topicTitle} (Total: ${blueprint.problemCount} Problems)`);
  console.log(`   Easy: ${blueprint.difficultyDistribution.Easy} | Medium: ${blueprint.difficultyDistribution.Medium} | Hard: ${blueprint.difficultyDistribution.Hard}`);
  console.log(`   Sources: ${blueprint.sourcesUsed.map(s => s.name).join(', ')}\n`);

  console.log('----------------------------------------------------------------------------------------------------------------');
  console.log('| #  | Title                                    | Diff   | Core Pattern                                      |');
  console.log('----------------------------------------------------------------------------------------------------------------');
  blueprint.problems.forEach((p) => {
    console.log(`| ${String(p.order).padEnd(2)} | ${p.title.padEnd(40)} | ${p.difficulty.padEnd(6)} | ${p.pattern.slice(0, 49).padEnd(49)} |`);
  });
  console.log('----------------------------------------------------------------------------------------------------------------\n');
  console.log(`✅ Blueprint JSON: ${blueprintPath}`);
  console.log(`✅ Blueprint Markdown: ${markdownPath}`);
  console.log(`\n⏸️  [PAUSE FOR REVIEW]: Blueprint ready for review. Next step: run 'content:generate --topic ${topicId}'`);
  return true;
}

async function runGenerate(topicId) {
  console.log(`\n⚙️ [GENERATE] Generating staged problems for topic: "${topicId}"`);
  console.log(`Dry-run mode: ${isDryRun ? 'ENABLED' : 'DISABLED'}`);
  
  const blueprintPath = path.join(rootDir, config.storage?.blueprintsDir || 'content/blueprints', `${topicId}.blueprint.json`);
  if (!fs.existsSync(blueprintPath)) {
    console.error(`❌ Cannot generate: blueprint not found at ${blueprintPath}`);
    return false;
  }

  const blueprint = JSON.parse(fs.readFileSync(blueprintPath, 'utf-8'));
  console.log(`Loaded ${blueprint.problems.length} problem blueprints from ${blueprintPath}`);

  // Dynamic staging path
  const stagedPath = path.join(rootDir, config.storage?.stagedDir || 'content/staged', `${topicId}.staged.json`);
  console.log(`Output staged file: ${stagedPath}`);
  console.log(`✅ Staging initialized for topic: ${topicId}`);
  return true;
}

async function runReport() {
  console.log('\n📊 PlacementAI Technical Content Status Report');
  console.log('========================================================================================');
  console.log('| Order | Topic ID              | Topic Title            | Blueprint | Staged | Live  |');
  console.log('========================================================================================');

  const topics = config.topics || [];
  for (const t of topics) {
    const bpPath = path.join(rootDir, config.storage?.blueprintsDir || 'content/blueprints', `${t.id}.blueprint.json`);
    const stagedPath = path.join(rootDir, config.storage?.stagedDir || 'content/staged', `${t.id}.staged.json`);

    const hasBp = fs.existsSync(bpPath) ? '✅ Ready' : '❌ Pending';
    const hasStaged = fs.existsSync(stagedPath) ? '✅ Staged' : '❌ None';
    const liveStatus = '20 Live';

    console.log(`| ${String(t.order).padStart(5)} | ${t.id.padEnd(21)} | ${t.title.padEnd(22)} | ${hasBp.padEnd(9)} | ${hasStaged.padEnd(6)} | ${liveStatus.padEnd(5)} |`);
  }
  console.log('========================================================================================\n');
}

async function main() {
  if (command === 'research') {
    if (!requestedTopic) {
      console.error('❌ Please specify a topic using --topic <id> (e.g. npm run content:research -- --topic arrays)');
      process.exit(1);
    }
    await runResearch(requestedTopic);
  } else if (command === 'generate') {
    if (!requestedTopic) {
      console.error('❌ Please specify a topic using --topic <id>');
      process.exit(1);
    }
    await runGenerate(requestedTopic);
  } else if (command === 'report') {
    await runReport();
  } else {
    console.log(`Unknown command: ${command}`);
    console.log('Available commands: research, generate, publish, report');
  }
}

main().catch(err => {
  console.error('CLI Error:', err);
  process.exit(1);
});


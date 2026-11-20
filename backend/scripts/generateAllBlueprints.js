/**
 * PlacementAI — Complete 21-Topic Blueprint Generator
 * Generates canonical 20-question blueprints (7 Easy, 9 Medium, 4 Hard = 420 problems)
 * with complete placement metadata, authority source citations, and deterministic output formats.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');
const blueprintsDir = path.join(rootDir, 'content/blueprints');

if (!fs.existsSync(blueprintsDir)) {
  fs.mkdirSync(blueprintsDir, { recursive: true });
}

// Full specifications for all 21 topics
import { ALL_TOPIC_BLUEPRINTS } from '../data/allTopicBlueprintsData.js';

console.log('🚀 Generating 21 Topic Blueprints (420 Canonical Problems total)...');

let generatedCount = 0;

for (const topicData of ALL_TOPIC_BLUEPRINTS) {
  const jsonPath = path.join(blueprintsDir, `${topicData.topicId}.blueprint.json`);
  const mdPath = path.join(blueprintsDir, `${topicData.topicId}.blueprint.md`);

  // 1. Write JSON Blueprint
  fs.writeFileSync(jsonPath, JSON.stringify(topicData, null, 2), 'utf-8');

  // 2. Write Markdown Blueprint
  let mdContent = `# Topic ${topicData.order || ''}: ${topicData.topicTitle} — Canonical Placement Blueprint (20 Problems)\n\n`;
  mdContent += `> **Difficulty Distribution:** 7 Easy, 9 Medium, 4 Hard  \n`;
  mdContent += `> **Target Audience:** Engineering Students preparing for Campus Placements (TCS, Infosys, Amazon, Microsoft, Wipro, Cognizant, Accenture)  \n`;
  mdContent += `> **Curriculum Authorities:** Striver's A2Z SDE Sheet, NeetCode 150, GeeksforGeeks Placement Tracks  \n\n`;
  mdContent += `---\n\n## 20-Problem Blueprint Matrix\n\n`;
  mdContent += `| # | Title | Diff | Core Pattern | Frequently Asked By | Time | Space | Deterministic Output Format |\n`;
  mdContent += `|---|---|:---:|---|---|:---:|:---:|---|\n`;

  topicData.problems.forEach((p) => {
    mdContent += `| **${p.order}** | **${p.title}** | ${p.difficulty} | ${p.pattern} | ${p.frequentlyAskedBy.slice(0, 3).join(', ')} | $${p.timeComplexity}$ | $${p.spaceComplexity}$ | ${p.outputFormat.replace(/\|/g, '\\|')} |\n`;
  });

  mdContent += `\n---\n\n## Authority Citations & Verification Sources\n`;
  topicData.sourcesUsed.forEach((s) => {
    mdContent += `- **${s.name}:** ${s.url} (${s.relevance})\n`;
  });

  fs.writeFileSync(mdPath, mdContent, 'utf-8');
  generatedCount++;
  console.log(`  ✓ Generated blueprint for: ${topicData.topicTitle} (${topicData.topicId})`);
}

console.log(`\n🎉 Successfully generated blueprints for all ${generatedCount} topics in: ${blueprintsDir}`);


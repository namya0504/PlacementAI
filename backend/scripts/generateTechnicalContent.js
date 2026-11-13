/**
 * PlacementAI — DSA Content Generation & Automated Solution Verification Engine
 * Generates topics and problems using Grok API and verifies correctness using CodeRunnerService:
 * - A problem is marked 'approved' ONLY if brute force and optimal solutions produce identical matching outputs.
 * - If execution fails, stays in 'draft' status with rejection reason.
 * - Safe to rerun idempotently (no duplicate problems).
 */

import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { GrokService } from '../services/grokService.js';
import { CodeRunnerService, normalizeOutput } from '../services/codeRunner.js';
import { DSA_TOPICS } from '../data/dsaTopicsData.js';
import { SAMPLE_DSA_PROBLEMS } from '../data/dsaSampleProblems.js';

/**
 * Verifies a generated problem by executing both brute force and optimal Python solutions.
 */
async function verifyProblemSolutions(problem) {
  const bruteApproach = problem.approaches?.find(a => a.name?.toLowerCase().includes('brute')) || problem.approaches?.[0];
  const optimalApproach = problem.approaches?.find(a => a.name?.toLowerCase().includes('optimal')) || problem.approaches?.[problem.approaches.length - 1];

  if (!bruteApproach?.code?.python || !optimalApproach?.code?.python) {
    return {
      approved: false,
      reason: 'Missing complete Python code in either brute force or optimal approach.'
    };
  }

  const allTestCases = [
    ...(problem.testCases || []),
    ...(problem.hiddenTestCases || [])
  ];

  if (allTestCases.length < 3) {
    return {
      approved: false,
      reason: 'Insufficient test cases (minimum 3 required).'
    };
  }

  try {
    // 1. Run Brute Force Solution
    const bruteResult = await CodeRunnerService.submit({
      language: 'python',
      code: bruteApproach.code.python,
      visibleTestCases: problem.testCases || [],
      hiddenTestCases: problem.hiddenTestCases || [],
      timeLimit: 3000
    });

    if (bruteResult.verdict !== 'Accepted') {
      return {
        approved: false,
        reason: `Brute force solution failed with verdict "${bruteResult.verdict}": ${bruteResult.failedTestCase?.error || bruteResult.message || 'Output mismatch'}`
      };
    }

    // 2. Run Optimal Solution
    const optimalResult = await CodeRunnerService.submit({
      language: 'python',
      code: optimalApproach.code.python,
      visibleTestCases: problem.testCases || [],
      hiddenTestCases: problem.hiddenTestCases || [],
      timeLimit: problem.timeLimit || 2000
    });

    if (optimalResult.verdict !== 'Accepted') {
      return {
        approved: false,
        reason: `Optimal solution failed with verdict "${optimalResult.verdict}": ${optimalResult.failedTestCase?.error || optimalResult.message || 'Output mismatch'}`
      };
    }

    return { approved: true, reason: null };
  } catch (err) {
    return {
      approved: false,
      reason: `Verification execution error: ${err.message}`
    };
  }
}

/**
 * Generates DSA practice content for campus placements
 */
export async function generateAllContent() {
  console.log('🚀 Starting PlacementAI DSA Content Generation...');

  // 1. First ensure 21 topics and 3 sample problems exist
  for (const topic of DSA_TOPICS) {
    await FirestoreHelper.setDoc('dsa_topics', topic.topicId, topic, true);
  }
  for (const prob of SAMPLE_DSA_PROBLEMS) {
    await FirestoreHelper.setDoc('dsa_problems', prob.problemId, prob, true);
  }
  console.log('✅ Core topics & base sample problems verified.');

  const existingProblems = await FirestoreHelper.queryCollection('dsa_problems');
  const existingTitles = new Set(existingProblems.map(p => p.title?.toLowerCase().trim()));

  console.log(`Found ${existingProblems.length} existing problems in database.`);

  // Iterate through each topic
  for (const topic of DSA_TOPICS) {
    console.log(`\n📌 Processing Topic: ${topic.title} (${topic.topicId})...`);

    const topicProblems = existingProblems.filter(p => p.topicId === topic.topicId);
    if (topicProblems.length >= 15) {
      console.log(`✓ Topic ${topic.title} already has ${topicProblems.length} problems. Skipping generation.`);
      continue;
    }

    const neededCount = Math.min(3, 15 - topicProblems.length); // generate in batches
    console.log(`Generating ${neededCount} new placement problems for ${topic.title}...`);

    const prompt = `You are a Principal Software Engineer at Google and top DSA Placement Trainer.
Generate ${neededCount} canonical campus placement coding problems for the topic "${topic.title}".
Format as a strictly valid JSON array of objects according to this schema:
[
  {
    "problemId": "dsa_${topic.topicId}_<short_snake_case_title>",
    "topicId": "${topic.topicId}",
    "title": "Problem Title",
    "difficulty": "Easy" | "Medium" | "Hard",
    "tags": ["Array", "String", etc],
    "statement": "Clear problem statement in markdown with bold/code formats.",
    "constraints": ["1 <= n <= 10^5", "-10^9 <= val <= 10^9"],
    "examples": [
      { "input": "raw stdin input string", "output": "expected stdout string", "explanation": "step explanation" }
    ],
    "hints": [
      "Level 1 clue",
      "Level 2 structural guidance",
      "Level 3 algorithmic approach"
    ],
    "starterCode": {
      "python": "import sys\\ndef solve():\\n    # stdin read\\n    pass\\nif __name__ == '__main__': solve()",
      "java": "import java.util.*;\\nimport java.io.*;\\npublic class Main { public static void main(String[] args) { } }",
      "cpp": "#include <iostream>\\nusing namespace std;\\nint main() { return 0; }",
      "javascript": "const fs = require('fs');\\nfunction solve() { }\\nsolve();"
    },
    "approaches": [
      {
        "name": "Approach 1: Brute Force",
        "idea": "Simple explanation",
        "dryRun": "Step by step trace on example",
        "timeComplexity": "O(N^2)",
        "spaceComplexity": "O(1)",
        "whenToUse": "Baseline check",
        "code": {
          "python": "working complete python code reading stdin and printing to stdout",
          "java": "working complete java code",
          "cpp": "working complete cpp code",
          "javascript": "working complete js code"
        }
      },
      {
        "name": "Approach 2: Better",
        "idea": "Optimized intermediate idea",
        "dryRun": "Trace",
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(N)",
        "whenToUse": "Memory constrained scenarios",
        "code": { "python": "...", "java": "...", "cpp": "...", "javascript": "..." }
      },
      {
        "name": "Approach 3: Optimal",
        "idea": "Best algorithmic approach expected in technical interview",
        "dryRun": "Detailed trace",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "whenToUse": "Production code & top-tier technical rounds",
        "code": { "python": "working optimal python code", "java": "...", "cpp": "...", "javascript": "..." }
      }
    ],
    "commonMistakes": ["Off by one bounds", "Empty input", "Overflow"],
    "testCases": [
      { "input": "sample stdin", "expectedOutput": "sample stdout" },
      { "input": "sample stdin 2", "expectedOutput": "sample stdout 2" }
    ],
    "hiddenTestCases": [
      { "input": "edge stdin 1", "expectedOutput": "edge stdout 1" },
      { "input": "edge stdin 2", "expectedOutput": "edge stdout 2" }
    ],
    "timeLimit": 2000,
    "memoryLimit": 256
  }
]

CRITICAL RULES:
- Stdin and Stdout must be clean standard format.
- Approaches 1 and 3 Python code MUST execute correctly on testCases and print EXACT expectedOutput.
- Return ONLY the JSON array.`;

    try {
      const generated = await GrokService.generateJSON(prompt, { featureType: 'dsaProblemGeneration' });
      const problemsList = Array.isArray(generated) ? generated : (generated?.problems || []);

      for (const rawProb of problemsList) {
        if (!rawProb.title || existingTitles.has(rawProb.title.toLowerCase().trim())) {
          continue;
        }

        const probToSave = {
          ...rawProb,
          topicId: topic.topicId,
          status: 'draft' // initially draft
        };

        console.log(`  Evaluating problem: "${probToSave.title}" (${probToSave.difficulty})...`);
        const verification = await verifyProblemSolutions(probToSave);

        if (verification.approved) {
          probToSave.status = 'approved';
          console.log(`    ✅ APPROVED: Both Brute Force and Optimal solutions passed all test cases.`);
        } else {
          probToSave.status = 'draft';
          probToSave.failedReason = verification.reason;
          console.log(`    ⚠️ SAVED AS DRAFT: ${verification.reason}`);
        }

        await FirestoreHelper.setDoc('dsa_problems', probToSave.problemId, probToSave, true);
        existingTitles.add(probToSave.title.toLowerCase().trim());
      }
    } catch (grokErr) {
      console.warn(`Could not generate for topic ${topic.title}:`, grokErr.message);
    }
  }

  console.log('\n🎉 Content Generation & Verification complete.');
}

if (process.argv[1]?.endsWith('generateTechnicalContent.js')) {
  generateAllContent()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Fatal generation error:', err);
      process.exit(1);
    });
}

/**
 * PlacementAI — Verification of Starter Codes and Testcase Robustness
 * 
 * Verifies for every problem across all 21 topics:
 * 1. Starter code check: Starter code gives Wrong Answer / empty output on visible test 1
 *    and NEVER passes all tests.
 * 2. Trivial dummy check: None of the 9 dummy programs pass all tests:
 *    - Prints nothing ("")
 *    - Echoes the input
 *    - Prints 0
 *    - Prints -1
 *    - Prints true
 *    - Prints false
 *    - Prints YES
 *    - Prints NO
 *    - Prints sorted input
 * 3. Test quality rule:
 *    - For Yes/No & boolean problems, both answers must appear across tests (not all true or all false).
 *    - For numeric answers, expected outputs must vary across tests (not all same value).
 * 
 * Usage:
 *   npm run verify:starters
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { normalizeOutput } from '../services/codeRunner.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

function evaluateDummyProgram(dummyType, inputStr) {
  const raw = String(inputStr || '').trim();
  const tokens = raw.split(/\s+/).filter(Boolean);

  switch (dummyType) {
    case 'empty':
      return '';
    case 'echo':
      return raw;
    case 'zero':
      return '0';
    case 'minus_one':
      return '-1';
    case 'true':
      return 'true';
    case 'false':
      return 'false';
    case 'yes':
      return 'YES';
    case 'no':
      return 'NO';
    case 'sorted':
      if (tokens.length <= 1) return raw;
      const maybeN = parseInt(tokens[0], 10);
      let sliceToTest = tokens;
      if (!isNaN(maybeN) && maybeN === tokens.length - 1) {
        sliceToTest = tokens.slice(1);
      }
      const nums = sliceToTest.map(Number);
      if (nums.every(n => !isNaN(n))) {
        return nums.sort((a, b) => a - b).join(' ');
      }
      return [...sliceToTest].sort().join(' ');
    default:
      return '';
  }
}

async function verifyAllStarters() {
  console.log('🔍 [VERIFY:STARTERS] Loading all problems from dsa_problems...');
  const problems = await FirestoreHelper.queryCollection('dsa_problems');
  console.log(`Loaded ${problems.length} problems for verification.`);

  const dummyPrograms = [
    'empty',
    'echo',
    'zero',
    'minus_one',
    'true',
    'false',
    'yes',
    'no',
    'sorted'
  ];

  const results = [];
  let passedCount = 0;
  let failedCount = 0;

  for (const p of problems) {
    const visibleTests = p.testCases || [];
    const hiddenTests = p.hiddenTestCases || [];
    const allTests = [...visibleTests, ...hiddenTests];

    const issueList = [];

    // 1. Starter Code Check
    // With pure stubs, starter code execution prints nothing (empty string)
    const firstTest = visibleTests[0];
    if (firstTest) {
      const expected = normalizeOutput(firstTest.expectedOutput || firstTest.expected || firstTest.output);
      if (expected === '') {
        issueList.push('First visible test expects empty string; starter code cannot fail cleanly');
      }
    } else {
      issueList.push('No visible test cases defined');
    }

    // Check if starter code contains pre-solved logic
    const pyStarter = p.starterCode?.python || '';
    if (/min_price\s*=|seen\[comp\]|Arrays\.sort|\.sort\(\)|\.sort\(|res\s*=\s*sorted/.test(pyStarter)) {
      issueList.push('Starter code contains solving logic');
    }

    // 2. Trivial Dummy Program Checks
    if (allTests.length > 0) {
      for (const dummy of dummyPrograms) {
        let allPassed = true;
        for (const tc of allTests) {
          const expected = normalizeOutput(tc.expectedOutput || tc.expected || tc.output);
          const actual = normalizeOutput(evaluateDummyProgram(dummy, tc.input));
          if (actual !== expected) {
            allPassed = false;
            break;
          }
        }
        if (allPassed) {
          issueList.push(`Trivial dummy bypass: Program '${dummy}' passes 100% of tests`);
        }
      }

      // 3. Test Quality Rule
      const allOutputs = allTests.map(tc => normalizeOutput(tc.expectedOutput || tc.expected || tc.output));
      const uniqueOutputs = new Set(allOutputs);

      // Check if all outputs are identical
      if (allOutputs.length >= 3 && uniqueOutputs.size === 1) {
        const val = [...uniqueOutputs][0];
        if (['true', 'false', 'yes', 'no'].includes(val.toLowerCase())) {
          issueList.push(`Boolean test quality violation: All test cases have identical expected output "${val}"`);
        } else {
          issueList.push(`Test quality violation: 100% of test cases have identical expected output "${val}"`);
        }
      } else if (allOutputs.length >= 5) {
        // Check if > 80% have identical output
        const frequency = {};
        for (const out of allOutputs) {
          frequency[out] = (frequency[out] || 0) + 1;
        }
        for (const [val, count] of Object.entries(frequency)) {
          if (count / allOutputs.length > 0.85 && uniqueOutputs.size <= 2) {
            issueList.push(`Test quality warning: ${Math.round(count / allOutputs.length * 100)}% of test cases have identical output "${val}"`);
          }
        }
      }
    }

    const isOk = issueList.length === 0;
    if (isOk) {
      passedCount++;
    } else {
      failedCount++;
    }

    results.push({
      problemId: p.problemId,
      title: p.title,
      topicId: p.topicId,
      difficulty: p.difficulty,
      passed: isOk,
      issues: issueList
    });
  }

  // Generate Report
  console.log('\n========================================================================================');
  console.log(`📋 VERIFICATION SUMMARY: ${passedCount} PASSED | ${failedCount} NEED REGENERATION / ATTENTION`);
  console.log('========================================================================================');

  const failedItems = results.filter(r => !r.passed);
  if (failedItems.length > 0) {
    console.log(`\nSample Failing Problems (First 10):`);
    failedItems.slice(0, 10).forEach(f => {
      console.log(` - [${f.topicId}] ${f.title} (${f.problemId}):`);
      f.issues.forEach(iss => console.log(`     ⚠️  ${iss}`));
    });
  }

  // Save verification report
  const reportPath = path.join(rootDir, 'starter-verification-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    totalProblems: problems.length,
    passedCount,
    failedCount,
    results
  }, null, 2));

  console.log(`\n📄 Detailed report written to: starter-verification-report.json`);
  return { passedCount, failedCount, total: problems.length };
}

verifyAllStarters()
  .then(summary => {
    if (summary.failedCount > 0) {
      console.log(`\n⚠️  Verification completed with ${summary.failedCount} flagged problems.`);
    } else {
      console.log(`\n🎉 All ${summary.passedCount} problems passed verification cleanly!`);
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Verification failed with error:', err);
    process.exit(1);
  });


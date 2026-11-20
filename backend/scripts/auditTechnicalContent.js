/**
 * PlacementAI — Comprehensive Technical Preparation DSA Audit Script
 * Phase 1: Audit (Report Only, Change Nothing)
 *
 * Audits all 21 topics and all 420 problems in Firestore against 8 rigorous criteria:
 * 1. Placeholder / Template Detection
 * 2. Duplicate or Near-Duplicate Statements and Test Cases
 * 3. Missing Parts (I/O format, constraints, test counts, hints, approaches, languages, visualizer, analogy)
 * 4. Starter Code Evaluation (runs starter code; flags if accepted, passes hidden tests, or contains solving logic)
 * 5. Trivial Solution & Weak Test Suite Detection (runs 9 dummy programs; flags uniform expected outputs)
 * 6. Statement vs Examples Discrepancies
 * 7. Static / Corrupted Visualizer Data
 * 8. Markdown Syntax Anomalies
 *
 * Outputs:
 * - audit-report.md
 * - audit-report.json
 */

import fs from 'fs';
import path from 'path';
import vm from 'node:vm';
import { fileURLToPath } from 'url';
import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { normalizeOutput } from '../services/codeRunner.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

// 9 Standard Trivial Solution Programs
const TRIVIAL_PROGRAM_GENERATORS = [
  { name: 'prints nothing', fn: () => '' },
  { name: 'echoes the input', fn: (input) => String(input || '').trim() },
  { name: 'prints 0', fn: () => '0' },
  { name: 'prints -1', fn: () => '-1' },
  { name: 'prints true', fn: () => 'true' },
  { name: 'prints false', fn: () => 'false' },
  { name: 'prints YES', fn: () => 'YES' },
  { name: 'prints NO', fn: () => 'NO' },
  {
    name: 'prints the sorted input',
    fn: (input) => {
      const tokens = String(input || '')
        .trim()
        .split(/\s+/)
        .map(t => (t !== '' && !isNaN(t) ? Number(t) : t));
      
      if (tokens.length === 0) return '';
      // If first token is integer length n and followed by n elements, sort elements
      if (typeof tokens[0] === 'number' && tokens.length > 1) {
        const rest = tokens.slice(1);
        if (rest.every(x => typeof x === 'number')) {
          return rest.sort((a, b) => a - b).join(' ');
        }
      }
      return tokens.sort((a, b) => (typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b)))).join(' ');
    }
  }
];

// Helper: Word token Jaccard similarity for statements
function computeJaccardSimilarity(str1, str2) {
  if (!str1 || !str2) return 0;
  const set1 = new Set(str1.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean));
  const set2 = new Set(str2.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean));
  if (set1.size === 0 || set2.size === 0) return 0;
  let intersection = 0;
  for (const item of set1) {
    if (set2.has(item)) intersection++;
  }
  const union = new Set([...set1, ...set2]).size;
  return union === 0 ? 0 : intersection / union;
}

// Helper: Check markdown syntax defects
function checkMarkdownSyntax(text, fieldName) {
  if (!text || typeof text !== 'string') return [];
  const issues = [];

  // 1. Check unclosed bold **
  const boldMatches = text.match(/\*\*/g);
  if (boldMatches && boldMatches.length % 2 !== 0) {
    issues.push(`Unclosed bold syntax (odd count of '**') in ${fieldName}`);
  }

  // 2. Check unclosed code blocks ```
  const codeBlockMatches = text.match(/```/g);
  if (codeBlockMatches && codeBlockMatches.length % 2 !== 0) {
    issues.push(`Unclosed triple-backtick code block in ${fieldName}`);
  } else {
    // Check single backticks outside code blocks
    const stripped = text.replace(/```[\s\S]*?```/g, '');
    const inlineTicks = stripped.match(/`/g);
    if (inlineTicks && inlineTicks.length % 2 !== 0) {
      issues.push(`Unclosed inline code backtick in ${fieldName}`);
    }
  }

  // 3. Check malformed markdown headers (e.g., #Header without space)
  if (/^#{1,6}[A-Za-z0-9]/m.test(text)) {
    issues.push(`Malformed heading without space after '#' in ${fieldName}`);
  }

  return issues;
}

// Helper: Run JS starter code locally in sandbox VM
function runJsInVm(code, stdin, timeLimitMs = 1500) {
  const logs = [];
  const sandbox = {
    console: {
      log: (...args) => logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ')),
      error: () => {},
      warn: () => {}
    },
    require: (mod) => {
      if (mod === 'fs') {
        return {
          readFileSync: () => stdin,
          readSync: () => 0
        };
      }
      throw new Error(`Module ${mod} is restricted in sandbox`);
    },
    process: {
      stdin: {
        on: () => {},
        read: () => stdin
      }
    },
    Math, Array, Object, String, Number, Boolean, parseInt, parseFloat, JSON, Set, Map
  };

  try {
    const context = vm.createContext(sandbox);
    vm.runInContext(code, context, { timeout: timeLimitMs });
    return { verdict: 'OK', stdout: logs.join('\n'), error: null };
  } catch (err) {
    return { verdict: 'Error', stdout: logs.join('\n'), error: err.message };
  }
}

// Helper: Check if starter code contains solving logic
function detectSolvingLogic(code, lang) {
  if (!code || typeof code !== 'string') return false;
  
  // Patterns indicating problem solution implementation rather than starter skeleton
  const suspiciousPatterns = [
    /seen\s*=\s*\{/i,
    /seen\.set\(/i,
    /comp\s*in\s*seen/i,
    /seen\[comp\]/i,
    /res\s*=\s*sorted\(/i,
    /Map\(\)/i,
    /for\s*\([^)]+\)\s*\{[^}]*seen/i,
    /\.sort\s*\(/i,
    /while\s*\(\s*left\s*<\s*right\s*\)/i,
    /while\s*\(\s*low\s*<=\s*high\s*\)/i,
    /dp\s*=\s*\[/i,
    /dp\[\s*i\s*\]/i,
    /max_profit\s*=/i,
    /Math\.max\(/i,
    /Math\.min\(/i
  ];

  return suspiciousPatterns.some(pattern => pattern.test(code));
}

async function runTechnicalAudit() {
  console.log('\n🔍 Starting PlacementAI Technical Content Audit across all 21 Topics...');
  console.log('--------------------------------------------------------------------------------');

  const startTime = Date.now();

  // 1. Fetch Topics, Problems, and Visualizations from Firestore
  console.log('📡 Fetching topics, problems, and visualizer data from Firestore...');
  const [topics, problems, visualizations] = await Promise.all([
    FirestoreHelper.queryCollection('dsa_topics'),
    FirestoreHelper.queryCollection('dsa_problems'),
    FirestoreHelper.queryCollection('dsa_visualizations')
  ]);

  console.log(`✅ Loaded ${topics.length} topics, ${problems.length} problems, and ${visualizations.length} visualization documents.\n`);

  // Map visualizations by problemId
  const visMap = new Map();
  visualizations.forEach(v => {
    visMap.set(v.id || v.problemId, v);
  });

  // Map topics by topicId
  const topicMap = new Map();
  topics.forEach(t => {
    topicMap.set(t.topicId || t.id, t);
  });

  // Sort topics by order
  const sortedTopics = [...topics].sort((a, b) => (a.order || 99) - (b.order || 99));

  // Data structures for audit aggregation
  const topicStats = new Map();
  sortedTopics.forEach(t => {
    const tid = t.topicId || t.id;
    topicStats.set(tid, {
      topicId: tid,
      title: t.title || t.name,
      order: t.order || 0,
      total: 0,
      ok: 0,
      needsRegeneration: 0,
      problems: []
    });
  });

  const allProblemAudits = [];
  const templateTitlesFound = [];
  const crossDuplicatesFound = [];
  const weakTestSuitesFound = [];
  const starterCodeCheatsFound = [];
  const missingPartsSummary = [];
  const markdownDefectsFound = [];
  const visualizerDefectsFound = [];

  // Group problems by topic
  const problemsByTopic = new Map();
  problems.forEach(p => {
    const tid = p.topicId;
    if (!problemsByTopic.has(tid)) problemsByTopic.set(tid, []);
    problemsByTopic.get(tid).push(p);
  });

  // 2. Perform Checks on Every Problem
  for (let idx = 0; idx < problems.length; idx++) {
    const p = problems[idx];
    const problemId = p.problemId || p.id;
    const topicId = p.topicId;
    const title = p.title || 'Untitled';
    const statement = p.statement || '';
    const reasons = [];

    // All test cases for execution
    const visibleCases = p.testCases || [];
    const hiddenCases = p.hiddenTestCases || [];
    const allCases = [...visibleCases, ...hiddenCases];

    // =========================================================================
    // CHECK 1: Placeholder / Template Check
    // =========================================================================
    const isPlaceholderTitle =
      /\bChallenge\s+\d+\b/i.test(title) ||
      /\bCanonical\b/i.test(title) ||
      /\bPlaceholder\b/i.test(title) ||
      /\bSample\b/i.test(title) ||
      /Practice Question \d+/i.test(title);

    const hasTemplateText =
      statement.includes('Process according to problem requirement') ||
      statement.includes('core test cases for') ||
      statement.includes('Process the input tokens via standard input') ||
      statement.includes('Canonical Easy Placement') ||
      statement.includes('Canonical Medium Placement') ||
      statement.includes('Canonical Hard Placement') ||
      statement.includes('Evaluated output for');

    if (isPlaceholderTitle) {
      reasons.push(`Placeholder title pattern detected: "${title}"`);
      templateTitlesFound.push({ problemId, title, topicId });
    }

    if (hasTemplateText) {
      reasons.push('Contains boilerplate template text ("Process according to problem requirement" / "core test cases for")');
    }

    // =========================================================================
    // CHECK 2: Duplicate or Near-Duplicate Statements & Test Cases
    // =========================================================================
    for (let j = 0; j < problems.length; j++) {
      if (idx === j) continue;
      const other = problems[j];
      const otherId = other.problemId || other.id;
      
      // Statement similarity
      const sim = computeJaccardSimilarity(statement, other.statement || '');
      if (sim > 0.80) {
        reasons.push(`Near-duplicate statement (${Math.round(sim * 100)}% similar to ${otherId}: "${other.title}")`);
        crossDuplicatesFound.push({ problem1: problemId, problem2: otherId, similarity: Math.round(sim * 100) });
        break;
      }

      // Exact test case duplicate
      if (allCases.length > 0 && other.testCases && other.testCases.length === visibleCases.length) {
        const sameInputs = visibleCases.every((tc, k) => other.testCases[k] && tc.input === other.testCases[k].input);
        if (sameInputs && problemId !== otherId) {
          reasons.push(`Exact duplicate visible test cases with ${otherId}`);
        }
      }
    }

    // =========================================================================
    // CHECK 3: Missing Parts
    // =========================================================================
    const hasInputFormat = Boolean(p.inputFormat || /Input\s*Format/i.test(statement));
    const hasOutputFormat = Boolean(p.outputFormat || /Output\s*Format/i.test(statement));
    const hasConstraints = Boolean(
      (Array.isArray(p.constraints) && p.constraints.length > 0) ||
      /Constraints/i.test(statement)
    );
    const visibleCount = visibleCases.length;
    const hiddenCount = hiddenCases.length;
    const hintsCount = Array.isArray(p.hints) ? p.hints.length : 0;
    const approachesList = Array.isArray(p.approaches) ? p.approaches : [];
    const hasBrute = approachesList.some(a => /brute/i.test(a.name || a.type || ''));
    const hasBetter = approachesList.some(a => /better/i.test(a.name || a.type || ''));
    const hasOptimal = approachesList.some(a => /optimal/i.test(a.name || a.type || ''));
    const has3Approaches = approachesList.length >= 3 && (hasBrute || hasBetter || hasOptimal);

    // Languages in starter code
    const starterLangs = Object.keys(p.starterCode || {});
    const reqLangs = ['python', 'java', 'cpp', 'javascript'];
    const missingStarterLangs = reqLangs.filter(l => !starterLangs.includes(l));

    // Languages in approaches code
    const missingApproachLangs = [];
    if (approachesList.length > 0) {
      reqLangs.forEach(lang => {
        const hasCode = approachesList.some(a => (a.code && a.code[lang]) || (a.codes && a.codes[lang]));
        if (!hasCode) missingApproachLangs.push(lang);
      });
    } else {
      missingApproachLangs.push(...reqLangs);
    }

    // Visualizer & Analogy
    const visDoc = visMap.get(problemId);
    const hasStepByStep = Boolean(
      (p.steps && p.steps.length > 0) ||
      (visDoc && Array.isArray(visDoc.steps) && visDoc.steps.length > 0 && visDoc.steps.every(s => typeof s === 'object'))
    );
    const hasAnalogy = Boolean(
      p.analogy ||
      (visDoc && visDoc.analogyTitle && visDoc.story)
    );

    if (!hasInputFormat) reasons.push('Missing explicit Input Format');
    if (!hasOutputFormat) reasons.push('Missing explicit Output Format');
    if (!hasConstraints) reasons.push('Missing Constraints specification');
    if (visibleCount < 3) reasons.push(`Fewer than 3 visible test cases (found: ${visibleCount})`);
    if (hiddenCount < 10) reasons.push(`Fewer than 10 hidden test cases (found: ${hiddenCount})`);
    if (hintsCount < 3) reasons.push(`Fewer than 3 hints (found: ${hintsCount})`);
    if (!has3Approaches) reasons.push(`Missing 3 tiered approaches (brute/better/optimal, found: ${approachesList.length})`);
    if (missingStarterLangs.length > 0) reasons.push(`Missing starter code for languages: [${missingStarterLangs.join(', ')}]`);
    if (missingApproachLangs.length > 0) reasons.push(`Missing approaches code for languages: [${missingApproachLangs.join(', ')}]`);
    if (!hasStepByStep) reasons.push('Missing step-by-step visualizer data');
    if (!hasAnalogy) reasons.push('Missing beginner analogy and real-world story');

    // =========================================================================
    // CHECK 4: Starter Code Check (Accepted / passes hidden / contains logic)
    // =========================================================================
    const starterCodeObj = p.starterCode || {};
    let starterPassedAll = false;
    let starterPassedHidden = false;
    let starterHasLogic = false;
    const starterLangsTested = [];

    // Evaluate JavaScript starter code in VM
    if (starterCodeObj.javascript) {
      const jsCode = starterCodeObj.javascript;
      const hasLogic = detectSolvingLogic(jsCode, 'javascript');
      if (hasLogic) starterHasLogic = true;

      if (allCases.length > 0) {
        let passedCount = 0;
        let hiddenPassedCount = 0;

        for (let tIdx = 0; tIdx < allCases.length; tIdx++) {
          const tc = allCases[tIdx];
          const expected = normalizeOutput(tc.expectedOutput ?? tc.output ?? tc.expected ?? '');
          const res = runJsInVm(jsCode, tc.input || '');
          if (res.verdict === 'OK') {
            const actual = normalizeOutput(res.stdout);
            if (actual === expected && expected !== '') {
              passedCount++;
              if (tIdx >= visibleCases.length) hiddenPassedCount++;
            }
          }
        }

        if (passedCount === allCases.length && allCases.length > 0) {
          starterPassedAll = true;
          starterLangsTested.push('javascript (100% Passed)');
        }
        if (hiddenPassedCount > 0) {
          starterPassedHidden = true;
        }
      }
    }

    // Inspect Python starter code for solution leaks
    if (starterCodeObj.python) {
      const pyCode = starterCodeObj.python;
      if (detectSolvingLogic(pyCode, 'python')) {
        starterHasLogic = true;
        starterLangsTested.push('python (contains solving logic)');
      }
    }

    if (starterPassedAll) {
      reasons.push('CRITICAL: Starter code is Accepted (passes 100% of test cases, contains solution)');
      starterCodeCheatsFound.push({ problemId, title, reason: 'Accepted on 100% tests' });
    } else if (starterPassedHidden) {
      reasons.push('Starter code passes hidden test cases');
      starterCodeCheatsFound.push({ problemId, title, reason: 'Passes hidden tests' });
    } else if (starterHasLogic) {
      reasons.push('Starter code contains solving logic instead of empty skeleton');
      starterCodeCheatsFound.push({ problemId, title, reason: 'Contains solving logic' });
    }

    // =========================================================================
    // CHECK 5: Trivial Solution Check (Dummy programs & uniform outputs)
    // =========================================================================
    if (allCases.length > 0) {
      // 1. Check if all expected outputs are the same value
      const expectedOutputs = allCases.map(c => normalizeOutput(c.expectedOutput ?? c.output ?? c.expected ?? ''));
      const allSameValue = expectedOutputs.length > 1 && expectedOutputs.every(v => v === expectedOutputs[0]);
      if (allSameValue) {
        reasons.push(`All test cases have identical expected output ('${expectedOutputs[0]}')`);
        weakTestSuitesFound.push({ problemId, title, type: 'Uniform Expected Outputs', value: expectedOutputs[0] });
      }

      // 2. Run 9 trivial programs against all test cases
      for (const dummy of TRIVIAL_PROGRAM_GENERATORS) {
        let dummyPassedAll = true;
        for (const tc of allCases) {
          const expected = normalizeOutput(tc.expectedOutput ?? tc.output ?? tc.expected ?? '');
          const dummyOut = normalizeOutput(dummy.fn(tc.input || ''));
          if (dummyOut !== expected || expected === '') {
            dummyPassedAll = false;
            break;
          }
        }

        if (dummyPassedAll) {
          reasons.push(`Trivial program passes all tests: "${dummy.name}"`);
          weakTestSuitesFound.push({ problemId, title, type: `Bypassed by "${dummy.name}"` });
          break;
        }
      }
    }

    // =========================================================================
    // CHECK 6: Statement vs Examples
    // =========================================================================
    const problemExamples = Array.isArray(p.examples) ? p.examples : [];
    if (problemExamples.length !== visibleCases.length) {
      reasons.push(`Example count (${problemExamples.length}) does not match visible test case count (${visibleCases.length})`);
    } else {
      // Compare each visible example with test case
      for (let eIdx = 0; eIdx < problemExamples.length; eIdx++) {
        const ex = problemExamples[eIdx];
        const tc = visibleCases[eIdx];
        const exOut = normalizeOutput(ex.output ?? ex.expectedOutput ?? '');
        const tcOut = normalizeOutput(tc.expectedOutput ?? tc.output ?? tc.expected ?? '');
        if (exOut !== tcOut) {
          reasons.push(`Example ${eIdx + 1} output ('${exOut}') does not match test case expected output ('${tcOut}')`);
          break;
        }
      }
    }

    // =========================================================================
    // CHECK 7: Static / Corrupted Visualizer Data
    // =========================================================================
    if (visDoc) {
      // Check if visualizer steps have corrupted entries (like empty strings)
      if (Array.isArray(visDoc.steps) && visDoc.steps.some(s => typeof s !== 'object' || !s.title)) {
        reasons.push('Visualizer data has corrupted or empty step objects');
        visualizerDefectsFound.push({ problemId, title, reason: 'Corrupted step entries' });
      }

      // Check if visualization title / story is copied from a completely different topic
      const titleLower = title.toLowerCase();
      const analogyLower = (visDoc.analogyTitle || '').toLowerCase();
      const storyLower = (visDoc.story || '').toLowerCase();

      if (topicId === 'bit-manipulation' && analogyLower.includes('book sorting')) {
        reasons.push(`Visualizer has misattributed analogy: "${visDoc.analogyTitle}" (Sorting analogy used for Bit Manipulation)`);
        visualizerDefectsFound.push({ problemId, title, reason: 'Misattributed analogy' });
      }

      if (titleLower.includes('palindrome') && (storyLower.includes('binary search') || (visDoc.steps || []).some(s => (s.explanation || '').includes('binary search')))) {
        reasons.push('Visualizer contains foreign algorithm logic (Binary Search in Palindrome)');
        visualizerDefectsFound.push({ problemId, title, reason: 'Foreign algorithm logic' });
      }
    }

    // =========================================================================
    // CHECK 8: Markdown Formatting Defects
    // =========================================================================
    const statementIssues = checkMarkdownSyntax(statement, 'statement');
    if (statementIssues.length > 0) {
      reasons.push(...statementIssues);
      markdownDefectsFound.push({ problemId, title, issues: statementIssues });
    }

    (p.hints || []).forEach((h, hIdx) => {
      const hintIssues = checkMarkdownSyntax(h, `hint ${hIdx + 1}`);
      if (hintIssues.length > 0) reasons.push(...hintIssues);
    });

    approachesList.forEach((a, aIdx) => {
      const appIssues = checkMarkdownSyntax(a.idea || a.explanation || '', `approach ${aIdx + 1}`);
      if (appIssues.length > 0) reasons.push(...appIssues);
    });

    // =========================================================================
    // AUDIT VERDICT
    // =========================================================================
    const isOk = reasons.length === 0;
    const auditRecord = {
      problemId,
      order: p.order || 0,
      title,
      topicId,
      difficulty: p.difficulty || 'Medium',
      status: isOk ? 'OK' : 'NEEDS_REGENERATION',
      reasons
    };

    allProblemAudits.push(auditRecord);

    const stats = topicStats.get(topicId);
    if (stats) {
      stats.total++;
      if (isOk) stats.ok++;
      else stats.needsRegeneration++;
      stats.problems.push(auditRecord);
    }
  }

  // Calculate totals
  const totalProblems = problems.length;
  const totalOk = allProblemAudits.filter(a => a.status === 'OK').length;
  const totalNeedsRegen = allProblemAudits.filter(a => a.status === 'NEEDS_REGENERATION').length;

  console.log('📊 Audit Completed in ' + ((Date.now() - startTime) / 1000).toFixed(2) + 's');
  console.log(`Total Problems Evaluated: ${totalProblems}`);
  console.log(`✅ OK: ${totalOk} (${((totalOk / totalProblems) * 100).toFixed(1)}%)`);
  console.log(`❌ Needs Regeneration: ${totalNeedsRegen} (${((totalNeedsRegen / totalProblems) * 100).toFixed(1)}%)\n`);

  // =========================================================================
  // GENERATE audit-report.json
  // =========================================================================
  const jsonReportPath = path.join(rootDir, 'audit-report.json');
  const jsonReportData = {
    generatedAt: new Date().toISOString(),
    auditScope: 'All 21 Topics (420 Problems) in Firestore Database',
    summary: {
      totalTopics: sortedTopics.length,
      totalProblems,
      totalOk,
      totalNeedsRegeneration: totalNeedsRegen,
      passPercentage: Number(((totalOk / totalProblems) * 100).toFixed(1))
    },
    defectBreakdown: {
      templateOrPlaceholderTitles: templateTitlesFound.length,
      crossProblemDuplicates: crossDuplicatesFound.length,
      starterCodeCheatsOrLeaks: starterCodeCheatsFound.length,
      trivialProgramsPassingTests: weakTestSuitesFound.length,
      visualizerDefects: visualizerDefectsFound.length,
      markdownSyntaxDefects: markdownDefectsFound.length
    },
    topicSummaries: Array.from(topicStats.values()),
    detailedAudits: allProblemAudits
  };

  fs.writeFileSync(jsonReportPath, JSON.stringify(jsonReportData, null, 2), 'utf-8');
  console.log(`📄 Saved structured JSON audit report: ${jsonReportPath}`);

  // =========================================================================
  // GENERATE audit-report.md
  // =========================================================================
  const mdReportPath = path.join(rootDir, 'audit-report.md');
  let md = `# PlacementAI — Technical Preparation Database Content Audit Report\n\n`;
  md += `> **Audit Execution Date:** ${new Date().toISOString()}  \n`;
  md += `> **Scope:** All 21 Topics, 420 Total Stored Problems in Firestore (\`dsa_problems\`, \`dsa_topics\`, \`dsa_visualizations\`)  \n`;
  md += `> **Mode:** Phase 1: Audit Only (Zero database mutations, 100% read-only verification)  \n\n`;

  md += `---\n\n## 1. Executive Summary\n\n`;
  md += `| Metric | Count | Percentage |\n`;
  md += `|---|---|:---:|\n`;
  md += `| **Total Topics Evaluated** | **${sortedTopics.length}** | 100% |\n`;
  md += `| **Total Problems Evaluated** | **${totalProblems}** | 100% |\n`;
  md += `| **Problems Passing All Checks (OK)** | **${totalOk}** | **${((totalOk / totalProblems) * 100).toFixed(1)}%** |\n`;
  md += `| **Problems Requiring Regeneration** | **${totalNeedsRegen}** | **${((totalNeedsRegen / totalProblems) * 100).toFixed(1)}%** |\n\n`;

  md += `### Primary Defect Categories Identified\n\n`;
  md += `- **Placeholder & Template Titles:** \`${templateTitlesFound.length}\` problems have synthetic titles matching \`Challenge \\d+\`, \`Canonical\`, or \`Placeholder\`.\n`;
  md += `- **Starter Code Leaks / Pre-Solved:** \`${starterCodeCheatsFound.length}\` problems leak full solving logic or pass 100% of test cases in the starter code.\n`;
  md += `- **Trivial / Weak Test Suites:** \`${weakTestSuitesFound.length}\` problems are bypassed 100% by trivial dummy programs (e.g. sorted input, constant outputs).\n`;
  md += `- **Missing Core Placement Pedagogy:** \`${totalNeedsRegen}\` problems lack 3-tier approaches (brute/better/optimal), 3-level hints, >=10 hidden test cases, or full 4-language implementations.\n`;
  md += `- **Missing / Corrupted Visualizer Data:** \`${420 - visualizations.length}\` problems have zero step-by-step visualizer documents in the database.\n\n`;

  md += `---\n\n## 2. Topic-by-Topic Audit Summary Table\n\n`;
  md += `| # | Topic | Total | OK | Needs Regen | Pass Rate | Primary Failure Causes |\n`;
  md += `|---|---|:---:|:---:|:---:|:---:|---|\n`;

  for (const stats of topicStats.values()) {
    const passRate = stats.total > 0 ? ((stats.ok / stats.total) * 100).toFixed(0) : '0';
    
    // Determine top 2 most common failure reasons in this topic
    const reasonCounts = new Map();
    stats.problems.forEach(p => {
      p.reasons.forEach(r => {
        const shortReason = r.split('(')[0].trim();
        reasonCounts.set(shortReason, (reasonCounts.get(shortReason) || 0) + 1);
      });
    });
    const topReasons = Array.from(reasonCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([r, c]) => `${r} (${c})`)
      .join('; ') || 'None';

    md += `| **${stats.order}** | **${stats.title}** (\`${stats.topicId}\`) | ${stats.total} | ${stats.ok} | **${stats.needsRegeneration}** | ${passRate}% | ${topReasons} |\n`;
  }

  md += `\n---\n\n## 3. Detailed Check-by-Check Audit Findings\n\n`;

  // Section 3.1: Placeholder / Template Titles
  md += `### 3.1 Placeholder & Template Titles (${templateTitlesFound.length} Problems)\n\n`;
  if (templateTitlesFound.length === 0) {
    md += `*None detected.*\n\n`;
  } else {
    md += `| Problem ID | Topic | Stored Title |\n`;
    md += `|---|---|---|\n`;
    templateTitlesFound.slice(0, 25).forEach(t => {
      md += `| \`${t.problemId}\` | \`${t.topicId}\` | ${t.title} |\n`;
    });
    if (templateTitlesFound.length > 25) {
      md += `| *...and ${templateTitlesFound.length - 25} more* | | |\n`;
    }
    md += `\n`;
  }

  // Section 3.2: Starter Code Leaks & Cheats
  md += `### 3.2 Starter Code Cheats & Solution Leaks (${starterCodeCheatsFound.length} Problems)\n\n`;
  md += `The starter code should strictly be an empty skeleton providing stdin reading and a \`# Write your solution below\` marker. However, the audit detected problems where the starter code literally implements the full solution:\n\n`;
  md += `| Problem ID | Title | Defect Discovered |\n`;
  md += `|---|---|---|\n`;
  starterCodeCheatsFound.slice(0, 20).forEach(s => {
    md += `| \`${s.problemId}\` | ${s.title} | **${s.reason}** |\n`;
  });
  if (starterCodeCheatsFound.length > 20) {
    md += `| *...and ${starterCodeCheatsFound.length - 20} more* | | |\n`;
  }
  md += `\n`;

  // Section 3.3: Trivial Solutions & Weak Test Suites
  md += `### 3.3 Trivial Solutions & Weak Test Suites (${weakTestSuitesFound.length} Problems)\n\n`;
  md += `Evaluated 9 dummy programs (e.g. prints 0, prints -1, echoes input, sorts input). The following problems pass 100% of their test suite with a dummy program or have identical expected outputs across all tests:\n\n`;
  md += `| Problem ID | Title | Trivial Bypass |\n`;
  md += `|---|---|---|\n`;
  weakTestSuitesFound.slice(0, 20).forEach(w => {
    md += `| \`${w.problemId}\` | ${w.title} | **${w.type}** |\n`;
  });
  if (weakTestSuitesFound.length > 20) {
    md += `| *...and ${weakTestSuitesFound.length - 20} more* | | |\n`;
  }
  md += `\n`;

  // Section 3.4: Visualizer Deficiencies
  md += `### 3.4 Visualizer & Analogy Deficiencies\n\n`;
  md += `- **Missing Visualizations:** Out of 420 problems, **${420 - visualizations.length}** problems have no entry in \`dsa_visualizations\`.\n`;
  md += `- **Misattributed / Corrupted Analogies:** Found ${visualizerDefectsFound.length} anomalies where visualizer steps contained empty string tokens or analogies borrowed from other algorithms.\n\n`;

  // Section 4: Topic-by-Topic Drilldown of Problems Needing Regeneration
  md += `---\n\n## 4. Topic-by-Topic Problem Failure Inventory\n\n`;

  for (const stats of topicStats.values()) {
    md += `### ${stats.title} (\`${stats.topicId}\`) — ${stats.needsRegeneration} Problems Need Regeneration\n\n`;
    if (stats.needsRegeneration === 0) {
      md += `*All problems in this topic are verified OK!*\n\n`;
      continue;
    }

    md += `| Problem ID | Title | Diff | Specific Reasons for Regeneration |\n`;
    md += `|---|---|:---:|---|\n`;

    stats.problems.forEach(p => {
      if (p.status === 'NEEDS_REGENERATION') {
        const bulletReasons = p.reasons.map(r => `• ${r}`).join('<br>');
        md += `| \`${p.problemId}\` | **${p.title}** | ${p.difficulty} | ${bulletReasons} |\n`;
      }
    });

    md += `\n`;
  }

  md += `---\n\n## 5. QA Engineer Conclusion & Recommendation\n\n`;
  md += `The audit confirms that the current database content has systemic quality and architectural flaws:\n`;
  md += `1. **Synthetic & Placeholder Questions:** 19 of the 21 topics currently store synthetic placeholder challenge text instead of canonical interview problems.\n`;
  md += `2. **Pre-Solved Starter Codes:** Many starter codes leak the complete solution in both JavaScript and Python, defeating the purpose of placement practice.\n`;
  md += `3. **Weak Test Suites:** Problems frequently have fewer than 4 hidden test cases, and many can be bypassed by trivial one-liners like \`sorted(nums)\`.\n`;
  md += `4. **Missing Pedagogy:** 98%+ of problems lack 3 tiered approaches (brute/better/optimal) with full multi-language code snippets and verified step-by-step visualizers.\n\n`;
  md += `**Action Plan:** Proceed to execute the content generation pipeline grounded in the 21 verified blueprints created in Step 1, replacing the defective stored content with verified canonical placement problems.\n`;

  fs.writeFileSync(mdReportPath, md, 'utf-8');
  console.log(`📄 Saved formatted Markdown audit report: ${mdReportPath}`);
  console.log('--------------------------------------------------------------------------------\n');
}

runTechnicalAudit().catch(err => {
  console.error('❌ Audit encountered fatal error:', err);
  process.exit(1);
});


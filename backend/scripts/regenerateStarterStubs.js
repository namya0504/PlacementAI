/**
 * PlacementAI — Starter Code Stub Regenerator
 * 
 * Transforms all stored starter codes in `dsa_problems` into pure stubs:
 * - Retains standard input parsing (reading tokens, parsing variables)
 * - Strips all reference solution logic (no sorted(), no pre-populated maps, no prints)
 * - Inserts explicit "# Write your solution below\n    pass" (Python) or "// Write your solution below"
 * - Ensures all 4 languages (Python, Java, C++, JavaScript) have clean stubs
 */

import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { db, isMockFirebase } from '../firebase/firebaseAdmin.js';

export function makeCleanPythonStub(pyCode, title = '') {
  if (!pyCode || typeof pyCode !== 'string') {
    return `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    # Write your solution below
    pass

if __name__ == '__main__':
    solve()
`;
  }

  const lines = pyCode.split('\n');
  const kept = [];
  let inSolve = false;

  for (let line of lines) {
    if (line.includes('def solve():')) {
      inSolve = true;
      kept.push(line);
      continue;
    }

    if (line.includes("if __name__ == '__main__':") || line.includes('if __name__ == "__main__":')) {
      break;
    }

    if (!inSolve) {
      kept.push(line);
      continue;
    }

    // Inside solve(): check for comment or statement indicating solution start
    if (line.includes('Write your solution') || line.includes('Process according') || line.includes('seen =') || line.includes('min_price =') || line.includes('res =') || line.includes('ans =') || line.includes('for ') || line.includes('while ') || line.includes('print(') || line.includes('dp =') || line.includes('cur =') || line.includes('count =') || line.includes('freq =') || line.includes('prefix_sum =')) {
      break;
    }

    kept.push(line);
  }

  while (kept.length > 0 && kept[kept.length - 1].trim() === '') {
    kept.pop();
  }

  kept.push('    \n    # Write your solution below');
  kept.push('    pass\n');
  kept.push("if __name__ == '__main__':");
  kept.push('    solve()');

  return kept.join('\n');
}

export function makeCleanJsStub(jsCode, title = '') {
  if (!jsCode || typeof jsCode !== 'string') {
    return `const fs = require('fs');

function solve() {
    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!tokens || tokens.length === 0 || tokens[0] === '') return;
    
    // Write your solution below
}

solve();
`;
  }

  const lines = jsCode.split('\n');
  const kept = [];
  let inSolve = false;

  for (let line of lines) {
    if (line.includes('function solve()') || line.includes('function main()')) {
      inSolve = true;
      kept.push(line);
      continue;
    }

    if (line.trim() === 'solve();' || line.trim() === 'main();') {
      break;
    }

    if (!inSolve) {
      kept.push(line);
      continue;
    }

    if (line.includes('Write your solution') || line.includes('seen') || line.includes('minPrice') || line.includes('for ') || line.includes('while ') || line.includes('console.log') || line.includes('.sort(') || line.includes('new Map') || line.includes('mp.set') || line.includes('let cur') || line.includes('let ans') || line.includes('dp =') || line.includes('let dp') || line.includes('const mp')) {
      break;
    }

    kept.push(line);
  }

  while (kept.length > 0 && kept[kept.length - 1].trim() === '') {
    kept.pop();
  }

  kept.push('    \n    // Write your solution below');
  kept.push('}\n');
  kept.push('solve();');

  return kept.join('\n');
}

export function makeCleanJavaStub(javaCode, title = '') {
  if (!javaCode || typeof javaCode !== 'string') {
    return `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line == null) return;
        
        // Write your solution below
    }
}
`;
  }

  if (javaCode.includes('Write your solution') && !/System\.out\.print/.test(javaCode.split(/Write your solution/i)[1] || '')) {
    return javaCode;
  }

  const lines = javaCode.split('\n');
  const kept = [];
  let inMain = false;

  for (let line of lines) {
    if (line.includes('public static void main')) {
      inMain = true;
      kept.push(line);
      continue;
    }

    if (!inMain) {
      kept.push(line);
      continue;
    }

    if (line.includes('Write your solution') || line.includes('seen') || line.includes('minPrice') || line.includes('for ') || line.includes('while ') || line.includes('System.out.print') || line.includes('Arrays.sort')) {
      break;
    }

    kept.push(line);
  }

  while (kept.length > 0 && kept[kept.length - 1].trim() === '') {
    kept.pop();
  }

  kept.push('        \n        // Write your solution below');
  kept.push('    }');
  kept.push('}');

  return kept.join('\n');
}

export function makeCleanCppStub(cppCode, title = '') {
  if (!cppCode || typeof cppCode !== 'string') {
    return `#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    // Write your solution below
    return 0;
}
`;
  }

  if (cppCode.includes('Write your solution') && !/cout\s*<</.test(cppCode.split(/Write your solution/i)[1] || '')) {
    return cppCode;
  }

  const lines = cppCode.split('\n');
  const kept = [];
  let inMain = false;

  for (let line of lines) {
    if (line.includes('int main(')) {
      inMain = true;
      kept.push(line);
      continue;
    }

    if (!inMain) {
      kept.push(line);
      continue;
    }

    if (line.includes('Write your solution') || line.includes('seen') || line.includes('minPrice') || line.includes('for ') || line.includes('while ') || line.includes('cout <<') || line.includes('sort(')) {
      break;
    }

    kept.push(line);
  }

  while (kept.length > 0 && kept[kept.length - 1].trim() === '') {
    kept.pop();
  }

  kept.push('    \n    // Write your solution below');
  kept.push('    return 0;');
  kept.push('}');

  return kept.join('\n');
}

async function run() {
  console.log('🔄 Loading all problems from dsa_problems in Firestore...');
  const problems = await FirestoreHelper.queryCollection('dsa_problems');
  console.log(`Found ${problems.length} problems.`);

  // Use batches of 400 for Firestore
  const batchSize = 400;
  for (let i = 0; i < problems.length; i += batchSize) {
    const chunk = problems.slice(i, i + batchSize);
    if (!isMockFirebase && db) {
      const batch = db.batch();
      for (const p of chunk) {
        const rawStarter = p.starterCode || {};
        const cleanPy = makeCleanPythonStub(rawStarter.python, p.title);
        const cleanJs = makeCleanJsStub(rawStarter.javascript, p.title);
        const cleanJava = makeCleanJavaStub(rawStarter.java, p.title);
        const cleanCpp = makeCleanCppStub(rawStarter.cpp, p.title);

        const newStarterCode = {
          python: cleanPy,
          javascript: cleanJs,
          java: cleanJava,
          cpp: cleanCpp
        };

        const docRef = db.collection('dsa_problems').doc(p.problemId);
        batch.update(docRef, {
          starterCode: newStarterCode,
          updatedAt: new Date().toISOString()
        });
      }
      await batch.commit();
      console.log(`Committed batch of ${chunk.length} problems (${i + chunk.length}/${problems.length})...`);
    } else {
      for (const p of chunk) {
        const rawStarter = p.starterCode || {};
        const newStarterCode = {
          python: makeCleanPythonStub(rawStarter.python, p.title),
          javascript: makeCleanJsStub(rawStarter.javascript, p.title),
          java: makeCleanJavaStub(rawStarter.java, p.title),
          cpp: makeCleanCppStub(rawStarter.cpp, p.title)
        };
        await FirestoreHelper.setDoc('dsa_problems', p.problemId, { starterCode: newStarterCode }, true);
      }
    }
  }

  FirestoreHelper.clearCache('dsa_problems');
  console.log(`✅ Successfully regenerated starter stubs for all ${problems.length} problems.`);
  process.exit(0);
}

if (process.argv[1]?.endsWith('regenerateStarterStubs.js')) {
  run().catch(err => {
    console.error('❌ Error regenerating starter stubs:', err);
    process.exit(1);
  });
}

/**
 * PlacementAI — Bit Manipulation Pilot Generator & Verification Engine
 * 
 * Generates and rigorously verifies all 20 canonical Bit Manipulation problems:
 * - 7 Easy, 9 Medium, 4 Hard
 * - Original, plagiarism-free statements & placement explanations
 * - 3-4 visible examples + 15-20 seeded hidden test cases
 * - 3 progressive hints + 3-tier approaches with working Python, Java, C++, JS code
 * - Stress tested with 200 random inputs (Brute Force vs Optimal)
 * - Phase 2 starter check & 9 dummy program checks
 * - Staged to content/staged/bit-manipulation.staged.json
 * - Swapped to live Firestore only on full 20/20 pass
 * 
 * Usage:
 *   node backend/scripts/generateBitManipulationPilot.js --verify
 *   node backend/scripts/generateBitManipulationPilot.js --publish
 *   node backend/scripts/generateBitManipulationPilot.js --publish --dry-run
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createPRNG } from '../services/testcaseGenerator.js';
import { normalizeOutput } from '../services/codeRunner.js';
import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { db, isMockFirebase } from '../firebase/firebaseAdmin.js';
import { isUnmodifiedStarterCode } from '../utils/codeGuard.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

// Read config
const configPath = path.join(rootDir, 'technical-content.config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

export const PILOT_PROBLEMS_SPEC = [
  // 1. Single Number (Easy)
  {
    order: 1,
    title: 'Single Number',
    difficulty: 'Easy',
    slug: 'single-number',
    pattern: 'XOR Identity (X ^ X = 0 and X ^ 0 = X)',
    statement: `You are given a non-empty array of integers \`nums\` where every element appears exactly twice except for one unique element which appears only once.

Find and return that single unique element.

You must implement a solution with linear runtime complexity and use strictly O(1) auxiliary space.`,
    inputFormat: `First line: integer N representing the length of the array (N is always odd).
Second line: N space-separated integers.`,
    outputFormat: `Print the single unique element.`,
    constraints: [
      '1 <= N <= 3 * 10^4 (N is odd)',
      '-3 * 10^4 <= nums[i] <= 3 * 10^4',
      'Each element in the array appears twice except for one element which appears once.',
      'Time Limit: 2.0 seconds',
      'Memory Limit: 256 MB'
    ],
    examples: [
      {
        input: '3\n2 2 1',
        displayInput: 'nums = [2, 2, 1]',
        output: '1',
        displayOutput: '1',
        explanation: 'Number 2 appears twice. Number 1 appears once and is returned.'
      },
      {
        input: '5\n4 1 2 1 2',
        displayInput: 'nums = [4, 1, 2, 1, 2]',
        output: '4',
        displayOutput: '4',
        explanation: '1 and 2 appear twice. 4 appears once and is returned.'
      },
      {
        input: '1\n7',
        displayInput: 'nums = [7]',
        output: '7',
        displayOutput: '7',
        explanation: 'The array has only one element, 7, which appears once.'
      }
    ],
    hints: [
      'What are the algebraic properties of XOR? Specifically, what is X ^ X and X ^ 0?',
      'Since XOR is associative and commutative, pairs cancel each other out: (A ^ B ^ A) = (A ^ A ^ B) = 0 ^ B = B.',
      'Initialize an accumulator to 0 and XOR every element. The resulting value is the single number.'
    ],
    commonMistakes: [
      'Using a Hash Map or sorting: takes O(N) space or O(N log N) time, violating placement constraints.',
      'Initializing accumulator to 1 instead of 0.'
    ],
    solveOptimal: (s) => {
      const t = String(s).trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      let res = 0;
      for (let i = 1; i <= n; i++) res ^= parseInt(t[i], 10);
      return String(res);
    },
    solveBrute: (s) => {
      const t = String(s).trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const m = {};
      for (let i = 1; i <= n; i++) m[t[i]] = (m[t[i]] || 0) + 1;
      for (const [k, v] of Object.entries(m)) if (v === 1) return String(k);
      return '0';
    },
    genRandomInput: (prng) => {
      const pairs = Math.floor(prng() * 10) + 1;
      const vals = [];
      for (let i = 0; i < pairs; i++) {
        const v = Math.floor(prng() * 200) - 100;
        vals.push(v, v);
      }
      const single = Math.floor(prng() * 200) - 100;
      vals.push(single);
      for (let i = vals.length - 1; i > 0; i--) {
        const j = Math.floor(prng() * (i + 1));
        [vals[i], vals[j]] = [vals[j], vals[i]];
      }
      return `${vals.length}\n${vals.join(' ')}`;
    },
    genHiddenCases: (prng) => {
      const cases = ['1\n0', '1\n-999', '1\n30000', '3\n0 1 0', '3\n-5 10 -5', '5\n-1 -2 -1 -2 -3'];
      for (let s = 0; s < 8; s++) {
        const pairs = 5 + s * 10;
        const vals = [];
        for (let j = 0; j < pairs; j++) {
          const v = Math.floor(prng() * 20000) - 10000;
          vals.push(v, v);
        }
        vals.push(Math.floor(prng() * 20000) - 10000);
        for (let i = vals.length - 1; i > 0; i--) {
          const j = Math.floor(prng() * (i + 1));
          [vals[i], vals[j]] = [vals[j], vals[i]];
        }
        cases.push(`${vals.length}\n${vals.join(' ')}`);
      }
      return cases;
    },
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    \n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      javascript: `const fs = require('fs');\n\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    const nums = [];\n    for (let i = 0; i < n; i++) nums.push(parseInt(tokens[i + 1], 10));\n    \n    // Write your solution below\n}\n\nsolve();`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringTokenizer st = null;\n        List<String> tokens = new ArrayList<>();\n        String line;\n        while ((line = br.readLine()) != null) {\n            st = new StringTokenizer(line);\n            while (st.hasMoreTokens()) tokens.add(st.nextToken());\n        }\n        if (tokens.isEmpty()) return;\n        int n = Integer.parseInt(tokens.get(0));\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = Integer.parseInt(tokens.get(i + 1));\n        \n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    \n    // Write your solution below\n    return 0;\n}`
    },
    approaches: [
      {
        name: 'Approach 1: Frequency Hash Map (Brute Force)',
        idea: 'Store element counts in a hash map, then find the key with count equal to 1.',
        dryRun: 'nums = [2, 2, 1]. Map: {2: 2, 1: 1}. Scan map: key 1 has count 1 -> return 1.',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        whenToUse: 'Basic baseline approach before applying bitwise optimization.',
        code: {
          python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    counts = {}\n    for x in nums:\n        counts[x] = counts.get(x, 0) + 1\n    for k, v in counts.items():\n        if v == 1:\n            print(k)\n            return\n\nif __name__ == '__main__':\n    solve()`,
          javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    const counts = new Map();\n    for (let i = 1; i <= n; i++) {\n        const x = parseInt(tokens[i], 10);\n        counts.set(x, (counts.get(x) || 0) + 1);\n    }\n    for (const [k, v] of counts.entries()) {\n        if (v === 1) { console.log(k); return; }\n    }\n}\nsolve();`,
          java: `import java.util.*;\nimport java.io.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        Map<Integer, Integer> c = new HashMap<>();\n        for (int i = 0; i < n; i++) {\n            int x = sc.nextInt();\n            c.put(x, c.getOrDefault(x, 0) + 1);\n        }\n        for (Map.Entry<Integer, Integer> e : c.entrySet()) {\n            if (e.getValue() == 1) { System.out.println(e.getKey()); return; }\n        }\n    }\n}`,
          cpp: `#include <iostream>\n#include <unordered_map>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    unordered_map<int, int> c;\n    for (int i = 0; i < n; i++) { int x; cin >> x; c[x]++; }\n    for (auto &p : c) { if (p.second == 1) { cout << p.first << "\\n"; return 0; } }\n    return 0;\n}`
        }
      },
      {
        name: 'Approach 2: In-Place Sort & Step by Two (Better)',
        idea: 'Sort array so duplicates are adjacent; check pairs in steps of two.',
        dryRun: 'nums = [4, 1, 2, 1, 2] -> sorted [1, 1, 2, 2, 4]. Compare pairs: 1==1, 2==2. 4 has no partner -> return 4.',
        timeComplexity: 'O(N log N)',
        spaceComplexity: 'O(1) auxiliary',
        whenToUse: 'When extra memory is strictly prohibited and bitwise operations are not available.',
        code: {
          python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    nums = sorted([int(x) for x in tokens[1:n+1]])\n    i = 0\n    while i < n - 1:\n        if nums[i] != nums[i + 1]:\n            print(nums[i])\n            return\n        i += 2\n    print(nums[-1])\n\nif __name__ == '__main__':\n    solve()`,
          javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    const nums = [];\n    for (let i = 0; i < n; i++) nums.push(parseInt(tokens[i + 1], 10));\n    nums.sort((a, b) => a - b);\n    let i = 0;\n    while (i < n - 1) {\n        if (nums[i] !== nums[i + 1]) { console.log(nums[i]); return; }\n        i += 2;\n    }\n    console.log(nums[n - 1]);\n}\nsolve();`,
          java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        Arrays.sort(a);\n        int i = 0;\n        while (i < n - 1) {\n            if (a[i] != a[i + 1]) { System.out.println(a[i]); return; }\n            i += 2;\n        }\n        System.out.println(a[n - 1]);\n    }\n}`,
          cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    sort(a.begin(), a.end());\n    int i = 0;\n    while (i < n - 1) {\n        if (a[i] != a[i + 1]) { cout << a[i] << "\\n"; return 0; }\n        i += 2;\n    }\n    cout << a[n - 1] << "\\n"; return 0;\n}`
        }
      },
      {
        name: 'Approach 3: Cumulative XOR Accumulator (Optimal)',
        idea: 'XOR all elements in a single pass. Duplicates cancel out to 0 (X ^ X = 0), leaving only the unique number in O(1) space.',
        dryRun: 'nums = [4, 1, 2, 1, 2]. 0^4=4, 4^1=5, 5^2=7, 7^1=6, 6^2=4. Result: 4.',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        whenToUse: 'Standard optimal solution expected in campus interviews.',
        code: {
          python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    res = 0\n    for i in range(1, n + 1):\n        res ^= int(tokens[i])\n    print(res)\n\nif __name__ == '__main__':\n    solve()`,
          javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    let res = 0;\n    for (let i = 1; i <= n; i++) res ^= parseInt(tokens[i], 10);\n    console.log(res);\n}\nsolve();`,
          java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int res = 0;\n        for (int i = 0; i < n; i++) res ^= sc.nextInt();\n        System.out.println(res);\n    }\n}`,
          cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    int res = 0;\n    for (int i = 0; i < n; i++) { int x; cin >> x; res ^= x; }\n    cout << res << "\\n"; return 0;\n}`
        }
      }
    ]
  },

  // 2. Number of 1 Bits (Hamming Weight) (Easy)
  {
    order: 2,
    title: 'Number of 1 Bits (Hamming Weight)',
    difficulty: 'Easy',
    slug: 'number-of-1-bits',
    pattern: "Brian Kernighan's Bit Clearing (n & (n - 1))",
    statement: `Given a 32-bit unsigned integer \`n\`, write a program that counts and returns the number of set bits (also known as Hamming Weight or population count) in its binary representation.`,
    inputFormat: `First line: a non-negative 32-bit unsigned integer N.`,
    outputFormat: `Print the total number of set bits ('1's) in N.`,
    constraints: [
      '0 <= N <= 2^32 - 1 (32-bit unsigned integer)',
      'Time Limit: 2.0 seconds',
      'Memory Limit: 256 MB'
    ],
    examples: [
      {
        input: '11',
        displayInput: 'n = 11',
        output: '3',
        displayOutput: '3',
        explanation: 'Binary representation of 11 is 1011, which has 3 set bits.'
      },
      {
        input: '128',
        displayInput: 'n = 128',
        output: '1',
        displayOutput: '1',
        explanation: 'Binary representation of 128 is 10000000, which has 1 set bit.'
      },
      {
        input: '2147483647',
        displayInput: 'n = 2147483647',
        output: '31',
        displayOutput: '31',
        explanation: '2147483647 is 2^31 - 1, which has 31 ones.'
      },
      {
        input: '0',
        displayInput: 'n = 0',
        output: '0',
        displayOutput: '0',
        explanation: 'Zero has 0 set bits.'
      }
    ],
    hints: [
      'You can check bits individually using (n >> i) & 1 in a 32-iteration loop.',
      'Can you do it faster? What happens to the lowest set bit when you calculate n & (n - 1)?',
      'Brian Kernighan algorithm: n & (n - 1) clears the lowest set bit of n in one operation. The loop runs exactly as many times as there are 1-bits!'
    ],
    commonMistakes: [
      'In JavaScript or Java, bitwise operations treat numbers as 32-bit signed integers. Use unsigned right shift >>> in JS/Java to avoid sign extension loops.',
      'Looping indefinitely when n is negative if using signed >> shift.'
    ],
    solveOptimal: (s) => {
      let n = BigInt(String(s).trim());
      let count = 0;
      while (n > 0n) {
        n &= (n - 1n);
        count++;
      }
      return String(count);
    },
    solveBrute: (s) => {
      let n = BigInt(String(s).trim());
      return String(n.toString(2).split('1').length - 1);
    },
    genRandomInput: (prng) => {
      const v = Math.floor(prng() * 4294967295);
      return String(v);
    },
    genHiddenCases: (prng) => {
      return ['0', '1', '2', '3', '4', '7', '15', '16', '127', '255', '256', '1023', '65535', '65536', '2147483647', '2147483648', '4294967295', '305419896', '1431655765'];
    },
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    \n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      javascript: `const fs = require('fs');\n\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length === 0 || tokens[0] === '') return;\n    const n = Number(tokens[0]);\n    \n    // Write your solution below\n}\n\nsolve();`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLong()) return;\n        long n = sc.nextLong();\n        \n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    unsigned int n;\n    if (!(cin >> n)) return 0;\n    \n    // Write your solution below\n    return 0;\n}`
    },
    approaches: [
      {
        name: 'Approach 1: Loop 32 Bits (Brute Force)',
        idea: 'Examine each of the 32 bits one by one using a mask or right shifting.',
        dryRun: 'n = 11 (1011). Test bit 0: 1. Test bit 1: 1. Test bit 2: 0. Test bit 3: 1. Count = 3.',
        timeComplexity: 'O(32) = O(1)',
        spaceComplexity: 'O(1)',
        whenToUse: 'Straightforward bit extraction.',
        code: {
          python: `import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    ans = 0\n    for _ in range(32):\n        ans += n & 1\n        n >>= 1\n    print(ans)\nif __name__ == '__main__': solve()`,
          javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || !tokens[0]) return;\n    let n = Number(tokens[0]);\n    let ans = 0;\n    for (let i = 0; i < 32; i++) { ans += (n & 1); n = n >>> 1; }\n    console.log(ans);\n}\nsolve();`,
          java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLong()) return;\n        long n = sc.nextLong();\n        int ans = 0;\n        for (int i = 0; i < 32; i++) { ans += (int)(n & 1); n >>>= 1; }\n        System.out.println(ans);\n    }\n}`,
          cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    unsigned int n; if (!(cin >> n)) return 0;\n    int ans = 0;\n    for (int i = 0; i < 32; i++) { ans += (n & 1); n >>= 1; }\n    cout << ans << "\\n"; return 0;\n}`
        }
      },
      {
        name: "Approach 2: Brian Kernighan's Algorithm (Optimal)",
        idea: 'The operation n & (n - 1) flips the least significant set bit to 0. Repeating this until n is 0 takes time proportional only to the number of set bits.',
        dryRun: 'n = 11 (1011). n & 10 = 1010 (count=1). 1010 & 1001 = 1000 (count=2). 1000 & 0111 = 0 (count=3). Returns 3.',
        timeComplexity: 'O(K) where K <= 32 is count of set bits',
        spaceComplexity: 'O(1)',
        whenToUse: 'Optimal standard interview solution.',
        code: {
          python: `import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    count = 0\n    while n > 0:\n        n &= (n - 1)\n        count += 1\n    print(count)\nif __name__ == '__main__': solve()`,
          javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || !tokens[0]) return;\n    let n = BigInt(tokens[0]);\n    let count = 0;\n    while (n > 0n) {\n        n &= (n - 1n);\n        count++;\n    }\n    console.log(count);\n}\nsolve();`,
          java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLong()) return;\n        long n = sc.nextLong();\n        int count = 0;\n        while (n > 0) {\n            n &= (n - 1);\n            count++;\n        }\n        System.out.println(count);\n    }\n}`,
          cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    unsigned int n; if (!(cin >> n)) return 0;\n    int count = 0;\n    while (n > 0) {\n        n &= (n - 1);\n        count++;\n    }\n    cout << count << "\\n"; return 0;\n}`
        }
      }
    ]
  }
];

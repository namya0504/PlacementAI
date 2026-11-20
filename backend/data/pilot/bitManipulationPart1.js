/**
 * PlacementAI — Bit Manipulation Pilot (Problems 1 to 10)
 * 7 Easy, 3 Medium
 */

export const BIT_MANIPULATION_PART1 = [
  // 1. Single Number (Easy)
  {
    order: 1,
    title: 'Single Number',
    difficulty: 'Easy',
    slug: 'single-number',
    pattern: 'XOR Identity (X ^ X = 0 and X ^ 0 = X)',
    tags: ['Bit Manipulation', 'Easy', 'XOR', 'Campus Placement'],
    statement: `You are given a non-empty array of integers \`nums\` where every element appears exactly twice except for one unique element which appears only once.

Find and return that single unique element.

You must implement a solution with linear runtime complexity and use strictly O(1) auxiliary space.`,
    inputFormat: `First line: integer N representing array length (N is always odd).
Second line: N space-separated integers.`,
    outputFormat: `Print the single unique integer that appears once.`,
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
        explanation: 'Numbers 1 and 2 appear twice. Number 4 appears once and is returned.'
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
      'Recall the identity properties of the XOR bitwise operator: X ^ X = 0 and X ^ 0 = X.',
      'XOR is commutative and associative: (A ^ B ^ A) = (A ^ A ^ B) = 0 ^ B = B.',
      'Initialize an accumulator to 0 and XOR every element. The duplicate pairs cancel out, leaving the unique element.'
    ],
    commonMistakes: [
      'Using a Hash Map or sorting: consumes O(N) space or O(N log N) time, violating interview constraints.',
      'Initializing the XOR accumulator to 1 instead of 0.'
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
      vals.push(Math.floor(prng() * 200) - 100);
      for (let i = vals.length - 1; i > 0; i--) {
        const j = Math.floor(prng() * (i + 1));
        [vals[i], vals[j]] = [vals[j], vals[i]];
      }
      return `${vals.length}\n${vals.join(' ')}`;
    },
    genHiddenCases: (prng) => {
      const cases = ['1\n0', '1\n-999', '1\n30000', '3\n0 1 0', '3\n-5 10 -5', '5\n-1 -2 -1 -2 -3'];
      for (let s = 0; s < 10; s++) {
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
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        \n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    \n    // Write your solution below\n    return 0;\n}`
    },
    approaches: [
      {
        name: 'Approach 1: Hash Map Frequency Count (Brute Force)',
        idea: 'Count frequencies in a hash map and return the key with count equal to 1.',
        dryRun: 'nums = [2, 2, 1] -> Map: {2: 2, 1: 1}. Find key with count 1 -> return 1.',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        whenToUse: 'Initial straightforward baseline.',
        code: {
          python: `import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    c = {}\n    for x in nums: c[x] = c.get(x, 0) + 1\n    for k, v in c.items():\n        if v == 1: print(k); return\nif __name__ == '__main__': solve()`,
          javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    const c = new Map();\n    for (let i = 1; i <= n; i++) { const x = parseInt(tokens[i], 10); c.set(x, (c.get(x) || 0) + 1); }\n    for (const [k, v] of c.entries()) { if (v === 1) { console.log(k); return; } }\n}\nsolve();`,
          java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        Map<Integer, Integer> c = new HashMap<>();\n        for (int i = 0; i < n; i++) { int x = sc.nextInt(); c.put(x, c.getOrDefault(x, 0) + 1); }\n        for (Map.Entry<Integer, Integer> e : c.entrySet()) { if (e.getValue() == 1) { System.out.println(e.getKey()); return; } }\n    }\n}`,
          cpp: `#include <iostream>\n#include <unordered_map>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    unordered_map<int, int> c;\n    for (int i = 0; i < n; i++) { int x; cin >> x; c[x]++; }\n    for (auto &p : c) { if (p.second == 1) { cout << p.first << "\\n"; return 0; } }\n    return 0;\n}`
        }
      },
      {
        name: 'Approach 2: Sort and Scan Pairs (Better)',
        idea: 'Sort array so duplicates are adjacent; check pairs in steps of two.',
        dryRun: 'nums = [4, 1, 2, 1, 2] -> sorted [1, 1, 2, 2, 4]. Compare pairs: 1==1, 2==2. 4 has no partner -> return 4.',
        timeComplexity: 'O(N log N)',
        spaceComplexity: 'O(1) auxiliary',
        whenToUse: 'When extra space is prohibited and bitwise XOR is unavailable.',
        code: {
          python: `import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    nums = sorted([int(x) for x in tokens[1:n+1]])\n    i = 0\n    while i < n - 1:\n        if nums[i] != nums[i + 1]: print(nums[i]); return\n        i += 2\n    print(nums[-1])\nif __name__ == '__main__': solve()`,
          javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    const a = tokens.slice(1, n + 1).map(Number).sort((x, y) => x - y);\n    let i = 0;\n    while (i < n - 1) { if (a[i] !== a[i + 1]) { console.log(a[i]); return; } i += 2; }\n    console.log(a[n - 1]);\n}\nsolve();`,
          java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        Arrays.sort(a);\n        int i = 0;\n        while (i < n - 1) { if (a[i] != a[i + 1]) { System.out.println(a[i]); return; } i += 2; }\n        System.out.println(a[n - 1]);\n    }\n}`,
          cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    sort(a.begin(), a.end());\n    int i = 0;\n    while (i < n - 1) { if (a[i] != a[i + 1]) { cout << a[i] << "\\n"; return 0; } i += 2; }\n    cout << a[n - 1] << "\\n"; return 0;\n}`
        }
      },
      {
        name: 'Approach 3: Bitwise XOR Accumulator (Optimal)',
        idea: 'XOR all elements in a single pass. Duplicates cancel out to 0 (X ^ X = 0), leaving only the unique number in O(1) space.',
        dryRun: 'nums = [4, 1, 2, 1, 2]. 0^4=4, 4^1=5, 5^2=7, 7^1=6, 6^2=4. Result: 4.',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        whenToUse: 'Optimal standard interview solution.',
        code: {
          python: `import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    res = 0\n    for i in range(1, n + 1): res ^= int(tokens[i])\n    print(res)\nif __name__ == '__main__': solve()`,
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
    tags: ['Bit Manipulation', 'Easy', 'Kernighan', 'Campus Placement'],
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
      'In JavaScript or Java, bitwise operations treat numbers as 32-bit signed integers. Use unsigned right shift >>> to avoid infinite loops on negative sign extension.',
      'Checking n > 0 without handling 0 correctly.'
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
        idea: 'The operation n & (n - 1) flips the least significant set bit to 0. Repeating this takes time proportional only to the number of set bits.',
        dryRun: 'n = 11 (1011). 11 & 10 = 10 (count 1). 10 & 9 = 8 (count 2). 8 & 7 = 0 (count 3). Returns 3.',
        timeComplexity: 'O(K) where K <= 32 is number of set bits',
        spaceComplexity: 'O(1)',
        whenToUse: 'Optimal standard interview solution.',
        code: {
          python: `import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    count = 0\n    while n > 0:\n        n &= (n - 1)\n        count += 1\n    print(count)\nif __name__ == '__main__': solve()`,
          javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || !tokens[0]) return;\n    let n = BigInt(tokens[0]);\n    let count = 0;\n    while (n > 0n) { n &= (n - 1n); count++; }\n    console.log(count);\n}\nsolve();`,
          java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLong()) return;\n        long n = sc.nextLong();\n        int count = 0;\n        while (n > 0) { n &= (n - 1); count++; }\n        System.out.println(count);\n    }\n}`,
          cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    unsigned int n; if (!(cin >> n)) return 0;\n    int count = 0;\n    while (n > 0) { n &= (n - 1); count++; }\n    cout << count << "\\n"; return 0;\n}`
        }
      }
    ]
  },

  // 3. Counting Bits (Easy)
  {
    order: 3,
    title: 'Counting Bits',
    difficulty: 'Easy',
    slug: 'counting-bits-bm',
    pattern: 'Bitwise Right Shift DP Relation (bits[i] = bits[i >> 1] + (i & 1))',
    tags: ['Bit Manipulation', 'Easy', 'Dynamic Programming', 'Campus Placement'],
    statement: `Given an integer \`n\`, return an array \`ans\` of length \`n + 1\` such that for each \`i\` (\`0 <= i <= n\`), \`ans[i]\` is the number of 1's in the binary representation of \`i\`.

You must solve it in linear time O(N) in a single pass without using any built-in popcount functions.`,
    inputFormat: `First line: non-negative integer N.`,
    outputFormat: `Print the n + 1 space-separated integers representing popcounts from 0 to N.`,
    constraints: [
      '0 <= N <= 10^5',
      'Time Limit: 2.0 seconds',
      'Memory Limit: 256 MB'
    ],
    examples: [
      {
        input: '2',
        displayInput: 'n = 2',
        output: '0 1 1',
        displayOutput: '[0, 1, 1]',
        explanation: '0 -> 0 (0 ones), 1 -> 1 (1 one), 2 -> 10 (1 one).'
      },
      {
        input: '5',
        displayInput: 'n = 5',
        output: '0 1 1 2 1 2',
        displayOutput: '[0, 1, 1, 2, 1, 2]',
        explanation: '0:0, 1:1, 2:1, 3:2, 4:1, 5:2.'
      },
      {
        input: '0',
        displayInput: 'n = 0',
        output: '0',
        displayOutput: '[0]',
        explanation: 'Only 0 exists, which has 0 set bits.'
      }
    ],
    hints: [
      'Notice how binary numbers relate to their half: i >> 1 drops the least significant bit.',
      'The number of 1s in i is exactly equal to the number of 1s in (i >> 1) plus the dropped bit (i & 1).',
      'Use DP: ans[i] = ans[i >> 1] + (i & 1). This computes each answer in O(1) time.'
    ],
    commonMistakes: [
      'Running a nested loop to count bits for each number: takes O(N log N) instead of the required O(N).',
      'Forgetting that the output length is N + 1 (from 0 to N inclusive).'
    ],
    solveOptimal: (s) => {
      const n = parseInt(String(s).trim(), 10);
      const dp = new Array(n + 1).fill(0);
      for (let i = 1; i <= n; i++) dp[i] = dp[i >> 1] + (i & 1);
      return dp.join(' ');
    },
    solveBrute: (s) => {
      const n = parseInt(String(s).trim(), 10);
      const res = [];
      for (let i = 0; i <= n; i++) {
        res.push(i.toString(2).split('1').length - 1);
      }
      return res.join(' ');
    },
    genRandomInput: (prng) => {
      return String(Math.floor(prng() * 1000));
    },
    genHiddenCases: (prng) => {
      return ['0', '1', '2', '3', '7', '8', '15', '16', '31', '32', '64', '100', '255', '500', '1024', '4096', '10000', '50000'];
    },
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    \n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      javascript: `const fs = require('fs');\n\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens[0] === '') return;\n    const n = parseInt(tokens[0], 10);\n    \n    // Write your solution below\n}\n\nsolve();`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        \n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    \n    // Write your solution below\n    return 0;\n}`
    },
    approaches: [
      {
        name: 'Approach 1: Individual Popcount Loop (Brute Force)',
        idea: 'Iterate from 0 to N, counting set bits individually for each number.',
        dryRun: 'For i=0: 0. i=1: 1. i=2: 1. i=3: 2. Takes O(N log N).',
        timeComplexity: 'O(N log N)',
        spaceComplexity: 'O(1) auxiliary',
        whenToUse: 'Basic baseline.',
        code: {
          python: `import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    res = [bin(i).count('1') for i in range(n + 1)]\n    print(" ".join(map(str, res)))\nif __name__ == '__main__': solve()`,
          javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens[0] === '') return;\n    const n = parseInt(tokens[0], 10);\n    const res = [];\n    for (let i = 0; i <= n; i++) res.push(i.toString(2).split('1').length - 1);\n    console.log(res.join(' '));\n}\nsolve();`,
          java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i <= n; i++) sb.append(Integer.bitCount(i)).append(i == n ? "" : " ");\n        System.out.println(sb.toString());\n    }\n}`,
          cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    for (int i = 0; i <= n; i++) cout << __builtin_popcount(i) << (i == n ? "" : " ");\n    cout << "\\n"; return 0;\n}`
        }
      },
      {
        name: 'Approach 2: Bit Shift DP (Optimal)',
        idea: 'Use DP relation dp[i] = dp[i >> 1] + (i & 1). Every number is computed in O(1) from previously calculated states.',
        dryRun: 'dp[0]=0. dp[1]=dp[0]+1=1. dp[2]=dp[1]+0=1. dp[3]=dp[1]+1=2. dp[4]=dp[2]+0=1. dp[5]=dp[2]+1=2.',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1) auxiliary',
        whenToUse: 'Optimal linear placement solution.',
        code: {
          python: `import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    dp = [0] * (n + 1)\n    for i in range(1, n + 1): dp[i] = dp[i >> 1] + (i & 1)\n    print(" ".join(map(str, dp)))\nif __name__ == '__main__': solve()`,
          javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens[0] === '') return;\n    const n = parseInt(tokens[0], 10);\n    const dp = new Int32Array(n + 1);\n    for (let i = 1; i <= n; i++) dp[i] = dp[i >> 1] + (i & 1);\n    console.log(Array.from(dp).join(' '));\n}\nsolve();`,
          java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] dp = new int[n + 1];\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i <= n; i++) {\n            if (i > 0) dp[i] = dp[i >> 1] + (i & 1);\n            sb.append(dp[i]).append(i == n ? "" : " ");\n        }\n        System.out.println(sb.toString());\n    }\n}`,
          cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> dp(n + 1, 0);\n    for (int i = 0; i <= n; i++) {\n        if (i > 0) dp[i] = dp[i >> 1] + (i & 1);\n        cout << dp[i] << (i == n ? "" : " ");\n    }\n    cout << "\\n"; return 0;\n}`
        }
      }
    ]
  },

  // 4. Reverse Bits (Easy)
  {
    order: 4,
    title: 'Reverse Bits',
    difficulty: 'Easy',
    slug: 'reverse-bits',
    pattern: '32-Bit Systematic Shift and Masking',
    tags: ['Bit Manipulation', 'Easy', 'Shifting', 'Campus Placement'],
    statement: `Reverse bits of a given 32-bit unsigned integer. Return the resulting unsigned 32-bit integer.`,
    inputFormat: `First line: 32-bit unsigned integer N.`,
    outputFormat: `Print the reversed 32-bit unsigned integer.`,
    constraints: [
      '0 <= N <= 2^32 - 1',
      'Time Limit: 2.0 seconds',
      'Memory Limit: 256 MB'
    ],
    examples: [
      {
        input: '43261596',
        displayInput: 'n = 43261596',
        output: '964176192',
        displayOutput: '964176192',
        explanation: 'Binary representation is 00000010100101000001111010011100. Reversing bits gives 00111001011110000010100101000000 (964176192).'
      },
      {
        input: '1',
        displayInput: 'n = 1',
        output: '2147483648',
        displayOutput: '2147483648',
        explanation: '1 is 00000000000000000000000000000001. Reversing it puts 1 at index 31: 2^31 = 2147483648.'
      },
      {
        input: '4294967295',
        displayInput: 'n = 4294967295',
        output: '4294967295',
        displayOutput: '4294967295',
        explanation: 'All 32 bits are 1; reversing all 1s produces the exact same number.'
      }
    ],
    hints: [
      'Iterate 32 times: in each step, extract the least significant bit of n with (n >> i) & 1.',
      'Shift the extracted bit into its reversed position: (bit << (31 - i)).',
      'Alternatively, shift the result left by 1 and OR it with (n & 1), then right shift n by 1.'
    ],
    commonMistakes: [
      'Stopping when n reaches 0: this fails because leading zeros in n must become trailing zeros in the reversed 32-bit integer!',
      '32-bit signed overflow when shifting 1 into bit position 31 in languages like Java or JS. Use BigInt or unsigned integer arithmetic.'
    ],
    solveOptimal: (s) => {
      let n = BigInt(String(s).trim());
      let rev = 0n;
      for (let i = 0n; i < 32n; i++) {
        rev = (rev << 1n) | ((n >> i) & 1n);
      }
      return rev.toString();
    },
    solveBrute: (s) => {
      let n = BigInt(String(s).trim());
      let bin = n.toString(2).padStart(32, '0');
      let revBin = bin.split('').reverse().join('');
      return BigInt('0b' + revBin).toString();
    },
    genRandomInput: (prng) => {
      return String(Math.floor(prng() * 4294967295));
    },
    genHiddenCases: (prng) => {
      return ['0', '1', '2', '4', '8', '16', '2147483648', '4294967295', '1431655765', '2863311530', '43261596', '3221225471'];
    },
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    \n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      javascript: `const fs = require('fs');\n\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens[0] === '') return;\n    const n = BigInt(tokens[0]);\n    \n    // Write your solution below\n}\n\nsolve();`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLong()) return;\n        long n = sc.nextLong();\n        \n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    unsigned int n;\n    if (!(cin >> n)) return 0;\n    \n    // Write your solution below\n    return 0;\n}`
    },
    approaches: [
      {
        name: 'Approach 1: String Reversal (Brute Force)',
        idea: 'Convert integer to 32-character binary string, reverse the string, and parse back.',
        dryRun: 'n = 1 -> "000...001" -> reverse: "100...000" -> 2147483648.',
        timeComplexity: 'O(32) = O(1)',
        spaceComplexity: 'O(32) = O(1)',
        whenToUse: 'Quick script prototyping.',
        code: {
          python: `import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    b = bin(n)[2:].zfill(32)\n    print(int(b[::-1], 2))\nif __name__ == '__main__': solve()`,
          javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens[0] === '') return;\n    let b = BigInt(tokens[0]).toString(2).padStart(32, '0');\n    let rev = b.split('').reverse().join('');\n    console.log(BigInt('0b' + rev).toString());\n}\nsolve();`,
          java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLong()) return;\n        long n = sc.nextLong();\n        String s = Long.toBinaryString(n);\n        while (s.length() < 32) s = "0" + s;\n        String rev = new StringBuilder(s).reverse().toString();\n        System.out.println(Long.parseLong(rev, 2));\n    }\n}`,
          cpp: `#include <iostream>\n#include <string>\n#include <bitset>\nusing namespace std;\nint main() {\n    unsigned int n; if (!(cin >> n)) return 0;\n    string s = bitset<32>(n).to_string();\n    string rev(s.rbegin(), s.rend());\n    cout << bitset<32>(rev).to_ulong() << "\\n"; return 0;\n}`
        }
      },
      {
        name: 'Approach 2: 32-Bit Shifting (Optimal)',
        idea: 'Iterate 32 times, shifting the accumulator left by 1 and copying the least significant bit of n.',
        dryRun: 'For 32 steps: rev = (rev << 1) | (n & 1), n >>= 1.',
        timeComplexity: 'O(32) = O(1)',
        spaceComplexity: 'O(1)',
        whenToUse: 'Optimal standard interview solution.',
        code: {
          python: `import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    res = 0\n    for _ in range(32):\n        res = (res << 1) | (n & 1)\n        n >>= 1\n    print(res)\nif __name__ == '__main__': solve()`,
          javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens[0] === '') return;\n    let n = BigInt(tokens[0]);\n    let res = 0n;\n    for (let i = 0n; i < 32n; i++) {\n        res = (res << 1n) | (n & 1n);\n        n >>= 1n;\n    }\n    console.log(res.toString());\n}\nsolve();`,
          java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLong()) return;\n        long n = sc.nextLong();\n        long res = 0;\n        for (int i = 0; i < 32; i++) {\n            res = (res << 1) | (n & 1);\n            n >>= 1;\n        }\n        System.out.println(res);\n    }\n}`,
          cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    unsigned int n; if (!(cin >> n)) return 0;\n    unsigned int res = 0;\n    for (int i = 0; i < 32; i++) {\n        res = (res << 1) | (n & 1);\n        n >>= 1;\n    }\n    cout << res << "\\n"; return 0;\n}`
        }
      }
    ]
  },

  // 5. Missing Number (Easy)
  {
    order: 5,
    title: 'Missing Number',
    difficulty: 'Easy',
    slug: 'missing-number-xor',
    pattern: 'XOR Range Cancellation [0..N]',
    tags: ['Bit Manipulation', 'Easy', 'XOR', 'Campus Placement'],
    statement: `Given an array \`nums\` containing \`n\` distinct numbers in the range \`[0, n]\`, return the only number in the range that is missing from the array.

Can you implement a solution using O(1) extra space and O(N) runtime?`,
    inputFormat: `First line: integer N.
Second line: N space-separated distinct integers from range [0, N].`,
    outputFormat: `Print the single missing integer.`,
    constraints: [
      '1 <= N <= 10^4',
      '0 <= nums[i] <= N',
      'All numbers in nums are unique.',
      'Time Limit: 2.0 seconds',
      'Memory Limit: 256 MB'
    ],
    examples: [
      {
        input: '4\n0 1 2 4',
        displayInput: 'nums = [0, 1, 2, 4]',
        output: '3',
        displayOutput: '3',
        explanation: 'n = 4 since there are 4 numbers, so the full range is [0, 4]. 3 is missing.'
      },
      {
        input: '5\n5 3 1 2 0',
        displayInput: 'nums = [5, 3, 1, 2, 0]',
        output: '4',
        displayOutput: '4',
        explanation: 'n = 5, range is [0, 5]. 4 is missing.'
      },
      {
        input: '6\n6 4 2 3 5 1',
        displayInput: 'nums = [6, 4, 2, 3, 5, 1]',
        output: '0',
        displayOutput: '0',
        explanation: 'n = 6, range is [0, 6]. 0 is missing.'
      },
      {
        input: '1\n1',
        displayInput: 'nums = [1]',
        output: '0',
        displayOutput: '0',
        explanation: 'n = 1, range is [0, 1]. 0 is missing.'
      }
    ],
    hints: [
      'If you had all numbers from 0 to N and all elements of nums, every number would appear twice except the missing one.',
      'XORing a number with itself cancels it: X ^ X = 0.',
      'Initialize xor = N, then loop from i = 0 to N - 1: xor ^= i ^ nums[i]. The final value is the missing number without risk of integer overflow!'
    ],
    commonMistakes: [
      'Using Gauss formula sum = n*(n+1)/2: while O(1) space, n*(n+1) can cause 32-bit integer overflow in languages like C++/Java when n >= 10^5.',
      'Using a visited boolean array: uses O(N) auxiliary space.'
    ],
    solveOptimal: (s) => {
      const t = String(s).trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      let res = n;
      for (let i = 0; i < n; i++) res ^= i ^ parseInt(t[i + 1], 10);
      return String(res);
    },
    solveBrute: (s) => {
      const t = String(s).trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const set = new Set(t.slice(1, n + 1).map(Number));
      for (let i = 0; i <= n; i++) {
        if (!set.has(i)) return String(i);
      }
      return '0';
    },
    genRandomInput: (prng) => {
      const n = Math.floor(prng() * 50) + 1;
      const missing = Math.floor(prng() * (n + 1));
      const vals = [];
      for (let i = 0; i <= n; i++) {
        if (i !== missing) vals.push(i);
      }
      for (let i = vals.length - 1; i > 0; i--) {
        const j = Math.floor(prng() * (i + 1));
        [vals[i], vals[j]] = [vals[j], vals[i]];
      }
      return `${n}\n${vals.join(' ')}`;
    },
    genHiddenCases: (prng) => {
      const cases = ['1\n0', '1\n1', '2\n1 2', '2\n0 2', '3\n1 2 3'];
      for (let s = 0; s < 10; s++) {
        const n = 10 + s * 20;
        const missing = Math.floor(prng() * (n + 1));
        const vals = [];
        for (let i = 0; i <= n; i++) if (i !== missing) vals.push(i);
        for (let i = vals.length - 1; i > 0; i--) {
          const j = Math.floor(prng() * (i + 1));
          [vals[i], vals[j]] = [vals[j], vals[i]];
        }
        cases.push(`${n}\n${vals.join(' ')}`);
      }
      return cases;
    },
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    \n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      javascript: `const fs = require('fs');\n\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    const nums = [];\n    for (let i = 0; i < n; i++) nums.push(parseInt(tokens[i + 1], 10));\n    \n    // Write your solution below\n}\n\nsolve();`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        \n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    \n    // Write your solution below\n    return 0;\n}`
    },
    approaches: [
      {
        name: 'Approach 1: Hash Set Lookup (Brute Force)',
        idea: 'Store array elements in a Set, then scan 0 to N to find which element is missing.',
        dryRun: 'nums = [3, 0, 1]. Set: {0, 1, 3}. Check 0: ok. Check 1: ok. Check 2: missing -> return 2.',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        whenToUse: 'Basic baseline approach.',
        code: {
          python: `import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    s = set(int(tokens[i]) for i in range(1, n + 1))\n    for i in range(n + 1):\n        if i not in s: print(i); return\nif __name__ == '__main__': solve()`,
          javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    const s = new Set();\n    for (let i = 1; i <= n; i++) s.add(parseInt(tokens[i], 10));\n    for (let i = 0; i <= n; i++) { if (!s.has(i)) { console.log(i); return; } }\n}\nsolve();`,
          java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        Set<Integer> s = new HashSet<>();\n        for (int i = 0; i < n; i++) s.add(sc.nextInt());\n        for (int i = 0; i <= n; i++) { if (!s.contains(i)) { System.out.println(i); return; } }\n    }\n}`,
          cpp: `#include <iostream>\n#include <unordered_set>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    unordered_set<int> s;\n    for (int i = 0; i < n; i++) { int x; cin >> x; s.insert(x); }\n    for (int i = 0; i <= n; i++) { if (s.find(i) == s.end()) { cout << i << "\\n"; return 0; } }\n    return 0;\n}`
        }
      },
      {
        name: 'Approach 2: XOR Range Cancellation (Optimal)',
        idea: 'XOR all indices 0 to N with all array elements. Every number in [0, N] appears twice except the missing one, which remains.',
        dryRun: 'nums = [3, 0, 1]. xor = 3. i=0: 3 ^ 0 ^ 3 = 0. i=1: 0 ^ 1 ^ 0 = 1. i=2: 1 ^ 2 ^ 1 = 2. Result: 2.',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        whenToUse: 'Optimal solution without overflow risk.',
        code: {
          python: `import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    res = n\n    for i in range(n): res ^= i ^ int(tokens[i + 1])\n    print(res)\nif __name__ == '__main__': solve()`,
          javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    let res = n;\n    for (let i = 0; i < n; i++) res ^= i ^ parseInt(tokens[i + 1], 10);\n    console.log(res);\n}\nsolve();`,
          java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int res = n;\n        for (int i = 0; i < n; i++) res ^= i ^ sc.nextInt();\n        System.out.println(res);\n    }\n}`,
          cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    int res = n;\n    for (int i = 0; i < n; i++) { int x; cin >> x; res ^= i ^ x; }\n    cout << res << "\\n"; return 0;\n}`
        }
      }
    ]
  },

  // 6. Power of Two (Easy)
  {
    order: 6,
    title: 'Power of Two',
    difficulty: 'Easy',
    slug: 'power-of-two-bit',
    pattern: 'Single Set Bit Invariant Check (n > 0 && (n & (n - 1)) == 0)',
    tags: ['Bit Manipulation', 'Easy', 'Kernighan', 'Campus Placement'],
    statement: `Given an integer \`n\`, return \`true\` if it is a power of two. Otherwise, return \`false\`.

An integer \`n\` is a power of two if there exists an integer \`x\` such that \`n == 2^x\`. Solve it in O(1) time without loops.`,
    inputFormat: `First line: integer N.`,
    outputFormat: `Print 'true' if N is a power of two, otherwise print 'false'.`,
    constraints: [
      '-2^31 <= N <= 2^31 - 1',
      'Time Limit: 2.0 seconds',
      'Memory Limit: 256 MB'
    ],
    examples: [
      {
        input: '1',
        displayInput: 'n = 1',
        output: 'true',
        displayOutput: 'true',
        explanation: '2^0 = 1, so 1 is a power of two.'
      },
      {
        input: '16',
        displayInput: 'n = 16',
        output: 'true',
        displayOutput: 'true',
        explanation: '2^4 = 16, so 16 is a power of two.'
      },
      {
        input: '3',
        displayInput: 'n = 3',
        output: 'false',
        displayOutput: 'false',
        explanation: '3 is not a power of two.'
      },
      {
        input: '0',
        displayInput: 'n = 0',
        output: 'false',
        displayOutput: 'false',
        explanation: '0 is not a power of two.'
      }
    ],
    hints: [
      'In binary representation, what distinguishes powers of 2 from other integers? (1, 10, 100, 1000...)',
      'Powers of two have exactly ONE bit set to 1.',
      'Recall Brian Kernighan trick: n & (n - 1) removes the lowest set bit. If n is a power of two and n > 0, n & (n - 1) must equal 0!'
    ],
    commonMistakes: [
      'Forgetting that non-positive numbers (e.g. 0 and negative numbers) cannot be powers of two. For example, -2147483648 has one set bit in two\'s complement, but is not a power of two.',
      'Operator precedence: (n & (n - 1)) == 0 requires parentheses because == has higher precedence than &.'
    ],
    solveOptimal: (s) => {
      const n = BigInt(String(s).trim());
      return (n > 0n && (n & (n - 1n)) === 0n) ? 'true' : 'false';
    },
    solveBrute: (s) => {
      let n = BigInt(String(s).trim());
      if (n <= 0n) return 'false';
      while (n % 2n === 0n) n /= 2n;
      return n === 1n ? 'true' : 'false';
    },
    genRandomInput: (prng) => {
      return String(Math.floor(prng() * 2000000) - 1000000);
    },
    genHiddenCases: (prng) => {
      return ['0', '-1', '-2', '-16', '-2147483648', '1', '2', '4', '8', '16', '32', '64', '128', '256', '512', '1024', '1048576', '1073741824', '5', '6', '7', '15', '100', '1000000'];
    },
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    \n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      javascript: `const fs = require('fs');\n\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens[0] === '') return;\n    const n = BigInt(tokens[0]);\n    \n    // Write your solution below\n}\n\nsolve();`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLong()) return;\n        long n = sc.nextLong();\n        \n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    long long n;\n    if (!(cin >> n)) return 0;\n    \n    // Write your solution below\n    return 0;\n}`
    },
    approaches: [
      {
        name: 'Approach 1: Iterative Division (Brute Force)',
        idea: 'Continuously divide n by 2 while it is even. If n ends up at 1, it was a power of two.',
        dryRun: 'n = 16 -> 8 -> 4 -> 2 -> 1 (true). n = 12 -> 6 -> 3 != 1 (false).',
        timeComplexity: 'O(log N)',
        spaceComplexity: 'O(1)',
        whenToUse: 'Basic iterative approach.',
        code: {
          python: `import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    if n <= 0: print("false"); return\n    while n % 2 == 0: n //= 2\n    print("true" if n == 1 else "false")\nif __name__ == '__main__': solve()`,
          javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens[0] === '') return;\n    let n = BigInt(tokens[0]);\n    if (n <= 0n) { console.log('false'); return; }\n    while (n % 2n === 0n) n /= 2n;\n    console.log(n === 1n ? 'true' : 'false');\n}\nsolve();`,
          java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLong()) return;\n        long n = sc.nextLong();\n        if (n <= 0) { System.out.println("false"); return; }\n        while (n % 2 == 0) n /= 2;\n        System.out.println(n == 1 ? "true" : "false");\n    }\n}`,
          cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    long long n; if (!(cin >> n)) return 0;\n    if (n <= 0) { cout << "false\\n"; return 0; }\n    while (n % 2 == 0) n /= 2;\n    cout << (n == 1 ? "true" : "false") << "\\n"; return 0;\n}`
        }
      },
      {
        name: 'Approach 2: Bit Trick n & (n - 1) == 0 (Optimal)',
        idea: 'Powers of two have exactly one set bit. Clearing it via n & (n - 1) leaves 0. Check n > 0 && (n & (n - 1)) == 0.',
        dryRun: 'n = 16 (10000). n - 1 = 15 (01111). 10000 & 01111 = 00000 == 0. Return true.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)',
        whenToUse: 'Optimal standard interview solution.',
        code: {
          python: `import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    print("true" if n > 0 and (n & (n - 1)) == 0 else "false")\nif __name__ == '__main__': solve()`,
          javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens[0] === '') return;\n    const n = BigInt(tokens[0]);\n    console.log(n > 0n && (n & (n - 1n)) === 0n ? 'true' : 'false');\n}\nsolve();`,
          java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLong()) return;\n        long n = sc.nextLong();\n        System.out.println(n > 0 && (n & (n - 1)) == 0 ? "true" : "false");\n    }\n}`,
          cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    long long n; if (!(cin >> n)) return 0;\n    cout << (n > 0 && (n & (n - 1)) == 0 ? "true" : "false") << "\\n"; return 0;\n}`
        }
      }
    ]
  },

  // 7. Add Binary (Easy)
  {
    order: 7,
    title: 'Add Binary',
    difficulty: 'Easy',
    slug: 'add-binary-bm',
    pattern: 'Bitwise Simulated Binary Addition with Carry',
    tags: ['Bit Manipulation', 'Easy', 'String', 'Campus Placement'],
    statement: `Given two binary strings \`a\` and \`b\`, return their sum as a binary string.`,
    inputFormat: `First line: binary string A.
Second line: binary string B.`,
    outputFormat: `Print the binary string representing their sum.`,
    constraints: [
      '1 <= a.length, b.length <= 10^4',
      "a and b consist only of '0' or '1' characters.",
      'Each string does not contain leading zeros except for the zero itself.',
      'Time Limit: 2.0 seconds',
      'Memory Limit: 256 MB'
    ],
    examples: [
      {
        input: '11\n1',
        displayInput: 'a = "11", b = "1"',
        output: '100',
        displayOutput: '"100"',
        explanation: '11 (3 in decimal) + 1 (1 in decimal) = 4 in decimal (100 in binary).'
      },
      {
        input: '1010\n1011',
        displayInput: 'a = "1010", b = "1011"',
        output: '10101',
        displayOutput: '"10101"',
        explanation: '1010 (10) + 1011 (11) = 21 (10101 in binary).'
      },
      {
        input: '0\n0',
        displayInput: 'a = "0", b = "0"',
        output: '0',
        displayOutput: '"0"',
        explanation: '0 + 0 = 0.'
      }
    ],
    hints: [
      'Work backwards from the least significant digit (rightmost index) towards the left, like elementary addition.',
      'Maintain a carry variable (0 or 1). At each position, sum = carry + bitA + bitB.',
      'Append sum % 2 to your result, set carry = sum // 2, and continue until both strings and carry are exhausted.'
    ],
    commonMistakes: [
      'Converting binary strings directly to integer types: strings can be up to 10^4 bits long, which immediately overflows 64-bit integer types.',
      'Forgetting to output the final carry if carry = 1 after the loops finish.'
    ],
    solveOptimal: (s) => {
      const t = String(s).trim().split(/\s+/);
      const a = t[0], b = t[1];
      let i = a.length - 1, j = b.length - 1, carry = 0;
      const res = [];
      while (i >= 0 || j >= 0 || carry > 0) {
        let sum = carry;
        if (i >= 0) sum += a.charCodeAt(i--) - 48;
        if (j >= 0) sum += b.charCodeAt(j--) - 48;
        res.push(sum % 2);
        carry = Math.floor(sum / 2);
      }
      return res.reverse().join('');
    },
    solveBrute: (s) => {
      const t = String(s).trim().split(/\s+/);
      return (BigInt('0b' + t[0]) + BigInt('0b' + t[1])).toString(2);
    },
    genRandomInput: (prng) => {
      const lenA = Math.floor(prng() * 20) + 1;
      const lenB = Math.floor(prng() * 20) + 1;
      let a = '1', b = '1';
      for (let i = 1; i < lenA; i++) a += prng() > 0.5 ? '1' : '0';
      for (let i = 1; i < lenB; i++) b += prng() > 0.5 ? '1' : '0';
      return `${a}\n${b}`;
    },
    genHiddenCases: (prng) => {
      const cases = ['0\n0', '1\n0', '0\n1', '1\n1', '1111\n1', '11111\n11111', '100000\n1'];
      for (let s = 0; s < 8; s++) {
        const len = 10 + s * 15;
        let a = '1', b = '1';
        for (let i = 1; i < len; i++) a += prng() > 0.5 ? '1' : '0';
        for (let i = 1; i < len; i++) b += prng() > 0.5 ? '1' : '0';
        cases.push(`${a}\n${b}`);
      }
      return cases;
    },
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    a = tokens[0]\n    b = tokens[1]\n    \n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      javascript: `const fs = require('fs');\n\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (tokens.length < 2) return;\n    const a = tokens[0];\n    const b = tokens[1];\n    \n    // Write your solution below\n}\n\nsolve();`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String a = sc.next();\n        String b = sc.next();\n        \n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string a, b;\n    if (!(cin >> a >> b)) return 0;\n    \n    // Write your solution below\n    return 0;\n}`
    },
    approaches: [
      {
        name: 'Approach 1: Two Pointers Simulation with Carry (Optimal)',
        idea: 'Iterate from the least significant digit towards the most significant digit, maintaining sum and carry.',
        dryRun: 'a = "11", b = "1". i=1,j=0: sum=1+1=2 -> res=[0], carry=1. i=0,j=-1: sum=1+1=2 -> res=[0,0], carry=1. carry=1 -> res=[0,0,1]. Reverse: "100".',
        timeComplexity: 'O(max(N, M))',
        spaceComplexity: 'O(max(N, M))',
        whenToUse: 'Universal standard optimal approach for large binary strings.',
        code: {
          python: `import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    a, b = tokens[0], tokens[1]\n    i, j, carry = len(a) - 1, len(b) - 1, 0\n    res = []\n    while i >= 0 or j >= 0 or carry:\n        total = carry\n        if i >= 0: total += int(a[i]); i -= 1\n        if j >= 0: total += int(b[j]); j -= 1\n        res.append(str(total % 2))\n        carry = total // 2\n    print("".join(reversed(res)))\nif __name__ == '__main__': solve()`,
          javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (tokens.length < 2) return;\n    const a = tokens[0], b = tokens[1];\n    let i = a.length - 1, j = b.length - 1, carry = 0;\n    const res = [];\n    while (i >= 0 || j >= 0 || carry > 0) {\n        let sum = carry;\n        if (i >= 0) sum += a.charCodeAt(i--) - 48;\n        if (j >= 0) sum += b.charCodeAt(j--) - 48;\n        res.push(sum % 2);\n        carry = Math.floor(sum / 2);\n    }\n    console.log(res.reverse().join(''));\n}\nsolve();`,
          java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String a = sc.next(), b = sc.next();\n        StringBuilder sb = new StringBuilder();\n        int i = a.length() - 1, j = b.length() - 1, carry = 0;\n        while (i >= 0 || j >= 0 || carry > 0) {\n            int sum = carry;\n            if (i >= 0) sum += a.charAt(i--) - '0';\n            if (j >= 0) sum += b.charAt(j--) - '0';\n            sb.append(sum % 2);\n            carry = sum / 2;\n        }\n        System.out.println(sb.reverse().toString());\n    }\n}`,
          cpp: `#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\nint main() {\n    string a, b; if (!(cin >> a >> b)) return 0;\n    string res = "";\n    int i = a.size() - 1, j = b.size() - 1, carry = 0;\n    while (i >= 0 || j >= 0 || carry) {\n        int sum = carry;\n        if (i >= 0) sum += a[i--] - '0';\n        if (j >= 0) sum += b[j--] - '0';\n        res.push_back((sum % 2) + '0');\n        carry = sum / 2;\n    }\n    reverse(res.begin(), res.end());\n    cout << res << "\\n"; return 0;\n}`
        }
      }
    ]
  },

  // 8. Single Number II (Appears 3 Times) (Medium)
  {
    order: 8,
    title: 'Single Number II (Appears 3 Times)',
    difficulty: 'Medium',
    slug: 'single-number-ii',
    pattern: 'Bit-by-Bit Modulo 3 Tally / State Machine (ones, twos)',
    tags: ['Bit Manipulation', 'Medium', 'State Machine', 'Campus Placement'],
    statement: `Given an integer array \`nums\` where every element appears exactly three times except for one unique element which appears exactly once, find the single element and return it.

You must implement a solution with linear runtime complexity and use strictly O(1) extra space.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the single unique element.`,
    constraints: [
      '1 <= N <= 3 * 10^4',
      '-2^31 <= nums[i] <= 2^31 - 1',
      'Each element in nums appears exactly three times except for one element which appears once.',
      'Time Limit: 2.0 seconds',
      'Memory Limit: 256 MB'
    ],
    examples: [
      {
        input: '4\n2 2 3 2',
        displayInput: 'nums = [2, 2, 3, 2]',
        output: '3',
        displayOutput: '3',
        explanation: '2 appears 3 times. 3 appears once and is returned.'
      },
      {
        input: '7\n0 1 0 1 0 1 99',
        displayInput: 'nums = [0, 1, 0, 1, 0, 1, 99]',
        output: '99',
        displayOutput: '99',
        explanation: '0 and 1 appear 3 times. 99 appears once.'
      },
      {
        input: '1\n-4',
        displayInput: 'nums = [-4]',
        output: '-4',
        displayOutput: '-4',
        explanation: 'Array has only one element: -4.'
      }
    ],
    hints: [
      'Think about bit positions 0 to 31 individually. If a bit appears 3 times, its sum across elements is a multiple of 3.',
      'If you sum the bits at position i for all numbers and take modulo 3, the triplets will sum to 0 mod 3. The remainder (0 or 1) belongs to the unique single number!',
      'For O(N) single-pass with no 32-loop: use two bit variables `ones` and `twos` to track bits seen 1 time and 2 times.'
    ],
    commonMistakes: [
      'Assuming XOR works directly: standard XOR cancels pairs (modulo 2), not triplets (modulo 3).',
      'Failing to handle negative numbers when converting bit sums back to 32-bit signed integers in Python.'
    ],
    solveOptimal: (s) => {
      const t = String(s).trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      let ones = 0, twos = 0;
      for (let i = 1; i <= n; i++) {
        const x = parseInt(t[i], 10);
        ones = (ones ^ x) & ~twos;
        twos = (twos ^ x) & ~ones;
      }
      return String(ones);
    },
    solveBrute: (s) => {
      const t = String(s).trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const counts = {};
      for (let i = 1; i <= n; i++) counts[t[i]] = (counts[t[i]] || 0) + 1;
      for (const [k, v] of Object.entries(counts)) if (v === 1) return String(k);
      return '0';
    },
    genRandomInput: (prng) => {
      const triplets = Math.floor(prng() * 5) + 1;
      const vals = [];
      for (let i = 0; i < triplets; i++) {
        const v = Math.floor(prng() * 200) - 100;
        vals.push(v, v, v);
      }
      vals.push(Math.floor(prng() * 200) - 100);
      for (let i = vals.length - 1; i > 0; i--) {
        const j = Math.floor(prng() * (i + 1));
        [vals[i], vals[j]] = [vals[j], vals[i]];
      }
      return `${vals.length}\n${vals.join(' ')}`;
    },
    genHiddenCases: (prng) => {
      const cases = ['1\n0', '1\n-99', '4\n5 5 5 2', '4\n-1 -1 -1 -100', '7\n10 10 10 20 20 20 30'];
      for (let s = 0; s < 8; s++) {
        const count = 4 + s * 8;
        const vals = [];
        for (let j = 0; j < count; j++) {
          const v = Math.floor(prng() * 20000) - 10000;
          vals.push(v, v, v);
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
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        \n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    \n    // Write your solution below\n    return 0;\n}`
    },
    approaches: [
      {
        name: 'Approach 1: Hash Map Frequency Count (Brute Force)',
        idea: 'Store occurrences of each element in a hash map and return the element with count 1.',
        dryRun: 'nums = [2, 2, 3, 2]. Map: {2: 3, 3: 1}. Element 3 has count 1 -> return 3.',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        whenToUse: 'When extra memory is not restricted.',
        code: {
          python: `import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    c = {}\n    for i in range(1, n + 1):\n        x = int(tokens[i]); c[x] = c.get(x, 0) + 1\n    for k, v in c.items():\n        if v == 1: print(k); return\nif __name__ == '__main__': solve()`,
          javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    const c = new Map();\n    for (let i = 1; i <= n; i++) { const x = parseInt(tokens[i], 10); c.set(x, (c.get(x) || 0) + 1); }\n    for (const [k, v] of c.entries()) { if (v === 1) { console.log(k); return; } }\n}\nsolve();`,
          java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        Map<Integer, Integer> c = new HashMap<>();\n        for (int i = 0; i < n; i++) { int x = sc.nextInt(); c.put(x, c.getOrDefault(x, 0) + 1); }\n        for (Map.Entry<Integer, Integer> e : c.entrySet()) { if (e.getValue() == 1) { System.out.println(e.getKey()); return; } }\n    }\n}`,
          cpp: `#include <iostream>\n#include <unordered_map>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    unordered_map<int, int> c;\n    for (int i = 0; i < n; i++) { int x; cin >> x; c[x]++; }\n    for (auto &p : c) { if (p.second == 1) { cout << p.first << "\\n"; return 0; } }\n    return 0;\n}`
        }
      },
      {
        name: 'Approach 2: Bitmask State Machine (Optimal)',
        idea: 'Track bits appearing 1 time and 2 times: ones = (ones ^ x) & ~twos; twos = (twos ^ x) & ~ones. When a bit appears 3 times, both ones and twos reset to 0.',
        dryRun: 'For element x: update ones and twos. Triplets cycle 0 -> 1 -> 2 -> 0. The single element ends in `ones`.',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        whenToUse: 'Optimal linear-time constant-space placement solution.',
        code: {
          python: `import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    ones, twos = 0, 0\n    for i in range(1, n + 1):\n        x = int(tokens[i])\n        ones = (ones ^ x) & ~twos\n        twos = (twos ^ x) & ~ones\n    # Convert 32-bit signed in Python\n    if ones >= 2**31: ones -= 2**32\n    print(ones)\nif __name__ == '__main__': solve()`,
          javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    let ones = 0, twos = 0;\n    for (let i = 1; i <= n; i++) {\n        const x = parseInt(tokens[i], 10);\n        ones = (ones ^ x) & ~twos;\n        twos = (twos ^ x) & ~ones;\n    }\n    console.log(ones);\n}\nsolve();`,
          java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int ones = 0, twos = 0;\n        for (int i = 0; i < n; i++) {\n            int x = sc.nextInt();\n            ones = (ones ^ x) & ~twos;\n            twos = (twos ^ x) & ~ones;\n        }\n        System.out.println(ones);\n    }\n}`,
          cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    int ones = 0, twos = 0;\n    for (int i = 0; i < n; i++) {\n        int x; cin >> x;\n        ones = (ones ^ x) & ~twos;\n        twos = (twos ^ x) & ~ones;\n    }\n    cout << ones << "\\n"; return 0;\n}`
        }
      }
    ]
  },

  // 9. Single Number III (Two Unique Elements) (Medium)
  {
    order: 9,
    title: 'Single Number III (Two Unique Elements)',
    difficulty: 'Medium',
    slug: 'single-number-iii',
    pattern: 'Rightmost Set Bit Partitioning (diff & -diff)',
    tags: ['Bit Manipulation', 'Medium', 'XOR', 'Campus Placement'],
    statement: `Given an integer array \`nums\`, in which exactly two elements appear only once and all the other elements appear exactly twice, find the two elements that appear only once.

Return the two elements in ascending order, separated by a single space. You must run in linear runtime O(N) and use strictly O(1) extra space.`,
    inputFormat: `First line: integer N.
Second line: N space-separated integers.`,
    outputFormat: `Print the two unique elements in ascending order separated by a space.`,
    constraints: [
      '2 <= N <= 3 * 10^4',
      '-2^31 <= nums[i] <= 2^31 - 1',
      'Each element in nums appears twice except for two elements which appear once.',
      'Time Limit: 2.0 seconds',
      'Memory Limit: 256 MB'
    ],
    examples: [
      {
        input: '6\n1 2 1 3 2 5',
        displayInput: 'nums = [1, 2, 1, 3, 2, 5]',
        output: '3 5',
        displayOutput: '3 5',
        explanation: '3 and 5 appear once; 1 and 2 appear twice. Output is 3 5 in ascending order.'
      },
      {
        input: '2\n-1 0',
        displayInput: 'nums = [-1, 0]',
        output: '-1 0',
        displayOutput: '-1 0',
        explanation: '-1 and 0 are the unique elements.'
      },
      {
        input: '2\n0 1',
        displayInput: 'nums = [0, 1]',
        output: '0 1',
        displayOutput: '0 1',
        explanation: '0 and 1 are the unique elements.'
      }
    ],
    hints: [
      'XORing all elements yields (A ^ B) because all duplicate pairs cancel to 0.',
      'Since A != B, (A ^ B) != 0, so there is at least one set bit in (A ^ B). This bit must be 1 in one number and 0 in the other!',
      'Extract the lowest set bit using diff & (-diff). Use this bit to partition the array into two subsets. XORing each subset isolates A and B individually in O(1) space!'
    ],
    commonMistakes: [
      'Forgetting to print the two numbers in ascending order as requested in output format.',
      'Integer overflow when computing -diff if diff = -2^31 in 32-bit signed integers in C++.'
    ],
    solveOptimal: (s) => {
      const t = String(s).trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      let xorAll = 0;
      for (let i = 1; i <= n; i++) xorAll ^= parseInt(t[i], 10);
      const diff = xorAll & -xorAll;
      let a = 0, b = 0;
      for (let i = 1; i <= n; i++) {
        const x = parseInt(t[i], 10);
        if ((x & diff) !== 0) a ^= x;
        else b ^= x;
      }
      const sorted = [a, b].sort((x, y) => x - y);
      return `${sorted[0]} ${sorted[1]}`;
    },
    solveBrute: (s) => {
      const t = String(s).trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const m = {};
      for (let i = 1; i <= n; i++) m[t[i]] = (m[t[i]] || 0) + 1;
      const singles = Object.entries(m).filter(([k, v]) => v === 1).map(([k]) => Number(k)).sort((a, b) => a - b);
      return `${singles[0]} ${singles[1]}`;
    },
    genRandomInput: (prng) => {
      const pairs = Math.floor(prng() * 5) + 1;
      const vals = [];
      for (let i = 0; i < pairs; i++) {
        const v = Math.floor(prng() * 200) - 100;
        vals.push(v, v);
      }
      const u1 = Math.floor(prng() * 200) - 100;
      let u2 = Math.floor(prng() * 200) - 100;
      while (u2 === u1) u2 = Math.floor(prng() * 200) - 100;
      vals.push(u1, u2);
      for (let i = vals.length - 1; i > 0; i--) {
        const j = Math.floor(prng() * (i + 1));
        [vals[i], vals[j]] = [vals[j], vals[i]];
      }
      return `${vals.length}\n${vals.join(' ')}`;
    },
    genHiddenCases: (prng) => {
      const cases = ['2\n1 2', '2\n-1 0', '6\n1 2 1 3 2 5', '4\n0 1 2 2'];
      for (let s = 0; s < 8; s++) {
        const count = 4 + s * 6;
        const vals = [];
        for (let j = 0; j < count; j++) {
          const v = Math.floor(prng() * 20000) - 10000;
          vals.push(v, v);
        }
        const u1 = Math.floor(prng() * 20000) - 10000;
        let u2 = Math.floor(prng() * 20000) - 10000;
        while (u2 === u1) u2 = Math.floor(prng() * 20000) - 10000;
        vals.push(u1, u2);
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
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        \n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    \n    // Write your solution below\n    return 0;\n}`
    },
    approaches: [
      {
        name: 'Approach 1: Hash Map (Brute Force)',
        idea: 'Count frequencies in a map and collect all keys with count 1, then sort.',
        dryRun: 'nums = [1, 2, 1, 3, 2, 5]. Counts: {1:2, 2:2, 3:1, 5:1}. Singles: [3, 5].',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        whenToUse: 'Basic memory-unconstrained solution.',
        code: {
          python: `import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    c = {}\n    for i in range(1, n + 1):\n        x = int(tokens[i]); c[x] = c.get(x, 0) + 1\n    res = sorted([k for k, v in c.items() if v == 1])\n    print(f"{res[0]} {res[1]}")\nif __name__ == '__main__': solve()`,
          javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    const c = new Map();\n    for (let i = 1; i <= n; i++) { const x = parseInt(tokens[i], 10); c.set(x, (c.get(x) || 0) + 1); }\n    const singles = [];\n    for (const [k, v] of c.entries()) if (v === 1) singles.push(k);\n    singles.sort((a, b) => a - b);\n    console.log(singles[0] + ' ' + singles[1]);\n}\nsolve();`,
          java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        Map<Integer, Integer> c = new HashMap<>();\n        for (int i = 0; i < n; i++) { int x = sc.nextInt(); c.put(x, c.getOrDefault(x, 0) + 1); }\n        List<Integer> s = new ArrayList<>();\n        for (Map.Entry<Integer, Integer> e : c.entrySet()) if (e.getValue() == 1) s.add(e.getKey());\n        Collections.sort(s);\n        System.out.println(s.get(0) + " " + s.get(1));\n    }\n}`,
          cpp: `#include <iostream>\n#include <unordered_map>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    unordered_map<int, int> c;\n    for (int i = 0; i < n; i++) { int x; cin >> x; c[x]++; }\n    vector<int> s;\n    for (auto &p : c) if (p.second == 1) s.push_back(p.first);\n    sort(s.begin(), s.end());\n    cout << s[0] << " " << s[1] << "\\n"; return 0;\n}`
        }
      },
      {
        name: 'Approach 2: Rightmost Bit Partitioning (Optimal)',
        idea: 'XOR all elements to get A ^ B. Find lowest set bit using diff & -diff. Partition elements by this bit and XOR each group separately to isolate A and B.',
        dryRun: 'nums = [1, 2, 1, 3, 2, 5]. xorAll = 3 ^ 5 = 6 (0110). Lowest bit diff = 2 (0010). Group with bit 1 set: [2, 2, 3] -> 3. Group without bit 1: [1, 1, 5] -> 5. Sort: [3, 5].',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        whenToUse: 'Optimal standard interview solution.',
        code: {
          python: `import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    xor_all = 0\n    for i in range(1, n + 1): xor_all ^= int(tokens[i])\n    diff = xor_all & -xor_all\n    a, b = 0, 0\n    for i in range(1, n + 1):\n        x = int(tokens[i])\n        if x & diff: a ^= x\n        else: b ^= x\n    res = sorted([a, b])\n    print(f"{res[0]} {res[1]}")\nif __name__ == '__main__': solve()`,
          javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    let xorAll = 0;\n    for (let i = 1; i <= n; i++) xorAll ^= parseInt(tokens[i], 10);\n    const diff = xorAll & -xorAll;\n    let a = 0, b = 0;\n    for (let i = 1; i <= n; i++) {\n        const x = parseInt(tokens[i], 10);\n        if ((x & diff) !== 0) a ^= x; else b ^= x;\n    }\n    const res = [a, b].sort((x, y) => x - y);\n    console.log(res[0] + ' ' + res[1]);\n}\nsolve();`,
          java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        int xorAll = 0;\n        for (int i = 0; i < n; i++) { nums[i] = sc.nextInt(); xorAll ^= nums[i]; }\n        int diff = xorAll & -xorAll;\n        int a = 0, b = 0;\n        for (int x : nums) { if ((x & diff) != 0) a ^= x; else b ^= x; }\n        int min = Math.min(a, b), max = Math.max(a, b);\n        System.out.println(min + " " + max);\n    }\n}`,
          cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    long long xorAll = 0;\n    for (int i = 0; i < n; i++) { cin >> nums[i]; xorAll ^= nums[i]; }\n    long long diff = xorAll & -xorAll;\n    int a = 0, b = 0;\n    for (int x : nums) { if (x & diff) a ^= x; else b ^= x; }\n    if (a > b) swap(a, b);\n    cout << a << " " << b << "\\n"; return 0;\n}`
        }
      }
    ]
  },

  // 10. Subsets using Bitmask (Medium)
  {
    order: 10,
    title: 'Subsets using Bitmask',
    difficulty: 'Medium',
    slug: 'subsets-bitmask',
    pattern: 'Iterating 0 to (1 << N) - 1 with Bit Testing',
    tags: ['Bit Manipulation', 'Medium', 'Bitmask', 'Campus Placement'],
    statement: `Given an integer array \`nums\` of unique elements, generate all possible subsets (the power set).

The solution set must not contain duplicate subsets. Output the total count of subsets on the first line (which equals 2^N), followed by each subset on a new line in mask order from 0 to 2^N - 1 (elements of each subset separated by spaces; empty subset represented as an empty line).`,
    inputFormat: `First line: integer N (1 <= N <= 10).
Second line: N space-separated distinct integers.`,
    outputFormat: `First line: total number of subsets (2^N).
Next 2^N lines: space-separated elements of each subset generated in ascending order of mask 0 to 2^N - 1.`,
    constraints: [
      '1 <= N <= 10',
      '-10 <= nums[i] <= 10',
      'All elements in nums are unique.',
      'Time Limit: 2.0 seconds',
      'Memory Limit: 256 MB'
    ],
    examples: [
      {
        input: '3\n1 2 3',
        displayInput: 'nums = [1, 2, 3]',
        output: '8\n\n1\n2\n1 2\n3\n1 3\n2 3\n1 2 3',
        displayOutput: '8 subsets generated',
        explanation: 'There are 2^3 = 8 subsets corresponding to masks 000 through 111.'
      },
      {
        input: '1\n0',
        displayInput: 'nums = [0]',
        output: '2\n\n0',
        displayOutput: '2 subsets generated',
        explanation: 'Mask 0 is empty, mask 1 is [0].'
      },
      {
        input: '2\n4 5',
        displayInput: 'nums = [4, 5]',
        output: '4\n\n4\n5\n4 5',
        displayOutput: '4 subsets generated',
        explanation: 'Mask 00: [], Mask 01: [4], Mask 10: [5], Mask 11: [4, 5].'
      }
    ],
    hints: [
      'An array of N elements has 2^N total subsets.',
      'Represent each subset as a binary number (mask) from 0 to (1 << N) - 1.',
      'For each mask, test the j-th bit: if (mask & (1 << j)) is non-zero, include nums[j] in the subset!'
    ],
    commonMistakes: [
      'Using 1 << N without checking limits: for large N this causes exponential explosion. Constraints guarantee N <= 10.',
      'Forgetting that mask 0 corresponds to the empty subset.'
    ],
    solveOptimal: (s) => {
      const t = String(s).trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1);
      const total = 1 << n;
      const lines = [String(total)];
      for (let mask = 0; mask < total; mask++) {
        const sub = [];
        for (let j = 0; j < n; j++) {
          if ((mask & (1 << j)) !== 0) sub.push(nums[j]);
        }
        lines.push(sub.join(' '));
      }
      return lines.join('\n');
    },
    solveBrute: (s) => {
      const t = String(s).trim().split(/\s+/);
      const n = parseInt(t[0], 10);
      const nums = t.slice(1, n + 1);
      const total = Math.pow(2, n);
      const lines = [String(total)];
      for (let mask = 0; mask < total; mask++) {
        const sub = [];
        for (let j = 0; j < n; j++) {
          if ((mask >> j) & 1) sub.push(nums[j]);
        }
        lines.push(sub.join(' '));
      }
      return lines.join('\n');
    },
    genRandomInput: (prng) => {
      const n = Math.floor(prng() * 4) + 1;
      const set = new Set();
      while (set.size < n) set.add(Math.floor(prng() * 20) - 10);
      return `${n}\n${Array.from(set).join(' ')}`;
    },
    genHiddenCases: (prng) => {
      return [
        '1\n0', '1\n-5', '1\n10', '2\n1 2', '2\n-1 1', '2\n8 9',
        '3\n1 2 3', '3\n-3 0 3', '4\n1 2 3 4', '4\n-2 -1 1 2',
        '5\n1 2 3 4 5', '5\n10 20 30 40 50', '6\n1 3 5 7 9 11', '6\n-5 -4 -3 -2 -1 0'
      ];
    },
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    \n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()`,
      javascript: `const fs = require('fs');\n\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    const nums = [];\n    for (let i = 0; i < n; i++) nums.push(parseInt(tokens[i + 1], 10));\n    \n    // Write your solution below\n}\n\nsolve();`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        \n        // Write your solution below\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    \n    // Write your solution below\n    return 0;\n}`
    },
    approaches: [
      {
        name: 'Approach 1: Bitmask Iteration (Optimal)',
        idea: 'Iterate mask from 0 to 2^N - 1. If j-th bit of mask is set, include nums[j] in the current subset.',
        dryRun: 'nums = [1, 2]. Mask 0 (00): []. Mask 1 (01): [1]. Mask 2 (10): [2]. Mask 3 (11): [1, 2].',
        timeComplexity: 'O(N * 2^N)',
        spaceComplexity: 'O(1) auxiliary',
        whenToUse: 'Optimal non-recursive power set generation.',
        code: {
          python: `import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    nums = tokens[1:n+1]\n    total = 1 << n\n    print(total)\n    for mask in range(total):\n        sub = [nums[j] for j in range(n) if mask & (1 << j)]\n        print(" ".join(sub))\nif __name__ == '__main__': solve()`,
          javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    const nums = tokens.slice(1, n + 1);\n    const total = 1 << n;\n    console.log(total);\n    for (let mask = 0; mask < total; mask++) {\n        const sub = [];\n        for (let j = 0; j < n; j++) if (mask & (1 << j)) sub.push(nums[j]);\n        console.log(sub.join(' '));\n    }\n}\nsolve();`,
          java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int total = 1 << n;\n        System.out.println(total);\n        for (int mask = 0; mask < total; mask++) {\n            StringBuilder sb = new StringBuilder();\n            boolean first = true;\n            for (int j = 0; j < n; j++) {\n                if ((mask & (1 << j)) != 0) {\n                    if (!first) sb.append(" ");\n                    sb.append(a[j]);\n                    first = false;\n                }\n            }\n            System.out.println(sb.toString());\n        }\n    }\n}`,
          cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    int total = 1 << n;\n    cout << total << "\\n";\n    for (int mask = 0; mask < total; mask++) {\n        bool first = true;\n        for (int j = 0; j < n; j++) {\n            if (mask & (1 << j)) {\n                if (!first) cout << " ";\n                cout << a[j];\n                first = false;\n            }\n        }\n        cout << "\\n";\n    }\n    return 0;\n}`
        }
      }
    ]
  }
];

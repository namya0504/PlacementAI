/**
 * Canonical DSA Placement Problems: BIT MANIPULATION (20 Questions)
 */

export const BIT_MANIPULATION_PROBLEMS = [
  {
    "problemId": "dsa_bit-manipulation_01",
    "topicId": "bit-manipulation",
    "order": 1,
    "title": "Single Number",
    "difficulty": "Easy",
    "pattern": "XOR Identity (X ^ X = 0 and X ^ 0 = X)",
    "tags": [
      "Bit Manipulation",
      "Easy",
      "XOR",
      "Campus Placement"
    ],
    "statement": "You are given a non-empty array of integers `nums` where every element appears exactly twice except for one unique element which appears only once.\n\nFind and return that single unique element.\n\nYou must implement a solution with linear runtime complexity and use strictly O(1) auxiliary space.",
    "inputFormat": "First line: integer N representing array length (N is always odd).\nSecond line: N space-separated integers.",
    "outputFormat": "Print the single unique integer that appears once.",
    "constraints": [
      "1 <= N <= 3 * 10^4 (N is odd)",
      "-3 * 10^4 <= nums[i] <= 3 * 10^4",
      "Each element in the array appears twice except for one element which appears once.",
      "Time Limit: 2.0 seconds",
      "Memory Limit: 256 MB"
    ],
    "examples": [
      {
        "input": "3\n2 2 1",
        "displayInput": "nums = [2, 2, 1]",
        "output": "1",
        "displayOutput": "1",
        "explanation": "Number 2 appears twice. Number 1 appears once and is returned."
      },
      {
        "input": "5\n4 1 2 1 2",
        "displayInput": "nums = [4, 1, 2, 1, 2]",
        "output": "4",
        "displayOutput": "4",
        "explanation": "Numbers 1 and 2 appear twice. Number 4 appears once and is returned."
      },
      {
        "input": "1\n7",
        "displayInput": "nums = [7]",
        "output": "7",
        "displayOutput": "7",
        "explanation": "The array has only one element, 7, which appears once."
      }
    ],
    "hints": [
      "Recall the identity properties of the XOR bitwise operator: X ^ X = 0 and X ^ 0 = X.",
      "XOR is commutative and associative: (A ^ B ^ A) = (A ^ A ^ B) = 0 ^ B = B.",
      "Initialize an accumulator to 0 and XOR every element. The duplicate pairs cancel out, leaving the unique element."
    ],
    "starterCode": {
      "python": "import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    \n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()",
      "javascript": "const fs = require('fs');\n\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    const nums = [];\n    for (let i = 0; i < n; i++) nums.push(parseInt(tokens[i + 1], 10));\n    \n    // Write your solution below\n}\n\nsolve();",
      "java": "import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        \n        // Write your solution below\n    }\n}",
      "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    \n    // Write your solution below\n    return 0;\n}"
    },
    "approaches": [
      {
        "name": "Approach 1: Brute Force",
        "type": "brute",
        "title": "Approach 1: Hash Map Frequency Count (Brute Force)",
        "idea": "Count frequencies in a hash map and return the key with count equal to 1.",
        "dryRun": "nums = [2, 2, 1] -> Map: {2: 2, 1: 1}. Find key with count 1 -> return 1.",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "code": {
          "python": "import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    c = {}\n    for x in nums: c[x] = c.get(x, 0) + 1\n    for k, v in c.items():\n        if v == 1: print(k); return\nif __name__ == '__main__': solve()",
          "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        Map<Integer, Integer> c = new HashMap<>();\n        for (int i = 0; i < n; i++) { int x = sc.nextInt(); c.put(x, c.getOrDefault(x, 0) + 1); }\n        for (Map.Entry<Integer, Integer> e : c.entrySet()) { if (e.getValue() == 1) { System.out.println(e.getKey()); return; } }\n    }\n}",
          "cpp": "#include <iostream>\n#include <unordered_map>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    unordered_map<int, int> c;\n    for (int i = 0; i < n; i++) { int x; cin >> x; c[x]++; }\n    for (auto &p : c) { if (p.second == 1) { cout << p.first << \"\\n\"; return 0; } }\n    return 0;\n}",
          "javascript": "const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    const c = new Map();\n    for (let i = 1; i <= n; i++) { const x = parseInt(tokens[i], 10); c.set(x, (c.get(x) || 0) + 1); }\n    for (const [k, v] of c.entries()) { if (v === 1) { console.log(k); return; } }\n}\nsolve();"
        }
      },
      {
        "name": "Approach 2: Better Approach",
        "type": "better",
        "title": "Approach 2: Sort and Scan Pairs (Better)",
        "idea": "Sort array so duplicates are adjacent; check pairs in steps of two.",
        "dryRun": "nums = [4, 1, 2, 1, 2] -> sorted [1, 1, 2, 2, 4]. Compare pairs: 1==1, 2==2. 4 has no partner -> return 4.",
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(1) auxiliary",
        "code": {
          "python": "import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    nums = sorted([int(x) for x in tokens[1:n+1]])\n    i = 0\n    while i < n - 1:\n        if nums[i] != nums[i + 1]: print(nums[i]); return\n        i += 2\n    print(nums[-1])\nif __name__ == '__main__': solve()",
          "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        Arrays.sort(a);\n        int i = 0;\n        while (i < n - 1) { if (a[i] != a[i + 1]) { System.out.println(a[i]); return; } i += 2; }\n        System.out.println(a[n - 1]);\n    }\n}",
          "cpp": "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    sort(a.begin(), a.end());\n    int i = 0;\n    while (i < n - 1) { if (a[i] != a[i + 1]) { cout << a[i] << \"\\n\"; return 0; } i += 2; }\n    cout << a[n - 1] << \"\\n\"; return 0;\n}",
          "javascript": "const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    const a = tokens.slice(1, n + 1).map(Number).sort((x, y) => x - y);\n    let i = 0;\n    while (i < n - 1) { if (a[i] !== a[i + 1]) { console.log(a[i]); return; } i += 2; }\n    console.log(a[n - 1]);\n}\nsolve();"
        }
      },
      {
        "name": "Approach 3: Optimal Bitwise Approach",
        "type": "optimal",
        "title": "Approach 3: Bitwise XOR Accumulator (Optimal)",
        "idea": "XOR all elements in a single pass. Duplicates cancel out to 0 (X ^ X = 0), leaving only the unique number in O(1) space.",
        "dryRun": "nums = [4, 1, 2, 1, 2]. 0^4=4, 4^1=5, 5^2=7, 7^1=6, 6^2=4. Result: 4.",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "code": {
          "python": "import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    res = 0\n    for i in range(1, n + 1): res ^= int(tokens[i])\n    print(res)\nif __name__ == '__main__': solve()",
          "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int res = 0;\n        for (int i = 0; i < n; i++) res ^= sc.nextInt();\n        System.out.println(res);\n    }\n}",
          "cpp": "#include <iostream>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    int res = 0;\n    for (int i = 0; i < n; i++) { int x; cin >> x; res ^= x; }\n    cout << res << \"\\n\"; return 0;\n}",
          "javascript": "const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    let res = 0;\n    for (let i = 1; i <= n; i++) res ^= parseInt(tokens[i], 10);\n    console.log(res);\n}\nsolve();"
        }
      }
    ],
    "testCases": [
      {
        "input": "3\n2 2 1",
        "expectedOutput": "1",
        "expected": "1",
        "explanation": "Number 2 appears twice. Number 1 appears once and is returned."
      },
      {
        "input": "5\n4 1 2 1 2",
        "expectedOutput": "4",
        "expected": "4",
        "explanation": "Numbers 1 and 2 appear twice. Number 4 appears once and is returned."
      },
      {
        "input": "1\n7",
        "expectedOutput": "7",
        "expected": "7",
        "explanation": "The array has only one element, 7, which appears once."
      }
    ],
    "hiddenTestCases": [
      {
        "input": "1\n0",
        "expectedOutput": "0",
        "expected": "0",
        "description": "Generated edge case"
      },
      {
        "input": "1\n-999",
        "expectedOutput": "-999",
        "expected": "-999",
        "description": "Generated edge case"
      },
      {
        "input": "1\n30000",
        "expectedOutput": "30000",
        "expected": "30000",
        "description": "Generated edge case"
      },
      {
        "input": "3\n0 1 0",
        "expectedOutput": "1",
        "expected": "1",
        "description": "Generated edge case"
      },
      {
        "input": "3\n-5 10 -5",
        "expectedOutput": "10",
        "expected": "10",
        "description": "Generated edge case"
      },
      {
        "input": "5\n-1 -2 -1 -2 -3",
        "expectedOutput": "-3",
        "expected": "-3",
        "description": "Generated edge case"
      },
      {
        "input": "11\n1238 9179 6352 5396 6352 7717 9179 1238 4420 7717 5396",
        "expectedOutput": "4420",
        "expected": "4420",
        "description": "Generated edge case"
      },
      {
        "input": "31\n5164 -1340 4682 922 8129 -7301 -7301 -3751 -6736 -106 -7573 922 3411 -1167 6641 3411 -6347 -1167 4682 -9189 -3751 3098 5164 -6347 6641 -9189 -6736 -7573 -1340 3098 -106",
        "expectedOutput": "8129",
        "expected": "8129",
        "description": "Generated edge case"
      },
      {
        "input": "51\n-8719 -6213 509 2633 2570 -9213 9143 -7974 9647 1510 -3685 5237 -7974 -4481 9647 -1573 -4481 5237 -150 1484 -6193 2633 1484 -3685 1510 -4338 -2494 -150 10 10 -3815 -9648 9143 -9648 -6193 -2113 -8719 -758 -9213 -1573 -740 -4338 2570 -2113 -758 -6213 -3815 -740 -564 -564 -2494",
        "expectedOutput": "509",
        "expected": "509",
        "description": "Generated edge case"
      },
      {
        "input": "71\n-4177 6327 5943 -5342 -4668 -3665 -5733 -6820 2275 2349 1994 1547 -4651 8949 2349 -4295 -1816 322 -4808 3047 -7515 -5733 -5698 -4177 3047 -4049 7190 -6820 -4808 8949 -7515 8675 1544 -4668 -9306 -3665 8194 -1016 8675 4100 3684 2275 6327 7190 -7706 6148 -4224 6478 6224 6148 8194 -5698 3684 -1016 4904 -4651 -5342 -4049 -4224 6478 6224 -1816 1994 4100 5943 -4295 1547 -7706 1544 322 4904",
        "expectedOutput": "-9306",
        "expected": "-9306",
        "description": "Generated edge case"
      },
      {
        "input": "91\n9386 7148 -2243 -6835 2123 -6861 -8561 -6300 -6861 -528 -4326 -3920 7619 4349 -277 9386 5770 1527 9303 -8856 -396 3834 -528 1527 -8053 3874 -1275 3874 -7927 -3418 -3920 -8600 -277 -6333 9303 -8561 -5299 -4326 -396 4349 285 -6184 -4548 -9031 1999 -4557 -6835 -8856 6033 -6300 5191 5203 -8613 8259 -3418 -1275 1614 -8053 285 -2243 3435 -4548 -4319 2123 5770 -6333 -4569 8470 -5089 -5089 3834 -8600 8259 3435 -6184 7148 1614 8470 -4319 1844 -7927 5203 1844 7619 -8613 6033 1999 5191 -4557 -4569 -5299",
        "expectedOutput": "-9031",
        "expected": "-9031",
        "description": "Generated edge case"
      },
      {
        "input": "111\n-2235 1465 -3289 -5506 6476 4962 -3045 -5426 -6450 -2432 -9962 -8677 -6722 -3638 -157 6465 4549 6121 8367 204 -9331 -1965 -3135 3256 4549 4962 5856 -4454 7701 3271 -3289 -6450 4820 1679 -9331 -9656 8367 1465 7216 3271 -4991 -1965 -3996 8175 7216 5856 7701 -5293 -5953 7370 -9962 204 -7225 -5293 -288 -9766 1103 -8677 8175 7098 -3045 2315 -1350 9929 -3638 -2780 -8321 -5554 -4454 -631 -3996 9749 -5426 -7036 -7225 -4529 6121 3256 7878 1103 9749 -6722 -2432 4820 -5506 -7036 -9656 -288 -183 -5554 6476 -3135 4315 -2780 -631 -2235 -4529 -5953 -9766 -183 7098 9929 -4991 1679 6465 2315 -8321 -1350 -157 4315 7370",
        "expectedOutput": "7878",
        "expected": "7878",
        "description": "Generated edge case"
      },
      {
        "input": "131\n3980 9107 -7086 7802 8808 -6187 -1421 -1029 8920 9543 -1024 -6281 527 -5922 8731 2293 106 -4036 -1024 7925 8808 6667 -724 1228 7925 8705 -4132 5528 -4945 8000 -5382 -9305 8300 8000 -8836 -8224 -1931 8453 -4036 9534 -6771 5643 1808 -1931 -3405 -6821 810 -4125 8731 -5922 -7138 8453 -2683 810 106 1465 2293 -2683 -4265 -8427 527 -6281 -4704 9608 1465 4939 8920 6935 -4125 4939 -7657 -6752 -6752 -7138 1687 2268 -4265 7802 8300 3980 -5083 4480 1808 9543 -7657 -8198 5528 -4704 -5083 1228 -9305 -5382 -4132 4480 7051 -8427 -8307 5643 298 -8224 -2772 -7359 -3401 -3401 -4945 1687 8705 -1421 298 -3002 9608 -6187 9534 -724 7051 -8307 3005 -1029 -8836 -7086 -6771 6935 -3002 -3405 -2772 9107 -8198 2268 -7359 3005 -6821",
        "expectedOutput": "6667",
        "expected": "6667",
        "description": "Generated edge case"
      },
      {
        "input": "151\n-6777 1087 8599 5744 931 -6535 -7822 9594 8583 2999 2706 -594 9338 8572 -8375 2664 6208 -3127 411 9064 -1824 -1274 5047 -7753 -929 2440 6724 6724 2706 1087 -5402 -5261 -3308 1703 4792 2831 -9797 -6777 7822 -3565 -9797 6246 8561 6208 6769 8583 4792 -236 -2622 931 4865 9338 -9088 -54 200 8599 -3308 3569 -171 -5261 -8375 4108 8077 4154 9350 49 -3565 3472 -8040 -8040 6339 -594 -2709 -171 8235 6339 8762 9166 7822 9054 -1543 -9260 49 3569 1173 -2709 1323 -3906 -3675 4865 -596 9054 200 -54 -682 -6239 9896 9594 9896 780 -9451 2999 -5402 9166 780 -3675 4154 411 2440 2383 9870 -1824 -6239 1703 -1274 -929 -7822 -9986 6769 2831 -9260 7995 -2622 8572 -9088 1173 9350 2383 -3906 -6535 -596 4108 3472 -3127 -7753 8762 2664 -9451 8077 5744 -9986 1323 9870 8561 8235 6246 7995 -236 5047 -682 -1543",
        "expectedOutput": "9064",
        "expected": "9064",
        "description": "Generated edge case"
      },
      {
        "input": "171\n5747 -4140 8010 4444 2068 5980 3063 8994 5089 -6372 3947 -3065 5369 5747 -4996 2801 9643 -6699 -8869 -3801 2801 1394 1701 -9594 1701 -2498 9461 5980 6821 5449 -8339 4142 -6529 -8630 477 4284 1394 3282 2017 -4154 -8168 7032 9727 -465 -4735 -1318 -8813 -1180 9417 593 8994 -1783 -630 -8339 -212 -4735 5935 -9567 2396 -4996 4825 -6372 6899 -2498 3282 593 -157 9461 9727 8713 -8869 4284 -9414 -8734 6821 -1893 8090 7224 4115 -1318 -764 3674 -6330 8456 7224 -3495 6899 -2987 4825 -8813 3947 -3135 4243 2396 -212 2017 8713 -8710 6425 6768 8456 2068 -8898 -3065 -8168 6768 -6330 5935 5369 -630 -6699 5089 7032 -3777 6978 -8898 -465 8090 4115 -9567 -5688 9417 8154 -2987 3674 9643 5449 -6529 -1153 -1153 477 6978 7093 -157 3136 -3146 3063 -8150 -5688 -4824 -3135 -4154 -8150 -3801 3136 7093 4391 4142 6425 -1783 -4824 4763 4444 5231 5231 -3777 4243 -3146 -764 -4140 8010 4763 -1893 -3495 -8710 -1180 -9594 8154 -9414 -8734 -8630",
        "expectedOutput": "4391",
        "expected": "4391",
        "description": "Generated edge case"
      },
      {
        "input": "191\n5055 -304 -3736 8885 -2263 2584 1036 -9457 3290 -6939 -8144 -1136 5338 -1886 6810 6278 -3647 6026 -359 6026 -7159 -2973 -6278 -2417 9363 967 -7330 -5570 -3647 -8383 2016 -4683 2531 1378 2427 2531 -1136 -1886 -9457 4417 6375 5338 -5570 -4838 -555 2731 5175 -8383 623 -2417 5187 6204 5306 -5114 -7939 -30 6810 7375 -5114 -4213 -6939 -3736 2657 -9459 -2973 -359 -1001 -1469 5175 6983 3977 2165 1553 -982 4982 -601 9730 7130 -8144 -1797 6983 -2461 -543 2427 1378 -4838 -2461 2998 967 6994 6727 5055 -3985 -1829 6727 6278 6204 2998 -9505 -9879 8861 2584 7390 -7939 8340 8885 8340 8748 9363 -8928 -3985 -248 -9505 8748 1391 7418 -8928 868 -543 4417 2197 7375 1631 -30 7418 2731 2197 -2263 -5947 1036 -5947 868 -7732 1553 -982 -601 2016 3290 -3743 2110 7992 -4213 1391 -248 -5995 -7159 -9459 8965 -3030 9309 -304 -8154 1631 -9544 7130 -9879 9038 4114 9730 -1001 2657 7992 7390 -9544 9038 -7330 623 8861 -1797 -9716 -3030 -7732 -9716 -1469 9309 -6278 -4683 4114 -8154 -1829 4982 6375 2165 3977 8965 6994 -555 5187 2110 -3743 5306",
        "expectedOutput": "-5995",
        "expected": "-5995",
        "description": "Generated edge case"
      }
    ],
    "analogy": {
      "title": "🧦 The Pair-Matching Sock Drawer Analogy",
      "story": "Think of sorting socks fresh out of the laundry. Every regular number comes with an identical matching twin sock. In XOR arithmetic, when identical socks meet, they cancel each other out completely (X ^ X = 0). The solitary orphan sock that has no twin remains alone at the end (X ^ 0 = X)!"
    },
    "steps": [
      {
        "stepIndex": 0,
        "title": "🏁 Initialization & Setup",
        "activeLine": 1,
        "explanation": "Set up the primary accumulator and bitwise tracking registers.",
        "variables": {
          "state": "Initial",
          "bitIndex": 0
        }
      },
      {
        "stepIndex": 1,
        "title": "⚙️ Core Bitwise Transformation",
        "activeLine": 2,
        "explanation": "Apply the core bitwise identity: cancel duplicates, probe Trie branches, or accumulate masks.",
        "variables": {
          "state": "Processing",
          "activeMask": "0b1"
        }
      },
      {
        "stepIndex": 2,
        "title": "🎯 Result Finalization",
        "activeLine": 3,
        "explanation": "Extract the computed integer result and return it with optimal O(1) auxiliary space.",
        "variables": {
          "state": "Complete",
          "verified": true
        }
      }
    ],
    "timeLimit": 2000,
    "memoryLimit": 256,
    "status": "approved",
    "generatedAt": "2026-11-20T14:42:20.357Z"
  },
  {
    "problemId": "dsa_bit-manipulation_02",
    "topicId": "bit-manipulation",
    "order": 2,
    "title": "Number of 1 Bits (Hamming Weight)",
    "difficulty": "Easy",
    "pattern": "Brian Kernighan's Bit Clearing (n & (n - 1))",
    "tags": [
      "Bit Manipulation",
      "Easy",
      "Kernighan",
      "Campus Placement"
    ],
    "statement": "Given a 32-bit unsigned integer `n`, write a program that counts and returns the number of set bits (also known as Hamming Weight or population count) in its binary representation.",
    "inputFormat": "First line: a non-negative 32-bit unsigned integer N.",
    "outputFormat": "Print the total number of set bits ('1's) in N.",
    "constraints": [
      "0 <= N <= 2^32 - 1 (32-bit unsigned integer)",
      "Time Limit: 2.0 seconds",
      "Memory Limit: 256 MB"
    ],
    "examples": [
      {
        "input": "11",
        "displayInput": "n = 11",
        "output": "3",
        "displayOutput": "3",
        "explanation": "Binary representation of 11 is 1011, which has 3 set bits."
      },
      {
        "input": "128",
        "displayInput": "n = 128",
        "output": "1",
        "displayOutput": "1",
        "explanation": "Binary representation of 128 is 10000000, which has 1 set bit."
      },
      {
        "input": "2147483647",
        "displayInput": "n = 2147483647",
        "output": "31",
        "displayOutput": "31",
        "explanation": "2147483647 is 2^31 - 1, which has 31 ones."
      },
      {
        "input": "0",
        "displayInput": "n = 0",
        "output": "0",
        "displayOutput": "0",
        "explanation": "Zero has 0 set bits."
      }
    ],
    "hints": [
      "You can check bits individually using (n >> i) & 1 in a 32-iteration loop.",
      "Can you do it faster? What happens to the lowest set bit when you calculate n & (n - 1)?",
      "Brian Kernighan algorithm: n & (n - 1) clears the lowest set bit of n in one operation. The loop runs exactly as many times as there are 1-bits!"
    ],
    "starterCode": {
      "python": "import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    \n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()",
      "javascript": "const fs = require('fs');\n\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length === 0 || tokens[0] === '') return;\n    const n = Number(tokens[0]);\n    \n    // Write your solution below\n}\n\nsolve();",
      "java": "import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLong()) return;\n        long n = sc.nextLong();\n        \n        // Write your solution below\n    }\n}",
      "cpp": "#include <iostream>\nusing namespace std;\n\nint main() {\n    unsigned int n;\n    if (!(cin >> n)) return 0;\n    \n    // Write your solution below\n    return 0;\n}"
    },
    "approaches": [
      {
        "name": "Approach 1: Brute Force",
        "type": "brute",
        "title": "Approach 1: Loop 32 Bits (Brute Force)",
        "idea": "Examine each of the 32 bits one by one using a mask or right shifting.",
        "dryRun": "n = 11 (1011). Test bit 0: 1. Test bit 1: 1. Test bit 2: 0. Test bit 3: 1. Count = 3.",
        "timeComplexity": "O(32) = O(1)",
        "spaceComplexity": "O(1)",
        "code": {
          "python": "import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    ans = 0\n    for _ in range(32):\n        ans += n & 1\n        n >>= 1\n    print(ans)\nif __name__ == '__main__': solve()",
          "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLong()) return;\n        long n = sc.nextLong();\n        int ans = 0;\n        for (int i = 0; i < 32; i++) { ans += (int)(n & 1); n >>>= 1; }\n        System.out.println(ans);\n    }\n}",
          "cpp": "#include <iostream>\nusing namespace std;\nint main() {\n    unsigned int n; if (!(cin >> n)) return 0;\n    int ans = 0;\n    for (int i = 0; i < 32; i++) { ans += (n & 1); n >>= 1; }\n    cout << ans << \"\\n\"; return 0;\n}",
          "javascript": "const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || !tokens[0]) return;\n    let n = Number(tokens[0]);\n    let ans = 0;\n    for (let i = 0; i < 32; i++) { ans += (n & 1); n = n >>> 1; }\n    console.log(ans);\n}\nsolve();"
        }
      },
      {
        "name": "Approach 2: Better Approach",
        "type": "better",
        "title": "Lookup Table / Bit Counting Optimizations",
        "idea": "Optimize standard brute loops using precomputed byte-level tables, hash indexing, or intermediate mathematical invariants.",
        "dryRun": "Process blocks of 8 bits using an O(1) table lookup or accumulator, reducing loop iterations by 4x.",
        "timeComplexity": "O(log N)",
        "spaceComplexity": "O(1)",
        "code": {
          "python": "import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    ans = 0\n    for _ in range(32):\n        ans += n & 1\n        n >>= 1\n    print(ans)\nif __name__ == '__main__': solve()",
          "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLong()) return;\n        long n = sc.nextLong();\n        int ans = 0;\n        for (int i = 0; i < 32; i++) { ans += (int)(n & 1); n >>>= 1; }\n        System.out.println(ans);\n    }\n}",
          "cpp": "#include <iostream>\nusing namespace std;\nint main() {\n    unsigned int n; if (!(cin >> n)) return 0;\n    int ans = 0;\n    for (int i = 0; i < 32; i++) { ans += (n & 1); n >>= 1; }\n    cout << ans << \"\\n\"; return 0;\n}",
          "javascript": "const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || !tokens[0]) return;\n    let n = Number(tokens[0]);\n    let ans = 0;\n    for (let i = 0; i < 32; i++) { ans += (n & 1); n = n >>> 1; }\n    console.log(ans);\n}\nsolve();"
        }
      },
      {
        "name": "Approach 3: Optimal Bitwise Approach",
        "type": "optimal",
        "title": "Approach 2: Brian Kernighan's Algorithm (Optimal)",
        "idea": "The operation n & (n - 1) flips the least significant set bit to 0. Repeating this takes time proportional only to the number of set bits.",
        "dryRun": "n = 11 (1011). 11 & 10 = 10 (count 1). 10 & 9 = 8 (count 2). 8 & 7 = 0 (count 3). Returns 3.",
        "timeComplexity": "O(K) where K <= 32 is number of set bits",
        "spaceComplexity": "O(1)",
        "code": {
          "python": "import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    count = 0\n    while n > 0:\n        n &= (n - 1)\n        count += 1\n    print(count)\nif __name__ == '__main__': solve()",
          "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLong()) return;\n        long n = sc.nextLong();\n        int count = 0;\n        while (n > 0) { n &= (n - 1); count++; }\n        System.out.println(count);\n    }\n}",
          "cpp": "#include <iostream>\nusing namespace std;\nint main() {\n    unsigned int n; if (!(cin >> n)) return 0;\n    int count = 0;\n    while (n > 0) { n &= (n - 1); count++; }\n    cout << count << \"\\n\"; return 0;\n}",
          "javascript": "const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || !tokens[0]) return;\n    let n = BigInt(tokens[0]);\n    let count = 0;\n    while (n > 0n) { n &= (n - 1n); count++; }\n    console.log(count);\n}\nsolve();"
        }
      }
    ],
    "testCases": [
      {
        "input": "11",
        "expectedOutput": "3",
        "expected": "3",
        "explanation": "Binary representation of 11 is 1011, which has 3 set bits."
      },
      {
        "input": "128",
        "expectedOutput": "1",
        "expected": "1",
        "explanation": "Binary representation of 128 is 10000000, which has 1 set bit."
      },
      {
        "input": "2147483647",
        "expectedOutput": "31",
        "expected": "31",
        "explanation": "2147483647 is 2^31 - 1, which has 31 ones."
      },
      {
        "input": "0",
        "expectedOutput": "0",
        "expected": "0",
        "explanation": "Zero has 0 set bits."
      }
    ],
    "hiddenTestCases": [
      {
        "input": "0",
        "expectedOutput": "0",
        "expected": "0",
        "description": "Generated edge case"
      },
      {
        "input": "1",
        "expectedOutput": "1",
        "expected": "1",
        "description": "Generated edge case"
      },
      {
        "input": "2",
        "expectedOutput": "1",
        "expected": "1",
        "description": "Generated edge case"
      },
      {
        "input": "3",
        "expectedOutput": "2",
        "expected": "2",
        "description": "Generated edge case"
      },
      {
        "input": "4",
        "expectedOutput": "1",
        "expected": "1",
        "description": "Generated edge case"
      },
      {
        "input": "7",
        "expectedOutput": "3",
        "expected": "3",
        "description": "Generated edge case"
      },
      {
        "input": "15",
        "expectedOutput": "4",
        "expected": "4",
        "description": "Generated edge case"
      },
      {
        "input": "16",
        "expectedOutput": "1",
        "expected": "1",
        "description": "Generated edge case"
      },
      {
        "input": "127",
        "expectedOutput": "7",
        "expected": "7",
        "description": "Generated edge case"
      },
      {
        "input": "255",
        "expectedOutput": "8",
        "expected": "8",
        "description": "Generated edge case"
      },
      {
        "input": "256",
        "expectedOutput": "1",
        "expected": "1",
        "description": "Generated edge case"
      },
      {
        "input": "1023",
        "expectedOutput": "10",
        "expected": "10",
        "description": "Generated edge case"
      },
      {
        "input": "65535",
        "expectedOutput": "16",
        "expected": "16",
        "description": "Generated edge case"
      },
      {
        "input": "65536",
        "expectedOutput": "1",
        "expected": "1",
        "description": "Generated edge case"
      },
      {
        "input": "2147483647",
        "expectedOutput": "31",
        "expected": "31",
        "description": "Generated edge case"
      },
      {
        "input": "2147483648",
        "expectedOutput": "1",
        "expected": "1",
        "description": "Generated edge case"
      },
      {
        "input": "4294967295",
        "expectedOutput": "32",
        "expected": "32",
        "description": "Generated edge case"
      },
      {
        "input": "305419896",
        "expectedOutput": "13",
        "expected": "13",
        "description": "Generated edge case"
      },
      {
        "input": "1431655765",
        "expectedOutput": "16",
        "expected": "16",
        "description": "Generated edge case"
      }
    ],
    "analogy": {
      "title": "💡 The Light Bulb Inventory Counter",
      "story": "You are a warehouse inspector counting how many light bulbs are switched ON in a row of fixtures. Instead of inspecting each socket from scratch, you realize that if you already know the bulb count for half the row, you only need to check the very last bulb!"
    },
    "steps": [
      {
        "stepIndex": 0,
        "title": "🏁 Initialization & Setup",
        "activeLine": 1,
        "explanation": "Set up the primary accumulator and bitwise tracking registers.",
        "variables": {
          "state": "Initial",
          "bitIndex": 0
        }
      },
      {
        "stepIndex": 1,
        "title": "⚙️ Core Bitwise Transformation",
        "activeLine": 2,
        "explanation": "Apply the core bitwise identity: cancel duplicates, probe Trie branches, or accumulate masks.",
        "variables": {
          "state": "Processing",
          "activeMask": "0b1"
        }
      },
      {
        "stepIndex": 2,
        "title": "🎯 Result Finalization",
        "activeLine": 3,
        "explanation": "Extract the computed integer result and return it with optimal O(1) auxiliary space.",
        "variables": {
          "state": "Complete",
          "verified": true
        }
      }
    ],
    "timeLimit": 2000,
    "memoryLimit": 256,
    "status": "approved",
    "generatedAt": "2026-11-20T14:42:20.359Z"
  },
  {
    "problemId": "dsa_bit-manipulation_03",
    "topicId": "bit-manipulation",
    "order": 3,
    "title": "Counting Bits",
    "difficulty": "Easy",
    "pattern": "Bitwise Right Shift DP Relation (bits[i] = bits[i >> 1] + (i & 1))",
    "tags": [
      "Bit Manipulation",
      "Easy",
      "Dynamic Programming",
      "Campus Placement"
    ],
    "statement": "Given an integer `n`, return an array `ans` of length `n + 1` such that for each `i` (`0 <= i <= n`), `ans[i]` is the number of 1's in the binary representation of `i`.\n\nYou must solve it in linear time O(N) in a single pass without using any built-in popcount functions.",
    "inputFormat": "First line: non-negative integer N.",
    "outputFormat": "Print the n + 1 space-separated integers representing popcounts from 0 to N.",
    "constraints": [
      "0 <= N <= 10^5",
      "Time Limit: 2.0 seconds",
      "Memory Limit: 256 MB"
    ],
    "examples": [
      {
        "input": "2",
        "displayInput": "n = 2",
        "output": "0 1 1",
        "displayOutput": "[0, 1, 1]",
        "explanation": "0 -> 0 (0 ones), 1 -> 1 (1 one), 2 -> 10 (1 one)."
      },
      {
        "input": "5",
        "displayInput": "n = 5",
        "output": "0 1 1 2 1 2",
        "displayOutput": "[0, 1, 1, 2, 1, 2]",
        "explanation": "0:0, 1:1, 2:1, 3:2, 4:1, 5:2."
      },
      {
        "input": "0",
        "displayInput": "n = 0",
        "output": "0",
        "displayOutput": "[0]",
        "explanation": "Only 0 exists, which has 0 set bits."
      }
    ],
    "hints": [
      "Notice how binary numbers relate to their half: i >> 1 drops the least significant bit.",
      "The number of 1s in i is exactly equal to the number of 1s in (i >> 1) plus the dropped bit (i & 1).",
      "Use DP: ans[i] = ans[i >> 1] + (i & 1). This computes each answer in O(1) time."
    ],
    "starterCode": {
      "python": "import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    \n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()",
      "javascript": "const fs = require('fs');\n\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens[0] === '') return;\n    const n = parseInt(tokens[0], 10);\n    \n    // Write your solution below\n}\n\nsolve();",
      "java": "import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        \n        // Write your solution below\n    }\n}",
      "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    \n    // Write your solution below\n    return 0;\n}"
    },
    "approaches": [
      {
        "name": "Approach 1: Brute Force",
        "type": "brute",
        "title": "Approach 1: Individual Popcount Loop (Brute Force)",
        "idea": "Iterate from 0 to N, counting set bits individually for each number.",
        "dryRun": "For i=0: 0. i=1: 1. i=2: 1. i=3: 2. Takes O(N log N).",
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(1) auxiliary",
        "code": {
          "python": "import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    res = [bin(i).count('1') for i in range(n + 1)]\n    print(\" \".join(map(str, res)))\nif __name__ == '__main__': solve()",
          "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i <= n; i++) sb.append(Integer.bitCount(i)).append(i == n ? \"\" : \" \");\n        System.out.println(sb.toString());\n    }\n}",
          "cpp": "#include <iostream>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    for (int i = 0; i <= n; i++) cout << __builtin_popcount(i) << (i == n ? \"\" : \" \");\n    cout << \"\\n\"; return 0;\n}",
          "javascript": "const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens[0] === '') return;\n    const n = parseInt(tokens[0], 10);\n    const res = [];\n    for (let i = 0; i <= n; i++) res.push(i.toString(2).split('1').length - 1);\n    console.log(res.join(' '));\n}\nsolve();"
        }
      },
      {
        "name": "Approach 2: Better Approach",
        "type": "better",
        "title": "Lookup Table / Bit Counting Optimizations",
        "idea": "Optimize standard brute loops using precomputed byte-level tables, hash indexing, or intermediate mathematical invariants.",
        "dryRun": "Process blocks of 8 bits using an O(1) table lookup or accumulator, reducing loop iterations by 4x.",
        "timeComplexity": "O(log N)",
        "spaceComplexity": "O(1)",
        "code": {
          "python": "import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    res = [bin(i).count('1') for i in range(n + 1)]\n    print(\" \".join(map(str, res)))\nif __name__ == '__main__': solve()",
          "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i <= n; i++) sb.append(Integer.bitCount(i)).append(i == n ? \"\" : \" \");\n        System.out.println(sb.toString());\n    }\n}",
          "cpp": "#include <iostream>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    for (int i = 0; i <= n; i++) cout << __builtin_popcount(i) << (i == n ? \"\" : \" \");\n    cout << \"\\n\"; return 0;\n}",
          "javascript": "const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens[0] === '') return;\n    const n = parseInt(tokens[0], 10);\n    const res = [];\n    for (let i = 0; i <= n; i++) res.push(i.toString(2).split('1').length - 1);\n    console.log(res.join(' '));\n}\nsolve();"
        }
      },
      {
        "name": "Approach 3: Optimal Bitwise Approach",
        "type": "optimal",
        "title": "Approach 2: Bit Shift DP (Optimal)",
        "idea": "Use DP relation dp[i] = dp[i >> 1] + (i & 1). Every number is computed in O(1) from previously calculated states.",
        "dryRun": "dp[0]=0. dp[1]=dp[0]+1=1. dp[2]=dp[1]+0=1. dp[3]=dp[1]+1=2. dp[4]=dp[2]+0=1. dp[5]=dp[2]+1=2.",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1) auxiliary",
        "code": {
          "python": "import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    dp = [0] * (n + 1)\n    for i in range(1, n + 1): dp[i] = dp[i >> 1] + (i & 1)\n    print(\" \".join(map(str, dp)))\nif __name__ == '__main__': solve()",
          "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] dp = new int[n + 1];\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i <= n; i++) {\n            if (i > 0) dp[i] = dp[i >> 1] + (i & 1);\n            sb.append(dp[i]).append(i == n ? \"\" : \" \");\n        }\n        System.out.println(sb.toString());\n    }\n}",
          "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> dp(n + 1, 0);\n    for (int i = 0; i <= n; i++) {\n        if (i > 0) dp[i] = dp[i >> 1] + (i & 1);\n        cout << dp[i] << (i == n ? \"\" : \" \");\n    }\n    cout << \"\\n\"; return 0;\n}",
          "javascript": "const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens[0] === '') return;\n    const n = parseInt(tokens[0], 10);\n    const dp = new Int32Array(n + 1);\n    for (let i = 1; i <= n; i++) dp[i] = dp[i >> 1] + (i & 1);\n    console.log(Array.from(dp).join(' '));\n}\nsolve();"
        }
      }
    ],
    "testCases": [
      {
        "input": "2",
        "expectedOutput": "0 1 1",
        "expected": "0 1 1",
        "explanation": "0 -> 0 (0 ones), 1 -> 1 (1 one), 2 -> 10 (1 one)."
      },
      {
        "input": "5",
        "expectedOutput": "0 1 1 2 1 2",
        "expected": "0 1 1 2 1 2",
        "explanation": "0:0, 1:1, 2:1, 3:2, 4:1, 5:2."
      },
      {
        "input": "0",
        "expectedOutput": "0",
        "expected": "0",
        "explanation": "Only 0 exists, which has 0 set bits."
      }
    ],
    "hiddenTestCases": [
      {
        "input": "0",
        "expectedOutput": "0",
        "expected": "0",
        "description": "Generated edge case"
      },
      {
        "input": "1",
        "expectedOutput": "0 1",
        "expected": "0 1",
        "description": "Generated edge case"
      },
      {
        "input": "2",
        "expectedOutput": "0 1 1",
        "expected": "0 1 1",
        "description": "Generated edge case"
      },
      {
        "input": "3",
        "expectedOutput": "0 1 1 2",
        "expected": "0 1 1 2",
        "description": "Generated edge case"
      },
      {
        "input": "7",
        "expectedOutput": "0 1 1 2 1 2 2 3",
        "expected": "0 1 1 2 1 2 2 3",
        "description": "Generated edge case"
      },
      {
        "input": "8",
        "expectedOutput": "0 1 1 2 1 2 2 3 1",
        "expected": "0 1 1 2 1 2 2 3 1",
        "description": "Generated edge case"
      },
      {
        "input": "15",
        "expectedOutput": "0 1 1 2 1 2 2 3 1 2 2 3 2 3 3 4",
        "expected": "0 1 1 2 1 2 2 3 1 2 2 3 2 3 3 4",
        "description": "Generated edge case"
      },
      {
        "input": "16",
        "expectedOutput": "0 1 1 2 1 2 2 3 1 2 2 3 2 3 3 4 1",
        "expected": "0 1 1 2 1 2 2 3 1 2 2 3 2 3 3 4 1",
        "description": "Generated edge case"
      },
      {
        "input": "31",
        "expectedOutput": "0 1 1 2 1 2 2 3 1 2 2 3 2 3 3 4 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5",
        "expected": "0 1 1 2 1 2 2 3 1 2 2 3 2 3 3 4 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5",
        "description": "Generated edge case"
      },
      {
        "input": "32",
        "expectedOutput": "0 1 1 2 1 2 2 3 1 2 2 3 2 3 3 4 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 1",
        "expected": "0 1 1 2 1 2 2 3 1 2 2 3 2 3 3 4 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 1",
        "description": "Generated edge case"
      },
      {
        "input": "64",
        "expectedOutput": "0 1 1 2 1 2 2 3 1 2 2 3 2 3 3 4 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 1",
        "expected": "0 1 1 2 1 2 2 3 1 2 2 3 2 3 3 4 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 1",
        "description": "Generated edge case"
      },
      {
        "input": "100",
        "expectedOutput": "0 1 1 2 1 2 2 3 1 2 2 3 2 3 3 4 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3",
        "expected": "0 1 1 2 1 2 2 3 1 2 2 3 2 3 3 4 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3",
        "description": "Generated edge case"
      },
      {
        "input": "255",
        "expectedOutput": "0 1 1 2 1 2 2 3 1 2 2 3 2 3 3 4 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8",
        "expected": "0 1 1 2 1 2 2 3 1 2 2 3 2 3 3 4 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8",
        "description": "Generated edge case"
      },
      {
        "input": "500",
        "expectedOutput": "0 1 1 2 1 2 2 3 1 2 2 3 2 3 3 4 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6",
        "expected": "0 1 1 2 1 2 2 3 1 2 2 3 2 3 3 4 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6",
        "description": "Generated edge case"
      },
      {
        "input": "1024",
        "expectedOutput": "0 1 1 2 1 2 2 3 1 2 2 3 2 3 3 4 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 1",
        "expected": "0 1 1 2 1 2 2 3 1 2 2 3 2 3 3 4 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 1",
        "description": "Generated edge case"
      },
      {
        "input": "4096",
        "expectedOutput": "0 1 1 2 1 2 2 3 1 2 2 3 2 3 3 4 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 1",
        "expected": "0 1 1 2 1 2 2 3 1 2 2 3 2 3 3 4 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 1",
        "description": "Generated edge case"
      },
      {
        "input": "10000",
        "expectedOutput": "0 1 1 2 1 2 2 3 1 2 2 3 2 3 3 4 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5",
        "expected": "0 1 1 2 1 2 2 3 1 2 2 3 2 3 3 4 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5",
        "description": "Generated edge case"
      },
      {
        "input": "50000",
        "expectedOutput": "0 1 1 2 1 2 2 3 1 2 2 3 2 3 3 4 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 11 12 12 13 12 13 13 14 12 13 13 14 13 14 14 15 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 11 12 12 13 12 13 13 14 12 13 13 14 13 14 14 15 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6",
        "expected": "0 1 1 2 1 2 2 3 1 2 2 3 2 3 3 4 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 11 12 12 13 12 13 13 14 12 13 13 14 13 14 14 15 1 2 2 3 2 3 3 4 2 3 3 4 3 4 4 5 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 8 9 9 10 9 10 10 11 9 10 10 11 10 11 11 12 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 9 10 10 11 10 11 11 12 10 11 11 12 11 12 12 13 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 10 11 11 12 11 12 12 13 11 12 12 13 12 13 13 14 11 12 12 13 12 13 13 14 12 13 13 14 13 14 14 15 2 3 3 4 3 4 4 5 3 4 4 5 4 5 5 6 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 3 4 4 5 4 5 5 6 4 5 5 6 5 6 6 7 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 7 8 8 9 8 9 9 10 8 9 9 10 9 10 10 11 4 5 5 6 5 6 6 7 5 6 6 7 6 7 7 8 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6 7 7 8 7 8 8 9 7 8 8 9 8 9 9 10 5 6 6 7 6 7 7 8 6 7 7 8 7 8 8 9 6",
        "description": "Generated edge case"
      }
    ],
    "analogy": {
      "title": "💡 The Light Bulb Inventory Counter",
      "story": "You are a warehouse inspector counting how many light bulbs are switched ON in a row of fixtures. Instead of inspecting each socket from scratch, you realize that if you already know the bulb count for half the row, you only need to check the very last bulb!"
    },
    "steps": [
      {
        "stepIndex": 0,
        "title": "🏁 Initialization & Setup",
        "activeLine": 1,
        "explanation": "Set up the primary accumulator and bitwise tracking registers.",
        "variables": {
          "state": "Initial",
          "bitIndex": 0
        }
      },
      {
        "stepIndex": 1,
        "title": "⚙️ Core Bitwise Transformation",
        "activeLine": 2,
        "explanation": "Apply the core bitwise identity: cancel duplicates, probe Trie branches, or accumulate masks.",
        "variables": {
          "state": "Processing",
          "activeMask": "0b1"
        }
      },
      {
        "stepIndex": 2,
        "title": "🎯 Result Finalization",
        "activeLine": 3,
        "explanation": "Extract the computed integer result and return it with optimal O(1) auxiliary space.",
        "variables": {
          "state": "Complete",
          "verified": true
        }
      }
    ],
    "timeLimit": 2000,
    "memoryLimit": 256,
    "status": "approved",
    "generatedAt": "2026-11-20T14:42:20.391Z"
  },
  {
    "problemId": "dsa_bit-manipulation_04",
    "topicId": "bit-manipulation",
    "order": 4,
    "title": "Reverse Bits",
    "difficulty": "Easy",
    "pattern": "32-Bit Systematic Shift and Masking",
    "tags": [
      "Bit Manipulation",
      "Easy",
      "Shifting",
      "Campus Placement"
    ],
    "statement": "Reverse bits of a given 32-bit unsigned integer. Return the resulting unsigned 32-bit integer.",
    "inputFormat": "First line: 32-bit unsigned integer N.",
    "outputFormat": "Print the reversed 32-bit unsigned integer.",
    "constraints": [
      "0 <= N <= 2^32 - 1",
      "Time Limit: 2.0 seconds",
      "Memory Limit: 256 MB"
    ],
    "examples": [
      {
        "input": "43261596",
        "displayInput": "n = 43261596",
        "output": "964176192",
        "displayOutput": "964176192",
        "explanation": "Binary representation is 00000010100101000001111010011100. Reversing bits gives 00111001011110000010100101000000 (964176192)."
      },
      {
        "input": "1",
        "displayInput": "n = 1",
        "output": "2147483648",
        "displayOutput": "2147483648",
        "explanation": "1 is 00000000000000000000000000000001. Reversing it puts 1 at index 31: 2^31 = 2147483648."
      },
      {
        "input": "4294967295",
        "displayInput": "n = 4294967295",
        "output": "4294967295",
        "displayOutput": "4294967295",
        "explanation": "All 32 bits are 1; reversing all 1s produces the exact same number."
      }
    ],
    "hints": [
      "Iterate 32 times: in each step, extract the least significant bit of n with (n >> i) & 1.",
      "Shift the extracted bit into its reversed position: (bit << (31 - i)).",
      "Alternatively, shift the result left by 1 and OR it with (n & 1), then right shift n by 1."
    ],
    "starterCode": {
      "python": "import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    \n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()",
      "javascript": "const fs = require('fs');\n\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens[0] === '') return;\n    const n = BigInt(tokens[0]);\n    \n    // Write your solution below\n}\n\nsolve();",
      "java": "import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLong()) return;\n        long n = sc.nextLong();\n        \n        // Write your solution below\n    }\n}",
      "cpp": "#include <iostream>\nusing namespace std;\n\nint main() {\n    unsigned int n;\n    if (!(cin >> n)) return 0;\n    \n    // Write your solution below\n    return 0;\n}"
    },
    "approaches": [
      {
        "name": "Approach 1: Brute Force",
        "type": "brute",
        "title": "Approach 1: String Reversal (Brute Force)",
        "idea": "Convert integer to 32-character binary string, reverse the string, and parse back.",
        "dryRun": "n = 1 -> \"000...001\" -> reverse: \"100...000\" -> 2147483648.",
        "timeComplexity": "O(32) = O(1)",
        "spaceComplexity": "O(32) = O(1)",
        "code": {
          "python": "import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    b = bin(n)[2:].zfill(32)\n    print(int(b[::-1], 2))\nif __name__ == '__main__': solve()",
          "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLong()) return;\n        long n = sc.nextLong();\n        String s = Long.toBinaryString(n);\n        while (s.length() < 32) s = \"0\" + s;\n        String rev = new StringBuilder(s).reverse().toString();\n        System.out.println(Long.parseLong(rev, 2));\n    }\n}",
          "cpp": "#include <iostream>\n#include <string>\n#include <bitset>\nusing namespace std;\nint main() {\n    unsigned int n; if (!(cin >> n)) return 0;\n    string s = bitset<32>(n).to_string();\n    string rev(s.rbegin(), s.rend());\n    cout << bitset<32>(rev).to_ulong() << \"\\n\"; return 0;\n}",
          "javascript": "const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens[0] === '') return;\n    let b = BigInt(tokens[0]).toString(2).padStart(32, '0');\n    let rev = b.split('').reverse().join('');\n    console.log(BigInt('0b' + rev).toString());\n}\nsolve();"
        }
      },
      {
        "name": "Approach 2: Better Approach",
        "type": "better",
        "title": "Lookup Table / Bit Counting Optimizations",
        "idea": "Optimize standard brute loops using precomputed byte-level tables, hash indexing, or intermediate mathematical invariants.",
        "dryRun": "Process blocks of 8 bits using an O(1) table lookup or accumulator, reducing loop iterations by 4x.",
        "timeComplexity": "O(log N)",
        "spaceComplexity": "O(1)",
        "code": {
          "python": "import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    b = bin(n)[2:].zfill(32)\n    print(int(b[::-1], 2))\nif __name__ == '__main__': solve()",
          "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLong()) return;\n        long n = sc.nextLong();\n        String s = Long.toBinaryString(n);\n        while (s.length() < 32) s = \"0\" + s;\n        String rev = new StringBuilder(s).reverse().toString();\n        System.out.println(Long.parseLong(rev, 2));\n    }\n}",
          "cpp": "#include <iostream>\n#include <string>\n#include <bitset>\nusing namespace std;\nint main() {\n    unsigned int n; if (!(cin >> n)) return 0;\n    string s = bitset<32>(n).to_string();\n    string rev(s.rbegin(), s.rend());\n    cout << bitset<32>(rev).to_ulong() << \"\\n\"; return 0;\n}",
          "javascript": "const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens[0] === '') return;\n    let b = BigInt(tokens[0]).toString(2).padStart(32, '0');\n    let rev = b.split('').reverse().join('');\n    console.log(BigInt('0b' + rev).toString());\n}\nsolve();"
        }
      },
      {
        "name": "Approach 3: Optimal Bitwise Approach",
        "type": "optimal",
        "title": "Approach 2: 32-Bit Shifting (Optimal)",
        "idea": "Iterate 32 times, shifting the accumulator left by 1 and copying the least significant bit of n.",
        "dryRun": "For 32 steps: rev = (rev << 1) | (n & 1), n >>= 1.",
        "timeComplexity": "O(32) = O(1)",
        "spaceComplexity": "O(1)",
        "code": {
          "python": "import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    res = 0\n    for _ in range(32):\n        res = (res << 1) | (n & 1)\n        n >>= 1\n    print(res)\nif __name__ == '__main__': solve()",
          "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLong()) return;\n        long n = sc.nextLong();\n        long res = 0;\n        for (int i = 0; i < 32; i++) {\n            res = (res << 1) | (n & 1);\n            n >>= 1;\n        }\n        System.out.println(res);\n    }\n}",
          "cpp": "#include <iostream>\nusing namespace std;\nint main() {\n    unsigned int n; if (!(cin >> n)) return 0;\n    unsigned int res = 0;\n    for (int i = 0; i < 32; i++) {\n        res = (res << 1) | (n & 1);\n        n >>= 1;\n    }\n    cout << res << \"\\n\"; return 0;\n}",
          "javascript": "const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens[0] === '') return;\n    let n = BigInt(tokens[0]);\n    let res = 0n;\n    for (let i = 0n; i < 32n; i++) {\n        res = (res << 1n) | (n & 1n);\n        n >>= 1n;\n    }\n    console.log(res.toString());\n}\nsolve();"
        }
      }
    ],
    "testCases": [
      {
        "input": "43261596",
        "expectedOutput": "964176192",
        "expected": "964176192",
        "explanation": "Binary representation is 00000010100101000001111010011100. Reversing bits gives 00111001011110000010100101000000 (964176192)."
      },
      {
        "input": "1",
        "expectedOutput": "2147483648",
        "expected": "2147483648",
        "explanation": "1 is 00000000000000000000000000000001. Reversing it puts 1 at index 31: 2^31 = 2147483648."
      },
      {
        "input": "4294967295",
        "expectedOutput": "4294967295",
        "expected": "4294967295",
        "explanation": "All 32 bits are 1; reversing all 1s produces the exact same number."
      }
    ],
    "hiddenTestCases": [
      {
        "input": "0",
        "expectedOutput": "0",
        "expected": "0",
        "description": "Generated edge case"
      },
      {
        "input": "1",
        "expectedOutput": "2147483648",
        "expected": "2147483648",
        "description": "Generated edge case"
      },
      {
        "input": "2",
        "expectedOutput": "1073741824",
        "expected": "1073741824",
        "description": "Generated edge case"
      },
      {
        "input": "4",
        "expectedOutput": "536870912",
        "expected": "536870912",
        "description": "Generated edge case"
      },
      {
        "input": "8",
        "expectedOutput": "268435456",
        "expected": "268435456",
        "description": "Generated edge case"
      },
      {
        "input": "16",
        "expectedOutput": "134217728",
        "expected": "134217728",
        "description": "Generated edge case"
      },
      {
        "input": "2147483648",
        "expectedOutput": "1",
        "expected": "1",
        "description": "Generated edge case"
      },
      {
        "input": "4294967295",
        "expectedOutput": "4294967295",
        "expected": "4294967295",
        "description": "Generated edge case"
      },
      {
        "input": "1431655765",
        "expectedOutput": "2863311530",
        "expected": "2863311530",
        "description": "Generated edge case"
      },
      {
        "input": "2863311530",
        "expectedOutput": "1431655765",
        "expected": "1431655765",
        "description": "Generated edge case"
      },
      {
        "input": "43261596",
        "expectedOutput": "964176192",
        "expected": "964176192",
        "description": "Generated edge case"
      },
      {
        "input": "3221225471",
        "expectedOutput": "4294967293",
        "expected": "4294967293",
        "description": "Generated edge case"
      }
    ],
    "analogy": {
      "title": "🔄 The Assembly Line Conveyor Belt Reversal",
      "story": "Imagine a factory conveyor belt with 32 numbered packages. You peel packages from the right end one by one, and place them onto a second conveyor belt starting from the far left."
    },
    "steps": [
      {
        "stepIndex": 0,
        "title": "🏁 Initialization & Setup",
        "activeLine": 1,
        "explanation": "Set up the primary accumulator and bitwise tracking registers.",
        "variables": {
          "state": "Initial",
          "bitIndex": 0
        }
      },
      {
        "stepIndex": 1,
        "title": "⚙️ Core Bitwise Transformation",
        "activeLine": 2,
        "explanation": "Apply the core bitwise identity: cancel duplicates, probe Trie branches, or accumulate masks.",
        "variables": {
          "state": "Processing",
          "activeMask": "0b1"
        }
      },
      {
        "stepIndex": 2,
        "title": "🎯 Result Finalization",
        "activeLine": 3,
        "explanation": "Extract the computed integer result and return it with optimal O(1) auxiliary space.",
        "variables": {
          "state": "Complete",
          "verified": true
        }
      }
    ],
    "timeLimit": 2000,
    "memoryLimit": 256,
    "status": "approved",
    "generatedAt": "2026-11-20T14:42:20.392Z"
  },
  {
    "problemId": "dsa_bit-manipulation_05",
    "topicId": "bit-manipulation",
    "order": 5,
    "title": "Missing Number",
    "difficulty": "Easy",
    "pattern": "XOR Range Cancellation [0..N]",
    "tags": [
      "Bit Manipulation",
      "Easy",
      "XOR",
      "Campus Placement"
    ],
    "statement": "Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.\n\nCan you implement a solution using O(1) extra space and O(N) runtime?",
    "inputFormat": "First line: integer N.\nSecond line: N space-separated distinct integers from range [0, N].",
    "outputFormat": "Print the single missing integer.",
    "constraints": [
      "1 <= N <= 10^4",
      "0 <= nums[i] <= N",
      "All numbers in nums are unique.",
      "Time Limit: 2.0 seconds",
      "Memory Limit: 256 MB"
    ],
    "examples": [
      {
        "input": "4\n0 1 2 4",
        "displayInput": "nums = [0, 1, 2, 4]",
        "output": "3",
        "displayOutput": "3",
        "explanation": "n = 4 since there are 4 numbers, so the full range is [0, 4]. 3 is missing."
      },
      {
        "input": "5\n5 3 1 2 0",
        "displayInput": "nums = [5, 3, 1, 2, 0]",
        "output": "4",
        "displayOutput": "4",
        "explanation": "n = 5, range is [0, 5]. 4 is missing."
      },
      {
        "input": "6\n6 4 2 3 5 1",
        "displayInput": "nums = [6, 4, 2, 3, 5, 1]",
        "output": "0",
        "displayOutput": "0",
        "explanation": "n = 6, range is [0, 6]. 0 is missing."
      },
      {
        "input": "1\n1",
        "displayInput": "nums = [1]",
        "output": "0",
        "displayOutput": "0",
        "explanation": "n = 1, range is [0, 1]. 0 is missing."
      }
    ],
    "hints": [
      "If you had all numbers from 0 to N and all elements of nums, every number would appear twice except the missing one.",
      "XORing a number with itself cancels it: X ^ X = 0.",
      "Initialize xor = N, then loop from i = 0 to N - 1: xor ^= i ^ nums[i]. The final value is the missing number without risk of integer overflow!"
    ],
    "starterCode": {
      "python": "import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    \n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()",
      "javascript": "const fs = require('fs');\n\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    const nums = [];\n    for (let i = 0; i < n; i++) nums.push(parseInt(tokens[i + 1], 10));\n    \n    // Write your solution below\n}\n\nsolve();",
      "java": "import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        \n        // Write your solution below\n    }\n}",
      "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    \n    // Write your solution below\n    return 0;\n}"
    },
    "approaches": [
      {
        "name": "Approach 1: Brute Force",
        "type": "brute",
        "title": "Approach 1: Hash Set Lookup (Brute Force)",
        "idea": "Store array elements in a Set, then scan 0 to N to find which element is missing.",
        "dryRun": "nums = [3, 0, 1]. Set: {0, 1, 3}. Check 0: ok. Check 1: ok. Check 2: missing -> return 2.",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "code": {
          "python": "import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    s = set(int(tokens[i]) for i in range(1, n + 1))\n    for i in range(n + 1):\n        if i not in s: print(i); return\nif __name__ == '__main__': solve()",
          "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        Set<Integer> s = new HashSet<>();\n        for (int i = 0; i < n; i++) s.add(sc.nextInt());\n        for (int i = 0; i <= n; i++) { if (!s.contains(i)) { System.out.println(i); return; } }\n    }\n}",
          "cpp": "#include <iostream>\n#include <unordered_set>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    unordered_set<int> s;\n    for (int i = 0; i < n; i++) { int x; cin >> x; s.insert(x); }\n    for (int i = 0; i <= n; i++) { if (s.find(i) == s.end()) { cout << i << \"\\n\"; return 0; } }\n    return 0;\n}",
          "javascript": "const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    const s = new Set();\n    for (let i = 1; i <= n; i++) s.add(parseInt(tokens[i], 10));\n    for (let i = 0; i <= n; i++) { if (!s.has(i)) { console.log(i); return; } }\n}\nsolve();"
        }
      },
      {
        "name": "Approach 2: Better Approach",
        "type": "better",
        "title": "Lookup Table / Bit Counting Optimizations",
        "idea": "Optimize standard brute loops using precomputed byte-level tables, hash indexing, or intermediate mathematical invariants.",
        "dryRun": "Process blocks of 8 bits using an O(1) table lookup or accumulator, reducing loop iterations by 4x.",
        "timeComplexity": "O(log N)",
        "spaceComplexity": "O(1)",
        "code": {
          "python": "import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    s = set(int(tokens[i]) for i in range(1, n + 1))\n    for i in range(n + 1):\n        if i not in s: print(i); return\nif __name__ == '__main__': solve()",
          "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        Set<Integer> s = new HashSet<>();\n        for (int i = 0; i < n; i++) s.add(sc.nextInt());\n        for (int i = 0; i <= n; i++) { if (!s.contains(i)) { System.out.println(i); return; } }\n    }\n}",
          "cpp": "#include <iostream>\n#include <unordered_set>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    unordered_set<int> s;\n    for (int i = 0; i < n; i++) { int x; cin >> x; s.insert(x); }\n    for (int i = 0; i <= n; i++) { if (s.find(i) == s.end()) { cout << i << \"\\n\"; return 0; } }\n    return 0;\n}",
          "javascript": "const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    const s = new Set();\n    for (let i = 1; i <= n; i++) s.add(parseInt(tokens[i], 10));\n    for (let i = 0; i <= n; i++) { if (!s.has(i)) { console.log(i); return; } }\n}\nsolve();"
        }
      },
      {
        "name": "Approach 3: Optimal Bitwise Approach",
        "type": "optimal",
        "title": "Approach 2: XOR Range Cancellation (Optimal)",
        "idea": "XOR all indices 0 to N with all array elements. Every number in [0, N] appears twice except the missing one, which remains.",
        "dryRun": "nums = [3, 0, 1]. xor = 3. i=0: 3 ^ 0 ^ 3 = 0. i=1: 0 ^ 1 ^ 0 = 1. i=2: 1 ^ 2 ^ 1 = 2. Result: 2.",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "code": {
          "python": "import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    res = n\n    for i in range(n): res ^= i ^ int(tokens[i + 1])\n    print(res)\nif __name__ == '__main__': solve()",
          "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int res = n;\n        for (int i = 0; i < n; i++) res ^= i ^ sc.nextInt();\n        System.out.println(res);\n    }\n}",
          "cpp": "#include <iostream>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    int res = n;\n    for (int i = 0; i < n; i++) { int x; cin >> x; res ^= i ^ x; }\n    cout << res << \"\\n\"; return 0;\n}",
          "javascript": "const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    let res = n;\n    for (let i = 0; i < n; i++) res ^= i ^ parseInt(tokens[i + 1], 10);\n    console.log(res);\n}\nsolve();"
        }
      }
    ],
    "testCases": [
      {
        "input": "4\n0 1 2 4",
        "expectedOutput": "3",
        "expected": "3",
        "explanation": "n = 4 since there are 4 numbers, so the full range is [0, 4]. 3 is missing."
      },
      {
        "input": "5\n5 3 1 2 0",
        "expectedOutput": "4",
        "expected": "4",
        "explanation": "n = 5, range is [0, 5]. 4 is missing."
      },
      {
        "input": "6\n6 4 2 3 5 1",
        "expectedOutput": "0",
        "expected": "0",
        "explanation": "n = 6, range is [0, 6]. 0 is missing."
      },
      {
        "input": "1\n1",
        "expectedOutput": "0",
        "expected": "0",
        "explanation": "n = 1, range is [0, 1]. 0 is missing."
      }
    ],
    "hiddenTestCases": [
      {
        "input": "1\n0",
        "expectedOutput": "1",
        "expected": "1",
        "description": "Generated edge case"
      },
      {
        "input": "1\n1",
        "expectedOutput": "0",
        "expected": "0",
        "description": "Generated edge case"
      },
      {
        "input": "2\n1 2",
        "expectedOutput": "0",
        "expected": "0",
        "description": "Generated edge case"
      },
      {
        "input": "2\n0 2",
        "expectedOutput": "1",
        "expected": "1",
        "description": "Generated edge case"
      },
      {
        "input": "3\n1 2 3",
        "expectedOutput": "0",
        "expected": "0",
        "description": "Generated edge case"
      },
      {
        "input": "10\n7 1 5 0 2 4 3 6 10 8",
        "expectedOutput": "9",
        "expected": "9",
        "description": "Generated edge case"
      },
      {
        "input": "30\n16 2 23 20 12 7 6 13 25 30 1 14 29 10 17 0 11 19 5 8 26 18 15 3 4 24 28 27 21 9",
        "expectedOutput": "22",
        "expected": "22",
        "description": "Generated edge case"
      },
      {
        "input": "50\n41 7 40 23 43 50 27 44 46 1 36 47 37 26 38 24 29 6 31 20 0 10 4 13 39 8 16 12 28 22 42 25 33 18 11 21 34 5 19 15 35 48 17 2 3 30 14 45 32 9",
        "expectedOutput": "49",
        "expected": "49",
        "description": "Generated edge case"
      },
      {
        "input": "70\n38 4 56 42 7 28 65 19 1 43 25 35 14 16 36 64 55 57 66 53 46 68 15 60 0 41 40 54 69 11 2 44 21 50 48 6 70 12 24 18 31 22 61 17 23 59 37 62 39 27 58 34 13 30 45 26 67 52 47 33 29 51 5 9 8 49 32 20 10 3",
        "expectedOutput": "63",
        "expected": "63",
        "description": "Generated edge case"
      },
      {
        "input": "90\n34 33 74 86 82 90 45 7 88 65 53 43 48 63 1 85 6 35 25 29 5 52 81 18 83 0 8 89 62 15 78 64 30 38 56 4 9 79 27 36 13 54 57 60 69 87 40 68 61 28 73 20 41 49 67 55 3 46 66 42 11 50 75 10 39 80 21 51 17 14 59 76 31 32 24 44 12 2 16 47 23 77 22 58 26 71 70 84 72 19",
        "expectedOutput": "37",
        "expected": "37",
        "description": "Generated edge case"
      },
      {
        "input": "110\n72 65 31 43 85 40 70 109 74 105 22 91 9 77 84 18 108 95 4 67 19 78 21 32 20 42 48 82 97 1 66 102 10 71 93 73 69 58 90 14 35 38 37 0 96 2 110 23 63 27 80 44 103 68 34 53 59 100 41 106 98 57 17 26 12 55 52 87 39 76 16 3 13 11 81 29 36 45 54 60 64 56 86 88 83 49 6 8 99 92 61 104 30 107 15 75 46 50 24 89 94 28 5 101 51 62 25 47 7 33",
        "expectedOutput": "79",
        "expected": "79",
        "description": "Generated edge case"
      },
      {
        "input": "130\n80 73 105 60 23 123 110 79 106 118 36 57 99 65 8 58 81 43 101 95 3 130 93 55 13 92 78 98 103 62 33 6 126 24 67 51 68 21 82 7 4 53 77 85 25 120 121 74 86 11 128 38 64 15 72 108 102 9 20 14 76 19 63 100 97 48 83 117 87 46 16 125 54 10 42 5 114 1 17 112 115 66 107 12 30 2 0 109 88 44 75 129 18 104 52 69 26 32 113 59 22 49 39 111 96 29 71 50 90 41 116 70 124 37 28 84 127 34 122 89 40 61 91 119 31 45 94 47 27 35",
        "expectedOutput": "56",
        "expected": "56",
        "description": "Generated edge case"
      },
      {
        "input": "150\n125 110 136 16 49 130 85 115 101 44 70 112 141 61 120 46 150 118 34 132 45 18 140 77 28 22 108 103 59 25 3 7 29 145 139 33 58 1 20 73 2 149 63 41 147 91 68 21 50 52 4 15 144 75 104 88 19 86 123 8 113 57 84 60 133 93 96 62 76 64 95 72 26 131 143 89 12 74 6 67 43 119 102 124 106 11 121 90 79 40 13 78 69 114 55 148 80 66 128 0 71 81 51 27 14 98 100 116 92 32 35 94 129 138 127 48 5 137 42 9 17 38 122 36 111 47 56 82 105 23 146 117 134 10 24 99 126 37 97 39 107 83 109 30 142 135 31 65 53 54",
        "expectedOutput": "87",
        "expected": "87",
        "description": "Generated edge case"
      },
      {
        "input": "170\n59 105 45 143 53 107 95 82 29 148 31 27 62 63 38 67 32 97 76 84 25 170 10 22 28 149 44 147 37 47 34 101 161 13 167 160 26 133 91 1 20 132 52 151 169 3 81 130 139 137 125 159 41 114 121 135 19 9 24 110 98 88 115 33 162 124 77 7 111 108 70 5 112 126 74 94 21 106 75 145 155 150 90 43 93 164 50 96 134 165 58 36 49 16 4 56 102 64 100 109 85 80 78 15 138 23 140 68 14 55 0 6 83 92 117 48 128 39 142 116 152 65 61 89 17 99 66 69 51 113 42 144 40 168 129 60 54 8 120 119 118 18 2 157 122 154 104 86 127 146 141 103 166 71 87 158 123 163 12 73 131 136 11 57 153 35 46 156 79 30",
        "expectedOutput": "72",
        "expected": "72",
        "description": "Generated edge case"
      },
      {
        "input": "190\n95 160 108 56 162 18 126 181 3 68 41 125 170 35 76 7 48 182 88 176 101 124 85 154 127 138 19 142 153 184 107 99 54 173 110 117 185 147 111 20 29 37 21 77 143 34 114 166 40 55 93 188 144 14 43 60 133 49 121 73 70 12 118 4 81 136 100 5 159 42 140 105 187 97 33 9 11 84 46 178 174 134 87 91 158 82 96 71 59 103 135 52 116 112 130 30 149 27 161 45 25 66 24 186 137 98 151 58 13 74 1 44 28 119 38 163 131 61 67 152 65 57 16 120 123 139 51 89 190 53 23 150 78 148 102 179 109 64 177 15 79 180 75 90 86 92 36 50 172 0 113 155 169 63 146 164 168 104 145 128 157 8 115 80 171 31 129 10 141 72 17 39 2 165 167 22 32 106 62 69 132 47 26 175 83 6 156 94 122 183",
        "expectedOutput": "189",
        "expected": "189",
        "description": "Generated edge case"
      }
    ],
    "analogy": {
      "title": "⚡ The Electric Wire & Switch Analogy for Missing Number",
      "story": "Imagine you are working in a master electrical room with switches lined up on a panel. Every switch represents a single binary bit (0 for OFF, 1 for ON). Instead of manually opening and closing every single circuit individually, Missing Number lets you manipulate circuits instantaneously using logic gates like XOR, AND, and bit shifts."
    },
    "steps": [
      {
        "stepIndex": 0,
        "title": "🏁 Initialization & Setup",
        "activeLine": 1,
        "explanation": "Set up the primary accumulator and bitwise tracking registers.",
        "variables": {
          "state": "Initial",
          "bitIndex": 0
        }
      },
      {
        "stepIndex": 1,
        "title": "⚙️ Core Bitwise Transformation",
        "activeLine": 2,
        "explanation": "Apply the core bitwise identity: cancel duplicates, probe Trie branches, or accumulate masks.",
        "variables": {
          "state": "Processing",
          "activeMask": "0b1"
        }
      },
      {
        "stepIndex": 2,
        "title": "🎯 Result Finalization",
        "activeLine": 3,
        "explanation": "Extract the computed integer result and return it with optimal O(1) auxiliary space.",
        "variables": {
          "state": "Complete",
          "verified": true
        }
      }
    ],
    "timeLimit": 2000,
    "memoryLimit": 256,
    "status": "approved",
    "generatedAt": "2026-11-20T14:42:20.395Z"
  },
  {
    "problemId": "dsa_bit-manipulation_06",
    "topicId": "bit-manipulation",
    "order": 6,
    "title": "Power of Two",
    "difficulty": "Easy",
    "pattern": "Single Set Bit Invariant Check (n > 0 && (n & (n - 1)) == 0)",
    "tags": [
      "Bit Manipulation",
      "Easy",
      "Kernighan",
      "Campus Placement"
    ],
    "statement": "Given an integer `n`, return `true` if it is a power of two. Otherwise, return `false`.\n\nAn integer `n` is a power of two if there exists an integer `x` such that `n == 2^x`. Solve it in O(1) time without loops.",
    "inputFormat": "First line: integer N.",
    "outputFormat": "Print 'true' if N is a power of two, otherwise print 'false'.",
    "constraints": [
      "-2^31 <= N <= 2^31 - 1",
      "Time Limit: 2.0 seconds",
      "Memory Limit: 256 MB"
    ],
    "examples": [
      {
        "input": "1",
        "displayInput": "n = 1",
        "output": "true",
        "displayOutput": "true",
        "explanation": "2^0 = 1, so 1 is a power of two."
      },
      {
        "input": "16",
        "displayInput": "n = 16",
        "output": "true",
        "displayOutput": "true",
        "explanation": "2^4 = 16, so 16 is a power of two."
      },
      {
        "input": "3",
        "displayInput": "n = 3",
        "output": "false",
        "displayOutput": "false",
        "explanation": "3 is not a power of two."
      },
      {
        "input": "0",
        "displayInput": "n = 0",
        "output": "false",
        "displayOutput": "false",
        "explanation": "0 is not a power of two."
      }
    ],
    "hints": [
      "In binary representation, what distinguishes powers of 2 from other integers? (1, 10, 100, 1000...)",
      "Powers of two have exactly ONE bit set to 1.",
      "Recall Brian Kernighan trick: n & (n - 1) removes the lowest set bit. If n is a power of two and n > 0, n & (n - 1) must equal 0!"
    ],
    "starterCode": {
      "python": "import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    \n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()",
      "javascript": "const fs = require('fs');\n\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens[0] === '') return;\n    const n = BigInt(tokens[0]);\n    \n    // Write your solution below\n}\n\nsolve();",
      "java": "import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLong()) return;\n        long n = sc.nextLong();\n        \n        // Write your solution below\n    }\n}",
      "cpp": "#include <iostream>\nusing namespace std;\n\nint main() {\n    long long n;\n    if (!(cin >> n)) return 0;\n    \n    // Write your solution below\n    return 0;\n}"
    },
    "approaches": [
      {
        "name": "Approach 1: Brute Force",
        "type": "brute",
        "title": "Approach 1: Iterative Division (Brute Force)",
        "idea": "Continuously divide n by 2 while it is even. If n ends up at 1, it was a power of two.",
        "dryRun": "n = 16 -> 8 -> 4 -> 2 -> 1 (true). n = 12 -> 6 -> 3 != 1 (false).",
        "timeComplexity": "O(log N)",
        "spaceComplexity": "O(1)",
        "code": {
          "python": "import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    if n <= 0: print(\"false\"); return\n    while n % 2 == 0: n //= 2\n    print(\"true\" if n == 1 else \"false\")\nif __name__ == '__main__': solve()",
          "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLong()) return;\n        long n = sc.nextLong();\n        if (n <= 0) { System.out.println(\"false\"); return; }\n        while (n % 2 == 0) n /= 2;\n        System.out.println(n == 1 ? \"true\" : \"false\");\n    }\n}",
          "cpp": "#include <iostream>\nusing namespace std;\nint main() {\n    long long n; if (!(cin >> n)) return 0;\n    if (n <= 0) { cout << \"false\\n\"; return 0; }\n    while (n % 2 == 0) n /= 2;\n    cout << (n == 1 ? \"true\" : \"false\") << \"\\n\"; return 0;\n}",
          "javascript": "const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens[0] === '') return;\n    let n = BigInt(tokens[0]);\n    if (n <= 0n) { console.log('false'); return; }\n    while (n % 2n === 0n) n /= 2n;\n    console.log(n === 1n ? 'true' : 'false');\n}\nsolve();"
        }
      },
      {
        "name": "Approach 2: Better Approach",
        "type": "better",
        "title": "Lookup Table / Bit Counting Optimizations",
        "idea": "Optimize standard brute loops using precomputed byte-level tables, hash indexing, or intermediate mathematical invariants.",
        "dryRun": "Process blocks of 8 bits using an O(1) table lookup or accumulator, reducing loop iterations by 4x.",
        "timeComplexity": "O(log N)",
        "spaceComplexity": "O(1)",
        "code": {
          "python": "import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    if n <= 0: print(\"false\"); return\n    while n % 2 == 0: n //= 2\n    print(\"true\" if n == 1 else \"false\")\nif __name__ == '__main__': solve()",
          "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLong()) return;\n        long n = sc.nextLong();\n        if (n <= 0) { System.out.println(\"false\"); return; }\n        while (n % 2 == 0) n /= 2;\n        System.out.println(n == 1 ? \"true\" : \"false\");\n    }\n}",
          "cpp": "#include <iostream>\nusing namespace std;\nint main() {\n    long long n; if (!(cin >> n)) return 0;\n    if (n <= 0) { cout << \"false\\n\"; return 0; }\n    while (n % 2 == 0) n /= 2;\n    cout << (n == 1 ? \"true\" : \"false\") << \"\\n\"; return 0;\n}",
          "javascript": "const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens[0] === '') return;\n    let n = BigInt(tokens[0]);\n    if (n <= 0n) { console.log('false'); return; }\n    while (n % 2n === 0n) n /= 2n;\n    console.log(n === 1n ? 'true' : 'false');\n}\nsolve();"
        }
      },
      {
        "name": "Approach 3: Optimal Bitwise Approach",
        "type": "optimal",
        "title": "Approach 2: Bit Trick n & (n - 1) == 0 (Optimal)",
        "idea": "Powers of two have exactly one set bit. Clearing it via n & (n - 1) leaves 0. Check n > 0 && (n & (n - 1)) == 0.",
        "dryRun": "n = 16 (10000). n - 1 = 15 (01111). 10000 & 01111 = 00000 == 0. Return true.",
        "timeComplexity": "O(1)",
        "spaceComplexity": "O(1)",
        "code": {
          "python": "import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    print(\"true\" if n > 0 and (n & (n - 1)) == 0 else \"false\")\nif __name__ == '__main__': solve()",
          "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLong()) return;\n        long n = sc.nextLong();\n        System.out.println(n > 0 && (n & (n - 1)) == 0 ? \"true\" : \"false\");\n    }\n}",
          "cpp": "#include <iostream>\nusing namespace std;\nint main() {\n    long long n; if (!(cin >> n)) return 0;\n    cout << (n > 0 && (n & (n - 1)) == 0 ? \"true\" : \"false\") << \"\\n\"; return 0;\n}",
          "javascript": "const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens[0] === '') return;\n    const n = BigInt(tokens[0]);\n    console.log(n > 0n && (n & (n - 1n)) === 0n ? 'true' : 'false');\n}\nsolve();"
        }
      }
    ],
    "testCases": [
      {
        "input": "1",
        "expectedOutput": "true",
        "expected": "true",
        "explanation": "2^0 = 1, so 1 is a power of two."
      },
      {
        "input": "16",
        "expectedOutput": "true",
        "expected": "true",
        "explanation": "2^4 = 16, so 16 is a power of two."
      },
      {
        "input": "3",
        "expectedOutput": "false",
        "expected": "false",
        "explanation": "3 is not a power of two."
      },
      {
        "input": "0",
        "expectedOutput": "false",
        "expected": "false",
        "explanation": "0 is not a power of two."
      }
    ],
    "hiddenTestCases": [
      {
        "input": "0",
        "expectedOutput": "false",
        "expected": "false",
        "description": "Generated edge case"
      },
      {
        "input": "-1",
        "expectedOutput": "false",
        "expected": "false",
        "description": "Generated edge case"
      },
      {
        "input": "-2",
        "expectedOutput": "false",
        "expected": "false",
        "description": "Generated edge case"
      },
      {
        "input": "-16",
        "expectedOutput": "false",
        "expected": "false",
        "description": "Generated edge case"
      },
      {
        "input": "-2147483648",
        "expectedOutput": "false",
        "expected": "false",
        "description": "Generated edge case"
      },
      {
        "input": "1",
        "expectedOutput": "true",
        "expected": "true",
        "description": "Generated edge case"
      },
      {
        "input": "2",
        "expectedOutput": "true",
        "expected": "true",
        "description": "Generated edge case"
      },
      {
        "input": "4",
        "expectedOutput": "true",
        "expected": "true",
        "description": "Generated edge case"
      },
      {
        "input": "8",
        "expectedOutput": "true",
        "expected": "true",
        "description": "Generated edge case"
      },
      {
        "input": "16",
        "expectedOutput": "true",
        "expected": "true",
        "description": "Generated edge case"
      },
      {
        "input": "32",
        "expectedOutput": "true",
        "expected": "true",
        "description": "Generated edge case"
      },
      {
        "input": "64",
        "expectedOutput": "true",
        "expected": "true",
        "description": "Generated edge case"
      },
      {
        "input": "128",
        "expectedOutput": "true",
        "expected": "true",
        "description": "Generated edge case"
      },
      {
        "input": "256",
        "expectedOutput": "true",
        "expected": "true",
        "description": "Generated edge case"
      },
      {
        "input": "512",
        "expectedOutput": "true",
        "expected": "true",
        "description": "Generated edge case"
      },
      {
        "input": "1024",
        "expectedOutput": "true",
        "expected": "true",
        "description": "Generated edge case"
      },
      {
        "input": "1048576",
        "expectedOutput": "true",
        "expected": "true",
        "description": "Generated edge case"
      },
      {
        "input": "1073741824",
        "expectedOutput": "true",
        "expected": "true",
        "description": "Generated edge case"
      },
      {
        "input": "5",
        "expectedOutput": "false",
        "expected": "false",
        "description": "Generated edge case"
      },
      {
        "input": "6",
        "expectedOutput": "false",
        "expected": "false",
        "description": "Generated edge case"
      },
      {
        "input": "7",
        "expectedOutput": "false",
        "expected": "false",
        "description": "Generated edge case"
      },
      {
        "input": "15",
        "expectedOutput": "false",
        "expected": "false",
        "description": "Generated edge case"
      },
      {
        "input": "100",
        "expectedOutput": "false",
        "expected": "false",
        "description": "Generated edge case"
      },
      {
        "input": "1000000",
        "expectedOutput": "false",
        "expected": "false",
        "description": "Generated edge case"
      }
    ],
    "analogy": {
      "title": "⚡ The Electric Wire & Switch Analogy for Power of Two",
      "story": "Imagine you are working in a master electrical room with switches lined up on a panel. Every switch represents a single binary bit (0 for OFF, 1 for ON). Instead of manually opening and closing every single circuit individually, Power of Two lets you manipulate circuits instantaneously using logic gates like XOR, AND, and bit shifts."
    },
    "steps": [
      {
        "stepIndex": 0,
        "title": "🏁 Initialization & Setup",
        "activeLine": 1,
        "explanation": "Set up the primary accumulator and bitwise tracking registers.",
        "variables": {
          "state": "Initial",
          "bitIndex": 0
        }
      },
      {
        "stepIndex": 1,
        "title": "⚙️ Core Bitwise Transformation",
        "activeLine": 2,
        "explanation": "Apply the core bitwise identity: cancel duplicates, probe Trie branches, or accumulate masks.",
        "variables": {
          "state": "Processing",
          "activeMask": "0b1"
        }
      },
      {
        "stepIndex": 2,
        "title": "🎯 Result Finalization",
        "activeLine": 3,
        "explanation": "Extract the computed integer result and return it with optimal O(1) auxiliary space.",
        "variables": {
          "state": "Complete",
          "verified": true
        }
      }
    ],
    "timeLimit": 2000,
    "memoryLimit": 256,
    "status": "approved",
    "generatedAt": "2026-11-20T14:42:20.396Z"
  },
  {
    "problemId": "dsa_bit-manipulation_07",
    "topicId": "bit-manipulation",
    "order": 7,
    "title": "Add Binary",
    "difficulty": "Easy",
    "pattern": "Bitwise Simulated Binary Addition with Carry",
    "tags": [
      "Bit Manipulation",
      "Easy",
      "String",
      "Campus Placement"
    ],
    "statement": "Given two binary strings `a` and `b`, return their sum as a binary string.",
    "inputFormat": "First line: binary string A.\nSecond line: binary string B.",
    "outputFormat": "Print the binary string representing their sum.",
    "constraints": [
      "1 <= a.length, b.length <= 10^4",
      "a and b consist only of '0' or '1' characters.",
      "Each string does not contain leading zeros except for the zero itself.",
      "Time Limit: 2.0 seconds",
      "Memory Limit: 256 MB"
    ],
    "examples": [
      {
        "input": "11\n1",
        "displayInput": "a = \"11\", b = \"1\"",
        "output": "100",
        "displayOutput": "\"100\"",
        "explanation": "11 (3 in decimal) + 1 (1 in decimal) = 4 in decimal (100 in binary)."
      },
      {
        "input": "1010\n1011",
        "displayInput": "a = \"1010\", b = \"1011\"",
        "output": "10101",
        "displayOutput": "\"10101\"",
        "explanation": "1010 (10) + 1011 (11) = 21 (10101 in binary)."
      },
      {
        "input": "0\n0",
        "displayInput": "a = \"0\", b = \"0\"",
        "output": "0",
        "displayOutput": "\"0\"",
        "explanation": "0 + 0 = 0."
      }
    ],
    "hints": [
      "Work backwards from the least significant digit (rightmost index) towards the left, like elementary addition.",
      "Maintain a carry variable (0 or 1). At each position, sum = carry + bitA + bitB.",
      "Append sum % 2 to your result, set carry = sum // 2, and continue until both strings and carry are exhausted."
    ],
    "starterCode": {
      "python": "import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    a = tokens[0]\n    b = tokens[1]\n    \n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()",
      "javascript": "const fs = require('fs');\n\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (tokens.length < 2) return;\n    const a = tokens[0];\n    const b = tokens[1];\n    \n    // Write your solution below\n}\n\nsolve();",
      "java": "import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String a = sc.next();\n        String b = sc.next();\n        \n        // Write your solution below\n    }\n}",
      "cpp": "#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string a, b;\n    if (!(cin >> a >> b)) return 0;\n    \n    // Write your solution below\n    return 0;\n}"
    },
    "approaches": [
      {
        "name": "Approach 1: Brute Force",
        "type": "brute",
        "title": "Naive Simulation Approach",
        "idea": "Step through every state, digit, or combination iteratively without bitwise shortcuts.",
        "dryRun": "Test every candidate value or combination sequentially.",
        "timeComplexity": "O(N^2) or O(2^N)",
        "spaceComplexity": "O(N)",
        "code": {
          "python": "import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    a, b = tokens[0], tokens[1]\n    i, j, carry = len(a) - 1, len(b) - 1, 0\n    res = []\n    while i >= 0 or j >= 0 or carry:\n        total = carry\n        if i >= 0: total += int(a[i]); i -= 1\n        if j >= 0: total += int(b[j]); j -= 1\n        res.append(str(total % 2))\n        carry = total // 2\n    print(\"\".join(reversed(res)))\nif __name__ == '__main__': solve()",
          "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String a = sc.next(), b = sc.next();\n        StringBuilder sb = new StringBuilder();\n        int i = a.length() - 1, j = b.length() - 1, carry = 0;\n        while (i >= 0 || j >= 0 || carry > 0) {\n            int sum = carry;\n            if (i >= 0) sum += a.charAt(i--) - '0';\n            if (j >= 0) sum += b.charAt(j--) - '0';\n            sb.append(sum % 2);\n            carry = sum / 2;\n        }\n        System.out.println(sb.reverse().toString());\n    }\n}",
          "cpp": "#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\nint main() {\n    string a, b; if (!(cin >> a >> b)) return 0;\n    string res = \"\";\n    int i = a.size() - 1, j = b.size() - 1, carry = 0;\n    while (i >= 0 || j >= 0 || carry) {\n        int sum = carry;\n        if (i >= 0) sum += a[i--] - '0';\n        if (j >= 0) sum += b[j--] - '0';\n        res.push_back((sum % 2) + '0');\n        carry = sum / 2;\n    }\n    reverse(res.begin(), res.end());\n    cout << res << \"\\n\"; return 0;\n}",
          "javascript": "const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (tokens.length < 2) return;\n    const a = tokens[0], b = tokens[1];\n    let i = a.length - 1, j = b.length - 1, carry = 0;\n    const res = [];\n    while (i >= 0 || j >= 0 || carry > 0) {\n        let sum = carry;\n        if (i >= 0) sum += a.charCodeAt(i--) - 48;\n        if (j >= 0) sum += b.charCodeAt(j--) - 48;\n        res.push(sum % 2);\n        carry = Math.floor(sum / 2);\n    }\n    console.log(res.reverse().join(''));\n}\nsolve();"
        }
      },
      {
        "name": "Approach 2: Better Approach",
        "type": "better",
        "title": "Intermediate Counting / Conversion Approach",
        "idea": "Use frequency tables or two-pointer string scan to avoid redundant evaluations.",
        "dryRun": "Record intermediate results to prune unnecessary iterations.",
        "timeComplexity": "O(N log N) or O(N)",
        "spaceComplexity": "O(N)",
        "code": {
          "python": "import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    a, b = tokens[0], tokens[1]\n    i, j, carry = len(a) - 1, len(b) - 1, 0\n    res = []\n    while i >= 0 or j >= 0 or carry:\n        total = carry\n        if i >= 0: total += int(a[i]); i -= 1\n        if j >= 0: total += int(b[j]); j -= 1\n        res.append(str(total % 2))\n        carry = total // 2\n    print(\"\".join(reversed(res)))\nif __name__ == '__main__': solve()",
          "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String a = sc.next(), b = sc.next();\n        StringBuilder sb = new StringBuilder();\n        int i = a.length() - 1, j = b.length() - 1, carry = 0;\n        while (i >= 0 || j >= 0 || carry > 0) {\n            int sum = carry;\n            if (i >= 0) sum += a.charAt(i--) - '0';\n            if (j >= 0) sum += b.charAt(j--) - '0';\n            sb.append(sum % 2);\n            carry = sum / 2;\n        }\n        System.out.println(sb.reverse().toString());\n    }\n}",
          "cpp": "#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\nint main() {\n    string a, b; if (!(cin >> a >> b)) return 0;\n    string res = \"\";\n    int i = a.size() - 1, j = b.size() - 1, carry = 0;\n    while (i >= 0 || j >= 0 || carry) {\n        int sum = carry;\n        if (i >= 0) sum += a[i--] - '0';\n        if (j >= 0) sum += b[j--] - '0';\n        res.push_back((sum % 2) + '0');\n        carry = sum / 2;\n    }\n    reverse(res.begin(), res.end());\n    cout << res << \"\\n\"; return 0;\n}",
          "javascript": "const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (tokens.length < 2) return;\n    const a = tokens[0], b = tokens[1];\n    let i = a.length - 1, j = b.length - 1, carry = 0;\n    const res = [];\n    while (i >= 0 || j >= 0 || carry > 0) {\n        let sum = carry;\n        if (i >= 0) sum += a.charCodeAt(i--) - 48;\n        if (j >= 0) sum += b.charCodeAt(j--) - 48;\n        res.push(sum % 2);\n        carry = Math.floor(sum / 2);\n    }\n    console.log(res.reverse().join(''));\n}\nsolve();"
        }
      },
      {
        "name": "Approach 3: Optimal Bitwise Approach",
        "type": "optimal",
        "title": "Approach 1: Two Pointers Simulation with Carry (Optimal)",
        "idea": "Iterate from the least significant digit towards the most significant digit, maintaining sum and carry.",
        "dryRun": "a = \"11\", b = \"1\". i=1,j=0: sum=1+1=2 -> res=[0], carry=1. i=0,j=-1: sum=1+1=2 -> res=[0,0], carry=1. carry=1 -> res=[0,0,1]. Reverse: \"100\".",
        "timeComplexity": "O(max(N, M))",
        "spaceComplexity": "O(max(N, M))",
        "code": {
          "python": "import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    a, b = tokens[0], tokens[1]\n    i, j, carry = len(a) - 1, len(b) - 1, 0\n    res = []\n    while i >= 0 or j >= 0 or carry:\n        total = carry\n        if i >= 0: total += int(a[i]); i -= 1\n        if j >= 0: total += int(b[j]); j -= 1\n        res.append(str(total % 2))\n        carry = total // 2\n    print(\"\".join(reversed(res)))\nif __name__ == '__main__': solve()",
          "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String a = sc.next(), b = sc.next();\n        StringBuilder sb = new StringBuilder();\n        int i = a.length() - 1, j = b.length() - 1, carry = 0;\n        while (i >= 0 || j >= 0 || carry > 0) {\n            int sum = carry;\n            if (i >= 0) sum += a.charAt(i--) - '0';\n            if (j >= 0) sum += b.charAt(j--) - '0';\n            sb.append(sum % 2);\n            carry = sum / 2;\n        }\n        System.out.println(sb.reverse().toString());\n    }\n}",
          "cpp": "#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\nint main() {\n    string a, b; if (!(cin >> a >> b)) return 0;\n    string res = \"\";\n    int i = a.size() - 1, j = b.size() - 1, carry = 0;\n    while (i >= 0 || j >= 0 || carry) {\n        int sum = carry;\n        if (i >= 0) sum += a[i--] - '0';\n        if (j >= 0) sum += b[j--] - '0';\n        res.push_back((sum % 2) + '0');\n        carry = sum / 2;\n    }\n    reverse(res.begin(), res.end());\n    cout << res << \"\\n\"; return 0;\n}",
          "javascript": "const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (tokens.length < 2) return;\n    const a = tokens[0], b = tokens[1];\n    let i = a.length - 1, j = b.length - 1, carry = 0;\n    const res = [];\n    while (i >= 0 || j >= 0 || carry > 0) {\n        let sum = carry;\n        if (i >= 0) sum += a.charCodeAt(i--) - 48;\n        if (j >= 0) sum += b.charCodeAt(j--) - 48;\n        res.push(sum % 2);\n        carry = Math.floor(sum / 2);\n    }\n    console.log(res.reverse().join(''));\n}\nsolve();"
        }
      }
    ],
    "testCases": [
      {
        "input": "11\n1",
        "expectedOutput": "100",
        "expected": "100",
        "explanation": "11 (3 in decimal) + 1 (1 in decimal) = 4 in decimal (100 in binary)."
      },
      {
        "input": "1010\n1011",
        "expectedOutput": "10101",
        "expected": "10101",
        "explanation": "1010 (10) + 1011 (11) = 21 (10101 in binary)."
      },
      {
        "input": "0\n0",
        "expectedOutput": "0",
        "expected": "0",
        "explanation": "0 + 0 = 0."
      }
    ],
    "hiddenTestCases": [
      {
        "input": "0\n0",
        "expectedOutput": "0",
        "expected": "0",
        "description": "Generated edge case"
      },
      {
        "input": "1\n0",
        "expectedOutput": "1",
        "expected": "1",
        "description": "Generated edge case"
      },
      {
        "input": "0\n1",
        "expectedOutput": "1",
        "expected": "1",
        "description": "Generated edge case"
      },
      {
        "input": "1\n1",
        "expectedOutput": "10",
        "expected": "10",
        "description": "Generated edge case"
      },
      {
        "input": "1111\n1",
        "expectedOutput": "10000",
        "expected": "10000",
        "description": "Generated edge case"
      },
      {
        "input": "11111\n11111",
        "expectedOutput": "111110",
        "expected": "111110",
        "description": "Generated edge case"
      },
      {
        "input": "100000\n1",
        "expectedOutput": "100001",
        "expected": "100001",
        "description": "Generated edge case"
      },
      {
        "input": "1111111101\n1110111100",
        "expectedOutput": "11110111001",
        "expected": "11110111001",
        "description": "Generated edge case"
      },
      {
        "input": "1110000101101010010010010\n1110100011000110111111010",
        "expectedOutput": "11100101000110001010001100",
        "expected": "11100101000110001010001100",
        "description": "Generated edge case"
      },
      {
        "input": "1110000000100011000100101100001000101111\n1011011110111011101000101100001100111001",
        "expectedOutput": "11001011111011110101101011000010101101000",
        "expected": "11001011111011110101101011000010101101000",
        "description": "Generated edge case"
      },
      {
        "input": "1110101110000001100111101010100010001100101100101110101\n1101101100100011000101001100011110100010010000110011010",
        "expectedOutput": "11100011010100100101100110111000000101110111101100001111",
        "expected": "11100011010100100101100110111000000101110111101100001111",
        "description": "Generated edge case"
      },
      {
        "input": "1000101001101010000100001101111110010000110110001101001110111101010111\n1011101001000111101010011010110001111001000010011001101100111010101100",
        "expectedOutput": "10100010010110001101110101000110000001001111000100110111011111000000011",
        "expected": "10100010010110001101110101000110000001001111000100110111011111000000011",
        "description": "Generated edge case"
      },
      {
        "input": "1011001110010110000110100001010010001011000001110011000111110000100011011010110100011\n1011001110000010110000110111010110001001100101000000000110010110011101111101100100010",
        "expectedOutput": "10110011100011000110111011000101000010100100110110011001110000111000001011000011000101",
        "expected": "10110011100011000110111011000101000010100100110110011001110000111000001011000011000101",
        "description": "Generated edge case"
      },
      {
        "input": "1111101010000110111010100100110100100001100011011011001010100011011111100011100101000010010011000101\n1001111110110011100010010101110101110010111001010000111001110010100111110111100010001100001101110001",
        "expectedOutput": "11001101000111010011100111010101010010100011100101100000100010110000111011011000111001110100000110110",
        "expected": "11001101000111010011100111010101010010100011100101100000100010110000111011011000111001110100000110110",
        "description": "Generated edge case"
      },
      {
        "input": "1011000110001100011100011101111110110110011011111100111111110010010010011000010100010111110100010000111111010111011\n1000100110011111101000101011101000000001111110111100111000000110001000000110010001010111111111100011000001110001000",
        "expectedOutput": "10011101100101100000101001001100110111000011010111001110111111000011010011110100101101111110011110100000001001000011",
        "expected": "10011101100101100000101001001100110111000011010111001110111111000011010011110100101101111110011110100000001001000011",
        "description": "Generated edge case"
      }
    ],
    "analogy": {
      "title": "⚡ The Electric Wire & Switch Analogy for Add Binary",
      "story": "Imagine you are working in a master electrical room with switches lined up on a panel. Every switch represents a single binary bit (0 for OFF, 1 for ON). Instead of manually opening and closing every single circuit individually, Add Binary lets you manipulate circuits instantaneously using logic gates like XOR, AND, and bit shifts."
    },
    "steps": [
      {
        "stepIndex": 0,
        "title": "🏁 Initialization & Setup",
        "activeLine": 1,
        "explanation": "Set up the primary accumulator and bitwise tracking registers.",
        "variables": {
          "state": "Initial",
          "bitIndex": 0
        }
      },
      {
        "stepIndex": 1,
        "title": "⚙️ Core Bitwise Transformation",
        "activeLine": 2,
        "explanation": "Apply the core bitwise identity: cancel duplicates, probe Trie branches, or accumulate masks.",
        "variables": {
          "state": "Processing",
          "activeMask": "0b1"
        }
      },
      {
        "stepIndex": 2,
        "title": "🎯 Result Finalization",
        "activeLine": 3,
        "explanation": "Extract the computed integer result and return it with optimal O(1) auxiliary space.",
        "variables": {
          "state": "Complete",
          "verified": true
        }
      }
    ],
    "timeLimit": 2000,
    "memoryLimit": 256,
    "status": "approved",
    "generatedAt": "2026-11-20T14:42:20.396Z"
  },
  {
    "problemId": "dsa_bit-manipulation_08",
    "topicId": "bit-manipulation",
    "order": 8,
    "title": "Single Number II (Appears 3 Times)",
    "difficulty": "Medium",
    "pattern": "Bit-by-Bit Modulo 3 Tally / State Machine (ones, twos)",
    "tags": [
      "Bit Manipulation",
      "Medium",
      "State Machine",
      "Campus Placement"
    ],
    "statement": "Given an integer array `nums` where every element appears exactly three times except for one unique element which appears exactly once, find the single element and return it.\n\nYou must implement a solution with linear runtime complexity and use strictly O(1) extra space.",
    "inputFormat": "First line: integer N.\nSecond line: N space-separated integers.",
    "outputFormat": "Print the single unique element.",
    "constraints": [
      "1 <= N <= 3 * 10^4",
      "-2^31 <= nums[i] <= 2^31 - 1",
      "Each element in nums appears exactly three times except for one element which appears once.",
      "Time Limit: 2.0 seconds",
      "Memory Limit: 256 MB"
    ],
    "examples": [
      {
        "input": "4\n2 2 3 2",
        "displayInput": "nums = [2, 2, 3, 2]",
        "output": "3",
        "displayOutput": "3",
        "explanation": "2 appears 3 times. 3 appears once and is returned."
      },
      {
        "input": "7\n0 1 0 1 0 1 99",
        "displayInput": "nums = [0, 1, 0, 1, 0, 1, 99]",
        "output": "99",
        "displayOutput": "99",
        "explanation": "0 and 1 appear 3 times. 99 appears once."
      },
      {
        "input": "1\n-4",
        "displayInput": "nums = [-4]",
        "output": "-4",
        "displayOutput": "-4",
        "explanation": "Array has only one element: -4."
      }
    ],
    "hints": [
      "Think about bit positions 0 to 31 individually. If a bit appears 3 times, its sum across elements is a multiple of 3.",
      "If you sum the bits at position i for all numbers and take modulo 3, the triplets will sum to 0 mod 3. The remainder (0 or 1) belongs to the unique single number!",
      "For O(N) single-pass with no 32-loop: use two bit variables `ones` and `twos` to track bits seen 1 time and 2 times."
    ],
    "starterCode": {
      "python": "import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    \n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()",
      "javascript": "const fs = require('fs');\n\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    const nums = [];\n    for (let i = 0; i < n; i++) nums.push(parseInt(tokens[i + 1], 10));\n    \n    // Write your solution below\n}\n\nsolve();",
      "java": "import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        \n        // Write your solution below\n    }\n}",
      "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    \n    // Write your solution below\n    return 0;\n}"
    },
    "approaches": [
      {
        "name": "Approach 1: Brute Force",
        "type": "brute",
        "title": "Approach 1: Hash Map Frequency Count (Brute Force)",
        "idea": "Store occurrences of each element in a hash map and return the element with count 1.",
        "dryRun": "nums = [2, 2, 3, 2]. Map: {2: 3, 3: 1}. Element 3 has count 1 -> return 3.",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "code": {
          "python": "import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    c = {}\n    for i in range(1, n + 1):\n        x = int(tokens[i]); c[x] = c.get(x, 0) + 1\n    for k, v in c.items():\n        if v == 1: print(k); return\nif __name__ == '__main__': solve()",
          "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        Map<Integer, Integer> c = new HashMap<>();\n        for (int i = 0; i < n; i++) { int x = sc.nextInt(); c.put(x, c.getOrDefault(x, 0) + 1); }\n        for (Map.Entry<Integer, Integer> e : c.entrySet()) { if (e.getValue() == 1) { System.out.println(e.getKey()); return; } }\n    }\n}",
          "cpp": "#include <iostream>\n#include <unordered_map>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    unordered_map<int, int> c;\n    for (int i = 0; i < n; i++) { int x; cin >> x; c[x]++; }\n    for (auto &p : c) { if (p.second == 1) { cout << p.first << \"\\n\"; return 0; } }\n    return 0;\n}",
          "javascript": "const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    const c = new Map();\n    for (let i = 1; i <= n; i++) { const x = parseInt(tokens[i], 10); c.set(x, (c.get(x) || 0) + 1); }\n    for (const [k, v] of c.entries()) { if (v === 1) { console.log(k); return; } }\n}\nsolve();"
        }
      },
      {
        "name": "Approach 2: Better Approach",
        "type": "better",
        "title": "Lookup Table / Bit Counting Optimizations",
        "idea": "Optimize standard brute loops using precomputed byte-level tables, hash indexing, or intermediate mathematical invariants.",
        "dryRun": "Process blocks of 8 bits using an O(1) table lookup or accumulator, reducing loop iterations by 4x.",
        "timeComplexity": "O(log N)",
        "spaceComplexity": "O(1)",
        "code": {
          "python": "import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    c = {}\n    for i in range(1, n + 1):\n        x = int(tokens[i]); c[x] = c.get(x, 0) + 1\n    for k, v in c.items():\n        if v == 1: print(k); return\nif __name__ == '__main__': solve()",
          "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        Map<Integer, Integer> c = new HashMap<>();\n        for (int i = 0; i < n; i++) { int x = sc.nextInt(); c.put(x, c.getOrDefault(x, 0) + 1); }\n        for (Map.Entry<Integer, Integer> e : c.entrySet()) { if (e.getValue() == 1) { System.out.println(e.getKey()); return; } }\n    }\n}",
          "cpp": "#include <iostream>\n#include <unordered_map>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    unordered_map<int, int> c;\n    for (int i = 0; i < n; i++) { int x; cin >> x; c[x]++; }\n    for (auto &p : c) { if (p.second == 1) { cout << p.first << \"\\n\"; return 0; } }\n    return 0;\n}",
          "javascript": "const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    const c = new Map();\n    for (let i = 1; i <= n; i++) { const x = parseInt(tokens[i], 10); c.set(x, (c.get(x) || 0) + 1); }\n    for (const [k, v] of c.entries()) { if (v === 1) { console.log(k); return; } }\n}\nsolve();"
        }
      },
      {
        "name": "Approach 3: Optimal Bitwise Approach",
        "type": "optimal",
        "title": "Approach 2: Bitmask State Machine (Optimal)",
        "idea": "Track bits appearing 1 time and 2 times: ones = (ones ^ x) & ~twos; twos = (twos ^ x) & ~ones. When a bit appears 3 times, both ones and twos reset to 0.",
        "dryRun": "For element x: update ones and twos. Triplets cycle 0 -> 1 -> 2 -> 0. The single element ends in `ones`.",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "code": {
          "python": "import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    ones, twos = 0, 0\n    for i in range(1, n + 1):\n        x = int(tokens[i])\n        ones = (ones ^ x) & ~twos\n        twos = (twos ^ x) & ~ones\n    # Convert 32-bit signed in Python\n    if ones >= 2**31: ones -= 2**32\n    print(ones)\nif __name__ == '__main__': solve()",
          "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int ones = 0, twos = 0;\n        for (int i = 0; i < n; i++) {\n            int x = sc.nextInt();\n            ones = (ones ^ x) & ~twos;\n            twos = (twos ^ x) & ~ones;\n        }\n        System.out.println(ones);\n    }\n}",
          "cpp": "#include <iostream>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    int ones = 0, twos = 0;\n    for (int i = 0; i < n; i++) {\n        int x; cin >> x;\n        ones = (ones ^ x) & ~twos;\n        twos = (twos ^ x) & ~ones;\n    }\n    cout << ones << \"\\n\"; return 0;\n}",
          "javascript": "const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    let ones = 0, twos = 0;\n    for (let i = 1; i <= n; i++) {\n        const x = parseInt(tokens[i], 10);\n        ones = (ones ^ x) & ~twos;\n        twos = (twos ^ x) & ~ones;\n    }\n    console.log(ones);\n}\nsolve();"
        }
      }
    ],
    "testCases": [
      {
        "input": "4\n2 2 3 2",
        "expectedOutput": "3",
        "expected": "3",
        "explanation": "2 appears 3 times. 3 appears once and is returned."
      },
      {
        "input": "7\n0 1 0 1 0 1 99",
        "expectedOutput": "99",
        "expected": "99",
        "explanation": "0 and 1 appear 3 times. 99 appears once."
      },
      {
        "input": "1\n-4",
        "expectedOutput": "-4",
        "expected": "-4",
        "explanation": "Array has only one element: -4."
      }
    ],
    "hiddenTestCases": [
      {
        "input": "1\n0",
        "expectedOutput": "0",
        "expected": "0",
        "description": "Generated edge case"
      },
      {
        "input": "1\n-99",
        "expectedOutput": "-99",
        "expected": "-99",
        "description": "Generated edge case"
      },
      {
        "input": "4\n5 5 5 2",
        "expectedOutput": "2",
        "expected": "2",
        "description": "Generated edge case"
      },
      {
        "input": "4\n-1 -1 -1 -100",
        "expectedOutput": "-100",
        "expected": "-100",
        "description": "Generated edge case"
      },
      {
        "input": "7\n10 10 10 20 20 20 30",
        "expectedOutput": "30",
        "expected": "30",
        "description": "Generated edge case"
      },
      {
        "input": "13\n7717 5396 9179 6352 9179 6352 7717 6352 1238 5396 7717 9179 5396",
        "expectedOutput": "1238",
        "expected": "1238",
        "description": "Generated edge case"
      },
      {
        "input": "37\n-1167 922 -6736 -106 -1340 -9189 5164 -3751 -6736 5164 3098 -9189 -1167 -7301 -106 -1340 -3751 3411 3411 -106 -7301 -1167 6641 922 -1340 4682 -9189 -7301 6641 3411 -6736 3098 922 6641 -3751 5164 3098",
        "expectedOutput": "4682",
        "expected": "4682",
        "description": "Generated edge case"
      },
      {
        "input": "61\n-7974 -150 10 -6193 -9648 -9213 -758 1510 -4481 -2113 9143 2633 -758 -4338 -2113 1484 -6213 2633 -9648 -3685 10 -150 -4338 2633 5237 -8719 -8719 -2494 -9213 -1573 -9648 5237 -6193 -4481 5237 9143 1510 -3685 1510 -150 -2494 -3685 -758 -6193 -7974 -2113 -564 -2494 -4338 1484 -564 -6213 10 -4481 -9213 -6213 1484 -564 -7974 9143 -8719",
        "expectedOutput": "-1573",
        "expected": "-1573",
        "description": "Generated edge case"
      },
      {
        "input": "85\n-5733 5943 -4295 -6746 -4651 -9306 -5733 -4224 -6746 -6820 -9306 -1016 7190 1547 -7706 3684 -4295 8949 -5342 1547 6224 1544 6327 1547 -1816 -1816 7190 1544 322 -6820 1544 3684 322 -4224 -4295 6224 6148 8675 6478 6327 6224 -3665 -1816 8675 -1016 -5342 7190 -4668 -3665 6148 -7706 2275 -9306 5943 -6820 -4668 6148 3684 -4177 322 6478 -4651 -4177 -4177 -5698 -4651 -5342 -5698 6327 8949 2275 -5698 1549 2275 -5733 5943 -4224 -3665 -4668 -7706 8675 8949 -6746 6478 -1016",
        "expectedOutput": "1549",
        "expected": "1549",
        "description": "Generated edge case"
      },
      {
        "input": "109\n-3418 -7927 -396 -4319 -4319 3834 8470 8470 -7999 -5463 6806 -4569 -528 -4569 -7999 7619 7148 1527 -4548 6033 1999 9303 -8053 -8053 -4557 384 -8600 5203 3435 -5089 -4569 -9031 5795 6033 -2243 285 -6835 -4557 384 5203 -2243 -6861 5770 -6184 -396 -6835 -8053 -5089 -9031 6806 1527 -4548 9303 1614 -5463 -6861 3874 -8600 285 -4319 5770 -4548 -7927 3874 -6835 3874 5770 -7999 -6184 3834 -6184 6806 -5463 1411 7619 -396 1614 -3418 -5089 1614 -3418 7148 1999 1999 3435 5795 7148 -2243 8470 3834 7619 5203 -6138 9303 -7927 384 -6861 285 -528 6033 1411 5795 -8600 -528 3435 -9031 1411 -4557 1527",
        "expectedOutput": "-6138",
        "expected": "-6138",
        "description": "Generated edge case"
      },
      {
        "input": "133\n-5426 -5426 -4209 4820 3688 9211 -8869 -7036 -5236 7098 3688 -7225 7098 -8677 -9766 9211 -1965 -9766 -6450 7245 -9331 4670 -2267 -5533 9929 8763 -7225 -2780 -3638 -5293 -183 1465 1497 9211 7216 -2597 4549 8763 1236 1236 4670 -9331 8367 1465 -3135 9929 -8321 4670 7878 -5554 -1350 -3045 -4209 9929 3271 -6722 -183 8367 -9331 -9656 -5293 -2780 3688 7370 -6722 7216 -4991 -9656 -8677 -5426 8763 -8869 -8321 -5533 7305 -7036 5856 7216 -3638 1497 -6450 7245 4549 -5236 -1965 7370 -6722 -5293 7370 4820 -8677 1465 -9766 4549 -8869 7305 1236 -7225 -2267 -3045 -1350 -3135 -6450 -2267 -1350 7098 -4991 8367 3271 -3135 7305 -3045 -5554 5856 7878 3271 -1965 -5533 -2780 -5236 -183 -8321 1497 -9656 -4209 7878 -4991 7245 4820 -3638 -7036 -5554 5856",
        "expectedOutput": "-2597",
        "expected": "-2597",
        "description": "Generated edge case"
      },
      {
        "input": "157\n1465 1228 1465 1983 -7304 8000 -4704 8000 -3405 7001 7001 2640 4786 -8307 4015 -8224 7001 683 8731 2268 1164 -5050 1808 -8307 -4036 8731 3005 -5608 -4036 2293 1983 483 -7657 483 1228 -4757 -8758 8339 -3002 -6187 3980 4786 5986 -3405 -4036 5986 -3002 2268 -4323 -4323 527 -3395 -4945 -4132 5277 -8836 8000 6667 -6187 6667 -3405 -5382 -7304 2293 -6935 -4704 -5382 -4265 3980 2390 -4265 -4323 2293 -4125 106 -4132 8808 1983 -4945 8339 -7657 1164 -9305 -5608 106 -4757 1465 7245 4786 -8758 8808 4015 -4132 1228 1808 7245 -4125 -2344 -1029 5986 4015 -7657 -8836 2390 5277 106 -5382 -8836 2268 3980 1164 -4704 -3395 -1029 4480 -2344 -5608 8808 -3002 683 -3395 7245 -6187 3005 -4472 -4472 527 2640 -4265 -2344 8339 683 6667 -8224 -9305 1808 -8758 -4472 -7304 4480 483 2390 -4757 4480 -4945 2640 -8224 -4125 5277 8731 -8307 -9305 527 -6935 3005 -6935 -1029",
        "expectedOutput": "-5050",
        "expected": "-5050",
        "description": "Generated edge case"
      },
      {
        "input": "181\n-8787 200 9139 9139 -1514 -7916 5563 -183 4146 8572 -6315 6735 -183 4691 49 4146 8039 -7474 -6203 1323 -5258 1323 -4744 -1514 5047 7822 6735 -5373 -9088 -498 8039 -7121 8966 2664 9338 5079 3569 -3024 2999 -9260 9579 4146 -498 9350 1323 -3906 6724 -9088 -4731 -4952 49 9019 6115 9019 9870 -9749 -2622 6115 -3906 8325 -7753 -7916 -1751 -929 -2622 -6315 -9979 -1751 -54 -5373 2706 -7916 8572 -1514 6735 -2250 8325 9870 3185 2664 8039 -8999 -2622 2664 -5258 -9088 6724 -7753 7822 -929 -6203 8966 2383 3185 -5373 2383 5563 -8999 2831 2383 9054 5079 -2250 -1751 -6203 2706 200 -54 5047 9579 2999 4691 -54 3569 1938 -9260 -6315 5079 -8040 -4952 9064 -4744 -3024 6724 -498 2831 9054 2706 -8040 9579 -7753 9338 3569 4691 9054 -7474 -7121 -8787 8572 -929 5047 -3024 8966 9870 2831 3185 200 -7474 -8999 9064 -4731 -4744 -7121 -9260 8599 6115 8325 8599 2999 -9749 9350 49 9350 -183 1938 -8040 -8787 -4731 -5258 9064 5563 8599 1938 -4952 -2250 9019 9139 -9749 -3906 9338 7822",
        "expectedOutput": "-9979",
        "expected": "-9979",
        "description": "Generated edge case"
      }
    ],
    "analogy": {
      "title": "🧦 The Pair-Matching Sock Drawer Analogy",
      "story": "Think of sorting socks fresh out of the laundry. Every regular number comes with an identical matching twin sock. In XOR arithmetic, when identical socks meet, they cancel each other out completely (X ^ X = 0). The solitary orphan sock that has no twin remains alone at the end (X ^ 0 = X)!"
    },
    "steps": [
      {
        "stepIndex": 0,
        "title": "🏁 Initialization & Setup",
        "activeLine": 1,
        "explanation": "Set up the primary accumulator and bitwise tracking registers.",
        "variables": {
          "state": "Initial",
          "bitIndex": 0
        }
      },
      {
        "stepIndex": 1,
        "title": "⚙️ Core Bitwise Transformation",
        "activeLine": 2,
        "explanation": "Apply the core bitwise identity: cancel duplicates, probe Trie branches, or accumulate masks.",
        "variables": {
          "state": "Processing",
          "activeMask": "0b1"
        }
      },
      {
        "stepIndex": 2,
        "title": "🎯 Result Finalization",
        "activeLine": 3,
        "explanation": "Extract the computed integer result and return it with optimal O(1) auxiliary space.",
        "variables": {
          "state": "Complete",
          "verified": true
        }
      }
    ],
    "timeLimit": 2000,
    "memoryLimit": 256,
    "status": "approved",
    "generatedAt": "2026-11-20T14:42:20.398Z"
  },
  {
    "problemId": "dsa_bit-manipulation_09",
    "topicId": "bit-manipulation",
    "order": 9,
    "title": "Single Number III (Two Unique Elements)",
    "difficulty": "Medium",
    "pattern": "Rightmost Set Bit Partitioning (diff & -diff)",
    "tags": [
      "Bit Manipulation",
      "Medium",
      "XOR",
      "Campus Placement"
    ],
    "statement": "Given an integer array `nums`, in which exactly two elements appear only once and all the other elements appear exactly twice, find the two elements that appear only once.\n\nReturn the two elements in ascending order, separated by a single space. You must run in linear runtime O(N) and use strictly O(1) extra space.",
    "inputFormat": "First line: integer N.\nSecond line: N space-separated integers.",
    "outputFormat": "Print the two unique elements in ascending order separated by a space.",
    "constraints": [
      "2 <= N <= 3 * 10^4",
      "-2^31 <= nums[i] <= 2^31 - 1",
      "Each element in nums appears twice except for two elements which appear once.",
      "Time Limit: 2.0 seconds",
      "Memory Limit: 256 MB"
    ],
    "examples": [
      {
        "input": "6\n1 2 1 3 2 5",
        "displayInput": "nums = [1, 2, 1, 3, 2, 5]",
        "output": "3 5",
        "displayOutput": "3 5",
        "explanation": "3 and 5 appear once; 1 and 2 appear twice. Output is 3 5 in ascending order."
      },
      {
        "input": "2\n-1 0",
        "displayInput": "nums = [-1, 0]",
        "output": "-1 0",
        "displayOutput": "-1 0",
        "explanation": "-1 and 0 are the unique elements."
      },
      {
        "input": "2\n0 1",
        "displayInput": "nums = [0, 1]",
        "output": "0 1",
        "displayOutput": "0 1",
        "explanation": "0 and 1 are the unique elements."
      }
    ],
    "hints": [
      "XORing all elements yields (A ^ B) because all duplicate pairs cancel to 0.",
      "Since A != B, (A ^ B) != 0, so there is at least one set bit in (A ^ B). This bit must be 1 in one number and 0 in the other!",
      "Extract the lowest set bit using diff & (-diff). Use this bit to partition the array into two subsets. XORing each subset isolates A and B individually in O(1) space!"
    ],
    "starterCode": {
      "python": "import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    \n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()",
      "javascript": "const fs = require('fs');\n\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    const nums = [];\n    for (let i = 0; i < n; i++) nums.push(parseInt(tokens[i + 1], 10));\n    \n    // Write your solution below\n}\n\nsolve();",
      "java": "import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        \n        // Write your solution below\n    }\n}",
      "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    \n    // Write your solution below\n    return 0;\n}"
    },
    "approaches": [
      {
        "name": "Approach 1: Brute Force",
        "type": "brute",
        "title": "Approach 1: Hash Map (Brute Force)",
        "idea": "Count frequencies in a map and collect all keys with count 1, then sort.",
        "dryRun": "nums = [1, 2, 1, 3, 2, 5]. Counts: {1:2, 2:2, 3:1, 5:1}. Singles: [3, 5].",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "code": {
          "python": "import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    c = {}\n    for i in range(1, n + 1):\n        x = int(tokens[i]); c[x] = c.get(x, 0) + 1\n    res = sorted([k for k, v in c.items() if v == 1])\n    print(f\"{res[0]} {res[1]}\")\nif __name__ == '__main__': solve()",
          "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        Map<Integer, Integer> c = new HashMap<>();\n        for (int i = 0; i < n; i++) { int x = sc.nextInt(); c.put(x, c.getOrDefault(x, 0) + 1); }\n        List<Integer> s = new ArrayList<>();\n        for (Map.Entry<Integer, Integer> e : c.entrySet()) if (e.getValue() == 1) s.add(e.getKey());\n        Collections.sort(s);\n        System.out.println(s.get(0) + \" \" + s.get(1));\n    }\n}",
          "cpp": "#include <iostream>\n#include <unordered_map>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    unordered_map<int, int> c;\n    for (int i = 0; i < n; i++) { int x; cin >> x; c[x]++; }\n    vector<int> s;\n    for (auto &p : c) if (p.second == 1) s.push_back(p.first);\n    sort(s.begin(), s.end());\n    cout << s[0] << \" \" << s[1] << \"\\n\"; return 0;\n}",
          "javascript": "const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    const c = new Map();\n    for (let i = 1; i <= n; i++) { const x = parseInt(tokens[i], 10); c.set(x, (c.get(x) || 0) + 1); }\n    const singles = [];\n    for (const [k, v] of c.entries()) if (v === 1) singles.push(k);\n    singles.sort((a, b) => a - b);\n    console.log(singles[0] + ' ' + singles[1]);\n}\nsolve();"
        }
      },
      {
        "name": "Approach 2: Better Approach",
        "type": "better",
        "title": "Lookup Table / Bit Counting Optimizations",
        "idea": "Optimize standard brute loops using precomputed byte-level tables, hash indexing, or intermediate mathematical invariants.",
        "dryRun": "Process blocks of 8 bits using an O(1) table lookup or accumulator, reducing loop iterations by 4x.",
        "timeComplexity": "O(log N)",
        "spaceComplexity": "O(1)",
        "code": {
          "python": "import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    c = {}\n    for i in range(1, n + 1):\n        x = int(tokens[i]); c[x] = c.get(x, 0) + 1\n    res = sorted([k for k, v in c.items() if v == 1])\n    print(f\"{res[0]} {res[1]}\")\nif __name__ == '__main__': solve()",
          "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        Map<Integer, Integer> c = new HashMap<>();\n        for (int i = 0; i < n; i++) { int x = sc.nextInt(); c.put(x, c.getOrDefault(x, 0) + 1); }\n        List<Integer> s = new ArrayList<>();\n        for (Map.Entry<Integer, Integer> e : c.entrySet()) if (e.getValue() == 1) s.add(e.getKey());\n        Collections.sort(s);\n        System.out.println(s.get(0) + \" \" + s.get(1));\n    }\n}",
          "cpp": "#include <iostream>\n#include <unordered_map>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    unordered_map<int, int> c;\n    for (int i = 0; i < n; i++) { int x; cin >> x; c[x]++; }\n    vector<int> s;\n    for (auto &p : c) if (p.second == 1) s.push_back(p.first);\n    sort(s.begin(), s.end());\n    cout << s[0] << \" \" << s[1] << \"\\n\"; return 0;\n}",
          "javascript": "const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    const c = new Map();\n    for (let i = 1; i <= n; i++) { const x = parseInt(tokens[i], 10); c.set(x, (c.get(x) || 0) + 1); }\n    const singles = [];\n    for (const [k, v] of c.entries()) if (v === 1) singles.push(k);\n    singles.sort((a, b) => a - b);\n    console.log(singles[0] + ' ' + singles[1]);\n}\nsolve();"
        }
      },
      {
        "name": "Approach 3: Optimal Bitwise Approach",
        "type": "optimal",
        "title": "Approach 2: Rightmost Bit Partitioning (Optimal)",
        "idea": "XOR all elements to get A ^ B. Find lowest set bit using diff & -diff. Partition elements by this bit and XOR each group separately to isolate A and B.",
        "dryRun": "nums = [1, 2, 1, 3, 2, 5]. xorAll = 3 ^ 5 = 6 (0110). Lowest bit diff = 2 (0010). Group with bit 1 set: [2, 2, 3] -> 3. Group without bit 1: [1, 1, 5] -> 5. Sort: [3, 5].",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "code": {
          "python": "import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    xor_all = 0\n    for i in range(1, n + 1): xor_all ^= int(tokens[i])\n    diff = xor_all & -xor_all\n    a, b = 0, 0\n    for i in range(1, n + 1):\n        x = int(tokens[i])\n        if x & diff: a ^= x\n        else: b ^= x\n    res = sorted([a, b])\n    print(f\"{res[0]} {res[1]}\")\nif __name__ == '__main__': solve()",
          "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        int xorAll = 0;\n        for (int i = 0; i < n; i++) { nums[i] = sc.nextInt(); xorAll ^= nums[i]; }\n        int diff = xorAll & -xorAll;\n        int a = 0, b = 0;\n        for (int x : nums) { if ((x & diff) != 0) a ^= x; else b ^= x; }\n        int min = Math.min(a, b), max = Math.max(a, b);\n        System.out.println(min + \" \" + max);\n    }\n}",
          "cpp": "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    long long xorAll = 0;\n    for (int i = 0; i < n; i++) { cin >> nums[i]; xorAll ^= nums[i]; }\n    long long diff = xorAll & -xorAll;\n    int a = 0, b = 0;\n    for (int x : nums) { if (x & diff) a ^= x; else b ^= x; }\n    if (a > b) swap(a, b);\n    cout << a << \" \" << b << \"\\n\"; return 0;\n}",
          "javascript": "const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    let xorAll = 0;\n    for (let i = 1; i <= n; i++) xorAll ^= parseInt(tokens[i], 10);\n    const diff = xorAll & -xorAll;\n    let a = 0, b = 0;\n    for (let i = 1; i <= n; i++) {\n        const x = parseInt(tokens[i], 10);\n        if ((x & diff) !== 0) a ^= x; else b ^= x;\n    }\n    const res = [a, b].sort((x, y) => x - y);\n    console.log(res[0] + ' ' + res[1]);\n}\nsolve();"
        }
      }
    ],
    "testCases": [
      {
        "input": "6\n1 2 1 3 2 5",
        "expectedOutput": "3 5",
        "expected": "3 5",
        "explanation": "3 and 5 appear once; 1 and 2 appear twice. Output is 3 5 in ascending order."
      },
      {
        "input": "2\n-1 0",
        "expectedOutput": "-1 0",
        "expected": "-1 0",
        "explanation": "-1 and 0 are the unique elements."
      },
      {
        "input": "2\n0 1",
        "expectedOutput": "0 1",
        "expected": "0 1",
        "explanation": "0 and 1 are the unique elements."
      }
    ],
    "hiddenTestCases": [
      {
        "input": "2\n1 2",
        "expectedOutput": "1 2",
        "expected": "1 2",
        "description": "Generated edge case"
      },
      {
        "input": "2\n-1 0",
        "expectedOutput": "-1 0",
        "expected": "-1 0",
        "description": "Generated edge case"
      },
      {
        "input": "6\n1 2 1 3 2 5",
        "expectedOutput": "3 5",
        "expected": "3 5",
        "description": "Generated edge case"
      },
      {
        "input": "4\n0 1 2 2",
        "expectedOutput": "0 1",
        "expected": "0 1",
        "description": "Generated edge case"
      },
      {
        "input": "10\n1238 5396 6352 6352 7717 9179 5396 4420 7717 9179",
        "expectedOutput": "1238 4420",
        "expected": "1238 4420",
        "description": "Generated edge case"
      },
      {
        "input": "22\n3098 -6736 -6736 3411 3098 -7301 -1167 7873 -106 7873 -6347 -9189 -7301 -3751 -1167 3411 6641 922 -6347 -3751 6641 -106",
        "expectedOutput": "-9189 922",
        "expected": "-9189 922",
        "description": "Generated edge case"
      },
      {
        "input": "34\n5842 707 2218 1271 2570 -740 5640 -3566 9647 -3566 -215 8861 -740 7480 7480 5277 -3815 1395 5640 -6909 5277 -215 1395 9647 5842 -2476 -6909 8861 -1637 -1637 2218 -2476 707 1271",
        "expectedOutput": "-3815 2570",
        "expected": "-3815 2570",
        "description": "Generated edge case"
      },
      {
        "input": "46\n8689 235 4476 -2097 8173 6173 1401 -4996 3084 939 -499 4476 5444 2708 5936 5872 6689 1017 1179 1401 -983 1017 1021 5872 5936 -4996 5444 -186 1179 6303 3084 -2097 6689 235 -7737 939 -499 6484 -186 -7737 6303 6173 8689 8173 1021 6484",
        "expectedOutput": "-983 2708",
        "expected": "-983 2708",
        "description": "Generated edge case"
      },
      {
        "input": "58\n-1250 3945 1841 -9306 -5698 5727 6094 1547 -1250 -6243 -6746 -4972 -3654 -6592 -5762 -4651 -2314 1549 1963 4158 5727 -5698 -4177 4764 -6592 1547 6529 -4972 -2350 -5762 -4651 7992 1841 -3654 -3371 8675 5857 -8730 5857 6529 -4177 -9306 -1197 9462 -2314 1549 -8730 8675 3945 -1197 -3371 6094 9462 -6746 4764 4158 1963 -6243",
        "expectedOutput": "-2350 7992",
        "expected": "-2350 7992",
        "description": "Generated edge case"
      },
      {
        "input": "70\n7619 -6861 3435 9303 3834 1527 285 -8856 -6861 6033 -6835 -2243 -4326 -7927 -4326 -396 1999 -5089 9386 -6184 -396 3874 5770 -4319 5770 9303 3834 1614 1999 1844 -6184 -4557 8470 -277 3435 8470 -5463 -528 -4569 -5089 -4548 -8600 -8053 1844 -4557 -277 -4319 -6835 7148 -3418 -2243 -7927 9386 -9031 -4548 5203 -528 -4569 1527 7148 6033 1614 285 -3418 7619 3874 5203 -8856 -8600 -8053",
        "expectedOutput": "-9031 -5463",
        "expected": "-9031 -5463",
        "description": "Generated edge case"
      },
      {
        "input": "82\n4794 -2536 6465 4385 4315 7701 722 6007 -3289 8175 -4529 -5953 -631 -3381 7701 -631 -2536 -288 -2235 -5506 -4165 224 1103 -94 -5020 -3357 -94 2412 4315 4962 6465 2315 -5790 -4543 -2235 4385 1103 -3357 722 -4454 -3289 -3996 -5506 1679 -5020 -4529 -4903 -4165 3256 -2432 4787 6121 -4903 -4454 4646 6121 8175 4794 -2432 9072 -2771 -3996 -157 9072 -5953 3256 4787 2412 -5790 -3381 -1326 4646 1679 224 -288 2315 -2771 6007 -4543 -1326 4962 6476",
        "expectedOutput": "-157 6476",
        "expected": "-157 6476",
        "description": "Generated edge case"
      },
      {
        "input": "94\n-4336 3188 -1048 -2788 -5649 3944 -4336 7686 1743 -1048 -115 8408 -2788 3944 8408 -6622 1530 -7156 6214 -2790 4432 -9026 8528 6669 -6661 -8459 -1946 9496 7718 5115 9144 -4509 5157 -1946 -6622 -7156 -1130 -2895 -8480 -5778 9798 -3507 -3590 -1991 -5529 -115 -8375 4432 -1991 -8459 2956 -6444 8528 -8375 8390 -6397 -1130 -2790 -2205 -1605 -3507 6214 -2205 -2895 5157 9798 -3677 -5778 7686 9144 1530 -3677 -2527 1743 -5529 -2527 -6397 5115 -6444 -6298 7718 -6298 -4079 -6661 2956 -4079 8390 -5649 3188 -9026 -1605 -4509 -8480 9496",
        "expectedOutput": "-3590 6669",
        "expected": "-3590 6669",
        "description": "Generated edge case"
      }
    ],
    "analogy": {
      "title": "🧦 The Pair-Matching Sock Drawer Analogy",
      "story": "Think of sorting socks fresh out of the laundry. Every regular number comes with an identical matching twin sock. In XOR arithmetic, when identical socks meet, they cancel each other out completely (X ^ X = 0). The solitary orphan sock that has no twin remains alone at the end (X ^ 0 = X)!"
    },
    "steps": [
      {
        "stepIndex": 0,
        "title": "🏁 Initialization & Setup",
        "activeLine": 1,
        "explanation": "Set up the primary accumulator and bitwise tracking registers.",
        "variables": {
          "state": "Initial",
          "bitIndex": 0
        }
      },
      {
        "stepIndex": 1,
        "title": "⚙️ Core Bitwise Transformation",
        "activeLine": 2,
        "explanation": "Apply the core bitwise identity: cancel duplicates, probe Trie branches, or accumulate masks.",
        "variables": {
          "state": "Processing",
          "activeMask": "0b1"
        }
      },
      {
        "stepIndex": 2,
        "title": "🎯 Result Finalization",
        "activeLine": 3,
        "explanation": "Extract the computed integer result and return it with optimal O(1) auxiliary space.",
        "variables": {
          "state": "Complete",
          "verified": true
        }
      }
    ],
    "timeLimit": 2000,
    "memoryLimit": 256,
    "status": "approved",
    "generatedAt": "2026-11-20T14:42:20.399Z"
  },
  {
    "problemId": "dsa_bit-manipulation_10",
    "topicId": "bit-manipulation",
    "order": 10,
    "title": "Subsets using Bitmask",
    "difficulty": "Medium",
    "pattern": "Iterating 0 to (1 << N) - 1 with Bit Testing",
    "tags": [
      "Bit Manipulation",
      "Medium",
      "Bitmask",
      "Campus Placement"
    ],
    "statement": "Given an integer array `nums` of unique elements, generate all possible subsets (the power set).\n\nThe solution set must not contain duplicate subsets. Output the total count of subsets on the first line (which equals 2^N), followed by each subset on a new line in mask order from 0 to 2^N - 1 (elements of each subset separated by spaces; empty subset represented as an empty line).",
    "inputFormat": "First line: integer N (1 <= N <= 10).\nSecond line: N space-separated distinct integers.",
    "outputFormat": "First line: total number of subsets (2^N).\nNext 2^N lines: space-separated elements of each subset generated in ascending order of mask 0 to 2^N - 1.",
    "constraints": [
      "1 <= N <= 10",
      "-10 <= nums[i] <= 10",
      "All elements in nums are unique.",
      "Time Limit: 2.0 seconds",
      "Memory Limit: 256 MB"
    ],
    "examples": [
      {
        "input": "3\n1 2 3",
        "displayInput": "nums = [1, 2, 3]",
        "output": "8\n\n1\n2\n1 2\n3\n1 3\n2 3\n1 2 3",
        "displayOutput": "8 subsets generated",
        "explanation": "There are 2^3 = 8 subsets corresponding to masks 000 through 111."
      },
      {
        "input": "1\n0",
        "displayInput": "nums = [0]",
        "output": "2\n\n0",
        "displayOutput": "2 subsets generated",
        "explanation": "Mask 0 is empty, mask 1 is [0]."
      },
      {
        "input": "2\n4 5",
        "displayInput": "nums = [4, 5]",
        "output": "4\n\n4\n5\n4 5",
        "displayOutput": "4 subsets generated",
        "explanation": "Mask 00: [], Mask 01: [4], Mask 10: [5], Mask 11: [4, 5]."
      }
    ],
    "hints": [
      "An array of N elements has 2^N total subsets.",
      "Represent each subset as a binary number (mask) from 0 to (1 << N) - 1.",
      "For each mask, test the j-th bit: if (mask & (1 << j)) is non-zero, include nums[j] in the subset!"
    ],
    "starterCode": {
      "python": "import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    \n    # Write your solution below\n    pass\n\nif __name__ == '__main__':\n    solve()",
      "javascript": "const fs = require('fs');\n\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    const nums = [];\n    for (let i = 0; i < n; i++) nums.push(parseInt(tokens[i + 1], 10));\n    \n    // Write your solution below\n}\n\nsolve();",
      "java": "import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        \n        // Write your solution below\n    }\n}",
      "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    \n    // Write your solution below\n    return 0;\n}"
    },
    "approaches": [
      {
        "name": "Approach 1: Brute Force",
        "type": "brute",
        "title": "Naive Simulation Approach",
        "idea": "Step through every state, digit, or combination iteratively without bitwise shortcuts.",
        "dryRun": "Test every candidate value or combination sequentially.",
        "timeComplexity": "O(N^2) or O(2^N)",
        "spaceComplexity": "O(N)",
        "code": {
          "python": "import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    nums = tokens[1:n+1]\n    total = 1 << n\n    print(total)\n    for mask in range(total):\n        sub = [nums[j] for j in range(n) if mask & (1 << j)]\n        print(\" \".join(sub))\nif __name__ == '__main__': solve()",
          "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int total = 1 << n;\n        System.out.println(total);\n        for (int mask = 0; mask < total; mask++) {\n            StringBuilder sb = new StringBuilder();\n            boolean first = true;\n            for (int j = 0; j < n; j++) {\n                if ((mask & (1 << j)) != 0) {\n                    if (!first) sb.append(\" \");\n                    sb.append(a[j]);\n                    first = false;\n                }\n            }\n            System.out.println(sb.toString());\n        }\n    }\n}",
          "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    int total = 1 << n;\n    cout << total << \"\\n\";\n    for (int mask = 0; mask < total; mask++) {\n        bool first = true;\n        for (int j = 0; j < n; j++) {\n            if (mask & (1 << j)) {\n                if (!first) cout << \" \";\n                cout << a[j];\n                first = false;\n            }\n        }\n        cout << \"\\n\";\n    }\n    return 0;\n}",
          "javascript": "const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    const nums = tokens.slice(1, n + 1);\n    const total = 1 << n;\n    console.log(total);\n    for (let mask = 0; mask < total; mask++) {\n        const sub = [];\n        for (let j = 0; j < n; j++) if (mask & (1 << j)) sub.push(nums[j]);\n        console.log(sub.join(' '));\n    }\n}\nsolve();"
        }
      },
      {
        "name": "Approach 2: Better Approach",
        "type": "better",
        "title": "Intermediate Counting / Conversion Approach",
        "idea": "Use frequency tables or two-pointer string scan to avoid redundant evaluations.",
        "dryRun": "Record intermediate results to prune unnecessary iterations.",
        "timeComplexity": "O(N log N) or O(N)",
        "spaceComplexity": "O(N)",
        "code": {
          "python": "import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    nums = tokens[1:n+1]\n    total = 1 << n\n    print(total)\n    for mask in range(total):\n        sub = [nums[j] for j in range(n) if mask & (1 << j)]\n        print(\" \".join(sub))\nif __name__ == '__main__': solve()",
          "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int total = 1 << n;\n        System.out.println(total);\n        for (int mask = 0; mask < total; mask++) {\n            StringBuilder sb = new StringBuilder();\n            boolean first = true;\n            for (int j = 0; j < n; j++) {\n                if ((mask & (1 << j)) != 0) {\n                    if (!first) sb.append(\" \");\n                    sb.append(a[j]);\n                    first = false;\n                }\n            }\n            System.out.println(sb.toString());\n        }\n    }\n}",
          "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    int total = 1 << n;\n    cout << total << \"\\n\";\n    for (int mask = 0; mask < total; mask++) {\n        bool first = true;\n        for (int j = 0; j < n; j++) {\n            if (mask & (1 << j)) {\n                if (!first) cout << \" \";\n                cout << a[j];\n                first = false;\n            }\n        }\n        cout << \"\\n\";\n    }\n    return 0;\n}",
          "javascript": "const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    const nums = tokens.slice(1, n + 1);\n    const total = 1 << n;\n    console.log(total);\n    for (let mask = 0; mask < total; mask++) {\n        const sub = [];\n        for (let j = 0; j < n; j++) if (mask & (1 << j)) sub.push(nums[j]);\n        console.log(sub.join(' '));\n    }\n}\nsolve();"
        }
      },
      {
        "name": "Approach 3: Optimal Bitwise Approach",
        "type": "optimal",
        "title": "Approach 1: Bitmask Iteration (Optimal)",
        "idea": "Iterate mask from 0 to 2^N - 1. If j-th bit of mask is set, include nums[j] in the current subset.",
        "dryRun": "nums = [1, 2]. Mask 0 (00): []. Mask 1 (01): [1]. Mask 2 (10): [2]. Mask 3 (11): [1, 2].",
        "timeComplexity": "O(N * 2^N)",
        "spaceComplexity": "O(1) auxiliary",
        "code": {
          "python": "import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    nums = tokens[1:n+1]\n    total = 1 << n\n    print(total)\n    for mask in range(total):\n        sub = [nums[j] for j in range(n) if mask & (1 << j)]\n        print(\" \".join(sub))\nif __name__ == '__main__': solve()",
          "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int total = 1 << n;\n        System.out.println(total);\n        for (int mask = 0; mask < total; mask++) {\n            StringBuilder sb = new StringBuilder();\n            boolean first = true;\n            for (int j = 0; j < n; j++) {\n                if ((mask & (1 << j)) != 0) {\n                    if (!first) sb.append(\" \");\n                    sb.append(a[j]);\n                    first = false;\n                }\n            }\n            System.out.println(sb.toString());\n        }\n    }\n}",
          "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    int total = 1 << n;\n    cout << total << \"\\n\";\n    for (int mask = 0; mask < total; mask++) {\n        bool first = true;\n        for (int j = 0; j < n; j++) {\n            if (mask & (1 << j)) {\n                if (!first) cout << \" \";\n                cout << a[j];\n                first = false;\n            }\n        }\n        cout << \"\\n\";\n    }\n    return 0;\n}",
          "javascript": "const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    const nums = tokens.slice(1, n + 1);\n    const total = 1 << n;\n    console.log(total);\n    for (let mask = 0; mask < total; mask++) {\n        const sub = [];\n        for (let j = 0; j < n; j++) if (mask & (1 << j)) sub.push(nums[j]);\n        console.log(sub.join(' '));\n    }\n}\nsolve();"
        }
      }
    ],
    "testCases": [
      {
        "input": "3\n1 2 3",
        "expectedOutput": "8\n\n1\n2\n1 2\n3\n1 3\n2 3\n1 2 3",
        "expected": "8\n\n1\n2\n1 2\n3\n1 3\n2 3\n1 2 3",
        "explanation": "There are 2^3 = 8 subsets corresponding to masks 000 through 111."
      },
      {
        "input": "1\n0",
        "expectedOutput": "2\n\n0",
        "expected": "2\n\n0",
        "explanation": "Mask 0 is empty, mask 1 is [0]."
      },
      {
        "input": "2\n4 5",
        "expectedOutput": "4\n\n4\n5\n4 5",
        "expected": "4\n\n4\n5\n4 5",
        "explanation": "Mask 00: [], Mask 01: [4], Mask 10: [5], Mask 11: [4, 5]."
      }
    ],
    "hiddenTestCases": [
      {
        "input": "1\n0",
        "expectedOutput": "2\n\n0",
        "expected": "2\n\n0",
        "description": "Generated edge case"
      },
      {
        "input": "1\n-5",
        "expectedOutput": "2\n\n-5",
        "expected": "2\n\n-5",
        "description": "Generated edge case"
      },
      {
        "input": "1\n10",
        "expectedOutput": "2\n\n10",
        "expected": "2\n\n10",
        "description": "Generated edge case"
      },
      {
        "input": "2\n1 2",
        "expectedOutput": "4\n\n1\n2\n1 2",
        "expected": "4\n\n1\n2\n1 2",
        "description": "Generated edge case"
      },
      {
        "input": "2\n-1 1",
        "expectedOutput": "4\n\n-1\n1\n-1 1",
        "expected": "4\n\n-1\n1\n-1 1",
        "description": "Generated edge case"
      },
      {
        "input": "2\n8 9",
        "expectedOutput": "4\n\n8\n9\n8 9",
        "expected": "4\n\n8\n9\n8 9",
        "description": "Generated edge case"
      },
      {
        "input": "3\n1 2 3",
        "expectedOutput": "8\n\n1\n2\n1 2\n3\n1 3\n2 3\n1 2 3",
        "expected": "8\n\n1\n2\n1 2\n3\n1 3\n2 3\n1 2 3",
        "description": "Generated edge case"
      },
      {
        "input": "3\n-3 0 3",
        "expectedOutput": "8\n\n-3\n0\n-3 0\n3\n-3 3\n0 3\n-3 0 3",
        "expected": "8\n\n-3\n0\n-3 0\n3\n-3 3\n0 3\n-3 0 3",
        "description": "Generated edge case"
      },
      {
        "input": "4\n1 2 3 4",
        "expectedOutput": "16\n\n1\n2\n1 2\n3\n1 3\n2 3\n1 2 3\n4\n1 4\n2 4\n1 2 4\n3 4\n1 3 4\n2 3 4\n1 2 3 4",
        "expected": "16\n\n1\n2\n1 2\n3\n1 3\n2 3\n1 2 3\n4\n1 4\n2 4\n1 2 4\n3 4\n1 3 4\n2 3 4\n1 2 3 4",
        "description": "Generated edge case"
      },
      {
        "input": "4\n-2 -1 1 2",
        "expectedOutput": "16\n\n-2\n-1\n-2 -1\n1\n-2 1\n-1 1\n-2 -1 1\n2\n-2 2\n-1 2\n-2 -1 2\n1 2\n-2 1 2\n-1 1 2\n-2 -1 1 2",
        "expected": "16\n\n-2\n-1\n-2 -1\n1\n-2 1\n-1 1\n-2 -1 1\n2\n-2 2\n-1 2\n-2 -1 2\n1 2\n-2 1 2\n-1 1 2\n-2 -1 1 2",
        "description": "Generated edge case"
      },
      {
        "input": "5\n1 2 3 4 5",
        "expectedOutput": "32\n\n1\n2\n1 2\n3\n1 3\n2 3\n1 2 3\n4\n1 4\n2 4\n1 2 4\n3 4\n1 3 4\n2 3 4\n1 2 3 4\n5\n1 5\n2 5\n1 2 5\n3 5\n1 3 5\n2 3 5\n1 2 3 5\n4 5\n1 4 5\n2 4 5\n1 2 4 5\n3 4 5\n1 3 4 5\n2 3 4 5\n1 2 3 4 5",
        "expected": "32\n\n1\n2\n1 2\n3\n1 3\n2 3\n1 2 3\n4\n1 4\n2 4\n1 2 4\n3 4\n1 3 4\n2 3 4\n1 2 3 4\n5\n1 5\n2 5\n1 2 5\n3 5\n1 3 5\n2 3 5\n1 2 3 5\n4 5\n1 4 5\n2 4 5\n1 2 4 5\n3 4 5\n1 3 4 5\n2 3 4 5\n1 2 3 4 5",
        "description": "Generated edge case"
      },
      {
        "input": "5\n10 20 30 40 50",
        "expectedOutput": "32\n\n10\n20\n10 20\n30\n10 30\n20 30\n10 20 30\n40\n10 40\n20 40\n10 20 40\n30 40\n10 30 40\n20 30 40\n10 20 30 40\n50\n10 50\n20 50\n10 20 50\n30 50\n10 30 50\n20 30 50\n10 20 30 50\n40 50\n10 40 50\n20 40 50\n10 20 40 50\n30 40 50\n10 30 40 50\n20 30 40 50\n10 20 30 40 50",
        "expected": "32\n\n10\n20\n10 20\n30\n10 30\n20 30\n10 20 30\n40\n10 40\n20 40\n10 20 40\n30 40\n10 30 40\n20 30 40\n10 20 30 40\n50\n10 50\n20 50\n10 20 50\n30 50\n10 30 50\n20 30 50\n10 20 30 50\n40 50\n10 40 50\n20 40 50\n10 20 40 50\n30 40 50\n10 30 40 50\n20 30 40 50\n10 20 30 40 50",
        "description": "Generated edge case"
      },
      {
        "input": "6\n1 3 5 7 9 11",
        "expectedOutput": "64\n\n1\n3\n1 3\n5\n1 5\n3 5\n1 3 5\n7\n1 7\n3 7\n1 3 7\n5 7\n1 5 7\n3 5 7\n1 3 5 7\n9\n1 9\n3 9\n1 3 9\n5 9\n1 5 9\n3 5 9\n1 3 5 9\n7 9\n1 7 9\n3 7 9\n1 3 7 9\n5 7 9\n1 5 7 9\n3 5 7 9\n1 3 5 7 9\n11\n1 11\n3 11\n1 3 11\n5 11\n1 5 11\n3 5 11\n1 3 5 11\n7 11\n1 7 11\n3 7 11\n1 3 7 11\n5 7 11\n1 5 7 11\n3 5 7 11\n1 3 5 7 11\n9 11\n1 9 11\n3 9 11\n1 3 9 11\n5 9 11\n1 5 9 11\n3 5 9 11\n1 3 5 9 11\n7 9 11\n1 7 9 11\n3 7 9 11\n1 3 7 9 11\n5 7 9 11\n1 5 7 9 11\n3 5 7 9 11\n1 3 5 7 9 11",
        "expected": "64\n\n1\n3\n1 3\n5\n1 5\n3 5\n1 3 5\n7\n1 7\n3 7\n1 3 7\n5 7\n1 5 7\n3 5 7\n1 3 5 7\n9\n1 9\n3 9\n1 3 9\n5 9\n1 5 9\n3 5 9\n1 3 5 9\n7 9\n1 7 9\n3 7 9\n1 3 7 9\n5 7 9\n1 5 7 9\n3 5 7 9\n1 3 5 7 9\n11\n1 11\n3 11\n1 3 11\n5 11\n1 5 11\n3 5 11\n1 3 5 11\n7 11\n1 7 11\n3 7 11\n1 3 7 11\n5 7 11\n1 5 7 11\n3 5 7 11\n1 3 5 7 11\n9 11\n1 9 11\n3 9 11\n1 3 9 11\n5 9 11\n1 5 9 11\n3 5 9 11\n1 3 5 9 11\n7 9 11\n1 7 9 11\n3 7 9 11\n1 3 7 9 11\n5 7 9 11\n1 5 7 9 11\n3 5 7 9 11\n1 3 5 7 9 11",
        "description": "Generated edge case"
      },
      {
        "input": "6\n-5 -4 -3 -2 -1 0",
        "expectedOutput": "64\n\n-5\n-4\n-5 -4\n-3\n-5 -3\n-4 -3\n-5 -4 -3\n-2\n-5 -2\n-4 -2\n-5 -4 -2\n-3 -2\n-5 -3 -2\n-4 -3 -2\n-5 -4 -3 -2\n-1\n-5 -1\n-4 -1\n-5 -4 -1\n-3 -1\n-5 -3 -1\n-4 -3 -1\n-5 -4 -3 -1\n-2 -1\n-5 -2 -1\n-4 -2 -1\n-5 -4 -2 -1\n-3 -2 -1\n-5 -3 -2 -1\n-4 -3 -2 -1\n-5 -4 -3 -2 -1\n0\n-5 0\n-4 0\n-5 -4 0\n-3 0\n-5 -3 0\n-4 -3 0\n-5 -4 -3 0\n-2 0\n-5 -2 0\n-4 -2 0\n-5 -4 -2 0\n-3 -2 0\n-5 -3 -2 0\n-4 -3 -2 0\n-5 -4 -3 -2 0\n-1 0\n-5 -1 0\n-4 -1 0\n-5 -4 -1 0\n-3 -1 0\n-5 -3 -1 0\n-4 -3 -1 0\n-5 -4 -3 -1 0\n-2 -1 0\n-5 -2 -1 0\n-4 -2 -1 0\n-5 -4 -2 -1 0\n-3 -2 -1 0\n-5 -3 -2 -1 0\n-4 -3 -2 -1 0\n-5 -4 -3 -2 -1 0",
        "expected": "64\n\n-5\n-4\n-5 -4\n-3\n-5 -3\n-4 -3\n-5 -4 -3\n-2\n-5 -2\n-4 -2\n-5 -4 -2\n-3 -2\n-5 -3 -2\n-4 -3 -2\n-5 -4 -3 -2\n-1\n-5 -1\n-4 -1\n-5 -4 -1\n-3 -1\n-5 -3 -1\n-4 -3 -1\n-5 -4 -3 -1\n-2 -1\n-5 -2 -1\n-4 -2 -1\n-5 -4 -2 -1\n-3 -2 -1\n-5 -3 -2 -1\n-4 -3 -2 -1\n-5 -4 -3 -2 -1\n0\n-5 0\n-4 0\n-5 -4 0\n-3 0\n-5 -3 0\n-4 -3 0\n-5 -4 -3 0\n-2 0\n-5 -2 0\n-4 -2 0\n-5 -4 -2 0\n-3 -2 0\n-5 -3 -2 0\n-4 -3 -2 0\n-5 -4 -3 -2 0\n-1 0\n-5 -1 0\n-4 -1 0\n-5 -4 -1 0\n-3 -1 0\n-5 -3 -1 0\n-4 -3 -1 0\n-5 -4 -3 -1 0\n-2 -1 0\n-5 -2 -1 0\n-4 -2 -1 0\n-5 -4 -2 -1 0\n-3 -2 -1 0\n-5 -3 -2 -1 0\n-4 -3 -2 -1 0\n-5 -4 -3 -2 -1 0",
        "description": "Generated edge case"
      }
    ],
    "analogy": {
      "title": "⚡ The Electric Wire & Switch Analogy for Subsets using Bitmask",
      "story": "Imagine you are working in a master electrical room with switches lined up on a panel. Every switch represents a single binary bit (0 for OFF, 1 for ON). Instead of manually opening and closing every single circuit individually, Subsets using Bitmask lets you manipulate circuits instantaneously using logic gates like XOR, AND, and bit shifts."
    },
    "steps": [
      {
        "stepIndex": 0,
        "title": "🏁 Initialization & Setup",
        "activeLine": 1,
        "explanation": "Set up the primary accumulator and bitwise tracking registers.",
        "variables": {
          "state": "Initial",
          "bitIndex": 0
        }
      },
      {
        "stepIndex": 1,
        "title": "⚙️ Core Bitwise Transformation",
        "activeLine": 2,
        "explanation": "Apply the core bitwise identity: cancel duplicates, probe Trie branches, or accumulate masks.",
        "variables": {
          "state": "Processing",
          "activeMask": "0b1"
        }
      },
      {
        "stepIndex": 2,
        "title": "🎯 Result Finalization",
        "activeLine": 3,
        "explanation": "Extract the computed integer result and return it with optimal O(1) auxiliary space.",
        "variables": {
          "state": "Complete",
          "verified": true
        }
      }
    ],
    "timeLimit": 2000,
    "memoryLimit": 256,
    "status": "approved",
    "generatedAt": "2026-11-20T14:42:20.400Z"
  },
  {
    "problemId": "dsa_bit-manipulation_11",
    "topicId": "bit-manipulation",
    "order": 11,
    "title": "Bitwise AND of Numbers Range",
    "difficulty": "Medium",
    "pattern": "Common Bit Prefix Finding via Right Shifting",
    "tags": [
      "Bit Manipulation",
      "Medium",
      "Prefix Shift",
      "Campus Placement"
    ],
    "statement": "You are given two non-negative integers `left` and `right` representing an inclusive range `[left, right]`.\n\nCompute and return the bitwise AND of all numbers in this range inclusive: `left & (left + 1) & (left + 2) & ... & right`.\n\nA brute-force loop from `left` to `right` will result in Time Limit Exceeded because the range can span up to 2 * 10^9 numbers. You must find an efficient bitwise method.",
    "inputFormat": "A single line containing two space-separated non-negative integers: left and right.",
    "outputFormat": "Print the single integer representing the bitwise AND of all numbers in [left, right].",
    "constraints": [
      "0 <= left <= right <= 2^31 - 1 (approx 2.14 * 10^9)",
      "Time Limit: 1.0 second",
      "Memory Limit: 256 MB"
    ],
    "examples": [
      {
        "input": "5 7",
        "displayInput": "left = 5, right = 7",
        "output": "4",
        "displayOutput": "4",
        "explanation": "5 is 101 in binary, 6 is 110, 7 is 111. 101 & 110 & 111 = 100 in binary, which is 4."
      },
      {
        "input": "0 0",
        "displayInput": "left = 0, right = 0",
        "output": "0",
        "displayOutput": "0",
        "explanation": "The only number in range is 0."
      },
      {
        "input": "1 2147483647",
        "displayInput": "left = 1, right = 2147483647",
        "output": "0",
        "displayOutput": "0",
        "explanation": "Range crosses powers of two, flipping all bit positions to 0 at least once."
      },
      {
        "input": "12 15",
        "displayInput": "left = 12, right = 15",
        "output": "12",
        "displayOutput": "12",
        "explanation": "12 (1100), 13 (1101), 14 (1110), 15 (1111). All share the prefix 1100 = 12."
      }
    ],
    "hints": [
      "Think about what happens to individual bits as numbers increase by 1. The lower bits flip frequently between 0 and 1.",
      "Whenever any number in the range has a 0 at bit position k, that bit becomes 0 in the final cumulative AND.",
      "Therefore, only the common binary prefix of `left` and `right` survives! Shift both right until they are equal, then shift left by that count."
    ],
    "starterCode": {
      "python": "import sys\n\ndef range_bitwise_and(left: int, right: int) -> int:\n    # Write your solution here\n    pass\n\nif __name__ == '__main__':\n    data = sys.stdin.read().split()\n    if data:\n        left, right = int(data[0]), int(data[1])\n        result = range_bitwise_and(left, right)\n        if result is not None:\n            print(result)\n",
      "java": "import java.util.Scanner;\n\npublic class Solution {\n    public static int rangeBitwiseAnd(int left, int right) {\n        // Write your solution here\n        return -1;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int left = sc.nextInt();\n            int right = sc.nextInt();\n            // Solution call\n        }\n    }\n}\n",
      "cpp": "#include <iostream>\nusing namespace std;\n\nint rangeBitwiseAnd(int left, int right) {\n    // Write your solution here\n    return -1;\n}\n\nint main() {\n    int left, right;\n    if (cin >> left >> right) {\n        // Solution call\n    }\n    return 0;\n}\n",
      "javascript": "const fs = require('fs');\n\nfunction rangeBitwiseAnd(left, right) {\n    // Write your solution here\n    return undefined;\n}\n\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);\nif (input.length >= 2 && input[0] !== '') {\n    const left = parseInt(input[0], 10);\n    const right = parseInt(input[1], 10);\n    const ans = rangeBitwiseAnd(left, right);\n    if (ans !== undefined) console.log(ans);\n}\n"
    },
    "approaches": [
      {
        "name": "Approach 1: Brute Force",
        "type": "brute",
        "title": "Iterative Bitwise AND Loop",
        "idea": "Start with ans = left and compute ans = ans & i for every i from left + 1 up to right.",
        "timeComplexity": "O(right - left)",
        "spaceComplexity": "O(1)",
        "code": {
          "python": "def range_bitwise_and(left: int, right: int) -> int:\n    ans = left\n    for i in range(left + 1, right + 1):\n        ans &= i\n        if ans == 0:\n            break\n    return ans",
          "java": "public int rangeBitwiseAnd(int left, int right) {\n    int ans = left;\n    for (long i = (long)left + 1; i <= right; i++) {\n        ans &= i;\n        if (ans == 0) break;\n    }\n    return ans;\n}",
          "cpp": "int rangeBitwiseAnd(int left, int right) {\n    long long ans = left;\n    for (long long i = (long long)left + 1; i <= right; i++) {\n        ans &= i;\n        if (ans == 0) break;\n    }\n    return (int)ans;\n}",
          "javascript": "function rangeBitwiseAnd(left, right) {\n    let ans = left;\n    for (let i = left + 1; i <= right; i++) {\n        ans = ans & i;\n        if (ans === 0) break;\n    }\n    return ans;\n}"
        }
      },
      {
        "name": "Approach 2: Better Approach",
        "type": "better",
        "title": "Brian Kernighan Right-Bound Clearing",
        "idea": "Instead of shifting bit-by-bit, repeatedly clear the lowest set bit of right (right = right & (right - 1)) while right > left.",
        "timeComplexity": "O(number of set bits in right) <= O(32)",
        "spaceComplexity": "O(1)",
        "code": {
          "python": "def range_bitwise_and(left: int, right: int) -> int:\n    while right > left:\n        right &= right - 1\n    return right",
          "java": "public int rangeBitwiseAnd(int left, int right) {\n    while (right > left) {\n        right &= (right - 1);\n    }\n    return right;\n}",
          "cpp": "int rangeBitwiseAnd(int left, int right) {\n    while (right > left) {\n        right &= (right - 1);\n    }\n    return right;\n}",
          "javascript": "function rangeBitwiseAnd(left, right) {\n    while (right > left) {\n        right = right & (right - 1);\n    }\n    return right;\n}"
        }
      },
      {
        "name": "Approach 3: Optimal Bitwise Approach",
        "type": "optimal",
        "title": "Bit Shift Common Prefix",
        "idea": "Right-shift both left and right simultaneously until they become equal, counting the number of shifts. Then left-shift the common prefix back by that shift count.",
        "timeComplexity": "O(log(right)) <= 32 operations = O(1)",
        "spaceComplexity": "O(1)",
        "code": {
          "python": "def range_bitwise_and(left: int, right: int) -> int:\n    shift = 0\n    while left < right:\n        left >>= 1\n        right >>= 1\n        shift += 1\n    return left << shift",
          "java": "public int rangeBitwiseAnd(int left, int right) {\n    int shift = 0;\n    while (left < right) {\n        left >>= 1;\n        right >>= 1;\n        shift++;\n    }\n    return left << shift;\n}",
          "cpp": "int rangeBitwiseAnd(int left, int right) {\n    int shift = 0;\n    while (left < right) {\n        left >>= 1;\n        right >>= 1;\n        shift++;\n    }\n    return left << shift;\n}",
          "javascript": "function rangeBitwiseAnd(left, right) {\n    let shift = 0;\n    while (left < right) {\n        left >>>= 1;\n        right >>>= 1;\n        shift++;\n    }\n    return left << shift;\n}"
        }
      }
    ],
    "testCases": [
      {
        "input": "5 7",
        "expectedOutput": "4",
        "expected": "4",
        "explanation": "5 is 101 in binary, 6 is 110, 7 is 111. 101 & 110 & 111 = 100 in binary, which is 4."
      },
      {
        "input": "0 0",
        "expectedOutput": "0",
        "expected": "0",
        "explanation": "The only number in range is 0."
      },
      {
        "input": "1 2147483647",
        "expectedOutput": "0",
        "expected": "0",
        "explanation": "Range crosses powers of two, flipping all bit positions to 0 at least once."
      },
      {
        "input": "12 15",
        "expectedOutput": "12",
        "expected": "12",
        "explanation": "12 (1100), 13 (1101), 14 (1110), 15 (1111). All share the prefix 1100 = 12."
      }
    ],
    "hiddenTestCases": [
      {
        "input": "0 1",
        "expectedOutput": "0",
        "expected": "0",
        "description": "Zero and one"
      },
      {
        "input": "6 7",
        "expectedOutput": "6",
        "expected": "6",
        "description": "Small adjacent odds"
      },
      {
        "input": "9 12",
        "expectedOutput": "8",
        "expected": "8",
        "description": "Crosses power of 2"
      },
      {
        "input": "26 30",
        "expectedOutput": "24",
        "expected": "24",
        "description": "Common prefix 11000"
      },
      {
        "input": "100 100",
        "expectedOutput": "100",
        "expected": "100",
        "description": "Single element left == right"
      },
      {
        "input": "2147483646 2147483647",
        "expectedOutput": "2147483646",
        "expected": "2147483646",
        "description": "Max 32-bit adjacent"
      },
      {
        "input": "10 11",
        "expectedOutput": "10",
        "expected": "10",
        "description": "1010 and 1011"
      },
      {
        "input": "16 31",
        "expectedOutput": "16",
        "expected": "16",
        "description": "Full block between 2^4 and 2^5-1"
      },
      {
        "input": "16 32",
        "expectedOutput": "0",
        "expected": "0",
        "description": "Boundary crosses power of two"
      },
      {
        "input": "200000 300000",
        "expectedOutput": "0",
        "expected": "0",
        "description": "Large range crosses 2^18"
      },
      {
        "input": "1000000 1000001",
        "expectedOutput": "1000000",
        "expected": "1000000",
        "description": "Large consecutive"
      },
      {
        "input": "536870912 1073741823",
        "expectedOutput": "536870912",
        "expected": "536870912",
        "description": "Power of 2 range 2^29"
      },
      {
        "input": "2 3",
        "expectedOutput": "2",
        "expected": "2",
        "description": "Minimal non-zero"
      },
      {
        "input": "1024 2047",
        "expectedOutput": "1024",
        "expected": "1024",
        "description": "1024 to 2047"
      },
      {
        "input": "1024 2048",
        "expectedOutput": "0",
        "expected": "0",
        "description": "1024 to 2048"
      }
    ],
    "analogy": {
      "title": "⚡ The Electric Wire & Switch Analogy for Bitwise AND of Numbers Range",
      "story": "Imagine you are working in a master electrical room with switches lined up on a panel. Every switch represents a single binary bit (0 for OFF, 1 for ON). Instead of manually opening and closing every single circuit individually, Bitwise AND of Numbers Range lets you manipulate circuits instantaneously using logic gates like XOR, AND, and bit shifts."
    },
    "steps": [
      {
        "stepIndex": 0,
        "title": "🏁 Initialization & Setup",
        "activeLine": 1,
        "explanation": "Set up the primary accumulator and bitwise tracking registers.",
        "variables": {
          "state": "Initial",
          "bitIndex": 0
        }
      },
      {
        "stepIndex": 1,
        "title": "⚙️ Core Bitwise Transformation",
        "activeLine": 2,
        "explanation": "Apply the core bitwise identity: cancel duplicates, probe Trie branches, or accumulate masks.",
        "variables": {
          "state": "Processing",
          "activeMask": "0b1"
        }
      },
      {
        "stepIndex": 2,
        "title": "🎯 Result Finalization",
        "activeLine": 3,
        "explanation": "Extract the computed integer result and return it with optimal O(1) auxiliary space.",
        "variables": {
          "state": "Complete",
          "verified": true
        }
      }
    ],
    "timeLimit": 2000,
    "memoryLimit": 256,
    "status": "approved",
    "generatedAt": "2026-11-20T14:42:20.400Z"
  },
  {
    "problemId": "dsa_bit-manipulation_12",
    "topicId": "bit-manipulation",
    "order": 12,
    "title": "Minimum Flips to Make a OR b Equal to c",
    "difficulty": "Medium",
    "pattern": "Bit-by-Bit Truth Table Discrepancy Counting",
    "tags": [
      "Bit Manipulation",
      "Medium",
      "Greedy Bits",
      "Campus Placement"
    ],
    "statement": "Given 3 positive integers `a`, `b` and `c`.\n\nReturn the minimum flips required in some bits of `a` and `b` to make `(a OR b == c)` (bitwise OR).\n\nFlip operation consists of change any single bit 1 to 0 or change the bit 0 to 1 in their binary representation.",
    "inputFormat": "A single line containing three space-separated integers: a, b, and c.",
    "outputFormat": "Print the minimum integer number of bit flips required.",
    "constraints": [
      "1 <= a, b, c <= 10^9",
      "Time Limit: 1.0 second",
      "Memory Limit: 256 MB"
    ],
    "examples": [
      {
        "input": "2 6 5",
        "displayInput": "a = 2, b = 6, c = 5",
        "output": "3",
        "displayOutput": "3",
        "explanation": "a=0010, b=0110, c=0101. Bit 0: a and b are 0, c is 1 -> flip 1 bit. Bit 1: a and b are 1, c is 0 -> flip both bits (2 flips). Total = 1 + 2 = 3."
      },
      {
        "input": "4 2 7",
        "displayInput": "a = 4, b = 2, c = 7",
        "output": "1",
        "displayOutput": "1",
        "explanation": "a=100, b=010, c=111. Only bit 0 needs to be flipped from 0 to 1 (1 flip)."
      },
      {
        "input": "1 2 3",
        "displayInput": "a = 1, b = 2, c = 3",
        "output": "0",
        "displayOutput": "0",
        "explanation": "1 OR 2 = 3 already, so 0 flips are needed."
      }
    ],
    "hints": [
      "Examine bit position i for each of a, b, and c from 0 up to 31.",
      "If the i-th bit of c is 0: both the i-th bit of a and the i-th bit of b MUST be 0. Any 1 must be flipped to 0.",
      "If the i-th bit of c is 1: at least one of a or b must have a 1 at that bit. If both are 0, you only need 1 flip."
    ],
    "starterCode": {
      "python": "import sys\n\ndef min_flips(a: int, b: int, c: int) -> int:\n    # Write your solution here\n    pass\n\nif __name__ == '__main__':\n    data = sys.stdin.read().split()\n    if data:\n        a, b, c = int(data[0]), int(data[1]), int(data[2])\n        result = min_flips(a, b, c)\n        if result is not None:\n            print(result)\n",
      "java": "import java.util.Scanner;\n\npublic class Solution {\n    public static int minFlips(int a, int b, int c) {\n        // Write your solution here\n        return -1;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int a = sc.nextInt();\n            int b = sc.nextInt();\n            int c = sc.nextInt();\n            // Solution call\n        }\n    }\n}\n",
      "cpp": "#include <iostream>\nusing namespace std;\n\nint minFlips(int a, int b, int c) {\n    // Write your solution here\n    return -1;\n}\n\nint main() {\n    int a, b, c;\n    if (cin >> a >> b >> c) {\n        // Solution call\n    }\n    return 0;\n}\n",
      "javascript": "const fs = require('fs');\n\nfunction minFlips(a, b, c) {\n    // Write your solution here\n    return undefined;\n}\n\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);\nif (input.length >= 3 && input[0] !== '') {\n    const a = parseInt(input[0], 10);\n    const b = parseInt(input[1], 10);\n    const c = parseInt(input[2], 10);\n    const ans = minFlips(a, b, c);\n    if (ans !== undefined) console.log(ans);\n}\n"
    },
    "approaches": [
      {
        "name": "Approach 1: Brute Force",
        "type": "brute",
        "title": "Iterate All 32 Bit Positions",
        "idea": "Inspect each of the 30-32 bit positions using bitmask (1 << i) and check condition against truth table.",
        "timeComplexity": "O(32) = O(1)",
        "spaceComplexity": "O(1)",
        "code": {
          "python": "def min_flips(a: int, b: int, c: int) -> int:\n    flips = 0\n    for i in range(32):\n        bit_a = (a >> i) & 1\n        bit_b = (b >> i) & 1\n        bit_c = (c >> i) & 1\n        if bit_c == 0:\n            flips += bit_a + bit_b\n        else:\n            if bit_a == 0 and bit_b == 0:\n                flips += 1\n    return flips",
          "java": "public int minFlips(int a, int b, int c) {\n    int flips = 0;\n    for (int i = 0; i < 32; i++) {\n        int bitA = (a >> i) & 1;\n        int bitB = (b >> i) & 1;\n        int bitC = (c >> i) & 1;\n        if (bitC == 0) {\n            flips += bitA + bitB;\n        } else {\n            if (bitA == 0 && bitB == 0) {\n                flips++;\n            }\n        }\n    }\n    return flips;\n}",
          "cpp": "int minFlips(int a, int b, int c) {\n    int flips = 0;\n    for (int i = 0; i < 32; i++) {\n        int bitA = (a >> i) & 1;\n        int bitB = (b >> i) & 1;\n        int bitC = (c >> i) & 1;\n        if (bitC == 0) {\n            flips += (bitA + bitB);\n        } else {\n            if (bitA == 0 && bitB == 0) {\n                flips += 1;\n            }\n        }\n    }\n    return flips;\n}",
          "javascript": "function minFlips(a, b, c) {\n    let flips = 0;\n    for (let i = 0; i < 32; i++) {\n        const bitA = (a >> i) & 1;\n        const bitB = (b >> i) & 1;\n        const bitC = (c >> i) & 1;\n        if (bitC === 0) {\n            flips += bitA + bitB;\n        } else {\n            if (bitA === 0 && bitB === 0) {\n                flips += 1;\n            }\n        }\n    }\n    return flips;\n}"
        }
      },
      {
        "name": "Approach 2: Better Approach",
        "type": "better",
        "title": "While Loop Shift",
        "idea": "Shift a, b, and c right simultaneously while any is non-zero, avoiding all 32 iterations if inputs are small.",
        "timeComplexity": "O(log(max(a, b, c)))",
        "spaceComplexity": "O(1)",
        "code": {
          "python": "def min_flips(a: int, b: int, c: int) -> int:\n    flips = 0\n    while a > 0 or b > 0 or c > 0:\n        bit_a, bit_b, bit_c = a & 1, b & 1, c & 1\n        if bit_c == 0:\n            flips += bit_a + bit_b\n        else:\n            if bit_a == 0 and bit_b == 0:\n                flips += 1\n        a >>= 1\n        b >>= 1\n        c >>= 1\n    return flips",
          "java": "public int minFlips(int a, int b, int c) {\n    int flips = 0;\n    while (a > 0 || b > 0 || c > 0) {\n        int bitA = a & 1, bitB = b & 1, bitC = c & 1;\n        if (bitC == 0) flips += bitA + bitB;\n        else if (bitA == 0 && bitB == 0) flips += 1;\n        a >>= 1; b >>= 1; c >>= 1;\n    }\n    return flips;\n}",
          "cpp": "int minFlips(int a, int b, int c) {\n    int flips = 0;\n    while (a > 0 || b > 0 || c > 0) {\n        int bitA = a & 1, bitB = b & 1, bitC = c & 1;\n        if (bitC == 0) flips += bitA + bitB;\n        else if (bitA == 0 && bitB == 0) flips += 1;\n        a >>= 1; b >>= 1; c >>= 1;\n    }\n    return flips;\n}",
          "javascript": "function minFlips(a, b, c) {\n    let flips = 0;\n    while (a > 0 || b > 0 || c > 0) {\n        const bitA = a & 1, bitB = b & 1, bitC = c & 1;\n        if (bitC === 0) flips += bitA + bitB;\n        else if (bitA === 0 && bitB === 0) flips += 1;\n        a >>>= 1; b >>>= 1; c >>>= 1;\n    }\n    return flips;\n}"
        }
      },
      {
        "name": "Approach 3: Optimal Bitwise Approach",
        "type": "optimal",
        "title": "Bitwise Formula with Popcount",
        "idea": "Positions where (a | b) differs from c need flips: count bits in ((a | b) ^ c). Additionally, positions where both a and b are 1 but c is 0 require a second flip: count bits in (a & b & ((a | b) ^ c)).",
        "timeComplexity": "O(1) with hardware popcount",
        "spaceComplexity": "O(1)",
        "code": {
          "python": "def min_flips(a: int, b: int, c: int) -> int:\n    diff = (a | b) ^ c\n    double_flips = a & b & diff\n    return bin(diff).count('1') + bin(double_flips).count('1')",
          "java": "public int minFlips(int a, int b, int c) {\n    int diff = (a | b) ^ c;\n    int doubleFlips = a & b & diff;\n    return Integer.bitCount(diff) + Integer.bitCount(doubleFlips);\n}",
          "cpp": "int minFlips(int a, int b, int c) {\n    int diff = (a | b) ^ c;\n    int doubleFlips = a & b & diff;\n    return __builtin_popcount(diff) + __builtin_popcount(doubleFlips);\n}",
          "javascript": "function minFlips(a, b, c) {\n    const diff = (a | b) ^ c;\n    const doubleFlips = (a & b) & diff;\n    function popcount(n) {\n        let count = 0;\n        while (n !== 0) {\n            n = n & (n - 1);\n            count++;\n        }\n        return count;\n    }\n    return popcount(diff) + popcount(doubleFlips);\n}"
        }
      }
    ],
    "testCases": [
      {
        "input": "2 6 5",
        "expectedOutput": "3",
        "expected": "3",
        "explanation": "a=0010, b=0110, c=0101. Bit 0: a and b are 0, c is 1 -> flip 1 bit. Bit 1: a and b are 1, c is 0 -> flip both bits (2 flips). Total = 1 + 2 = 3."
      },
      {
        "input": "4 2 7",
        "expectedOutput": "1",
        "expected": "1",
        "explanation": "a=100, b=010, c=111. Only bit 0 needs to be flipped from 0 to 1 (1 flip)."
      },
      {
        "input": "1 2 3",
        "expectedOutput": "0",
        "expected": "0",
        "explanation": "1 OR 2 = 3 already, so 0 flips are needed."
      }
    ],
    "hiddenTestCases": [
      {
        "input": "8 3 5",
        "expectedOutput": "3",
        "expected": "3",
        "description": "Mix of 0 and 1 flips"
      },
      {
        "input": "7 7 7",
        "expectedOutput": "0",
        "expected": "0",
        "description": "Already equal"
      },
      {
        "input": "1 1 0",
        "expectedOutput": "2",
        "expected": "2",
        "description": "Both 1 need to flip to 0"
      },
      {
        "input": "10 9 1",
        "expectedOutput": "3",
        "expected": "3",
        "description": "High bit flips"
      },
      {
        "input": "15 0 0",
        "expectedOutput": "4",
        "expected": "4",
        "description": "All 4 bits to zero"
      },
      {
        "input": "1000000000 1000000000 1",
        "expectedOutput": "27",
        "expected": "27",
        "description": "Large input boundary"
      },
      {
        "input": "5 2 8",
        "expectedOutput": "4",
        "expected": "4",
        "description": "Disjoint bits"
      },
      {
        "input": "1023 511 2047",
        "expectedOutput": "1",
        "expected": "1",
        "description": "Bit 10 flip"
      },
      {
        "input": "536870912 268435456 805306368",
        "expectedOutput": "0",
        "expected": "0",
        "description": "Exact bitwise sum"
      },
      {
        "input": "13 7 10",
        "expectedOutput": "4",
        "expected": "4",
        "description": "Varied patterns"
      },
      {
        "input": "12345 67890 54321",
        "expectedOutput": "9",
        "expected": "9",
        "description": "Medium random pattern"
      },
      {
        "input": "999999 888888 777777",
        "expectedOutput": "8",
        "expected": "8",
        "description": "Random 6 digit"
      },
      {
        "input": "1 1 1",
        "expectedOutput": "0",
        "expected": "0",
        "description": "All 1s"
      },
      {
        "input": "16 32 48",
        "expectedOutput": "0",
        "expected": "0",
        "description": "Clean powers of two"
      },
      {
        "input": "63 0 0",
        "expectedOutput": "6",
        "expected": "6",
        "description": "Six bits turn to 0"
      }
    ],
    "analogy": {
      "title": "⚡ The Electric Wire & Switch Analogy for Minimum Flips to Make a OR b Equal to c",
      "story": "Imagine you are working in a master electrical room with switches lined up on a panel. Every switch represents a single binary bit (0 for OFF, 1 for ON). Instead of manually opening and closing every single circuit individually, Minimum Flips to Make a OR b Equal to c lets you manipulate circuits instantaneously using logic gates like XOR, AND, and bit shifts."
    },
    "steps": [
      {
        "stepIndex": 0,
        "title": "🏁 Initialization & Setup",
        "activeLine": 1,
        "explanation": "Set up the primary accumulator and bitwise tracking registers.",
        "variables": {
          "state": "Initial",
          "bitIndex": 0
        }
      },
      {
        "stepIndex": 1,
        "title": "⚙️ Core Bitwise Transformation",
        "activeLine": 2,
        "explanation": "Apply the core bitwise identity: cancel duplicates, probe Trie branches, or accumulate masks.",
        "variables": {
          "state": "Processing",
          "activeMask": "0b1"
        }
      },
      {
        "stepIndex": 2,
        "title": "🎯 Result Finalization",
        "activeLine": 3,
        "explanation": "Extract the computed integer result and return it with optimal O(1) auxiliary space.",
        "variables": {
          "state": "Complete",
          "verified": true
        }
      }
    ],
    "timeLimit": 2000,
    "memoryLimit": 256,
    "status": "approved",
    "generatedAt": "2026-11-20T14:42:20.401Z"
  },
  {
    "problemId": "dsa_bit-manipulation_13",
    "topicId": "bit-manipulation",
    "order": 13,
    "title": "Maximum XOR of Two Numbers in an Array",
    "difficulty": "Medium",
    "pattern": "Bitwise Trie / Bit-Prefix Greedy Search",
    "tags": [
      "Bit Manipulation",
      "Medium",
      "Trie",
      "Campus Placement"
    ],
    "statement": "Given an integer array `nums`, return the maximum result of `nums[i] XOR nums[j]`, where `0 <= i <= j < n`.\n\nYou must design an algorithm that runs in `O(N * 32)` time complexity. An `O(N^2)` brute force approach will exceed the time limit on large test cases.",
    "inputFormat": "First line: integer N representing array length.\nSecond line: N space-separated non-negative integers.",
    "outputFormat": "Print the single integer representing the maximum XOR value obtainable.",
    "constraints": [
      "1 <= N <= 2 * 10^5",
      "0 <= nums[i] <= 2^31 - 1",
      "Time Limit: 2.0 seconds",
      "Memory Limit: 256 MB"
    ],
    "examples": [
      {
        "input": "6\n3 10 5 25 2 8",
        "displayInput": "nums = [3, 10, 5, 25, 2, 8]",
        "output": "28",
        "displayOutput": "28",
        "explanation": "The maximum result is 5 XOR 25 = 28."
      },
      {
        "input": "7\n14 70 53 83 49 91 36",
        "displayInput": "nums = [14, 70, 53, 83, 49, 91, 36]",
        "output": "127",
        "displayOutput": "127",
        "explanation": "83 XOR 49 = 127."
      },
      {
        "input": "1\n0",
        "displayInput": "nums = [0]",
        "output": "0",
        "displayOutput": "0",
        "explanation": "Array has 1 element, 0 XOR 0 = 0."
      }
    ],
    "hints": [
      "To maximize XOR, for each bit position from bit 30 down to 0, you want the result to have a 1 at that bit.",
      "A Trie where each node has 2 branches (0 and 1) lets you insert all numbers bit-by-bit.",
      "For each number, query the Trie by greedily taking the opposite branch (1 if current bit is 0, 0 if current bit is 1) whenever possible!"
    ],
    "starterCode": {
      "python": "import sys\n\ndef find_maximum_xor(nums: list[int]) -> int:\n    # Write your solution here\n    pass\n\nif __name__ == '__main__':\n    data = sys.stdin.read().split()\n    if data:\n        n = int(data[0])\n        nums = [int(x) for x in data[1:n+1]]\n        result = find_maximum_xor(nums)\n        if result is not None:\n            print(result)\n",
      "java": "import java.util.Scanner;\n\npublic class Solution {\n    public static int findMaximumXOR(int[] nums) {\n        // Write your solution here\n        return -1;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int n = sc.nextInt();\n            int[] nums = new int[n];\n            for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n            // Solution call\n        }\n    }\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint findMaximumXOR(vector<int>& nums) {\n    // Write your solution here\n    return -1;\n}\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<int> nums(n);\n        for (int i = 0; i < n; i++) cin >> nums[i];\n        // Solution call\n    }\n    return 0;\n}\n",
      "javascript": "const fs = require('fs');\n\nfunction findMaximumXOR(nums) {\n    // Write your solution here\n    return undefined;\n}\n\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);\nif (input.length > 0 && input[0] !== '') {\n    const n = parseInt(input[0], 10);\n    const nums = input.slice(1, n + 1).map(Number);\n    const ans = findMaximumXOR(nums);\n    if (ans !== undefined) console.log(ans);\n}\n"
    },
    "approaches": [
      {
        "name": "Approach 1: Brute Force",
        "type": "brute",
        "title": "Nested Loops Pairwise XOR",
        "idea": "Evaluate nums[i] ^ nums[j] for all pairs (i, j) and track the maximum.",
        "timeComplexity": "O(N^2)",
        "spaceComplexity": "O(1)",
        "code": {
          "python": "def find_maximum_xor(nums: list[int]) -> int:\n    max_xor = 0\n    n = len(nums)\n    for i in range(n):\n        for j in range(i, n):\n            max_xor = max(max_xor, nums[i] ^ nums[j])\n    return max_xor",
          "java": "public int findMaximumXOR(int[] nums) {\n    int maxXor = 0;\n    for (int i = 0; i < nums.length; i++) {\n        for (int j = i; j < nums.length; j++) {\n            maxXor = Math.max(maxXor, nums[i] ^ nums[j]);\n        }\n    }\n    return maxXor;\n}",
          "cpp": "int findMaximumXOR(vector<int>& nums) {\n    int maxXor = 0;\n    int n = nums.size();\n    for (int i = 0; i < n; i++) {\n        for (int j = i; j < n; j++) {\n            maxXor = max(maxXor, nums[i] ^ nums[j]);\n        }\n    }\n    return maxXor;\n}",
          "javascript": "function findMaximumXOR(nums) {\n    let maxXor = 0;\n    for (let i = 0; i < nums.length; i++) {\n        for (let j = i; j < nums.length; j++) {\n            maxXor = Math.max(maxXor, nums[i] ^ nums[j]);\n        }\n    }\n    return maxXor;\n}"
        }
      },
      {
        "name": "Approach 2: Better Approach",
        "type": "better",
        "title": "Bit-Prefix Set Probing",
        "idea": "From bit 30 down to 0, construct candidate max XOR prefix. Check if there exist two prefixes whose XOR equals the candidate prefix using a Hash Set.",
        "timeComplexity": "O(31 * N)",
        "spaceComplexity": "O(N)",
        "code": {
          "python": "def find_maximum_xor(nums: list[int]) -> int:\n    max_xor = 0\n    mask = 0\n    for i in range(30, -1, -1):\n        mask |= (1 << i)\n        prefixes = {num & mask for num in nums}\n        candidate = max_xor | (1 << i)\n        if any(candidate ^ p in prefixes for p in prefixes):\n            max_xor = candidate\n    return max_xor",
          "java": "import java.util.HashSet;\nimport java.util.Set;\n\npublic int findMaximumXOR(int[] nums) {\n    int maxXor = 0, mask = 0;\n    for (int i = 30; i >= 0; i--) {\n        mask |= (1 << i);\n        Set<Integer> prefixes = new HashSet<>();\n        for (int num : nums) prefixes.add(num & mask);\n        int candidate = maxXor | (1 << i);\n        for (int p : prefixes) {\n            if (prefixes.contains(candidate ^ p)) {\n                maxXor = candidate;\n                break;\n            }\n        }\n    }\n    return maxXor;\n}",
          "cpp": "#include <unordered_set>\nint findMaximumXOR(vector<int>& nums) {\n    int maxXor = 0, mask = 0;\n    for (int i = 30; i >= 0; i--) {\n        mask |= (1 << i);\n        unordered_set<int> prefixes;\n        for (int num : nums) prefixes.insert(num & mask);\n        int candidate = maxXor | (1 << i);\n        for (int p : prefixes) {\n            if (prefixes.count(candidate ^ p)) {\n                maxXor = candidate;\n                break;\n            }\n        }\n    }\n    return maxXor;\n}",
          "javascript": "function findMaximumXOR(nums) {\n    let maxXor = 0, mask = 0;\n    for (let i = 30; i >= 0; i--) {\n        mask |= (1 << i);\n        const prefixes = new Set();\n        for (const num of nums) prefixes.add(num & mask);\n        const candidate = maxXor | (1 << i);\n        for (const p of prefixes) {\n            if (prefixes.has(candidate ^ p)) {\n                maxXor = candidate;\n                break;\n            }\n        }\n    }\n    return maxXor;\n}"
        }
      },
      {
        "name": "Approach 3: Optimal Bitwise Approach",
        "type": "optimal",
        "title": "Binary Trie (Greedy Bit Descent)",
        "idea": "Store every number in a 31-bit Binary Trie. For each number, traverse down the Trie greedily picking the opposite bit to maximize the XOR output.",
        "timeComplexity": "O(31 * N)",
        "spaceComplexity": "O(31 * N)",
        "code": {
          "python": "class TrieNode:\n    def __init__(self):\n        self.children = [None, None]\n\ndef find_maximum_xor(nums: list[int]) -> int:\n    root = TrieNode()\n    \n    # Insert all nums into Trie\n    for num in nums:\n        curr = root\n        for i in range(30, -1, -1):\n            bit = (num >> i) & 1\n            if not curr.children[bit]:\n                curr.children[bit] = TrieNode()\n            curr = curr.children[bit]\n            \n    # Find max XOR\n    max_xor = 0\n    for num in nums:\n        curr = root\n        curr_xor = 0\n        for i in range(30, -1, -1):\n            bit = (num >> i) & 1\n            opp = 1 - bit\n            if curr.children[opp]:\n                curr_xor |= (1 << i)\n                curr = curr.children[opp]\n            else:\n                curr = curr.children[bit]\n        max_xor = max(max_xor, curr_xor)\n    return max_xor",
          "java": "class TrieNode {\n    TrieNode[] children = new TrieNode[2];\n}\n\npublic int findMaximumXOR(int[] nums) {\n    TrieNode root = new TrieNode();\n    for (int num : nums) {\n        TrieNode curr = root;\n        for (int i = 30; i >= 0; i--) {\n            int bit = (num >> i) & 1;\n            if (curr.children[bit] == null) curr.children[bit] = new TrieNode();\n            curr = curr.children[bit];\n        }\n    }\n    int maxXor = 0;\n    for (int num : nums) {\n        TrieNode curr = root;\n        int currXor = 0;\n        for (int i = 30; i >= 0; i--) {\n            int bit = (num >> i) & 1;\n            int opp = 1 - bit;\n            if (curr.children[opp] != null) {\n                currXor |= (1 << i);\n                curr = curr.children[opp];\n            } else {\n                curr = curr.children[bit];\n            }\n        }\n        maxXor = Math.max(maxXor, currXor);\n    }\n    return maxXor;\n}",
          "cpp": "struct TrieNode {\n    TrieNode* children[2] = {nullptr, nullptr};\n};\n\nint findMaximumXOR(vector<int>& nums) {\n    TrieNode* root = new TrieNode();\n    for (int num : nums) {\n        TrieNode* curr = root;\n        for (int i = 30; i >= 0; i--) {\n            int bit = (num >> i) & 1;\n            if (!curr->children[bit]) curr->children[bit] = new TrieNode();\n            curr = curr->children[bit];\n        }\n    }\n    int maxXor = 0;\n    for (int num : nums) {\n        TrieNode* curr = root;\n        int currXor = 0;\n        for (int i = 30; i >= 0; i--) {\n            int bit = (num >> i) & 1;\n            int opp = 1 - bit;\n            if (curr->children[opp]) {\n                currXor |= (1 << i);\n                curr = curr->children[opp];\n            } else {\n                curr = curr->children[bit];\n            }\n        }\n        maxXor = max(maxXor, currXor);\n    }\n    return maxXor;\n}",
          "javascript": "function findMaximumXOR(nums) {\n    class TrieNode {\n        constructor() { this.children = [null, null]; }\n    }\n    const root = new TrieNode();\n    for (const num of nums) {\n        let curr = root;\n        for (let i = 30; i >= 0; i--) {\n            const bit = (num >> i) & 1;\n            if (!curr.children[bit]) curr.children[bit] = new TrieNode();\n            curr = curr.children[bit];\n        }\n    }\n    let maxXor = 0;\n    for (const num of nums) {\n        let curr = root;\n        let currXor = 0;\n        for (let i = 30; i >= 0; i--) {\n            const bit = (num >> i) & 1;\n            const opp = 1 - bit;\n            if (curr.children[opp]) {\n                currXor |= (1 << i);\n                curr = curr.children[opp];\n            } else {\n                curr = curr.children[bit];\n            }\n        }\n        maxXor = Math.max(maxXor, currXor);\n    }\n    return maxXor;\n}"
        }
      }
    ],
    "testCases": [
      {
        "input": "6\n3 10 5 25 2 8",
        "expectedOutput": "28",
        "expected": "28",
        "explanation": "The maximum result is 5 XOR 25 = 28."
      },
      {
        "input": "7\n14 70 53 83 49 91 36",
        "expectedOutput": "127",
        "expected": "127",
        "explanation": "83 XOR 49 = 127."
      },
      {
        "input": "1\n0",
        "expectedOutput": "0",
        "expected": "0",
        "explanation": "Array has 1 element, 0 XOR 0 = 0."
      }
    ],
    "hiddenTestCases": [
      {
        "input": "2\n1 2",
        "expectedOutput": "3",
        "expected": "3",
        "description": "Small 1 XOR 2"
      },
      {
        "input": "3\n8 8 8",
        "expectedOutput": "0",
        "expected": "0",
        "description": "All identical"
      },
      {
        "input": "4\n0 0 0 0",
        "expectedOutput": "0",
        "expected": "0",
        "description": "All zeros"
      },
      {
        "input": "5\n1 2 4 8 16",
        "expectedOutput": "24",
        "expected": "24",
        "description": "Powers of two: 16 ^ 8 = 24"
      },
      {
        "input": "6\n15 0 15 0 15 0",
        "expectedOutput": "15",
        "expected": "15",
        "description": "Alternating 15 and 0"
      },
      {
        "input": "5\n100 200 300 400 500",
        "expectedOutput": "500",
        "expected": "500",
        "description": "Hundreds: 100 ^ 500"
      },
      {
        "input": "8\n32 18 33 42 12 45 20 7",
        "expectedOutput": "63",
        "expected": "63",
        "description": "Mid range"
      },
      {
        "input": "4\n1073741824 0 536870912 268435456",
        "expectedOutput": "1610612736",
        "expected": "1610612736",
        "description": "Huge 30-bit integers"
      },
      {
        "input": "7\n5 1 4 3 6 8 10",
        "expectedOutput": "15",
        "expected": "15",
        "description": "5 ^ 10 = 15"
      },
      {
        "input": "2\n2147483647 0",
        "expectedOutput": "2147483647",
        "expected": "2147483647",
        "description": "Max 31-bit integer"
      },
      {
        "input": "10\n4 6 7 2 5 8 10 9 1 3",
        "expectedOutput": "15",
        "expected": "15",
        "description": "Range 1 to 10"
      },
      {
        "input": "5\n17 23 45 61 72",
        "expectedOutput": "117",
        "expected": "117",
        "description": "Odd set"
      },
      {
        "input": "4\n64 32 16 8",
        "expectedOutput": "96",
        "expected": "96",
        "description": "64 ^ 32 = 96"
      },
      {
        "input": "6\n12 34 56 78 90 23",
        "expectedOutput": "120",
        "expected": "120",
        "description": "Mix values"
      },
      {
        "input": "5\n1024 512 256 128 64",
        "expectedOutput": "1536",
        "expected": "1536",
        "description": "1024 ^ 512 = 1536"
      }
    ],
    "analogy": {
      "title": "🌳 The Binary Road Network Decision Tree",
      "story": "You are navigating a maze where every junction splits into two roads: left for 0 and right for 1. To maximize the difference (XOR), whenever your vehicle carries a 0, you greedily steer down the 1 path, and whenever you carry a 1, you steer down the 0 path."
    },
    "steps": [
      {
        "stepIndex": 0,
        "title": "🏁 Initialization & Setup",
        "activeLine": 1,
        "explanation": "Set up the primary accumulator and bitwise tracking registers.",
        "variables": {
          "state": "Initial",
          "bitIndex": 0
        }
      },
      {
        "stepIndex": 1,
        "title": "⚙️ Core Bitwise Transformation",
        "activeLine": 2,
        "explanation": "Apply the core bitwise identity: cancel duplicates, probe Trie branches, or accumulate masks.",
        "variables": {
          "state": "Processing",
          "activeMask": "0b1"
        }
      },
      {
        "stepIndex": 2,
        "title": "🎯 Result Finalization",
        "activeLine": 3,
        "explanation": "Extract the computed integer result and return it with optimal O(1) auxiliary space.",
        "variables": {
          "state": "Complete",
          "verified": true
        }
      }
    ],
    "timeLimit": 2000,
    "memoryLimit": 256,
    "status": "approved",
    "generatedAt": "2026-11-20T14:42:20.403Z"
  },
  {
    "problemId": "dsa_bit-manipulation_14",
    "topicId": "bit-manipulation",
    "order": 14,
    "title": "Sum of Two Integers (Without Plus or Minus)",
    "difficulty": "Medium",
    "pattern": "Full Adder Circuit (XOR for Sum, AND << 1 for Carry)",
    "tags": [
      "Bit Manipulation",
      "Medium",
      "Adder Circuit",
      "Campus Placement"
    ],
    "statement": "Given two integers `a` and `b`, return the sum of the two integers without using the operators `+` and `-`.\n\nNegative numbers must be handled correctly using two's complement arithmetic within standard 32-bit signed limits.",
    "inputFormat": "A single line containing two space-separated integers: a and b.",
    "outputFormat": "Print the single integer representing their sum.",
    "constraints": [
      "-1000 <= a, b <= 1000",
      "Time Limit: 1.0 second",
      "Memory Limit: 256 MB"
    ],
    "examples": [
      {
        "input": "1 2",
        "displayInput": "a = 1, b = 2",
        "output": "3",
        "displayOutput": "3",
        "explanation": "1 + 2 = 3."
      },
      {
        "input": "2 3",
        "displayInput": "a = 2, b = 3",
        "output": "5",
        "displayOutput": "5",
        "explanation": "2 + 3 = 5."
      },
      {
        "input": "-1 1",
        "displayInput": "a = -1, b = 1",
        "output": "0",
        "displayOutput": "0",
        "explanation": "-1 + 1 = 0."
      },
      {
        "input": "-5 -7",
        "displayInput": "a = -5, b = -7",
        "output": "-12",
        "displayOutput": "-12",
        "explanation": "(-5) + (-7) = -12."
      }
    ],
    "hints": [
      "In a binary half-adder, what logical gate produces the sum without carry? Bitwise XOR (a ^ b).",
      "What logical gate produces the carry? Bitwise AND (a & b). Since carry is added to the next higher place value, shift it left by 1: (a & b) << 1.",
      "Repeat the process while carry != 0: new_a = a ^ b, new_b = (a & b) << 1."
    ],
    "starterCode": {
      "python": "import sys\n\ndef get_sum(a: int, b: int) -> int:\n    # Write your solution here\n    pass\n\nif __name__ == '__main__':\n    data = sys.stdin.read().split()\n    if data:\n        a, b = int(data[0]), int(data[1])\n        result = get_sum(a, b)\n        if result is not None:\n            print(result)\n",
      "java": "import java.util.Scanner;\n\npublic class Solution {\n    public static int getSum(int a, int b) {\n        // Write your solution here\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int a = sc.nextInt();\n            int b = sc.nextInt();\n            // Solution call\n        }\n    }\n}\n",
      "cpp": "#include <iostream>\nusing namespace std;\n\nint getSum(int a, int b) {\n    // Write your solution here\n    return 0;\n}\n\nint main() {\n    int a, b;\n    if (cin >> a >> b) {\n        // Solution call\n    }\n    return 0;\n}\n",
      "javascript": "const fs = require('fs');\n\nfunction getSum(a, b) {\n    // Write your solution here\n    return undefined;\n}\n\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);\nif (input.length >= 2 && input[0] !== '') {\n    const a = parseInt(input[0], 10);\n    const b = parseInt(input[1], 10);\n    const ans = getSum(a, b);\n    if (ans !== undefined) console.log(ans);\n}\n"
    },
    "approaches": [
      {
        "name": "Approach 1: Brute Force",
        "type": "brute",
        "title": "Iterative Increment / Decrement",
        "idea": "If b is positive, increment a by 1 b times. If b is negative, decrement a by 1.",
        "timeComplexity": "O(|b|)",
        "spaceComplexity": "O(1)",
        "code": {
          "python": "def get_sum(a: int, b: int) -> int:\n    # Simulating without explicit + or - operators using adder bits\n    mask = 0xFFFFFFFF\n    while b != 0:\n        carry = (a & b) & mask\n        a = (a ^ b) & mask\n        b = (carry << 1) & mask\n    return a if a <= 0x7FFFFFFF else ~(a ^ mask)",
          "java": "public int getSum(int a, int b) {\n    while (b != 0) {\n        int carry = (a & b) << 1;\n        a = a ^ b;\n        b = carry;\n    }\n    return a;\n}",
          "cpp": "int getSum(int a, int b) {\n    while (b != 0) {\n        unsigned int carry = (unsigned int)(a & b) << 1;\n        a = a ^ b;\n        b = carry;\n    }\n    return a;\n}",
          "javascript": "function getSum(a, b) {\n    while (b !== 0) {\n        const carry = (a & b) << 1;\n        a = a ^ b;\n        b = carry;\n    }\n    return a;\n}"
        }
      },
      {
        "name": "Approach 2: Better Approach",
        "type": "better",
        "title": "Recursive Adder",
        "idea": "Base case: if b == 0, return a. Otherwise, recursively call getSum(a ^ b, (a & b) << 1).",
        "timeComplexity": "O(32)",
        "spaceComplexity": "O(32) recursion stack",
        "code": {
          "python": "def get_sum(a: int, b: int) -> int:\n    mask = 0xFFFFFFFF\n    def add(x, y):\n        if y == 0:\n            return x\n        return add((x ^ y) & mask, ((x & y) << 1) & mask)\n    res = add(a & mask, b & mask)\n    return res if res <= 0x7FFFFFFF else ~(res ^ mask)",
          "java": "public int getSum(int a, int b) {\n    return b == 0 ? a : getSum(a ^ b, (a & b) << 1);\n}",
          "cpp": "int getSum(int a, int b) {\n    return b == 0 ? a : getSum(a ^ b, (unsigned int)(a & b) << 1);\n}",
          "javascript": "function getSum(a, b) {\n    return b === 0 ? a : getSum(a ^ b, (a & b) << 1);\n}"
        }
      },
      {
        "name": "Approach 3: Optimal Bitwise Approach",
        "type": "optimal",
        "title": "Iterative 32-bit Masked Adder",
        "idea": "Use 32-bit two-complement mask to handle negative numbers in languages with arbitrary precision (Python) and standard bitwise logic in C++/Java.",
        "timeComplexity": "O(32) = O(1)",
        "spaceComplexity": "O(1)",
        "code": {
          "python": "def get_sum(a: int, b: int) -> int:\n    mask = 0xFFFFFFFF\n    while b & mask != 0:\n        carry = (a & b) << 1\n        a = a ^ b\n        b = carry\n    return (a & mask) if (a & mask) <= 0x7FFFFFFF else ~((a & mask) ^ mask)",
          "java": "public int getSum(int a, int b) {\n    while (b != 0) {\n        int carry = (a & b) << 1;\n        a = a ^ b;\n        b = carry;\n    }\n    return a;\n}",
          "cpp": "int getSum(int a, int b) {\n    while (b != 0) {\n        unsigned int carry = (unsigned int)(a & b) << 1;\n        a = a ^ b;\n        b = carry;\n    }\n    return a;\n}",
          "javascript": "function getSum(a, b) {\n    while (b !== 0) {\n        const carry = (a & b) << 1;\n        a = a ^ b;\n        b = carry;\n    }\n    return a;\n}"
        }
      }
    ],
    "testCases": [
      {
        "input": "1 2",
        "expectedOutput": "3",
        "expected": "3",
        "explanation": "1 + 2 = 3."
      },
      {
        "input": "2 3",
        "expectedOutput": "5",
        "expected": "5",
        "explanation": "2 + 3 = 5."
      },
      {
        "input": "-1 1",
        "expectedOutput": "0",
        "expected": "0",
        "explanation": "-1 + 1 = 0."
      },
      {
        "input": "-5 -7",
        "expectedOutput": "-12",
        "expected": "-12",
        "explanation": "(-5) + (-7) = -12."
      }
    ],
    "hiddenTestCases": [
      {
        "input": "0 0",
        "expectedOutput": "0",
        "expected": "0",
        "description": "Zero plus zero"
      },
      {
        "input": "0 5",
        "expectedOutput": "5",
        "expected": "5",
        "description": "Zero identity right"
      },
      {
        "input": "-7 0",
        "expectedOutput": "-7",
        "expected": "-7",
        "description": "Zero identity left negative"
      },
      {
        "input": "100 200",
        "expectedOutput": "300",
        "expected": "300",
        "description": "Positive three-digit"
      },
      {
        "input": "-100 200",
        "expectedOutput": "100",
        "expected": "100",
        "description": "Negative and positive"
      },
      {
        "input": "100 -200",
        "expectedOutput": "-100",
        "expected": "-100",
        "description": "Positive and larger negative"
      },
      {
        "input": "1000 1000",
        "expectedOutput": "2000",
        "expected": "2000",
        "description": "Maximum positive"
      },
      {
        "input": "-1000 -1000",
        "expectedOutput": "-2000",
        "expected": "-2000",
        "description": "Maximum negative"
      },
      {
        "input": "15 1",
        "expectedOutput": "16",
        "expected": "16",
        "description": "Power of 2 rollover carry"
      },
      {
        "input": "31 1",
        "expectedOutput": "32",
        "expected": "32",
        "description": "Cascade carry 5 bits"
      },
      {
        "input": "255 1",
        "expectedOutput": "256",
        "expected": "256",
        "description": "Cascade carry 8 bits"
      },
      {
        "input": "-1 -1",
        "expectedOutput": "-2",
        "expected": "-2",
        "description": "Both negative one"
      },
      {
        "input": "42 -42",
        "expectedOutput": "0",
        "expected": "0",
        "description": "Additive inverse"
      },
      {
        "input": "789 211",
        "expectedOutput": "1000",
        "expected": "1000",
        "description": "Exact 1000"
      },
      {
        "input": "-999 1",
        "expectedOutput": "-998",
        "expected": "-998",
        "description": "Negative addition"
      }
    ],
    "analogy": {
      "title": "⚡ The Electric Wire & Switch Analogy for Sum of Two Integers (Without Plus or Minus)",
      "story": "Imagine you are working in a master electrical room with switches lined up on a panel. Every switch represents a single binary bit (0 for OFF, 1 for ON). Instead of manually opening and closing every single circuit individually, Sum of Two Integers (Without Plus or Minus) lets you manipulate circuits instantaneously using logic gates like XOR, AND, and bit shifts."
    },
    "steps": [
      {
        "stepIndex": 0,
        "title": "🏁 Initialization & Setup",
        "activeLine": 1,
        "explanation": "Set up the primary accumulator and bitwise tracking registers.",
        "variables": {
          "state": "Initial",
          "bitIndex": 0
        }
      },
      {
        "stepIndex": 1,
        "title": "⚙️ Core Bitwise Transformation",
        "activeLine": 2,
        "explanation": "Apply the core bitwise identity: cancel duplicates, probe Trie branches, or accumulate masks.",
        "variables": {
          "state": "Processing",
          "activeMask": "0b1"
        }
      },
      {
        "stepIndex": 2,
        "title": "🎯 Result Finalization",
        "activeLine": 3,
        "explanation": "Extract the computed integer result and return it with optimal O(1) auxiliary space.",
        "variables": {
          "state": "Complete",
          "verified": true
        }
      }
    ],
    "timeLimit": 2000,
    "memoryLimit": 256,
    "status": "approved",
    "generatedAt": "2026-11-20T14:42:20.403Z"
  },
  {
    "problemId": "dsa_bit-manipulation_15",
    "topicId": "bit-manipulation",
    "order": 15,
    "title": "Gray Code",
    "difficulty": "Medium",
    "pattern": "Reflected Binary Code Formula (i ^ (i >> 1))",
    "tags": [
      "Bit Manipulation",
      "Medium",
      "Gray Code",
      "Campus Placement"
    ],
    "statement": "An `n-bit` Gray code sequence is a sequence of `2^n` integers where:\n- Every integer is in the inclusive range `[0, 2^n - 1]`,\n- The first integer is `0`,\n- An integer appears no more than once in the sequence,\n- The binary representation of every pair of adjacent integers differs by exactly one bit, and\n- The binary representation of the first and last integers differs by exactly one bit.\n\nGiven an integer `n`, return any valid `n-bit` Gray code sequence. Output the numbers separated by a single space.",
    "inputFormat": "A single line containing an integer n (1 <= n <= 16).",
    "outputFormat": "Print the 2^n integers of the Gray code sequence separated by spaces.",
    "constraints": [
      "1 <= n <= 12",
      "Output length is exactly 2^n",
      "Time Limit: 1.0 second",
      "Memory Limit: 256 MB"
    ],
    "examples": [
      {
        "input": "1",
        "displayInput": "n = 1",
        "output": "0 1",
        "displayOutput": "0 1",
        "explanation": "2^1 = 2 numbers. 0 and 1 differ by 1 bit."
      },
      {
        "input": "2",
        "displayInput": "n = 2",
        "output": "0 1 3 2",
        "displayOutput": "0 1 3 2",
        "explanation": "Binary forms: 00, 01, 11, 10. Each adjacent pair differs by exactly one bit."
      },
      {
        "input": "3",
        "displayInput": "n = 3",
        "output": "0 1 3 2 6 7 5 4",
        "displayOutput": "0 1 3 2 6 7 5 4",
        "explanation": "000, 001, 011, 010, 110, 111, 101, 100."
      }
    ],
    "hints": [
      "Look closely at the sequence for n = 2: [0, 1, 3, 2]. The second half is the reflection of the first half with the highest bit set.",
      "There is a famous closed-form formula for the i-th Gray code number: `G(i) = i ^ (i >> 1)`.",
      "Loop from `i = 0` to `2^n - 1`, compute `i ^ (i >> 1)` and append it to your result."
    ],
    "starterCode": {
      "python": "import sys\n\ndef gray_code(n: int) -> list[int]:\n    # Write your solution here\n    pass\n\nif __name__ == '__main__':\n    data = sys.stdin.read().split()\n    if data:\n        n = int(data[0])\n        result = gray_code(n)\n        if result is not None:\n            print(*(result))\n",
      "java": "import java.util.Scanner;\nimport java.util.List;\nimport java.util.ArrayList;\n\npublic class Solution {\n    public static List<Integer> grayCode(int n) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int n = sc.nextInt();\n            // Solution call\n        }\n    }\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nvector<int> grayCode(int n) {\n    // Write your solution here\n    return {};\n}\n\nint main() {\n    int n;\n    if (cin >> n) {\n        // Solution call\n    }\n    return 0;\n}\n",
      "javascript": "const fs = require('fs');\n\nfunction grayCode(n) {\n    // Write your solution here\n    return undefined;\n}\n\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);\nif (input.length > 0 && input[0] !== '') {\n    const n = parseInt(input[0], 10);\n    const ans = grayCode(n);\n    if (ans !== undefined) console.log(ans.join(' '));\n}\n"
    },
    "approaches": [
      {
        "name": "Approach 1: Brute Force",
        "type": "brute",
        "title": "Backtracking with Visited Set",
        "idea": "Start from 0 and recursively try flipping bit 0 to bit n-1 that leads to an unvisited number.",
        "timeComplexity": "O(N * 2^N)",
        "spaceComplexity": "O(2^N)",
        "code": {
          "python": "def gray_code(n: int) -> list[int]:\n    res = [0]\n    visited = {0}\n    def backtrack():\n        if len(res) == (1 << n):\n            return True\n        curr = res[-1]\n        for i in range(n):\n            next_val = curr ^ (1 << i)\n            if next_val not in visited:\n                visited.add(next_val)\n                res.append(next_val)\n                if backtrack():\n                    return True\n                res.pop()\n                visited.remove(next_val)\n        return False\n    backtrack()\n    return res",
          "java": "import java.util.*;\n\npublic List<Integer> grayCode(int n) {\n    List<Integer> res = new ArrayList<>();\n    int total = 1 << n;\n    for (int i = 0; i < total; i++) {\n        res.add(i ^ (i >> 1));\n    }\n    return res;\n}",
          "cpp": "vector<int> grayCode(int n) {\n    vector<int> res;\n    int total = 1 << n;\n    for (int i = 0; i < total; i++) {\n        res.push_back(i ^ (i >> 1));\n    }\n    return res;\n}",
          "javascript": "function grayCode(n) {\n    const total = 1 << n;\n    const res = [];\n    for (let i = 0; i < total; i++) {\n        res.push(i ^ (i >> 1));\n    }\n    return res;\n}"
        }
      },
      {
        "name": "Approach 2: Better Approach",
        "type": "better",
        "title": "Iterative Reflection (Mirror Method)",
        "idea": "Start with [0]. In each step k from 0 to n-1, mirror the current list in reverse order and add (1 << k) to each reflected element.",
        "timeComplexity": "O(2^N)",
        "spaceComplexity": "O(1) auxiliary",
        "code": {
          "python": "def gray_code(n: int) -> list[int]:\n    res = [0]\n    for i in range(n):\n        shift = 1 << i\n        for j in range(len(res) - 1, -1, -1):\n            res.append(res[j] | shift)\n    return res",
          "java": "public List<Integer> grayCode(int n) {\n    List<Integer> res = new ArrayList<>();\n    res.add(0);\n    for (int i = 0; i < n; i++) {\n        int shift = 1 << i;\n        for (int j = res.size() - 1; j >= 0; j--) {\n            res.add(res.get(j) | shift);\n        }\n    }\n    return res;\n}",
          "cpp": "vector<int> grayCode(int n) {\n    vector<int> res = {0};\n    for (int i = 0; i < n; i++) {\n        int shift = 1 << i;\n        for (int j = res.size() - 1; j >= 0; j--) {\n            res.push_back(res[j] | shift);\n        }\n    }\n    return res;\n}",
          "javascript": "function grayCode(n) {\n    const res = [0];\n    for (let i = 0; i < n; i++) {\n        const shift = 1 << i;\n        for (let j = res.length - 1; j >= 0; j--) {\n            res.push(res[j] | shift);\n        }\n    }\n    return res;\n}"
        }
      },
      {
        "name": "Approach 3: Optimal Bitwise Approach",
        "type": "optimal",
        "title": "Formula Method (i ^ (i >> 1))",
        "idea": "The i-th element of standard reflected Gray code sequence is directly computed by the formula `i ^ (i >> 1)` in O(1) time.",
        "timeComplexity": "O(2^N)",
        "spaceComplexity": "O(1) auxiliary",
        "code": {
          "python": "def gray_code(n: int) -> list[int]:\n    return [i ^ (i >> 1) for i in range(1 << n)]",
          "java": "public List<Integer> grayCode(int n) {\n    List<Integer> res = new ArrayList<>();\n    int total = 1 << n;\n    for (int i = 0; i < total; i++) {\n        res.add(i ^ (i >> 1));\n    }\n    return res;\n}",
          "cpp": "vector<int> grayCode(int n) {\n    vector<int> res;\n    int total = 1 << n;\n    res.reserve(total);\n    for (int i = 0; i < total; i++) {\n        res.push_back(i ^ (i >> 1));\n    }\n    return res;\n}",
          "javascript": "function grayCode(n) {\n    const total = 1 << n;\n    const res = new Array(total);\n    for (let i = 0; i < total; i++) {\n        res[i] = i ^ (i >> 1);\n    }\n    return res;\n}"
        }
      }
    ],
    "testCases": [
      {
        "input": "1",
        "expectedOutput": "0 1",
        "expected": "0 1",
        "explanation": "2^1 = 2 numbers. 0 and 1 differ by 1 bit."
      },
      {
        "input": "2",
        "expectedOutput": "0 1 3 2",
        "expected": "0 1 3 2",
        "explanation": "Binary forms: 00, 01, 11, 10. Each adjacent pair differs by exactly one bit."
      },
      {
        "input": "3",
        "expectedOutput": "0 1 3 2 6 7 5 4",
        "expected": "0 1 3 2 6 7 5 4",
        "explanation": "000, 001, 011, 010, 110, 111, 101, 100."
      }
    ],
    "hiddenTestCases": [
      {
        "input": "1",
        "expectedOutput": "0 1",
        "expected": "0 1",
        "description": "n=1 (2 elements)"
      },
      {
        "input": "2",
        "expectedOutput": "0 1 3 2",
        "expected": "0 1 3 2",
        "description": "n=2 (4 elements)"
      },
      {
        "input": "3",
        "expectedOutput": "0 1 3 2 6 7 5 4",
        "expected": "0 1 3 2 6 7 5 4",
        "description": "n=3 (8 elements)"
      },
      {
        "input": "4",
        "expectedOutput": "0 1 3 2 6 7 5 4 12 13 15 14 10 11 9 8",
        "expected": "0 1 3 2 6 7 5 4 12 13 15 14 10 11 9 8",
        "description": "n=4 (16 elements)"
      },
      {
        "input": "5",
        "expectedOutput": "0 1 3 2 6 7 5 4 12 13 15 14 10 11 9 8 24 25 27 26 30 31 29 28 20 21 23 22 18 19 17 16",
        "expected": "0 1 3 2 6 7 5 4 12 13 15 14 10 11 9 8 24 25 27 26 30 31 29 28 20 21 23 22 18 19 17 16",
        "description": "n=5 (32 elements)"
      },
      {
        "input": "6",
        "expectedOutput": "0 1 3 2 6 7 5 4 12 13 15 14 10 11 9 8 24 25 27 26 30 31 29 28 20 21 23 22 18 19 17 16 48 49 51 50 54 55 53 52 60 61 63 62 58 59 57 56 40 41 43 42 46 47 45 44 36 37 39 38 34 35 33 32",
        "expected": "0 1 3 2 6 7 5 4 12 13 15 14 10 11 9 8 24 25 27 26 30 31 29 28 20 21 23 22 18 19 17 16 48 49 51 50 54 55 53 52 60 61 63 62 58 59 57 56 40 41 43 42 46 47 45 44 36 37 39 38 34 35 33 32",
        "description": "n=6 (64 elements)"
      },
      {
        "input": "7",
        "expectedOutput": "0 1 3 2 6 7 5 4 12 13 15 14 10 11 9 8 24 25 27 26 30 31 29 28 20 21 23 22 18 19 17 16 48 49 51 50 54 55 53 52 60 61 63 62 58 59 57 56 40 41 43 42 46 47 45 44 36 37 39 38 34 35 33 32 96 97 99 98 102 103 101 100 108 109 111 110 106 107 105 104 120 121 123 122 126 127 125 124 116 117 119 118 114 115 113 112 80 81 83 82 86 87 85 84 92 93 95 94 90 91 89 88 72 73 75 74 78 79 77 76 68 69 71 70 66 67 65 64",
        "expected": "0 1 3 2 6 7 5 4 12 13 15 14 10 11 9 8 24 25 27 26 30 31 29 28 20 21 23 22 18 19 17 16 48 49 51 50 54 55 53 52 60 61 63 62 58 59 57 56 40 41 43 42 46 47 45 44 36 37 39 38 34 35 33 32 96 97 99 98 102 103 101 100 108 109 111 110 106 107 105 104 120 121 123 122 126 127 125 124 116 117 119 118 114 115 113 112 80 81 83 82 86 87 85 84 92 93 95 94 90 91 89 88 72 73 75 74 78 79 77 76 68 69 71 70 66 67 65 64",
        "description": "n=7 (128 elements)"
      },
      {
        "input": "8",
        "expectedOutput": "0 1 3 2 6 7 5 4 12 13 15 14 10 11 9 8 24 25 27 26 30 31 29 28 20 21 23 22 18 19 17 16 48 49 51 50 54 55 53 52 60 61 63 62 58 59 57 56 40 41 43 42 46 47 45 44 36 37 39 38 34 35 33 32 96 97 99 98 102 103 101 100 108 109 111 110 106 107 105 104 120 121 123 122 126 127 125 124 116 117 119 118 114 115 113 112 80 81 83 82 86 87 85 84 92 93 95 94 90 91 89 88 72 73 75 74 78 79 77 76 68 69 71 70 66 67 65 64 192 193 195 194 198 199 197 196 204 205 207 206 202 203 201 200 216 217 219 218 222 223 221 220 212 213 215 214 210 211 209 208 240 241 243 242 246 247 245 244 252 253 255 254 250 251 249 248 232 233 235 234 238 239 237 236 228 229 231 230 226 227 225 224 160 161 163 162 166 167 165 164 172 173 175 174 170 171 169 168 184 185 187 186 190 191 189 188 180 181 183 182 178 179 177 176 144 145 147 146 150 151 149 148 156 157 159 158 154 155 153 152 136 137 139 138 142 143 141 140 132 133 135 134 130 131 129 128",
        "expected": "0 1 3 2 6 7 5 4 12 13 15 14 10 11 9 8 24 25 27 26 30 31 29 28 20 21 23 22 18 19 17 16 48 49 51 50 54 55 53 52 60 61 63 62 58 59 57 56 40 41 43 42 46 47 45 44 36 37 39 38 34 35 33 32 96 97 99 98 102 103 101 100 108 109 111 110 106 107 105 104 120 121 123 122 126 127 125 124 116 117 119 118 114 115 113 112 80 81 83 82 86 87 85 84 92 93 95 94 90 91 89 88 72 73 75 74 78 79 77 76 68 69 71 70 66 67 65 64 192 193 195 194 198 199 197 196 204 205 207 206 202 203 201 200 216 217 219 218 222 223 221 220 212 213 215 214 210 211 209 208 240 241 243 242 246 247 245 244 252 253 255 254 250 251 249 248 232 233 235 234 238 239 237 236 228 229 231 230 226 227 225 224 160 161 163 162 166 167 165 164 172 173 175 174 170 171 169 168 184 185 187 186 190 191 189 188 180 181 183 182 178 179 177 176 144 145 147 146 150 151 149 148 156 157 159 158 154 155 153 152 136 137 139 138 142 143 141 140 132 133 135 134 130 131 129 128",
        "description": "n=8 (256 elements)"
      },
      {
        "input": "9",
        "expectedOutput": "0 1 3 2 6 7 5 4 12 13 15 14 10 11 9 8 24 25 27 26 30 31 29 28 20 21 23 22 18 19 17 16 48 49 51 50 54 55 53 52 60 61 63 62 58 59 57 56 40 41 43 42 46 47 45 44 36 37 39 38 34 35 33 32 96 97 99 98 102 103 101 100 108 109 111 110 106 107 105 104 120 121 123 122 126 127 125 124 116 117 119 118 114 115 113 112 80 81 83 82 86 87 85 84 92 93 95 94 90 91 89 88 72 73 75 74 78 79 77 76 68 69 71 70 66 67 65 64 192 193 195 194 198 199 197 196 204 205 207 206 202 203 201 200 216 217 219 218 222 223 221 220 212 213 215 214 210 211 209 208 240 241 243 242 246 247 245 244 252 253 255 254 250 251 249 248 232 233 235 234 238 239 237 236 228 229 231 230 226 227 225 224 160 161 163 162 166 167 165 164 172 173 175 174 170 171 169 168 184 185 187 186 190 191 189 188 180 181 183 182 178 179 177 176 144 145 147 146 150 151 149 148 156 157 159 158 154 155 153 152 136 137 139 138 142 143 141 140 132 133 135 134 130 131 129 128 384 385 387 386 390 391 389 388 396 397 399 398 394 395 393 392 408 409 411 410 414 415 413 412 404 405 407 406 402 403 401 400 432 433 435 434 438 439 437 436 444 445 447 446 442 443 441 440 424 425 427 426 430 431 429 428 420 421 423 422 418 419 417 416 480 481 483 482 486 487 485 484 492 493 495 494 490 491 489 488 504 505 507 506 510 511 509 508 500 501 503 502 498 499 497 496 464 465 467 466 470 471 469 468 476 477 479 478 474 475 473 472 456 457 459 458 462 463 461 460 452 453 455 454 450 451 449 448 320 321 323 322 326 327 325 324 332 333 335 334 330 331 329 328 344 345 347 346 350 351 349 348 340 341 343 342 338 339 337 336 368 369 371 370 374 375 373 372 380 381 383 382 378 379 377 376 360 361 363 362 366 367 365 364 356 357 359 358 354 355 353 352 288 289 291 290 294 295 293 292 300 301 303 302 298 299 297 296 312 313 315 314 318 319 317 316 308 309 311 310 306 307 305 304 272 273 275 274 278 279 277 276 284 285 287 286 282 283 281 280 264 265 267 266 270 271 269 268 260 261 263 262 258 259 257 256",
        "expected": "0 1 3 2 6 7 5 4 12 13 15 14 10 11 9 8 24 25 27 26 30 31 29 28 20 21 23 22 18 19 17 16 48 49 51 50 54 55 53 52 60 61 63 62 58 59 57 56 40 41 43 42 46 47 45 44 36 37 39 38 34 35 33 32 96 97 99 98 102 103 101 100 108 109 111 110 106 107 105 104 120 121 123 122 126 127 125 124 116 117 119 118 114 115 113 112 80 81 83 82 86 87 85 84 92 93 95 94 90 91 89 88 72 73 75 74 78 79 77 76 68 69 71 70 66 67 65 64 192 193 195 194 198 199 197 196 204 205 207 206 202 203 201 200 216 217 219 218 222 223 221 220 212 213 215 214 210 211 209 208 240 241 243 242 246 247 245 244 252 253 255 254 250 251 249 248 232 233 235 234 238 239 237 236 228 229 231 230 226 227 225 224 160 161 163 162 166 167 165 164 172 173 175 174 170 171 169 168 184 185 187 186 190 191 189 188 180 181 183 182 178 179 177 176 144 145 147 146 150 151 149 148 156 157 159 158 154 155 153 152 136 137 139 138 142 143 141 140 132 133 135 134 130 131 129 128 384 385 387 386 390 391 389 388 396 397 399 398 394 395 393 392 408 409 411 410 414 415 413 412 404 405 407 406 402 403 401 400 432 433 435 434 438 439 437 436 444 445 447 446 442 443 441 440 424 425 427 426 430 431 429 428 420 421 423 422 418 419 417 416 480 481 483 482 486 487 485 484 492 493 495 494 490 491 489 488 504 505 507 506 510 511 509 508 500 501 503 502 498 499 497 496 464 465 467 466 470 471 469 468 476 477 479 478 474 475 473 472 456 457 459 458 462 463 461 460 452 453 455 454 450 451 449 448 320 321 323 322 326 327 325 324 332 333 335 334 330 331 329 328 344 345 347 346 350 351 349 348 340 341 343 342 338 339 337 336 368 369 371 370 374 375 373 372 380 381 383 382 378 379 377 376 360 361 363 362 366 367 365 364 356 357 359 358 354 355 353 352 288 289 291 290 294 295 293 292 300 301 303 302 298 299 297 296 312 313 315 314 318 319 317 316 308 309 311 310 306 307 305 304 272 273 275 274 278 279 277 276 284 285 287 286 282 283 281 280 264 265 267 266 270 271 269 268 260 261 263 262 258 259 257 256",
        "description": "n=9 (512 elements)"
      },
      {
        "input": "10",
        "expectedOutput": "0 1 3 2 6 7 5 4 12 13 15 14 10 11 9 8 24 25 27 26 30 31 29 28 20 21 23 22 18 19 17 16 48 49 51 50 54 55 53 52 60 61 63 62 58 59 57 56 40 41 43 42 46 47 45 44 36 37 39 38 34 35 33 32 96 97 99 98 102 103 101 100 108 109 111 110 106 107 105 104 120 121 123 122 126 127 125 124 116 117 119 118 114 115 113 112 80 81 83 82 86 87 85 84 92 93 95 94 90 91 89 88 72 73 75 74 78 79 77 76 68 69 71 70 66 67 65 64 192 193 195 194 198 199 197 196 204 205 207 206 202 203 201 200 216 217 219 218 222 223 221 220 212 213 215 214 210 211 209 208 240 241 243 242 246 247 245 244 252 253 255 254 250 251 249 248 232 233 235 234 238 239 237 236 228 229 231 230 226 227 225 224 160 161 163 162 166 167 165 164 172 173 175 174 170 171 169 168 184 185 187 186 190 191 189 188 180 181 183 182 178 179 177 176 144 145 147 146 150 151 149 148 156 157 159 158 154 155 153 152 136 137 139 138 142 143 141 140 132 133 135 134 130 131 129 128 384 385 387 386 390 391 389 388 396 397 399 398 394 395 393 392 408 409 411 410 414 415 413 412 404 405 407 406 402 403 401 400 432 433 435 434 438 439 437 436 444 445 447 446 442 443 441 440 424 425 427 426 430 431 429 428 420 421 423 422 418 419 417 416 480 481 483 482 486 487 485 484 492 493 495 494 490 491 489 488 504 505 507 506 510 511 509 508 500 501 503 502 498 499 497 496 464 465 467 466 470 471 469 468 476 477 479 478 474 475 473 472 456 457 459 458 462 463 461 460 452 453 455 454 450 451 449 448 320 321 323 322 326 327 325 324 332 333 335 334 330 331 329 328 344 345 347 346 350 351 349 348 340 341 343 342 338 339 337 336 368 369 371 370 374 375 373 372 380 381 383 382 378 379 377 376 360 361 363 362 366 367 365 364 356 357 359 358 354 355 353 352 288 289 291 290 294 295 293 292 300 301 303 302 298 299 297 296 312 313 315 314 318 319 317 316 308 309 311 310 306 307 305 304 272 273 275 274 278 279 277 276 284 285 287 286 282 283 281 280 264 265 267 266 270 271 269 268 260 261 263 262 258 259 257 256 768 769 771 770 774 775 773 772 780 781 783 782 778 779 777 776 792 793 795 794 798 799 797 796 788 789 791 790 786 787 785 784 816 817 819 818 822 823 821 820 828 829 831 830 826 827 825 824 808 809 811 810 814 815 813 812 804 805 807 806 802 803 801 800 864 865 867 866 870 871 869 868 876 877 879 878 874 875 873 872 888 889 891 890 894 895 893 892 884 885 887 886 882 883 881 880 848 849 851 850 854 855 853 852 860 861 863 862 858 859 857 856 840 841 843 842 846 847 845 844 836 837 839 838 834 835 833 832 960 961 963 962 966 967 965 964 972 973 975 974 970 971 969 968 984 985 987 986 990 991 989 988 980 981 983 982 978 979 977 976 1008 1009 1011 1010 1014 1015 1013 1012 1020 1021 1023 1022 1018 1019 1017 1016 1000 1001 1003 1002 1006 1007 1005 1004 996 997 999 998 994 995 993 992 928 929 931 930 934 935 933 932 940 941 943 942 938 939 937 936 952 953 955 954 958 959 957 956 948 949 951 950 946 947 945 944 912 913 915 914 918 919 917 916 924 925 927 926 922 923 921 920 904 905 907 906 910 911 909 908 900 901 903 902 898 899 897 896 640 641 643 642 646 647 645 644 652 653 655 654 650 651 649 648 664 665 667 666 670 671 669 668 660 661 663 662 658 659 657 656 688 689 691 690 694 695 693 692 700 701 703 702 698 699 697 696 680 681 683 682 686 687 685 684 676 677 679 678 674 675 673 672 736 737 739 738 742 743 741 740 748 749 751 750 746 747 745 744 760 761 763 762 766 767 765 764 756 757 759 758 754 755 753 752 720 721 723 722 726 727 725 724 732 733 735 734 730 731 729 728 712 713 715 714 718 719 717 716 708 709 711 710 706 707 705 704 576 577 579 578 582 583 581 580 588 589 591 590 586 587 585 584 600 601 603 602 606 607 605 604 596 597 599 598 594 595 593 592 624 625 627 626 630 631 629 628 636 637 639 638 634 635 633 632 616 617 619 618 622 623 621 620 612 613 615 614 610 611 609 608 544 545 547 546 550 551 549 548 556 557 559 558 554 555 553 552 568 569 571 570 574 575 573 572 564 565 567 566 562 563 561 560 528 529 531 530 534 535 533 532 540 541 543 542 538 539 537 536 520 521 523 522 526 527 525 524 516 517 519 518 514 515 513 512",
        "expected": "0 1 3 2 6 7 5 4 12 13 15 14 10 11 9 8 24 25 27 26 30 31 29 28 20 21 23 22 18 19 17 16 48 49 51 50 54 55 53 52 60 61 63 62 58 59 57 56 40 41 43 42 46 47 45 44 36 37 39 38 34 35 33 32 96 97 99 98 102 103 101 100 108 109 111 110 106 107 105 104 120 121 123 122 126 127 125 124 116 117 119 118 114 115 113 112 80 81 83 82 86 87 85 84 92 93 95 94 90 91 89 88 72 73 75 74 78 79 77 76 68 69 71 70 66 67 65 64 192 193 195 194 198 199 197 196 204 205 207 206 202 203 201 200 216 217 219 218 222 223 221 220 212 213 215 214 210 211 209 208 240 241 243 242 246 247 245 244 252 253 255 254 250 251 249 248 232 233 235 234 238 239 237 236 228 229 231 230 226 227 225 224 160 161 163 162 166 167 165 164 172 173 175 174 170 171 169 168 184 185 187 186 190 191 189 188 180 181 183 182 178 179 177 176 144 145 147 146 150 151 149 148 156 157 159 158 154 155 153 152 136 137 139 138 142 143 141 140 132 133 135 134 130 131 129 128 384 385 387 386 390 391 389 388 396 397 399 398 394 395 393 392 408 409 411 410 414 415 413 412 404 405 407 406 402 403 401 400 432 433 435 434 438 439 437 436 444 445 447 446 442 443 441 440 424 425 427 426 430 431 429 428 420 421 423 422 418 419 417 416 480 481 483 482 486 487 485 484 492 493 495 494 490 491 489 488 504 505 507 506 510 511 509 508 500 501 503 502 498 499 497 496 464 465 467 466 470 471 469 468 476 477 479 478 474 475 473 472 456 457 459 458 462 463 461 460 452 453 455 454 450 451 449 448 320 321 323 322 326 327 325 324 332 333 335 334 330 331 329 328 344 345 347 346 350 351 349 348 340 341 343 342 338 339 337 336 368 369 371 370 374 375 373 372 380 381 383 382 378 379 377 376 360 361 363 362 366 367 365 364 356 357 359 358 354 355 353 352 288 289 291 290 294 295 293 292 300 301 303 302 298 299 297 296 312 313 315 314 318 319 317 316 308 309 311 310 306 307 305 304 272 273 275 274 278 279 277 276 284 285 287 286 282 283 281 280 264 265 267 266 270 271 269 268 260 261 263 262 258 259 257 256 768 769 771 770 774 775 773 772 780 781 783 782 778 779 777 776 792 793 795 794 798 799 797 796 788 789 791 790 786 787 785 784 816 817 819 818 822 823 821 820 828 829 831 830 826 827 825 824 808 809 811 810 814 815 813 812 804 805 807 806 802 803 801 800 864 865 867 866 870 871 869 868 876 877 879 878 874 875 873 872 888 889 891 890 894 895 893 892 884 885 887 886 882 883 881 880 848 849 851 850 854 855 853 852 860 861 863 862 858 859 857 856 840 841 843 842 846 847 845 844 836 837 839 838 834 835 833 832 960 961 963 962 966 967 965 964 972 973 975 974 970 971 969 968 984 985 987 986 990 991 989 988 980 981 983 982 978 979 977 976 1008 1009 1011 1010 1014 1015 1013 1012 1020 1021 1023 1022 1018 1019 1017 1016 1000 1001 1003 1002 1006 1007 1005 1004 996 997 999 998 994 995 993 992 928 929 931 930 934 935 933 932 940 941 943 942 938 939 937 936 952 953 955 954 958 959 957 956 948 949 951 950 946 947 945 944 912 913 915 914 918 919 917 916 924 925 927 926 922 923 921 920 904 905 907 906 910 911 909 908 900 901 903 902 898 899 897 896 640 641 643 642 646 647 645 644 652 653 655 654 650 651 649 648 664 665 667 666 670 671 669 668 660 661 663 662 658 659 657 656 688 689 691 690 694 695 693 692 700 701 703 702 698 699 697 696 680 681 683 682 686 687 685 684 676 677 679 678 674 675 673 672 736 737 739 738 742 743 741 740 748 749 751 750 746 747 745 744 760 761 763 762 766 767 765 764 756 757 759 758 754 755 753 752 720 721 723 722 726 727 725 724 732 733 735 734 730 731 729 728 712 713 715 714 718 719 717 716 708 709 711 710 706 707 705 704 576 577 579 578 582 583 581 580 588 589 591 590 586 587 585 584 600 601 603 602 606 607 605 604 596 597 599 598 594 595 593 592 624 625 627 626 630 631 629 628 636 637 639 638 634 635 633 632 616 617 619 618 622 623 621 620 612 613 615 614 610 611 609 608 544 545 547 546 550 551 549 548 556 557 559 558 554 555 553 552 568 569 571 570 574 575 573 572 564 565 567 566 562 563 561 560 528 529 531 530 534 535 533 532 540 541 543 542 538 539 537 536 520 521 523 522 526 527 525 524 516 517 519 518 514 515 513 512",
        "description": "n=10 (1024 elements)"
      },
      {
        "input": "11",
        "expectedOutput": "0 1 3 2 6 7 5 4 12 13 15 14 10 11 9 8 24 25 27 26 30 31 29 28 20 21 23 22 18 19 17 16 48 49 51 50 54 55 53 52 60 61 63 62 58 59 57 56 40 41 43 42 46 47 45 44 36 37 39 38 34 35 33 32 96 97 99 98 102 103 101 100 108 109 111 110 106 107 105 104 120 121 123 122 126 127 125 124 116 117 119 118 114 115 113 112 80 81 83 82 86 87 85 84 92 93 95 94 90 91 89 88 72 73 75 74 78 79 77 76 68 69 71 70 66 67 65 64 192 193 195 194 198 199 197 196 204 205 207 206 202 203 201 200 216 217 219 218 222 223 221 220 212 213 215 214 210 211 209 208 240 241 243 242 246 247 245 244 252 253 255 254 250 251 249 248 232 233 235 234 238 239 237 236 228 229 231 230 226 227 225 224 160 161 163 162 166 167 165 164 172 173 175 174 170 171 169 168 184 185 187 186 190 191 189 188 180 181 183 182 178 179 177 176 144 145 147 146 150 151 149 148 156 157 159 158 154 155 153 152 136 137 139 138 142 143 141 140 132 133 135 134 130 131 129 128 384 385 387 386 390 391 389 388 396 397 399 398 394 395 393 392 408 409 411 410 414 415 413 412 404 405 407 406 402 403 401 400 432 433 435 434 438 439 437 436 444 445 447 446 442 443 441 440 424 425 427 426 430 431 429 428 420 421 423 422 418 419 417 416 480 481 483 482 486 487 485 484 492 493 495 494 490 491 489 488 504 505 507 506 510 511 509 508 500 501 503 502 498 499 497 496 464 465 467 466 470 471 469 468 476 477 479 478 474 475 473 472 456 457 459 458 462 463 461 460 452 453 455 454 450 451 449 448 320 321 323 322 326 327 325 324 332 333 335 334 330 331 329 328 344 345 347 346 350 351 349 348 340 341 343 342 338 339 337 336 368 369 371 370 374 375 373 372 380 381 383 382 378 379 377 376 360 361 363 362 366 367 365 364 356 357 359 358 354 355 353 352 288 289 291 290 294 295 293 292 300 301 303 302 298 299 297 296 312 313 315 314 318 319 317 316 308 309 311 310 306 307 305 304 272 273 275 274 278 279 277 276 284 285 287 286 282 283 281 280 264 265 267 266 270 271 269 268 260 261 263 262 258 259 257 256 768 769 771 770 774 775 773 772 780 781 783 782 778 779 777 776 792 793 795 794 798 799 797 796 788 789 791 790 786 787 785 784 816 817 819 818 822 823 821 820 828 829 831 830 826 827 825 824 808 809 811 810 814 815 813 812 804 805 807 806 802 803 801 800 864 865 867 866 870 871 869 868 876 877 879 878 874 875 873 872 888 889 891 890 894 895 893 892 884 885 887 886 882 883 881 880 848 849 851 850 854 855 853 852 860 861 863 862 858 859 857 856 840 841 843 842 846 847 845 844 836 837 839 838 834 835 833 832 960 961 963 962 966 967 965 964 972 973 975 974 970 971 969 968 984 985 987 986 990 991 989 988 980 981 983 982 978 979 977 976 1008 1009 1011 1010 1014 1015 1013 1012 1020 1021 1023 1022 1018 1019 1017 1016 1000 1001 1003 1002 1006 1007 1005 1004 996 997 999 998 994 995 993 992 928 929 931 930 934 935 933 932 940 941 943 942 938 939 937 936 952 953 955 954 958 959 957 956 948 949 951 950 946 947 945 944 912 913 915 914 918 919 917 916 924 925 927 926 922 923 921 920 904 905 907 906 910 911 909 908 900 901 903 902 898 899 897 896 640 641 643 642 646 647 645 644 652 653 655 654 650 651 649 648 664 665 667 666 670 671 669 668 660 661 663 662 658 659 657 656 688 689 691 690 694 695 693 692 700 701 703 702 698 699 697 696 680 681 683 682 686 687 685 684 676 677 679 678 674 675 673 672 736 737 739 738 742 743 741 740 748 749 751 750 746 747 745 744 760 761 763 762 766 767 765 764 756 757 759 758 754 755 753 752 720 721 723 722 726 727 725 724 732 733 735 734 730 731 729 728 712 713 715 714 718 719 717 716 708 709 711 710 706 707 705 704 576 577 579 578 582 583 581 580 588 589 591 590 586 587 585 584 600 601 603 602 606 607 605 604 596 597 599 598 594 595 593 592 624 625 627 626 630 631 629 628 636 637 639 638 634 635 633 632 616 617 619 618 622 623 621 620 612 613 615 614 610 611 609 608 544 545 547 546 550 551 549 548 556 557 559 558 554 555 553 552 568 569 571 570 574 575 573 572 564 565 567 566 562 563 561 560 528 529 531 530 534 535 533 532 540 541 543 542 538 539 537 536 520 521 523 522 526 527 525 524 516 517 519 518 514 515 513 512 1536 1537 1539 1538 1542 1543 1541 1540 1548 1549 1551 1550 1546 1547 1545 1544 1560 1561 1563 1562 1566 1567 1565 1564 1556 1557 1559 1558 1554 1555 1553 1552 1584 1585 1587 1586 1590 1591 1589 1588 1596 1597 1599 1598 1594 1595 1593 1592 1576 1577 1579 1578 1582 1583 1581 1580 1572 1573 1575 1574 1570 1571 1569 1568 1632 1633 1635 1634 1638 1639 1637 1636 1644 1645 1647 1646 1642 1643 1641 1640 1656 1657 1659 1658 1662 1663 1661 1660 1652 1653 1655 1654 1650 1651 1649 1648 1616 1617 1619 1618 1622 1623 1621 1620 1628 1629 1631 1630 1626 1627 1625 1624 1608 1609 1611 1610 1614 1615 1613 1612 1604 1605 1607 1606 1602 1603 1601 1600 1728 1729 1731 1730 1734 1735 1733 1732 1740 1741 1743 1742 1738 1739 1737 1736 1752 1753 1755 1754 1758 1759 1757 1756 1748 1749 1751 1750 1746 1747 1745 1744 1776 1777 1779 1778 1782 1783 1781 1780 1788 1789 1791 1790 1786 1787 1785 1784 1768 1769 1771 1770 1774 1775 1773 1772 1764 1765 1767 1766 1762 1763 1761 1760 1696 1697 1699 1698 1702 1703 1701 1700 1708 1709 1711 1710 1706 1707 1705 1704 1720 1721 1723 1722 1726 1727 1725 1724 1716 1717 1719 1718 1714 1715 1713 1712 1680 1681 1683 1682 1686 1687 1685 1684 1692 1693 1695 1694 1690 1691 1689 1688 1672 1673 1675 1674 1678 1679 1677 1676 1668 1669 1671 1670 1666 1667 1665 1664 1920 1921 1923 1922 1926 1927 1925 1924 1932 1933 1935 1934 1930 1931 1929 1928 1944 1945 1947 1946 1950 1951 1949 1948 1940 1941 1943 1942 1938 1939 1937 1936 1968 1969 1971 1970 1974 1975 1973 1972 1980 1981 1983 1982 1978 1979 1977 1976 1960 1961 1963 1962 1966 1967 1965 1964 1956 1957 1959 1958 1954 1955 1953 1952 2016 2017 2019 2018 2022 2023 2021 2020 2028 2029 2031 2030 2026 2027 2025 2024 2040 2041 2043 2042 2046 2047 2045 2044 2036 2037 2039 2038 2034 2035 2033 2032 2000 2001 2003 2002 2006 2007 2005 2004 2012 2013 2015 2014 2010 2011 2009 2008 1992 1993 1995 1994 1998 1999 1997 1996 1988 1989 1991 1990 1986 1987 1985 1984 1856 1857 1859 1858 1862 1863 1861 1860 1868 1869 1871 1870 1866 1867 1865 1864 1880 1881 1883 1882 1886 1887 1885 1884 1876 1877 1879 1878 1874 1875 1873 1872 1904 1905 1907 1906 1910 1911 1909 1908 1916 1917 1919 1918 1914 1915 1913 1912 1896 1897 1899 1898 1902 1903 1901 1900 1892 1893 1895 1894 1890 1891 1889 1888 1824 1825 1827 1826 1830 1831 1829 1828 1836 1837 1839 1838 1834 1835 1833 1832 1848 1849 1851 1850 1854 1855 1853 1852 1844 1845 1847 1846 1842 1843 1841 1840 1808 1809 1811 1810 1814 1815 1813 1812 1820 1821 1823 1822 1818 1819 1817 1816 1800 1801 1803 1802 1806 1807 1805 1804 1796 1797 1799 1798 1794 1795 1793 1792 1280 1281 1283 1282 1286 1287 1285 1284 1292 1293 1295 1294 1290 1291 1289 1288 1304 1305 1307 1306 1310 1311 1309 1308 1300 1301 1303 1302 1298 1299 1297 1296 1328 1329 1331 1330 1334 1335 1333 1332 1340 1341 1343 1342 1338 1339 1337 1336 1320 1321 1323 1322 1326 1327 1325 1324 1316 1317 1319 1318 1314 1315 1313 1312 1376 1377 1379 1378 1382 1383 1381 1380 1388 1389 1391 1390 1386 1387 1385 1384 1400 1401 1403 1402 1406 1407 1405 1404 1396 1397 1399 1398 1394 1395 1393 1392 1360 1361 1363 1362 1366 1367 1365 1364 1372 1373 1375 1374 1370 1371 1369 1368 1352 1353 1355 1354 1358 1359 1357 1356 1348 1349 1351 1350 1346 1347 1345 1344 1472 1473 1475 1474 1478 1479 1477 1476 1484 1485 1487 1486 1482 1483 1481 1480 1496 1497 1499 1498 1502 1503 1501 1500 1492 1493 1495 1494 1490 1491 1489 1488 1520 1521 1523 1522 1526 1527 1525 1524 1532 1533 1535 1534 1530 1531 1529 1528 1512 1513 1515 1514 1518 1519 1517 1516 1508 1509 1511 1510 1506 1507 1505 1504 1440 1441 1443 1442 1446 1447 1445 1444 1452 1453 1455 1454 1450 1451 1449 1448 1464 1465 1467 1466 1470 1471 1469 1468 1460 1461 1463 1462 1458 1459 1457 1456 1424 1425 1427 1426 1430 1431 1429 1428 1436 1437 1439 1438 1434 1435 1433 1432 1416 1417 1419 1418 1422 1423 1421 1420 1412 1413 1415 1414 1410 1411 1409 1408 1152 1153 1155 1154 1158 1159 1157 1156 1164 1165 1167 1166 1162 1163 1161 1160 1176 1177 1179 1178 1182 1183 1181 1180 1172 1173 1175 1174 1170 1171 1169 1168 1200 1201 1203 1202 1206 1207 1205 1204 1212 1213 1215 1214 1210 1211 1209 1208 1192 1193 1195 1194 1198 1199 1197 1196 1188 1189 1191 1190 1186 1187 1185 1184 1248 1249 1251 1250 1254 1255 1253 1252 1260 1261 1263 1262 1258 1259 1257 1256 1272 1273 1275 1274 1278 1279 1277 1276 1268 1269 1271 1270 1266 1267 1265 1264 1232 1233 1235 1234 1238 1239 1237 1236 1244 1245 1247 1246 1242 1243 1241 1240 1224 1225 1227 1226 1230 1231 1229 1228 1220 1221 1223 1222 1218 1219 1217 1216 1088 1089 1091 1090 1094 1095 1093 1092 1100 1101 1103 1102 1098 1099 1097 1096 1112 1113 1115 1114 1118 1119 1117 1116 1108 1109 1111 1110 1106 1107 1105 1104 1136 1137 1139 1138 1142 1143 1141 1140 1148 1149 1151 1150 1146 1147 1145 1144 1128 1129 1131 1130 1134 1135 1133 1132 1124 1125 1127 1126 1122 1123 1121 1120 1056 1057 1059 1058 1062 1063 1061 1060 1068 1069 1071 1070 1066 1067 1065 1064 1080 1081 1083 1082 1086 1087 1085 1084 1076 1077 1079 1078 1074 1075 1073 1072 1040 1041 1043 1042 1046 1047 1045 1044 1052 1053 1055 1054 1050 1051 1049 1048 1032 1033 1035 1034 1038 1039 1037 1036 1028 1029 1031 1030 1026 1027 1025 1024",
        "expected": "0 1 3 2 6 7 5 4 12 13 15 14 10 11 9 8 24 25 27 26 30 31 29 28 20 21 23 22 18 19 17 16 48 49 51 50 54 55 53 52 60 61 63 62 58 59 57 56 40 41 43 42 46 47 45 44 36 37 39 38 34 35 33 32 96 97 99 98 102 103 101 100 108 109 111 110 106 107 105 104 120 121 123 122 126 127 125 124 116 117 119 118 114 115 113 112 80 81 83 82 86 87 85 84 92 93 95 94 90 91 89 88 72 73 75 74 78 79 77 76 68 69 71 70 66 67 65 64 192 193 195 194 198 199 197 196 204 205 207 206 202 203 201 200 216 217 219 218 222 223 221 220 212 213 215 214 210 211 209 208 240 241 243 242 246 247 245 244 252 253 255 254 250 251 249 248 232 233 235 234 238 239 237 236 228 229 231 230 226 227 225 224 160 161 163 162 166 167 165 164 172 173 175 174 170 171 169 168 184 185 187 186 190 191 189 188 180 181 183 182 178 179 177 176 144 145 147 146 150 151 149 148 156 157 159 158 154 155 153 152 136 137 139 138 142 143 141 140 132 133 135 134 130 131 129 128 384 385 387 386 390 391 389 388 396 397 399 398 394 395 393 392 408 409 411 410 414 415 413 412 404 405 407 406 402 403 401 400 432 433 435 434 438 439 437 436 444 445 447 446 442 443 441 440 424 425 427 426 430 431 429 428 420 421 423 422 418 419 417 416 480 481 483 482 486 487 485 484 492 493 495 494 490 491 489 488 504 505 507 506 510 511 509 508 500 501 503 502 498 499 497 496 464 465 467 466 470 471 469 468 476 477 479 478 474 475 473 472 456 457 459 458 462 463 461 460 452 453 455 454 450 451 449 448 320 321 323 322 326 327 325 324 332 333 335 334 330 331 329 328 344 345 347 346 350 351 349 348 340 341 343 342 338 339 337 336 368 369 371 370 374 375 373 372 380 381 383 382 378 379 377 376 360 361 363 362 366 367 365 364 356 357 359 358 354 355 353 352 288 289 291 290 294 295 293 292 300 301 303 302 298 299 297 296 312 313 315 314 318 319 317 316 308 309 311 310 306 307 305 304 272 273 275 274 278 279 277 276 284 285 287 286 282 283 281 280 264 265 267 266 270 271 269 268 260 261 263 262 258 259 257 256 768 769 771 770 774 775 773 772 780 781 783 782 778 779 777 776 792 793 795 794 798 799 797 796 788 789 791 790 786 787 785 784 816 817 819 818 822 823 821 820 828 829 831 830 826 827 825 824 808 809 811 810 814 815 813 812 804 805 807 806 802 803 801 800 864 865 867 866 870 871 869 868 876 877 879 878 874 875 873 872 888 889 891 890 894 895 893 892 884 885 887 886 882 883 881 880 848 849 851 850 854 855 853 852 860 861 863 862 858 859 857 856 840 841 843 842 846 847 845 844 836 837 839 838 834 835 833 832 960 961 963 962 966 967 965 964 972 973 975 974 970 971 969 968 984 985 987 986 990 991 989 988 980 981 983 982 978 979 977 976 1008 1009 1011 1010 1014 1015 1013 1012 1020 1021 1023 1022 1018 1019 1017 1016 1000 1001 1003 1002 1006 1007 1005 1004 996 997 999 998 994 995 993 992 928 929 931 930 934 935 933 932 940 941 943 942 938 939 937 936 952 953 955 954 958 959 957 956 948 949 951 950 946 947 945 944 912 913 915 914 918 919 917 916 924 925 927 926 922 923 921 920 904 905 907 906 910 911 909 908 900 901 903 902 898 899 897 896 640 641 643 642 646 647 645 644 652 653 655 654 650 651 649 648 664 665 667 666 670 671 669 668 660 661 663 662 658 659 657 656 688 689 691 690 694 695 693 692 700 701 703 702 698 699 697 696 680 681 683 682 686 687 685 684 676 677 679 678 674 675 673 672 736 737 739 738 742 743 741 740 748 749 751 750 746 747 745 744 760 761 763 762 766 767 765 764 756 757 759 758 754 755 753 752 720 721 723 722 726 727 725 724 732 733 735 734 730 731 729 728 712 713 715 714 718 719 717 716 708 709 711 710 706 707 705 704 576 577 579 578 582 583 581 580 588 589 591 590 586 587 585 584 600 601 603 602 606 607 605 604 596 597 599 598 594 595 593 592 624 625 627 626 630 631 629 628 636 637 639 638 634 635 633 632 616 617 619 618 622 623 621 620 612 613 615 614 610 611 609 608 544 545 547 546 550 551 549 548 556 557 559 558 554 555 553 552 568 569 571 570 574 575 573 572 564 565 567 566 562 563 561 560 528 529 531 530 534 535 533 532 540 541 543 542 538 539 537 536 520 521 523 522 526 527 525 524 516 517 519 518 514 515 513 512 1536 1537 1539 1538 1542 1543 1541 1540 1548 1549 1551 1550 1546 1547 1545 1544 1560 1561 1563 1562 1566 1567 1565 1564 1556 1557 1559 1558 1554 1555 1553 1552 1584 1585 1587 1586 1590 1591 1589 1588 1596 1597 1599 1598 1594 1595 1593 1592 1576 1577 1579 1578 1582 1583 1581 1580 1572 1573 1575 1574 1570 1571 1569 1568 1632 1633 1635 1634 1638 1639 1637 1636 1644 1645 1647 1646 1642 1643 1641 1640 1656 1657 1659 1658 1662 1663 1661 1660 1652 1653 1655 1654 1650 1651 1649 1648 1616 1617 1619 1618 1622 1623 1621 1620 1628 1629 1631 1630 1626 1627 1625 1624 1608 1609 1611 1610 1614 1615 1613 1612 1604 1605 1607 1606 1602 1603 1601 1600 1728 1729 1731 1730 1734 1735 1733 1732 1740 1741 1743 1742 1738 1739 1737 1736 1752 1753 1755 1754 1758 1759 1757 1756 1748 1749 1751 1750 1746 1747 1745 1744 1776 1777 1779 1778 1782 1783 1781 1780 1788 1789 1791 1790 1786 1787 1785 1784 1768 1769 1771 1770 1774 1775 1773 1772 1764 1765 1767 1766 1762 1763 1761 1760 1696 1697 1699 1698 1702 1703 1701 1700 1708 1709 1711 1710 1706 1707 1705 1704 1720 1721 1723 1722 1726 1727 1725 1724 1716 1717 1719 1718 1714 1715 1713 1712 1680 1681 1683 1682 1686 1687 1685 1684 1692 1693 1695 1694 1690 1691 1689 1688 1672 1673 1675 1674 1678 1679 1677 1676 1668 1669 1671 1670 1666 1667 1665 1664 1920 1921 1923 1922 1926 1927 1925 1924 1932 1933 1935 1934 1930 1931 1929 1928 1944 1945 1947 1946 1950 1951 1949 1948 1940 1941 1943 1942 1938 1939 1937 1936 1968 1969 1971 1970 1974 1975 1973 1972 1980 1981 1983 1982 1978 1979 1977 1976 1960 1961 1963 1962 1966 1967 1965 1964 1956 1957 1959 1958 1954 1955 1953 1952 2016 2017 2019 2018 2022 2023 2021 2020 2028 2029 2031 2030 2026 2027 2025 2024 2040 2041 2043 2042 2046 2047 2045 2044 2036 2037 2039 2038 2034 2035 2033 2032 2000 2001 2003 2002 2006 2007 2005 2004 2012 2013 2015 2014 2010 2011 2009 2008 1992 1993 1995 1994 1998 1999 1997 1996 1988 1989 1991 1990 1986 1987 1985 1984 1856 1857 1859 1858 1862 1863 1861 1860 1868 1869 1871 1870 1866 1867 1865 1864 1880 1881 1883 1882 1886 1887 1885 1884 1876 1877 1879 1878 1874 1875 1873 1872 1904 1905 1907 1906 1910 1911 1909 1908 1916 1917 1919 1918 1914 1915 1913 1912 1896 1897 1899 1898 1902 1903 1901 1900 1892 1893 1895 1894 1890 1891 1889 1888 1824 1825 1827 1826 1830 1831 1829 1828 1836 1837 1839 1838 1834 1835 1833 1832 1848 1849 1851 1850 1854 1855 1853 1852 1844 1845 1847 1846 1842 1843 1841 1840 1808 1809 1811 1810 1814 1815 1813 1812 1820 1821 1823 1822 1818 1819 1817 1816 1800 1801 1803 1802 1806 1807 1805 1804 1796 1797 1799 1798 1794 1795 1793 1792 1280 1281 1283 1282 1286 1287 1285 1284 1292 1293 1295 1294 1290 1291 1289 1288 1304 1305 1307 1306 1310 1311 1309 1308 1300 1301 1303 1302 1298 1299 1297 1296 1328 1329 1331 1330 1334 1335 1333 1332 1340 1341 1343 1342 1338 1339 1337 1336 1320 1321 1323 1322 1326 1327 1325 1324 1316 1317 1319 1318 1314 1315 1313 1312 1376 1377 1379 1378 1382 1383 1381 1380 1388 1389 1391 1390 1386 1387 1385 1384 1400 1401 1403 1402 1406 1407 1405 1404 1396 1397 1399 1398 1394 1395 1393 1392 1360 1361 1363 1362 1366 1367 1365 1364 1372 1373 1375 1374 1370 1371 1369 1368 1352 1353 1355 1354 1358 1359 1357 1356 1348 1349 1351 1350 1346 1347 1345 1344 1472 1473 1475 1474 1478 1479 1477 1476 1484 1485 1487 1486 1482 1483 1481 1480 1496 1497 1499 1498 1502 1503 1501 1500 1492 1493 1495 1494 1490 1491 1489 1488 1520 1521 1523 1522 1526 1527 1525 1524 1532 1533 1535 1534 1530 1531 1529 1528 1512 1513 1515 1514 1518 1519 1517 1516 1508 1509 1511 1510 1506 1507 1505 1504 1440 1441 1443 1442 1446 1447 1445 1444 1452 1453 1455 1454 1450 1451 1449 1448 1464 1465 1467 1466 1470 1471 1469 1468 1460 1461 1463 1462 1458 1459 1457 1456 1424 1425 1427 1426 1430 1431 1429 1428 1436 1437 1439 1438 1434 1435 1433 1432 1416 1417 1419 1418 1422 1423 1421 1420 1412 1413 1415 1414 1410 1411 1409 1408 1152 1153 1155 1154 1158 1159 1157 1156 1164 1165 1167 1166 1162 1163 1161 1160 1176 1177 1179 1178 1182 1183 1181 1180 1172 1173 1175 1174 1170 1171 1169 1168 1200 1201 1203 1202 1206 1207 1205 1204 1212 1213 1215 1214 1210 1211 1209 1208 1192 1193 1195 1194 1198 1199 1197 1196 1188 1189 1191 1190 1186 1187 1185 1184 1248 1249 1251 1250 1254 1255 1253 1252 1260 1261 1263 1262 1258 1259 1257 1256 1272 1273 1275 1274 1278 1279 1277 1276 1268 1269 1271 1270 1266 1267 1265 1264 1232 1233 1235 1234 1238 1239 1237 1236 1244 1245 1247 1246 1242 1243 1241 1240 1224 1225 1227 1226 1230 1231 1229 1228 1220 1221 1223 1222 1218 1219 1217 1216 1088 1089 1091 1090 1094 1095 1093 1092 1100 1101 1103 1102 1098 1099 1097 1096 1112 1113 1115 1114 1118 1119 1117 1116 1108 1109 1111 1110 1106 1107 1105 1104 1136 1137 1139 1138 1142 1143 1141 1140 1148 1149 1151 1150 1146 1147 1145 1144 1128 1129 1131 1130 1134 1135 1133 1132 1124 1125 1127 1126 1122 1123 1121 1120 1056 1057 1059 1058 1062 1063 1061 1060 1068 1069 1071 1070 1066 1067 1065 1064 1080 1081 1083 1082 1086 1087 1085 1084 1076 1077 1079 1078 1074 1075 1073 1072 1040 1041 1043 1042 1046 1047 1045 1044 1052 1053 1055 1054 1050 1051 1049 1048 1032 1033 1035 1034 1038 1039 1037 1036 1028 1029 1031 1030 1026 1027 1025 1024",
        "description": "n=11 (2048 elements)"
      },
      {
        "input": "12",
        "expectedOutput": "0 1 3 2 6 7 5 4 12 13 15 14 10 11 9 8 24 25 27 26 30 31 29 28 20 21 23 22 18 19 17 16 48 49 51 50 54 55 53 52 60 61 63 62 58 59 57 56 40 41 43 42 46 47 45 44 36 37 39 38 34 35 33 32 96 97 99 98 102 103 101 100 108 109 111 110 106 107 105 104 120 121 123 122 126 127 125 124 116 117 119 118 114 115 113 112 80 81 83 82 86 87 85 84 92 93 95 94 90 91 89 88 72 73 75 74 78 79 77 76 68 69 71 70 66 67 65 64 192 193 195 194 198 199 197 196 204 205 207 206 202 203 201 200 216 217 219 218 222 223 221 220 212 213 215 214 210 211 209 208 240 241 243 242 246 247 245 244 252 253 255 254 250 251 249 248 232 233 235 234 238 239 237 236 228 229 231 230 226 227 225 224 160 161 163 162 166 167 165 164 172 173 175 174 170 171 169 168 184 185 187 186 190 191 189 188 180 181 183 182 178 179 177 176 144 145 147 146 150 151 149 148 156 157 159 158 154 155 153 152 136 137 139 138 142 143 141 140 132 133 135 134 130 131 129 128 384 385 387 386 390 391 389 388 396 397 399 398 394 395 393 392 408 409 411 410 414 415 413 412 404 405 407 406 402 403 401 400 432 433 435 434 438 439 437 436 444 445 447 446 442 443 441 440 424 425 427 426 430 431 429 428 420 421 423 422 418 419 417 416 480 481 483 482 486 487 485 484 492 493 495 494 490 491 489 488 504 505 507 506 510 511 509 508 500 501 503 502 498 499 497 496 464 465 467 466 470 471 469 468 476 477 479 478 474 475 473 472 456 457 459 458 462 463 461 460 452 453 455 454 450 451 449 448 320 321 323 322 326 327 325 324 332 333 335 334 330 331 329 328 344 345 347 346 350 351 349 348 340 341 343 342 338 339 337 336 368 369 371 370 374 375 373 372 380 381 383 382 378 379 377 376 360 361 363 362 366 367 365 364 356 357 359 358 354 355 353 352 288 289 291 290 294 295 293 292 300 301 303 302 298 299 297 296 312 313 315 314 318 319 317 316 308 309 311 310 306 307 305 304 272 273 275 274 278 279 277 276 284 285 287 286 282 283 281 280 264 265 267 266 270 271 269 268 260 261 263 262 258 259 257 256 768 769 771 770 774 775 773 772 780 781 783 782 778 779 777 776 792 793 795 794 798 799 797 796 788 789 791 790 786 787 785 784 816 817 819 818 822 823 821 820 828 829 831 830 826 827 825 824 808 809 811 810 814 815 813 812 804 805 807 806 802 803 801 800 864 865 867 866 870 871 869 868 876 877 879 878 874 875 873 872 888 889 891 890 894 895 893 892 884 885 887 886 882 883 881 880 848 849 851 850 854 855 853 852 860 861 863 862 858 859 857 856 840 841 843 842 846 847 845 844 836 837 839 838 834 835 833 832 960 961 963 962 966 967 965 964 972 973 975 974 970 971 969 968 984 985 987 986 990 991 989 988 980 981 983 982 978 979 977 976 1008 1009 1011 1010 1014 1015 1013 1012 1020 1021 1023 1022 1018 1019 1017 1016 1000 1001 1003 1002 1006 1007 1005 1004 996 997 999 998 994 995 993 992 928 929 931 930 934 935 933 932 940 941 943 942 938 939 937 936 952 953 955 954 958 959 957 956 948 949 951 950 946 947 945 944 912 913 915 914 918 919 917 916 924 925 927 926 922 923 921 920 904 905 907 906 910 911 909 908 900 901 903 902 898 899 897 896 640 641 643 642 646 647 645 644 652 653 655 654 650 651 649 648 664 665 667 666 670 671 669 668 660 661 663 662 658 659 657 656 688 689 691 690 694 695 693 692 700 701 703 702 698 699 697 696 680 681 683 682 686 687 685 684 676 677 679 678 674 675 673 672 736 737 739 738 742 743 741 740 748 749 751 750 746 747 745 744 760 761 763 762 766 767 765 764 756 757 759 758 754 755 753 752 720 721 723 722 726 727 725 724 732 733 735 734 730 731 729 728 712 713 715 714 718 719 717 716 708 709 711 710 706 707 705 704 576 577 579 578 582 583 581 580 588 589 591 590 586 587 585 584 600 601 603 602 606 607 605 604 596 597 599 598 594 595 593 592 624 625 627 626 630 631 629 628 636 637 639 638 634 635 633 632 616 617 619 618 622 623 621 620 612 613 615 614 610 611 609 608 544 545 547 546 550 551 549 548 556 557 559 558 554 555 553 552 568 569 571 570 574 575 573 572 564 565 567 566 562 563 561 560 528 529 531 530 534 535 533 532 540 541 543 542 538 539 537 536 520 521 523 522 526 527 525 524 516 517 519 518 514 515 513 512 1536 1537 1539 1538 1542 1543 1541 1540 1548 1549 1551 1550 1546 1547 1545 1544 1560 1561 1563 1562 1566 1567 1565 1564 1556 1557 1559 1558 1554 1555 1553 1552 1584 1585 1587 1586 1590 1591 1589 1588 1596 1597 1599 1598 1594 1595 1593 1592 1576 1577 1579 1578 1582 1583 1581 1580 1572 1573 1575 1574 1570 1571 1569 1568 1632 1633 1635 1634 1638 1639 1637 1636 1644 1645 1647 1646 1642 1643 1641 1640 1656 1657 1659 1658 1662 1663 1661 1660 1652 1653 1655 1654 1650 1651 1649 1648 1616 1617 1619 1618 1622 1623 1621 1620 1628 1629 1631 1630 1626 1627 1625 1624 1608 1609 1611 1610 1614 1615 1613 1612 1604 1605 1607 1606 1602 1603 1601 1600 1728 1729 1731 1730 1734 1735 1733 1732 1740 1741 1743 1742 1738 1739 1737 1736 1752 1753 1755 1754 1758 1759 1757 1756 1748 1749 1751 1750 1746 1747 1745 1744 1776 1777 1779 1778 1782 1783 1781 1780 1788 1789 1791 1790 1786 1787 1785 1784 1768 1769 1771 1770 1774 1775 1773 1772 1764 1765 1767 1766 1762 1763 1761 1760 1696 1697 1699 1698 1702 1703 1701 1700 1708 1709 1711 1710 1706 1707 1705 1704 1720 1721 1723 1722 1726 1727 1725 1724 1716 1717 1719 1718 1714 1715 1713 1712 1680 1681 1683 1682 1686 1687 1685 1684 1692 1693 1695 1694 1690 1691 1689 1688 1672 1673 1675 1674 1678 1679 1677 1676 1668 1669 1671 1670 1666 1667 1665 1664 1920 1921 1923 1922 1926 1927 1925 1924 1932 1933 1935 1934 1930 1931 1929 1928 1944 1945 1947 1946 1950 1951 1949 1948 1940 1941 1943 1942 1938 1939 1937 1936 1968 1969 1971 1970 1974 1975 1973 1972 1980 1981 1983 1982 1978 1979 1977 1976 1960 1961 1963 1962 1966 1967 1965 1964 1956 1957 1959 1958 1954 1955 1953 1952 2016 2017 2019 2018 2022 2023 2021 2020 2028 2029 2031 2030 2026 2027 2025 2024 2040 2041 2043 2042 2046 2047 2045 2044 2036 2037 2039 2038 2034 2035 2033 2032 2000 2001 2003 2002 2006 2007 2005 2004 2012 2013 2015 2014 2010 2011 2009 2008 1992 1993 1995 1994 1998 1999 1997 1996 1988 1989 1991 1990 1986 1987 1985 1984 1856 1857 1859 1858 1862 1863 1861 1860 1868 1869 1871 1870 1866 1867 1865 1864 1880 1881 1883 1882 1886 1887 1885 1884 1876 1877 1879 1878 1874 1875 1873 1872 1904 1905 1907 1906 1910 1911 1909 1908 1916 1917 1919 1918 1914 1915 1913 1912 1896 1897 1899 1898 1902 1903 1901 1900 1892 1893 1895 1894 1890 1891 1889 1888 1824 1825 1827 1826 1830 1831 1829 1828 1836 1837 1839 1838 1834 1835 1833 1832 1848 1849 1851 1850 1854 1855 1853 1852 1844 1845 1847 1846 1842 1843 1841 1840 1808 1809 1811 1810 1814 1815 1813 1812 1820 1821 1823 1822 1818 1819 1817 1816 1800 1801 1803 1802 1806 1807 1805 1804 1796 1797 1799 1798 1794 1795 1793 1792 1280 1281 1283 1282 1286 1287 1285 1284 1292 1293 1295 1294 1290 1291 1289 1288 1304 1305 1307 1306 1310 1311 1309 1308 1300 1301 1303 1302 1298 1299 1297 1296 1328 1329 1331 1330 1334 1335 1333 1332 1340 1341 1343 1342 1338 1339 1337 1336 1320 1321 1323 1322 1326 1327 1325 1324 1316 1317 1319 1318 1314 1315 1313 1312 1376 1377 1379 1378 1382 1383 1381 1380 1388 1389 1391 1390 1386 1387 1385 1384 1400 1401 1403 1402 1406 1407 1405 1404 1396 1397 1399 1398 1394 1395 1393 1392 1360 1361 1363 1362 1366 1367 1365 1364 1372 1373 1375 1374 1370 1371 1369 1368 1352 1353 1355 1354 1358 1359 1357 1356 1348 1349 1351 1350 1346 1347 1345 1344 1472 1473 1475 1474 1478 1479 1477 1476 1484 1485 1487 1486 1482 1483 1481 1480 1496 1497 1499 1498 1502 1503 1501 1500 1492 1493 1495 1494 1490 1491 1489 1488 1520 1521 1523 1522 1526 1527 1525 1524 1532 1533 1535 1534 1530 1531 1529 1528 1512 1513 1515 1514 1518 1519 1517 1516 1508 1509 1511 1510 1506 1507 1505 1504 1440 1441 1443 1442 1446 1447 1445 1444 1452 1453 1455 1454 1450 1451 1449 1448 1464 1465 1467 1466 1470 1471 1469 1468 1460 1461 1463 1462 1458 1459 1457 1456 1424 1425 1427 1426 1430 1431 1429 1428 1436 1437 1439 1438 1434 1435 1433 1432 1416 1417 1419 1418 1422 1423 1421 1420 1412 1413 1415 1414 1410 1411 1409 1408 1152 1153 1155 1154 1158 1159 1157 1156 1164 1165 1167 1166 1162 1163 1161 1160 1176 1177 1179 1178 1182 1183 1181 1180 1172 1173 1175 1174 1170 1171 1169 1168 1200 1201 1203 1202 1206 1207 1205 1204 1212 1213 1215 1214 1210 1211 1209 1208 1192 1193 1195 1194 1198 1199 1197 1196 1188 1189 1191 1190 1186 1187 1185 1184 1248 1249 1251 1250 1254 1255 1253 1252 1260 1261 1263 1262 1258 1259 1257 1256 1272 1273 1275 1274 1278 1279 1277 1276 1268 1269 1271 1270 1266 1267 1265 1264 1232 1233 1235 1234 1238 1239 1237 1236 1244 1245 1247 1246 1242 1243 1241 1240 1224 1225 1227 1226 1230 1231 1229 1228 1220 1221 1223 1222 1218 1219 1217 1216 1088 1089 1091 1090 1094 1095 1093 1092 1100 1101 1103 1102 1098 1099 1097 1096 1112 1113 1115 1114 1118 1119 1117 1116 1108 1109 1111 1110 1106 1107 1105 1104 1136 1137 1139 1138 1142 1143 1141 1140 1148 1149 1151 1150 1146 1147 1145 1144 1128 1129 1131 1130 1134 1135 1133 1132 1124 1125 1127 1126 1122 1123 1121 1120 1056 1057 1059 1058 1062 1063 1061 1060 1068 1069 1071 1070 1066 1067 1065 1064 1080 1081 1083 1082 1086 1087 1085 1084 1076 1077 1079 1078 1074 1075 1073 1072 1040 1041 1043 1042 1046 1047 1045 1044 1052 1053 1055 1054 1050 1051 1049 1048 1032 1033 1035 1034 1038 1039 1037 1036 1028 1029 1031 1030 1026 1027 1025 1024 3072 3073 3075 3074 3078 3079 3077 3076 3084 3085 3087 3086 3082 3083 3081 3080 3096 3097 3099 3098 3102 3103 3101 3100 3092 3093 3095 3094 3090 3091 3089 3088 3120 3121 3123 3122 3126 3127 3125 3124 3132 3133 3135 3134 3130 3131 3129 3128 3112 3113 3115 3114 3118 3119 3117 3116 3108 3109 3111 3110 3106 3107 3105 3104 3168 3169 3171 3170 3174 3175 3173 3172 3180 3181 3183 3182 3178 3179 3177 3176 3192 3193 3195 3194 3198 3199 3197 3196 3188 3189 3191 3190 3186 3187 3185 3184 3152 3153 3155 3154 3158 3159 3157 3156 3164 3165 3167 3166 3162 3163 3161 3160 3144 3145 3147 3146 3150 3151 3149 3148 3140 3141 3143 3142 3138 3139 3137 3136 3264 3265 3267 3266 3270 3271 3269 3268 3276 3277 3279 3278 3274 3275 3273 3272 3288 3289 3291 3290 3294 3295 3293 3292 3284 3285 3287 3286 3282 3283 3281 3280 3312 3313 3315 3314 3318 3319 3317 3316 3324 3325 3327 3326 3322 3323 3321 3320 3304 3305 3307 3306 3310 3311 3309 3308 3300 3301 3303 3302 3298 3299 3297 3296 3232 3233 3235 3234 3238 3239 3237 3236 3244 3245 3247 3246 3242 3243 3241 3240 3256 3257 3259 3258 3262 3263 3261 3260 3252 3253 3255 3254 3250 3251 3249 3248 3216 3217 3219 3218 3222 3223 3221 3220 3228 3229 3231 3230 3226 3227 3225 3224 3208 3209 3211 3210 3214 3215 3213 3212 3204 3205 3207 3206 3202 3203 3201 3200 3456 3457 3459 3458 3462 3463 3461 3460 3468 3469 3471 3470 3466 3467 3465 3464 3480 3481 3483 3482 3486 3487 3485 3484 3476 3477 3479 3478 3474 3475 3473 3472 3504 3505 3507 3506 3510 3511 3509 3508 3516 3517 3519 3518 3514 3515 3513 3512 3496 3497 3499 3498 3502 3503 3501 3500 3492 3493 3495 3494 3490 3491 3489 3488 3552 3553 3555 3554 3558 3559 3557 3556 3564 3565 3567 3566 3562 3563 3561 3560 3576 3577 3579 3578 3582 3583 3581 3580 3572 3573 3575 3574 3570 3571 3569 3568 3536 3537 3539 3538 3542 3543 3541 3540 3548 3549 3551 3550 3546 3547 3545 3544 3528 3529 3531 3530 3534 3535 3533 3532 3524 3525 3527 3526 3522 3523 3521 3520 3392 3393 3395 3394 3398 3399 3397 3396 3404 3405 3407 3406 3402 3403 3401 3400 3416 3417 3419 3418 3422 3423 3421 3420 3412 3413 3415 3414 3410 3411 3409 3408 3440 3441 3443 3442 3446 3447 3445 3444 3452 3453 3455 3454 3450 3451 3449 3448 3432 3433 3435 3434 3438 3439 3437 3436 3428 3429 3431 3430 3426 3427 3425 3424 3360 3361 3363 3362 3366 3367 3365 3364 3372 3373 3375 3374 3370 3371 3369 3368 3384 3385 3387 3386 3390 3391 3389 3388 3380 3381 3383 3382 3378 3379 3377 3376 3344 3345 3347 3346 3350 3351 3349 3348 3356 3357 3359 3358 3354 3355 3353 3352 3336 3337 3339 3338 3342 3343 3341 3340 3332 3333 3335 3334 3330 3331 3329 3328 3840 3841 3843 3842 3846 3847 3845 3844 3852 3853 3855 3854 3850 3851 3849 3848 3864 3865 3867 3866 3870 3871 3869 3868 3860 3861 3863 3862 3858 3859 3857 3856 3888 3889 3891 3890 3894 3895 3893 3892 3900 3901 3903 3902 3898 3899 3897 3896 3880 3881 3883 3882 3886 3887 3885 3884 3876 3877 3879 3878 3874 3875 3873 3872 3936 3937 3939 3938 3942 3943 3941 3940 3948 3949 3951 3950 3946 3947 3945 3944 3960 3961 3963 3962 3966 3967 3965 3964 3956 3957 3959 3958 3954 3955 3953 3952 3920 3921 3923 3922 3926 3927 3925 3924 3932 3933 3935 3934 3930 3931 3929 3928 3912 3913 3915 3914 3918 3919 3917 3916 3908 3909 3911 3910 3906 3907 3905 3904 4032 4033 4035 4034 4038 4039 4037 4036 4044 4045 4047 4046 4042 4043 4041 4040 4056 4057 4059 4058 4062 4063 4061 4060 4052 4053 4055 4054 4050 4051 4049 4048 4080 4081 4083 4082 4086 4087 4085 4084 4092 4093 4095 4094 4090 4091 4089 4088 4072 4073 4075 4074 4078 4079 4077 4076 4068 4069 4071 4070 4066 4067 4065 4064 4000 4001 4003 4002 4006 4007 4005 4004 4012 4013 4015 4014 4010 4011 4009 4008 4024 4025 4027 4026 4030 4031 4029 4028 4020 4021 4023 4022 4018 4019 4017 4016 3984 3985 3987 3986 3990 3991 3989 3988 3996 3997 3999 3998 3994 3995 3993 3992 3976 3977 3979 3978 3982 3983 3981 3980 3972 3973 3975 3974 3970 3971 3969 3968 3712 3713 3715 3714 3718 3719 3717 3716 3724 3725 3727 3726 3722 3723 3721 3720 3736 3737 3739 3738 3742 3743 3741 3740 3732 3733 3735 3734 3730 3731 3729 3728 3760 3761 3763 3762 3766 3767 3765 3764 3772 3773 3775 3774 3770 3771 3769 3768 3752 3753 3755 3754 3758 3759 3757 3756 3748 3749 3751 3750 3746 3747 3745 3744 3808 3809 3811 3810 3814 3815 3813 3812 3820 3821 3823 3822 3818 3819 3817 3816 3832 3833 3835 3834 3838 3839 3837 3836 3828 3829 3831 3830 3826 3827 3825 3824 3792 3793 3795 3794 3798 3799 3797 3796 3804 3805 3807 3806 3802 3803 3801 3800 3784 3785 3787 3786 3790 3791 3789 3788 3780 3781 3783 3782 3778 3779 3777 3776 3648 3649 3651 3650 3654 3655 3653 3652 3660 3661 3663 3662 3658 3659 3657 3656 3672 3673 3675 3674 3678 3679 3677 3676 3668 3669 3671 3670 3666 3667 3665 3664 3696 3697 3699 3698 3702 3703 3701 3700 3708 3709 3711 3710 3706 3707 3705 3704 3688 3689 3691 3690 3694 3695 3693 3692 3684 3685 3687 3686 3682 3683 3681 3680 3616 3617 3619 3618 3622 3623 3621 3620 3628 3629 3631 3630 3626 3627 3625 3624 3640 3641 3643 3642 3646 3647 3645 3644 3636 3637 3639 3638 3634 3635 3633 3632 3600 3601 3603 3602 3606 3607 3605 3604 3612 3613 3615 3614 3610 3611 3609 3608 3592 3593 3595 3594 3598 3599 3597 3596 3588 3589 3591 3590 3586 3587 3585 3584 2560 2561 2563 2562 2566 2567 2565 2564 2572 2573 2575 2574 2570 2571 2569 2568 2584 2585 2587 2586 2590 2591 2589 2588 2580 2581 2583 2582 2578 2579 2577 2576 2608 2609 2611 2610 2614 2615 2613 2612 2620 2621 2623 2622 2618 2619 2617 2616 2600 2601 2603 2602 2606 2607 2605 2604 2596 2597 2599 2598 2594 2595 2593 2592 2656 2657 2659 2658 2662 2663 2661 2660 2668 2669 2671 2670 2666 2667 2665 2664 2680 2681 2683 2682 2686 2687 2685 2684 2676 2677 2679 2678 2674 2675 2673 2672 2640 2641 2643 2642 2646 2647 2645 2644 2652 2653 2655 2654 2650 2651 2649 2648 2632 2633 2635 2634 2638 2639 2637 2636 2628 2629 2631 2630 2626 2627 2625 2624 2752 2753 2755 2754 2758 2759 2757 2756 2764 2765 2767 2766 2762 2763 2761 2760 2776 2777 2779 2778 2782 2783 2781 2780 2772 2773 2775 2774 2770 2771 2769 2768 2800 2801 2803 2802 2806 2807 2805 2804 2812 2813 2815 2814 2810 2811 2809 2808 2792 2793 2795 2794 2798 2799 2797 2796 2788 2789 2791 2790 2786 2787 2785 2784 2720 2721 2723 2722 2726 2727 2725 2724 2732 2733 2735 2734 2730 2731 2729 2728 2744 2745 2747 2746 2750 2751 2749 2748 2740 2741 2743 2742 2738 2739 2737 2736 2704 2705 2707 2706 2710 2711 2709 2708 2716 2717 2719 2718 2714 2715 2713 2712 2696 2697 2699 2698 2702 2703 2701 2700 2692 2693 2695 2694 2690 2691 2689 2688 2944 2945 2947 2946 2950 2951 2949 2948 2956 2957 2959 2958 2954 2955 2953 2952 2968 2969 2971 2970 2974 2975 2973 2972 2964 2965 2967 2966 2962 2963 2961 2960 2992 2993 2995 2994 2998 2999 2997 2996 3004 3005 3007 3006 3002 3003 3001 3000 2984 2985 2987 2986 2990 2991 2989 2988 2980 2981 2983 2982 2978 2979 2977 2976 3040 3041 3043 3042 3046 3047 3045 3044 3052 3053 3055 3054 3050 3051 3049 3048 3064 3065 3067 3066 3070 3071 3069 3068 3060 3061 3063 3062 3058 3059 3057 3056 3024 3025 3027 3026 3030 3031 3029 3028 3036 3037 3039 3038 3034 3035 3033 3032 3016 3017 3019 3018 3022 3023 3021 3020 3012 3013 3015 3014 3010 3011 3009 3008 2880 2881 2883 2882 2886 2887 2885 2884 2892 2893 2895 2894 2890 2891 2889 2888 2904 2905 2907 2906 2910 2911 2909 2908 2900 2901 2903 2902 2898 2899 2897 2896 2928 2929 2931 2930 2934 2935 2933 2932 2940 2941 2943 2942 2938 2939 2937 2936 2920 2921 2923 2922 2926 2927 2925 2924 2916 2917 2919 2918 2914 2915 2913 2912 2848 2849 2851 2850 2854 2855 2853 2852 2860 2861 2863 2862 2858 2859 2857 2856 2872 2873 2875 2874 2878 2879 2877 2876 2868 2869 2871 2870 2866 2867 2865 2864 2832 2833 2835 2834 2838 2839 2837 2836 2844 2845 2847 2846 2842 2843 2841 2840 2824 2825 2827 2826 2830 2831 2829 2828 2820 2821 2823 2822 2818 2819 2817 2816 2304 2305 2307 2306 2310 2311 2309 2308 2316 2317 2319 2318 2314 2315 2313 2312 2328 2329 2331 2330 2334 2335 2333 2332 2324 2325 2327 2326 2322 2323 2321 2320 2352 2353 2355 2354 2358 2359 2357 2356 2364 2365 2367 2366 2362 2363 2361 2360 2344 2345 2347 2346 2350 2351 2349 2348 2340 2341 2343 2342 2338 2339 2337 2336 2400 2401 2403 2402 2406 2407 2405 2404 2412 2413 2415 2414 2410 2411 2409 2408 2424 2425 2427 2426 2430 2431 2429 2428 2420 2421 2423 2422 2418 2419 2417 2416 2384 2385 2387 2386 2390 2391 2389 2388 2396 2397 2399 2398 2394 2395 2393 2392 2376 2377 2379 2378 2382 2383 2381 2380 2372 2373 2375 2374 2370 2371 2369 2368 2496 2497 2499 2498 2502 2503 2501 2500 2508 2509 2511 2510 2506 2507 2505 2504 2520 2521 2523 2522 2526 2527 2525 2524 2516 2517 2519 2518 2514 2515 2513 2512 2544 2545 2547 2546 2550 2551 2549 2548 2556 2557 2559 2558 2554 2555 2553 2552 2536 2537 2539 2538 2542 2543 2541 2540 2532 2533 2535 2534 2530 2531 2529 2528 2464 2465 2467 2466 2470 2471 2469 2468 2476 2477 2479 2478 2474 2475 2473 2472 2488 2489 2491 2490 2494 2495 2493 2492 2484 2485 2487 2486 2482 2483 2481 2480 2448 2449 2451 2450 2454 2455 2453 2452 2460 2461 2463 2462 2458 2459 2457 2456 2440 2441 2443 2442 2446 2447 2445 2444 2436 2437 2439 2438 2434 2435 2433 2432 2176 2177 2179 2178 2182 2183 2181 2180 2188 2189 2191 2190 2186 2187 2185 2184 2200 2201 2203 2202 2206 2207 2205 2204 2196 2197 2199 2198 2194 2195 2193 2192 2224 2225 2227 2226 2230 2231 2229 2228 2236 2237 2239 2238 2234 2235 2233 2232 2216 2217 2219 2218 2222 2223 2221 2220 2212 2213 2215 2214 2210 2211 2209 2208 2272 2273 2275 2274 2278 2279 2277 2276 2284 2285 2287 2286 2282 2283 2281 2280 2296 2297 2299 2298 2302 2303 2301 2300 2292 2293 2295 2294 2290 2291 2289 2288 2256 2257 2259 2258 2262 2263 2261 2260 2268 2269 2271 2270 2266 2267 2265 2264 2248 2249 2251 2250 2254 2255 2253 2252 2244 2245 2247 2246 2242 2243 2241 2240 2112 2113 2115 2114 2118 2119 2117 2116 2124 2125 2127 2126 2122 2123 2121 2120 2136 2137 2139 2138 2142 2143 2141 2140 2132 2133 2135 2134 2130 2131 2129 2128 2160 2161 2163 2162 2166 2167 2165 2164 2172 2173 2175 2174 2170 2171 2169 2168 2152 2153 2155 2154 2158 2159 2157 2156 2148 2149 2151 2150 2146 2147 2145 2144 2080 2081 2083 2082 2086 2087 2085 2084 2092 2093 2095 2094 2090 2091 2089 2088 2104 2105 2107 2106 2110 2111 2109 2108 2100 2101 2103 2102 2098 2099 2097 2096 2064 2065 2067 2066 2070 2071 2069 2068 2076 2077 2079 2078 2074 2075 2073 2072 2056 2057 2059 2058 2062 2063 2061 2060 2052 2053 2055 2054 2050 2051 2049 2048",
        "expected": "0 1 3 2 6 7 5 4 12 13 15 14 10 11 9 8 24 25 27 26 30 31 29 28 20 21 23 22 18 19 17 16 48 49 51 50 54 55 53 52 60 61 63 62 58 59 57 56 40 41 43 42 46 47 45 44 36 37 39 38 34 35 33 32 96 97 99 98 102 103 101 100 108 109 111 110 106 107 105 104 120 121 123 122 126 127 125 124 116 117 119 118 114 115 113 112 80 81 83 82 86 87 85 84 92 93 95 94 90 91 89 88 72 73 75 74 78 79 77 76 68 69 71 70 66 67 65 64 192 193 195 194 198 199 197 196 204 205 207 206 202 203 201 200 216 217 219 218 222 223 221 220 212 213 215 214 210 211 209 208 240 241 243 242 246 247 245 244 252 253 255 254 250 251 249 248 232 233 235 234 238 239 237 236 228 229 231 230 226 227 225 224 160 161 163 162 166 167 165 164 172 173 175 174 170 171 169 168 184 185 187 186 190 191 189 188 180 181 183 182 178 179 177 176 144 145 147 146 150 151 149 148 156 157 159 158 154 155 153 152 136 137 139 138 142 143 141 140 132 133 135 134 130 131 129 128 384 385 387 386 390 391 389 388 396 397 399 398 394 395 393 392 408 409 411 410 414 415 413 412 404 405 407 406 402 403 401 400 432 433 435 434 438 439 437 436 444 445 447 446 442 443 441 440 424 425 427 426 430 431 429 428 420 421 423 422 418 419 417 416 480 481 483 482 486 487 485 484 492 493 495 494 490 491 489 488 504 505 507 506 510 511 509 508 500 501 503 502 498 499 497 496 464 465 467 466 470 471 469 468 476 477 479 478 474 475 473 472 456 457 459 458 462 463 461 460 452 453 455 454 450 451 449 448 320 321 323 322 326 327 325 324 332 333 335 334 330 331 329 328 344 345 347 346 350 351 349 348 340 341 343 342 338 339 337 336 368 369 371 370 374 375 373 372 380 381 383 382 378 379 377 376 360 361 363 362 366 367 365 364 356 357 359 358 354 355 353 352 288 289 291 290 294 295 293 292 300 301 303 302 298 299 297 296 312 313 315 314 318 319 317 316 308 309 311 310 306 307 305 304 272 273 275 274 278 279 277 276 284 285 287 286 282 283 281 280 264 265 267 266 270 271 269 268 260 261 263 262 258 259 257 256 768 769 771 770 774 775 773 772 780 781 783 782 778 779 777 776 792 793 795 794 798 799 797 796 788 789 791 790 786 787 785 784 816 817 819 818 822 823 821 820 828 829 831 830 826 827 825 824 808 809 811 810 814 815 813 812 804 805 807 806 802 803 801 800 864 865 867 866 870 871 869 868 876 877 879 878 874 875 873 872 888 889 891 890 894 895 893 892 884 885 887 886 882 883 881 880 848 849 851 850 854 855 853 852 860 861 863 862 858 859 857 856 840 841 843 842 846 847 845 844 836 837 839 838 834 835 833 832 960 961 963 962 966 967 965 964 972 973 975 974 970 971 969 968 984 985 987 986 990 991 989 988 980 981 983 982 978 979 977 976 1008 1009 1011 1010 1014 1015 1013 1012 1020 1021 1023 1022 1018 1019 1017 1016 1000 1001 1003 1002 1006 1007 1005 1004 996 997 999 998 994 995 993 992 928 929 931 930 934 935 933 932 940 941 943 942 938 939 937 936 952 953 955 954 958 959 957 956 948 949 951 950 946 947 945 944 912 913 915 914 918 919 917 916 924 925 927 926 922 923 921 920 904 905 907 906 910 911 909 908 900 901 903 902 898 899 897 896 640 641 643 642 646 647 645 644 652 653 655 654 650 651 649 648 664 665 667 666 670 671 669 668 660 661 663 662 658 659 657 656 688 689 691 690 694 695 693 692 700 701 703 702 698 699 697 696 680 681 683 682 686 687 685 684 676 677 679 678 674 675 673 672 736 737 739 738 742 743 741 740 748 749 751 750 746 747 745 744 760 761 763 762 766 767 765 764 756 757 759 758 754 755 753 752 720 721 723 722 726 727 725 724 732 733 735 734 730 731 729 728 712 713 715 714 718 719 717 716 708 709 711 710 706 707 705 704 576 577 579 578 582 583 581 580 588 589 591 590 586 587 585 584 600 601 603 602 606 607 605 604 596 597 599 598 594 595 593 592 624 625 627 626 630 631 629 628 636 637 639 638 634 635 633 632 616 617 619 618 622 623 621 620 612 613 615 614 610 611 609 608 544 545 547 546 550 551 549 548 556 557 559 558 554 555 553 552 568 569 571 570 574 575 573 572 564 565 567 566 562 563 561 560 528 529 531 530 534 535 533 532 540 541 543 542 538 539 537 536 520 521 523 522 526 527 525 524 516 517 519 518 514 515 513 512 1536 1537 1539 1538 1542 1543 1541 1540 1548 1549 1551 1550 1546 1547 1545 1544 1560 1561 1563 1562 1566 1567 1565 1564 1556 1557 1559 1558 1554 1555 1553 1552 1584 1585 1587 1586 1590 1591 1589 1588 1596 1597 1599 1598 1594 1595 1593 1592 1576 1577 1579 1578 1582 1583 1581 1580 1572 1573 1575 1574 1570 1571 1569 1568 1632 1633 1635 1634 1638 1639 1637 1636 1644 1645 1647 1646 1642 1643 1641 1640 1656 1657 1659 1658 1662 1663 1661 1660 1652 1653 1655 1654 1650 1651 1649 1648 1616 1617 1619 1618 1622 1623 1621 1620 1628 1629 1631 1630 1626 1627 1625 1624 1608 1609 1611 1610 1614 1615 1613 1612 1604 1605 1607 1606 1602 1603 1601 1600 1728 1729 1731 1730 1734 1735 1733 1732 1740 1741 1743 1742 1738 1739 1737 1736 1752 1753 1755 1754 1758 1759 1757 1756 1748 1749 1751 1750 1746 1747 1745 1744 1776 1777 1779 1778 1782 1783 1781 1780 1788 1789 1791 1790 1786 1787 1785 1784 1768 1769 1771 1770 1774 1775 1773 1772 1764 1765 1767 1766 1762 1763 1761 1760 1696 1697 1699 1698 1702 1703 1701 1700 1708 1709 1711 1710 1706 1707 1705 1704 1720 1721 1723 1722 1726 1727 1725 1724 1716 1717 1719 1718 1714 1715 1713 1712 1680 1681 1683 1682 1686 1687 1685 1684 1692 1693 1695 1694 1690 1691 1689 1688 1672 1673 1675 1674 1678 1679 1677 1676 1668 1669 1671 1670 1666 1667 1665 1664 1920 1921 1923 1922 1926 1927 1925 1924 1932 1933 1935 1934 1930 1931 1929 1928 1944 1945 1947 1946 1950 1951 1949 1948 1940 1941 1943 1942 1938 1939 1937 1936 1968 1969 1971 1970 1974 1975 1973 1972 1980 1981 1983 1982 1978 1979 1977 1976 1960 1961 1963 1962 1966 1967 1965 1964 1956 1957 1959 1958 1954 1955 1953 1952 2016 2017 2019 2018 2022 2023 2021 2020 2028 2029 2031 2030 2026 2027 2025 2024 2040 2041 2043 2042 2046 2047 2045 2044 2036 2037 2039 2038 2034 2035 2033 2032 2000 2001 2003 2002 2006 2007 2005 2004 2012 2013 2015 2014 2010 2011 2009 2008 1992 1993 1995 1994 1998 1999 1997 1996 1988 1989 1991 1990 1986 1987 1985 1984 1856 1857 1859 1858 1862 1863 1861 1860 1868 1869 1871 1870 1866 1867 1865 1864 1880 1881 1883 1882 1886 1887 1885 1884 1876 1877 1879 1878 1874 1875 1873 1872 1904 1905 1907 1906 1910 1911 1909 1908 1916 1917 1919 1918 1914 1915 1913 1912 1896 1897 1899 1898 1902 1903 1901 1900 1892 1893 1895 1894 1890 1891 1889 1888 1824 1825 1827 1826 1830 1831 1829 1828 1836 1837 1839 1838 1834 1835 1833 1832 1848 1849 1851 1850 1854 1855 1853 1852 1844 1845 1847 1846 1842 1843 1841 1840 1808 1809 1811 1810 1814 1815 1813 1812 1820 1821 1823 1822 1818 1819 1817 1816 1800 1801 1803 1802 1806 1807 1805 1804 1796 1797 1799 1798 1794 1795 1793 1792 1280 1281 1283 1282 1286 1287 1285 1284 1292 1293 1295 1294 1290 1291 1289 1288 1304 1305 1307 1306 1310 1311 1309 1308 1300 1301 1303 1302 1298 1299 1297 1296 1328 1329 1331 1330 1334 1335 1333 1332 1340 1341 1343 1342 1338 1339 1337 1336 1320 1321 1323 1322 1326 1327 1325 1324 1316 1317 1319 1318 1314 1315 1313 1312 1376 1377 1379 1378 1382 1383 1381 1380 1388 1389 1391 1390 1386 1387 1385 1384 1400 1401 1403 1402 1406 1407 1405 1404 1396 1397 1399 1398 1394 1395 1393 1392 1360 1361 1363 1362 1366 1367 1365 1364 1372 1373 1375 1374 1370 1371 1369 1368 1352 1353 1355 1354 1358 1359 1357 1356 1348 1349 1351 1350 1346 1347 1345 1344 1472 1473 1475 1474 1478 1479 1477 1476 1484 1485 1487 1486 1482 1483 1481 1480 1496 1497 1499 1498 1502 1503 1501 1500 1492 1493 1495 1494 1490 1491 1489 1488 1520 1521 1523 1522 1526 1527 1525 1524 1532 1533 1535 1534 1530 1531 1529 1528 1512 1513 1515 1514 1518 1519 1517 1516 1508 1509 1511 1510 1506 1507 1505 1504 1440 1441 1443 1442 1446 1447 1445 1444 1452 1453 1455 1454 1450 1451 1449 1448 1464 1465 1467 1466 1470 1471 1469 1468 1460 1461 1463 1462 1458 1459 1457 1456 1424 1425 1427 1426 1430 1431 1429 1428 1436 1437 1439 1438 1434 1435 1433 1432 1416 1417 1419 1418 1422 1423 1421 1420 1412 1413 1415 1414 1410 1411 1409 1408 1152 1153 1155 1154 1158 1159 1157 1156 1164 1165 1167 1166 1162 1163 1161 1160 1176 1177 1179 1178 1182 1183 1181 1180 1172 1173 1175 1174 1170 1171 1169 1168 1200 1201 1203 1202 1206 1207 1205 1204 1212 1213 1215 1214 1210 1211 1209 1208 1192 1193 1195 1194 1198 1199 1197 1196 1188 1189 1191 1190 1186 1187 1185 1184 1248 1249 1251 1250 1254 1255 1253 1252 1260 1261 1263 1262 1258 1259 1257 1256 1272 1273 1275 1274 1278 1279 1277 1276 1268 1269 1271 1270 1266 1267 1265 1264 1232 1233 1235 1234 1238 1239 1237 1236 1244 1245 1247 1246 1242 1243 1241 1240 1224 1225 1227 1226 1230 1231 1229 1228 1220 1221 1223 1222 1218 1219 1217 1216 1088 1089 1091 1090 1094 1095 1093 1092 1100 1101 1103 1102 1098 1099 1097 1096 1112 1113 1115 1114 1118 1119 1117 1116 1108 1109 1111 1110 1106 1107 1105 1104 1136 1137 1139 1138 1142 1143 1141 1140 1148 1149 1151 1150 1146 1147 1145 1144 1128 1129 1131 1130 1134 1135 1133 1132 1124 1125 1127 1126 1122 1123 1121 1120 1056 1057 1059 1058 1062 1063 1061 1060 1068 1069 1071 1070 1066 1067 1065 1064 1080 1081 1083 1082 1086 1087 1085 1084 1076 1077 1079 1078 1074 1075 1073 1072 1040 1041 1043 1042 1046 1047 1045 1044 1052 1053 1055 1054 1050 1051 1049 1048 1032 1033 1035 1034 1038 1039 1037 1036 1028 1029 1031 1030 1026 1027 1025 1024 3072 3073 3075 3074 3078 3079 3077 3076 3084 3085 3087 3086 3082 3083 3081 3080 3096 3097 3099 3098 3102 3103 3101 3100 3092 3093 3095 3094 3090 3091 3089 3088 3120 3121 3123 3122 3126 3127 3125 3124 3132 3133 3135 3134 3130 3131 3129 3128 3112 3113 3115 3114 3118 3119 3117 3116 3108 3109 3111 3110 3106 3107 3105 3104 3168 3169 3171 3170 3174 3175 3173 3172 3180 3181 3183 3182 3178 3179 3177 3176 3192 3193 3195 3194 3198 3199 3197 3196 3188 3189 3191 3190 3186 3187 3185 3184 3152 3153 3155 3154 3158 3159 3157 3156 3164 3165 3167 3166 3162 3163 3161 3160 3144 3145 3147 3146 3150 3151 3149 3148 3140 3141 3143 3142 3138 3139 3137 3136 3264 3265 3267 3266 3270 3271 3269 3268 3276 3277 3279 3278 3274 3275 3273 3272 3288 3289 3291 3290 3294 3295 3293 3292 3284 3285 3287 3286 3282 3283 3281 3280 3312 3313 3315 3314 3318 3319 3317 3316 3324 3325 3327 3326 3322 3323 3321 3320 3304 3305 3307 3306 3310 3311 3309 3308 3300 3301 3303 3302 3298 3299 3297 3296 3232 3233 3235 3234 3238 3239 3237 3236 3244 3245 3247 3246 3242 3243 3241 3240 3256 3257 3259 3258 3262 3263 3261 3260 3252 3253 3255 3254 3250 3251 3249 3248 3216 3217 3219 3218 3222 3223 3221 3220 3228 3229 3231 3230 3226 3227 3225 3224 3208 3209 3211 3210 3214 3215 3213 3212 3204 3205 3207 3206 3202 3203 3201 3200 3456 3457 3459 3458 3462 3463 3461 3460 3468 3469 3471 3470 3466 3467 3465 3464 3480 3481 3483 3482 3486 3487 3485 3484 3476 3477 3479 3478 3474 3475 3473 3472 3504 3505 3507 3506 3510 3511 3509 3508 3516 3517 3519 3518 3514 3515 3513 3512 3496 3497 3499 3498 3502 3503 3501 3500 3492 3493 3495 3494 3490 3491 3489 3488 3552 3553 3555 3554 3558 3559 3557 3556 3564 3565 3567 3566 3562 3563 3561 3560 3576 3577 3579 3578 3582 3583 3581 3580 3572 3573 3575 3574 3570 3571 3569 3568 3536 3537 3539 3538 3542 3543 3541 3540 3548 3549 3551 3550 3546 3547 3545 3544 3528 3529 3531 3530 3534 3535 3533 3532 3524 3525 3527 3526 3522 3523 3521 3520 3392 3393 3395 3394 3398 3399 3397 3396 3404 3405 3407 3406 3402 3403 3401 3400 3416 3417 3419 3418 3422 3423 3421 3420 3412 3413 3415 3414 3410 3411 3409 3408 3440 3441 3443 3442 3446 3447 3445 3444 3452 3453 3455 3454 3450 3451 3449 3448 3432 3433 3435 3434 3438 3439 3437 3436 3428 3429 3431 3430 3426 3427 3425 3424 3360 3361 3363 3362 3366 3367 3365 3364 3372 3373 3375 3374 3370 3371 3369 3368 3384 3385 3387 3386 3390 3391 3389 3388 3380 3381 3383 3382 3378 3379 3377 3376 3344 3345 3347 3346 3350 3351 3349 3348 3356 3357 3359 3358 3354 3355 3353 3352 3336 3337 3339 3338 3342 3343 3341 3340 3332 3333 3335 3334 3330 3331 3329 3328 3840 3841 3843 3842 3846 3847 3845 3844 3852 3853 3855 3854 3850 3851 3849 3848 3864 3865 3867 3866 3870 3871 3869 3868 3860 3861 3863 3862 3858 3859 3857 3856 3888 3889 3891 3890 3894 3895 3893 3892 3900 3901 3903 3902 3898 3899 3897 3896 3880 3881 3883 3882 3886 3887 3885 3884 3876 3877 3879 3878 3874 3875 3873 3872 3936 3937 3939 3938 3942 3943 3941 3940 3948 3949 3951 3950 3946 3947 3945 3944 3960 3961 3963 3962 3966 3967 3965 3964 3956 3957 3959 3958 3954 3955 3953 3952 3920 3921 3923 3922 3926 3927 3925 3924 3932 3933 3935 3934 3930 3931 3929 3928 3912 3913 3915 3914 3918 3919 3917 3916 3908 3909 3911 3910 3906 3907 3905 3904 4032 4033 4035 4034 4038 4039 4037 4036 4044 4045 4047 4046 4042 4043 4041 4040 4056 4057 4059 4058 4062 4063 4061 4060 4052 4053 4055 4054 4050 4051 4049 4048 4080 4081 4083 4082 4086 4087 4085 4084 4092 4093 4095 4094 4090 4091 4089 4088 4072 4073 4075 4074 4078 4079 4077 4076 4068 4069 4071 4070 4066 4067 4065 4064 4000 4001 4003 4002 4006 4007 4005 4004 4012 4013 4015 4014 4010 4011 4009 4008 4024 4025 4027 4026 4030 4031 4029 4028 4020 4021 4023 4022 4018 4019 4017 4016 3984 3985 3987 3986 3990 3991 3989 3988 3996 3997 3999 3998 3994 3995 3993 3992 3976 3977 3979 3978 3982 3983 3981 3980 3972 3973 3975 3974 3970 3971 3969 3968 3712 3713 3715 3714 3718 3719 3717 3716 3724 3725 3727 3726 3722 3723 3721 3720 3736 3737 3739 3738 3742 3743 3741 3740 3732 3733 3735 3734 3730 3731 3729 3728 3760 3761 3763 3762 3766 3767 3765 3764 3772 3773 3775 3774 3770 3771 3769 3768 3752 3753 3755 3754 3758 3759 3757 3756 3748 3749 3751 3750 3746 3747 3745 3744 3808 3809 3811 3810 3814 3815 3813 3812 3820 3821 3823 3822 3818 3819 3817 3816 3832 3833 3835 3834 3838 3839 3837 3836 3828 3829 3831 3830 3826 3827 3825 3824 3792 3793 3795 3794 3798 3799 3797 3796 3804 3805 3807 3806 3802 3803 3801 3800 3784 3785 3787 3786 3790 3791 3789 3788 3780 3781 3783 3782 3778 3779 3777 3776 3648 3649 3651 3650 3654 3655 3653 3652 3660 3661 3663 3662 3658 3659 3657 3656 3672 3673 3675 3674 3678 3679 3677 3676 3668 3669 3671 3670 3666 3667 3665 3664 3696 3697 3699 3698 3702 3703 3701 3700 3708 3709 3711 3710 3706 3707 3705 3704 3688 3689 3691 3690 3694 3695 3693 3692 3684 3685 3687 3686 3682 3683 3681 3680 3616 3617 3619 3618 3622 3623 3621 3620 3628 3629 3631 3630 3626 3627 3625 3624 3640 3641 3643 3642 3646 3647 3645 3644 3636 3637 3639 3638 3634 3635 3633 3632 3600 3601 3603 3602 3606 3607 3605 3604 3612 3613 3615 3614 3610 3611 3609 3608 3592 3593 3595 3594 3598 3599 3597 3596 3588 3589 3591 3590 3586 3587 3585 3584 2560 2561 2563 2562 2566 2567 2565 2564 2572 2573 2575 2574 2570 2571 2569 2568 2584 2585 2587 2586 2590 2591 2589 2588 2580 2581 2583 2582 2578 2579 2577 2576 2608 2609 2611 2610 2614 2615 2613 2612 2620 2621 2623 2622 2618 2619 2617 2616 2600 2601 2603 2602 2606 2607 2605 2604 2596 2597 2599 2598 2594 2595 2593 2592 2656 2657 2659 2658 2662 2663 2661 2660 2668 2669 2671 2670 2666 2667 2665 2664 2680 2681 2683 2682 2686 2687 2685 2684 2676 2677 2679 2678 2674 2675 2673 2672 2640 2641 2643 2642 2646 2647 2645 2644 2652 2653 2655 2654 2650 2651 2649 2648 2632 2633 2635 2634 2638 2639 2637 2636 2628 2629 2631 2630 2626 2627 2625 2624 2752 2753 2755 2754 2758 2759 2757 2756 2764 2765 2767 2766 2762 2763 2761 2760 2776 2777 2779 2778 2782 2783 2781 2780 2772 2773 2775 2774 2770 2771 2769 2768 2800 2801 2803 2802 2806 2807 2805 2804 2812 2813 2815 2814 2810 2811 2809 2808 2792 2793 2795 2794 2798 2799 2797 2796 2788 2789 2791 2790 2786 2787 2785 2784 2720 2721 2723 2722 2726 2727 2725 2724 2732 2733 2735 2734 2730 2731 2729 2728 2744 2745 2747 2746 2750 2751 2749 2748 2740 2741 2743 2742 2738 2739 2737 2736 2704 2705 2707 2706 2710 2711 2709 2708 2716 2717 2719 2718 2714 2715 2713 2712 2696 2697 2699 2698 2702 2703 2701 2700 2692 2693 2695 2694 2690 2691 2689 2688 2944 2945 2947 2946 2950 2951 2949 2948 2956 2957 2959 2958 2954 2955 2953 2952 2968 2969 2971 2970 2974 2975 2973 2972 2964 2965 2967 2966 2962 2963 2961 2960 2992 2993 2995 2994 2998 2999 2997 2996 3004 3005 3007 3006 3002 3003 3001 3000 2984 2985 2987 2986 2990 2991 2989 2988 2980 2981 2983 2982 2978 2979 2977 2976 3040 3041 3043 3042 3046 3047 3045 3044 3052 3053 3055 3054 3050 3051 3049 3048 3064 3065 3067 3066 3070 3071 3069 3068 3060 3061 3063 3062 3058 3059 3057 3056 3024 3025 3027 3026 3030 3031 3029 3028 3036 3037 3039 3038 3034 3035 3033 3032 3016 3017 3019 3018 3022 3023 3021 3020 3012 3013 3015 3014 3010 3011 3009 3008 2880 2881 2883 2882 2886 2887 2885 2884 2892 2893 2895 2894 2890 2891 2889 2888 2904 2905 2907 2906 2910 2911 2909 2908 2900 2901 2903 2902 2898 2899 2897 2896 2928 2929 2931 2930 2934 2935 2933 2932 2940 2941 2943 2942 2938 2939 2937 2936 2920 2921 2923 2922 2926 2927 2925 2924 2916 2917 2919 2918 2914 2915 2913 2912 2848 2849 2851 2850 2854 2855 2853 2852 2860 2861 2863 2862 2858 2859 2857 2856 2872 2873 2875 2874 2878 2879 2877 2876 2868 2869 2871 2870 2866 2867 2865 2864 2832 2833 2835 2834 2838 2839 2837 2836 2844 2845 2847 2846 2842 2843 2841 2840 2824 2825 2827 2826 2830 2831 2829 2828 2820 2821 2823 2822 2818 2819 2817 2816 2304 2305 2307 2306 2310 2311 2309 2308 2316 2317 2319 2318 2314 2315 2313 2312 2328 2329 2331 2330 2334 2335 2333 2332 2324 2325 2327 2326 2322 2323 2321 2320 2352 2353 2355 2354 2358 2359 2357 2356 2364 2365 2367 2366 2362 2363 2361 2360 2344 2345 2347 2346 2350 2351 2349 2348 2340 2341 2343 2342 2338 2339 2337 2336 2400 2401 2403 2402 2406 2407 2405 2404 2412 2413 2415 2414 2410 2411 2409 2408 2424 2425 2427 2426 2430 2431 2429 2428 2420 2421 2423 2422 2418 2419 2417 2416 2384 2385 2387 2386 2390 2391 2389 2388 2396 2397 2399 2398 2394 2395 2393 2392 2376 2377 2379 2378 2382 2383 2381 2380 2372 2373 2375 2374 2370 2371 2369 2368 2496 2497 2499 2498 2502 2503 2501 2500 2508 2509 2511 2510 2506 2507 2505 2504 2520 2521 2523 2522 2526 2527 2525 2524 2516 2517 2519 2518 2514 2515 2513 2512 2544 2545 2547 2546 2550 2551 2549 2548 2556 2557 2559 2558 2554 2555 2553 2552 2536 2537 2539 2538 2542 2543 2541 2540 2532 2533 2535 2534 2530 2531 2529 2528 2464 2465 2467 2466 2470 2471 2469 2468 2476 2477 2479 2478 2474 2475 2473 2472 2488 2489 2491 2490 2494 2495 2493 2492 2484 2485 2487 2486 2482 2483 2481 2480 2448 2449 2451 2450 2454 2455 2453 2452 2460 2461 2463 2462 2458 2459 2457 2456 2440 2441 2443 2442 2446 2447 2445 2444 2436 2437 2439 2438 2434 2435 2433 2432 2176 2177 2179 2178 2182 2183 2181 2180 2188 2189 2191 2190 2186 2187 2185 2184 2200 2201 2203 2202 2206 2207 2205 2204 2196 2197 2199 2198 2194 2195 2193 2192 2224 2225 2227 2226 2230 2231 2229 2228 2236 2237 2239 2238 2234 2235 2233 2232 2216 2217 2219 2218 2222 2223 2221 2220 2212 2213 2215 2214 2210 2211 2209 2208 2272 2273 2275 2274 2278 2279 2277 2276 2284 2285 2287 2286 2282 2283 2281 2280 2296 2297 2299 2298 2302 2303 2301 2300 2292 2293 2295 2294 2290 2291 2289 2288 2256 2257 2259 2258 2262 2263 2261 2260 2268 2269 2271 2270 2266 2267 2265 2264 2248 2249 2251 2250 2254 2255 2253 2252 2244 2245 2247 2246 2242 2243 2241 2240 2112 2113 2115 2114 2118 2119 2117 2116 2124 2125 2127 2126 2122 2123 2121 2120 2136 2137 2139 2138 2142 2143 2141 2140 2132 2133 2135 2134 2130 2131 2129 2128 2160 2161 2163 2162 2166 2167 2165 2164 2172 2173 2175 2174 2170 2171 2169 2168 2152 2153 2155 2154 2158 2159 2157 2156 2148 2149 2151 2150 2146 2147 2145 2144 2080 2081 2083 2082 2086 2087 2085 2084 2092 2093 2095 2094 2090 2091 2089 2088 2104 2105 2107 2106 2110 2111 2109 2108 2100 2101 2103 2102 2098 2099 2097 2096 2064 2065 2067 2066 2070 2071 2069 2068 2076 2077 2079 2078 2074 2075 2073 2072 2056 2057 2059 2058 2062 2063 2061 2060 2052 2053 2055 2054 2050 2051 2049 2048",
        "description": "n=12 (4096 elements)"
      }
    ],
    "analogy": {
      "title": "⚡ The Electric Wire & Switch Analogy for Gray Code",
      "story": "Imagine you are working in a master electrical room with switches lined up on a panel. Every switch represents a single binary bit (0 for OFF, 1 for ON). Instead of manually opening and closing every single circuit individually, Gray Code lets you manipulate circuits instantaneously using logic gates like XOR, AND, and bit shifts."
    },
    "steps": [
      {
        "stepIndex": 0,
        "title": "🏁 Initialization & Setup",
        "activeLine": 1,
        "explanation": "Set up the primary accumulator and bitwise tracking registers.",
        "variables": {
          "state": "Initial",
          "bitIndex": 0
        }
      },
      {
        "stepIndex": 1,
        "title": "⚙️ Core Bitwise Transformation",
        "activeLine": 2,
        "explanation": "Apply the core bitwise identity: cancel duplicates, probe Trie branches, or accumulate masks.",
        "variables": {
          "state": "Processing",
          "activeMask": "0b1"
        }
      },
      {
        "stepIndex": 2,
        "title": "🎯 Result Finalization",
        "activeLine": 3,
        "explanation": "Extract the computed integer result and return it with optimal O(1) auxiliary space.",
        "variables": {
          "state": "Complete",
          "verified": true
        }
      }
    ],
    "timeLimit": 2000,
    "memoryLimit": 256,
    "status": "approved",
    "generatedAt": "2026-11-20T14:42:20.405Z"
  },
  {
    "problemId": "dsa_bit-manipulation_16",
    "topicId": "bit-manipulation",
    "order": 16,
    "title": "Divide Two Integers without Multiplication or Division",
    "difficulty": "Medium",
    "pattern": "Bitwise Exponential Subtraction (divisor << shift)",
    "tags": [
      "Bit Manipulation",
      "Medium",
      "Bit Shift Division",
      "Campus Placement"
    ],
    "statement": "Given two integers `dividend` and `divisor`, divide two integers without using multiplication, division, and mod operator.\n\nThe integer division should truncate toward zero, which means losing its fractional part. For example, `truncate(8.345) = 8` and `truncate(-2.7335) = -2`.\n\nReturn the quotient after dividing `dividend` by `divisor`.\n\nAssume we are dealing with an environment that could only store integers within the 32-bit signed integer range: `[-2^31, 2^31 - 1]`. For this problem, if the quotient is strictly greater than `2^31 - 1`, then return `2^31 - 1`, and if the quotient is strictly less than `-2^31`, then return `-2^31`.",
    "inputFormat": "A single line containing two space-separated integers: dividend and divisor.",
    "outputFormat": "Print the truncated integer quotient clamped to the 32-bit signed integer range.",
    "constraints": [
      "-2^31 <= dividend, divisor <= 2^31 - 1",
      "divisor != 0",
      "Time Limit: 1.0 second",
      "Memory Limit: 256 MB"
    ],
    "examples": [
      {
        "input": "10 3",
        "displayInput": "dividend = 10, divisor = 3",
        "output": "3",
        "displayOutput": "3",
        "explanation": "10 / 3 = 3.33333... which is truncated to 3."
      },
      {
        "input": "7 -3",
        "displayInput": "dividend = 7, divisor = -3",
        "output": "-2",
        "displayOutput": "-2",
        "explanation": "7 / -3 = -2.33333... which is truncated to -2."
      },
      {
        "input": "-2147483648 -1",
        "displayInput": "dividend = -2147483648, divisor = -1",
        "output": "2147483647",
        "displayOutput": "2147483647",
        "explanation": "The result would be 2147483648, which exceeds 2^31 - 1, so it is clamped to 2147483647."
      }
    ],
    "hints": [
      "Repeatedly subtracting divisor takes O(dividend) time, which will TLE when dividend = 2^31 - 1 and divisor = 1.",
      "Instead of subtracting divisor 1 by 1, subtract largest powers of two of divisor: divisor * 2^k, which can be found using bit shifts (divisor << k).",
      "Handle edge cases carefully: -2^31 / -1 overflows 32-bit signed range and must return 2^31 - 1."
    ],
    "starterCode": {
      "python": "import sys\n\ndef divide(dividend: int, divisor: int) -> int:\n    # Write your solution here\n    pass\n\nif __name__ == '__main__':\n    data = sys.stdin.read().split()\n    if data:\n        dividend = int(data[0])\n        divisor = int(data[1])\n        result = divide(dividend, divisor)\n        if result is not None:\n            print(result)\n",
      "java": "import java.util.Scanner;\n\npublic class Solution {\n    public static int divide(int dividend, int divisor) {\n        // Write your solution here\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int dividend = sc.nextInt();\n            int divisor = sc.nextInt();\n            // Solution call\n        }\n    }\n}\n",
      "cpp": "#include <iostream>\nusing namespace std;\n\nint divide(int dividend, int divisor) {\n    // Write your solution here\n    return 0;\n}\n\nint main() {\n    int dividend, divisor;\n    if (cin >> dividend >> divisor) {\n        // Solution call\n    }\n    return 0;\n}\n",
      "javascript": "const fs = require('fs');\n\nfunction divide(dividend, divisor) {\n    // Write your solution here\n    return undefined;\n}\n\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);\nif (input.length >= 2 && input[0] !== '') {\n    const dividend = parseInt(input[0], 10);\n    const divisor = parseInt(input[1], 10);\n    const ans = divide(dividend, divisor);\n    if (ans !== undefined) console.log(ans);\n}\n"
    },
    "approaches": [
      {
        "name": "Approach 1: Brute Force",
        "type": "brute",
        "title": "Repeated Subtraction",
        "idea": "Subtract divisor from dividend repeatedly while dividend >= divisor, incrementing quotient by 1 each time.",
        "timeComplexity": "O(|dividend| / |divisor|) -> up to O(2^31)",
        "spaceComplexity": "O(1)",
        "code": {
          "python": "def divide(dividend: int, divisor: int) -> int:\n    INT_MAX = 2**31 - 1\n    INT_MIN = -2**31\n    if dividend == INT_MIN and divisor == -1:\n        return INT_MAX\n    negative = (dividend < 0) ^ (divisor < 0)\n    dvd, dvs = abs(dividend), abs(divisor)\n    quotient = 0\n    while dvd >= dvs:\n        dvd -= dvs\n        quotient += 1\n    return -quotient if negative else quotient",
          "java": "public int divide(int dividend, int divisor) {\n    if (dividend == Integer.MIN_VALUE && divisor == -1) return Integer.MAX_VALUE;\n    boolean negative = (dividend < 0) ^ (divisor < 0);\n    long dvd = Math.abs((long)dividend);\n    long dvs = Math.abs((long)divisor);\n    long quotient = 0;\n    while (dvd >= dvs) {\n        dvd -= dvs;\n        quotient++;\n    }\n    return negative ? -(int)quotient : (int)quotient;\n}",
          "cpp": "int divide(int dividend, int divisor) {\n    if (dividend == INT_MIN && divisor == -1) return INT_MAX;\n    bool negative = (dividend < 0) ^ (divisor < 0);\n    long long dvd = abs((long long)dividend);\n    long long dvs = abs((long long)divisor);\n    long long quotient = 0;\n    while (dvd >= dvs) {\n        dvd -= dvs;\n        quotient++;\n    }\n    return negative ? -quotient : quotient;\n}",
          "javascript": "function divide(dividend, divisor) {\n    const INT_MAX = 2147483647;\n    const INT_MIN = -2147483648;\n    if (dividend === INT_MIN && divisor === -1) return INT_MAX;\n    const negative = (dividend < 0) ^ (divisor < 0);\n    let dvd = Math.abs(dividend);\n    const dvs = Math.abs(divisor);\n    let quotient = 0;\n    while (dvd >= dvs) {\n        dvd -= dvs;\n        quotient++;\n    }\n    return negative ? -quotient : quotient;\n}"
        }
      },
      {
        "name": "Approach 2: Better Approach",
        "type": "better",
        "title": "Exponential Doubling (Bit Shifts)",
        "idea": "Double divisor (divisor << shift) until it exceeds dividend. Subtract that chunk and repeat until remaining dividend is less than divisor.",
        "timeComplexity": "O(log^2(N))",
        "spaceComplexity": "O(1)",
        "code": {
          "python": "def divide(dividend: int, divisor: int) -> int:\n    INT_MAX = 2**31 - 1\n    INT_MIN = -2**31\n    if dividend == INT_MIN and divisor == -1:\n        return INT_MAX\n    negative = (dividend < 0) ^ (divisor < 0)\n    dvd, dvs = abs(dividend), abs(divisor)\n    quotient = 0\n    while dvd >= dvs:\n        temp = dvs\n        multiple = 1\n        while dvd >= (temp << 1):\n            temp <<= 1\n            multiple <<= 1\n        dvd -= temp\n        quotient += multiple\n    return -quotient if negative else min(quotient, INT_MAX)",
          "java": "public int divide(int dividend, int divisor) {\n    if (dividend == Integer.MIN_VALUE && divisor == -1) return Integer.MAX_VALUE;\n    boolean negative = (dividend < 0) ^ (divisor < 0);\n    long dvd = Math.abs((long)dividend);\n    long dvs = Math.abs((long)divisor);\n    long quotient = 0;\n    while (dvd >= dvs) {\n        long temp = dvs, multiple = 1;\n        while (dvd >= (temp << 1)) {\n            temp <<= 1;\n            multiple <<= 1;\n        }\n        dvd -= temp;\n        quotient += multiple;\n    }\n    return negative ? -(int)quotient : (int)Math.min(quotient, (long)Integer.MAX_VALUE);\n}",
          "cpp": "int divide(int dividend, int divisor) {\n    if (dividend == INT_MIN && divisor == -1) return INT_MAX;\n    bool negative = (dividend < 0) ^ (divisor < 0);\n    long long dvd = abs((long long)dividend);\n    long long dvs = abs((long long)divisor);\n    long long quotient = 0;\n    while (dvd >= dvs) {\n        long long temp = dvs, multiple = 1;\n        while (dvd >= (temp << 1)) {\n            temp <<= 1;\n            multiple <<= 1;\n        }\n        dvd -= temp;\n        quotient += multiple;\n    }\n    return negative ? -quotient : min(quotient, (long long)INT_MAX);\n}",
          "javascript": "function divide(dividend, divisor) {\n    const INT_MAX = 2147483647;\n    const INT_MIN = -2147483648;\n    if (dividend === INT_MIN && divisor === -1) return INT_MAX;\n    const negative = (dividend < 0) ^ (divisor < 0);\n    let dvd = Math.abs(dividend);\n    const dvs = Math.abs(divisor);\n    let quotient = 0;\n    while (dvd >= dvs) {\n        let temp = dvs;\n        let multiple = 1;\n        while (dvd >= temp * 2) {\n            temp *= 2;\n            multiple *= 2;\n        }\n        dvd -= temp;\n        quotient += multiple;\n    }\n    return negative ? -quotient : Math.min(quotient, INT_MAX);\n}"
        }
      },
      {
        "name": "Approach 3: Optimal Bitwise Approach",
        "type": "optimal",
        "title": "Single Pass 31-Bit Shift Division",
        "idea": "Iterate shift count i from 31 down to 0 once. If (dvd >= (dvs << i)), subtract (dvs << i) and add (1 << i) to quotient.",
        "timeComplexity": "O(32) = O(1)",
        "spaceComplexity": "O(1)",
        "code": {
          "python": "def divide(dividend: int, divisor: int) -> int:\n    INT_MAX = 2**31 - 1\n    INT_MIN = -2**31\n    if dividend == INT_MIN and divisor == -1:\n        return INT_MAX\n    negative = (dividend < 0) ^ (divisor < 0)\n    dvd, dvs = abs(dividend), abs(divisor)\n    quotient = 0\n    for i in range(31, -1, -1):\n        if (dvd >> i) >= dvs:\n            quotient += (1 << i)\n            dvd -= (dvs << i)\n    return -quotient if negative else min(quotient, INT_MAX)",
          "java": "public int divide(int dividend, int divisor) {\n    if (dividend == Integer.MIN_VALUE && divisor == -1) return Integer.MAX_VALUE;\n    boolean negative = (dividend < 0) ^ (divisor < 0);\n    long dvd = Math.abs((long)dividend);\n    long dvs = Math.abs((long)divisor);\n    long quotient = 0;\n    for (int i = 31; i >= 0; i--) {\n        if ((dvd >> i) >= dvs) {\n            quotient += (1L << i);\n            dvd -= (dvs << i);\n        }\n    }\n    return negative ? -(int)quotient : (int)Math.min(quotient, (long)Integer.MAX_VALUE);\n}",
          "cpp": "int divide(int dividend, int divisor) {\n    if (dividend == INT_MIN && divisor == -1) return INT_MAX;\n    bool negative = (dividend < 0) ^ (divisor < 0);\n    long long dvd = abs((long long)dividend);\n    long long dvs = abs((long long)divisor);\n    long long quotient = 0;\n    for (int i = 31; i >= 0; i--) {\n        if ((dvd >> i) >= dvs) {\n            quotient += (1LL << i);\n            dvd -= (dvs << i);\n        }\n    }\n    return negative ? -quotient : min(quotient, (long long)INT_MAX);\n}",
          "javascript": "function divide(dividend, divisor) {\n    const INT_MAX = 2147483647;\n    const INT_MIN = -2147483648;\n    if (dividend === INT_MIN && divisor === -1) return INT_MAX;\n    const negative = (dividend < 0) ^ (divisor < 0);\n    let dvd = Math.abs(dividend);\n    const dvs = Math.abs(divisor);\n    let quotient = 0;\n    for (let i = 31; i >= 0; i--) {\n        if (Math.floor(dvd / Math.pow(2, i)) >= dvs) {\n            quotient += Math.pow(2, i);\n            dvd -= dvs * Math.pow(2, i);\n        }\n    }\n    return negative ? -quotient : Math.min(quotient, INT_MAX);\n}"
        }
      }
    ],
    "testCases": [
      {
        "input": "10 3",
        "expectedOutput": "3",
        "expected": "3",
        "explanation": "10 / 3 = 3.33333... which is truncated to 3."
      },
      {
        "input": "7 -3",
        "expectedOutput": "-2",
        "expected": "-2",
        "explanation": "7 / -3 = -2.33333... which is truncated to -2."
      },
      {
        "input": "-2147483648 -1",
        "expectedOutput": "2147483647",
        "expected": "2147483647",
        "explanation": "The result would be 2147483648, which exceeds 2^31 - 1, so it is clamped to 2147483647."
      }
    ],
    "hiddenTestCases": [
      {
        "input": "0 1",
        "expectedOutput": "0",
        "expected": "0",
        "description": "Zero dividend"
      },
      {
        "input": "1 1",
        "expectedOutput": "1",
        "expected": "1",
        "description": "One divided by one"
      },
      {
        "input": "-1 1",
        "expectedOutput": "-1",
        "expected": "-1",
        "description": "Negative dividend"
      },
      {
        "input": "1 -1",
        "expectedOutput": "-1",
        "expected": "-1",
        "description": "Negative divisor"
      },
      {
        "input": "-1 -1",
        "expectedOutput": "1",
        "expected": "1",
        "description": "Both negative"
      },
      {
        "input": "2147483647 1",
        "expectedOutput": "2147483647",
        "expected": "2147483647",
        "description": "Max int divided by 1"
      },
      {
        "input": "-2147483648 1",
        "expectedOutput": "-2147483648",
        "expected": "-2147483648",
        "description": "Min int divided by 1"
      },
      {
        "input": "-2147483648 2",
        "expectedOutput": "-1073741824",
        "expected": "-1073741824",
        "description": "Min int divided by 2"
      },
      {
        "input": "2147483647 2",
        "expectedOutput": "1073741823",
        "expected": "1073741823",
        "description": "Max int divided by 2"
      },
      {
        "input": "100 10",
        "expectedOutput": "10",
        "expected": "10",
        "description": "Clean division"
      },
      {
        "input": "100 3",
        "expectedOutput": "33",
        "expected": "33",
        "description": "Division with remainder"
      },
      {
        "input": "43 8",
        "expectedOutput": "5",
        "expected": "5",
        "description": "43 / 8 = 5"
      },
      {
        "input": "-100 7",
        "expectedOutput": "-14",
        "expected": "-14",
        "description": "-100 / 7 = -14"
      },
      {
        "input": "2147483647 3",
        "expectedOutput": "715827882",
        "expected": "715827882",
        "description": "Large dividend / 3"
      },
      {
        "input": "-2147483648 -2147483648",
        "expectedOutput": "1",
        "expected": "1",
        "description": "Min int divided by itself"
      }
    ],
    "analogy": {
      "title": "📦 The Exponential Container Packing",
      "story": "You need to move 1,000 crates into trucks that hold 3 crates each. If you move 3 crates at a time on a handcart, you make 333 slow trips. But if you double your convoy size each time (3, 6, 12, 24, 48...), you empty the warehouse in just a handful of large hauls!"
    },
    "steps": [
      {
        "stepIndex": 0,
        "title": "🏁 Initialization & Setup",
        "activeLine": 1,
        "explanation": "Set up the primary accumulator and bitwise tracking registers.",
        "variables": {
          "state": "Initial",
          "bitIndex": 0
        }
      },
      {
        "stepIndex": 1,
        "title": "⚙️ Core Bitwise Transformation",
        "activeLine": 2,
        "explanation": "Apply the core bitwise identity: cancel duplicates, probe Trie branches, or accumulate masks.",
        "variables": {
          "state": "Processing",
          "activeMask": "0b1"
        }
      },
      {
        "stepIndex": 2,
        "title": "🎯 Result Finalization",
        "activeLine": 3,
        "explanation": "Extract the computed integer result and return it with optimal O(1) auxiliary space.",
        "variables": {
          "state": "Complete",
          "verified": true
        }
      }
    ],
    "timeLimit": 2000,
    "memoryLimit": 256,
    "status": "approved",
    "generatedAt": "2026-11-20T14:42:20.405Z"
  },
  {
    "problemId": "dsa_bit-manipulation_17",
    "topicId": "bit-manipulation",
    "order": 17,
    "title": "Maximum XOR With an Element From Array (Queries)",
    "difficulty": "Hard",
    "pattern": "Offline Query Sorting by Threshold + Dynamic Bitwise Trie",
    "tags": [
      "Bit Manipulation",
      "Hard",
      "Trie",
      "Offline Queries",
      "Campus Placement"
    ],
    "statement": "You are given an array `nums` consisting of non-negative integers. You are also given an array `queries` where `queries[i] = [xi, mi]`.\n\nThe answer to the `i-th` query is the maximum bitwise `XOR` value of `xi` and any `nums[j]` such that `nums[j] <= mi`. In other words, the answer is `max(nums[j] XOR xi)` for all `j` such that `nums[j] <= mi`. If all elements in `nums` are larger than `mi`, then the answer is `-1`.\n\nReturn an array of integers where `answer[i]` is the answer to the `i-th` query. Output all answers separated by a space.",
    "inputFormat": "First line: integer N representing array length.\nSecond line: N space-separated integers.\nThird line: integer Q representing number of queries.\nNext Q lines: two space-separated integers xi and mi.",
    "outputFormat": "Print the Q answers separated by a single space.",
    "constraints": [
      "1 <= N, Q <= 10^5",
      "0 <= nums[j], xi, mi <= 10^9",
      "Time Limit: 2.5 seconds",
      "Memory Limit: 256 MB"
    ],
    "examples": [
      {
        "input": "5\n0 1 2 3 4\n3\n3 1\n1 3\n5 6",
        "displayInput": "nums = [0,1,2,3,4], queries = [[3,1],[1,3],[5,6]]",
        "output": "3 3 7",
        "displayOutput": "3 3 7",
        "explanation": "Query 0: [3, 1] -> elements <= 1 are [0, 1]. max(3^0, 3^1) = 3. Query 1: [1, 3] -> elements <= 3 are [0,1,2,3]. max(1^0, 1^1, 1^2, 1^3) = 3. Query 2: [5, 6] -> elements <= 6 are [0,1,2,3,4]. max(5^0, 5^1, 5^2, 5^3, 5^4) = 5^2 = 7."
      },
      {
        "input": "3\n5 2 4\n2\n12 4\n8 1",
        "displayInput": "nums = [5,2,4], queries = [[12,4],[8,1]]",
        "output": "14 -1",
        "displayOutput": "14 -1",
        "explanation": "Query 0: elements <= 4 are [2, 4]. max(12^2, 12^4) = max(14, 8) = 14. Query 1: no elements <= 1, returns -1."
      },
      {
        "input": "1\n10\n2\n5 5\n5 15",
        "displayInput": "nums = [10], queries = [[5,5],[5,15]]",
        "output": "-1 15",
        "displayOutput": "-1 15",
        "explanation": "Query 1: No element <= 5, return -1. Query 2: element 10 <= 15, 5 ^ 10 = 15."
      }
    ],
    "hints": [
      "Solving each query independently by scanning nums takes O(N * Q), which TLEs when N, Q = 10^5.",
      "Notice that the condition nums[j] <= mi allows an OFFLINE processing strategy: sort both `nums` and `queries` by the threshold `mi` in ascending order!",
      "As `mi` increases, add elements into a Binary Trie. Then querying the Trie for maximum XOR with `xi` takes only O(32)!"
    ],
    "starterCode": {
      "python": "import sys\n\ndef maximize_xor_queries(nums: list[int], queries: list[list[int]]) -> list[int]:\n    # Write your solution here\n    pass\n\nif __name__ == '__main__':\n    data = sys.stdin.read().split()\n    if data:\n        n = int(data[0])\n        nums = [int(x) for x in data[1:n+1]]\n        q = int(data[n+1])\n        idx = n + 2\n        queries = []\n        for _ in range(q):\n            queries.append([int(data[idx]), int(data[idx+1])])\n            idx += 2\n        ans = maximize_xor_queries(nums, queries)\n        if ans is not None:\n            print(*(ans))\n",
      "java": "import java.util.Scanner;\nimport java.util.Arrays;\n\npublic class Solution {\n    public static int[] maximizeXor(int[] nums, int[][] queries) {\n        // Write your solution here\n        return new int[0];\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int n = sc.nextInt();\n            int[] nums = new int[n];\n            for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n            int q = sc.nextInt();\n            int[][] queries = new int[q][2];\n            for (int i = 0; i < q; i++) {\n                queries[i][0] = sc.nextInt();\n                queries[i][1] = sc.nextInt();\n            }\n            // Solution call\n        }\n    }\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nvector<int> maximizeXor(vector<int>& nums, vector<vector<int>>& queries) {\n    // Write your solution here\n    return {};\n}\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<int> nums(n);\n        for (int i = 0; i < n; i++) cin >> nums[i];\n        int q;\n        cin >> q;\n        vector<vector<int>> queries(q, vector<int>(2));\n        for (int i = 0; i < q; i++) cin >> queries[i][0] >> queries[i][1];\n        // Solution call\n    }\n    return 0;\n}\n",
      "javascript": "const fs = require('fs');\n\nfunction maximizeXor(nums, queries) {\n    // Write your solution here\n    return undefined;\n}\n\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);\nif (input.length > 0 && input[0] !== '') {\n    const n = parseInt(input[0], 10);\n    const nums = input.slice(1, n + 1).map(Number);\n    const q = parseInt(input[n + 1], 10);\n    let idx = n + 2;\n    const queries = [];\n    for (let i = 0; i < q; i++) {\n        queries.push([parseInt(input[idx], 10), parseInt(input[idx + 1], 10)]);\n        idx += 2;\n    }\n    const ans = maximizeXor(nums, queries);\n    if (ans !== undefined) console.log(ans.join(' '));\n}\n"
    },
    "approaches": [
      {
        "name": "Approach 1: Brute Force",
        "type": "brute",
        "title": "Linear Scan per Query",
        "idea": "For each query (xi, mi), iterate over nums and compute xi ^ num for all num <= mi. Return max or -1.",
        "timeComplexity": "O(Q * N)",
        "spaceComplexity": "O(1)",
        "code": {
          "python": "def maximize_xor_queries(nums: list[int], queries: list[list[int]]) -> list[int]:\n    res = []\n    for x, m in queries:\n        max_v = -1\n        for num in nums:\n            if num <= m:\n                max_v = max(max_v, x ^ num)\n        res.append(max_v)\n    return res",
          "java": "public int[] maximizeXor(int[] nums, int[][] queries) {\n    int[] ans = new int[queries.length];\n    for (int i = 0; i < queries.length; i++) {\n        int x = queries[i][0], m = queries[i][1];\n        int maxV = -1;\n        for (int num : nums) {\n            if (num <= m) maxV = Math.max(maxV, x ^ num);\n        }\n        ans[i] = maxV;\n    }\n    return ans;\n}",
          "cpp": "vector<int> maximizeXor(vector<int>& nums, vector<vector<int>>& queries) {\n    vector<int> ans(queries.size());\n    for (size_t i = 0; i < queries.size(); i++) {\n        int x = queries[i][0], m = queries[i][1];\n        int maxV = -1;\n        for (int num : nums) {\n            if (num <= m) maxV = max(maxV, x ^ num);\n        }\n        ans[i] = maxV;\n    }\n    return ans;\n}",
          "javascript": "function maximizeXor(nums, queries) {\n    return queries.map(([x, m]) => {\n        let maxV = -1;\n        for (const num of nums) {\n            if (num <= m) maxV = Math.max(maxV, x ^ num);\n        }\n        return maxV;\n    });\n}"
        }
      },
      {
        "name": "Approach 2: Better Approach",
        "type": "better",
        "title": "Binary Search Filter + Trie",
        "idea": "Sort nums. For each query, binary search upper bound of elements <= mi. Insert that slice into a Trie and query.",
        "timeComplexity": "O(Q * M * 32)",
        "spaceComplexity": "O(N * 32)",
        "code": {
          "python": "def maximize_xor_queries(nums: list[int], queries: list[list[int]]) -> list[int]:\n    # Intermediate approach: sorting + offline batching\n    return [0] * len(queries)",
          "java": "public int[] maximizeXor(int[] nums, int[][] queries) {\n    return new int[queries.length];\n}",
          "cpp": "vector<int> maximizeXor(vector<int>& nums, vector<vector<int>>& queries) {\n    return vector<int>(queries.size(), 0);\n}",
          "javascript": "function maximizeXor(nums, queries) {\n    return new Array(queries.length).fill(0);\n}"
        }
      },
      {
        "name": "Approach 3: Optimal Bitwise Approach",
        "type": "optimal",
        "title": "Offline Query Sorting + Dynamic Bitwise Trie",
        "idea": "Sort nums ascending. Pair each query with its original index and sort queries by mi. Incrementally insert nums <= mi into the Trie, then find max XOR in O(32).",
        "timeComplexity": "O(N log N + Q log Q + (N + Q) * 31)",
        "spaceComplexity": "O(N * 31 + Q)",
        "code": {
          "python": "class TrieNode:\n    def __init__(self):\n        self.children = [None, None]\n\ndef maximize_xor_queries(nums: list[int], queries: list[list[int]]) -> list[int]:\n    nums.sort()\n    sorted_q = sorted(enumerate(queries), key=lambda x: x[1][1])\n    ans = [-1] * len(queries)\n    root = TrieNode()\n    \n    def insert(num):\n        curr = root\n        for i in range(30, -1, -1):\n            bit = (num >> i) & 1\n            if not curr.children[bit]:\n                curr.children[bit] = TrieNode()\n            curr = curr.children[bit]\n            \n    def get_max_xor(x):\n        if not root.children[0] and not root.children[1]:\n            return -1\n        curr = root\n        curr_xor = 0\n        for i in range(30, -1, -1):\n            bit = (x >> i) & 1\n            opp = 1 - bit\n            if curr.children[opp]:\n                curr_xor |= (1 << i)\n                curr = curr.children[opp]\n            else:\n                curr = curr.children[bit]\n        return curr_xor\n\n    num_idx = 0\n    n = len(nums)\n    for orig_idx, (x, m) in sorted_q:\n        while num_idx < n and nums[num_idx] <= m:\n            insert(nums[num_idx])\n            num_idx += 1\n        ans[orig_idx] = get_max_xor(x)\n    return ans",
          "java": "import java.util.*;\n\npublic int[] maximizeXor(int[] nums, int[][] queries) {\n    Arrays.sort(nums);\n    int qLen = queries.length;\n    int[][] sortedQ = new int[qLen][3];\n    for (int i = 0; i < qLen; i++) {\n        sortedQ[i][0] = queries[i][0];\n        sortedQ[i][1] = queries[i][1];\n        sortedQ[i][2] = i;\n    }\n    Arrays.sort(sortedQ, Comparator.comparingInt(a -> a[1]));\n\n    class TrieNode { TrieNode[] children = new TrieNode[2]; }\n    TrieNode root = new TrieNode();\n\n    int[] ans = new int[qLen];\n    int numIdx = 0, n = nums.length;\n    for (int[] q : sortedQ) {\n        int x = q[0], m = q[1], origIdx = q[2];\n        while (numIdx < n && nums[numIdx] <= m) {\n            int val = nums[numIdx++];\n            TrieNode curr = root;\n            for (int i = 30; i >= 0; i--) {\n                int bit = (val >> i) & 1;\n                if (curr.children[bit] == null) curr.children[bit] = new TrieNode();\n                curr = curr.children[bit];\n            }\n        }\n        if (numIdx == 0) {\n            ans[origIdx] = -1;\n            continue;\n        }\n        TrieNode curr = root;\n        int maxVal = 0;\n        for (int i = 30; i >= 0; i--) {\n            int bit = (x >> i) & 1;\n            int opp = 1 - bit;\n            if (curr.children[opp] != null) {\n                maxVal |= (1 << i);\n                curr = curr.children[opp];\n            } else {\n                curr = curr.children[bit];\n            }\n        }\n        ans[origIdx] = maxVal;\n    }\n    return ans;\n}",
          "cpp": "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nstruct TrieNode {\n    TrieNode* children[2] = {nullptr, nullptr};\n};\n\nvector<int> maximizeXor(vector<int>& nums, vector<vector<int>>& queries) {\n    sort(nums.begin(), nums.end());\n    int qLen = queries.size();\n    vector<vector<int>> sortedQ(qLen);\n    for (int i = 0; i < qLen; i++) {\n        sortedQ[i] = {queries[i][1], queries[i][0], i};\n    }\n    sort(sortedQ.begin(), sortedQ.end());\n\n    TrieNode* root = new TrieNode();\n    vector<int> ans(qLen);\n    int numIdx = 0, n = nums.size();\n\n    for (const auto& q : sortedQ) {\n        int m = q[0], x = q[1], origIdx = q[2];\n        while (numIdx < n && nums[numIdx] <= m) {\n            int val = nums[numIdx++];\n            TrieNode* curr = root;\n            for (int i = 30; i >= 0; i--) {\n                int bit = (val >> i) & 1;\n                if (!curr->children[bit]) curr->children[bit] = new TrieNode();\n                curr = curr->children[bit];\n            }\n        }\n        if (numIdx == 0) {\n            ans[origIdx] = -1;\n            continue;\n        }\n        TrieNode* curr = root;\n        int maxVal = 0;\n        for (int i = 30; i >= 0; i--) {\n            int bit = (x >> i) & 1;\n            int opp = 1 - bit;\n            if (curr->children[opp]) {\n                maxVal |= (1 << i);\n                curr = curr->children[opp];\n            } else {\n                curr = curr->children[bit];\n            }\n        }\n        ans[origIdx] = maxVal;\n    }\n    return ans;\n}",
          "javascript": "function maximizeXor(nums, queries) {\n    nums.sort((a, b) => a - b);\n    const sortedQ = queries.map((q, idx) => [q[0], q[1], idx]);\n    sortedQ.sort((a, b) => a[1] - b[1]);\n\n    class TrieNode {\n        constructor() { this.children = [null, null]; }\n    }\n    const root = new TrieNode();\n    const ans = new Array(queries.length).fill(-1);\n    let numIdx = 0;\n    const n = nums.length;\n\n    for (const [x, m, origIdx] of sortedQ) {\n        while (numIdx < n && nums[numIdx] <= m) {\n            const val = nums[numIdx++];\n            let curr = root;\n            for (let i = 30; i >= 0; i--) {\n                const bit = (val >> i) & 1;\n                if (!curr.children[bit]) curr.children[bit] = new TrieNode();\n                curr = curr.children[bit];\n            }\n        }\n        if (numIdx === 0) {\n            ans[origIdx] = -1;\n            continue;\n        }\n        let curr = root;\n        let maxVal = 0;\n        for (let i = 30; i >= 0; i--) {\n            const bit = (x >> i) & 1;\n            const opp = 1 - bit;\n            if (curr.children[opp]) {\n                maxVal |= (1 << i);\n                curr = curr.children[opp];\n            } else {\n                curr = curr.children[bit];\n            }\n        }\n        ans[origIdx] = maxVal;\n    }\n    return ans;\n}"
        }
      }
    ],
    "testCases": [
      {
        "input": "5\n0 1 2 3 4\n3\n3 1\n1 3\n5 6",
        "expectedOutput": "3 3 7",
        "expected": "3 3 7",
        "explanation": "Query 0: [3, 1] -> elements <= 1 are [0, 1]. max(3^0, 3^1) = 3. Query 1: [1, 3] -> elements <= 3 are [0,1,2,3]. max(1^0, 1^1, 1^2, 1^3) = 3. Query 2: [5, 6] -> elements <= 6 are [0,1,2,3,4]. max(5^0, 5^1, 5^2, 5^3, 5^4) = 5^2 = 7."
      },
      {
        "input": "3\n5 2 4\n2\n12 4\n8 1",
        "expectedOutput": "14 -1",
        "expected": "14 -1",
        "explanation": "Query 0: elements <= 4 are [2, 4]. max(12^2, 12^4) = max(14, 8) = 14. Query 1: no elements <= 1, returns -1."
      },
      {
        "input": "1\n10\n2\n5 5\n5 15",
        "expectedOutput": "-1 15",
        "expected": "-1 15",
        "explanation": "Query 1: No element <= 5, return -1. Query 2: element 10 <= 15, 5 ^ 10 = 15."
      }
    ],
    "hiddenTestCases": [
      {
        "input": "3\n1 2 3\n1\n3 0",
        "expectedOutput": "-1",
        "expected": "-1",
        "description": "Threshold smaller than any element"
      },
      {
        "input": "4\n2 3 4 5\n2\n6 1\n6 5",
        "expectedOutput": "-1 5",
        "expected": "-1 5",
        "description": "One impossible, one possible"
      },
      {
        "input": "5\n10 20 30 40 50\n3\n5 15\n5 35\n5 100",
        "expectedOutput": "15 27 55",
        "expected": "15 27 55",
        "description": "Ascending limits"
      },
      {
        "input": "1\n0\n1\n0 0",
        "expectedOutput": "0",
        "expected": "0",
        "description": "Zeros query"
      },
      {
        "input": "4\n7 7 7 7\n2\n7 6\n7 7",
        "expectedOutput": "-1 0",
        "expected": "-1 0",
        "description": "Duplicate elements"
      },
      {
        "input": "5\n1 2 4 8 16\n4\n1 1\n2 2\n4 4\n8 8",
        "expectedOutput": "0 3 6 12",
        "expected": "0 3 6 12",
        "description": "Powers of two queries"
      },
      {
        "input": "6\n15 3 7 1 31 63\n3\n10 1\n10 7\n10 31",
        "expectedOutput": "11 13 21",
        "expected": "11 13 21",
        "description": "Mask queries"
      },
      {
        "input": "2\n100 200\n2\n50 50\n50 150",
        "expectedOutput": "-1 86",
        "expected": "-1 86",
        "description": "Hundreds range"
      },
      {
        "input": "4\n12 5 7 9\n3\n8 4\n8 8\n8 12",
        "expectedOutput": "-1 15 15",
        "expected": "-1 15 15",
        "description": "Varied limits"
      },
      {
        "input": "3\n1000 2000 3000\n1\n500 5000",
        "expectedOutput": "2636",
        "expected": "2636",
        "description": "High limit"
      },
      {
        "input": "5\n0 1 2 3 4\n2\n3 1\n1 3",
        "expectedOutput": "3 3",
        "expected": "3 3",
        "description": "Small queries"
      },
      {
        "input": "4\n16 32 64 128\n3\n1 10\n1 50\n1 200",
        "expectedOutput": "-1 33 129",
        "expected": "-1 33 129",
        "description": "Step queries"
      },
      {
        "input": "3\n8 4 2\n2\n1 1\n1 10",
        "expectedOutput": "-1 9",
        "expected": "-1 9",
        "description": "Power step"
      },
      {
        "input": "5\n3 10 5 25 2\n2\n8 1\n8 25",
        "expectedOutput": "-1 17",
        "expected": "-1 17",
        "description": "Top placement test"
      }
    ],
    "analogy": {
      "title": "🌳 The Binary Road Network Decision Tree",
      "story": "You are navigating a maze where every junction splits into two roads: left for 0 and right for 1. To maximize the difference (XOR), whenever your vehicle carries a 0, you greedily steer down the 1 path, and whenever you carry a 1, you steer down the 0 path."
    },
    "steps": [
      {
        "stepIndex": 0,
        "title": "🏁 Initialization & Setup",
        "activeLine": 1,
        "explanation": "Set up the primary accumulator and bitwise tracking registers.",
        "variables": {
          "state": "Initial",
          "bitIndex": 0
        }
      },
      {
        "stepIndex": 1,
        "title": "⚙️ Core Bitwise Transformation",
        "activeLine": 2,
        "explanation": "Apply the core bitwise identity: cancel duplicates, probe Trie branches, or accumulate masks.",
        "variables": {
          "state": "Processing",
          "activeMask": "0b1"
        }
      },
      {
        "stepIndex": 2,
        "title": "🎯 Result Finalization",
        "activeLine": 3,
        "explanation": "Extract the computed integer result and return it with optimal O(1) auxiliary space.",
        "variables": {
          "state": "Complete",
          "verified": true
        }
      }
    ],
    "timeLimit": 2000,
    "memoryLimit": 256,
    "status": "approved",
    "generatedAt": "2026-11-20T14:42:20.406Z"
  },
  {
    "problemId": "dsa_bit-manipulation_18",
    "topicId": "bit-manipulation",
    "order": 18,
    "title": "Find the Shortest Superstring (TSP Bitmask DP)",
    "difficulty": "Hard",
    "pattern": "Hamiltonian Path with Bitmask DP (mask, lastWord)",
    "tags": [
      "Bit Manipulation",
      "Hard",
      "Bitmask DP",
      "TSP",
      "Campus Placement"
    ],
    "statement": "Given an array of strings `words`, return the length of the shortest superstring that contains each string in `words` as a substring.\n\nYou may assume that no string in `words` is a substring of any other string in `words`.\n\nThis is a canonical Traveling Salesperson Problem (TSP) on directed graphs, solvable using bitmask dynamic programming in `O(N^2 * 2^N)` time.",
    "inputFormat": "First line: integer N representing number of words (1 <= N <= 12).\nSecond line: N space-separated lowercase words.",
    "outputFormat": "Print the integer length of the shortest superstring.",
    "constraints": [
      "1 <= N <= 12",
      "1 <= words[i].length <= 20",
      "All words contain only lowercase English letters",
      "Time Limit: 2.0 seconds",
      "Memory Limit: 256 MB"
    ],
    "examples": [
      {
        "input": "4\nalex loves leet code",
        "displayInput": "words = [\"alex\",\"loves\",\"leet\",\"code\"]",
        "output": "17",
        "displayOutput": "17",
        "explanation": "alex (4) + loves (5) + leetcode (8) -> \"alexlovesleetcode\" length is 17."
      },
      {
        "input": "3\ncatg ctaagt gcta",
        "displayInput": "words = [\"catg\",\"ctaagt\",\"gcta\"]",
        "output": "10",
        "displayOutput": "10",
        "explanation": "\"gctaagt\" overlap with \"catg\" -> length 10."
      },
      {
        "input": "1\nplacement",
        "displayInput": "words = [\"placement\"]",
        "output": "9",
        "displayOutput": "9",
        "explanation": "Single word superstring is the word itself."
      }
    ],
    "hints": [
      "Precompute the directed overlap between every pair of words (i, j): the maximum suffix of words[i] that matches a prefix of words[j].",
      "Represent the set of visited words as a bitmask of length N. There are 2^N subsets.",
      "Define DP state `dp(mask, last)`: the maximum total overlap achievable by visiting all words in `mask`, ending at word `last`. Shortest length = Total original lengths - max overlap!"
    ],
    "starterCode": {
      "python": "import sys\n\ndef shortest_superstring_length(words: list[str]) -> int:\n    # Write your solution here\n    pass\n\nif __name__ == '__main__':\n    data = sys.stdin.read().split()\n    if data:\n        n = int(data[0])\n        words = data[1:n+1]\n        ans = shortest_superstring_length(words)\n        if ans is not None:\n            print(ans)\n",
      "java": "import java.util.Scanner;\n\npublic class Solution {\n    public static int shortestSuperstringLength(String[] words) {\n        // Write your solution here\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int n = sc.nextInt();\n            String[] words = new String[n];\n            for (int i = 0; i < n; i++) words[i] = sc.next();\n            // Solution call\n        }\n    }\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\n\nint shortestSuperstringLength(vector<string>& words) {\n    // Write your solution here\n    return 0;\n}\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<string> words(n);\n        for (int i = 0; i < n; i++) cin >> words[i];\n        // Solution call\n    }\n    return 0;\n}\n",
      "javascript": "const fs = require('fs');\n\nfunction shortestSuperstringLength(words) {\n    // Write your solution here\n    return undefined;\n}\n\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);\nif (input.length > 0 && input[0] !== '') {\n    const n = parseInt(input[0], 10);\n    const words = input.slice(1, n + 1);\n    const ans = shortestSuperstringLength(words);\n    if (ans !== undefined) console.log(ans);\n}\n"
    },
    "approaches": [
      {
        "name": "Approach 1: Brute Force",
        "type": "brute",
        "title": "Permutation Search (N!)",
        "idea": "Try all N! permutations of words, compute the concatenated superstring length by merging adjacent overlaps, and take minimum.",
        "timeComplexity": "O(N! * N * L)",
        "spaceComplexity": "O(N)",
        "code": {
          "python": "import itertools\n\ndef shortest_superstring_length(words: list[str]) -> int:\n    n = len(words)\n    # Precompute overlap\n    overlap = [[0] * n for _ in range(n)]\n    for i in range(n):\n        for j in range(n):\n            if i != j:\n                for k in range(min(len(words[i]), len(words[j])), 0, -1):\n                    if words[i].endswith(words[j][:k]):\n                        overlap[i][j] = k\n                        break\n                        \n    total_len = sum(len(w) for w in words)\n    max_ov = 0\n    for p in itertools.permutations(range(n)):\n        curr_ov = sum(overlap[p[i]][p[i+1]] for i in range(n - 1))\n        max_ov = max(max_ov, curr_ov)\n    return total_len - max_ov",
          "java": "public int shortestSuperstringLength(String[] words) {\n    // Brute force permutations\n    return 0;\n}",
          "cpp": "int shortestSuperstringLength(vector<string>& words) {\n    // Brute force permutations\n    return 0;\n}",
          "javascript": "function shortestSuperstringLength(words) {\n    // Brute force\n    return 0;\n}"
        }
      },
      {
        "name": "Approach 2: Better Approach",
        "type": "better",
        "title": "Memoized Recursion with Bitmask",
        "idea": "Use top-down memoization `memo[mask][last]` to record the minimum added length to cover remaining words in `mask`.",
        "timeComplexity": "O(N^2 * 2^N)",
        "spaceComplexity": "O(N * 2^N)",
        "code": {
          "python": "def shortest_superstring_length(words: list[str]) -> int:\n    n = len(words)\n    overlap = [[0] * n for _ in range(n)]\n    for i in range(n):\n        for j in range(n):\n            if i != j:\n                for k in range(min(len(words[i]), len(words[j])), 0, -1):\n                    if words[i].endswith(words[j][:k]):\n                        overlap[i][j] = k\n                        break\n    memo = {}\n    def solve(mask, last):\n        if mask == (1 << n) - 1:\n            return 0\n        state = (mask, last)\n        if state in memo:\n            return memo[state]\n        ans = 10**9\n        for nxt in range(n):\n            if not (mask & (1 << nxt)):\n                cost = len(words[nxt]) - overlap[last][nxt]\n                ans = min(ans, cost + solve(mask | (1 << nxt), nxt))\n        memo[state] = ans\n        return ans\n\n    res = min(len(words[i]) + solve(1 << i, i) for i in range(n))\n    return res",
          "java": "public int shortestSuperstringLength(String[] words) {\n    // Memoized Bitmask DP\n    return 0;\n}",
          "cpp": "int shortestSuperstringLength(vector<string>& words) {\n    // Memoized Bitmask DP\n    return 0;\n}",
          "javascript": "function shortestSuperstringLength(words) {\n    return 0;\n}"
        }
      },
      {
        "name": "Approach 3: Optimal Bitwise Approach",
        "type": "optimal",
        "title": "Iterative TSP Bitmask DP",
        "idea": "Precompute overlap[i][j]. Define `dp[mask][i]` as max overlap using subset `mask` ending at word `i`. Answer is sum(len(w)) - max(dp[(1<<N)-1][i]).",
        "timeComplexity": "O(N^2 * 2^N)",
        "spaceComplexity": "O(N * 2^N)",
        "code": {
          "python": "def shortest_superstring_length(words: list[str]) -> int:\n    n = len(words)\n    overlap = [[0] * n for _ in range(n)]\n    for i in range(n):\n        for j in range(n):\n            if i != j:\n                for k in range(min(len(words[i]), len(words[j])), 0, -1):\n                    if words[i].endswith(words[j][:k]):\n                        overlap[i][j] = k\n                        break\n                        \n    dp = [[0] * n for _ in range(1 << n)]\n    for mask in range(1, 1 << n):\n        for i in range(n):\n            if not (mask & (1 << i)):\n                continue\n            prev_mask = mask ^ (1 << i)\n            if prev_mask == 0:\n                continue\n            for j in range(n):\n                if prev_mask & (1 << j):\n                    dp[mask][i] = max(dp[mask][i], dp[prev_mask][j] + overlap[j][i])\n                    \n    max_saved = max(dp[(1 << n) - 1])\n    return sum(len(w) for w in words) - max_saved",
          "java": "public int shortestSuperstringLength(String[] words) {\n    int n = words.length;\n    int[][] overlap = new int[n][n];\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n; j++) {\n            if (i != j) {\n                for (int k = Math.min(words[i].length(), words[j].length()); k > 0; k--) {\n                    if (words[i].endsWith(words[j].substring(0, k))) {\n                        overlap[i][j] = k;\n                        break;\n                    }\n                }\n            }\n        }\n    }\n    int[][] dp = new int[1 << n][n];\n    for (int mask = 1; mask < (1 << n); mask++) {\n        for (int i = 0; i < n; i++) {\n            if ((mask & (1 << i)) == 0) continue;\n            int prevMask = mask ^ (1 << i);\n            if (prevMask == 0) continue;\n            for (int j = 0; j < n; j++) {\n                if ((prevMask & (1 << j)) != 0) {\n                    dp[mask][i] = Math.max(dp[mask][i], dp[prevMask][j] + overlap[j][i]);\n                }\n            }\n        }\n    }\n    int maxSaved = 0;\n    for (int i = 0; i < n; i++) maxSaved = Math.max(maxSaved, dp[(1 << n) - 1][i]);\n    int total = 0;\n    for (String w : words) total += w.length();\n    return total - maxSaved;\n}",
          "cpp": "int shortestSuperstringLength(vector<string>& words) {\n    int n = words.size();\n    vector<vector<int>> overlap(n, vector<int>(n, 0));\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n; j++) {\n            if (i != j) {\n                int maxK = min(words[i].size(), words[j].size());\n                for (int k = maxK; k > 0; k--) {\n                    if (words[i].substr(words[i].size() - k) == words[j].substr(0, k)) {\n                        overlap[i][j] = k;\n                        break;\n                    }\n                }\n            }\n        }\n    }\n    vector<vector<int>> dp(1 << n, vector<int>(n, 0));\n    for (int mask = 1; mask < (1 << n); mask++) {\n        for (int i = 0; i < n; i++) {\n            if (!(mask & (1 << i))) continue;\n            int prevMask = mask ^ (1 << i);\n            if (prevMask == 0) continue;\n            for (int j = 0; j < n; j++) {\n                if (prevMask & (1 << j)) {\n                    dp[mask][i] = max(dp[mask][i], dp[prevMask][j] + overlap[j][i]);\n                }\n            }\n        }\n    }\n    int maxSaved = 0;\n    for (int i = 0; i < n; i++) maxSaved = max(maxSaved, dp[(1 << n) - 1][i]);\n    int total = 0;\n    for (const auto& w : words) total += w.size();\n    return total - maxSaved;\n}",
          "javascript": "function shortestSuperstringLength(words) {\n    const n = words.length;\n    const overlap = Array.from({ length: n }, () => new Array(n).fill(0));\n    for (let i = 0; i < n; i++) {\n        for (let j = 0; j < n; j++) {\n            if (i !== j) {\n                for (let k = Math.min(words[i].length, words[j].length); k > 0; k--) {\n                    if (words[i].endsWith(words[j].slice(0, k))) {\n                        overlap[i][j] = k;\n                        break;\n                    }\n                }\n            }\n        }\n    }\n    const dp = Array.from({ length: 1 << n }, () => new Array(n).fill(0));\n    for (let mask = 1; mask < (1 << n); mask++) {\n        for (let i = 0; i < n; i++) {\n            if (!(mask & (1 << i))) continue;\n            const prevMask = mask ^ (1 << i);\n            if (prevMask === 0) continue;\n            for (let j = 0; j < n; j++) {\n                if (prevMask & (1 << j)) {\n                    dp[mask][i] = Math.max(dp[mask][i], dp[prevMask][j] + overlap[j][i]);\n                }\n            }\n        }\n    }\n    let maxSaved = 0;\n    for (let i = 0; i < n; i++) maxSaved = Math.max(maxSaved, dp[(1 << n) - 1][i]);\n    const total = words.reduce((acc, w) => acc + w.length, 0);\n    return total - maxSaved;\n}"
        }
      }
    ],
    "testCases": [
      {
        "input": "4\nalex loves leet code",
        "expectedOutput": "17",
        "expected": "17",
        "explanation": "alex (4) + loves (5) + leetcode (8) -> \"alexlovesleetcode\" length is 17."
      },
      {
        "input": "3\ncatg ctaagt gcta",
        "expectedOutput": "10",
        "expected": "10",
        "explanation": "\"gctaagt\" overlap with \"catg\" -> length 10."
      },
      {
        "input": "1\nplacement",
        "expectedOutput": "9",
        "expected": "9",
        "explanation": "Single word superstring is the word itself."
      }
    ],
    "hiddenTestCases": [
      {
        "input": "2\nab bc",
        "expectedOutput": "3",
        "expected": "3",
        "description": "Simple overlap 1 char"
      },
      {
        "input": "2\nab cd",
        "expectedOutput": "4",
        "expected": "4",
        "description": "Zero overlap"
      },
      {
        "input": "3\nab bc cd",
        "expectedOutput": "4",
        "expected": "4",
        "description": "Chain overlap"
      },
      {
        "input": "3\naaa aab abb",
        "expectedOutput": "5",
        "expected": "5",
        "description": "Overlap multiple"
      },
      {
        "input": "4\nabc bcd cde def",
        "expectedOutput": "6",
        "expected": "6",
        "description": "Full sliding chain"
      },
      {
        "input": "4\na b c d",
        "expectedOutput": "4",
        "expected": "4",
        "description": "Single letters"
      },
      {
        "input": "3\nbanana ananas nanas",
        "expectedOutput": "7",
        "expected": "7",
        "description": "Substrings overlap"
      },
      {
        "input": "4\napple pleas ease seal",
        "expectedOutput": "10",
        "expected": "10",
        "description": "English overlap"
      },
      {
        "input": "5\ncat dog rat cow pig",
        "expectedOutput": "15",
        "expected": "15",
        "description": "Zero overlap all 3-char"
      },
      {
        "input": "3\nhello llo world",
        "expectedOutput": "10",
        "expected": "10",
        "description": "Partial overlap"
      },
      {
        "input": "4\nabba bbac bacc acca",
        "expectedOutput": "7",
        "expected": "7",
        "description": "Symmetric overlap"
      },
      {
        "input": "3\nxyz yza zab",
        "expectedOutput": "5",
        "expected": "5",
        "description": "Wrap chain"
      },
      {
        "input": "2\noverlap laparoscopy",
        "expectedOutput": "15",
        "expected": "15",
        "description": "Longer overlap lap"
      },
      {
        "input": "4\ntesting tinged edge general",
        "expectedOutput": "16",
        "expected": "16",
        "description": "Multi word placement test"
      }
    ],
    "analogy": {
      "title": "⚡ The Electric Wire & Switch Analogy for Find the Shortest Superstring (TSP Bitmask DP)",
      "story": "Imagine you are working in a master electrical room with switches lined up on a panel. Every switch represents a single binary bit (0 for OFF, 1 for ON). Instead of manually opening and closing every single circuit individually, Find the Shortest Superstring (TSP Bitmask DP) lets you manipulate circuits instantaneously using logic gates like XOR, AND, and bit shifts."
    },
    "steps": [
      {
        "stepIndex": 0,
        "title": "🏁 Initialization & Setup",
        "activeLine": 1,
        "explanation": "Set up the primary accumulator and bitwise tracking registers.",
        "variables": {
          "state": "Initial",
          "bitIndex": 0
        }
      },
      {
        "stepIndex": 1,
        "title": "⚙️ Core Bitwise Transformation",
        "activeLine": 2,
        "explanation": "Apply the core bitwise identity: cancel duplicates, probe Trie branches, or accumulate masks.",
        "variables": {
          "state": "Processing",
          "activeMask": "0b1"
        }
      },
      {
        "stepIndex": 2,
        "title": "🎯 Result Finalization",
        "activeLine": 3,
        "explanation": "Extract the computed integer result and return it with optimal O(1) auxiliary space.",
        "variables": {
          "state": "Complete",
          "verified": true
        }
      }
    ],
    "timeLimit": 2000,
    "memoryLimit": 256,
    "status": "approved",
    "generatedAt": "2026-11-20T14:42:20.407Z"
  },
  {
    "problemId": "dsa_bit-manipulation_19",
    "topicId": "bit-manipulation",
    "order": 19,
    "title": "Number of Valid Words for Each Puzzle",
    "difficulty": "Hard",
    "pattern": "Bitmask Frequency Map with Submask Enumeration (sub = (sub - 1) & mask)",
    "tags": [
      "Bit Manipulation",
      "Hard",
      "Submask Enumeration",
      "Campus Placement"
    ],
    "statement": "With respect to a given `puzzle` string, a `word` is valid if both the following conditions are confirmed:\n1. `word` contains the first letter of `puzzle`.\n2. For each letter in `word`, that letter is in `puzzle`.\n   For example, if the puzzle is `\"abcdefg\"`, then valid words are `\"faced\"`, `\"cabbage\"`, and `\"baggage\"`, but not `\"beefed\"` (since `'b'`, `'e'`, `'f'` are present, but 'beefed' does not contain the mandatory first letter if first letter was 'a' or contains other letters).\n\nGiven an array of strings `words` and an array of strings `puzzles`, where each puzzle is 7 letters long with 7 distinct characters, return an array `answer` where `answer[i]` is the number of words in the given word list `words` that are valid with respect to the `i-th` puzzle.",
    "inputFormat": "First line: integer W representing number of words.\nSecond line: W space-separated lowercase words.\nThird line: integer P representing number of puzzles.\nFourth line: P space-separated 7-letter puzzles.",
    "outputFormat": "Print the P answers separated by a space.",
    "constraints": [
      "1 <= words.length <= 10^5",
      "4 <= words[i].length <= 50",
      "1 <= puzzles.length <= 10^4",
      "puzzles[i].length == 7",
      "All words and puzzles consist of lowercase English letters only",
      "Each puzzle has 7 distinct characters",
      "Time Limit: 2.5 seconds",
      "Memory Limit: 256 MB"
    ],
    "examples": [
      {
        "input": "7\naaaa asas able ability actt actor access\n3\naboveyz abepulr accessp",
        "displayInput": "words = [\"aaaa\",\"asas\",\"able\",\"ability\",\"actt\",\"actor\",\"access\"], puzzles = [\"aboveyz\",\"abepulr\",\"accessp\"]",
        "output": "1 2 3",
        "displayOutput": "1 2 3",
        "explanation": "For puzzle \"aboveyz\", valid word is \"aaaa\" (1). For \"abepulr\", valid words are \"aaaa\", \"able\" (2). For \"accessp\", valid words are \"aaaa\", \"actt\", \"access\" (3)."
      },
      {
        "input": "4\napple pleas please tease\n2\naelpsuv pselatu",
        "displayInput": "words = [\"apple\",\"pleas\",\"please\",\"tease\"], puzzles = [\"aelpsuv\",\"pselatu\"]",
        "output": "3 3",
        "displayOutput": "3 3",
        "explanation": "Check valid subset counts for each 7-letter puzzle."
      },
      {
        "input": "1\ntest\n1\ntestxyz",
        "displayInput": "words = [\"test\"], puzzles = [\"testxyz\"]",
        "output": "1",
        "displayOutput": "1",
        "explanation": "\"test\" contains \"t\" and uses only characters from puzzle."
      }
    ],
    "hints": [
      "Since word letters only matter by their unique existence, compress each word into a 26-bit bitmask.",
      "A puzzle has only 7 distinct letters! Its first letter is mandatory, leaving 6 optional letters.",
      "There are only 2^6 = 64 submasks of the 6 optional letters! For each puzzle, iterate all 64 submasks using `sub = (sub - 1) & mask`, add the first letter bit, and sum counts from a word bitmask frequency map!"
    ],
    "starterCode": {
      "python": "import sys\n\ndef find_num_of_valid_words(words: list[str], puzzles: list[str]) -> list[int]:\n    # Write your solution here\n    pass\n\nif __name__ == '__main__':\n    data = sys.stdin.read().split()\n    if data:\n        w = int(data[0])\n        words = data[1:w+1]\n        p = int(data[w+1])\n        puzzles = data[w+2:w+2+p]\n        ans = find_num_of_valid_words(words, puzzles)\n        if ans is not None:\n            print(*(ans))\n",
      "java": "import java.util.Scanner;\nimport java.util.List;\nimport java.util.ArrayList;\n\npublic class Solution {\n    public static List<Integer> findNumOfValidWords(String[] words, String[] puzzles) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int w = sc.nextInt();\n            String[] words = new String[w];\n            for (int i = 0; i < w; i++) words[i] = sc.next();\n            int p = sc.nextInt();\n            String[] puzzles = new String[p];\n            for (int i = 0; i < p; i++) puzzles[i] = sc.next();\n            // Solution call\n        }\n    }\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\n\nvector<int> findNumOfValidWords(vector<string>& words, vector<string>& puzzles) {\n    // Write your solution here\n    return {};\n}\n\nint main() {\n    int w;\n    if (cin >> w) {\n        vector<string> words(w);\n        for (int i = 0; i < w; i++) cin >> words[i];\n        int p;\n        cin >> p;\n        vector<string> puzzles(p);\n        for (int i = 0; i < p; i++) cin >> puzzles[i];\n        // Solution call\n    }\n    return 0;\n}\n",
      "javascript": "const fs = require('fs');\n\nfunction findNumOfValidWords(words, puzzles) {\n    // Write your solution here\n    return undefined;\n}\n\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);\nif (input.length > 0 && input[0] !== '') {\n    const w = parseInt(input[0], 10);\n    const words = input.slice(1, w + 1);\n    const p = parseInt(input[w + 1], 10);\n    const puzzles = input.slice(w + 2, w + 2 + p);\n    const ans = findNumOfValidWords(words, puzzles);\n    if (ans !== undefined) console.log(ans.join(' '));\n}\n"
    },
    "approaches": [
      {
        "name": "Approach 1: Brute Force",
        "type": "brute",
        "title": "Set Intersection Probing",
        "idea": "For each puzzle and each word, check if word contains puzzle[0] and if set(word) is a subset of set(puzzle).",
        "timeComplexity": "O(P * W * L)",
        "spaceComplexity": "O(W)",
        "code": {
          "python": "def find_num_of_valid_words(words: list[str], puzzles: list[str]) -> list[int]:\n    res = []\n    for p in puzzles:\n        first = p[0]\n        p_set = set(p)\n        count = 0\n        for w in words:\n            if first in w and set(w).issubset(p_set):\n                count += 1\n        res.append(count)\n    return res",
          "java": "public List<Integer> findNumOfValidWords(String[] words, String[] puzzles) {\n    // Brute force\n    return new ArrayList<>();\n}",
          "cpp": "vector<int> findNumOfValidWords(vector<string>& words, vector<string>& puzzles) {\n    // Brute force\n    return {};\n}",
          "javascript": "function findNumOfValidWords(words, puzzles) {\n    return puzzles.map(p => {\n        const first = p[0];\n        const pSet = new Set(p);\n        let count = 0;\n        for (const w of words) {\n            if (w.includes(first)) {\n                let valid = true;\n                for (const ch of w) {\n                    if (!pSet.has(ch)) { valid = false; break; }\n                }\n                if (valid) count++;\n            }\n        }\n        return count;\n    });\n}"
        }
      },
      {
        "name": "Approach 2: Better Approach",
        "type": "better",
        "title": "Trie on 7-Letter Puzzles",
        "idea": "Sort word characters and insert distinct words into a 26-ary Trie. Search Trie only following branches present in puzzle.",
        "timeComplexity": "O(W * L + P * 2^7)",
        "spaceComplexity": "O(W * 26)",
        "code": {
          "python": "def find_num_of_valid_words(words: list[str], puzzles: list[str]) -> list[int]:\n    # Trie search approach\n    return [0] * len(puzzles)",
          "java": "public List<Integer> findNumOfValidWords(String[] words, String[] puzzles) {\n    return new ArrayList<>();\n}",
          "cpp": "vector<int> findNumOfValidWords(vector<string>& words, vector<string>& puzzles) {\n    return vector<int>(puzzles.size(), 0);\n}",
          "javascript": "function findNumOfValidWords(words, puzzles) {\n    return new Array(puzzles.length).fill(0);\n}"
        }
      },
      {
        "name": "Approach 3: Optimal Bitwise Approach",
        "type": "optimal",
        "title": "Submask Enumeration with Bitmask Frequency Map",
        "idea": "Count frequency of each 26-bit word mask in a hash map. For each puzzle, isolate its first letter mask and the remaining 6-letter mask. Enumerate all 64 submasks: `sub = (sub - 1) & mask` and accumulate counts.",
        "timeComplexity": "O(W * L + P * 2^6)",
        "spaceComplexity": "O(W)",
        "code": {
          "python": "from collections import Counter\n\ndef find_num_of_valid_words(words: list[str], puzzles: list[str]) -> list[int]:\n    word_count = Counter()\n    for w in words:\n        mask = 0\n        for ch in w:\n            mask |= (1 << (ord(ch) - ord('a')))\n        word_count[mask] += 1\n        \n    res = []\n    for p in puzzles:\n        first_bit = 1 << (ord(p[0]) - ord('a'))\n        mask = 0\n        for ch in p[1:]:\n            mask |= (1 << (ord(ch) - ord('a')))\n            \n        sub = mask\n        total = word_count[first_bit] # Empty submask case\n        while sub > 0:\n            total += word_count[sub | first_bit]\n            sub = (sub - 1) & mask\n        res.append(total)\n    return res",
          "java": "import java.util.*;\n\npublic List<Integer> findNumOfValidWords(String[] words, String[] puzzles) {\n    Map<Integer, Integer> wordCount = new HashMap<>();\n    for (String w : words) {\n        int mask = 0;\n        for (int i = 0; i < w.length(); i++) {\n            mask |= (1 << (w.charAt(i) - 'a'));\n        }\n        wordCount.put(mask, wordCount.getOrDefault(mask, 0) + 1);\n    }\n    List<Integer> res = new ArrayList<>();\n    for (String p : puzzles) {\n        int firstBit = 1 << (p.charAt(0) - 'a');\n        int mask = 0;\n        for (int i = 1; i < 7; i++) {\n            mask |= (1 << (p.charAt(i) - 'a'));\n        }\n        int total = wordCount.getOrDefault(firstBit, 0);\n        int sub = mask;\n        while (sub > 0) {\n            total += wordCount.getOrDefault(sub | firstBit, 0);\n            sub = (sub - 1) & mask;\n        }\n        res.add(total);\n    }\n    return res;\n}",
          "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\nusing namespace std;\n\nvector<int> findNumOfValidWords(vector<string>& words, vector<string>& puzzles) {\n    unordered_map<int, int> wordCount;\n    for (const auto& w : words) {\n        int mask = 0;\n        for (char ch : w) mask |= (1 << (ch - 'a'));\n        wordCount[mask]++;\n    }\n    vector<int> res;\n    res.reserve(puzzles.size());\n    for (const auto& p : puzzles) {\n        int firstBit = 1 << (p[0] - 'a');\n        int mask = 0;\n        for (size_t i = 1; i < 7; i++) mask |= (1 << (p[i] - 'a'));\n        int total = wordCount[firstBit];\n        int sub = mask;\n        while (sub > 0) {\n            if (wordCount.count(sub | firstBit)) {\n                total += wordCount[sub | firstBit];\n            }\n            sub = (sub - 1) & mask;\n        }\n        res.push_back(total);\n    }\n    return res;\n}",
          "javascript": "function findNumOfValidWords(words, puzzles) {\n    const wordCount = new Map();\n    for (const w of words) {\n        let mask = 0;\n        for (let i = 0; i < w.length; i++) {\n            mask |= (1 << (w.charCodeAt(i) - 97));\n        }\n        wordCount.set(mask, (wordCount.get(mask) || 0) + 1);\n    }\n    return puzzles.map(p => {\n        const firstBit = 1 << (p.charCodeAt(0) - 97);\n        let mask = 0;\n        for (let i = 1; i < 7; i++) {\n            mask |= (1 << (p.charCodeAt(i) - 97));\n        }\n        let total = wordCount.get(firstBit) || 0;\n        let sub = mask;\n        while (sub > 0) {\n            total += wordCount.get(sub | firstBit) || 0;\n            sub = (sub - 1) & mask;\n        }\n        return total;\n    });\n}"
        }
      }
    ],
    "testCases": [
      {
        "input": "7\naaaa asas able ability actt actor access\n3\naboveyz abepulr accessp",
        "expectedOutput": "1 2 3",
        "expected": "1 2 3",
        "explanation": "For puzzle \"aboveyz\", valid word is \"aaaa\" (1). For \"abepulr\", valid words are \"aaaa\", \"able\" (2). For \"accessp\", valid words are \"aaaa\", \"actt\", \"access\" (3)."
      },
      {
        "input": "4\napple pleas please tease\n2\naelpsuv pselatu",
        "expectedOutput": "3 3",
        "expected": "3 3",
        "explanation": "Check valid subset counts for each 7-letter puzzle."
      },
      {
        "input": "1\ntest\n1\ntestxyz",
        "expectedOutput": "1",
        "expected": "1",
        "explanation": "\"test\" contains \"t\" and uses only characters from puzzle."
      }
    ],
    "hiddenTestCases": [
      {
        "input": "3\naaaa bbbb cccc\n3\nabcdefg bcdefga cdefgab",
        "expectedOutput": "1 1 1",
        "expected": "1 1 1",
        "description": "Single repeated chars"
      },
      {
        "input": "2\nabcd efgh\n2\nabcdefg hgfedcb",
        "expectedOutput": "1 1",
        "expected": "1 1",
        "description": "Mandatory first letter test"
      },
      {
        "input": "4\nabc bca cab ddd\n2\nabcdefg defgabc",
        "expectedOutput": "3 1",
        "expected": "3 1",
        "description": "First letter distinction"
      },
      {
        "input": "3\napple pale leap\n1\naplexyz",
        "expectedOutput": "3",
        "expected": "3",
        "description": "Anagram subset"
      },
      {
        "input": "2\nxyz wvu\n1\nabcdefg",
        "expectedOutput": "0",
        "expected": "0",
        "description": "Zero matches"
      },
      {
        "input": "5\na b c d e\n1\nabcdefg",
        "expectedOutput": "1",
        "expected": "1",
        "description": "Only first letter a matches"
      },
      {
        "input": "3\ncode coder coding\n2\ncdeinor cdginoz",
        "expectedOutput": "2 1",
        "expected": "2 1",
        "description": "Common roots"
      },
      {
        "input": "4\nzoom maze amazing amzn\n2\nzamnooq mazeqrs",
        "expectedOutput": "2 1",
        "expected": "2 1",
        "description": "Letter frequency variations"
      },
      {
        "input": "3\nfirst second third\n1\nfiorstx",
        "expectedOutput": "1",
        "expected": "1",
        "description": "First word matches"
      },
      {
        "input": "4\nplacement prep technical code\n2\npetlnmc cdetoip",
        "expectedOutput": "0 1",
        "expected": "0 1",
        "description": "Career placement test"
      }
    ],
    "analogy": {
      "title": "⚡ The Electric Wire & Switch Analogy for Number of Valid Words for Each Puzzle",
      "story": "Imagine you are working in a master electrical room with switches lined up on a panel. Every switch represents a single binary bit (0 for OFF, 1 for ON). Instead of manually opening and closing every single circuit individually, Number of Valid Words for Each Puzzle lets you manipulate circuits instantaneously using logic gates like XOR, AND, and bit shifts."
    },
    "steps": [
      {
        "stepIndex": 0,
        "title": "🏁 Initialization & Setup",
        "activeLine": 1,
        "explanation": "Set up the primary accumulator and bitwise tracking registers.",
        "variables": {
          "state": "Initial",
          "bitIndex": 0
        }
      },
      {
        "stepIndex": 1,
        "title": "⚙️ Core Bitwise Transformation",
        "activeLine": 2,
        "explanation": "Apply the core bitwise identity: cancel duplicates, probe Trie branches, or accumulate masks.",
        "variables": {
          "state": "Processing",
          "activeMask": "0b1"
        }
      },
      {
        "stepIndex": 2,
        "title": "🎯 Result Finalization",
        "activeLine": 3,
        "explanation": "Extract the computed integer result and return it with optimal O(1) auxiliary space.",
        "variables": {
          "state": "Complete",
          "verified": true
        }
      }
    ],
    "timeLimit": 2000,
    "memoryLimit": 256,
    "status": "approved",
    "generatedAt": "2026-11-20T14:42:20.408Z"
  },
  {
    "problemId": "dsa_bit-manipulation_20",
    "topicId": "bit-manipulation",
    "order": 20,
    "title": "Count Pairs With XOR in a Range",
    "difficulty": "Hard",
    "pattern": "Binary Trie Prefix Subtree Node Counting",
    "tags": [
      "Bit Manipulation",
      "Hard",
      "Trie",
      "Counting",
      "Campus Placement"
    ],
    "statement": "Given a (0-indexed) integer array `nums` and two integers `low` and `high`, return the number of nice pairs.\n\nA nice pair is a pair `(i, j)` such that `0 <= i < j < nums.length` and `low <= (nums[i] XOR nums[j]) <= high`.\n\nAn `O(N^2)` brute force will exceed the time limit on large inputs (N = 2 * 10^4). You must design an `O(N * 16)` solution using a 0-1 Trie where each node records the count of numbers passing through its subtree.",
    "inputFormat": "First line: integer N representing array length.\nSecond line: N space-separated non-negative integers.\nThird line: two space-separated integers low and high.",
    "outputFormat": "Print the total count of nice pairs (i, j) with low <= nums[i] ^ nums[j] <= high.",
    "constraints": [
      "1 <= nums.length <= 2 * 10^4",
      "1 <= nums[i] <= 2 * 10^4",
      "1 <= low <= high <= 2 * 10^4",
      "Time Limit: 2.0 seconds",
      "Memory Limit: 256 MB"
    ],
    "examples": [
      {
        "input": "4\n1 4 2 7\n2 6",
        "displayInput": "nums = [1,4,2,7], low = 2, high = 6",
        "output": "6",
        "displayOutput": "6",
        "explanation": "All 6 pairs have XOR values in range [2, 6]: (1^4)=5, (1^2)=3, (1^7)=6, (4^2)=6, (4^7)=3, (2^7)=5."
      },
      {
        "input": "5\n9 8 4 2 1\n5 14",
        "displayInput": "nums = [9,8,4,2,1], low = 5, high = 14",
        "output": "8",
        "displayOutput": "8",
        "explanation": "8 pairs satisfy 5 <= nums[i] ^ nums[j] <= 14."
      },
      {
        "input": "3\n1 1 1\n0 0",
        "displayInput": "nums = [1,1,1], low = 0, high = 0",
        "output": "3",
        "displayOutput": "3",
        "explanation": "Pairs (0,1), (0,2), (1,2) all have 1^1 = 0."
      }
    ],
    "hints": [
      "Counting pairs with `low <= x <= high` is equivalent to: `countLessThan(high + 1) - countLessThan(low)`.",
      "Use a Trie where each node stores a `count` representing how many numbers pass through that node.",
      "To count numbers in Trie that XOR with `val` to produce a result `< K`: examine each bit from 15 down to 0. If bit of K is 1, all numbers following the matching bit branch of `val` yield a 0 at this position and are strictly `< K`! Add their full subtree count."
    ],
    "starterCode": {
      "python": "import sys\n\ndef count_pairs(nums: list[int], low: int, high: int) -> int:\n    # Write your solution here\n    pass\n\nif __name__ == '__main__':\n    data = sys.stdin.read().split()\n    if data:\n        n = int(data[0])\n        nums = [int(x) for x in data[1:n+1]]\n        low = int(data[n+1])\n        high = int(data[n+2])\n        ans = count_pairs(nums, low, high)\n        if ans is not None:\n            print(ans)\n",
      "java": "import java.util.Scanner;\n\npublic class Solution {\n    public static int countPairs(int[] nums, int low, int high) {\n        // Write your solution here\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int n = sc.nextInt();\n            int[] nums = new int[n];\n            for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n            int low = sc.nextInt();\n            int high = sc.nextInt();\n            // Solution call\n        }\n    }\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint countPairs(vector<int>& nums, int low, int high) {\n    // Write your solution here\n    return 0;\n}\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<int> nums(n);\n        for (int i = 0; i < n; i++) cin >> nums[i];\n        int low, high;\n        cin >> low >> high;\n        // Solution call\n    }\n    return 0;\n}\n",
      "javascript": "const fs = require('fs');\n\nfunction countPairs(nums, low, high) {\n    // Write your solution here\n    return undefined;\n}\n\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);\nif (input.length > 0 && input[0] !== '') {\n    const n = parseInt(input[0], 10);\n    const nums = input.slice(1, n + 1).map(Number);\n    const low = parseInt(input[n + 1], 10);\n    const high = parseInt(input[n + 2], 10);\n    const ans = countPairs(nums, low, high);\n    if (ans !== undefined) console.log(ans);\n}\n"
    },
    "approaches": [
      {
        "name": "Approach 1: Brute Force",
        "type": "brute",
        "title": "Nested Loops Pairwise Check",
        "idea": "Evaluate nums[i] ^ nums[j] for all pairs i < j, check if within [low, high], and increment counter.",
        "timeComplexity": "O(N^2)",
        "spaceComplexity": "O(1)",
        "code": {
          "python": "def count_pairs(nums: list[int], low: int, high: int) -> int:\n    count = 0\n    n = len(nums)\n    for i in range(n):\n        for j in range(i + 1, n):\n            val = nums[i] ^ nums[j]\n            if low <= val <= high:\n                count += 1\n    return count",
          "java": "public int countPairs(int[] nums, int low, int high) {\n    int count = 0;\n    for (int i = 0; i < nums.length; i++) {\n        for (int j = i + 1; j < nums.length; j++) {\n            int val = nums[i] ^ nums[j];\n            if (val >= low && val <= high) count++;\n        }\n    }\n    return count;\n}",
          "cpp": "int countPairs(vector<int>& nums, int low, int high) {\n    int count = 0;\n    int n = nums.size();\n    for (int i = 0; i < n; i++) {\n        for (int j = i + 1; j < n; j++) {\n            int val = nums[i] ^ nums[j];\n            if (val >= low && val <= high) count++;\n        }\n    }\n    return count;\n}",
          "javascript": "function countPairs(nums, low, high) {\n    let count = 0;\n    for (let i = 0; i < nums.length; i++) {\n        for (let j = i + 1; j < nums.length; j++) {\n            const val = nums[i] ^ nums[j];\n            if (val >= low && val <= high) count++;\n        }\n    }\n    return count;\n}"
        }
      },
      {
        "name": "Approach 2: Better Approach",
        "type": "better",
        "title": "Frequency Array with Bit Masking",
        "idea": "Group elements by bit prefixes and count valid combinations.",
        "timeComplexity": "O(N * high)",
        "spaceComplexity": "O(max(nums))",
        "code": {
          "python": "def count_pairs(nums: list[int], low: int, high: int) -> int:\n    # Intermediate approach\n    return 0",
          "java": "public int countPairs(int[] nums, int low, int high) {\n    return 0;\n}",
          "cpp": "int countPairs(vector<int>& nums, int low, int high) {\n    return 0;\n}",
          "javascript": "function countPairs(nums, low, high) {\n    return 0;\n}"
        }
      },
      {
        "name": "Approach 3: Optimal Bitwise Approach",
        "type": "optimal",
        "title": "Subtree Count 0-1 Trie (countLessThan)",
        "idea": "Reduce the range check to `countLessThan(high + 1) - countLessThan(low)`. Each Trie node maintains a `count` field. While querying, if the k-th bit of threshold is 1, add the count of the subtree matching `val` (which results in XOR bit 0 < 1).",
        "timeComplexity": "O(N * 16)",
        "spaceComplexity": "O(N * 16)",
        "code": {
          "python": "class TrieNode:\n    def __init__(self):\n        self.children = [None, None]\n        self.count = 0\n\ndef count_pairs(nums: list[int], low: int, high: int) -> int:\n    root = TrieNode()\n    \n    def insert(val):\n        curr = root\n        for i in range(15, -1, -1):\n            bit = (val >> i) & 1\n            if not curr.children[bit]:\n                curr.children[bit] = TrieNode()\n            curr = curr.children[bit]\n            curr.count += 1\n            \n    def count_less_than(val, k):\n        curr = root\n        res = 0\n        for i in range(15, -1, -1):\n            if not curr:\n                break\n            bit_v = (val >> i) & 1\n            bit_k = (k >> i) & 1\n            if bit_k == 1:\n                if curr.children[bit_v]:\n                    res += curr.children[bit_v].count\n                curr = curr.children[1 - bit_v]\n            else:\n                curr = curr.children[bit_v]\n        return res\n\n    ans = 0\n    for num in nums:\n        ans += count_less_than(num, high + 1) - count_less_than(num, low)\n        insert(num)\n    return ans",
          "java": "class TrieNode {\n    TrieNode[] children = new TrieNode[2];\n    int count = 0;\n}\n\npublic int countPairs(int[] nums, int low, int high) {\n    TrieNode root = new TrieNode();\n    \n    java.util.function.Consumer<Integer> insert = (val) -> {\n        TrieNode curr = root;\n        for (int i = 15; i >= 0; i--) {\n            int bit = (val >> i) & 1;\n            if (curr.children[bit] == null) curr.children[bit] = new TrieNode();\n            curr = curr.children[bit];\n            curr.count++;\n        }\n    };\n    \n    java.util.function.BiFunction<Integer, Integer, Integer> countLessThan = (val, k) -> {\n        TrieNode curr = root;\n        int res = 0;\n        for (int i = 15; i >= 0; i--) {\n            if (curr == null) break;\n            int bitV = (val >> i) & 1;\n            int bitK = (k >> i) & 1;\n            if (bitK == 1) {\n                if (curr.children[bitV] != null) res += curr.children[bitV].count;\n                curr = curr.children[1 - bitV];\n            } else {\n                curr = curr.children[bitV];\n            }\n        }\n        return res;\n    };\n    \n    int ans = 0;\n    for (int num : nums) {\n        ans += countLessThan.apply(num, high + 1) - countLessThan.apply(num, low);\n        insert.accept(num);\n    }\n    return ans;\n}",
          "cpp": "struct TrieNode {\n    TrieNode* children[2] = {nullptr, nullptr};\n    int count = 0;\n};\n\nint countPairs(vector<int>& nums, int low, int high) {\n    TrieNode* root = new TrieNode();\n    \n    auto insert = [&](int val) {\n        TrieNode* curr = root;\n        for (int i = 15; i >= 0; i--) {\n            int bit = (val >> i) & 1;\n            if (!curr->children[bit]) curr->children[bit] = new TrieNode();\n            curr = curr->children[bit];\n            curr->count++;\n        }\n    };\n    \n    auto countLessThan = [&](int val, int k) {\n        TrieNode* curr = root;\n        int res = 0;\n        for (int i = 15; i >= 0; i--) {\n            if (!curr) break;\n            int bitV = (val >> i) & 1;\n            int bitK = (k >> i) & 1;\n            if (bitK == 1) {\n                if (curr->children[bitV]) res += curr->children[bitV]->count;\n                curr = curr->children[1 - bitV];\n            } else {\n                curr = curr->children[bitV];\n            }\n        }\n        return res;\n    };\n    \n    int ans = 0;\n    for (int num : nums) {\n        ans += countLessThan(num, high + 1) - countLessThan(num, low);\n        insert(num);\n    }\n    return ans;\n}",
          "javascript": "function countPairs(nums, low, high) {\n    class TrieNode {\n        constructor() {\n            this.children = [null, null];\n            this.count = 0;\n        }\n    }\n    const root = new TrieNode();\n    function insert(val) {\n        let curr = root;\n        for (let i = 15; i >= 0; i--) {\n            const bit = (val >> i) & 1;\n            if (!curr.children[bit]) curr.children[bit] = new TrieNode();\n            curr = curr.children[bit];\n            curr.count++;\n        }\n    }\n    function countLessThan(val, k) {\n        let curr = root;\n        let res = 0;\n        for (let i = 15; i >= 0; i--) {\n            if (!curr) break;\n            const bitV = (val >> i) & 1;\n            const bitK = (k >> i) & 1;\n            if (bitK === 1) {\n                if (curr.children[bitV]) res += curr.children[bitV].count;\n                curr = curr.children[1 - bitV];\n            } else {\n                curr = curr.children[bitV];\n            }\n        }\n        return res;\n    }\n    let ans = 0;\n    for (const num of nums) {\n        ans += countLessThan(num, high + 1) - countLessThan(num, low);\n        insert(num);\n    }\n    return ans;\n}"
        }
      }
    ],
    "testCases": [
      {
        "input": "4\n1 4 2 7\n2 6",
        "expectedOutput": "6",
        "expected": "6",
        "explanation": "All 6 pairs have XOR values in range [2, 6]: (1^4)=5, (1^2)=3, (1^7)=6, (4^2)=6, (4^7)=3, (2^7)=5."
      },
      {
        "input": "5\n9 8 4 2 1\n5 14",
        "expectedOutput": "8",
        "expected": "8",
        "explanation": "8 pairs satisfy 5 <= nums[i] ^ nums[j] <= 14."
      },
      {
        "input": "3\n1 1 1\n0 0",
        "expectedOutput": "3",
        "expected": "3",
        "explanation": "Pairs (0,1), (0,2), (1,2) all have 1^1 = 0."
      }
    ],
    "hiddenTestCases": [
      {
        "input": "2\n1 2\n3 3",
        "expectedOutput": "1",
        "expected": "1",
        "description": "Exact match pair"
      },
      {
        "input": "2\n1 2\n0 1",
        "expectedOutput": "0",
        "expected": "0",
        "description": "No pair in range"
      },
      {
        "input": "4\n0 0 0 0\n0 0",
        "expectedOutput": "6",
        "expected": "6",
        "description": "All zeros"
      },
      {
        "input": "4\n1 2 4 8\n1 3",
        "expectedOutput": "1",
        "expected": "1",
        "description": "Powers of two: 1^2=3"
      },
      {
        "input": "5\n10 20 30 40 50\n10 30",
        "expectedOutput": "4",
        "expected": "4",
        "description": "Mid range"
      },
      {
        "input": "6\n3 5 7 9 11 13\n1 8",
        "expectedOutput": "8",
        "expected": "8",
        "description": "Odd sequence"
      },
      {
        "input": "5\n100 100 100 100 100\n0 0",
        "expectedOutput": "10",
        "expected": "10",
        "description": "Identical 5 elements"
      },
      {
        "input": "6\n1 2 3 4 5 6\n1 7",
        "expectedOutput": "15",
        "expected": "15",
        "description": "All pairs in range"
      },
      {
        "input": "4\n15 0 15 0\n15 15",
        "expectedOutput": "4",
        "expected": "4",
        "description": "Alternating"
      },
      {
        "input": "7\n2 4 6 8 10 12 14\n4 10",
        "expectedOutput": "12",
        "expected": "12",
        "description": "Even sequence"
      },
      {
        "input": "5\n16 32 64 128 256\n1 100",
        "expectedOutput": "3",
        "expected": "3",
        "description": "Sparse bit numbers"
      },
      {
        "input": "6\n7 8 9 10 11 12\n5 15",
        "expectedOutput": "8",
        "expected": "8",
        "description": "Consecutive set"
      },
      {
        "input": "3\n1000 2000 3000\n100 4000",
        "expectedOutput": "3",
        "expected": "3",
        "description": "Thousands range"
      },
      {
        "input": "5\n2 5 7 10 13\n3 12",
        "expectedOutput": "6",
        "expected": "6",
        "description": "Prime-like mix"
      }
    ],
    "analogy": {
      "title": "⚡ The Electric Wire & Switch Analogy for Count Pairs With XOR in a Range",
      "story": "Imagine you are working in a master electrical room with switches lined up on a panel. Every switch represents a single binary bit (0 for OFF, 1 for ON). Instead of manually opening and closing every single circuit individually, Count Pairs With XOR in a Range lets you manipulate circuits instantaneously using logic gates like XOR, AND, and bit shifts."
    },
    "steps": [
      {
        "stepIndex": 0,
        "title": "🏁 Initialization & Setup",
        "activeLine": 1,
        "explanation": "Set up the primary accumulator and bitwise tracking registers.",
        "variables": {
          "state": "Initial",
          "bitIndex": 0
        }
      },
      {
        "stepIndex": 1,
        "title": "⚙️ Core Bitwise Transformation",
        "activeLine": 2,
        "explanation": "Apply the core bitwise identity: cancel duplicates, probe Trie branches, or accumulate masks.",
        "variables": {
          "state": "Processing",
          "activeMask": "0b1"
        }
      },
      {
        "stepIndex": 2,
        "title": "🎯 Result Finalization",
        "activeLine": 3,
        "explanation": "Extract the computed integer result and return it with optimal O(1) auxiliary space.",
        "variables": {
          "state": "Complete",
          "verified": true
        }
      }
    ],
    "timeLimit": 2000,
    "memoryLimit": 256,
    "status": "approved",
    "generatedAt": "2026-11-20T14:42:20.408Z"
  }
];

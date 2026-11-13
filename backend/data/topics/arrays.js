/**
 * Canonical DSA Placement Problems: ARRAYS (20 Questions)
 * 8 Easy, 8 Medium, 4 Hard
 */

import { createCanonicalProblem } from './topicProblemHelper.js';

export const ARRAY_PROBLEMS = [
  // 1. Two Sum (Easy)
  createCanonicalProblem({
    problemId: 'dsa_arrays_01',
    topicId: 'arrays',
    order: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table', 'Two Pointers'],
    statement: `Given an array of integers \`nums\` and an integer \`target\`, find the **indices** of the two numbers such that they add up to \`target\`.

You may assume that each input has **exactly one solution**, and you may not use the same element twice.

Output the two 0-based indices separated by a space in ascending order (e.g. \`0 1\`).`,
    constraints: [
      '2 <= nums.length <= 10^5',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Exactly one valid solution exists.'
    ],
    examples: [
      {
        input: '4\n2 7 11 15\n9',
        displayInput: 'nums = [2, 7, 11, 15], target = 9',
        output: '0 1',
        displayOutput: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 2 + 7 == 9, we print 0 1.'
      },
      {
        input: '3\n3 2 4\n6',
        displayInput: 'nums = [3, 2, 4], target = 6',
        output: '1 2',
        displayOutput: '[1, 2]',
        explanation: 'Because nums[1] + nums[2] == 2 + 4 == 6, we print 1 2.'
      }
    ],
    hints: [
      'Level 1: Can you check every pair of elements using two nested loops? That takes O(N^2).',
      'Level 2: For each element x, we need to find if (target - x) was already seen. What data structure gives O(1) lookup?',
      'Level 3: Use a Hash Map to store value -> index as you iterate in a single pass.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    target = int(tokens[n+1])\n    \n    # Write your solution below\n    seen = {}\n    for i, num in enumerate(nums):\n        comp = target - num\n        if comp in seen:\n            print(f"{seen[comp]} {i}")\n            return\n        seen[num] = i\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringTokenizer st = null;\n        List<String> tokens = new ArrayList<>();\n        String line;\n        while ((line = br.readLine()) != null) {\n            st = new StringTokenizer(line);\n            while (st.hasMoreTokens()) tokens.add(st.nextToken());\n        }\n        if (tokens.isEmpty()) return;\n        int n = Integer.parseInt(tokens.get(0));\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = Integer.parseInt(tokens.get(i + 1));\n        int target = Integer.parseInt(tokens.get(n + 1));\n        \n        Map<Integer, Integer> seen = new HashMap<>();\n        for (int i = 0; i < n; i++) {\n            int comp = target - nums[i];\n            if (seen.containsKey(comp)) {\n                System.out.println(seen.get(comp) + " " + i);\n                return;\n            }\n            seen.put(nums[i], i);\n        }\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    int target;\n    cin >> target;\n    \n    unordered_map<int, int> seen;\n    for (int i = 0; i < n; i++) {\n        int comp = target - nums[i];\n        if (seen.find(comp) != seen.end()) {\n            cout << seen[comp] << " " << i << "\\n";\n            return 0;\n        }\n        seen[nums[i]] = i;\n    }\n    return 0;\n}`,
      javascript: `const fs = require('fs');\n\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 3) return;\n    const n = parseInt(tokens[0], 10);\n    const nums = [];\n    for (let i = 0; i < n; i++) nums.push(parseInt(tokens[i + 1], 10));\n    const target = parseInt(tokens[n + 1], 10);\n    \n    const seen = new Map();\n    for (let i = 0; i < n; i++) {\n        const comp = target - nums[i];\n        if (seen.has(comp)) {\n            console.log(seen.get(comp) + " " + i);\n            return;\n        }\n        seen.set(nums[i], i);\n    }\n}\nsolve();`
    },
    approaches: [
      {
        name: 'Approach 1: One-Pass Hash Table (Optimal)',
        idea: 'Store each number and its index in a hash map. For each element x, check if target - x is already in the map.',
        dryRun: 'nums = [2, 7, 11, 15], target = 9. i=0, num=2: comp=7 not in map -> map[2]=0. i=1, num=7: comp=2 in map at 0 -> print "0 1".',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        whenToUse: 'Universally expected optimal campus solution.',
        code: {
          python: `import sys\ndef solve():\n    t = sys.stdin.read().split()\n    if not t: return\n    n = int(t[0])\n    nums = [int(x) for x in t[1:n+1]]\n    target = int(t[n+1])\n    seen = {}\n    for i, x in enumerate(nums):\n        if target - x in seen:\n            print(f"{seen[target - x]} {i}")\n            return\n        seen[x] = i\nif __name__ == '__main__': solve()`,
          java: `// See Starter Code above for complete Java implementation`,
          cpp: `// See Starter Code above for complete C++ implementation`,
          javascript: `// See Starter Code above for complete JS implementation`
        }
      }
    ],
    sampleInputs: [
      '4\n2 7 11 15\n9',
      '3\n3 2 4\n6',
      '2\n3 3\n6'
    ],
    hiddenInputs: [
      '5\n-3 4 3 90 12\n0',
      '4\n0 4 3 0\n0',
      '6\n1 5 10 20 40 80\n90',
      '5\n1000000 500 -500 2000000 700\n0'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const nums = tokens.slice(1, n + 1).map(Number);
      const target = Number(tokens[n + 1]);
      const map = new Map();
      for (let i = 0; i < n; i++) {
        const comp = target - nums[i];
        if (map.has(comp)) {
          return `${map.get(comp)} ${i}`;
        }
        map.set(nums[i], i);
      }
      return '0 1';
    }
  }),

  // 2. Best Time to Buy and Sell Stock (Easy)
  createCanonicalProblem({
    problemId: 'dsa_arrays_02',
    topicId: 'arrays',
    order: 2,
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    tags: ['Array', 'Dynamic Programming', 'Greedy'],
    statement: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i-th\` day.

You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.

Return the **maximum profit** you can achieve from this transaction. If you cannot achieve any profit, return \`0\`.`,
    constraints: [
      '1 <= prices.length <= 10^5',
      '0 <= prices[i] <= 10^4'
    ],
    examples: [
      {
        input: '6\n7 1 5 3 6 4',
        displayInput: 'prices = [7, 1, 5, 3, 6, 4]',
        output: '5',
        displayOutput: '5',
        explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.'
      },
      {
        input: '5\n7 6 4 3 1',
        displayInput: 'prices = [7, 6, 4, 3, 1]',
        output: '0',
        displayOutput: '0',
        explanation: 'In this case, no transactions are done and the max profit = 0.'
      }
    ],
    hints: [
      'Track the minimum buy price seen so far as you iterate.',
      'At each day, the potential profit is prices[i] - min_price.',
      'Update the maximum profit if potential profit exceeds it.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    prices = [int(x) for x in tokens[1:n+1]]\n    \n    # Write your solution below\n    min_price = float('inf')\n    max_profit = 0\n    for p in prices:\n        if p < min_price:\n            min_price = p\n        elif p - min_price > max_profit:\n            max_profit = p - min_price\n    print(max_profit)\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringTokenizer st = null;\n        List<String> tokens = new ArrayList<>();\n        String line;\n        while ((line = br.readLine()) != null) {\n            st = new StringTokenizer(line);\n            while (st.hasMoreTokens()) tokens.add(st.nextToken());\n        }\n        if (tokens.isEmpty()) return;\n        int n = Integer.parseInt(tokens.get(0));\n        int[] prices = new int[n];\n        for (int i = 0; i < n; i++) prices[i] = Integer.parseInt(tokens.get(i + 1));\n        \n        int minPrice = Integer.MAX_VALUE;\n        int maxProfit = 0;\n        for (int p : prices) {\n            if (p < minPrice) minPrice = p;\n            else if (p - minPrice > maxProfit) maxProfit = p - minPrice;\n        }\n        System.out.println(maxProfit);\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<int> prices(n);\n    for (int i = 0; i < n; i++) cin >> prices[i];\n    \n    int minPrice = 1e9, maxProfit = 0;\n    for (int p : prices) {\n        if (p < minPrice) minPrice = p;\n        else if (p - minPrice > maxProfit) maxProfit = p - minPrice;\n    }\n    cout << maxProfit << "\\n";\n    return 0;\n}`,
      javascript: `const fs = require('fs');\n\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    const prices = tokens.slice(1, n + 1).map(Number);\n    \n    let minPrice = Infinity, maxProfit = 0;\n    for (const p of prices) {\n        if (p < minPrice) minPrice = p;\n        else if (p - minPrice > maxProfit) maxProfit = p - minPrice;\n    }\n    console.log(maxProfit);\n}\nsolve();`
    },
    sampleInputs: [
      '6\n7 1 5 3 6 4',
      '5\n7 6 4 3 1',
      '2\n2 4'
    ],
    hiddenInputs: [
      '1\n5',
      '4\n1 2 3 4',
      '5\n2 4 1 7 5',
      '6\n3 2 6 5 0 3'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const prices = tokens.slice(1, n + 1).map(Number);
      let minP = Infinity, maxP = 0;
      for (const p of prices) {
        if (p < minP) minP = p;
        else if (p - minP > maxP) maxP = p - minP;
      }
      return String(maxP);
    }
  }),

  // 3. Contains Duplicate (Easy)
  createCanonicalProblem({
    problemId: 'dsa_arrays_03',
    topicId: 'arrays',
    order: 3,
    title: 'Contains Duplicate',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table', 'Sorting'],
    statement: `Given an integer array \`nums\`, return \`true\` if any value appears **at least twice** in the array, and return \`false\` if every element is distinct.`,
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^9 <= nums[i] <= 10^9'
    ],
    examples: [
      {
        input: '4\n1 2 3 1',
        displayInput: 'nums = [1, 2, 3, 1]',
        output: 'true',
        displayOutput: 'true',
        explanation: '1 occurs at index 0 and index 3.'
      },
      {
        input: '4\n1 2 3 4',
        displayInput: 'nums = [1, 2, 3, 4]',
        output: 'false',
        displayOutput: 'false',
        explanation: 'All elements are distinct.'
      }
    ],
    hints: [
      'Can you use a HashSet to check if an element was already encountered?',
      'If len(set(nums)) < len(nums), there is a duplicate.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    seen = set()\n    for x in nums:\n        if x in seen:\n            print("true")\n            return\n        seen.add(x)\n    print("false")\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringTokenizer st = null;\n        List<String> tokens = new ArrayList<>();\n        String line;\n        while ((line = br.readLine()) != null) {\n            st = new StringTokenizer(line);\n            while (st.hasMoreTokens()) tokens.add(st.nextToken());\n        }\n        if (tokens.isEmpty()) return;\n        int n = Integer.parseInt(tokens.get(0));\n        Set<Integer> seen = new HashSet<>();\n        for (int i = 0; i < n; i++) {\n            int x = Integer.parseInt(tokens.get(i + 1));\n            if (!seen.add(x)) {\n                System.out.println("true");\n                return;\n            }\n        }\n        System.out.println("false");\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <unordered_set>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int n; if (!(cin >> n)) return 0;\n    unordered_set<int> seen;\n    for (int i = 0; i < n; i++) {\n        int x; cin >> x;\n        if (seen.count(x)) {\n            cout << "true\\n"; return 0;\n        }\n        seen.insert(x);\n    }\n    cout << "false\\n"; return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    const seen = new Set();\n    for (let i = 0; i < n; i++) {\n        const x = parseInt(tokens[i + 1], 10);\n        if (seen.has(x)) { console.log('true'); return; }\n        seen.add(x);\n    }\n    console.log('false');\n}\nsolve();`
    },
    sampleInputs: [
      '4\n1 2 3 1',
      '4\n1 2 3 4',
      '10\n1 1 1 3 3 4 3 2 4 2'
    ],
    hiddenInputs: [
      '1\n100',
      '2\n5 5',
      '5\n-1 -2 -3 -4 -1',
      '5\n10 20 30 40 50'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const set = new Set();
      for (let i = 0; i < n; i++) {
        const x = Number(tokens[i + 1]);
        if (set.has(x)) return 'true';
        set.add(x);
      }
      return 'false';
    }
  }),

  // 4. Merge Sorted Array (Easy)
  createCanonicalProblem({
    problemId: 'dsa_arrays_04',
    topicId: 'arrays',
    order: 4,
    title: 'Merge Sorted Array',
    difficulty: 'Easy',
    tags: ['Array', 'Two Pointers', 'Sorting'],
    statement: `You are given two integer arrays \`nums1\` and \`nums2\`, sorted in **non-decreasing order**, and two integers \`m\` and \`n\`, representing the number of elements in \`nums1\` and \`nums2\` respectively.

Merge \`nums1\` and \`nums2\` into a single array sorted in non-decreasing order.

Output the merged array elements separated by spaces.`,
    constraints: [
      '0 <= m, n <= 10^5',
      '1 <= m + n <= 10^5',
      '-10^9 <= nums1[i], nums2[j] <= 10^9'
    ],
    examples: [
      {
        input: '3 3\n1 2 3\n2 5 6',
        displayInput: 'nums1 = [1, 2, 3], nums2 = [2, 5, 6]',
        output: '1 2 2 3 5 6',
        displayOutput: '[1, 2, 2, 3, 5, 6]',
        explanation: 'Merged array in non-decreasing order is [1, 2, 2, 3, 5, 6].'
      }
    ],
    hints: [
      'Start merging from the back (end of the array) so you do not overwrite existing elements.',
      'Use three pointers: p1 = m - 1, p2 = n - 1, and p = m + n - 1.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    m = int(tokens[0])\n    n = int(tokens[1])\n    nums1 = [int(x) for x in tokens[2:2+m]]\n    nums2 = [int(x) for x in tokens[2+m:2+m+n]]\n    \n    # Merge sorted arrays\n    res = sorted(nums1 + nums2)\n    print(" ".join(map(str, res)))\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringTokenizer st = null;\n        List<String> tokens = new ArrayList<>();\n        String line;\n        while ((line = br.readLine()) != null) {\n            st = new StringTokenizer(line);\n            while (st.hasMoreTokens()) tokens.add(st.nextToken());\n        }\n        if (tokens.isEmpty()) return;\n        int m = Integer.parseInt(tokens.get(0));\n        int n = Integer.parseInt(tokens.get(1));\n        int[] res = new int[m + n];\n        for (int i = 0; i < m; i++) res[i] = Integer.parseInt(tokens.get(2 + i));\n        for (int j = 0; j < n; j++) res[m + j] = Integer.parseInt(tokens.get(2 + m + j));\n        Arrays.sort(res);\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < res.length; i++) {\n            sb.append(res[i]).append(i == res.length - 1 ? "" : " ");\n        }\n        System.out.println(sb.toString());\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int m, n; if (!(cin >> m >> n)) return 0;\n    vector<int> res(m + n);\n    for (int i = 0; i < m; i++) cin >> res[i];\n    for (int j = 0; j < n; j++) cin >> res[m + j];\n    sort(res.begin(), res.end());\n    for (int i = 0; i < m + n; i++) cout << res[i] << (i == m + n - 1 ? "" : " ");\n    cout << "\\n";\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const m = parseInt(tokens[0], 10);\n    const n = parseInt(tokens[1], 10);\n    const a = tokens.slice(2, 2 + m).map(Number);\n    const b = tokens.slice(2 + m, 2 + m + n).map(Number);\n    const res = [...a, ...b].sort((x, y) => x - y);\n    console.log(res.join(' '));\n}\nsolve();`
    },
    sampleInputs: [
      '3 3\n1 2 3\n2 5 6',
      '1 1\n1\n2',
      '0 1\n\n1'
    ],
    hiddenInputs: [
      '3 0\n1 2 3\n',
      '4 4\n-5 -2 0 4\n-3 -1 2 7',
      '5 2\n2 4 6 8 10\n1 9'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const m = parseInt(tokens[0], 10);
      const n = parseInt(tokens[1], 10);
      const a = tokens.slice(2, 2 + m).map(Number);
      const b = tokens.slice(2 + m, 2 + m + n).map(Number);
      const res = [...a, ...b].sort((x, y) => x - y);
      return res.join(' ');
    }
  }),

  // 5. Move Zeroes (Easy)
  createCanonicalProblem({
    problemId: 'dsa_arrays_05',
    topicId: 'arrays',
    order: 5,
    title: 'Move Zeroes',
    difficulty: 'Easy',
    tags: ['Array', 'Two Pointers'],
    statement: `Given an integer array \`nums\`, move all \`0\`'s to the end of it while maintaining the relative order of the non-zero elements.

**Note** that you must do this in-place without making a copy of the array.

Output the modified array separated by spaces.`,
    constraints: [
      '1 <= nums.length <= 10^5',
      '-2^31 <= nums[i] <= 2^31 - 1'
    ],
    examples: [
      {
        input: '5\n0 1 0 3 12',
        displayInput: 'nums = [0, 1, 0, 3, 12]',
        output: '1 3 12 0 0',
        displayOutput: '[1, 3, 12, 0, 0]',
        explanation: 'All zeros are shifted to the end preserving non-zero order.'
      },
      {
        input: '1\n0',
        displayInput: 'nums = [0]',
        output: '0',
        displayOutput: '[0]',
        explanation: 'Single element array remains unchanged.'
      }
    ],
    hints: [
      'Use a write pointer `lastNonZeroFoundAt` starting at index 0.',
      'Iterate through the array. Whenever nums[i] != 0, write it to nums[lastNonZeroFoundAt++] and fill remaining with zeros.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    \n    insert_pos = 0\n    for num in nums:\n        if num != 0:\n            nums[insert_pos] = num\n            insert_pos += 1\n    while insert_pos < n:\n        nums[insert_pos] = 0\n        insert_pos += 1\n    \n    print(" ".join(map(str, nums)))\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringTokenizer st = null;\n        List<String> tokens = new ArrayList<>();\n        String line;\n        while ((line = br.readLine()) != null) {\n            st = new StringTokenizer(line);\n            while (st.hasMoreTokens()) tokens.add(st.nextToken());\n        }\n        if (tokens.isEmpty()) return;\n        int n = Integer.parseInt(tokens.get(0));\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = Integer.parseInt(tokens.get(i + 1));\n        \n        int pos = 0;\n        for (int x : nums) if (x != 0) nums[pos++] = x;\n        while (pos < n) nums[pos++] = 0;\n        \n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < n; i++) sb.append(nums[i]).append(i == n - 1 ? "" : " ");\n        System.out.println(sb.toString());\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    int pos = 0;\n    for (int x : a) if (x != 0) a[pos++] = x;\n    while (pos < n) a[pos++] = 0;\n    for (int i = 0; i < n; i++) cout << a[i] << (i == n - 1 ? "" : " ");\n    cout << "\\n";\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    const nums = tokens.slice(1, n + 1).map(Number);\n    let pos = 0;\n    for (const x of nums) if (x !== 0) nums[pos++] = x;\n    while (pos < n) nums[pos++] = 0;\n    console.log(nums.join(' '));\n}\nsolve();`
    },
    sampleInputs: [
      '5\n0 1 0 3 12',
      '1\n0',
      '4\n0 0 0 1'
    ],
    hiddenInputs: [
      '5\n1 2 3 4 5',
      '6\n0 0 0 0 0 0',
      '7\n4 0 5 0 0 6 7'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const nums = tokens.slice(1, n + 1).map(Number);
      let pos = 0;
      for (const x of nums) if (x !== 0) nums[pos++] = x;
      while (pos < n) nums[pos++] = 0;
      return nums.join(' ');
    }
  }),

  // 6. Majority Element (Easy)
  createCanonicalProblem({
    problemId: 'dsa_arrays_06',
    topicId: 'arrays',
    order: 6,
    title: 'Majority Element',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table', 'Counting'],
    statement: `Given an array \`nums\` of size \`n\`, return the **majority element**.

The majority element is the element that appears more than \`floor(n / 2)\` times. You may assume that the majority element always exists in the array.

Can you solve it in linear time and in O(1) space using Boyer-Moore Voting Algorithm?`,
    constraints: [
      '1 <= n <= 10^5',
      '-10^9 <= nums[i] <= 10^9'
    ],
    examples: [
      {
        input: '3\n3 2 3',
        displayInput: 'nums = [3, 2, 3]',
        output: '3',
        displayOutput: '3',
        explanation: '3 appears 2 times, which is > 3/2 = 1.'
      },
      {
        input: '7\n2 2 1 1 1 2 2',
        displayInput: 'nums = [2, 2, 1, 1, 1, 2, 2]',
        output: '2',
        displayOutput: '2',
        explanation: '2 appears 4 times, which is > 7/2 = 3.'
      }
    ],
    hints: [
      'Boyer-Moore Voting Algorithm maintains a candidate and a counter.',
      'If count == 0, set candidate = nums[i]. If nums[i] == candidate, count++, else count--.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    \n    # Boyer-Moore Voting Algorithm\n    candidate = None\n    count = 0\n    for num in nums:\n        if count == 0:\n            candidate = num\n        count += (1 if num == candidate else -1)\n    \n    print(candidate)\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringTokenizer st = null;\n        List<String> tokens = new ArrayList<>();\n        String line;\n        while ((line = br.readLine()) != null) {\n            st = new StringTokenizer(line);\n            while (st.hasMoreTokens()) tokens.add(st.nextToken());\n        }\n        if (tokens.isEmpty()) return;\n        int n = Integer.parseInt(tokens.get(0));\n        int candidate = 0, count = 0;\n        for (int i = 0; i < n; i++) {\n            int x = Integer.parseInt(tokens.get(i + 1));\n            if (count == 0) candidate = x;\n            count += (x == candidate ? 1 : -1);\n        }\n        System.out.println(candidate);\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    int candidate = 0, count = 0;\n    for (int i = 0; i < n; i++) {\n        int x; cin >> x;\n        if (count == 0) candidate = x;\n        count += (x == candidate ? 1 : -1);\n    }\n    cout << candidate << "\\n";\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    let candidate = 0, count = 0;\n    for (let i = 0; i < n; i++) {\n        const x = parseInt(tokens[i + 1], 10);\n        if (count === 0) candidate = x;\n        count += (x === candidate ? 1 : -1);\n    }\n    console.log(candidate);\n}\nsolve();`
    },
    sampleInputs: [
      '3\n3 2 3',
      '7\n2 2 1 1 1 2 2',
      '1\n99'
    ],
    hiddenInputs: [
      '5\n6 6 6 7 7',
      '9\n10 10 10 10 10 1 2 3 4',
      '4\n1 2 2 2'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      let candidate = 0, count = 0;
      for (let i = 0; i < n; i++) {
        const x = Number(tokens[i + 1]);
        if (count === 0) candidate = x;
        count += (x === candidate ? 1 : -1);
      }
      return String(candidate);
    }
  }),

  // 7. Missing Number (Easy)
  createCanonicalProblem({
    problemId: 'dsa_arrays_07',
    topicId: 'arrays',
    order: 7,
    title: 'Missing Number',
    difficulty: 'Easy',
    tags: ['Array', 'Bit Manipulation', 'Math'],
    statement: `Given an array \`nums\` containing \`n\` distinct numbers in the range \`[0, n]\`, return the **only number** in the range that is missing from the array.

Try to solve it in linear time and in O(1) extra space using Gauss sum or XOR.`,
    constraints: [
      'n == nums.length',
      '1 <= n <= 10^5',
      '0 <= nums[i] <= n',
      'All numbers of nums are unique.'
    ],
    examples: [
      {
        input: '3\n3 0 1',
        displayInput: 'nums = [3, 0, 1]',
        output: '2',
        displayOutput: '2',
        explanation: 'n = 3 since there are 3 numbers, so all numbers are in [0, 3]. 2 is the missing number.'
      },
      {
        input: '2\n0 1',
        displayInput: 'nums = [0, 1]',
        output: '2',
        displayOutput: '2',
        explanation: 'n = 2, range [0, 2]. 2 is missing.'
      }
    ],
    hints: [
      'The expected sum of numbers 0 to n is n * (n + 1) / 2.',
      'Subtracting the actual sum of array elements from the expected sum yields the missing number.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    \n    expected = n * (n + 1) // 2\n    actual = sum(nums)\n    print(expected - actual)\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringTokenizer st = null;\n        List<String> tokens = new ArrayList<>();\n        String line;\n        while ((line = br.readLine()) != null) {\n            st = new StringTokenizer(line);\n            while (st.hasMoreTokens()) tokens.add(st.nextToken());\n        }\n        if (tokens.isEmpty()) return;\n        int n = Integer.parseInt(tokens.get(0));\n        long expected = (long) n * (n + 1) / 2;\n        long actual = 0;\n        for (int i = 0; i < n; i++) actual += Long.parseLong(tokens.get(i + 1));\n        System.out.println(expected - actual);\n    }\n}`,
      cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    long long expected = (long long)n * (n + 1) / 2;\n    long long actual = 0;\n    for (int i = 0; i < n; i++) {\n        long long x; cin >> x;\n        actual += x;\n    }\n    cout << (expected - actual) << "\\n";\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    const expected = (n * (n + 1)) / 2;\n    let actual = 0;\n    for (let i = 0; i < n; i++) actual += parseInt(tokens[i + 1], 10);\n    console.log(expected - actual);\n}\nsolve();`
    },
    sampleInputs: [
      '3\n3 0 1',
      '2\n0 1',
      '9\n9 6 4 2 3 5 7 0 1'
    ],
    hiddenInputs: [
      '1\n0',
      '1\n1',
      '5\n0 1 2 4 5',
      '8\n8 7 6 5 4 3 2 1'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const expected = (n * (n + 1)) / 2;
      let actual = 0;
      for (let i = 0; i < n; i++) actual += Number(tokens[i + 1]);
      return String(expected - actual);
    }
  }),

  // 8. Squares of a Sorted Array (Easy)
  createCanonicalProblem({
    problemId: 'dsa_arrays_08',
    topicId: 'arrays',
    order: 8,
    title: 'Squares of a Sorted Array',
    difficulty: 'Easy',
    tags: ['Array', 'Two Pointers', 'Sorting'],
    statement: `Given an integer array \`nums\` sorted in **non-decreasing order**, return an array of **the squares of each number** sorted in non-decreasing order.

Try to solve it in **O(N)** time using two pointers.`,
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
      'nums is sorted in non-decreasing order.'
    ],
    examples: [
      {
        input: '5\n-4 -1 0 3 10',
        displayInput: 'nums = [-4, -1, 0, 3, 10]',
        output: '0 1 9 16 100',
        displayOutput: '[0, 1, 9, 16, 100]',
        explanation: 'After squaring, the array becomes [16, 1, 0, 9, 100]. After sorting, it becomes [0, 1, 9, 16, 100].'
      }
    ],
    hints: [
      'The largest squares must come from either the far left (most negative) or the far right (most positive).',
      'Use two pointers (left=0, right=n-1) and fill the result array from back to front.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    \n    res = [0] * n\n    l, r = 0, n - 1\n    idx = n - 1\n    while l <= r:\n        sq_l = nums[l] * nums[l]\n        sq_r = nums[r] * nums[r]\n        if sq_l > sq_r:\n            res[idx] = sq_l\n            l += 1\n        else:\n            res[idx] = sq_r\n            r -= 1\n        idx -= 1\n    print(" ".join(map(str, res)))\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringTokenizer st = null;\n        List<String> tokens = new ArrayList<>();\n        String line;\n        while ((line = br.readLine()) != null) {\n            st = new StringTokenizer(line);\n            while (st.hasMoreTokens()) tokens.add(st.nextToken());\n        }\n        if (tokens.isEmpty()) return;\n        int n = Integer.parseInt(tokens.get(0));\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = Integer.parseInt(tokens.get(i + 1));\n        \n        int[] res = new int[n];\n        int l = 0, r = n - 1, idx = n - 1;\n        while (l <= r) {\n            int sl = nums[l] * nums[l], sr = nums[r] * nums[r];\n            if (sl > sr) { res[idx--] = sl; l++; }\n            else { res[idx--] = sr; r--; }\n        }\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < n; i++) sb.append(res[i]).append(i == n - 1 ? "" : " ");\n        System.out.println(sb.toString());\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n), res(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    int l = 0, r = n - 1, idx = n - 1;\n    while (l <= r) {\n        int sl = a[l] * a[l], sr = a[r] * a[r];\n        if (sl > sr) { res[idx--] = sl; l++; }\n        else { res[idx--] = sr; r--; }\n    }\n    for (int i = 0; i < n; i++) cout << res[i] << (i == n - 1 ? "" : " ");\n    cout << "\\n";\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    const nums = tokens.slice(1, n + 1).map(Number);\n    const res = new Array(n);\n    let l = 0, r = n - 1, idx = n - 1;\n    while (l <= r) {\n        const sl = nums[l] * nums[l], sr = nums[r] * nums[r];\n        if (sl > sr) { res[idx--] = sl; l++; }\n        else { res[idx--] = sr; r--; }\n    }\n    console.log(res.join(' '));\n}\nsolve();`
    },
    sampleInputs: [
      '5\n-4 -1 0 3 10',
      '5\n-7 -3 2 3 11'
    ],
    hiddenInputs: [
      '1\n-5',
      '4\n-3 -2 -1 0',
      '4\n0 1 2 3'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const nums = tokens.slice(1, n + 1).map(Number);
      return nums.map(x => x * x).sort((a, b) => a - b).join(' ');
    }
  }),

  // 9. Maximum Subarray (Kadane's) (Medium)
  createCanonicalProblem({
    problemId: 'dsa_arrays_09',
    topicId: 'arrays',
    order: 9,
    title: "Maximum Subarray (Kadane's)",
    difficulty: 'Medium',
    tags: ['Array', 'Dynamic Programming', 'Divide and Conquer'],
    statement: `Given an integer array \`nums\`, find the contiguous subarray (containing at least one number) which has the **largest sum** and return its sum.

Solve in **O(N)** time using Kadane's Algorithm.`,
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4'
    ],
    examples: [
      {
        input: '9\n-2 1 -3 4 -1 2 1 -5 4',
        displayInput: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]',
        output: '6',
        displayOutput: '6',
        explanation: 'Subarray [4, -1, 2, 1] has largest sum = 6.'
      }
    ],
    hints: [
      'Maintain cur_sum and max_sum.',
      'If cur_sum < 0, reset cur_sum = 0 because a negative running prefix will never increase future sums.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    \n    max_sum = nums[0]\n    cur_sum = 0\n    for x in nums:\n        cur_sum += x\n        if cur_sum > max_sum: max_sum = cur_sum\n        if cur_sum < 0: cur_sum = 0\n    print(max_sum)\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringTokenizer st = null;\n        List<String> tokens = new ArrayList<>();\n        String line;\n        while ((line = br.readLine()) != null) {\n            st = new StringTokenizer(line);\n            while (st.hasMoreTokens()) tokens.add(st.nextToken());\n        }\n        if (tokens.isEmpty()) return;\n        int n = Integer.parseInt(tokens.get(0));\n        int maxSum = Integer.parseInt(tokens.get(1)), curSum = 0;\n        for (int i = 0; i < n; i++) {\n            int x = Integer.parseInt(tokens.get(i + 1));\n            curSum += x;\n            if (curSum > maxSum) maxSum = curSum;\n            if (curSum < 0) curSum = 0;\n        }\n        System.out.println(maxSum);\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    int first; cin >> first;\n    int maxSum = first, curSum = first < 0 ? 0 : first;\n    for (int i = 1; i < n; i++) {\n        int x; cin >> x;\n        curSum += x;\n        if (curSum > maxSum) maxSum = curSum;\n        if (curSum < 0) curSum = 0;\n    }\n    cout << maxSum << "\\n"; return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    let maxSum = parseInt(tokens[1], 10), curSum = 0;\n    for (let i = 0; i < n; i++) {\n        const x = parseInt(tokens[i + 1], 10);\n        curSum += x;\n        if (curSum > maxSum) maxSum = curSum;\n        if (curSum < 0) curSum = 0;\n    }\n    console.log(maxSum);\n}\nsolve();`
    },
    sampleInputs: [
      '9\n-2 1 -3 4 -1 2 1 -5 4',
      '1\n1',
      '5\n5 4 -1 7 8'
    ],
    hiddenInputs: [
      '3\n-3 -2 -1',
      '4\n-1 -2 -3 -4',
      '6\n1 2 3 -10 5 6'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const nums = tokens.slice(1, n + 1).map(Number);
      let maxS = nums[0], curS = 0;
      for (const x of nums) {
        curS += x;
        if (curS > maxS) maxS = curS;
        if (curS < 0) curS = 0;
      }
      return String(maxS);
    }
  }),

  // 10. Product of Array Except Self (Medium)
  createCanonicalProblem({
    problemId: 'dsa_arrays_10',
    topicId: 'arrays',
    order: 10,
    title: 'Product of Array Except Self',
    difficulty: 'Medium',
    tags: ['Array', 'Prefix Sum'],
    statement: `Given an integer array \`nums\`, return an array \`answer\` such that \`answer[i]\` is equal to the product of all the elements of \`nums\` except \`nums[i]\`.

You must write an algorithm that runs in **O(N)** time and without using the division operation.`,
    constraints: [
      '2 <= nums.length <= 10^5',
      '-30 <= nums[i] <= 30',
      'The product of any prefix or suffix fits in a 32-bit integer.'
    ],
    examples: [
      {
        input: '4\n1 2 3 4',
        displayInput: 'nums = [1, 2, 3, 4]',
        output: '24 12 8 6',
        displayOutput: '[24, 12, 8, 6]',
        explanation: 'answer[0] = 2*3*4 = 24, answer[1] = 1*3*4 = 12, etc.'
      }
    ],
    hints: [
      'Compute prefix products in a first pass from left to right.',
      'Multiply by suffix products in a second pass from right to left.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    \n    ans = [1] * n\n    pref = 1\n    for i in range(n):\n        ans[i] = pref\n        pref *= nums[i]\n    suff = 1\n    for i in range(n - 1, -1, -1):\n        ans[i] *= suff\n        suff *= nums[i]\n    print(" ".join(map(str, ans)))\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringTokenizer st = null;\n        List<String> tokens = new ArrayList<>();\n        String line;\n        while ((line = br.readLine()) != null) {\n            st = new StringTokenizer(line);\n            while (st.hasMoreTokens()) tokens.add(st.nextToken());\n        }\n        if (tokens.isEmpty()) return;\n        int n = Integer.parseInt(tokens.get(0));\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = Integer.parseInt(tokens.get(i + 1));\n        int[] ans = new int[n];\n        int p = 1;\n        for (int i = 0; i < n; i++) { ans[i] = p; p *= nums[i]; }\n        int s = 1;\n        for (int i = n - 1; i >= 0; i--) { ans[i] *= s; s *= nums[i]; }\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < n; i++) sb.append(ans[i]).append(i == n - 1 ? "" : " ");\n        System.out.println(sb.toString());\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n), ans(n, 1);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    int p = 1; for (int i = 0; i < n; i++) { ans[i] = p; p *= a[i]; }\n    int s = 1; for (int i = n - 1; i >= 0; i--) { ans[i] *= s; s *= a[i]; }\n    for (int i = 0; i < n; i++) cout << ans[i] << (i == n - 1 ? "" : " ");\n    cout << "\\n"; return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    const nums = tokens.slice(1, n + 1).map(Number);\n    const ans = new Array(n).fill(1);\n    let p = 1;\n    for (let i = 0; i < n; i++) { ans[i] = p; p *= nums[i]; }\n    let s = 1;\n    for (let i = n - 1; i >= 0; i--) { ans[i] *= s; s *= nums[i]; }\n    console.log(ans.join(' '));\n}\nsolve();`
    },
    sampleInputs: [
      '4\n1 2 3 4',
      '5\n-1 1 0 -3 3'
    ],
    hiddenInputs: [
      '2\n5 10',
      '3\n2 3 4',
      '4\n0 0 2 3'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const nums = tokens.slice(1, n + 1).map(Number);
      const ans = new Array(n).fill(1);
      let p = 1;
      for (let i = 0; i < n; i++) { ans[i] = p; p *= nums[i]; }
      let s = 1;
      for (let i = n - 1; i >= 0; i--) { ans[i] *= s; s *= nums[i]; }
      return ans.join(' ');
    }
  }),

  // 11. Rotate Array (Medium)
  createCanonicalProblem({
    problemId: 'dsa_arrays_11',
    topicId: 'arrays',
    order: 11,
    title: 'Rotate Array',
    difficulty: 'Medium',
    tags: ['Array', 'Math', 'Two Pointers'],
    statement: `Given an integer array \`nums\`, rotate the array to the right by \`k\` steps, where \`k\` is non-negative.

Do this **in-place** with **O(1)** extra memory using 3 array reversals.`,
    constraints: [
      '1 <= nums.length <= 10^5',
      '-2^31 <= nums[i] <= 2^31 - 1',
      '0 <= k <= 10^5'
    ],
    examples: [
      {
        input: '7 3\n1 2 3 4 5 6 7',
        displayInput: 'nums = [1, 2, 3, 4, 5, 6, 7], k = 3',
        output: '5 6 7 1 2 3 4',
        displayOutput: '[5, 6, 7, 1, 2, 3, 4]',
        explanation: 'Rotated 3 steps to the right.'
      }
    ],
    hints: [
      'k = k % n.',
      'Reverse the entire array. Reverse the first k elements. Reverse the remaining n - k elements.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    k = int(tokens[1]) % n\n    nums = [int(x) for x in tokens[2:2+n]]\n    \n    res = nums[-k:] + nums[:-k] if k > 0 else nums\n    print(" ".join(map(str, res)))\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\nimport java.io.*;\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt(), k = sc.nextInt() % n;\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int[] res = new int[n];\n        for (int i = 0; i < n; i++) res[(i + k) % n] = a[i];\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < n; i++) sb.append(res[i]).append(i == n - 1 ? "" : " ");\n        System.out.println(sb.toString());\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n, k; if (!(cin >> n >> k)) return 0;\n    k %= n;\n    vector<int> a(n), res(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    for (int i = 0; i < n; i++) res[(i + k) % n] = a[i];\n    for (int i = 0; i < n; i++) cout << res[i] << (i == n - 1 ? "" : " ");\n    cout << "\\n"; return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length < 3) return;\n    const n = parseInt(t[0], 10), k = parseInt(t[1], 10) % n;\n    const a = t.slice(2, 2 + n).map(Number);\n    const res = new Array(n);\n    for (let i = 0; i < n; i++) res[(i + k) % n] = a[i];\n    console.log(res.join(' '));\n}\nsolve();`
    },
    sampleInputs: [
      '7 3\n1 2 3 4 5 6 7',
      '4 2\n-1 -100 3 99'
    ],
    hiddenInputs: [
      '1 0\n42',
      '5 10\n1 2 3 4 5',
      '3 4\n1 2 3'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const k = parseInt(tokens[1], 10) % n;
      const a = tokens.slice(2, 2 + n).map(Number);
      const res = new Array(n);
      for (let i = 0; i < n; i++) res[(i + k) % n] = a[i];
      return res.join(' ');
    }
  }),

  // 12. 3Sum (Medium)
  createCanonicalProblem({
    problemId: 'dsa_arrays_12',
    topicId: 'arrays',
    order: 12,
    title: '3Sum',
    difficulty: 'Medium',
    tags: ['Array', 'Two Pointers', 'Sorting'],
    statement: `Given an integer array \`nums\`, return the **count of unique triplets** \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

Notice that the solution set must not contain duplicate triplets. Print the total count of such unique triplets.`,
    constraints: [
      '3 <= nums.length <= 3000',
      '-10^5 <= nums[i] <= 10^5'
    ],
    examples: [
      {
        input: '6\n-1 0 1 2 -1 -4',
        displayInput: 'nums = [-1, 0, 1, 2, -1, -4]',
        output: '2',
        displayOutput: '2',
        explanation: 'The unique triplets are [-1, -1, 2] and [-1, 0, 1]. Count = 2.'
      },
      {
        input: '3\n0 1 1',
        displayInput: 'nums = [0, 1, 1]',
        output: '0',
        displayOutput: '0',
        explanation: 'No triplets sum to 0.'
      }
    ],
    hints: [
      'Sort the array first in O(N log N).',
      'Fix the first element nums[i]. Then use two pointers (left = i + 1, right = n - 1) to find pairs summing to -nums[i].',
      'Skip duplicate values to ensure only unique triplets are counted.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    nums = sorted([int(x) for x in tokens[1:n+1]])\n    \n    count = 0\n    for i in range(n - 2):\n        if i > 0 and nums[i] == nums[i - 1]:\n            continue\n        if nums[i] > 0:\n            break\n        l, r = i + 1, n - 1\n        while l < r:\n            s = nums[i] + nums[l] + nums[r]\n            if s == 0:\n                count += 1\n                while l < r and nums[l] == nums[l + 1]: l += 1\n                while l < r and nums[r] == nums[r - 1]: r -= 1\n                l += 1; r -= 1\n            elif s < 0:\n                l += 1\n            else:\n                r -= 1\n    print(count)\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\nimport java.io.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        Arrays.sort(a);\n        int count = 0;\n        for (int i = 0; i < n - 2; i++) {\n            if (i > 0 && a[i] == a[i - 1]) continue;\n            if (a[i] > 0) break;\n            int l = i + 1, r = n - 1;\n            while (l < r) {\n                int s = a[i] + a[l] + a[r];\n                if (s == 0) {\n                    count++;\n                    while (l < r && a[l] == a[l + 1]) l++;\n                    while (l < r && a[r] == a[r - 1]) r--;\n                    l++; r--;\n                } else if (s < 0) l++; else r--;\n            }\n        }\n        System.out.println(count);\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    sort(a.begin(), a.end());\n    int count = 0;\n    for (int i = 0; i < n - 2; i++) {\n        if (i > 0 && a[i] == a[i - 1]) continue;\n        if (a[i] > 0) break;\n        int l = i + 1, r = n - 1;\n        while (l < r) {\n            int s = a[i] + a[l] + a[r];\n            if (s == 0) {\n                count++;\n                while (l < r && a[l] == a[l + 1]) l++;\n                while (l < r && a[r] == a[r - 1]) r--;\n                l++; r--;\n            } else if (s < 0) l++; else r--;\n        }\n    }\n    cout << count << "\\n"; return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const a = t.slice(1, n + 1).map(Number).sort((x, y) => x - y);\n    let count = 0;\n    for (let i = 0; i < n - 2; i++) {\n        if (i > 0 && a[i] === a[i - 1]) continue;\n        if (a[i] > 0) break;\n        let l = i + 1, r = n - 1;\n        while (l < r) {\n            const s = a[i] + a[l] + a[r];\n            if (s === 0) {\n                count++;\n                while (l < r && a[l] === a[l + 1]) l++;\n                while (l < r && a[r] === a[r - 1]) r--;\n                l++; r--;\n            } else if (s < 0) l++; else r--;\n        }\n    }\n    console.log(count);\n}\nsolve();`
    },
    sampleInputs: [
      '6\n-1 0 1 2 -1 -4',
      '3\n0 1 1',
      '3\n0 0 0'
    ],
    hiddenInputs: [
      '5\n-2 0 1 1 2',
      '7\n-5 2 3 -2 0 1 4',
      '4\n1 2 3 4'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const a = tokens.slice(1, n + 1).map(Number).sort((x, y) => x - y);
      let count = 0;
      for (let i = 0; i < n - 2; i++) {
        if (i > 0 && a[i] === a[i - 1]) continue;
        if (a[i] > 0) break;
        let l = i + 1, r = n - 1;
        while (l < r) {
          const s = a[i] + a[l] + a[r];
          if (s === 0) {
            count++;
            while (l < r && a[l] === a[l + 1]) l++;
            while (l < r && a[r] === a[r - 1]) r--;
            l++; r--;
          } else if (s < 0) l++; else r--;
        }
      }
      return String(count);
    }
  }),

  // 13. Subarray Sum Equals K (Medium)
  createCanonicalProblem({
    problemId: 'dsa_arrays_13',
    topicId: 'arrays',
    order: 13,
    title: 'Subarray Sum Equals K',
    difficulty: 'Medium',
    tags: ['Array', 'Hash Table', 'Prefix Sum'],
    statement: `Given an array of integers \`nums\` and an integer \`k\`, return the **total number of subarrays** whose sum equals to \`k\`.

A subarray is a contiguous non-empty sequence of elements within an array.`,
    constraints: [
      '1 <= nums.length <= 2 * 10^4',
      '-1000 <= nums[i] <= 1000',
      '-10^7 <= k <= 10^7'
    ],
    examples: [
      {
        input: '3 2\n1 1 1',
        displayInput: 'nums = [1, 1, 1], k = 2',
        output: '2',
        displayOutput: '2',
        explanation: 'Subarrays [1, 1] at indices [0, 1] and [1, 2] both sum to 2.'
      },
      {
        input: '3 3\n1 2 3',
        displayInput: 'nums = [1, 2, 3], k = 3',
        output: '2',
        displayOutput: '2',
        explanation: 'Subarrays [1, 2] and [3] sum to 3.'
      }
    ],
    hints: [
      'If cumulative sum up to index j is S_j, and S_j - S_i = k, then the subarray between i and j has sum k.',
      'Maintain a frequency map of prefix sums: `prefix_counts[current_sum] += 1`.'
    ],
    starterCode: {
      python: `import sys\nfrom collections import defaultdict\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    k = int(tokens[1])\n    nums = [int(x) for x in tokens[2:2+n]]\n    \n    pref_counts = defaultdict(int)\n    pref_counts[0] = 1\n    cur_sum = 0\n    ans = 0\n    for x in nums:\n        cur_sum += x\n        ans += pref_counts[cur_sum - k]\n        pref_counts[cur_sum] += 1\n    print(ans)\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\nimport java.io.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt(), k = sc.nextInt();\n        Map<Integer, Integer> map = new HashMap<>();\n        map.put(0, 1);\n        int cur = 0, ans = 0;\n        for (int i = 0; i < n; i++) {\n            cur += sc.nextInt();\n            ans += map.getOrDefault(cur - k, 0);\n            map.put(cur, map.getOrDefault(cur, 0) + 1);\n        }\n        System.out.println(ans);\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\nint main() {\n    int n, k; if (!(cin >> n >> k)) return 0;\n    unordered_map<int, int> mp;\n    mp[0] = 1;\n    int cur = 0, ans = 0;\n    for (int i = 0; i < n; i++) {\n        int x; cin >> x;\n        cur += x;\n        if (mp.count(cur - k)) ans += mp[cur - k];\n        mp[cur]++;\n    }\n    cout << ans << "\\n"; return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length < 3) return;\n    const n = parseInt(t[0], 10), k = parseInt(t[1], 10);\n    const a = t.slice(2, 2 + n).map(Number);\n    const mp = new Map();\n    mp.set(0, 1);\n    let cur = 0, ans = 0;\n    for (const x of a) {\n        cur += x;\n        ans += (mp.get(cur - k) || 0);\n        mp.set(cur, (mp.get(cur) || 0) + 1);\n    }\n    console.log(ans);\n}\nsolve();`
    },
    sampleInputs: [
      '3 2\n1 1 1',
      '3 3\n1 2 3',
      '5 0\n0 0 0 0 0'
    ],
    hiddenInputs: [
      '4 5\n1 2 1 2',
      '5 7\n3 4 7 2 -3',
      '4 0\n1 -1 1 -1'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const k = parseInt(tokens[1], 10);
      const a = tokens.slice(2, 2 + n).map(Number);
      const map = new Map();
      map.set(0, 1);
      let cur = 0, ans = 0;
      for (const x of a) {
        cur += x;
        ans += (map.get(cur - k) || 0);
        map.set(cur, (map.get(cur) || 0) + 1);
      }
      return String(ans);
    }
  }),

  // 14. Next Permutation (Medium)
  createCanonicalProblem({
    problemId: 'dsa_arrays_14',
    topicId: 'arrays',
    order: 14,
    title: 'Next Permutation',
    difficulty: 'Medium',
    tags: ['Array', 'Two Pointers'],
    statement: `A **permutation** of an array of integers is an arrangement of its members into a sequence or linear order.

Find the next lexicographically greater permutation of its numbers. If no greater permutation is possible, rearrange it as the lowest possible order (i.e., sorted in ascending order).

Output the next permutation separated by spaces.`,
    constraints: [
      '1 <= nums.length <= 100',
      '0 <= nums[i] <= 100'
    ],
    examples: [
      {
        input: '3\n1 2 3',
        displayInput: 'nums = [1, 2, 3]',
        output: '1 3 2',
        displayOutput: '[1, 3, 2]',
        explanation: 'The next lexicographical permutation of 1,2,3 is 1,3,2.'
      },
      {
        input: '3\n3 2 1',
        displayInput: 'nums = [3, 2, 1]',
        output: '1 2 3',
        displayOutput: '[1, 2, 3]',
        explanation: '3,2,1 is the highest permutation, so it wraps around to 1,2,3.'
      }
    ],
    hints: [
      '1. Find the largest index i such that nums[i] < nums[i + 1]. If no such index exists, reverse the entire array.',
      '2. Find the largest index j > i such that nums[i] < nums[j]. Swap nums[i] and nums[j].',
      '3. Reverse the sub-array from index i + 1 to the end.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    \n    # 1. Find pivot\n    i = n - 2\n    while i >= 0 and nums[i] >= nums[i + 1]:\n        i -= 1\n    if i >= 0:\n        j = n - 1\n        while nums[j] <= nums[i]:\n            j -= 1\n        nums[i], nums[j] = nums[j], nums[i]\n    nums[i + 1:] = reversed(nums[i + 1:])\n    print(" ".join(map(str, nums)))\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\nimport java.io.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int k = 0; k < n; k++) a[k] = sc.nextInt();\n        int i = n - 2;\n        while (i >= 0 && a[i] >= a[i + 1]) i--;\n        if (i >= 0) {\n            int j = n - 1;\n            while (a[j] <= a[i]) j--;\n            int t = a[i]; a[i] = a[j]; a[j] = t;\n        }\n        int l = i + 1, r = n - 1;\n        while (l < r) { int t = a[l]; a[l] = a[r]; a[r] = t; l++; r--; }\n        StringBuilder sb = new StringBuilder();\n        for (int k = 0; k < n; k++) sb.append(a[k]).append(k == n - 1 ? "" : " ");\n        System.out.println(sb.toString());\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    next_permutation(a.begin(), a.end());\n    for (int i = 0; i < n; i++) cout << a[i] << (i == n - 1 ? "" : " ");\n    cout << "\\n"; return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const a = t.slice(1, n + 1).map(Number);\n    let i = n - 2;\n    while (i >= 0 && a[i] >= a[i + 1]) i--;\n    if (i >= 0) {\n        let j = n - 1;\n        while (a[j] <= a[i]) j--;\n        [a[i], a[j]] = [a[j], a[i]];\n    }\n    let l = i + 1, r = n - 1;\n    while (l < r) { [a[l], a[r]] = [a[r], a[l]]; l++; r--; }\n    console.log(a.join(' '));\n}\nsolve();`
    },
    sampleInputs: [
      '3\n1 2 3',
      '3\n3 2 1',
      '3\n1 1 5'
    ],
    hiddenInputs: [
      '1\n1',
      '4\n1 3 2 4',
      '5\n5 4 3 2 1'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const a = tokens.slice(1, n + 1).map(Number);
      let i = n - 2;
      while (i >= 0 && a[i] >= a[i + 1]) i--;
      if (i >= 0) {
        let j = n - 1;
        while (a[j] <= a[i]) j--;
        [a[i], a[j]] = [a[j], a[i]];
      }
      let l = i + 1, r = n - 1;
      while (l < r) { [a[l], a[r]] = [a[r], a[l]]; l++; r--; }
      return a.join(' ');
    }
  }),

  // 15. Find the Duplicate Number (Medium)
  createCanonicalProblem({
    problemId: 'dsa_arrays_15',
    topicId: 'arrays',
    order: 15,
    title: 'Find the Duplicate Number',
    difficulty: 'Medium',
    tags: ['Array', 'Two Pointers', 'Binary Search'],
    statement: `Given an array of integers \`nums\` containing \`n + 1\` integers where each integer is in the range \`[1, n]\` inclusive.

There is only **one repeated number** in \`nums\`, return this repeated number.

You must solve the problem **without modifying the array** and uses only **constant O(1) extra space** (Floyd's Tortoise and Hare cycle detection).`,
    constraints: [
      '1 <= n <= 10^5',
      'nums.length == n + 1',
      '1 <= nums[i] <= n',
      'All the integers in nums appear only once except for precisely one integer which appears two or more times.'
    ],
    examples: [
      {
        input: '5\n1 3 4 2 2',
        displayInput: 'nums = [1, 3, 4, 2, 2]',
        output: '2',
        displayOutput: '2',
        explanation: '2 is the duplicate number.'
      },
      {
        input: '5\n3 1 3 4 2',
        displayInput: 'nums = [3, 1, 3, 4, 2]',
        output: '3',
        displayOutput: '3',
        explanation: '3 is the duplicate number.'
      }
    ],
    hints: [
      'Treat the array values as pointers: node i points to node nums[i].',
      'Since a value repeats, two indices point to the same next node, creating a cycle!',
      'Use Floyd’s Tortoise and Hare (fast/slow pointers) to find the cycle entrance.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    \n    # Floyd's Cycle Detection\n    slow = nums[0]\n    fast = nums[0]\n    while True:\n        slow = nums[slow]\n        fast = nums[nums[fast]]\n        if slow == fast:\n            break\n    slow = nums[0]\n    while slow != fast:\n        slow = nums[slow]\n        fast = nums[fast]\n    print(slow)\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int slow = nums[0], fast = nums[0];\n        do {\n            slow = nums[slow];\n            fast = nums[nums[fast]];\n        } while (slow != fast);\n        slow = nums[0];\n        while (slow != fast) {\n            slow = nums[slow];\n            fast = nums[fast];\n        }\n        System.out.println(slow);\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    int slow = a[0], fast = a[0];\n    do {\n        slow = a[slow];\n        fast = a[a[fast]];\n    } while (slow != fast);\n    slow = a[0];\n    while (slow != fast) {\n        slow = a[slow];\n        fast = a[fast];\n    }\n    cout << slow << "\\n"; return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const nums = t.slice(1, n + 1).map(Number);\n    let slow = nums[0], fast = nums[0];\n    do {\n        slow = nums[slow];\n        fast = nums[nums[fast]];\n    } while (slow !== fast);\n    slow = nums[0];\n    while (slow !== fast) {\n        slow = nums[slow];\n        fast = nums[fast];\n    }\n    console.log(slow);\n}\nsolve();`
    },
    sampleInputs: [
      '5\n1 3 4 2 2',
      '5\n3 1 3 4 2',
      '4\n3 3 3 3'
    ],
    hiddenInputs: [
      '6\n2 5 9 6 9 3 8 9 7 1',
      '3\n1 1 2',
      '5\n2 2 2 2 2'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const nums = tokens.slice(1, n + 1).map(Number);
      let slow = nums[0], fast = nums[0];
      do {
        slow = nums[slow];
        fast = nums[nums[fast]];
      } while (slow !== fast);
      slow = nums[0];
      while (slow !== fast) {
        slow = nums[slow];
        fast = nums[fast];
      }
      return String(slow);
    }
  }),

  // 16. Spiral Matrix (Medium)
  createCanonicalProblem({
    problemId: 'dsa_arrays_16',
    topicId: 'arrays',
    order: 16,
    title: 'Spiral Matrix',
    difficulty: 'Medium',
    tags: ['Array', 'Matrix', 'Simulation'],
    statement: `Given an \`m x n\` matrix, return all elements of the \`matrix\` in **spiral order**.

Output the elements traversed in clockwise spiral order separated by spaces.`,
    constraints: [
      'm == matrix.length',
      'n == matrix[i].length',
      '1 <= m, n <= 100',
      '-100 <= matrix[i][j] <= 100'
    ],
    examples: [
      {
        input: '3 3\n1 2 3\n4 5 6\n7 8 9',
        displayInput: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]',
        output: '1 2 3 6 9 8 7 4 5',
        displayOutput: '[1, 2, 3, 6, 9, 8, 7, 4, 5]',
        explanation: 'Spiral clockwise traversal visits top row, right column, bottom row, left column, then inner layer.'
      }
    ],
    hints: [
      'Maintain 4 boundaries: top, bottom, left, right.',
      'Iterate left -> right on top row, then top++.',
      'Iterate top -> bottom on right column, then right--.',
      'Iterate right -> left on bottom row, then bottom--.',
      'Iterate bottom -> top on left column, then left++.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    m = int(tokens[0])\n    n = int(tokens[1])\n    matrix = []\n    idx = 2\n    for _ in range(m):\n        matrix.append([int(x) for x in tokens[idx:idx+n]])\n        idx += n\n    \n    res = []\n    top, bottom, left, right = 0, m - 1, 0, n - 1\n    while top <= bottom and left <= right:\n        for c in range(left, right + 1): res.append(matrix[top][c])\n        top += 1\n        for r in range(top, bottom + 1): res.append(matrix[r][right])\n        right -= 1\n        if top <= bottom:\n            for c in range(right, left - 1, -1): res.append(matrix[bottom][c])\n            bottom -= 1\n        if left <= right:\n            for r in range(bottom, top - 1, -1): res.append(matrix[r][left])\n            left += 1\n    print(" ".join(map(str, res)))\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\nimport java.io.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int m = sc.nextInt(), n = sc.nextInt();\n        int[][] mat = new int[m][n];\n        for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) mat[i][j] = sc.nextInt();\n        List<Integer> res = new ArrayList<>();\n        int top = 0, bottom = m - 1, left = 0, right = n - 1;\n        while (top <= bottom && left <= right) {\n            for (int c = left; c <= right; c++) res.add(mat[top][c]);\n            top++;\n            for (int r = top; r <= bottom; r++) res.add(mat[r][right]);\n            right--;\n            if (top <= bottom) {\n                for (int c = right; c >= left; c--) res.add(mat[bottom][c]);\n                bottom--;\n            }\n            if (left <= right) {\n                for (int r = bottom; r >= top; r--) res.add(mat[r][left]);\n                left++;\n            }\n        }\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < res.size(); i++) sb.append(res.get(i)).append(i == res.size() - 1 ? "" : " ");\n        System.out.println(sb.toString());\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int m, n; if (!(cin >> m >> n)) return 0;\n    vector<vector<int>> mat(m, vector<int>(n));\n    for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) cin >> mat[i][j];\n    vector<int> res;\n    int top = 0, bottom = m - 1, left = 0, right = n - 1;\n    while (top <= bottom && left <= right) {\n        for (int c = left; c <= right; c++) res.push_back(mat[top][c]);\n        top++;\n        for (int r = top; r <= bottom; r++) res.push_back(mat[r][right]);\n        right--;\n        if (top <= bottom) {\n            for (int c = right; c >= left; c--) res.push_back(mat[bottom][c]);\n            bottom--;\n        }\n        if (left <= right) {\n            for (int r = bottom; r >= top; r--) res.push_back(mat[r][left]);\n            left++;\n        }\n    }\n    for (int i = 0; i < res.size(); i++) cout << res[i] << (i == res.size() - 1 ? "" : " ");\n    cout << "\\n"; return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length < 3) return;\n    const m = parseInt(t[0], 10), n = parseInt(t[1], 10);\n    const mat = [];\n    let idx = 2;\n    for (let i = 0; i < m; i++) { mat.push(t.slice(idx, idx + n).map(Number)); idx += n; }\n    const res = [];\n    let top = 0, bottom = m - 1, left = 0, right = n - 1;\n    while (top <= bottom && left <= right) {\n        for (let c = left; c <= right; c++) res.push(mat[top][c]);\n        top++;\n        for (let r = top; r <= bottom; r++) res.push(mat[r][right]);\n        right--;\n        if (top <= bottom) {\n            for (let c = right; c >= left; c--) res.push(mat[bottom][c]);\n            bottom--;\n        }\n        if (left <= right) {\n            for (let r = bottom; r >= top; r--) res.push(mat[r][left]);\n            left++;\n        }\n    }\n    console.log(res.join(' '));\n}\nsolve();`
    },
    sampleInputs: [
      '3 3\n1 2 3\n4 5 6\n7 8 9',
      '3 4\n1 2 3 4\n5 6 7 8\n9 10 11 12'
    ],
    hiddenInputs: [
      '1 1\n7',
      '2 2\n1 2\n3 4',
      '1 4\n10 20 30 40'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const m = parseInt(tokens[0], 10);
      const n = parseInt(tokens[1], 10);
      const mat = [];
      let idx = 2;
      for (let i = 0; i < m; i++) { mat.push(tokens.slice(idx, idx + n).map(Number)); idx += n; }
      const res = [];
      let top = 0, bottom = m - 1, left = 0, right = n - 1;
      while (top <= bottom && left <= right) {
        for (let c = left; c <= right; c++) res.push(mat[top][c]);
        top++;
        for (let r = top; r <= bottom; r++) res.push(mat[r][right]);
        right--;
        if (top <= bottom) {
          for (let c = right; c >= left; c--) res.push(mat[bottom][c]);
          bottom--;
        }
        if (left <= right) {
          for (let r = bottom; r >= top; r--) res.push(mat[r][left]);
          left++;
        }
      }
      return res.join(' ');
    }
  }),

  // 17. Trapping Rain Water (Hard)
  createCanonicalProblem({
    problemId: 'dsa_arrays_17',
    topicId: 'arrays',
    order: 17,
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    tags: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack'],
    statement: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.

Solve in **O(N)** time and **O(1)** extra space using the optimal Two Pointers technique.`,
    constraints: [
      'n == height.length',
      '1 <= n <= 10^5',
      '0 <= height[i] <= 10^5'
    ],
    examples: [
      {
        input: '12\n0 1 0 2 1 0 1 3 2 1 2 1',
        displayInput: 'height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]',
        output: '6',
        displayOutput: '6',
        explanation: '6 units of rain water are trapped between the bars.'
      },
      {
        input: '6\n4 2 0 3 2 5',
        displayInput: 'height = [4, 2, 0, 3, 2, 5]',
        output: '9',
        displayOutput: '9',
        explanation: 'Trapped water sum is 9 units.'
      }
    ],
    hints: [
      'At any index i, water trapped is `min(max_left, max_right) - height[i]`.',
      'Using two pointers from both ends, whichever pointer has smaller height limits water on its side.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    h = [int(x) for x in tokens[1:n+1]]\n    \n    l, r = 0, n - 1\n    left_max, right_max = 0, 0\n    water = 0\n    while l < r:\n        if h[l] < h[r]:\n            if h[l] >= left_max:\n                left_max = h[l]\n            else:\n                water += left_max - h[l]\n            l += 1\n        else:\n            if h[r] >= right_max:\n                right_max = h[r]\n            else:\n                water += right_max - h[r]\n            r -= 1\n    print(water)\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\nimport java.io.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] h = new int[n];\n        for (int i = 0; i < n; i++) h[i] = sc.nextInt();\n        int l = 0, r = n - 1, leftMax = 0, rightMax = 0;\n        long water = 0;\n        while (l < r) {\n            if (h[l] < h[r]) {\n                if (h[l] >= leftMax) leftMax = h[l];\n                else water += leftMax - h[l];\n                l++;\n            } else {\n                if (h[r] >= rightMax) rightMax = h[r];\n                else water += rightMax - h[r];\n                r--;\n            }\n        }\n        System.out.println(water);\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> h(n);\n    for (int i = 0; i < n; i++) cin >> h[i];\n    int l = 0, r = n - 1, leftMax = 0, rightMax = 0;\n    long long water = 0;\n    while (l < r) {\n        if (h[l] < h[r]) {\n            if (h[l] >= leftMax) leftMax = h[l];\n            else water += leftMax - h[l];\n            l++;\n        } else {\n            if (h[r] >= rightMax) rightMax = h[r];\n            else water += rightMax - h[r];\n            r--;\n        }\n    }\n    cout << water << "\\n"; return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const h = t.slice(1, n + 1).map(Number);\n    let l = 0, r = n - 1, leftMax = 0, rightMax = 0, water = 0;\n    while (l < r) {\n        if (h[l] < h[r]) {\n            if (h[l] >= leftMax) leftMax = h[l];\n            else water += leftMax - h[l];\n            l++;\n        } else {\n            if (h[r] >= rightMax) rightMax = h[r];\n            else water += rightMax - h[r];\n            r--;\n        }\n    }\n    console.log(water);\n}\nsolve();`
    },
    sampleInputs: [
      '12\n0 1 0 2 1 0 1 3 2 1 2 1',
      '6\n4 2 0 3 2 5',
      '3\n2 0 2'
    ],
    hiddenInputs: [
      '1\n5',
      '4\n3 2 1 0',
      '5\n5 1 2 1 5'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const h = tokens.slice(1, n + 1).map(Number);
      let l = 0, r = n - 1, leftMax = 0, rightMax = 0, water = 0;
      while (l < r) {
        if (h[l] < h[r]) {
          if (h[l] >= leftMax) leftMax = h[l];
          else water += leftMax - h[l];
          l++;
        } else {
          if (h[r] >= rightMax) rightMax = h[r];
          else water += rightMax - h[r];
          r--;
        }
      }
      return String(water);
    }
  }),

  // 18. First Missing Positive (Hard)
  createCanonicalProblem({
    problemId: 'dsa_arrays_18',
    topicId: 'arrays',
    order: 18,
    title: 'First Missing Positive',
    difficulty: 'Hard',
    tags: ['Array', 'Hash Table'],
    statement: `Given an unsorted integer array \`nums\`, return the **smallest positive integer** that is not present in \`nums\`.

You must implement an algorithm that runs in **O(N)** time and uses **O(1)** auxiliary space by placing numbers into their natural bucket indices (\`nums[i] == i + 1\`).`,
    constraints: [
      '1 <= nums.length <= 10^5',
      '-2^31 <= nums[i] <= 2^31 - 1'
    ],
    examples: [
      {
        input: '3\n1 2 0',
        displayInput: 'nums = [1, 2, 0]',
        output: '3',
        displayOutput: '3',
        explanation: 'The numbers in range are 1, 2. The smallest missing positive is 3.'
      },
      {
        input: '4\n3 4 -1 1',
        displayInput: 'nums = [3, 4, -1, 1]',
        output: '2',
        displayOutput: '2',
        explanation: '1 is present, but 2 is missing.'
      }
    ],
    hints: [
      'The answer must lie in the range [1, n + 1].',
      'Swap each number x to index x - 1 if 1 <= x <= n and nums[x - 1] != x.',
      'In a second pass, the first index i where nums[i] != i + 1 gives the missing integer i + 1.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    \n    for i in range(n):\n        while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:\n            target = nums[i] - 1\n            nums[i], nums[target] = nums[target], nums[i]\n    for i in range(n):\n        if nums[i] != i + 1:\n            print(i + 1)\n            return\n    print(n + 1)\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        for (int i = 0; i < n; i++) {\n            while (a[i] >= 1 && a[i] <= n && a[a[i] - 1] != a[i]) {\n                int t = a[a[i] - 1]; a[a[i] - 1] = a[i]; a[i] = t;\n            }\n        }\n        for (int i = 0; i < n; i++) {\n            if (a[i] != i + 1) { System.out.println(i + 1); return; }\n        }\n        System.out.println(n + 1);\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    for (int i = 0; i < n; i++) {\n        while (a[i] >= 1 && a[i] <= n && a[a[i] - 1] != a[i]) {\n            swap(a[i], a[a[i] - 1]);\n        }\n    }\n    for (int i = 0; i < n; i++) {\n        if (a[i] != i + 1) { cout << i + 1 << "\\n"; return 0; }\n    }\n    cout << n + 1 << "\\n"; return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const a = t.slice(1, n + 1).map(Number);\n    for (let i = 0; i < n; i++) {\n        while (a[i] >= 1 && a[i] <= n && a[a[i] - 1] !== a[i]) {\n            const target = a[i] - 1;\n            [a[i], a[target]] = [a[target], a[i]];\n        }\n    }\n    for (let i = 0; i < n; i++) {\n        if (a[i] !== i + 1) { console.log(i + 1); return; }\n    }\n    console.log(n + 1);\n}\nsolve();`
    },
    sampleInputs: [
      '3\n1 2 0',
      '4\n3 4 -1 1',
      '5\n7 8 9 11 12'
    ],
    hiddenInputs: [
      '1\n1',
      '1\n2',
      '4\n1 2 3 4'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const a = tokens.slice(1, n + 1).map(Number);
      for (let i = 0; i < n; i++) {
        while (a[i] >= 1 && a[i] <= n && a[a[i] - 1] !== a[i]) {
          const target = a[i] - 1;
          [a[i], a[target]] = [a[target], a[i]];
        }
      }
      for (let i = 0; i < n; i++) {
        if (a[i] !== i + 1) return String(i + 1);
      }
      return String(n + 1);
    }
  }),

  // 19. Largest Rectangle in Histogram (Hard)
  createCanonicalProblem({
    problemId: 'dsa_arrays_19',
    topicId: 'arrays',
    order: 19,
    title: 'Largest Rectangle in Histogram',
    difficulty: 'Hard',
    tags: ['Array', 'Stack', 'Monotonic Stack'],
    statement: `Given an array of integers \`heights\` representing the histogram's bar height where the width of each bar is \`1\`, return the **area of the largest rectangle** in the histogram.

Solve in **O(N)** time using a monotonic increasing stack.`,
    constraints: [
      '1 <= heights.length <= 10^5',
      '0 <= heights[i] <= 10^4'
    ],
    examples: [
      {
        input: '6\n2 1 5 6 2 3',
        displayInput: 'heights = [2, 1, 5, 6, 2, 3]',
        output: '10',
        displayOutput: '10',
        explanation: 'Bars 5 and 6 form rectangle of width 2 and height 5, area = 10.'
      },
      {
        input: '2\n2 4',
        displayInput: 'heights = [2, 4]',
        output: '4',
        displayOutput: '4',
        explanation: 'Largest rectangle has area = 4.'
      }
    ],
    hints: [
      'Use a monotonic stack storing bar indices with increasing heights.',
      'When current bar is shorter than stack top, pop stack top and compute area with height of popped bar.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    h = [int(x) for x in tokens[1:n+1]]\n    \n    h.append(0)\n    stack = [-1]\n    max_area = 0\n    for i, height in enumerate(h):\n        while stack[-1] != -1 and h[stack[-1]] >= height:\n            cur_h = h[stack.pop()]\n            w = i - stack[-1] - 1\n            max_area = max(max_area, cur_h * w)\n        stack.append(i)\n    print(max_area)\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] h = new int[n + 1];\n        for (int i = 0; i < n; i++) h[i] = sc.nextInt();\n        h[n] = 0;\n        Stack<Integer> st = new Stack<>();\n        st.push(-1);\n        long maxArea = 0;\n        for (int i = 0; i <= n; i++) {\n            while (st.peek() != -1 && h[st.peek()] >= h[i]) {\n                int height = h[st.pop()];\n                int w = i - st.peek() - 1;\n                maxArea = Math.max(maxArea, (long) height * w);\n            }\n            st.push(i);\n        }\n        System.out.println(maxArea);\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <stack>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> h(n + 1);\n    for (int i = 0; i < n; i++) cin >> h[i];\n    h[n] = 0;\n    stack<int> st;\n    st.push(-1);\n    long long maxArea = 0;\n    for (int i = 0; i <= n; i++) {\n        while (st.top() != -1 && h[st.top()] >= h[i]) {\n            int height = h[st.top()]; st.pop();\n            int w = i - st.top() - 1;\n            maxArea = max(maxArea, (long long)height * w);\n        }\n        st.push(i);\n    }\n    cout << maxArea << "\\n"; return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const h = t.slice(1, n + 1).map(Number);\n    h.push(0);\n    const st = [-1];\n    let maxArea = 0;\n    for (let i = 0; i <= n; i++) {\n        while (st[st.length - 1] !== -1 && h[st[st.length - 1]] >= h[i]) {\n            const height = h[st.pop()];\n            const w = i - st[st.length - 1] - 1;\n            maxArea = Math.max(maxArea, height * w);\n        }\n        st.push(i);\n    }\n    console.log(maxArea);\n}\nsolve();`
    },
    sampleInputs: [
      '6\n2 1 5 6 2 3',
      '2\n2 4'
    ],
    hiddenInputs: [
      '1\n10',
      '5\n1 1 1 1 1',
      '4\n4 3 2 1'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const h = tokens.slice(1, n + 1).map(Number);
      h.push(0);
      const st = [-1];
      let maxArea = 0;
      for (let i = 0; i <= n; i++) {
        while (st[st.length - 1] !== -1 && h[st[st.length - 1]] >= h[i]) {
          const height = h[st.pop()];
          const w = i - st[st.length - 1] - 1;
          maxArea = Math.max(maxArea, height * w);
        }
        st.push(i);
      }
      return String(maxArea);
    }
  }),

  // 20. Sliding Window Maximum (Hard)
  createCanonicalProblem({
    problemId: 'dsa_arrays_20',
    topicId: 'arrays',
    order: 20,
    title: 'Sliding Window Maximum',
    difficulty: 'Hard',
    tags: ['Array', 'Queue', 'Sliding Window', 'Monotonic Queue'],
    statement: `You are given an array of integers \`nums\`, there is a sliding window of size \`k\` which is moving from the very left of the array to the very right. You can only see the \`k\` numbers in the window. Each time the sliding window moves right by one position.

Return the **max sliding window** (the maximum of each window position).

Solve in **O(N)** time using a monotonic decreasing deque.`,
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
      '1 <= k <= nums.length'
    ],
    examples: [
      {
        input: '8 3\n1 3 -1 -3 5 3 6 7',
        displayInput: 'nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3',
        output: '3 3 5 5 6 7',
        displayOutput: '[3, 3, 5, 5, 6, 7]',
        explanation: 'Window positions and max: [1, 3, -1]->3, [3, -1, -3]->3, [-1, -3, 5]->5, etc.'
      }
    ],
    hints: [
      'Maintain indices in a double-ended queue (deque) in decreasing order of element values.',
      'Before adding i, pop indices from back whose values are <= nums[i].',
      'Pop indices from front that fall outside the current window (i - deque[0] >= k).'
    ],
    starterCode: {
      python: `import sys\nfrom collections import deque\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    k = int(tokens[1])\n    nums = [int(x) for x in tokens[2:2+n]]\n    \n    q = deque()\n    res = []\n    for i, x in enumerate(nums):\n        while q and q[0] <= i - k:\n            q.popleft()\n        while q and nums[q[-1]] <= x:\n            q.pop()\n        q.append(i)\n        if i >= k - 1:\n            res.append(nums[q[0]])\n    print(" ".join(map(str, res)))\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\nimport java.io.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt(), k = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        Deque<Integer> q = new ArrayDeque<>();\n        List<Integer> res = new ArrayList<>();\n        for (int i = 0; i < n; i++) {\n            while (!q.isEmpty() && q.peekFirst() <= i - k) q.pollFirst();\n            while (!q.isEmpty() && a[q.peekLast()] <= a[i]) q.pollLast();\n            q.offerLast(i);\n            if (i >= k - 1) res.add(a[q.peekFirst()]);\n        }\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < res.size(); i++) sb.append(res.get(i)).append(i == res.size() - 1 ? "" : " ");\n        System.out.println(sb.toString());\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <deque>\nusing namespace std;\nint main() {\n    int n, k; if (!(cin >> n >> k)) return 0;\n    vector<int> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    deque<int> q;\n    vector<int> res;\n    for (int i = 0; i < n; i++) {\n        while (!q.empty() && q.front() <= i - k) q.pop_front();\n        while (!q.empty() && a[q.back()] <= a[i]) q.pop_back();\n        q.push_back(i);\n        if (i >= k - 1) res.push_back(a[q.front()]);\n    }\n    for (int i = 0; i < res.size(); i++) cout << res[i] << (i == res.size() - 1 ? "" : " ");\n    cout << "\\n"; return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length < 3) return;\n    const n = parseInt(t[0], 10), k = parseInt(t[1], 10);\n    const a = t.slice(2, 2 + n).map(Number);\n    const q = [];\n    const res = [];\n    for (let i = 0; i < n; i++) {\n        while (q.length && q[0] <= i - k) q.shift();\n        while (q.length && a[q[q.length - 1]] <= a[i]) q.pop();\n        q.push(i);\n        if (i >= k - 1) res.push(a[q[0]]);\n    }\n    console.log(res.join(' '));\n}\nsolve();`
    },
    sampleInputs: [
      '8 3\n1 3 -1 -3 5 3 6 7',
      '1 1\n1'
    ],
    hiddenInputs: [
      '4 2\n9 11 8 5',
      '5 1\n1 2 3 4 5',
      '6 6\n10 20 30 40 50 60'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const k = parseInt(tokens[1], 10);
      const a = tokens.slice(2, 2 + n).map(Number);
      const q = [];
      const res = [];
      for (let i = 0; i < n; i++) {
        while (q.length && q[0] <= i - k) q.shift();
        while (q.length && a[q[q.length - 1]] <= a[i]) q.pop();
        q.push(i);
        if (i >= k - 1) res.push(a[q[0]]);
      }
      return res.join(' ');
    }
  })
];

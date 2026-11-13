/**
 * 3 Hand-written Golden Standard DSA Placement Problems
 * Complete with:
 * - Full problem statements, constraints, examples
 * - 3 levels of hints
 * - 3 Approaches (Brute Force, Better, Optimal) with ideas, dry runs, complexities, common mistakes, and complete code in Python, Java, C++, JS
 * - Starter code with STDIN reading already written
 * - Visible test cases + Hidden edge test cases
 */

export const SAMPLE_DSA_PROBLEMS = [
  {
    problemId: 'dsa_arr_01_two_sum',
    topicId: 'arrays',
    title: 'Two Sum',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table', 'Two Pointers'],
    statement: `Given an array of integers \`nums\` and an integer \`target\`, find the indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

Output the two 0-based indices separated by a space in ascending order.`,
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Exactly one valid answer exists.'
    ],
    examples: [
      {
        input: '4\n2 7 11 15\n9',
        output: '0 1',
        explanation: 'Because nums[0] + nums[1] == 2 + 7 == 9, we print 0 1.'
      },
      {
        input: '3\n3 2 4\n6',
        output: '1 2',
        explanation: 'Because nums[1] + nums[2] == 2 + 4 == 6, we print 1 2.'
      },
      {
        input: '2\n3 3\n6',
        output: '0 1',
        explanation: 'Because nums[0] + nums[1] == 3 + 3 == 6, we print 0 1.'
      }
    ],
    hints: [
      'Level 1: Can you check every pair of elements using two nested loops?',
      'Level 2: For each element x, we need to know if (target - x) already exists in the array. What data structure allows O(1) lookup?',
      'Level 3: Use a Hash Map. As you iterate through the array, check if `target - num` is already in the map. If yes, you found the pair. If not, insert `map[num] = index`.'
    ],
    starterCode: {
      python: `import sys

def solve():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    n = int(input_data[0])
    nums = [int(x) for x in input_data[1:n+1]]
    target = int(input_data[n+1])
    
    # Write your solution below
    # Output the two indices separated by a space (e.g. print(f"{idx1} {idx2}"))
    pass

if __name__ == '__main__':
    solve()
`,
      java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = null;
        String line;
        List<String> tokens = new ArrayList<>();
        while ((line = br.readLine()) != null) {
            st = new StringTokenizer(line);
            while (st.hasMoreTokens()) tokens.add(st.nextToken());
        }
        if (tokens.isEmpty()) return;

        int n = Integer.parseInt(tokens.get(0));
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = Integer.parseInt(tokens.get(i + 1));
        int target = Integer.parseInt(tokens.get(n + 1));

        // Write your solution below
        // Print the two indices separated by space: System.out.println(i + " " + j);
    }
}
`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int target;
    cin >> target;

    // Write your solution below
    // Output the two indices separated by space: cout << i << " " << j << "\\n";

    return 0;
}
`,
      javascript: `const fs = require('fs');

function solve() {
    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!tokens || tokens.length < 3 || tokens[0] === '') return;

    const n = parseInt(tokens[0], 10);
    const nums = [];
    for (let i = 0; i < n; i++) {
        nums.push(parseInt(tokens[i + 1], 10));
    }
    const target = parseInt(tokens[n + 1], 10);

    // Write your solution below
    // Print the two indices separated by space: console.log(\`\${i} \${j}\`);
}

solve();
`
    },
    approaches: [
      {
        name: 'Approach 1: Brute Force',
        idea: 'Check every possible pair (i, j) using two nested loops. If nums[i] + nums[j] equals target, return their indices.',
        dryRun: 'nums = [2, 7, 11, 15], target = 9. Loop i=0 (2): j=1 (7) -> 2+7=9 == target -> Return 0 1.',
        timeComplexity: 'O(N^2) because we test every pair.',
        spaceComplexity: 'O(1) auxiliary space.',
        whenToUse: 'When N is very small (N <= 1000) or as a baseline to verify correctness.',
        code: {
          python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    target = int(tokens[n+1])\n    for i in range(n):\n        for j in range(i + 1, n):\n            if nums[i] + nums[j] == target:\n                print(f"{i} {j}")\n                return\n\nif __name__ == '__main__':\n    solve()`,
          java: `import java.util.*;\nimport java.io.*;\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int target = sc.nextInt();\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                if (nums[i] + nums[j] == target) {\n                    System.out.println(i + " " + j);\n                    return;\n                }\n            }\n        }\n    }\n}`,
          cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for(int i=0; i<n; i++) cin >> nums[i];\n    int target; cin >> target;\n    for(int i=0; i<n; i++) {\n        for(int j=i+1; j<n; j++) {\n            if (nums[i] + nums[j] == target) {\n                cout << i << " " << j << "\\n";\n                return 0;\n            }\n        }\n    }\n    return 0;\n}`,
          javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 3) return;\n    const n = parseInt(tokens[0]);\n    const nums = tokens.slice(1, n+1).map(Number);\n    const target = Number(tokens[n+1]);\n    for(let i=0; i<n; i++) {\n        for(let j=i+1; j<n; j++) {\n            if (nums[i] + nums[j] === target) {\n                console.log(i + " " + j);\n                return;\n            }\n        }\n    }\n}\nsolve();`
        }
      },
      {
        name: 'Approach 2: Two Pointers on Sorted Copy',
        idea: 'Store elements with original indices, sort by value, and use two pointers (left and right) moving toward each other.',
        dryRun: 'Pair values with indices: [(2,0), (7,1), (11,2), (15,3)]. L=0(2), R=3(15) -> sum 17 > 9 -> R--. R=2(11) -> sum 13 > 9 -> R--. R=1(7) -> sum 9 == target. Return indices 0 1.',
        timeComplexity: 'O(N log N) dominated by the sorting step.',
        spaceComplexity: 'O(N) to store element-index pairs.',
        whenToUse: 'When extra space for a hash map is not permitted, or when the array is already sorted.',
        code: {
          python: `import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    target = int(tokens[n+1])\n    pairs = sorted([(nums[i], i) for i in range(n)])\n    l, r = 0, n - 1\n    while l < r:\n        cur = pairs[l][0] + pairs[r][0]\n        if cur == target:\n            idx1, idx2 = sorted([pairs[l][1], pairs[r][1]])\n            print(f"{idx1} {idx2}")\n            return\n        elif cur < target: l += 1\n        else: r -= 1\nif __name__ == '__main__':\nsolve()`,
          java: `import java.util.*;\nimport java.io.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[][] p = new int[n][2];\n        for (int i=0; i<n; i++) { p[i][0] = sc.nextInt(); p[i][1] = i; }\n        int target = sc.nextInt();\n        Arrays.sort(p, (a, b) -> Integer.compare(a[0], b[0]));\n        int l = 0, r = n - 1;\n        while (l < r) {\n            int sum = p[l][0] + p[r][0];\n            if (sum == target) {\n                int i1 = Math.min(p[l][1], p[r][1]), i2 = Math.max(p[l][1], p[r][1]);\n                System.out.println(i1 + " " + i2); return;\n            } else if (sum < target) l++; else r--;\n        }\n    }\n}`,
          cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<pair<int,int>> p(n);\n    for(int i=0; i<n; i++) { cin >> p[i].first; p[i].second = i; }\n    int target; cin >> target;\n    sort(p.begin(), p.end());\n    int l = 0, r = n - 1;\n    while(l < r) {\n        int sum = p[l].first + p[r].first;\n        if (sum == target) {\n            int i1 = min(p[l].second, p[r].second), i2 = max(p[l].second, p[r].second);\n            cout << i1 << " " << i2 << "\\n"; return 0;\n        } else if (sum < target) l++; else r--;\n    }\n    return 0;\n}`,
          javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 3) return;\n    const n = parseInt(tokens[0]);\n    const p = [];\n    for(let i=0; i<n; i++) p.push({ val: Number(tokens[i+1]), idx: i });\n    const target = Number(tokens[n+1]);\n    p.sort((a,b) => a.val - b.val);\n    let l = 0, r = n - 1;\n    while(l < r) {\n        const sum = p[l].val + p[r].val;\n        if (sum === target) {\n            const i1 = Math.min(p[l].idx, p[r].idx), i2 = Math.max(p[l].idx, p[r].idx);\n            console.log(i1 + " " + i2); return;\n        } else if (sum < target) l++; else r--;\n    }\n}\nsolve();`
        }
      },
      {
        name: 'Approach 3: One-Pass Hash Map (Optimal)',
        idea: 'Iterate through the array once. For each element x, compute complement = target - x. If complement is already in the hash map, we found the solution. Otherwise, insert x and its index into the map.',
        dryRun: 'nums = [2, 7, 11, 15], target = 9. Seen = {}. i=0: x=2, complement=7 not in seen -> seen[2]=0. i=1: x=7, complement=2 IS in seen at index 0. Return 0 1.',
        timeComplexity: 'O(N) single pass through the array.',
        spaceComplexity: 'O(N) to store up to N elements in the hash map.',
        whenToUse: 'This is the gold-standard interview solution expected by Google, Microsoft, and top campus recruiters.',
        code: {
          python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    target = int(tokens[n+1])\n    \n    seen = {}\n    for i, num in enumerate(nums):\n        comp = target - num\n        if comp in seen:\n            print(f"{seen[comp]} {i}")\n            return\n        seen[num] = i\n\nif __name__ == '__main__':\n    solve()`,
          java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringTokenizer st = null;\n        List<String> tokens = new ArrayList<>();\n        String line;\n        while ((line = br.readLine()) != null) {\n            st = new StringTokenizer(line);\n            while (st.hasMoreTokens()) tokens.add(st.nextToken());\n        }\n        if (tokens.isEmpty()) return;\n        int n = Integer.parseInt(tokens.get(0));\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = Integer.parseInt(tokens.get(i + 1));\n        int target = Integer.parseInt(tokens.get(n + 1));\n\n        Map<Integer, Integer> seen = new HashMap<>();\n        for (int i = 0; i < n; i++) {\n            int comp = target - nums[i];\n            if (seen.containsKey(comp)) {\n                System.out.println(seen.get(comp) + " " + i);\n                return;\n            }\n            seen.put(nums[i], i);\n        }\n    }\n}`,
          cpp: `#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for(int i = 0; i < n; i++) cin >> nums[i];\n    int target;\n    cin >> target;\n\n    unordered_map<int, int> seen;\n    for(int i = 0; i < n; i++) {\n        int comp = target - nums[i];\n        if (seen.find(comp) != seen.end()) {\n            cout << seen[comp] << " " << i << "\\n";\n            return 0;\n        }\n        seen[nums[i]] = i;\n    }\n    return 0;\n}`,
          javascript: `const fs = require('fs');\n\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 3) return;\n    const n = parseInt(tokens[0], 10);\n    const nums = [];\n    for (let i = 0; i < n; i++) {\n        nums.push(parseInt(tokens[i + 1], 10));\n    }\n    const target = parseInt(tokens[n + 1], 10);\n\n    const seen = new Map();\n    for (let i = 0; i < n; i++) {\n        const comp = target - nums[i];\n        if (seen.has(comp)) {\n            console.log(seen.get(comp) + " " + i);\n            return;\n        }\n        seen.set(nums[i], i);\n    }\n}\n\nsolve();`
        }
      }
    ],
    commonMistakes: [
      'Returning values instead of 0-based indices.',
      'Using the same element twice (e.g., nums[i] + nums[i] == target) because of inserting before checking.',
      'Assuming the input array is already sorted (never sort in-place if you must return original indices).'
    ],
    testCases: [
      { input: '4\n2 7 11 15\n9', expectedOutput: '0 1' },
      { input: '3\n3 2 4\n6', expectedOutput: '1 2' },
      { input: '2\n3 3\n6', expectedOutput: '0 1' }
    ],
    hiddenTestCases: [
      { input: '5\n-3 4 3 90 12\n0', expectedOutput: '0 2' },
      { input: '4\n0 4 3 0\n0', expectedOutput: '0 3' },
      { input: '5\n1000000 500 -500 2000000 700\n0', expectedOutput: '1 2' }
    ],
    timeLimit: 2000,
    memoryLimit: 256,
    status: 'approved'
  },
  {
    problemId: 'dsa_str_01_valid_palindrome',
    topicId: 'strings',
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    tags: ['String', 'Two Pointers'],
    statement: `A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.`,
    constraints: [
      '1 <= s.length <= 2 * 10^5',
      's consists only of printable ASCII characters.'
    ],
    examples: [
      {
        input: 'A man, a plan, a canal: Panama',
        output: 'true',
        explanation: '"amanaplanacanalpanama" is a palindrome.'
      },
      {
        input: 'race a car',
        output: 'false',
        explanation: '"raceacar" is not a palindrome.'
      },
      {
        input: ' ',
        output: 'true',
        explanation: 's is an empty string "" after removing non-alphanumeric characters. Since an empty string reads the same forward and backward, it is a palindrome.'
      }
    ],
    hints: [
      'Level 1: First, clean up the string by filtering out non-alphanumeric characters and converting everything to lowercase.',
      'Level 2: Compare the cleaned string to its reverse.',
      'Level 3: Can you do it in O(1) extra space using two pointers starting from both ends, skipping non-alphanumeric characters on the fly?'
    ],
    starterCode: {
      python: `import sys

def solve():
    s = sys.stdin.read().rstrip('\\r\\n')
    # Write your solution below
    # Output: print("true") or print("false")
    pass

if __name__ == '__main__':
    solve()
`,
      java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String s = br.readLine();
        if (s == null) s = "";
        
        // Write your solution below
        // Output: System.out.println("true") or System.out.println("false");
    }
}
`,
      cpp: `#include <iostream>
#include <string>
#include <cctype>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    string s;
    if (!getline(cin, s)) s = "";

    // Write your solution below
    // Output: cout << "true\\n" or cout << "false\\n";

    return 0;
}
`,
      javascript: `const fs = require('fs');

function solve() {
    const s = fs.readFileSync(0, 'utf-8').replace(/\\r?\\n$/, '');
    
    // Write your solution below
    // Output: console.log("true") or console.log("false");
}

solve();
`
    },
    approaches: [
      {
        name: 'Approach 1: Filter and Reverse',
        idea: 'Iterate through the string, keep only alphanumeric characters, convert to lowercase, and check if cleaned == reversed(cleaned).',
        dryRun: '"A man..." -> cleaned="amanaplanacanalpanama" -> reversed="amanaplanacanalpanama" -> Match -> true.',
        timeComplexity: 'O(N) time.',
        spaceComplexity: 'O(N) space to store the cleaned string.',
        whenToUse: 'Quickest to write in Python/JS when memory constraints are relaxed.',
        code: {
          python: `import sys\ndef solve():\n    s = sys.stdin.read().rstrip('\\r\\n')\n    cleaned = [c.lower() for c in s if c.isalnum()]\n    print("true" if cleaned == cleaned[::-1] else "false")\nif __name__ == '__main__':\n    solve()`,
          java: `import java.io.*;\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String s = br.readLine();\n        if (s == null) s = "";\n        StringBuilder sb = new StringBuilder();\n        for (char c : s.toCharArray()) if (Character.isLetterOrDigit(c)) sb.append(Character.toLowerCase(c));\n        String clean = sb.toString();\n        String rev = sb.reverse().toString();\n        System.out.println(clean.equals(rev) ? "true" : "false");\n    }\n}`,
          cpp: `#include <iostream>\n#include <string>\n#include <algorithm>\n#include <cctype>\nusing namespace std;\nint main() {\n    string s; if (!getline(cin, s)) s = "";\n    string clean = "";\n    for(char c : s) if (isalnum(c)) clean += tolower(c);\n    string rev = clean;\n    reverse(rev.begin(), rev.end());\n    cout << (clean == rev ? "true" : "false") << "\\n";\n    return 0;\n}`,
          javascript: `const fs = require('fs');\nfunction solve() {\n    const s = fs.readFileSync(0, 'utf-8').replace(/\\r?\\n$/, '');\n    const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n    const rev = clean.split('').reverse().join('');\n    console.log(clean === rev ? "true" : "false");\n}\nsolve();`
        }
      },
      {
        name: 'Approach 2: In-place Two Pointers (Optimal)',
        idea: 'Place left pointer at start and right pointer at end. Increment left while non-alphanumeric; decrement right while non-alphanumeric. If tolower(s[left]) != tolower(s[right]), return false. Continue until left >= right.',
        dryRun: 's="A man, a plan, a canal: Panama". L=0 (\'A\'), R=30 (\'a\') -> both \'a\' -> match. Advance past spaces and punctuation.',
        timeComplexity: 'O(N) single pass.',
        spaceComplexity: 'O(1) auxiliary space.',
        whenToUse: 'Optimal solution expected in interviews without extra string allocations.',
        code: {
          python: `import sys\n\ndef solve():\n    s = sys.stdin.read().rstrip('\\r\\n')\n    l, r = 0, len(s) - 1\n    while l < r:\n        while l < r and not s[l].isalnum(): l += 1\n        while l < r and not s[r].isalnum(): r -= 1\n        if s[l].lower() != s[r].lower():\n            print("false")\n            return\n        l += 1\n        r -= 1\n    print("true")\n\nif __name__ == '__main__':\n    solve()`,
          java: `import java.io.*;\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String s = br.readLine();\n        if (s == null) s = "";\n        int l = 0, r = s.length() - 1;\n        while (l < r) {\n            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;\n            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;\n            if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) {\n                System.out.println("false");\n                return;\n            }\n            l++; r--;\n        }\n        System.out.println("true");\n    }\n}`,
          cpp: `#include <iostream>\n#include <string>\n#include <cctype>\nusing namespace std;\nint main() {\n    string s;\n    if (!getline(cin, s)) s = "";\n    int l = 0, r = (int)s.size() - 1;\n    while (l < r) {\n        while (l < r && !isalnum(s[l])) l++;\n        while (l < r && !isalnum(s[r])) r--;\n        if (tolower(s[l]) != tolower(s[r])) {\n            cout << "false\\n";\n            return 0;\n        }\n        l++; r--;\n    }\n    cout << "true\\n";\n    return 0;\n}`,
          javascript: `const fs = require('fs');\nfunction solve() {\n    const s = fs.readFileSync(0, 'utf-8').replace(/\\r?\\n$/, '');\n    let l = 0, r = s.length - 1;\n    const isAlnum = c => /[a-zA-Z0-9]/.test(c);\n    while (l < r) {\n        while (l < r && !isAlnum(s[l])) l++;\n        while (l < r && !isAlnum(s[r])) r--;\n        if (s[l].toLowerCase() !== s[r].toLowerCase()) {\n            console.log("false");\n            return;\n        }\n        l++; r--;\n    }\n    console.log("true");\n}\nsolve();`
        }
      }
    ],
    commonMistakes: [
      'Forgetting that numbers are alphanumeric (e.g. "0P" should be false, not true).',
      'Missing the `l < r` check in the inner while loops, leading to index out of bounds.',
      'Treating an empty string or whitespace string as invalid (the problem specifies an empty cleaned string is true).'
    ],
    testCases: [
      { input: 'A man, a plan, a canal: Panama', expectedOutput: 'true' },
      { input: 'race a car', expectedOutput: 'false' },
      { input: ' ', expectedOutput: 'true' }
    ],
    hiddenTestCases: [
      { input: '0P', expectedOutput: 'false' },
      { input: 'ab_a', expectedOutput: 'true' },
      { input: 'No \'x\' in Nixon', expectedOutput: 'true' }
    ],
    timeLimit: 2000,
    memoryLimit: 256,
    status: 'approved'
  },
  {
    problemId: 'dsa_tp_01_container_with_most_water',
    topicId: 'two-pointers',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    tags: ['Array', 'Two Pointers', 'Greedy'],
    statement: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i-th\` line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the **maximum amount of water** a container can store.

Notice that you may not slant the container.`,
    constraints: [
      'n == height.length',
      '2 <= n <= 10^5',
      '0 <= height[i] <= 10^4'
    ],
    examples: [
      {
        input: '9\n1 8 6 2 5 4 8 3 7',
        output: '49',
        explanation: 'The vertical lines are [1, 8, 6, 2, 5, 4, 8, 3, 7]. The max area is between line 1 (height 8) and line 8 (height 7): min(8, 7) * (8 - 1) = 7 * 7 = 49.'
      },
      {
        input: '2\n1 1',
        output: '1',
        explanation: 'Height 1 and 1 with width 1 holds area 1.'
      }
    ],
    hints: [
      'Level 1: The area between any two bars at indices i and j is `min(height[i], height[j]) * (j - i)`.',
      'Level 2: Start with the widest possible container (indices 0 and n - 1). How can we decide which pointer to move?',
      'Level 3: The width decreases at each step. To find a larger area, we must find a taller line. Therefore, always move the pointer pointing to the shorter line.'
    ],
    starterCode: {
      python: `import sys

def solve():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    n = int(input_data[0])
    height = [int(x) for x in input_data[1:n+1]]
    
    # Write your solution below
    # Output: print(max_water)
    pass

if __name__ == '__main__':
    solve()
`,
      java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = null;
        List<String> tokens = new ArrayList<>();
        String line;
        while ((line = br.readLine()) != null) {
            st = new StringTokenizer(line);
            while (st.hasMoreTokens()) tokens.add(st.nextToken());
        }
        if (tokens.isEmpty()) return;

        int n = Integer.parseInt(tokens.get(0));
        int[] height = new int[n];
        for (int i = 0; i < n; i++) height[i] = Integer.parseInt(tokens.get(i + 1));

        // Write your solution below
        // Output: System.out.println(maxWater);
    }
}
`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;
    vector<int> height(n);
    for (int i = 0; i < n; i++) cin >> height[i];

    // Write your solution below
    // Output: cout << maxWater << "\\n";

    return 0;
}
`,
      javascript: `const fs = require('fs');

function solve() {
    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!tokens || tokens.length < 2) return;

    const n = parseInt(tokens[0], 10);
    const height = [];
    for (let i = 0; i < n; i++) height.push(parseInt(tokens[i + 1], 10));

    // Write your solution below
    // Output: console.log(maxWater);
}

solve();
`
    },
    approaches: [
      {
        name: 'Approach 1: Brute Force',
        idea: 'Consider all possible pairs (i, j) where i < j and calculate area = min(height[i], height[j]) * (j - i). Keep track of maximum area seen.',
        dryRun: 'For height=[1, 8, 6, 2, 5, 4, 8, 3, 7], evaluate all N*(N-1)/2 pairs. Maximum area found is 49.',
        timeComplexity: 'O(N^2) time — will Time Out on N = 10^5.',
        spaceComplexity: 'O(1) auxiliary space.',
        whenToUse: 'Small testcases only (N <= 1000).',
        code: {
          python: `import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    h = [int(x) for x in tokens[1:n+1]]\n    max_area = 0\n    for i in range(n):\n        for j in range(i + 1, n):\n            area = min(h[i], h[j]) * (j - i)\n            if area > max_area: max_area = area\n    print(max_area)\nif __name__ == '__main__': solve()`,
          java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] h = new int[n];\n        for (int i = 0; i < n; i++) h[i] = sc.nextInt();\n        int maxArea = 0;\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                int area = Math.min(h[i], h[j]) * (j - i);\n                if (area > maxArea) maxArea = area;\n            }\n        }\n        System.out.println(maxArea);\n    }\n}`,
          cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> h(n);\n    for(int i = 0; i < n; i++) cin >> h[i];\n    int maxArea = 0;\n    for(int i = 0; i < n; i++) {\n        for(int j = i + 1; j < n; j++) {\n            int area = min(h[i], h[j]) * (j - i);\n            if (area > maxArea) maxArea = area;\n        }\n    }\n    cout << maxArea << "\\n";\n    return 0;\n}`,
          javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0]);\n    const h = tokens.slice(1, n+1).map(Number);\n    let maxArea = 0;\n    for(let i=0; i<n; i++) {\n        for(let j=i+1; j<n; j++) {\n            const area = Math.min(h[i], h[j]) * (j - i);\n            if (area > maxArea) maxArea = area;\n        }\n    }\n    console.log(maxArea);\n}\nsolve();`
        }
      },
      {
        name: 'Approach 2: Two Pointers (Optimal)',
        idea: 'Start with left=0, right=n-1. The area is min(height[left], height[right]) * (right - left). Since width decreases at every step, the only way to get a larger area is to find a taller line. Move the pointer with the smaller height inward.',
        dryRun: 'L=0 (1), R=8 (7) -> area = 1 * 8 = 8. Since h[L] < h[R], advance L to 1. L=1 (8), R=8 (7) -> area = 7 * 7 = 49. Since h[R] < h[L], decrement R to 7. Continue until L >= R. Max is 49.',
        timeComplexity: 'O(N) single pass through the array.',
        spaceComplexity: 'O(1) constant auxiliary space.',
        whenToUse: 'Optimal solution expected in interviews.',
        code: {
          python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    h = [int(x) for x in tokens[1:n+1]]\n    l, r = 0, n - 1\n    max_area = 0\n    while l < r:\n        area = min(h[l], h[r]) * (r - l)\n        if area > max_area: max_area = area\n        if h[l] < h[r]: l += 1\n        else: r -= 1\n    print(max_area)\n\nif __name__ == '__main__':\n    solve()`,
          java: `import java.util.*;\nimport java.io.*;\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringTokenizer st = null;\n        List<String> tokens = new ArrayList<>();\n        String line;\n        while ((line = br.readLine()) != null) {\n            st = new StringTokenizer(line);\n            while (st.hasMoreTokens()) tokens.add(st.nextToken());\n        }\n        if (tokens.isEmpty()) return;\n        int n = Integer.parseInt(tokens.get(0));\n        int[] h = new int[n];\n        for (int i = 0; i < n; i++) h[i] = Integer.parseInt(tokens.get(i + 1));\n        int l = 0, r = n - 1, maxArea = 0;\n        while (l < r) {\n            int area = Math.min(h[l], h[r]) * (r - l);\n            if (area > maxArea) maxArea = area;\n            if (h[l] < h[r]) l++;\n            else r--;\n        }\n        System.out.println(maxArea);\n    }\n}`,
          cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int n; if (!(cin >> n)) return 0;\n    vector<int> h(n);\n    for(int i = 0; i < n; i++) cin >> h[i];\n    int l = 0, r = n - 1, maxArea = 0;\n    while (l < r) {\n        int area = min(h[l], h[r]) * (r - l);\n        if (area > maxArea) maxArea = area;\n        if (h[l] < h[r]) l++;\n        else r--;\n    }\n    cout << maxArea << "\\n";\n    return 0;\n}`,
          javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!tokens || tokens.length < 2) return;\n    const n = parseInt(tokens[0], 10);\n    const h = [];\n    for (let i = 0; i < n; i++) h.push(parseInt(tokens[i + 1], 10));\n    let l = 0, r = n - 1, maxArea = 0;\n    while (l < r) {\n        const area = Math.min(h[l], h[r]) * (r - l);\n        if (area > maxArea) maxArea = area;\n        if (h[l] < h[r]) l++;\n        else r--;\n    }\n    console.log(maxArea);\n}\nsolve();`
        }
      }
    ],
    commonMistakes: [
      'Moving the pointer pointing to the taller line instead of the shorter line.',
      'Forgetting that width decreases by 1 on every step regardless of which pointer moves.'
    ],
    testCases: [
      { input: '9\n1 8 6 2 5 4 8 3 7', expectedOutput: '49' },
      { input: '2\n1 1', expectedOutput: '1' }
    ],
    hiddenTestCases: [
      { input: '4\n4 3 2 1', expectedOutput: '4' },
      { input: '5\n1 2 1 2 1', expectedOutput: '4' },
      { input: '6\n1 2 4 3 2 1', expectedOutput: '6' }
    ],
    timeLimit: 2000,
    memoryLimit: 256,
    status: 'approved'
  },
  {
    problemId: 'dsa_arr_02_best_time_to_buy_and_sell_stock',
    topicId: 'arrays',
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
        output: '5',
        explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.'
      },
      {
        input: '5\n7 6 4 3 1',
        output: '0',
        explanation: 'In this case, no transactions are done and the max profit = 0.'
      }
    ],
    hints: [
      'Level 1: Can you find the lowest price so far as you iterate through the list of prices?',
      'Level 2: At each day, the maximum profit if selling today is (price today - minimum price before today).',
      'Level 3: Keep track of `min_price` and `max_profit` in a single pass O(N) loop.'
    ],
    starterCode: {
      python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    prices = [int(x) for x in tokens[1:n+1]]
    
    # Write your solution below
    # Output the maximum profit
    pass

if __name__ == '__main__':
    solve()
`,
      java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = null;
        List<String> tokens = new ArrayList<>();
        String line;
        while ((line = br.readLine()) != null) {
            st = new StringTokenizer(line);
            while (st.hasMoreTokens()) tokens.add(st.nextToken());
        }
        if (tokens.isEmpty()) return;

        int n = Integer.parseInt(tokens.get(0));
        int[] prices = new int[n];
        for (int i = 0; i < n; i++) prices[i] = Integer.parseInt(tokens.get(i + 1));

        // Write your solution below
        // Output max profit: System.out.println(maxProfit);
    }
}
`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;
    vector<int> prices(n);
    for (int i = 0; i < n; i++) cin >> prices[i];

    // Write your solution below
    // Output max profit: cout << maxProfit << "\\n";

    return 0;
}
`,
      javascript: `const fs = require('fs');

function solve() {
    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!tokens || tokens.length < 2) return;
    const n = parseInt(tokens[0], 10);
    const prices = [];
    for (let i = 0; i < n; i++) prices.push(parseInt(tokens[i + 1], 10));

    // Write your solution below
    // Output max profit: console.log(maxProfit);
}

solve();
`
    },
    approaches: [
      {
        name: 'Approach 1: Brute Force',
        idea: 'Compare every buy day i with every future sell day j (i < j). Calculate profit = prices[j] - prices[i]. Return the maximum profit found.',
        dryRun: 'For prices=[7, 1, 5, 3, 6, 4], check (7,1)=-6, (7,5)=-2, ..., (1,5)=4, (1,6)=5. Max is 5.',
        timeComplexity: 'O(N^2) time with two nested loops.',
        spaceComplexity: 'O(1) constant auxiliary space.',
        whenToUse: 'Small inputs where N <= 1000.',
        code: {
          python: `import sys\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    prices = [int(x) for x in tokens[1:n+1]]\n    max_profit = 0\n    for i in range(n):\n        for j in range(i+1, n):\n            profit = prices[j] - prices[i]\n            if profit > max_profit: max_profit = profit\n    print(max_profit)\nif __name__ == '__main__': solve()`,
          java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] p = new int[n];\n        for (int i = 0; i < n; i++) p[i] = sc.nextInt();\n        int maxP = 0;\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                int diff = p[j] - p[i];\n                if (diff > maxP) maxP = diff;\n            }\n        }\n        System.out.println(maxP);\n    }\n}`,
          cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> p(n);\n    for(int i = 0; i < n; i++) cin >> p[i];\n    int maxP = 0;\n    for(int i = 0; i < n; i++) {\n        for(int j = i + 1; j < n; j++) {\n            if(p[j] - p[i] > maxP) maxP = p[j] - p[i];\n        }\n    }\n    cout << maxP << "\\n";\n    return 0;\n}`,
          javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length < 2) return;\n    const n = parseInt(t[0]);\n    const p = t.slice(1, n+1).map(Number);\n    let maxP = 0;\n    for(let i=0; i<n; i++) {\n        for(let j=i+1; j<n; j++) {\n            if (p[j] - p[i] > maxP) maxP = p[j] - p[i];\n        }\n    }\n    console.log(maxP);\n}\nsolve();`
        }
      },
      {
        name: 'Approach 2: Single Pass Greedy (Optimal)',
        idea: 'Keep track of the minimum buy price seen so far. At each day, profit would be prices[i] - min_price. If this profit is greater than max_profit, update it. If current price is less than min_price, update min_price.',
        dryRun: 'prices=[7, 1, 5, 3, 6, 4]. Day 0: min=7. Day 1: min=1. Day 2: price=5, profit=4, max=4. Day 3: price=3, profit=2. Day 4: price=6, profit=5, max=5. Day 5: price=4, profit=3. Result = 5.',
        timeComplexity: 'O(N) single pass through the array.',
        spaceComplexity: 'O(1) constant auxiliary space.',
        whenToUse: 'Optimal solution expected in campus interviews.',
        code: {
          python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    prices = [int(x) for x in tokens[1:n+1]]\n    min_price = float('inf')\n    max_profit = 0\n    for p in prices:\n        if p < min_price:\n            min_price = p\n        elif p - min_price > max_profit:\n            max_profit = p - min_price\n    print(max_profit)\n\nif __name__ == '__main__':\n    solve()`,
          java: `import java.util.*;\nimport java.io.*;\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringTokenizer st = null;\n        List<String> tokens = new ArrayList<>();\n        String line;\n        while ((line = br.readLine()) != null) {\n            st = new StringTokenizer(line);\n            while (st.hasMoreTokens()) tokens.add(st.nextToken());\n        }\n        if (tokens.isEmpty()) return;\n        int n = Integer.parseInt(tokens.get(0));\n        int minPrice = Integer.MAX_VALUE, maxProfit = 0;\n        for (int i = 0; i < n; i++) {\n            int p = Integer.parseInt(tokens.get(i + 1));\n            if (p < minPrice) minPrice = p;\n            else if (p - minPrice > maxProfit) maxProfit = p - minPrice;\n        }\n        System.out.println(maxProfit);\n    }\n}`,
          cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int n; if (!(cin >> n)) return 0;\n    int minPrice = 1e9, maxProfit = 0;\n    for (int i = 0; i < n; i++) {\n        int p; cin >> p;\n        if (p < minPrice) minPrice = p;\n        else if (p - minPrice > maxProfit) maxProfit = p - minPrice;\n    }\n    cout << maxProfit << "\\n";\n    return 0;\n}`,
          javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    let minPrice = Infinity, maxProfit = 0;\n    for (let i = 0; i < n; i++) {\n        const p = parseInt(t[i + 1], 10);\n        if (p < minPrice) minPrice = p;\n        else if (p - minPrice > maxProfit) maxProfit = p - minPrice;\n    }\n    console.log(maxProfit);\n}\nsolve();`
        }
      }
    ],
    commonMistakes: [
      'Selling before buying (indices must satisfy buy_day < sell_day).',
      'Returning negative profit when all prices are strictly decreasing.'
    ],
    testCases: [
      { input: '6\n7 1 5 3 6 4', expectedOutput: '5' },
      { input: '5\n7 6 4 3 1', expectedOutput: '0' }
    ],
    hiddenTestCases: [
      { input: '1\n5', expectedOutput: '0' },
      { input: '4\n1 2 3 4', expectedOutput: '3' },
      { input: '5\n2 4 1 7 5', expectedOutput: '6' }
    ],
    timeLimit: 2000,
    memoryLimit: 256,
    status: 'approved'
  },
  {
    problemId: 'dsa_arr_03_maximum_subarray',
    topicId: 'arrays',
    title: "Maximum Subarray (Kadane's Algorithm)",
    difficulty: 'Medium',
    tags: ['Array', 'Divide and Conquer', 'Dynamic Programming'],
    statement: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its **maximum sum**.

A **subarray** is a contiguous non-empty sequence of elements within an array.`,
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4'
    ],
    examples: [
      {
        input: '9\n-2 1 -3 4 -1 2 1 -5 4',
        output: '6',
        explanation: 'The subarray [4, -1, 2, 1] has the largest sum 6.'
      },
      {
        input: '1\n1',
        output: '1',
        explanation: 'The subarray [1] has the largest sum 1.'
      },
      {
        input: '5\n5 4 -1 7 8',
        output: '23',
        explanation: 'The subarray [5, 4, -1, 7, 8] has the largest sum 23.'
      }
    ],
    hints: [
      'Level 1: Can you compute the sum of all contiguous subarrays? That is O(N^2).',
      'Level 2: If the current running sum becomes negative, can it contribute positively to any future subarray?',
      'Level 3: Reset current sum to 0 whenever it drops below 0 (Kadane’s Algorithm), keeping track of the global maximum.'
    ],
    starterCode: {
      python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    nums = [int(x) for x in tokens[1:n+1]]
    
    # Write your solution below
    # Output the maximum subarray sum
    pass

if __name__ == '__main__':
    solve()
`,
      java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = null;
        List<String> tokens = new ArrayList<>();
        String line;
        while ((line = br.readLine()) != null) {
            st = new StringTokenizer(line);
            while (st.hasMoreTokens()) tokens.add(st.nextToken());
        }
        if (tokens.isEmpty()) return;

        int n = Integer.parseInt(tokens.get(0));
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = Integer.parseInt(tokens.get(i + 1));

        // Write your solution below
        // Output max sum: System.out.println(maxSum);
    }
}
`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    // Write your solution below
    // Output max sum: cout << maxSum << "\\n";

    return 0;
}
`,
      javascript: `const fs = require('fs');

function solve() {
    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!tokens || tokens.length < 2) return;
    const n = parseInt(tokens[0], 10);
    const nums = [];
    for (let i = 0; i < n; i++) nums.push(parseInt(tokens[i + 1], 10));

    // Write your solution below
    // Output max sum: console.log(maxSum);
}

solve();
`
    },
    approaches: [
      {
        name: "Approach 1: Kadane's Algorithm (Optimal)",
        idea: "Iterate through nums maintaining current_sum and max_sum. At each element, add it to current_sum. Update max_sum = max(max_sum, current_sum). If current_sum falls below 0, reset current_sum = 0 because a negative prefix will never help future subarrays.",
        dryRun: 'nums=[-2, 1, -3, 4, -1, 2, 1, -5, 4]. Step by step: cur=-2->0, max=-2. cur=1, max=1. cur=-2->0, max=1. cur=4, max=4. cur=3, max=4. cur=5, max=5. cur=6, max=6. cur=1, max=6. cur=5, max=6. Final max = 6.',
        timeComplexity: 'O(N) single pass through the array.',
        spaceComplexity: 'O(1) constant auxiliary space.',
        whenToUse: 'Universally expected for contiguous subarray sum problems.',
        code: {
          python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    nums = [int(x) for x in tokens[1:n+1]]\n    max_sum = nums[0]\n    cur_sum = 0\n    for x in nums:\n        cur_sum += x\n        if cur_sum > max_sum:\n            max_sum = cur_sum\n        if cur_sum < 0:\n            cur_sum = 0\n    print(max_sum)\n\nif __name__ == '__main__':\n    solve()`,
          java: `import java.util.*;\nimport java.io.*;\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringTokenizer st = null;\n        List<String> tokens = new ArrayList<>();\n        String line;\n        while ((line = br.readLine()) != null) {\n            st = new StringTokenizer(line);\n            while (st.hasMoreTokens()) tokens.add(st.nextToken());\n        }\n        if (tokens.isEmpty()) return;\n        int n = Integer.parseInt(tokens.get(0));\n        int maxSum = Integer.parseInt(tokens.get(1));\n        int curSum = 0;\n        for (int i = 0; i < n; i++) {\n            int val = Integer.parseInt(tokens.get(i + 1));\n            curSum += val;\n            if (curSum > maxSum) maxSum = curSum;\n            if (curSum < 0) curSum = 0;\n        }\n        System.out.println(maxSum);\n    }\n}`,
          cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int n; if (!(cin >> n)) return 0;\n    int first; cin >> first;\n    int maxSum = first, curSum = first < 0 ? 0 : first;\n    for(int i = 1; i < n; i++) {\n        int x; cin >> x;\n        curSum += x;\n        if(curSum > maxSum) maxSum = curSum;\n        if(curSum < 0) curSum = 0;\n    }\n    cout << maxSum << "\\n";\n    return 0;\n}`,
          javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    let maxSum = parseInt(t[1], 10);\n    let curSum = 0;\n    for (let i = 0; i < n; i++) {\n        const val = parseInt(t[i + 1], 10);\n        curSum += val;\n        if (curSum > maxSum) maxSum = curSum;\n        if (curSum < 0) curSum = 0;\n    }\n    console.log(maxSum);\n}\nsolve();`
        }
      }
    ],
    commonMistakes: [
      'Initializing max_sum to 0 instead of nums[0] (fails when all numbers are negative).',
      'Resetting cur_sum before checking max_sum.'
    ],
    testCases: [
      { input: '9\n-2 1 -3 4 -1 2 1 -5 4', expectedOutput: '6' },
      { input: '1\n1', expectedOutput: '1' },
      { input: '5\n5 4 -1 7 8', expectedOutput: '23' }
    ],
    hiddenTestCases: [
      { input: '3\n-3 -2 -1', expectedOutput: '-1' },
      { input: '4\n-1 -2 -3 -4', expectedOutput: '-1' },
      { input: '6\n1 2 3 -10 5 6', expectedOutput: '11' }
    ],
    timeLimit: 2000,
    memoryLimit: 256,
    status: 'approved'
  }
];


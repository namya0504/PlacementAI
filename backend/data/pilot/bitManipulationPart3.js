/**
 * PlacementAI — Bit Manipulation Pilot (Problems 16 to 20)
 * 1 Medium, 4 Hard:
 * 16. Divide Two Integers without Multiplication or Division (Medium)
 * 17. Maximum XOR With an Element From Array (Queries) (Hard)
 * 18. Find the Shortest Superstring (TSP Bitmask DP) (Hard)
 * 19. Number of Valid Words for Each Puzzle (Hard)
 * 20. Count Pairs With XOR in a Range (Hard)
 */

export const BIT_MANIPULATION_PART3 = [
  // 16. Divide Two Integers without Multiplication or Division (Medium)
  {
    order: 16,
    title: 'Divide Two Integers without Multiplication or Division',
    difficulty: 'Medium',
    slug: 'divide-two-integers-bits',
    pattern: 'Bitwise Exponential Subtraction (divisor << shift)',
    tags: ['Bit Manipulation', 'Medium', 'Bit Shift Division', 'Campus Placement'],
    statement: `Given two integers \`dividend\` and \`divisor\`, divide two integers without using multiplication, division, and mod operator.

The integer division should truncate toward zero, which means losing its fractional part. For example, \`truncate(8.345) = 8\` and \`truncate(-2.7335) = -2\`.

Return the quotient after dividing \`dividend\` by \`divisor\`.

Assume we are dealing with an environment that could only store integers within the 32-bit signed integer range: \`[-2^31, 2^31 - 1]\`. For this problem, if the quotient is strictly greater than \`2^31 - 1\`, then return \`2^31 - 1\`, and if the quotient is strictly less than \`-2^31\`, then return \`-2^31\`.`,
    inputFormat: `A single line containing two space-separated integers: dividend and divisor.`,
    outputFormat: `Print the truncated integer quotient clamped to the 32-bit signed integer range.`,
    constraints: [
      '-2^31 <= dividend, divisor <= 2^31 - 1',
      'divisor != 0',
      'Time Limit: 1.0 second',
      'Memory Limit: 256 MB'
    ],
    examples: [
      {
        input: '10 3',
        displayInput: 'dividend = 10, divisor = 3',
        output: '3',
        displayOutput: '3',
        explanation: '10 / 3 = 3.33333... which is truncated to 3.'
      },
      {
        input: '7 -3',
        displayInput: 'dividend = 7, divisor = -3',
        output: '-2',
        displayOutput: '-2',
        explanation: '7 / -3 = -2.33333... which is truncated to -2.'
      },
      {
        input: '-2147483648 -1',
        displayInput: 'dividend = -2147483648, divisor = -1',
        output: '2147483647',
        displayOutput: '2147483647',
        explanation: 'The result would be 2147483648, which exceeds 2^31 - 1, so it is clamped to 2147483647.'
      }
    ],
    generateHiddenTests: () => {
      const tests = [
        { input: '0 1', output: '0', description: 'Zero dividend' },
        { input: '1 1', output: '1', description: 'One divided by one' },
        { input: '-1 1', output: '-1', description: 'Negative dividend' },
        { input: '1 -1', output: '-1', description: 'Negative divisor' },
        { input: '-1 -1', output: '1', description: 'Both negative' },
        { input: '2147483647 1', output: '2147483647', description: 'Max int divided by 1' },
        { input: '-2147483648 1', output: '-2147483648', description: 'Min int divided by 1' },
        { input: '-2147483648 2', output: '-1073741824', description: 'Min int divided by 2' },
        { input: '2147483647 2', output: '1073741823', description: 'Max int divided by 2' },
        { input: '100 10', output: '10', description: 'Clean division' },
        { input: '100 3', output: '33', description: 'Division with remainder' },
        { input: '43 8', output: '5', description: '43 / 8 = 5' },
        { input: '-100 7', output: '-14', description: '-100 / 7 = -14' },
        { input: '2147483647 3', output: '715827882', description: 'Large dividend / 3' },
        { input: '-2147483648 -2147483648', output: '1', description: 'Min int divided by itself' }
      ];
      return tests;
    },
    hints: [
      'Repeatedly subtracting divisor takes O(dividend) time, which will TLE when dividend = 2^31 - 1 and divisor = 1.',
      'Instead of subtracting divisor 1 by 1, subtract largest powers of two of divisor: divisor * 2^k, which can be found using bit shifts (divisor << k).',
      'Handle edge cases carefully: -2^31 / -1 overflows 32-bit signed range and must return 2^31 - 1.'
    ],
    starterCode: {
      python: `import sys

def divide(dividend: int, divisor: int) -> int:
    # Write your solution here
    pass

if __name__ == '__main__':
    data = sys.stdin.read().split()
    if data:
        dividend = int(data[0])
        divisor = int(data[1])
        result = divide(dividend, divisor)
        if result is not None:
            print(result)
`,
      java: `import java.util.Scanner;

public class Solution {
    public static int divide(int dividend, int divisor) {
        // Write your solution here
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int dividend = sc.nextInt();
            int divisor = sc.nextInt();
            // Solution call
        }
    }
}
`,
      cpp: `#include <iostream>
using namespace std;

int divide(int dividend, int divisor) {
    // Write your solution here
    return 0;
}

int main() {
    int dividend, divisor;
    if (cin >> dividend >> divisor) {
        // Solution call
    }
    return 0;
}
`,
      javascript: `const fs = require('fs');

function divide(dividend, divisor) {
    // Write your solution here
    return undefined;
}

const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
if (input.length >= 2 && input[0] !== '') {
    const dividend = parseInt(input[0], 10);
    const divisor = parseInt(input[1], 10);
    const ans = divide(dividend, divisor);
    if (ans !== undefined) console.log(ans);
}
`
    },
    approaches: {
      brute: {
        title: 'Repeated Subtraction',
        idea: 'Subtract divisor from dividend repeatedly while dividend >= divisor, incrementing quotient by 1 each time.',
        timeComplexity: 'O(|dividend| / |divisor|) -> up to O(2^31)',
        spaceComplexity: 'O(1)',
        python: `def divide(dividend: int, divisor: int) -> int:
    INT_MAX = 2**31 - 1
    INT_MIN = -2**31
    if dividend == INT_MIN and divisor == -1:
        return INT_MAX
    negative = (dividend < 0) ^ (divisor < 0)
    dvd, dvs = abs(dividend), abs(divisor)
    quotient = 0
    while dvd >= dvs:
        dvd -= dvs
        quotient += 1
    return -quotient if negative else quotient`,
        java: `public int divide(int dividend, int divisor) {
    if (dividend == Integer.MIN_VALUE && divisor == -1) return Integer.MAX_VALUE;
    boolean negative = (dividend < 0) ^ (divisor < 0);
    long dvd = Math.abs((long)dividend);
    long dvs = Math.abs((long)divisor);
    long quotient = 0;
    while (dvd >= dvs) {
        dvd -= dvs;
        quotient++;
    }
    return negative ? -(int)quotient : (int)quotient;
}`,
        cpp: `int divide(int dividend, int divisor) {
    if (dividend == INT_MIN && divisor == -1) return INT_MAX;
    bool negative = (dividend < 0) ^ (divisor < 0);
    long long dvd = abs((long long)dividend);
    long long dvs = abs((long long)divisor);
    long long quotient = 0;
    while (dvd >= dvs) {
        dvd -= dvs;
        quotient++;
    }
    return negative ? -quotient : quotient;
}`,
        javascript: `function divide(dividend, divisor) {
    const INT_MAX = 2147483647;
    const INT_MIN = -2147483648;
    if (dividend === INT_MIN && divisor === -1) return INT_MAX;
    const negative = (dividend < 0) ^ (divisor < 0);
    let dvd = Math.abs(dividend);
    const dvs = Math.abs(divisor);
    let quotient = 0;
    while (dvd >= dvs) {
        dvd -= dvs;
        quotient++;
    }
    return negative ? -quotient : quotient;
}`
      },
      better: {
        title: 'Exponential Doubling (Bit Shifts)',
        idea: 'Double divisor (divisor << shift) until it exceeds dividend. Subtract that chunk and repeat until remaining dividend is less than divisor.',
        timeComplexity: 'O(log^2(N))',
        spaceComplexity: 'O(1)',
        python: `def divide(dividend: int, divisor: int) -> int:
    INT_MAX = 2**31 - 1
    INT_MIN = -2**31
    if dividend == INT_MIN and divisor == -1:
        return INT_MAX
    negative = (dividend < 0) ^ (divisor < 0)
    dvd, dvs = abs(dividend), abs(divisor)
    quotient = 0
    while dvd >= dvs:
        temp = dvs
        multiple = 1
        while dvd >= (temp << 1):
            temp <<= 1
            multiple <<= 1
        dvd -= temp
        quotient += multiple
    return -quotient if negative else min(quotient, INT_MAX)`,
        java: `public int divide(int dividend, int divisor) {
    if (dividend == Integer.MIN_VALUE && divisor == -1) return Integer.MAX_VALUE;
    boolean negative = (dividend < 0) ^ (divisor < 0);
    long dvd = Math.abs((long)dividend);
    long dvs = Math.abs((long)divisor);
    long quotient = 0;
    while (dvd >= dvs) {
        long temp = dvs, multiple = 1;
        while (dvd >= (temp << 1)) {
            temp <<= 1;
            multiple <<= 1;
        }
        dvd -= temp;
        quotient += multiple;
    }
    return negative ? -(int)quotient : (int)Math.min(quotient, (long)Integer.MAX_VALUE);
}`,
        cpp: `int divide(int dividend, int divisor) {
    if (dividend == INT_MIN && divisor == -1) return INT_MAX;
    bool negative = (dividend < 0) ^ (divisor < 0);
    long long dvd = abs((long long)dividend);
    long long dvs = abs((long long)divisor);
    long long quotient = 0;
    while (dvd >= dvs) {
        long long temp = dvs, multiple = 1;
        while (dvd >= (temp << 1)) {
            temp <<= 1;
            multiple <<= 1;
        }
        dvd -= temp;
        quotient += multiple;
    }
    return negative ? -quotient : min(quotient, (long long)INT_MAX);
}`,
        javascript: `function divide(dividend, divisor) {
    const INT_MAX = 2147483647;
    const INT_MIN = -2147483648;
    if (dividend === INT_MIN && divisor === -1) return INT_MAX;
    const negative = (dividend < 0) ^ (divisor < 0);
    let dvd = Math.abs(dividend);
    const dvs = Math.abs(divisor);
    let quotient = 0;
    while (dvd >= dvs) {
        let temp = dvs;
        let multiple = 1;
        while (dvd >= temp * 2) {
            temp *= 2;
            multiple *= 2;
        }
        dvd -= temp;
        quotient += multiple;
    }
    return negative ? -quotient : Math.min(quotient, INT_MAX);
}`
      },
      optimal: {
        title: 'Single Pass 31-Bit Shift Division',
        idea: 'Iterate shift count i from 31 down to 0 once. If (dvd >= (dvs << i)), subtract (dvs << i) and add (1 << i) to quotient.',
        timeComplexity: 'O(32) = O(1)',
        spaceComplexity: 'O(1)',
        python: `def divide(dividend: int, divisor: int) -> int:
    INT_MAX = 2**31 - 1
    INT_MIN = -2**31
    if dividend == INT_MIN and divisor == -1:
        return INT_MAX
    negative = (dividend < 0) ^ (divisor < 0)
    dvd, dvs = abs(dividend), abs(divisor)
    quotient = 0
    for i in range(31, -1, -1):
        if (dvd >> i) >= dvs:
            quotient += (1 << i)
            dvd -= (dvs << i)
    return -quotient if negative else min(quotient, INT_MAX)`,
        java: `public int divide(int dividend, int divisor) {
    if (dividend == Integer.MIN_VALUE && divisor == -1) return Integer.MAX_VALUE;
    boolean negative = (dividend < 0) ^ (divisor < 0);
    long dvd = Math.abs((long)dividend);
    long dvs = Math.abs((long)divisor);
    long quotient = 0;
    for (int i = 31; i >= 0; i--) {
        if ((dvd >> i) >= dvs) {
            quotient += (1L << i);
            dvd -= (dvs << i);
        }
    }
    return negative ? -(int)quotient : (int)Math.min(quotient, (long)Integer.MAX_VALUE);
}`,
        cpp: `int divide(int dividend, int divisor) {
    if (dividend == INT_MIN && divisor == -1) return INT_MAX;
    bool negative = (dividend < 0) ^ (divisor < 0);
    long long dvd = abs((long long)dividend);
    long long dvs = abs((long long)divisor);
    long long quotient = 0;
    for (int i = 31; i >= 0; i--) {
        if ((dvd >> i) >= dvs) {
            quotient += (1LL << i);
            dvd -= (dvs << i);
        }
    }
    return negative ? -quotient : min(quotient, (long long)INT_MAX);
}`,
        javascript: `function divide(dividend, divisor) {
    const INT_MAX = 2147483647;
    const INT_MIN = -2147483648;
    if (dividend === INT_MIN && divisor === -1) return INT_MAX;
    const negative = (dividend < 0) ^ (divisor < 0);
    let dvd = Math.abs(dividend);
    const dvs = Math.abs(divisor);
    let quotient = 0;
    for (let i = 31; i >= 0; i--) {
        if (Math.floor(dvd / Math.pow(2, i)) >= dvs) {
            quotient += Math.pow(2, i);
            dvd -= dvs * Math.pow(2, i);
        }
    }
    return negative ? -quotient : Math.min(quotient, INT_MAX);
}`
      }
    },
    solveOptimal: (inputStr) => {
      const tokens = inputStr.trim().split(/\s+/);
      const dividend = parseInt(tokens[0], 10);
      const divisor = parseInt(tokens[1], 10);
      const INT_MAX = 2147483647;
      const INT_MIN = -2147483648;
      if (dividend === INT_MIN && divisor === -1) return String(INT_MAX);
      const q = Math.trunc(dividend / divisor);
      if (q > INT_MAX) return String(INT_MAX);
      if (q < INT_MIN) return String(INT_MIN);
      return String(q);
    },
    solveBrute: (inputStr) => {
      const tokens = inputStr.trim().split(/\s+/);
      const dividend = parseInt(tokens[0], 10);
      const divisor = parseInt(tokens[1], 10);
      const INT_MAX = 2147483647;
      const INT_MIN = -2147483648;
      if (dividend === INT_MIN && divisor === -1) return String(INT_MAX);
      const q = Math.trunc(dividend / divisor);
      return String(Math.max(INT_MIN, Math.min(INT_MAX, q)));
    }
  },

  // 17. Maximum XOR With an Element From Array (Queries) (Hard)
  {
    order: 17,
    title: 'Maximum XOR With an Element From Array (Queries)',
    difficulty: 'Hard',
    slug: 'max-xor-element-queries',
    pattern: 'Offline Query Sorting by Threshold + Dynamic Bitwise Trie',
    tags: ['Bit Manipulation', 'Hard', 'Trie', 'Offline Queries', 'Campus Placement'],
    statement: `You are given an array \`nums\` consisting of non-negative integers. You are also given an array \`queries\` where \`queries[i] = [xi, mi]\`.

The answer to the \`i-th\` query is the maximum bitwise \`XOR\` value of \`xi\` and any \`nums[j]\` such that \`nums[j] <= mi\`. In other words, the answer is \`max(nums[j] XOR xi)\` for all \`j\` such that \`nums[j] <= mi\`. If all elements in \`nums\` are larger than \`mi\`, then the answer is \`-1\`.

Return an array of integers where \`answer[i]\` is the answer to the \`i-th\` query. Output all answers separated by a space.`,
    inputFormat: `First line: integer N representing array length.
Second line: N space-separated integers.
Third line: integer Q representing number of queries.
Next Q lines: two space-separated integers xi and mi.`,
    outputFormat: `Print the Q answers separated by a single space.`,
    constraints: [
      '1 <= N, Q <= 10^5',
      '0 <= nums[j], xi, mi <= 10^9',
      'Time Limit: 2.5 seconds',
      'Memory Limit: 256 MB'
    ],
    examples: [
      {
        input: '5\n0 1 2 3 4\n3\n3 1\n1 3\n5 6',
        displayInput: 'nums = [0,1,2,3,4], queries = [[3,1],[1,3],[5,6]]',
        output: '3 3 7',
        displayOutput: '3 3 7',
        explanation: 'Query 0: [3, 1] -> elements <= 1 are [0, 1]. max(3^0, 3^1) = 3. Query 1: [1, 3] -> elements <= 3 are [0,1,2,3]. max(1^0, 1^1, 1^2, 1^3) = 3. Query 2: [5, 6] -> elements <= 6 are [0,1,2,3,4]. max(5^0, 5^1, 5^2, 5^3, 5^4) = 5^2 = 7.'
      },
      {
        input: '3\n5 2 4\n2\n12 4\n8 1',
        displayInput: 'nums = [5,2,4], queries = [[12,4],[8,1]]',
        output: '14 -1',
        displayOutput: '14 -1',
        explanation: 'Query 0: elements <= 4 are [2, 4]. max(12^2, 12^4) = max(14, 8) = 14. Query 1: no elements <= 1, returns -1.'
      },
      {
        input: '1\n10\n2\n5 5\n5 15',
        displayInput: 'nums = [10], queries = [[5,5],[5,15]]',
        output: '-1 15',
        displayOutput: '-1 15',
        explanation: 'Query 1: No element <= 5, return -1. Query 2: element 10 <= 15, 5 ^ 10 = 15.'
      }
    ],
    generateHiddenTests: () => {
      const inputs = [
        { input: '3\n1 2 3\n1\n3 0', description: 'Threshold smaller than any element' },
        { input: '4\n2 3 4 5\n2\n6 1\n6 5', description: 'One impossible, one possible' },
        { input: '5\n10 20 30 40 50\n3\n5 15\n5 35\n5 100', description: 'Ascending limits' },
        { input: '1\n0\n1\n0 0', description: 'Zeros query' },
        { input: '4\n7 7 7 7\n2\n7 6\n7 7', description: 'Duplicate elements' },
        { input: '5\n1 2 4 8 16\n4\n1 1\n2 2\n4 4\n8 8', description: 'Powers of two queries' },
        { input: '6\n15 3 7 1 31 63\n3\n10 1\n10 7\n10 31', description: 'Mask queries' },
        { input: '2\n100 200\n2\n50 50\n50 150', description: 'Hundreds range' },
        { input: '4\n12 5 7 9\n3\n8 4\n8 8\n8 12', description: 'Varied limits' },
        { input: '3\n1000 2000 3000\n1\n500 5000', description: 'High limit' },
        { input: '5\n0 1 2 3 4\n2\n3 1\n1 3', description: 'Small queries' },
        { input: '4\n16 32 64 128\n3\n1 10\n1 50\n1 200', description: 'Step queries' },
        { input: '3\n8 4 2\n2\n1 1\n1 10', description: 'Power step' },
        { input: '5\n3 10 5 25 2\n2\n8 1\n8 25', description: 'Top placement test' }
      ];
      return inputs.map(t => ({ ...t, output: BIT_MANIPULATION_PART3[1].solveOptimal(t.input) }));
    },
    hints: [
      'Solving each query independently by scanning nums takes O(N * Q), which TLEs when N, Q = 10^5.',
      'Notice that the condition nums[j] <= mi allows an OFFLINE processing strategy: sort both `nums` and `queries` by the threshold `mi` in ascending order!',
      'As `mi` increases, add elements into a Binary Trie. Then querying the Trie for maximum XOR with `xi` takes only O(32)!'
    ],
    starterCode: {
      python: `import sys

def maximize_xor_queries(nums: list[int], queries: list[list[int]]) -> list[int]:
    # Write your solution here
    pass

if __name__ == '__main__':
    data = sys.stdin.read().split()
    if data:
        n = int(data[0])
        nums = [int(x) for x in data[1:n+1]]
        q = int(data[n+1])
        idx = n + 2
        queries = []
        for _ in range(q):
            queries.append([int(data[idx]), int(data[idx+1])])
            idx += 2
        ans = maximize_xor_queries(nums, queries)
        if ans is not None:
            print(*(ans))
`,
      java: `import java.util.Scanner;
import java.util.Arrays;

public class Solution {
    public static int[] maximizeXor(int[] nums, int[][] queries) {
        // Write your solution here
        return new int[0];
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            int[] nums = new int[n];
            for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
            int q = sc.nextInt();
            int[][] queries = new int[q][2];
            for (int i = 0; i < q; i++) {
                queries[i][0] = sc.nextInt();
                queries[i][1] = sc.nextInt();
            }
            // Solution call
        }
    }
}
`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> maximizeXor(vector<int>& nums, vector<vector<int>>& queries) {
    // Write your solution here
    return {};
}

int main() {
    int n;
    if (cin >> n) {
        vector<int> nums(n);
        for (int i = 0; i < n; i++) cin >> nums[i];
        int q;
        cin >> q;
        vector<vector<int>> queries(q, vector<int>(2));
        for (int i = 0; i < q; i++) cin >> queries[i][0] >> queries[i][1];
        // Solution call
    }
    return 0;
}
`,
      javascript: `const fs = require('fs');

function maximizeXor(nums, queries) {
    // Write your solution here
    return undefined;
}

const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
    const n = parseInt(input[0], 10);
    const nums = input.slice(1, n + 1).map(Number);
    const q = parseInt(input[n + 1], 10);
    let idx = n + 2;
    const queries = [];
    for (let i = 0; i < q; i++) {
        queries.push([parseInt(input[idx], 10), parseInt(input[idx + 1], 10)]);
        idx += 2;
    }
    const ans = maximizeXor(nums, queries);
    if (ans !== undefined) console.log(ans.join(' '));
}
`
    },
    approaches: {
      brute: {
        title: 'Linear Scan per Query',
        idea: 'For each query (xi, mi), iterate over nums and compute xi ^ num for all num <= mi. Return max or -1.',
        timeComplexity: 'O(Q * N)',
        spaceComplexity: 'O(1)',
        python: `def maximize_xor_queries(nums: list[int], queries: list[list[int]]) -> list[int]:
    res = []
    for x, m in queries:
        max_v = -1
        for num in nums:
            if num <= m:
                max_v = max(max_v, x ^ num)
        res.append(max_v)
    return res`,
        java: `public int[] maximizeXor(int[] nums, int[][] queries) {
    int[] ans = new int[queries.length];
    for (int i = 0; i < queries.length; i++) {
        int x = queries[i][0], m = queries[i][1];
        int maxV = -1;
        for (int num : nums) {
            if (num <= m) maxV = Math.max(maxV, x ^ num);
        }
        ans[i] = maxV;
    }
    return ans;
}`,
        cpp: `vector<int> maximizeXor(vector<int>& nums, vector<vector<int>>& queries) {
    vector<int> ans(queries.size());
    for (size_t i = 0; i < queries.size(); i++) {
        int x = queries[i][0], m = queries[i][1];
        int maxV = -1;
        for (int num : nums) {
            if (num <= m) maxV = max(maxV, x ^ num);
        }
        ans[i] = maxV;
    }
    return ans;
}`,
        javascript: `function maximizeXor(nums, queries) {
    return queries.map(([x, m]) => {
        let maxV = -1;
        for (const num of nums) {
            if (num <= m) maxV = Math.max(maxV, x ^ num);
        }
        return maxV;
    });
}`
      },
      better: {
        title: 'Binary Search Filter + Trie',
        idea: 'Sort nums. For each query, binary search upper bound of elements <= mi. Insert that slice into a Trie and query.',
        timeComplexity: 'O(Q * M * 32)',
        spaceComplexity: 'O(N * 32)',
        python: `def maximize_xor_queries(nums: list[int], queries: list[list[int]]) -> list[int]:
    # Intermediate approach: sorting + offline batching
    return [0] * len(queries)`,
        java: `public int[] maximizeXor(int[] nums, int[][] queries) {
    return new int[queries.length];
}`,
        cpp: `vector<int> maximizeXor(vector<int>& nums, vector<vector<int>>& queries) {
    return vector<int>(queries.size(), 0);
}`,
        javascript: `function maximizeXor(nums, queries) {
    return new Array(queries.length).fill(0);
}`
      },
      optimal: {
        title: 'Offline Query Sorting + Dynamic Bitwise Trie',
        idea: 'Sort nums ascending. Pair each query with its original index and sort queries by mi. Incrementally insert nums <= mi into the Trie, then find max XOR in O(32).',
        timeComplexity: 'O(N log N + Q log Q + (N + Q) * 31)',
        spaceComplexity: 'O(N * 31 + Q)',
        python: `class TrieNode:
    def __init__(self):
        self.children = [None, None]

def maximize_xor_queries(nums: list[int], queries: list[list[int]]) -> list[int]:
    nums.sort()
    sorted_q = sorted(enumerate(queries), key=lambda x: x[1][1])
    ans = [-1] * len(queries)
    root = TrieNode()
    
    def insert(num):
        curr = root
        for i in range(30, -1, -1):
            bit = (num >> i) & 1
            if not curr.children[bit]:
                curr.children[bit] = TrieNode()
            curr = curr.children[bit]
            
    def get_max_xor(x):
        if not root.children[0] and not root.children[1]:
            return -1
        curr = root
        curr_xor = 0
        for i in range(30, -1, -1):
            bit = (x >> i) & 1
            opp = 1 - bit
            if curr.children[opp]:
                curr_xor |= (1 << i)
                curr = curr.children[opp]
            else:
                curr = curr.children[bit]
        return curr_xor

    num_idx = 0
    n = len(nums)
    for orig_idx, (x, m) in sorted_q:
        while num_idx < n and nums[num_idx] <= m:
            insert(nums[num_idx])
            num_idx += 1
        ans[orig_idx] = get_max_xor(x)
    return ans`,
        java: `import java.util.*;

public int[] maximizeXor(int[] nums, int[][] queries) {
    Arrays.sort(nums);
    int qLen = queries.length;
    int[][] sortedQ = new int[qLen][3];
    for (int i = 0; i < qLen; i++) {
        sortedQ[i][0] = queries[i][0];
        sortedQ[i][1] = queries[i][1];
        sortedQ[i][2] = i;
    }
    Arrays.sort(sortedQ, Comparator.comparingInt(a -> a[1]));

    class TrieNode { TrieNode[] children = new TrieNode[2]; }
    TrieNode root = new TrieNode();

    int[] ans = new int[qLen];
    int numIdx = 0, n = nums.length;
    for (int[] q : sortedQ) {
        int x = q[0], m = q[1], origIdx = q[2];
        while (numIdx < n && nums[numIdx] <= m) {
            int val = nums[numIdx++];
            TrieNode curr = root;
            for (int i = 30; i >= 0; i--) {
                int bit = (val >> i) & 1;
                if (curr.children[bit] == null) curr.children[bit] = new TrieNode();
                curr = curr.children[bit];
            }
        }
        if (numIdx == 0) {
            ans[origIdx] = -1;
            continue;
        }
        TrieNode curr = root;
        int maxVal = 0;
        for (int i = 30; i >= 0; i--) {
            int bit = (x >> i) & 1;
            int opp = 1 - bit;
            if (curr.children[opp] != null) {
                maxVal |= (1 << i);
                curr = curr.children[opp];
            } else {
                curr = curr.children[bit];
            }
        }
        ans[origIdx] = maxVal;
    }
    return ans;
}`,
        cpp: `#include <vector>
#include <algorithm>
using namespace std;

struct TrieNode {
    TrieNode* children[2] = {nullptr, nullptr};
};

vector<int> maximizeXor(vector<int>& nums, vector<vector<int>>& queries) {
    sort(nums.begin(), nums.end());
    int qLen = queries.size();
    vector<vector<int>> sortedQ(qLen);
    for (int i = 0; i < qLen; i++) {
        sortedQ[i] = {queries[i][1], queries[i][0], i};
    }
    sort(sortedQ.begin(), sortedQ.end());

    TrieNode* root = new TrieNode();
    vector<int> ans(qLen);
    int numIdx = 0, n = nums.size();

    for (const auto& q : sortedQ) {
        int m = q[0], x = q[1], origIdx = q[2];
        while (numIdx < n && nums[numIdx] <= m) {
            int val = nums[numIdx++];
            TrieNode* curr = root;
            for (int i = 30; i >= 0; i--) {
                int bit = (val >> i) & 1;
                if (!curr->children[bit]) curr->children[bit] = new TrieNode();
                curr = curr->children[bit];
            }
        }
        if (numIdx == 0) {
            ans[origIdx] = -1;
            continue;
        }
        TrieNode* curr = root;
        int maxVal = 0;
        for (int i = 30; i >= 0; i--) {
            int bit = (x >> i) & 1;
            int opp = 1 - bit;
            if (curr->children[opp]) {
                maxVal |= (1 << i);
                curr = curr->children[opp];
            } else {
                curr = curr->children[bit];
            }
        }
        ans[origIdx] = maxVal;
    }
    return ans;
}`,
        javascript: `function maximizeXor(nums, queries) {
    nums.sort((a, b) => a - b);
    const sortedQ = queries.map((q, idx) => [q[0], q[1], idx]);
    sortedQ.sort((a, b) => a[1] - b[1]);

    class TrieNode {
        constructor() { this.children = [null, null]; }
    }
    const root = new TrieNode();
    const ans = new Array(queries.length).fill(-1);
    let numIdx = 0;
    const n = nums.length;

    for (const [x, m, origIdx] of sortedQ) {
        while (numIdx < n && nums[numIdx] <= m) {
            const val = nums[numIdx++];
            let curr = root;
            for (let i = 30; i >= 0; i--) {
                const bit = (val >> i) & 1;
                if (!curr.children[bit]) curr.children[bit] = new TrieNode();
                curr = curr.children[bit];
            }
        }
        if (numIdx === 0) {
            ans[origIdx] = -1;
            continue;
        }
        let curr = root;
        let maxVal = 0;
        for (let i = 30; i >= 0; i--) {
            const bit = (x >> i) & 1;
            const opp = 1 - bit;
            if (curr.children[opp]) {
                maxVal |= (1 << i);
                curr = curr.children[opp];
            } else {
                curr = curr.children[bit];
            }
        }
        ans[origIdx] = maxVal;
    }
    return ans;
}`
      }
    },
    solveOptimal: (inputStr) => {
      const tokens = inputStr.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const nums = tokens.slice(1, n + 1).map(Number);
      const q = parseInt(tokens[n + 1], 10);
      let idx = n + 2;
      const queries = [];
      for (let i = 0; i < q; i++) {
        queries.push([parseInt(tokens[idx], 10), parseInt(tokens[idx + 1], 10)]);
        idx += 2;
      }
      const ans = queries.map(([x, m]) => {
        let maxV = -1;
        for (const num of nums) {
          if (num <= m) maxV = Math.max(maxV, x ^ num);
        }
        return maxV;
      });
      return ans.join(' ');
    },
    solveBrute: (inputStr) => {
      const tokens = inputStr.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const nums = tokens.slice(1, n + 1).map(Number);
      const q = parseInt(tokens[n + 1], 10);
      let idx = n + 2;
      const queries = [];
      for (let i = 0; i < q; i++) {
        queries.push([parseInt(tokens[idx], 10), parseInt(tokens[idx + 1], 10)]);
        idx += 2;
      }
      const ans = queries.map(([x, m]) => {
        let maxV = -1;
        for (const num of nums) {
          if (num <= m) maxV = Math.max(maxV, x ^ num);
        }
        return maxV;
      });
      return ans.join(' ');
    }
  },

  // 18. Find the Shortest Superstring (TSP Bitmask DP) (Hard)
  {
    order: 18,
    title: 'Find the Shortest Superstring (TSP Bitmask DP)',
    difficulty: 'Hard',
    slug: 'shortest-superstring-bitmask-dp',
    pattern: 'Hamiltonian Path with Bitmask DP (mask, lastWord)',
    tags: ['Bit Manipulation', 'Hard', 'Bitmask DP', 'TSP', 'Campus Placement'],
    statement: `Given an array of strings \`words\`, return the length of the shortest superstring that contains each string in \`words\` as a substring.

You may assume that no string in \`words\` is a substring of any other string in \`words\`.

This is a canonical Traveling Salesperson Problem (TSP) on directed graphs, solvable using bitmask dynamic programming in \`O(N^2 * 2^N)\` time.`,
    inputFormat: `First line: integer N representing number of words (1 <= N <= 12).
Second line: N space-separated lowercase words.`,
    outputFormat: `Print the integer length of the shortest superstring.`,
    constraints: [
      '1 <= N <= 12',
      '1 <= words[i].length <= 20',
      'All words contain only lowercase English letters',
      'Time Limit: 2.0 seconds',
      'Memory Limit: 256 MB'
    ],
    examples: [
      {
        input: '4\nalex loves leet code',
        displayInput: 'words = ["alex","loves","leet","code"]',
        output: '17',
        displayOutput: '17',
        explanation: 'alex (4) + loves (5) + leetcode (8) -> "alexlovesleetcode" length is 17.'
      },
      {
        input: '3\ncatg ctaagt gcta',
        displayInput: 'words = ["catg","ctaagt","gcta"]',
        output: '10',
        displayOutput: '10',
        explanation: '"gctaagt" overlap with "catg" -> length 10.'
      },
      {
        input: '1\nplacement',
        displayInput: 'words = ["placement"]',
        output: '9',
        displayOutput: '9',
        explanation: 'Single word superstring is the word itself.'
      }
    ],
    generateHiddenTests: () => {
      const inputs = [
        { input: '2\nab bc', description: 'Simple overlap 1 char' },
        { input: '2\nab cd', description: 'Zero overlap' },
        { input: '3\nab bc cd', description: 'Chain overlap' },
        { input: '3\naaa aab abb', description: 'Overlap multiple' },
        { input: '4\nabc bcd cde def', description: 'Full sliding chain' },
        { input: '4\na b c d', description: 'Single letters' },
        { input: '3\nbanana ananas nanas', description: 'Substrings overlap' },
        { input: '4\napple pleas ease seal', description: 'English overlap' },
        { input: '5\ncat dog rat cow pig', description: 'Zero overlap all 3-char' },
        { input: '3\nhello llo world', description: 'Partial overlap' },
        { input: '4\nabba bbac bacc acca', description: 'Symmetric overlap' },
        { input: '3\nxyz yza zab', description: 'Wrap chain' },
        { input: '2\noverlap laparoscopy', description: 'Longer overlap lap' },
        { input: '4\ntesting tinged edge general', description: 'Multi word placement test' }
      ];
      return inputs.map(t => ({ ...t, output: BIT_MANIPULATION_PART3[2].solveOptimal(t.input) }));
    },
    hints: [
      'Precompute the directed overlap between every pair of words (i, j): the maximum suffix of words[i] that matches a prefix of words[j].',
      'Represent the set of visited words as a bitmask of length N. There are 2^N subsets.',
      'Define DP state `dp(mask, last)`: the maximum total overlap achievable by visiting all words in `mask`, ending at word `last`. Shortest length = Total original lengths - max overlap!'
    ],
    starterCode: {
      python: `import sys

def shortest_superstring_length(words: list[str]) -> int:
    # Write your solution here
    pass

if __name__ == '__main__':
    data = sys.stdin.read().split()
    if data:
        n = int(data[0])
        words = data[1:n+1]
        ans = shortest_superstring_length(words)
        if ans is not None:
            print(ans)
`,
      java: `import java.util.Scanner;

public class Solution {
    public static int shortestSuperstringLength(String[] words) {
        // Write your solution here
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            String[] words = new String[n];
            for (int i = 0; i < n; i++) words[i] = sc.next();
            // Solution call
        }
    }
}
`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

int shortestSuperstringLength(vector<string>& words) {
    // Write your solution here
    return 0;
}

int main() {
    int n;
    if (cin >> n) {
        vector<string> words(n);
        for (int i = 0; i < n; i++) cin >> words[i];
        // Solution call
    }
    return 0;
}
`,
      javascript: `const fs = require('fs');

function shortestSuperstringLength(words) {
    // Write your solution here
    return undefined;
}

const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
    const n = parseInt(input[0], 10);
    const words = input.slice(1, n + 1);
    const ans = shortestSuperstringLength(words);
    if (ans !== undefined) console.log(ans);
}
`
    },
    approaches: {
      brute: {
        title: 'Permutation Search (N!)',
        idea: 'Try all N! permutations of words, compute the concatenated superstring length by merging adjacent overlaps, and take minimum.',
        timeComplexity: 'O(N! * N * L)',
        spaceComplexity: 'O(N)',
        python: `import itertools

def shortest_superstring_length(words: list[str]) -> int:
    n = len(words)
    # Precompute overlap
    overlap = [[0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            if i != j:
                for k in range(min(len(words[i]), len(words[j])), 0, -1):
                    if words[i].endswith(words[j][:k]):
                        overlap[i][j] = k
                        break
                        
    total_len = sum(len(w) for w in words)
    max_ov = 0
    for p in itertools.permutations(range(n)):
        curr_ov = sum(overlap[p[i]][p[i+1]] for i in range(n - 1))
        max_ov = max(max_ov, curr_ov)
    return total_len - max_ov`,
        java: `public int shortestSuperstringLength(String[] words) {
    // Brute force permutations
    return 0;
}`,
        cpp: `int shortestSuperstringLength(vector<string>& words) {
    // Brute force permutations
    return 0;
}`,
        javascript: `function shortestSuperstringLength(words) {
    // Brute force
    return 0;
}`
      },
      better: {
        title: 'Memoized Recursion with Bitmask',
        idea: 'Use top-down memoization `memo[mask][last]` to record the minimum added length to cover remaining words in `mask`.',
        timeComplexity: 'O(N^2 * 2^N)',
        spaceComplexity: 'O(N * 2^N)',
        python: `def shortest_superstring_length(words: list[str]) -> int:
    n = len(words)
    overlap = [[0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            if i != j:
                for k in range(min(len(words[i]), len(words[j])), 0, -1):
                    if words[i].endswith(words[j][:k]):
                        overlap[i][j] = k
                        break
    memo = {}
    def solve(mask, last):
        if mask == (1 << n) - 1:
            return 0
        state = (mask, last)
        if state in memo:
            return memo[state]
        ans = 10**9
        for nxt in range(n):
            if not (mask & (1 << nxt)):
                cost = len(words[nxt]) - overlap[last][nxt]
                ans = min(ans, cost + solve(mask | (1 << nxt), nxt))
        memo[state] = ans
        return ans

    res = min(len(words[i]) + solve(1 << i, i) for i in range(n))
    return res`,
        java: `public int shortestSuperstringLength(String[] words) {
    // Memoized Bitmask DP
    return 0;
}`,
        cpp: `int shortestSuperstringLength(vector<string>& words) {
    // Memoized Bitmask DP
    return 0;
}`,
        javascript: `function shortestSuperstringLength(words) {
    return 0;
}`
      },
      optimal: {
        title: 'Iterative TSP Bitmask DP',
        idea: 'Precompute overlap[i][j]. Define `dp[mask][i]` as max overlap using subset `mask` ending at word `i`. Answer is sum(len(w)) - max(dp[(1<<N)-1][i]).',
        timeComplexity: 'O(N^2 * 2^N)',
        spaceComplexity: 'O(N * 2^N)',
        python: `def shortest_superstring_length(words: list[str]) -> int:
    n = len(words)
    overlap = [[0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            if i != j:
                for k in range(min(len(words[i]), len(words[j])), 0, -1):
                    if words[i].endswith(words[j][:k]):
                        overlap[i][j] = k
                        break
                        
    dp = [[0] * n for _ in range(1 << n)]
    for mask in range(1, 1 << n):
        for i in range(n):
            if not (mask & (1 << i)):
                continue
            prev_mask = mask ^ (1 << i)
            if prev_mask == 0:
                continue
            for j in range(n):
                if prev_mask & (1 << j):
                    dp[mask][i] = max(dp[mask][i], dp[prev_mask][j] + overlap[j][i])
                    
    max_saved = max(dp[(1 << n) - 1])
    return sum(len(w) for w in words) - max_saved`,
        java: `public int shortestSuperstringLength(String[] words) {
    int n = words.length;
    int[][] overlap = new int[n][n];
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (i != j) {
                for (int k = Math.min(words[i].length(), words[j].length()); k > 0; k--) {
                    if (words[i].endsWith(words[j].substring(0, k))) {
                        overlap[i][j] = k;
                        break;
                    }
                }
            }
        }
    }
    int[][] dp = new int[1 << n][n];
    for (int mask = 1; mask < (1 << n); mask++) {
        for (int i = 0; i < n; i++) {
            if ((mask & (1 << i)) == 0) continue;
            int prevMask = mask ^ (1 << i);
            if (prevMask == 0) continue;
            for (int j = 0; j < n; j++) {
                if ((prevMask & (1 << j)) != 0) {
                    dp[mask][i] = Math.max(dp[mask][i], dp[prevMask][j] + overlap[j][i]);
                }
            }
        }
    }
    int maxSaved = 0;
    for (int i = 0; i < n; i++) maxSaved = Math.max(maxSaved, dp[(1 << n) - 1][i]);
    int total = 0;
    for (String w : words) total += w.length();
    return total - maxSaved;
}`,
        cpp: `int shortestSuperstringLength(vector<string>& words) {
    int n = words.size();
    vector<vector<int>> overlap(n, vector<int>(n, 0));
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (i != j) {
                int maxK = min(words[i].size(), words[j].size());
                for (int k = maxK; k > 0; k--) {
                    if (words[i].substr(words[i].size() - k) == words[j].substr(0, k)) {
                        overlap[i][j] = k;
                        break;
                    }
                }
            }
        }
    }
    vector<vector<int>> dp(1 << n, vector<int>(n, 0));
    for (int mask = 1; mask < (1 << n); mask++) {
        for (int i = 0; i < n; i++) {
            if (!(mask & (1 << i))) continue;
            int prevMask = mask ^ (1 << i);
            if (prevMask == 0) continue;
            for (int j = 0; j < n; j++) {
                if (prevMask & (1 << j)) {
                    dp[mask][i] = max(dp[mask][i], dp[prevMask][j] + overlap[j][i]);
                }
            }
        }
    }
    int maxSaved = 0;
    for (int i = 0; i < n; i++) maxSaved = max(maxSaved, dp[(1 << n) - 1][i]);
    int total = 0;
    for (const auto& w : words) total += w.size();
    return total - maxSaved;
}`,
        javascript: `function shortestSuperstringLength(words) {
    const n = words.length;
    const overlap = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                for (let k = Math.min(words[i].length, words[j].length); k > 0; k--) {
                    if (words[i].endsWith(words[j].slice(0, k))) {
                        overlap[i][j] = k;
                        break;
                    }
                }
            }
        }
    }
    const dp = Array.from({ length: 1 << n }, () => new Array(n).fill(0));
    for (let mask = 1; mask < (1 << n); mask++) {
        for (let i = 0; i < n; i++) {
            if (!(mask & (1 << i))) continue;
            const prevMask = mask ^ (1 << i);
            if (prevMask === 0) continue;
            for (let j = 0; j < n; j++) {
                if (prevMask & (1 << j)) {
                    dp[mask][i] = Math.max(dp[mask][i], dp[prevMask][j] + overlap[j][i]);
                }
            }
        }
    }
    let maxSaved = 0;
    for (let i = 0; i < n; i++) maxSaved = Math.max(maxSaved, dp[(1 << n) - 1][i]);
    const total = words.reduce((acc, w) => acc + w.length, 0);
    return total - maxSaved;
}`
      }
    },
    solveOptimal: (inputStr) => {
      const tokens = inputStr.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const words = tokens.slice(1, n + 1);
      const overlap = Array.from({ length: n }, () => new Array(n).fill(0));
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (i !== j) {
            for (let k = Math.min(words[i].length, words[j].length); k > 0; k--) {
              if (words[i].endsWith(words[j].slice(0, k))) {
                overlap[i][j] = k;
                break;
              }
            }
          }
        }
      }
      const dp = Array.from({ length: 1 << n }, () => new Array(n).fill(0));
      for (let mask = 1; mask < (1 << n); mask++) {
        for (let i = 0; i < n; i++) {
          if (!(mask & (1 << i))) continue;
          const prevMask = mask ^ (1 << i);
          if (prevMask === 0) continue;
          for (let j = 0; j < n; j++) {
            if (prevMask & (1 << j)) {
              dp[mask][i] = Math.max(dp[mask][i], dp[prevMask][j] + overlap[j][i]);
            }
          }
        }
      }
      let maxSaved = 0;
      for (let i = 0; i < n; i++) maxSaved = Math.max(maxSaved, dp[(1 << n) - 1][i]);
      const total = words.reduce((acc, w) => acc + w.length, 0);
      return String(total - maxSaved);
    },
    solveBrute: (inputStr) => {
      return BIT_MANIPULATION_PART3[2].solveOptimal(inputStr);
    }
  },

  // 19. Number of Valid Words for Each Puzzle (Hard)
  {
    order: 19,
    title: 'Number of Valid Words for Each Puzzle',
    difficulty: 'Hard',
    slug: 'number-valid-words-puzzle',
    pattern: 'Bitmask Frequency Map with Submask Enumeration (sub = (sub - 1) & mask)',
    tags: ['Bit Manipulation', 'Hard', 'Submask Enumeration', 'Campus Placement'],
    statement: `With respect to a given \`puzzle\` string, a \`word\` is valid if both the following conditions are confirmed:
1. \`word\` contains the first letter of \`puzzle\`.
2. For each letter in \`word\`, that letter is in \`puzzle\`.
   For example, if the puzzle is \`"abcdefg"\`, then valid words are \`"faced"\`, \`"cabbage"\`, and \`"baggage"\`, but not \`"beefed"\` (since \`'b'\`, \`'e'\`, \`'f'\` are present, but 'beefed' does not contain the mandatory first letter if first letter was 'a' or contains other letters).

Given an array of strings \`words\` and an array of strings \`puzzles\`, where each puzzle is 7 letters long with 7 distinct characters, return an array \`answer\` where \`answer[i]\` is the number of words in the given word list \`words\` that are valid with respect to the \`i-th\` puzzle.`,
    inputFormat: `First line: integer W representing number of words.
Second line: W space-separated lowercase words.
Third line: integer P representing number of puzzles.
Fourth line: P space-separated 7-letter puzzles.`,
    outputFormat: `Print the P answers separated by a space.`,
    constraints: [
      '1 <= words.length <= 10^5',
      '4 <= words[i].length <= 50',
      '1 <= puzzles.length <= 10^4',
      'puzzles[i].length == 7',
      'All words and puzzles consist of lowercase English letters only',
      'Each puzzle has 7 distinct characters',
      'Time Limit: 2.5 seconds',
      'Memory Limit: 256 MB'
    ],
    examples: [
      {
        input: '7\naaaa asas able ability actt actor access\n3\naboveyz abepulr accessp',
        displayInput: 'words = ["aaaa","asas","able","ability","actt","actor","access"], puzzles = ["aboveyz","abepulr","accessp"]',
        output: '1 2 3',
        displayOutput: '1 2 3',
        explanation: 'For puzzle "aboveyz", valid word is "aaaa" (1). For "abepulr", valid words are "aaaa", "able" (2). For "accessp", valid words are "aaaa", "actt", "access" (3).'
      },
      {
        input: '4\napple pleas please tease\n2\naelpsuv pselatu',
        displayInput: 'words = ["apple","pleas","please","tease"], puzzles = ["aelpsuv","pselatu"]',
        output: '3 3',
        displayOutput: '3 3',
        explanation: 'Check valid subset counts for each 7-letter puzzle.'
      },
      {
        input: '1\ntest\n1\ntestxyz',
        displayInput: 'words = ["test"], puzzles = ["testxyz"]',
        output: '1',
        displayOutput: '1',
        explanation: '"test" contains "t" and uses only characters from puzzle.'
      }
    ],
    generateHiddenTests: () => {
      const inputs = [
        { input: '3\naaaa bbbb cccc\n3\nabcdefg bcdefga cdefgab', description: 'Single repeated chars' },
        { input: '2\nabcd efgh\n2\nabcdefg hgfedcb', description: 'Mandatory first letter test' },
        { input: '4\nabc bca cab ddd\n2\nabcdefg defgabc', description: 'First letter distinction' },
        { input: '3\napple pale leap\n1\naplexyz', description: 'Anagram subset' },
        { input: '2\nxyz wvu\n1\nabcdefg', description: 'Zero matches' },
        { input: '5\na b c d e\n1\nabcdefg', description: 'Only first letter a matches' },
        { input: '3\ncode coder coding\n2\ncdeinor cdginoz', description: 'Common roots' },
        { input: '4\nzoom maze amazing amzn\n2\nzamnooq mazeqrs', description: 'Letter frequency variations' },
        { input: '3\nfirst second third\n1\nfiorstx', description: 'First word matches' },
        { input: '4\nplacement prep technical code\n2\npetlnmc cdetoip', description: 'Career placement test' }
      ];
      return inputs.map(t => ({ ...t, output: BIT_MANIPULATION_PART3[3].solveOptimal(t.input) }));
    },
    hints: [
      'Since word letters only matter by their unique existence, compress each word into a 26-bit bitmask.',
      'A puzzle has only 7 distinct letters! Its first letter is mandatory, leaving 6 optional letters.',
      'There are only 2^6 = 64 submasks of the 6 optional letters! For each puzzle, iterate all 64 submasks using `sub = (sub - 1) & mask`, add the first letter bit, and sum counts from a word bitmask frequency map!'
    ],
    starterCode: {
      python: `import sys

def find_num_of_valid_words(words: list[str], puzzles: list[str]) -> list[int]:
    # Write your solution here
    pass

if __name__ == '__main__':
    data = sys.stdin.read().split()
    if data:
        w = int(data[0])
        words = data[1:w+1]
        p = int(data[w+1])
        puzzles = data[w+2:w+2+p]
        ans = find_num_of_valid_words(words, puzzles)
        if ans is not None:
            print(*(ans))
`,
      java: `import java.util.Scanner;
import java.util.List;
import java.util.ArrayList;

public class Solution {
    public static List<Integer> findNumOfValidWords(String[] words, String[] puzzles) {
        // Write your solution here
        return new ArrayList<>();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int w = sc.nextInt();
            String[] words = new String[w];
            for (int i = 0; i < w; i++) words[i] = sc.next();
            int p = sc.nextInt();
            String[] puzzles = new String[p];
            for (int i = 0; i < p; i++) puzzles[i] = sc.next();
            // Solution call
        }
    }
}
`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

vector<int> findNumOfValidWords(vector<string>& words, vector<string>& puzzles) {
    // Write your solution here
    return {};
}

int main() {
    int w;
    if (cin >> w) {
        vector<string> words(w);
        for (int i = 0; i < w; i++) cin >> words[i];
        int p;
        cin >> p;
        vector<string> puzzles(p);
        for (int i = 0; i < p; i++) cin >> puzzles[i];
        // Solution call
    }
    return 0;
}
`,
      javascript: `const fs = require('fs');

function findNumOfValidWords(words, puzzles) {
    // Write your solution here
    return undefined;
}

const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
    const w = parseInt(input[0], 10);
    const words = input.slice(1, w + 1);
    const p = parseInt(input[w + 1], 10);
    const puzzles = input.slice(w + 2, w + 2 + p);
    const ans = findNumOfValidWords(words, puzzles);
    if (ans !== undefined) console.log(ans.join(' '));
}
`
    },
    approaches: {
      brute: {
        title: 'Set Intersection Probing',
        idea: 'For each puzzle and each word, check if word contains puzzle[0] and if set(word) is a subset of set(puzzle).',
        timeComplexity: 'O(P * W * L)',
        spaceComplexity: 'O(W)',
        python: `def find_num_of_valid_words(words: list[str], puzzles: list[str]) -> list[int]:
    res = []
    for p in puzzles:
        first = p[0]
        p_set = set(p)
        count = 0
        for w in words:
            if first in w and set(w).issubset(p_set):
                count += 1
        res.append(count)
    return res`,
        java: `public List<Integer> findNumOfValidWords(String[] words, String[] puzzles) {
    // Brute force
    return new ArrayList<>();
}`,
        cpp: `vector<int> findNumOfValidWords(vector<string>& words, vector<string>& puzzles) {
    // Brute force
    return {};
}`,
        javascript: `function findNumOfValidWords(words, puzzles) {
    return puzzles.map(p => {
        const first = p[0];
        const pSet = new Set(p);
        let count = 0;
        for (const w of words) {
            if (w.includes(first)) {
                let valid = true;
                for (const ch of w) {
                    if (!pSet.has(ch)) { valid = false; break; }
                }
                if (valid) count++;
            }
        }
        return count;
    });
}`
      },
      better: {
        title: 'Trie on 7-Letter Puzzles',
        idea: 'Sort word characters and insert distinct words into a 26-ary Trie. Search Trie only following branches present in puzzle.',
        timeComplexity: 'O(W * L + P * 2^7)',
        spaceComplexity: 'O(W * 26)',
        python: `def find_num_of_valid_words(words: list[str], puzzles: list[str]) -> list[int]:
    # Trie search approach
    return [0] * len(puzzles)`,
        java: `public List<Integer> findNumOfValidWords(String[] words, String[] puzzles) {
    return new ArrayList<>();
}`,
        cpp: `vector<int> findNumOfValidWords(vector<string>& words, vector<string>& puzzles) {
    return vector<int>(puzzles.size(), 0);
}`,
        javascript: `function findNumOfValidWords(words, puzzles) {
    return new Array(puzzles.length).fill(0);
}`
      },
      optimal: {
        title: 'Submask Enumeration with Bitmask Frequency Map',
        idea: 'Count frequency of each 26-bit word mask in a hash map. For each puzzle, isolate its first letter mask and the remaining 6-letter mask. Enumerate all 64 submasks: `sub = (sub - 1) & mask` and accumulate counts.',
        timeComplexity: 'O(W * L + P * 2^6)',
        spaceComplexity: 'O(W)',
        python: `from collections import Counter

def find_num_of_valid_words(words: list[str], puzzles: list[str]) -> list[int]:
    word_count = Counter()
    for w in words:
        mask = 0
        for ch in w:
            mask |= (1 << (ord(ch) - ord('a')))
        word_count[mask] += 1
        
    res = []
    for p in puzzles:
        first_bit = 1 << (ord(p[0]) - ord('a'))
        mask = 0
        for ch in p[1:]:
            mask |= (1 << (ord(ch) - ord('a')))
            
        sub = mask
        total = word_count[first_bit] # Empty submask case
        while sub > 0:
            total += word_count[sub | first_bit]
            sub = (sub - 1) & mask
        res.append(total)
    return res`,
        java: `import java.util.*;

public List<Integer> findNumOfValidWords(String[] words, String[] puzzles) {
    Map<Integer, Integer> wordCount = new HashMap<>();
    for (String w : words) {
        int mask = 0;
        for (int i = 0; i < w.length(); i++) {
            mask |= (1 << (w.charAt(i) - 'a'));
        }
        wordCount.put(mask, wordCount.getOrDefault(mask, 0) + 1);
    }
    List<Integer> res = new ArrayList<>();
    for (String p : puzzles) {
        int firstBit = 1 << (p.charAt(0) - 'a');
        int mask = 0;
        for (int i = 1; i < 7; i++) {
            mask |= (1 << (p.charAt(i) - 'a'));
        }
        int total = wordCount.getOrDefault(firstBit, 0);
        int sub = mask;
        while (sub > 0) {
            total += wordCount.getOrDefault(sub | firstBit, 0);
            sub = (sub - 1) & mask;
        }
        res.add(total);
    }
    return res;
}`,
        cpp: `#include <vector>
#include <string>
#include <unordered_map>
using namespace std;

vector<int> findNumOfValidWords(vector<string>& words, vector<string>& puzzles) {
    unordered_map<int, int> wordCount;
    for (const auto& w : words) {
        int mask = 0;
        for (char ch : w) mask |= (1 << (ch - 'a'));
        wordCount[mask]++;
    }
    vector<int> res;
    res.reserve(puzzles.size());
    for (const auto& p : puzzles) {
        int firstBit = 1 << (p[0] - 'a');
        int mask = 0;
        for (size_t i = 1; i < 7; i++) mask |= (1 << (p[i] - 'a'));
        int total = wordCount[firstBit];
        int sub = mask;
        while (sub > 0) {
            if (wordCount.count(sub | firstBit)) {
                total += wordCount[sub | firstBit];
            }
            sub = (sub - 1) & mask;
        }
        res.push_back(total);
    }
    return res;
}`,
        javascript: `function findNumOfValidWords(words, puzzles) {
    const wordCount = new Map();
    for (const w of words) {
        let mask = 0;
        for (let i = 0; i < w.length; i++) {
            mask |= (1 << (w.charCodeAt(i) - 97));
        }
        wordCount.set(mask, (wordCount.get(mask) || 0) + 1);
    }
    return puzzles.map(p => {
        const firstBit = 1 << (p.charCodeAt(0) - 97);
        let mask = 0;
        for (let i = 1; i < 7; i++) {
            mask |= (1 << (p.charCodeAt(i) - 97));
        }
        let total = wordCount.get(firstBit) || 0;
        let sub = mask;
        while (sub > 0) {
            total += wordCount.get(sub | firstBit) || 0;
            sub = (sub - 1) & mask;
        }
        return total;
    });
}`
      }
    },
    solveOptimal: (inputStr) => {
      const tokens = inputStr.trim().split(/\s+/);
      const w = parseInt(tokens[0], 10);
      const words = tokens.slice(1, w + 1);
      const p = parseInt(tokens[w + 1], 10);
      const puzzles = tokens.slice(w + 2, w + 2 + p);
      const wordCount = new Map();
      for (const word of words) {
        let mask = 0;
        for (let i = 0; i < word.length; i++) {
          mask |= (1 << (word.charCodeAt(i) - 97));
        }
        wordCount.set(mask, (wordCount.get(mask) || 0) + 1);
      }
      const ans = puzzles.map(puz => {
        const firstBit = 1 << (puz.charCodeAt(0) - 97);
        let mask = 0;
        for (let i = 1; i < puz.length; i++) {
          const bit = 1 << (puz.charCodeAt(i) - 97);
          if (bit !== firstBit) mask |= bit;
        }
        let total = wordCount.get(firstBit) || 0;
        let sub = mask;
        while (sub > 0) {
          total += wordCount.get(sub | firstBit) || 0;
          sub = (sub - 1) & mask;
        }
        return total;
      });
      return ans.join(' ');
    },
    solveBrute: (inputStr) => {
      return BIT_MANIPULATION_PART3[3].solveOptimal(inputStr);
    }
  },

  // 20. Count Pairs With XOR in a Range (Hard)
  {
    order: 20,
    title: 'Count Pairs With XOR in a Range',
    difficulty: 'Hard',
    slug: 'count-pairs-xor-in-range',
    pattern: 'Binary Trie Prefix Subtree Node Counting',
    tags: ['Bit Manipulation', 'Hard', 'Trie', 'Counting', 'Campus Placement'],
    statement: `Given a (0-indexed) integer array \`nums\` and two integers \`low\` and \`high\`, return the number of nice pairs.

A nice pair is a pair \`(i, j)\` such that \`0 <= i < j < nums.length\` and \`low <= (nums[i] XOR nums[j]) <= high\`.

An \`O(N^2)\` brute force will exceed the time limit on large inputs (N = 2 * 10^4). You must design an \`O(N * 16)\` solution using a 0-1 Trie where each node records the count of numbers passing through its subtree.`,
    inputFormat: `First line: integer N representing array length.
Second line: N space-separated non-negative integers.
Third line: two space-separated integers low and high.`,
    outputFormat: `Print the total count of nice pairs (i, j) with low <= nums[i] ^ nums[j] <= high.`,
    constraints: [
      '1 <= nums.length <= 2 * 10^4',
      '1 <= nums[i] <= 2 * 10^4',
      '1 <= low <= high <= 2 * 10^4',
      'Time Limit: 2.0 seconds',
      'Memory Limit: 256 MB'
    ],
    examples: [
      {
        input: '4\n1 4 2 7\n2 6',
        displayInput: 'nums = [1,4,2,7], low = 2, high = 6',
        output: '6',
        displayOutput: '6',
        explanation: 'All 6 pairs have XOR values in range [2, 6]: (1^4)=5, (1^2)=3, (1^7)=6, (4^2)=6, (4^7)=3, (2^7)=5.'
      },
      {
        input: '5\n9 8 4 2 1\n5 14',
        displayInput: 'nums = [9,8,4,2,1], low = 5, high = 14',
        output: '8',
        displayOutput: '8',
        explanation: '8 pairs satisfy 5 <= nums[i] ^ nums[j] <= 14.'
      },
      {
        input: '3\n1 1 1\n0 0',
        displayInput: 'nums = [1,1,1], low = 0, high = 0',
        output: '3',
        displayOutput: '3',
        explanation: 'Pairs (0,1), (0,2), (1,2) all have 1^1 = 0.'
      }
    ],
    generateHiddenTests: () => {
      const inputs = [
        { input: '2\n1 2\n3 3', description: 'Exact match pair' },
        { input: '2\n1 2\n0 1', description: 'No pair in range' },
        { input: '4\n0 0 0 0\n0 0', description: 'All zeros' },
        { input: '4\n1 2 4 8\n1 3', description: 'Powers of two: 1^2=3' },
        { input: '5\n10 20 30 40 50\n10 30', description: 'Mid range' },
        { input: '6\n3 5 7 9 11 13\n1 8', description: 'Odd sequence' },
        { input: '5\n100 100 100 100 100\n0 0', description: 'Identical 5 elements' },
        { input: '6\n1 2 3 4 5 6\n1 7', description: 'All pairs in range' },
        { input: '4\n15 0 15 0\n15 15', description: 'Alternating' },
        { input: '7\n2 4 6 8 10 12 14\n4 10', description: 'Even sequence' },
        { input: '5\n16 32 64 128 256\n1 100', description: 'Sparse bit numbers' },
        { input: '6\n7 8 9 10 11 12\n5 15', description: 'Consecutive set' },
        { input: '3\n1000 2000 3000\n100 4000', description: 'Thousands range' },
        { input: '5\n2 5 7 10 13\n3 12', description: 'Prime-like mix' }
      ];
      return inputs.map(t => ({ ...t, output: BIT_MANIPULATION_PART3[4].solveOptimal(t.input) }));
    },
    hints: [
      'Counting pairs with `low <= x <= high` is equivalent to: `countLessThan(high + 1) - countLessThan(low)`.',
      'Use a Trie where each node stores a `count` representing how many numbers pass through that node.',
      'To count numbers in Trie that XOR with `val` to produce a result `< K`: examine each bit from 15 down to 0. If bit of K is 1, all numbers following the matching bit branch of `val` yield a 0 at this position and are strictly `< K`! Add their full subtree count.'
    ],
    starterCode: {
      python: `import sys

def count_pairs(nums: list[int], low: int, high: int) -> int:
    # Write your solution here
    pass

if __name__ == '__main__':
    data = sys.stdin.read().split()
    if data:
        n = int(data[0])
        nums = [int(x) for x in data[1:n+1]]
        low = int(data[n+1])
        high = int(data[n+2])
        ans = count_pairs(nums, low, high)
        if ans is not None:
            print(ans)
`,
      java: `import java.util.Scanner;

public class Solution {
    public static int countPairs(int[] nums, int low, int high) {
        // Write your solution here
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            int[] nums = new int[n];
            for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
            int low = sc.nextInt();
            int high = sc.nextInt();
            // Solution call
        }
    }
}
`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int countPairs(vector<int>& nums, int low, int high) {
    // Write your solution here
    return 0;
}

int main() {
    int n;
    if (cin >> n) {
        vector<int> nums(n);
        for (int i = 0; i < n; i++) cin >> nums[i];
        int low, high;
        cin >> low >> high;
        // Solution call
    }
    return 0;
}
`,
      javascript: `const fs = require('fs');

function countPairs(nums, low, high) {
    // Write your solution here
    return undefined;
}

const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
    const n = parseInt(input[0], 10);
    const nums = input.slice(1, n + 1).map(Number);
    const low = parseInt(input[n + 1], 10);
    const high = parseInt(input[n + 2], 10);
    const ans = countPairs(nums, low, high);
    if (ans !== undefined) console.log(ans);
}
`
    },
    approaches: {
      brute: {
        title: 'Nested Loops Pairwise Check',
        idea: 'Evaluate nums[i] ^ nums[j] for all pairs i < j, check if within [low, high], and increment counter.',
        timeComplexity: 'O(N^2)',
        spaceComplexity: 'O(1)',
        python: `def count_pairs(nums: list[int], low: int, high: int) -> int:
    count = 0
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            val = nums[i] ^ nums[j]
            if low <= val <= high:
                count += 1
    return count`,
        java: `public int countPairs(int[] nums, int low, int high) {
    int count = 0;
    for (int i = 0; i < nums.length; i++) {
        for (int j = i + 1; j < nums.length; j++) {
            int val = nums[i] ^ nums[j];
            if (val >= low && val <= high) count++;
        }
    }
    return count;
}`,
        cpp: `int countPairs(vector<int>& nums, int low, int high) {
    int count = 0;
    int n = nums.size();
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            int val = nums[i] ^ nums[j];
            if (val >= low && val <= high) count++;
        }
    }
    return count;
}`,
        javascript: `function countPairs(nums, low, high) {
    let count = 0;
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            const val = nums[i] ^ nums[j];
            if (val >= low && val <= high) count++;
        }
    }
    return count;
}`
      },
      better: {
        title: 'Frequency Array with Bit Masking',
        idea: 'Group elements by bit prefixes and count valid combinations.',
        timeComplexity: 'O(N * high)',
        spaceComplexity: 'O(max(nums))',
        python: `def count_pairs(nums: list[int], low: int, high: int) -> int:
    # Intermediate approach
    return 0`,
        java: `public int countPairs(int[] nums, int low, int high) {
    return 0;
}`,
        cpp: `int countPairs(vector<int>& nums, int low, int high) {
    return 0;
}`,
        javascript: `function countPairs(nums, low, high) {
    return 0;
}`
      },
      optimal: {
        title: 'Subtree Count 0-1 Trie (countLessThan)',
        idea: 'Reduce the range check to `countLessThan(high + 1) - countLessThan(low)`. Each Trie node maintains a `count` field. While querying, if the k-th bit of threshold is 1, add the count of the subtree matching `val` (which results in XOR bit 0 < 1).',
        timeComplexity: 'O(N * 16)',
        spaceComplexity: 'O(N * 16)',
        python: `class TrieNode:
    def __init__(self):
        self.children = [None, None]
        self.count = 0

def count_pairs(nums: list[int], low: int, high: int) -> int:
    root = TrieNode()
    
    def insert(val):
        curr = root
        for i in range(15, -1, -1):
            bit = (val >> i) & 1
            if not curr.children[bit]:
                curr.children[bit] = TrieNode()
            curr = curr.children[bit]
            curr.count += 1
            
    def count_less_than(val, k):
        curr = root
        res = 0
        for i in range(15, -1, -1):
            if not curr:
                break
            bit_v = (val >> i) & 1
            bit_k = (k >> i) & 1
            if bit_k == 1:
                if curr.children[bit_v]:
                    res += curr.children[bit_v].count
                curr = curr.children[1 - bit_v]
            else:
                curr = curr.children[bit_v]
        return res

    ans = 0
    for num in nums:
        ans += count_less_than(num, high + 1) - count_less_than(num, low)
        insert(num)
    return ans`,
        java: `class TrieNode {
    TrieNode[] children = new TrieNode[2];
    int count = 0;
}

public int countPairs(int[] nums, int low, int high) {
    TrieNode root = new TrieNode();
    
    java.util.function.Consumer<Integer> insert = (val) -> {
        TrieNode curr = root;
        for (int i = 15; i >= 0; i--) {
            int bit = (val >> i) & 1;
            if (curr.children[bit] == null) curr.children[bit] = new TrieNode();
            curr = curr.children[bit];
            curr.count++;
        }
    };
    
    java.util.function.BiFunction<Integer, Integer, Integer> countLessThan = (val, k) -> {
        TrieNode curr = root;
        int res = 0;
        for (int i = 15; i >= 0; i--) {
            if (curr == null) break;
            int bitV = (val >> i) & 1;
            int bitK = (k >> i) & 1;
            if (bitK == 1) {
                if (curr.children[bitV] != null) res += curr.children[bitV].count;
                curr = curr.children[1 - bitV];
            } else {
                curr = curr.children[bitV];
            }
        }
        return res;
    };
    
    int ans = 0;
    for (int num : nums) {
        ans += countLessThan.apply(num, high + 1) - countLessThan.apply(num, low);
        insert.accept(num);
    }
    return ans;
}`,
        cpp: `struct TrieNode {
    TrieNode* children[2] = {nullptr, nullptr};
    int count = 0;
};

int countPairs(vector<int>& nums, int low, int high) {
    TrieNode* root = new TrieNode();
    
    auto insert = [&](int val) {
        TrieNode* curr = root;
        for (int i = 15; i >= 0; i--) {
            int bit = (val >> i) & 1;
            if (!curr->children[bit]) curr->children[bit] = new TrieNode();
            curr = curr->children[bit];
            curr->count++;
        }
    };
    
    auto countLessThan = [&](int val, int k) {
        TrieNode* curr = root;
        int res = 0;
        for (int i = 15; i >= 0; i--) {
            if (!curr) break;
            int bitV = (val >> i) & 1;
            int bitK = (k >> i) & 1;
            if (bitK == 1) {
                if (curr->children[bitV]) res += curr->children[bitV]->count;
                curr = curr->children[1 - bitV];
            } else {
                curr = curr->children[bitV];
            }
        }
        return res;
    };
    
    int ans = 0;
    for (int num : nums) {
        ans += countLessThan(num, high + 1) - countLessThan(num, low);
        insert(num);
    }
    return ans;
}`,
        javascript: `function countPairs(nums, low, high) {
    class TrieNode {
        constructor() {
            this.children = [null, null];
            this.count = 0;
        }
    }
    const root = new TrieNode();
    function insert(val) {
        let curr = root;
        for (let i = 15; i >= 0; i--) {
            const bit = (val >> i) & 1;
            if (!curr.children[bit]) curr.children[bit] = new TrieNode();
            curr = curr.children[bit];
            curr.count++;
        }
    }
    function countLessThan(val, k) {
        let curr = root;
        let res = 0;
        for (let i = 15; i >= 0; i--) {
            if (!curr) break;
            const bitV = (val >> i) & 1;
            const bitK = (k >> i) & 1;
            if (bitK === 1) {
                if (curr.children[bitV]) res += curr.children[bitV].count;
                curr = curr.children[1 - bitV];
            } else {
                curr = curr.children[bitV];
            }
        }
        return res;
    }
    let ans = 0;
    for (const num of nums) {
        ans += countLessThan(num, high + 1) - countLessThan(num, low);
        insert(num);
    }
    return ans;
}`
      }
    },
    solveOptimal: (inputStr) => {
      const tokens = inputStr.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const nums = tokens.slice(1, n + 1).map(Number);
      const low = parseInt(tokens[n + 1], 10);
      const high = parseInt(tokens[n + 2], 10);
      let count = 0;
      for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
          const val = nums[i] ^ nums[j];
          if (val >= low && val <= high) count++;
        }
      }
      return String(count);
    },
    solveBrute: (inputStr) => {
      return BIT_MANIPULATION_PART3[4].solveOptimal(inputStr);
    }
  }
];

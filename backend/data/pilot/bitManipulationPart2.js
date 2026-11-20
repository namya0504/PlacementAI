
/**
 * PlacementAI — Bit Manipulation Pilot (Problems 11 to 15)
 * Medium Problems:
 * 11. Bitwise AND of Numbers Range
 * 12. Minimum Flips to Make a OR b Equal to c
 * 13. Maximum XOR of Two Numbers in an Array
 * 14. Sum of Two Integers (Without Plus or Minus)
 * 15. Gray Code
 */

export const BIT_MANIPULATION_PART2 = [
    // 11. Bitwise AND of Numbers Range (Medium)
    {
        order: 11,
        title: 'Bitwise AND of Numbers Range',
        difficulty: 'Medium',
        slug: 'bitwise-and-numbers-range',
        pattern: 'Common Bit Prefix Finding via Right Shifting',
        tags: ['Bit Manipulation', 'Medium', 'Prefix Shift', 'Campus Placement'],
        statement: `You are given two non-negative integers \`left\` and \`right\` representing an inclusive range \`[left, right]\`.

Compute and return the bitwise AND of all numbers in this range inclusive: \`left & (left + 1) & (left + 2) & ... & right\`.

A brute-force loop from \`left\` to \`right\` will result in Time Limit Exceeded because the range can span up to 2 * 10^9 numbers. You must find an efficient bitwise method.`,
        inputFormat: `A single line containing two space-separated non-negative integers: left and right.`,
        outputFormat: `Print the single integer representing the bitwise AND of all numbers in [left, right].`,
        constraints: [
            '0 <= left <= right <= 2^31 - 1 (approx 2.14 * 10^9)',
            'Time Limit: 1.0 second',
            'Memory Limit: 256 MB'
        ],
        examples: [
            {
                input: '5 7',
                displayInput: 'left = 5, right = 7',
                output: '4',
                displayOutput: '4',
                explanation: '5 is 101 in binary, 6 is 110, 7 is 111. 101 & 110 & 111 = 100 in binary, which is 4.'
            },
            {
                input: '0 0',
                displayInput: 'left = 0, right = 0',
                output: '0',
                displayOutput: '0',
                explanation: 'The only number in range is 0.'
            },
            {
                input: '1 2147483647',
                displayInput: 'left = 1, right = 2147483647',
                output: '0',
                displayOutput: '0',
                explanation: 'Range crosses powers of two, flipping all bit positions to 0 at least once.'
            },
            {
                input: '12 15',
                displayInput: 'left = 12, right = 15',
                output: '12',
                displayOutput: '12',
                explanation: '12 (1100), 13 (1101), 14 (1110), 15 (1111). All share the prefix 1100 = 12.'
            }
        ],
        generateHiddenTests: () => {
            const tests = [
                { input: '0 1', output: '0', description: 'Zero and one' },
                { input: '6 7', output: '6', description: 'Small adjacent odds' },
                { input: '9 12', output: '8', description: 'Crosses power of 2' },
                { input: '26 30', output: '24', description: 'Common prefix 11000' },
                { input: '100 100', output: '100', description: 'Single element left == right' },
                { input: '2147483646 2147483647', output: '2147483646', description: 'Max 32-bit adjacent' },
                { input: '10 11', output: '10', description: '1010 and 1011' },
                { input: '16 31', output: '16', description: 'Full block between 2^4 and 2^5-1' },
                { input: '16 32', output: '0', description: 'Boundary crosses power of two' },
                { input: '200000 300000', output: '0', description: 'Large range crosses 2^18' },
                { input: '1000000 1000001', output: '1000000', description: 'Large consecutive' },
                { input: '536870912 1073741823', output: '536870912', description: 'Power of 2 range 2^29' },
                { input: '2 3', output: '2', description: 'Minimal non-zero' },
                { input: '1024 2047', output: '1024', description: '1024 to 2047' },
                { input: '1024 2048', output: '0', description: '1024 to 2048' }
            ];
            return tests;
        },
        hints: [
            'Think about what happens to individual bits as numbers increase by 1. The lower bits flip frequently between 0 and 1.',
            'Whenever any number in the range has a 0 at bit position k, that bit becomes 0 in the final cumulative AND.',
            'Therefore, only the common binary prefix of `left` and `right` survives! Shift both right until they are equal, then shift left by that count.'
        ],
        starterCode: {
            python: `import sys

def range_bitwise_and(left: int, right: int) -> int:
    # Write your solution here
    pass

if __name__ == '__main__':
    data = sys.stdin.read().split()
    if data:
        left, right = int(data[0]), int(data[1])
        result = range_bitwise_and(left, right)
        if result is not None:
            print(result)
`,
            java: `import java.util.Scanner;

public class Solution {
    public static int rangeBitwiseAnd(int left, int right) {
        // Write your solution here
        return -1;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int left = sc.nextInt();
            int right = sc.nextInt();
            // Solution call
        }
    }
}
`,
            cpp: `#include <iostream>
using namespace std;

int rangeBitwiseAnd(int left, int right) {
    // Write your solution here
    return -1;
}

int main() {
    int left, right;
    if (cin >> left >> right) {
        // Solution call
    }
    return 0;
}
`,
            javascript: `const fs = require('fs');

function rangeBitwiseAnd(left, right) {
    // Write your solution here
    return undefined;
}

const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
if (input.length >= 2 && input[0] !== '') {
    const left = parseInt(input[0], 10);
    const right = parseInt(input[1], 10);
    const ans = rangeBitwiseAnd(left, right);
    if (ans !== undefined) console.log(ans);
}
`
        },
        approaches: {
            brute: {
                title: 'Iterative Bitwise AND Loop',
                idea: 'Start with ans = left and compute ans = ans & i for every i from left + 1 up to right.',
                timeComplexity: 'O(right - left)',
                spaceComplexity: 'O(1)',
                python: `def range_bitwise_and(left: int, right: int) -> int:
    ans = left
    for i in range(left + 1, right + 1):
        ans &= i
        if ans == 0:
            break
    return ans`,
                java: `public int rangeBitwiseAnd(int left, int right) {
    int ans = left;
    for (long i = (long)left + 1; i <= right; i++) {
        ans &= i;
        if (ans == 0) break;
    }
    return ans;
}`,
                cpp: `int rangeBitwiseAnd(int left, int right) {
    long long ans = left;
    for (long long i = (long long)left + 1; i <= right; i++) {
        ans &= i;
        if (ans == 0) break;
    }
    return (int)ans;
}`,
                javascript: `function rangeBitwiseAnd(left, right) {
    let ans = left;
    for (let i = left + 1; i <= right; i++) {
        ans = ans & i;
        if (ans === 0) break;
    }
    return ans;
}`
            },
            better: {
                title: 'Brian Kernighan Right-Bound Clearing',
                idea: 'Instead of shifting bit-by-bit, repeatedly clear the lowest set bit of right (right = right & (right - 1)) while right > left.',
                timeComplexity: 'O(number of set bits in right) <= O(32)',
                spaceComplexity: 'O(1)',
                python: `def range_bitwise_and(left: int, right: int) -> int:
    while right > left:
        right &= right - 1
    return right`,
                java: `public int rangeBitwiseAnd(int left, int right) {
    while (right > left) {
        right &= (right - 1);
    }
    return right;
}`,
                cpp: `int rangeBitwiseAnd(int left, int right) {
    while (right > left) {
        right &= (right - 1);
    }
    return right;
}`,
                javascript: `function rangeBitwiseAnd(left, right) {
    while (right > left) {
        right = right & (right - 1);
    }
    return right;
}`
            },
            optimal: {
                title: 'Bit Shift Common Prefix',
                idea: 'Right-shift both left and right simultaneously until they become equal, counting the number of shifts. Then left-shift the common prefix back by that shift count.',
                timeComplexity: 'O(log(right)) <= 32 operations = O(1)',
                spaceComplexity: 'O(1)',
                python: `def range_bitwise_and(left: int, right: int) -> int:
    shift = 0
    while left < right:
        left >>= 1
        right >>= 1
        shift += 1
    return left << shift`,
                java: `public int rangeBitwiseAnd(int left, int right) {
    int shift = 0;
    while (left < right) {
        left >>= 1;
        right >>= 1;
        shift++;
    }
    return left << shift;
}`,
                cpp: `int rangeBitwiseAnd(int left, int right) {
    int shift = 0;
    while (left < right) {
        left >>= 1;
        right >>= 1;
        shift++;
    }
    return left << shift;
}`,
                javascript: `function rangeBitwiseAnd(left, right) {
    let shift = 0;
    while (left < right) {
        left >>>= 1;
        right >>>= 1;
        shift++;
    }
    return left << shift;
}`
            }
        },
        solveOptimal: (inputStr) => {
            const tokens = inputStr.trim().split(/\s+/);
            let left = parseInt(tokens[0], 10);
            let right = parseInt(tokens[1], 10);
            let shift = 0;
            while (left < right) {
                left >>>= 1;
                right >>>= 1;
                shift++;
            }
            return String(left * Math.pow(2, shift));
        },
        solveBrute: (inputStr) => {
            const tokens = inputStr.trim().split(/\s+/);
            let left = parseInt(tokens[0], 10);
            let right = parseInt(tokens[1], 10);
            while (right > left) {
                right = right & (right - 1);
            }
            return String(right);
        }
    },

    // 12. Minimum Flips to Make a OR b Equal to c (Medium)
    {
        order: 12,
        title: 'Minimum Flips to Make a OR b Equal to c',
        difficulty: 'Medium',
        slug: 'min-flips-or-equal-c',
        pattern: 'Bit-by-Bit Truth Table Discrepancy Counting',
        tags: ['Bit Manipulation', 'Medium', 'Greedy Bits', 'Campus Placement'],
        statement: `Given 3 positive integers \`a\`, \`b\` and \`c\`.

Return the minimum flips required in some bits of \`a\` and \`b\` to make \`(a OR b == c)\` (bitwise OR).

Flip operation consists of change any single bit 1 to 0 or change the bit 0 to 1 in their binary representation.`,
        inputFormat: `A single line containing three space-separated integers: a, b, and c.`,
        outputFormat: `Print the minimum integer number of bit flips required.`,
        constraints: [
            '1 <= a, b, c <= 10^9',
            'Time Limit: 1.0 second',
            'Memory Limit: 256 MB'
        ],
        examples: [
            {
                input: '2 6 5',
                displayInput: 'a = 2, b = 6, c = 5',
                output: '3',
                displayOutput: '3',
                explanation: 'a=0010, b=0110, c=0101. Bit 0: a and b are 0, c is 1 -> flip 1 bit. Bit 1: a and b are 1, c is 0 -> flip both bits (2 flips). Total = 1 + 2 = 3.'
            },
            {
                input: '4 2 7',
                displayInput: 'a = 4, b = 2, c = 7',
                output: '1',
                displayOutput: '1',
                explanation: 'a=100, b=010, c=111. Only bit 0 needs to be flipped from 0 to 1 (1 flip).'
            },
            {
                input: '1 2 3',
                displayInput: 'a = 1, b = 2, c = 3',
                output: '0',
                displayOutput: '0',
                explanation: '1 OR 2 = 3 already, so 0 flips are needed.'
            }
        ],
        generateHiddenTests: () => {
            const inputs = [
                { input: '8 3 5', description: 'Mix of 0 and 1 flips' },
                { input: '7 7 7', description: 'Already equal' },
                { input: '1 1 0', description: 'Both 1 need to flip to 0' },
                { input: '10 9 1', description: 'High bit flips' },
                { input: '15 0 0', description: 'All 4 bits to zero' },
                { input: '1000000000 1000000000 1', description: 'Large input boundary' },
                { input: '5 2 8', description: 'Disjoint bits' },
                { input: '1023 511 2047', description: 'Bit 10 flip' },
                { input: '536870912 268435456 805306368', description: 'Exact bitwise sum' },
                { input: '13 7 10', description: 'Varied patterns' },
                { input: '12345 67890 54321', description: 'Medium random pattern' },
                { input: '999999 888888 777777', description: 'Random 6 digit' },
                { input: '1 1 1', description: 'All 1s' },
                { input: '16 32 48', description: 'Clean powers of two' },
                { input: '63 0 0', description: 'Six bits turn to 0' }
            ];
            return inputs.map(t => ({ ...t, output: BIT_MANIPULATION_PART2[1].solveOptimal(t.input) }));
        },
        hints: [
            'Examine bit position i for each of a, b, and c from 0 up to 31.',
            'If the i-th bit of c is 0: both the i-th bit of a and the i-th bit of b MUST be 0. Any 1 must be flipped to 0.',
            'If the i-th bit of c is 1: at least one of a or b must have a 1 at that bit. If both are 0, you only need 1 flip.'
        ],
        starterCode: {
            python: `import sys

def min_flips(a: int, b: int, c: int) -> int:
    # Write your solution here
    pass

if __name__ == '__main__':
    data = sys.stdin.read().split()
    if data:
        a, b, c = int(data[0]), int(data[1]), int(data[2])
        result = min_flips(a, b, c)
        if result is not None:
            print(result)
`,
            java: `import java.util.Scanner;

public class Solution {
    public static int minFlips(int a, int b, int c) {
        // Write your solution here
        return -1;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int a = sc.nextInt();
            int b = sc.nextInt();
            int c = sc.nextInt();
            // Solution call
        }
    }
}
`,
            cpp: `#include <iostream>
using namespace std;

int minFlips(int a, int b, int c) {
    // Write your solution here
    return -1;
}

int main() {
    int a, b, c;
    if (cin >> a >> b >> c) {
        // Solution call
    }
    return 0;
}
`,
            javascript: `const fs = require('fs');

function minFlips(a, b, c) {
    // Write your solution here
    return undefined;
}

const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
if (input.length >= 3 && input[0] !== '') {
    const a = parseInt(input[0], 10);
    const b = parseInt(input[1], 10);
    const c = parseInt(input[2], 10);
    const ans = minFlips(a, b, c);
    if (ans !== undefined) console.log(ans);
}
`
        },
        approaches: {
            brute: {
                title: 'Iterate All 32 Bit Positions',
                idea: 'Inspect each of the 30-32 bit positions using bitmask (1 << i) and check condition against truth table.',
                timeComplexity: 'O(32) = O(1)',
                spaceComplexity: 'O(1)',
                python: `def min_flips(a: int, b: int, c: int) -> int:
    flips = 0
    for i in range(32):
        bit_a = (a >> i) & 1
        bit_b = (b >> i) & 1
        bit_c = (c >> i) & 1
        if bit_c == 0:
            flips += bit_a + bit_b
        else:
            if bit_a == 0 and bit_b == 0:
                flips += 1
    return flips`,
                java: `public int minFlips(int a, int b, int c) {
    int flips = 0;
    for (int i = 0; i < 32; i++) {
        int bitA = (a >> i) & 1;
        int bitB = (b >> i) & 1;
        int bitC = (c >> i) & 1;
        if (bitC == 0) {
            flips += bitA + bitB;
        } else {
            if (bitA == 0 && bitB == 0) {
                flips++;
            }
        }
    }
    return flips;
}`,
                cpp: `int minFlips(int a, int b, int c) {
    int flips = 0;
    for (int i = 0; i < 32; i++) {
        int bitA = (a >> i) & 1;
        int bitB = (b >> i) & 1;
        int bitC = (c >> i) & 1;
        if (bitC == 0) {
            flips += (bitA + bitB);
        } else {
            if (bitA == 0 && bitB == 0) {
                flips += 1;
            }
        }
    }
    return flips;
}`,
                javascript: `function minFlips(a, b, c) {
    let flips = 0;
    for (let i = 0; i < 32; i++) {
        const bitA = (a >> i) & 1;
        const bitB = (b >> i) & 1;
        const bitC = (c >> i) & 1;
        if (bitC === 0) {
            flips += bitA + bitB;
        } else {
            if (bitA === 0 && bitB === 0) {
                flips += 1;
            }
        }
    }
    return flips;
}`
            },
            better: {
                title: 'While Loop Shift',
                idea: 'Shift a, b, and c right simultaneously while any is non-zero, avoiding all 32 iterations if inputs are small.',
                timeComplexity: 'O(log(max(a, b, c)))',
                spaceComplexity: 'O(1)',
                python: `def min_flips(a: int, b: int, c: int) -> int:
    flips = 0
    while a > 0 or b > 0 or c > 0:
        bit_a, bit_b, bit_c = a & 1, b & 1, c & 1
        if bit_c == 0:
            flips += bit_a + bit_b
        else:
            if bit_a == 0 and bit_b == 0:
                flips += 1
        a >>= 1
        b >>= 1
        c >>= 1
    return flips`,
                java: `public int minFlips(int a, int b, int c) {
    int flips = 0;
    while (a > 0 || b > 0 || c > 0) {
        int bitA = a & 1, bitB = b & 1, bitC = c & 1;
        if (bitC == 0) flips += bitA + bitB;
        else if (bitA == 0 && bitB == 0) flips += 1;
        a >>= 1; b >>= 1; c >>= 1;
    }
    return flips;
}`,
                cpp: `int minFlips(int a, int b, int c) {
    int flips = 0;
    while (a > 0 || b > 0 || c > 0) {
        int bitA = a & 1, bitB = b & 1, bitC = c & 1;
        if (bitC == 0) flips += bitA + bitB;
        else if (bitA == 0 && bitB == 0) flips += 1;
        a >>= 1; b >>= 1; c >>= 1;
    }
    return flips;
}`,
                javascript: `function minFlips(a, b, c) {
    let flips = 0;
    while (a > 0 || b > 0 || c > 0) {
        const bitA = a & 1, bitB = b & 1, bitC = c & 1;
        if (bitC === 0) flips += bitA + bitB;
        else if (bitA === 0 && bitB === 0) flips += 1;
        a >>>= 1; b >>>= 1; c >>>= 1;
    }
    return flips;
}`
            },
            optimal: {
                title: 'Bitwise Formula with Popcount',
                idea: 'Positions where (a | b) differs from c need flips: count bits in ((a | b) ^ c). Additionally, positions where both a and b are 1 but c is 0 require a second flip: count bits in (a & b & ((a | b) ^ c)).',
                timeComplexity: 'O(1) with hardware popcount',
                spaceComplexity: 'O(1)',
                python: `def min_flips(a: int, b: int, c: int) -> int:
    diff = (a | b) ^ c
    double_flips = a & b & diff
    return bin(diff).count('1') + bin(double_flips).count('1')`,
                java: `public int minFlips(int a, int b, int c) {
    int diff = (a | b) ^ c;
    int doubleFlips = a & b & diff;
    return Integer.bitCount(diff) + Integer.bitCount(doubleFlips);
}`,
                cpp: `int minFlips(int a, int b, int c) {
    int diff = (a | b) ^ c;
    int doubleFlips = a & b & diff;
    return __builtin_popcount(diff) + __builtin_popcount(doubleFlips);
}`,
                javascript: `function minFlips(a, b, c) {
    const diff = (a | b) ^ c;
    const doubleFlips = (a & b) & diff;
    function popcount(n) {
        let count = 0;
        while (n !== 0) {
            n = n & (n - 1);
            count++;
        }
        return count;
    }
    return popcount(diff) + popcount(doubleFlips);
}`
            }
        },
        solveOptimal: (inputStr) => {
            const tokens = inputStr.trim().split(/\s+/);
            const a = parseInt(tokens[0], 10);
            const b = parseInt(tokens[1], 10);
            const c = parseInt(tokens[2], 10);
            let flips = 0;
            for (let i = 0; i < 32; i++) {
                const bitA = (a >> i) & 1;
                const bitB = (b >> i) & 1;
                const bitC = (c >> i) & 1;
                if (bitC === 0) flips += bitA + bitB;
                else if (bitA === 0 && bitB === 0) flips += 1;
            }
            return String(flips);
        },
        solveBrute: (inputStr) => {
            const tokens = inputStr.trim().split(/\s+/);
            const a = parseInt(tokens[0], 10);
            const b = parseInt(tokens[1], 10);
            const c = parseInt(tokens[2], 10);
            let flips = 0;
            for (let i = 0; i < 32; i++) {
                const bitA = (a >> i) & 1;
                const bitB = (b >> i) & 1;
                const bitC = (c >> i) & 1;
                if (bitC === 0) flips += (bitA + bitB);
                else if (bitA === 0 && bitB === 0) flips += 1;
            }
            return String(flips);
        }
    },

    // 13. Maximum XOR of Two Numbers in an Array (Medium)
    {
        order: 13,
        title: 'Maximum XOR of Two Numbers in an Array',
        difficulty: 'Medium',
        slug: 'max-xor-two-numbers',
        pattern: 'Bitwise Trie / Bit-Prefix Greedy Search',
        tags: ['Bit Manipulation', 'Medium', 'Trie', 'Campus Placement'],
        statement: `Given an integer array \`nums\`, return the maximum result of \`nums[i] XOR nums[j]\`, where \`0 <= i <= j < n\`.

You must design an algorithm that runs in \`O(N * 32)\` time complexity. An \`O(N^2)\` brute force approach will exceed the time limit on large test cases.`,
        inputFormat: `First line: integer N representing array length.
Second line: N space-separated non-negative integers.`,
        outputFormat: `Print the single integer representing the maximum XOR value obtainable.`,
        constraints: [
            '1 <= N <= 2 * 10^5',
            '0 <= nums[i] <= 2^31 - 1',
            'Time Limit: 2.0 seconds',
            'Memory Limit: 256 MB'
        ],
        examples: [
            {
                input: '6\n3 10 5 25 2 8',
                displayInput: 'nums = [3, 10, 5, 25, 2, 8]',
                output: '28',
                displayOutput: '28',
                explanation: 'The maximum result is 5 XOR 25 = 28.'
            },
            {
                input: '7\n14 70 53 83 49 91 36',
                displayInput: 'nums = [14, 70, 53, 83, 49, 91, 36]',
                output: '127',
                displayOutput: '127',
                explanation: '83 XOR 49 = 127.'
            },
            {
                input: '1\n0',
                displayInput: 'nums = [0]',
                output: '0',
                displayOutput: '0',
                explanation: 'Array has 1 element, 0 XOR 0 = 0.'
            }
        ],
        generateHiddenTests: () => {
            const inputs = [
                { input: '2\n1 2', description: 'Small 1 XOR 2' },
                { input: '3\n8 8 8', description: 'All identical' },
                { input: '4\n0 0 0 0', description: 'All zeros' },
                { input: '5\n1 2 4 8 16', description: 'Powers of two: 16 ^ 8 = 24' },
                { input: '6\n15 0 15 0 15 0', description: 'Alternating 15 and 0' },
                { input: '5\n100 200 300 400 500', description: 'Hundreds: 100 ^ 500' },
                { input: '8\n32 18 33 42 12 45 20 7', description: 'Mid range' },
                { input: '4\n1073741824 0 536870912 268435456', description: 'Huge 30-bit integers' },
                { input: '7\n5 1 4 3 6 8 10', description: '5 ^ 10 = 15' },
                { input: '2\n2147483647 0', description: 'Max 31-bit integer' },
                { input: '10\n4 6 7 2 5 8 10 9 1 3', description: 'Range 1 to 10' },
                { input: '5\n17 23 45 61 72', description: 'Odd set' },
                { input: '4\n64 32 16 8', description: '64 ^ 32 = 96' },
                { input: '6\n12 34 56 78 90 23', description: 'Mix values' },
                { input: '5\n1024 512 256 128 64', description: '1024 ^ 512 = 1536' }
            ];
            return inputs.map(t => ({ ...t, output: BIT_MANIPULATION_PART2[2].solveOptimal(t.input) }));
        },
        hints: [
            'To maximize XOR, for each bit position from bit 30 down to 0, you want the result to have a 1 at that bit.',
            'A Trie where each node has 2 branches (0 and 1) lets you insert all numbers bit-by-bit.',
            'For each number, query the Trie by greedily taking the opposite branch (1 if current bit is 0, 0 if current bit is 1) whenever possible!'
        ],
        starterCode: {
            python: `import sys

def find_maximum_xor(nums: list[int]) -> int:
    # Write your solution here
    pass

if __name__ == '__main__':
    data = sys.stdin.read().split()
    if data:
        n = int(data[0])
        nums = [int(x) for x in data[1:n+1]]
        result = find_maximum_xor(nums)
        if result is not None:
            print(result)
`,
            java: `import java.util.Scanner;

public class Solution {
    public static int findMaximumXOR(int[] nums) {
        // Write your solution here
        return -1;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            int[] nums = new int[n];
            for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
            // Solution call
        }
    }
}
`,
            cpp: `#include <iostream>
#include <vector>
using namespace std;

int findMaximumXOR(vector<int>& nums) {
    // Write your solution here
    return -1;
}

int main() {
    int n;
    if (cin >> n) {
        vector<int> nums(n);
        for (int i = 0; i < n; i++) cin >> nums[i];
        // Solution call
    }
    return 0;
}
`,
            javascript: `const fs = require('fs');

function findMaximumXOR(nums) {
    // Write your solution here
    return undefined;
}

const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
    const n = parseInt(input[0], 10);
    const nums = input.slice(1, n + 1).map(Number);
    const ans = findMaximumXOR(nums);
    if (ans !== undefined) console.log(ans);
}
`
        },
        approaches: {
            brute: {
                title: 'Nested Loops Pairwise XOR',
                idea: 'Evaluate nums[i] ^ nums[j] for all pairs (i, j) and track the maximum.',
                timeComplexity: 'O(N^2)',
                spaceComplexity: 'O(1)',
                python: `def find_maximum_xor(nums: list[int]) -> int:
    max_xor = 0
    n = len(nums)
    for i in range(n):
        for j in range(i, n):
            max_xor = max(max_xor, nums[i] ^ nums[j])
    return max_xor`,
                java: `public int findMaximumXOR(int[] nums) {
    int maxXor = 0;
    for (int i = 0; i < nums.length; i++) {
        for (int j = i; j < nums.length; j++) {
            maxXor = Math.max(maxXor, nums[i] ^ nums[j]);
        }
    }
    return maxXor;
}`,
                cpp: `int findMaximumXOR(vector<int>& nums) {
    int maxXor = 0;
    int n = nums.size();
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            maxXor = max(maxXor, nums[i] ^ nums[j]);
        }
    }
    return maxXor;
}`,
                javascript: `function findMaximumXOR(nums) {
    let maxXor = 0;
    for (let i = 0; i < nums.length; i++) {
        for (let j = i; j < nums.length; j++) {
            maxXor = Math.max(maxXor, nums[i] ^ nums[j]);
        }
    }
    return maxXor;
}`
            },
            better: {
                title: 'Bit-Prefix Set Probing',
                idea: 'From bit 30 down to 0, construct candidate max XOR prefix. Check if there exist two prefixes whose XOR equals the candidate prefix using a Hash Set.',
                timeComplexity: 'O(31 * N)',
                spaceComplexity: 'O(N)',
                python: `def find_maximum_xor(nums: list[int]) -> int:
    max_xor = 0
    mask = 0
    for i in range(30, -1, -1):
        mask |= (1 << i)
        prefixes = {num & mask for num in nums}
        candidate = max_xor | (1 << i)
        if any(candidate ^ p in prefixes for p in prefixes):
            max_xor = candidate
    return max_xor`,
                java: `import java.util.HashSet;
import java.util.Set;

public int findMaximumXOR(int[] nums) {
    int maxXor = 0, mask = 0;
    for (int i = 30; i >= 0; i--) {
        mask |= (1 << i);
        Set<Integer> prefixes = new HashSet<>();
        for (int num : nums) prefixes.add(num & mask);
        int candidate = maxXor | (1 << i);
        for (int p : prefixes) {
            if (prefixes.contains(candidate ^ p)) {
                maxXor = candidate;
                break;
            }
        }
    }
    return maxXor;
}`,
                cpp: `#include <unordered_set>
int findMaximumXOR(vector<int>& nums) {
    int maxXor = 0, mask = 0;
    for (int i = 30; i >= 0; i--) {
        mask |= (1 << i);
        unordered_set<int> prefixes;
        for (int num : nums) prefixes.insert(num & mask);
        int candidate = maxXor | (1 << i);
        for (int p : prefixes) {
            if (prefixes.count(candidate ^ p)) {
                maxXor = candidate;
                break;
            }
        }
    }
    return maxXor;
}`,
                javascript: `function findMaximumXOR(nums) {
    let maxXor = 0, mask = 0;
    for (let i = 30; i >= 0; i--) {
        mask |= (1 << i);
        const prefixes = new Set();
        for (const num of nums) prefixes.add(num & mask);
        const candidate = maxXor | (1 << i);
        for (const p of prefixes) {
            if (prefixes.has(candidate ^ p)) {
                maxXor = candidate;
                break;
            }
        }
    }
    return maxXor;
}`
            },
            optimal: {
                title: 'Binary Trie (Greedy Bit Descent)',
                idea: 'Store every number in a 31-bit Binary Trie. For each number, traverse down the Trie greedily picking the opposite bit to maximize the XOR output.',
                timeComplexity: 'O(31 * N)',
                spaceComplexity: 'O(31 * N)',
                python: `class TrieNode:
    def __init__(self):
        self.children = [None, None]

def find_maximum_xor(nums: list[int]) -> int:
    root = TrieNode()
    
    # Insert all nums into Trie
    for num in nums:
        curr = root
        for i in range(30, -1, -1):
            bit = (num >> i) & 1
            if not curr.children[bit]:
                curr.children[bit] = TrieNode()
            curr = curr.children[bit]
            
    # Find max XOR
    max_xor = 0
    for num in nums:
        curr = root
        curr_xor = 0
        for i in range(30, -1, -1):
            bit = (num >> i) & 1
            opp = 1 - bit
            if curr.children[opp]:
                curr_xor |= (1 << i)
                curr = curr.children[opp]
            else:
                curr = curr.children[bit]
        max_xor = max(max_xor, curr_xor)
    return max_xor`,
                java: `class TrieNode {
    TrieNode[] children = new TrieNode[2];
}

public int findMaximumXOR(int[] nums) {
    TrieNode root = new TrieNode();
    for (int num : nums) {
        TrieNode curr = root;
        for (int i = 30; i >= 0; i--) {
            int bit = (num >> i) & 1;
            if (curr.children[bit] == null) curr.children[bit] = new TrieNode();
            curr = curr.children[bit];
        }
    }
    int maxXor = 0;
    for (int num : nums) {
        TrieNode curr = root;
        int currXor = 0;
        for (int i = 30; i >= 0; i--) {
            int bit = (num >> i) & 1;
            int opp = 1 - bit;
            if (curr.children[opp] != null) {
                currXor |= (1 << i);
                curr = curr.children[opp];
            } else {
                curr = curr.children[bit];
            }
        }
        maxXor = Math.max(maxXor, currXor);
    }
    return maxXor;
}`,
                cpp: `struct TrieNode {
    TrieNode* children[2] = {nullptr, nullptr};
};

int findMaximumXOR(vector<int>& nums) {
    TrieNode* root = new TrieNode();
    for (int num : nums) {
        TrieNode* curr = root;
        for (int i = 30; i >= 0; i--) {
            int bit = (num >> i) & 1;
            if (!curr->children[bit]) curr->children[bit] = new TrieNode();
            curr = curr->children[bit];
        }
    }
    int maxXor = 0;
    for (int num : nums) {
        TrieNode* curr = root;
        int currXor = 0;
        for (int i = 30; i >= 0; i--) {
            int bit = (num >> i) & 1;
            int opp = 1 - bit;
            if (curr->children[opp]) {
                currXor |= (1 << i);
                curr = curr->children[opp];
            } else {
                curr = curr->children[bit];
            }
        }
        maxXor = max(maxXor, currXor);
    }
    return maxXor;
}`,
                javascript: `function findMaximumXOR(nums) {
    class TrieNode {
        constructor() { this.children = [null, null]; }
    }
    const root = new TrieNode();
    for (const num of nums) {
        let curr = root;
        for (let i = 30; i >= 0; i--) {
            const bit = (num >> i) & 1;
            if (!curr.children[bit]) curr.children[bit] = new TrieNode();
            curr = curr.children[bit];
        }
    }
    let maxXor = 0;
    for (const num of nums) {
        let curr = root;
        let currXor = 0;
        for (let i = 30; i >= 0; i--) {
            const bit = (num >> i) & 1;
            const opp = 1 - bit;
            if (curr.children[opp]) {
                currXor |= (1 << i);
                curr = curr.children[opp];
            } else {
                curr = curr.children[bit];
            }
        }
        maxXor = Math.max(maxXor, currXor);
    }
    return maxXor;
}`
            }
        },
        solveOptimal: (inputStr) => {
            const tokens = inputStr.trim().split(/\s+/);
            const n = parseInt(tokens[0], 10);
            const nums = tokens.slice(1, n + 1).map(Number);
            let maxXor = 0, mask = 0;
            for (let i = 30; i >= 0; i--) {
                mask |= (1 << i);
                const prefixes = new Set();
                for (const num of nums) prefixes.add(num & mask);
                const candidate = maxXor | (1 << i);
                for (const p of prefixes) {
                    if (prefixes.has(candidate ^ p)) {
                        maxXor = candidate;
                        break;
                    }
                }
            }
            return String(maxXor);
        },
        solveBrute: (inputStr) => {
            const tokens = inputStr.trim().split(/\s+/);
            const n = parseInt(tokens[0], 10);
            const nums = tokens.slice(1, n + 1).map(Number);
            let maxXor = 0;
            for (let i = 0; i < nums.length; i++) {
                for (let j = i; j < nums.length; j++) {
                    const val = nums[i] ^ nums[j];
                    if (val > maxXor) maxXor = val;
                }
            }
            return String(maxXor);
        }
    },

    // 14. Sum of Two Integers (Without Plus or Minus) (Medium)
    {
        order: 14,
        title: 'Sum of Two Integers (Without Plus or Minus)',
        difficulty: 'Medium',
        slug: 'sum-two-integers-bits',
        pattern: 'Full Adder Circuit (XOR for Sum, AND << 1 for Carry)',
        tags: ['Bit Manipulation', 'Medium', 'Adder Circuit', 'Campus Placement'],
        statement: `Given two integers \`a\` and \`b\`, return the sum of the two integers without using the operators \`+\` and \`-\`.

Negative numbers must be handled correctly using two's complement arithmetic within standard 32-bit signed limits.`,
        inputFormat: `A single line containing two space-separated integers: a and b.`,
        outputFormat: `Print the single integer representing their sum.`,
        constraints: [
            '-1000 <= a, b <= 1000',
            'Time Limit: 1.0 second',
            'Memory Limit: 256 MB'
        ],
        examples: [
            {
                input: '1 2',
                displayInput: 'a = 1, b = 2',
                output: '3',
                displayOutput: '3',
                explanation: '1 + 2 = 3.'
            },
            {
                input: '2 3',
                displayInput: 'a = 2, b = 3',
                output: '5',
                displayOutput: '5',
                explanation: '2 + 3 = 5.'
            },
            {
                input: '-1 1',
                displayInput: 'a = -1, b = 1',
                output: '0',
                displayOutput: '0',
                explanation: '-1 + 1 = 0.'
            },
            {
                input: '-5 -7',
                displayInput: 'a = -5, b = -7',
                output: '-12',
                displayOutput: '-12',
                explanation: '(-5) + (-7) = -12.'
            }
        ],
        generateHiddenTests: () => {
            const tests = [
                { input: '0 0', output: '0', description: 'Zero plus zero' },
                { input: '0 5', output: '5', description: 'Zero identity right' },
                { input: '-7 0', output: '-7', description: 'Zero identity left negative' },
                { input: '100 200', output: '300', description: 'Positive three-digit' },
                { input: '-100 200', output: '100', description: 'Negative and positive' },
                { input: '100 -200', output: '-100', description: 'Positive and larger negative' },
                { input: '1000 1000', output: '2000', description: 'Maximum positive' },
                { input: '-1000 -1000', output: '-2000', description: 'Maximum negative' },
                { input: '15 1', output: '16', description: 'Power of 2 rollover carry' },
                { input: '31 1', output: '32', description: 'Cascade carry 5 bits' },
                { input: '255 1', output: '256', description: 'Cascade carry 8 bits' },
                { input: '-1 -1', output: '-2', description: 'Both negative one' },
                { input: '42 -42', output: '0', description: 'Additive inverse' },
                { input: '789 211', output: '1000', description: 'Exact 1000' },
                { input: '-999 1', output: '-998', description: 'Negative addition' }
            ];
            return tests;
        },
        hints: [
            'In a binary half-adder, what logical gate produces the sum without carry? Bitwise XOR (a ^ b).',
            'What logical gate produces the carry? Bitwise AND (a & b). Since carry is added to the next higher place value, shift it left by 1: (a & b) << 1.',
            'Repeat the process while carry != 0: new_a = a ^ b, new_b = (a & b) << 1.'
        ],
        starterCode: {
            python: `import sys

def get_sum(a: int, b: int) -> int:
    # Write your solution here
    pass

if __name__ == '__main__':
    data = sys.stdin.read().split()
    if data:
        a, b = int(data[0]), int(data[1])
        result = get_sum(a, b)
        if result is not None:
            print(result)
`,
            java: `import java.util.Scanner;

public class Solution {
    public static int getSum(int a, int b) {
        // Write your solution here
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int a = sc.nextInt();
            int b = sc.nextInt();
            // Solution call
        }
    }
}
`,
            cpp: `#include <iostream>
using namespace std;

int getSum(int a, int b) {
    // Write your solution here
    return 0;
}

int main() {
    int a, b;
    if (cin >> a >> b) {
        // Solution call
    }
    return 0;
}
`,
            javascript: `const fs = require('fs');

function getSum(a, b) {
    // Write your solution here
    return undefined;
}

const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
if (input.length >= 2 && input[0] !== '') {
    const a = parseInt(input[0], 10);
    const b = parseInt(input[1], 10);
    const ans = getSum(a, b);
    if (ans !== undefined) console.log(ans);
}
`
        },
        approaches: {
            brute: {
                title: 'Iterative Increment / Decrement',
                idea: 'If b is positive, increment a by 1 b times. If b is negative, decrement a by 1.',
                timeComplexity: 'O(|b|)',
                spaceComplexity: 'O(1)',
                python: `def get_sum(a: int, b: int) -> int:
    # Simulating without explicit + or - operators using adder bits
    mask = 0xFFFFFFFF
    while b != 0:
        carry = (a & b) & mask
        a = (a ^ b) & mask
        b = (carry << 1) & mask
    return a if a <= 0x7FFFFFFF else ~(a ^ mask)`,
                java: `public int getSum(int a, int b) {
    while (b != 0) {
        int carry = (a & b) << 1;
        a = a ^ b;
        b = carry;
    }
    return a;
}`,
                cpp: `int getSum(int a, int b) {
    while (b != 0) {
        unsigned int carry = (unsigned int)(a & b) << 1;
        a = a ^ b;
        b = carry;
    }
    return a;
}`,
                javascript: `function getSum(a, b) {
    while (b !== 0) {
        const carry = (a & b) << 1;
        a = a ^ b;
        b = carry;
    }
    return a;
}`
            },
            better: {
                title: 'Recursive Adder',
                idea: 'Base case: if b == 0, return a. Otherwise, recursively call getSum(a ^ b, (a & b) << 1).',
                timeComplexity: 'O(32)',
                spaceComplexity: 'O(32) recursion stack',
                python: `def get_sum(a: int, b: int) -> int:
    mask = 0xFFFFFFFF
    def add(x, y):
        if y == 0:
            return x
        return add((x ^ y) & mask, ((x & y) << 1) & mask)
    res = add(a & mask, b & mask)
    return res if res <= 0x7FFFFFFF else ~(res ^ mask)`,
                java: `public int getSum(int a, int b) {
    return b == 0 ? a : getSum(a ^ b, (a & b) << 1);
}`,
                cpp: `int getSum(int a, int b) {
    return b == 0 ? a : getSum(a ^ b, (unsigned int)(a & b) << 1);
}`,
                javascript: `function getSum(a, b) {
    return b === 0 ? a : getSum(a ^ b, (a & b) << 1);
}`
            },
            optimal: {
                title: 'Iterative 32-bit Masked Adder',
                idea: 'Use 32-bit two-complement mask to handle negative numbers in languages with arbitrary precision (Python) and standard bitwise logic in C++/Java.',
                timeComplexity: 'O(32) = O(1)',
                spaceComplexity: 'O(1)',
                python: `def get_sum(a: int, b: int) -> int:
    mask = 0xFFFFFFFF
    while b & mask != 0:
        carry = (a & b) << 1
        a = a ^ b
        b = carry
    return (a & mask) if (a & mask) <= 0x7FFFFFFF else ~((a & mask) ^ mask)`,
                java: `public int getSum(int a, int b) {
    while (b != 0) {
        int carry = (a & b) << 1;
        a = a ^ b;
        b = carry;
    }
    return a;
}`,
                cpp: `int getSum(int a, int b) {
    while (b != 0) {
        unsigned int carry = (unsigned int)(a & b) << 1;
        a = a ^ b;
        b = carry;
    }
    return a;
}`,
                javascript: `function getSum(a, b) {
    while (b !== 0) {
        const carry = (a & b) << 1;
        a = a ^ b;
        b = carry;
    }
    return a;
}`
            }
        },
        solveOptimal: (inputStr) => {
            const tokens = inputStr.trim().split(/\s+/);
            let a = parseInt(tokens[0], 10);
            let b = parseInt(tokens[1], 10);
            while (b !== 0) {
                const carry = (a & b) << 1;
                a = a ^ b;
                b = carry;
            }
            return String(a);
        },
        solveBrute: (inputStr) => {
            const tokens = inputStr.trim().split(/\s+/);
            let a = parseInt(tokens[0], 10);
            let b = parseInt(tokens[1], 10);
            while (b !== 0) {
                const carry = (a & b) << 1;
                a = a ^ b;
                b = carry;
            }
            return String(a);
        }
    },

    // 15. Gray Code (Medium)
    {
        order: 15,
        title: 'Gray Code',
        difficulty: 'Medium',
        slug: 'gray-code',
        pattern: 'Reflected Binary Code Formula (i ^ (i >> 1))',
        tags: ['Bit Manipulation', 'Medium', 'Gray Code', 'Campus Placement'],
        statement: `An \`n-bit\` Gray code sequence is a sequence of \`2^n\` integers where:
- Every integer is in the inclusive range \`[0, 2^n - 1]\`,
- The first integer is \`0\`,
- An integer appears no more than once in the sequence,
- The binary representation of every pair of adjacent integers differs by exactly one bit, and
- The binary representation of the first and last integers differs by exactly one bit.

Given an integer \`n\`, return any valid \`n-bit\` Gray code sequence. Output the numbers separated by a single space.`,
        inputFormat: `A single line containing an integer n (1 <= n <= 16).`,
        outputFormat: `Print the 2^n integers of the Gray code sequence separated by spaces.`,
        constraints: [
            '1 <= n <= 12',
            'Output length is exactly 2^n',
            'Time Limit: 1.0 second',
            'Memory Limit: 256 MB'
        ],
        examples: [
            {
                input: '1',
                displayInput: 'n = 1',
                output: '0 1',
                displayOutput: '0 1',
                explanation: '2^1 = 2 numbers. 0 and 1 differ by 1 bit.'
            },
            {
                input: '2',
                displayInput: 'n = 2',
                output: '0 1 3 2',
                displayOutput: '0 1 3 2',
                explanation: 'Binary forms: 00, 01, 11, 10. Each adjacent pair differs by exactly one bit.'
            },
            {
                input: '3',
                displayInput: 'n = 3',
                output: '0 1 3 2 6 7 5 4',
                displayOutput: '0 1 3 2 6 7 5 4',
                explanation: '000, 001, 011, 010, 110, 111, 101, 100.'
            }
        ],
        generateHiddenTests: () => {
            const tests = [];
            for (let n = 1; n <= 12; n++) {
                const total = 1 << n;
                const res = [];
                for (let i = 0; i < total; i++) res.push(i ^ (i >> 1));
                tests.push({ input: String(n), output: res.join(' '), description: `n=${n} (${total} elements)` });
            }
            return tests;
        },
        hints: [
            'Look closely at the sequence for n = 2: [0, 1, 3, 2]. The second half is the reflection of the first half with the highest bit set.',
            'There is a famous closed-form formula for the i-th Gray code number: `G(i) = i ^ (i >> 1)`.',
            'Loop from `i = 0` to `2^n - 1`, compute `i ^ (i >> 1)` and append it to your result.'
        ],
        starterCode: {
            python: `import sys

def gray_code(n: int) -> list[int]:
    # Write your solution here
    pass

if __name__ == '__main__':
    data = sys.stdin.read().split()
    if data:
        n = int(data[0])
        result = gray_code(n)
        if result is not None:
            print(*(result))
`,
            java: `import java.util.Scanner;
import java.util.List;
import java.util.ArrayList;

public class Solution {
    public static List<Integer> grayCode(int n) {
        // Write your solution here
        return new ArrayList<>();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            // Solution call
        }
    }
}
`,
            cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> grayCode(int n) {
    // Write your solution here
    return {};
}

int main() {
    int n;
    if (cin >> n) {
        // Solution call
    }
    return 0;
}
`,
            javascript: `const fs = require('fs');

function grayCode(n) {
    // Write your solution here
    return undefined;
}

const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);
if (input.length > 0 && input[0] !== '') {
    const n = parseInt(input[0], 10);
    const ans = grayCode(n);
    if (ans !== undefined) console.log(ans.join(' '));
}
`
        },
        approaches: {
            brute: {
                title: 'Backtracking with Visited Set',
                idea: 'Start from 0 and recursively try flipping bit 0 to bit n-1 that leads to an unvisited number.',
                timeComplexity: 'O(N * 2^N)',
                spaceComplexity: 'O(2^N)',
                python: `def gray_code(n: int) -> list[int]:
    res = [0]
    visited = {0}
    def backtrack():
        if len(res) == (1 << n):
            return True
        curr = res[-1]
        for i in range(n):
            next_val = curr ^ (1 << i)
            if next_val not in visited:
                visited.add(next_val)
                res.append(next_val)
                if backtrack():
                    return True
                res.pop()
                visited.remove(next_val)
        return False
    backtrack()
    return res`,
                java: `import java.util.*;

public List<Integer> grayCode(int n) {
    List<Integer> res = new ArrayList<>();
    int total = 1 << n;
    for (int i = 0; i < total; i++) {
        res.add(i ^ (i >> 1));
    }
    return res;
}`,
                cpp: `vector<int> grayCode(int n) {
    vector<int> res;
    int total = 1 << n;
    for (int i = 0; i < total; i++) {
        res.push_back(i ^ (i >> 1));
    }
    return res;
}`,
                javascript: `function grayCode(n) {
    const total = 1 << n;
    const res = [];
    for (let i = 0; i < total; i++) {
        res.push(i ^ (i >> 1));
    }
    return res;
}`
            },
            better: {
                title: 'Iterative Reflection (Mirror Method)',
                idea: 'Start with [0]. In each step k from 0 to n-1, mirror the current list in reverse order and add (1 << k) to each reflected element.',
                timeComplexity: 'O(2^N)',
                spaceComplexity: 'O(1) auxiliary',
                python: `def gray_code(n: int) -> list[int]:
    res = [0]
    for i in range(n):
        shift = 1 << i
        for j in range(len(res) - 1, -1, -1):
            res.append(res[j] | shift)
    return res`,
                java: `public List<Integer> grayCode(int n) {
    List<Integer> res = new ArrayList<>();
    res.add(0);
    for (int i = 0; i < n; i++) {
        int shift = 1 << i;
        for (int j = res.size() - 1; j >= 0; j--) {
            res.add(res.get(j) | shift);
        }
    }
    return res;
}`,
                cpp: `vector<int> grayCode(int n) {
    vector<int> res = {0};
    for (int i = 0; i < n; i++) {
        int shift = 1 << i;
        for (int j = res.size() - 1; j >= 0; j--) {
            res.push_back(res[j] | shift);
        }
    }
    return res;
}`,
                javascript: `function grayCode(n) {
    const res = [0];
    for (let i = 0; i < n; i++) {
        const shift = 1 << i;
        for (let j = res.length - 1; j >= 0; j--) {
            res.push(res[j] | shift);
        }
    }
    return res;
}`
            },
            optimal: {
                title: 'Formula Method (i ^ (i >> 1))',
                idea: 'The i-th element of standard reflected Gray code sequence is directly computed by the formula `i ^ (i >> 1)` in O(1) time.',
                timeComplexity: 'O(2^N)',
                spaceComplexity: 'O(1) auxiliary',
                python: `def gray_code(n: int) -> list[int]:
    return [i ^ (i >> 1) for i in range(1 << n)]`,
                java: `public List<Integer> grayCode(int n) {
    List<Integer> res = new ArrayList<>();
    int total = 1 << n;
    for (int i = 0; i < total; i++) {
        res.add(i ^ (i >> 1));
    }
    return res;
}`,
                cpp: `vector<int> grayCode(int n) {
    vector<int> res;
    int total = 1 << n;
    res.reserve(total);
    for (int i = 0; i < total; i++) {
        res.push_back(i ^ (i >> 1));
    }
    return res;
}`,
                javascript: `function grayCode(n) {
    const total = 1 << n;
    const res = new Array(total);
    for (let i = 0; i < total; i++) {
        res[i] = i ^ (i >> 1);
    }
    return res;
}`
            }
        },
        solveOptimal: (inputStr) => {
            const n = parseInt(inputStr.trim().split(/\s+/)[0], 10);
            const total = 1 << n;
            const res = [];
            for (let i = 0; i < total; i++) res.push(i ^ (i >> 1));
            return res.join(' ');
        },
        solveBrute: (inputStr) => {
            const n = parseInt(inputStr.trim().split(/\s+/)[0], 10);
            const res = [0];
            for (let i = 0; i < n; i++) {
                const shift = 1 << i;
                for (let j = res.length - 1; j >= 0; j--) {
                    res.push(res[j] | shift);
                }
            }
            return res.join(' ');
        }
    }
];

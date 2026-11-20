# Topic 20: Bit Manipulation — Canonical Placement Blueprint (20 Problems)

> **Difficulty Distribution:** 7 Easy, 9 Medium, 4 Hard  
> **Target Audience:** Engineering Students preparing for Campus Placements (TCS, Infosys, Amazon, Microsoft, Wipro, Cognizant, Accenture)  
> **Curriculum Authorities:** Striver's A2Z SDE Sheet, NeetCode 150, GeeksforGeeks Placement Tracks  

---

## 20-Problem Blueprint Matrix

| # | Title | Diff | Core Pattern | Frequently Asked By | Time | Space | Deterministic Output Format |
|---|---|:---:|---|---|:---:|:---:|---|
| **1** | **Single Number** | Easy | XOR Identity (X ^ X = 0 and X ^ 0 = X) | TCS Ninja, Infosys, Wipro | $O(N)$ | $O(1)$ | Print the single unique element. |
| **2** | **Number of 1 Bits (Hamming Weight)** | Easy | Brian Kernighan's Bit Clearing (n & (n - 1)) | Amazon, Microsoft, TCS Digital | $O(Set Bits)$ | $O(1)$ | Print the number of set '1' bits. |
| **3** | **Counting Bits** | Easy | Bitwise Right Shift DP Relation (bits[i] = bits[i >> 1] + (i & 1)) | Amazon, Microsoft, Google | $O(N)$ | $O(1) auxiliary$ | Print the number of 1's for each number from 0 to N separated by spaces. |
| **4** | **Reverse Bits** | Easy | 32-Bit Systematic Shift and Masking | Apple, Amazon, Infosys DSE | $O(1)$ | $O(1)$ | Print the reversed 32-bit unsigned integer value. |
| **5** | **Missing Number** | Easy | XOR Cancellation of Array Elements against Full Range [0..N] | TCS Ninja, Infosys, Wipro | $O(N)$ | $O(1)$ | Print the missing number. |
| **6** | **Power of Two** | Easy | Single Set Bit Invariant Check (n > 0 && (n & (n - 1)) == 0) | TCS Ninja, Infosys, Cognizant | $O(1)$ | $O(1)$ | Print 'true' if N is a power of two, else 'false'. |
| **7** | **Add Binary** | Easy | Bitwise Simulated Binary Addition with Carry | Facebook, Amazon, Microsoft | $O(max(N, M))$ | $O(max(N, M))$ | Print their binary sum string. |
| **8** | **Single Number II (Appears 3 Times)** | Medium | Bit-by-Bit Modulo 3 Tally / State Machine (ones, twos) | Amazon, Google, Microsoft | $O(N)$ | $O(1)$ | Print the single unique element. |
| **9** | **Single Number III (Two Unique Elements)** | Medium | Overall XOR Partitioning by Rightmost Set Bit (diff & (-diff)) | Amazon, Microsoft, Flipkart | $O(N)$ | $O(1)$ | Print the two unique elements in ascending order, separated by a space. |
| **10** | **Subsets using Bitmask** | Medium | Iterating from 0 to (1 << N) - 1 with Bit Testing | Amazon, TCS Digital, Infosys | $O(N * 2^N)$ | $O(1) auxiliary$ | Print the total number of subsets. |
| **11** | **Bitwise AND of Numbers Range** | Medium | Common Bit Prefix Finding via Simultaneous Right Shifting | Amazon, Microsoft, Google | $O(32) = O(1)$ | $O(1)$ | Print the bitwise AND of all numbers in the inclusive range [left, right]. |
| **12** | **Minimum Flips to Make a OR b Equal to c** | Medium | Bit-by-Bit Truth Table Discrepancy Counting | Amazon, Microsoft | $O(1)$ | $O(1)$ | Print the minimum flips needed in some bits of A and B to make (A OR B == C). |
| **13** | **Maximum XOR of Two Numbers in an Array** | Medium | Bitwise Trie Opposite Bit Greedy Descent | Google, Amazon, Flipkart | $O(N * 32)$ | $O(N * 32)$ | Print the maximum result of nums[i] XOR nums[j]. |
| **14** | **Sum of Two Integers (Without Plus or Minus)** | Medium | Full Adder Circuit Simulation (XOR for Sum, AND Left Shift for Carry) | Facebook, Amazon, Microsoft | $O(32) = O(1)$ | $O(1)$ | Print their integer sum. |
| **15** | **Gray Code** | Medium | Reflected Binary Code Formula i ^ (i >> 1) | Amazon, Microsoft | $O(2^N)$ | $O(1) auxiliary$ | Print the 2^N gray code sequence separated by spaces. |
| **16** | **Divide Two Integers without Multiplication or Division** | Medium | Bitwise Exponential Subtraction (divisor << shift) | Facebook, Microsoft, Amazon | $O(32)$ | $O(1)$ | Print the quotient after dividing dividend by divisor (clamped to 32-bit signed range). |
| **17** | **Maximum XOR With an Element From Array (Queries)** | Hard | Offline Query Sorting by Threshold + Dynamic Bitwise Trie | Google, Amazon, Flipkart | $O((N + Q) * 32)$ | $O(N * 32)$ | Print the answer to each query separated by spaces (or -1 if no element <= Mi exists). |
| **18** | **Find the Shortest Superstring (TSP Bitmask DP)** | Hard | Hamiltonian Path with Bitmask DP (mask, lastWordIndex) | Google, Amazon | $O(N^2 * 2^N)$ | $O(N * 2^N)$ | Print the length of the shortest superstring containing each word as a substring. |
| **19** | **Number of Valid Words for Each Puzzle** | Hard | Bitmask Frequency Map with Submask Enumeration (sub = (sub - 1) & mask) | Google, Amazon | $O(Words + Puzzles * 2^6)$ | $O(Words)$ | Print the count of valid words for each puzzle separated by spaces. |
| **20** | **Count Pairs With XOR in a Range** | Hard | Binary Trie Prefix Subtree Node Counting | Google, Amazon | $O(N * 32)$ | $O(N * 32)$ | Print the number of nice pairs (i, j) with i < j such that low <= (nums[i] XOR nums[j]) <= high. |

---

## Authority Citations & Verification Sources
- **Striver SDE Sheet (Bit Manipulation Series):** https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2 (Bitwise tricks, XOR properties, and placement interview questions)
- **NeetCode 150 (Bit Manipulation):** https://neetcode.io/practice (Kernighan algorithm, bitmasks, and bitwise arithmetic)
- **GeeksforGeeks Bit Magic:** https://www.geeksforgeeks.org/bitwise-algorithms/ (Trie with bit manipulation and competitive programming patterns)

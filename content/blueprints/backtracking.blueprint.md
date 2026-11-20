# Topic 10: Backtracking — Canonical Placement Blueprint (20 Problems)

> **Difficulty Distribution:** 7 Easy, 9 Medium, 4 Hard  
> **Target Audience:** Engineering Students preparing for Campus Placements (TCS, Infosys, Amazon, Microsoft, Wipro, Cognizant, Accenture)  
> **Curriculum Authorities:** Striver's A2Z SDE Sheet, NeetCode 150, GeeksforGeeks Placement Tracks  

---

## 20-Problem Blueprint Matrix

| # | Title | Diff | Core Pattern | Frequently Asked By | Time | Space | Deterministic Output Format |
|---|---|:---:|---|---|:---:|:---:|---|
| **1** | **Binary Watch** | Easy | Combinatorial Selection with Bit Count Constraints | Google, Amazon, Infosys | $O(1) bounded$ | $O(1)$ | Print the total count of valid times on line 1, and the times sorted lexicographically space-separated on line 2. |
| **2** | **Letter Combinations of a Phone Number (2 Digits)** | Easy | Decision Tree per Digit with Character Expansion | Amazon, Microsoft, TCS Digital | $O(4^N)$ | $O(N)$ | Print all possible letter combinations sorted lexicographically, separated by spaces. |
| **3** | **Sum of All Subset XOR Totals** | Easy | Backtracking Path Accumulation (Take vs Leave) | Amazon, Cognizant, Adobe | $O(2^N)$ | $O(N)$ | Print the sum of all XOR totals for every subset. |
| **4** | **All Paths From Source to Target (DAG)** | Easy | DAG Traversal with Path Appending and Popping | Amazon, Microsoft, Infosys | $O(2^N * N)$ | $O(N)$ | Print the total number of paths from node 0 to node N-1. |
| **5** | **Generate All Binary Strings of Length N** | Easy | Fixed Depth Binary Choice Backtracking | TCS Ninja, Infosys, Wipro | $O(2^N)$ | $O(N)$ | Print all 2^N binary strings of length N sorted lexicographically, separated by spaces. |
| **6** | **Permutations of Unique Characters** | Easy | In-Place Swap Backtracking on Character Array | TCS Ninja, Infosys, Cognizant | $O(N! * N)$ | $O(N)$ | Print all permutations sorted lexicographically, separated by spaces. |
| **7** | **Subsets (Power Set via Backtracking)** | Easy | Candidate Loop with Path Push and Pop | Amazon, Microsoft, TCS Digital | $O(2^N)$ | $O(N)$ | Print the total number of subsets. |
| **8** | **Combination Sum** | Medium | Unbounded Candidate Selection with Backtracking | Amazon, Microsoft, TCS Prime | $O(2^T * K)$ | $O(T)$ | Print the count of unique candidate combinations that sum to target. |
| **9** | **Combination Sum II (No Duplicates Allowed)** | Medium | Sorted Candidate Skip Pruning (i > start and arr[i] == arr[i - 1]) | Amazon, Microsoft, Flipkart | $O(2^N * K)$ | $O(K)$ | Print the count of unique combinations summing to target. |
| **10** | **Permutations II (With Duplicates)** | Medium | Frequency Map / Sorted Visited Array Pruning | Amazon, Microsoft, Google | $O(N! * N)$ | $O(N)$ | Print the total count of unique permutations. |
| **11** | **Subsets II (Unique Subsets from Duplicates)** | Medium | Level-Based Duplicate Skip in Power Set Tree | Amazon, Microsoft, Infosys DSE | $O(2^N)$ | $O(N)$ | Print the number of unique subsets. |
| **12** | **Palindrome Partitioning** | Medium | Prefix Palindrome Validation with Backtracking | Amazon, Google, Microsoft | $O(N * 2^N)$ | $O(N)$ | Print the total number of valid palindrome partitioning schemes. |
| **13** | **Word Search** | Medium | 2D Grid 4-Directional DFS with Temporary Cell Invalidation | Amazon, Microsoft, Apple | $O(R * C * 3^L)$ | $O(L)$ | Print 'true' if the word can be constructed from letters of sequentially adjacent cells, else 'false'. |
| **14** | **Restore IP Addresses** | Medium | Fixed 4-Segment Partitioning with Octet Range Validation | Amazon, Facebook, Microsoft | $O(3^4) = O(1)$ | $O(1)$ | Print all valid IP addresses sorted lexicographically, separated by spaces (or 'NONE' if none). |
| **15** | **Beautiful Arrangement** | Medium | Permutation Construction with Positional Divisibility Pruning | Google, Amazon | $O(k) where k << N!$ | $O(N)$ | Print the number of beautiful arrangements you can construct. |
| **16** | **Non-decreasing Subsequences** | Medium | Backtracking with Local Set Pruning for Duplicates | Amazon, Infosys DSE | $O(2^N * N)$ | $O(N)$ | Print the total count of non-decreasing subsequences with at least two elements. |
| **17** | **N-Queens** | Hard | Row-by-Row Placement with Column & Diagonal Hash Sets | Amazon, Microsoft, Google | $O(N!)$ | $O(N)$ | Print the total number of distinct solutions for placing N non-attacking queens. |
| **18** | **Sudoku Solver** | Hard | Grid Cell Traversal with Row, Column, and 3x3 Box Validation | Amazon, Microsoft, Google | $O(9^(empty cells))$ | $O(1)$ | Print the solved 9x9 board with 9 lines of 9 space-separated digits. |
| **19** | **Word Search II** | Hard | Trie Prefix Tree Combined with 2D Grid Backtracking | Google, Amazon, Microsoft | $O(R * C * 4 * 3^(L-1))$ | $O(Total Chars in Trie)$ | Print all words from dictionary found on the board, sorted lexicographically and space-separated. |
| **20** | **Word Break II** | Hard | Backtracking with Memoization for All Sentence Segmentations | Amazon, Google, Facebook | $O(2^N * N)$ | $O(2^N * N)$ | Print all valid sentences sorted lexicographically, each on a new line (or 'NONE' if none). |

---

## Authority Citations & Verification Sources
- **Striver SDE Sheet (Recursion and Backtracking):** https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2 (N-Queens, Sudoku, M-Coloring, and campus placement backtracking)
- **NeetCode 150 (Backtracking):** https://neetcode.io/practice (Pruning state space trees, candidate exploration, and restoration)
- **GeeksforGeeks Backtracking Algorithms:** https://www.geeksforgeeks.org/backtracking-algorithms/ (Constraint satisfaction and combinatorial search problems)

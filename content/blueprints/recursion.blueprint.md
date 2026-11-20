# Topic 9: Recursion — Canonical Placement Blueprint (20 Problems)

> **Difficulty Distribution:** 7 Easy, 9 Medium, 4 Hard  
> **Target Audience:** Engineering Students preparing for Campus Placements (TCS, Infosys, Amazon, Microsoft, Wipro, Cognizant, Accenture)  
> **Curriculum Authorities:** Striver's A2Z SDE Sheet, NeetCode 150, GeeksforGeeks Placement Tracks  

---

## 20-Problem Blueprint Matrix

| # | Title | Diff | Core Pattern | Frequently Asked By | Time | Space | Deterministic Output Format |
|---|---|:---:|---|---|:---:|:---:|---|
| **1** | **Fibonacci Number** | Easy | Linear Recurrence with Base Conditions F(0)=0, F(1)=1 | TCS Ninja, Infosys, Wipro | $O(2^N) naive, O(N) memoized$ | $O(N)$ | Print the N-th Fibonacci number. |
| **2** | **Factorial of a Number** | Easy | Single Branch Recursive Multiplication N * fact(N-1) | TCS Ninja, Infosys, Wipro | $O(N)$ | $O(N)$ | Print the factorial of N as an integer. |
| **3** | **Sum of Digits of a Number** | Easy | Recursive Modulo and Integer Division (N % 10 + solve(N / 10)) | TCS Ninja, Cognizant, Accenture | $O(log10 N)$ | $O(log10 N)$ | Print the sum of digits of N. |
| **4** | **Power of Two** | Easy | Recursive Halving with Modulo 2 Base Case | Infosys, Wipro, Cognizant | $O(log N)$ | $O(log N)$ | Print 'true' if N is a power of two, else 'false'. |
| **5** | **Power of Three** | Easy | Recursive Tri-Partitioning with Modulo 3 Base Case | Cognizant, TCS Digital | $O(log3 N)$ | $O(log3 N)$ | Print 'true' if N is a power of three, else 'false'. |
| **6** | **Print 1 to N without Loop** | Easy | Head vs Tail Call Stack Placement | TCS Ninja, Infosys, Wipro | $O(N)$ | $O(N)$ | Print integers from 1 to N separated by spaces. |
| **7** | **Reverse an Array using Recursion** | Easy | Two-Index Recursive Swap (left, right) | TCS Ninja, Infosys, Cognizant | $O(N)$ | $O(N)$ | Print the reversed array separated by spaces. |
| **8** | **Pow(x, n) (Binary Exponentiation)** | Medium | Divide and Conquer Exponentiation in O(log N) | Amazon, Facebook, Microsoft | $O(log N)$ | $O(log N)$ | Print X raised to power N formatted to 5 decimal places. |
| **9** | **K-th Symbol in Grammar** | Medium | Binary Recursive Tree Parity Mapping | Google, Amazon, Microsoft | $O(N)$ | $O(N)$ | Print the K-th symbol (0 or 1). |
| **10** | **Subsets Generation (Power Set)** | Medium | Binary Decision Tree (Include or Exclude Element) | Amazon, Microsoft, TCS Prime | $O(2^N)$ | $O(N)$ | Print the total count of subsets on line 1, and the size of each subset space-separated in non-decreasing order on line 2. |
| **11** | **Combination Sum** | Medium | Unbounded Choice Recursion with Backtracking | Amazon, Microsoft, Adobe | $O(2^T * K)$ | $O(K)$ | Print the count of unique combinations that sum to target. |
| **12** | **Permutations of Array** | Medium | Recursive Swapping with Backtracking | Amazon, Microsoft, Flipkart | $O(N! * N)$ | $O(N)$ | Print the total count of permutations. |
| **13** | **Tower of Hanoi** | Medium | 3-Step Recursive Subproblem Decomposition | TCS Digital, Infosys, Wipro | $O(2^N)$ | $O(N)$ | Print the total minimum number of moves required (2^N - 1). |
| **14** | **Generate Parentheses** | Medium | Catalan Recursive Budgeting (Open and Close Counters) | Amazon, Microsoft, Google | $O(4^N / sqrt(N))$ | $O(N)$ | Print all valid well-formed parentheses combinations sorted lexicographically, separated by spaces. |
| **15** | **Flatten a Nested List using Recursion** | Medium | Recursive Traversal of Hierarchical Structures | Google, Twitter, Amazon | $O(Total Elements)$ | $O(Max Depth)$ | Print the flattened array of integers separated by spaces. |
| **16** | **Count Good Numbers** | Medium | Divide-and-Conquer Modular Exponentiation | Amazon, Infosys DSE | $O(log N)$ | $O(log N)$ | Print the total number of good digit strings of length N modulo 10^9 + 7. |
| **17** | **Josephus Problem** | Hard | Recursive Circle Elimination Index Shift J(N, K) = (J(N-1, K) + K) % N | Amazon, Microsoft, Google | $O(N)$ | $O(N) or O(1) iterative$ | Print the 1-based position of the safe survivor. |
| **18** | **Word Search (Grid Recursion)** | Hard | 2D Grid DFS with Cell Marking and Backtracking | Amazon, Microsoft, Bloomberg | $O(R * C * 4^L)$ | $O(L)$ | Print 'true' if the word exists in the grid, else 'false'. |
| **19** | **Predict the Winner (Minimax Recursion)** | Hard | Recursive Minimax Game Theory with Memoization | Google, Amazon, Adobe | $O(N^2)$ | $O(N^2)$ | Print 'true' if Player 1 can win, else 'false'. |
| **20** | **Special Binary String** | Hard | Recursive Mountain Decomposition and Lexicographical Sorting | Google, Uber | $O(N^2)$ | $O(N)$ | Print the lexicographically largest resulting string possible. |

---

## Authority Citations & Verification Sources
- **Striver SDE Sheet (Recursion Basics & Medium):** https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2 (Recursive trees, base conditions, and campus interview favorites)
- **NeetCode 150 (Recursion & Trees):** https://neetcode.io/practice (Divide and conquer recursive formulation)
- **GeeksforGeeks Recursion Practice:** https://www.geeksforgeeks.org/recursion/ (Mathematical recurrence and recursive game theory)

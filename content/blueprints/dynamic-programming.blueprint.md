# Topic 19: Dynamic Programming — Canonical Placement Blueprint (20 Problems)

> **Difficulty Distribution:** 7 Easy, 9 Medium, 4 Hard  
> **Target Audience:** Engineering Students preparing for Campus Placements (TCS, Infosys, Amazon, Microsoft, Wipro, Cognizant, Accenture)  
> **Curriculum Authorities:** Striver's A2Z SDE Sheet, NeetCode 150, GeeksforGeeks Placement Tracks  

---

## 20-Problem Blueprint Matrix

| # | Title | Diff | Core Pattern | Frequently Asked By | Time | Space | Deterministic Output Format |
|---|---|:---:|---|---|:---:|:---:|---|
| **1** | **Climbing Stairs** | Easy | 1D Recurrence Relation dp[i] = dp[i-1] + dp[i-2] | TCS Ninja, Infosys, Wipro | $O(N)$ | $O(1) space optimized$ | Print the total number of distinct ways to climb to the top. |
| **2** | **Min Cost Climbing Stairs** | Easy | 1D Cost Minimization Recurrence | Amazon, TCS Digital, Infosys | $O(N)$ | $O(1)$ | Print the minimum cost to reach the top of the floor. |
| **3** | **House Robber** | Easy | Non-Adjacent Maximum Sum (rob = max(rob, prevRob + val)) | Amazon, Microsoft, TCS Prime | $O(N)$ | $O(1)$ | Print the maximum amount of money you can rob tonight without alerting the police. |
| **4** | **Pascal's Triangle** | Easy | 2D Triangular Grid DP (dp[r][c] = dp[r-1][c-1] + dp[r-1][c]) | Amazon, TCS Digital, Infosys | $O(N^2)$ | $O(1) auxiliary$ | Print each row of Pascal's triangle on a new line with space-separated integers. |
| **5** | **Divisor Game** | Easy | Game Theory DP State Invariant (Alice wins iff N % 2 == 0) | Amazon, Wipro, Infosys | $O(1)$ | $O(1)$ | Print 'true' if Alice wins the game assuming optimal play, else 'false'. |
| **6** | **Counting Bits** | Easy | Bitwise Shift DP Transition (dp[i] = dp[i >> 1] + (i & 1)) | Amazon, Microsoft, Infosys DSE | $O(N)$ | $O(1) auxiliary$ | Print the bit counts from 0 to N separated by spaces. |
| **7** | **Maximum Subarray Sum (Kadane's DP)** | Easy | 1D Local vs Global Maximum State Transition | TCS Ninja, Infosys, Wipro | $O(N)$ | $O(1)$ | Print a single integer representing the maximum contiguous subarray sum. |
| **8** | **Longest Increasing Subsequence (LIS)** | Medium | Patience Sorting Binary Search in O(N log N) | Amazon, Microsoft, Google | $O(N log N)$ | $O(N)$ | Print the length of the longest strictly increasing subsequence. |
| **9** | **Coin Change (Fewest Coins)** | Medium | Unbounded Knapsack 1D Minimum Coins Recurrence | Amazon, Microsoft, Google | $O(N * Amount)$ | $O(Amount)$ | Print the fewest number of coins needed to make up that amount (or -1 if impossible). |
| **10** | **Maximum Product Subarray** | Medium | Dual Running Extreme Tracking (Max and Min for Negative Swaps) | Amazon, Microsoft, Facebook | $O(N)$ | $O(1)$ | Print the largest product of any contiguous subarray. |
| **11** | **0/1 Knapsack Problem** | Medium | Bounded Weight Capacity 1D Space Optimized DP | Amazon, Microsoft, Flipkart | $O(N * W)$ | $O(W)$ | Print the maximum value that can be put in a knapsack of capacity W. |
| **12** | **Longest Common Subsequence (LCS)** | Medium | 2D Grid DP Character Matching Recurrence | Amazon, Microsoft, Google | $O(N * M)$ | $O(min(N, M))$ | Print the length of their longest common subsequence. |
| **13** | **Word Break** | Medium | 1D Boolean State DP with Suffix Dictionary Lookup | Amazon, Facebook, Microsoft | $O(N^2 * L)$ | $O(N + Words)$ | Print 'true' if S can be segmented into dictionary words, else 'false'. |
| **14** | **House Robber II (Circular Street)** | Medium | Circular Decomposition into Two Linear DP Runs | Amazon, Google, Microsoft | $O(N)$ | $O(1)$ | Print the maximum amount of money you can rob. |
| **15** | **Partition Equal Subset Sum** | Medium | Subset Sum DP with Target = TotalSum / 2 | Amazon, Microsoft, Infosys SP | $O(N * Target)$ | $O(Target)$ | Print 'true' if array can be partitioned into two equal sum subsets, else 'false'. |
| **16** | **Unique Paths** | Medium | 2D Grid Combinatorial Recurrence dp[r][c] = dp[r-1][c] + dp[r][c-1] | Amazon, Microsoft, TCS Digital | $O(M * N)$ | $O(N)$ | Print the number of possible unique paths from top-left to bottom-right. |
| **17** | **Edit Distance (Levenshtein Distance)** | Hard | 2D Grid DP with 3 Operations (Insert, Delete, Replace) | Amazon, Microsoft, Google | $O(N * M)$ | $O(min(N, M))$ | Print the minimum number of operations required to convert word1 to word2. |
| **18** | **Trapping Rain Water (Dynamic Programming Arrays)** | Hard | Prefix Max and Suffix Max Boundary Arrays | Amazon, Microsoft, Google | $O(N)$ | $O(N)$ | Print the total units of trapped rain water. |
| **19** | **Burst Balloons** | Hard | Interval Matrix Chain Multiplication DP (Last Balloon Burst) | Amazon, Google, Samsung | $O(N^3)$ | $O(N^2)$ | Print the maximum coins you can collect by bursting the balloons wisely. |
| **20** | **Regular Expression Matching** | Hard | 2D Matrix DP with Complex Wildcard Branching ('.' and '*') | Google, Amazon, Facebook | $O(N * M)$ | $O(N * M)$ | Print 'true' if the pattern matches the entire string, else 'false'. |

---

## Authority Citations & Verification Sources
- **Striver SDE Sheet (Dynamic Programming Series):** https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2 (1D, 2D, Knapsack, LCS, LIS, and partition DP curriculum)
- **NeetCode 150 (1-D & 2-D DP):** https://neetcode.io/practice (State recurrence definitions and space-optimization techniques)
- **GeeksforGeeks Dynamic Programming:** https://www.geeksforgeeks.org/dynamic-programming/ (Standard campus placement test DP questions)

# Topic 6: Prefix Sum — Canonical Placement Blueprint (20 Problems)

> **Difficulty Distribution:** 7 Easy, 9 Medium, 4 Hard  
> **Target Audience:** Engineering Students preparing for Campus Placements (TCS, Infosys, Amazon, Microsoft, Wipro, Cognizant, Accenture)  
> **Curriculum Authorities:** Striver's A2Z SDE Sheet, NeetCode 150, GeeksforGeeks Placement Tracks  

---

## 20-Problem Blueprint Matrix

| # | Title | Diff | Core Pattern | Frequently Asked By | Time | Space | Deterministic Output Format |
|---|---|:---:|---|---|:---:|:---:|---|
| **1** | **Range Sum Query - Immutable** | Easy | 1D Prefix Sum Precomputation for O(1) Range Queries | TCS Ninja, Infosys, Wipro | $O(N) preprocess, O(1) per query$ | $O(N)$ | Print the sum of elements between indices left and right for each query, each on a new line. |
| **2** | **Find Pivot Index (Equilibrium Index)** | Easy | Total Sum minus Left Sum equals Right Sum | TCS Digital, Infosys, Accenture | $O(N)$ | $O(1)$ | Print the leftmost equilibrium index, or -1 if no such index exists. |
| **3** | **Running Sum of 1d Array** | Easy | Cumulative Prefix In-Place Accumulation | TCS Ninja, Infosys, Wipro | $O(N)$ | $O(1)$ | Print the running sum array separated by spaces. |
| **4** | **Find the Highest Altitude** | Easy | Cumulative Net Gain Tracking with Maxima | Cognizant, Accenture, Wipro | $O(N)$ | $O(1)$ | Print the highest altitude reached starting from altitude 0. |
| **5** | **Left and Right Sum Differences** | Easy | Simultaneous Prefix and Suffix Running Differences | Infosys DSE, Cognizant | $O(N)$ | $O(N)$ | Print the array of absolute differences \|leftSum[i] - rightSum[i]\| separated by spaces. |
| **6** | **Minimum Value to Get Positive Step by Step Sum** | Easy | Prefix Minimum Accumulation and Clamp | Amazon, TCS Digital | $O(N)$ | $O(1)$ | Print the minimum positive value of startValue such that the step by step sum is never less than 1. |
| **7** | **Sum of All Odd Length Subarrays** | Easy | Prefix Sum Range Aggregation / Combinatorial Contribution | Infosys, Adobe, Cognizant | $O(N)$ | $O(1)$ | Print the sum of all possible odd-length subarrays. |
| **8** | **Subarray Sum Equals K** | Medium | Prefix Sum with Frequency Hash Map | Amazon, Microsoft, TCS Prime | $O(N)$ | $O(N)$ | Print the total number of continuous subarrays whose sum equals K. |
| **9** | **Continuous Subarray Sum** | Medium | Prefix Sum Modulo Remainder Hash Map with Index Distance | Facebook, Amazon, Infosys SP | $O(N)$ | $O(min(N, K))$ | Print 'true' if the array has a good subarray of length at least 2 whose sum is a multiple of K, else 'false'. |
| **10** | **Contiguous Array (Equal 0s and 1s)** | Medium | Prefix Sum Transformation (0 to -1) with Earliest Seen Index | Amazon, Microsoft, Flipkart | $O(N)$ | $O(N)$ | Print the maximum length of a contiguous subarray with an equal number of 0 and 1. |
| **11** | **Range Sum Query 2D - Immutable** | Medium | 2D Prefix Sum Matrix Inclusion-Exclusion Principle | Amazon, Facebook, Microsoft | $O(R * C) preprocess, O(1) per query$ | $O(R * C)$ | Print the sum of elements inside the rectangle defined by (r1, c1) and (r2, c2) for each query, each on a new line. |
| **12** | **Subarray Sums Divisible by K** | Medium | Prefix Modulo Remainder Frequency Combinatorics | Amazon, Infosys SP, Microsoft | $O(N)$ | $O(K)$ | Print the number of non-empty subarrays that have a sum divisible by K. |
| **13** | **Maximum Size Subarray Sum Equals K** | Medium | Prefix Sum Hash Map Storing First Occurrence Index | Amazon, Facebook, Infosys DSE | $O(N)$ | $O(N)$ | Print the maximum length of a subarray that sums to K (or 0 if none). |
| **14** | **Corporate Flight Bookings** | Medium | Difference Array (Prefix Sweep Line) | Amazon, Google, Infosys SP | $O(N + B)$ | $O(N)$ | Print the total number of reserved seats on each flight from 1 to N, separated by spaces. |
| **15** | **Product of Array Except Self** | Medium | Prefix and Suffix Running Products | Amazon, Microsoft, Apple | $O(N)$ | $O(1) auxiliary$ | Print the product array separated by spaces. |
| **16** | **Make Sum Divisible by P** | Medium | Prefix Modulo Target Remainder Distance Minimization | Amazon, Google | $O(N)$ | $O(N)$ | Print the length of the smallest subarray to remove, or -1 if impossible. |
| **17** | **Number of Submatrices That Sum to Target** | Hard | 2D Prefix Sum Column Reduction to 1D Hash Map | Amazon, Google, DE Shaw | $O(R^2 * C)$ | $O(C)$ | Print the number of non-empty submatrices that sum to target. |
| **18** | **Count of Range Sum** | Hard | Prefix Sums with Divide-and-Conquer Merge Sort | Google, Amazon, Microsoft | $O(N log N)$ | $O(N)$ | Print the number of range sums that lie in [lower, upper]. |
| **19** | **Shortest Subarray with Sum at Least K** | Hard | Prefix Sum with Monotonic Increasing Deque | Amazon, Google, Facebook | $O(N)$ | $O(N)$ | Print the length of the shortest non-empty subarray with sum at least K (or -1 if none). |
| **20** | **Maximum Sum of Subarray After Removing At Most One Element** | Hard | Dual Prefix and Suffix Max Subarray Forward and Backward | Amazon, Microsoft, Directi | $O(N)$ | $O(N)$ | Print the maximum sum of a non-empty subarray after removing at most one element. |

---

## Authority Citations & Verification Sources
- **Striver SDE Sheet (Prefix Sum):** https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2 (Prefix sum subarray patterns and campus interview foundations)
- **NeetCode 150 (Arrays & Prefix Sum):** https://neetcode.io/practice (1D and 2D prefix sum and difference array patterns)
- **GeeksforGeeks Prefix Sum Array:** https://www.geeksforgeeks.org/prefix-sum-array-implementation-applications-competitive-programming/ (Range query optimization and placement coding challenges)

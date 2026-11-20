# Topic 7: Binary Search — Canonical Placement Blueprint (20 Problems)

> **Difficulty Distribution:** 7 Easy, 9 Medium, 4 Hard  
> **Target Audience:** Engineering Students preparing for Campus Placements (TCS, Infosys, Amazon, Microsoft, Wipro, Cognizant, Accenture)  
> **Curriculum Authorities:** Striver's A2Z SDE Sheet, NeetCode 150, GeeksforGeeks Placement Tracks  

---

## 20-Problem Blueprint Matrix

| # | Title | Diff | Core Pattern | Frequently Asked By | Time | Space | Deterministic Output Format |
|---|---|:---:|---|---|:---:|:---:|---|
| **1** | **Binary Search** | Easy | Standard Iterative Midpoint Search with Integer Overflow Prevention | TCS Ninja, Infosys, Wipro | $O(log N)$ | $O(1)$ | Print the 0-based index of target, or -1 if target is not present. |
| **2** | **Search Insert Position** | Easy | Lower Bound (First Index with Value >= Target) | Amazon, TCS Digital, Infosys | $O(log N)$ | $O(1)$ | Print the 0-based index where target is found or where it would be if it were inserted in order. |
| **3** | **Guess Number Higher or Lower** | Easy | Monotonic Range Halving with Comparison Feedback | Google, Amazon, Infosys DSE | $O(log N)$ | $O(1)$ | Print the picked number found via binary search. |
| **4** | **First Bad Version** | Easy | Boolean Predicate First True Transition Point | Facebook, Amazon, Microsoft | $O(log N)$ | $O(1)$ | Print the first bad version number. |
| **5** | **Sqrt(x)** | Easy | Binary Search on Monotonic Non-Decreasing Value Space | Amazon, Bloomberg, Infosys | $O(log X)$ | $O(1)$ | Print the integer part of the square root of X (floor(sqrt(X))). |
| **6** | **Peak Index in a Mountain Array** | Easy | Slope Gradient Comparison (nums[mid] < nums[mid + 1]) | Amazon, Google, Cognizant | $O(log N)$ | $O(1)$ | Print the index of the mountain peak. |
| **7** | **Count Negative Numbers in a Sorted Matrix** | Easy | Row-Wise Binary Search / Staircase Elimination | Amazon, Infosys DSE | $O(M + N) or O(M log N)$ | $O(1)$ | Print the total count of negative numbers in the matrix. |
| **8** | **Search in Rotated Sorted Array** | Medium | Sorted Half Identification and Boundary Check | Amazon, Microsoft, TCS Prime | $O(log N)$ | $O(1)$ | Print the 0-based index of target, or -1 if not found. |
| **9** | **Find First and Last Position of Element in Sorted Array** | Medium | Dual Binary Search for Lower and Upper Bound | Amazon, Microsoft, TCS Digital | $O(log N)$ | $O(1)$ | Print the starting and ending indices separated by a space (e.g. '3 5'), or '-1 -1' if not found. |
| **10** | **Find Minimum in Rotated Sorted Array** | Medium | Pivot Inflection Point Binary Search | Amazon, Microsoft, Flipkart | $O(log N)$ | $O(1)$ | Print the minimum element in the array. |
| **11** | **Search a 2D Matrix** | Medium | Virtual 1D Array to 2D Row-Col Coordinate Mapping | Amazon, Microsoft, TCS Digital | $O(log(M * N))$ | $O(1)$ | Print 'true' if target exists in matrix, else 'false'. |
| **12** | **Koko Eating Bananas** | Medium | Binary Search on Answer Space (Monotonic Validator) | Amazon, Google, Airbnb | $O(N log(max(P)))$ | $O(1)$ | Print the minimum integer speed K to eat all bananas within H hours. |
| **13** | **Capacity To Ship Packages Within D Days** | Medium | Binary Search on Capacity with Greedy Day Counter | Amazon, Google, Microsoft | $O(N log(sum - max))$ | $O(1)$ | Print the least weight capacity of the ship to deliver all packages within days. |
| **14** | **Single Element in a Sorted Array** | Medium | Index Parity (Even-Odd Pair Matching) Invariant | Amazon, Microsoft, TCS Prime | $O(log N)$ | $O(1)$ | Print the single element that appears only once. |
| **15** | **Find Peak Element** | Medium | Ascending Slope Walk towards Greater Neighbor | Amazon, Facebook, Microsoft | $O(log N)$ | $O(1)$ | Print the index of any local peak element. |
| **16** | **Aggressive Cows (Allocate Minimum Distance)** | Medium | Binary Search on Answer Space with Greedy Placement | Amazon, Directi, Flipkart | $O(N log(maxPos) + N log N)$ | $O(1)$ | Print the largest minimum distance possible between any two cows. |
| **17** | **Median of Two Sorted Arrays** | Hard | Simultaneous Cut Partitioning with Left/Right Boundary Invariants | Amazon, Google, Microsoft | $O(log(min(M, N)))$ | $O(1)$ | Print the median with 5 decimal places (e.g. '2.50000'). |
| **18** | **Split Array Largest Sum** | Hard | Binary Search on Minimized Maximum Subarray Sum with Greedy Partitioner | Google, Amazon, Facebook | $O(N log(sum))$ | $O(1)$ | Print the minimized largest sum of any subarray. |
| **19** | **Book Allocation Problem** | Hard | Binary Search on Answer Space for Painter / Allocation Partition | Amazon, Flipkart, TCS Prime | $O(N log(sum))$ | $O(1)$ | Print the minimum possible maximum page count allocated to any student (or -1 if impossible). |
| **20** | **Find in Mountain Array** | Hard | Triple Binary Search (Find Peak, BS Ascending, BS Descending) | Google, Amazon, Bloomberg | $O(log N)$ | $O(1)$ | Print the minimum index such that mountainArr[index] == target, or -1 if not found. |

---

## Authority Citations & Verification Sources
- **Striver SDE Sheet (Binary Search):** https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2 (Complete campus placement binary search guide & BS on answers)
- **NeetCode 150 (Binary Search):** https://neetcode.io/practice (Rotated search and monotonic predicate search)
- **GeeksforGeeks Binary Search Library:** https://www.geeksforgeeks.org/binary-search/ (Standard interview problems and threshold search patterns)

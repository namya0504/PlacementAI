# Topic 4: Two Pointers — Canonical Placement Blueprint (20 Problems)

> **Difficulty Distribution:** 7 Easy, 9 Medium, 4 Hard  
> **Target Audience:** Engineering Students preparing for Campus Placements (TCS, Infosys, Amazon, Microsoft, Wipro, Cognizant, Accenture)  
> **Curriculum Authorities:** Striver's A2Z SDE Sheet, NeetCode 150, GeeksforGeeks Placement Tracks  

---

## 20-Problem Blueprint Matrix

| # | Title | Diff | Core Pattern | Frequently Asked By | Time | Space | Deterministic Output Format |
|---|---|:---:|---|---|:---:|:---:|---|
| **1** | **Two Sum II - Input Array Is Sorted** | Easy | Inward Converging Pointers from Ends | Amazon, TCS Digital, Infosys DSE | $O(N)$ | $O(1)$ | Print the two 1-based indices separated by a space in ascending order. |
| **2** | **Valid Palindrome II** | Easy | Two Pointers with at most One Mismatch Tolerance | Facebook, Microsoft, Amazon | $O(N)$ | $O(1)$ | Print 'true' if S can be a palindrome after deleting at most one character, else 'false'. |
| **3** | **Reverse Vowels of a String** | Easy | Dual Pointers Advancing to Predicate Match | TCS Ninja, Infosys, Wipro | $O(N)$ | $O(1)$ | Print the string with all vowels reversed. |
| **4** | **Merge Sorted Array (In-Place from Back)** | Easy | Back-to-Front Insertion to Prevent Overwriting | Amazon, Microsoft, TCS Digital | $O(M + N)$ | $O(1)$ | Print the merged sorted array of (M + N) integers separated by spaces. |
| **5** | **Remove Duplicates from Sorted Array** | Easy | Fast and Slow Reader-Writer Pointers | TCS Ninja, Infosys, Accenture | $O(N)$ | $O(1)$ | Print the count of unique elements K on line 1, and the first K unique elements space-separated on line 2. |
| **6** | **Move Zeroes** | Easy | Two Pointers Fast Scan and Slow Compaction | Amazon, TCS Digital, Wipro | $O(N)$ | $O(1)$ | Print the modified array with all zeros moved to the end, separated by spaces. |
| **7** | **Backspace String Compare** | Easy | Reverse Iteration with Backspace Skip Counter | Google, Amazon, Infosys DSE | $O(N + M)$ | $O(1)$ | Print 'true' if both strings are equal after backspace '#' processing, else 'false'. |
| **8** | **3Sum** | Medium | Sort Array + Outer Loop with Inward Converging Two Pointers | Amazon, Microsoft, Facebook | $O(N^2)$ | $O(1)$ | Print the count of unique triplets that sum to 0. |
| **9** | **Container With Most Water** | Medium | Two Pointers Greedy Squeeze of Shorter Boundary | Amazon, Microsoft, Google | $O(N)$ | $O(1)$ | Print a single integer representing the maximum water container capacity. |
| **10** | **3Sum Closest** | Medium | Two Pointers with Running Difference Minimization | Amazon, Microsoft, Bloomberg | $O(N^2)$ | $O(1)$ | Print the sum of the three integers that is closest to target. |
| **11** | **Sort Colors (Dutch National Flag)** | Medium | Three Pointers Partitioning (low, mid, high) | TCS Prime, Infosys SP, Amazon | $O(N)$ | $O(1)$ | Print the sorted array separated by spaces. |
| **12** | **Boats to Save People** | Medium | Greedy Two Pointers Pairing Lightest and Heaviest | Amazon, Google, Infosys DSE | $O(N log N)$ | $O(1)$ | Print the minimum number of boats required to carry every person. |
| **13** | **Partition Array According to Given Pivot** | Medium | Stable Dual Pointers with Fixed Mid Value Preservation | Amazon, Cognizant, Adobe | $O(N)$ | $O(N)$ | Print the partitioned array separated by spaces. |
| **14** | **Rotate Array by K Steps** | Medium | Triple Subarray In-Place Reversal Algorithm | Amazon, Microsoft, TCS Digital | $O(N)$ | $O(1)$ | Print the rotated array elements separated by spaces. |
| **15** | **Remove Duplicates from Sorted Array II** | Medium | Two Pointers Allowing at most K Duplicates | Amazon, Facebook, Microsoft | $O(N)$ | $O(1)$ | Print the new length K on line 1, and the modified array elements up to K space-separated on line 2. |
| **16** | **Four Sum** | Medium | Nested Two Pointers with Quadruplet Pruning | Amazon, Microsoft, Adobe | $O(N^3)$ | $O(1)$ | Print the number of distinct quadruplets summing to target. |
| **17** | **Trapping Rain Water (Two Pointers)** | Hard | Converging Two Pointers with Running Left and Right Maxima | Amazon, Microsoft, Google | $O(N)$ | $O(1)$ | Print a single integer representing the total units of trapped rain water. |
| **18** | **Smallest Range Covering Elements from K Lists** | Hard | Multi-Pointer Tracking with Boundary Minimization | Google, Amazon, Flipkart | $O(N log K)$ | $O(K)$ | Print the two integers defining the smallest range [A, B] separated by a space. |
| **19** | **Subarrays with Bounded Maximum** | Hard | Two Pointers Window Count Difference | Amazon, Google, DE Shaw | $O(N)$ | $O(1)$ | Print the count of contiguous non-empty subarrays where the maximum element is between left and right. |
| **20** | **Minimum Size Subarray Sum** | Hard | Two Pointers Fast Expansion and Slow Contraction | Amazon, Facebook, Microsoft | $O(N)$ | $O(1)$ | Print the minimal length of a contiguous subarray whose sum is greater than or equal to target (or 0 if none). |

---

## Authority Citations & Verification Sources
- **Striver SDE Sheet (Two Pointers):** https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2 (Canonical two-pointer patterns for placement exams)
- **NeetCode 150 (Two Pointers):** https://neetcode.io/practice (Inward-converging, slow-fast, and back-to-front pointer paradigms)
- **GeeksforGeeks Two Pointer Technique:** https://www.geeksforgeeks.org/two-pointers-technique/ (Interview questions for IT service & product companies)

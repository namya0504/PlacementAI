# Topic 8: Sorting — Canonical Placement Blueprint (20 Problems)

> **Difficulty Distribution:** 7 Easy, 9 Medium, 4 Hard  
> **Target Audience:** Engineering Students preparing for Campus Placements (TCS, Infosys, Amazon, Microsoft, Wipro, Cognizant, Accenture)  
> **Curriculum Authorities:** Striver's A2Z SDE Sheet, NeetCode 150, GeeksforGeeks Placement Tracks  

---

## 20-Problem Blueprint Matrix

| # | Title | Diff | Core Pattern | Frequently Asked By | Time | Space | Deterministic Output Format |
|---|---|:---:|---|---|:---:|:---:|---|
| **1** | **Bubble Sort with Early Exit** | Easy | Adjacent Pairwise Swapping with Did-Swap Flag | TCS Ninja, Infosys, Wipro | $O(N^2) worst, O(N) best$ | $O(1)$ | Print the sorted array separated by spaces. |
| **2** | **Selection Sort** | Easy | Prefix Minimum Selection and Single Swap | TCS Ninja, Infosys, Cognizant | $O(N^2)$ | $O(1)$ | Print the sorted array separated by spaces. |
| **3** | **Insertion Sort** | Easy | Incremental Shifting into Sorted Prefix | TCS Ninja, Wipro, Accenture | $O(N^2) worst, O(N) best$ | $O(1)$ | Print the sorted array separated by spaces. |
| **4** | **Sort Array by Parity** | Easy | Two-Pointer In-Place Partitioning | Amazon, TCS Digital, Cognizant | $O(N)$ | $O(1)$ | Print any valid array where all even integers precede all odd integers, separated by spaces. |
| **5** | **How Many Numbers Are Smaller Than Current Number** | Easy | Counting Sort / Frequency Prefix Sum | Amazon, Infosys DSE, Accenture | $O(N + K)$ | $O(K)$ | Print an array where each element indicates how many numbers are smaller than it, separated by spaces. |
| **6** | **Rank Transform of an Array** | Easy | Sorted Unique Mapping with Hash Table Ranks | Google, Amazon, Infosys | $O(N log N)$ | $O(N)$ | Print the array with each element replaced by its 1-based rank, separated by spaces. |
| **7** | **Merge Two Sorted Arrays** | Easy | Two Pointer Linear Merge | TCS Ninja, Infosys, Wipro | $O(N + M)$ | $O(N + M)$ | Print the merged sorted array of (N + M) integers separated by spaces. |
| **8** | **Merge Sort** | Medium | Divide and Conquer with Stable Linear Merge | TCS Digital, Infosys DSE, Amazon | $O(N log N)$ | $O(N)$ | Print the sorted array separated by spaces. |
| **9** | **Quick Sort** | Medium | In-Place Partitioning around Pivot Element | Amazon, Microsoft, TCS Digital | $O(N log N) average, O(N^2) worst$ | $O(log N)$ | Print the sorted array separated by spaces. |
| **10** | **Sort Colors (Dutch National Flag)** | Medium | Three-Way Partitioning (0s, 1s, 2s) | TCS Prime, Infosys SP, Amazon | $O(N)$ | $O(1)$ | Print the sorted array separated by spaces. |
| **11** | **Kth Largest Element in an Array (Quickselect)** | Medium | Hoare's Quickselect Selection Algorithm | Amazon, Microsoft, Facebook | $O(N) average, O(N^2) worst$ | $O(1)$ | Print the Kth largest integer. |
| **12** | **Top K Frequent Elements** | Medium | Frequency Map Aggregation with Bucket Sort | Amazon, Microsoft, Google | $O(N)$ | $O(N)$ | Print the K most frequent elements sorted in ascending order, separated by spaces. |
| **13** | **Meeting Rooms II** | Medium | Chronological Start and End Sweep Line Sorting | Amazon, Google, Facebook | $O(N log N)$ | $O(N)$ | Print the minimum number of conference rooms required. |
| **14** | **Largest Number** | Medium | Custom String Concatenation Comparator (A+B vs B+A) | Amazon, Microsoft, Paytm | $O(N log N * K)$ | $O(N * K)$ | Print the largest number formed as a string (handling leading zeros correctly). |
| **15** | **Non-overlapping Intervals** | Medium | Greedy Sort by Interval End Time | Amazon, Microsoft, Google | $O(N log N)$ | $O(1)$ | Print the minimum number of intervals you need to remove to make the rest non-overlapping. |
| **16** | **Sort an Array (Heap Sort)** | Medium | In-Place Max-Heap Construction and Sift-Down | Amazon, Oracle, Cisco | $O(N log N)$ | $O(1)$ | Print the sorted array separated by spaces. |
| **17** | **Count Inversions in an Array** | Hard | Divide-and-Conquer Merge Sort Cross Inversion Counting | Amazon, Microsoft, Flipkart | $O(N log N)$ | $O(N)$ | Print the total number of inversions in the array. |
| **18** | **Reverse Pairs** | Hard | Modified Merge Sort with Two-Pointer Condition Check | Amazon, Google, Microsoft | $O(N log N)$ | $O(N)$ | Print the number of reverse pairs in the array. |
| **19** | **Maximum Gap (Bucket Sort)** | Hard | Pigeonhole Principle with Min-Max Buckets | Amazon, Google | $O(N)$ | $O(N)$ | Print the maximum difference between two successive elements in its sorted form (or 0 if N < 2). |
| **20** | **Russian Doll Envelopes** | Hard | Sort by Width Ascending & Height Descending + Longest Increasing Subsequence | Google, Amazon, Microsoft | $O(N log N)$ | $O(N)$ | Print the maximum number of envelopes you can Russian doll (put one inside another). |

---

## Authority Citations & Verification Sources
- **Striver SDE Sheet (Sorting Techniques):** https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2 (Core comparison and non-comparison sorting algorithms)
- **NeetCode 150 (Sorting):** https://neetcode.io/practice (Quickselect, custom comparators, and interval sorting)
- **GeeksforGeeks Sorting Algorithms:** https://www.geeksforgeeks.org/sorting-algorithms/ (Inversion counting, bucket sorting, and placement interview staples)

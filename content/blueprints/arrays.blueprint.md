# Topic : Arrays — Canonical Placement Blueprint (20 Problems)

> **Difficulty Distribution:** 7 Easy, 9 Medium, 4 Hard  
> **Target Audience:** Engineering Students preparing for Campus Placements (TCS, Infosys, Amazon, Microsoft, Wipro, Cognizant, Accenture)  
> **Curriculum Authorities:** Striver's A2Z SDE Sheet, NeetCode 150, GeeksforGeeks Placement Tracks  

---

## 20-Problem Blueprint Matrix

| # | Title | Diff | Core Pattern | Frequently Asked By | Time | Space | Deterministic Output Format |
|---|---|:---:|---|---|:---:|:---:|---|
| **1** | **Two Sum** | Easy | Hash Table Complement Lookup | TCS Digital, Infosys DSE, Cognizant | $O(N)$ | $O(N)$ | Print the two 0-based indices separated by a single space in ascending order (e.g. '0 1'). |
| **2** | **Best Time to Buy and Sell Stock** | Easy | Single-Pass Prefix Minimum Tracking | TCS Digital, Infosys, Cognizant | $O(N)$ | $O(1)$ | Print a single integer representing the maximum profit achievable (or 0 if no profit is possible). |
| **3** | **Contains Duplicate** | Easy | Hash Set Frequency / Early Exit | Infosys DSE, Accenture, Wipro | $O(N)$ | $O(N)$ | Print lowercase 'true' if any value appears at least twice, otherwise print 'false'. |
| **4** | **Majority Element (Boyer-Moore)** | Easy | Boyer-Moore Voting Algorithm | TCS Digital, Infosys SP, Amazon | $O(N)$ | $O(1)$ | Print the majority element integer (which appears > floor(N / 2) times). |
| **5** | **Move Zeroes to End** | Easy | Two Pointers (Read & Write Indices) | TCS, Wipro, Cognizant | $O(N)$ | $O(1)$ | Print the modified array with all zeros shifted to the end, separated by spaces. |
| **6** | **Squares of a Sorted Array** | Easy | Two Pointers from Both Ends | Infosys DSE, Amazon, Adobe | $O(N)$ | $O(N)$ | Print the squares of each number sorted in non-decreasing order, separated by spaces. |
| **7** | **Find Missing Number in Range [0, N]** | Easy | Gauss Arithmetic Sum Formula / Bitwise XOR | TCS Ninja/Digital, Infosys, Accenture | $O(N)$ | $O(1)$ | Print the single integer missing from the range [0, N]. |
| **8** | **Maximum Subarray Sum (Kadane's Algorithm)** | Medium | Dynamic Programming / Kadane's Local vs Global Max | TCS Prime, Infosys SP, Amazon | $O(N)$ | $O(1)$ | Print a single integer representing the maximum contiguous subarray sum. |
| **9** | **Sort Colors (Dutch National Flag)** | Medium | 3-Way Partitioning (Low, Mid, High Pointers) | Amazon, Microsoft, TCS Digital | $O(N)$ | $O(1)$ | Print the sorted array elements separated by spaces. |
| **10** | **Product of Array Except Self** | Medium | Prefix and Suffix Accumulator Arrays | Amazon, Microsoft, Infosys SP | $O(N)$ | $O(1) auxiliary$ | Print the result array elements separated by spaces where answer[i] is product of all elements except nums[i]. |
| **11** | **Rotate Array by K Steps** | Medium | 3-Step Array Reversal Algorithm | TCS Digital, Cognizant GenC Next, Amazon | $O(N)$ | $O(1)$ | Print the array after rotating K steps to the right, separated by spaces. |
| **12** | **3Sum (Count of Unique Zero-Sum Triplets)** | Medium | Sorting + Two Pointers with Deduplication | Infosys SP, Amazon, Flipkart | $O(N^2)$ | $O(1) auxiliary$ | Print the total count of unique triplets [a, b, c] such that a + b + c == 0. |
| **13** | **Subarray Sum Equals K** | Medium | Prefix Sum Frequency Hash Map | Amazon, Microsoft, Infosys SP | $O(N)$ | $O(N)$ | Print the total number of continuous subarrays whose sum equals K. |
| **14** | **Next Permutation** | Medium | Lexicographical Permutation Generation | Infosys SP, Amazon, Google | $O(N)$ | $O(1)$ | Print the next lexicographically greater permutation separated by spaces (or sorted ascending if none exists). |
| **15** | **Merge Overlapping Intervals** | Medium | Interval Sorting & Greedy Merging | Amazon, Microsoft, Infosys SP | $O(N log N)$ | $O(N)$ | First line: integer M (count of merged intervals). Next M lines: merged start and end separated by space. |
| **16** | **Spiral Matrix Traversal** | Medium | 2D Matrix Boundary Traversal Simulation | TCS Digital, Infosys, Amazon | $O(M * N)$ | $O(1) auxiliary$ | Print all elements of the matrix in clockwise spiral order separated by a single space. |
| **17** | **Trapping Rain Water** | Hard | Two Pointers with Running Left and Right Maxima | Amazon SDE-1, Microsoft, Flipkart | $O(N)$ | $O(1)$ | Print a single integer representing the total units of rain water trapped. |
| **18** | **First Missing Positive** | Hard | In-Place Cyclic Index Hashing (Bucket Swap) | Amazon, Infosys SP, Google | $O(N)$ | $O(1)$ | Print the smallest positive integer that is not present in the array. |
| **19** | **Largest Rectangle in Histogram** | Hard | Monotonic Increasing Stack | Amazon, Microsoft, Infosys SP | $O(N)$ | $O(N)$ | Print a single integer representing the area of the largest rectangle possible. |
| **20** | **Sliding Window Maximum (Window of size K)** | Hard | Monotonic Decreasing Deque | Amazon, Flipkart, Google | $O(N)$ | $O(K)$ | Print the maximum value for each sliding window of size K separated by spaces. |

---

## Authority Citations & Verification Sources
- **Striver SDE Sheet / A2Z DSA Sheet:** https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2 (Standard curriculum for campus placements (TCS, Infosys, Amazon, Microsoft))
- **NeetCode 150 (Arrays & Hashing):** https://neetcode.io/practice (Algorithmic patterns & optimal time complexity)
- **GeeksforGeeks Topic Archives:** https://www.geeksforgeeks.org/top-50-array-coding-problems-for-interviews/ (Campus placement problem variations & service company online assessments)

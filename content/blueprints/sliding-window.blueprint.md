# Topic 5: Sliding Window — Canonical Placement Blueprint (20 Problems)

> **Difficulty Distribution:** 7 Easy, 9 Medium, 4 Hard  
> **Target Audience:** Engineering Students preparing for Campus Placements (TCS, Infosys, Amazon, Microsoft, Wipro, Cognizant, Accenture)  
> **Curriculum Authorities:** Striver's A2Z SDE Sheet, NeetCode 150, GeeksforGeeks Placement Tracks  

---

## 20-Problem Blueprint Matrix

| # | Title | Diff | Core Pattern | Frequently Asked By | Time | Space | Deterministic Output Format |
|---|---|:---:|---|---|:---:|:---:|---|
| **1** | **Maximum Average Subarray I** | Easy | Fixed Size Window Accumulator | TCS Ninja, Infosys, Wipro | $O(N)$ | $O(1)$ | Print the maximum average value with 5 decimal places (e.g. '12.75000'). |
| **2** | **Defuse the Bomb** | Easy | Circular Fixed Size Window Summation | Amazon, Cognizant, Accenture | $O(N)$ | $O(1)$ | Print the decrypted array separated by spaces. |
| **3** | **Contains Duplicate II** | Easy | Fixed Window Hash Set Eviction | Amazon, TCS Digital, Infosys | $O(N)$ | $O(min(N, K))$ | Print 'true' if there are two distinct indices i and j such that nums[i] == nums[j] and abs(i - j) <= K, else 'false'. |
| **4** | **Substrings of Size Three with Distinct Characters** | Easy | Fixed Window 3-Character Direct Comparison | Cognizant, TCS Ninja, Wipro | $O(N)$ | $O(1)$ | Print the number of good substrings of length three that have no repeated characters. |
| **5** | **Minimum Recolors to Get K Consecutive Black Blocks** | Easy | Fixed Window Running Count of Invalidation Cost | Amazon, Infosys DSE, Accenture | $O(N)$ | $O(1)$ | Print the minimum number of operations needed to get K consecutive black blocks. |
| **6** | **Maximum Sum of Distinct Subarrays With Length K** | Easy | Fixed Window with Frequency Map and Uniqueness Tracking | Amazon, Flipkart, TCS Digital | $O(N)$ | $O(K)$ | Print the maximum subarray sum of all valid subarrays of length K having distinct elements (or 0 if none). |
| **7** | **Find All K-Distant Indices in an Array** | Easy | Expanding Window Interval Coverage | Amazon, Infosys | $O(N)$ | $O(1)$ | Print all k-distant indices sorted in increasing order, separated by spaces. |
| **8** | **Maximum Sum Subarray of Size K** | Medium | Standard Fixed Sliding Window Running Sum | TCS Digital, Infosys, Cognizant | $O(N)$ | $O(1)$ | Print a single integer representing the maximum sum of any contiguous subarray of size K. |
| **9** | **Longest Substring Without Repeating Characters** | Medium | Variable Sliding Window with Last-Seen Index Jumping | Amazon, Microsoft, TCS Prime | $O(N)$ | $O(min(N, Sigma))$ | Print the length of the longest substring without repeating characters. |
| **10** | **Longest Repeating Character Replacement** | Medium | Dynamic Window with Max Frequency Invariant | Amazon, Google, Microsoft | $O(N)$ | $O(26)$ | Print the length of the longest substring containing the same letter after at most K changes. |
| **11** | **Fruit Into Baskets** | Medium | Sliding Window with at most 2 Distinct Keys | Google, Amazon, Infosys DSE | $O(N)$ | $O(1)$ | Print the maximum total number of fruits you can pick in a single continuous subarray. |
| **12** | **Max Consecutive Ones III** | Medium | Variable Sliding Window with Zero Counter Budget | Amazon, Facebook, Microsoft | $O(N)$ | $O(1)$ | Print the maximum number of consecutive 1s in the array if you can flip at most K 0s. |
| **13** | **Permutation in String** | Medium | Fixed Size Sliding Window Frequency Equality Match | Amazon, Microsoft, Flipkart | $O(N)$ | $O(1)$ | Print 'true' if S2 contains a permutation of S1, else 'false'. |
| **14** | **Find All Anagrams in a String** | Medium | Fixed Window Exact Multi-Match Collection | Amazon, Infosys DSE, Adobe | $O(N)$ | $O(1)$ | Print all start indices of P's anagrams in S in ascending order, separated by spaces (or -1 if none). |
| **15** | **Subarray Product Less Than K** | Medium | Dynamic Window Product Contraction and Subarray Counting | Amazon, Microsoft, LinkedIn | $O(N)$ | $O(1)$ | Print the number of contiguous subarrays where the product of all elements is strictly less than K. |
| **16** | **Minimum Size Subarray Sum** | Medium | Dynamic Window with Greedy Left Contraction | Amazon, Infosys SP, Microsoft | $O(N)$ | $O(1)$ | Print the minimal length of a contiguous subarray whose sum is >= target (or 0 if none). |
| **17** | **Minimum Window Substring** | Hard | Variable Window with Frequency Deficit Counter | Amazon, Google, Microsoft | $O(N + M)$ | $O(Sigma)$ | Print the minimum window substring of S that contains every character in T, or empty string if none exists. |
| **18** | **Sliding Window Maximum** | Hard | Monotonic Decreasing Deque over Sliding Window | Amazon, Google, Microsoft | $O(N)$ | $O(K)$ | Print the maximum of each sliding window of size K separated by spaces. |
| **19** | **Subarrays with K Different Integers** | Hard | Dual Sliding Window Difference (atMost(K) - atMost(K - 1)) | Amazon, Google, DE Shaw | $O(N)$ | $O(K)$ | Print the total number of subarrays that have exactly K distinct integers. |
| **20** | **Minimum Window Subsequence** | Hard | Forward Expansion with Backward Squeeze Subsequence Window | Google, Amazon, eBay | $O(N * M)$ | $O(1)$ | Print the shortest substring of S containing T as a subsequence (or empty string if none). |

---

## Authority Citations & Verification Sources
- **Striver SDE Sheet (Sliding Window & Two Pointer):** https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2 (Definitive placement sliding window curriculum)
- **NeetCode 150 (Sliding Window):** https://neetcode.io/practice (Fixed vs variable window invariants and monotonic optimizations)
- **GeeksforGeeks Sliding Window Technique:** https://www.geeksforgeeks.org/window-sliding-technique/ (Campus hiring questions and subarray problem patterns)

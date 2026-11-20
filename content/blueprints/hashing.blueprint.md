# Topic 3: Hashing — Canonical Placement Blueprint (20 Problems)

> **Difficulty Distribution:** 7 Easy, 9 Medium, 4 Hard  
> **Target Audience:** Engineering Students preparing for Campus Placements (TCS, Infosys, Amazon, Microsoft, Wipro, Cognizant, Accenture)  
> **Curriculum Authorities:** Striver's A2Z SDE Sheet, NeetCode 150, GeeksforGeeks Placement Tracks  

---

## 20-Problem Blueprint Matrix

| # | Title | Diff | Core Pattern | Frequently Asked By | Time | Space | Deterministic Output Format |
|---|---|:---:|---|---|:---:|:---:|---|
| **1** | **Two Sum with Hash Map** | Easy | Hash Map Complement Lookup in Single Pass | TCS Ninja, Infosys, Wipro | $O(N)$ | $O(N)$ | Print the two 0-based indices separated by a space in ascending order. |
| **2** | **Contains Duplicate** | Easy | Hash Set Membership Query | TCS, Cognizant, Amazon | $O(N)$ | $O(N)$ | Print 'true' if any value appears at least twice, else 'false'. |
| **3** | **Ransom Note** | Easy | Character Count Frequency Tally | Amazon, Cognizant, Adobe | $O(N + M)$ | $O(1)$ | Print 'true' if ransomNote can be constructed using letters from magazine, else 'false'. |
| **4** | **Intersection of Two Arrays** | Easy | Hash Set Deduplication and Membership Filtering | Infosys, Wipro, TCS Digital | $O(N + M)$ | $O(min(N, M))$ | Print the unique elements present in both arrays sorted in ascending order, separated by spaces (or -1 if empty). |
| **5** | **Unique Number of Occurrences** | Easy | Hash Map Frequencies to Hash Set Uniqueness Verification | Amazon, Apple, Google | $O(N)$ | $O(N)$ | Print 'true' if the number of occurrences of each value in the array is unique, else 'false'. |
| **6** | **Word Pattern** | Easy | Bijective Hash Mapping (Character to Word and Word to Character) | Amazon, Microsoft, Infosys DSE | $O(N)$ | $O(N)$ | Print 'true' if S follows the same bijection pattern, else 'false'. |
| **7** | **Isomorphic Strings** | Easy | Dual Hash Map Position Tracking | TCS Digital, Infosys, Cognizant | $O(N)$ | $O(1)$ | Print 'true' if characters in S can be replaced to get T, else 'false'. |
| **8** | **Subarray Sum Equals K** | Medium | Prefix Sum Frequency Hash Map | Amazon, Microsoft, TCS Prime | $O(N)$ | $O(N)$ | Print a single integer representing the total number of continuous subarrays whose sum equals K. |
| **9** | **Longest Consecutive Sequence** | Medium | Hash Set Streak Head Detection | Amazon, Microsoft, Google | $O(N)$ | $O(N)$ | Print the length of the longest consecutive elements sequence. |
| **10** | **Group Anagrams** | Medium | Hash Map with Canonical Key Classification | Amazon, Infosys SP, Cognizant | $O(N * K log K)$ | $O(N * K)$ | Print the number of distinct anagram groups on line 1, and the sizes of all groups in ascending order on line 2. |
| **11** | **Top K Frequent Elements** | Medium | Hash Map Frequency Counting with Bucket Sort | Amazon, Facebook, Microsoft | $O(N)$ | $O(N)$ | Print the K most frequent elements sorted in ascending order, separated by spaces. |
| **12** | **4Sum** | Medium | Pair Sum Hash Map / Nested Two-Pointer Reduction | Amazon, Microsoft, Adobe | $O(N^3)$ | $O(1)$ | Print the number of unique quadruplets that sum to target. |
| **13** | **Insert Delete GetRandom O(1)** | Medium | Hash Map Index Tracking with Dynamic Array Swap-to-Back | Amazon, Facebook, Uber | $O(1) average per op$ | $O(N)$ | Print the final count of elements stored in the structure, followed by the elements sorted in ascending order. |
| **14** | **Continuous Subarray Sum** | Medium | Prefix Modulo Remainder Hash Map with Index Distance | Facebook, Amazon, Infosys SP | $O(N)$ | $O(min(N, K))$ | Print 'true' if the array has a good subarray of length at least 2 whose sum is a multiple of K, else 'false'. |
| **15** | **Subarrays with K Different Integers** | Medium | Sliding Window with Frequency Map and AtMost(K) Reduction | Amazon, Google, Flipkart | $O(N)$ | $O(K)$ | Print the count of contiguous subarrays that have exactly K distinct integers. |
| **16** | **Find All Anagrams in a String** | Medium | Fixed-Size Sliding Window Character Frequency Comparison | Amazon, Microsoft, TCS Digital | $O(N)$ | $O(1)$ | Print all starting indices of P's anagrams in S in ascending order, separated by spaces (or -1 if none). |
| **17** | **Subarray with Given XOR** | Hard | Prefix XOR Hash Map Frequency Counting | Amazon, Microsoft, Flipkart | $O(N)$ | $O(N)$ | Print the total number of subarrays having bitwise XOR equal to B. |
| **18** | **Max Points on a Line** | Hard | Slope Hash Map with GCD Coprime Fraction Representation | Amazon, Google, LinkedIn | $O(N^2)$ | $O(N)$ | Print the maximum number of points that lie on the same straight line. |
| **19** | **Substring with Concatenation of All Words** | Hard | Multi-Pass Word Frequency Hash Sliding Window | Amazon, Microsoft, Apple | $O(N * wordLen)$ | $O(M * wordLen)$ | Print all starting indices of substring(s) in S that is a concatenation of each word, space-separated in ascending order (or -1 if none). |
| **20** | **Minimum Window Subsequence** | Hard | Hash-Assisted Dynamic Programming Subsequence Search | Google, Amazon, eBay | $O(N * M)$ | $O(N * M)$ | Print the shortest substring of S such that T is a subsequence of this substring (or empty string if none). |

---

## Authority Citations & Verification Sources
- **Striver SDE Sheet (Hashing):** https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2 (Standard hashing questions asked in product & service placement rounds)
- **NeetCode 150 (Arrays & Hashing):** https://neetcode.io/practice (Hash Map / Set foundational and advanced patterns)
- **GeeksforGeeks Hashing Data Structure:** https://www.geeksforgeeks.org/hashing-data-structure/ (Subarray sums, prefix hashing, and collision resolution techniques)

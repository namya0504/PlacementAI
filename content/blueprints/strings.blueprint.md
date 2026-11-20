# Topic 2: Strings — Canonical Placement Blueprint (20 Problems)

> **Difficulty Distribution:** 7 Easy, 9 Medium, 4 Hard  
> **Target Audience:** Engineering Students preparing for Campus Placements (TCS, Infosys, Amazon, Microsoft, Wipro, Cognizant, Accenture)  
> **Curriculum Authorities:** Striver's A2Z SDE Sheet, NeetCode 150, GeeksforGeeks Placement Tracks  

---

## 20-Problem Blueprint Matrix

| # | Title | Diff | Core Pattern | Frequently Asked By | Time | Space | Deterministic Output Format |
|---|---|:---:|---|---|:---:|:---:|---|
| **1** | **Valid Palindrome** | Easy | Two Pointers from Both Ends with Alphanumeric Filtering | TCS Ninja, Infosys, Wipro | $O(N)$ | $O(1)$ | Print 'true' if S is a palindrome after converting to lowercase and removing non-alphanumeric characters, else 'false'. |
| **2** | **Valid Anagram** | Easy | Frequency Counting with Fixed 26-element Array | TCS Digital, Infosys, Capgemini | $O(N)$ | $O(1)$ | Print 'true' if T is an anagram of S, else 'false'. |
| **3** | **Reverse String** | Easy | In-Place Two Pointer Swapping | TCS, Wipro, HCL | $O(N)$ | $O(1)$ | Print the reversed characters separated by a space. |
| **4** | **First Unique Character in a String** | Easy | Two-Pass Frequency Map Tracking | Amazon, Infosys DSE, Accenture | $O(N)$ | $O(1)$ | Print the 0-based index of the first non-repeating character, or -1 if none exists. |
| **5** | **Length of Last Word** | Easy | Reverse Linear Scan Skipping Trailing Whitespace | Cognizant, TCS Digital, Cisco | $O(N)$ | $O(1)$ | Print a single integer representing the length of the last word. |
| **6** | **Longest Common Prefix** | Easy | Horizontal / Vertical Character Scanning | Infosys, Adobe, Cognizant | $O(N * M)$ | $O(1)$ | Print the longest common prefix string, or an empty line if there is no common prefix. |
| **7** | **Is Subsequence** | Easy | Greedy Two Pointers with Ordered Matching | TCS Digital, Infosys, Amazon | $O(N)$ | $O(1)$ | Print 'true' if S is a subsequence of T, else 'false'. |
| **8** | **Longest Substring Without Repeating Characters** | Medium | Sliding Window with Hash Map / Index Jumping | Amazon, Microsoft, TCS Prime | $O(N)$ | $O(min(N, Sigma))$ | Print a single integer representing the length of the longest substring without repeating characters. |
| **9** | **String to Integer (atoi)** | Medium | Finite State Machine / Boundary Overflow Clamp | Microsoft, Amazon, Infosys SP | $O(N)$ | $O(1)$ | Print the parsed 32-bit signed integer value clamped to [-2^31, 2^31 - 1]. |
| **10** | **Group Anagrams** | Medium | Canonical Frequency Representation Hashing | Amazon, Microsoft, Flipkart | $O(N * K log K)$ | $O(N * K)$ | Print the count of anagram groups on the first line, followed by the size of each group sorted in ascending order on the second line. |
| **11** | **Longest Palindromic Substring** | Medium | Expand Around Center (Odd and Even Parity) | Amazon, Microsoft, TCS Digital | $O(N^2)$ | $O(1)$ | Print the longest contiguous palindromic substring (if tie, print the one appearing first). |
| **12** | **Multiply Strings** | Medium | Simulated Column Multiplication into Digit Array | Facebook, Microsoft, Amazon | $O(N * M)$ | $O(N + M)$ | Print the product of num1 and num2 as a string. |
| **13** | **Count and Say** | Medium | Iterative Run-Length Encoding | Amazon, Cognizant, Adobe | $O(2^N)$ | $O(2^N)$ | Print the N-th term of the count-and-say sequence. |
| **14** | **Minimum Remove to Make Valid Parentheses** | Medium | Stack Index Tracking with Two-Pass Character Exclusion | Facebook, Amazon, Bloomberg | $O(N)$ | $O(N)$ | Print any valid string with the minimum number of parentheses removed. |
| **15** | **Repeated DNA Sequences** | Medium | Fixed-Length 10-char Sliding Window with Bitmask / Hash Set | Amazon, LinkedIn, Google | $O(N)$ | $O(N)$ | Print all 10-letter-long sequences that occur more than once, sorted lexicographically and space-separated (or 'NONE' if none). |
| **16** | **Encode and Decode Strings** | Medium | Length-Prefixed Chunk Delimiting | Google, Facebook, Amazon | $O(Total Chars)$ | $O(Total Chars)$ | Print the decoded list of N strings, each on its own line, verifying lossless round-trip. |
| **17** | **Minimum Window Substring** | Hard | Variable Sliding Window with Frequency Deficit Counter | Amazon, Microsoft, Flipkart | $O(N + M)$ | $O(Sigma)$ | Print the minimum window substring of S such that every character in T (including duplicates) is included, or empty string if none exists. |
| **18** | **Palindrome Partitioning II** | Hard | 1D Dynamic Programming with Precomputed Palindrome Table | Amazon, Microsoft, Adobe | $O(N^2)$ | $O(N^2)$ | Print a single integer representing the minimum number of cuts needed for a complete palindromic partitioning. |
| **19** | **Shortest Palindrome** | Hard | KMP Longest Prefix Suffix (LPS) Array | Google, Amazon, Microsoft | $O(N)$ | $O(N)$ | Print the shortest palindrome formed by appending characters in front of S. |
| **20** | **Regular Expression Matching** | Hard | 2D Dynamic Programming with Wildcard Branching ('.' and '*') | Google, Amazon, Facebook | $O(N * M)$ | $O(N * M)$ | Print 'true' if the pattern P matches the entire string S, else 'false'. |

---

## Authority Citations & Verification Sources
- **Striver SDE Sheet (Strings):** https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2 (Campus placement coding round string questions)
- **NeetCode 150 (Strings):** https://neetcode.io/practice (Optimal two-pointer and sliding window string patterns)
- **GeeksforGeeks Top 50 String Problems:** https://www.geeksforgeeks.org/top-50-string-coding-problems-for-interviews/ (Standard service & product company questions)

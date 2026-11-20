# Topic 16: Heap / Priority Queue — Canonical Placement Blueprint (20 Problems)

> **Difficulty Distribution:** 7 Easy, 9 Medium, 4 Hard  
> **Target Audience:** Engineering Students preparing for Campus Placements (TCS, Infosys, Amazon, Microsoft, Wipro, Cognizant, Accenture)  
> **Curriculum Authorities:** Striver's A2Z SDE Sheet, NeetCode 150, GeeksforGeeks Placement Tracks  

---

## 20-Problem Blueprint Matrix

| # | Title | Diff | Core Pattern | Frequently Asked By | Time | Space | Deterministic Output Format |
|---|---|:---:|---|---|:---:|:---:|---|
| **1** | **Kth Largest Element in a Stream** | Easy | Min-Heap of Fixed Size K | Amazon, Google, Infosys DSE | $O(log K) per addition$ | $O(K)$ | Print the K-th largest element after each addition, separated by spaces. |
| **2** | **Last Stone Weight** | Easy | Max-Heap Repeated Two-Element Extraction | Amazon, Cognizant, Infosys | $O(N log N)$ | $O(N)$ | Print the weight of the last remaining stone (or 0 if none remain). |
| **3** | **Relative Ranks** | Easy | Max-Heap Score-to-Index Pairing | Google, Infosys | $O(N log N)$ | $O(N)$ | Print the ranks (Gold Medal, Silver Medal, Bronze Medal, or number) separated by commas. |
| **4** | **Take Gifts From the Richest Pile** | Easy | Max-Heap Greedy Peak Mutation floor(sqrt(x)) | Amazon, TCS Digital | $O(K log N)$ | $O(N)$ | Print the total number of gifts remaining after K seconds. |
| **5** | **Minimum Cost to Connect Sticks** | Easy | Huffman Greedy Pairing with Min-Heap | Amazon, Microsoft, Goldman Sachs | $O(N log N)$ | $O(N)$ | Print the minimum cost to connect all sticks into one. |
| **6** | **Maximum Product of Two Elements in an Array** | Easy | Tracking Two Largest Values via Min-Heap of Size 2 | Amazon, Cognizant, Wipro | $O(N)$ | $O(1)$ | Print the maximum value of (nums[i] - 1) * (nums[j] - 1). |
| **7** | **Seat Reservation Manager** | Easy | Min-Heap of Smallest Available Numbers | Amazon, Bloomberg | $O(log N) per operation$ | $O(N)$ | Print the seat numbers returned by each 'reserve' operation separated by spaces. |
| **8** | **Kth Largest Element in an Array** | Medium | Min-Heap of Size K over Unsorted Array | Amazon, Microsoft, Facebook | $O(N log K)$ | $O(K)$ | Print the Kth largest integer in the array. |
| **9** | **Top K Frequent Elements** | Medium | Min-Heap of Size K Sorted by Frequency | Amazon, Microsoft, Google | $O(N log K)$ | $O(N)$ | Print the K most frequent elements sorted in ascending order, separated by spaces. |
| **10** | **Sort Characters By Frequency** | Medium | Max-Heap Frequency Priority Extraction | Amazon, Bloomberg, Infosys SP | $O(N log(Sigma))$ | $O(Sigma)$ | Print any valid string with characters sorted in decreasing order based on frequency. |
| **11** | **K Closest Points to Origin** | Medium | Max-Heap of Size K by Euclidean Distance | Amazon, Facebook, Microsoft | $O(N log K)$ | $O(K)$ | Print the K closest points, each on a new line with space-separated coordinates. |
| **12** | **Task Scheduler** | Medium | Max-Heap Frequency Priority with Cooldown Queue | Amazon, Facebook, Microsoft | $O(N)$ | $O(26)$ | Print the least number of units of times that the CPU will take to finish all the given tasks. |
| **13** | **Find K Pairs with Smallest Sums** | Medium | Min-Heap of Coordinate Pairs (u[i] + v[j], i, j) | Amazon, Google, Uber | $O(K log K)$ | $O(K)$ | Print K pairs with smallest sums, each pair as two space-separated integers on a new line. |
| **14** | **Reorganize String (No Adjacent Duplicates)** | Medium | Max-Heap Greedy Placement of Most Frequent Characters | Amazon, Google, Microsoft | $O(N log(Sigma))$ | $O(Sigma)$ | Print any valid reorganized string where no adjacent characters are equal, or empty line if impossible. |
| **15** | **Furthest Building You Can Reach** | Medium | Min-Heap of Ladder Climbs vs Brick Budget | Amazon, Google, Microsoft | $O(N log(Ladders))$ | $O(Ladders)$ | Print the furthest building index (0-indexed) you can reach. |
| **16** | **Single-Threaded CPU** | Medium | Min-Heap Priority by Processing Time and Original Index | Google, Amazon, Infosys SP | $O(N log N)$ | $O(N)$ | Print the order in which tasks are processed by their original 0-based index separated by spaces. |
| **17** | **Find Median from Data Stream** | Hard | Dual Balanced Heaps (Max-Heap Lower Half, Min-Heap Upper Half) | Amazon, Google, Microsoft | $O(log N) per insertion, O(1) for median$ | $O(N)$ | Print the running median after each insertion formatted to 1 decimal place, separated by spaces. |
| **18** | **Merge k Sorted Lists (Priority Queue)** | Hard | Min-Heap Active Head Pointer Tracking | Amazon, Microsoft, Google | $O(N log K)$ | $O(K)$ | Print the merged sorted array separated by spaces. |
| **19** | **Minimum Cost to Hire K Workers** | Hard | Sort by Wage/Quality Ratio + Max-Heap of Qualities | Google, Amazon | $O(N log N + N log K)$ | $O(K)$ | Print the least amount of money needed to form a paying group of K workers with 5 decimal places. |
| **20** | **IPO (Maximize Capital)** | Hard | Two Heaps: Min-Heap for Capital Requirements + Max-Heap for Available Profits | Amazon, Microsoft, Google | $O(N log N + K log N)$ | $O(N)$ | Print the final maximized capital. |

---

## Authority Citations & Verification Sources
- **Striver SDE Sheet (Heaps / Priority Queue):** https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2 (Top-K elements, streaming medians, and campus placement heap problems)
- **NeetCode 150 (Heap / Priority Queue):** https://neetcode.io/practice (Min-heap vs Max-heap invariants and interval scheduling)
- **GeeksforGeeks Heap Data Structure:** https://www.geeksforgeeks.org/heap-data-structure/ (Priority queue applications and company interview problems)

# Topic 18: Greedy — Canonical Placement Blueprint (20 Problems)

> **Difficulty Distribution:** 7 Easy, 9 Medium, 4 Hard  
> **Target Audience:** Engineering Students preparing for Campus Placements (TCS, Infosys, Amazon, Microsoft, Wipro, Cognizant, Accenture)  
> **Curriculum Authorities:** Striver's A2Z SDE Sheet, NeetCode 150, GeeksforGeeks Placement Tracks  

---

## 20-Problem Blueprint Matrix

| # | Title | Diff | Core Pattern | Frequently Asked By | Time | Space | Deterministic Output Format |
|---|---|:---:|---|---|:---:|:---:|---|
| **1** | **Assign Cookies** | Easy | Two-Pointer Greedy Matching on Sorted Arrays | TCS Ninja, Infosys, Wipro | $O(N log N + M log M)$ | $O(1)$ | Print the maximum number of children who can be content. |
| **2** | **Maximum Units on a Truck** | Easy | Fractional Knapsack Sorting by Units Descending | Amazon, Infosys DSE | $O(N log N)$ | $O(1)$ | Print the maximum total number of units that can be put on the truck. |
| **3** | **Best Time to Buy and Sell Stock II** | Easy | Greedy Accumulation of All Positive Price Deltas | Amazon, TCS Digital, Infosys | $O(N)$ | $O(1)$ | Print the maximum profit you can achieve. |
| **4** | **Lemonade Change** | Easy | Greedy Bill Prioritization (Give 10 + 5 before three 5s) | Amazon, TCS Digital, Infosys | $O(N)$ | $O(1)$ | Print 'true' if you can provide every customer with correct change, else 'false'. |
| **5** | **Minimum Moves to Equal Array Elements II** | Easy | Median Minimization of L1 Manhattan Distance | Amazon, Adobe, Cognizant | $O(N log N)$ | $O(1)$ | Print the minimum number of moves required to make all array elements equal. |
| **6** | **Array Partition I** | Easy | Pair Adjacent Elements in Sorted Order | Amazon, Wipro, Infosys | $O(N log N)$ | $O(1)$ | Print the maximized sum of min(ai, bi) for all pairs. |
| **7** | **Split a String in Balanced Strings** | Easy | Greedy Zero-Balance Cut Point Detection | TCS Ninja, Infosys, Cognizant | $O(N)$ | $O(1)$ | Print the maximum number of balanced strings you can obtain. |
| **8** | **Jump Game** | Medium | Running Max Reachable Boundary Tracking | Amazon, Microsoft, TCS Prime | $O(N)$ | $O(1)$ | Print 'true' if you can reach the last index, else 'false'. |
| **9** | **Jump Game II** | Medium | BFS Level-by-Level Greedy Window Range | Amazon, Microsoft, Google | $O(N)$ | $O(1)$ | Print the minimum number of jumps to reach the last index. |
| **10** | **Gas Station (Circular Tour)** | Medium | Cumulative Deficit and Candidate Reset | Amazon, Microsoft, Google | $O(N)$ | $O(1)$ | Print the starting gas station's index (0-indexed), or -1 if impossible. |
| **11** | **Task Scheduler (Greedy Math Formula)** | Medium | Idle Slot Formula ((maxFreq - 1) * (n + 1) + maxCount) | Amazon, Facebook, Microsoft | $O(N)$ | $O(1)$ | Print the minimum units of time needed to execute all tasks. |
| **12** | **Hand of Straights** | Medium | Sorted Frequency Map with Greedy Group Extraction | Google, Amazon, Infosys DSE | $O(N log N)$ | $O(N)$ | Print 'true' if hand can be rearranged into groups of groupSize, else 'false'. |
| **13** | **Non-overlapping Intervals** | Medium | Interval Scheduling: Sort by Finish Time | Amazon, Microsoft, Google | $O(N log N)$ | $O(1)$ | Print the minimum number of intervals to remove. |
| **14** | **Minimum Number of Arrows to Burst Balloons** | Medium | Interval Intersection / Squeezing Common End Boundary | Amazon, Microsoft, Facebook | $O(N log N)$ | $O(1)$ | Print the minimum number of arrows that must be shot to burst all balloons. |
| **15** | **Partition Labels** | Medium | Greedy Window Extension to Last Seen Character Index | Amazon, Google, Facebook | $O(N)$ | $O(1)$ | Print the sizes of the partitioned parts separated by spaces. |
| **16** | **Car Fleet** | Medium | Sort by Position Descending with Monotonic Time to Target | Google, Amazon, Infosys SP | $O(N log N)$ | $O(N)$ | Print the number of car fleets that will arrive at the destination. |
| **17** | **Candy** | Hard | Two-Pass Bidirectional Greedy Rating Satisfaction | Amazon, Google, Microsoft | $O(N)$ | $O(N)$ | Print the minimum number of candies you need to distribute. |
| **18** | **Minimum Number of Refueling Stops** | Hard | Greedy Max-Heap of Passed Gas Stations | Amazon, Google, Snapchat | $O(N log N)$ | $O(N)$ | Print the minimum number of refueling stops to reach target, or -1 if impossible. |
| **19** | **Course Schedule III** | Hard | Sort by Deadline + Max-Heap Duration Replacement | Google, Amazon | $O(N log N)$ | $O(N)$ | Print the maximum number of courses you can take. |
| **20** | **Create Maximum Number** | Hard | Greedy Monotonic Stack Selection + Lexicographical Stream Merge | Google, Uber | $O(K * (N + M)^2)$ | $O(K)$ | Print the K digits of the maximum number separated by spaces. |

---

## Authority Citations & Verification Sources
- **Striver SDE Sheet (Greedy Algorithms):** https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2 (Interval scheduling, jump game, candy distribution, and campus placement rounds)
- **NeetCode 150 (Greedy):** https://neetcode.io/practice (Local optimal choice and state reachability proofs)
- **GeeksforGeeks Greedy Algorithms:** https://www.geeksforgeeks.org/greedy-algorithms/ (Standard interview greedy problems and proofs of correctness)

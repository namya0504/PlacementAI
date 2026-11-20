# Topic 13: Queue — Canonical Placement Blueprint (20 Problems)

> **Difficulty Distribution:** 7 Easy, 9 Medium, 4 Hard  
> **Target Audience:** Engineering Students preparing for Campus Placements (TCS, Infosys, Amazon, Microsoft, Wipro, Cognizant, Accenture)  
> **Curriculum Authorities:** Striver's A2Z SDE Sheet, NeetCode 150, GeeksforGeeks Placement Tracks  

---

## 20-Problem Blueprint Matrix

| # | Title | Diff | Core Pattern | Frequently Asked By | Time | Space | Deterministic Output Format |
|---|---|:---:|---|---|:---:|:---:|---|
| **1** | **Implement Stack using Queues** | Easy | Single Queue Push-and-Rotate Invariant | Amazon, Microsoft, TCS Digital | $O(N) push, O(1) pop$ | $O(N)$ | Print the results of all 'pop' and 'top' operations separated by spaces. |
| **2** | **Number of Recent Calls** | Easy | FIFO Sliding Timestamp Window [t - 3000, t] | Amazon, Google, Cognizant | $O(1) amortized per ping$ | $O(3000)$ | Print the count of recent calls after each ping separated by spaces. |
| **3** | **First Unique Character in a String (Queue)** | Easy | Queue FIFO Stream Processing with Frequency Array | Amazon, Infosys DSE, Accenture | $O(N)$ | $O(Sigma)$ | Print the 0-based index of the first non-repeating character (or -1 if none). |
| **4** | **Time Needed to Buy Tickets** | Easy | Round-Robin Queue Simulation / Direct Mathematical Pass | Amazon, Cognizant, Infosys | $O(N)$ | $O(1)$ | Print the total seconds needed for person at index K to finish buying tickets. |
| **5** | **Design Circular Queue** | Easy | Fixed-Size Ring Buffer with Front and Rear Modulo Pointers | Amazon, Microsoft, TCS Digital | $O(1) for all operations$ | $O(Capacity)$ | Print the outputs of Front, Rear, and boolean query operations separated by spaces. |
| **6** | **Design Circular Deque** | Easy | Double-Ended Circular Buffer with Bidirectional Wrap | Google, Amazon | $O(1) for all operations$ | $O(Capacity)$ | Print the results of getFront and getRear queries separated by spaces. |
| **7** | **Reveal Cards In Increasing Order** | Easy | Simulation of Inverse Queue Dealing Process | Amazon, Adobe | $O(N log N)$ | $O(N)$ | Print the ordering of the deck that would reveal the cards in increasing order, separated by spaces. |
| **8** | **Rotting Oranges (Multi-Source BFS)** | Medium | Multi-Source BFS Queue Level-by-Level Minute Propagation | Amazon, Microsoft, TCS Prime | $O(R * C)$ | $O(R * C)$ | Print the minimum number of minutes that must elapse until no cell has a fresh orange (or -1 if impossible). |
| **9** | **01 Matrix (Nearest Zero Distance)** | Medium | Multi-Source BFS Queue Distance Ripple | Amazon, Google, Microsoft | $O(R * C)$ | $O(R * C)$ | Print the distance matrix with R lines of C space-separated integers. |
| **10** | **Sliding Window Maximum (Monotonic Deque)** | Medium | Monotonic Decreasing Deque Index Eviction | Amazon, Google, Microsoft | $O(N)$ | $O(K)$ | Print the maximum value of each sliding window separated by spaces. |
| **11** | **Open the Lock** | Medium | BFS Queue Shortest Path in 4-Wheel Lock State Space | Google, Amazon | $O(10^4 * 4 * 2)$ | $O(10^4)$ | Print the minimum total number of turns required to open the lock (or -1 if impossible). |
| **12** | **Shortest Path in Binary Matrix** | Medium | 8-Directional BFS Queue on Grid | Amazon, Facebook, Microsoft | $O(N^2)$ | $O(N^2)$ | Print the length of the shortest clear path, or -1 if none exists. |
| **13** | **Walls and Gates** | Medium | Multi-Source BFS Queue Filling Distances from Gates | Amazon, Facebook, Google | $O(R * C)$ | $O(R * C)$ | Print the updated grid with each room filled with its distance to nearest gate. |
| **14** | **Course Schedule (Kahn's BFS Queue)** | Medium | Topological Sort using In-Degree Array and Queue | Amazon, Microsoft, TCS Prime | $O(V + E)$ | $O(V + E)$ | Print 'true' if you can finish all courses, else 'false'. |
| **15** | **Pacific Atlantic Water Flow** | Medium | Dual BFS Queues from Ocean Boundaries | Amazon, Google, Facebook | $O(R * C)$ | $O(R * C)$ | Print the count of grid cells from which rain water can flow to both Pacific and Atlantic oceans. |
| **16** | **Number of Islands (Queue BFS)** | Medium | Connected Components Traversal with BFS Queue | Amazon, Microsoft, TCS Digital | $O(R * C)$ | $O(R * C)$ | Print the total number of islands. |
| **17** | **Word Ladder (Shortest Path)** | Hard | Breadth-First Search Queue on Word Transformation Graph | Amazon, Microsoft, Google | $O(M^2 * N)$ | $O(M * N)$ | Print the number of words in the shortest transformation sequence (or 0 if no sequence exists). |
| **18** | **Jump Game IV** | Hard | BFS Queue with Same-Value Index Grouping and Pruning | Google, Amazon, Microsoft | $O(N)$ | $O(N)$ | Print the minimum number of steps to reach the last index from index 0. |
| **19** | **Shortest Path to Get All Keys** | Hard | State Space BFS Queue with Bitmask (row, col, keyMask) | Google, Amazon, Airbnb | $O(R * C * 2^K)$ | $O(R * C * 2^K)$ | Print the lowest number of moves to acquire all keys, or -1 if impossible. |
| **20** | **Minimum Genetic Mutation** | Hard | BFS Queue State Transitions on 8-Character Gene Bank | Google, Twitter | $O(B * 8 * 4)$ | $O(B)$ | Print the minimum number of mutations needed to reach endGene, or -1 if impossible. |

---

## Authority Citations & Verification Sources
- **Striver SDE Sheet (Queue & BFS):** https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2 (FIFO data structure, circular queues, and BFS traversal patterns)
- **NeetCode 150 (Queue & Monotonic Deque):** https://neetcode.io/practice (Monotonic deques and level-by-level state space search)
- **GeeksforGeeks Queue Data Structure:** https://www.geeksforgeeks.org/queue-data-structure/ (Campus placement coding tests and BFS queue applications)

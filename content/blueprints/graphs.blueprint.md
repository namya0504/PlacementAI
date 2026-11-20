# Topic 17: Graphs — Canonical Placement Blueprint (20 Problems)

> **Difficulty Distribution:** 7 Easy, 9 Medium, 4 Hard  
> **Target Audience:** Engineering Students preparing for Campus Placements (TCS, Infosys, Amazon, Microsoft, Wipro, Cognizant, Accenture)  
> **Curriculum Authorities:** Striver's A2Z SDE Sheet, NeetCode 150, GeeksforGeeks Placement Tracks  

---

## 20-Problem Blueprint Matrix

| # | Title | Diff | Core Pattern | Frequently Asked By | Time | Space | Deterministic Output Format |
|---|---|:---:|---|---|:---:|:---:|---|
| **1** | **Find the Town Judge** | Easy | Degree Balance Array (inDegree - outDegree == N - 1) | Amazon, TCS Digital, Cognizant | $O(N + T)$ | $O(N)$ | Print the label of the town judge, or -1 if no judge exists. |
| **2** | **Find Center of Star Graph** | Easy | Edge Intersection O(1) Check | Google, Infosys, Wipro | $O(1)$ | $O(1)$ | Print the center node of the star graph. |
| **3** | **Flood Fill** | Easy | 4-Directional DFS/BFS Connected Component Painting | Amazon, Microsoft, TCS Ninja | $O(R * C)$ | $O(R * C)$ | Print the modified image matrix with R lines of C space-separated integers. |
| **4** | **Island Perimeter** | Easy | Grid Cell Edge Inspection (4 - 2 * sharedEdges) | Amazon, Google, Cognizant | $O(R * C)$ | $O(1)$ | Print the total perimeter of the island. |
| **5** | **Number of Provinces** | Easy | Connected Components Count using DFS or Disjoint Set Union | Amazon, Microsoft, TCS Prime | $O(N^2)$ | $O(N)$ | Print the total number of provinces. |
| **6** | **Path Crossing** | Easy | Coordinate Hash Set Traversal History Tracking | Amazon, Infosys | $O(N)$ | $O(N)$ | Print 'true' if the path crosses itself at any point, else 'false'. |
| **7** | **Clone Undirected Graph (Basic Connectivity)** | Easy | Hash Map Visited Dictionary for Node Duplication | Amazon, Microsoft, TCS Digital | $O(V + E)$ | $O(V)$ | Print the adjacency list of the cloned graph, each line for one node. |
| **8** | **Number of Islands** | Medium | Connected Component Discovery on 2D Grid | Amazon, Microsoft, Google | $O(R * C)$ | $O(R * C)$ | Print the total number of islands. |
| **9** | **Course Schedule (Cycle Detection in Directed Graph)** | Medium | Cycle Detection using 3-Color DFS or Kahn's In-Degree Queue | Amazon, Microsoft, Google | $O(V + E)$ | $O(V + E)$ | Print 'true' if all courses can be finished, else 'false'. |
| **10** | **Course Schedule II (Topological Sort Order)** | Medium | Kahn's In-Degree Algorithm Outputting Valid Sequence | Amazon, Microsoft, Facebook | $O(V + E)$ | $O(V + E)$ | Print the valid course sequence separated by spaces, or 'NONE' if a cycle exists. |
| **11** | **Clone Graph** | Medium | DFS / BFS with Node-to-Clone Hash Map | Amazon, Facebook, Microsoft | $O(V + E)$ | $O(V)$ | Print 'true' if the cloned graph is a verified deep copy with identical structure and values, else 'false'. |
| **12** | **Rotting Oranges** | Medium | Multi-Source BFS Level Counter on Grid | Amazon, Microsoft, Flipkart | $O(R * C)$ | $O(R * C)$ | Print the minimum minutes to rot all fresh oranges, or -1 if impossible. |
| **13** | **Network Delay Time (Dijkstra's Algorithm)** | Medium | Single-Source Shortest Path with Min-Heap Priority Queue | Google, Amazon, Microsoft | $O(E log V)$ | $O(V + E)$ | Print the minimum time for all nodes to receive the signal, or -1 if impossible. |
| **14** | **Number of Operations to Make Network Connected** | Medium | Disjoint Set Union (DSU) Redundant Cable Counting | Amazon, Infosys SP | $O(N + C * alpha(N))$ | $O(N)$ | Print the minimum number of operations to connect all computers (or -1 if impossible). |
| **15** | **Is Graph Bipartite?** | Medium | 2-Coloring BFS / DFS Odd-Length Cycle Detection | Amazon, Facebook, Microsoft | $O(V + E)$ | $O(V)$ | Print 'true' if the graph is bipartite, else 'false'. |
| **16** | **Redundant Connection (Cycle Edge in Tree)** | Medium | Disjoint Set Union with Path Compression and Union by Rank | Amazon, Google, Infosys DSE | $O(N * alpha(N))$ | $O(N)$ | Print the redundant edge u v that occurs last in the input. |
| **17** | **Alien Dictionary** | Hard | Topological Sort on Character Dependency Graph | Amazon, Microsoft, Google | $O(Total Characters + V + E)$ | $O(V + E)$ | Print a string of unique letters sorted in alien lexicographical order (or empty string if order is invalid). |
| **18** | **Word Ladder II (All Shortest Paths)** | Hard | BFS Shortest Distance Level Map + Backtracking DFS Path Reconstruction | Amazon, Google, Microsoft | $O(M^2 * N + Paths)$ | $O(M * N)$ | Print the total count of shortest transformation sequences. |
| **19** | **Critical Connections in a Network (Tarjan's Bridges)** | Hard | Tarjan's Algorithm with Discovery Time and Lowest Reachable Time (low[v] > tin[u]) | Amazon, Google, Microsoft | $O(V + E)$ | $O(V + E)$ | Print the total count of critical connections on line 1, and each critical edge on a new line. |
| **20** | **Cheapest Flights Within K Stops** | Hard | Modified Bellman-Ford / BFS Queue Bounded by K Stops | Amazon, Google, Airbnb | $O(K * E)$ | $O(N)$ | Print the cheapest price from src to dst with at most K stops (or -1 if none). |

---

## Authority Citations & Verification Sources
- **Striver SDE Sheet (Graph Series):** https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2 (Topological sort, Dijkstra, DSU, Tarjan's, and campus placement graph problems)
- **NeetCode 150 (Graphs & Advanced Graphs):** https://neetcode.io/practice (Grid BFS/DFS, cycle detection, and shortest paths)
- **GeeksforGeeks Graph Data Structure:** https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/ (Disjoint Set Union, Minimum Spanning Trees, and Bridges)

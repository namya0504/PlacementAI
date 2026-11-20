# Topic 14: Trees — Canonical Placement Blueprint (20 Problems)

> **Difficulty Distribution:** 7 Easy, 9 Medium, 4 Hard  
> **Target Audience:** Engineering Students preparing for Campus Placements (TCS, Infosys, Amazon, Microsoft, Wipro, Cognizant, Accenture)  
> **Curriculum Authorities:** Striver's A2Z SDE Sheet, NeetCode 150, GeeksforGeeks Placement Tracks  

---

## 20-Problem Blueprint Matrix

| # | Title | Diff | Core Pattern | Frequently Asked By | Time | Space | Deterministic Output Format |
|---|---|:---:|---|---|:---:|:---:|---|
| **1** | **Maximum Depth of Binary Tree** | Easy | Postorder Recursive Height Calculation 1 + max(left, right) | TCS Ninja, Infosys, Wipro | $O(N)$ | $O(H)$ | Print a single integer representing the maximum depth of the binary tree. |
| **2** | **Same Tree** | Easy | Simultaneous Preorder Structural and Value Equivalence Check | Amazon, Microsoft, TCS Digital | $O(min(N, M))$ | $O(min(H1, H2))$ | Print 'true' if the two trees are structurally identical and have the same node values, else 'false'. |
| **3** | **Invert Binary Tree** | Easy | Recursive Left-Right Subtree Swapping | Google, Amazon, Microsoft | $O(N)$ | $O(H)$ | Print the level-order traversal of the inverted tree separated by spaces. |
| **4** | **Symmetric Tree** | Easy | Mirror Image Dual-Subtree Comparison (t1.left == t2.right) | Amazon, Microsoft, TCS Digital | $O(N)$ | $O(H)$ | Print 'true' if the tree is symmetric around its center, else 'false'. |
| **5** | **Diameter of Binary Tree** | Easy | Global Diameter Update at Subtree Apex (leftHeight + rightHeight) | Amazon, Microsoft, Facebook | $O(N)$ | $O(H)$ | Print the length of the diameter of the tree (number of edges on the longest path between any two nodes). |
| **6** | **Balanced Binary Tree** | Easy | Bottom-Up Height Checking with -1 Unbalance Propagation | Amazon, Microsoft, Infosys DSE | $O(N)$ | $O(H)$ | Print 'true' if the binary tree is height-balanced, else 'false'. |
| **7** | **Subtree of Another Tree** | Easy | Recursive Root Traversal with Exact Tree Comparison | Amazon, Facebook, Cognizant | $O(N * M)$ | $O(H)$ | Print 'true' if there is a subtree of root with the same structure and node values as subRoot, else 'false'. |
| **8** | **Binary Tree Level Order Traversal** | Medium | BFS Queue with Batch Level Sizing (queue.length loop) | Amazon, Microsoft, TCS Digital | $O(N)$ | $O(W) where W is max tree width$ | Print each level on a new line with space-separated values. |
| **9** | **Binary Tree Zigzag Level Order Traversal** | Medium | Alternating Left-to-Right and Right-to-Left Level Reversal | Amazon, Microsoft, TCS Prime | $O(N)$ | $O(N)$ | Print each zigzag level on a new line with space-separated values. |
| **10** | **Lowest Common Ancestor of a Binary Tree** | Medium | DFS Postorder Node Bubble-Up (left && right ? root : left || right) | Amazon, Microsoft, Facebook | $O(N)$ | $O(H)$ | Print the value of the lowest common ancestor node. |
| **11** | **Binary Tree Right Side View** | Medium | Reverse Preorder (Root, Right, Left) with Depth Tracking | Amazon, Facebook, Microsoft | $O(N)$ | $O(H)$ | Print the values of the nodes you can see ordered from top to bottom, separated by spaces. |
| **12** | **Count Complete Tree Nodes** | Medium | O(log^2 N) Subtree Depth Comparison on Complete Binary Tree | Google, Amazon, Infosys DSE | $O(log^2 N)$ | $O(log N)$ | Print the total number of nodes in the tree. |
| **13** | **Construct Binary Tree from Preorder and Inorder Traversal** | Medium | Inorder Hash Map Index Lookup with Boundary Slicing | Amazon, Microsoft, Flipkart | $O(N)$ | $O(N)$ | Print the postorder traversal of the reconstructed tree separated by spaces. |
| **14** | **Flatten Binary Tree to Linked List** | Medium | Morris Traversal Threading / Reverse Postorder Reconnection | Amazon, Microsoft, Adobe | $O(N)$ | $O(1) auxiliary$ | Print the values along the flattened right-child linked list separated by spaces. |
| **15** | **Path Sum III** | Medium | Prefix Sum Hash Map along Tree Branch | Amazon, Microsoft, Google | $O(N)$ | $O(H)$ | Print the total number of paths where the sum of values equals targetSum. |
| **16** | **All Nodes Distance K in Binary Tree** | Medium | Parent Pointer Mapping + BFS Radial Expansion from Target | Amazon, Facebook, Microsoft | $O(N)$ | $O(N)$ | Print all node values at distance K sorted in ascending order, separated by spaces (or -1 if none). |
| **17** | **Binary Tree Maximum Path Sum** | Hard | Branch Gain max(0, val) + Apex Path Sum Update | Amazon, Microsoft, Google | $O(N)$ | $O(H)$ | Print the maximum path sum of any non-empty path. |
| **18** | **Serialize and Deserialize Binary Tree** | Hard | Preorder Traversal with Sentinel Null Tokens ('#') | Amazon, Microsoft, Google | $O(N)$ | $O(N)$ | Print the reconstructed tree level-order values separated by spaces, verifying 100% roundtrip fidelity. |
| **19** | **Binary Tree Cameras** | Hard | Greedy Postorder State Return (0: Uncovered, 1: Has Camera, 2: Covered) | Google, Amazon | $O(N)$ | $O(H)$ | Print the minimum number of cameras needed to monitor all nodes of the tree. |
| **20** | **Vertical Order Traversal of a Binary Tree** | Hard | Coordinate Mapping (col, row, val) with Multi-Level Sorting | Amazon, Microsoft, Flipkart | $O(N log N)$ | $O(N)$ | Print each vertical column on a new line with space-separated values. |

---

## Authority Citations & Verification Sources
- **Striver SDE Sheet (Binary Trees):** https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2 (Complete tree traversals, views, diameters, and placement questions)
- **NeetCode 150 (Trees):** https://neetcode.io/practice (DFS, BFS, LCA, and tree reconstruction patterns)
- **GeeksforGeeks Binary Tree Library:** https://www.geeksforgeeks.org/binary-tree-data-structure/ (Campus placement coding round tree problems)

# Topic 15: Binary Search Tree — Canonical Placement Blueprint (20 Problems)

> **Difficulty Distribution:** 7 Easy, 9 Medium, 4 Hard  
> **Target Audience:** Engineering Students preparing for Campus Placements (TCS, Infosys, Amazon, Microsoft, Wipro, Cognizant, Accenture)  
> **Curriculum Authorities:** Striver's A2Z SDE Sheet, NeetCode 150, GeeksforGeeks Placement Tracks  

---

## 20-Problem Blueprint Matrix

| # | Title | Diff | Core Pattern | Frequently Asked By | Time | Space | Deterministic Output Format |
|---|---|:---:|---|---|:---:|:---:|---|
| **1** | **Search in a Binary Search Tree** | Easy | Guided Subtree Descent (val < root.val ? left : right) | TCS Ninja, Infosys, Wipro | $O(H)$ | $O(H)$ | Print the level-order traversal of the subtree rooted at target val, or 'null' if not found. |
| **2** | **Range Sum of BST** | Easy | Pruned Inorder Traversal using Range Bounds [low, high] | Amazon, Facebook, Infosys DSE | $O(N) worst, O(K) where K is nodes in range$ | $O(H)$ | Print the sum of values of all nodes with a value in the inclusive range [low, high]. |
| **3** | **Minimum Absolute Difference in BST** | Easy | Inorder Traversal with Predecessor Difference Tracking | Google, Amazon, Cognizant | $O(N)$ | $O(H)$ | Print the minimum absolute difference between values of any two different nodes. |
| **4** | **Lowest Common Ancestor of a BST** | Easy | Split Point Detection in O(H) without Subtree Scans | Amazon, Microsoft, TCS Digital | $O(H)$ | $O(1) iterative$ | Print the value of the lowest common ancestor node. |
| **5** | **Convert Sorted Array to Binary Search Tree** | Easy | Divide-and-Conquer Midpoint as Balanced Subtree Root | Amazon, Microsoft, Infosys DSE | $O(N)$ | $O(log N)$ | Print the preorder traversal of the balanced BST separated by spaces. |
| **6** | **Two Sum IV - Input is a BST** | Easy | Inorder Dual Pointer / Hash Set Complement Lookup | Amazon, Facebook, Cognizant | $O(N)$ | $O(N) or O(H)$ | Print 'true' if there exist two elements in the BST whose sum equals K, else 'false'. |
| **7** | **Inorder Successor in BST** | Easy | Guided Descent with Candidate Successor Tracking | Amazon, Microsoft, TCS Digital | $O(H)$ | $O(1) iterative$ | Print the value of the inorder successor node, or -1 if none exists. |
| **8** | **Validate Binary Search Tree** | Medium | Range Bounds Validation (minVal < node.val < maxVal) | Amazon, Microsoft, Facebook | $O(N)$ | $O(H)$ | Print 'true' if the tree is a valid BST, else 'false'. |
| **9** | **Kth Smallest Element in a BST** | Medium | Inorder Traversal with Counter Early Termination | Amazon, Microsoft, Google | $O(H + K)$ | $O(H)$ | Print the value of the Kth smallest element. |
| **10** | **Insert into a Binary Search Tree** | Medium | Iterative Descent to Null Child Insertion | Amazon, Microsoft, Cognizant | $O(H)$ | $O(1) iterative$ | Print the level-order traversal of the updated BST separated by spaces. |
| **11** | **Delete Node in a BST** | Medium | Three-Case Pointer Reconnection (Inorder Successor Replacement) | Amazon, Microsoft, Adobe | $O(H)$ | $O(H)$ | Print the level-order traversal of the modified BST separated by spaces. |
| **12** | **Binary Search Tree Iterator** | Medium | Controlled Monotonic Stack for Amortized O(1) Inorder Next | Facebook, Amazon, Microsoft | $O(1) amortized per next()$ | $O(H)$ | Print all values emitted by repeated calls to next() separated by spaces. |
| **13** | **Construct BST from Preorder Traversal** | Medium | Recursive Upper Bound Validation in O(N) | Amazon, Microsoft, Infosys SP | $O(N)$ | $O(H)$ | Print the postorder traversal of the constructed BST separated by spaces. |
| **14** | **Recover Binary Search Tree** | Medium | Inorder Discontinuity Detection of Swapped Nodes | Amazon, Microsoft, Google | $O(N)$ | $O(1) with Morris or O(H) with stack$ | Print the values of the two swapped nodes sorted in ascending order. |
| **15** | **Trim a Binary Search Tree** | Medium | Recursive Boundary Trimming [low, high] | Amazon, Facebook | $O(N)$ | $O(H)$ | Print the level-order traversal of the trimmed BST separated by spaces. |
| **16** | **Unique Binary Search Trees (Catalan Numbers)** | Medium | Dynamic Programming Decomposition over Subtree Roots | Amazon, Microsoft, Infosys DSE | $O(N^2)$ | $O(N)$ | Print the number of structurally unique BSTs that store values 1 to N. |
| **17** | **Maximum Sum BST in Binary Tree** | Hard | Postorder Tuple Return (isBST, minVal, maxVal, sumVal) | Amazon, Microsoft, Google | $O(N)$ | $O(H)$ | Print the maximum sum of all keys of any sub-tree which is also a Binary Search Tree. |
| **18** | **Serialize and Deserialize BST** | Hard | Preorder-Only Serialization Exploiting BST Order Bounds | Amazon, Microsoft, Uber | $O(N)$ | $O(N)$ | Print the reconstructed BST level-order traversal separated by spaces. |
| **19** | **Unique Binary Search Trees II (Generate All Trees)** | Hard | Recursive Tree Construction for Every Root and Subtree Pair | Google, Amazon | $O(Catalan(N))$ | $O(Catalan(N))$ | Print the total count of distinct trees generated. |
| **20** | **Merge Two BSTs in O(M + N) Time and O(H1 + H2) Space** | Hard | Iterative Dual-Stack Inorder Stream Merging | Amazon, Microsoft, Google | $O(M + N)$ | $O(H1 + H2)$ | Print the merged sorted elements of both BSTs separated by spaces. |

---

## Authority Citations & Verification Sources
- **Striver SDE Sheet (Binary Search Trees):** https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2 (BST ordering properties, Inorder traversals, and placement questions)
- **NeetCode 150 (Trees & BST):** https://neetcode.io/practice (BST invariants, LCA, insertion, and deletion algorithms)
- **GeeksforGeeks Binary Search Tree:** https://www.geeksforgeeks.org/binary-search-tree-data-structure/ (Campus hiring questions and BST optimization techniques)

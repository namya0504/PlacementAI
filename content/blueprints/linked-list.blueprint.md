# Topic 11: Linked List — Canonical Placement Blueprint (20 Problems)

> **Difficulty Distribution:** 7 Easy, 9 Medium, 4 Hard  
> **Target Audience:** Engineering Students preparing for Campus Placements (TCS, Infosys, Amazon, Microsoft, Wipro, Cognizant, Accenture)  
> **Curriculum Authorities:** Striver's A2Z SDE Sheet, NeetCode 150, GeeksforGeeks Placement Tracks  

---

## 20-Problem Blueprint Matrix

| # | Title | Diff | Core Pattern | Frequently Asked By | Time | Space | Deterministic Output Format |
|---|---|:---:|---|---|:---:|:---:|---|
| **1** | **Reverse Linked List** | Easy | Three Pointers Iterative Inversion (prev, curr, next) | TCS Ninja, Infosys, Wipro | $O(N)$ | $O(1)$ | Print the values of the reversed linked list separated by spaces. |
| **2** | **Middle of the Linked List** | Easy | Floyd's Tortoise and Hare (Slow and Fast Pointers) | TCS Digital, Infosys, Cognizant | $O(N)$ | $O(1)$ | Print the values from the middle node to the end of the list, separated by spaces. |
| **3** | **Merge Two Sorted Lists** | Easy | Dummy Sentinel Node with Linear Splicing | Amazon, Microsoft, TCS Digital | $O(N + M)$ | $O(1)$ | Print the merged sorted linked list values separated by spaces. |
| **4** | **Linked List Cycle Detection** | Easy | Floyd's Cycle Finding Algorithm (Slow == Fast Collision) | Amazon, Microsoft, TCS Digital | $O(N)$ | $O(1)$ | Print 'true' if the linked list has a cycle, else 'false'. |
| **5** | **Remove Duplicates from Sorted List** | Easy | Single Pointer Lookahead Skipping (curr.val == curr.next.val) | TCS Ninja, Infosys, Wipro | $O(N)$ | $O(1)$ | Print the distinct values of the linked list separated by spaces. |
| **6** | **Delete Node in a Linked List (Without Head Pointer)** | Easy | Next Node Value Copy Overwrite Trick | Amazon, Microsoft, Adobe | $O(1)$ | $O(1)$ | Print the modified linked list values separated by spaces. |
| **7** | **Palindrome Linked List** | Easy | Find Middle + Reverse Second Half + Compare | Amazon, Microsoft, TCS Digital | $O(N)$ | $O(1)$ | Print 'true' if the list is a palindrome, else 'false'. |
| **8** | **Remove Nth Node From End of List** | Medium | Two Pointers with N-Step Offset Delay | Amazon, Microsoft, TCS Prime | $O(N)$ | $O(1)$ | Print the modified list values separated by spaces. |
| **9** | **Odd Even Linked List** | Medium | Dual Head Pointers Interlacing and Splicing | Amazon, Google, Bloomberg | $O(N)$ | $O(1)$ | Print the reordered linked list values separated by spaces. |
| **10** | **Add Two Numbers Represented by Linked Lists** | Medium | Simulated Column Addition with Running Carry | Amazon, Microsoft, TCS Prime | $O(max(N, M))$ | $O(max(N, M))$ | Print the digits of the sum linked list separated by spaces. |
| **11** | **Copy List with Random Pointer** | Medium | Three-Pass In-Place Interweaving without Hash Map | Amazon, Microsoft, Google | $O(N)$ | $O(1) auxiliary$ | Print the copied list values on line 1, and their random pointer target values on line 2. |
| **12** | **Reorder List** | Medium | Split at Middle + Reverse Suffix + Interleaving Merge | Amazon, Facebook, Microsoft | $O(N)$ | $O(1)$ | Print the reordered list values separated by spaces. |
| **13** | **Rotate List by K Places** | Medium | Circular Ring Formation and Break at (Len - K % Len) | Amazon, Microsoft, Infosys DSE | $O(N)$ | $O(1)$ | Print the rotated list values separated by spaces. |
| **14** | **Intersection of Two Linked Lists** | Medium | Dual Pointer Head Switch to Equalize Traversal Distance | Amazon, Microsoft, TCS Digital | $O(N + M)$ | $O(1)$ | Print the value of the intersecting node, or -1 if the two lists do not intersect. |
| **15** | **Sort List (Merge Sort on Linked List)** | Medium | Divide-and-Conquer with Slow-Fast Halving | Amazon, Facebook, Microsoft | $O(N log N)$ | $O(log N) stack$ | Print the sorted list values separated by spaces. |
| **16** | **Flatten a Multilevel Doubly Linked List** | Medium | DFS Stack Traversal with Child Splice Reconnection | Bloomberg, Amazon, Microsoft | $O(N)$ | $O(Depth)$ | Print the flattened doubly linked list values separated by spaces. |
| **17** | **Reverse Nodes in k-Group** | Hard | Chunked Sub-List Reversal with Boundary Reattachment | Amazon, Microsoft, Google | $O(N)$ | $O(1)$ | Print the modified list values separated by spaces. |
| **18** | **Merge k Sorted Lists** | Hard | Min-Heap Priority Queue / Divide-and-Conquer Pairwise Merge | Amazon, Microsoft, Google | $O(N log K)$ | $O(K)$ | Print the completely merged sorted linked list values separated by spaces. |
| **19** | **LRU Cache (Least Recently Used)** | Hard | Hash Map Combined with Doubly Linked List for O(1) Operations | Amazon, Microsoft, Google | $O(1) for both get and put$ | $O(Capacity)$ | Print the outputs of all 'get' operations separated by spaces (or -1 if not found). |
| **20** | **LFU Cache (Least Frequently Used)** | Hard | Dual Hash Maps with Doubly Linked List per Frequency Tier | Google, Amazon, Microsoft | $O(1) for both get and put$ | $O(Capacity)$ | Print the outputs of all 'get' operations separated by spaces. |

---

## Authority Citations & Verification Sources
- **Striver SDE Sheet (Linked List):** https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2 (Complete campus placement linked list curriculum (Singly, Doubly, Fast & Slow))
- **NeetCode 150 (Linked List):** https://neetcode.io/practice (Pointer manipulation, reordering, and caching structures)
- **GeeksforGeeks Linked List Data Structure:** https://www.geeksforgeeks.org/data-structures/linked-list/ (Standard interview questions for service & product engineering roles)

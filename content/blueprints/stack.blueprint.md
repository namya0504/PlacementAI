# Topic 12: Stack — Canonical Placement Blueprint (20 Problems)

> **Difficulty Distribution:** 7 Easy, 9 Medium, 4 Hard  
> **Target Audience:** Engineering Students preparing for Campus Placements (TCS, Infosys, Amazon, Microsoft, Wipro, Cognizant, Accenture)  
> **Curriculum Authorities:** Striver's A2Z SDE Sheet, NeetCode 150, GeeksforGeeks Placement Tracks  

---

## 20-Problem Blueprint Matrix

| # | Title | Diff | Core Pattern | Frequently Asked By | Time | Space | Deterministic Output Format |
|---|---|:---:|---|---|:---:|:---:|---|
| **1** | **Valid Parentheses** | Easy | LIFO Bracket Matching with Hash Map | TCS Ninja, Infosys, Wipro | $O(N)$ | $O(N)$ | Print 'true' if the input string is valid, else 'false'. |
| **2** | **Implement Queue using Stacks** | Easy | Amortized O(1) Two-Stack Transfer (inStack, outStack) | Amazon, Microsoft, TCS Digital | $O(1) amortized$ | $O(N)$ | Print the results of all 'pop' and 'peek' operations separated by spaces. |
| **3** | **Min Stack (O(1) Auxiliary Minimum)** | Easy | Pair Storing / Auxiliary Min Tracking | Amazon, Microsoft, Flipkart | $O(1) for all operations$ | $O(N)$ | Print the results of all 'top' and 'getMin' operations separated by spaces. |
| **4** | **Baseball Game** | Easy | Stack Evaluation of Cumulative History ('+', 'D', 'C') | Amazon, Cognizant, Infosys | $O(N)$ | $O(N)$ | Print the sum of all scores present on the stack after applying all operations. |
| **5** | **Backspace String Compare (Stack)** | Easy | Stack Character Simulation with '#' Cancellation | Google, Amazon, Infosys | $O(N + M)$ | $O(N + M)$ | Print 'true' if the resulting stacks are identical, else 'false'. |
| **6** | **Remove All Adjacent Duplicates In String** | Easy | Stack Peeking and Adjacent Pair Cancellation | Amazon, Facebook, Infosys DSE | $O(N)$ | $O(N)$ | Print the final string after all adjacent duplicate removals. |
| **7** | **Next Greater Element I** | Easy | Monotonic Decreasing Stack with Hash Map Lookup | Amazon, TCS Digital, Infosys | $O(N + M)$ | $O(M)$ | Print the next greater element for each item in nums1, separated by spaces (or -1 if none). |
| **8** | **Next Greater Element II (Circular Array)** | Medium | Monotonic Stack over Virtual Doubled Array (2N Pass with Modulo) | Amazon, Microsoft, TCS Prime | $O(N)$ | $O(N)$ | Print the next greater circular element for each position, separated by spaces. |
| **9** | **Daily Temperatures** | Medium | Monotonic Decreasing Stack Storing Indices | Amazon, Microsoft, Google | $O(N)$ | $O(N)$ | Print the number of days you have to wait for a warmer temperature for each day, separated by spaces. |
| **10** | **Evaluate Reverse Polish Notation** | Medium | Postfix Expression Evaluation with Operand Stack | Amazon, Microsoft, TCS Digital | $O(N)$ | $O(N)$ | Print the evaluated integer result (truncating toward zero). |
| **11** | **Online Stock Span** | Medium | Monotonic Stack Accumulating Consecutive Days | Amazon, Flipkart, Infosys DSE | $O(1) amortized per day$ | $O(N)$ | Print the span of each day's stock price separated by spaces. |
| **12** | **Simplify Path (Unix Directory Canonicalization)** | Medium | Path Component Stack with '.' and '..' Evaluation | Facebook, Amazon, Microsoft | $O(N)$ | $O(N)$ | Print the simplified canonical path. |
| **13** | **Asteroid Collision** | Medium | Stack Collision Simulation with Directional Parity | Amazon, Google, Microsoft | $O(N)$ | $O(N)$ | Print the state of the asteroids after all collisions separated by spaces (or empty line if none remain). |
| **14** | **Decode String** | Medium | Nested Bracket Decoding with Dual Stacks (Counts and Strings) | Google, Amazon, Cisco | $O(Output Length)$ | $O(Output Length)$ | Print the fully decoded string. |
| **15** | **132 Pattern** | Medium | Monotonic Stack Scanning Right-to-Left Tracking '2' Candidate | Amazon, Microsoft, Google | $O(N)$ | $O(N)$ | Print 'true' if there is a 132 pattern in the array, else 'false'. |
| **16** | **Minimum Add to Make Parentheses Valid** | Medium | Stack Cancellation / Balance Counter | Facebook, Amazon, Infosys DSE | $O(N)$ | $O(1)$ | Print the minimum number of parentheses that must be added. |
| **17** | **Largest Rectangle in Histogram** | Hard | Monotonic Increasing Stack for Width Calculation | Amazon, Microsoft, Google | $O(N)$ | $O(N)$ | Print the area of the largest rectangle in the histogram. |
| **18** | **Maximal Rectangle (2D Binary Matrix)** | Hard | Row-by-Row Histogram Conversion and Monotonic Stack | Amazon, Google, Microsoft | $O(R * C)$ | $O(C)$ | Print the area of the largest rectangle containing only 1s. |
| **19** | **Trapping Rain Water (Monotonic Stack)** | Hard | Monotonic Decreasing Stack Bounded Basin Accumulation | Amazon, Microsoft, Bloomberg | $O(N)$ | $O(N)$ | Print the total units of trapped rain water. |
| **20** | **Basic Calculator (Parentheses and Plus/Minus)** | Hard | Operator and Sign Stack with Parentheses Context Pushing | Google, Amazon, Facebook | $O(N)$ | $O(N)$ | Print the evaluated integer result. |

---

## Authority Citations & Verification Sources
- **Striver SDE Sheet (Stack and Queue):** https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2 (Monotonic stack patterns, next greater element, and histogram problems)
- **NeetCode 150 (Stack):** https://neetcode.io/practice (LIFO state preservation and monotonic bounds)
- **GeeksforGeeks Stack Data Structure:** https://www.geeksforgeeks.org/stack-data-structure/ (Expression evaluation and interview questions)

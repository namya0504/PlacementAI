# Topic 21: Math — Canonical Placement Blueprint (20 Problems)

> **Difficulty Distribution:** 7 Easy, 9 Medium, 4 Hard  
> **Target Audience:** Engineering Students preparing for Campus Placements (TCS, Infosys, Amazon, Microsoft, Wipro, Cognizant, Accenture)  
> **Curriculum Authorities:** Striver's A2Z SDE Sheet, NeetCode 150, GeeksforGeeks Placement Tracks  

---

## 20-Problem Blueprint Matrix

| # | Title | Diff | Core Pattern | Frequently Asked By | Time | Space | Deterministic Output Format |
|---|---|:---:|---|---|:---:|:---:|---|
| **1** | **Palindrome Number** | Easy | Half-Integer Reversal (rev == x || rev / 10 == x) | TCS Ninja, Infosys, Wipro | $O(log10 X)$ | $O(1)$ | Print 'true' if X is a palindrome integer, else 'false'. |
| **2** | **Roman to Integer** | Easy | Subtractive Notation Lookahead (val[i] < val[i+1] ? -val[i] : val[i]) | Amazon, Microsoft, TCS Digital | $O(N)$ | $O(1)$ | Print the corresponding integer value. |
| **3** | **Power of Three** | Easy | Maximum Power of Three Divisibility Check (3^19 % N == 0) | Google, Infosys, Cognizant | $O(1)$ | $O(1)$ | Print 'true' if N is a power of three, else 'false'. |
| **4** | **Excel Sheet Column Title** | Easy | Base-26 Number Conversion with 1-Based Decrement | Microsoft, Amazon, Infosys DSE | $O(log26 N)$ | $O(1)$ | Print its corresponding column title as it appears in an Excel sheet. |
| **5** | **Add Digits (Digital Root)** | Easy | Congruence Formula for Digital Root (1 + (N - 1) % 9) | Adobe, Cognizant, TCS Ninja | $O(1)$ | $O(1)$ | Print the digital root single-digit integer. |
| **6** | **Count Primes (Sieve of Eratosthenes)** | Easy | Sieve of Eratosthenes Boolean Marking Array | Amazon, Microsoft, TCS Digital | $O(N log(log N))$ | $O(N)$ | Print the number of prime numbers strictly less than N. |
| **7** | **Happy Number** | Easy | Floyd's Cycle Detection on Sum of Squared Digits | Amazon, Google, Cognizant | $O(log N)$ | $O(1)$ | Print 'true' if N is a happy number, else 'false'. |
| **8** | **Pow(x, n) (Binary Exponentiation)** | Medium | Iterative / Recursive Exponent Halving in O(log N) | Amazon, Facebook, Microsoft | $O(log N)$ | $O(1)$ | Print X raised to power N formatted to 5 decimal places. |
| **9** | **Sqrt(x) with Integer Truncation** | Medium | Newton-Raphson Method / Binary Search Midpoint Clamp | Amazon, Microsoft, Bloomberg | $O(log X)$ | $O(1)$ | Print the integer square root of X. |
| **10** | **Integer to Roman** | Medium | Greedy Descending Lookup Table Subtraction | Amazon, Microsoft, Adobe | $O(1) bounded$ | $O(1)$ | Print its Roman numeral representation. |
| **11** | **Greatest Common Divisor of Strings** | Medium | Euclidean GCD on String Lengths with Concatenation Equivalence | Amazon, Google, Microsoft | $O(N + M)$ | $O(N + M)$ | Print the largest string X such that X divides both str1 and str2 (or empty string if none). |
| **12** | **Angle Between Hands of a Clock** | Medium | Continuous Degree Motion (Hour = 30*H + 0.5*M, Minute = 6*M) | Amazon, Microsoft, TCS Digital | $O(1)$ | $O(1)$ | Print the smaller angle between the hour and the minute hand formatted to 5 decimal places. |
| **13** | **Factorial Trailing Zeroes** | Medium | Legendre's Formula (Counting Prime Factor 5 in N!) | Amazon, Microsoft, TCS Prime | $O(log5 N)$ | $O(1)$ | Print the number of trailing zeroes in N!. |
| **14** | **Multiply Strings (Arbitrary Precision Arithmetic)** | Medium | Simulated Digit Column Multiplication Array | Facebook, Microsoft, Amazon | $O(N * M)$ | $O(N + M)$ | Print the product of num1 and num2 as a string. |
| **15** | **String to Integer (atoi)** | Medium | Deterministic State Parsing with Signed 32-Bit Overflow Clamping | Microsoft, Amazon, Infosys SP | $O(N)$ | $O(1)$ | Print the parsed 32-bit signed integer value. |
| **16** | **Reconstruct Original Digits from English** | Medium | Unique Character Frequency Deduction Order | Google, Amazon | $O(N)$ | $O(1)$ | Print the digits in ascending order as a single string. |
| **17** | **Max Points on a Line** | Hard | Coprime Fraction Slope Representation with GCD Reduction | Amazon, Google, LinkedIn | $O(N^2)$ | $O(N)$ | Print the maximum number of points that lie on the same straight line. |
| **18** | **Basic Calculator (Parentheses and Operator Stack)** | Hard | Sign and Result Accumulator with Context Stack | Google, Facebook, Amazon | $O(N)$ | $O(N)$ | Print the evaluated integer result. |
| **19** | **Integer to English Words** | Hard | Recursive 3-Digit Chunking with Power Magnitudes (Billion, Million, Thousand) | Amazon, Facebook, Microsoft | $O(log10 N)$ | $O(1)$ | Print the English words representation of the number. |
| **20** | **Fraction to Recurring Decimal** | Hard | Simulated Long Division with Remainder History Hash Map | Google, Amazon, Microsoft | $O(Denominator)$ | $O(Denominator)$ | Print the fraction in string format with recurring parts enclosed in parentheses. |

---

## Authority Citations & Verification Sources
- **Striver SDE Sheet (Basic & Advanced Maths):** https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2 (Number theory, Euclidean GCD, Sieve, and campus placement math)
- **NeetCode 150 (Math & Geometry):** https://neetcode.io/practice (Fast exponentiation, matrix geometry, and arbitrary precision)
- **GeeksforGeeks Mathematical Algorithms:** https://www.geeksforgeeks.org/mathematical-algorithms/ (Standard service and product company aptitude and coding rounds)

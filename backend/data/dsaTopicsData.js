/**
 * PlacementAI — 21 Standard DSA Campus Placement Topics in Strict Learning Order
 */

export const DSA_TOPICS = [
  {
    topicId: 'arrays',
    title: 'Arrays',
    order: 1,
    problemCount: 15,
    concept: {
      what: 'An Array is a contiguous linear data structure that stores elements of the same type at fixed memory offsets. It offers O(1) random access via zero-based index arithmetic.',
      whenToUse: 'Use when you need fast index-based lookups, cache-friendly iteration, in-place traversals, frequency counters, or prefix aggregations.',
      howItWorks: 'Direct index indexing `arr[i]` computes memory address as `base_address + i * element_size`. Inserting or deleting at the beginning/middle requires shifting elements in O(N).',
      dryRun: 'Example: In-place reversal of [1, 2, 3, 4, 5]. Pointers L=0, R=4. Swap arr[0] & arr[4] -> [5, 2, 3, 4, 1]. L=1, R=3. Swap arr[1] & arr[3] -> [5, 4, 3, 2, 1]. Stop when L >= R.',
      patterns: '1. Two Pointers (Left/Right, Fast/Slow)\n2. Sliding Window (Fixed & Variable size)\n3. Prefix Sum arrays for O(1) range queries\n4. Kadane’s Algorithm for max subarray\n5. Dutch National Flag for 3-way partitioning',
      commonMistakes: '- Index out of bounds errors at boundary offsets (0, n-1, or loop condition `<` vs `<=`).\n- Unintended array copies instead of in-place modifications.\n- Modifying array size while iterating over it.',
      timeComplexity: 'Access: O(1) | Search: O(N) | Insertion/Deletion at end: O(1) amortized | Insertion/Deletion at middle: O(N)',
      spaceComplexity: 'O(N) for storing N elements.'
    },
    codeExamples: {
      python: `# Python Array / List Operations\nnums = [10, 20, 30, 40, 50]\nnums.append(60)          # O(1)\nval = nums[2]            # O(1) access -> 30\nnums.insert(1, 15)       # O(N) insertion\nnums.pop()               # O(1) deletion\nnums.reverse()           # O(N) in-place reverse\nprint("Reversed:", nums)`,
      java: `// Java Array & ArrayList Operations\nimport java.util.*;\npublic class ArrayOps {\n    public static void main(String[] args) {\n        int[] arr = {10, 20, 30, 40, 50};\n        List<Integer> list = new ArrayList<>();\n        for (int x : arr) list.add(x);\n        list.add(60);            // O(1) amortized\n        int val = list.get(2);   // O(1) access\n        Collections.reverse(list); // O(N)\n        System.out.println(list);\n    }\n}`,
      cpp: `// C++ std::vector Operations\n#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    vector<int> nums = {10, 20, 30, 40, 50};\n    nums.push_back(60);          // O(1) amortized\n    int val = nums[2];           // O(1) access\n    nums.insert(nums.begin() + 1, 15); // O(N)\n    reverse(nums.begin(), nums.end()); // O(N)\n    for(int n : nums) cout << n << " ";\n    return 0;\n}`,
      javascript: `// JavaScript Array Operations\nconst nums = [10, 20, 30, 40, 50];\nnums.push(60);           // O(1)\nconst val = nums[2];     // O(1) access\nnums.splice(1, 0, 15);   // O(N) insert at index 1\nnums.reverse();          // O(N) in-place reverse\nconsole.log(nums);`
    }
  },
  {
    topicId: 'strings',
    title: 'Strings',
    order: 2,
    problemCount: 15,
    concept: {
      what: 'A String is a sequence of characters, represented either as immutable objects (Python, Java, JS) or mutable character arrays (C++ `std::string`).',
      whenToUse: 'Use for parsing text, anagram checking, palindrome validation, substring search, subsequence matching, and tokenization.',
      howItWorks: 'Character arithmetic allows mapping characters to 0–25 using `c - "a"` for fast frequency tables without hashing overhead.',
      dryRun: 'Check Palindrome: "racecar". L=0 (\'r\'), R=6 (\'r\') -> match. L=1 (\'a\'), R=5 (\'a\') -> match. L=2 (\'c\'), R=4 (\'c\') -> match. L=3, R=3 -> stop. Result: True.',
      patterns: '1. Frequency map with fixed 26/128-sized array\n2. Two Pointers for palindromes and reversibility\n3. Sliding window for anagrams and longest substrings\n4. KMP / Rabin-Karp for linear-time pattern search',
      commonMistakes: '- String concatenation inside loops causing O(N^2) memory copies in immutable languages (use StringBuilder or array join).\n- Forgetting case sensitivity or non-alphanumeric character cleanup.',
      timeComplexity: 'Length check: O(1) | Character access: O(1) | Substring slice: O(K) | Comparison: O(N)',
      spaceComplexity: 'O(N) character storage.'
    },
    codeExamples: {
      python: `# Python String Frequency & Palindrome\ns = "racecar"\nis_pal = s == s[::-1]\nfreq = {}\nfor ch in s:\n    freq[ch] = freq.get(ch, 0) + 1\nprint("Is Palindrome:", is_pal)\nprint("Frequencies:", freq)`,
      java: `// Java StringBuilder & Frequency Array\npublic class StringOps {\n    public static void main(String[] args) {\n        String s = "racecar";\n        int[] freq = new int[26];\n        for (char c : s.toCharArray()) freq[c - 'a']++;\n        StringBuilder sb = new StringBuilder(s);\n        boolean isPal = s.equals(sb.reverse().toString());\n        System.out.println("Is Palindrome: " + isPal);\n    }\n}`,
      cpp: `// C++ std::string Operations\n#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\nint main() {\n    string s = "racecar";\n    int freq[26] = {0};\n    for(char c : s) freq[c - 'a']++;\n    string rev = s;\n    reverse(rev.begin(), rev.end());\n    cout << (s == rev ? "Palindrome" : "Not Palindrome") << endl;\n    return 0;\n}`,
      javascript: `// JavaScript String Operations\nconst s = "racecar";\nconst freq = {};\nfor (const ch of s) freq[ch] = (freq[ch] || 0) + 1;\nconst isPal = s === s.split('').reverse().join('');\nconsole.log({ isPal, freq });`
    }
  },
  {
    topicId: 'hashing',
    title: 'Hashing',
    order: 3,
    problemCount: 15,
    concept: {
      what: 'Hashing maps arbitrary keys to bucket indices using a hash function, providing average O(1) insertions, deletions, and lookups via HashSets and HashMaps.',
      whenToUse: 'Use whenever you need instantaneous frequency tracking, pair-sum lookup (`target - x`), cycle detection, duplicate elimination, or group-by keys.',
      howItWorks: 'The key is passed through `hash(key) % capacity`. Hash collisions are resolved via Chaining (linked lists/trees) or Open Addressing (linear probing).',
      dryRun: 'Two Sum: target = 9, nums = [2, 7, 11, 15]. Seen={}. i=0: num=2, comp=7 not in seen -> seen[2]=0. i=1: num=7, comp=2 IN seen (idx 0). Solution found: [0, 1].',
      patterns: '1. Seen Hash Set for duplicate detection\n2. Hash Map for complement lookup (Two Sum)\n3. Prefix sum + Hash Map for subarray sums (e.g., sum == k)\n4. Rolling hash for string matching',
      commonMistakes: '- Assuming HashMaps maintain insertion order (use LinkedHashMap or Map where needed).\n- Forgetting that worst-case lookup can degrade to O(N) on adversarial hash collisions.',
      timeComplexity: 'Average: O(1) for Insert/Delete/Lookup | Worst-case: O(N) on severe collisions.',
      spaceComplexity: 'O(N) memory for bucket storage.'
    },
    codeExamples: {
      python: `# Python Dictionary (HashMap) & Set\nseen = set([1, 2, 3])\nseen.add(4)\nval_to_idx = {"apple": 1, "banana": 2}\nif "apple" in val_to_idx:\n    print("Apple index:", val_to_idx["apple"])`,
      java: `// Java HashMap & HashSet\nimport java.util.*;\npublic class HashOps {\n    public static void main(String[] args) {\n        Map<String, Integer> map = new HashMap<>();\n        map.put("apple", 1);\n        Set<Integer> set = new HashSet<>(Arrays.asList(1, 2, 3));\n        System.out.println("Contains apple: " + map.containsKey("apple"));\n    }\n}`,
      cpp: `// C++ unordered_map & unordered_set\n#include <iostream>\n#include <unordered_map>\n#include <unordered_set>\nusing namespace std;\nint main() {\n    unordered_map<string, int> mp;\n    mp["apple"] = 1;\n    unordered_set<int> st = {1, 2, 3};\n    if (mp.find("apple") != mp.end()) cout << "Found apple\\n";\n    return 0;\n}`,
      javascript: `// JavaScript Map & Set\nconst set = new Set([1, 2, 3]);\nconst map = new Map();\nmap.set("apple", 1);\nconsole.log(map.get("apple"), set.has(2));`
    }
  },
  {
    topicId: 'two-pointers',
    title: 'Two Pointers',
    order: 4,
    problemCount: 15,
    concept: {
      what: 'Two Pointers is an algorithmic technique using two indices that iterate through one or two arrays/strings concurrently (towards each other, in the same direction, or fast/slow).',
      whenToUse: 'Ideal for sorted arrays, palindrome checking, in-place partitions, water trapping, 3Sum/4Sum, and linked list cycle detection.',
      howItWorks: 'Instead of nested O(N^2) loops, pointer movement prunes impossible search branches based on monotonic sorted properties.',
      dryRun: 'Sorted Two Sum: nums=[1, 2, 4, 6, 10], target=8. L=0(1), R=4(10)->sum=11 > 8 -> R--. R=3(6): sum=1+6=7 < 8 -> L++. L=1(2): sum=2+6=8 == 8. Return indices 1, 3.',
      patterns: '1. Opposite Ends (Left=0, Right=N-1) for sorted pairs\n2. Fast & Slow (Floyd Cycle Detection)\n3. Read/Write Pointers (remove duplicates in-place)\n4. Two lists simultaneous merge',
      commonMistakes: '- Applying opposite-direction pointers on an unsorted array.\n- Failing to increment/decrement both pointers during infinite loop conditions.',
      timeComplexity: 'O(N) single-pass traversal.',
      spaceComplexity: 'O(1) auxiliary space.'
    },
    codeExamples: {
      python: `# Python Two Pointers (Opposite Direction)\nnums = [1, 2, 3, 4, 6]\ntarget = 6\nleft, right = 0, len(nums) - 1\nwhile left < right:\n    curr = nums[left] + nums[right]\n    if curr == target: print("Pair:", nums[left], nums[right]); break\n    elif curr < target: left += 1\n    else: right -= 1`,
      java: `// Java Two Pointers\npublic class TwoPtr {\n    public static void main(String[] args) {\n        int[] arr = {1, 2, 3, 4, 6};\n        int target = 6, l = 0, r = arr.length - 1;\n        while (l < r) {\n            int sum = arr[l] + arr[r];\n            if (sum == target) { System.out.println(arr[l] + ", " + arr[r]); break; }\n            else if (sum < target) l++; else r--;\n        }\n    }\n}`,
      cpp: `// C++ Two Pointers\n#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    vector<int> a = {1, 2, 3, 4, 6};\n    int t = 6, l = 0, r = a.size() - 1;\n    while (l < r) {\n        int s = a[l] + a[r];\n        if (s == t) { cout << a[l] << " " << a[r] << endl; break; }\n        else if (s < t) l++; else r--;\n    }\n    return 0;\n}`,
      javascript: `// JavaScript Two Pointers\nconst nums = [1, 2, 3, 4, 6];\nlet l = 0, r = nums.length - 1, target = 6;\nwhile (l < r) {\n  const sum = nums[l] + nums[r];\n  if (sum === target) { console.log(nums[l], nums[r]); break; }\n  sum < target ? l++ : r--;\n}`
    }
  },
  {
    topicId: 'sliding-window',
    title: 'Sliding Window',
    order: 5,
    problemCount: 15,
    concept: {
      what: 'Sliding Window maintains a contiguous subarray/substring that expands and contracts dynamically to compute optimal range values in linear time.',
      whenToUse: 'Use for continuous subarray/substring problems looking for maximum, minimum, longest, or shortest ranges satisfying a condition.',
      howItWorks: 'Expand `right` pointer to include elements until condition is violated, then shrink `left` pointer to restore the invariant, avoiding recalculating overlapping items.',
      dryRun: 'Max sum of size k=3: [2, 1, 5, 1, 3, 2]. First window [2,1,5]=8. Slide: subtract 2, add 1 -> [1,5,1]=7. Slide: subtract 1, add 3 -> [5,1,3]=9. Slide: subtract 5, add 2 -> [1,3,2]=6. Max = 9.',
      patterns: '1. Fixed Size Window (size k)\n2. Dynamically Shrinking Window (longest/shortest subarray)\n3. Window with Hash Table (all anagrams in string)',
      commonMistakes: '- Recomputing the entire window sum from scratch on every step instead of `sum += arr[r] - arr[l]`.\n- Incorrect while-condition when shrinking the left edge.',
      timeComplexity: 'O(N) since each element enters and leaves the window at most once.',
      spaceComplexity: 'O(1) to O(K) depending on frequency map size.'
    },
    codeExamples: {
      python: `# Python Sliding Window (Fixed k)\nnums = [2, 1, 5, 1, 3, 2]\nk = 3\nwin_sum = sum(nums[:k])\nmax_sum = win_sum\nfor i in range(k, len(nums)):\n    win_sum += nums[i] - nums[i - k]\n    max_sum = max(max_sum, win_sum)\nprint("Max Subarray Sum of size 3:", max_sum)`,
      java: `// Java Sliding Window\npublic class SlidingWin {\n    public static void main(String[] args) {\n        int[] nums = {2, 1, 5, 1, 3, 2};\n        int k = 3, sum = 0;\n        for (int i = 0; i < k; i++) sum += nums[i];\n        int max = sum;\n        for (int i = k; i < nums.length; i++) {\n            sum += nums[i] - nums[i - k];\n            max = Math.max(max, sum);\n        }\n        System.out.println("Max Sum: " + max);\n    }\n}`,
      cpp: `// C++ Sliding Window\n#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    vector<int> nums = {2, 1, 5, 1, 3, 2};\n    int k = 3, sum = 0;\n    for(int i = 0; i < k; ++i) sum += nums[i];\n    int maxS = sum;\n    for(int i = k; i < nums.size(); ++i) {\n        sum += nums[i] - nums[i - k];\n        maxS = max(maxS, sum);\n    }\n    cout << "Max Sum: " << maxS << endl;\n    return 0;\n}`,
      javascript: `// JavaScript Sliding Window\nconst nums = [2, 1, 5, 1, 3, 2], k = 3;\nlet sum = nums.slice(0, k).reduce((a, b) => a + b, 0);\nlet max = sum;\nfor (let i = k; i < nums.length; i++) {\n  sum += nums[i] - nums[i - k];\n  max = Math.max(max, sum);\n}\nconsole.log("Max sum:", max);`
    }
  },
  {
    topicId: 'prefix-sum',
    title: 'Prefix Sum',
    order: 6,
    problemCount: 15,
    concept: {
      what: 'Prefix Sum precomputes cumulative sums of an array so that any range sum query `sum(L...R)` can be answered in O(1) time.',
      whenToUse: 'Use for range sum queries, equilibrium indices, 2D grid matrix sum queries, and subarray sum count equal to K.',
      howItWorks: 'Construct `P[i] = P[i-1] + arr[i]`. Any range sum from index L to R is evaluated as `P[R] - P[L - 1]`.',
      dryRun: 'Array: [3, 1, 4, 2]. Prefix: [0, 3, 4, 8, 10]. Sum from idx 1 to 2 (1 + 4 = 5) -> P[3] - P[1] = 8 - 3 = 5. O(1) query time.',
      patterns: '1. 1D Prefix Sum for repeated queries\n2. Prefix Sum + Hash Map (number of subarrays with sum == K)\n3. 2D Prefix Matrix for image/grid queries\n4. Difference Array for range update operations',
      commonMistakes: '- Off-by-one errors when querying index 0 (using 1-based indexing for prefix table eliminates boundary checks).\n- Integer overflow when summing large integer arrays (use 64-bit long in Java/C++).',
      timeComplexity: 'Preprocessing: O(N) | Range Query: O(1).',
      spaceComplexity: 'O(N) auxiliary array.'
    },
    codeExamples: {
      python: `# Python Prefix Sum\nnums = [3, 1, 4, 2]\npref = [0] * (len(nums) + 1)\nfor i in range(len(nums)):\n    pref[i + 1] = pref[i] + nums[i]\n# Query range [1, 2] (1-based [2, 3])\nprint("Range sum [1..2]:", pref[3] - pref[1])`,
      java: `// Java Prefix Sum\npublic class PrefixSum {\n    public static void main(String[] args) {\n        int[] nums = {3, 1, 4, 2};\n        int[] pref = new int[nums.length + 1];\n        for (int i = 0; i < nums.length; i++) pref[i + 1] = pref[i] + nums[i];\n        System.out.println("Range [1..2]: " + (pref[3] - pref[1]));\n    }\n}`,
      cpp: `// C++ Prefix Sum\n#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    vector<int> nums = {3, 1, 4, 2};\n    vector<int> pref(nums.size() + 1, 0);\n    for(int i = 0; i < nums.size(); ++i) pref[i + 1] = pref[i] + nums[i];\n    cout << "Range [1..2]: " << (pref[3] - pref[1]) << endl;\n    return 0;\n}`,
      javascript: `// JavaScript Prefix Sum\nconst nums = [3, 1, 4, 2];\nconst pref = [0];\nfor (const n of nums) pref.push(pref[pref.length - 1] + n);\nconsole.log("Range [1..2]:", pref[3] - pref[1]);`
    }
  },
  {
    topicId: 'binary-search',
    title: 'Binary Search',
    order: 7,
    problemCount: 15,
    concept: {
      what: 'Binary Search is a divide-and-conquer algorithm that halves the candidate search space on each step by comparing against the middle element.',
      whenToUse: 'Use on sorted arrays or monotonic answer spaces (Binary Search on Answer, e.g., Koko Eating Bananas, Capacity to Ship Packages).',
      howItWorks: 'Calculate `mid = low + (high - low) / 2`. If `arr[mid] == target`, return. If `target > arr[mid]`, search right half (`low = mid + 1`); otherwise search left half (`high = mid - 1`).',
      dryRun: 'Search 7 in [1, 3, 5, 7, 9]. low=0, high=4 -> mid=2 (5). 7 > 5 -> low=3. low=3, high=4 -> mid=3 (7). 7 == 7. Found at idx 3.',
      patterns: '1. Exact match binary search\n2. Lower bound (first element >= target)\n3. Upper bound (first element > target)\n4. Binary Search on Answer / Predicate function (check(mid))',
      commonMistakes: '- Integer overflow with `(low + high) / 2` (use `low + (high - low) / 2`).\n- Infinite loops due to incorrect pointer updates (`low = mid` vs `low = mid + 1`).',
      timeComplexity: 'O(log N) time complexity.',
      spaceComplexity: 'O(1) iterative space.'
    },
    codeExamples: {
      python: `# Python Binary Search\ndef binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target: return mid\n        elif arr[mid] < target: low = mid + 1\n        else: high = mid - 1\n    return -1\nprint("Found at:", binary_search([1, 3, 5, 7, 9], 7))`,
      java: `// Java Binary Search\npublic class BS {\n    public static int search(int[] arr, int target) {\n        int low = 0, high = arr.length - 1;\n        while (low <= high) {\n            int mid = low + (high - low) / 2;\n            if (arr[mid] == target) return mid;\n            else if (arr[mid] < target) low = mid + 1;\n            else high = mid - 1;\n        }\n        return -1;\n    }\n}`,
      cpp: `// C++ Binary Search\n#include <iostream>\n#include <vector>\nusing namespace std;\nint search(const vector<int>& a, int target) {\n    int low = 0, high = a.size() - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (a[mid] == target) return mid;\n        else if (a[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}`,
      javascript: `// JavaScript Binary Search\nfunction search(arr, target) {\n  let low = 0, high = arr.length - 1;\n  while (low <= high) {\n    const mid = Math.floor(low + (high - low) / 2);\n    if (arr[mid] === target) return mid;\n    arr[mid] < target ? (low = mid + 1) : (high = mid - 1);\n  }\n  return -1;\n}`
    }
  },
  {
    topicId: 'sorting',
    title: 'Sorting',
    order: 8,
    problemCount: 15,
    concept: {
      what: 'Sorting arranges elements in a specified monotonic order (ascending or descending). Essential algorithms include Merge Sort, Quick Sort, and Counting Sort.',
      whenToUse: 'Whenever ordering simplifies problem complexity (enabling Two Pointers, Binary Search, or Greedy scheduling).',
      howItWorks: 'Merge Sort uses divide-and-conquer to recursively split arrays and merge them in sorted order. Quick Sort partitions around a pivot.',
      dryRun: 'Merge Sort on [4, 2, 1, 3]. Split -> [4, 2] and [1, 3]. Split -> [4], [2] -> merge [2, 4]. Split [1], [3] -> merge [1, 3]. Merge [2, 4] and [1, 3] -> [1, 2, 3, 4].',
      patterns: '1. Custom Comparators (sort by frequency, absolute value, end time)\n2. Inversion Counting via Merge Sort\n3. Dutch National Flag (3-way partition)\n4. Quickselect for K-th largest in O(N) average',
      commonMistakes: '- Using unstable sort when element relative order matters.\n- O(N^2) worst-case in QuickSort when pivot selection is deterministic on sorted inputs.',
      timeComplexity: 'Comparison sorts: O(N log N) optimal | Non-comparison (Counting/Radix): O(N + K).',
      spaceComplexity: 'Merge Sort: O(N) | In-place QuickSort/Heapsort: O(log N) to O(1).'
    },
    codeExamples: {
      python: `# Python Custom Sorting\narr = [(1, 'apple'), (3, 'banana'), (2, 'cherry')]\narr.sort(key=lambda x: x[0])\nprint("Sorted by number:", arr)`,
      java: `// Java Custom Comparator\nimport java.util.*;\npublic class SortExample {\n    public static void main(String[] args) {\n        List<Integer> list = Arrays.asList(5, 2, 8, 1, 9);\n        list.sort((a, b) -> Integer.compare(a, b));\n        System.out.println(list);\n    }\n}`,
      cpp: `// C++ std::sort with lambda\n#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    vector<int> a = {5, 2, 8, 1, 9};\n    sort(a.begin(), a.end(), [](int x, int y){ return x < y; });\n    for(int n : a) cout << n << " ";\n    return 0;\n}`,
      javascript: `// JavaScript Numerical Sort\nconst arr = [5, 2, 8, 1, 9];\narr.sort((a, b) => a - b);\nconsole.log(arr);`
    }
  },
  {
    topicId: 'recursion',
    title: 'Recursion',
    order: 9,
    problemCount: 15,
    concept: {
      what: 'Recursion is a programming technique where a function calls itself to solve smaller sub-instances of the same problem until a base condition is met.',
      whenToUse: 'Use for tree traversals, divide-and-conquer, combinatorics, mathematical induction formulas, and tower of hanoi.',
      howItWorks: 'Each function call pushes a frame onto the execution call stack containing local variables and return address.',
      dryRun: 'Factorial(3). Calls fact(2) -> fact(1). Base case returns 1. fact(2) returns 2 * 1 = 2. fact(3) returns 3 * 2 = 6.',
      patterns: '1. Base Case + Recursive Step formulation\n2. Divide and Conquer\n3. Helper function with accumulator / memoization',
      commonMistakes: '- Missing base case or condition never satisfied -> StackOverflow / Maximum call stack exceeded.\n- Redundant recursive branches recomputing identical subproblems (leads to exponential O(2^N) time).',
      timeComplexity: 'Number of recursive calls * Work per call.',
      spaceComplexity: 'O(H) where H is the maximum call stack depth.'
    },
    codeExamples: {
      python: `# Python Recursion\ndef factorial(n):\n    if n <= 1: return 1\n    return n * factorial(n - 1)\nprint("Factorial of 5:", factorial(5))`,
      java: `// Java Recursion\npublic class Rec {\n    public static int fact(int n) {\n        if (n <= 1) return 1;\n        return n * fact(n - 1);\n    }\n}`,
      cpp: `// C++ Recursion\n#include <iostream>\nusing namespace std;\nint fact(int n) {\n    if (n <= 1) return 1;\n    return n * fact(n - 1);\n}`,
      javascript: `// JavaScript Recursion\nfunction fact(n) {\n  if (n <= 1) return 1;\n  return n * fact(n - 1);\n}`
    }
  },
  {
    topicId: 'backtracking',
    title: 'Backtracking',
    order: 10,
    problemCount: 15,
    concept: {
      what: 'Backtracking systematically searches all possible configuration states by building candidates incrementally and abandoning ("backtracking") as soon as a candidate violates problem constraints.',
      whenToUse: 'Use for generating permutations, combinations, subsets, N-Queens, Sudoku solving, and word search on grids.',
      howItWorks: 'State space tree traversal: 1. Choose -> 2. Explore recursively -> 3. Un-choose (revert state for next iteration).',
      dryRun: 'Subsets of [1, 2]: Start []. Include 1 -> [1]. Include 2 -> [1, 2] (save). Backtrack: remove 2. Backtrack: remove 1. Don\'t include 1: include 2 -> [2] (save). Final: [[], [1], [1, 2], [2]].',
      patterns: '1. Subsets / Combinations (Include / Exclude pattern)\n2. Permutations (Track used elements with boolean array)\n3. Grid search with boundary restoration (visited markers)',
      commonMistakes: '- Forgetting to undo the decision in step 3 (mutating shared list without deep copying when saving results).\n- Ineffective pruning causing exponential time explosion.',
      timeComplexity: 'Exponential / Factorial (e.g., O(2^N) for subsets, O(N!) for permutations).',
      spaceComplexity: 'O(N) recursion call stack depth.'
    },
    codeExamples: {
      python: `# Python Backtracking (Subsets)\ndef subsets(nums):\n    res = []\n    def backtrack(idx, path):\n        res.append(list(path))\n        for i in range(idx, len(nums)):\n            path.append(nums[i])\n            backtrack(i + 1, path)\n            path.pop() # Backtrack\n    backtrack(0, [])\n    return res\nprint("Subsets:", subsets([1, 2]))`,
      java: `// Java Backtracking\nimport java.util.*;\npublic class Backtrack {\n    public static void generate(int[] nums, int idx, List<Integer> path, List<List<Integer>> res) {\n        res.add(new ArrayList<>(path));\n        for (int i = idx; i < nums.length; i++) {\n            path.add(nums[i]);\n            generate(nums, i + 1, path, res);\n            path.remove(path.size() - 1); // backtrack\n        }\n    }\n}`,
      cpp: `// C++ Backtracking\n#include <iostream>\n#include <vector>\nusing namespace std;\nvoid solve(const vector<int>& nums, int idx, vector<int>& path, vector<vector<int>>& res) {\n    res.push_back(path);\n    for(int i = idx; i < nums.size(); ++i) {\n        path.push_back(nums[i]);\n        solve(nums, i + 1, path, res);\n        path.pop_back(); // backtrack\n    }\n}`,
      javascript: `// JavaScript Backtracking\nfunction subsets(nums) {\n  const res = [];\n  function dfs(idx, path) {\n    res.push([...path]);\n    for (let i = idx; i < nums.length; i++) {\n      path.push(nums[i]);\n      dfs(i + 1, path);\n      path.pop();\n    }\n  }\n  dfs(0, []);\n  return res;\n}`
    }
  },
  {
    topicId: 'linked-list',
    title: 'Linked List',
    order: 11,
    problemCount: 15,
    concept: {
      what: 'A Linked List is a linear data structure of nodes connected via pointers, where each node stores a value and a reference (`next`) to the subsequent node.',
      whenToUse: 'Use when dynamic memory allocation is preferred over contiguous memory, or when O(1) insertions/deletions at known positions are required (LRU Cache).',
      howItWorks: 'Nodes are non-contiguous in memory. Accessing the k-th node requires traversing from the head in O(K).',
      dryRun: 'Reverse List: 1 -> 2 -> 3 -> null. prev=null, curr=1. nextNode=2, curr.next=null, prev=1, curr=2. Next: nextNode=3, curr.next=1, prev=2, curr=3. Next: curr.next=2, prev=3. Returns 3 -> 2 -> 1 -> null.',
      patterns: '1. Dummy Head node to handle edge-case insertions/deletions\n2. Fast & Slow pointer (Tortoise and Hare) for middle node / cycle detection\n3. In-place pointer reversal\n4. Merge two sorted lists',
      commonMistakes: '- NullPointerException by calling `.next` on a `null` reference.\n- Losing reference to the rest of the list before rewiring pointers.',
      timeComplexity: 'Access / Search: O(N) | Insertion / Deletion at head: O(1) | Insertion / Deletion at middle (given pointer): O(1).',
      spaceComplexity: 'O(N) memory with pointer overhead per node.'
    },
    codeExamples: {
      python: `# Python Singly Linked List Node\nclass ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\nhead = ListNode(1, ListNode(2, ListNode(3)))\n# Traversal\ncurr = head\nwhile curr:\n    print(curr.val, end=" -> ")\n    curr = curr.next`,
      java: `// Java Linked List Node\nclass ListNode {\n    int val; ListNode next;\n    ListNode(int val) { this.val = val; }\n}\npublic class LL {\n    public static void main(String[] args) {\n        ListNode head = new ListNode(1);\n        head.next = new ListNode(2);\n    }\n}`,
      cpp: `// C++ Linked List Node\nstruct ListNode {\n    int val;\n    ListNode* next;\n    ListNode(int x) : val(x), next(nullptr) {}\n};`,
      javascript: `// JavaScript Linked List Node\nclass ListNode {\n  constructor(val = 0, next = null) {\n    this.val = val;\n    this.next = next;\n  }\n}`
    }
  },
  {
    topicId: 'stack',
    title: 'Stack',
    order: 12,
    problemCount: 15,
    concept: {
      what: 'A Stack is a Last-In, First-Out (LIFO) linear data structure where all insertions and deletions occur exclusively at the top.',
      whenToUse: 'Use for parentheses balancing, expression parsing, undo/redo history, monotonic stack for nearest greater/smaller element, and recursive call simulation.',
      howItWorks: 'Push adds element to top; Pop removes the top element. Peek checks the top item without removing it.',
      dryRun: 'Valid Parentheses: "({[]})". \'(\' -> push. \'{\' -> push. \'[\' -> push. \']\' -> matches top \'[\' -> pop. \'}\' -> matches \'{\' -> pop. \')\' -> matches \'(\' -> pop. Stack empty -> Valid.',
      patterns: '1. Balanced Parentheses validation\n2. Monotonic Stack (increasing or decreasing for Next Greater Element / Histogram Area)\n3. Postfix / Prefix expression evaluation\n4. Min Stack in O(1)',
      commonMistakes: '- Calling pop() or peek() on an empty stack without checking `isEmpty()`.\n- Using recursive call stack when an explicit stack prevents StackOverflow.',
      timeComplexity: 'Push: O(1) | Pop: O(1) | Peek: O(1) | Search: O(N).',
      spaceComplexity: 'O(N) auxiliary space.'
    },
    codeExamples: {
      python: `# Python Stack using List\nstack = []\nstack.append(10)  # push\nstack.append(20)\ntop = stack[-1]   # peek -> 20\npopped = stack.pop() # pop -> 20\nprint("Stack:", stack)`,
      java: `// Java Stack using ArrayDeque (faster than java.util.Stack)\nimport java.util.*;\npublic class StackOps {\n    public static void main(String[] args) {\n        Deque<Integer> stack = new ArrayDeque<>();\n        stack.push(10);\n        stack.push(20);\n        int top = stack.peek(); // 20\n        int popped = stack.pop(); // 20\n    }\n}`,
      cpp: `// C++ std::stack\n#include <iostream>\n#include <stack>\nusing namespace std;\nint main() {\n    stack<int> s;\n    s.push(10);\n    s.push(20);\n    int top = s.top();\n    s.pop();\n    return 0;\n}`,
      javascript: `// JavaScript Stack\nconst stack = [];\nstack.push(10);\nstack.push(20);\nconst top = stack[stack.length - 1];\nconst popped = stack.pop();\nconsole.log({ top, popped });`
    }
  },
  {
    topicId: 'queue',
    title: 'Queue',
    order: 13,
    problemCount: 15,
    concept: {
      what: 'A Queue is a First-In, First-Out (FIFO) linear data structure where elements are enqueued at the rear and dequeued from the front.',
      whenToUse: 'Use for Breadth-First Search (BFS) graph/tree traversals, task scheduling, buffer management, and sliding window maximum (via Monotonic Deque).',
      howItWorks: 'Enqueue pushes to back; Dequeue removes from front. Double-ended queues (Deque) allow O(1) operations at both ends.',
      dryRun: 'BFS on Binary Tree [1, 2, 3]: Push 1. Queue=[1]. Pop 1, push children 2, 3 -> Queue=[2, 3]. Pop 2. Pop 3. Queue empty. Level order: 1, then 2, 3.',
      patterns: '1. Standard FIFO Queue for BFS\n2. Circular Queue with fixed array buffer\n3. Monotonic Deque for Sliding Window Maximum\n4. Priority Queue (min/max heap ordering)',
      commonMistakes: '- Using array `shift()` in JavaScript or `list.pop(0)` in Python which takes O(N) instead of O(1) (use `collections.deque`).\n- Circular queue array wrap-around modulo calculation errors.',
      timeComplexity: 'Enqueue: O(1) | Dequeue: O(1) | Front: O(1).',
      spaceComplexity: 'O(N) memory storage.'
    },
    codeExamples: {
      python: `# Python Queue using collections.deque (O(1) popleft)\nfrom collections import deque\nq = deque()\nq.append(1)        # enqueue\nq.append(2)\nfront = q[0]       # peek\npopped = q.popleft() # dequeue O(1)\nprint("Queue:", list(q))`,
      java: `// Java Queue using LinkedList or ArrayDeque\nimport java.util.*;\npublic class QueueOps {\n    public static void main(String[] args) {\n        Queue<Integer> q = new ArrayDeque<>();\n        q.offer(1);\n        q.offer(2);\n        int front = q.peek();\n        int removed = q.poll();\n    }\n}`,
      cpp: `// C++ std::queue\n#include <iostream>\n#include <queue>\nusing namespace std;\nint main() {\n    queue<int> q;\n    q.push(1);\n    q.push(2);\n    int front = q.front();\n    q.pop();\n    return 0;\n}`,
      javascript: `// JavaScript Deque / Simple Queue\nclass Queue {\n  constructor() { this.items = []; this.head = 0; }\n  enqueue(v) { this.items.push(v); }\n  dequeue() { return this.items[this.head++]; }\n  peek() { return this.items[this.head]; }\n}`
    }
  },
  {
    topicId: 'trees',
    title: 'Trees',
    order: 14,
    problemCount: 15,
    concept: {
      what: 'A Tree is a hierarchical non-linear data structure consisting of a root node and child nodes linked by edges, with no cycles.',
      whenToUse: 'Use for hierarchical file systems, DOM trees, binary expressions, organizational charts, and divide-and-conquer search trees.',
      howItWorks: 'Traversals: Depth-First Search (Pre-order: Root-L-R, In-order: L-Root-R, Post-order: L-R-Root) and Breadth-First Search (Level Order).',
      dryRun: 'Max Depth of [3, 9, 20, null, null, 15, 7]. Root=3. Left depth=maxDepth(9)=1. Right depth=maxDepth(20)=1+max(1,1)=2. Return 1 + max(1, 2) = 3.',
      patterns: '1. DFS (Recursive traversal)\n2. BFS (Level-order with Queue)\n3. Lowest Common Ancestor (LCA)\n4. Diameter of Binary Tree (Global variable pattern)',
      commonMistakes: '- Forgetting null pointer checks on left or right child nodes.\n- Confusing In-order (sorted in BST) with Pre-order or Post-order.',
      timeComplexity: 'Traversal: O(N) visits every node once.',
      spaceComplexity: 'O(H) call stack where H is tree height (O(log N) balanced, O(N) skewed).'
    },
    codeExamples: {
      python: `# Python Binary Tree Node & Inorder Traversal\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val; self.left = left; self.right = right\ndef inorder(root):\n    return inorder(root.left) + [root.val] + inorder(root.right) if root else []`,
      java: `// Java Binary Tree Node\nclass TreeNode {\n    int val; TreeNode left, right;\n    TreeNode(int x) { val = x; }\n}`,
      cpp: `// C++ Binary Tree Node\nstruct TreeNode {\n    int val;\n    TreeNode *left, *right;\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};`,
      javascript: `// JavaScript Tree Node\nclass TreeNode {\n  constructor(val = 0, left = null, right = null) {\n    this.val = val; this.left = left; this.right = right;\n  }\n}`
    }
  },
  {
    topicId: 'binary-search-tree',
    title: 'Binary Search Tree',
    order: 15,
    problemCount: 15,
    concept: {
      what: 'A Binary Search Tree (BST) is a binary tree where for every node, all values in its left subtree are strictly smaller, and all values in its right subtree are strictly greater.',
      whenToUse: 'Use when you need ordered key lookups, floor/ceil searches, range sum queries, or k-th smallest element lookups.',
      howItWorks: 'Search compares target with current node. If `target < val`, move left; if `target > val`, move right. In-order traversal visits nodes in ascending order.',
      dryRun: 'Insert 6 in BST with root=5, right=8. 6 > 5 -> go right to 8. 6 < 8 -> go left (null) -> attach 6 as left child of 8.',
      patterns: '1. In-order traversal produces sorted array\n2. BST validation using (minVal, maxVal) bounds\n3. LCA in BST using value comparisons\n4. K-th smallest element via in-order generator',
      commonMistakes: '- Checking only immediate child nodes instead of enforcing that the ENTIRE subtree satisfies `< root < right`.\n- Allowing tree to become degenerate/skewed into a linked list without self-balancing (AVL / Red-Black).',
      timeComplexity: 'Search / Insert / Delete: O(H) where H = log N (balanced) or N (skewed).',
      spaceComplexity: 'O(H) recursion stack.'
    },
    codeExamples: {
      python: `# Python BST Search\ndef search_bst(root, val):\n    if not root or root.val == val: return root\n    return search_bst(root.left, val) if val < root.val else search_bst(root.right, val)`,
      java: `// Java BST Search\npublic TreeNode searchBST(TreeNode root, int val) {\n    if (root == null || root.val == val) return root;\n    return val < root.val ? searchBST(root.left, val) : searchBST(root.right, val);\n}`,
      cpp: `// C++ BST Search\nTreeNode* searchBST(TreeNode* root, int val) {\n    if (!root || root->val == val) return root;\n    return val < root->val ? searchBST(root->left, val) : searchBST(root->right, val);\n}`,
      javascript: `// JavaScript BST Search\nfunction searchBST(root, val) {\n  if (!root || root.val === val) return root;\n  return val < root.val ? searchBST(root.left, val) : searchBST(root.right, val);\n}`
    }
  },
  {
    topicId: 'heap-priority-queue',
    title: 'Heap / Priority Queue',
    order: 16,
    problemCount: 15,
    concept: {
      what: 'A Heap is a complete binary tree satisfying the heap property: in a Min-Heap, parent <= children; in a Max-Heap, parent >= children.',
      whenToUse: 'Use for finding Top K elements, streaming medians, Dijkstra shortest paths, Prim MST, and merging K sorted lists.',
      howItWorks: 'Stored as an array where node at `i` has left child at `2i + 1` and right child at `2i + 2`. Insert and extract operations bubble elements up/down in O(log N).',
      dryRun: 'K-th largest element (k=2) in [3, 2, 1, 5, 6, 4]. Maintain Min-Heap of size 2. Add 3, 2 -> [2, 3]. Add 1 -> skip. Add 5 -> [3, 5]. Add 6 -> [5, 6]. Add 4 -> skip. Top is 5.',
      patterns: '1. Top K Elements (size-K Min-Heap for K-largest)\n2. Two Heaps (Min-Heap + Max-Heap for dynamic streaming median)\n3. Merge K sorted streams',
      commonMistakes: '- Python `heapq` is a Min-Heap by default (multiply values by -1 for Max-Heap).\n- Using O(N log N) sorting when a size-K Heap solves it in O(N log K).',
      timeComplexity: 'Build Heap: O(N) | Peek min/max: O(1) | Push / Pop: O(log N).',
      spaceComplexity: 'O(N) array storage.'
    },
    codeExamples: {
      python: `# Python Min-Heap (heapq)\nimport heapq\nheap = []\nheapq.heappush(heap, 30)\nheapq.heappush(heap, 10)\nheapq.heappush(heap, 20)\nsmallest = heapq.heappop(heap) # 10\nprint("Smallest:", smallest)`,
      java: `// Java PriorityQueue (Min-Heap by default)\nimport java.util.*;\npublic class HeapOps {\n    public static void main(String[] args) {\n        PriorityQueue<Integer> pq = new PriorityQueue<>();\n        pq.offer(30); pq.offer(10); pq.offer(20);\n        int min = pq.poll(); // 10\n    }\n}`,
      cpp: `// C++ std::priority_queue (Max-Heap by default)\n#include <iostream>\n#include <queue>\nusing namespace std;\nint main() {\n    priority_queue<int> maxHeap; // max-heap\n    priority_queue<int, vector<int>, greater<int>> minHeap; // min-heap\n    minHeap.push(30); minHeap.push(10); minHeap.push(20);\n    cout << minHeap.top() << endl; // 10\n    return 0;\n}`,
      javascript: `// JavaScript Min-Heap representation\n// Typically implemented via binary heap array or custom class\nconst minHeap = [10, 20, 30];`
    }
  },
  {
    topicId: 'graphs',
    title: 'Graphs',
    order: 17,
    problemCount: 15,
    concept: {
      what: 'A Graph is a non-linear network of vertices (nodes) interconnected by edges, which can be directed or undirected, weighted or unweighted.',
      whenToUse: 'Use for network routing, social connections, dependency resolution (topological sort), shortest paths, and connected components.',
      howItWorks: 'Represented using Adjacency Lists `Map<u, List<v>>` or Adjacency Matrices. Traversed using BFS (shortest path in unweighted graph) or DFS (connected components / cycle detection).',
      dryRun: 'Cycle Detection via DFS (Directed Graph): Color nodes 0=unvisited, 1=visiting, 2=visited. If a neighbor has color 1 (in active recursion stack), a back-edge exists -> cycle detected.',
      patterns: '1. BFS for shortest path (unweighted)\n2. DFS for connected components & cycle detection\n3. Kahn’s Algorithm / DFS for Topological Sort (DAG)\n4. Dijkstra Algorithm for shortest path with non-negative weights',
      commonMistakes: '- Forgetting the `visited` set -> infinite loop on graphs with cycles.\n- Using Dijkstra on graphs with negative edge weights (use Bellman-Ford).',
      timeComplexity: 'BFS / DFS: O(V + E) | Dijkstra: O((V + E) log V).',
      spaceComplexity: 'O(V + E) for adjacency list + O(V) visited set.'
    },
    codeExamples: {
      python: `# Python Graph BFS\nfrom collections import deque, defaultdict\ngraph = defaultdict(list)\ngraph[0] = [1, 2]; graph[1] = [2]; graph[2] = [0, 3]; graph[3] = [3]\nvisited = {0}; q = deque([0])\nwhile q:\n    u = q.popleft()\n    for v in graph[u]:\n        if v not in visited:\n            visited.add(v); q.append(v)`,
      java: `// Java Graph Representation\nimport java.util.*;\npublic class Graph {\n    Map<Integer, List<Integer>> adj = new HashMap<>();\n    void addEdge(int u, int v) {\n        adj.computeIfAbsent(u, k -> new ArrayList<>()).add(v);\n    }\n}`,
      cpp: `// C++ Graph Adjacency List\n#include <vector>\nusing namespace std;\nvector<vector<int>> adj;\nvoid addEdge(int u, int v) { adj[u].push_back(v); }`,
      javascript: `// JavaScript Graph Adjacency List\nconst adj = new Map();\nfunction addEdge(u, v) {\n  if (!adj.has(u)) adj.set(u, []);\n  adj.get(u).push(v);\n}`
    }
  },
  {
    topicId: 'greedy',
    title: 'Greedy',
    order: 18,
    problemCount: 15,
    concept: {
      what: 'Greedy algorithms build a solution piece-by-piece, always choosing the immediately best (locally optimal) choice with the hope of finding a globally optimal solution.',
      whenToUse: 'Use for interval scheduling, activity selection, fractional knapsack, Huffman coding, Jump Game, and coin change with standard denominations.',
      howItWorks: '1. Prove Greedy Choice Property (a local choice leads to a global optimum). 2. Prove Optimal Substructure.',
      dryRun: 'Non-overlapping intervals: Sort by end time. Always pick the interval that finishes earliest to leave maximum room for subsequent activities.',
      patterns: '1. Sorting by end time / start time\n2. Priority queue for dynamic greedy selection\n3. Two-pass greedy (left-to-right then right-to-left, e.g. Candy problem)',
      commonMistakes: '- Applying greedy when future choices depend on previous state (use Dynamic Programming instead).\n- Sorting by wrong criterion (e.g. sorting by duration instead of end time).',
      timeComplexity: 'Typically dominated by sorting: O(N log N).',
      spaceComplexity: 'O(1) to O(N).'
    },
    codeExamples: {
      python: `# Python Greedy (Interval Scheduling)\nintervals = [[1, 3], [2, 4], [3, 5]]\nintervals.sort(key=lambda x: x[1]) # Sort by end time\ncount = 0; last_end = -1\nfor start, end in intervals:\n    if start >= last_end:\n        count += 1; last_end = end\nprint("Max non-overlapping intervals:", count)`,
      java: `// Java Greedy\nimport java.util.*;\npublic class Greedy {\n    public static int maxIntervals(int[][] intervals) {\n        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));\n        int count = 0, lastEnd = -1;\n        for (int[] inv : intervals) {\n            if (inv[0] >= lastEnd) { count++; lastEnd = inv[1]; }\n        }\n        return count;\n    }\n}`,
      cpp: `// C++ Greedy\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint eraseOverlapIntervals(vector<vector<int>>& intervals) {\n    sort(intervals.begin(), intervals.end(), [](const vector<int>& a, const vector<int>& b){ return a[1] < b[1]; });\n    int count = 0, lastEnd = -1e9;\n    for(auto& inv : intervals) {\n        if (inv[0] >= lastEnd) lastEnd = inv[1];\n        else count++;\n    }\n    return count;\n}`,
      javascript: `// JavaScript Greedy\nconst intervals = [[1, 3], [2, 4], [3, 5]];\nintervals.sort((a, b) => a[1] - b[1]);\nlet count = 0, lastEnd = -Infinity;\nfor (const [start, end] of intervals) {\n  if (start >= lastEnd) { count++; lastEnd = end; }\n}`
    }
  },
  {
    topicId: 'dynamic-programming',
    title: 'Dynamic Programming',
    order: 19,
    problemCount: 15,
    concept: {
      what: 'Dynamic Programming (DP) solves complex problems by breaking them down into simpler overlapping subproblems, storing intermediate results to avoid recomputation.',
      whenToUse: 'Use for optimization problems (min/max), counting ways, or decision-making sequences exhibiting overlapping subproblems and optimal substructure.',
      howItWorks: 'Two approaches: 1. Top-Down (Memoization with recursion) 2. Bottom-Up (Tabulation iterating iteratively through a table).',
      dryRun: 'Climbing Stairs (n=3): Ways to reach step i is dp[i] = dp[i-1] + dp[i-2]. Base: dp[1]=1, dp[2]=2. dp[3] = 1 + 2 = 3 ways.',
      patterns: '1. 1D DP (House Robber, Climbing Stairs)\n2. 0/1 Knapsack & Unbounded Knapsack\n3. Longest Common Subsequence (LCS) / Edit Distance\n4. Matrix Path (Unique Paths)\n5. State-machine / Stock trading DP',
      commonMistakes: '- Incorrect base cases causing zero or negative indices.\n- Failing to identify state transitions and parameters.\n- Using full 2D table when only the previous row/state is required (space optimization).',
      timeComplexity: 'Number of unique states * Work per transition.',
      spaceComplexity: 'O(N) or O(N*M), optimizable to O(1) or O(M).'
    },
    codeExamples: {
      python: `# Python DP (Climbing Stairs - Space Optimized)\ndef climb_stairs(n):\n    if n <= 2: return n\n    prev2, prev1 = 1, 2\n    for _ in range(3, n + 1):\n        curr = prev1 + prev2\n        prev2, prev1 = prev1, curr\n    return prev1\nprint("Ways for 5 stairs:", climb_stairs(5))`,
      java: `// Java DP\npublic class DP {\n    public static int climbStairs(int n) {\n        if (n <= 2) return n;\n        int p2 = 1, p1 = 2;\n        for (int i = 3; i <= n; i++) {\n            int cur = p1 + p2;\n            p2 = p1; p1 = cur;\n        }\n        return p1;\n    }\n}`,
      cpp: `// C++ DP\nint climbStairs(int n) {\n    if (n <= 2) return n;\n    int p2 = 1, p1 = 2;\n    for(int i = 3; i <= n; ++i) {\n        int cur = p1 + p2;\n        p2 = p1; p1 = cur;\n    }\n    return p1;\n}`,
      javascript: `// JavaScript DP\nfunction climbStairs(n) {\n  if (n <= 2) return n;\n  let [p2, p1] = [1, 2];\n  for (let i = 3; i <= n; i++) {\n    const cur = p1 + p2;\n    p2 = p1; p1 = cur;\n  }\n  return p1;\n}`
    }
  },
  {
    topicId: 'bit-manipulation',
    title: 'Bit Manipulation',
    order: 20,
    problemCount: 15,
    concept: {
      what: 'Bit Manipulation operates directly on individual binary bits of integers using bitwise operators (`&`, `|`, `^`, `~`, `<<`, `>>`).',
      whenToUse: 'Use for subset generation (bitmasks), single number finding, power-of-two verification, parity checking, and memory compression.',
      howItWorks: 'Bit tricks: `n & (n - 1)` clears lowest set bit. `n & -n` isolates lowest set bit. `x ^ x = 0` cancels duplicate pairs.',
      dryRun: 'Single Number: nums=[4, 1, 2, 1, 2]. Compute 4 ^ 1 ^ 2 ^ 1 ^ 2 = 4 ^ (1^1) ^ (2^2) = 4 ^ 0 ^ 0 = 4. Single element identified in O(N) time and O(1) space.',
      patterns: '1. XOR cancellations\n2. Brian Kernighan’s algorithm for counting set bits (`n &= (n - 1)`)\n3. Bitmask DP to represent state sets of up to 20 elements',
      commonMistakes: '- Operator precedence in C++/Java (e.g. `1 << n - 1` computes `1 << (n - 1)`, while `a & 1 == 0` evaluates `1 == 0` first!). Always use parentheses.\n- Overflow with 32-bit signed integers.',
      timeComplexity: 'Bitwise operations are O(1) CPU instructions.',
      spaceComplexity: 'O(1) auxiliary space.'
    },
    codeExamples: {
      python: `# Python Bit Manipulation\ndef is_power_of_two(n):\n    return n > 0 and (n & (n - 1)) == 0\nprint("Is 16 power of two:", is_power_of_two(16))`,
      java: `// Java Bit Manipulation\npublic class BitOps {\n    public static boolean isPowerOfTwo(int n) {\n        return n > 0 && (n & (n - 1)) == 0;\n    }\n}`,
      cpp: `// C++ Bit Manipulation\nbool isPowerOfTwo(int n) {\n    return n > 0 && (n & (n - 1)) == 0;\n}`,
      javascript: `// JavaScript Bit Manipulation\nfunction isPowerOfTwo(n) {\n  return n > 0 && (n & (n - 1)) === 0;\n}`
    }
  },
  {
    topicId: 'math',
    title: 'Math',
    order: 21,
    problemCount: 15,
    concept: {
      what: 'Number Theory and discrete mathematics concepts frequently tested in technical placements: GCD, LCM, prime factorizations, Sieve of Eratosthenes, and modular arithmetic.',
      whenToUse: 'Use for large modulo calculations (10^9 + 7), divisibility checks, prime counting, combinatorics (nCr % mod), and geometry.',
      howItWorks: 'Euclidean Algorithm computes GCD in O(log(min(a, b))) via `gcd(a, b) = gcd(b, a % b)`. Sieve of Eratosthenes marks primes up to N in O(N log log N).',
      dryRun: 'GCD(48, 18): gcd(18, 48%18=12) -> gcd(12, 18%12=6) -> gcd(6, 12%6=0). Returns 6.',
      patterns: '1. Euclidean GCD / LCM\n2. Sieve of Eratosthenes\n3. Fast Modular Exponentiation (Binary Exponentiation)\n4. Pascal’s Triangle for combinations',
      commonMistakes: '- Forgetting to apply modulo at every intermediate addition and multiplication step.\n- Negative modulo in C++/Java: `(-5) % 3` is `-2`, not `1`. Use `(val % mod + mod) % mod`.',
      timeComplexity: 'GCD: O(log(min(a, b))) | Sieve: O(N log log N) | Fast Power: O(log N).',
      spaceComplexity: 'O(1) to O(N) for prime sieve tables.'
    },
    codeExamples: {
      python: `# Python Math (GCD & Modular Exponentiation)\ndef gcd(a, b):\n    while b: a, b = b, a % b\n    return a\nprint("GCD(48, 18):", gcd(48, 18))`,
      java: `// Java Math\npublic class MathOps {\n    public static int gcd(int a, int b) {\n        return b == 0 ? a : gcd(b, a % b);\n    }\n}`,
      cpp: `// C++ Math\n#include <numeric>\nusing namespace std;\nint gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }`,
      javascript: `// JavaScript Math\nfunction gcd(a, b) {\n  return b === 0 ? a : gcd(b, a % b);\n}`
    }
  }
];


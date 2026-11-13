/**
 * Canonical DSA Placement Problems: STRINGS (20 Questions)
 * 8 Easy, 8 Medium, 4 Hard
 */

import { createCanonicalProblem } from './topicProblemHelper.js';

export const STRING_PROBLEMS = [
  // 1. Valid Palindrome (Easy)
  createCanonicalProblem({
    problemId: 'dsa_strings_01',
    topicId: 'strings',
    order: 1,
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    tags: ['String', 'Two Pointers'],
    statement: `A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, print \`true\` if it is a palindrome, or \`false\` otherwise.`,
    constraints: [
      '1 <= s.length <= 2 * 10^5',
      's consists only of printable ASCII characters.'
    ],
    examples: [
      {
        input: 'A man, a plan, a canal: Panama',
        displayInput: 's = "A man, a plan, a canal: Panama"',
        output: 'true',
        displayOutput: 'true',
        explanation: '"amanaplanacanalpanama" is a palindrome.'
      },
      {
        input: 'race a car',
        displayInput: 's = "race a car"',
        output: 'false',
        displayOutput: 'false',
        explanation: '"raceacar" is not a palindrome.'
      }
    ],
    hints: [
      'Filter out non-alphanumeric characters and lowercase the string.',
      'Check if cleaned string matches its reverse, or use two pointers from both ends.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    s = sys.stdin.read().rstrip('\\r\\n')\n    cleaned = [c.lower() for c in s if c.isalnum()]\n    print("true" if cleaned == cleaned[::-1] else "false")\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.io.*;\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String s = br.readLine();\n        if (s == null) s = "";\n        StringBuilder sb = new StringBuilder();\n        for (char c : s.toCharArray()) if (Character.isLetterOrDigit(c)) sb.append(Character.toLowerCase(c));\n        String clean = sb.toString();\n        System.out.println(clean.equals(sb.reverse().toString()) ? "true" : "false");\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\n#include <algorithm>\n#include <cctype>\nusing namespace std;\nint main() {\n    string s; if (!getline(cin, s)) s = "";\n    string clean = "";\n    for (char c : s) if (isalnum(c)) clean += tolower(c);\n    string rev = clean;\n    reverse(rev.begin(), rev.end());\n    cout << (clean == rev ? "true" : "false") << "\\n";\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const s = fs.readFileSync(0, 'utf-8').replace(/\\r?\\n$/, '');\n    const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n    console.log(clean === clean.split('').reverse().join('') ? 'true' : 'false');\n}\nsolve();`
    },
    sampleInputs: [
      'A man, a plan, a canal: Panama',
      'race a car',
      ' '
    ],
    hiddenInputs: [
      '0P',
      'ab_a',
      'No \'x\' in Nixon',
      'Was it a car or a cat I saw?'
    ],
    solveFunction: (stdin) => {
      const clean = stdin.toLowerCase().replace(/[^a-z0-9]/g, '');
      return clean === clean.split('').reverse().join('') ? 'true' : 'false';
    }
  }),

  // 2. Valid Anagram (Easy)
  createCanonicalProblem({
    problemId: 'dsa_strings_02',
    topicId: 'strings',
    order: 2,
    title: 'Valid Anagram',
    difficulty: 'Easy',
    tags: ['String', 'Hash Table', 'Sorting'],
    statement: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an **anagram** of \`s\`, and \`false\` otherwise.

An Anagram is a word formed by rearranging the letters of a different word, typically using all the original letters exactly once.`,
    constraints: [
      '1 <= s.length, t.length <= 5 * 10^4',
      's and t consist of lowercase English letters.'
    ],
    examples: [
      {
        input: 'anagram nagaram',
        displayInput: 's = "anagram", t = "nagaram"',
        output: 'true',
        displayOutput: 'true',
        explanation: 'Both contain 3 a\'s, 1 g, 1 m, 1 n, 1 r.'
      },
      {
        input: 'rat car',
        displayInput: 's = "rat", t = "car"',
        output: 'false',
        displayOutput: 'false',
        explanation: 'Letters differ.'
      }
    ],
    hints: [
      'If lengths differ, return false immediately.',
      'Count frequencies of characters in a fixed array of size 26.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if len(tokens) < 2:\n        print("false"); return\n    s, t = tokens[0], tokens[1]\n    print("true" if sorted(s) == sorted(t) else "false")\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String s = sc.next(), t = sc.next();\n        char[] a = s.toCharArray(), b = t.toCharArray();\n        Arrays.sort(a); Arrays.sort(b);\n        System.out.println(Arrays.equals(a, b) ? "true" : "false");\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\nint main() {\n    string s, t; if (!(cin >> s >> t)) return 0;\n    sort(s.begin(), s.end()); sort(t.begin(), t.end());\n    cout << (s == t ? "true" : "false") << "\\n";\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) { console.log('false'); return; }\n    const s1 = t[0].split('').sort().join(''), s2 = t[1].split('').sort().join('');\n    console.log(s1 === s2 ? 'true' : 'false');\n}\nsolve();`
    },
    sampleInputs: [
      'anagram nagaram',
      'rat car',
      'a a'
    ],
    hiddenInputs: [
      'ab ba',
      'listen silent',
      'triangle integral',
      'hello world'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      if (tokens.length < 2) return 'false';
      const s1 = tokens[0].split('').sort().join('');
      const s2 = tokens[1].split('').sort().join('');
      return s1 === s2 ? 'true' : 'false';
    }
  }),

  // 3. Longest Common Prefix (Easy)
  createCanonicalProblem({
    problemId: 'dsa_strings_03',
    topicId: 'strings',
    order: 3,
    title: 'Longest Common Prefix',
    difficulty: 'Easy',
    tags: ['String', 'Trie'],
    statement: `Write a function to find the longest common prefix string amongst an array of strings.

If there is no common prefix, return \`""\` (empty string or print \`""\`).`,
    constraints: [
      '1 <= strs.length <= 200',
      '0 <= strs[i].length <= 200',
      'strs[i] consists of only lowercase English letters.'
    ],
    examples: [
      {
        input: '3\nflower flow flight',
        displayInput: 'strs = ["flower","flow","flight"]',
        output: 'fl',
        displayOutput: '"fl"',
        explanation: '"fl" is the longest common prefix.'
      },
      {
        input: '3\ndog racecar car',
        displayInput: 'strs = ["dog","racecar","car"]',
        output: '',
        displayOutput: '""',
        explanation: 'There is no common prefix among the input strings.'
      }
    ],
    hints: [
      'Sort the strings lexicographically. The common prefix between all strings must be shared between the first and last strings!'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens:\n        return\n    n = int(tokens[0])\n    strs = tokens[1:n+1]\n    if not strs: print(""); return\n    strs.sort()\n    s1, s2 = strs[0], strs[-1]\n    i = 0\n    while i < len(s1) and i < len(s2) and s1[i] == s2[i]:\n        i += 1\n    print(s1[:i])\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        String[] strs = new String[n];\n        for (int i = 0; i < n; i++) strs[i] = sc.next();\n        Arrays.sort(strs);\n        String s1 = strs[0], s2 = strs[n - 1];\n        int idx = 0;\n        while (idx < s1.length() && idx < s2.length() && s1.charAt(idx) == s2.charAt(idx)) idx++;\n        System.out.println(s1.substring(0, idx));\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<string> s(n);\n    for (int i = 0; i < n; i++) cin >> s[i];\n    sort(s.begin(), s.end());\n    string s1 = s[0], s2 = s[n - 1];\n    int i = 0;\n    while (i < s1.size() && i < s2.size() && s1[i] == s2[i]) i++;\n    cout << s1.substr(0, i) << "\\n";\n    return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const strs = t.slice(1, n + 1).sort();\n    const s1 = strs[0], s2 = strs[n - 1];\n    let i = 0;\n    while (i < s1.length && i < s2.length && s1[i] === s2[i]) i++;\n    console.log(s1.slice(0, i));\n}\nsolve();`
    },
    sampleInputs: [
      '3\nflower flow flight',
      '3\ndog racecar car',
      '2\ninterview intermediate'
    ],
    hiddenInputs: [
      '1\nalone',
      '3\na b c',
      '4\nprefix preference predictable pretend'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const strs = tokens.slice(1, n + 1).sort();
      if (!strs.length) return '';
      const s1 = strs[0], s2 = strs[n - 1];
      let i = 0;
      while (i < s1.length && i < s2.length && s1[i] === s2[i]) i++;
      return s1.slice(0, i);
    }
  }),

  // 4. First Unique Character in String (Easy)
  createCanonicalProblem({
    problemId: 'dsa_strings_04',
    topicId: 'strings',
    order: 4,
    title: 'First Unique Character in a String',
    difficulty: 'Easy',
    tags: ['String', 'Hash Table', 'Queue'],
    statement: `Given a string \`s\`, find the first non-repeating character in it and return its **0-based index**. If it does not exist, return \`-1\`.`,
    constraints: [
      '1 <= s.length <= 10^5',
      's consists of only lowercase English letters.'
    ],
    examples: [
      {
        input: 'leetcode',
        displayInput: 's = "leetcode"',
        output: '0',
        displayOutput: '0',
        explanation: 'Character \'l\' at index 0 is the first non-repeating character.'
      },
      {
        input: 'loveleetcode',
        displayInput: 's = "loveleetcode"',
        output: '2',
        displayOutput: '2',
        explanation: '\'v\' at index 2 is the first unique character.'
      },
      {
        input: 'aabb',
        displayInput: 's = "aabb"',
        output: '-1',
        displayOutput: '-1',
        explanation: 'All characters repeat.'
      }
    ],
    hints: [
      'Count frequencies of each character using a dictionary or frequency array.',
      'Iterate through the string again; return the index of the first character with frequency 1.'
    ],
    starterCode: {
      python: `import sys\nfrom collections import Counter\n\ndef solve():\n    s = sys.stdin.read().strip()\n    if not s:\n        print("-1"); return\n    counts = Counter(s)\n    for i, c in enumerate(s):\n        if counts[c] == 1:\n            print(i)\n            return\n    print("-1")\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String s = sc.next();\n        int[] f = new int[26];\n        for (char c : s.toCharArray()) f[c - 'a']++;\n        for (int i = 0; i < s.length(); i++) {\n            if (f[s.charAt(i) - 'a'] == 1) { System.out.println(i); return; }\n        }\n        System.out.println(-1);\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s; if (!(cin >> s)) return 0;\n    int f[26] = {0};\n    for (char c : s) f[c - 'a']++;\n    for (int i = 0; i < s.size(); i++) {\n        if (f[s[i] - 'a'] == 1) { cout << i << "\\n"; return 0; }\n    }\n    cout << -1 << "\\n"; return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const s = fs.readFileSync(0, 'utf-8').trim();\n    const f = {};\n    for (const c of s) f[c] = (f[c] || 0) + 1;\n    for (let i = 0; i < s.length; i++) {\n        if (f[s[i]] === 1) { console.log(i); return; }\n    }\n    console.log(-1);\n}\nsolve();`
    },
    sampleInputs: [
      'leetcode',
      'loveleetcode',
      'aabb'
    ],
    hiddenInputs: [
      'z',
      'dddccdbba',
      'placementai'
    ],
    solveFunction: (stdin) => {
      const s = stdin.trim();
      const f = {};
      for (const c of s) f[c] = (f[c] || 0) + 1;
      for (let i = 0; i < s.length; i++) {
        if (f[s[i]] === 1) return String(i);
      }
      return '-1';
    }
  }),

  // 5. Isomorphic Strings (Easy)
  createCanonicalProblem({
    problemId: 'dsa_strings_05',
    topicId: 'strings',
    order: 5,
    title: 'Isomorphic Strings',
    difficulty: 'Easy',
    tags: ['String', 'Hash Table'],
    statement: `Given two strings \`s\` and \`t\`, determine if they are **isomorphic**.

Two strings \`s\` and \`t\` are isomorphic if the characters in \`s\` can be replaced to get \`t\`. All occurrences of a character must be replaced with another character while preserving the order of characters. No two characters may map to the same character, but a character may map to itself.`,
    constraints: [
      '1 <= s.length <= 5 * 10^4',
      't.length == s.length',
      's and t consist of any valid ASCII character.'
    ],
    examples: [
      {
        input: 'egg add',
        displayInput: 's = "egg", t = "add"',
        output: 'true',
        displayOutput: 'true',
        explanation: 'e->a, g->d.'
      },
      {
        input: 'foo bar',
        displayInput: 's = "foo", t = "bar"',
        output: 'false',
        displayOutput: 'false',
        explanation: 'o maps to both a and r.'
      }
    ],
    hints: [
      'Track mapping from s -> t AND from t -> s to ensure bijectivity.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if len(tokens) < 2: print("false"); return\n    s, t = tokens[0], tokens[1]\n    if len(s) != len(t): print("false"); return\n    m_st, m_ts = {}, {}\n    for c1, c2 in zip(s, t):\n        if (c1 in m_st and m_st[c1] != c2) or (c2 in m_ts and m_ts[c2] != c1):\n            print("false"); return\n        m_st[c1] = c2\n        m_ts[c2] = c1\n    print("true")\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String s = sc.next(), t = sc.next();\n        if (s.length() != t.length()) { System.out.println("false"); return; }\n        Map<Character, Character> st = new HashMap<>(), ts = new HashMap<>();\n        for (int i = 0; i < s.length(); i++) {\n            char c1 = s.charAt(i), c2 = t.charAt(i);\n            if ((st.containsKey(c1) && st.get(c1) != c2) || (ts.containsKey(c2) && ts.get(c2) != c1)) {\n                System.out.println("false"); return;\n            }\n            st.put(c1, c2); ts.put(c2, c1);\n        }\n        System.out.println("true");\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\n#include <unordered_map>\nusing namespace std;\nint main() {\n    string s, t; if (!(cin >> s >> t)) return 0;\n    if (s.size() != t.size()) { cout << "false\\n"; return 0; }\n    unordered_map<char, char> st, ts;\n    for (int i = 0; i < s.size(); i++) {\n        char c1 = s[i], c2 = t[i];\n        if ((st.count(c1) && st[c1] != c2) || (ts.count(c2) && ts[c2] != c1)) {\n            cout << "false\\n"; return 0;\n        }\n        st[c1] = c2; ts[c2] = c1;\n    }\n    cout << "true\\n"; return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) { console.log('false'); return; }\n    const s = t[0], r = t[1];\n    if (s.length !== r.length) { console.log('false'); return; }\n    const st = new Map(), ts = new Map();\n    for (let i = 0; i < s.length; i++) {\n        const c1 = s[i], c2 = r[i];\n        if ((st.has(c1) && st.get(c1) !== c2) || (ts.has(c2) && ts.get(c2) !== c1)) {\n            console.log('false'); return;\n        }\n        st.set(c1, c2); ts.set(c2, c1);\n    }\n    console.log('true');\n}\nsolve();`
    },
    sampleInputs: [
      'egg add',
      'foo bar',
      'paper title'
    ],
    hiddenInputs: [
      'badc baba',
      'ab aa',
      'a a'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      if (tokens.length < 2) return 'false';
      const s = tokens[0], t = tokens[1];
      if (s.length !== t.length) return 'false';
      const st = new Map(), ts = new Map();
      for (let i = 0; i < s.length; i++) {
        const c1 = s[i], c2 = t[i];
        if ((st.has(c1) && st.get(c1) !== c2) || (ts.has(c2) && ts.get(c2) !== c1)) return 'false';
        st.set(c1, c2); ts.set(c2, c1);
      }
      return 'true';
    }
  }),

  // 6. Reverse Words in a String (Easy)
  createCanonicalProblem({
    problemId: 'dsa_strings_06',
    topicId: 'strings',
    order: 6,
    title: 'Reverse Words in a String',
    difficulty: 'Easy',
    tags: ['String', 'Two Pointers'],
    statement: `Given an input string \`s\`, reverse the order of the **words**.

A **word** is defined as a sequence of non-space characters. The words in \`s\` will be separated by at least one space.

Return a string of the words in reverse order concatenated by a single space. Note that \`s\` may contain leading or trailing spaces or multiple spaces between two words. The returned string should only have a single space separating the words.`,
    constraints: [
      '1 <= s.length <= 10^4',
      's contains English letters (upper-case and lower-case), digits, and spaces \' \'.'
    ],
    examples: [
      {
        input: 'the sky is blue',
        displayInput: 's = "the sky is blue"',
        output: 'blue is sky the',
        displayOutput: '"blue is sky the"',
        explanation: 'Words reversed.'
      },
      {
        input: '  hello world  ',
        displayInput: 's = "  hello world  "',
        output: 'world hello',
        displayOutput: '"world hello"',
        explanation: 'Reversed without extra leading or trailing spaces.'
      }
    ],
    hints: [
      'Split by whitespace to eliminate multiple spaces.',
      'Reverse the list of tokens and join with a single space.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    words = sys.stdin.read().split()\n    print(" ".join(reversed(words)))\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        List<String> w = new ArrayList<>();\n        while (sc.hasNext()) w.add(sc.next());\n        Collections.reverse(w);\n        System.out.println(String.join(" ", w));\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\nint main() {\n    string word; vector<string> words;\n    while (cin >> word) words.push_back(word);\n    for (int i = (int)words.size() - 1; i >= 0; i--) {\n        cout << words[i] << (i == 0 ? "" : " ");\n    }\n    cout << "\\n"; return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const w = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/).filter(Boolean);\n    console.log(w.reverse().join(' '));\n}\nsolve();`
    },
    sampleInputs: [
      'the sky is blue',
      '  hello world  ',
      'a good   example'
    ],
    hiddenInputs: [
      'singleword',
      '   spaces   everywhere   here   ',
      'PlacementAI is awesome'
    ],
    solveFunction: (stdin) => {
      const words = stdin.trim().split(/\s+/).filter(Boolean);
      return words.reverse().join(' ');
    }
  }),

  // 7. Defanging an IP Address (Easy)
  createCanonicalProblem({
    problemId: 'dsa_strings_07',
    topicId: 'strings',
    order: 7,
    title: 'Defanging an IP Address',
    difficulty: 'Easy',
    tags: ['String'],
    statement: `Given a valid (IPv4) IP \`address\`, return a defanged version of that IP address.

A **defanged IP address** replaces every period \`"."\` with \`"[.]"\`.`,
    constraints: [
      'The given address is a valid IPv4 address.'
    ],
    examples: [
      {
        input: '1.1.1.1',
        displayInput: 'address = "1.1.1.1"',
        output: '1[.]1[.]1[.]1',
        displayOutput: '"1[.]1[.]1[.]1"',
        explanation: 'Each period is replaced by [.]'
      },
      {
        input: '255.100.50.0',
        displayInput: 'address = "255.100.50.0"',
        output: '255[.]100[.]50[.]0',
        displayOutput: '"255[.]100[.]50[.]0"',
        explanation: 'Each period is defanged.'
      }
    ],
    hints: [
      'Iterate through the string or use string replacement: `s.replace(".", "[.]")`.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    ip = sys.stdin.read().strip()\n    print(ip.replace(".", "[.]"))\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        System.out.println(sc.next().replace(".", "[.]"));\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s; if (!(cin >> s)) return 0;\n    string res = "";\n    for (char c : s) if (c == '.') res += "[.]"; else res += c;\n    cout << res << "\\n"; return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const ip = fs.readFileSync(0, 'utf-8').trim();\n    console.log(ip.split('.').join('[.]'));\n}\nsolve();`
    },
    sampleInputs: [
      '1.1.1.1',
      '255.100.50.0'
    ],
    hiddenInputs: [
      '192.168.1.1',
      '127.0.0.1',
      '10.0.0.1'
    ],
    solveFunction: (stdin) => stdin.trim().split('.').join('[.]')
  }),

  // 8. Valid Parentheses String (Easy)
  createCanonicalProblem({
    problemId: 'dsa_strings_08',
    topicId: 'strings',
    order: 8,
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    tags: ['String', 'Stack'],
    statement: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

Print \`true\` or \`false\`.`,
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.'
    ],
    examples: [
      {
        input: '()[]{}',
        displayInput: 's = "()[]{}"',
        output: 'true',
        displayOutput: 'true',
        explanation: 'All brackets open and close validly.'
      },
      {
        input: '(]',
        displayInput: 's = "(]"',
        output: 'false',
        displayOutput: 'false',
        explanation: 'Mismatched closing bracket.'
      }
    ],
    hints: [
      'Push open brackets onto a stack. When seeing a closing bracket, check if stack top matches it.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    s = sys.stdin.read().strip()\n    pairs = {')': '(', '}': '{', ']': '['}\n    stack = []\n    for c in s:\n        if c in '({[':\n            stack.append(c)\n        elif c in pairs:\n            if not stack or stack[-1] != pairs[c]:\n                print("false"); return\n            stack.pop()\n    print("true" if not stack else "false")\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String s = sc.next();\n        Stack<Character> st = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(') st.push(')');\n            else if (c == '{') st.push('}');\n            else if (c == '[') st.push(']');\n            else if (st.isEmpty() || st.pop() != c) { System.out.println("false"); return; }\n        }\n        System.out.println(st.isEmpty() ? "true" : "false");\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\n#include <stack>\nusing namespace std;\nint main() {\n    string s; if (!(cin >> s)) return 0;\n    stack<char> st;\n    for (char c : s) {\n        if (c == '(') st.push(')');\n        else if (c == '{') st.push('}');\n        else if (c == '[') st.push(']');\n        else if (st.empty() || st.top() != c) { cout << "false\\n"; return 0; }\n        else st.pop();\n    }\n    cout << (st.empty() ? "true" : "false") << "\\n"; return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const s = fs.readFileSync(0, 'utf-8').trim();\n    const st = [];\n    const pairs = { ')': '(', '}': '{', ']': '[' };\n    for (const c of s) {\n        if (c === '(' || c === '{' || c === '[') st.push(c);\n        else if (pairs[c]) {\n            if (!st.length || st[st.length - 1] !== pairs[c]) { console.log('false'); return; }\n            st.pop();\n        }\n    }\n    console.log(st.length === 0 ? 'true' : 'false');\n}\nsolve();`
    },
    sampleInputs: [
      '()[]{}',
      '(]',
      '([{}])'
    ],
    hiddenInputs: [
      '(',
      ')',
      '{[]}',
      '(((((((((())))))))))'
    ],
    solveFunction: (stdin) => {
      const s = stdin.trim();
      const st = [];
      const pairs = { ')': '(', '}': '{', ']': '[' };
      for (const c of s) {
        if (c === '(' || c === '{' || c === '[') st.push(c);
        else if (pairs[c]) {
          if (!st.length || st[st.length - 1] !== pairs[c]) return 'false';
          st.pop();
        }
      }
      return st.length === 0 ? 'true' : 'false';
    }
  }),

  // 9. Longest Substring Without Repeating Characters (Medium)
  createCanonicalProblem({
    problemId: 'dsa_strings_09',
    topicId: 'strings',
    order: 9,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    tags: ['String', 'Sliding Window', 'Hash Table'],
    statement: `Given a string \`s\`, find the **length of the longest substring** without repeating characters.

A substring is a contiguous non-empty sequence of characters within a string.`,
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    examples: [
      {
        input: 'abcabcbb',
        displayInput: 's = "abcabcbb"',
        output: '3',
        displayOutput: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 'bbbbb',
        displayInput: 's = "bbbbb"',
        output: '1',
        displayOutput: '1',
        explanation: 'The answer is "b", with the length of 1.'
      },
      {
        input: 'pwwkew',
        displayInput: 's = "pwwkew"',
        output: '3',
        displayOutput: '3',
        explanation: 'The answer is "wke", with the length of 3.'
      }
    ],
    hints: [
      'Use a dynamic sliding window `[left, right]`.',
      'Store last seen index of each character. When duplicate occurs, jump `left = max(left, last_seen[char] + 1)`.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    s = sys.stdin.read().rstrip('\\r\\n')\n    last = {}\n    l = 0\n    max_len = 0\n    for r, c in enumerate(s):\n        if c in last and last[c] >= l:\n            l = last[c] + 1\n        last[c] = r\n        max_len = max(max_len, r - l + 1)\n    print(max_len)\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\nimport java.io.*;\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String s = br.readLine();\n        if (s == null) s = "";\n        Map<Character, Integer> last = new HashMap<>();\n        int l = 0, maxLen = 0;\n        for (int r = 0; r < s.length(); r++) {\n            char c = s.charAt(r);\n            if (last.containsKey(c) && last.get(c) >= l) l = last.get(c) + 1;\n            last.put(c, r);\n            maxLen = Math.max(maxLen, r - l + 1);\n        }\n        System.out.println(maxLen);\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    string s; if (!getline(cin, s)) s = "";\n    vector<int> last(256, -1);\n    int l = 0, maxLen = 0;\n    for (int r = 0; r < (int)s.size(); r++) {\n        unsigned char c = s[r];\n        if (last[c] >= l) l = last[c] + 1;\n        last[c] = r;\n        maxLen = max(maxLen, r - l + 1);\n    }\n    cout << maxLen << "\\n"; return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const s = fs.readFileSync(0, 'utf-8').replace(/\\r?\\n$/, '');\n    const last = new Map();\n    let l = 0, maxLen = 0;\n    for (let r = 0; r < s.length; r++) {\n        const c = s[r];\n        if (last.has(c) && last.get(c) >= l) l = last.get(c) + 1;\n        last.set(c, r);\n        maxLen = Math.max(maxLen, r - l + 1);\n    }\n    console.log(maxLen);\n}\nsolve();`
    },
    sampleInputs: [
      'abcabcbb',
      'bbbbb',
      'pwwkew'
    ],
    hiddenInputs: [
      'abcdef',
      'aab',
      'dvdf',
      'tmmzuxt'
    ],
    solveFunction: (stdin) => {
      const s = stdin.replace(/\r?\n$/, '');
      const last = new Map();
      let l = 0, maxLen = 0;
      for (let r = 0; r < s.length; r++) {
        const c = s[r];
        if (last.has(c) && last.get(c) >= l) l = last.get(c) + 1;
        last.set(c, r);
        maxLen = Math.max(maxLen, r - l + 1);
      }
      return String(maxLen);
    }
  }),

  // 10. Longest Palindromic Substring (Medium)
  createCanonicalProblem({
    problemId: 'dsa_strings_10',
    topicId: 'strings',
    order: 10,
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    tags: ['String', 'Dynamic Programming', 'Two Pointers'],
    statement: `Given a string \`s\`, return the **longest palindromic substring** in \`s\`.

If there are multiple answers with the same length, return the one that appears first.`,
    constraints: [
      '1 <= s.length <= 1000',
      's consist of only digits and English letters.'
    ],
    examples: [
      {
        input: 'babad',
        displayInput: 's = "babad"',
        output: 'bab',
        displayOutput: '"bab"',
        explanation: '"aba" is also a valid answer of length 3; "bab" appears first.'
      },
      {
        input: 'cbbd',
        displayInput: 's = "cbbd"',
        output: 'bb',
        displayOutput: '"bb"',
        explanation: '"bb" is the longest palindromic substring.'
      }
    ],
    hints: [
      'Expand around center: every palindrome has either 1 center character (odd length) or 2 center characters (even length).',
      'Check all 2n - 1 centers in O(N^2) time and O(1) space.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    s = sys.stdin.read().strip()\n    if not s: return\n    best = ""\n    for i in range(len(s)):\n        # Odd\n        l, r = i, i\n        while l >= 0 and r < len(s) and s[l] == s[r]:\n            if r - l + 1 > len(best): best = s[l:r+1]\n            l -= 1; r += 1\n        # Even\n        l, r = i, i + 1\n        while l >= 0 and r < len(s) and s[l] == s[r]:\n            if r - l + 1 > len(best): best = s[l:r+1]\n            l -= 1; r += 1\n    print(best)\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String s = sc.next();\n        String best = "";\n        for (int i = 0; i < s.length(); i++) {\n            int l = i, r = i;\n            while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {\n                if (r - l + 1 > best.length()) best = s.substring(l, r + 1);\n                l--; r++;\n            }\n            l = i; r = i + 1;\n            while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {\n                if (r - l + 1 > best.length()) best = s.substring(l, r + 1);\n                l--; r++;\n            }\n        }\n        System.out.println(best);\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s; if (!(cin >> s)) return 0;\n    string best = "";\n    for (int i = 0; i < (int)s.size(); i++) {\n        int l = i, r = i;\n        while (l >= 0 && r < (int)s.size() && s[l] == s[r]) {\n            if (r - l + 1 > (int)best.size()) best = s.substr(l, r - l + 1);\n            l--; r++;\n        }\n        l = i; r = i + 1;\n        while (l >= 0 && r < (int)s.size() && s[l] == s[r]) {\n            if (r - l + 1 > (int)best.size()) best = s.substr(l, r - l + 1);\n            l--; r++;\n        }\n    }\n    cout << best << "\\n"; return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const s = fs.readFileSync(0, 'utf-8').trim();\n    let best = '';\n    for (let i = 0; i < s.length; i++) {\n        let l = i, r = i;\n        while (l >= 0 && r < s.length && s[l] === s[r]) {\n            if (r - l + 1 > best.length) best = s.slice(l, r + 1);\n            l--; r++;\n        }\n        l = i; r = i + 1;\n        while (l >= 0 && r < s.length && s[l] === s[r]) {\n            if (r - l + 1 > best.length) best = s.slice(l, r + 1);\n            l--; r++;\n        }\n    }\n    console.log(best);\n}\nsolve();`
    },
    sampleInputs: [
      'babad',
      'cbbd',
      'a'
    ],
    hiddenInputs: [
      'racecar',
      'noon',
      'forgeeksskeegfor'
    ],
    solveFunction: (stdin) => {
      const s = stdin.trim();
      let best = '';
      for (let i = 0; i < s.length; i++) {
        let l = i, r = i;
        while (l >= 0 && r < s.length && s[l] === s[r]) {
          if (r - l + 1 > best.length) best = s.slice(l, r + 1);
          l--; r++;
        }
        l = i; r = i + 1;
        while (l >= 0 && r < s.length && s[l] === s[r]) {
          if (r - l + 1 > best.length) best = s.slice(l, r + 1);
          l--; r++;
        }
      }
      return best;
    }
  }),

  // 11. String to Integer (atoi) (Medium)
  createCanonicalProblem({
    problemId: 'dsa_strings_11',
    topicId: 'strings',
    order: 11,
    title: 'String to Integer (atoi)',
    difficulty: 'Medium',
    tags: ['String'],
    statement: `Implement the \`myAtoi(string s)\` function, which converts a string to a 32-bit signed integer.

Algorithm:
1. Ignore leading whitespace.
2. Check sign \`'-'\` or \`'+'\` (default positive).
3. Read digits until non-digit or end of string.
4. Clamp to 32-bit signed range: \`[-2^31, 2^31 - 1]\`.`,
    constraints: [
      '0 <= s.length <= 200',
      's consists of English letters, digits, \' \', \'+\', \'-\', and \'.\'.'
    ],
    examples: [
      {
        input: '42',
        displayInput: 's = "42"',
        output: '42',
        displayOutput: '42',
        explanation: 'Integer is 42.'
      },
      {
        input: '   -42',
        displayInput: 's = "   -42"',
        output: '-42',
        displayOutput: '-42',
        explanation: 'Leading spaces ignored, negative sign processed.'
      },
      {
        input: '4193 with words',
        displayInput: 's = "4193 with words"',
        output: '4193',
        displayOutput: '4193',
        explanation: 'Conversion stops at space before \'with\'.'
      }
    ],
    hints: [
      'Be careful of integer overflow when reading digit by digit.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    s = sys.stdin.read().strip()\n    i = 0\n    while i < len(s) and s[i] == ' ': i += 1\n    if i >= len(s): print(0); return\n    sign = 1\n    if s[i] == '-': sign = -1; i += 1\n    elif s[i] == '+': i += 1\n    val = 0\n    while i < len(s) and s[i].isdigit():\n        val = val * 10 + int(s[i])\n        i += 1\n    val *= sign\n    INT_MAX = 2**31 - 1\n    INT_MIN = -2**31\n    if val > INT_MAX: val = INT_MAX\n    if val < INT_MIN: val = INT_MIN\n    print(val)\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.hasNextLine() ? sc.nextLine().trim() : "";\n        int i = 0, n = s.length();\n        while (i < n && s.charAt(i) == ' ') i++;\n        if (i >= n) { System.out.println(0); return; }\n        int sign = 1;\n        if (s.charAt(i) == '-') { sign = -1; i++; }\n        else if (s.charAt(i) == '+') i++;\n        long val = 0;\n        while (i < n && Character.isDigit(s.charAt(i))) {\n            val = val * 10 + (s.charAt(i) - '0');\n            if (sign == 1 && val > Integer.MAX_VALUE) { System.out.println(Integer.MAX_VALUE); return; }\n            if (sign == -1 && -val < Integer.MIN_VALUE) { System.out.println(Integer.MIN_VALUE); return; }\n            i++;\n        }\n        System.out.println((int)(val * sign));\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\n#include <climits>\nusing namespace std;\nint main() {\n    string s; if (!getline(cin, s)) return 0;\n    int i = 0, n = s.size();\n    while (i < n && s[i] == ' ') i++;\n    if (i >= n) { cout << 0 << "\\n"; return 0; }\n    int sign = 1;\n    if (s[i] == '-') { sign = -1; i++; } else if (s[i] == '+') i++;\n    long long val = 0;\n    while (i < n && isdigit(s[i])) {\n        val = val * 10 + (s[i] - '0');\n        if (sign == 1 && val > INT_MAX) { cout << INT_MAX << "\\n"; return 0; }\n        if (sign == -1 && -val < INT_MIN) { cout << INT_MIN << "\\n"; return 0; }\n        i++;\n    }\n    cout << (int)(val * sign) << "\\n"; return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const s = fs.readFileSync(0, 'utf-8').trim();\n    let i = 0;\n    while (i < s.length && s[i] === ' ') i++;\n    if (i >= s.length) { console.log(0); return; }\n    let sign = 1;\n    if (s[i] === '-') { sign = -1; i++; }\n    else if (s[i] === '+') i++;\n    let val = 0;\n    while (i < s.length && s[i] >= '0' && s[i] <= '9') {\n        val = val * 10 + parseInt(s[i], 10);\n        i++;\n    }\n    val *= sign;\n    const INT_MAX = 2147483647, INT_MIN = -2147483648;\n    if (val > INT_MAX) val = INT_MAX;\n    if (val < INT_MIN) val = INT_MIN;\n    console.log(val);\n}\nsolve();`
    },
    sampleInputs: [
      '42',
      '   -42',
      '4193 with words'
    ],
    hiddenInputs: [
      '-91283472332',
      '+1',
      'words and 987',
      '00000-42a1234'
    ],
    solveFunction: (stdin) => {
      const s = stdin.trim();
      let i = 0;
      while (i < s.length && s[i] === ' ') i++;
      if (i >= s.length) return '0';
      let sign = 1;
      if (s[i] === '-') { sign = -1; i++; }
      else if (s[i] === '+') i++;
      let val = 0;
      while (i < s.length && s[i] >= '0' && s[i] <= '9') {
        val = val * 10 + parseInt(s[i], 10);
        i++;
      }
      val *= sign;
      const INT_MAX = 2147483647, INT_MIN = -2147483648;
      if (val > INT_MAX) val = INT_MAX;
      if (val < INT_MIN) val = INT_MIN;
      return String(val);
    }
  }),

  // 12. Group Anagrams (Medium)
  createCanonicalProblem({
    problemId: 'dsa_strings_12',
    topicId: 'strings',
    order: 12,
    title: 'Group Anagrams',
    difficulty: 'Medium',
    tags: ['String', 'Hash Table', 'Sorting'],
    statement: `Given an array of strings \`strs\`, group the **anagrams** together.

Return the **number of anagram groups** formed.`,
    constraints: [
      '1 <= strs.length <= 10^4',
      '0 <= strs[i].length <= 100',
      'strs[i] consists of lowercase English letters.'
    ],
    examples: [
      {
        input: '6\neat tea tan ate nat bat',
        displayInput: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '3',
        displayOutput: '3',
        explanation: '3 groups: ["bat"], ["nat","tan"], ["ate","eat","tea"].'
      },
      {
        input: '1\na',
        displayInput: 'strs = ["a"]',
        output: '1',
        displayOutput: '1',
        explanation: '1 group.'
      }
    ],
    hints: [
      'Use a HashMap where the key is the sorted character signature of each word.'
    ],
    starterCode: {
      python: `import sys\nfrom collections import defaultdict\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    strs = tokens[1:n+1]\n    groups = defaultdict(list)\n    for w in strs:\n        groups["".join(sorted(w))].append(w)\n    print(len(groups))\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        Map<String, List<String>> map = new HashMap<>();\n        for (int i = 0; i < n; i++) {\n            String s = sc.next();\n            char[] c = s.toCharArray(); Arrays.sort(c);\n            String key = new String(c);\n            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);\n        }\n        System.out.println(map.size());\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\n#include <vector>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    unordered_map<string, vector<string>> mp;\n    for (int i = 0; i < n; i++) {\n        string s; cin >> s;\n        string key = s; sort(key.begin(), key.end());\n        mp[key].push_back(s);\n    }\n    cout << mp.size() << "\\n"; return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (!t || t.length < 2) return;\n    const n = parseInt(t[0], 10);\n    const mp = new Map();\n    for (let i = 1; i <= n; i++) {\n        const key = t[i].split('').sort().join('');\n        mp.set(key, (mp.get(key) || 0) + 1);\n    }\n    console.log(mp.size);\n}\nsolve();`
    },
    sampleInputs: [
      '6\neat tea tan ate nat bat',
      '1\na',
      '2\na b'
    ],
    hiddenInputs: [
      '5\nabc cba bca xyz zyx',
      '4\nrat tar art car',
      '3\nlisten silent enlist'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const map = new Map();
      for (let i = 1; i <= n; i++) {
        const key = tokens[i].split('').sort().join('');
        map.set(key, true);
      }
      return String(map.size);
    }
  }),

  // 13. Decode String (Medium)
  createCanonicalProblem({
    problemId: 'dsa_strings_13',
    topicId: 'strings',
    order: 13,
    title: 'Decode String',
    difficulty: 'Medium',
    tags: ['String', 'Stack', 'Recursion'],
    statement: `Given an encoded string, return its decoded string.

The encoding rule is: \`k[encoded_string]\`, where the \`encoded_string\` inside the square brackets is being repeated exactly \`k\` times. Note that \`k\` is guaranteed to be a positive integer.`,
    constraints: [
      '1 <= s.length <= 30',
      's consists of lowercase English letters, digits, and square brackets \'[]\'.'
    ],
    examples: [
      {
        input: '3[a]2[bc]',
        displayInput: 's = "3[a]2[bc]"',
        output: 'aaabcbc',
        displayOutput: '"aaabcbc"',
        explanation: '3 a\'s followed by 2 bc\'s.'
      },
      {
        input: '3[a2[c]]',
        displayInput: 's = "3[a2[c]]"',
        output: 'accaccacc',
        displayOutput: '"accaccacc"',
        explanation: 'a2[c] -> acc repeated 3 times.'
      }
    ],
    hints: [
      'Use two stacks: one for counts (multipliers) and one for string buffers.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    s = sys.stdin.read().strip()\n    stack = [["", 1]]\n    d = 0\n    for c in s:\n        if c.isdigit():\n            d = d * 10 + int(c)\n        elif c == '[':\n            stack.append(["", d])\n            d = 0\n        elif c == ']':\n            sub, k = stack.pop()\n            stack[-1][0] += sub * k\n        else:\n            stack[-1][0] += c\n    print(stack[0][0])\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String s = sc.next();\n        Stack<Integer> numSt = new Stack<>();\n        Stack<StringBuilder> strSt = new Stack<>();\n        StringBuilder cur = new StringBuilder();\n        int k = 0;\n        for (char c : s.toCharArray()) {\n            if (Character.isDigit(c)) k = k * 10 + (c - '0');\n            else if (c == '[') {\n                numSt.push(k); strSt.push(cur);\n                cur = new StringBuilder(); k = 0;\n            } else if (c == ']') {\n                StringBuilder temp = cur;\n                cur = strSt.pop();\n                int times = numSt.pop();\n                while (times-- > 0) cur.append(temp);\n            } else cur.append(c);\n        }\n        System.out.println(cur.toString());\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\n#include <stack>\nusing namespace std;\nint main() {\n    string s; if (!(cin >> s)) return 0;\n    stack<int> numSt;\n    stack<string> strSt;\n    string cur = ""; int k = 0;\n    for (char c : s) {\n        if (isdigit(c)) k = k * 10 + (c - '0');\n        else if (c == '[') { numSt.push(k); strSt.push(cur); cur = ""; k = 0; }\n        else if (c == ']') {\n            string prev = strSt.top(); strSt.pop();\n            int count = numSt.top(); numSt.pop();\n            while (count--) prev += cur;\n            cur = prev;\n        } else cur += c;\n    }\n    cout << cur << "\\n"; return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const s = fs.readFileSync(0, 'utf-8').trim();\n    const st = [['', 1]];\n    let d = 0;\n    for (const c of s) {\n        if (c >= '0' && c <= '9') d = d * 10 + parseInt(c, 10);\n        else if (c === '[') { st.push(['', d]); d = 0; }\n        else if (c === ']') {\n            const [sub, k] = st.pop();\n            st[st.length - 1][0] += sub.repeat(k);\n        } else st[st.length - 1][0] += c;\n    }\n    console.log(st[0][0]);\n}\nsolve();`
    },
    sampleInputs: [
      '3[a]2[bc]',
      '3[a2[c]]',
      '2[abc]3[cd]ef'
    ],
    hiddenInputs: [
      '1[a]',
      '10[x]',
      '2[2[y]]'
    ],
    solveFunction: (stdin) => {
      const s = stdin.trim();
      const st = [['', 1]];
      let d = 0;
      for (const c of s) {
        if (c >= '0' && c <= '9') d = d * 10 + parseInt(c, 10);
        else if (c === '[') { st.push(['', d]); d = 0; }
        else if (c === ']') {
          const [sub, k] = st.pop();
          st[st.length - 1][0] += sub.repeat(k);
        } else st[st.length - 1][0] += c;
      }
      return st[0][0];
    }
  }),

  // 14. Multiply Strings (Medium)
  createCanonicalProblem({
    problemId: 'dsa_strings_14',
    topicId: 'strings',
    order: 14,
    title: 'Multiply Strings',
    difficulty: 'Medium',
    tags: ['String', 'Math', 'Simulation'],
    statement: `Given two non-negative integers \`num1\` and \`num2\` represented as strings, return the product of \`num1\` and \`num2\`, also represented as a string.

**Note:** You must not use any built-in BigInteger library or convert the inputs to integer directly.`,
    constraints: [
      '1 <= num1.length, num2.length <= 200',
      'num1 and num2 consist of digits only.',
      'Both num1 and num2 do not contain any leading zero, except the number 0 itself.'
    ],
    examples: [
      {
        input: '2 3',
        displayInput: 'num1 = "2", num2 = "3"',
        output: '6',
        displayOutput: '"6"',
        explanation: '2 * 3 = 6.'
      },
      {
        input: '123 456',
        displayInput: 'num1 = "123", num2 = "456"',
        output: '56088',
        displayOutput: '"56088"',
        explanation: '123 * 456 = 56088.'
      }
    ],
    hints: [
      'Digit multiplication `num1[i] * num2[j]` affects indices `i + j` and `i + j + 1` in an array of size m + n.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if len(tokens) < 2: return\n    n1, n2 = tokens[0], tokens[1]\n    if n1 == '0' or n2 == '0': print("0"); return\n    res = [0] * (len(n1) + len(n2))\n    for i in range(len(n1) - 1, -1, -1):\n        for j in range(len(n2) - 1, -1, -1):\n            mul = int(n1[i]) * int(n2[j])\n            p1, p2 = i + j, i + j + 1\n            s = mul + res[p2]\n            res[p2] = s % 10\n            res[p1] += s // 10\n    start = 0\n    while start < len(res) and res[start] == 0: start += 1\n    print("".join(map(str, res[start:])))\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String n1 = sc.next(), n2 = sc.next();\n        if (n1.equals("0") || n2.equals("0")) { System.out.println("0"); return; }\n        int m = n1.length(), n = n2.length();\n        int[] pos = new int[m + n];\n        for (int i = m - 1; i >= 0; i--) {\n            for (int j = n - 1; j >= 0; j--) {\n                int mul = (n1.charAt(i) - '0') * (n2.charAt(j) - '0');\n                int p1 = i + j, p2 = i + j + 1;\n                int sum = mul + pos[p2];\n                pos[p2] = sum % 10;\n                pos[p1] += sum / 10;\n            }\n        }\n        StringBuilder sb = new StringBuilder();\n        for (int p : pos) if (!(sb.length() == 0 && p == 0)) sb.append(p);\n        System.out.println(sb.length() == 0 ? "0" : sb.toString());\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\nint main() {\n    string n1, n2; if (!(cin >> n1 >> n2)) return 0;\n    if (n1 == "0" || n2 == "0") { cout << "0\\n"; return 0; }\n    vector<int> res(n1.size() + n2.size(), 0);\n    for (int i = (int)n1.size() - 1; i >= 0; i--) {\n        for (int j = (int)n2.size() - 1; j >= 0; j--) {\n            int mul = (n1[i] - '0') * (n2[j] - '0');\n            int p1 = i + j, p2 = i + j + 1;\n            int sum = mul + res[p2];\n            res[p2] = sum % 10;\n            res[p1] += sum / 10;\n        }\n    }\n    string ans = "";\n    for (int x : res) if (!(ans.empty() && x == 0)) ans += to_string(x);\n    cout << (ans.empty() ? "0" : ans) << "\\n"; return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const [n1, n2] = t;\n    if (n1 === '0' || n2 === '0') { console.log('0'); return; }\n    const res = new Array(n1.length + n2.length).fill(0);\n    for (let i = n1.length - 1; i >= 0; i--) {\n        for (let j = n2.length - 1; j >= 0; j--) {\n            const mul = parseInt(n1[i], 10) * parseInt(n2[j], 10);\n            const p1 = i + j, p2 = i + j + 1;\n            const sum = mul + res[p2];\n            res[p2] = sum % 10;\n            res[p1] += Math.floor(sum / 10);\n        }\n    }\n    while (res[0] === 0) res.shift();\n    console.log(res.join(''));\n}\nsolve();`
    },
    sampleInputs: [
      '2 3',
      '123 456'
    ],
    hiddenInputs: [
      '0 52',
      '99 99',
      '1000 1000'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const [n1, n2] = tokens;
      return String(BigInt(n1) * BigInt(n2));
    }
  }),

  // 15. Repeated DNA Sequences (Medium)
  createCanonicalProblem({
    problemId: 'dsa_strings_15',
    topicId: 'strings',
    order: 15,
    title: 'Repeated DNA Sequences',
    difficulty: 'Medium',
    tags: ['String', 'Hash Table', 'Bit Manipulation', 'Sliding Window'],
    statement: `The DNA sequence is composed of a series of nucleotides abbreviated as \`'A'\`, \`'C'\`, \`'G'\`, and \`'T'\`.

Given a string \`s\` that represents a DNA sequence, return all the **10-letter-long sequences (substrings)** that occur more than once in a DNA molecule.

Print the count of unique repeated 10-letter substrings.`,
    constraints: [
      '1 <= s.length <= 10^5',
      's[i] is either \'A\', \'C\', \'G\', or \'T\'.'
    ],
    examples: [
      {
        input: 'AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT',
        displayInput: 's = "AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT"',
        output: '2',
        displayOutput: '2',
        explanation: 'Repeated sequences: "AAAAACCCCC" and "CCCCCAAAAA". Count = 2.'
      },
      {
        input: 'AAAAAAAAAAAAA',
        displayInput: 's = "AAAAAAAAAAAAA"',
        output: '1',
        displayOutput: '1',
        explanation: '"AAAAAAAAAA" repeats. Count = 1.'
      }
    ],
    hints: [
      'Use a sliding window of length 10.',
      'Maintain two HashSets: `seen` and `repeated`.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    s = sys.stdin.read().strip()\n    seen = set()\n    repeated = set()\n    for i in range(len(s) - 9):\n        sub = s[i:i+10]\n        if sub in seen: repeated.add(sub)\n        else: seen.add(sub)\n    print(len(repeated))\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String s = sc.next();\n        Set<String> seen = new HashSet<>(), rep = new HashSet<>();\n        for (int i = 0; i <= s.length() - 10; i++) {\n            String sub = s.substring(i, i + 10);\n            if (seen.contains(sub)) rep.add(sub);\n            else seen.add(sub);\n        }\n        System.out.println(rep.size());\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\n#include <unordered_set>\nusing namespace std;\nint main() {\n    string s; if (!(cin >> s)) return 0;\n    unordered_set<string> seen, rep;\n    for (int i = 0; i + 9 < (int)s.size(); i++) {\n        string sub = s.substr(i, 10);\n        if (seen.count(sub)) rep.insert(sub);\n        else seen.insert(sub);\n    }\n    cout << rep.size() << "\\n"; return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const s = fs.readFileSync(0, 'utf-8').trim();\n    const seen = new Set(), rep = new Set();\n    for (let i = 0; i <= s.length - 10; i++) {\n        const sub = s.slice(i, i + 10);\n        if (seen.has(sub)) rep.add(sub);\n        else seen.add(sub);\n    }\n    console.log(rep.size);\n}\nsolve();`
    },
    sampleInputs: [
      'AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT',
      'AAAAAAAAAAAAA',
      'ACGTACGT'
    ],
    hiddenInputs: [
      'AAAAAAAAAAA',
      'CCCCCCCCCCGGGGGGGGGGCCCCCCCCCC',
      'AGCTAGCTAGCTAGCT'
    ],
    solveFunction: (stdin) => {
      const s = stdin.trim();
      const seen = new Set(), rep = new Set();
      for (let i = 0; i <= s.length - 10; i++) {
        const sub = s.slice(i, i + 10);
        if (seen.has(sub)) rep.add(sub);
        else seen.add(sub);
      }
      return String(rep.size);
    }
  }),

  // 16. Count and Say (Medium)
  createCanonicalProblem({
    problemId: 'dsa_strings_16',
    topicId: 'strings',
    order: 16,
    title: 'Count and Say',
    difficulty: 'Medium',
    tags: ['String', 'Recursion'],
    statement: `The **count-and-say** sequence is a sequence of digit strings defined by the recursive formula:
- \`countAndSay(1) = "1"\`
- \`countAndSay(n)\` is the run-length encoding of \`countAndSay(n - 1)\`.

Given a positive integer \`n\`, return the \`n-th\` term of the count-and-say sequence.`,
    constraints: [
      '1 <= n <= 30'
    ],
    examples: [
      {
        input: '1',
        displayInput: 'n = 1',
        output: '1',
        displayOutput: '"1"',
        explanation: 'Base case.'
      },
      {
        input: '4',
        displayInput: 'n = 4',
        output: '1211',
        displayOutput: '"1211"',
        explanation: '1 -> 11 ("one 1") -> 21 ("two 1s") -> 1211 ("one 2, one 1").'
      }
    ],
    hints: [
      'Group consecutive identical characters and replace with count + char.'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    n = int(sys.stdin.read().strip())\n    s = "1"\n    for _ in range(n - 1):\n        nxt = []\n        i = 0\n        while i < len(s):\n            c = s[i]\n            count = 0\n            while i < len(s) and s[i] == c:\n                count += 1; i += 1\n            nxt.append(str(count) + c)\n        s = "".join(nxt)\n    print(s)\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        String s = "1";\n        for (int k = 1; k < n; k++) {\n            StringBuilder sb = new StringBuilder();\n            int i = 0;\n            while (i < s.length()) {\n                char c = s.charAt(i);\n                int cnt = 0;\n                while (i < s.length() && s.charAt(i) == c) { cnt++; i++; }\n                sb.append(cnt).append(c);\n            }\n            s = sb.toString();\n        }\n        System.out.println(s);\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    string s = "1";\n    for (int k = 1; k < n; k++) {\n        string nxt = "";\n        int i = 0;\n        while (i < (int)s.size()) {\n            char c = s[i]; int cnt = 0;\n            while (i < (int)s.size() && s[i] == c) { cnt++; i++; }\n            nxt += to_string(cnt) + c;\n        }\n        s = nxt;\n    }\n    cout << s << "\\n"; return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const n = parseInt(fs.readFileSync(0, 'utf-8').trim(), 10);\n    let s = '1';\n    for (let k = 1; k < n; k++) {\n        let nxt = '', i = 0;\n        while (i < s.length) {\n            const c = s[i]; let cnt = 0;\n            while (i < s.length && s[i] === c) { cnt++; i++; }\n            nxt += String(cnt) + c;\n        }\n        s = nxt;\n    }\n    console.log(s);\n}\nsolve();`
    },
    sampleInputs: [
      '1',
      '4',
      '5'
    ],
    hiddenInputs: [
      '2',
      '3',
      '6',
      '7'
    ],
    solveFunction: (stdin) => {
      const n = parseInt(stdin.trim(), 10);
      let s = '1';
      for (let k = 1; k < n; k++) {
        let nxt = '', i = 0;
        while (i < s.length) {
          const c = s[i]; let cnt = 0;
          while (i < s.length && s[i] === c) { cnt++; i++; }
          nxt += String(cnt) + c;
        }
        s = nxt;
      }
      return s;
    }
  }),

  // 17. Minimum Window Substring (Hard)
  createCanonicalProblem({
    problemId: 'dsa_strings_17',
    topicId: 'strings',
    order: 17,
    title: 'Minimum Window Substring',
    difficulty: 'Hard',
    tags: ['String', 'Sliding Window', 'Hash Table'],
    statement: `Given two strings \`s\` and \`t\` of lengths \`m\` and \`n\` respectively, return the **minimum window substring** of \`s\` such that every character in \`t\` (including duplicates) is included in the window.

If there is no such substring, return the empty string \`""\`.`,
    constraints: [
      'm == s.length',
      'n == t.length',
      '1 <= m, n <= 10^5',
      's and t consist of uppercase and lowercase English letters.'
    ],
    examples: [
      {
        input: 'ADOBECODEBANC ABC',
        displayInput: 's = "ADOBECODEBANC", t = "ABC"',
        output: 'BANC',
        displayOutput: '"BANC"',
        explanation: 'The minimum window substring "BANC" includes \'A\', \'B\', and \'C\' from string t.'
      },
      {
        input: 'a a',
        displayInput: 's = "a", t = "a"',
        output: 'a',
        displayOutput: '"a"',
        explanation: 'Entire string matches.'
      }
    ],
    hints: [
      'Use a sliding window with two pointers: expand right until window is valid, contract left while window remains valid.'
    ],
    starterCode: {
      python: `import sys\nfrom collections import Counter\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if len(tokens) < 2: return\n    s, t = tokens[0], tokens[1]\n    target = Counter(t)\n    required = len(target)\n    window = {}\n    formed = 0\n    l = 0\n    ans = (float('inf'), 0, 0)\n    for r, c in enumerate(s):\n        window[c] = window.get(c, 0) + 1\n        if c in target and window[c] == target[c]: formed += 1\n        while l <= r and formed == required:\n            if r - l + 1 < ans[0]: ans = (r - l + 1, l, r)\n            window[s[l]] -= 1\n            if s[l] in target and window[s[l]] < target[s[l]]: formed -= 1\n            l += 1\n    print(s[ans[1]:ans[2]+1] if ans[0] != float('inf') else "")\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String s = sc.next(), t = sc.next();\n        int[] target = new int[128];\n        for (char c : t.toCharArray()) target[c]++;\n        int count = t.length(), l = 0, minLen = Integer.MAX_VALUE, start = 0;\n        for (int r = 0; r < s.length(); r++) {\n            if (target[s.charAt(r)]-- > 0) count--;\n            while (count == 0) {\n                if (r - l + 1 < minLen) { minLen = r - l + 1; start = l; }\n                if (++target[s.charAt(l++)] > 0) count++;\n            }\n        }\n        System.out.println(minLen == Integer.MAX_VALUE ? "" : s.substring(start, start + minLen));\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\nint main() {\n    string s, t; if (!(cin >> s >> t)) return 0;\n    vector<int> target(128, 0);\n    for (char c : t) target[c]++;\n    int count = t.size(), l = 0, minLen = 1e9, start = 0;\n    for (int r = 0; r < (int)s.size(); r++) {\n        if (target[s[r]]-- > 0) count--;\n        while (count == 0) {\n            if (r - l + 1 < minLen) { minLen = r - l + 1; start = l; }\n            if (++target[s[l++]] > 0) count++;\n        }\n    }\n    cout << (minLen == 1e9 ? "" : s.substr(start, minLen)) << "\\n"; return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (tokens.length < 2) return;\n    const [s, t] = tokens;\n    const target = new Map();\n    for (const c of t) target.set(c, (target.get(c) || 0) + 1);\n    let count = t.length, l = 0, minLen = Infinity, start = 0;\n    for (let r = 0; r < s.length; r++) {\n        const c = s[r];\n        if (target.has(c)) {\n            if (target.get(c) > 0) count--;\n            target.set(c, target.get(c) - 1);\n        }\n        while (count === 0) {\n            if (r - l + 1 < minLen) { minLen = r - l + 1; start = l; }\n            const leftC = s[l];\n            if (target.has(leftC)) {\n                target.set(leftC, target.get(leftC) + 1);\n                if (target.get(leftC) > 0) count++;\n            }\n            l++;\n        }\n    }\n    console.log(minLen === Infinity ? '' : s.slice(start, start + minLen));\n}\nsolve();`
    },
    sampleInputs: [
      'ADOBECODEBANC ABC',
      'a a',
      'a aa'
    ],
    hiddenInputs: [
      'ab a',
      'cabwefgewcwaefgcf cae',
      'XYZ Y'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const [s, t] = tokens;
      const target = new Map();
      for (const c of t) target.set(c, (target.get(c) || 0) + 1);
      let count = t.length, l = 0, minLen = Infinity, start = 0;
      for (let r = 0; r < s.length; r++) {
        const c = s[r];
        if (target.has(c)) {
          if (target.get(c) > 0) count--;
          target.set(c, target.get(c) - 1);
        }
        while (count === 0) {
          if (r - l + 1 < minLen) { minLen = r - l + 1; start = l; }
          const leftC = s[l];
          if (target.has(leftC)) {
            target.set(leftC, target.get(leftC) + 1);
            if (target.get(leftC) > 0) count++;
          }
          l++;
        }
      }
      return minLen === Infinity ? '' : s.slice(start, start + minLen);
    }
  }),

  // 18. Edit Distance (Hard)
  createCanonicalProblem({
    problemId: 'dsa_strings_18',
    topicId: 'strings',
    order: 18,
    title: 'Edit Distance',
    difficulty: 'Hard',
    tags: ['String', 'Dynamic Programming'],
    statement: `Given two strings \`word1\` and \`word2\`, return the **minimum number of operations** required to convert \`word1\` to \`word2\`.

You have the following three operations permitted on a word:
1. Insert a character
2. Delete a character
3. Replace a character`,
    constraints: [
      '0 <= word1.length, word2.length <= 500',
      'word1 and word2 consist of lowercase English letters.'
    ],
    examples: [
      {
        input: 'horse ros',
        displayInput: 'word1 = "horse", word2 = "ros"',
        output: '3',
        displayOutput: '3',
        explanation: 'horse -> rorse (replace \'h\' with \'r\') -> rose (remove \'r\') -> ros (remove \'e\').'
      },
      {
        input: 'intention execution',
        displayInput: 'word1 = "intention", word2 = "execution"',
        output: '5',
        displayOutput: '5',
        explanation: '5 operations.'
      }
    ],
    hints: [
      'DP table dp[i][j] = min operations to convert word1[0..i] to word2[0..j].',
      'If word1[i-1] == word2[j-1], dp[i][j] = dp[i-1][j-1]. Else 1 + min(insert, delete, replace).'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if len(tokens) < 2: print(0); return\n    w1, w2 = tokens[0], tokens[1]\n    m, n = len(w1), len(w2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(m + 1): dp[i][0] = i\n    for j in range(n + 1): dp[0][j] = j\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if w1[i-1] == w2[j-1]: dp[i][j] = dp[i-1][j-1]\n            else: dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])\n    print(dp[m][n])\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String w1 = sc.next(), w2 = sc.next();\n        int m = w1.length(), n = w2.length();\n        int[][] dp = new int[m + 1][n + 1];\n        for (int i = 0; i <= m; i++) dp[i][0] = i;\n        for (int j = 0; j <= n; j++) dp[0][j] = j;\n        for (int i = 1; i <= m; i++) {\n            for (int j = 1; j <= n; j++) {\n                if (w1.charAt(i - 1) == w2.charAt(j - 1)) dp[i][j] = dp[i - 1][j - 1];\n                else dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], Math.min(dp[i - 1][j], dp[i][j - 1]));\n            }\n        }\n        System.out.println(dp[m][n]);\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    string w1, w2; if (!(cin >> w1 >> w2)) return 0;\n    int m = w1.size(), n = w2.size();\n    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));\n    for (int i = 0; i <= m; i++) dp[i][0] = i;\n    for (int j = 0; j <= n; j++) dp[0][j] = j;\n    for (int i = 1; i <= m; i++) {\n        for (int j = 1; j <= n; j++) {\n            if (w1[i - 1] == w2[j - 1]) dp[i][j] = dp[i - 1][j - 1];\n            else dp[i][j] = 1 + min({dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]});\n        }\n    }\n    cout << dp[m][n] << "\\n"; return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) { console.log(0); return; }\n    const [w1, w2] = t;\n    const m = w1.length, n = w2.length;\n    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n    for (let i = 0; i <= m; i++) dp[i][0] = i;\n    for (let j = 0; j <= n; j++) dp[0][j] = j;\n    for (let i = 1; i <= m; i++) {\n        for (let j = 1; j <= n; j++) {\n            if (w1[i - 1] === w2[j - 1]) dp[i][j] = dp[i - 1][j - 1];\n            else dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);\n        }\n    }\n    console.log(dp[m][n]);\n}\nsolve();`
    },
    sampleInputs: [
      'horse ros',
      'intention execution',
      'zoologico zoology'
    ],
    hiddenInputs: [
      'a b',
      'plasma altamira',
      'sea eat'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const [w1, w2] = tokens;
      const m = w1.length, n = w2.length;
      const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
      for (let i = 0; i <= m; i++) dp[i][0] = i;
      for (let j = 0; j <= n; j++) dp[0][j] = j;
      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          if (w1[i - 1] === w2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
          else dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
        }
      }
      return String(dp[m][n]);
    }
  }),

  // 19. Regular Expression Matching (Hard)
  createCanonicalProblem({
    problemId: 'dsa_strings_19',
    topicId: 'strings',
    order: 19,
    title: 'Regular Expression Matching',
    difficulty: 'Hard',
    tags: ['String', 'Dynamic Programming', 'Recursion'],
    statement: `Given an input string \`s\` and a pattern \`p\`, implement regular expression matching with support for \`'.'\` and \`'*'\` where:
- \`'.'\` Matches any single character.
- \`'*'\` Matches zero or more of the preceding element.

The matching should cover the entire input string (not partial). Print \`true\` or \`false\`.`,
    constraints: [
      '1 <= s.length <= 20',
      '1 <= p.length <= 30',
      's contains only lowercase English letters.',
      'p contains only lowercase English letters, \'.\', and \'*\'.'
    ],
    examples: [
      {
        input: 'aa a*',
        displayInput: 's = "aa", p = "a*"',
        output: 'true',
        displayOutput: 'true',
        explanation: '\'*\' means zero or more of \'a\', matches "aa".'
      },
      {
        input: 'ab .*',
        displayInput: 's = "ab", p = ".*"',
        output: 'true',
        displayOutput: 'true',
        explanation: '".*" matches zero or more of any character.'
      }
    ],
    hints: [
      'Use 2D Dynamic Programming: `dp[i][j]` indicates if s[i:] matches p[j:].'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if len(tokens) < 2: return\n    s, p = tokens[0], tokens[1]\n    dp = [[False] * (len(p) + 1) for _ in range(len(s) + 1)]\n    dp[0][0] = True\n    for j in range(2, len(p) + 1):\n        if p[j-1] == '*': dp[0][j] = dp[0][j-2]\n    for i in range(1, len(s) + 1):\n        for j in range(1, len(p) + 1):\n            if p[j-1] == '*':\n                dp[i][j] = dp[i][j-2] or (dp[i-1][j] and (p[j-2] == '.' or p[j-2] == s[i-1]))\n            else:\n                dp[i][j] = dp[i-1][j-1] and (p[j-1] == '.' or p[j-1] == s[i-1])\n    print("true" if dp[len(s)][len(p)] else "false")\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String s = sc.next(), p = sc.next();\n        int m = s.length(), n = p.length();\n        boolean[][] dp = new boolean[m + 1][n + 1];\n        dp[0][0] = true;\n        for (int j = 2; j <= n; j++) if (p.charAt(j - 1) == '*') dp[0][j] = dp[0][j - 2];\n        for (int i = 1; i <= m; i++) {\n            for (int j = 1; j <= n; j++) {\n                if (p.charAt(j - 1) == '*') {\n                    dp[i][j] = dp[i][j - 2] || (dp[i - 1][j] && (p.charAt(j - 2) == '.' || p.charAt(j - 2) == s.charAt(i - 1)));\n                } else {\n                    dp[i][j] = dp[i - 1][j - 1] && (p.charAt(j - 1) == '.' || p.charAt(j - 1) == s.charAt(i - 1));\n                }\n            }\n        }\n        System.out.println(dp[m][n] ? "true" : "false");\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\nint main() {\n    string s, p; if (!(cin >> s >> p)) return 0;\n    int m = s.size(), n = p.size();\n    vector<vector<bool>> dp(m + 1, vector<bool>(n + 1, false));\n    dp[0][0] = true;\n    for (int j = 2; j <= n; j++) if (p[j - 1] == '*') dp[0][j] = dp[0][j - 2];\n    for (int i = 1; i <= m; i++) {\n        for (int j = 1; j <= n; j++) {\n            if (p[j - 1] == '*') {\n                dp[i][j] = dp[i][j - 2] || (dp[i - 1][j] && (p[j - 2] == '.' || p[j - 2] == s[i - 1]));\n            } else {\n                dp[i][j] = dp[i - 1][j - 1] && (p[j - 1] == '.' || p[j - 1] == s[i - 1]);\n            }\n        }\n    }\n    cout << (dp[m][n] ? "true" : "false") << "\\n"; return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const t = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (t.length < 2) return;\n    const [s, p] = t;\n    const m = s.length, n = p.length;\n    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));\n    dp[0][0] = true;\n    for (let j = 2; j <= n; j++) if (p[j - 1] === '*') dp[0][j] = dp[0][j - 2];\n    for (let i = 1; i <= m; i++) {\n        for (let j = 1; j <= n; j++) {\n            if (p[j - 1] === '*') {\n                dp[i][j] = dp[i][j - 2] || (dp[i - 1][j] && (p[j - 2] === '.' || p[j - 2] === s[i - 1]));\n            } else {\n                dp[i][j] = dp[i - 1][j - 1] && (p[j - 1] === '.' || p[j - 1] === s[i - 1]);\n            }\n        }\n    }\n    console.log(dp[m][n] ? 'true' : 'false');\n}\nsolve();`
    },
    sampleInputs: [
      'aa a*',
      'ab .*',
      'aab c*a*b'
    ],
    hiddenInputs: [
      'mississippi mis*is*p*.',
      'a ab*',
      'aaa aaaa'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const [s, p] = tokens;
      const m = s.length, n = p.length;
      const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
      dp[0][0] = true;
      for (let j = 2; j <= n; j++) if (p[j - 1] === '*') dp[0][j] = dp[0][j - 2];
      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          if (p[j - 1] === '*') {
            dp[i][j] = dp[i][j - 2] || (dp[i - 1][j] && (p[j - 2] === '.' || p[j - 2] === s[i - 1]));
          } else {
            dp[i][j] = dp[i - 1][j - 1] && (p[j - 1] === '.' || p[j - 1] === s[i - 1]);
          }
        }
      }
      return dp[m][n] ? 'true' : 'false';
    }
  }),

  // 20. Distinct Subsequences (Hard)
  createCanonicalProblem({
    problemId: 'dsa_strings_20',
    topicId: 'strings',
    order: 20,
    title: 'Distinct Subsequences',
    difficulty: 'Hard',
    tags: ['String', 'Dynamic Programming'],
    statement: `Given two strings \`s\` and \`t\`, return the **number of distinct subsequences** of \`s\` which equals \`t\`.

The test cases are generated so that the answer fits on a 64-bit signed integer.`,
    constraints: [
      '1 <= s.length, t.length <= 1000',
      's and t consist of English letters.'
    ],
    examples: [
      {
        input: 'rabbbit rabbit',
        displayInput: 's = "rabbbit", t = "rabbit"',
        output: '3',
        displayOutput: '3',
        explanation: 'There are 3 ways to form "rabbit" by removing each of the three \'b\'s.'
      },
      {
        input: 'babgbag bag',
        displayInput: 's = "babgbag", t = "bag"',
        output: '5',
        displayOutput: '5',
        explanation: 'There are 5 distinct subsequences.'
      }
    ],
    hints: [
      'dp[i][j] is the count of subsequences of s[0..i] that equal t[0..j].',
      'If s[i-1] == t[j-1], dp[i][j] = dp[i-1][j-1] + dp[i-1][j]. Else dp[i][j] = dp[i-1][j].'
    ],
    starterCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if len(tokens) < 2: return\n    s, t = tokens[0], tokens[1]\n    m, n = len(s), len(t)\n    dp = [0] * (n + 1)\n    dp[0] = 1\n    for c in s:\n        for j in range(n, 0, -1):\n            if c == t[j-1]: dp[j] += dp[j-1]\n    print(dp[n])\n\nif __name__ == '__main__':\n    solve()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String s = sc.next(), t = sc.next();\n        int m = s.length(), n = t.length();\n        long[] dp = new long[n + 1];\n        dp[0] = 1;\n        for (char c : s.toCharArray()) {\n            for (int j = n; j >= 1; j--) {\n                if (c == t.charAt(j - 1)) dp[j] += dp[j - 1];\n            }\n        }\n        System.out.println(dp[n]);\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\nint main() {\n    string s, t; if (!(cin >> s >> t)) return 0;\n    int n = t.size();\n    vector<unsigned long long> dp(n + 1, 0);\n    dp[0] = 1;\n    for (char c : s) {\n        for (int j = n; j >= 1; j--) {\n            if (c == t[j - 1]) dp[j] += dp[j - 1];\n        }\n    }\n    cout << dp[n] << "\\n"; return 0;\n}`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (tokens.length < 2) return;\n    const [s, t] = tokens;\n    const n = t.length;\n    const dp = new Array(n + 1).fill(0n);\n    dp[0] = 1n;\n    for (const c of s) {\n        for (let j = n; j >= 1; j--) {\n            if (c === t[j - 1]) dp[j] += dp[j - 1];\n        }\n    }\n    console.log(dp[n].toString());\n}\nsolve();`
    },
    sampleInputs: [
      'rabbbit rabbit',
      'babgbag bag'
    ],
    hiddenInputs: [
      'a a',
      'aaa a',
      'abc d'
    ],
    solveFunction: (stdin) => {
      const tokens = stdin.trim().split(/\s+/);
      const [s, t] = tokens;
      const n = t.length;
      const dp = new Array(n + 1).fill(0n);
      dp[0] = 1n;
      for (const c of s) {
        for (let j = n; j >= 1; j--) {
          if (c === t[j - 1]) dp[j] += dp[j - 1];
        }
      }
      return dp[n].toString();
    }
  })
];

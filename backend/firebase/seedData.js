import { FirestoreHelper } from './firestoreHelper.js';

export const seedInitialData = async () => {
  try {
    const existing = await FirestoreHelper.getDoc('companies', 'comp_tcs');
    if (existing) {
      console.log('⚡ Initial data already seeded in database, ready.');
      return;
    }

    // Seed Aptitude Questions
    const aptitudeQuestions = [
      {
        questionId: 'apt_1',
        category: 'Quantitative',
        topic: 'Speed & Distance',
        difficulty: 'Medium',
        timer: 60,
        question: 'A train 240 m long passes a pole in 24 seconds. How long will it take to pass a platform 650 m long?',
        options: ['65 seconds', '89 seconds', '100 seconds', '150 seconds'],
        correctAnswer: '89 seconds'
      },
      {
        questionId: 'apt_2',
        category: 'Quantitative',
        topic: 'Profit & Loss',
        difficulty: 'Easy',
        timer: 45,
        question: 'A shopkeeper sells a product for $120 making a profit of 20%. What was the cost price of the product?',
        options: ['100', '90', '105', '110'],
        correctAnswer: '100'
      },
      {
        questionId: 'apt_3',
        category: 'Logical Reasoning',
        topic: 'Blood Relations',
        difficulty: 'Medium',
        timer: 60,
        question: 'Pointing to a photograph of a boy Suresh said, "He is the son of the only son of my mother." How is Suresh related to that boy?',
        options: ['Brother', 'Uncle', 'Cousin', 'Father'],
        correctAnswer: 'Father'
      },
      {
        questionId: 'apt_4',
        category: 'Verbal Ability',
        topic: 'Synonyms',
        difficulty: 'Easy',
        timer: 30,
        question: 'Choose the word that is nearest in meaning to "PRAGMATIC":',
        options: ['Theoretical', 'Practical', 'Arrogant', 'Optimistic'],
        correctAnswer: 'Practical'
      },
      {
        questionId: 'apt_5',
        category: 'Logical Reasoning',
        topic: 'Number Series',
        difficulty: 'Hard',
        timer: 60,
        question: 'Find the next number in the sequence: 2, 6, 12, 20, 30, ?',
        options: ['40', '42', '44', '48'],
        correctAnswer: '42'
      }
    ];

    for (const q of aptitudeQuestions) {
      await FirestoreHelper.setDoc('aptitude_questions', q.questionId, q);
    }

    // Seed Technical Questions (MCQ & Coding with minimum 3 test cases each)
    const technicalQuestions = [
      {
        questionId: 'tech_mcq_1',
        type: 'MCQ',
        category: 'Data Structures',
        language: 'JavaScript',
        difficulty: 'Medium',
        title: 'Time Complexity of Binary Search',
        question: 'What is the time complexity of searching an element in a balanced Binary Search Tree (BST) in worst case?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
        correctAnswer: 'O(log n)'
      },
      {
        questionId: 'tech_mcq_2',
        type: 'MCQ',
        category: 'Web Development',
        language: 'JavaScript',
        difficulty: 'Easy',
        title: 'Event Loop & Async',
        question: 'Which microtask queue handles promises in Node.js event loop?',
        options: ['Timer queue', 'Check queue', 'Microtask queue / NextTick queue', 'I/O queue'],
        correctAnswer: 'Microtask queue / NextTick queue'
      },
      {
        questionId: 'tech_code_1',
        type: 'Coding',
        category: 'Algorithms',
        language: 'python',
        difficulty: 'Easy',
        title: 'Two Sum Problem',
        description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.',
        starterCode: `def twoSum(nums, target):\n    # Write your solution here\n    pass`,
        starterCodes: {
          python: `def twoSum(nums, target):\n    # Write your solution here\n    pass`,
          java: `public class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        return new int[]{};\n    }\n}`,
          cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your solution here\n        return {};\n    }\n};`,
          javascript: `function twoSum(nums, target) {\n  // Write your solution here\n}`,
          sql: `-- Write your SQL query here\nSELECT * FROM numbers;`
        },
        testCases: [
          { input: 'nums = [2,7,11,15], target = 9', expectedOutput: '[0, 1]' },
          { input: 'nums = [3,2,4], target = 6', expectedOutput: '[1, 2]' },
          { input: 'nums = [3,3], target = 6', expectedOutput: '[0, 1]' }
        ]
      },
      {
        questionId: 'tech_code_2',
        type: 'Coding',
        category: 'String Manipulation',
        language: 'python',
        difficulty: 'Medium',
        title: 'Valid Palindrome',
        description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
        starterCode: `def isPalindrome(s: str) -> bool:\n    # Write your solution here\n    pass`,
        starterCodes: {
          python: `def isPalindrome(s: str) -> bool:\n    # Write your solution here\n    pass`,
          java: `public class Solution {\n    public boolean isPalindrome(String s) {\n        // Write your solution here\n        return false;\n    }\n}`,
          cpp: `class Solution {\npublic:\n    bool isPalindrome(string s) {\n        // Write your solution here\n        return false;\n    }\n};`,
          javascript: `function isPalindrome(s) {\n  // Write your solution here\n}`,
          sql: `-- Write query\nSELECT * FROM strings;`
        },
        testCases: [
          { input: 's = "A man, a plan, a canal: Panama"', expectedOutput: 'true' },
          { input: 's = "race a car"', expectedOutput: 'false' },
          { input: 's = " "', expectedOutput: 'true' }
        ]
      },
      {
        questionId: 'tech_code_3',
        type: 'Coding',
        category: 'Java',
        language: 'java',
        difficulty: 'Medium',
        title: 'Kth Smallest Element in BST',
        description: 'Given the root of a binary search tree (BST) and an integer k, return the kth smallest element in the BST. Constraints: 1 <= k <= number of nodes.',
        starterCode: `public class Solution {\n    public int kthSmallest(TreeNode root, int k) {\n        // Write your code here\n        return -1;\n    }\n    public static class TreeNode {\n        int val;\n        TreeNode left;\n        TreeNode right;\n        TreeNode(int x) { val = x; }\n    }\n}`,
        starterCodes: {
          java: `public class Solution {\n    public int kthSmallest(TreeNode root, int k) {\n        // Write your code here\n        return -1;\n    }\n    public static class TreeNode {\n        int val;\n        TreeNode left;\n        TreeNode right;\n        TreeNode(int x) { val = x; }\n    }\n}`,
          python: `class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\nclass Solution:\n    def kthSmallest(self, root: TreeNode, k: int) -> int:\n        # Write your code here\n        pass`,
          cpp: `struct TreeNode {\n    int val;\n    TreeNode *left;\n    TreeNode *right;\n    TreeNode(int x) : val(x), left(NULL), right(NULL) {}\n};\n\nclass Solution {\npublic:\n    int kthSmallest(TreeNode* root, int k) {\n        // Write your code here\n        return -1;\n    }\n};`,
          javascript: `function kthSmallest(root, k) {\n  // Write your code here\n}`
        },
        testCases: [
          { input: 'root = [5,3,6,2,4,null,null,1], k = 3', expectedOutput: '3' },
          { input: 'root = [3,1,4,null,2], k = 1', expectedOutput: '1' },
          { input: 'root = [2,1,3], k = 2', expectedOutput: '2' }
        ]
      }
    ];

    for (const tq of technicalQuestions) {
      await FirestoreHelper.setDoc('technical_questions', tq.questionId, tq);
    }

    const hrQuestions = [
      {
        id: 'hr_c1',
        title: 'Tell me about yourself and your background.',
        category: 'Introduction',
        difficulty: 'Easy',
        tip: 'Keep it concise (60-90 seconds). Highlight education, key skills, and passion for software.'
      },
      {
        id: 'hr_c2',
        title: 'What are your greatest professional strengths and technical weaknesses?',
        category: 'Self Assessment',
        difficulty: 'Easy',
        tip: 'Frame weaknesses as areas you are actively improving (e.g. learning Docker).'
      },
      {
        id: 'hr_c3',
        title: 'Why do you want to join our organization as a Software Developer?',
        category: 'Motivation',
        difficulty: 'Easy',
        tip: 'Show knowledge of company products, engineering culture, and long-term career alignment.'
      }
    ];

    for (const hq of hrQuestions) {
      await FirestoreHelper.setDoc('hr_questions', hq.id, hq);
    }

    const companies = [
      {
        id: 'comp_tcs',
        companyName: 'TCS',
        logo: 'https://logo.clearbit.com/tcs.com',
        description: 'Tata Consultancy Services is a global leader in IT services, consulting, and business solutions.',
        aptitudeQuestions: ['apt_1', 'apt_2', 'apt_3'],
        technicalQuestions: ['tech_mcq_1', 'tech_code_1'],
        hrQuestions: ['hr_c1', 'hr_c2']
      },
      {
        id: 'comp_infosys',
        companyName: 'Infosys',
        logo: 'https://logo.clearbit.com/infosys.com',
        description: 'Infosys is a global leader in next-generation digital services and consulting.',
        aptitudeQuestions: ['apt_4', 'apt_5'],
        technicalQuestions: ['tech_mcq_2', 'tech_code_2'],
        hrQuestions: ['hr_c1', 'hr_c3']
      }
    ];

    for (const comp of companies) {
      await FirestoreHelper.setDoc('companies', comp.id, comp);
    }

    console.log('✅ Seed data initialized successfully');
  } catch (err) {
    console.error('⚠️ Seed data error:', err.message);
  }
};

import { FirestoreHelper } from './firestoreHelper.js';

export const seedInitialData = async () => {
  try {
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

    // Seed Technical Questions (MCQ & Coding)
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
        language: 'javascript',
        difficulty: 'Easy',
        title: 'Two Sum Problem',
        description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target.',
        initialCode: `function twoSum(nums, target) {\n  // Write your solution here\n}`,
        testCases: [
          { input: 'nums = [2,7,11,15], target = 9', expectedOutput: '[0,1]' },
          { input: 'nums = [3,2,4], target = 6', expectedOutput: '[1,2]' }
        ]
      },
      {
        questionId: 'tech_code_2',
        type: 'Coding',
        category: 'String Manipulation',
        language: 'javascript',
        difficulty: 'Medium',
        title: 'Valid Palindrome',
        description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
        initialCode: `function isPalindrome(s) {\n  // Write your solution here\n}`,
        testCases: [
          { input: 's = "A man, a plan, a canal: Panama"', expectedOutput: 'true' },
          { input: 's = "race a car"', expectedOutput: 'false' }
        ]
      }
    ];

    for (const tq of technicalQuestions) {
      await FirestoreHelper.setDoc('technical_questions', tq.questionId, tq);
    }

    console.log('✅ Seed data initialized successfully');
  } catch (err) {
    console.error('⚠️ Seed data error:', err.message);
  }
};

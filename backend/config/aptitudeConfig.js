/**
 * Central Configuration for PlacementAI Aptitude Preparation Module
 */

export const APTITUDE_CONFIG = {
  // Test sizing and timing
  DEFAULT_QUESTION_COUNT: 10,
  ALLOWED_QUESTION_COUNTS: [10, 15, 20],
  SECONDS_PER_QUESTION: 120, // 2 minutes per question (10 q = 20 mins)
  
  // Grading & Progression
  PASS_PERCENTAGE: 60, // Minimum accuracy to pass a test and unlock next stage
  
  // Gamification
  XP_PER_CORRECT: 1,
  XP_PASS_BONUS: 5,

  // Server security & grace window
  SUBMIT_GRACE_PERIOD_SECONDS: 45, // Allow slightly delayed submits due to network
  MAX_TESTS_PER_HOUR: 15, // Rate limit for AI test generation per user

  // Stage mapping
  STAGES: [
    { id: 'beginner', name: 'Beginner', level: 1, difficulty: 'Easy' },
    { id: 'intermediate', name: 'Intermediate', level: 2, difficulty: 'Medium' },
    { id: 'advanced', name: 'Advanced', level: 3, difficulty: 'Hard' },
    { id: 'mock-expert', name: 'Mock Test Expert', level: 4, difficulty: 'Mixed' }
  ],

  // Topic taxonomy per category
  TOPICS_BY_CATEGORY: {
    'Quantitative': [
      'Percentages',
      'Profit & Loss',
      'Speed & Distance',
      'Algebra',
      'Time & Work',
      'Simple & Compound Interest',
      'Ratio & Proportion',
      'Averages',
      'Number System'
    ],
    'Logical Reasoning': [
      'Blood Relations',
      'Number Series',
      'Syllogisms',
      'Coding-Decoding',
      'Direction Sense',
      'Seating Arrangement',
      'Analogies',
      'Data Sufficiency'
    ],
    'Verbal Ability': [
      'Synonyms',
      'Antonyms',
      'Reading Comprehension',
      'Sentence Correction',
      'Grammar & Spotting Errors',
      'Idioms & Phrases',
      'Para Jumbles',
      'Vocabulary'
    ]
  }
};

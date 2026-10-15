import { generateQuestionFingerprint } from '../utils/questionFingerprint.js';

/**
 * Curated, high-quality Placement Aptitude Question Bank.
 * Acts as an instant, zero-latency fallback and top-up engine
 * ensuring students NEVER experience test generation failures or timeouts.
 */
const QUESTION_BANK = [
  // ─────────────────────────────────────────────────────────────
  // LOGICAL REASONING — All Levels & Topics
  // ─────────────────────────────────────────────────────────────
  {
    category: 'Logical Reasoning',
    topic: 'Blood Relations',
    difficulty: 'Medium',
    stage: 'intermediate',
    question: 'Pointing to a photograph, Vipul said, "She is the daughter of my grandfather\'s only son." How is the girl in the photograph related to Vipul?',
    options: ['Daughter', 'Sister', 'Cousin', 'Mother'],
    correctIndex: 1,
    explanation: 'Grandfather\'s only son is Vipul\'s father. The daughter of Vipul\'s father is Vipul\'s sister.'
  },
  {
    category: 'Logical Reasoning',
    topic: 'Blood Relations',
    difficulty: 'Medium',
    stage: 'intermediate',
    question: 'A and B are brothers. C and D are sisters. A\'s son is D\'s brother. How is B related to C?',
    options: ['Father', 'Brother', 'Uncle', 'Grandfather'],
    correctIndex: 2,
    explanation: 'Since A\'s son is D\'s brother, A is the father of D and C. B is A\'s brother, so B is the uncle of C.'
  },
  {
    category: 'Logical Reasoning',
    topic: 'Blood Relations',
    difficulty: 'Hard',
    stage: 'advanced',
    question: 'Introducing a man, a woman said, "His wife is the only daughter of my father." How is that man related to the woman?',
    options: ['Brother', 'Husband', 'Maternal Uncle', 'Father-in-law'],
    correctIndex: 1,
    explanation: 'The only daughter of the woman\'s father is the woman herself. Therefore, his wife is the woman herself, so the man is her husband.'
  },
  {
    category: 'Logical Reasoning',
    topic: 'Blood Relations',
    difficulty: 'Easy',
    stage: 'beginner',
    question: 'P is the mother of K. K is the sister of D. D is the father of J. How is P related to J?',
    options: ['Mother', 'Grandmother', 'Aunt', 'Sister'],
    correctIndex: 1,
    explanation: 'P is the mother of D (since K and D are siblings). D is J\'s father, so P is J\'s paternal grandmother.'
  },
  {
    category: 'Logical Reasoning',
    topic: 'Number Series',
    difficulty: 'Medium',
    stage: 'intermediate',
    question: 'Find the missing number in the series: 3, 7, 15, 31, 63, ?',
    options: ['95', '115', '127', '131'],
    correctIndex: 2,
    explanation: 'Each term is obtained by multiplying the previous term by 2 and adding 1: 63 * 2 + 1 = 127.'
  },
  {
    category: 'Logical Reasoning',
    topic: 'Number Series',
    difficulty: 'Medium',
    stage: 'intermediate',
    question: 'What is the next number in the pattern: 2, 5, 10, 17, 26, 37, ?',
    options: ['48', '49', '50', '52'],
    correctIndex: 2,
    explanation: 'The sequence follows n^2 + 1: 1^2+1=2, 2^2+1=5, 3^2+1=10, 4^2+1=17, 5^2+1=26, 6^2+1=37, 7^2+1 = 50.'
  },
  {
    category: 'Logical Reasoning',
    topic: 'Number Series',
    difficulty: 'Easy',
    stage: 'beginner',
    question: 'Find the missing number: 4, 8, 16, 32, 64, ?',
    options: ['96', '120', '128', '144'],
    correctIndex: 2,
    explanation: 'Each number is doubled: 64 * 2 = 128.'
  },
  {
    category: 'Logical Reasoning',
    topic: 'Number Series',
    difficulty: 'Hard',
    stage: 'advanced',
    question: 'Identify the next term: 6, 13, 28, 59, ?',
    options: ['118', '120', '122', '124'],
    correctIndex: 2,
    explanation: 'Pattern: *2 + 1, *2 + 2, *2 + 3... 59 * 2 + 4 = 118 + 4 = 122.'
  },
  {
    category: 'Logical Reasoning',
    topic: 'Syllogisms',
    difficulty: 'Medium',
    stage: 'intermediate',
    question: 'Statements: (1) All mangoes are fruits. (2) Some fruits are sweet. Conclusions: I. Some mangoes are sweet. II. All sweet things are fruits.',
    options: ['Only conclusion I follows', 'Only conclusion II follows', 'Neither I nor II follows', 'Both I and II follow'],
    correctIndex: 2,
    explanation: 'Being sweet is only attributed to some fruits; mangoes are not guaranteed to intersect with sweet fruits, nor are all sweet things fruits.'
  },
  {
    category: 'Logical Reasoning',
    topic: 'Syllogisms',
    difficulty: 'Medium',
    stage: 'intermediate',
    question: 'Statements: (1) All cars are vehicles. (2) All vehicles are machines. Conclusions: I. All cars are machines. II. Some machines are cars.',
    options: ['Only conclusion I follows', 'Only conclusion II follows', 'Neither I nor II follows', 'Both I and II follow'],
    correctIndex: 3,
    explanation: 'Since cars are a subset of vehicles and vehicles are a subset of machines, all cars are machines (I), and some machines must be cars (II).'
  },
  {
    category: 'Logical Reasoning',
    topic: 'Syllogisms',
    difficulty: 'Hard',
    stage: 'advanced',
    question: 'Statements: No river is a sea. Some seas are oceans. Conclusions: I. Some oceans are not rivers. II. Some oceans are seas.',
    options: ['Only conclusion I follows', 'Only conclusion II follows', 'Neither follows', 'Both I and II follow'],
    correctIndex: 3,
    explanation: 'The portion of oceans that are seas cannot be rivers (I holds). Also, since some seas are oceans, some oceans are definitely seas (II holds).'
  },
  {
    category: 'Logical Reasoning',
    topic: 'Coding-Decoding',
    difficulty: 'Medium',
    stage: 'intermediate',
    question: 'If "ROSE" is coded as "6821", "CHAIR" is coded as "73456", and "PREACH" is coded as "961473", what is the code for "SEARCH"?',
    options: ['214673', '214763', '241673', '216473'],
    correctIndex: 0,
    explanation: 'Direct letter substitution: S=2, E=1, A=4, R=6, C=7, H=3 => 214673.'
  },
  {
    category: 'Logical Reasoning',
    topic: 'Coding-Decoding',
    difficulty: 'Easy',
    stage: 'beginner',
    question: 'In a certain code language, "APPLE" is written as "BQQMF". How is "ORANGE" written in that code?',
    options: ['PSBOHF', 'PQBOHF', 'PSBNHF', 'PSBOGF'],
    correctIndex: 0,
    explanation: 'Each letter is shifted forward by 1 (+1 shift): O->P, R->S, A->B, N->O, G->H, E->F => PSBOHF.'
  },
  {
    category: 'Logical Reasoning',
    topic: 'Coding-Decoding',
    difficulty: 'Hard',
    stage: 'advanced',
    question: 'If "MONKEY" is written as "XDJMNL", how is "TIGER" written in that code?',
    options: ['QDFHS', 'SDFHS', 'QDHJS', 'SHFDQ'],
    correctIndex: 0,
    explanation: 'Each letter is decremented by 1 and written in reverse order: Y-1=X, E-1=D, K-1=J, N-1=M, O-1=N, M-1=L. For TIGER: R-1=Q, E-1=D, G-1=F, I-1=H, T-1=S => QDFHS.'
  },
  {
    category: 'Logical Reasoning',
    topic: 'Seating Arrangement',
    difficulty: 'Medium',
    stage: 'intermediate',
    question: 'Five friends P, Q, R, S, and T are sitting in a row facing North. S is between T and Q. Q is to the immediate left of R. P is to the immediate left of T. Who is in the center?',
    options: ['P', 'Q', 'S', 'T'],
    correctIndex: 2,
    explanation: 'Arranging from left to right: P, T, S, Q, R. S is exactly in the center position.'
  },
  {
    category: 'Logical Reasoning',
    topic: 'Seating Arrangement',
    difficulty: 'Hard',
    stage: 'advanced',
    question: 'Six people A, B, C, D, E, and F are sitting around a circular table facing the center. A is opposite to D. B is between D and E. C is between A and F. Who is sitting opposite to B?',
    options: ['A', 'C', 'E', 'F'],
    correctIndex: 3,
    explanation: 'Clockwise circle: A, C, F, D, B, E. Opposite pairs: (A, D), (C, E), (F, B). Opposite to B is F.'
  },
  {
    category: 'Logical Reasoning',
    topic: 'Direction Sense',
    difficulty: 'Medium',
    stage: 'intermediate',
    question: 'A person walks 5 km North, turns right and walks 3 km, then turns right and walks 5 km. How far and in which direction is he from his starting point?',
    options: ['3 km East', '3 km West', '5 km South', '8 km North'],
    correctIndex: 0,
    explanation: 'Walking 5 km North then 5 km South cancels the vertical displacement. The remaining displacement is 3 km East.'
  },
  {
    category: 'Logical Reasoning',
    topic: 'Direction Sense',
    difficulty: 'Easy',
    stage: 'beginner',
    question: 'Rohan walks 12 km towards South, then turns left and walks 10 km. He then turns left and walks 12 km. How far is he from his starting position?',
    options: ['10 km', '12 km', '22 km', '24 km'],
    correctIndex: 0,
    explanation: 'The South and subsequent North moves (12 km each) cancel out, leaving him 10 km East of the starting point.'
  },
  {
    category: 'Logical Reasoning',
    topic: 'Analogies',
    difficulty: 'Medium',
    stage: 'intermediate',
    question: 'Architect : Building :: Sculptor : ?',
    options: ['Museum', 'Statue', 'Chisel', 'Stone'],
    correctIndex: 1,
    explanation: 'An architect designs/creates a building; a sculptor creates a statue.'
  },
  {
    category: 'Logical Reasoning',
    topic: 'Analogies',
    difficulty: 'Easy',
    stage: 'beginner',
    question: 'Odometer : Speed :: Compass : ?',
    options: ['Hiking', 'Needle', 'Direction', 'Pressure'],
    correctIndex: 2,
    explanation: 'An odometer measures distance/speed; a compass indicates direction.'
  },
  {
    category: 'Logical Reasoning',
    topic: 'Data Sufficiency',
    difficulty: 'Hard',
    stage: 'advanced',
    question: 'Is integer X divisible by 6? Statement 1: X is divisible by 2. Statement 2: X is divisible by 3.',
    options: [
      'Statement 1 alone is sufficient',
      'Statement 2 alone is sufficient',
      'Both statements together are sufficient, but neither alone is sufficient',
      'Statements 1 and 2 together are not sufficient'
    ],
    correctIndex: 2,
    explanation: 'A number is divisible by 6 if and only if it is divisible by both 2 and 3. Combining both statements establishes divisibility by 6.'
  },
  {
    category: 'Logical Reasoning',
    topic: 'Clock & Calendar',
    difficulty: 'Medium',
    stage: 'intermediate',
    question: 'At what time between 3 and 4 o\'clock will the hands of a clock be together?',
    options: ['16 4/11 min past 3', '15 5/11 min past 3', '18 2/11 min past 3', '14 min past 3'],
    correctIndex: 0,
    explanation: 'Time = 60/11 * H = 60/11 * 3 = 180/11 = 16 4/11 minutes past 3.'
  },
  {
    category: 'Logical Reasoning',
    topic: 'Clock & Calendar',
    difficulty: 'Hard',
    stage: 'advanced',
    question: 'If 1st January 2007 was a Monday, what day of the week was 1st January 2008?',
    options: ['Monday', 'Tuesday', 'Wednesday', 'Sunday'],
    correctIndex: 1,
    explanation: '2007 is an ordinary year, which has 365 days = 52 weeks and 1 odd day. 1 day after Monday is Tuesday.'
  },

  // ─────────────────────────────────────────────────────────────
  // QUANTITATIVE APTITUDE — All Levels & Topics
  // ─────────────────────────────────────────────────────────────
  {
    category: 'Quantitative',
    topic: 'Percentages',
    difficulty: 'Medium',
    stage: 'intermediate',
    question: 'If the price of sugar increases by 25%, by how much percentage must a household reduce its consumption so that total expenditure remains unchanged?',
    options: ['15%', '20%', '25%', '30%'],
    correctIndex: 1,
    explanation: 'Reduction % = [r / (100 + r)] * 100 = [25 / 125] * 100 = 20%.'
  },
  {
    category: 'Quantitative',
    topic: 'Percentages',
    difficulty: 'Easy',
    stage: 'beginner',
    question: 'A student scored 72 out of 80 in a placement test. What is the percentage scored?',
    options: ['85%', '88%', '90%', '92%'],
    correctIndex: 2,
    explanation: '(72 / 80) * 100 = 90%.'
  },
  {
    category: 'Quantitative',
    topic: 'Percentages',
    difficulty: 'Hard',
    stage: 'advanced',
    question: 'In an examination, 35% of total candidates failed in English and 40% in Hindi. If 20% failed in both, what percentage passed in both subjects?',
    options: ['35%', '45%', '50%', '55%'],
    correctIndex: 1,
    explanation: 'Total failed = 35 + 40 - 20 = 55%. Therefore, passed in both = 100 - 55 = 45%.'
  },
  {
    category: 'Quantitative',
    topic: 'Profit & Loss',
    difficulty: 'Medium',
    stage: 'intermediate',
    question: 'A merchant buys an item for Rs. 400 and marks it at 50% above cost price. If he allows a discount of 20%, what is his profit percentage?',
    options: ['15%', '20%', '25%', '30%'],
    correctIndex: 1,
    explanation: 'Marked price = 400 * 1.5 = 600. Selling price = 600 * 0.8 = 480. Profit % = (480 - 400)/400 * 100 = 20%.'
  },
  {
    category: 'Quantitative',
    topic: 'Profit & Loss',
    difficulty: 'Easy',
    stage: 'beginner',
    question: 'By selling a cycle for Rs. 2850, a shopkeeper gains 14%. If the profit is reduced to 8%, what is the selling price?',
    options: ['Rs. 2600', 'Rs. 2700', 'Rs. 2800', 'Rs. 3000'],
    correctIndex: 1,
    explanation: 'Cost price = 2850 / 1.14 = 2500. New SP at 8% profit = 2500 * 1.08 = Rs. 2700.'
  },
  {
    category: 'Quantitative',
    topic: 'Speed & Distance',
    difficulty: 'Medium',
    stage: 'intermediate',
    question: 'A train 180 meters long travelling at 72 km/h passes a railway platform in 20 seconds. What is the length of the platform?',
    options: ['200 m', '220 m', '240 m', '260 m'],
    correctIndex: 1,
    explanation: 'Speed in m/s = 72 * (5/18) = 20 m/s. Total distance in 20s = 20 * 20 = 400 m. Platform length = 400 - 180 = 220 m.'
  },
  {
    category: 'Quantitative',
    topic: 'Speed & Distance',
    difficulty: 'Hard',
    stage: 'advanced',
    question: 'A boat goes 24 km upstream and 28 km downstream in 6 hours. It goes 30 km upstream and 21 km downstream in 6.5 hours. What is the speed of the stream?',
    options: ['4 km/h', '6 km/h', '8 km/h', '10 km/h'],
    correctIndex: 0,
    explanation: 'Let downstream rate = u, upstream = v. Solving 24/v + 28/u = 6 and 30/v + 21/u = 6.5 yields u = 14, v = 6. Speed of stream = (14 - 6)/2 = 4 km/h.'
  },
  {
    category: 'Quantitative',
    topic: 'Time & Work',
    difficulty: 'Medium',
    stage: 'intermediate',
    question: 'A can complete a project in 12 days and B can complete it in 24 days. Working together, in how many days can they complete the project?',
    options: ['6 days', '8 days', '10 days', '18 days'],
    correctIndex: 1,
    explanation: 'Combined rate per day = 1/12 + 1/24 = 3/24 = 1/8. Total time = 8 days.'
  },
  {
    category: 'Quantitative',
    topic: 'Time & Work',
    difficulty: 'Hard',
    stage: 'advanced',
    question: '12 men can finish a task in 15 days. If 3 men leave after 5 days, how many more days will the remaining men take to complete the work?',
    options: ['12 days', '13.33 days', '15 days', '16 days'],
    correctIndex: 1,
    explanation: 'Work done in 5 days = 5/15 = 1/3. Remaining work = 2/3. Remaining 9 men: (12 men * 15 days) / 9 = 20 days for full task. For 2/3 work = 20 * (2/3) = 13.33 days.'
  },
  {
    category: 'Quantitative',
    topic: 'Simple & Compound Interest',
    difficulty: 'Medium',
    stage: 'intermediate',
    question: 'At what rate of simple interest per annum will a principal sum double itself in 8 years?',
    options: ['10%', '12.5%', '15%', '16%'],
    correctIndex: 1,
    explanation: 'SI = P. Since SI = (P * R * T) / 100, P = (P * R * 8) / 100 => R = 100 / 8 = 12.5%.'
  },
  {
    category: 'Quantitative',
    topic: 'Simple & Compound Interest',
    difficulty: 'Hard',
    stage: 'advanced',
    question: 'What is the difference between compound interest and simple interest on Rs. 8000 for 2 years at 5% per annum?',
    options: ['Rs. 15', 'Rs. 20', 'Rs. 25', 'Rs. 30'],
    correctIndex: 1,
    explanation: 'Difference for 2 years = P * (R/100)^2 = 8000 * (5/100)^2 = 8000 * (1/400) = Rs. 20.'
  },
  {
    category: 'Quantitative',
    topic: 'Averages',
    difficulty: 'Medium',
    stage: 'intermediate',
    question: 'The average age of 24 students and the class teacher is 16 years. If the teacher\'s age is excluded, the average reduces by 1 year. What is the teacher\'s age?',
    options: ['38 years', '40 years', '42 years', '44 years'],
    correctIndex: 1,
    explanation: 'Total age with teacher = 25 * 16 = 400. Total age without teacher = 24 * 15 = 360. Teacher\'s age = 400 - 360 = 40 years.'
  },
  {
    category: 'Quantitative',
    topic: 'Ratio & Proportion',
    difficulty: 'Easy',
    stage: 'beginner',
    question: 'If A : B = 2 : 3 and B : C = 4 : 5, find the ratio A : C.',
    options: ['8 : 15', '2 : 5', '6 : 15', '8 : 12'],
    correctIndex: 0,
    explanation: 'A/C = (A/B) * (B/C) = (2/3) * (4/5) = 8/15.'
  },
  {
    category: 'Quantitative',
    topic: 'Ratio & Proportion',
    difficulty: 'Medium',
    stage: 'intermediate',
    question: 'Two numbers are in the ratio 3 : 5. If 9 is subtracted from each, the new ratio becomes 12 : 23. What is the smaller number?',
    options: ['27', '33', '45', '55'],
    correctIndex: 1,
    explanation: 'Let numbers be 3x and 5x. (3x - 9)/(5x - 9) = 12/23 => 69x - 207 = 60x - 108 => 9x = 99 => x = 11. Smaller number = 3 * 11 = 33.'
  },
  {
    category: 'Quantitative',
    topic: 'Algebra',
    difficulty: 'Medium',
    stage: 'intermediate',
    question: 'If x + 1/x = 4, find the value of x^2 + 1/x^2.',
    options: ['14', '16', '18', '20'],
    correctIndex: 0,
    explanation: 'Squaring both sides: (x + 1/x)^2 = x^2 + 1/x^2 + 2 = 16 => x^2 + 1/x^2 = 16 - 2 = 14.'
  },
  {
    category: 'Quantitative',
    topic: 'Number System',
    difficulty: 'Medium',
    stage: 'intermediate',
    question: 'What is the highest common factor (HCF) of 108, 288, and 360?',
    options: ['18', '24', '36', '72'],
    correctIndex: 2,
    explanation: '108 = 2^2 * 3^3, 288 = 2^5 * 3^2, 360 = 2^3 * 3^2 * 5. HCF = 2^2 * 3^2 = 4 * 9 = 36.'
  },
  {
    category: 'Quantitative',
    topic: 'Number System',
    difficulty: 'Easy',
    stage: 'beginner',
    question: 'Which of the following numbers is divisible by 9?',
    options: ['19728', '23456', '34562', '45671'],
    correctIndex: 0,
    explanation: 'Sum of digits of 19728 = 1 + 9 + 7 + 2 + 8 = 27, which is divisible by 9.'
  },

  // ─────────────────────────────────────────────────────────────
  // VERBAL ABILITY — All Levels & Topics
  // ─────────────────────────────────────────────────────────────
  {
    category: 'Verbal Ability',
    topic: 'Synonyms',
    difficulty: 'Medium',
    stage: 'intermediate',
    question: 'Choose the word that is nearest in meaning to "CANDID":',
    options: ['Frank', 'Secretive', 'Deceptive', 'Shy'],
    correctIndex: 0,
    explanation: '"Candid" means truthful and straightforward; frank.'
  },
  {
    category: 'Verbal Ability',
    topic: 'Synonyms',
    difficulty: 'Easy',
    stage: 'beginner',
    question: 'Select the synonym for the word "ABUNDANT":',
    options: ['Plentiful', 'Scarce', 'Rare', 'Deficient'],
    correctIndex: 0,
    explanation: '"Abundant" means present in great quantity; plentiful.'
  },
  {
    category: 'Verbal Ability',
    topic: 'Synonyms',
    difficulty: 'Hard',
    stage: 'advanced',
    question: 'Choose the word nearest in meaning to "EPHEMERAL":',
    options: ['Transient', 'Enduring', 'Eternal', 'Substantial'],
    correctIndex: 0,
    explanation: '"Ephemeral" means lasting for a very short time; transient.'
  },
  {
    category: 'Verbal Ability',
    topic: 'Antonyms',
    difficulty: 'Medium',
    stage: 'intermediate',
    question: 'Choose the word that is opposite in meaning to "LUCID":',
    options: ['Clear', 'Confusing', 'Transparent', 'Luminous'],
    correctIndex: 1,
    explanation: '"Lucid" means clear and easy to understand. Its opposite is confusing or obscure.'
  },
  {
    category: 'Verbal Ability',
    topic: 'Antonyms',
    difficulty: 'Easy',
    stage: 'beginner',
    question: 'What is the opposite of "GENUINE"?',
    options: ['Fake', 'Authentic', 'Sincere', 'Pure'],
    correctIndex: 0,
    explanation: '"Genuine" means authentic and real. The direct opposite is fake.'
  },
  {
    category: 'Verbal Ability',
    topic: 'Antonyms',
    difficulty: 'Hard',
    stage: 'advanced',
    question: 'Select the antonym for "METICULOUS":',
    options: ['Careless', 'Thorough', 'Precise', 'Painstaking'],
    correctIndex: 0,
    explanation: '"Meticulous" means showing great attention to detail. The opposite is careless.'
  },
  {
    category: 'Verbal Ability',
    topic: 'Sentence Correction',
    difficulty: 'Medium',
    stage: 'intermediate',
    question: 'Identify the error: "Neither of the two candidates (A) / were selected (B) / for the software role (C) / No error (D)"',
    options: ['A', 'B', 'C', 'D'],
    correctIndex: 1,
    explanation: '"Neither" is singular and takes a singular verb: "was selected" instead of "were selected".'
  },
  {
    category: 'Verbal Ability',
    topic: 'Sentence Correction',
    difficulty: 'Hard',
    stage: 'advanced',
    question: 'Identify the grammatically correct sentence:',
    options: [
      'Each of the engineers has submitted their pull request.',
      'Each of the engineers have submitted their pull request.',
      'Each of the engineers has submitted his or her pull request.',
      'Each of the engineers have submitted his or her pull request.'
    ],
    correctIndex: 2,
    explanation: '"Each" is an indefinite singular pronoun requiring the singular verb "has" and singular pronoun "his or her".'
  },
  {
    category: 'Verbal Ability',
    topic: 'Idioms & Phrases',
    difficulty: 'Medium',
    stage: 'intermediate',
    question: 'What is the meaning of the idiom "To bite the bullet"?',
    options: [
      'To face a difficult situation with courage',
      'To engage in a physical fight',
      'To make an unnecessary mistake',
      'To eat quickly under pressure'
    ],
    correctIndex: 0,
    explanation: '"To bite the bullet" means to endure a painful or difficult situation that cannot be avoided.'
  },
  {
    category: 'Verbal Ability',
    topic: 'Idioms & Phrases',
    difficulty: 'Easy',
    stage: 'beginner',
    question: 'What is the meaning of "A blessing in disguise"?',
    options: [
      'A good thing that seemed bad at first',
      'A fake compliment',
      'A dangerous situation',
      'A lucky charm'
    ],
    correctIndex: 0,
    explanation: '"A blessing in disguise" refers to a misfortune that unexpectedly results in good fortune.'
  },
  {
    category: 'Verbal Ability',
    topic: 'Grammar & Spotting Errors',
    difficulty: 'Medium',
    stage: 'intermediate',
    question: 'Choose the correct preposition: "The student has been preparing for the interview _____ Monday."',
    options: ['for', 'since', 'from', 'at'],
    correctIndex: 1,
    explanation: 'We use "since" with a specific starting point in time in the present perfect continuous tense.'
  },
  {
    category: 'Verbal Ability',
    topic: 'Grammar & Spotting Errors',
    difficulty: 'Easy',
    stage: 'beginner',
    question: 'Choose the correct pronoun: "Between you and _____, the interview went exceptionally well."',
    options: ['I', 'me', 'myself', 'mine'],
    correctIndex: 1,
    explanation: 'Prepositions (like "between") take objective case pronouns ("me", not "I").'
  },
  {
    category: 'Verbal Ability',
    topic: 'Reading Comprehension',
    difficulty: 'Medium',
    stage: 'intermediate',
    question: '"AI-driven automation is transforming software engineering, shifting the primary focus from writing boilerplate syntax to architectural design and problem decomposition." What is the main idea?',
    options: [
      'AI replaces all software engineers entirely',
      'Engineers now focus on high-level architecture over repetitive coding',
      'Boilerplate syntax is the most important skill in tech',
      'Automation has failed to impact modern development'
    ],
    correctIndex: 1,
    explanation: 'The passage highlights that AI shifts engineering focus from boilerplate coding to architecture and problem decomposition.'
  },
  {
    category: 'Verbal Ability',
    topic: 'Para Jumbles',
    difficulty: 'Hard',
    stage: 'advanced',
    question: 'Arrange in logical order: P: It accelerates latency. Q: Edge computing processes data near the source. R: By reducing network hops. S: This makes real-time AI feasible.',
    options: ['Q-R-P-S', 'Q-P-R-S', 'R-Q-P-S', 'S-Q-R-P'],
    correctIndex: 0,
    explanation: 'Q introduces the subject (Edge computing). R explains the mechanism (reducing network hops). P states the consequence (accelerates latency). S concludes (enables real-time AI).'
  }
];

export const AptitudeQuestionBank = {
  /**
   * Retrieves matching questions from the bank with randomized selection.
   * Guaranteed to fulfill the requested count without errors.
   */
  getQuestions({
    category = 'Logical Reasoning',
    stage = 'intermediate',
    difficulty = 'Medium',
    count = 10,
    excludeFingerprints = new Set()
  }) {
    const targetCat = category.toLowerCase().trim();
    const targetStage = String(stage || '').toLowerCase().trim();

    // 1. Filter by category
    let pool = QUESTION_BANK.filter(q => {
      const qCat = q.category.toLowerCase();
      if (targetCat.includes('logic') || targetCat.includes('reason')) {
        return qCat.includes('logic') || qCat.includes('reason');
      }
      if (targetCat.includes('verb')) {
        return qCat.includes('verb');
      }
      return qCat.includes('quant');
    });

    // Fall back to all if category pool is somehow empty
    if (pool.length === 0) pool = [...QUESTION_BANK];

    // 2. Prioritize current stage/difficulty if enough items exist
    const stageMatches = pool.filter(q => q.stage === targetStage || q.difficulty.toLowerCase() === difficulty.toLowerCase());
    if (stageMatches.length >= count) {
      pool = stageMatches;
    }

    // 3. Shuffle pool randomly
    const shuffled = [...pool].sort(() => 0.5 - Math.random());

    const results = [];
    const usedIndices = new Set();

    // Pass 1: Fresh questions not in excludeFingerprints
    for (let i = 0; i < shuffled.length; i++) {
      const item = shuffled[i];
      const fp = generateQuestionFingerprint(item.question);
      if (!excludeFingerprints.has(fp) && !usedIndices.has(i)) {
        usedIndices.add(i);
        results.push({
          questionId: `apt_bank_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          category: item.category,
          topic: item.topic,
          difficulty: item.difficulty,
          question: item.question,
          options: item.options,
          correctIndex: item.correctIndex,
          correctAnswer: item.options[item.correctIndex],
          explanation: item.explanation,
          fingerprint: fp
        });
      }
      if (results.length >= count) break;
    }

    // Pass 2: Unused questions from pool even if previously encountered
    if (results.length < count) {
      for (let i = 0; i < shuffled.length; i++) {
        if (!usedIndices.has(i)) {
          usedIndices.add(i);
          const item = shuffled[i];
          const fp = generateQuestionFingerprint(item.question);
          results.push({
            questionId: `apt_bank_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            category: item.category,
            topic: item.topic,
            difficulty: item.difficulty,
            question: item.question,
            options: item.options,
            correctIndex: item.correctIndex,
            correctAnswer: item.options[item.correctIndex],
            explanation: item.explanation,
            fingerprint: fp
          });
          if (results.length >= count) break;
        }
      }
    }

    // Pass 3: If count exceeds pool size, cycle through pool to guarantee fulfillment
    let cycle = 0;
    while (results.length < count && shuffled.length > 0) {
      const item = shuffled[cycle % shuffled.length];
      cycle++;
      results.push({
        questionId: `apt_bank_${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${cycle}`,
        category: item.category,
        topic: item.topic,
        difficulty: item.difficulty,
        question: item.question,
        options: item.options,
        correctIndex: item.correctIndex,
        correctAnswer: item.options[item.correctIndex],
        explanation: item.explanation,
        fingerprint: generateQuestionFingerprint(item.question + `_cycle_${cycle}`)
      });
    }

    return results;
  }
};

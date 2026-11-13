export const DSA_TOPICS_LIST = [
  { topicId: 'arrays', title: 'Arrays', order: 1, icon: 'Layers' },
  { topicId: 'strings', title: 'Strings', order: 2, icon: 'Type' },
  { topicId: 'hashing', title: 'Hashing', order: 3, icon: 'Hash' },
  { topicId: 'two_pointers', title: 'Two Pointers', order: 4, icon: 'GitCommit' },
  { topicId: 'sliding_window', title: 'Sliding Window', order: 5, icon: 'Maximize2' },
  { topicId: 'prefix_sum', title: 'Prefix Sum', order: 6, icon: 'PlusCircle' },
  { topicId: 'binary_search', title: 'Binary Search', order: 7, icon: 'Search' },
  { topicId: 'sorting', title: 'Sorting', order: 8, icon: 'ArrowUpDown' },
  { topicId: 'recursion', title: 'Recursion', order: 9, icon: 'Repeat' },
  { topicId: 'backtracking', title: 'Backtracking', order: 10, icon: 'CornerDownLeft' },
  { topicId: 'linked_list', title: 'Linked List', order: 11, icon: 'Link2' },
  { topicId: 'stack', title: 'Stack', order: 12, icon: 'Layers' },
  { topicId: 'queue', title: 'Queue', order: 13, icon: 'ListOrdered' },
  { topicId: 'trees', title: 'Trees', order: 14, icon: 'GitFork' },
  { topicId: 'binary_search_tree', title: 'Binary Search Tree', order: 15, icon: 'GitPullRequest' },
  { topicId: 'heap', title: 'Heap / Priority Queue', order: 16, icon: 'TrendingUp' },
  { topicId: 'graphs', title: 'Graphs', order: 17, icon: 'Share2' },
  { topicId: 'greedy', title: 'Greedy', order: 18, icon: 'Zap' },
  { topicId: 'dynamic_programming', title: 'Dynamic Programming', order: 19, icon: 'Cpu' },
  { topicId: 'bit_manipulation', title: 'Bit Manipulation', order: 20, icon: 'Binary' },
  { topicId: 'math', title: 'Math', order: 21, icon: 'Calculator' }
];

export const SUPPORTED_LANGUAGES = [
  { id: 'python', label: 'Python', monacoLang: 'python', extension: 'py' },
  { id: 'java', label: 'Java', monacoLang: 'java', extension: 'java' },
  { id: 'cpp', label: 'C++', monacoLang: 'cpp', extension: 'cpp' },
  { id: 'javascript', label: 'JavaScript', monacoLang: 'javascript', extension: 'js' }
];

export const DIFFICULTY_COLORS = {
  Easy: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800/60',
    dot: 'bg-emerald-500'
  },
  Medium: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800/60',
    dot: 'bg-amber-500'
  },
  Hard: {
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-700 dark:text-rose-400',
    border: 'border-rose-200 dark:border-rose-800/60',
    dot: 'bg-rose-500'
  }
};

export const VERDICT_CONFIG = {
  Accepted: {
    label: 'Accepted',
    bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-300 dark:border-emerald-800'
  },
  'Wrong Answer': {
    label: 'Wrong Answer',
    bg: 'bg-rose-50 dark:bg-rose-950/50',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-300 dark:border-rose-800'
  },
  'Time Limit Exceeded': {
    label: 'Time Limit Exceeded',
    bg: 'bg-amber-50 dark:bg-amber-950/50',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-300 dark:border-amber-800'
  },
  'Memory Limit Exceeded': {
    label: 'Memory Limit Exceeded',
    bg: 'bg-amber-50 dark:bg-amber-950/50',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-300 dark:border-amber-800'
  },
  'Runtime Error': {
    label: 'Runtime Error',
    bg: 'bg-red-50 dark:bg-red-950/50',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-300 dark:border-red-800'
  },
  'Compilation Error': {
    label: 'Compilation Error',
    bg: 'bg-orange-50 dark:bg-orange-950/50',
    text: 'text-orange-700 dark:text-orange-300',
    border: 'border-orange-300 dark:border-orange-800'
  }
};

// Comprehensive Algorithms Export Index
// All sorting, searching, and specialized algorithms

// Sorting Algorithms
export {
  getBubbleSortSteps,
  getSelectionSortSteps,
  getInsertionSortSteps,
  getMergeSortSteps,
  getQuickSortSteps,
  getHeapSortSteps,
  getCountingSortSteps,
  getRadixSortSteps
} from './comprehensiveSorting.js';

export { getMergeSortTreeSteps } from './mergeSortTree.js';

// Searching Algorithms
export {
  getBinarySearchSteps,
  getLinearSearchSteps,
  getJumpSearchSteps,
  getInterpolationSearchSteps,
  getExponentialSearchSteps
} from './comprehensiveSearching.js';

// Graph Algorithms (from existing files)
export { bfsSteps } from './graph/bfsSteps.js';
export { dfsSteps } from './graph/dfsSteps.js';
export { dijkstraSteps } from './graph/dijkstraSteps.js';

// Dynamic Programming Algorithms
export { knapsackSteps } from './dp/knapsackSteps.js';

// Algorithm Categories and Metadata
export const algorithmCategories = {
  sorting: [
    { name: 'Bubble Sort', function: 'getBubbleSortSteps', complexity: 'O(n²)', category: 'Simple Sorts' },
    { name: 'Selection Sort', function: 'getSelectionSortSteps', complexity: 'O(n²)', category: 'Simple Sorts' },
    { name: 'Insertion Sort', function: 'getInsertionSortSteps', complexity: 'O(n²)', category: 'Simple Sorts' },
    { name: 'Merge Sort', function: 'getMergeSortSteps', complexity: 'O(n log n)', category: 'Efficient Sorts' },
    { name: 'Quick Sort', function: 'getQuickSortSteps', complexity: 'O(n log n)', category: 'Efficient Sorts' },
    { name: 'Heap Sort', function: 'getHeapSortSteps', complexity: 'O(n log n)', category: 'Efficient Sorts' },
    { name: 'Counting Sort', function: 'getCountingSortSteps', complexity: 'O(n + k)', category: 'Non-Comparison Sorts' },
    { name: 'Radix Sort', function: 'getRadixSortSteps', complexity: 'O(d(n + k))', category: 'Non-Comparison Sorts' }
  ],
  searching: [
    { name: 'Binary Search', function: 'getBinarySearchSteps', complexity: 'O(log n)', category: 'Divide & Conquer' },
    { name: 'Linear Search', function: 'getLinearSearchSteps', complexity: 'O(n)', category: 'Simple Search' },
    { name: 'Jump Search', function: 'getJumpSearchSteps', complexity: 'O(√n)', category: 'Jump Search' },
    { name: 'Interpolation Search', function: 'getInterpolationSearchSteps', complexity: 'O(log log n)', category: 'Interpolation' },
    { name: 'Exponential Search', function: 'getExponentialSearchSteps', complexity: 'O(log n)', category: 'Exponential' }
  ],
  graph: [
    { name: 'BFS Traversal', function: 'bfsSteps', complexity: 'O(V + E)', category: 'Traversal' },
    { name: 'DFS Traversal', function: 'dfsSteps', complexity: 'O(V + E)', category: 'Traversal' },
    { name: 'Dijkstra\'s Algorithm', function: 'dijkstraSteps', complexity: 'O((V + E) log V)', category: 'Shortest Path' }
  ],
  dynamicProgramming: [
    { name: '0/1 Knapsack', function: 'knapsackSteps', complexity: 'O(nW)', category: 'Optimization' }
  ]
};

// Algorithm Function Mapping
export const algorithmFunctions = {
  // Sorting
  getBubbleSortSteps: (arr) => getBubbleSortSteps(arr),
  getSelectionSortSteps: (arr) => getSelectionSortSteps(arr),
  getInsertionSortSteps: (arr) => getInsertionSortSteps(arr),
  getMergeSortSteps: (arr) => getMergeSortSteps(arr),
  getQuickSortSteps: (arr) => getQuickSortSteps(arr),
  getHeapSortSteps: (arr) => getHeapSortSteps(arr),
  getCountingSortSteps: (arr) => getCountingSortSteps(arr),
  getRadixSortSteps: (arr) => getRadixSortSteps(arr),

  // Searching
  getBinarySearchSteps: (arr) => getBinarySearchSteps(arr),
  getLinearSearchSteps: (arr) => getLinearSearchSteps(arr),
  getJumpSearchSteps: (arr) => getJumpSearchSteps(arr),
  getInterpolationSearchSteps: (arr) => getInterpolationSearchSteps(arr),
  getExponentialSearchSteps: (arr) => getExponentialSearchSteps(arr),

  // Graph
  bfsSteps: (arr) => bfsSteps(arr),
  dfsSteps: (arr) => dfsSteps(arr),
  dijkstraSteps: (arr) => dijkstraSteps(arr),

  // Dynamic Programming
  knapsackSteps: (arr) => knapsackSteps(arr)
};

// Performance Metrics
export const complexityRanks = {
  'O(1)': 1,
  'O(log n)': 2,
  'O(log log n)': 3,
  'O(√n)': 4,
  'O(n)': 5,
  'O(n log n)': 6,
  'O(n²)': 7,
  'O(n³)': 8,
  'O(2^n)': 9,
  'O(n!)': 10
};

// Utility Functions
export const getComplexityRank = (complexity) => {
  return complexityRanks[complexity] || 999;
};

export const compareComplexity = (complexity1, complexity2) => {
  return getComplexityRank(complexity1) - getComplexityRank(complexity2);
};

export const getBestAlgorithm = (algorithms, criteria = 'complexity') => {
  if (criteria === 'complexity') {
    return algorithms.reduce((best, current) => {
      return compareComplexity(current.complexity, best.complexity) < 0 ? current : best;
    });
  }
  return algorithms[0];
};

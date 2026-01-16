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
  getCountingSortSteps
} from './comprehensiveSorting.js';

export { getQuickSort3DSteps } from './quickSort3D.js';

export { getMergeSortTreeSteps } from './mergeSortTree.js';
export { getQuickSortTreeSteps } from './quickSortTree.js';

// Additional Sorting Algorithms
export {
  getCocktailSortSteps,
  getCombSortSteps,
  getGnomeSortSteps,
  getOddEvenSortSteps
} from './additionalSorting.js';
export { getBucketSortSteps } from './bucketSort.js';
export { getRadixSortSteps } from './radixSort.js';

// Searching Algorithms
export {
  getBinarySearchSteps,
  getLinearSearchSteps,
  getJumpSearchSteps,
  getInterpolationSearchSteps,
  getExponentialSearchSteps
} from './comprehensiveSearching.js';

export {
  getTernarySearchSteps,
  getFibonacciSearchSteps,
  getSentinelSearchSteps,
  getTwoPointerSearchSteps,
  getSublistSearchSteps
} from './additionalSearching.js';

// Graph Algorithms (from existing files)
export { bfsSteps } from './graph/bfsSteps.js';
export { dfsSteps } from './graph/dfsSteps.js';
export { dijkstraSteps } from './graph/dijkstraSteps.js';

// Additional Graph Algorithms
// export {
//   getBellmanFordSteps,
//   getFloydWarshallSteps,
//   getPrimMSTSteps,
//   getKruskalMSTSteps,
//   getTopologicalSortSteps,
//   getCycleDetectionSteps
// } from './graph/additionalGraphAlgorithms.js';

// Dynamic Programming Algorithms
// Dummy exports for missing algorithm files to prevent SyntaxErrors
export const knapsackSteps = () => [];
export const getLCSSteps = () => [];
export const getEditDistanceSteps = () => [];
export const getCoinChangeSteps = () => [];
export const getMatrixChainSteps = () => [];
export const getRodCuttingSteps = () => [];
export const getLISSteps = () => [];
export const getFibonacciDPSteps = () => [];

export const getBellmanFordSteps = () => [];
export const getFloydWarshallSteps = () => [];
export const getPrimMSTSteps = () => [];
export const getKruskalMSTSteps = () => [];
export const getTopologicalSortSteps = () => [];
export const getCycleDetectionSteps = () => [];

// Additional DP Algorithms
// export {
//   getLCSSteps,
//   getEditDistanceSteps,
//   getCoinChangeSteps,
//   getMatrixChainSteps,
//   getRodCuttingSteps,
//   getLISSteps,
//   getFibonacciDPSteps
// } from './dp/additionalDPAlgorithms.js';

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
    { name: 'Radix Sort', function: 'getRadixSortSteps', complexity: 'O(d(n + k))', category: 'Non-Comparison Sorts' },
    { name: 'Bucket Sort', function: 'getBucketSortSteps', complexity: 'O(n + k)', category: 'Non-Comparison Sorts' },
    { name: 'Cocktail Sort', function: 'getCocktailSortSteps', complexity: 'O(n²)', category: 'Simple Sorts' },
    { name: 'Comb Sort', function: 'getCombSortSteps', complexity: 'O(n²)', category: 'Simple Sorts' },
    { name: 'Gnome Sort', function: 'getGnomeSortSteps', complexity: 'O(n²)', category: 'Simple Sorts' },
    { name: 'Odd-Even Sort', function: 'getOddEvenSortSteps', complexity: 'O(n²)', category: 'Simple Sorts' }
  ],
  searching: [
    { name: 'Binary Search', function: 'getBinarySearchSteps', complexity: 'O(log n)', category: 'Divide & Conquer' },
    { name: 'Linear Search', function: 'getLinearSearchSteps', complexity: 'O(n)', category: 'Simple Search' },
    { name: 'Two Pointer Search', function: 'getTwoPointerSearchSteps', complexity: 'O(n)', category: 'Two Pointers' },
    { name: 'Sublist Search', function: 'getSublistSearchSteps', complexity: 'O(m*n)', category: 'Pattern Matching' }
  ],
  graph: [
    { name: 'BFS Traversal', function: 'bfsSteps', complexity: 'O(V + E)', category: 'Traversal' },
    { name: 'DFS Traversal', function: 'dfsSteps', complexity: 'O(V + E)', category: 'Traversal' },
    { name: 'Dijkstra\'s Algorithm', function: 'dijkstraSteps', complexity: 'O((V + E) log V)', category: 'Shortest Path' }
  ],
  dynamicProgramming: [
    // Dynamic programming algorithms removed from UI metadata
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
  getBucketSortSteps: (arr) => getBucketSortSteps(arr),
  getCocktailSortSteps: (arr) => getCocktailSortSteps(arr),
  getCombSortSteps: (arr) => getCombSortSteps(arr),
  getGnomeSortSteps: (arr) => getGnomeSortSteps(arr),
  getOddEvenSortSteps: (arr) => getOddEvenSortSteps(arr),

  // Searching
  getBinarySearchSteps: (arr) => getBinarySearchSteps(arr),
  getLinearSearchSteps: (arr) => getLinearSearchSteps(arr),
  getJumpSearchSteps: (arr) => getJumpSearchSteps(arr),
  getInterpolationSearchSteps: (arr) => getInterpolationSearchSteps(arr),
  getExponentialSearchSteps: (arr) => getExponentialSearchSteps(arr),
  getTernarySearchSteps: (arr) => getTernarySearchSteps(arr),
  getFibonacciSearchSteps: (arr) => getFibonacciSearchSteps(arr),
  getSentinelSearchSteps: (arr) => getSentinelSearchSteps(arr),
  getTwoPointerSearchSteps: (arr) => getTwoPointerSearchSteps(arr),
  getSublistSearchSteps: (arr) => getSublistSearchSteps(arr),

  // Graph
  bfsSteps: (arr) => bfsSteps(arr),
  dfsSteps: (arr) => dfsSteps(arr),
  dijkstraSteps: (arr) => dijkstraSteps(arr),
  getBellmanFordSteps: (input) => null,
  getFloydWarshallSteps: (input) => null,
  getPrimMSTSteps: (input) => null,
  getKruskalMSTSteps: (input) => null,
  getTopologicalSortSteps: (input) => null,
  getCycleDetectionSteps: (input) => null,

  // Dynamic Programming
  knapsackSteps: (arr) => null,
  getLCSSteps: (input) => null,
  getEditDistanceSteps: (input) => null,
  getCoinChangeSteps: (input) => null,
  getMatrixChainSteps: (input) => null,
  getRodCuttingSteps: (input) => null,
  getLISSteps: (input) => null,
  getFibonacciDPSteps: (input) => null
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

// Comprehensive Algorithm Exports
// All algorithms follow the same step-based visualization pattern

// Sorting Algorithms
export { selectionSortSteps } from './sorting/selectionSortSteps.js';
export { insertionSortSteps } from './sorting/insertionSortSteps.js';
export { mergeSortSteps } from './sorting/mergeSortSteps.js';
export { heapSortSteps } from './sorting/heapSortSteps.js';

// Search Algorithms
export { binarySearchSteps } from './searching/binarySearchSteps.js';

// Graph Algorithms
export { bfsSteps } from './graph/bfsSteps.js';
export { dfsSteps } from './graph/dfsSteps.js';
export { dijkstraSteps } from './graph/dijkstraSteps.js';

// Dynamic Programming Algorithms
export { knapsackSteps } from './dp/knapsackSteps.js';

// Algorithm Categories for UI Organization
export const algorithmCategories = {
  sorting: [
    { name: 'Selection Sort', function: 'selectionSortSteps', complexity: 'O(n²)' },
    { name: 'Insertion Sort', function: 'insertionSortSteps', complexity: 'O(n²)' },
    { name: 'Merge Sort', function: 'mergeSortSteps', complexity: 'O(n log n)' },
    { name: 'Heap Sort', function: 'heapSortSteps', complexity: 'O(n log n)' }
  ],
  searching: [
    { name: 'Binary Search', function: 'binarySearchSteps', complexity: 'O(log n)' }
  ],
  graph: [
    { name: 'BFS Traversal', function: 'bfsSteps', complexity: 'O(V + E)' },
    { name: 'DFS Traversal', function: 'dfsSteps', complexity: 'O(V + E)' },
    { name: 'Dijkstra\'s Algorithm', function: 'dijkstraSteps', complexity: 'O((V + E) log V)' }
  ],
  dynamicProgramming: [
    { name: '0/1 Knapsack', function: 'knapsackSteps', complexity: 'O(nW)' }
  ]
};

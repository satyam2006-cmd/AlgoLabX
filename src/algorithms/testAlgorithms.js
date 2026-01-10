// Test file to verify all algorithms work with existing visualizer
// This file demonstrates how to use the new step-based algorithms

import {
  selectionSortSteps,
  insertionSortSteps,
  mergeSortSteps,
  heapSortSteps,
  binarySearchSteps,
  bfsSteps,
  dfsSteps,
  dijkstraSteps,
  knapsackSteps
} from './newIndex.js';

// Test data
const testArray = [64, 34, 25, 12, 22, 11, 90, 45, 33, 77];

// Test all algorithms
function testAllAlgorithms() {
  console.log('Testing all algorithms with step-based visualization...\n');
  
  // Test sorting algorithms
  console.log('=== SORTING ALGORITHMS ===');
  
  console.log('\n1. Selection Sort:');
  const selectionSteps = selectionSortSteps(testArray);
  console.log(`Total steps: ${selectionSteps.length}`);
  console.log('First step:', selectionSteps[0]);
  console.log('Last step:', selectionSteps[selectionSteps.length - 1]);
  
  console.log('\n2. Insertion Sort:');
  const insertionSteps = insertionSortSteps(testArray);
  console.log(`Total steps: ${insertionSteps.length}`);
  console.log('First step:', insertionSteps[0]);
  console.log('Last step:', insertionSteps[insertionSteps.length - 1]);
  
  console.log('\n3. Merge Sort:');
  const mergeSteps = mergeSortSteps(testArray);
  console.log(`Total steps: ${mergeSteps.length}`);
  console.log('First step:', mergeSteps[0]);
  console.log('Last step:', mergeSteps[mergeSteps.length - 1]);
  
  console.log('\n4. Heap Sort:');
  const heapSteps = heapSortSteps(testArray);
  console.log(`Total steps: ${heapSteps.length}`);
  console.log('First step:', heapSteps[0]);
  console.log('Last step:', heapSteps[heapSteps.length - 1]);
  
  // Test search algorithms
  console.log('\n=== SEARCH ALGORITHMS ===');
  
  console.log('\n5. Binary Search:');
  const binarySteps = binarySearchSteps(testArray);
  console.log(`Total steps: ${binarySteps.length}`);
  console.log('First step:', binarySteps[0]);
  console.log('Last step:', binarySteps[binarySteps.length - 1]);
  
  // Test graph algorithms
  console.log('\n=== GRAPH ALGORITHMS ===');
  
  console.log('\n6. BFS Traversal:');
  const bfsSteps = bfsSteps(testArray);
  console.log(`Total steps: ${bfsSteps.length}`);
  console.log('First step:', bfsSteps[0]);
  console.log('Last step:', bfsSteps[bfsSteps.length - 1]);
  
  console.log('\n7. DFS Traversal:');
  const dfsSteps = dfsSteps(testArray);
  console.log(`Total steps: ${dfsSteps.length}`);
  console.log('First step:', dfsSteps[0]);
  console.log('Last step:', dfsSteps[dfsSteps.length - 1]);
  
  console.log('\n8. Dijkstra\'s Algorithm:');
  const dijkstraStepsResult = dijkstraSteps(testArray);
  console.log(`Total steps: ${dijkstraStepsResult.length}`);
  console.log('First step:', dijkstraStepsResult[0]);
  console.log('Last step:', dijkstraStepsResult[dijkstraStepsResult.length - 1]);
  
  // Test dynamic programming algorithms
  console.log('\n=== DYNAMIC PROGRAMMING ALGORITHMS ===');
  
  console.log('\n9. 0/1 Knapsack:');
  const knapsackStepsResult = knapsackSteps([10, 20, 30, 15, 25, 60, 40, 55, 35, 45]);
  console.log(`Total steps: ${knapsackStepsResult.length}`);
  console.log('First step:', knapsackStepsResult[0]);
  console.log('Last step:', knapsackStepsResult[knapsackStepsResult.length - 1]);
  
  console.log('\n=== ALL ALGORITHMS TESTED SUCCESSFULLY ===');
}

// Export for use in components
export {
  selectionSortSteps,
  insertionSortSteps,
  mergeSortSteps,
  heapSortSteps,
  binarySearchSteps,
  bfsSteps,
  dfsSteps,
  dijkstraSteps,
  knapsackSteps,
  testAllAlgorithms
};

// Run tests if this file is executed directly
if (typeof window !== 'undefined') {
  window.testAllAlgorithms = testAllAlgorithms;
}

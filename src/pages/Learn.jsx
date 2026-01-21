import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import SmartVisualizer from '../components/SmartVisualizer';
import QuickSort2D from '../components/QuickSort2D';
import RecursiveTreeVisualizer from '../components/RecursiveTreeVisualizer';
import QuickSort3D from '../components/QuickSort3D';
import HeapSortVisualizer from '../components/HeapSortVisualizer';
import BucketSortVisualizer from '../components/BucketSortVisualizer';
import RadixSortVisualizer from '../components/RadixSortVisualizer';
import TwoPointerVisualizer from '../components/TwoPointerVisualizer';
import GraphVisualizer from '../components/GraphVisualizer';

import { useStepPlayer } from '../engine/stepPlayer';
import { getHeapSortDetailedSteps } from '../algorithms/heapSortDetailed';
import {
  // Sorting
  getBubbleSortSteps, getQuickSortSteps, getSelectionSortSteps, getInsertionSortSteps,
  getMergeSortSteps, getMergeSortTreeSteps, getHeapSortSteps, getCountingSortSteps, getRadixSortSteps,
  getQuickSortTreeSteps, getQuickSort3DSteps,
  getBucketSortSteps, getCocktailSortSteps, getCombSortSteps, getGnomeSortSteps, getOddEvenSortSteps,
  // Searching
  getBinarySearchSteps, getLinearSearchSteps, getJumpSearchSteps, getInterpolationSearchSteps, getExponentialSearchSteps,
  getTernarySearchSteps, getFibonacciSearchSteps, getSentinelSearchSteps, getTwoPointerSearchSteps, getSublistSearchSteps,
  // Graph
  bfsSteps, dfsSteps, dijkstraSteps,
  // DP

} from '../algorithms/comprehensiveAlgorithms';

// Icon Components
const BookIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const ChartBarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const LightBulbIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const PlayIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const ShuffleIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const MinusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

// Loading placeholder component for better UX
const LoadingPlaceholder = () => (
  <div className="flex flex-col items-center justify-center p-12 bg-dark-900/40 rounded-xl border border-dark-700/30 min-h-[200px]">
    <div className="relative mb-4">
      <div className="w-12 h-12 rounded-full border-4 border-dark-600"></div>
      <div className="w-12 h-12 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin absolute top-0 left-0"></div>
    </div>
    <p className="text-white text-sm font-medium">Ready to visualize</p>
    <p className="text-white/50 text-xs mt-1">Press <kbd className="px-1.5 py-0.5 rounded bg-dark-700 text-white/90 font-mono text-[10px] mx-1">Space</kbd> or click Play to start</p>
  </div>
);

const Learn = ({ selectedAlgorithm, setSelectedAlgorithm }) => {

  const [inputArray, setInputArray] = useState([64, 34, 25, 12, 22, 11, 90, 45, 33, 77]);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [customInput, setCustomInput] = useState('64, 34, 25, 12, 22, 11, 90, 45, 33, 77');
  const [searchTarget, setSearchTarget] = useState('45');

  const speedOptions = [0.5, 1, 1.5, 2, 3];
  const baseSpeed = 1000;
  const speed = baseSpeed / speedMultiplier;

  const algorithms = {
    // Simple Sorts
    bubble: { name: 'Bubble Sort', complexity: 'O(n²)', type: 'sorting', getSteps: getBubbleSortSteps, description: 'Visualized using Memory Blocks. Repeatedly steps through list, compares adjacent memory cells and slides them to swap if they are in wrong order.' },
    selection: { name: 'Selection Sort', complexity: 'O(n²)', type: 'sorting', getSteps: getSelectionSortSteps, description: 'Visualized using Memory Blocks. Divides memory into sorted and unsorted regions, repeatedly scanning for the smallest element to lock into place.' },
    insertion: { name: 'Insertion Sort', complexity: 'O(n²)', type: 'sorting', getSteps: getInsertionSortSteps, description: 'Visualized using Memory Blocks. Builds the final sorted sequence one item at a time by sliding each element into its proper position.' },
    cocktail: { name: 'Cocktail Sort', complexity: 'O(n²)', type: 'sorting', getSteps: getCocktailSortSteps, description: 'Bidirectional bubble sort that traverses the list in both directions alternately.' },
    gnome: { name: 'Gnome Sort', complexity: 'O(n²)', type: 'sorting', getSteps: getGnomeSortSteps, description: 'Simple sorting algorithm similar to insertion sort, but moving elements to proper position by swaps.' },
    comb: { name: 'Comb Sort', complexity: 'O(n²)', type: 'sorting', getSteps: getCombSortSteps, description: 'Improvement over bubble sort using gap sequence to eliminate small values near the end.' },
    oddeven: { name: 'Odd-Even Sort', complexity: 'O(n²)', type: 'sorting', getSteps: getOddEvenSortSteps, description: 'Parallel sorting algorithm that compares odd-even indexed pairs, then even-odd pairs alternately.' },
    // Efficient Sorts
    merge: { name: 'Merge Sort', complexity: 'O(n log n)', type: 'sorting', getSteps: getMergeSortTreeSteps, description: 'Efficient divide-and-conquer sorting algorithm that divides array into halves, sorts them, and merges them back together.' },
    quick: { name: 'Quick Sort', complexity: 'O(n log n)', type: 'sorting', getSteps: getQuickSortTreeSteps, description: 'Visualized using Recursive Tree. Picks a pivot element and partitions array around it recursively.' },
    heap: { name: 'Heap Sort', complexity: 'O(n log n)', type: 'sorting', getSteps: getHeapSortDetailedSteps, description: 'Efficient sorting algorithm that uses a binary heap data structure to sort elements in place.' },
    // Non-Comparison Sorts
    counting: { name: 'Counting Sort', complexity: 'O(n + k)', type: 'sorting', getSteps: getCountingSortSteps, description: 'Non-comparison sorting algorithm that sorts elements by counting occurrences of each distinct element.' },
    radix: { name: 'Radix Sort', complexity: 'O(d × (n + k))', type: 'sorting', getSteps: getRadixSortSteps, description: 'Non-comparison sorting algorithm that sorts integers by processing individual digits.' },
    bucket: { name: 'Bucket Sort', complexity: 'O(n + k)', type: 'sorting', getSteps: getBucketSortSteps, description: 'Distribution sorting algorithm that distributes elements into buckets, sorts them, then concatenates.' },
    // Searching
    binary: { name: 'Binary Search', complexity: 'O(log n)', type: 'searching', getSteps: getBinarySearchSteps, description: 'Efficient search algorithm that works on sorted arrays by repeatedly dividing the search interval in half.' },
    linear: { name: 'Linear Search', complexity: 'O(n)', type: 'searching', getSteps: getLinearSearchSteps, description: 'Sequential search algorithm that checks each element in order until the target is found.' },
    twopointer: { name: 'Two Pointer Search', complexity: 'O(n)', type: 'searching', getSteps: getTwoPointerSearchSteps, description: 'Search technique using two pointers converging from both ends (finds pairs summing to target).' },
    jump: { name: 'Jump Search', complexity: 'O(√n)', type: 'searching', getSteps: getJumpSearchSteps, description: 'Search algorithm that works on sorted arrays by jumping ahead by fixed steps then doing linear search.' },
    interpolation: { name: 'Interpolation Search', complexity: 'O(log log n)', type: 'searching', getSteps: getInterpolationSearchSteps, description: 'Improved binary search that estimates position based on value distribution in sorted arrays.' },
    exponential: { name: 'Exponential Search', complexity: 'O(log n)', type: 'searching', getSteps: getExponentialSearchSteps, description: 'Search algorithm that finds range where element exists, then uses binary search within that range.' },
    ternary: { name: 'Ternary Search', complexity: 'O(log₃ n)', type: 'searching', getSteps: getTernarySearchSteps, description: 'Divide and conquer search that splits array into three parts instead of two.' },
    fibonacci: { name: 'Fibonacci Search', complexity: 'O(log n)', type: 'searching', getSteps: getFibonacciSearchSteps, description: 'Search algorithm that uses Fibonacci numbers to divide the array for searching.' },
    sentinel: { name: 'Sentinel Search', complexity: 'O(n)', type: 'searching', getSteps: getSentinelSearchSteps, description: 'Optimized linear search that uses a sentinel value to eliminate bounds checking.' },
    sublist: { name: 'Sublist Search', complexity: 'O(m × n)', type: 'searching', getSteps: getSublistSearchSteps, description: 'Algorithm to find if one list exists as a contiguous subsequence in another list.' },
    // Graph Algorithms
    bfs: { name: 'BFS Traversal', complexity: 'O(V + E)', type: 'graph', getSteps: bfsSteps, description: 'Graph traversal algorithm that explores neighbors of nodes level by level, starting from a source node.' },
    dfs: { name: 'DFS Traversal', complexity: 'O(V + E)', type: 'graph', getSteps: dfsSteps, description: 'Graph traversal algorithm that explores as far as possible along each branch before backtracking.' },
    dijkstra: { name: 'Dijkstra\'s Algorithm', complexity: 'O((V + E) log V)', type: 'graph', getSteps: dijkstraSteps, description: 'Shortest path algorithm that finds the shortest paths from a source to all other nodes in a weighted graph.' }
  };

  const currentAlgo = algorithms[selectedAlgorithm] || algorithms['bubble'];

  const searchAlgorithms = ['binary', 'linear', 'twopointer', 'jump', 'interpolation', 'exponential', 'ternary', 'fibonacci', 'sentinel', 'sublist'];

  let stepsInput = inputArray;
  if (searchAlgorithms.includes(selectedAlgorithm)) {
    const target = parseInt(searchTarget);
    if (!isNaN(target)) {
      stepsInput = [...inputArray, target];
    }
  }

  const steps = currentAlgo.getSteps(stepsInput);
  const { currentStep, isPlaying, currentStepData, totalSteps, controls } = useStepPlayer(steps, speed);

  const handleGenerateArray = () => {
    const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1);
    setInputArray(newArray);
    setCustomInput(newArray.join(', '));
    setInputError('');
  };

  const [inputError, setInputError] = useState('');

  const handleCustomInput = () => {
    try {
      const arr = customInput.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));

      // Validation
      if (arr.length === 0) {
        setInputError('Please enter at least one valid number');
        return;
      }
      if (arr.length > 20) {
        setInputError('Maximum 20 elements allowed for optimal visualization');
        return;
      }
      if (arr.some(n => n < 0 || n > 999)) {
        setInputError('Numbers must be between 0 and 999');
        return;
      }

      setInputError('');
      setInputArray(arr);
    } catch (error) {
      setInputError('Invalid input format. Use comma-separated numbers.');
    }
  };

  const decreaseSpeed = useCallback(() => {
    const currentIndex = speedOptions.indexOf(speedMultiplier);
    if (currentIndex > 0) {
      setSpeedMultiplier(speedOptions[currentIndex - 1]);
    }
  }, [speedMultiplier]);

  const increaseSpeed = useCallback(() => {
    const currentIndex = speedOptions.indexOf(speedMultiplier);
    if (currentIndex < speedOptions.length - 1) {
      setSpeedMultiplier(speedOptions[currentIndex + 1]);
    }
  }, [speedMultiplier]);

  // Keyboard shortcuts for better accessibility and UX
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Don't trigger shortcuts when typing in input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ': // Space - Play/Pause
          e.preventDefault();
          if (isPlaying) {
            controls.pause();
          } else {
            controls.play();
          }
          break;
        case 'arrowleft': // Left Arrow - Previous step
          e.preventDefault();
          controls.stepBackward();
          break;
        case 'arrowright': // Right Arrow - Next step
          e.preventDefault();
          controls.stepForward();
          break;
        case 'r': // R - Reset
          e.preventDefault();
          controls.reset();
          break;
        case '+':
        case '=': // Plus - Increase speed
          e.preventDefault();
          increaseSpeed();
          break;
        case '-': // Minus - Decrease speed
          e.preventDefault();
          decreaseSpeed();
          break;
        case 'g': // G - Generate random array
          e.preventDefault();
          handleGenerateArray();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, controls, increaseSpeed, decreaseSpeed]);

  useEffect(() => {
    controls.reset();
  }, [selectedAlgorithm, inputArray]);

  return (
    <div className="flex-1 p-3 sm:p-6 md:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Keyboard Shortcuts Tooltip */}
        <div className="hidden lg:block fixed bottom-4 right-4 z-40">
          <div className="group relative">
            <button className="w-10 h-10 rounded-full bg-dark-800/80 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:bg-dark-700/80 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <div className="absolute bottom-12 right-0 w-64 p-4 bg-dark-800/95 backdrop-blur-xl rounded-xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl">
              <p className="text-white text-xs font-semibold mb-3 uppercase tracking-wider">Keyboard Shortcuts</p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-white/70">Play/Pause</span><kbd className="px-2 py-0.5 rounded bg-dark-700 text-white/90 font-mono">Space</kbd></div>
                <div className="flex justify-between"><span className="text-white/70">Previous Step</span><kbd className="px-2 py-0.5 rounded bg-dark-700 text-white/90 font-mono">←</kbd></div>
                <div className="flex justify-between"><span className="text-white/70">Next Step</span><kbd className="px-2 py-0.5 rounded bg-dark-700 text-white/90 font-mono">→</kbd></div>
                <div className="flex justify-between"><span className="text-white/70">Reset</span><kbd className="px-2 py-0.5 rounded bg-dark-700 text-white/90 font-mono">R</kbd></div>
                <div className="flex justify-between"><span className="text-white/70">Speed Up</span><kbd className="px-2 py-0.5 rounded bg-dark-700 text-white/90 font-mono">+</kbd></div>
                <div className="flex justify-between"><span className="text-white/70">Slow Down</span><kbd className="px-2 py-0.5 rounded bg-dark-700 text-white/90 font-mono">-</kbd></div>
                <div className="flex justify-between"><span className="text-white/70">Random Array</span><kbd className="px-2 py-0.5 rounded bg-dark-700 text-white/90 font-mono">G</kbd></div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-gradient-to-br from-gray-500 to-dark-700 flex items-center justify-center text-dark-200 shadow-lg border border-white flex-shrink-0">
              <BookIcon />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-dark-50">Learn Algorithms</h1>
              <p className="text-white text-xs sm:text-sm">Interactive algorithm visualization and learning</p>
            </div>
          </div>
        </motion.div>

        {/* Algorithm Selection Panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-800/40 backdrop-blur-xl border border-white rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6"
        >
          <div className="flex flex-col md:flex-row gap-6 lg:items-end">
            {/* Algorithm Selection */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs sm:text-sm font-medium text-white mb-2">Algorithm</label>
              <select
                value={selectedAlgorithm}
                onChange={(e) => setSelectedAlgorithm(e.target.value)}
                className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 bg-dark-900/60 border border-white rounded-lg text-xs sm:text-sm text-dark-100 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300"
              >
                <optgroup label="Simple Sorts (O(n²))">
                  <option value="bubble">Bubble Sort</option>
                  <option value="selection">Selection Sort</option>
                  <option value="insertion">Insertion Sort</option>
                  <option value="cocktail">Cocktail Sort</option>
                  <option value="gnome">Gnome Sort</option>
                  <option value="comb">Comb Sort</option>
                  <option value="oddeven">Odd-Even Sort</option>
                </optgroup>
                <optgroup label="Efficient Sorts (O(n log n))">
                  <option value="merge">Merge Sort</option>
                  <option value="quick">Quick Sort</option>
                  <option value="heap">Heap Sort</option>
                </optgroup>
                <optgroup label="Non-Comparison Sorts">
                  <option value="counting">Counting Sort</option>
                  <option value="radix">Radix Sort</option>
                  <option value="bucket">Bucket Sort</option>
                </optgroup>
                <optgroup label="Search Algorithms">
                  <option value="binary">Binary Search</option>
                  <option value="linear">Linear Search</option>
                  <option value="twopointer">Two Pointer Search</option>
                  <option value="jump">Jump Search</option>
                  <option value="interpolation">Interpolation Search</option>
                  <option value="exponential">Exponential Search</option>
                  <option value="ternary">Ternary Search</option>
                  <option value="fibonacci">Fibonacci Search</option>
                  <option value="sentinel">Sentinel Search</option>
                  <option value="sublist">Sublist Search</option>
                </optgroup>
                <optgroup label="Graph Algorithms">
                  <option value="bfs">BFS Traversal</option>
                  <option value="dfs">DFS Traversal</option>
                  <option value="dijkstra">Dijkstra's Algorithm</option>
                </optgroup>
              </select>
            </div>

            {/* Custom Array Input */}
            <div className="flex-[2] min-w-[300px]">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
                <div className="flex-1 w-full">
                  <label className="block text-xs sm:text-sm font-medium text-white mb-2">Custom Array</label>
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => { setCustomInput(e.target.value); setInputError(''); }}
                    className={`w-full px-2 sm:px-3 py-2 sm:py-2.5 bg-dark-900/60 border ${inputError ? 'border-red-500' : 'border-white'} rounded-lg text-xs sm:text-sm text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300`}
                    placeholder="e.g., 5, 3, 8 (max 20 elements, 0-999)"
                  />
                  {inputError && <p className="text-red-400 text-xs mt-1">{inputError}</p>}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCustomInput}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 bg-dark-700/50 hover:bg-dark-600/50 text-dark-100 font-medium rounded-lg border border-white transition-all duration-300 text-xs sm:text-sm whitespace-nowrap"
                >
                  Set
                </motion.button>
              </div>
            </div>

            {/* Generate Random Array Button */}
            <div className="flex-1">
              <label className="block text-xs sm:text-sm font-medium text-white mb-2">Random Array</label>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerateArray}
                className="w-full px-4 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-medium rounded-lg shadow-lg shadow-emerald-500/10 transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                <ShuffleIcon />
                <span>Generate Random</span>
              </motion.button>
            </div>
          </div>

          {/* Search Target Input - Conditional (Single line below on desktop if needed, or row) */}
          {searchAlgorithms.includes(selectedAlgorithm) && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-full sm:w-64">
                  <label className="block text-xs sm:text-sm font-medium text-white mb-2">Search Target</label>
                  <input
                    type="number"
                    value={searchTarget}
                    onChange={(e) => setSearchTarget(e.target.value)}
                    className="w-full px-2 sm:px-3 py-2 sm:py-2.5 bg-dark-900/60 border border-white/30 rounded-lg text-xs sm:text-sm text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300"
                    placeholder="Target value"
                  />
                </div>
                <p className="text-white text-xs mt-2 sm:mt-6 italic opacity-60">The target element you want to search for in the array above.</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 pb-20 sm:pb-8">
          {/* Visualization Panel */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-dark-800/40 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
              {/* Panel Header */}
              <div className="px-4 py-3 border-b border-white/10 bg-gradient-to-r from-dark-800/60 to-dark-900/60 flex items-center justify-between">
                <div className="min-w-0 flex-1 mr-4">
                  <h2 className="text-sm sm:text-lg font-bold text-white truncate flex items-center gap-2">
                    {currentAlgo.name}
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 sm:hidden">
                      {currentAlgo.complexity}
                    </span>
                  </h2>
                  <p className="text-slate-400 text-xs mt-0.5 line-clamp-1 sm:line-clamp-2">{currentAlgo.description}</p>
                </div>
                <span className="hidden sm:inline-flex px-3 py-1 rounded-lg bg-dark-700/50 text-emerald-400 text-xs font-mono border border-emerald-500/20 whitespace-nowrap shadow-inner">
                  {currentAlgo.complexity}
                </span>
              </div>

              {/* Visualization Area */}
              <div className="p-2 sm:p-6 overflow-hidden relative min-h-[300px] flex items-center justify-center bg-black/20">
                {selectedAlgorithm === 'merge' ? (
                  currentStepData ? (
                    <RecursiveTreeVisualizer
                      currentStep={currentStepData}
                      algorithmType="merge"
                    />
                  ) : (
                    <LoadingPlaceholder />
                  )
                ) : selectedAlgorithm === 'quick' ? (
                  currentStepData ? (
                    <RecursiveTreeVisualizer
                      currentStep={currentStepData}
                      algorithmType="quick"
                    />
                  ) : (
                    <LoadingPlaceholder />
                  )
                ) : selectedAlgorithm === 'heap' ? (
                  currentStepData ? (
                    <HeapSortVisualizer
                      currentStep={currentStepData}
                    />
                  ) : (
                    <LoadingPlaceholder />
                  )
                ) : selectedAlgorithm === 'bucket' ? (
                  currentStepData ? (
                    <BucketSortVisualizer
                      currentStep={currentStepData}
                    />
                  ) : (
                    <LoadingPlaceholder />
                  )
                ) : selectedAlgorithm === 'radix' ? (
                  currentStepData ? (
                    <RadixSortVisualizer
                      currentStep={currentStepData}
                    />
                  ) : (
                    <LoadingPlaceholder />
                  )
                ) : currentAlgo.type === 'graph' ? (
                  currentStepData ? (
                    <div className="w-full min-h-[500px]">
                      <SmartVisualizer
                        algorithmType="graph"
                        algorithmName={selectedAlgorithm}
                        stepData={currentStepData}
                      />
                    </div>
                  ) : (
                    <LoadingPlaceholder />
                  )
                ) : (
                  <div className="w-full bg-[#050505] rounded-[2.5rem] border border-white overflow-hidden shadow-2xl p-6 sm:p-8 relative flex flex-col items-center justify-center min-h-[350px]">
                    {currentStepData ? (
                      <SmartVisualizer
                        algorithmType={currentAlgo.type}
                        algorithmName={selectedAlgorithm}
                        stepData={currentStepData}
                        array={currentAlgo.type === 'sorting' || currentAlgo.type === 'searching' ? currentStepData.array : undefined}
                        activeIndices={currentAlgo.type === 'sorting' || currentAlgo.type === 'searching' ? currentStepData.active : undefined}
                        swappedIndices={currentAlgo.type === 'sorting' || currentAlgo.type === 'searching' ? (currentStepData.swapped ? currentStepData.active : []) : undefined}
                        maxValue={currentAlgo.type === 'sorting' || currentAlgo.type === 'searching' ? (Math.max(...inputArray) + 10) : undefined}
                        useBlockVisualizer={['bubble', 'selection', 'insertion', 'cocktail', 'gnome', 'comb', 'oddeven', 'shell', 'counting', 'heap'].includes(selectedAlgorithm)}
                      />
                    ) : (
                      <LoadingPlaceholder />
                    )}
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="px-3 sm:px-6 pb-3 sm:pb-4 space-y-2 sm:space-y-3">
                {/* Playback Controls - Touch-friendly with larger tap targets on mobile */}
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={isPlaying ? controls.pause : controls.play}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                    className="px-4 sm:px-4 py-2.5 sm:py-2 bg-gradient-to-r from-dark-600 to-dark-700 text-dark-100 font-medium rounded-lg border border-white transition-all duration-300 flex items-center gap-1.5 text-sm sm:text-sm min-w-[80px] justify-center touch-manipulation"
                  >
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={controls.stepBackward}
                    disabled={currentStep <= 0}
                    aria-label="Previous step"
                    className="px-3 sm:px-3 py-2.5 sm:py-2 bg-dark-700/50 hover:bg-dark-600/50 disabled:bg-dark-800/50 disabled:opacity-50 text-dark-200 rounded-lg border border-white transition-all duration-300 flex items-center gap-0.5 text-sm sm:text-sm touch-manipulation active:scale-95"
                  >
                    <ChevronLeftIcon /> <span className="hidden sm:inline">Prev</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={controls.stepForward}
                    disabled={currentStep >= totalSteps - 1}
                    aria-label="Next step"
                    className="px-3 sm:px-3 py-2.5 sm:py-2 bg-dark-700/50 hover:bg-dark-600/50 disabled:bg-dark-800/50 disabled:opacity-50 text-dark-200 rounded-lg border border-white transition-all duration-300 flex items-center gap-0.5 text-sm sm:text-sm touch-manipulation active:scale-95"
                  >
                    <span className="hidden sm:inline">Next</span> <ChevronRightIcon />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={controls.reset}
                    aria-label="Reset animation"
                    className="px-3 sm:px-3 py-2.5 sm:py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg border border-red-500/30 transition-all duration-300 flex items-center gap-0.5 text-sm sm:text-sm touch-manipulation active:scale-95"
                  >
                    <RefreshIcon /> <span className="hidden sm:inline">Reset</span>
                  </motion.button>
                </div>

                {/* Speed Control with +/- buttons - Improved touch targets */}
                <div className="flex items-center gap-1 sm:gap-2 p-2 sm:p-3 bg-dark-900/40 rounded-lg border border-dark-700/30 flex-wrap">
                  <span className="text-xs sm:text-sm font-medium text-white whitespace-nowrap">Speed:</span>
                  <div className="flex items-center gap-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={decreaseSpeed}
                      disabled={speedMultiplier === speedOptions[0]}
                      aria-label="Decrease speed"
                      className="w-8 h-8 sm:w-6 sm:h-6 rounded-lg bg-dark-700/50 hover:bg-dark-600/50 disabled:opacity-50 disabled:cursor-not-allowed text-dark-200 flex items-center justify-center border border-white transition-all text-xs touch-manipulation"
                    >
                      <MinusIcon />
                    </motion.button>
                    <span className="w-10 sm:w-8 text-center text-dark-100 font-semibold text-sm sm:text-sm">
                      {speedMultiplier}x
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={increaseSpeed}
                      disabled={speedMultiplier === speedOptions[speedOptions.length - 1]}
                      aria-label="Increase speed"
                      className="w-8 h-8 sm:w-6 sm:h-6 rounded-lg bg-dark-700/50 hover:bg-dark-600/50 disabled:opacity-50 disabled:cursor-not-allowed text-dark-200 flex items-center justify-center border border-white transition-all text-xs touch-manipulation"
                    >
                      <PlusIcon />
                    </motion.button>
                  </div>
                  {/* Speed options - hidden on mobile, shown on tablet and up */}
                  <div className="hidden sm:flex gap-0.5 ml-auto">
                    {speedOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setSpeedMultiplier(opt)}
                        aria-label={`Set speed to ${opt}x`}
                        className={`px-2 py-1 text-xs rounded-md transition-all touch-manipulation ${speedMultiplier === opt
                          ? 'bg-dark-500 text-dark-100'
                          : 'bg-dark-800/50 text-white hover:bg-dark-700/50'
                          }`}
                      >
                        {opt}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step Progress - Enhanced with better visual feedback */}
                <div className="flex items-center gap-1 sm:gap-3 p-2 sm:p-3 bg-dark-900/40 rounded-lg border border-dark-700/30">
                  <span className="text-xs sm:text-sm font-medium text-white whitespace-nowrap">Progress:</span>
                  <div className="flex-1 h-1 sm:h-1.5 bg-dark-700/50 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-dark-400 to-dark-300 rounded-full"
                      animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs sm:text-sm text-white w-10 sm:w-12 text-right">{currentStep + 1}/{totalSteps}</span>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3 sm:space-y-5 md:space-y-0 md:grid md:grid-cols-2 lg:flex lg:flex-col gap-4 lg:gap-5"
          >
            {/* Algorithm Info Card */}
            <div className="bg-dark-800/40 backdrop-blur-xl border border-white-700/40 rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-dark-100 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-700/50 flex items-center justify-center text-white">
                  <ChartBarIcon />
                </span>
                Algorithm Info
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-dark-900/40 rounded-xl">
                  <span className="text-white text-sm">Time Complexity</span>
                  <span className="text-dark-200 font-semibold">{currentAlgo.complexity}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-dark-900/40 rounded-xl">
                  <span className="text-white text-sm">Space Complexity</span>
                  <span className="text-dark-200 font-semibold">O(1)</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-dark-900/40 rounded-xl">
                  <span className="text-white text-sm">Current Step</span>
                  <span className="text-dark-200 font-semibold">{currentStep + 1} / {totalSteps}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-dark-900/40 rounded-xl">
                  <span className="text-white text-sm">Array Size</span>
                  <span className="text-dark-200 font-semibold">{inputArray.length}</span>
                </div>
              </div>
            </div>

            {/* Statistics Card */}
            <div className="bg-dark-800/40 backdrop-blur-xl border border-white-700/40 rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-dark-100 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <TrendingUpIcon />
                </span>
                Statistics
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-dark-900/40 rounded-xl text-center">
                  <p className="text-2xl font-bold text-dark-200">{totalSteps}</p>
                  <p className="text-white text-xs mt-1">Total Steps</p>
                </div>
                <div className="p-3 bg-dark-900/40 rounded-xl text-center">
                  <p className="text-2xl font-bold text-dark-200">{Math.floor(totalSteps * 0.7)}</p>
                  <p className="text-white text-xs mt-1">Comparisons</p>
                </div>
                <div className="p-3 bg-dark-900/40 rounded-xl text-center">
                  <p className="text-2xl font-bold text-dark-200">{Math.floor(totalSteps * 0.3)}</p>
                  <p className="text-white text-xs mt-1">Swaps</p>
                </div>
                <div className="p-3 bg-dark-900/40 rounded-xl text-center">
                  <p className="text-2xl font-bold text-emerald-400">{isPlaying ? 'Running' : 'Paused'}</p>
                  <p className="text-white text-xs mt-1">Status</p>
                </div>
              </div>
            </div>

            {/* Pro Tip Card */}
            <div className="bg-gradient-to-br from-dark-750/60 to-dark-800/60 border border-white-600/30 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <LightBulbIcon />
                </span>
                <span className="text-dark-200 font-medium">Pro Tip</span>
              </div>
              <p className="text-white text-sm leading-relaxed">
                Use the speed buttons to slow down and observe each step in detail. Step through manually for deeper understanding!
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Learn;

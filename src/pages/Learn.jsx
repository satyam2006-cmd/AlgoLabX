import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SmartVisualizer from '../components/SmartVisualizer';
import { useStepPlayer } from '../engine/stepPlayer';
import { getBubbleSortSteps, getQuickSortSteps, getSelectionSortSteps, getInsertionSortSteps, getMergeSortSteps, getHeapSortSteps, getCountingSortSteps, getRadixSortSteps, getBinarySearchSteps, getLinearSearchSteps, getJumpSearchSteps, getInterpolationSearchSteps, getExponentialSearchSteps, bfsSteps, dfsSteps, dijkstraSteps, knapsackSteps } from '../algorithms/comprehensiveAlgorithms';

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

const Learn = ({ selectedAlgorithm, setSelectedAlgorithm }) => {

  const [inputArray, setInputArray] = useState([64, 34, 25, 12, 22, 11, 90, 45, 33, 77]);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [customInput, setCustomInput] = useState('64, 34, 25, 12, 22, 11, 90, 45, 33, 77');
  const [searchTarget, setSearchTarget] = useState('45');

  const speedOptions = [0.5, 1, 1.5, 2, 3];
  const baseSpeed = 1000;
  const speed = baseSpeed / speedMultiplier;

  const algorithms = {
    bubble: { name: 'Bubble Sort', complexity: 'O(n²)', type: 'sorting', getSteps: getBubbleSortSteps, description: 'Simple sorting algorithm that repeatedly steps through list, compares adjacent elements and swaps them if they are in wrong order.' },
    selection: { name: 'Selection Sort', complexity: 'O(n²)', type: 'sorting', getSteps: getSelectionSortSteps, description: 'Simple sorting algorithm that divides input into sorted and unsorted regions, repeatedly selecting smallest element.' },
    insertion: { name: 'Insertion Sort', complexity: 'O(n²)', type: 'sorting', getSteps: getInsertionSortSteps, description: 'Simple sorting algorithm that builds final sorted array one item at a time by inserting each element into its proper position.' },
    merge: { name: 'Merge Sort', complexity: 'O(n log n)', type: 'sorting', getSteps: getMergeSortSteps, description: 'Efficient divide-and-conquer sorting algorithm that divides array into halves, sorts them, and merges them back together.' },
    quick: { name: 'Quick Sort', complexity: 'O(n log n)', type: 'sorting', getSteps: getQuickSortSteps, description: 'Efficient sorting algorithm using divide-and-conquer strategy. Picks a pivot element and partitions array around it.' },
    heap: { name: 'Heap Sort', complexity: 'O(n log n)', type: 'sorting', getSteps: getHeapSortSteps, description: 'Efficient sorting algorithm that uses a binary heap data structure to sort elements in place.' },
    binary: { name: 'Binary Search', complexity: 'O(log n)', type: 'searching', getSteps: getBinarySearchSteps, description: 'Efficient search algorithm that works on sorted arrays by repeatedly dividing the search interval in half.' },
    bfs: { name: 'BFS Traversal', complexity: 'O(V + E)', type: 'graph', getSteps: bfsSteps, description: 'Graph traversal algorithm that explores neighbors of nodes level by level, starting from a source node.' },
    dfs: { name: 'DFS Traversal', complexity: 'O(V + E)', type: 'graph', getSteps: dfsSteps, description: 'Graph traversal algorithm that explores as far as possible along each branch before backtracking.' },
    dijkstra: { name: 'Dijkstra\'s Algorithm', complexity: 'O((V + E) log V)', type: 'graph', getSteps: dijkstraSteps, description: 'Shortest path algorithm that finds the shortest paths from a source to all other nodes in a weighted graph.' },
    knapsack: { name: '0/1 Knapsack', complexity: 'O(nW)', type: 'dp', getSteps: knapsackSteps, description: 'Dynamic programming algorithm that solves optimization problem of selecting items with maximum value under weight constraints.' },
    counting: { name: 'Counting Sort', complexity: 'O(n + k)', type: 'sorting', getSteps: getCountingSortSteps, description: 'Non-comparison sorting algorithm that sorts elements by counting occurrences of each distinct element.' },
    radix: { name: 'Radix Sort', complexity: 'O(d × (n + k))', type: 'sorting', getSteps: getRadixSortSteps, description: 'Non-comparison sorting algorithm that sorts integers by processing individual digits.' },
    linear: { name: 'Linear Search', complexity: 'O(n)', type: 'searching', getSteps: getLinearSearchSteps, description: 'Sequential search algorithm that checks each element in order until the target is found.' },
    jump: { name: 'Jump Search', complexity: 'O(√n)', type: 'searching', getSteps: getJumpSearchSteps, description: 'Search algorithm that jumps ahead by fixed steps to find the range, then performs linear search.' },
    interpolation: { name: 'Interpolation Search', complexity: 'O(log log n)', type: 'searching', getSteps: getInterpolationSearchSteps, description: 'Search algorithm that estimates the position based on the value distribution.' },
    exponential: { name: 'Exponential Search', complexity: 'O(log n)', type: 'searching', getSteps: getExponentialSearchSteps, description: 'Search algorithm that finds the range by exponential steps, then performs binary search.' }
  };

  const currentAlgo = algorithms[selectedAlgorithm];

  let stepsInput = inputArray;
  if (['binary', 'linear', 'jump', 'interpolation', 'exponential'].includes(selectedAlgorithm)) {
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
  };

  const handleCustomInput = () => {
    try {
      const arr = customInput.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
      if (arr.length > 0) {
        setInputArray(arr);
      }
    } catch (error) {
      console.error('Invalid input');
    }
  };

  const decreaseSpeed = () => {
    const currentIndex = speedOptions.indexOf(speedMultiplier);
    if (currentIndex > 0) {
      setSpeedMultiplier(speedOptions[currentIndex - 1]);
    }
  };

  const increaseSpeed = () => {
    const currentIndex = speedOptions.indexOf(speedMultiplier);
    if (currentIndex < speedOptions.length - 1) {
      setSpeedMultiplier(speedOptions[currentIndex + 1]);
    }
  };

  useEffect(() => {
    controls.reset();
  }, [selectedAlgorithm, inputArray, speedMultiplier]);

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center text-dark-200 shadow-lg border border-dark-500/30">
            <BookIcon />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-dark-50">Learn Algorithms</h1>
            <p className="text-dark-400 text-sm">Interactive algorithm visualization and learning</p>
          </div>
        </motion.div>

        {/* Algorithm Selection Panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-800/40 backdrop-blur-xl border border-dark-700/40 rounded-2xl p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Algorithm</label>
              <select
                value={selectedAlgorithm}
                onChange={(e) => setSelectedAlgorithm(e.target.value)}
                className="w-full px-4 py-3 bg-dark-900/60 border border-dark-600/50 rounded-xl text-dark-100 focus:outline-none focus:ring-2 focus:ring-dark-500/50 focus:border-dark-500/50 transition-all duration-300"
              >
                <optgroup label="Simple Sorts (O(n²))">
                  <option value="bubble">Bubble Sort</option>
                  <option value="selection">Selection Sort</option>
                  <option value="insertion">Insertion Sort</option>
                </optgroup>
                <optgroup label="Efficient Sorts (O(n log n))">
                  <option value="merge">Merge Sort</option>
                  <option value="quick">Quick Sort</option>
                  <option value="heap">Heap Sort</option>
                </optgroup>
                <optgroup label="Non-Comparison Sorts">
                  <option value="counting">Counting Sort</option>
                  <option value="radix">Radix Sort</option>
                </optgroup>
                <optgroup label="Search Algorithms">
                  <option value="binary">Binary Search</option>
                  <option value="linear">Linear Search</option>
                  <option value="jump">Jump Search</option>
                  <option value="interpolation">Interpolation Search</option>
                  <option value="exponential">Exponential Search</option>
                </optgroup>
                <optgroup label="Graph Algorithms">
                  <option value="bfs">BFS Traversal</option>
                  <option value="dfs">DFS Traversal</option>
                  <option value="dijkstra">Dijkstra's Algorithm</option>
                </optgroup>
                <optgroup label="Dynamic Programming">
                  <option value="knapsack">0/1 Knapsack</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Custom Array</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="flex-1 px-4 py-3 bg-dark-900/60 border border-dark-600/50 rounded-xl text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-dark-500/50 focus:border-dark-500/50 transition-all duration-300"
                  placeholder="e.g., 5, 3, 8, 1, 9"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCustomInput}
                  className="px-5 py-3 bg-gradient-to-r from-dark-600 to-dark-700 text-dark-100 font-medium rounded-xl border border-dark-500/30 transition-all duration-300"
                >
                  Set
                </motion.button>
              </div>
            </div>

            {['binary', 'linear', 'jump', 'interpolation', 'exponential'].includes(selectedAlgorithm) && (
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Search Target</label>
                <input
                  type="number"
                  value={searchTarget}
                  onChange={(e) => setSearchTarget(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-900/60 border border-dark-600/50 rounded-xl text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-dark-500/50 focus:border-dark-500/50 transition-all duration-300"
                  placeholder="Enter target value"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Random Array</label>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerateArray}
                className="w-full px-5 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/10 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ShuffleIcon />
                Generate Random
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visualization Panel */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-dark-800/40 backdrop-blur-xl border border-dark-700/40 rounded-2xl overflow-hidden">
              {/* Panel Header */}
              <div className="px-6 py-4 border-b border-dark-700/40 bg-gradient-to-r from-dark-800/60 to-dark-900/60">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-dark-100">{currentAlgo.name}</h2>
                    <p className="text-dark-400 text-sm mt-1">{currentAlgo.description}</p>
                  </div>
                  <span className="px-3 py-1.5 rounded-lg bg-dark-700/50 text-dark-300 text-sm font-medium border border-dark-600/30">
                    {currentAlgo.complexity}
                  </span>
                </div>
              </div>

              {/* Visualization Area */}
              <div className="p-6">
                {currentStepData ? (
                  <SmartVisualizer
                    algorithmType={currentAlgo.type}
                    stepData={currentStepData}
                    array={currentAlgo.type === 'sorting' || currentAlgo.type === 'searching' ? currentStepData.array : undefined}
                    activeIndices={currentAlgo.type === 'sorting' || currentAlgo.type === 'searching' ? currentStepData.active : undefined}
                    swappedIndices={currentAlgo.type === 'sorting' || currentAlgo.type === 'searching' ? (currentStepData.swapped ? currentStepData.active : []) : undefined}
                    maxValue={currentAlgo.type === 'sorting' || currentAlgo.type === 'searching' ? (Math.max(...inputArray) + 10) : undefined}
                  />
                ) : (
                  <div className="flex items-center justify-center p-12 bg-dark-900/40 rounded-xl border border-dark-700/30">
                    <p className="text-dark-500">No step data available</p>
                  </div>
                )}

                {/* Step Description */}
                {currentStepData && (
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-dark-900/50 rounded-xl border border-dark-700/30"
                  >
                    <p className="text-dark-300 text-sm">{currentStepData.description}</p>
                  </motion.div>
                )}
              </div>

              {/* Controls */}
              <div className="px-6 pb-6 space-y-4">
                {/* Playback Controls */}
                <div className="flex items-center gap-3 flex-wrap">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={isPlaying ? controls.pause : controls.play}
                    className="px-5 py-2.5 bg-gradient-to-r from-dark-600 to-dark-700 text-dark-100 font-medium rounded-xl border border-dark-500/30 transition-all duration-300 flex items-center gap-2"
                  >
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={controls.stepBackward}
                    disabled={currentStep <= 0}
                    className="px-4 py-2.5 bg-dark-700/50 hover:bg-dark-600/50 disabled:bg-dark-800/50 disabled:opacity-50 text-dark-200 rounded-xl border border-dark-600/40 transition-all duration-300 flex items-center gap-1"
                  >
                    <ChevronLeftIcon /> Prev
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={controls.stepForward}
                    disabled={currentStep >= totalSteps - 1}
                    className="px-4 py-2.5 bg-dark-700/50 hover:bg-dark-600/50 disabled:bg-dark-800/50 disabled:opacity-50 text-dark-200 rounded-xl border border-dark-600/40 transition-all duration-300 flex items-center gap-1"
                  >
                    Next <ChevronRightIcon />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={controls.reset}
                    className="px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl border border-red-500/30 transition-all duration-300 flex items-center gap-2"
                  >
                    <RefreshIcon /> Reset
                  </motion.button>
                </div>

                {/* Speed Control with +/- buttons */}
                <div className="flex items-center gap-4 p-4 bg-dark-900/40 rounded-xl border border-dark-700/30">
                  <span className="text-sm font-medium text-dark-400">Speed:</span>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={decreaseSpeed}
                      disabled={speedMultiplier === speedOptions[0]}
                      className="w-8 h-8 rounded-lg bg-dark-700/50 hover:bg-dark-600/50 disabled:opacity-50 disabled:cursor-not-allowed text-dark-200 flex items-center justify-center border border-dark-600/40 transition-all"
                    >
                      <MinusIcon />
                    </motion.button>
                    <span className="w-16 text-center text-dark-100 font-semibold text-lg">
                      {speedMultiplier}x
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={increaseSpeed}
                      disabled={speedMultiplier === speedOptions[speedOptions.length - 1]}
                      className="w-8 h-8 rounded-lg bg-dark-700/50 hover:bg-dark-600/50 disabled:opacity-50 disabled:cursor-not-allowed text-dark-200 flex items-center justify-center border border-dark-600/40 transition-all"
                    >
                      <PlusIcon />
                    </motion.button>
                  </div>
                  <div className="flex gap-1 ml-4">
                    {speedOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setSpeedMultiplier(opt)}
                        className={`px-2 py-1 text-xs rounded-md transition-all ${speedMultiplier === opt
                          ? 'bg-dark-500 text-dark-100'
                          : 'bg-dark-800/50 text-dark-400 hover:bg-dark-700/50'
                          }`}
                      >
                        {opt}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step Progress */}
                <div className="flex items-center gap-4 p-4 bg-dark-900/40 rounded-xl border border-dark-700/30">
                  <span className="text-sm font-medium text-dark-400 whitespace-nowrap">Progress:</span>
                  <div className="flex-1 h-2 bg-dark-700/50 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-dark-400 to-dark-300 rounded-full"
                      animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-dark-300 w-16 text-right">{currentStep + 1}/{totalSteps}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-5"
          >
            {/* Algorithm Info Card */}
            <div className="bg-dark-800/40 backdrop-blur-xl border border-dark-700/40 rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-dark-100 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-700/50 flex items-center justify-center text-dark-300">
                  <ChartBarIcon />
                </span>
                Algorithm Info
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-dark-900/40 rounded-xl">
                  <span className="text-dark-400 text-sm">Time Complexity</span>
                  <span className="text-dark-200 font-semibold">{currentAlgo.complexity}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-dark-900/40 rounded-xl">
                  <span className="text-dark-400 text-sm">Space Complexity</span>
                  <span className="text-dark-200 font-semibold">O(1)</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-dark-900/40 rounded-xl">
                  <span className="text-dark-400 text-sm">Current Step</span>
                  <span className="text-dark-200 font-semibold">{currentStep + 1} / {totalSteps}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-dark-900/40 rounded-xl">
                  <span className="text-dark-400 text-sm">Array Size</span>
                  <span className="text-dark-200 font-semibold">{inputArray.length}</span>
                </div>
              </div>
            </div>

            {/* Statistics Card */}
            <div className="bg-dark-800/40 backdrop-blur-xl border border-dark-700/40 rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-dark-100 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <TrendingUpIcon />
                </span>
                Statistics
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-dark-900/40 rounded-xl text-center">
                  <p className="text-2xl font-bold text-dark-200">{totalSteps}</p>
                  <p className="text-dark-500 text-xs mt-1">Total Steps</p>
                </div>
                <div className="p-3 bg-dark-900/40 rounded-xl text-center">
                  <p className="text-2xl font-bold text-dark-200">{Math.floor(totalSteps * 0.7)}</p>
                  <p className="text-dark-500 text-xs mt-1">Comparisons</p>
                </div>
                <div className="p-3 bg-dark-900/40 rounded-xl text-center">
                  <p className="text-2xl font-bold text-dark-200">{Math.floor(totalSteps * 0.3)}</p>
                  <p className="text-dark-500 text-xs mt-1">Swaps</p>
                </div>
                <div className="p-3 bg-dark-900/40 rounded-xl text-center">
                  <p className="text-2xl font-bold text-emerald-400">{isPlaying ? 'Running' : 'Paused'}</p>
                  <p className="text-dark-500 text-xs mt-1">Status</p>
                </div>
              </div>
            </div>

            {/* Pro Tip Card */}
            <div className="bg-gradient-to-br from-dark-750/60 to-dark-800/60 border border-dark-600/30 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <LightBulbIcon />
                </span>
                <span className="text-dark-200 font-medium">Pro Tip</span>
              </div>
              <p className="text-dark-400 text-sm leading-relaxed">
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

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SmartVisualizer from '../components/SmartVisualizer';
import { useStepPlayer } from '../engine/stepPlayer';
import { getBubbleSortSteps, getQuickSortSteps, getSelectionSortSteps, getInsertionSortSteps, getMergeSortSteps, getHeapSortSteps, getCountingSortSteps, getRadixSortSteps, getBinarySearchSteps, getLinearSearchSteps, getJumpSearchSteps, getInterpolationSearchSteps, getExponentialSearchSteps, bfsSteps, dfsSteps, dijkstraSteps, knapsackSteps } from '../algorithms/comprehensiveAlgorithms';

const Learn = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble');
  const [inputArray, setInputArray] = useState([64, 34, 25, 12, 22, 11, 90, 45, 33, 77]);
  const [speed, setSpeed] = useState(1000);
  const [customInput, setCustomInput] = useState('64, 34, 25, 12, 22, 11, 90, 45, 33, 77');
  const [searchTarget, setSearchTarget] = useState('45');

  const algorithms = {
    bubble: {
      name: 'Bubble Sort',
      complexity: 'O(n²)',
      type: 'sorting',
      getSteps: getBubbleSortSteps,
      description: 'Simple sorting algorithm that repeatedly steps through list, compares adjacent elements and swaps them if they are in wrong order.'
    },
    selection: {
      name: 'Selection Sort',
      complexity: 'O(n²)',
      type: 'sorting',
      getSteps: getSelectionSortSteps,
      description: 'Simple sorting algorithm that divides input into sorted and unsorted regions, repeatedly selecting smallest element.'
    },
    insertion: {
      name: 'Insertion Sort',
      complexity: 'O(n²)',
      type: 'sorting',
      getSteps: getInsertionSortSteps,
      description: 'Simple sorting algorithm that builds final sorted array one item at a time by inserting each element into its proper position.'
    },
    merge: {
      name: 'Merge Sort',
      complexity: 'O(n log n)',
      type: 'sorting',
      getSteps: getMergeSortSteps,
      description: 'Efficient divide-and-conquer sorting algorithm that divides array into halves, sorts them, and merges them back together.'
    },
    quick: {
      name: 'Quick Sort',
      complexity: 'O(n log n)',
      type: 'sorting',
      getSteps: getQuickSortSteps,
      description: 'Efficient sorting algorithm using divide-and-conquer strategy. Picks a pivot element and partitions array around it.'
    },
    heap: {
      name: 'Heap Sort',
      complexity: 'O(n log n)',
      type: 'sorting',
      getSteps: getHeapSortSteps,
      description: 'Efficient sorting algorithm that uses a binary heap data structure to sort elements in place.'
    },
    binary: {
      name: 'Binary Search',
      complexity: 'O(log n)',
      type: 'searching',
      getSteps: getBinarySearchSteps,
      description: 'Efficient search algorithm that works on sorted arrays by repeatedly dividing the search interval in half.'
    },
    bfs: {
      name: 'BFS Traversal',
      complexity: 'O(V + E)',
      type: 'graph',
      getSteps: bfsSteps,
      description: 'Graph traversal algorithm that explores neighbors of nodes level by level, starting from a source node.'
    },
    dfs: {
      name: 'DFS Traversal',
      complexity: 'O(V + E)',
      type: 'graph',
      getSteps: dfsSteps,
      description: 'Graph traversal algorithm that explores as far as possible along each branch before backtracking.'
    },
    dijkstra: {
      name: 'Dijkstra\'s Algorithm',
      complexity: 'O((V + E) log V)',
      type: 'graph',
      getSteps: dijkstraSteps,
      description: 'Shortest path algorithm that finds the shortest paths from a source to all other nodes in a weighted graph.'
    },
    knapsack: {
      name: '0/1 Knapsack',
      complexity: 'O(nW)',
      type: 'dp',
      getSteps: knapsackSteps,
      description: 'Dynamic programming algorithm that solves optimization problem of selecting items with maximum value under weight constraints.'
    },
    counting: {
      name: 'Counting Sort',
      complexity: 'O(n + k)',
      type: 'sorting',
      getSteps: getCountingSortSteps,
      description: 'Non-comparison sorting algorithm that sorts elements by counting occurrences of each distinct element.'
    },
    radix: {
      name: 'Radix Sort',
      complexity: 'O(d × (n + k))',
      type: 'sorting',
      getSteps: getRadixSortSteps,
      description: 'Non-comparison sorting algorithm that sorts integers by processing individual digits.'
    },
    linear: {
      name: 'Linear Search',
      complexity: 'O(n)',
      type: 'searching',
      getSteps: getLinearSearchSteps,
      description: 'Sequential search algorithm that checks each element in order until the target is found.'
    },
    jump: {
      name: 'Jump Search',
      complexity: 'O(√n)',
      type: 'searching',
      getSteps: getJumpSearchSteps,
      description: 'Search algorithm that jumps ahead by fixed steps to find the range, then performs linear search.'
    },
    interpolation: {
      name: 'Interpolation Search',
      complexity: 'O(log log n)',
      type: 'searching',
      getSteps: getInterpolationSearchSteps,
      description: 'Search algorithm that estimates the position based on the value distribution.'
    },
    exponential: {
      name: 'Exponential Search',
      complexity: 'O(log n)',
      type: 'searching',
      getSteps: getExponentialSearchSteps,
      description: 'Search algorithm that finds the range by exponential steps, then performs binary search.'
    }
  };

  const currentAlgo = algorithms[selectedAlgorithm];
  
  // Handle search algorithms with target
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

  useEffect(() => {
    controls.reset();
  }, [selectedAlgorithm, inputArray, speed]);

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Learn Algorithms</h1>
        
        {/* Algorithm Selection */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Algorithm</label>
              <select
                value={selectedAlgorithm}
                onChange={(e) => setSelectedAlgorithm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-gray-300 mb-2">Custom Array</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 5, 3, 8, 1, 9"
                />
                <button
                  onClick={handleCustomInput}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Set
                </button>
              </div>
            </div>
            
            {['binary', 'linear', 'jump', 'interpolation', 'exponential'].includes(selectedAlgorithm) && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Search Target</label>
                <input
                  type="number"
                  value={searchTarget}
                  onChange={(e) => setSearchTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter target value"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Random Array</label>
              <button
                onClick={handleGenerateArray}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Generate Random
              </button>
            </div>
          </div>
        </div>

        {/* Algorithm Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-semibold text-white mb-4">{currentAlgo.name}</h2>
              <p className="text-gray-300 mb-4">{currentAlgo.description}</p>
              
              {/* Visualization */}
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
                <div className="flex items-center justify-center p-8 bg-gray-800/30 rounded-xl backdrop-blur-sm border border-gray-700/50">
                  <p className="text-gray-400">No step data available</p>
                </div>
              )}
              
              {/* Controls */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={isPlaying ? controls.pause : controls.play}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>
                  <button
                    onClick={controls.stepForward}
                    disabled={currentStep >= totalSteps - 1}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                  >
                    Step Forward
                  </button>
                  <button
                    onClick={controls.stepBackward}
                    disabled={currentStep <= 0}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                  >
                    Step Backward
                  </button>
                  <button
                    onClick={controls.reset}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Reset
                  </button>
                </div>
                
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-300">Speed:</label>
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="100"
                    value={2100 - speed}
                    onChange={(e) => setSpeed(2100 - parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-300 w-12">{speed}ms</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-300">Step:</label>
                  <input
                    type="range"
                    min="0"
                    max={totalSteps - 1}
                    value={currentStep}
                    onChange={(e) => controls.goToStep(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-300 w-12">{currentStep + 1}/{totalSteps}</span>
                </div>
              </div>
              
              {currentStepData && (
                <div className="mt-4 p-4 bg-gray-700/50 rounded-lg">
                  <p className="text-blue-400 text-sm">{currentStepData.description}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Info Panel */}
          <div className="space-y-4">
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-3">Algorithm Info</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-400 text-sm">Time Complexity:</span>
                  <p className="text-white font-medium">{currentAlgo.complexity}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Space Complexity:</span>
                  <p className="text-white font-medium">O(1)</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Current Step:</span>
                  <p className="text-white font-medium">{currentStep + 1} / {totalSteps}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Array Size:</span>
                  <p className="text-white font-medium">{inputArray.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-3">Statistics</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-400 text-sm">Total Steps:</span>
                  <p className="text-white font-medium">{totalSteps}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Comparisons:</span>
                  <p className="text-white font-medium">{Math.floor(totalSteps * 0.7)}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Swaps:</span>
                  <p className="text-white font-medium">{Math.floor(totalSteps * 0.3)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;

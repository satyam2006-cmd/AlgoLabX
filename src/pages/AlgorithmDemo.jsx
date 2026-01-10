// Algorithm Demo Component
// Shows how to integrate new step-based algorithms with existing visualizer

import React, { useState } from 'react';
import ArrayVisualizer from '../components/ArrayVisualizer';
import { useStepPlayer } from '../engine/stepPlayer';
import {
  selectionSortSteps,
  insertionSortSteps,
  mergeSortSteps,
  heapSortSteps,
  binarySearchSteps,
  bfsSteps,
  dfsSteps,
  dijkstraSteps,
  knapsackSteps,
  algorithmCategories
} from '../algorithms/newIndex.js';

const AlgorithmDemo = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('selectionSort');
  const [inputArray, setInputArray] = useState([64, 34, 25, 12, 22, 11, 90, 45, 33, 77]);
  const [speed, setSpeed] = useState(1000);

  // Algorithm function mapping
  const algorithmFunctions = {
    selectionSort: selectionSortSteps,
    insertionSort: insertionSortSteps,
    mergeSort: mergeSortSteps,
    heapSort: heapSortSteps,
    binarySearch: binarySearchSteps,
    bfs: bfsSteps,
    dfs: dfsSteps,
    dijkstra: dijkstraSteps,
    knapsack: knapsackSteps
  };

  // Get steps for selected algorithm
  const steps = algorithmFunctions[selectedAlgorithm](inputArray);
  const { currentStep, isPlaying, currentStepData, totalSteps, controls } = useStepPlayer(steps, speed);

  const handleGenerateArray = () => {
    const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1);
    setInputArray(newArray);
  };

  const handleCustomInput = (value) => {
    try {
      const arr = value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
      if (arr.length > 0) {
        setInputArray(arr);
      }
    } catch (error) {
      console.error('Invalid input');
    }
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Algorithm Step-Based Visualization Demo</h1>
        
        {/* Algorithm Selection */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Select Algorithm</label>
              <select
                value={selectedAlgorithm}
                onChange={(e) => setSelectedAlgorithm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <optgroup label="Sorting Algorithms">
                  <option value="selectionSort">Selection Sort (O(n²))</option>
                  <option value="insertionSort">Insertion Sort (O(n²))</option>
                  <option value="mergeSort">Merge Sort (O(n log n))</option>
                  <option value="heapSort">Heap Sort (O(n log n))</option>
                </optgroup>
                <optgroup label="Search Algorithms">
                  <option value="binarySearch">Binary Search (O(log n))</option>
                </optgroup>
                <optgroup label="Graph Algorithms">
                  <option value="bfs">BFS Traversal (O(V + E))</option>
                  <option value="dfs">DFS Traversal (O(V + E))</option>
                  <option value="dijkstra">Dijkstra's Algorithm (O((V + E) log V))</option>
                </optgroup>
                <optgroup label="Dynamic Programming">
                  <option value="knapsack">0/1 Knapsack (O(nW))</option>
                </optgroup>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Speed (ms)</label>
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-white text-sm">{speed}ms</span>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Input Array</label>
              <input
                type="text"
                value={inputArray.join(', ')}
                onChange={(e) => handleCustomInput(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter comma-separated numbers"
              />
            </div>
            
            <div className="flex items-end gap-2">
              <button
                onClick={handleGenerateArray}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Random Array
              </button>
              <button
                onClick={controls.reset}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Visualization</h2>
          
          {currentStepData && (
            <div className="space-y-4">
              <ArrayVisualizer
                array={currentStepData.array}
                activeIndices={currentStepData.active}
                swappedIndices={currentStepData.swapped ? currentStepData.active : []}
                maxValue={Math.max(...inputArray) + 10}
              />
              
              <div className="bg-gray-700/50 rounded-lg p-4">
                <p className="text-white font-medium">{currentStepData.message}</p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Controls</h3>
          
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={isPlaying ? controls.pause : controls.play}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            
            <button
              onClick={controls.stepForward}
              disabled={currentStep >= totalSteps - 1}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              Step Forward
            </button>
            
            <button
              onClick={controls.stepBackward}
              disabled={currentStep <= 0}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              Step Backward
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-gray-400 text-sm">Current Step:</span>
              <p className="text-white font-medium">{currentStep + 1} / {totalSteps}</p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Total Steps:</span>
              <p className="text-white font-medium">{totalSteps}</p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Array Size:</span>
              <p className="text-white font-medium">{inputArray.length}</p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Status:</span>
              <p className="text-white font-medium">{isPlaying ? 'Playing' : 'Paused'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmDemo;

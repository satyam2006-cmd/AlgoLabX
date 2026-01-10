import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SmartVisualizer from '../components/SmartVisualizer';
import { useStepPlayer } from '../engine/stepPlayer';
import {
  getBubbleSortSteps,
  getSelectionSortSteps,
  getInsertionSortSteps,
  getMergeSortSteps,
  getQuickSortSteps,
  getHeapSortSteps,
  getCountingSortSteps,
  getRadixSortSteps,
  getBinarySearchSteps,
  getLinearSearchSteps,
  getJumpSearchSteps,
  getInterpolationSearchSteps,
  getExponentialSearchSteps,
  bfsSteps,
  dfsSteps,
  dijkstraSteps,
  knapsackSteps
} from '../algorithms/comprehensiveAlgorithms';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const Compare = () => {
  const [algo1, setAlgo1] = useState('bubble');
  const [algo2, setAlgo2] = useState('quick');
  const [inputArray, setInputArray] = useState([64, 34, 25, 12, 22, 11, 90, 45, 33, 77]);
  const [speed, setSpeed] = useState(1000);
  const [isPlaying, setIsPlaying] = useState(false);

  const algorithms = {
    bubble: {
      name: 'Bubble Sort',
      complexity: 'O(n²)',
      type: 'sorting',
      getSteps: getBubbleSortSteps,
      color: '#3b82f6'
    },
    selection: {
      name: 'Selection Sort',
      complexity: 'O(n²)',
      type: 'sorting',
      getSteps: getSelectionSortSteps,
      color: '#f59e0b'
    },
    insertion: {
      name: 'Insertion Sort',
      complexity: 'O(n²)',
      type: 'sorting',
      getSteps: getInsertionSortSteps,
      color: '#8b5cf6'
    },
    merge: {
      name: 'Merge Sort',
      complexity: 'O(n log n)',
      type: 'sorting',
      getSteps: getMergeSortSteps,
      color: '#10b981'
    },
    quick: {
      name: 'Quick Sort',
      complexity: 'O(n log n)',
      type: 'sorting',
      getSteps: getQuickSortSteps,
      color: '#ef4444'
    },
    heap: {
      name: 'Heap Sort',
      complexity: 'O(n log n)',
      type: 'sorting',
      getSteps: getHeapSortSteps,
      color: '#ec4899'
    },
    binary: {
      name: 'Binary Search',
      complexity: 'O(log n)',
      type: 'searching',
      getSteps: getBinarySearchSteps,
      color: '#06b6d4'
    },
    bfs: {
      name: 'BFS Traversal',
      complexity: 'O(V + E)',
      type: 'graph',
      getSteps: bfsSteps,
      color: '#8338ec'
    },
    dfs: {
      name: 'DFS Traversal',
      complexity: 'O(V + E)',
      type: 'graph',
      getSteps: dfsSteps,
      color: '#f43f5e'
    },
    dijkstra: {
      name: 'Dijkstra\'s Algorithm',
      complexity: 'O((V + E) log V)',
      type: 'graph',
      getSteps: dijkstraSteps,
      color: '#0ea5e9'
    },
    knapsack: {
      name: '0/1 Knapsack',
      complexity: 'O(nW)',
      type: 'dp',
      getSteps: knapsackSteps,
      color: '#a855f7'
    }
  };

  const steps1 = algorithms[algo1].getSteps(inputArray);
  const steps2 = algorithms[algo2].getSteps(inputArray);

  const { currentStep: step1, currentStepData: data1, totalSteps: total1, controls: controls1 } = useStepPlayer(steps1, speed);
  const { currentStep: step2, currentStepData: data2, totalSteps: total2, controls: controls2 } = useStepPlayer(steps2, speed);

  const chartData = [
    {
      name: 'Time Complexity',
      [algorithms[algo1].name]: algo1 === 'bubble' ? 100 : 20,
      [algorithms[algo2].name]: algo2 === 'bubble' ? 100 : 20,
    },
    {
      name: 'Space Complexity',
      [algorithms[algo1].name]: algo1 === 'bubble' ? 10 : 40,
      [algorithms[algo2].name]: algo2 === 'bubble' ? 10 : 40,
    },
    {
      name: 'Steps Taken',
      [algorithms[algo1].name]: total1,
      [algorithms[algo2].name]: total2,
    },
  ];

  const handlePlay = () => {
    setIsPlaying(true);
    controls1.play();
    controls2.play();
  };

  const handlePause = () => {
    setIsPlaying(false);
    controls1.pause();
    controls2.pause();
  };

  const handleReset = () => {
    setIsPlaying(false);
    controls1.reset();
    controls2.reset();
  };

  const handleGenerateArray = () => {
    const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1);
    setInputArray(newArray);
  };

  useEffect(() => {
    handleReset();
  }, [algo1, algo2, inputArray]);

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Compare Algorithms</h1>
        
        {/* Controls */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Algorithm 1</label>
              <select
                value={algo1}
                onChange={(e) => setAlgo1(e.target.value)}
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
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Algorithm 2</label>
              <select
                value={algo2}
                onChange={(e) => setAlgo2(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
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
                <optgroup label="Search Algorithms">
                  <option value="binary">Binary Search</option>
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
              <label className="block text-sm font-medium text-gray-300 mb-2">Speed</label>
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                value={2100 - speed}
                onChange={(e) => setSpeed(2100 - parseInt(e.target.value))}
                className="w-full mt-2"
              />
              <span className="text-sm text-gray-300">{speed}ms</span>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Actions</label>
              <div className="flex gap-2">
                <button
                  onClick={handleGenerateArray}
                  className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                >
                  Random
                </button>
                <button
                  onClick={isPlaying ? handlePause : handlePlay}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button
                  onClick={handleReset}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Side-by-side Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-4" style={{ color: algorithms[algo1].color }}>
              {algorithms[algo1].name}
            </h2>
            <div className="mb-4">
              <span className="text-gray-400 text-sm">Complexity: </span>
              <span className="text-white font-medium">{algorithms[algo1].complexity}</span>
              <span className="text-gray-400 text-sm ml-4">Step: </span>
              <span className="text-white font-medium">{step1 + 1}/{total1}</span>
            </div>
            {data1 && (
              <SmartVisualizer
                algorithmType={algorithms[algo1].type}
                stepData={data1}
                array={algorithms[algo1].type === 'sorting' || algorithms[algo1].type === 'searching' ? data1.array : undefined}
                activeIndices={algorithms[algo1].type === 'sorting' || algorithms[algo1].type === 'searching' ? data1.active : undefined}
                swappedIndices={algorithms[algo1].type === 'sorting' || algorithms[algo1].type === 'searching' ? (data1.swapped ? data1.active : []) : undefined}
                maxValue={algorithms[algo1].type === 'sorting' || algorithms[algo1].type === 'searching' ? (Math.max(...inputArray) + 10) : undefined}
              />
            )}
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-4" style={{ color: algorithms[algo2].color }}>
              {algorithms[algo2].name}
            </h2>
            <div className="mb-4">
              <span className="text-gray-400 text-sm">Complexity: </span>
              <span className="text-white font-medium">{algorithms[algo2].complexity}</span>
              <span className="text-gray-400 text-sm ml-4">Step: </span>
              <span className="text-white font-medium">{step2 + 1}/{total2}</span>
            </div>
            {data2 && (
              <SmartVisualizer
                algorithmType={algorithms[algo2].type}
                stepData={data2}
                array={algorithms[algo2].type === 'sorting' || algorithms[algo2].type === 'searching' ? data2.array : undefined}
                activeIndices={algorithms[algo2].type === 'sorting' || algorithms[algo2].type === 'searching' ? data2.active : undefined}
                swappedIndices={algorithms[algo2].type === 'sorting' || algorithms[algo2].type === 'searching' ? (data2.swapped ? data2.active : []) : undefined}
                maxValue={algorithms[algo2].type === 'sorting' || algorithms[algo2].type === 'searching' ? (Math.max(...inputArray) + 10) : undefined}
              />
            )}
          </div>
        </div>

        {/* Comparison Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Performance Comparison</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#9ca3af' }}
                />
                <Legend />
                <Bar dataKey={algorithms[algo1].name} fill={algorithms[algo1].color} />
                <Bar dataKey={algorithms[algo2].name} fill={algorithms[algo2].color} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Step Progress</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={[
                { name: 'Progress', [algorithms[algo1].name]: ((step1 + 1) / total1) * 100, [algorithms[algo2].name]: ((step2 + 1) / total2) * 100 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#9ca3af' }}
                />
                <Legend />
                <Line type="monotone" dataKey={algorithms[algo1].name} stroke={algorithms[algo1].color} strokeWidth={2} />
                <Line type="monotone" dataKey={algorithms[algo2].name} stroke={algorithms[algo2].color} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compare;

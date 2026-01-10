import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SmartVisualizer from '../components/SmartVisualizer';
import { useStepPlayer } from '../engine/stepPlayer';
import {
  getBubbleSortSteps, getSelectionSortSteps, getInsertionSortSteps, getMergeSortSteps,
  getQuickSortSteps, getHeapSortSteps, getCountingSortSteps, getRadixSortSteps,
  getBinarySearchSteps, getLinearSearchSteps, getJumpSearchSteps, getInterpolationSearchSteps, getExponentialSearchSteps
} from '../algorithms/comprehensiveAlgorithms';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Icon Components
const ScaleIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
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

const Compare = () => {
  const [algo1, setAlgo1] = useState('bubble');
  const [algo2, setAlgo2] = useState('quick');
  const [inputArray, setInputArray] = useState([64, 34, 25, 12, 22, 11, 90, 45, 33, 77]);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchTarget, setSearchTarget] = useState('45');
  const [customInput, setCustomInput] = useState('64, 34, 25, 12, 22, 11, 90, 45, 33, 77');

  const speedOptions = [0.5, 1, 1.5, 2, 3];
  const baseSpeed = 1000;
  const speed = baseSpeed / speedMultiplier;

  const algorithms = {
    bubble: { name: 'Bubble Sort', complexity: 'O(n²)', type: 'sorting', getSteps: getBubbleSortSteps, color: '#6b7280' },
    selection: { name: 'Selection Sort', complexity: 'O(n²)', type: 'sorting', getSteps: getSelectionSortSteps, color: '#f59e0b' },
    insertion: { name: 'Insertion Sort', complexity: 'O(n²)', type: 'sorting', getSteps: getInsertionSortSteps, color: '#8b5cf6' },
    merge: { name: 'Merge Sort', complexity: 'O(n log n)', type: 'sorting', getSteps: getMergeSortSteps, color: '#10b981' },
    quick: { name: 'Quick Sort', complexity: 'O(n log n)', type: 'sorting', getSteps: getQuickSortSteps, color: '#a1a1ab' },
    heap: { name: 'Heap Sort', complexity: 'O(n log n)', type: 'sorting', getSteps: getHeapSortSteps, color: '#ec4899' },
    counting: { name: 'Counting Sort', complexity: 'O(n + k)', type: 'sorting', getSteps: getCountingSortSteps, color: '#f97316' },
    radix: { name: 'Radix Sort', complexity: 'O(d × (n + k))', type: 'sorting', getSteps: getRadixSortSteps, color: '#a855f7' },
    binary: { name: 'Binary Search', complexity: 'O(log n)', type: 'searching', getSteps: getBinarySearchSteps, color: '#3f3f48' },
    linear: { name: 'Linear Search', complexity: 'O(n)', type: 'searching', getSteps: getLinearSearchSteps, color: '#84cc16' },
  };

  const getStepsWithTarget = (algo, array) => {
    if (['binary', 'linear'].includes(algo)) {
      const target = parseInt(searchTarget);
      if (!isNaN(target)) return [...array, target];
    }
    return array;
  };

  const steps1 = algorithms[algo1].getSteps(getStepsWithTarget(algo1, inputArray));
  const steps2 = algorithms[algo2].getSteps(getStepsWithTarget(algo2, inputArray));

  const { currentStep: step1, currentStepData: data1, totalSteps: total1, controls: controls1 } = useStepPlayer(steps1, speed);
  const { currentStep: step2, currentStepData: data2, totalSteps: total2, controls: controls2 } = useStepPlayer(steps2, speed);

  const chartData = [
    { name: 'Time Complexity', [algorithms[algo1].name]: algo1 === 'bubble' ? 100 : 20, [algorithms[algo2].name]: algo2 === 'bubble' ? 100 : 20 },
    { name: 'Space Complexity', [algorithms[algo1].name]: algo1 === 'bubble' ? 10 : 40, [algorithms[algo2].name]: algo2 === 'bubble' ? 10 : 40 },
    { name: 'Steps Taken', [algorithms[algo1].name]: total1, [algorithms[algo2].name]: total2 }
  ];

  const handlePlay = () => { setIsPlaying(true); controls1.play(); controls2.play(); };
  const handlePause = () => { setIsPlaying(false); controls1.pause(); controls2.pause(); };
  const handleReset = () => { setIsPlaying(false); controls1.reset(); controls2.reset(); };

  const handleGenerateArray = () => {
    const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1);
    setInputArray(newArray);
    setCustomInput(newArray.join(', '));
  };

  const handleCustomInput = () => {
    try {
      const arr = customInput.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
      if (arr.length > 0) setInputArray(arr);
    } catch (error) { }
  };

  const decreaseSpeed = () => {
    const currentIndex = speedOptions.indexOf(speedMultiplier);
    if (currentIndex > 0) setSpeedMultiplier(speedOptions[currentIndex - 1]);
  };

  const increaseSpeed = () => {
    const currentIndex = speedOptions.indexOf(speedMultiplier);
    if (currentIndex < speedOptions.length - 1) setSpeedMultiplier(speedOptions[currentIndex + 1]);
  };

  useEffect(() => { handleReset(); }, [algo1, algo2, inputArray]);

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-dark-700 flex items-center justify-center text-dark-200 shadow-lg border border-dark-500/30">
            <ScaleIcon />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-dark-50">Compare Algorithms</h1>
            <p className="text-white text-sm">Side-by-side algorithm performance analysis</p>
          </div>
        </motion.div>

        {/* Controls Panel */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-dark-800/40 backdrop-blur-xl border border-white rounded-2xl p-6 mb-6">
          {/* Row 1: Algorithm Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Algorithm 1</label>
              <select value={algo1} onChange={(e) => setAlgo1(e.target.value)} className="w-full px-4 py-3 bg-dark-900 border border-white rounded-xl text-dark-100 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300">
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
                  <option value="linear">Linear Search</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Algorithm 2</label>
              <select value={algo2} onChange={(e) => setAlgo2(e.target.value)} className="w-full px-4 py-3 bg-dark-900 border border-white rounded-xl text-dark-100 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300">
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
                  <option value="linear">Linear Search</option>
                </optgroup>
              </select>
            </div>
          </div>

          {/* Row 2: Array Input */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-white mb-2">Custom Array</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="flex-1 px-4 py-3 bg-dark-900 border border-white rounded-xl text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300"
                placeholder="e.g., 64, 34, 25, 12, 22, 11, 90, 45"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCustomInput}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-xl transition-all duration-300"
              >
                Set Array
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerateArray}
                className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-medium rounded-xl flex items-center gap-2"
              >
                <ShuffleIcon /> Random
              </motion.button>
            </div>
          </div>

          {/* Row 3: Speed Control & Playback */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Speed Control */}
            <div className="flex items-center gap-3 p-3 bg-dark-900/60 rounded-xl border border-white">
              <span className="text-sm font-medium text-white">Speed:</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={decreaseSpeed}
                disabled={speedMultiplier === speedOptions[0]}
                className="w-9 h-9 rounded-lg bg-dark-700/60 hover:bg-dark-600/60 disabled:opacity-40 text-dark-200 flex items-center justify-center border border-white transition-all"
              >
                <MinusIcon />
              </motion.button>
              <span className="w-14 text-center text-dark-100 font-bold text-lg">{speedMultiplier}x</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={increaseSpeed}
                disabled={speedMultiplier === speedOptions[speedOptions.length - 1]}
                className="w-9 h-9 rounded-lg bg-dark-700/60 hover:bg-dark-600/60 disabled:opacity-40 text-dark-200 flex items-center justify-center border border-white transition-all"
              >
                <PlusIcon />
              </motion.button>
              <div className="h-6 w-px bg-dark-600/50 mx-2" />
              <div className="flex gap-1">
                {speedOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSpeedMultiplier(opt)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${speedMultiplier === opt
                      ? 'bg-dark-500 text-dark-50 border border-dark-400/50'
                      : 'bg-dark-800/60 text-white hover:bg-dark-700/60 border border-transparent'
                      }`}
                  >
                    {opt}x
                  </button>
                ))}
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={isPlaying ? handlePause : handlePlay}
                className="px-5 py-3 bg-gradient-to-r from-dark-600 to-dark-700 text-dark-100 font-medium rounded-xl border border-dark-500/30 flex items-center gap-2"
              >
                {isPlaying ? <PauseIcon /> : <PlayIcon />} {isPlaying ? 'Pause' : 'Play'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReset}
                className="px-5 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl border border-red-500/30 flex items-center gap-2"
              >
                <RefreshIcon /> Reset
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Side-by-side Visualization */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Algorithm 1 Panel */}
          <div className="bg-dark-800/40 backdrop-blur-xl border border-blue-500/30 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white bg-gradient-to-r from-blue-800/60 to-dark-900/60">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-dark-100">{algorithms[algo1].name}</h2>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 text-sm font-medium border border-blue-500/30">{algorithms[algo1].complexity}</span>
                  <span className="px-3 py-1.5 rounded-lg bg-dark-900/50 text-dark-200 text-sm">{step1 + 1}/{total1}</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              {data1 && (
                <SmartVisualizer algorithmType={algorithms[algo1].type} stepData={data1} array={algorithms[algo1].type === 'sorting' || algorithms[algo1].type === 'searching' ? data1.array : undefined} activeIndices={algorithms[algo1].type === 'sorting' || algorithms[algo1].type === 'searching' ? data1.active : undefined} swappedIndices={algorithms[algo1].type === 'sorting' || algorithms[algo1].type === 'searching' ? (data1.swapped ? data1.active : []) : undefined} maxValue={algorithms[algo1].type === 'sorting' || algorithms[algo1].type === 'searching' ? (Math.max(...inputArray) + 10) : undefined} />
              )}
              {data1 && data1.description && (
                <div className="mt-4 p-3 bg-dark-900/50 rounded-xl border border-dark-700/30">
                  <p className="text-white text-sm">{data1.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Algorithm 2 Panel */}
          <div className="bg-dark-800/40 backdrop-blur-xl border border-emerald-500/30 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white bg-gradient-to-r from-emerald-800/60 to-dark-900/60">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-dark-100">{algorithms[algo2].name}</h2>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-sm font-medium border border-emerald-500/30">{algorithms[algo2].complexity}</span>
                  <span className="px-3 py-1.5 rounded-lg bg-dark-900/50 text-dark-200 text-sm">{step2 + 1}/{total2}</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              {data2 && (
                <SmartVisualizer algorithmType={algorithms[algo2].type} stepData={data2} array={algorithms[algo2].type === 'sorting' || algorithms[algo2].type === 'searching' ? data2.array : undefined} activeIndices={algorithms[algo2].type === 'sorting' || algorithms[algo2].type === 'searching' ? data2.active : undefined} swappedIndices={algorithms[algo2].type === 'sorting' || algorithms[algo2].type === 'searching' ? (data2.swapped ? data2.active : []) : undefined} maxValue={algorithms[algo2].type === 'sorting' || algorithms[algo2].type === 'searching' ? (Math.max(...inputArray) + 10) : undefined} />
              )}
              {data2 && data2.description && (
                <div className="mt-4 p-3 bg-dark-900/50 rounded-xl border border-dark-700/30">
                  <p className="text-white text-sm">{data2.description}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Comparison Charts */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-dark-800/40 backdrop-blur-xl border border-white rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-dark-100 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400"><ChartBarIcon /></span>
              Performance Comparison
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a32" />
                <XAxis dataKey="name" stroke="#71717d" fontSize={12} />
                <YAxis stroke="#71717d" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#141418', border: '1px solid #2a2a32', borderRadius: '12px', color: '#fafafa' }} labelStyle={{ color: '#a1a1ab' }} />
                <Legend />
                <Bar dataKey={algorithms[algo1].name} fill="#7bcbe9ff" radius={[4, 4, 0, 0]} />
                <Bar dataKey={algorithms[algo2].name} fill="#366346ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-dark-800/40 backdrop-blur-xl border border-dark-700/40 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-dark-100 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-green-700/50 flex items-center justify-center text-white"><TrendingUpIcon /></span>
              Step Progress
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white text-sm font-medium">{algorithms[algo1].name}</span>
                  <span className="text-dark-200 text-sm">{Math.round(((step1 + 1) / total1) * 100)}%</span>
                </div>
                <div className="h-3 bg-[#7bcbe922] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${((step1 + 1) / total1) * 100}%` }} className="h-full rounded-full bg-[#7bcbe9ff]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white text-sm font-medium">{algorithms[algo2].name}</span>
                  <span className="text-dark-200 text-sm">{Math.round(((step2 + 1) / total2) * 100)}%</span>
                </div>
                <div className="h-3 bg-[#36634622] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${((step2 + 1) / total2) * 100}%` }} className="h-full rounded-full bg-[#366346ff]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dark-700/30">
                <div className="p-4 bg-dark-900/40 rounded-xl text-center">
                  <p className="text-2xl font-bold text-[#7bcbe9ff]">{total1}</p>
                  <p className="text-white text-xs mt-1">{algorithms[algo1].name} Steps</p>
                </div>
                <div className="p-4 bg-dark-900/40 rounded-xl text-center">
                  <p className="text-2xl font-bold text-[#366346ff]">{total2}</p>
                  <p className="text-white text-xs mt-1">{algorithms[algo2].name} Steps</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Compare;

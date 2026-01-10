import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import ArrayVisualizer from '../components/ArrayVisualizer';
import { runPythonCode, loadPyodide } from '../engine/pyodideRunner';

// Icon Components
const BeakerIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const CodeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const ChartBarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
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

const InboxIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
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

const ExclamationIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const CubeIcon = () => (
  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const Experiment = () => {
  const [code, setCode] = useState(`def solve(arr):
    """
    Write your algorithm here
    Use step() to count operations
    Use record(arr) to record states for visualization
    """
    for i in range(len(arr)):
        step()
        for j in range(0, len(arr) - i - 1):
            step()
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                record(arr)
    return arr`);

  const [input, setInput] = useState('64, 34, 25, 12, 22, 11, 90, 45, 33, 77');
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [pyodideLoaded, setPyodideLoaded] = useState(false);
  const [currentVisualizationIndex, setCurrentVisualizationIndex] = useState(0);
  const [debugInfo, setDebugInfo] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  const speedOptions = [0.5, 1, 1.5, 2, 3];
  const baseSpeed = 500;
  const playbackSpeed = baseSpeed / speedMultiplier;

  useEffect(() => {
    const initPyodide = async () => {
      try {
        console.log('Loading Pyodide...');
        console.log('Pyodide loading disabled temporarily');
        setPyodideLoaded(true);
      } catch (error) {
        console.error('Failed to load Pyodide:', error);
      }
    };
    initPyodide();
  }, []);

  const handleRun = async () => {
    if (!pyodideLoaded) {
      setError('Python runtime is still loading...');
      return;
    }
    setIsRunning(true);
    setError(null);
    setResult(null);
    setDebugInfo('');
    try {
      const inputArray = input.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
      const executionResult = await runPythonCode(code, inputArray);
      setDebugInfo(`Input: [${inputArray.join(', ')}]\nSteps: ${executionResult.steps || 0}\nTime: ${executionResult.time_taken ? (executionResult.time_taken * 1000).toFixed(2) : 0}ms\nMemory: ${executionResult.memory_used ? (executionResult.memory_used / 1024).toFixed(2) : 0}KB`);
      if (executionResult.error) {
        setError(executionResult.error);
      } else {
        setResult(executionResult);
        setCurrentVisualizationIndex(0);
      }
    } catch (err) {
      setError('Execution error: ' + (err.message || err.toString()));
    } finally {
      setIsRunning(false);
    }
  };

  const handleGenerateInput = () => {
    const randomArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1);
    setInput(randomArray.join(', '));
  };

  const handleLoadExample = (example) => {
    const examples = {
      bubble: `def solve(arr):
    """Bubble Sort implementation"""
    for i in range(len(arr)):
        step()
        for j in range(0, len(arr) - i - 1):
            step()
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                record(arr)
    return arr`,
      merge: `def solve(arr):
    """Merge Sort implementation"""
    def merge_sort(arr):
        if len(arr) <= 1:
            return arr
        mid = len(arr) // 2
        step()
        left = merge_sort(arr[:mid])
        right = merge_sort(arr[mid:])
        return merge(left, right)
    def merge(left, right):
        result = []
        i = j = 0
        while i < len(left) and j < len(right):
            step()
            if left[i] <= right[j]:
                result.append(left[i])
                i += 1
            else:
                result.append(right[j])
                j += 1
            record(result + left[i:] + right[j:])
        result.extend(left[i:])
        result.extend(right[j:])
        return result
    return merge_sort(arr)`,
      quick: `def solve(arr):
    """Quick Sort implementation"""
    def quicksort(arr, low, high):
        if low < high:
            pi = partition(arr, low, high)
            quicksort(arr, low, pi - 1)
            quicksort(arr, pi + 1, high)
    def partition(arr, low, high):
        pivot = arr[high]
        step()
        i = low - 1
        for j in range(low, high):
            step()
            if arr[j] <= pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
                record(arr)
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        record(arr)
        return i + 1
    quicksort(arr, 0, len(arr) - 1)
    return arr`
    };
    setCode(examples[example]);
  };

  useEffect(() => {
    let interval;
    if (isPlaying && result?.states?.length > 0) {
      interval = setInterval(() => {
        setCurrentVisualizationIndex(prev => {
          if (prev >= result.states.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, result?.states?.length]);

  const handlePlay = () => {
    if (currentVisualizationIndex >= (result?.states?.length || 0) - 1) {
      setCurrentVisualizationIndex(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => { if (currentVisualizationIndex < (result?.states?.length || 0) - 1) setCurrentVisualizationIndex(prev => prev + 1); };
  const handleStepBackward = () => { if (currentVisualizationIndex > 0) setCurrentVisualizationIndex(prev => prev - 1); };
  const handleReset = () => { setCurrentVisualizationIndex(0); setIsPlaying(false); };

  const decreaseSpeed = () => {
    const currentIndex = speedOptions.indexOf(speedMultiplier);
    if (currentIndex > 0) setSpeedMultiplier(speedOptions[currentIndex - 1]);
  };

  const increaseSpeed = () => {
    const currentIndex = speedOptions.indexOf(speedMultiplier);
    if (currentIndex < speedOptions.length - 1) setSpeedMultiplier(speedOptions[currentIndex + 1]);
  };

  const currentVisualizationState = result?.states?.[currentVisualizationIndex] || (result?.output ? result.output : []);

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white shadow-lg border border-purple-500/30">
            <BeakerIcon />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-dark-50">Experiment Lab</h1>
            <p className="text-dark-400 text-sm">Write and test your own algorithms with Python</p>
          </div>
        </motion.div>

        {!pyodideLoaded && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-amber-500/20 border border-amber-500/40 rounded-xl p-4 mb-6 flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-amber-300">Loading Python runtime... This may take a few seconds.</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Editor Section */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-5">
            <div className="bg-dark-800/40 backdrop-blur-xl border border-dark-700/40 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-dark-700/40 bg-gradient-to-r from-dark-800/60 to-dark-900/60">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-dark-100 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-dark-700/50 flex items-center justify-center text-dark-300"><CodeIcon /></span>
                    Python Code Editor
                  </h3>
                  <select onChange={(e) => handleLoadExample(e.target.value)} className="px-4 py-2 bg-dark-900/60 border border-dark-600/50 rounded-xl text-dark-200 text-sm focus:outline-none" defaultValue="">
                    <option value="" disabled>Load Example</option>
                    <option value="bubble">Bubble Sort</option>
                    <option value="merge">Merge Sort</option>
                    <option value="quick">Quick Sort</option>
                  </select>
                </div>
              </div>
              <div className="p-1">
                <Editor height="400px" language="python" theme="vs-dark" value={code} onChange={(value) => setCode(value || '')} options={{ minimap: { enabled: false }, fontSize: 14, lineNumbers: 'on', automaticLayout: true, padding: { top: 16 }, scrollBeyondLastLine: false }} />
              </div>
              <div className="px-6 py-4 border-t border-dark-700/40 bg-dark-900/40">
                <p className="text-dark-400 text-sm mb-2">Available helper functions:</p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1.5 bg-dark-700/40 border border-dark-600/30 rounded-lg text-dark-300 text-sm"><code>step()</code> - Count operation</span>
                  <span className="px-3 py-1.5 bg-dark-700/40 border border-dark-600/30 rounded-lg text-dark-300 text-sm"><code>record(arr)</code> - Record state</span>
                </div>
              </div>
            </div>

            <div className="bg-dark-800/40 backdrop-blur-xl border border-dark-700/40 rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-dark-100 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400"><InboxIcon /></span>
                Input Array
              </h3>
              <div className="flex gap-3">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g., 64, 34, 25, 12, 22, 11" className="flex-1 px-4 py-3 bg-dark-900/60 border border-dark-600/50 rounded-xl text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-dark-500/50 transition-all duration-300" />
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleGenerateInput} className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-medium rounded-xl shadow-lg transition-all duration-300 flex items-center gap-2">
                  <ShuffleIcon /> Random
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleRun} disabled={isRunning || !pyodideLoaded} className="px-6 py-3 bg-gradient-to-r from-dark-600 to-dark-700 disabled:opacity-50 text-dark-100 font-medium rounded-xl border border-dark-500/30 transition-all duration-300 flex items-center gap-2">
                  {isRunning ? <><div className="w-4 h-4 border-2 border-dark-200 border-t-transparent rounded-full animate-spin" /> Running...</> : <><PlayIcon /> Run Code</>}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-5">
            {error && (
              <div className="bg-red-500/20 border border-red-500/40 rounded-2xl p-5">
                <h4 className="text-red-300 font-semibold mb-2 flex items-center gap-2"><ExclamationIcon /> Error</h4>
                <p className="text-red-200 text-sm font-mono bg-red-900/30 p-3 rounded-xl">{error}</p>
              </div>
            )}

            {result && (
              <>
                <div className="bg-dark-800/40 backdrop-blur-xl border border-dark-700/40 rounded-2xl p-5">
                  <h3 className="text-lg font-semibold text-dark-100 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-dark-700/50 flex items-center justify-center text-dark-300"><ChartBarIcon /></span>
                    Performance Metrics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-dark-900/40 rounded-xl text-center">
                      <p className="text-2xl font-bold text-dark-200">{result.time_taken ? (result.time_taken * 1000).toFixed(2) : '0.00'}</p>
                      <p className="text-dark-500 text-xs mt-1">Time (ms)</p>
                    </div>
                    <div className="p-4 bg-dark-900/40 rounded-xl text-center">
                      <p className="text-2xl font-bold text-dark-200">{result.memory_used ? (result.memory_used / 1024).toFixed(2) : '0.00'}</p>
                      <p className="text-dark-500 text-xs mt-1">Memory (KB)</p>
                    </div>
                    <div className="p-4 bg-dark-900/40 rounded-xl text-center">
                      <p className="text-2xl font-bold text-emerald-400">{result.steps || 0}</p>
                      <p className="text-dark-500 text-xs mt-1">Steps</p>
                    </div>
                    <div className="p-4 bg-dark-900/40 rounded-xl text-center">
                      <p className="text-2xl font-bold text-purple-400">{result.states?.length || 0}</p>
                      <p className="text-dark-500 text-xs mt-1">States Recorded</p>
                    </div>
                  </div>
                </div>

                {debugInfo && (
                  <div className="bg-dark-800/40 backdrop-blur-xl border border-dark-700/40 rounded-2xl p-5">
                    <h3 className="text-lg font-semibold text-dark-100 mb-4 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400"><SearchIcon /></span>
                      Debug Information
                    </h3>
                    <div className="bg-dark-900/50 rounded-xl p-4">
                      <pre className="text-dark-300 font-mono text-sm whitespace-pre-wrap">{debugInfo}</pre>
                    </div>
                  </div>
                )}

                <div className="bg-dark-800/40 backdrop-blur-xl border border-dark-700/40 rounded-2xl p-5">
                  <h3 className="text-lg font-semibold text-dark-100 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400"><CheckCircleIcon /></span>
                    Output
                  </h3>
                  <div className="bg-dark-900/50 rounded-xl p-4">
                    <p className="text-emerald-400 font-mono">{JSON.stringify(result.output)}</p>
                  </div>
                </div>

                {result.states && result.states.length > 0 && (
                  <div className="bg-dark-800/40 backdrop-blur-xl border border-dark-700/40 rounded-2xl p-5">
                    <h3 className="text-lg font-semibold text-dark-100 mb-4 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400"><SparklesIcon /></span>
                      Visualization
                    </h3>

                    <div className="mb-5 space-y-4">
                      <div className="flex items-center gap-3 flex-wrap">
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={isPlaying ? handlePause : handlePlay} className="px-5 py-2.5 bg-gradient-to-r from-dark-600 to-dark-700 text-dark-100 font-medium rounded-xl border border-dark-500/30 flex items-center gap-2">
                          {isPlaying ? <PauseIcon /> : <PlayIcon />} {isPlaying ? 'Pause' : 'Play'}
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleStepBackward} disabled={currentVisualizationIndex === 0} className="px-4 py-2.5 bg-dark-700/50 hover:bg-dark-600/50 disabled:opacity-50 text-dark-200 rounded-xl border border-dark-600/40 flex items-center gap-1">
                          <ChevronLeftIcon /> Prev
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleStepForward} disabled={currentVisualizationIndex >= result.states.length - 1} className="px-4 py-2.5 bg-dark-700/50 hover:bg-dark-600/50 disabled:opacity-50 text-dark-200 rounded-xl border border-dark-600/40 flex items-center gap-1">
                          Next <ChevronRightIcon />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleReset} className="px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl border border-red-500/30 flex items-center gap-2">
                          <RefreshIcon /> Reset
                        </motion.button>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-dark-900/40 rounded-xl border border-dark-700/30">
                        <span className="text-sm font-medium text-dark-400">Speed:</span>
                        <div className="flex items-center gap-2">
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={decreaseSpeed} disabled={speedMultiplier === speedOptions[0]} className="w-8 h-8 rounded-lg bg-dark-700/50 hover:bg-dark-600/50 disabled:opacity-50 text-dark-200 flex items-center justify-center border border-dark-600/40">
                            <MinusIcon />
                          </motion.button>
                          <span className="w-12 text-center text-dark-100 font-semibold">{speedMultiplier}x</span>
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={increaseSpeed} disabled={speedMultiplier === speedOptions[speedOptions.length - 1]} className="w-8 h-8 rounded-lg bg-dark-700/50 hover:bg-dark-600/50 disabled:opacity-50 text-dark-200 flex items-center justify-center border border-dark-600/40">
                            <PlusIcon />
                          </motion.button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-dark-900/40 rounded-xl border border-dark-700/30">
                        <span className="text-sm font-medium text-dark-400 whitespace-nowrap">Progress:</span>
                        <div className="flex-1 h-2 bg-dark-700/50 rounded-full overflow-hidden">
                          <motion.div animate={{ width: `${((currentVisualizationIndex + 1) / result.states.length) * 100}%` }} className="h-full bg-gradient-to-r from-dark-400 to-dark-300 rounded-full" />
                        </div>
                        <span className="text-sm text-dark-300 w-16 text-right">{currentVisualizationIndex + 1} / {result.states.length}</span>
                      </div>
                    </div>

                    <div className="bg-dark-900/40 rounded-xl p-4 border border-dark-700/30">
                      <ArrayVisualizer array={currentVisualizationState} maxValue={Math.max(...input.split(',').map(n => parseInt(n.trim()))) + 10} barWidth={25} />
                    </div>
                  </div>
                )}
              </>
            )}

            {!result && !error && (
              <div className="bg-dark-800/40 backdrop-blur-xl border border-dark-700/40 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-dark-700/40 to-dark-800/40 flex items-center justify-center text-dark-500">
                  <CubeIcon />
                </div>
                <h3 className="text-dark-200 font-semibold mb-2">Ready to Experiment</h3>
                <p className="text-dark-500 text-sm max-w-xs mx-auto">Write your algorithm in the editor, set an input array, and click Run to see the results.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Experiment;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import ArrayVisualizer from '../components/ArrayVisualizer';
import { runPythonCode, loadPyodide } from '../engine/pyodideRunner';

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
  const [playbackSpeed, setPlaybackSpeed] = useState(500);

  useEffect(() => {
    const initPyodide = async () => {
      try {
        console.log('Loading Pyodide...');
        // Temporarily disable Pyodide loading to fix main app
        // await loadPyodide();
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
      console.log('Running Python code...');
      const inputArray = input.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
      console.log('Input array:', inputArray);
      
      const executionResult = await runPythonCode(code, inputArray);
      console.log('Execution result:', executionResult);
      
      setDebugInfo(`Input: [${inputArray.join(', ')}]\nSteps: ${executionResult.steps || 0}\nTime: ${executionResult.time_taken ? (executionResult.time_taken * 1000).toFixed(2) : 0}ms\nMemory: ${executionResult.memory_used ? (executionResult.memory_used / 1024).toFixed(2) : 0}KB`);
      
      if (executionResult.error) {
        console.error('Python execution error:', executionResult.error);
        setError(executionResult.error);
      } else {
        console.log('Python execution successful');
        setResult(executionResult);
        setCurrentVisualizationIndex(0);
      }
    } catch (err) {
      console.error('JavaScript execution error:', err);
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
      insertion: `def solve(arr):
    """Insertion Sort implementation"""
    for i in range(1, len(arr)):
        step()
        key = arr[i]
        j = i - 1
        
        while j >= 0 and arr[j] > key:
            step()
            arr[j + 1] = arr[j]
            j -= 1
            record(arr)
        
        arr[j + 1] = key
        record(arr)
    
    return arr`,
      selection: `def solve(arr):
    """Selection Sort implementation"""
    n = len(arr)
    
    for i in range(n):
        step()
        min_idx = i
        
        for j in range(i + 1, n):
            step()
            if arr[j] < arr[min_idx]:
                min_idx = j
        
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
            record(arr)
    
    return arr`,
      heap: `def solve(arr):
    """Heap Sort implementation"""
    def heapify(arr, n, i):
        largest = i
        left = 2 * i + 1
        right = 2 * i + 2
        
        if left < n and arr[left] > arr[largest]:
            step()
            largest = left
        
        if right < n and arr[right] > arr[largest]:
            step()
            largest = right
        
        if largest != i:
            arr[i], arr[largest] = arr[largest], arr[i]
            record(arr)
            heapify(arr, n, largest)
    
    n = len(arr)
    
    # Build max heap
    for i in range(n // 2 - 1, -1, -1):
        step()
        heapify(arr, n, i)
    
    # Extract elements from heap
    for i in range(n - 1, 0, -1):
        step()
        arr[0], arr[i] = arr[i], arr[0]
        record(arr)
        heapify(arr, i, 0)
    
    return arr`,
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
    return arr`,
      binary: `def solve(arr):
    """Binary Search implementation"""
    target = arr[0]  # Use first element as target
    sorted_arr = sorted(arr[1:])  # Search in the rest
    
    left, right = 0, len(sorted_arr) - 1
    iterations = []
    
    while left <= right:
        step()
        mid = (left + right) // 2
        iterations.append(mid)
        
        if sorted_arr[mid] == target:
            record([target] + sorted_arr[:mid] + [sorted_arr[mid]] + sorted_arr[mid+1:])
            return f"Found {target} at index {mid}"
        elif sorted_arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    record([target] + sorted_arr)
    return f"{target} not found"`,
      bfs: `def solve(arr):
    """BFS Traversal implementation"""
    # Create adjacency list from array (treat as tree/graph)
    n = len(arr)
    visited = [False] * n
    queue = []
    result = []
    
    # Start BFS from node 0
    queue.append(0)
    visited[0] = True
    record([0] + [-1] * (n - 1))
    
    while queue:
        step()
        current = queue.pop(0)
        result.append(current)
        
        # Visit neighbors (simplified graph structure)
        for neighbor in range(current + 1, min(current + 3, n)):
            if not visited[neighbor]:
                visited[neighbor] = True
                queue.append(neighbor)
        
        # Create visualization state
        vis_state = [-1] * n
        for i in range(n):
            if visited[i]:
                vis_state[i] = arr[i]
            else:
                vis_state[i] = -1
        record(vis_state)
    
    return result`,
      dfs: `def solve(arr):
    """DFS Traversal implementation"""
    n = len(arr)
    visited = [False] * n
    result = []
    
    def dfs(node):
        step()
        visited[node] = True
        result.append(node)
        
        # Create visualization state
        vis_state = [-1] * n
        for i in range(n):
            if visited[i]:
                vis_state[i] = arr[i]
            else:
                vis_state[i] = -1
        record(vis_state)
        
        # Visit neighbors (simplified graph structure)
        for neighbor in range(node + 1, min(node + 3, n)):
            if not visited[neighbor]:
                dfs(neighbor)
    
    dfs(0)
    return result`,
      dijkstra: `def solve(arr):
    """Dijkstra's Algorithm implementation"""
    n = len(arr)
    distances = [float('inf')] * n
    visited = [False] * n
    previous = [-1] * n
    
    # Start from node 0
    distances[0] = 0
    record(distances.copy())
    
    for _ in range(n):
        step()
        # Find unvisited node with minimum distance
        min_dist = float('inf')
        current = -1
        
        for i in range(n):
            if not visited[i] and distances[i] < min_dist:
                min_dist = distances[i]
                current = i
        
        if current == -1:
            break
        
        visited[current] = True
        
        # Update distances to neighbors
        for neighbor in range(current + 1, min(current + 3, n)):
            weight = abs(arr[neighbor] - arr[current])
            if not visited[neighbor] and distances[current] + weight < distances[neighbor]:
                distances[neighbor] = distances[current] + weight
                previous[neighbor] = current
        
        record(distances.copy())
    
    return distances`,
      knapsack: `def solve(arr):
    """0/1 Knapsack Problem implementation"""
    if len(arr) < 2:
        return "Need at least weights and values arrays"
    
    # Split array into weights and values (simplified)
    weights = arr[:len(arr)//2]
    values = arr[len(arr)//2:]
    capacity = 50  # Fixed capacity
    n = len(weights)
    
    # DP table
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        step()
        for w in range(capacity + 1):
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i-1][w], 
                                  values[i-1] + dp[i-1][w - weights[i-1]])
            else:
                dp[i][w] = dp[i-1][w]
        
        # Record current state (simplified visualization)
        record([dp[i][capacity]])
    
    return dp[n][capacity]`,
      linear: `def solve(arr):
    """Linear Search for maximum element"""
    max_val = arr[0]
    step()
    
    for i in range(1, len(arr)):
        step()
        if arr[i] > max_val:
            max_val = arr[i]
            record(arr)
    
    return [max_val]`
    };
    
    setCode(examples[example]);
  };

  // Visualization playback controls
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

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    if (currentVisualizationIndex < (result?.states?.length || 0) - 1) {
      setCurrentVisualizationIndex(prev => prev + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentVisualizationIndex > 0) {
      setCurrentVisualizationIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentVisualizationIndex(0);
    setIsPlaying(false);
  };

  const currentVisualizationState = result?.states?.[currentVisualizationIndex] || 
                                   (result?.output ? result.output : []);

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Experiment with Algorithms</h1>
        
        {!pyodideLoaded && (
          <div className="bg-yellow-900/50 border border-yellow-600/50 rounded-lg p-4 mb-6">
            <p className="text-yellow-300">Loading Python runtime... This may take a few seconds.</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Editor Section */}
          <div className="space-y-4">
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Python Code Editor</h3>
                <div className="flex gap-2">
                  <select
                    onChange={(e) => handleLoadExample(e.target.value)}
                    className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                    defaultValue=""
                  >
                    <option value="" disabled>Load Example</option>
                    <optgroup label="Sorting Algorithms">
                      <option value="bubble">Bubble Sort</option>
                      <option value="selection">Selection Sort</option>
                      <option value="insertion">Insertion Sort</option>
                      <option value="merge">Merge Sort</option>
                      <option value="quick">Quick Sort</option>
                      <option value="heap">Heap Sort</option>
                    </optgroup>
                    <optgroup label="Search Algorithms">
                      <option value="binary">Binary Search</option>
                      <option value="linear">Linear Search (Max)</option>
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
              </div>
              
              <Editor
                height="400px"
                language="python"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  automaticLayout: true,
                }}
              />
              
              <div className="mt-4 text-sm text-gray-400">
                <p>Available helper functions:</p>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• <code className="text-blue-400">step()</code> - Count an operation</li>
                  <li>• <code className="text-blue-400">record(arr)</code> - Record array state for visualization</li>
                </ul>
              </div>
            </div>

            {/* Input Section */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Input Array</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g., 64, 34, 25, 12, 22, 11, 90, 45, 33, 77"
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleGenerateInput}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Random
                </button>
                <button
                  onClick={handleRun}
                  disabled={isRunning || !pyodideLoaded}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-colors"
                >
                  {isRunning ? 'Running...' : 'Run'}
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            {error && (
              <div className="bg-red-900/50 border border-red-600/50 rounded-lg p-4">
                <h4 className="text-red-300 font-semibold mb-2">Error:</h4>
                <p className="text-red-200 text-sm font-mono">{error}</p>
              </div>
            )}

            {result && (
              <>
                {/* Metrics */}
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700/50 rounded-lg p-3">
                      <p className="text-gray-400 text-sm">Time Taken</p>
                      <p className="text-white font-semibold">{result.time_taken ? (result.time_taken * 1000).toFixed(2) : '0.00'} ms</p>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-3">
                      <p className="text-gray-400 text-sm">Memory Used</p>
                      <p className="text-white font-semibold">{result.memory_used ? (result.memory_used / 1024).toFixed(2) : '0.00'} KB</p>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-3">
                      <p className="text-gray-400 text-sm">Steps Count</p>
                      <p className="text-white font-semibold">{result.steps || 0}</p>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-3">
                      <p className="text-gray-400 text-sm">States Recorded</p>
                      <p className="text-white font-semibold">{result.states?.length || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Debug Info */}
                {debugInfo && (
                  <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white mb-4">Debug Information</h3>
                    <div className="bg-gray-900/50 rounded-lg p-3">
                      <pre className="text-blue-400 font-mono text-sm whitespace-pre-wrap">
                        {debugInfo}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Output */}
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4">Output</h3>
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <p className="text-green-400 font-mono">
                      {JSON.stringify(result.output)}
                    </p>
                  </div>
                </div>

                {/* Visualization */}
                {result.states && result.states.length > 0 && (
                  <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white mb-4">Visualization</h3>
                    
                    {/* Playback Controls */}
                    <div className="mb-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={isPlaying ? handlePause : handlePlay}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                          {isPlaying ? (
                            <>
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8z" clipRule="evenodd" />
                              </svg>
                              Pause
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 001.555-.832V8a1 1 0 00-1.555-.832l-3 2z" clipRule="evenodd" />
                              </svg>
                              Play
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={handleStepBackward}
                          disabled={currentVisualizationIndex === 0}
                          className="px-3 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                        >
                          ← Step
                        </button>
                        
                        <button
                          onClick={handleStepForward}
                          disabled={currentVisualizationIndex >= result.states.length - 1}
                          className="px-3 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                        >
                          Step →
                        </button>
                        
                        <button
                          onClick={handleReset}
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                          Reset
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <label className="text-sm text-gray-300">Speed:</label>
                        <input
                          type="range"
                          min="100"
                          max="2000"
                          step="100"
                          value={2100 - playbackSpeed}
                          onChange={(e) => setPlaybackSpeed(2100 - parseInt(e.target.value))}
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-300 w-16">{playbackSpeed}ms</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="0"
                          max={result.states.length - 1}
                          value={currentVisualizationIndex}
                          onChange={(e) => {
                            setCurrentVisualizationIndex(parseInt(e.target.value));
                            setIsPlaying(false);
                          }}
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-300 w-16">
                          {currentVisualizationIndex + 1} / {result.states.length}
                        </span>
                      </div>
                    </div>
                    
                    <ArrayVisualizer
                      array={currentVisualizationState}
                      maxValue={Math.max(...input.split(',').map(n => parseInt(n.trim()))) + 10}
                      barWidth={25}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experiment;

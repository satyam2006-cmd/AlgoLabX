import React, { useState } from 'react';
import SmartVisualizer from '../components/SmartVisualizer';
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

} from '../algorithms/newIndex.js';

const VisualizerShowcase = () => {
  const [selectedDemo, setSelectedDemo] = useState('sorting'); // Back to sorting default
  const [speed, setSpeed] = useState(1000);

  // Demo data for different visualizer types
  const demos = {
    sorting: {
      title: '📊 Sorting Visualizer',
      description: 'Classic bar visualization for sorting algorithms',
      algorithm: 'selectionSort',
      algorithmType: 'sorting',
      data: [64, 34, 25, 12, 22, 11, 90, 45, 33, 77],
      getSteps: (data) => selectionSortSteps(data)
    },

    searching: {
      title: '📍 Search Visualizer',
      description: 'Bars with pointer highlights for search algorithms',
      algorithm: 'binarySearch',
      algorithmType: 'searching',
      data: [11, 22, 25, 33, 34, 45, 64, 77, 90, 12],
      getSteps: (data) => binarySearchSteps(data)
    },

    graph: {
      title: '🕸️ Graph Visualizer',
      description: 'Nodes and edges for graph algorithms',
      algorithm: 'bfs',
      algorithmType: 'graph',
      data: [64, 34, 25, 12, 22, 11, 90, 45, 33, 77],
      getSteps: (data) => bfsSteps(data)
    },



    os: {
      title: '⏱️ Gantt Chart Visualizer',
      description: 'Timeline visualization for OS scheduling',
      algorithm: 'roundRobin',
      algorithmType: 'os',
      data: {
        processes: [
          { id: 1, arrivalTime: 0, burstTime: 5, priority: 2 },
          { id: 2, arrivalTime: 1, burstTime: 3, priority: 1 },
          { id: 3, arrivalTime: 2, burstTime: 8, priority: 3 },
          { id: 4, arrivalTime: 3, burstTime: 6, priority: 2 }
        ],
        timeline: [
          { processId: 1, startTime: 0, endTime: 2 },
          { processId: 2, startTime: 2, endTime: 4 },
          { processId: 3, startTime: 4, endTime: 6 },
          { processId: 1, startTime: 6, endTime: 7 },
          { processId: 4, startTime: 7, endTime: 9 },
          { processId: 2, startTime: 9, endTime: 10 },
          { processId: 3, startTime: 10, endTime: 12 },
          { processId: 1, startTime: 12, endTime: 13 },
          { processId: 4, startTime: 13, endTime: 15 },
          { processId: 3, startTime: 15, endTime: 17 }
        ]
      },
      getSteps: (data) => [
        { currentTime: 0, processes: data.processes, timeline: data.timeline, timeQuantum: 2 },
        { currentTime: 2, processes: data.processes, timeline: data.timeline, timeQuantum: 2 },
        { currentTime: 4, processes: data.processes, timeline: data.timeline, timeQuantum: 2 },
        { currentTime: 6, processes: data.processes, timeline: data.timeline, timeQuantum: 2 },
        { currentTime: 8, processes: data.processes, timeline: data.timeline, timeQuantum: 2 },
        { currentTime: 10, processes: data.processes, timeline: data.timeline, timeQuantum: 2 },
        { currentTime: 12, processes: data.processes, timeline: data.timeline, timeQuantum: 2 },
        { currentTime: 14, processes: data.processes, timeline: data.timeline, timeQuantum: 2 },
        { currentTime: 16, processes: data.processes, timeline: data.timeline, timeQuantum: 2 }
      ]
    },

    compare: {
      title: '📈 Charts Visualizer',
      description: 'Performance comparison charts',
      algorithm: 'comparison',
      algorithmType: 'compare',
      data: {
        comparisonData: [
          {
            inputSize: 10,
            algorithms: [
              { time: 45, steps: 55, comparisons: 45 },
              { time: 12, steps: 19, comparisons: 19 },
              { time: 8, steps: 15, comparisons: 15 }
            ]
          },
          {
            inputSize: 50,
            algorithms: [
              { time: 1250, steps: 1225, comparisons: 1225 },
              { time: 287, steps: 287, comparisons: 287 },
              { time: 234, steps: 234, comparisons: 234 }
            ]
          },
          {
            inputSize: 100,
            algorithms: [
              { time: 4950, steps: 4950, comparisons: 4950 },
              { time: 664, steps: 664, comparisons: 664 },
              { time: 543, steps: 543, comparisons: 543 }
            ]
          }
        ],
        algorithmNames: ['Selection Sort', 'Merge Sort', 'Quick Sort']
      },
      getSteps: (data) => [
        { comparisonData: data.comparisonData, algorithmNames: data.algorithmNames }
      ]
    }
  };

  const currentDemo = demos[selectedDemo];
  const steps = currentDemo.getSteps(currentDemo.data);
  const { currentStep, isPlaying, currentStepData, totalSteps, controls } = useStepPlayer(steps, speed);

  const handleGenerateRandomData = () => {
    // This would regenerate data for the current demo type
    console.log('Generating new data for', selectedDemo);
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Advanced Algorithm Visualizers</h1>

        {/* Demo Selection */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(demos).map(([key, demo]) => (
              <button
                key={key}
                onClick={() => setSelectedDemo(key)}
                className={`p-4 rounded-lg border-2 transition-all ${selectedDemo === key
                  ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                  : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
                  }`}
              >
                <div className="text-2xl mb-2">{demo.title}</div>
                <div className="text-sm text-left">{demo.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <div className="flex items-end gap-2">
              <button
                onClick={controls.play}
                disabled={isPlaying}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                Play
              </button>
              <button
                onClick={controls.pause}
                disabled={!isPlaying}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                Pause
              </button>
              <button
                onClick={controls.reset}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={controls.stepForward}
                disabled={currentStep >= totalSteps - 1}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                Step Forward
              </button>
              <button
                onClick={controls.stepBackward}
                disabled={currentStep <= 0}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                Step Backward
              </button>
              <button
                onClick={handleGenerateRandomData}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Random Data
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-gray-400 text-sm">Current Step:</span>
              <p className="text-white font-medium">{currentStep + 1} / {totalSteps}</p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Total Steps:</span>
              <p className="text-white font-medium">{totalSteps}</p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Visualizer:</span>
              <p className="text-white font-medium">{currentDemo.title}</p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Status:</span>
              <p className="text-white font-medium">{isPlaying ? 'Playing' : 'Paused'}</p>
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">{currentDemo.title}</h2>

          <SmartVisualizer
            algorithmType={currentDemo.algorithmType}
            stepData={currentStepData}
            comparisonData={currentDemo.data.comparisonData}
            algorithmNames={currentDemo.data.algorithmNames}
            // Only pass array-related props for sorting/searching algorithms
            array={currentDemo.algorithmType === 'sorting' || currentDemo.algorithmType === 'searching' ? (currentStepData?.array || currentDemo.data) : undefined}
            activeIndices={currentDemo.algorithmType === 'sorting' || currentDemo.algorithmType === 'searching' ? (currentStepData?.active || []) : undefined}
            swappedIndices={currentDemo.algorithmType === 'sorting' || currentDemo.algorithmType === 'searching' ? (currentStepData?.swapped ? currentStepData?.active : []) : undefined}
            maxValue={currentDemo.algorithmType === 'sorting' || currentDemo.algorithmType === 'searching' ? (Math.max(...(Array.isArray(currentDemo.data) ? currentDemo.data : [100])) + 10) : undefined}
            chartType="line"
            metrics={['time', 'steps', 'comparisons']}
          />

          {currentStepData?.message && (
            <div className="mt-4 bg-gray-700/50 rounded-lg p-3">
              <p className="text-white text-sm">{currentStepData.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualizerShowcase;

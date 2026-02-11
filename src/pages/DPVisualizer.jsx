import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStepPlayer } from '../engine/stepPlayer';
import { knapsackSteps } from '../algorithms/comprehensiveAlgorithms';

const DPVisualizer = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('knapsack');
  const [itemCount, setItemCount] = useState(5);
  const [capacity, setCapacity] = useState(20);
  const [speed, setSpeed] = useState(1000);
  const [dpTable, setDpTable] = useState([]);
  const [items, setItems] = useState([]);
  const [currentCell, setCurrentCell] = useState({ row: -1, col: -1 });

  // Generate random items for knapsack
  const generateItems = (count) => {
    const newItems = [];
    for (let i = 0; i < count; i++) {
      newItems.push({
        id: i,
        weight: Math.floor(Math.random() * 10) + 1,
        value: Math.floor(Math.random() * 20) + 5
      });
    }
    return newItems;
  };

  // Initialize DP table
  const initializeTable = (items, capacity) => {
    const table = Array(items.length + 1).fill().map(() =>
      Array(capacity + 1).fill(0)
    );
    return table;
  };

  // Generate items and table when parameters change
  useEffect(() => {
    const newItems = generateItems(itemCount);
    setItems(newItems);
    const newTable = initializeTable(newItems, capacity);
    setDpTable(newTable);
  }, [itemCount, capacity]);

  // Get algorithm steps
  const steps = selectedAlgorithm === 'knapsack' ?
    knapsackSteps([...items.map(i => i.weight), ...items.map(i => i.value)]) : [];

  const { isPlaying, currentStepData, totalSteps, controls } = useStepPlayer(steps, speed);

  // Update DP table based on current step
  useEffect(() => {
    if (currentStepData && currentStepData.dpTable) {
      setDpTable(currentStepData.dpTable);
      setCurrentCell({
        row: currentStepData.currentItem || -1,
        col: currentStepData.currentCapacity || -1
      });
    }
  }, [currentStepData]);

  const getCellColor = (row, col) => {
    if (currentCell.row === row && currentCell.col === col) {
      return '#ef4444'; // red-500 for current cell
    }
    if (currentCell.row === row || currentCell.col === col) {
      return '#f59e0b'; // amber-500 for current row/col
    }
    if (row < currentCell.row) {
      return '#10b981'; // green-500 for processed rows
    }
    return '#374151'; // gray-700 for unprocessed
  };

  const getCellAnimation = (row, col) => {
    if (currentCell.row === row && currentCell.col === col) {
      return 'scale-110';
    }
    if (currentCell.row === row || currentCell.col === col) {
      return 'scale-105';
    }
    return 'scale-100';
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      controls.pause();
    } else {
      controls.play();
    }
  };

  const handleReset = () => {
    controls.reset();
    const newItems = generateItems(itemCount);
    setItems(newItems);
    const newTable = initializeTable(newItems, capacity);
    setDpTable(newTable);
    setCurrentCell({ row: -1, col: -1 });
  };

  const handleStepForward = () => {
    controls.stepForward();
  };

  const handleStepBackward = () => {
    controls.stepBackward();
  };

  const regenerateItems = () => {
    const newItems = generateItems(itemCount);
    setItems(newItems);
    const newTable = initializeTable(newItems, capacity);
    setDpTable(newTable);
    handleReset();
  };

  const renderDPTable = () => {
    const cellWidth = Math.min(60, 600 / (capacity + 1));
    const cellHeight = 40;

    return (
      <div className="overflow-x-auto">
        <table className="border-collapse">
          {/* Header Row */}
          <thead>
            <tr>
              <th className="border border-gray-600 bg-gray-700 text-white p-2 text-sm" style={{ width: '80px' }}>
                Items \ Capacity
              </th>
              {Array.from({ length: capacity + 1 }, (_, i) => (
                <th
                  key={i}
                  className={`border border-gray-600 text-white p-2 text-sm font-mono ${currentCell.col === i ? 'bg-amber-600' : 'bg-gray-700'
                    }`}
                  style={{ width: `${cellWidth}px` }}
                >
                  {i}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {dpTable.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td
                  className={`border border-gray-600 text-white p-2 text-sm font-semibold ${currentCell.row === rowIndex ? 'bg-amber-600' : 'bg-gray-700'
                    }`}
                  style={{ width: '80px' }}
                >
                  {rowIndex === 0 ? '∅' : `Item ${rowIndex}`}
                </td>
                {row.map((cellValue, colIndex) => (
                  <td
                    key={colIndex}
                    className={`border border-gray-600 text-center p-1 transition-all duration-300`}
                    style={{
                      width: `${cellWidth}px`,
                      height: `${cellHeight}px`
                    }}
                  >
                    <motion.div
                      className={`w-full h-full flex items-center justify-center text-white font-mono text-sm ${getCellAnimation(
                        rowIndex,
                        colIndex
                      )}`}
                      animate={{
                        backgroundColor: getCellColor(rowIndex, colIndex),
                        scale: currentCell.row === rowIndex && currentCell.col === colIndex ? 1.1 : 1
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {cellValue}
                    </motion.div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderExplanation = () => {
    if (!currentStepData) return null;

    return (
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Step Explanation</h3>
        <div className="space-y-3">
          <p className="text-gray-300">{currentStepData.message}</p>

          {currentCell.row >= 0 && currentCell.col >= 0 && (
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Current Operation:</h4>
              <div className="text-sm text-gray-300 space-y-1">
                <p>Processing Item {currentCell.row} (Weight: {items[currentCell.row - 1]?.weight}, Value: {items[currentCell.row - 1]?.value})</p>
                <p>Capacity: {currentCell.col}</p>
                <p>Decision: {currentStepData.message.includes('Taking') ? 'Take item' : 'Skip item'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderOptimalSolution = () => {
    if (dpTable.length === 0) return null;

    const maxValue = dpTable[items.length][capacity];

    // Backtrack to find selected items
    const selectedItems = [];
    let remainingCapacity = capacity;

    for (let i = items.length; i > 0 && remainingCapacity > 0; i--) {
      if (dpTable[i][remainingCapacity] !== dpTable[i - 1][remainingCapacity]) {
        selectedItems.push(items[i - 1]);
        remainingCapacity -= items[i - 1].weight;
      }
    }

    return (
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Optimal Solution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-white font-medium mb-2">Maximum Value</h4>
            <p className="text-2xl font-bold text-green-400">{maxValue}</p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Selected Items</h4>
            <div className="space-y-1">
              {selectedItems.length > 0 ? (
                selectedItems.map((item, index) => (
                  <div key={index} className="text-sm text-gray-300">
                    Item {item.id + 1}: Weight {item.weight}, Value {item.value}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No items selected</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">📊 DP Visualizer</h1>

        {/* Controls */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Algorithm</label>
              <select
                value={selectedAlgorithm}
                onChange={(e) => setSelectedAlgorithm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="knapsack">0/1 Knapsack</option>
                <option value="fibonacci">Fibonacci (Coming Soon)</option>
                <option value="lcs">Longest Common Subsequence (Coming Soon)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Item Count</label>
              <input
                type="range"
                min="3"
                max="10"
                value={itemCount}
                onChange={(e) => setItemCount(parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-white text-sm">{itemCount} items</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Knapsack Capacity</label>
              <input
                type="range"
                min="10"
                max="50"
                value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-white text-sm">{capacity} capacity</span>
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

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePlayPause}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>

              <button
                onClick={handleStepForward}
                disabled={controls.currentStep >= totalSteps - 1}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                Step Forward
              </button>

              <button
                onClick={handleStepBackward}
                disabled={controls.currentStep <= 0}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                Step Backward
              </button>

              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Reset
              </button>

              <button
                onClick={regenerateItems}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                New Items
              </button>
            </div>

            <div className="text-white">
              <span className="text-sm text-gray-400">Step: </span>
              <span className="font-medium">{controls.currentStep + 1} / {totalSteps}</span>
            </div>
          </div>
        </div>

        {/* Items Information */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Items Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.id} className="bg-gray-700/50 rounded-lg p-3 border border-gray-600">
                <h4 className="text-white font-medium mb-2">Item {item.id + 1}</h4>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>Weight: {item.weight}</p>
                  <p>Value: {item.value}</p>
                  <p>Value/Weight: {(item.value / item.weight).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DP Table */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">DP Table</h3>
          {renderDPTable()}
        </div>

        {/* Legend */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-gray-300">Current Cell</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-amber-500 rounded"></div>
              <span className="text-gray-300">Current Row/Col</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-gray-300">Processed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-700 rounded"></div>
              <span className="text-gray-300">Unprocessed</span>
            </div>
          </div>
        </div>

        {/* Step Explanation */}
        {renderExplanation()}

        {/* Optimal Solution */}
        {renderOptimalSolution()}
      </div>
    </div>
  );
};

export default DPVisualizer;

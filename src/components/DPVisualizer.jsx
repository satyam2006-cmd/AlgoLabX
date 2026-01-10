import React from 'react';
import { motion } from 'framer-motion';

const DPVisualizer = ({
  dpTable = [],
  currentItem = -1,
  currentCapacity = -1,
  maxValue = 100,
  itemWeights = [],
  itemValues = []
}) => {
  const getCellColor = (row, col) => {
    if (row === currentItem && col === currentCapacity) return '#7bcbe9ff'; // User Pale Blue for current cell
    if (row === currentItem || col === currentCapacity) return '#7bcbe988'; // Light blue for current row/col
    if (row < currentItem) return '#366346ff'; // User Dark Green for processed rows
    return '#2a2a32'; // Dark gray/border color for unprocessed
  };

  const getCellSize = (row, col) => {
    if (row === currentItem && col === currentCapacity) return 'scale-110';
    if (row === currentItem || col === currentCapacity) return 'scale-105';
    return 'scale-100';
  };

  if (!dpTable || dpTable.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 bg-black/40 rounded-xl backdrop-blur-sm border border-white">
        <p className="text-white">No DP table data available</p>
      </div>
    );
  }

  const maxCapacity = dpTable[0] ? dpTable[0].length : 0;
  const cellWidth = Math.min(60, 400 / maxCapacity);
  const cellHeight = 40;

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-black/40 rounded-xl backdrop-blur-sm border border-white overflow-x-auto">
      {/* Items Info */}
      <div className="flex space-x-8 text-sm">
        <div className="bg-gray-700/50 rounded-lg p-3">
          <h4 className="text-white font-semibold mb-2">Items</h4>
          <div className="space-y-1">
            {itemWeights.map((weight, i) => (
              <div key={i} className="flex items-center space-x-2">
                <p className="text-white text-lg font-mono">Item {i}: w={weight}, v={itemValues[i]}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-3">
          <h4 className="text-white font-semibold mb-2">Legend</h4>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-[#7bcbe9ff] rounded"></div>
              <span className="text-white">Current Cell</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-[#7bcbe988] rounded"></div>
              <span className="text-white">Current Row/Col</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-[#366346ff] rounded"></div>
              <span className="text-white">Processed</span>
            </div>
          </div>
        </div>
      </div>

      {/* DP Table */}
      <div className="overflow-x-auto">
        <table className="border-collapse">
          {/* Header Row */}
          <thead>
            <tr>
              <th className="border border-white/20 bg-gray-700 text-white p-2 text-sm" style={{ width: '60px' }}>
                Items \ Capacity
              </th>
              {Array.from({ length: maxCapacity }, (_, i) => (
                <th
                  key={i}
                  className={`border border-white/20 text-white p-2 text-sm font-mono ${currentCapacity === i ? 'bg-[#366346ff]' : 'bg-gray-700'
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
                  className={`border border-gray-600 text-white p-2 text-sm font-semibold ${currentItem === rowIndex ? 'bg-[#366346ff]' : 'bg-gray-700'
                    }`}
                  style={{ width: '60px' }}
                >
                  {rowIndex === 0 ? '∅' : rowIndex}
                </td>
                {row.map((cellValue, colIndex) => (
                  <td
                    key={colIndex}
                    className={`border border-gray-600 text-center p-1 transition-all duration-300 ${getCellColor(
                      rowIndex,
                      colIndex
                    )}`}
                    style={{
                      width: `${cellWidth}px`,
                      height: `${cellHeight}px`
                    }}
                  >
                    <motion.div
                      className={`w-full h-full flex items-center justify-center text-white font-mono text-sm ${getCellSize(
                        rowIndex,
                        colIndex
                      )}`}
                      animate={{
                        backgroundColor: getCellColor(rowIndex, colIndex),
                        scale: rowIndex === currentItem && colIndex === currentCapacity ? 1.1 : 1
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

      {/* Current Operation Info */}
      {currentItem >= 0 && currentCapacity >= 0 && (
        <div className="bg-gray-700/50 rounded-lg p-3 text-center max-w-2xl">
          <p className="text-white text-sm">
            Processing Item {currentItem} (Weight: {itemWeights[currentItem]}, Value: {itemValues[currentItem]})
            at Capacity {currentCapacity}
          </p>
        </div>
      )}
    </div>
  );
};

export default DPVisualizer;

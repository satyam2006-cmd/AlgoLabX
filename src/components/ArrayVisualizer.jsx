import React from 'react';
import { motion } from 'framer-motion';

const ArrayVisualizer = ({ 
  array, 
  activeIndices = [], 
  swappedIndices = [], 
  maxValue = 100,
  barWidth = 40,
  barGap = 4 
}) => {
  const getBarColor = (index) => {
    if (swappedIndices.includes(index)) return '#ef4444'; // red-500
    if (activeIndices.includes(index)) return '#3b82f6'; // blue-500
    return '#6b7280'; // gray-500
  };

  const getBarHeight = (value) => {
    return (value / maxValue) * 300; // Max height of 300px
  };

  return (
    <div className="flex items-end justify-center gap-2 p-8 bg-gray-800/30 rounded-xl backdrop-blur-sm border border-gray-700/50">
      {array.map((value, index) => (
        <motion.div
          key={index}
          className="relative flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <motion.div
            className="relative"
            animate={{
              height: getBarHeight(value),
              backgroundColor: getBarColor(index),
            }}
            style={{
              width: `${barWidth}px`,
              backgroundColor: getBarColor(index),
              height: `${getBarHeight(value)}px`,
            }}
            transition={{
              height: { duration: 0.3 },
              backgroundColor: { duration: 0.2 },
            }}
          >
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-white text-sm font-medium">
              {value}
            </div>
          </motion.div>
          <div className="mt-2 text-gray-400 text-xs">
            {index}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ArrayVisualizer;

import React from 'react';
import { motion } from 'framer-motion';  

const ArrayVisualizer = ({
  array,
  activeIndices = [],
  swappedIndices = [],
  maxValue = 100,
  barWidth = 40
}) => {
  const getBarColor = (index) => {
    if (swappedIndices.includes(index)) return '#366346ff'; // User Dark Green for swapped
    if (activeIndices.includes(index)) return '#7bcbe9ff'; // User Pale Blue for active
    return '#2a2a32'; // Dark gray/border color for inactive
  };

  const getBarHeight = (value) => {
    return (value / maxValue) * 300; // Max height of 300px
  };

  // Responsive bar width based on array size
  const responsiveBarWidth = Math.max(20, Math.min(barWidth, Math.floor(window.innerWidth / (array.length + 2))));

  return (
    <div className="flex items-end justify-center gap-1 sm:gap-2 p-3 sm:p-6 bg-black/40 rounded-xl backdrop-blur-sm border border-white overflow-x-auto">
      {array.map((value, index) => (
        <motion.div
          key={index}
          className="relative flex flex-col items-center flex-shrink-0"
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
              width: `${responsiveBarWidth}px`,
              backgroundColor: getBarColor(index),
              height: `${getBarHeight(value)}px`,
            }}
            transition={{
              height: { duration: 0.3 },
              backgroundColor: { duration: 0.2 },
            }}
          >
            <div className="absolute -top-5 sm:-top-6 left-1/2 transform -translate-x-1/2 text-white text-xs font-medium">
              {value}
            </div>
          </motion.div>
          <div className="mt-2 text-white text-xs">
            {index}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ArrayVisualizer;

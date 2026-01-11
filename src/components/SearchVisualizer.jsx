import React from 'react';
import { motion } from 'framer-motion';

const SearchVisualizer = ({
  array,
  activeIndices = [],
  pointerIndex = -1,
  targetIndex = -1,
  maxValue = 100,
  barWidth = 40,
  barGap = 4
}) => {
  const getBarColor = (index) => {
    if (index === targetIndex) return '#366346ff'; // User Dark Green for found
    if (index === pointerIndex) return '#7bcbe9ff'; // User Pale Blue for pointer
    if (activeIndices.includes(index)) return '#7bcbe988'; // Semi-transparent pale blue
    return '#2a2a32'; // Dark gray/border color for inactive
  };

  const getBarHeight = (value) => {
    return (value / maxValue) * 250; // Max height of 250px
  };

  // Responsive bar width based on array size
  const responsiveBarWidth = Math.max(18, Math.min(barWidth, Math.floor(window.innerWidth / (array.length + 2))));

  return (
    <div className="flex flex-col items-center space-y-4 sm:space-y-6 p-3 sm:p-8 bg-black/40 rounded-xl backdrop-blur-sm border border-white w-full">
      {/* Array Bars */}
      <div className="flex items-end justify-center gap-1 sm:gap-2 overflow-x-auto pb-4">
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
              {/* Value label */}
              <div className="absolute -top-4 sm:-top-6 left-1/2 transform -translate-x-1/2 text-white text-xs sm:text-sm font-medium">
                {value}
              </div>

              {/* Index label */}
              <div className="absolute -bottom-4 sm:-bottom-6 left-1/2 transform -translate-x-1/2 text-white text-xs">
                {index}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-xs sm:text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 sm:w-4 h-3 sm:h-4 bg-[#7bcbe9ff] rounded flex-shrink-0"></div>
          <span className="text-white">Pointer</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 sm:w-4 h-3 sm:h-4 bg-[#7bcbe988] rounded flex-shrink-0"></div>
          <span className="text-white">Searching</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 sm:w-4 h-3 sm:h-4 bg-[#366346ff] rounded flex-shrink-0"></div>
          <span className="text-white">Found</span>
        </div>
      </div>
    </div>
  );
};

export default SearchVisualizer;

import React from 'react';
import { motion } from 'framer-motion';

const GanttChartVisualizer = ({ 
  processes = [], 
  timeline = [], 
  currentTime = -1,
  currentTimeQuantum = -1,
  timeQuantum = 2
}) => {
  const getProcessColor = (processId) => {
    const colors = [
      '#3b82f6', // blue-500
      '#10b981', // green-500
      '#f59e0b', // amber-500
      '#ef4444', // red-500
      '#8b5cf6', // purple-500
      '#ec4899', // pink-500
      '#06b6d4', // cyan-500
      '#f97316', // orange-500
    ];
    return colors[processId % colors.length];
  };

  const getTimelineHeight = () => {
    return Math.max(150, processes.length * 40 + 50);
  };

  const maxTime = Math.max(...timeline.map(t => t.endTime), 0);
  const timelineWidth = Math.max(800, maxTime * 60 + 100);

  if (!processes || processes.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-800/30 rounded-xl backdrop-blur-sm border border-gray-700/50">
        <p className="text-gray-400">No scheduling data available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-gray-800/30 rounded-xl backdrop-blur-sm border border-gray-700/50 overflow-x-auto">
      {/* Process Info */}
      <div className="w-full">
        <h3 className="text-white font-semibold mb-3">Process Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {processes.map((process, index) => (
            <div 
              key={process.id}
              className="bg-gray-700/50 rounded-lg p-3 border border-gray-600"
              style={{ borderColor: getProcessColor(process.id) }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: getProcessColor(process.id) }}
                ></div>
                <span className="text-white font-medium">Process {process.id}</span>
              </div>
              <div className="text-sm text-gray-300 space-y-1">
                <div>Arrival: {process.arrivalTime}</div>
                <div>Burst: {process.burstTime}</div>
                <div>Priority: {process.priority}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="w-full overflow-x-auto">
        <h3 className="text-white font-semibold mb-3">Execution Timeline</h3>
        <div className="relative bg-gray-900/50 rounded-lg p-4" style={{ minWidth: `${timelineWidth}px` }}>
          {/* Time markers */}
          <div className="absolute top-0 left-0 right-0 flex justify-between text-xs text-gray-400 px-4">
            {Array.from({ length: Math.ceil(maxTime / 2) + 1 }, (_, i) => (
              <div key={i} className="relative">
                <div className="absolute w-px h-full bg-gray-600" style={{ left: `${i * 120}px` }}></div>
                <span className="ml-2">{i * 2}</span>
              </div>
            ))}
          </div>

          {/* Process timeline */}
          <div className="pt-8">
            {processes.map((process) => (
              <div key={process.id} className="relative h-10 mb-2">
                {/* Process label */}
                <div className="absolute left-0 top-0 text-white text-sm font-medium w-20 text-right pr-2">
                  P{process.id}
                </div>
                
                {/* Execution blocks */}
                <div className="ml-24 relative h-full">
                  {timeline
                    .filter(t => t.processId === process.id)
                    .map((timeBlock, index) => (
                      <motion.div
                        key={index}
                        className="absolute top-0 h-full rounded flex items-center justify-center text-white text-xs font-medium"
                        style={{
                          backgroundColor: getProcessColor(process.id),
                          left: `${timeBlock.startTime * 60}px`,
                          width: `${(timeBlock.endTime - timeBlock.startTime) * 60}px`,
                        }}
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ 
                          opacity: 1, 
                          scaleX: 1,
                          backgroundColor: currentTime >= timeBlock.startTime && currentTime < timeBlock.endTime 
                            ? getProcessColor(process.id) 
                            : getProcessColor(process.id)
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {timeBlock.endTime - timeBlock.startTime > 0.5 && (
                          <span>{timeBlock.endTime - timeBlock.startTime}</span>
                        )}
                      </motion.div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* Current time indicator */}
          {currentTime >= 0 && (
            <motion.div
              className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
              style={{ left: `${currentTime * 60 + 96}px` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                t={currentTime}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-gray-300">Current Time</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-600 rounded"></div>
          <span className="text-gray-300">Time Markers</span>
        </div>
        <div className="text-gray-300">Time Quantum: {timeQuantum}</div>
      </div>

      {/* Current Operation Info */}
      {currentTime >= 0 && (
        <div className="bg-gray-700/50 rounded-lg p-3 text-center max-w-2xl">
          <p className="text-white text-sm">
            Current Time: {currentTime} | Time Quantum: {timeQuantum}
          </p>
        </div>
      )}
    </div>
  );
};

export default GanttChartVisualizer;

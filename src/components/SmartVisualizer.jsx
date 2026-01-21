import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ArrayVisualizer from './ArrayVisualizer';
import SortingVisualizer3D from './SortingVisualizer3D';
import LinearSearchVisualizer from './LinearSearchVisualizer';
import BinarySearchVisualizer from './BinarySearchVisualizer';
import TwoPointerVisualizer from './TwoPointerVisualizer';
import SearchVisualizer from './SearchVisualizer';
import GraphVisualizer from './GraphVisualizer';

import GanttChartVisualizer from './GanttChartVisualizer';
import ChartsVisualizer from './ChartsVisualizer';
import MergeTree from './MergeTree';
import DijkstraVisualizer from './DijkstraVisualizer';
import BFSVisualizer from './BFSVisualizer';
import BucketSortVisualizer from './BucketSortVisualizer';
import RadixSortVisualizer from './RadixSortVisualizer';

const SmartVisualizer = ({
  algorithmType,
  algorithmName,
  stepData,
  comparisonData = null,
  algorithmNames = [],
  ...props
}) => {
  // Determine which visualizer to use based on algorithm type
  const getVisualizer = () => {
    switch (algorithmType) {
      case 'sorting':
        if (stepData?.rootId) {
          return <MergeTree currentStep={stepData} />;
        }
        if (algorithmName === 'bucket') {
          return <BucketSortVisualizer currentStep={stepData} />;
        }
        if (algorithmName === 'radix') {
          return <RadixSortVisualizer currentStep={stepData} />;
        }

        // Use Premium 3D Visualizer for sorting algorithms
        if (props.useBlockVisualizer || stepData?.sorted) {
          return (
            <SortingVisualizer3D
              array={props.array || stepData?.array || []}
              activeIndices={props.activeIndices || stepData?.active || []}
              swappedIndices={props.swappedIndices || stepData?.swapped ? stepData?.active : []} // carefully handle swapped logic
              sortedIndices={stepData?.sorted || []}
              specialIndices={{
                min: stepData?.minIdx,
                key: stepData?.keyIdx,
                check: stepData?.checkIdx,
                pivot: stepData?.pivotIndex // Add pivot if available for quicksort
              }}
              message={stepData?.message || stepData?.description}
            />
          );
        }

        return (
          <ArrayVisualizer
            array={props.array || []}
            activeIndices={props.activeIndices || []}
            swappedIndices={props.swappedIndices || []}
            maxValue={props.maxValue || 100}
            barWidth={props.barWidth || 40}
            barGap={props.barGap || 4}
          />
        );

      case 'searching':
        if (algorithmName === 'linear') {
          return <LinearSearchVisualizer stepData={stepData} />;
        }
        if (algorithmName === 'binary') {
          return <BinarySearchVisualizer stepData={stepData} />;
        }
        if (algorithmName === 'twopointer') {
          return <TwoPointerVisualizer stepData={stepData} />;
        }
        return (
          <div className="w-full flex flex-col items-center gap-4">
            {/* Message Banner */}
            {stepData?.message && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={stepData.message}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[#06b6d4] text-xs sm:text-sm uppercase tracking-[0.15em] font-bold bg-[#06b6d4]/10 px-4 py-2 rounded-lg border border-[#06b6d4]/30 text-center max-w-full"
                >
                  {stepData.message}
                </motion.div>
              </AnimatePresence>
            )}

            <SearchVisualizer
              array={stepData?.array || []}
              activeIndices={stepData?.active || []}
              pointerIndex={stepData?.pointerIndex || -1}
              targetIndex={stepData?.targetIndex || -1}
              maxValue={props.maxValue || 100}
            />
          </div>
        );

      case 'graph':
        if (algorithmName === 'dijkstra') {
          return <DijkstraVisualizer stepData={stepData} />;
        }
        if (algorithmName === 'bfs') {
          return <BFSVisualizer stepData={stepData} />;
        }
        // Add error handling for graph algorithms
        if (!stepData || !stepData.nodes || stepData.nodes.length === 0) {
          return (
            <div className="flex items-center justify-center p-8 bg-dark-900/40 rounded-xl backdrop-blur-sm border border-white/10">
              <p className="text-gray-400">No graph data available</p>
            </div>
          );
        }
        return (
          <div className="w-full flex flex-col items-center gap-4">
            {/* Message Banner */}
            {stepData?.message && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={stepData.message}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[#10b981] text-xs sm:text-sm uppercase tracking-[0.15em] font-bold bg-[#10b981]/10 px-4 py-2 rounded-lg border border-[#10b981]/30 text-center max-w-full"
                >
                  {stepData.message}
                </motion.div>
              </AnimatePresence>
            )}

            <GraphVisualizer
              currentStep={stepData}
            />
          </div>
        );



      case 'os':
        return (
          <GanttChartVisualizer
            processes={stepData?.processes || []}
            timeline={stepData?.timeline || []}
            currentTime={stepData?.currentTime || -1}
            timeQuantum={stepData?.timeQuantum || 2}
          />
        );

      case 'compare':
        return (
          <ChartsVisualizer
            comparisonData={comparisonData || []}
            algorithmNames={algorithmNames || []}
            chartType={props.chartType || 'line'}
            metrics={props.metrics || ['time', 'steps', 'comparisons']}
          />
        );

      default:
        return (
          <div className="flex items-center justify-center p-8 bg-gray-800/30 rounded-xl backdrop-blur-sm border border-gray-700/50">
            <p className="text-gray-400">Unknown algorithm type: {algorithmType}</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {getVisualizer()}
    </div>
  );
};

export default SmartVisualizer;

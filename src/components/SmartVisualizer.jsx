import React from 'react';
import ArrayVisualizer from './ArrayVisualizer';
import SearchVisualizer from './SearchVisualizer';
import GraphVisualizer from './GraphVisualizer';
import DPVisualizer from './DPVisualizer';
import GanttChartVisualizer from './GanttChartVisualizer';
import ChartsVisualizer from './ChartsVisualizer';

const SmartVisualizer = ({ 
  algorithmType, 
  stepData, 
  comparisonData = null,
  algorithmNames = [],
  ...props 
}) => {
  // Determine which visualizer to use based on algorithm type
  const getVisualizer = () => {
    switch (algorithmType) {
      case 'sorting':
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
        return (
          <SearchVisualizer
            array={stepData?.array || []}
            activeIndices={stepData?.active || []}
            pointerIndex={stepData?.pointerIndex || -1}
            targetIndex={stepData?.targetIndex || -1}
            maxValue={props.maxValue || 100}
          />
        );
        
      case 'graph':
        // Add error handling for graph algorithms
        if (!stepData || !stepData.nodes || stepData.nodes.length === 0) {
          return (
            <div className="flex items-center justify-center p-8 bg-gray-800/30 rounded-xl backdrop-blur-sm border border-gray-700/50">
              <p className="text-gray-400">No graph data available</p>
            </div>
          );
        }
        return (
          <GraphVisualizer
            nodes={stepData?.nodes || []}
            edges={stepData?.edges || []}
            visitedNodes={stepData?.visited || []}
            currentNode={stepData?.current || -1}
            activeNodes={stepData?.active || []}
            message={stepData?.message || ''}
            shortestPath={stepData?.shortestPath || []}
          />
        );
        
      case 'dp':
        return (
          <DPVisualizer
            dpTable={stepData?.dpTable || []}
            currentItem={stepData?.currentItem || -1}
            currentCapacity={stepData?.currentCapacity || -1}
            itemWeights={stepData?.itemWeights || []}
            itemValues={stepData?.itemValues || []}
          />
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

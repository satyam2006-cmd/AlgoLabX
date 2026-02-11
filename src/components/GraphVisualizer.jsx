import React from 'react';
import { motion } from 'framer-motion';  

const GraphVisualizer = ({
  currentStep = null,
  nodes: propNodes = [],
  edges: propEdges = [],
  visitedNodes: propVisitedNodes = [],
  currentNode: propCurrentNode = -1,
  activeNodes: propActiveNodes = [],
  message: propMessage = "",
  shortestPath: propShortestPath = []
}) => {
  // Extract data from currentStep if provided, otherwise use props
  const nodes = currentStep?.nodes || propNodes;
  const edges = currentStep?.edges || propEdges;
  const visitedNodes = currentStep?.visited || currentStep?.visitedNodes || propVisitedNodes;
  const currentNode = currentStep?.current ?? currentStep?.currentNode ?? propCurrentNode;
  const activeNodes = currentStep?.active || currentStep?.activeNodes || propActiveNodes;
  const message = currentStep?.message || propMessage;
  const shortestPath = currentStep?.shortestPath || propShortestPath;

  try {
    if (!nodes || nodes.length === 0) {
      return (
        <div className="flex items-center justify-center p-8 bg-black/40 rounded-xl backdrop-blur-sm border border-white">
          <p className="text-gray-400">No nodes to visualize</p>
        </div>
      );
    }

    // Calculate node positions in a grid layout instead of circular
    const calculateNodePositions = (nodeCount) => {
      const positions = [];
      const cols = Math.ceil(Math.sqrt(nodeCount));
      const rows = Math.ceil(nodeCount / cols);

      // Responsive spacing based on window size
      const isMobile = window.innerWidth < 640;
      const spacing = isMobile ? 50 : 80;
      const startX = isMobile ? 30 : 50;
      const startY = isMobile ? 30 : 50;

      let index = 0;
      for (let row = 0; row < rows && index < nodeCount; row++) {
        for (let col = 0; col < cols && index < nodeCount; col++) {
          positions.push({
            x: startX + col * spacing,
            y: startY + row * spacing,
            id: index
          });
          index++;
        }
      }
      return positions;
    };

    const nodePositions = calculateNodePositions(nodes.length);

    const getEdgeColor = (edge, visitedNodes, activeNodes, shortestPath = []) => {
      // Check if this edge is part of the shortest path
      const isInShortestPath = shortestPath.some((node, index) =>
        index < shortestPath.length - 1 &&
        ((edge.from === node && edge.to === shortestPath[index + 1]) ||
          (edge.to === node && edge.from === shortestPath[index + 1]))
      );

      if (isInShortestPath) return '#366346ff'; // Dark Green for shortest path
      if (activeNodes.includes(edge.from) || activeNodes.includes(edge.to)) return '#7bcbe9ff'; // Pale Blue for active
      if (visitedNodes.includes(edge.from) && visitedNodes.includes(edge.to)) return '#36634688'; // Muted green visited
      return '#2a2a32'; // Unvisited
    };

    const getEdgeWidth = (edge, visitedNodes, activeNodes, shortestPath = []) => {
      const isInShortestPath = shortestPath.some((node, index) =>
        index < shortestPath.length - 1 &&
        ((edge.from === node && edge.to === shortestPath[index + 1]) ||
          (edge.to === node && edge.from === shortestPath[index + 1]))
      );

      if (isInShortestPath) return 4;
      if (activeNodes.includes(edge.from) || activeNodes.includes(edge.to)) return 3;
      return 2;
    };

    const getNodeColor = (nodeId) => {
      if (currentNode === nodeId) return '#7bcbe9ff'; // Pale Blue for current
      if (visitedNodes.includes(nodeId)) return '#366346ff'; // Dark Green for visited
      if (activeNodes.includes(nodeId)) return '#7bcbe988'; // Muted blue for active
      return '#2a2a32'; // Dark gray/border color for unvisited
    };

    const getNodeSize = (nodeId) => {
      if (currentNode === nodeId) return 35;
      if (activeNodes.includes(nodeId)) return 30;
      return 25;
    };

    return (
      <div className="flex flex-col items-center space-y-4 p-3 sm:p-6 bg-black/40 rounded-xl backdrop-blur-sm border border-white overflow-x-auto w-full">
        {/* SVG Graph - Responsive sizing */}
        <div className="w-full overflow-x-auto flex justify-center">
          <svg width={Math.max(300, Math.min(600, window.innerWidth - 100))} height="350" className="border border-white/20 rounded-lg bg-dark-950/50 flex-shrink-0">
            {/* Edges */}
            {edges && edges.map((edge, index) => {
              try {
                const fromNode = nodePositions.find(n => n.id === edge.from);
                const toNode = nodePositions.find(n => n.id === edge.to);

                if (!fromNode || !toNode) return null;

                const edgeColor = getEdgeColor(edge, visitedNodes, activeNodes, shortestPath);
                const edgeWidth = getEdgeWidth(edge, visitedNodes, activeNodes, shortestPath);

                return (
                  <g key={index}>
                    <motion.line
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke={edgeColor}
                      strokeWidth={edgeWidth}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    {/* Edge label for weight/distance */}
                    <motion.text
                      x={(fromNode.x + toNode.x) / 2}
                      y={(fromNode.y + toNode.y) / 2 - 5}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#9ca3af"
                      fontSize="9"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      {edge.label || edge.weight || ''}
                    </motion.text>
                  </g>
                );
              } catch (error) {
                console.error('Error rendering edge:', error);
                return null;
              }
            })}

            {/* Nodes */}
            {nodes.map((node, index) => {
              try {
                const position = nodePositions[index];
                if (!position) return null;

                return (
                  <g key={index}>
                    <motion.circle
                      cx={position.x}
                      cy={position.y}
                      r={getNodeSize(index)}
                      fill={getNodeColor(index)}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.text
                      x={position.x}
                      y={position.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      {node.label || `N${index}`}
                    </motion.text>
                    <motion.text
                      x={position.x}
                      y={position.y + 20}
                      textAnchor="middle"
                      dominantBaseline="top"
                      fill="#9ca3af"
                      fontSize="10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      {node.value}
                    </motion.text>
                  </g>
                );
              } catch (error) {
                console.error('Error rendering node:', error);
                return null;
              }
            })}
          </svg>
        </div>

        {/* Message */}
        {message && (
          <div className="w-full text-center mt-4">
            <p className="text-dark-200 text-xs sm:text-sm mb-2">{message}</p>
            {/* Extract and display traversal order if present */}
            {message.includes('Traversal order:') && (
              <div className="bg-gray-700/50 rounded-lg p-2 sm:p-3 mt-2">
                <p className="text-white font-semibold text-xs sm:text-sm">Traversal Order:</p>
                <p className="text-white text-xs sm:text-lg font-mono break-words">
                  {message.match(/Traversal order: \[(.*?)\]/)?.[1] || ''}
                </p>
              </div>
            )}
            {message.includes('Final distances:') && (
              <div className="bg-gray-700/50 rounded-lg p-2 sm:p-3 mt-2">
                <p className="text-white font-semibold text-xs sm:text-sm">Final Distances:</p>
                <p className="text-dark-200 text-xs sm:text-sm font-mono break-words">
                  {message.match(/Final distances: \[(.*?)\]/)?.[1] || ''}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('GraphVisualizer error:', error);
    return (
      <div className="flex items-center justify-center p-4 sm:p-8 bg-black/40 rounded-xl backdrop-blur-sm border border-white">
        <p className="text-red-400 text-xs sm:text-sm">Error rendering graph visualization</p>
      </div>
    );
  }
};

export default GraphVisualizer;

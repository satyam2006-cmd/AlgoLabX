import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useStepPlayer } from '../engine/stepPlayer';
import { bfsSteps, dfsSteps, dijkstraSteps } from '../algorithms/comprehensiveAlgorithms';

const GraphVisualizer = () => {
  const canvasRef = useRef(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bfs');
  const [graphType, setGraphType] = useState('canvas');
  const [nodeCount, setNodeCount] = useState(8);
  const [speed, setSpeed] = useState(1000);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [currentStep, setCurrentStep] = useState(0);

  // Algorithm functions
  const algorithmFunctions = {
    bfs: bfsSteps,
    dfs: dfsSteps,
    dijkstra: dijkstraSteps
  };

  const algorithmInfo = {
    bfs: {
      name: 'BFS Traversal',
      description: 'Breadth-First Search explores graph level by level',
      complexity: 'O(V + E)'
    },
    dfs: {
      name: 'DFS Traversal',
      description: 'Depth-First Search explores as far as possible along each branch',
      complexity: 'O(V + E)'
    },
    dijkstra: {
      name: 'Dijkstra\'s Algorithm',
      description: 'Finds shortest paths from source to all other nodes',
      complexity: 'O((V + E) log V)'
    }
  };

  // Generate random graph data
  const generateGraph = (nodeCount) => {
    const nodes = [];
    const edges = [];
    
    // Create nodes in a circular layout
    const centerX = 300;
    const centerY = 250;
    const radius = 150;
    
    for (let i = 0; i < nodeCount; i++) {
      const angle = (2 * Math.PI * i) / nodeCount - Math.PI / 2;
      nodes.push({
        id: i,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        value: Math.floor(Math.random() * 100) + 1,
        label: `Node ${i}`
      });
    }
    
    // Create edges (connect each node to 2-3 neighbors)
    for (let i = 0; i < nodeCount; i++) {
      const connectionCount = Math.floor(Math.random() * 2) + 2;
      const connectedNodes = new Set();
      
      for (let j = 0; j < connectionCount; j++) {
        let targetNode;
        do {
          targetNode = Math.floor(Math.random() * nodeCount);
        } while (targetNode === i || connectedNodes.has(targetNode));
        
        connectedNodes.add(targetNode);
        
        // Avoid duplicate edges
        const edgeExists = edges.some(e => 
          (e.from === i && e.to === targetNode) || 
          (e.from === targetNode && e.to === i)
        );
        
        if (!edgeExists) {
          edges.push({
            from: i,
            to: targetNode,
            weight: Math.floor(Math.random() * 20) + 1
          });
        }
      }
    }
    
    return { nodes, edges };
  };

  // Generate graph data when node count changes
  useEffect(() => {
    const newGraphData = generateGraph(nodeCount);
    setGraphData(newGraphData);
  }, [nodeCount]);

  // Get algorithm steps
  const steps = algorithmFunctions[selectedAlgorithm] ? 
    algorithmFunctions[selectedAlgorithm](graphData.nodes.map(n => n.value)) : [];
  
  const { currentStepData, totalSteps, controls } = useStepPlayer(steps, speed);

  // Canvas drawing function
  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (graphType === 'canvas') {
      // Draw edges
      graphData.edges.forEach(edge => {
        const fromNode = graphData.nodes[edge.from];
        const toNode = graphData.nodes[edge.to];
        
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        
        // Color edges based on algorithm state
        let strokeColor = '#4b5563'; // gray-600
        let lineWidth = 2;
        
        if (currentStepData) {
          if (currentStepData.active?.includes(edge.from) && currentStepData.active?.includes(edge.to)) {
            strokeColor = '#f59e0b'; // amber-500
            lineWidth = 3;
          } else if (currentStepData.visited?.includes(edge.from) && currentStepData.visited?.includes(edge.to)) {
            strokeColor = '#10b981'; // green-500
          }
        }
        
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        
        // Draw weight label
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        ctx.fillStyle = '#9ca3af';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(edge.weight, midX, midY);
      });
      
      // Draw nodes
      graphData.nodes.forEach(node => {
        let fillColor = '#6b7280'; // gray-500
        let radius = 20;
        
        if (currentStepData) {
          if (currentStepData.current === node.id) {
            fillColor = '#ef4444'; // red-500
            radius = 25;
          } else if (currentStepData.active?.includes(node.id)) {
            fillColor = '#f59e0b'; // amber-500
            radius = 22;
          } else if (currentStepData.visited?.includes(node.id)) {
            fillColor = '#10b981'; // green-500
          }
        }
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw node label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.id, node.x, node.y);
      });
    }
  };

  // Redraw canvas when data changes
  useEffect(() => {
    if (graphType === 'canvas') {
      drawGraph();
    }
  }, [graphData, currentStepData, graphType]);

  // Grid-based rendering
  const renderGridGraph = () => {
    const gridSize = 50;
    const cols = 12;
    const rows = 10;
    
    return (
      <div className="relative bg-gray-900 rounded-lg p-4" style={{ width: '600px', height: '500px' }}>
        {/* Grid lines */}
        <svg width="100%" height="100%" className="absolute inset-0">
          {Array.from({ length: cols + 1 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={i * gridSize}
              y1={0}
              x2={i * gridSize}
              y2="100%"
              stroke="#374151"
              strokeWidth="1"
            />
          ))}
          {Array.from({ length: rows + 1 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1={0}
              y1={i * gridSize}
              x2="100%"
              y2={i * gridSize}
              stroke="#374151"
              strokeWidth="1"
            />
          ))}
          
          {/* Edges */}
          {graphData.edges.map((edge, index) => {
            const fromNode = graphData.nodes[edge.from];
            const toNode = graphData.nodes[edge.to];
            
            let strokeColor = '#4b5563';
            let strokeWidth = 2;
            
            if (currentStepData) {
              if (currentStepData.active?.includes(edge.from) && currentStepData.active?.includes(edge.to)) {
                strokeColor = '#f59e0b';
                strokeWidth = 3;
              } else if (currentStepData.visited?.includes(edge.from) && currentStepData.visited?.includes(edge.to)) {
                strokeColor = '#10b981';
              }
            }
            
            return (
              <g key={index}>
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                />
                <text
                  x={(fromNode.x + toNode.x) / 2}
                  y={(fromNode.y + toNode.y) / 2}
                  fill="#9ca3af"
                  fontSize="12"
                  textAnchor="middle"
                >
                  {edge.weight}
                </text>
              </g>
            );
          })}
          
          {/* Nodes */}
          {graphData.nodes.map(node => {
            let fillColor = '#6b7280';
            let radius = 20;
            
            if (currentStepData) {
              if (currentStepData.current === node.id) {
                fillColor = '#ef4444';
                radius = 25;
              } else if (currentStepData.active?.includes(node.id)) {
                fillColor = '#f59e0b';
                radius = 22;
              } else if (currentStepData.visited?.includes(node.id)) {
                fillColor = '#10b981';
              }
            }
            
            return (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={radius}
                  fill={fillColor}
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <text
                  x={node.x}
                  y={node.y}
                  fill="#ffffff"
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {node.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  const handlePlayPause = () => {
    if (controls.isPlaying) {
      controls.pause();
    } else {
      controls.play();
    }
  };

  const handleReset = () => {
    controls.reset();
  };

  const handleStepForward = () => {
    controls.stepForward();
  };

  const handleStepBackward = () => {
    controls.stepBackward();
  };

  const regenerateGraph = () => {
    const newGraphData = generateGraph(nodeCount);
    setGraphData(newGraphData);
    handleReset();
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">🕸️ Graph Visualizer</h1>
        
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
                <option value="bfs">BFS Traversal</option>
                <option value="dfs">DFS Traversal</option>
                <option value="dijkstra">Dijkstra's Algorithm</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Visualization Type</label>
              <select
                value={graphType}
                onChange={(e) => setGraphType(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="canvas">Canvas</option>
                <option value="grid">Grid/SVG</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Node Count</label>
              <input
                type="range"
                min="3"
                max="15"
                value={nodeCount}
                onChange={(e) => setNodeCount(parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-white text-sm">{nodeCount} nodes</span>
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
                {controls.isPlaying ? 'Pause' : 'Play'}
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
                onClick={regenerateGraph}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                New Graph
              </button>
            </div>
            
            <div className="text-white">
              <span className="text-sm text-gray-400">Step: </span>
              <span className="font-medium">{controls.currentStep + 1} / {totalSteps}</span>
            </div>
          </div>
        </div>

        {/* Algorithm Info */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">
            {algorithmInfo[selectedAlgorithm].name}
          </h3>
          <p className="text-gray-300 mb-2">{algorithmInfo[selectedAlgorithm].description}</p>
          <p className="text-sm text-gray-400">Complexity: {algorithmInfo[selectedAlgorithm].complexity}</p>
        </div>

        {/* Graph Visualization */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Graph Visualization</h3>
          
          <div className="flex justify-center">
            {graphType === 'canvas' ? (
              <canvas
                ref={canvasRef}
                width={600}
                height={500}
                className="bg-gray-900 rounded-lg"
              />
            ) : (
              renderGridGraph()
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-gray-300">Current Node</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
              <span className="text-gray-300">Active Node</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-gray-300">Visited Node</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
              <span className="text-gray-300">Unvisited Node</span>
            </div>
          </div>
        </div>

        {/* Current Step Info */}
        {currentStepData && (
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Current Step</h3>
            <p className="text-gray-300">{currentStepData.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphVisualizer;

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';  

const BFSVisualizer = ({
    stepData,
    className = ""
}) => {
    const {
        nodes = [],
        edges = [],
        visited = [],
        inQueue = [],
        queue = [],
        current = null,
        activeEdge = null,

    } = stepData || {};

    // Premium styling constants
    const colors = {
        idle: '#2a2a32',
        visited: '#22c55e', // Green
        current: '#facc15', // Yellow
        inQueue: '#f97316', // Orange
        activeEdge: '#3b82f6', // Blue
        text: '#ffffff',
        mutedText: 'rgba(255, 255, 255, 0.4)'
    };

    return (
        <div className={`flex flex-col lg:flex-row items-stretch w-full h-full min-h-[500px] gap-8 p-4 ${className}`}>

            {/* Left: Graph Visualization */}
            <div className="flex-[2] relative bg-black/40 rounded-[2rem] border border-white/10 overflow-hidden backdrop-blur-md flex items-center justify-center p-4">
                <svg viewBox="0 0 500 400" className="w-full h-full max-h-[500px]">
                    <defs>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Edges */}
                    {edges.map((edge, idx) => {
                        const fromNode = nodes.find(n => n.id === edge.from);
                        const toNode = nodes.find(n => n.id === edge.to);
                        if (!fromNode || !toNode) return null;

                        const isActive = activeEdge &&
                            ((activeEdge.from === edge.from && activeEdge.to === edge.to) ||
                                (activeEdge.from === edge.to && activeEdge.to === edge.from));

                        const isVisited = visited.includes(edge.from) && visited.includes(edge.to);

                        return (
                            <motion.line
                                key={`edge-${idx}`}
                                x1={fromNode.x}
                                y1={fromNode.y}
                                x2={toNode.x}
                                y2={toNode.y}
                                stroke={isActive ? colors.activeEdge : isVisited ? colors.visited : 'rgba(255,255,255,0.1)'}
                                strokeWidth={isActive ? 3 : 2}
                                animate={{
                                    stroke: isActive ? colors.activeEdge : isVisited ? colors.visited : 'rgba(255,255,255,0.1)',
                                    opacity: isActive || isVisited ? 1 : 0.4
                                }}
                                filter={isActive ? "url(#glow)" : "none"}
                            />
                        );
                    })}

                    {/* Nodes */}
                    {nodes.map((node) => {
                        const isVisited = visited.includes(node.id);
                        const isCurrent = current === node.id;
                        const isInQueue = inQueue.includes(node.id);

                        let nodeColor = colors.idle;
                        let scale = 1;
                        let strokeColor = 'rgba(255,255,255,0.2)';

                        if (isCurrent) {
                            nodeColor = colors.current;
                            strokeColor = colors.current;
                            scale = 1.2;
                        } else if (isInQueue) {
                            nodeColor = colors.inQueue;
                            strokeColor = colors.inQueue;
                            scale = 1.1;
                        } else if (isVisited) {
                            nodeColor = colors.visited;
                            strokeColor = colors.visited;
                            scale = 1;
                        }

                        return (
                            <g key={`node-${node.id}`} className="cursor-pointer">
                                <motion.circle
                                    cx={node.x}
                                    cy={node.y}
                                    r="22"
                                    fill="#050505"
                                    stroke={strokeColor}
                                    strokeWidth="2"
                                    animate={{ scale }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                />
                                <motion.circle
                                    cx={node.x}
                                    cy={node.y}
                                    r="18"
                                    fill={nodeColor}
                                    initial={false}
                                    animate={{
                                        fill: nodeColor,
                                        opacity: isVisited || isCurrent || isInQueue ? 0.3 : 0.05
                                    }}
                                />
                                <text
                                    x={node.x}
                                    y={node.y}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill={isVisited || isCurrent || isInQueue ? colors.text : colors.mutedText}
                                    fontSize="14"
                                    fontWeight="black"
                                >
                                    {node.label}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Right: Queue Panel */}
            <div className="flex-1 bg-black/40 rounded-[2rem] border border-white/10 p-6 flex flex-col backdrop-blur-md">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white/60 text-xs font-bold uppercase tracking-[0.3em]">BFS Queue</h3>
                    <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-400" />
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                    </div>
                </div>

                <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                    {queue.length === 0 && !current ? (
                        <div className="flex flex-col items-center justify-center py-12 opacity-20">
                            <div className="w-12 h-12 border-2 border-dashed border-white rounded-xl mb-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Queue Empty</span>
                        </div>
                    ) : (
                        <AnimatePresence mode='popLayout'>
                            {/* Showing current being processed at the top as "Dequeued" */}
                            {current !== null && (
                                <motion.div
                                    key={`current-${current}`}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: 20, opacity: 0 }}
                                    className="flex items-center gap-4 px-5 py-4 rounded-xl border border-yellow-400/30 bg-yellow-400/10 mb-4"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-yellow-400 flex items-center justify-center font-black text-black">
                                        {nodes.find(n => n.id === current)?.label}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-yellow-400/60 font-black uppercase tracking-widest">Processing</span>
                                        <span className="text-white font-bold">Current Node</span>
                                    </div>
                                </motion.div>
                            )}

                            {/* Rest of the queue */}
                            {queue.map((nodeId, idx) => (
                                <motion.div
                                    key={`queue-${nodeId}`}
                                    layout
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    className="flex items-center gap-4 px-5 py-3 rounded-xl border border-white/5 bg-white/5"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center font-black text-orange-400 text-sm">
                                        {nodes.find(n => n.id === nodeId)?.label}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-white/20 font-bold uppercase tracking-tighter">Pos {idx + 1}</span>
                                        <span className="text-white/60 text-xs font-bold">Node {nodeId}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {/* Legend/Info */}
                <div className="mt-auto pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                        <span className="text-[10px] text-white/30 uppercase font-bold">Current</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                        <span className="text-[10px] text-white/30 uppercase font-bold">In Queue</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-[10px] text-white/30 uppercase font-bold">Visited</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span className="text-[10px] text-white/30 uppercase font-bold">Edge Discovery</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BFSVisualizer;

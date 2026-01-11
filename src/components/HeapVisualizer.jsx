import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HeapVisualizer = ({
    heap,
    activeIndices = [],
    compareIndices = [],
    sortedIndices = [],
    highlightColor = 'default'
}) => {
    // Constants for rendering
    const NODE_RADIUS = 25;
    const VERTICAL_SPACING = 80;

    // Calculate node positions dynamically based on tree depth
    const getPosition = (index, totalNodes) => {
        const level = Math.floor(Math.log2(index + 1));
        const maxLevel = Math.floor(Math.log2(totalNodes));
        const levelNodes = Math.pow(2, level);
        const positionInLevel = index - levelNodes + 1;

        // Dynamic width calculation
        const canvasWidth = Math.max(800, Math.pow(2, maxLevel) * 60);
        const sectionWidth = canvasWidth / levelNodes;

        const x = sectionWidth * positionInLevel + sectionWidth / 2 - canvasWidth / 2;
        const y = level * VERTICAL_SPACING;

        return { x, y };
    };

    const getNodeColor = (index) => {
        if (compareIndices.includes(index)) return 'bg-yellow-500 border-yellow-300';
        if (activeIndices.includes(index)) {
            if (highlightColor === 'red') return 'bg-red-500 border-red-300';
            if (highlightColor === 'green') return 'bg-emerald-500 border-emerald-300';
            return 'bg-cyan-500 border-cyan-300';
        }
        if (sortedIndices.includes(index)) return 'bg-emerald-600 border-emerald-400 opacity-50';
        return 'bg-dark-600 border-dark-400 group-hover:border-dark-300';
    };

    return (
        <div className="relative w-full h-[600px] bg-dark-800/50 rounded-2xl border border-dark-600 overflow-hidden flex justify-center p-8">
            {/* Dynamic Sizing Container */}
            <div className="relative flex justify-center items-start mt-10">

                <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-[2000px] h-full pointer-events-none overflow-visible">
                    {heap.map((_, index) => {
                        if (index === 0) return null;
                        const parentIndex = Math.floor((index - 1) / 2);
                        const { x: x1, y: y1 } = getPosition(parentIndex, heap.length);
                        const { x: x2, y: y2 } = getPosition(index, heap.length);

                        // Offset to match center (SVG is centered at 1000px)
                        const cx1 = x1 + 1000;
                        const cx2 = x2 + 1000;

                        return (
                            <motion.line
                                key={`edge-${index}`}
                                x1={cx1}
                                y1={y1 + NODE_RADIUS}
                                x2={cx2}
                                y2={y2 - NODE_RADIUS}
                                stroke="#52525e"
                                strokeWidth="2"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                            />
                        );
                    })}
                </svg>

                <AnimatePresence>
                    {heap.map((value, index) => {
                        const { x, y } = getPosition(index, heap.length);
                        return (
                            <motion.div
                                key={`${index}-${value}`} // Key by index AND value to force re-render on value change if needed, or just index for position
                                // Better to key by index for stable swaps animation
                                layoutId={`node-${index}`}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{
                                    x,
                                    y,
                                    scale: 1,
                                    opacity: 1,
                                    transition: { type: "spring", stiffness: 300, damping: 25 }
                                }}
                                exit={{ scale: 0, opacity: 0 }}
                                className={`absolute w-[50px] h-[50px] rounded-full flex items-center justify-center border-2 shadow-lg text-white font-bold transition-colors duration-300 z-10 ${getNodeColor(index)}`}
                            >
                                {value}
                                <div className="absolute -bottom-6 text-xs text-dark-400 font-mono">
                                    {index}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Compact Array View at Bottom */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-dark-900/80 backdrop-blur-sm p-4 rounded-xl border border-dark-600 flex gap-1 max-w-full overflow-x-auto">
                {heap.map((val, idx) => (
                    <div
                        key={`arr-${idx}`}
                        className={`min-w-[40px] h-[40px] flex items-center justify-center rounded border text-sm font-medium ${compareIndices.includes(idx) ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' :
                                activeIndices.includes(idx) ? 'bg-cyan-500/20 border-cyan-500 text-cyan-500' :
                                    'bg-dark-800 border-dark-600 text-dark-300'
                            }`}
                    >
                        {val}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HeapVisualizer;

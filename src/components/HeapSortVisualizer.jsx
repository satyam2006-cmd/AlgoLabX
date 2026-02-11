
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Theme Constants ---
const THEME = {
    node: {
        default: 'bg-[#9d4edd]/20 border-[#9d4edd] text-[#9d4edd] shadow-[0_0_15px_rgba(157,78,221,0.3)]',
        compare: 'bg-[#ffeb3b]/20 border-[#ffeb3b] text-[#ffeb3b] shadow-[0_0_20px_rgba(255,235,59,0.5)] scale-110 z-20',
        swap: 'bg-[#00ff88]/20 border-[#00ff88] text-[#00ff88] shadow-[0_0_20px_rgba(0,255,136,0.5)] z-20',
        sorted: 'bg-[#ff9100]/10 border-[#ff9100]/50 text-[#ff9100]/80 shadow-none opacity-80',
        locked: 'bg-white/5 border-white/10 text-white/20'
    },
    line: {
        default: '#9d4edd',
        compare: '#ffeb3b',
        sorted: '#ffffff30'
    }
};

// --- Tree Layout Logic ---
const calculateTreePositions = (totalNodes) => {
    const positions = {};
    const width = 600; // Compact width

    for (let i = 0; i < totalNodes; i++) {
        const level = Math.floor(Math.log2(i + 1));
        const itemsInLevel = Math.pow(2, level);
        const positionInLevel = i - itemsInLevel + 1;

        // Horizontal spacing decreases with depth
        const x = (width / (itemsInLevel + 1)) * (positionInLevel + 1) - (width / 2);
        const y = level * 70; // Compact vertical spacing

        positions[i] = { x, y };
    }
    return positions;
};

const HeapSortVisualizer = ({ currentStep, isCompact = false }) => {
    const positions = useMemo(() => currentStep ? calculateTreePositions(currentStep.array.length) : {}, [currentStep]);

    if (!currentStep) return null;

    const {
        array,
        activeIndices,
        swappedIndices,
        heapSize,
        sortedIndices,
        message,
        visibleCount = array.length // Default to all visible if undefined
    } = currentStep;

    // Helper to get status style
    const getStatus = (idx) => {
        if (sortedIndices.includes(idx)) return 'sorted';
        if (swappedIndices.includes(idx)) return 'swap';
        if (activeIndices.includes(idx)) return 'compare';
        if (idx >= heapSize) return 'locked';
        return 'default';
    };

    const treeLevels = Math.floor(Math.log2(array.length)) + 1;
    const treeHeight = treeLevels * 70 + 80; // Compact dynamic height

    return (
        <div className={`w-full bg-[#080808] ${isCompact ? 'min-h-[350px]' : 'min-h-[500px]'} h-auto rounded-3xl overflow-hidden relative border-2 border-white flex flex-col items-center justify-between ${isCompact ? 'p-2 sm:p-4' : 'p-4 sm:p-8'} font-mono select-none shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-500`}>
            {/* Background Grid */}
            <div className="absolute inset-0 z-0 opacity-20 rounded-3xl overflow-hidden"
                style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #333 1px, transparent 0)', backgroundSize: '30px 30px' }} />

            {/* --- TOP SECTION: ARRAY VIEW --- */}
            <div className="relative z-10 w-full flex flex-col items-center gap-6 pt-4 mb-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={message}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-[#9d4edd] text-xs sm:text-sm uppercase tracking-[0.2em] font-bold bg-[#9d4edd]/10 px-4 py-2 rounded border border-[#9d4edd]/30 text-center"
                    >
                        {message}
                    </motion.div>
                </AnimatePresence>

                <div className="flex justify-center items-end gap-1 sm:gap-2 h-20 sm:h-24 relative px-2 flex-wrap w-full">
                    {array.map((value, idx) => {
                        const status = getStatus(idx);
                        const isVisible = idx < visibleCount;

                        return (
                            <div key={`arr-${idx}`} className="flex flex-col items-center gap-1 sm:gap-2 relative group min-w-[2rem] sm:min-w-[3rem]">
                                {/* Array Block */}
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{
                                        opacity: isVisible ? 1 : 0.3,
                                        y: 0,
                                        scale: activeIndices.includes(idx) ? 1.1 : 1
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className={`
                                        w-8 h-10 sm:w-12 sm:h-14 rounded-md sm:rounded-lg flex items-center justify-center 
                                        text-sm sm:text-lg font-bold border-2 transition-all duration-300
                                        ${THEME.node[status]}
                                    `}
                                >
                                    {value}
                                </motion.div>

                                {/* Index */}
                                <span className={`text-[8px] sm:text-[10px] ${status === 'sorted' ? 'text-[#ff9100]' : 'text-gray-500'}`}>
                                    {idx}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* --- BOTTOM SECTION: TREE VIEW --- */}
            <div className="relative z-10 flex-1 w-full flex items-center justify-center mt-12 group">
                <div
                    className="relative w-full max-w-4xl flex justify-center items-start transition-all duration-500 scale-[0.6] sm:scale-[0.8] md:scale-100 origin-top"
                    style={{ height: `${Math.max(300, treeHeight)}px` }}
                >

                    {/* SVG Connector Layer */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible hidden lg:block">
                        {array.map((_, i) => {
                            if (i === 0) return null;
                            const parentIdx = Math.floor((i - 1) / 2);

                            // Only range checking and visibility check
                            if (i >= array.length || parentIdx >= array.length) return null;
                            if (i >= visibleCount || parentIdx >= visibleCount) return null; // Hide if not yet constructed

                            const pos = positions[i];
                            const parentPos = positions[parentIdx];

                            const isSorted = sortedIndices.includes(i) && sortedIndices.includes(parentIdx);
                            const active = activeIndices.includes(i) && activeIndices.includes(parentIdx);

                            return (
                                <motion.line
                                    key={`line-${i}`}
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    x1={`calc(50% + ${parentPos.x}px)`}
                                    y1={parentPos.y + 24} // Output from bottom of node
                                    x2={`calc(50% + ${pos.x}px)`}
                                    y2={pos.y - 24}   // Input to top of node
                                    stroke={isSorted ? THEME.line.sorted : (active ? THEME.line.compare : THEME.line.default)}
                                    strokeWidth={active ? 3 : 1}
                                    strokeOpacity={0.6}
                                />
                            );
                        })}
                    </svg>

                    {/* Nodes Layer */}
                    {array.map((value, idx) => {
                        const status = getStatus(idx);

                        // Hide if not in visible count
                        if (idx >= visibleCount) return null;

                        return (
                            <motion.div
                                layoutId={`node-${value}-idx-${idx}`} // Use index in key to prevent flying across tree wildly? No, we want value tracking.
                                // Actually, 'layoutId' should probably start with tracked value to animate swaps smoothly.
                                // But if duplicates exist, use index. Assuming unique for correct animation is risky.
                                // Let's try key by index (position based) but animating values.
                                // OR key by value? Key by value is best for Swap animations.
                                key={`node-${idx}`}

                                initial={{ scale: 0, opacity: 0, y: 20 }}
                                animate={{
                                    scale: activeIndices.includes(idx) ? 1.2 : 1,
                                    opacity: 1,
                                    y: 0,
                                    left: `calc(50% + ${positions[idx].x}px)`,
                                    top: positions[idx].y
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}

                                className={`
                                    absolute flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2
                                    text-base sm:text-lg font-bold backdrop-blur-md transition-colors duration-300
                                    -ml-5 sm:-ml-6 -mt-5 sm:-mt-6
                                    ${THEME.node[status]}
                                `}
                            >
                                {value}
                                {status === 'pivot' && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping" />
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default HeapSortVisualizer;

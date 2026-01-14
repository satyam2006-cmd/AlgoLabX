
import React, { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NodeRenderer = memo(({ node, nodes }) => {
    if (!node || node.status === 'hidden') return null;

    const childrenIds = node.children || [];
    const isLeaf = childrenIds.length === 0;

    let containerClass = "bg-dark-800/80 border-white/5 backdrop-blur-sm";
    let scale = 1.0;

    if (node.status === 'active-partition') {
        containerClass = "bg-emerald-500/10 border-emerald-500/30 shadow-xl shadow-emerald-500/10";
        scale = 1.05;
    }

    const getColorClass = (state) => {
        switch (state) {
            case 'pivot': return 'bg-red-500 border-red-400 text-white shadow-sm shadow-red-500/50';
            case 'comparing': return 'bg-yellow-500 border-yellow-400 text-dark-900 shadow-sm shadow-yellow-500/50';
            case 'swapping': return 'bg-emerald-500 border-emerald-400 text-white shadow-sm shadow-emerald-500/50';
            case 'locked': return 'bg-blue-600/50 border-blue-400/50 text-blue-100';
            default: return 'bg-dark-900/40 border-white/5 text-slate-400';
        }
    };

    return (
        <div className="flex flex-col items-center mx-4 my-4">
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale }}
                className={`
          relative z-10 flex items-center justify-center gap-2
          px-5 py-3 rounded-2xl border
          min-w-[80px]
          ${containerClass}
          transition-all duration-300
        `}
            >
                <AnimatePresence>
                    {node.array.map((item, idx) => (
                        item ? (
                            <motion.div
                                key={item.id}
                                layoutId={item.id}
                                className={`
                  w-10 h-10 flex items-center justify-center rounded-xl
                  border text-sm font-bold
                  ${getColorClass(node.arrayStates[idx])}
                  transition-colors duration-300
                `}
                            >
                                {item.value}
                            </motion.div>
                        ) : (
                            <div key={`empty-${idx}`} className="w-10 h-10 border border-white/5 rounded-xl bg-rgba(0, 0, 0, 0) opacity-5" />
                        )
                    ))}
                </AnimatePresence>
            </motion.div>

            {!isLeaf && (
                <div className="flex gap-8 mt-10">
                    {childrenIds.map((childId) => (
                        <NodeRenderer key={childId} node={nodes[childId]} nodes={nodes} />
                    ))}
                </div>
            )}
        </div>
    );
});

NodeRenderer.displayName = 'NodeRenderer';

const QuickSortTree = ({ currentStep }) => {
    if (!currentStep) return null;

    const { nodes, rootId, sortedBottomArray, revealedIndices = [], isDone } = currentStep;

    // Scaling logic based on depth
    const { scaleFactor } = useMemo(() => {
        let currentMaxLevel = 0;
        Object.values(nodes).forEach(node => {
            if (node.status !== 'hidden' && node.level > currentMaxLevel) {
                currentMaxLevel = node.level;
            }
        });
        const factor = Math.max(0.4, 1.0 - currentMaxLevel * 0.1);
        return { scaleFactor: factor };
    }, [nodes]);

    const anyVisibleNodes = Object.values(nodes).some(n => n.status !== 'hidden');
    const isFinalRevealPhase = !anyVisibleNodes;

    return (
        <motion.div
            layout
            transition={{ layout: { duration: 0.8, ease: "easeInOut" } }}
            className={`
        w-full bg-dark-900/20 rounded-[2.5rem] border border-white/10 overflow-hidden 
        transition-all duration-700 ease-in-out flex flex-col items-center
        ${isFinalRevealPhase ? 'min-h-[240px] justify-center' : 'min-h-[650px] justify-start text-center'}
      `}
        >
            <AnimatePresence>
                {!isFinalRevealPhase && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full p-4 flex flex-wrap gap-4 text-xs font-medium border-b border-white/5 bg-dark-900/40"
                    >
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-red-500"></div> Pivot</div>
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-yellow-500"></div> Comparing</div>
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-emerald-500"></div> Swapping</div>
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm border border-white/20 bg-dark-800"></div> Partitioning Tree</div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={`
        relative w-full flex flex-col items-center transition-all duration-700
        ${isFinalRevealPhase ? 'p-0' : 'flex-1 p-8 md:p-12'}
      `}>
                <AnimatePresence>
                    {anyVisibleNodes && (
                        <motion.div
                            key="tree-area"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.8, y: -40, filter: 'blur(10px)' }}
                            transition={{ duration: 0.8, ease: "circIn" }}
                            className="w-full h-full flex flex-col items-center justify-start"
                        >
                            <motion.div
                                animate={{ scale: scaleFactor }}
                                transition={{ duration: 0.5 }}
                                className="w-fit flex justify-center origin-top pt-4 pb-48"
                            >
                                <NodeRenderer node={nodes[rootId]} nodes={nodes} />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Global Sorted Array View (Assemblies) */}
                <motion.div
                    layout
                    className={`
            transition-all duration-1000 ease-in-out z-20
            ${isFinalRevealPhase
                            ? 'px-14 py-8 bg-dark-900/60 rounded-[2.5rem] border border-emerald-500/50 m-12 flex shadow-[0_0_50px_rgba(16,185,129,0.1)]'
                            : 'absolute bottom-12 left-0 right-0 py-8 bg-dark-900/90 backdrop-blur-xl border-t border-white/5 shadow-[0_-30px_60px_rgba(0,0,0,0.6)] flex justify-center'}
          `}
                >
                    <div className="flex justify-center flex-wrap gap-4 items-center">
                        {sortedBottomArray.map((item, idx) => {
                            const isRevealed = revealedIndices.includes(idx);
                            return (
                                <div
                                    key={idx}
                                    className={`
                    w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 border
                    ${item ? (
                                            isRevealed
                                                ? 'bg-rgba(0, 0, 0, 0) border-emerald-400 text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)]'
                                                : 'bg-blue-600 border-blue-400 text-white shadow-md'
                                        ) : 'bg-rgba(0, 0, 0, 0) border-white/5 opacity-10'}
                  `}
                                >
                                    {item && (
                                        <motion.div
                                            layoutId={item.id}
                                            className="w-full h-full flex items-center justify-center font-bold text-lg"
                                        >
                                            {item.value}
                                        </motion.div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            {isDone && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 0.4, scale: 1 }}
                    className="pb-8 text-[11px] uppercase tracking-[0.4em] font-bold text-emerald-400"
                >
                    QuickSort Sequence Complete
                </motion.div>
            )}
        </motion.div>
    );
};

export default memo(QuickSortTree);

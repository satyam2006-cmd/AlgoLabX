import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Reusing style constants for consistency
const COLORS = {
    pivot: { bg: 'bg-[#ff00ff]/20', border: 'border-[#ff00ff]', text: 'text-[#ff00ff]', shadow: 'shadow-[#ff00ff]/50' },
    compare: { bg: 'bg-[#ffff00]/20', border: 'border-[#ffff00]', text: 'text-[#ffff00]', shadow: 'shadow-[#ffff00]/50' },
    swap: { bg: 'bg-[#00ff88]/20', border: 'border-[#00ff88]', text: 'text-[#00ff88]', shadow: 'shadow-[#00ff88]/50' },
    sorted: { bg: 'bg-[#00ffff]/20', border: 'border-[#00ffff]', text: 'text-[#00ffff]', shadow: 'shadow-[#00ffff]/50' },
    default: { bg: 'bg-white/5', border: 'border-white/10', text: 'text-slate-300', shadow: 'shadow-none' },
    dimmed: { bg: 'bg-transparent', border: 'border-white/5', text: 'text-white/20', shadow: 'shadow-none' }
};

const Pointer = ({ label, color }) => (
    <motion.div
        layoutId={`pointer-${label}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-20"
    >
        <div className={`w-0.5 h-4 ${color.replace('text-', 'bg-')}`} />
        <span className={`text-[10px] font-bold uppercase tracking-wider ${color}`}>
            {label}
        </span>
    </motion.div>
);

const PivotLabel = () => (
    <motion.div
        layoutId="pivot-label"
        initial={{ opacity: 0, scale: 0.8, y: 0 }}
        animate={{ opacity: 1, scale: 1, y: -45 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center z-20 pointer-events-none"
    >
        <div className="bg-[#ff00ff]/20 backdrop-blur-md px-2 py-1 rounded border border-[#ff00ff] shadow-[0_0_15px_rgba(255,0,255,0.3)]">
            <span className="text-[10px] font-bold text-[#ff00ff] uppercase tracking-widest">
                Pivot
            </span>
        </div>
        <div className="w-px h-3 bg-[#ff00ff] mt-1" />
    </motion.div>
);

const QuickSort3D = ({ currentStep, isDone, isCompact = false }) => {
    if (!currentStep) return null;

    const {
        array,
        pivotIndex,
        comparingIndices = [],
        swappingIndices = [],
        range,
        sortedIndices,
        phase
    } = currentStep;

    const getStatus = (idx) => {
        if (idx === pivotIndex) return 'pivot';
        if (swappingIndices.includes(idx)) return 'swap';
        if (comparingIndices.includes(idx)) return 'compare';
        if (sortedIndices.includes(idx)) return 'sorted';
        if (phase !== 'initial' && phase !== 'done' && (idx < range[0] || idx > range[1])) return 'dimmed';
        return 'default';
    };

    return (
        <div className={`w-full bg-[#050505] rounded-[2.5rem] border border-white overflow-hidden shadow-2xl ${isCompact ? 'p-6 min-h-[300px]' : 'p-8 md:p-12 min-h-[400px]'} relative flex flex-col items-center justify-center`}>
            {/* Cinematic Overlay */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />

            {/* Info Badge */}
            <div className="absolute top-6 left-6 z-10">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentStep.description}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10"
                    >
                        <h3 className="text-white font-bold text-sm tracking-widest uppercase mb-1">QuickSort</h3>
                        <p className="text-white/60 text-[10px] uppercase tracking-tighter max-w-[250px]">{currentStep.description}</p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* The Sorting Array */}
            {/* The Sorting Array Container - Single Line */}
            <div className="flex justify-center relative z-10 pb-12 w-full px-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-nowrap items-center justify-center gap-2 shadow-inner max-w-full overflow-hidden">
                    <AnimatePresence mode='popLayout'>
                        {array.map((item, idx) => {
                            const status = getStatus(idx);
                            const style = COLORS[status];
                            const isPivot = status === 'pivot';
                            const isComparing = status === 'compare';
                            const isSwapping = status === 'swap';

                            return (
                                <motion.div
                                    layout
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{
                                        opacity: status === 'dimmed' ? 0.3 : 1,
                                        scale: isPivot ? 1.1 : 1, // Reduced pop slightly for tight spaces
                                        y: isPivot ? -8 : 0
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 25
                                    }}
                                    className={`
                                        relative flex items-center justify-center 
                                        w-10 h-12 md:w-12 md:h-14 font-mono font-bold
                                        rounded-lg border shadow-lg transition-colors duration-300
                                        ${style.bg} ${style.border} ${style.text} ${style.shadow}
                                        shrink
                                    `}
                                >
                                    {item.value}

                                    {/* Pivot Label (Above) */}
                                    <AnimatePresence>
                                        {isPivot && <PivotLabel />}
                                    </AnimatePresence>

                                    {/* Markers (Below) */}
                                    <AnimatePresence>
                                        {isComparing && !isPivot && (
                                            <Pointer label={comparingIndices[0] === idx ? "L" : "R"} color={COLORS.compare.text} />
                                        )}
                                        {isSwapping && (
                                            <Pointer label="Swap" color={COLORS.swap.text} />
                                        )}
                                    </AnimatePresence>

                                    {/* Partition Lines */}
                                    {(idx === range[0] && phase !== 'done' && phase !== 'initial') && (
                                        <motion.div
                                            initial={{ opacity: 0 }} animate={{ opacity: 0.3 }}
                                            className="absolute -left-2 top-0 bottom-0 w-px bg-white"
                                        />
                                    )}
                                    {(idx === range[1] && phase !== 'done' && phase !== 'initial') && (
                                        <motion.div
                                            initial={{ opacity: 0 }} animate={{ opacity: 0.3 }}
                                            className="absolute -right-2 top-0 bottom-0 w-px bg-white"
                                        />
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {/* Legend (Bottom) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-6 z-10">
                <LegendItem color="bg-[#ff00ff]" label="Pivot" />
                <LegendItem color="bg-[#ffff00]" label="Scan" />
                <LegendItem color="bg-[#00ff88]" label="Swap" />
                <LegendItem color="bg-[#00ffff]" label="Sorted" />
            </div>

            {/* Sort Complete Message Removed */}
        </div>
    );
};

const LegendItem = ({ color, label }) => (
    <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
        <div className={`w-2 h-2 rounded-full ${color} shadow-[0_0_8px_currentColor]`} />
        <span className="text-[10px] text-white/50 uppercase font-bold tracking-wider">{label}</span>
    </div>
);

export default QuickSort3D;

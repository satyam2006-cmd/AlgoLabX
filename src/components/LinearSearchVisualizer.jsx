import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LinearSearchVisualizer = ({
    stepData,
    className = ""
}) => {
    const {
        array = [],
        active = [],
        failed = [],
        targetValue,
        targetIndex,
        found
    } = stepData || {};

    const pointerIndex = active.length > 0 ? active[0] : -1;

    // Premium styling constants
    const colors = {
        idle: 'rgba(255, 255, 255, 0.05)',
        idleBorder: 'rgba(255, 255, 255, 0.1)',
        active: 'rgba(250, 204, 21, 0.2)', // Yellow
        activeBorder: 'rgba(250, 204, 21, 0.8)',
        failed: 'rgba(239, 68, 68, 0.15)', // Red
        failedBorder: 'rgba(239, 68, 68, 0.5)',
        found: 'rgba(34, 197, 94, 0.25)', // Green
        foundBorder: 'rgba(34, 197, 94, 0.9)',
    };

    return (
        <div className={`flex flex-col items-center w-full mx-auto p-2 sm:p-4 space-y-6 sm:space-y-8 ${className}`}>

            {/* Target Display */}
            <div className="flex flex-col items-center space-y-1">
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">Searching For</span>
                <div className="relative">
                    <div className="absolute -inset-3 bg-blue-500/10 rounded-full blur-lg" />
                    <div className="relative px-5 py-1.5 bg-black/40 border border-white/10 rounded-xl backdrop-blur-md">
                        <span className="text-2xl sm:text-3xl font-black text-white">{targetValue !== null ? targetValue : '?'}</span>
                    </div>
                </div>
            </div>

            {/* Array Container */}
            <div className="relative w-full flex justify-center items-center py-8">
                <div
                    className="flex justify-center items-end gap-1 sm:gap-2 w-full max-w-full px-2"
                >
                    {array.map((value, idx) => {
                        const isActive = pointerIndex === idx;
                        const isFailed = failed.includes(idx);
                        const isFound = found && targetIndex === idx;

                        let stateStyles = {
                            backgroundColor: colors.idle,
                            borderColor: colors.idleBorder,
                            color: 'rgba(255, 255, 255, 0.5)',
                            scale: 1,
                            boxShadow: 'none'
                        };

                        if (isFound) {
                            stateStyles = {
                                backgroundColor: colors.found,
                                borderColor: colors.foundBorder,
                                color: '#4ade80',
                                scale: 1.1,
                                boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)',
                                zIndex: 10
                            };
                        } else if (isActive) {
                            stateStyles = {
                                backgroundColor: colors.active,
                                borderColor: colors.activeBorder,
                                color: '#facc15',
                                scale: 1.05,
                                boxShadow: '0 0 15px rgba(250, 204, 21, 0.2)',
                                zIndex: 10
                            };
                        } else if (isFailed) {
                            stateStyles = {
                                backgroundColor: colors.failed,
                                borderColor: colors.failedBorder,
                                color: '#f87171',
                                scale: 0.95,
                                boxShadow: 'none'
                            };
                        }

                        // Responsive size based on array length
                        const blockSize = array.length > 15 ? 'w-8 h-8 sm:w-10 sm:h-10 text-sm' : 'w-10 h-10 sm:w-14 sm:h-14 text-base sm:text-xl';

                        return (
                            <div key={idx} className="flex flex-col items-center flex-1 min-w-0 max-w-[64px]">
                                {/* Pointer Arrow */}
                                <div className="h-8 w-full flex justify-center relative">
                                    <AnimatePresence>
                                        {isActive && (
                                            <motion.div
                                                initial={{ y: -10, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: -10, opacity: 0 }}
                                                className="absolute bottom-0 text-yellow-400 z-20"
                                            >
                                                <svg className="w-5 h-5 drop-shadow-[0_0_5px_rgba(250,204,21,0.4)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                                    <polyline points="19 12 12 19 5 12"></polyline>
                                                </svg>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Memory Cell */}
                                <motion.div
                                    animate={stateStyles}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className={`${blockSize} flex items-center justify-center border-2 rounded-lg font-black relative overflow-hidden`}
                                >
                                    {(isActive || isFound) && (
                                        <motion.div
                                            layoutId="box-glow"
                                            className="absolute inset-0 bg-white/5 blur-sm"
                                        />
                                    )}
                                    <span className="relative z-10 truncate px-1">{value}</span>
                                </motion.div>

                                {/* Index Label */}
                                <span className={`mt-2 text-[8px] sm:text-[10px] font-bold uppercase tracking-tighter sm:tracking-wider ${isActive ? 'text-yellow-400' : 'text-white/20'}`}>
                                    idx {idx}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const LegendItem = ({ color, label }) => (
    <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${color} shadow-[0_0_8px_currentColor]`} />
        <span className="text-[10px] text-white/50 uppercase font-extrabold tracking-widest">{label}</span>
    </div>
);

export default LinearSearchVisualizer;

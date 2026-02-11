import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TwoPointerVisualizer = ({
    stepData,
    className = ""
}) => {
    const {
        array = [],
        pointers = { left: -1, right: -1 },
        currentSum,
        targetValue,
        found
    } = stepData || {};

    const { left, right } = pointers;

    // Premium styling constants
    const colors = {
        idle: 'rgba(255, 255, 255, 0.05)',
        idleBorder: 'rgba(255, 255, 255, 0.1)',
        active: 'rgba(250, 204, 21, 0.2)', // Yellow
        activeBorder: 'rgba(250, 204, 21, 0.8)',
        pointer: 'rgba(59, 130, 246, 0.4)', // Blue
        pointerBorder: 'rgba(59, 130, 246, 0.8)',
        found: 'rgba(34, 197, 94, 0.25)', // Green
        foundBorder: 'rgba(34, 197, 94, 0.9)',
    };

    return (
        <div className={`flex flex-col items-center w-full mx-auto p-2 sm:p-4 space-y-6 sm:space-y-8 ${className}`}>

            {/* Header Info: Target and Current Sum */}
            <div className="flex items-center gap-12 sm:gap-20">
                {/* Target Sum Display */}
                <div className="flex flex-col items-center space-y-1">
                    <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Target Sum</span>
                    <div className="relative">
                        <div className="absolute -inset-3 bg-blue-500/10 rounded-full blur-lg" />
                        <div className="relative px-6 py-2 bg-black/40 border border-white/10 rounded-xl backdrop-blur-md">
                            <span className="text-2xl sm:text-3xl font-black text-white">{targetValue !== null ? targetValue : '?'}</span>
                        </div>
                    </div>
                </div>

                {/* Current Sum Display */}
                <div className="flex flex-col items-center space-y-1">
                    <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Current Sum</span>
                    <div className="relative">
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={currentSum}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className={`relative px-6 py-2 bg-black/40 border rounded-xl backdrop-blur-md transition-colors duration-500 ${found ? 'border-green-500/50' : 'border-white/10'}`}
                            >
                                <span className={`text-2xl sm:text-3xl font-black ${found ? 'text-green-400' : 'text-yellow-400'}`}>
                                    {currentSum !== null ? currentSum : '-'}
                                </span>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Array Container */}
            <div className="relative w-full flex justify-center items-center py-12">
                <div className="flex justify-center items-end gap-1 sm:gap-2 w-full max-w-full px-2">
                    {array.map((value, idx) => {
                        const isLeft = left === idx;
                        const isRight = right === idx;
                        const isActive = isLeft || isRight;
                        const isFound = found && isActive;

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
                                zIndex: 20
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
                        }

                        // Responsive size
                        const blockSize = array.length > 20 ? 'w-6 h-6 sm:w-8 sm:h-8 text-xs' : array.length > 15 ? 'w-8 h-8 sm:w-10 sm:h-10 text-sm' : 'w-10 h-10 sm:w-14 sm:h-14 text-base sm:text-xl';

                        return (
                            <div key={idx} className="flex flex-col items-center flex-1 min-w-0 max-w-[64px] relative">
                                {/* Pointers Area */}
                                <div className="h-10 w-full flex justify-center relative mb-1">
                                    <AnimatePresence>
                                        {isLeft && (
                                            <Pointer label="L" color="text-yellow-400" offset={isLeft === isRight ? "-15%" : "0"} />
                                        )}
                                        {isRight && (
                                            <Pointer label="R" color="text-yellow-400" offset={isLeft === isRight ? "15%" : "0"} />
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Memory Cell */}
                                <motion.div
                                    animate={stateStyles}
                                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
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
                                <span className={`mt-2 text-[8px] sm:text-[10px] font-bold uppercase tracking-tighter ${isActive ? 'text-yellow-400' : 'text-white/20'}`}>
                                    idx {idx}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Steps Instruction (rendered by Learn page, so we only provide the message through stepData) */}
        </div>
    );
};

const Pointer = ({ label, color, offset }) => (
    <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        className={`absolute bottom-0 flex flex-col items-center ${color} z-30`}
        style={{ left: `calc(50% + ${offset})`, transform: 'translateX(-50%)' }}
    >
        <span className="text-[10px] font-black mb-1">{label}</span>
        <svg className="w-4 h-4 shadow-yellow-500/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
        </svg>
    </motion.div>
);

export default TwoPointerVisualizer;

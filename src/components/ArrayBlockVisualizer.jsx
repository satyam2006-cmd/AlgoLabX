import React, { useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ArrayBlockVisualizer = memo(({
    array,
    activeIndices = [],
    swappedIndices = [],
    sortedIndices = [],
    specialIndices = {}, // { min, key, check }
    className = ""
}) => {
    // Memoize block color determination to avoid recalculating on every render
    const getBlockStyles = useMemo(() => (index, isActive, isSwapped, isSorted, special = {}) => {
        // Importance order: Swapped > Min/Key > Check/Active > Sorted
        const base = { opacity: 1 };

        if (isSwapped) {
            return {
                ...base,
                backgroundColor: 'rgba(251, 191, 36, 0.15)', // Amber
                color: '#fbbf24',
                scale: 1.1,
                zIndex: 20,
                borderColor: 'rgba(251, 191, 36, 0.4)'
            };
        }

        // Special Pointers
        if (special.min === index) { // Selection Sort Min
            return {
                ...base,
                backgroundColor: 'rgba(236, 72, 153, 0.15)', // Pink
                color: '#ec4899',
                scale: 1.1,
                zIndex: 20,
                borderColor: 'rgba(236, 72, 153, 0.4)'
            };
        }

        if (special.key === index) { // Insertion Sort Key
            return {
                ...base,
                backgroundColor: 'rgba(59, 130, 246, 0.15)', // Blue
                color: '#3b82f6',
                scale: 1.1,
                zIndex: 20,
                borderColor: 'rgba(59, 130, 246, 0.4)'
            };
        }

        if (special.check === index || isActive) { // Comparison
            return {
                ...base,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                scale: 1.05,
                zIndex: 10,
                borderColor: 'rgba(255, 255, 255, 0.2)'
            };
        }

        if (isSorted) {
            return {
                ...base,
                backgroundColor: 'rgba(52, 211, 153, 0.3)', // Emerald 400, higher opacity
                color: '#34d399',
                scale: 1,
                zIndex: 1,
                borderColor: 'rgba(52, 211, 153, 0.8)' // High contrast border
            };
        }

        return {
            ...base,
            backgroundColor: 'rgba(0, 0, 0, 0)',
            color: 'rgba(255, 255, 255, 0.7)',
            scale: 1,
            zIndex: 1,
            borderColor: 'rgba(0, 0, 0, 0)'
        };
    }, []);

    // Generate stable keys for animations by tracking occurrences of each value
    // This allows {value: 10} and {value: 10} to have distinct keys like "10-0" and "10-1"
    // ensuring that when they move, Framer Motion can track them correctly.
    const arrayItems = useMemo(() => {
        const counts = {};
        return array.map((value, index) => {
            counts[value] = (counts[value] || 0) + 1;
            return {
                value,
                index,
                key: `${value}-${counts[value]}`
            };
        });
    }, [array]);

    // Memoize block size calculation
    const blockSize = useMemo(() => {
        if (array.length > 20) return 'h-6 sm:h-8 text-[8px]';
        if (array.length > 15) return 'h-8 sm:h-10 text-[10px]';
        return 'h-10 sm:h-14 text-sm sm:text-lg';
    }, [array.length]);

    return (
        <div className={`w-full flex flex-col items-center gap-6 ${className}`}>
            {/* Array Track Container */}
            <div className="w-full px-2 sm:px-4">
                <div className="relative w-full flex items-end justify-center gap-1 sm:gap-2 py-4 flex-nowrap">
                    <AnimatePresence mode='popLayout'>
                        {arrayItems.map(({ value, index, key }) => {
                            const isSwapped = swappedIndices.includes(index);
                            const isActive = activeIndices.includes(index);
                            const isSorted = sortedIndices.includes(index);
                            const styles = getBlockStyles(index, isActive, isSwapped, isSorted, specialIndices);

                            return (
                                <motion.div
                                    key={key}
                                    layout
                                    transition={{
                                        type: "spring",
                                        stiffness: 350,
                                        damping: 25
                                    }}
                                    animate={styles}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    className={`
                                        flex items-center justify-center 
                                        rounded-lg sm:rounded-xl border-2
                                        font-black relative
                                        flex-1 min-w-0 max-w-[64px]
                                        aspect-square
                                        ${blockSize}
                                    `}
                                    style={{
                                        zIndex: (isActive || isSwapped) ? 50 : (isSorted ? 1 : 10)
                                    }}
                                >
                                    <span className="truncate px-0.5">{value}</span>

                                    {/* Active indicator glow */}
                                    {(isActive || isSwapped) && (
                                        <motion.div
                                            layoutId="box-glow"
                                            className="absolute inset-0 rounded-lg sm:rounded-xl bg-white/5 blur-md"
                                        />
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 px-4">
                <LegendItem color="bg-[#ffffff]" label="Check" />
                <LegendItem color="bg-[#fbbf24]" label="Swap" />
                <LegendItem color="bg-[#34d399]" label="Sorted" />
                {specialIndices.min !== undefined && <LegendItem color="bg-[#ec4899]" label="Min" />}
                {specialIndices.key !== undefined && <LegendItem color="bg-[#3b82f6]" label="Key" />}
            </div>
        </div>
    );
});

const LegendItem = ({ color, label }) => (
    <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-sm">
        <div className={`w-2 h-2 rounded-full ${color} shadow-[0_0_8px_currentColor]`} />
        <span className="text-[10px] text-white/50 uppercase font-bold tracking-wider whitespace-nowrap">{label}</span>
    </div>
);

export default ArrayBlockVisualizer;

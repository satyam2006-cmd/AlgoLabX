import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const THEME = {
    node: {
        default: 'bg-[#9d4edd]/10 border-[#9d4edd]/40 text-[#9d4edd] shadow-[0_0_15px_rgba(157,78,221,0.1)]',
        active: 'bg-[#ffeb3b]/20 border-[#ffeb3b] text-[#ffeb3b] shadow-[0_0_20px_rgba(255,235,59,0.4)] scale-110 z-50',
        sorted: 'bg-[#00ff88]/20 border-[#00ff88] text-[#00ff88] shadow-[0_0_20px_rgba(0,255,136,0.3)]',
        bucket: 'bg-white/5 border-white/10 text-white/40',
        bucketActive: 'bg-white/10 border-[#ffeb3b]/50 shadow-[0_0_20px_rgba(255,235,59,0.1)]'
    }
};

const BucketSortVisualizer = ({ currentStep, isCompact = false }) => {
    if (!currentStep) return null;

    const {
        array,
        buckets,
        bucketRanges,
        phase,
        message,
        activeElement,
        targetBucket,
        sortedIndices = []
    } = currentStep;

    // Generate stable keys for both the main array and the buckets
    // This allows elements to "fly" between them using layoutId

    // Since elements can be in EITHER the array OR the buckets (or both during transitions)
    // We need to manage their keys carefully. 
    // In Bucket Sort, elements stay in the array (grayed out) while being in buckets?
    // Or do they disappear from array?
    // Let's make them disappear from array when distributed to buckets for cleaner look.
    // The engine's `array` should ideally reflect this, but currently it keeps everything.
    // I'll adjust the rendering based on the phase.

    return (
        <div className={`w-full bg-[#080808] ${isCompact ? 'min-h-[400px]' : 'min-h-[600px]'} h-auto rounded-3xl overflow-hidden relative border-2 border-white flex flex-col items-center justify-start ${isCompact ? 'p-4' : 'p-8'} font-mono select-none shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-500`}>
            {/* Background Grid */}
            <div className="absolute inset-0 z-0 opacity-20 rounded-3xl overflow-hidden"
                style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #333 1px, transparent 0)', backgroundSize: '30px 30px' }} />

            {/* --- TOP SECTION: MESSAGE & MAIN ARRAY --- */}
            <div className="relative z-10 w-full flex flex-col items-center gap-6 mb-12">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={message}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-[#9d4edd] text-xs sm:text-sm uppercase tracking-[0.2em] font-bold bg-[#9d4edd]/10 px-4 py-2 rounded border border-[#9d4edd]/30 text-center max-w-2xl"
                    >
                        {message}
                    </motion.div>
                </AnimatePresence>

                <div className="flex justify-center items-end gap-2 h-24 relative px-2 flex-wrap w-full">
                    {array.map((value, idx) => {
                        const isSorted = sortedIndices.includes(idx);
                        const isActive = activeElement === idx;
                        // Hide from main array if we are in distribution phase and it's already "gone" to a bucket
                        // For simplicity, let's say it's "visible" in array only in initial and merging phases, 
                        // OR if it's currently active.
                        const isVisible = phase === 'initial' || phase === 'merging' || phase === 'done' || isActive;

                        // Handle duplicate values for stable animation
                        const counts = {};
                        for (let k = 0; k <= idx; k++) {
                            if (array[k] === value) counts[value] = (counts[value] || 0) + 1;
                        }
                        const elementKey = `${value}-${counts[value]}`;

                        return (
                            <div key={`idx-container-${idx}`} className="flex flex-col items-center gap-1 min-w-[3rem]">
                                <motion.div
                                    layoutId={elementKey}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className={`
                                        w-12 h-14 rounded-lg flex items-center justify-center 
                                        text-lg font-bold border-2 transition-all duration-300
                                        ${isActive ? THEME.node.active : (isSorted ? THEME.node.sorted : THEME.node.default)}
                                        ${!isVisible ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}
                                    `}
                                >
                                    {value}
                                </motion.div>
                                <span className="text-[10px] text-white/30">{idx}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* --- MIDDLE SECTION: BUCKETS --- */}
            <div className="relative z-10 w-full grid grid-cols-2 sm:grid-cols-5 gap-4 px-4 h-full flex-1">
                {buckets.map((bucketItems, bIdx) => {
                    const isActiveBucket = targetBucket === bIdx;

                    return (
                        <div
                            key={`bucket-${bIdx}`}
                            className={`
                                flex flex-col items-center p-3 rounded-2xl border-2 transition-all duration-500
                                ${isActiveBucket ? THEME.node.bucketActive : THEME.node.bucket}
                                min-h-[140px] relative
                            `}
                        >
                            {/* Bucket Label */}
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#080808] border border-white/10 rounded-full text-[10px] text-white/60 whitespace-nowrap">
                                {bucketRanges[bIdx]}
                            </div>

                            {/* Bucket Index */}
                            <div className="absolute bottom-2 right-3 text-[10px] text-white/20 font-bold">
                                B{bIdx}
                            </div>

                            {/* Bucket Elements */}
                            <div className="flex flex-wrap justify-center gap-1 mt-2 w-full">
                                {bucketItems.map((val, itemIdx) => {
                                    // Need to find the global "occurrence index" for this value to match layoutId
                                    // This is tricky because we don't know which specific array element this came from
                                    // if there are duplicates. 
                                    // We'll approximate by counting occurrences across all buckets up to this point.
                                    let globalOccurrence = 0;
                                    for (let i = 0; i < bIdx; i++) {
                                        globalOccurrence += buckets[i].filter(v => v === val).length;
                                    }
                                    for (let i = 0; i <= itemIdx; i++) {
                                        if (bucketItems[i] === val) globalOccurrence++;
                                    }

                                    const elementKey = `${val}-${globalOccurrence}`;

                                    // During Merging phase, if an element is already in the main array, 
                                    // it shouldn't be in the bucket.
                                    // However, the engine's `buckets` still has it.
                                    // We should hide it from bucket if it's already "poured back".
                                    let isHiddenFromBucket = false;
                                    if (phase === 'merging' || phase === 'done') {
                                        // Count how many of this value are already sorted in the main array
                                        let alreadySortedCount = 0;
                                        for (let idx of sortedIndices) {
                                            if (array[idx] === val) alreadySortedCount++;
                                        }
                                        if (globalOccurrence <= alreadySortedCount) {
                                            isHiddenFromBucket = true;
                                        }
                                    }

                                    return (
                                        <motion.div
                                            key={elementKey}
                                            layoutId={elementKey}
                                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                            className={`
                                                w-8 h-10 rounded-md flex items-center justify-center 
                                                text-xs font-bold border transition-all duration-300
                                                ${isActiveBucket ? 'bg-[#9d4edd]/30 border-[#9d4edd]' : 'bg-[#9d4edd]/10 border-[#9d4edd]/30'}
                                                ${isHiddenFromBucket ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}
                                            `}
                                        >
                                            {val}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* --- BOTTOM SECTION: LEGEND --- */}
            <div className="relative z-10 w-full mt-8 flex justify-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ffeb3b] shadow-[0_0_10px_rgba(255,235,59,0.5)]"></div>
                    <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Active</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#00ff88] shadow-[0_0_10px_rgba(0,255,136,0.5)]"></div>
                    <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Sorted</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#9d4edd] shadow-[0_0_10px_rgba(157,78,221,0.5)]"></div>
                    <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Distributed</span>
                </div>
            </div>
        </div>
    );
};

export default BucketSortVisualizer;

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const THEME = {
    node: {
        default: 'bg-dark-900/40 border-white/20 text-white/50',
        active: 'bg-[#ffeb3b]/20 border-[#ffeb3b] text-[#ffeb3b] shadow-[0_0_20px_rgba(255,235,59,0.4)] scale-110 z-50',
        highlightDigit: 'text-white font-black underline decoration-[#ffeb3b] decoration-2 underline-offset-4',
        bucket: 'bg-dark-900/60 border-white/10 text-white/30',
        bucketActive: 'bg-[#ffeb3b]/10 border-[#ffeb3b]/50 shadow-[0_0_20px_rgba(255,235,59,0.1)]',
        done: 'bg-[#00ff88]/20 border-[#00ff88] text-[#00ff88] shadow-[0_0_20px_rgba(0,255,136,0.3)]'
    }
};

const RadixSortVisualizer = ({ currentStep, isCompact = false }) => {
    if (!currentStep) return null;

    const {
        array,
        buckets,
        phase,
        message,
        activeElement,
        targetBucket,
        digitPlace = 1
    } = currentStep;

    // Helper to render number with highlighted digit
    const RenderNumber = ({ val, exp }) => {
        const valStr = val.toString();
        if (!exp || phase === 'done') return <span>{valStr}</span>;

        const valArr = valStr.split('').reverse();
        const digitIndex = Math.log10(exp);

        return (
            <span className="flex flex-row-reverse">
                {valArr.map((digit, idx) => (
                    <span
                        key={idx}
                        className={idx === digitIndex ? THEME.node.highlightDigit : ''}
                    >
                        {digit}
                    </span>
                ))}
            </span>
        );
    };

    return (
        <div className={`w-full bg-[#080808] ${isCompact ? 'min-h-[400px]' : 'min-h-[600px]'} h-auto rounded-[2.5rem] overflow-hidden relative border-2 border-white flex flex-col items-center justify-start ${isCompact ? 'p-4' : 'p-8'} font-mono select-none shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-500`}>
            {/* Background Grain */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3%3C/filter%3%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3%3C/svg%3")` }} />

            {/* Header / Message */}
            <div className="relative z-10 w-full flex flex-col items-center gap-6 mb-12">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={message}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-[#ffeb3b] text-xs sm:text-sm uppercase tracking-[0.2em] font-bold bg-[#ffeb3b]/10 px-6 py-2 rounded-full border border-[#ffeb3b]/30 text-center max-w-2xl backdrop-blur-sm shadow-[0_0_15px_rgba(255,235,59,0.1)]"
                    >
                        {message}
                    </motion.div>
                </AnimatePresence>

                {/* Main Array Display */}
                <div className="flex justify-center items-end gap-2 h-28 relative px-2 flex-wrap w-full">
                    {array.map((value, idx) => {
                        const isActive = activeElement === idx;
                        const isSorted = phase === 'done';

                        // Handle visibility
                        // In distribution, move element out of array?
                        // Actually, let's keep it in array but lowered opacity unless it's the active one moving
                        // const isMoving = phase === 'distribution' && isActive;
                        // const isGone = phase === 'distribution' && !isActive && activeElement !== null && idx < activeElement;
                        // Actually better: if in distribution, if idx < activeElement, it is already in a bucket.
                        const isInBucket = phase === 'distribution' && idx < activeElement;
                        const isBeingCollected = phase === 'collecting' && idx <= activeElement;

                        // LayoutID for smooth flight
                        // Radix sort is stable, so we can use occurrence counting for layoutIds
                        let occurrence = 0;
                        for (let k = 0; k <= idx; k++) if (array[k] === value) occurrence++;
                        const layoutId = `radix-node-${value}-${occurrence}`;

                        return (
                            <div key={`idx-box-${idx}`} className="flex flex-col items-center gap-2 min-w-[3.5rem]">
                                <motion.div
                                    layoutId={layoutId}
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    className={`
                                        w-14 h-16 rounded-xl flex items-center justify-center 
                                        text-xl font-bold border-2 transition-all duration-300
                                        ${isActive ? THEME.node.active : (isSorted ? THEME.node.done : THEME.node.default)}
                                        ${(isInBucket && !isBeingCollected) ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}
                                    `}
                                >
                                    <RenderNumber val={value} exp={digitPlace} />
                                </motion.div>
                                <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{idx}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Digit Buckets (0-9) */}
            <div className="relative z-10 w-full grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3 px-4 h-full flex-1 min-h-[250px]">
                {Array.from({ length: 10 }).map((_, bIdx) => {
                    const bucketItems = buckets[bIdx] || [];
                    const isActiveBucket = targetBucket === bIdx;

                    return (
                        <div
                            key={`radix-bucket-${bIdx}`}
                            className={`
                                flex flex-col items-center p-2 rounded-2xl border-2 transition-all duration-500
                                ${isActiveBucket ? THEME.node.bucketActive : THEME.node.bucket}
                                min-h-[180px] relative backdrop-blur-sm
                            `}
                        >
                            {/* Bucket Label */}
                            <div className={`
                                absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-2 
                                flex items-center justify-center font-black text-sm transition-colors duration-300
                                ${isActiveBucket ? 'bg-[#ffeb3b] text-black border-[#ffeb3b]' : 'bg-[#080808] text-white/40 border-white/10'}
                            `}>
                                {bIdx}
                            </div>

                            {/* Elements in Bucket */}
                            <div className="flex flex-col-reverse items-center gap-1.5 mt-6 w-full overflow-y-auto max-h-[140px] custom-scrollbar">
                                <AnimatePresence>
                                    {bucketItems.map((val, itemIdx) => {
                                        // Occurrence count for stable layoutId
                                        // This is a bit complex since we need to match the global occurrence
                                        // let globalOcc = 0;
                                        // In collection phase, buckets are emptied. 
                                        // This makes layoutId tracking hard if we don't know the ORIGINAL index.
                                        // However, Radix Sort STABILITY is key.
                                        // Let's assume the order in buckets matches the stable order.

                                        // Find which occurrence this belongs to in the ORIGINAL array
                                        // based on its position in current buckets + already collected elements.
                                        let countInBucketsSoFar = 0;
                                        for (let i = 0; i < bIdx; i++) countInBucketsSoFar += (buckets[i]?.filter(v => v === val).length || 0);
                                        for (let i = 0; i <= itemIdx; i++) if (bucketItems[i] === val) countInBucketsSoFar++;

                                        // If in collection phase, some are already back in array
                                        let countInMainArray = 0;
                                        if (phase === 'collecting') {
                                            for (let k = 0; k <= activeElement; k++) if (array[k] === val) countInMainArray++;
                                        }

                                        const layoutId = `radix-node-${val}-${countInBucketsSoFar + countInMainArray}`;

                                        return (
                                            <motion.div
                                                key={`${layoutId}-item`}
                                                layoutId={layoutId}
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.8, opacity: 0 }}
                                                className={`
                                                    w-10 h-10 rounded-lg flex items-center justify-center 
                                                    text-xs font-bold border transition-all duration-300
                                                    ${isActiveBucket ? 'bg-[#ffeb3b]/20 border-[#ffeb3b]/40 text-[#ffeb3b]' : 'bg-white/5 border-white/10 text-white/60'}
                                                `}
                                            >
                                                <RenderNumber val={val} exp={digitPlace} />
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer Legend */}
            <div className="relative z-10 w-full mt-8 flex justify-center gap-8 border-t border-white/5 pt-6">
                <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-lg bg-[#ffeb3b] shadow-[0_0_15px_rgba(255,235,59,0.5)]"></div>
                    <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">Comparing Digit</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-lg bg-dark-900 border border-white/20"></div>
                    <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">Mem Cell</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-lg bg-[#00ff88] shadow-[0_0_15px_rgba(0,255,136,0.5)] border border-[#00ff88]"></div>
                    <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">Fully Sorted</span>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 3px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default RadixSortVisualizer;

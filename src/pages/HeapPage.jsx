import React, { useState, useEffect, useRef } from 'react';
import { MaxHeap } from '../algorithms/heap';
import HeapVisualizer from '../components/HeapVisualizer';
import { motion } from 'framer-motion';

const HeapPage = () => {
    const [heapObj] = useState(new MaxHeap());
    const [heapArray, setHeapArray] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [animationSteps, setAnimationSteps] = useState([]);
    const [message, setMessage] = useState('Ready');
    const [speed, setSpeed] = useState(500);

    // Animation State
    const [activeIndices, setActiveIndices] = useState([]);
    const [compareIndices, setCompareIndices] = useState([]);
    const [sortedIndices, setSortedIndices] = useState([]);

    const timerRef = useRef(null);

    // Function declarations (must be before useEffect hooks that reference them)
    const executeStep = (step) => {
        setMessage(step.label || 'Processing...');

        // Default resets
        setCompareIndices([]);
        setActiveIndices([]);

        switch (step.type) {
            case 'add':
            case 'highlight':
            case 'replace':
                setActiveIndices(step.indices);
                break;
            case 'compare':
                setCompareIndices(step.indices);
                break;
            case 'swap':
                setActiveIndices(step.indices);
                setHeapArray(prev => {
                    const newArr = [...prev];
                    const [i, j] = step.indices;
                    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
                    return newArr;
                });
                break;
            case 'done':
                resetHighlights();
                break;
            case 'lock':
                setSortedIndices(prev => [...prev, ...step.indices]);
                break;
            default:
                break;
        }
    };

    const resetHighlights = () => {
        setActiveIndices([]);
        setCompareIndices([]);
    };

    const handleRandom = () => {
        const { heap } = heapObj.createRandom(10);
        setHeapArray(heap);
        setAnimationSteps([]);
        setCurrentStep(0);
        setSortedIndices([]);
        setMessage('Random Heap Created');
    };

    useEffect(() => {
        // Initialize random heap
        handleRandom();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isPlaying) {
            timerRef.current = setTimeout(() => {
                if (currentStep < animationSteps.length) {
                    executeStep(animationSteps[currentStep]);
                    setCurrentStep(prev => prev + 1);
                } else {
                    setIsPlaying(false);
                    setMessage('Finished');
                    resetHighlights();
                }
            }, speed);
        }
        return () => clearTimeout(timerRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPlaying, currentStep, animationSteps, speed]);

    const handleInsert = () => {
        if (!inputValue) return;
        const val = parseInt(inputValue);
        if (isNaN(val)) return;

        // Reset visual state to match actual heap before op (safety)
        setHeapArray(heapObj.getHeap());

        const { steps } = heapObj.insert(val);

        // We start the visual array with the new element added but not sorted technically?
        // Actually `insert` returns the FINAL heap. We need to reconstruct the "Before" state or simulate animations.
        // Challenge: `heapObj` is now updated. `heapArray` needs to be `heapObj.getHeap()` BEFORE the sort, 
        // PLUS the pushed element.
        // CORRECTION: My `MaxHeap` class updates its state immediately. 
        // To visualize properly, we should:
        // 1. Get current heap state (already in `heapArray`).
        // 2. Add the new element to `heapArray` at the end visually.
        // 3. Then play animations which will swap elements in `heapArray`.

        // Revert core object to pre-insert state? No, object is truth.
        // We need to sync `heapArray` to `steps` logic.
        // The `swap` steps are indices. If we apply them to the starting array, we get final array.
        // So: 
        // Initial State for visualizer: Current Heap + New Value appended.
        setHeapArray([...heapObj.getHeap().slice(0, heapObj.getHeap().length - 1), val]);

        // This is tricky because `heapObj.insert` already did the swaps in the object.
        // But `heapArray` is React state.
        // If I just set `heapArray` to `[...old, val]`, then apply swaps, it should match `heapObj` at the end.

        setAnimationSteps(steps);
        setCurrentStep(0);
        setIsPlaying(true);
        setInputValue('');
    };

    const handleExtractMax = () => {
        // Initial State: Current Heap (already set)
        // We need to mimic the "replace root with last" step visually.
        const { max: _max, steps } = heapObj.extractMax();
        // Special handling: The first step usually assumes the array is intact.
        // We will let the steps drive the transformations.
        // The `extractMax` logic in `MaxHeap` does: 
        // 1. Pop last. 2. Replace root. 3. Sift down.

        // In React State, we handle this via `executeStep` ? 
        // We need a specific step type for "Modify Array Structure" (pop/replace).
        // The current `heap.js` has `replace` step.

        // We need to ensure `heapArray` starts correct.
        setAnimationSteps(steps);
        setCurrentStep(0);
        setIsPlaying(true);
    };

    // Handlers for controls
    const handleControl = (action) => {
        if (isPlaying) return;
        action();
    };

    return (
        <div className="min-h-screen bg-dark-900 text-white p-8 font-inter">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Left Control Panel */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-dark-800 p-6 rounded-2xl border border-dark-600 shadow-xl">
                        <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                            Controls
                        </h2>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs text-dark-300 uppercase tracking-wider font-semibold">Input</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                        placeholder="Value..."
                                    />
                                    <button
                                        onClick={() => handleControl(handleInsert)}
                                        disabled={isPlaying}
                                        className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Insert
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => handleControl(handleExtractMax)}
                                    disabled={isPlaying}
                                    className="col-span-2 bg-red-500/10 border border-red-500/50 hover:bg-red-500/20 text-red-500 disabled:opacity-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Extract Max
                                </button>
                                <button
                                    onClick={() => handleControl(handleRandom)}
                                    disabled={isPlaying}
                                    className="col-span-2 bg-dark-700 hover:bg-dark-600 border border-dark-500 active:bg-dark-500 disabled:opacity-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Randomize
                                </button>
                            </div>

                            <div className="pt-4 border-t border-dark-700">
                                <label className="text-xs text-dark-300 uppercase tracking-wider font-semibold block mb-2">Speed ({speed}ms)</label>
                                <input
                                    type="range"
                                    min="50"
                                    max="1000"
                                    step="50"
                                    value={speed}
                                    onChange={(e) => setSpeed(Number(e.target.value))}
                                    className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-dark-800 p-6 rounded-2xl border border-dark-600 shadow-xl">
                        <h3 className="text-sm font-semibold text-dark-200 mb-2">Status</h3>
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-yellow-500 animate-pulse' : 'bg-emerald-500'}`} />
                            <p className="text-sm text-dark-300 font-mono">{message}</p>
                        </div>
                    </div>
                </div>

                {/* Center Visualization */}
                <div className="lg:col-span-3 space-y-6">
                    <HeapVisualizer
                        heap={heapArray}
                        activeIndices={activeIndices}
                        compareIndices={compareIndices}
                        sortedIndices={sortedIndices}
                    />

                    {/* Playback Controls */}
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-12 h-12 rounded-full bg-dark-700 hover:bg-dark-600 flex items-center justify-center border border-dark-500 transition-all hover:scale-105"
                        >
                            {isPlaying ? (
                                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                            ) : (
                                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            )}
                        </button>

                        <button
                            onClick={() => {
                                if (currentStep > 0) {
                                    // Backtracking implementation is complex without reverse steps
                                    // For now we just reset
                                    handleRandom();
                                }
                            }}
                            className="w-12 h-12 rounded-full bg-dark-700 hover:bg-dark-600 flex items-center justify-center border border-dark-500 transition-all hover:scale-105"
                            title="Reset"
                        >
                            <svg className="w-5 h-5 text-dark-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeapPage;

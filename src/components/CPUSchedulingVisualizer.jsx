import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

// --- Shared Helpers ---

const createSnapshot = (time, currentProcess, readyQueue, localProcesses, explanation = "") => ({
    time,
    runningPid: currentProcess ? currentProcess.pid : null,
    readyQueueIds: readyQueue.map(p => p.pid),
    completedIds: localProcesses.filter(p => p.remainingTime === 0).map(p => p.pid),
    remainingTimes: Object.fromEntries(localProcesses.map(p => [p.pid, p.remainingTime])),
    metrics: JSON.parse(JSON.stringify(localProcesses)),
    arrivingIds: localProcesses.filter(p => p.arrivalTime === time && !readyQueue.find(rq => rq.pid === p.pid) && (!currentProcess || currentProcess.pid !== p.pid)).map(p => p.pid),
    explanation
});

const initializeProcesses = (processes) => processes.map(p => ({
    ...p,
    remainingTime: p.burstTime,
    completionTime: 0,
    turnaroundTime: 0,
    waitingTime: 0,
    responseTime: -1,
    isCompleted: false
}));

// --- Algorithm Simulation Functions ---

// --- Main Engine Wrapper ---

const computeFinalMetrics = (gantt, processes) => {
    return processes.map(p => {
        let lastOccurrence = -1;
        for (let i = gantt.length - 1; i >= 0; i--) {
            if (gantt[i] === p.pid) {
                lastOccurrence = i;
                break;
            }
        }
        const ct = lastOccurrence === -1 ? 0 : lastOccurrence + 1;
        const tat = ct > 0 ? ct - p.arrivalTime : 0;
        const wt = ct > 0 ? tat - p.burstTime : 0;
        return {
            ...p,
            completionTime: ct,
            turnaroundTime: tat,
            waitingTime: wt,
            isCompleted: ct > 0
        };
    });
};

const runSchedulingEngine = (algorithm, processes, options = {}) => {
    const { timeQuantum = 2 } = options;
    let localProcesses = initializeProcesses(processes);
    let time = 0;
    let timeline = [];
    let gantt = [];
    let completed = 0;
    let n = localProcesses.length;
    let readyQueue = [];
    let currentProcess = null;
    let timeInSlice = 0; // For Round Robin

    // Simulation Loop (Unit by Unit)
    while (completed < n && time < 200) {
        // 1. Handle Arrivals
        localProcesses.forEach(p => {
            if (p.arrivalTime === time && !readyQueue.find(q => q.pid === p.pid) && (currentProcess ? currentProcess.pid !== p.pid : true)) {
                if (algorithm === 'round_robin') readyQueue.push(p); // RR uses simple push
                else readyQueue.push(p);
            }
        });

        // 2. Select Process based on Algorithm
        let explanation = "";

        if (algorithm === 'fcfs') {
            if (!currentProcess && readyQueue.length > 0) {
                readyQueue.sort((a, b) => a.arrivalTime - b.arrivalTime || a.pid - b.pid);
                currentProcess = readyQueue.shift();
                explanation = `FCFS: P${currentProcess.pid} started.`;
            }
        } else if (algorithm === 'sjf') {
            if (!currentProcess && readyQueue.length > 0) {
                readyQueue.sort((a, b) => a.burstTime - b.burstTime || a.arrivalTime - b.arrivalTime || a.pid - b.pid);
                currentProcess = readyQueue.shift();
                explanation = `SJF: P${currentProcess.pid} started (Shortest Burst).`;
            }
        } else if (algorithm === 'srtf') {
            let candidates = localProcesses.filter(p => p.arrivalTime <= time && p.remainingTime > 0);
            candidates.sort((a, b) => a.remainingTime - b.remainingTime || a.arrivalTime - b.arrivalTime || a.pid - b.pid);
            let selected = candidates[0] || null;
            if (selected && (!currentProcess || currentProcess.pid !== selected.pid)) {
                if (currentProcess) readyQueue.push(currentProcess);
                currentProcess = selected;
                readyQueue = candidates.slice(1);
                explanation = `SRTF: P${currentProcess.pid} preempted/started (Shortest Remaining).`;
            }
        } else if (algorithm === 'priority_np') {
            if (!currentProcess && readyQueue.length > 0) {
                readyQueue.sort((a, b) => a.priority - b.priority || a.arrivalTime - b.arrivalTime || a.pid - b.pid);
                currentProcess = readyQueue.shift();
                explanation = `Priority (NP): P${currentProcess.pid} started.`;
            }
        } else if (algorithm === 'priority_p') {
            let candidates = localProcesses.filter(p => p.arrivalTime <= time && p.remainingTime > 0);
            candidates.sort((a, b) => a.priority - b.priority || a.arrivalTime - b.arrivalTime || a.pid - b.pid);
            let selected = candidates[0] || null;
            if (selected && (!currentProcess || currentProcess.pid !== selected.pid)) {
                if (currentProcess) readyQueue.push(currentProcess);
                currentProcess = selected;
                readyQueue = candidates.slice(1);
                explanation = `Priority (P): P${currentProcess.pid} preempted/started.`;
            }
        } else if (algorithm === 'round_robin') {
            if (!currentProcess && readyQueue.length > 0) {
                currentProcess = readyQueue.shift();
                timeInSlice = 0;
                explanation = `RR: P${currentProcess.pid} started new slice.`;
            }
        }

        if (!currentProcess) explanation = "CPU Idle.";

        // 3. Record State & Gantt
        gantt.push(currentProcess ? currentProcess.pid : null);
        timeline.push(createSnapshot(time, currentProcess, readyQueue, localProcesses, explanation));

        // 4. Execute Unit
        if (currentProcess) {
            currentProcess.remainingTime--;
            time++;
            timeInSlice++;

            // Check Completion
            if (currentProcess.remainingTime === 0) {
                currentProcess.isCompleted = true;
                completed++;
                currentProcess = null;
            } else if (algorithm === 'round_robin' && timeInSlice >= timeQuantum) {
                // RR Preemption
                // Add newly arrived processes at this exact time first? 
                // Traditional RR: arrivals at same time as preemption go after the preempted process? 
                // Let's stick to simple: add arrivals at time T, then add the preempted process.
                localProcesses.forEach(p => {
                    if (p.arrivalTime === time && !readyQueue.find(q => q.pid === p.pid)) {
                        readyQueue.push(p);
                    }
                });
                readyQueue.push(currentProcess);
                currentProcess = null;
            }
        } else {
            time++;
        }
    }

    // Final Post-Simulation Computation
    const finalMetrics = computeFinalMetrics(gantt, localProcesses);

    // Update all snapshots with final metrics for the table
    const finalTimeline = timeline.map(step => ({
        ...step,
        metrics: finalMetrics.map(fm => {
            // Only show metrics for processes that "have completed relative to the global simulation end"
            // or just show them all if we want the final results table to be ready.
            // Requirement says "After simulation ends, compute...". 
            // So we'll inject these into the final snapshot or all.
            return fm;
        })
    }));

    finalTimeline.push(createSnapshot(time, null, [], finalMetrics, "Simulation complete. Results calculated."));
    return finalTimeline;
};

// --- View Components ---

const ProcessBox = ({ pid, type = 'default', remaining = 0, colorHelper, isPreempted = false }) => {
    const isCompleted = type === 'completed';
    const isRunning = type === 'running';

    return (
        <motion.div
            layoutId={`process-${pid}`}
            initial={{ opacity: 0 }}
            animate={{
                opacity: 1,
                scale: isRunning ? 1.05 : 1,
                x: isPreempted ? [0, -5, 5, -5, 5, 0] : 0,
            }}
            transition={{
                duration: 0.3,
                x: { duration: 0.4 }
            }}
            className={`
                relative flex flex-col items-center justify-center rounded-lg font-bold border
                ${isRunning ? 'w-16 h-16 text-base border-white/40 shadow-sm' : 'w-10 h-10 text-[10px] border-white/10'}
                ${isCompleted ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'text-white'}
            `}
            style={{
                backgroundColor: isRunning
                    ? colorHelper(pid, 0.2)
                    : isCompleted
                        ? 'transparent'
                        : colorHelper(pid, 0.1),
            }}
        >
            <span className="relative z-10">P{pid}</span>
            {isRunning && remaining > 0 && (
                <span className="text-[9px] font-mono mt-0.5 opacity-60">{remaining}ms</span>
            )}
        </motion.div>
    );
};

// --- Main Visualizer Component ---

const CPUSchedulingVisualizer = ({ algorithm, speed = 1 }) => {
    const [numProcesses, setNumProcesses] = useState(4);
    const [processes, setProcesses] = useState([]);
    const [timeQuantum, setTimeQuantum] = useState(2);

    const [isPaused, setIsPaused] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);
    const [fullTimeline, setFullTimeline] = useState([]);
    const [playbackSpeed, setPlaybackSpeed] = useState(speed);
    const [simulationFinished, setSimulationFinished] = useState(false);

    const timerRef = useRef(null);

    const getProcessColor = (pid, alphaRef = 1, desaturated = false) => {
        const hue = (pid * 137.5) % 360;
        const saturation = desaturated ? 20 : 80;
        const lightness = desaturated ? 40 : 60;
        return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alphaRef})`;
    };

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT') return;
            if (e.code === 'Space') {
                e.preventDefault();
                if (fullTimeline.length === 0) startSimulation();
                else setIsPaused(prev => !prev);
            } else if (e.code === 'ArrowRight') {
                e.preventDefault();
                handleStepForward();
            } else if (e.code === 'ArrowLeft') {
                e.preventDefault();
                handleStepBackward();
            } else if (e.key.toLowerCase() === 'r') {
                e.preventDefault();
                resetSimulation();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [fullTimeline, isPaused]);

    useEffect(() => {
        setProcesses(prev => {
            if (prev.length === numProcesses) return prev;
            if (numProcesses > prev.length) {
                // Append new processes
                const diff = numProcesses - prev.length;
                const newOnes = Array.from({ length: diff }, (_, i) => ({
                    pid: prev.length + i + 1,
                    arrivalTime: Math.floor(Math.random() * 5),
                    burstTime: Math.floor(Math.random() * 8) + 2,
                    priority: Math.floor(Math.random() * 5) + 1,
                }));
                return [...prev, ...newOnes];
            } else {
                // Truncate
                return prev.slice(0, numProcesses);
            }
        });
        resetSimulation();
    }, [numProcesses]);

    useEffect(() => {
        resetSimulation();
    }, [algorithm]);

    const handleCreateTable = () => {
        const newProcesses = Array.from({ length: numProcesses }, (_, i) => ({
            pid: i + 1,
            arrivalTime: Math.floor(Math.random() * 5),
            burstTime: Math.floor(Math.random() * 8) + 2,
            priority: Math.floor(Math.random() * 5) + 1,
        }));
        setProcesses(newProcesses);
        resetSimulation();
    };

    const resetSimulation = () => {
        stopPlayback();
        setCurrentStep(0);
        setFullTimeline([]);
        setSimulationFinished(false);
        setIsPaused(true);
    };

    const updateProcessField = (pid, field, value) => {
        setProcesses(prev => prev.map(p =>
            p.pid === pid ? { ...p, [field]: parseInt(value) || 0 } : p
        ));
        resetSimulation();
    };

    const startSimulation = () => {
        const timeline = runSchedulingEngine(algorithm, processes, { timeQuantum });
        setFullTimeline(timeline);
        setCurrentStep(0);
        setIsPaused(false);
        setSimulationFinished(false);
    };

    const stopPlayback = () => {
        setIsPaused(true);
        if (timerRef.current) clearInterval(timerRef.current);
    };

    useEffect(() => {
        if (!isPaused && fullTimeline.length > 0 && currentStep < fullTimeline.length - 1) {
            timerRef.current = setInterval(() => {
                setCurrentStep(prev => prev + 1);
            }, 1000 / playbackSpeed);
        } else if (currentStep >= fullTimeline.length - 1 && fullTimeline.length > 0) {
            setSimulationFinished(true);
            setIsPaused(true);
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [isPaused, currentStep, fullTimeline, playbackSpeed]);

    const handleStepForward = () => {
        if (fullTimeline.length === 0) {
            const tl = runSchedulingEngine(algorithm, processes, { timeQuantum });
            setFullTimeline(tl);
            setCurrentStep(1);
            setIsPaused(true);
            return;
        }
        if (currentStep < fullTimeline.length - 1) setCurrentStep(prev => prev + 1);
    };

    const handleStepBackward = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
            setSimulationFinished(false);
        }
    };

    const stepData = fullTimeline[currentStep] || null;

    const ganttTicks = useMemo(() => {
        if (fullTimeline.length === 0 || currentStep === 0) return [];
        return fullTimeline.slice(0, currentStep).map((step, i) => ({
            pid: step.runningPid,
            time: i
        }));
    }, [fullTimeline, currentStep]);

    return (
        <div className="flex flex-col gap-4 w-full text-white bg-[#050505] p-4 sm:p-6 rounded-xl border border-white/5 relative overflow-hidden font-sans">
            {/* Minimalist Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-white/5 rounded-lg border border-white/5">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <label className="text-[10px] text-white/40 uppercase font-black tracking-widest">Processes</label>
                        <input
                            type="number" min="1" max="10"
                            value={numProcesses}
                            disabled={!isPaused && !simulationFinished && fullTimeline.length > 0}
                            onChange={(e) => { e.stopPropagation(); setNumProcesses(parseInt(e.target.value) || 1); }}
                            className="bg-black/40 border border-white/10 rounded px-2 py-1 w-12 text-xs font-bold outline-none focus:border-emerald-500/50"
                        />
                    </div>

                    {algorithm === 'round_robin' && (
                        <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                            <label className="text-[10px] text-pink-400 uppercase font-black tracking-widest">Quantum</label>
                            <input
                                type="number" min="1"
                                value={timeQuantum}
                                disabled={!isPaused && !simulationFinished && fullTimeline.length > 0}
                                onChange={(e) => { e.stopPropagation(); setTimeQuantum(parseInt(e.target.value) || 1); }}
                                onKeyDown={(e) => e.stopPropagation()}
                                className="bg-black/40 border border-white/10 rounded px-2 py-1 w-12 text-xs font-bold text-pink-400 outline-none focus:border-pink-500/50"
                            />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); handleStepBackward(); }} disabled={currentStep === 0} className="p-2 hover:bg-white/10 rounded disabled:opacity-20 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (fullTimeline.length === 0) startSimulation();
                            else setIsPaused(!isPaused);
                        }}
                        className={`px-6 py-1.5 rounded font-black text-[11px] transition-all tracking-widest ${isPaused ? 'bg-emerald-600' : 'bg-amber-600'}`}
                    >
                        {isPaused ? 'PLAY' : 'PAUSE'}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleStepForward(); }} disabled={simulationFinished} className="p-2 hover:bg-white/10 rounded disabled:opacity-20 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
                    <button onClick={(e) => { e.stopPropagation(); resetSimulation(); }} className="ml-2 px-3 py-1.5 text-[10px] font-black text-red-500 hover:bg-red-500/10 rounded transition-colors tracking-widest">RESET</button>
                </div>

                <div className="flex items-center gap-4">
                    <input
                        type="range" min="0.5" max="5" step="0.5"
                        value={playbackSpeed}
                        onChange={e => { e.stopPropagation(); setPlaybackSpeed(parseFloat(e.target.value)); }}
                        className="w-20 accent-emerald-500 cursor-pointer"
                    />
                    <span className="text-[10px] font-mono text-white/40 tabular-nums">{playbackSpeed}x</span>
                </div>
            </div>

            {/* Simple Step Explanation */}
            <div className="px-4 py-2 bg-white/[0.01] border-l border-emerald-500/50 min-h-[36px] flex items-center">
                <p className="text-[11px] text-white/50 leading-relaxed tabular-nums">
                    <span className="font-bold text-emerald-500/80 mr-3 uppercase tracking-tighter">Time {currentStep}s:</span>
                    {stepData?.explanation || "Initialize the simulation to see execution steps."}
                </p>
            </div>

            {/* Gantt Chart - Now First */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-lg overflow-hidden mt-1 shadow-2xl">
                <div className="px-4 py-2 bg-white/[0.02] border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Process Execution Timeline (Gantt)</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-500 font-bold tabular-nums">TIME: {currentStep}S</span>
                </div>
                <div className="p-4 overflow-x-auto custom-scrollbar bg-black/20">
                    {ganttTicks.length > 0 ? (
                        <div className="inline-block relative px-6 pb-2">
                            <div className="flex h-12 items-end">
                                {ganttTicks.map((tick, i) => (
                                    <div
                                        key={i}
                                        className={`h-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${tick.pid ? 'border border-white/20 rounded-sm' : ''}`}
                                        style={{
                                            width: '30px',
                                            backgroundColor: tick.pid ? getProcessColor(tick.pid, 0.45) : 'transparent',
                                            boxShadow: tick.pid ? `0 0 15px ${getProcessColor(tick.pid, 0.1)}` : 'none',
                                            marginLeft: i > 0 && ganttTicks[i - 1].pid && tick.pid ? '-1px' : '0'
                                        }}
                                    >
                                        <span className="text-[10px] font-black text-white/90 drop-shadow-sm">{tick.pid ? `P${tick.pid}` : ''}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="relative h-4 mt-2">
                                <div className="absolute text-[9px] font-black font-mono text-white/30" style={{ left: '0', transform: 'translateX(-50%)' }}>0</div>
                                {ganttTicks.map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute text-[9px] font-black font-mono text-white/30"
                                        style={{ left: `${(i + 1) * 30}px`, transform: 'translateX(-50%)' }}
                                    >
                                        {i + 1}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="py-10 flex flex-col items-center justify-center opacity-10">
                            <div className="flex gap-1 mb-3">
                                {[1, 2, 3].map(i => <div key={i} className="w-4 h-1 bg-white/40 rounded-full" />)}
                            </div>
                            <span className="text-[9px] uppercase font-black tracking-[0.5em]">System Idle - Ready to Execute</span>
                        </div>
                    )}
                </div>
            </div>

            {/* High Performance Content Grid - Now Below Gantt */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
                {/* Left: Data Input */}
                <div className="lg:col-span-3 bg-white/[0.02] border border-white/5 rounded-lg flex flex-col overflow-hidden">
                    <div className="p-2 bg-white/5 text-[9px] font-black uppercase tracking-widest text-white/30 border-b border-white/5">Input Parameters</div>
                    <div className="flex-1 overflow-auto p-2 custom-scrollbar">
                        <table className="w-full text-[10px]">
                            <thead className="sticky top-0 bg-[#0a0a0c] z-10 text-white/20">
                                <tr className="text-left font-black border-b border-white/5">
                                    <th className="p-1.5">PID</th>
                                    <th className="p-1.5 text-center">ARR</th>
                                    <th className="p-1.5 text-center">BST</th>
                                    {algorithm.includes('priority') && <th className="p-1.5 text-center">PRI</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {processes.map(p => (
                                    <tr key={p.pid} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="p-1.5 font-bold text-white/60">P{p.pid}</td>
                                        <td className="p-1.5"><input type="number" onKeyDown={e => e.stopPropagation()} onClick={e => e.stopPropagation()} value={p.arrivalTime} onChange={e => updateProcessField(p.pid, 'arrivalTime', e.target.value)} className="bg-transparent group-hover:bg-white/5 w-full text-center outline-none rounded p-1 transition-all" /></td>
                                        <td className="p-1.5"><input type="number" onKeyDown={e => e.stopPropagation()} onClick={e => e.stopPropagation()} value={p.burstTime} onChange={e => updateProcessField(p.pid, 'burstTime', e.target.value)} className="bg-transparent group-hover:bg-white/5 w-full text-center outline-none rounded p-1 transition-all" /></td>
                                        {algorithm.includes('priority') && <td className="p-1.5"><input type="number" onKeyDown={e => e.stopPropagation()} onClick={e => e.stopPropagation()} value={p.priority} onChange={e => updateProcessField(p.pid, 'priority', e.target.value)} className="bg-transparent group-hover:bg-white/5 w-full text-center outline-none rounded p-1 transition-all" /></td>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Center: System State */}
                <div className="lg:col-span-6 bg-[#0a0a0a] border border-white/10 rounded-xl flex flex-col p-6 items-center justify-between relative shadow-xl">
                    <div className="absolute top-2 right-4 text-[8px] font-black text-white/5 uppercase tracking-[0.5em]">ALX-ENGINE-V2</div>

                    <div className="w-full text-center">
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Waiting Queue</span>
                        <div className="mt-3 flex gap-2 justify-center min-h-[50px] p-2 bg-black/40 rounded-lg border border-white/5 w-full overflow-x-auto custom-scrollbar">
                            <AnimatePresence initial={false}>
                                {stepData?.readyQueueIds.map(id => (
                                    <ProcessBox key={id} pid={id} type="ready" colorHelper={getProcessColor} />
                                ))}
                                {(!stepData || stepData.readyQueueIds.length === 0) && (
                                    <div className="flex items-center justify-center w-full opacity-10 text-[9px] font-black uppercase tracking-widest italic">Wait-Queue Clear</div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                        <div className="w-20 h-20 rounded-2xl border border-white/10 bg-black/60 flex items-center justify-center relative shadow-inner overflow-hidden">
                            <AnimatePresence mode="wait">
                                {stepData?.runningPid ? (
                                    <ProcessBox
                                        key={stepData.runningPid}
                                        pid={stepData.runningPid}
                                        type="running"
                                        remaining={stepData.remainingTimes[stepData.runningPid]}
                                        colorHelper={getProcessColor}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-1 opacity-20">
                                        <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                                        <span className="text-[9px] font-black text-white uppercase tracking-widest">Idle</span>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500/40">Processor Core</span>
                    </div>

                    <div className="w-full text-center">
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Execution Log (Finished)</span>
                        <div className="mt-3 flex flex-wrap gap-2 justify-center min-h-[40px] p-2 bg-black/20 rounded-lg">
                            <AnimatePresence initial={false}>
                                {stepData?.completedIds.map(id => (
                                    <ProcessBox key={id} pid={id} type="completed" colorHelper={getProcessColor} />
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Right: Analytics */}
                <div className="lg:col-span-3 bg-white/[0.02] border border-white/5 rounded-lg flex flex-col overflow-hidden shadow-sm">
                    <div className="p-2 bg-white/5 text-[9px] font-black uppercase tracking-widest text-white/30 border-b border-white/5">Metric Analysis</div>
                    <div className="flex-1 overflow-auto p-2 custom-scrollbar">
                        <table className="w-full text-[10px]">
                            <thead className="sticky top-0 bg-[#0a0a0c] z-10 text-white/20">
                                <tr className="text-left font-black border-b border-white/5">
                                    <th className="p-1.5">PID</th>
                                    <th className="p-1.5 text-center">CT</th>
                                    <th className="p-1.5 text-center">TAT</th>
                                    <th className="p-1.5 text-center">WT</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-mono">
                                {stepData?.metrics.map(p => {
                                    const isDone = simulationFinished;
                                    return (
                                        <tr key={p.pid} className={`${isDone ? 'text-emerald-400 bg-emerald-500/5' : 'text-white/20'} transition-all`}>
                                            <td className="p-1.5 font-bold font-sans">P{p.pid}</td>
                                            <td className="p-1.5 text-center">{isDone ? p.completionTime : '-'}</td>
                                            <td className="p-1.5 text-center">{isDone ? p.turnaroundTime : '-'}</td>
                                            <td className="p-1.5 text-center">{isDone ? p.waitingTime : '-'}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {simulationFinished && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mt-6 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/30 flex flex-col gap-4 shadow-[0_0_20px_rgba(16,185,129,0.05)]"
                            >
                                <div className="text-center">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/60 mb-1">Results Summary</p>
                                    <div className="h-px bg-emerald-500/20 w-8 mx-auto" />
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col items-center">
                                        <span className="text-[9px] font-bold text-white/40 uppercase tracking-tighter mb-1">Average Turnaround</span>
                                        <span className="text-3xl font-black text-emerald-400 tabular-nums leading-none">
                                            {(stepData.metrics.reduce((s, p) => s + p.turnaroundTime, 0) / numProcesses).toFixed(2)}
                                            <span className="text-[10px] ml-1 opacity-50 font-medium">s</span>
                                        </span>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <span className="text-[9px] font-bold text-white/40 uppercase tracking-tighter mb-1">Average Waiting</span>
                                        <span className="text-3xl font-black text-emerald-500 tabular-nums leading-none">
                                            {(stepData.metrics.reduce((s, p) => s + p.waitingTime, 0) / numProcesses).toFixed(2)}
                                            <span className="text-[10px] ml-1 opacity-50 font-medium">s</span>
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Minimal Legend/Help */}
            <div className="flex justify-center gap-8 text-[8px] font-bold text-white/20 uppercase tracking-[0.3em] py-1 border-t border-white/5 mt-2">
                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 shadow-[0_0_5px_rgba(16,185,129,0.3)]" /> Success</div>
                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 shadow-[0_0_5px_rgba(59,130,246,0.3)]" /> Running</div>
                <div className="flex items-center gap-1.5 text-white/40"><kbd className="bg-white/5 px-1.5 py-0.5 rounded border border-white/10 mx-1">Space</kbd> Play/Pause</div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 3px; height: 3px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 1px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
            `}</style>
        </div>
    );
};

export default CPUSchedulingVisualizer;

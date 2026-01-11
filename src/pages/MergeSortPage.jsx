import React, { useState, useEffect, useCallback } from 'react';
import MergeTree from '../components/MergeTree';
import MergeControls from '../components/MergeControls';
import { generateMergeSortTreeSteps } from '../algorithms/mergeSortTree';

const MergeSortPage = () => {
  // Array state
  const [array, setArray] = useState([38, 27, 43, 3, 9, 82, 10]);
  const [initialArray, setInitialArray] = useState([38, 27, 43, 3, 9, 82, 10]);

  // Animation state
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [speed, setSpeed] = useState(1500);

  // Visualization state
  const [currentStep, setCurrentStep] = useState(null);
  const [currentPhase, setCurrentPhase] = useState('initial');
  const [inputArray, setInputArray] = useState([38, 27, 43, 3, 9, 82, 10]);
  const [outputArray, setOutputArray] = useState([]);

  // Generate initial steps when array changes
  useEffect(() => {
    if (array.length > 0) {
      const newSteps = generateMergeSortTreeSteps(array);
      setSteps(newSteps);
      setCurrentStepIndex(0);
      setCurrentStep(newSteps[0] || null);
      setIsPlaying(false);
      setIsPaused(false);
      setIsAnimating(false);
      setInputArray([...array]);
      
      // Extract final output array from last step
      if (newSteps.length > 0) {
        const lastStep = newSteps[newSteps.length - 1];
        if (lastStep.type === 'complete') {
          setOutputArray(lastStep.outputArray || []);
        }
      }
    }
  }, [array]);

  // Process current step for visualization
  useEffect(() => {
    if (steps.length > 0 && currentStepIndex < steps.length) {
      const step = steps[currentStepIndex];
      setCurrentStep(step);
      
      // Update phase based on step type
      if (step.type === 'initial') {
        setCurrentPhase('initial');
      } else if (step.type === 'split') {
        setCurrentPhase('divide');
      } else if (step.type === 'merge_phase_start' || step.type === 'merge_step' || step.type === 'merge_result') {
        setCurrentPhase('merge');
      } else if (step.type === 'complete') {
        setCurrentPhase('complete');
      }
    }
  }, [currentStepIndex, steps]);

  // Animation timer
  useEffect(() => {
    let timeoutId;
    
    if (isPlaying && !isPaused && currentStepIndex < steps.length - 1) {
      timeoutId = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, speed);
    } else if (isPlaying && currentStepIndex >= steps.length - 1) {
      // Animation complete
      setIsPlaying(false);
      setIsAnimating(false);
    }
    
    return () => clearTimeout(timeoutId);
  }, [isPlaying, isPaused, currentStepIndex, steps.length, speed]);

  // Control handlers
  const handleGenerateArray = useCallback((newArray) => {
    setArray(newArray);
    setInitialArray([...newArray]);
  }, []);

  const handleStart = useCallback(() => {
    if (steps.length > 0) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
      setIsPaused(false);
      setIsAnimating(true);
    }
  }, [steps]);

  const handlePause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleResume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const handleStep = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setIsAnimating(true);
    }
  }, [currentStepIndex, steps]);

  const handleReset = useCallback(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsPaused(false);
    setIsAnimating(false);
    setArray([...initialArray]);
  }, [initialArray]);

  const handleSpeedChange = useCallback((newSpeed) => {
    setSpeed(newSpeed);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Merge Sort Tree Visualizer
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Watch how Merge Sort uses the divide-and-conquer strategy to sort arrays. 
          See the recursive tree structure with splitting and merging phases.
        </p>
      </div>

      {/* Legend */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Tree Visualization:</h3>
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="text-blue-400 font-semibold">🔽</div>
              <span className="text-gray-300">Divide Phase (Top → Down)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-green-400 font-semibold">🔼</div>
              <span className="text-gray-300">Merge Phase (Bottom → Up)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-yellow-400 font-semibold">🟡</div>
              <span className="text-gray-300">Highlighting</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-purple-400 font-semibold">🏁</div>
              <span className="text-gray-300">Final Result</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <MergeControls
        array={array}
        isPlaying={isPlaying}
        isPaused={isPaused}
        isAnimating={isAnimating}
        currentStepIndex={currentStepIndex}
        totalSteps={steps.length}
        speed={speed}
        onGenerateArray={handleGenerateArray}
        onStart={handleStart}
        onPause={handlePause}
        onResume={handleResume}
        onStep={handleStep}
        onReset={handleReset}
        onSpeedChange={handleSpeedChange}
      />

      {/* Visualization */}
      <div className="mt-8">
        <MergeTree
          currentStep={currentStep}
          currentPhase={currentPhase}
          inputArray={inputArray}
          outputArray={outputArray}
        />
      </div>

      {/* Algorithm Info */}
      <div className="max-w-4xl mx-auto mt-12">
        <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
          <h2 className="text-2xl font-bold mb-4">How Merge Sort Tree Works</h2>
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">🔽 Phase 1: Divide (Top → Down)</h3>
              <p>The algorithm recursively divides the array into halves, creating a tree structure. Each level shows smaller subarrays until we reach single elements at the bottom (leaf nodes).</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">🔼 Phase 2: Merge (Bottom → Up)</h3>
              <p>Starting from the leaf nodes, sibling arrays are compared and merged into sorted parent arrays. This continues upward until the root contains the fully sorted array.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">🏁 Final Result</h3>
              <p>The visualization ends with a clean comparison showing the original unsorted input transformed into the sorted output.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Time Complexity</h3>
              <p>• Best Case: O(n log n)</p>
              <p>• Average Case: O(n log n)</p>
              <p>• Worst Case: O(n log n)</p>
              <p>• Space Complexity: O(n)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MergeSortPage;

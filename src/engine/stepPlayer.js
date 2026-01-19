import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

export const useStepPlayer = (steps, speed = 1000) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);
  const stepsRef = useRef(steps);
  
  // Update steps ref when steps change
  useEffect(() => {
    stepsRef.current = steps;
  }, [steps]);

  useEffect(() => {
    if (isPlaying && currentStep < stepsRef.current.length - 1) {
      intervalRef.current = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
    } else if (currentStep >= stepsRef.current.length - 1) {
      setIsPlaying(false);
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [isPlaying, currentStep, speed]);

  const play = useCallback(() => {
    if (currentStep >= stepsRef.current.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
  }, [currentStep]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const stepForward = useCallback(() => {
    if (currentStep < stepsRef.current.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep]);

  const stepBackward = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  const goToStep = useCallback((step) => {
    setCurrentStep(Math.max(0, Math.min(step, stepsRef.current.length - 1)));
  }, []);

  // Memoize controls object to prevent unnecessary re-renders
  const controls = useMemo(() => ({
    play,
    pause,
    stepForward,
    stepBackward,
    reset,
    goToStep,
  }), [play, pause, stepForward, stepBackward, reset, goToStep]);

  // Memoize current step data
  const currentStepData = useMemo(() => steps[currentStep] || null, [steps, currentStep]);

  return {
    currentStep,
    isPlaying,
    currentStepData,
    totalSteps: steps.length,
    controls,
  };
};

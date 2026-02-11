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
    setCurrentStep(prev => {
      if (prev >= stepsRef.current.length - 1) {
        return 0;
      }
      return prev;
    });
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const stepForward = useCallback(() => {
    setCurrentStep(prev => {
      if (prev < stepsRef.current.length - 1) {
        return prev + 1;
      }
      return prev;
    });
  }, []);

  const stepBackward = useCallback(() => {
    setCurrentStep(prev => {
      if (prev > 0) {
        return prev - 1;
      }
      return prev;
    });
  }, []);

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

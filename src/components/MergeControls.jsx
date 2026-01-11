import React from 'react';

const MergeControls = ({
  array,
  isPlaying,
  isPaused,
  isAnimating,
  currentStepIndex,
  totalSteps,
  speed,
  onGenerateArray,
  onStart,
  onPause,
  onResume,
  onStep,
  onReset,
  onSpeedChange
}) => {
  const handleArraySizeChange = (size) => {
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 99) + 1);
    onGenerateArray(newArray);
  };

  const getSpeedLabel = (speed) => {
    if (speed < 300) return 'Very Fast';
    if (speed < 600) return 'Fast';
    if (speed < 1000) return 'Normal';
    if (speed < 1500) return 'Slow';
    return 'Very Slow';
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gray-800/50 rounded-lg border border-gray-700">
      {/* Array Generation Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Array Setup</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleArraySizeChange(4)}
            disabled={isAnimating}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Generate (4)
          </button>
          <button
            onClick={() => handleArraySizeChange(6)}
            disabled={isAnimating}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Generate (6)
          </button>
          <button
            onClick={() => handleArraySizeChange(8)}
            disabled={isAnimating}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Generate (8)
          </button>
          <button
            onClick={() => handleArraySizeChange(10)}
            disabled={isAnimating}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Generate (10)
          </button>
        </div>
        
        {/* Current Array Display */}
        <div className="mt-4 p-3 bg-gray-900/50 rounded-lg border border-gray-600">
          <div className="text-sm text-gray-400 mb-2">Current Array:</div>
          <div className="flex gap-2 flex-wrap">
            {array.map((value, index) => (
              <div
                key={index}
                className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded font-semibold text-sm"
              >
                {value}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animation Controls */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Animation Controls</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onStart}
            disabled={isAnimating || array.length === 0}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
          >
            ▶️ Start
          </button>
          
          {isPlaying && (
            <button
              onClick={onPause}
              className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors font-semibold"
            >
              ⏸️ Pause
            </button>
          )}
          
          {isPaused && (
            <button
              onClick={onResume}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold"
            >
              ▶️ Resume
            </button>
          )}
          
          <button
            onClick={onStep}
            disabled={isPlaying || array.length === 0}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
          >
            ⏭️ Step
          </button>
          
          <button
            onClick={onReset}
            disabled={array.length === 0}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Speed Control */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Animation Speed</h3>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">Slow</span>
          <input
            type="range"
            min="100"
            max="2000"
            step="100"
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((2000 - speed) / 1900) * 100}%, #374151 ${((2000 - speed) / 1900) * 100}%, #374151 100%)`
            }}
          />
          <span className="text-sm text-gray-400">Fast</span>
        </div>
        <div className="mt-2 text-center">
          <span className="text-sm font-medium text-blue-400">{getSpeedLabel(speed)} ({speed}ms)</span>
        </div>
      </div>

      {/* Progress Indicator */}
      {totalSteps > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Progress</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStepIndex / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="text-sm text-gray-400 font-mono">
              Step {currentStepIndex} / {totalSteps}
            </div>
          </div>
        </div>
      )}

      {/* Status Indicator */}
      <div className="mt-6 flex items-center justify-center">
        <div className={`px-4 py-2 rounded-full text-sm font-medium ${
          isPlaying 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : isPaused 
            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
            : isAnimating
            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            : 'bg-gray-600/20 text-gray-400 border border-gray-500/30'
        }`}>
          {isPlaying ? '🟢 Playing' : isPaused ? '🟡 Paused' : isAnimating ? '🔵 Processing' : '⚪ Ready'}
        </div>
      </div>
    </div>
  );
};

export default MergeControls;

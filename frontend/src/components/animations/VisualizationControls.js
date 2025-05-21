import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const VisualizationControls = ({
  currentState,
  totalStates,
  isPlaying,
  playbackSpeed,
  onPlay,
  onPause,
  onStep,
  onReset,
  onSpeedChange,
  className
}) => {
  const [speedOptions] = useState([
    { label: '0.5x', value: 2000 },
    { label: '1x', value: 1000 },
    { label: '1.5x', value: 750 },
    { label: '2x', value: 500 }
  ]);

  // Button hover animation
  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  // Progress bar animation
  const progress = (currentState / (totalStates - 1)) * 100;

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-lg p-4 ${className}`}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      {/* Progress Bar */}
      <div className="relative h-2 bg-gray-200 rounded-full mb-4">
        <motion.div
          className="absolute left-0 top-0 h-full bg-blue-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex items-center justify-between">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <motion.button
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={onReset}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </motion.button>

          <motion.button
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={isPlaying ? onPause : onPlay}
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </motion.button>

          <motion.button
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => onStep(1)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>

        {/* Speed Control */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Speed:</span>
          <select
            className="bg-gray-100 rounded-lg px-2 py-1 text-sm"
            value={playbackSpeed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
          >
            {speedOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* State Counter */}
        <div className="text-sm text-gray-500">
          Step {currentState + 1} of {totalStates}
        </div>
      </div>
    </motion.div>
  );
};

export default VisualizationControls; 
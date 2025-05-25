'use client';

import React from 'react';

const ProgressBar = ({ 
  value = 0, 
  max = 100, 
  label,
  showPercentage = true,
  animated = false,
  variant = 'primary',
  className = '',
  ...props 
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const containerClasses = [
    'progress',
    className
  ].filter(Boolean).join(' ');

  const barClasses = [
    'progress-bar',
    animated ? 'progress-bar-animated' : '',
    variant !== 'primary' ? `progress-bar-${variant}` : ''
  ].filter(Boolean).join(' ');

  return (
    <div className="flex flex-col gap-2">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-sm">
          {label && (
            <span className="color-text-secondary">
              {label}
            </span>
          )}
          
          {showPercentage && (
            <span className="color-text-secondary">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <div 
        className={containerClasses}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        {...props}
      >
        <div 
          className={barClasses}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar; 
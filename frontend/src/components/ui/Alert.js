'use client';

import React from 'react';

const Alert = ({ 
  children, 
  variant = 'info',
  className = '',
  onClose,
  title,
  ...props 
}) => {
  const classes = [
    'alert',
    `alert-${variant}`,
    className
  ].filter(Boolean).join(' ');

  const getIcon = () => {
    switch (variant) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  const getAriaLabel = () => {
    switch (variant) {
      case 'success':
        return 'Success message';
      case 'error':
        return 'Error message';
      case 'warning':
        return 'Warning message';
      case 'info':
      default:
        return 'Information message';
    }
  };

  return (
    <div 
      className={classes} 
      role="alert"
      aria-label={getAriaLabel()}
      {...props}
    >
      <div className="flex items-center gap-2">
        <span className="flex-shrink-0" aria-hidden="true">
          {getIcon()}
        </span>
        
        <div className="flex-1">
          {title && (
            <div className="font-medium mb-1">
              {title}
            </div>
          )}
          
          <div>
            {children}
          </div>
        </div>
        
        {onClose && (
          <button
            type="button"
            className="btn-ghost btn-sm flex-shrink-0"
            onClick={onClose}
            aria-label="Close alert"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert; 
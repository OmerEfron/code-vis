'use client';

import React from 'react';

const Input = React.forwardRef(({
  label,
  error,
  helperText,
  id,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;

  const inputClasses = [
    'input',
    error ? 'input-error' : '',
    className
  ].filter(Boolean).join(' ');

  const containerClasses = [
    'input-group',
    containerClassName
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="input-label"
        >
          {label}
        </label>
      )}
      
      <input
        ref={ref}
        id={inputId}
        className={inputClasses}
        aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      />
      
      {error && (
        <span 
          id={errorId}
          className="input-error-message"
          role="alert"
        >
          {error}
        </span>
      )}
      
      {helperText && !error && (
        <span 
          id={helperId}
          className="text-sm color-text-secondary"
        >
          {helperText}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 
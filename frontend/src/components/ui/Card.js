'use client';

import React from 'react';

const Card = ({ 
  children, 
  className = '',
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-lg border border-gray-200 shadow-sm';
  const classes = [baseClasses, className].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ 
  children, 
  className = '',
  ...props 
}) => {
  const baseClasses = 'px-6 py-4 border-b border-gray-200';
  const classes = [baseClasses, className].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

const CardBody = ({ 
  children, 
  className = '',
  ...props 
}) => {
  const baseClasses = 'px-6 py-4';
  const classes = [baseClasses, className].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

const CardFooter = ({ 
  children, 
  className = '',
  ...props 
}) => {
  const baseClasses = 'px-6 py-4 border-t border-gray-200 bg-gray-50';
  const classes = [baseClasses, className].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

const CardTitle = ({ 
  children, 
  className = '',
  as: Component = 'h3',
  ...props 
}) => {
  const baseClasses = 'text-lg font-semibold text-gray-900';
  const classes = [baseClasses, className].filter(Boolean).join(' ');

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};

const CardSubtitle = ({ 
  children, 
  className = '',
  as: Component = 'p',
  ...props 
}) => {
  const baseClasses = 'text-sm text-gray-600 mt-1';
  const classes = [baseClasses, className].filter(Boolean).join(' ');

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;

export { Card };
export default Card; 
'use client';

import React from 'react';

const Card = ({ 
  children, 
  className = '',
  ...props 
}) => {
  const classes = [
    'card',
    className
  ].filter(Boolean).join(' ');

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
  const classes = [
    'card-header',
    className
  ].filter(Boolean).join(' ');

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
  const classes = [
    'card-body',
    className
  ].filter(Boolean).join(' ');

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
  const classes = [
    'card-footer',
    className
  ].filter(Boolean).join(' ');

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
  const classes = [
    'card-title',
    className
  ].filter(Boolean).join(' ');

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
  const classes = [
    'card-subtitle',
    className
  ].filter(Boolean).join(' ');

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

export default Card; 
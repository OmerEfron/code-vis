import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const AnimatedElement = ({
  element,
  index,
  state,
  metaphor,
  isActive,
  isTarget,
  isChecked,
  onElementClick,
  style
}) => {
  const [animationState, setAnimationState] = useState('idle');
  const [isHovered, setIsHovered] = useState(false);
  
  // Get metaphor-specific styling
  const getMetaphorStyle = () => {
    const { colorScheme } = metaphor.visualProperties;
    return {
      backgroundColor: isTarget ? colorScheme.highlight : 
                      isActive ? colorScheme.secondary :
                      isChecked ? colorScheme.primary + '80' : // 80 for opacity
                      colorScheme.primary,
      border: isActive ? `2px solid ${colorScheme.highlight}` : 'none',
      boxShadow: isHovered ? '0 8px 16px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.05)',
      ...style
    };
  };

  // Enhanced animation variants
  const variants = {
    idle: { 
      scale: 1,
      rotate: 0
    },
    active: { 
      scale: 1.1,
      rotate: [0, 2, -2, 0],
      transition: { 
        duration: 0.3,
        rotate: {
          repeat: Infinity,
          duration: 0.5
        }
      }
    },
    checked: {
      scale: 1,
      opacity: 0.8,
      transition: { duration: 0.2 }
    },
    target: {
      scale: 1.15,
      boxShadow: '0px 0px 8px rgba(255, 0, 0, 0.5)',
      transition: { 
        scale: { duration: 0.5, repeat: Infinity, repeatType: 'reverse' },
        boxShadow: { duration: 0.5, repeat: Infinity, repeatType: 'reverse' }
      }
    },
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10
      }
    }
  };

  // Update animation state based on props
  useEffect(() => {
    if (isTarget) setAnimationState('target');
    else if (isActive) setAnimationState('active');
    else if (isChecked) setAnimationState('checked');
    else setAnimationState('idle');
  }, [isTarget, isActive, isChecked]);

  // Element details popup
  const ElementDetails = () => (
    <motion.div
      className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
    >
      <div className="font-medium">{element.type}</div>
      <div className="text-xs opacity-80">Value: {element.value}</div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 
                    border-8 border-transparent border-t-gray-800" />
    </motion.div>
  );

  return (
    <motion.div
      className="relative p-4 rounded-lg cursor-pointer"
      style={getMetaphorStyle()}
      variants={variants}
      animate={animationState}
      whileHover="hover"
      whileTap={{ scale: 0.95 }}
      onClick={() => onElementClick?.(element, index)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      layout
    >
      <motion.div 
        className="text-center relative"
        animate={{
          scale: isActive ? [1, 1.1, 1] : 1,
          transition: { duration: 0.3 }
        }}
      >
        <div className="font-medium">{element.value}</div>
        <div className="text-sm opacity-80">{element.description}</div>
        
        {/* Status indicators */}
        <div className="absolute -top-2 -right-2 flex gap-1">
          {isTarget && (
            <motion.div
              className="bg-red-500 w-3 h-3 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          )}
          {isActive && (
            <motion.div
              className="bg-blue-500 w-3 h-3 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: 0.25 }}
            />
          )}
        </div>
      </motion.div>

      {/* Element index badge */}
      {state.metrics && (
        <motion.div
          className="absolute -top-2 -left-2 bg-gray-800 text-white rounded-full w-6 h-6 
                     flex items-center justify-center text-xs font-medium"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        >
          {index + 1}
        </motion.div>
      )}

      {/* Hover details */}
      <AnimatePresence>
        {isHovered && <ElementDetails />}
      </AnimatePresence>
    </motion.div>
  );
};

export default AnimatedElement; 
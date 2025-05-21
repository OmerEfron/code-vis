import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import AnimatedElement from './AnimatedElement';

const VisualizationContainer = ({
  states,
  currentState,
  metaphor,
  onElementClick,
  className
}) => {
  const [layout, setLayout] = useState({ type: 'horizontal', gap: 16 });
  const [showMetrics, setShowMetrics] = useState(true);
  
  // Update layout based on metaphor
  useEffect(() => {
    if (metaphor?.visualProperties?.layout) {
      setLayout({
        type: metaphor.visualProperties.layout.type.toLowerCase(),
        gap: metaphor.visualProperties.layout.gap || 16,
      });
    }
  }, [metaphor]);

  // Container variants for different layouts
  const containerVariants = {
    horizontal: {
      display: 'flex',
      flexDirection: 'row',
      gap: layout.gap,
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem'
    },
    vertical: {
      display: 'flex',
      flexDirection: 'column',
      gap: layout.gap,
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: '2rem'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: layout.gap,
      padding: '2rem'
    },
    circle: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
      gap: layout.gap,
      padding: '2rem',
      borderRadius: '50%',
      placeItems: 'center'
    },
    pyramid: {
      display: 'flex',
      flexDirection: 'column',
      gap: layout.gap,
      alignItems: 'center',
      padding: '2rem'
    },
    spiral: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
      gap: layout.gap,
      padding: '2rem',
      transform: 'rotate(0deg)'
    }
  };

  // Animation for state transitions
  const stateTransition = {
    type: 'spring',
    stiffness: 200,
    damping: 20
  };

  // Enhanced metrics display
  const renderMetrics = (state) => {
    const { metrics } = state;
    const metricItems = [
      { label: 'Step', value: `${currentState + 1}/${states.length}` },
      { label: 'Comparisons', value: metrics.comparisons },
      { label: 'Checked', value: metrics.checked },
      { label: 'Progress', value: `${Math.round(metrics.progress)}%` },
      { label: 'Target', value: metrics.target },
      { label: 'Current Phase', value: metrics.currentPhase || 'Searching' }
    ];

    return (
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-90 text-white p-4"
        initial={{ y: 100 }}
        animate={{ y: showMetrics ? 0 : 80 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="flex justify-between items-center">
          <motion.button
            className="absolute -top-4 right-4 bg-gray-700 rounded-full p-1"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowMetrics(!showMetrics)}
          >
            <svg
              className="w-4 h-4 transform transition-transform"
              style={{ transform: showMetrics ? 'rotate(180deg)' : 'rotate(0deg)' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.button>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 w-full">
            {metricItems.map((item, index) => (
              <motion.div
                key={item.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-gray-400 text-xs">{item.label}</div>
                <div className="font-medium">{item.value}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  // Get layout style based on type
  const getLayoutStyle = () => {
    switch (layout.type) {
      case 'circle':
        return {
          ...containerVariants.circle,
          transform: `rotate(${360 / (state?.elements?.length || 1)}deg)`
        };
      case 'pyramid':
        return {
          ...containerVariants.pyramid,
          '& > *': {
            marginLeft: `${currentState * 20}px`
          }
        };
      case 'spiral':
        return {
          ...containerVariants.spiral,
          transform: `rotate(${currentState * 30}deg)`
        };
      default:
        return containerVariants[layout.type] || containerVariants.horizontal;
    }
  };

  const state = states[currentState];
  if (!state || !metaphor) return null;

  return (
    <motion.div
      className={`relative bg-white rounded-xl shadow-lg overflow-hidden ${className}`}
      initial={false}
      animate={layout.type}
      style={getLayoutStyle()}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30
      }}
    >
      <AnimatePresence mode="popLayout">
        {state.elements.map((element, index) => (
          <AnimatedElement
            key={`${element.id}-${index}`}
            element={element}
            index={index}
            state={state}
            metaphor={metaphor}
            isActive={element.current}
            isTarget={element.isTarget}
            isChecked={element.checked}
            onElementClick={onElementClick}
            style={{
              width: layout.type === 'grid' ? '100%' : 'auto',
              minWidth: '100px',
              transform: layout.type === 'circle' 
                ? `rotate(-${360 / state.elements.length}deg)`
                : layout.type === 'spiral'
                ? `rotate(-${currentState * 30}deg)`
                : 'none'
            }}
          />
        ))}
      </AnimatePresence>

      {renderMetrics(state)}
    </motion.div>
  );
};

export default VisualizationContainer; 
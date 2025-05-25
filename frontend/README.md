# Algorithm Visualization Frontend

The frontend application for the Algorithm Visualization project, built with Next.js and React. This application provides an interactive interface for visualizing algorithms through educational metaphors.

## ✨ Features

- 🎨 Interactive algorithm visualization using React-Konva and Framer Motion
- 🎯 Metaphor-based learning with customizable visual representations
- 🔄 Step-by-step visualization with playback controls
- 📊 Real-time algorithm metrics and complexity analysis
- 🎭 Multiple learning styles with tailored visualizations
- 🌗 Responsive design with accessibility features

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **UI Library**: React 19
- **Visualization**: React-Konva for canvas-based visualizations
- **Animation**: Framer Motion for smooth transitions
- **Styling**: TailwindCSS for component styling
- **HTTP Client**: Axios for API communication
- **Schema Validation**: Ajv for data validation

## 📁 Project Structure
frontend/
├── public/ # Static assets
├── src/
│ ├── api/ # API client and service functions
│ │ └── axios.js # Configured Axios instance with interceptors
│ ├── app/ # Next.js app directory
│ │ ├── globals.css # Global CSS styles
│ │ ├── layout.js # Root layout component
│ │ └── page.js # Main page component
│ ├── components/ # React components
│ │ ├── animations/ # Animation-specific components
│ │ │ ├── AnimatedElement.js # Individual animated elements
│ │ │ ├── VisualizationContainer.js # Container for visualizations
│ │ │ └── VisualizationControls.js # Playback controls
│ │ ├── common/ # Shared utility components
│ │ │ └── ErrorBoundary.js # Error handling component
│ │ ├── ui/ # Reusable UI components
│ │ │ ├── Alert.js # Alert messages
│ │ │ ├── Button.js # Button component
│ │ │ ├── Card.js # Card container
│ │ │ ├── Input.js # Form inputs
│ │ │ └── ProgressBar.js # Progress indicators
│ │ ├── AlgorithmVisualization.js # Main visualization component
│ │ ├── CodeAnalyzer.js # Code analysis component
│ │ ├── CodeInput.js # Code input component
│ │ ├── MetaphorSelector.js # Metaphor selection component
│ │ └── ScenarioSelect.js # Scenario selection component
│ ├── config/ # Configuration files
│ │ └── environment.js # Environment configuration
│ ├── hooks/ # Custom React hooks
│ │ └── useVisualization.js # Visualization state management
│ ├── schemas/ # JSON schema validation
│ │ ├── analysisSchema.json # API response schema
│ │ └── validateSchema.js # Schema validation functions
│ ├── styles/ # CSS styling
│ │ ├── components.css # Component-specific styles
│ │ └── design-tokens.css # Design system variables
│ └── utils/ # Utility functions
│ └── visualizationParser.js # Parsing visualization data
└── next.config.mjs # Next.js configuration


## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend server running on port 3000

### Installation

1. Clone the repository and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (optional):
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3001](http://localhost:3001) in your browser

## 📝 Available Scripts

- `npm run dev` - Start development server on port 3001
- `npm run build` - Build for production
- `npm start` - Start production server on port 3001
- `npm run lint` - Run ESLint for code quality

## 🧩 Component Documentation

### AlgorithmVisualization

The main component responsible for rendering algorithm visualizations. It provides:
- Dynamic visualization of algorithm steps based on metaphors
- Support for different algorithm types (sorting, searching, etc.)
- Interactive playback controls (play, pause, step, reset)
- Real-time metrics display (comparisons, time complexity, etc.)
- Animated transitions between algorithm states
- Customizable animation speed and visualization style

### CodeAnalyzer

Handles the core application logic:
- Code input and validation
- Integration with backend analysis service via API
- Metaphor selection and management
- Visualization state management
- Error handling and user feedback
- Example code loading

### MetaphorSelector

Provides a user interface for selecting visualization metaphors:
- Visual cards for each available metaphor
- Different learning style options (visual, auditory, kinesthetic)
- Preview of metaphor elements and properties
- Accessibility features for keyboard navigation

### Animations Components

A collection of components that handle the rendering of animated visualizations:
- `AnimatedElement`: Renders individual elements in the visualization
- `VisualizationContainer`: Manages the layout and display of elements
- `VisualizationControls`: Provides playback controls for animations

### UI Components

Reusable UI components following a consistent design system:
- `Alert`: For notifications and error messages
- `Button`: Stylized buttons with variants
- `Card`: Content containers with headers and footers
- `Input`: Form input fields
- `ProgressBar`: Visual indicators for progress and loading

## 🎨 Styling

The application uses a combination of TailwindCSS and custom CSS:
- Design tokens for consistent theming (colors, spacing, typography)
- Responsive layouts for mobile and desktop
- Dark/light mode support
- Animation and transition utilities
- Accessibility enhancements

## 🔄 API Integration

The frontend communicates with the backend server to:
- Analyze algorithm code
- Generate metaphor-based visualizations
- Retrieve example algorithms
- Fetch available visualization scenarios

## 📊 Development Guidelines

1. Follow the existing code style and component patterns
2. Use the established design system for UI consistency
3. Write meaningful commit messages
4. Add appropriate comments and documentation
5. Test your changes across different browsers and screen sizes
6. Update this README when adding new features


## 📋 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
# Algorithm Visualization Frontend

The frontend application for the Algorithm Visualization project, built with Next.js and React.

## Features

- 🎨 Interactive algorithm visualization using React-Konva
- 🎯 Metaphor-based learning interface
- 🔄 Step-by-step visualization controls
- 📊 Real-time metrics display
- 🎭 Multiple visualization styles based on learning preferences

## Tech Stack

- Next.js 14
- React 18
- React-Konva for canvas-based visualizations
- TailwindCSS for styling
- WebSocket client for real-time updates

## Directory Structure

```
src/
├── app/                    # Next.js app directory
│   └── page.js            # Main page component
├── components/            # React components
│   ├── AlgorithmVisualization.js  # Main visualization component
│   ├── CodeAnalyzer.js    # Code analysis component
│   ├── CodeInput.js       # Code input component
│   └── MetaphorSelector.js # Metaphor selection component
├── constants/             # Shared constants and examples
│   └── exampleAnalysis.js # Example algorithm analysis
└── styles/               # Global styles and Tailwind config
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## Component Documentation

### AlgorithmVisualization

The main component responsible for rendering algorithm visualizations. It supports:
- Multiple metaphor-based visualizations
- Interactive playback controls
- Real-time metrics display
- Customizable animation speed

### CodeAnalyzer

Handles code analysis and visualization generation:
- Code input and validation
- Integration with backend analysis service
- Metaphor selection
- Visualization state management

### MetaphorSelector

Allows users to choose different metaphors for visualization:
- Multiple learning style options
- Preview of metaphor elements
- Customization options

## Development Guidelines

1. Follow the existing code style and formatting
2. Write meaningful commit messages
3. Add appropriate comments and documentation
4. Test your changes thoroughly
5. Update this README when adding new features

## Contributing

See the main project README for contribution guidelines.

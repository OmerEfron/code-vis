# Algorithm Visualization Project

An interactive web application for visualizing and understanding algorithms through metaphor-based learning. This project uses AI to analyze algorithms and create intuitive visualizations that help users understand complex algorithms through familiar real-world metaphors.

## ✨ Features

- 🤖 **AI-Powered Analysis**: Uses OpenAI GPT models to analyze algorithm code and identify patterns
- 🎨 **Metaphor-Based Visualization**: Dynamic visualization of algorithms using relatable real-world metaphors
- 🔄 **Interactive Learning**: Step-by-step visualization with playback controls
- 🧠 **Multiple Learning Styles**: Support for visual, kinesthetic, and auditory learning styles
- 📊 **Real-Time Metrics**: Live display of algorithm complexity and performance characteristics
- 🌐 **Extensible Architecture**: Modular design supporting multiple algorithm types and LLM providers

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15
- **UI Library**: React 19
- **Visualization**: React-Konva for canvas-based visualizations
- **Animation**: Framer Motion for smooth transitions
- **Styling**: TailwindCSS for component styling
- **HTTP Client**: Axios for API communication

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **AI Integration**: OpenAI API (GPT-4)
- **Validation**: AJV (JSON Schema validation)
- **Security**: CORS, rate limiting, input sanitization
- **Development**: Nodemon for hot reload

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key (for code analysis features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/OmerEfron/code-vis.git
cd code-vis
```

2. Install dependencies for both frontend and backend:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables:

**Backend Configuration:**
```bash
# In backend directory
cp .env.example .env
# Edit .env and add your configuration:
# - OPENAI_API_KEY: Your OpenAI API key (required)
# - PORT: Backend server port (default: 3000)
# - FRONTEND_URL: Frontend URL for CORS (default: http://localhost:3001)
# - RATE_LIMIT_WINDOW_MS: Rate limit window (default: 900000 ms)
# - RATE_LIMIT_MAX_REQUESTS: Max requests per window (default: 100)
# - NODE_ENV: Environment mode (default: development)
```

**Frontend Configuration:**
```bash
# In frontend directory
cp .env.example .env.local
# Edit .env.local and add your configuration:
# - NEXT_PUBLIC_BACKEND_URL: Backend API URL (default: http://localhost:3000)
```

4. Start the development servers:
```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend server (from frontend directory)
npm run dev
```

5. Open your browser and navigate to `http://localhost:3001`

## 📁 Project Structure
code-vis/
├── frontend/ # Next.js frontend application
│ ├── public/ # Static assets
│ ├── src/
│ │ ├── api/ # API client configuration
│ │ ├── app/ # Next.js app directory
│ │ ├── components/ # React components
│ │ │ ├── animations/ # Animation components
│ │ │ ├── common/ # Shared components
│ │ │ └── ui/ # UI component library
│ │ ├── config/ # Configuration files
│ │ ├── hooks/ # Custom React hooks
│ │ ├── schemas/ # JSON schema validation
│ │ ├── styles/ # CSS styling
│ │ └── utils/ # Utility functions
│ ├── next.config.mjs # Next.js configuration
│ └── README.md # Frontend documentation
├── backend/ # Node.js backend server
│ ├── src/
│ │ ├── controllers/ # Request handlers
│ │ ├── data/ # Stored examples
│ │ ├── middleware/ # Express middleware
│ │ ├── models/ # Algorithm models
│ │ ├── parsers/ # Code parsing utilities
│ │ ├── routes/ # API route definitions
│ │ ├── schemas/ # JSON schemas and validation
│ │ ├── services/ # Core business services
│ │ │ ├── examples/ # Example management
│ │ │ └── llm/ # LLM integration services
│ │ └── server.js # Application entry point
│ ├── package.json # Dependencies and scripts
│ └── README.md # Backend documentation
└── README.md # This file


## 🧩 Key Components

### Backend Components

- **LLM Integration**: Factory pattern for multiple AI providers
- **Code Analysis**: Intelligent parsing and analysis of algorithm code
- **Metaphor Generation**: Creation of educational metaphors for visualization
- **Example Management**: Storage and retrieval of algorithm examples
- **Visualization Generation**: Step-by-step algorithm state generation

### Frontend Components

- **AlgorithmVisualization**: Main visualization renderer with interactive controls
- **CodeAnalyzer**: Code input, analysis, and visualization management
- **MetaphorSelector**: UI for selecting different visualization metaphors
- **Animation Components**: Specialized components for animated visualizations
- **UI Component Library**: Reusable UI components with consistent design

## 🔄 API Integration

The application provides several API endpoints:

- **Code Analysis**: `POST /api/analyze` - Analyzes algorithm code and generates metaphors
- **Visualization**: `POST /api/visualization/generate` - Creates step-by-step visualizations
- **Examples**: `GET /api/examples` - Retrieves saved algorithm examples
- **Scenarios**: `GET /api/visualization/scenarios` - Returns available visualization scenarios

## 📊 Development Guidelines

1. Follow the existing code style and component patterns
2. Use the established design system for UI consistency
3. Add appropriate error handling and input validation
4. Write meaningful commit messages
5. Test changes thoroughly before submitting
6. Update documentation when adding new features

## 🔒 Security Considerations

- Environment variables for sensitive configuration
- Input validation and sanitization
- Rate limiting to prevent abuse
- CORS configuration for controlled access
- Error handling without sensitive information exposure

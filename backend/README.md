# Algorithm Visualization Backend

The backend server for the Algorithm Visualization project, providing code analysis and metaphor generation services.

## Features

- 🤖 AI-powered code analysis using OpenAI
- 🎯 Algorithm pattern recognition
- 🎨 Metaphor generation for different learning styles
- 🔄 Real-time updates via WebSocket
- 📊 Performance metrics calculation

## Tech Stack

- Node.js
- Express.js
- OpenAI API
- WebSocket (ws)
- dotenv for configuration

## Directory Structure

```
src/
├── routes/                # API route definitions
│   └── llmAnalysisRoutes.js  # LLM analysis endpoints
├── services/             # Business logic and services
│   ├── llm/             # LLM-related services
│   │   ├── analyzers/   # Code analysis modules
│   │   ├── factory.js   # LLM provider factory
│   │   └── providers/   # LLM service providers
│   └── metrics/         # Performance metrics
└── server.js            # Server entry point
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env and add your OpenAI API key
```

3. Start the development server:
```bash
npm run dev
```

The server will start on port 3001 by default.

## Environment Variables

Create a `.env` file with the following variables:

```env
PORT=3001
OPENAI_API_KEY=your_api_key_here
NODE_ENV=development
```

## API Endpoints

### Code Analysis

- `POST /api/analyze`
  - Analyzes code and generates visualization metadata
  - Request body: `{ code: string }`
  - Response: Analysis results including metaphors and visualization states

### WebSocket Events

- `connection`: Client connected
- `analyze`: Receive code for analysis
- `analysis_complete`: Send analysis results
- `error`: Send error information

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## Development Guidelines

1. Follow RESTful API design principles
2. Add appropriate error handling
3. Use async/await for asynchronous operations
4. Keep the code modular and maintainable
5. Add logging for important operations
6. Write meaningful comments and documentation

## Error Handling

The backend implements a centralized error handling system:

```javascript
{
  success: boolean,
  error?: {
    message: string,
    code: string,
    details?: any
  },
  data?: any
}
```

## Contributing

See the main project README for contribution guidelines. 
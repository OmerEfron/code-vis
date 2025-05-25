# Algorithm Visualization Backend

A powerful backend service for analyzing code algorithms and generating educational metaphors and visualizations using AI. This service provides intelligent code analysis, metaphor generation, and visualization data to help students understand complex algorithms through intuitive visual representations.

## 🚀 Features

- **🤖 AI-Powered Code Analysis**: Uses OpenAI GPT models to analyze algorithm code and identify patterns
- **📚 Algorithm Detection**: Automatically detects algorithm types, categories, and complexity
- **🎨 Metaphor Generation**: Creates educational metaphors tailored to different learning styles
- **📊 Schema Validation**: Ensures consistent and reliable analysis output format
- **💾 Example Management**: Saves and retrieves analysis examples for reuse
- **🔧 Extensible Architecture**: Modular design supporting multiple LLM providers
- **⚡ RESTful API**: Clean, well-documented endpoints for frontend integration

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **AI Integration**: OpenAI API (GPT-4)
- **Validation**: AJV (JSON Schema validation)
- **Cross-Origin**: CORS support
- **Environment**: dotenv for configuration
- **Development**: Nodemon for hot reload

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/           # Request handlers and business logic
│   │   └── visualizationController.js
│   ├── data/
│   │   └── examples/         # Saved analysis examples (JSON files)
│   ├── models/              # Algorithm models and data structures
│   │   └── Algorithm.js     # Base algorithm classes
│   ├── parsers/             # Code parsing utilities
│   │   └── cParser.js       # C language parser
│   ├── routes/              # API route definitions
│   │   ├── exampleRoutes.js      # Example management endpoints
│   │   ├── llmAnalysisRoutes.js  # Main analysis endpoints
│   │   └── visualizationRoutes.js # Visualization generation
│   ├── schemas/             # JSON schemas and validation
│   │   ├── analysisSchema.json   # Analysis response schema
│   │   └── validateSchema.js     # Validation utilities
│   ├── services/            # Core business services
│   │   ├── examples/
│   │   │   └── exampleManager.js # Example CRUD operations
│   │   └── llm/            # LLM integration services
│   │       ├── analyzers/
│   │       │   └── codeAnalyzer.js # Main code analysis logic
│   │       ├── factory.js          # LLM provider factory
│   │       └── providers/          # LLM service providers
│   │           ├── base.js         # Abstract base provider
│   │           └── openai.js       # OpenAI implementation
│   └── server.js           # Application entry point
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your configuration:
   ```env
   PORT=3000
   OPENAI_API_KEY=your_openai_api_key_here
   NODE_ENV=development
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000` (or your configured PORT).

## 📚 API Documentation

### Code Analysis

#### `POST /api/analyze`
Analyzes code and generates educational metaphors and visualization data.

**Request Body:**
```json
{
  "code": "your_algorithm_code_here"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "algorithm": {
      "algorithmType": "Binary Search",
      "category": "Searching",
      "timeComplexity": "O(log n)",
      "spaceComplexity": "O(1)",
      "explanation": "..."
    },
    "inputs": {
      "inputs": [...],
      "examples": [...]
    },
    "metaphors": [
      {
        "name": "Library Book Search",
        "description": "...",
        "learningStyle": "visual",
        "steps": [...],
        "elements": {...},
        "visualProperties": {...}
      }
    ]
  },
  "visualization": {
    "type": "Binary Search",
    "recommended": {...}
  }
}
```

#### `GET /api/analyze/providers`
Returns available LLM providers.

### Example Management

#### `GET /api/examples`
Retrieves saved analysis examples.

**Query Parameters:**
- `algorithmType` (optional): Filter by algorithm type

#### `GET /api/examples/:id`
Retrieves a specific example by ID.

#### `DELETE /api/examples/:id`
Deletes an example by ID.

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 3000 | No |
| `OPENAI_API_KEY` | OpenAI API key | - | Yes |
| `NODE_ENV` | Environment mode | development | No |

### Schema Validation

The backend uses JSON Schema validation to ensure consistent analysis output. The schema is defined in `src/schemas/analysisSchema.json` and validates:

- Algorithm information (type, complexity, explanation)
- Input specifications and examples
- Metaphor structures with visual properties
- Color schemes and layout information

## 🏗️ Architecture

### LLM Provider System

The backend uses a factory pattern for LLM providers, making it easy to add new AI services:

```javascript
// Current providers
const analyzer = LLMFactory.createAnalyzer({
  provider: 'openai', // Currently supported
  // Future: 'anthropic', 'google', etc.
});
```

### Code Analysis Pipeline

1. **Input Validation**: Validates incoming code requests
2. **Schema-Guided Analysis**: Uses structured prompts with JSON schema
3. **Response Validation**: Validates AI responses against defined schema
4. **Example Storage**: Saves successful analyses for future reference
5. **Visualization Suggestions**: Generates rendering recommendations

### Error Handling

Standardized error responses across all endpoints:

```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error context"
}
```

## 🧪 Available Scripts

```bash
# Start production server
npm start

# Start development server with hot reload
npm run dev

# Run tests
npm test

# Run linting
npm run lint
```

## 🔒 Security Considerations

- Environment variables for sensitive configuration
- Input validation and sanitization
- Schema validation for all data exchanges
- CORS configuration for controlled access
- Error handling without sensitive information exposure

## 🚀 Deployment

### Production Setup

1. Set `NODE_ENV=production`
2. Configure production OpenAI API key
3. Set appropriate PORT for your hosting platform
4. Ensure sufficient memory for AI processing

### Docker Support
(Coming soon - Docker configuration for containerized deployment)

## 🤝 Contributing

1. **Code Style**: Follow existing patterns and naming conventions
2. **Error Handling**: Always return standardized error responses
3. **Documentation**: Update README for new features or API changes
4. **Testing**: Add tests for new functionality
5. **Schema Updates**: Update JSON schemas when changing response structures

### Adding New LLM Providers

1. Create a new provider class extending `BaseLLMProvider`
2. Implement required methods (`initialize`, `analyze`, etc.)
3. Register the provider in `factory.js`
4. Add configuration options and documentation

### Adding New Algorithm Support

1. Create algorithm-specific parsers in `parsers/`
2. Add algorithm models in `models/`
3. Update visualization controller logic
4. Add example scenarios and test cases

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Related Projects

- **Frontend**: React-based visualization interface
- **Schemas**: Shared JSON schemas for data validation

## 📞 Support

For issues, questions, or contributions, please refer to the main project documentation or create an issue in the repository. 
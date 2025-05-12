# Algorithm Visualization Backend

This is the backend service for the Algorithm Visualization project. It provides APIs for parsing algorithm code and generating visualization states based on metaphorical scenarios.

## Project Structure

```
src/
├── server.js              # Main Express server entry point
├── controllers/          # Request handlers
│   └── visualizationController.js
├── models/              # Data models
│   └── Algorithm.js     # Base and specific algorithm implementations
├── parsers/             # Code parsers
│   └── cParser.js       # C code parser
└── routes/              # API routes
    └── visualizationRoutes.js
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. For production:
   ```bash
   npm start
   ```

## API Endpoints

### Generate Visualization
```
POST /api/visualizations/generate
Content-Type: application/json

{
    "code": "// C code here",
    "scenario": {
        "name": "Teacher Organizing Exams",
        "description": "...",
        "metaphor": { ... }
    }
}
```

### Get Available Scenarios
```
GET /api/visualizations/scenarios
```

## Adding New Algorithms

1. Create a new class extending the `Algorithm` base class
2. Implement required methods:
   - `initialize()`
   - `nextState()`
   - `toMetaphorState()`
3. Add detection pattern in `CParser`
4. Register in the algorithm factory in `visualizationController.js`

## Adding New Scenarios

Add new scenario definitions in `visualizationRoutes.js` under the `/scenarios` endpoint. 
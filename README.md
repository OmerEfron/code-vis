# Algorithm Visualization Project

An interactive web application for visualizing and understanding algorithms through metaphor-based learning. This project uses AI to analyze algorithms and create intuitive visualizations that help users understand complex algorithms through familiar real-world metaphors.

## Features

- 🎯 **Algorithm Analysis**: Automatic analysis of algorithm code to identify patterns and complexity
- 🎨 **Metaphor-Based Visualization**: Dynamic visualization of algorithms using relatable real-world metaphors
- 🔄 **Interactive Learning**: Step-by-step visualization with playback controls
- 🧠 **Multiple Learning Styles**: Support for visual, kinesthetic, and auditory learning styles
- 🤖 **AI-Powered**: Utilizes LLM for intelligent code analysis and metaphor generation

## Tech Stack

### Frontend
- Next.js
- React
- React-Konva for canvas-based visualizations
- TailwindCSS for styling

### Backend
- Node.js
- Express
- OpenAI API for code analysis
- WebSocket for real-time updates

## Getting Started

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

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
code-vis/
├── frontend/               # Next.js frontend application
│   ├── src/
│   │   ├── app/           # Next.js app directory
│   │   ├── components/    # React components
│   │   └── constants/     # Shared constants and examples
│   └── public/            # Static assets
├── backend/               # Node.js backend server
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic and services
│   │   └── server.js     # Server entry point
│   └── .env.example      # Example environment variables
└── README.md             # This file
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 
# CodeViz - AI Algorithm Visualizer

An interactive web application for visualizing and understanding algorithms through AI-powered analysis. CodeViz makes complex algorithms accessible by breaking them down into step-by-step visualizations with clear explanations and interactive examples.

## 🚀 Features

- 🌳 **Huffman Encoding Visualization**: Interactive step-by-step visualization of Huffman encoding compression
- 🔍 **AI Code Analysis**: Automatic analysis of algorithm code with complexity insights
- 📖 **Pre-built Examples**: Curated collection of popular algorithms with interactive visualizations
- 🎮 **Interactive Controls**: Play, pause, step through, and adjust speed of visualizations  
- 🎨 **Modern UI**: Beautiful, responsive design with smooth animations
- 🤖 **AI-Powered Insights**: Intelligent algorithm explanations with real-world metaphors

## 📋 Available Algorithms

- **Huffman Encoding** - Text compression algorithm visualization
- **Binary Search** - Efficient searching in sorted arrays
- **Bubble Sort** - Simple comparison-based sorting
- **Fibonacci Sequence** - Dynamic programming approach
- **Quick Sort** - Divide-and-conquer sorting (coming soon)

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with app directory
- **React 18** - UI library with modern hooks
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first CSS framework
- **Custom Design System** - Consistent UI components

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **OpenAI API** - AI-powered code analysis
- **Algorithm Engines** - Custom implementation for step generation

## 🏁 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **OpenAI API key** (for AI analysis features)

### Quick Start

1. **Clone the repository:**
```bash
git clone <repository-url>
cd code-vis-new-feature
```

2. **Setup Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
npm start
```

3. **Setup Frontend:**
```bash
cd ../frontend
npm install
npm run dev
```

4. **Open your browser:**
   - Frontend: `http://localhost:3001`
   - Backend API: `http://localhost:3000`

### Running with Docker

This project is fully containerized and can be run with a single command using Docker Compose.

1.  **Prerequisites:**
    *   [Docker](https://www.docker.com/get-started) installed on your system.
    *   An OpenAI API key.

2.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd codeviz2
    ```

3.  **Configure Environment:**
    Create a `.env` file in the `backend` directory with your OpenAI API key. You can copy the example file if it exists, or create a new one:
    ```bash
    # e.g., echo "OPENAI_API_KEY=your_key_here" > backend/.env
    ```

4.  **Build and Run:**
    ```bash
    docker-compose up --build
    ```
    The `--build` flag is only necessary the first time you run the command, or when you have made changes to the code.

5.  **Access the application:**
    *   **Frontend:** `http://localhost:3001`
    *   **Backend:** `http://localhost:3000`

6.  **Stopping the application:**
    To stop the containers, press `Ctrl+C` in the terminal where `docker-compose` is running, or run the following command from the project root:
    ```bash
    docker-compose down
    ```

### Environment Variables

**Backend (.env):**
```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000
FRONTEND_URL=http://localhost:3001
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
```

## 📁 Project Structure

## 📋 Additional Information

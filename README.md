# Aathif Portfolio

An AI-powered portfolio website showcasing engineering expertise through interactive projects, technologies, and a semantic AI assistant powered by RAG (Retrieval Augmented Generation).

## 🚀 Features

- **Interactive Landing Page** - Animated hero section with interactive network background and AI chat widget
- **AI Assistant** - Semantic search and retrieval-augmented generation using Groq LLM
- **Project Pages** - Detailed project showcase with architecture diagrams, tech stack, challenges, and related technologies
- **Technology Pages** - Technology deep-dives with real-world use cases and related projects  
- **Responsive Design** - Mobile-friendly UI built with React, TypeScript, and Tailwind CSS
- **Real-time Chat** - AI-powered question answering grounded in the knowledge base
- **Network Animation** - Interactive canvas-based background with dynamic node networking

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      React Frontend (Vite)                  │
│         (TypeScript, Tailwind, React Router)                │
│                    Port: 5173 (dev)                         │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP/REST
┌──────────────────────────────▼──────────────────────────────┐
│                     FastAPI Backend                         │
│            (Pydantic, CORS, Route handlers)                 │
│                    Port: 8000                               │
└──────────────────┬────────────────────────┬─────────────────┘
                   │                        │
           ┌───────▼────────┐      ┌────────▼────────────┐
           │  RAG Pipeline  │      │  Routes            │
           │  - Retrieval   │      │  - /api/chat       │
           │  - Chunking    │      │  - /api/projects/* │
           │  - Embedding   │      │  - /health         │
           │  - Generation  │      │                    │
           └───────┬────────┘      └────────────────────┘
                   │
        ┌──────────┴──────────┬──────────────────┐
        │                     │                  │
   ┌────▼──────┐    ┌────────▼────────┐  ┌─────▼────┐
   │  ChromaDB  │    │   Embeddings    │  │  Groq    │
   │  (Vectors) │    │ (all-MiniLM)    │  │  LLM     │
   │            │    │                 │  │          │
   └────────────┘    └─────────────────┘  └──────────┘
```

## 📋 Tech Stack

### Frontend
- **React 18.3** - UI framework
- **TypeScript 5.6** - Type safety
- **Vite 5.4** - Build tool & dev server
- **Tailwind CSS 3.4** - Utility-first styling
- **React Router DOM 6.16** - Client-side routing

### Backend
- **FastAPI 0.141** - REST API framework
- **Pydantic 2.x** - Data validation
- **ChromaDB 1.5** - Vector database for embeddings
- **LangChain** - LLM orchestration
- **Groq API** - LLM inference (openai/gpt-oss-20b)
- **sentence-transformers** - Embeddings (all-MiniLM-L6-v2)
- **httpx** - Async HTTP client
- **pytest** - Testing framework

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Settings & environment variables
│   ├── api/
│   │   ├── routes_chat.py   # Chat endpoint (/api/chat)
│   │   └── routes_project.py # Project endpoints
│   ├── models/
│   │   └── schemas.py       # Pydantic request/response models
│   ├── rag/
│   │   ├── pipeline.py      # Main RAG orchestration
│   │   ├── retriever.py     # Vector search
│   │   ├── embeddings.py    # Embedding model wrapper
│   │   ├── chunking.py      # Text splitting
│   │   ├── generator.py     # Answer generation logic
│   │   ├── generator_client.py # Groq API client
│   │   └── vectorstore.py   # ChromaDB wrapper
│   └── ingestion/
│       ├── loaders.py       # Load markdown files
│       └── build_index.py   # Indexing script
├── knowledge_base/
│   ├── about_me.md
│   ├── resume.md
│   ├── projects/            # Project markdown files
│   └── technologies/        # Technology markdown files
├── tests/
│   ├── test_api.py          # API endpoint tests
│   ├── test_behavior.py     # RAG behavior tests
│   └── test_rag.py          # RAG pipeline tests
├── requirements.txt         # Python dependencies
└── chroma_db/              # ChromaDB database (generated)

frontend/
├── src/
│   ├── pages/
│   │   ├── LandingPage.tsx     # Home page with chat widget
│   │   ├── ProjectPage.tsx     # Project detail view
│   │   ├── TechnologyPage.tsx  # Technology detail view
│   │   └── NotFoundPage.tsx    # 404 page
│   ├── components/
│   │   ├── ai-assistant/       # Chat widget components
│   │   ├── layout/             # Navbar, Footer
│   │   ├── project/            # Project-specific components
│   │   ├── shared/             # Reusable components
│   │   ├── skills/             # Skill cards and grid
│   │   ├── technology/         # Technology page components
│   │   └── animations/         # Reusable animations
│   ├── hooks/
│   │   ├── useChat.ts          # Chat hook with API
│   │   └── useProjectAsk.ts    # Project question hook
│   ├── data/
│   │   ├── projects.ts         # Projects metadata
│   │   ├── skills.ts           # Skills data
│   │   └── technologies.ts     # Technologies metadata
│   ├── types/
│   │   ├── chat.ts
│   │   ├── project.ts
│   │   └── technology.ts
│   └── api/
│       └── client.ts           # Axios-like HTTP client
├── public/                     # Static assets
└── package.json               # Node dependencies
```

## 🧠 RAG Pipeline Explained

The Retrieval Augmented Generation pipeline answers questions about Aathif's portfolio by:

1. **Query Understanding** - Classify intent (greeting, project query, contact, etc.)
2. **Query Normalization** - Rewrite user queries for better retrieval (e.g., "what's Aathif's email" → "What are Aathif Nizam's contact details?")
3. **Retrieval** - Find the top-K most relevant chunks from the vector database using semantic similarity
4. **Ranking** - Prioritize sources by metadata (projects > technologies > resume > contact)
5. **Context Building** - Construct a prompt with retrieved chunks as context
6. **Generation** - Use Groq LLM to generate a natural language answer
7. **Response** - Return answer + source citations

### Knowledge Base Structure

- **Projects** - Detailed documentation of 4+ portfolio projects with architecture, tech stack, and challenges
- **Technologies** - 9 core technologies with explanations and use cases
- **Resume** - Professional background and experience
- **About Me** - Personal background and engineering philosophy
- **Contact Info** - Email and LinkedIn

## 🔧 Local Development

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate (Windows)
.\.venv\Scripts\activate
# Or (macOS/Linux)
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template and configure
cp .env.example .env
# Edit .env and set your GROQ_API_KEY

# Build the vector index from knowledge base
python -m app.ingestion.build_index

# Run tests
pytest tests/ -v

# Start the backend server
uvicorn app.main:app --reload --port 8000
```

Backend will be available at: `http://localhost:8000`

API docs available at: `http://localhost:8000/docs`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Type checking
npx tsc --noEmit
```

Frontend will be available at: `http://localhost:5173`

### Running Both Locally

```bash
# Terminal 1 - Backend
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 🔌 API Endpoints

### Chat Endpoint
```
POST /api/chat
Content-Type: application/json

{
  "question": "What projects have you built?"
}

Response:
{
  "answer": "...",
  "sources": ["projects/smart_service_desk.md", "projects/semantic_cache_llm.md"]
}
```

### Project Endpoints
```
GET /api/projects          # List all projects
GET /api/projects/{id}     # Get project by ID
POST /api/projects/{id}/ask # Ask about a specific project
```

### Health Check
```
GET /health
Response: {"status": "ok"}
```

## 📊 Projects in Portfolio

1. **Smart Service Desk (SSD)** - Django-based help desk with real-time messaging and AI support
2. **Semantic Cache LLM** - Cost-optimized semantic caching layer for LLM applications
3. **AI Interview Chatbot** - Interactive chatbot for tech interview preparation
4. **Talent Acquisition** - Resume ranking system using semantic similarity
5. **Clinic Management System** - Healthcare management platform

## 🛠️ Technologies Covered

- FastAPI / Django REST
- React & React Router
- Python & TypeScript
- Chromadb & Vectorization
- Generative AI & RAG
- SQL & Databases
- Graphic Design Principles

## 🧪 Testing

```bash
cd backend

# Run all tests
pytest

# Run with verbose output
pytest -v

# Run specific test file
pytest tests/test_behavior.py -v

# Run with coverage
pytest --cov=app
```

Key test suites:
- `test_behavior.py` - RAG behavior and intent classification
- `test_api.py` - API endpoint responses  
- `test_rag.py` - RAG pipeline components

## 🚀 Deployment

### Frontend (Vercel)
- Build: `npm run build`
- Output: `dist/`
- Environment: Set `VITE_API_BASE_URL` to production backend URL

### Backend (Render)
- Runtime: Python 3.11
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Environment variables:
  - `GROQ_API_KEY` - Groq API key
  - `GROQ_MODEL` - must be `openai/gpt-oss-20b`
  - `FRONTEND_URL` - Frontend origin for CORS
  - `CHROMA_DB_PATH` - Path to ChromaDB (defaults to `./chroma_db`)

## 🔐 Security

- **API Keys**: Never commit `.env` files. Use `.env.example` as template
- **CORS**: Backend only accepts requests from configured `FRONTEND_URL`
- **Secrets**: All sensitive data loaded from environment variables
- **Dependencies**: Keep dependencies updated (`pip freeze`, `npm audit`)

## 📝 Environment Variables

### Backend (`.env`)
```
GROQ_API_KEY=gsk_...              # Get from https://console.groq.com
CHROMA_DB_PATH=./chroma_db        # Path to vector database
EMBEDDING_MODEL=all-MiniLM-L6-v2  # HuggingFace model ID
GROQ_MODEL=openai/gpt-oss-20b     # Supported Groq model name
FRONTEND_URL=http://localhost:5173 # Frontend origin
```

### Frontend (`.env.local`)
```
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## 📚 References

- [FastAPI Docs](https://fastapi.tiangolo.com)
- [React Docs](https://react.dev)
- [ChromaDB Docs](https://docs.trychroma.com)
- [Groq API Docs](https://console.groq.com/docs)

## 📄 License

Licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

Built with 🚀 by Aathif Nizam

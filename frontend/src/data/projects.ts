import type { Project } from '../types/project'

export const projects: Project[] = [
  {
    id: 'rag-powered-helpdesk',
    title: 'Smart Service Desk (SSD)',
    subtitle: 'A Django-based help desk with real-time messaging and AI-assisted support.',
    role: 'Full stack / AI integration',
    timeline: '6+ months',
    stack: ['Django', 'Django REST Framework', 'Django Channels', 'React', 'Tailwind CSS'],
    summary: 'Full-stack support platform with role-based dashboards, ticket workflows, and an AI knowledge assistant for search, recommendations, and ticket classification.',
    highlights: [
      'Django backend with REST APIs, JWT auth, and WebSocket support via Channels.',
      'React + Vite frontend with role-specific dashboards (customer, agent, admin).',
      'AI services for semantic search, copilot-style answers, and automated ticket classification.'
    ],
    challenges: [
      'Designing real-time messaging with reliable channel layers.',
      'Scaling AI search and document management while keeping latency low.',
      'Balancing multi-role UX for agents, admins, and customers.'
    ],
    architecture: 'Backend Django services manage tickets, knowledge base uploads, and AI microservices; the frontend is a React app that consumes REST and WebSocket endpoints.',
    database: 'Relational database for app data with a separate vector store (ChromaDB/FAISS) for semantic search.',
    relatedTechnologies: ['django', 'react', 'chromadb']
  },

  {
    id: 'semantic-cache-llm',
    title: 'Semantic Cache Layer',
    subtitle: 'A cost-optimised semantic caching layer for LLM applications.',
    role: 'Backend architect',
    timeline: 'Prototype',
    stack: ['FastAPI', 'ChromaDB', 'Sentence Transformers', 'Groq'],
    summary: 'Implements semantic caching by storing query embeddings and responses, returning cached answers for semantically similar queries to reduce LLM API calls and latency.',
    highlights: [
      'Embedding-based similarity search with ChromaDB to detect cache hits.',
      'Fallback to Groq LLM on cache misses and storage of responses for future reuse.',
      'Benchmarking tools to measure cache hit rate and latency improvements.'
    ],
    challenges: [
      'Choosing an appropriate similarity threshold to maximise hits without degrading relevance.',
      'Managing cache growth and designing eviction/TTL strategies.',
      'Integrating embeddings with real-time API paths.'
    ],
    architecture: 'FastAPI endpoint accepts queries, generates embeddings, queries ChromaDB for similar prompts, and either returns a cached response or forwards the request to the LLM and stores the new response.',
    database: 'ChromaDB vector store for embeddings and cached responses; lightweight relational store for metadata if needed.',
    relatedTechnologies: ['fastapi', 'chromadb', 'sentence-transformers']
  },

  {
    id: 'ai-interview-chatbot',
    title: 'AI Interview Coach',
    subtitle: 'Semantic intent classification chatbot for interview preparation.',
    role: 'ML / Backend developer',
    timeline: 'Prototype',
    stack: ['FastAPI', 'Streamlit', 'Sentence Transformers', 'Python'],
    summary: 'A semantic intent-classification system that uses sentence-transformer embeddings to map user queries to interview topics and return curated coaching responses.',
    highlights: [
      'Builds a semantic index of intent patterns and performs cosine-similarity inference.',
      'Streamlit frontend for an interactive chat experience and quick-topic buttons.',
      'Lightweight, easy-to-run artifacts with a train step to build the semantic index.'
    ],
    challenges: [
      'Tuning the confidence threshold to avoid false matches.',
      'Keeping the semantic index small and fast for low-latency inference.',
      'Providing useful fallback responses when confidence is low.'
    ],
    architecture: 'A small FastAPI gateway runs a semantic inference engine (sentence-transformers) and a Streamlit frontend consumes the API for an interactive coaching experience.',
    database: 'Pickled semantic index for fast local lookup; optional persistence for session history.',
    relatedTechnologies: ['fastapi', 'streamlit', 'sentence-transformers']
  },

  {
    id: 'taletm_acquisition',
    title: 'TaleTM Acquisition',
    subtitle: 'Talent acquisition & JD-to-candidate ranking platform.',
    role: 'Backend engineer',
    timeline: 'Ongoing',
    stack: ['Django', 'DRF', 'FAISS / ChromaDB', 'Groq'],
    summary: 'A recruiting platform that parses resumes, builds semantic profiles, and ranks candidates against job descriptions using a weighted scoring engine and Groq for justifications.',
    highlights: [
      'Resume parsing and profile extraction with layered regex + NLTK + Groq fallbacks.',
      'Candidate ranking engine that blends skill, experience, project relevance, and education scores.',
      'FAISS/Chroma-backed embedding store with optional Groq-based justification generation.'
    ],
    challenges: [
      'Accurately extracting structured candidate data from diverse resume formats.',
      'Balancing scoring weights and providing human-readable justifications.',
      'Scaling vector stores and background ranking tasks.'
    ],
    architecture: 'Django REST backend with modular AI pipeline: extractors, embeddings, vector store, and ranking tasks; exposes admin and job endpoints.',
    database: 'Relational DB for job and candidate records; FAISS/Chroma for semantic candidate search and embeddings.',
    relatedTechnologies: ['django', 'faiss', 'groq']
  }
]

import type { Technology } from '../types/technology'

export const technologies: Technology[] = [
  {
    id: 'fastapi',
    name: 'FastAPI',
    description: 'Lightweight, high-performance Python framework used for several project APIs and inference gateways.',
    highlight: 'Ideal for serving AI endpoints and prototyping backend services.',
    useCases: ['REST APIs', 'AI gateways', 'ingestion endpoints'],
    relatedProjects: ['semantic-cache-llm', 'ai-interview-chatbot']
  },
  {
    id: 'django',
    name: 'Django',
    description: 'Batteries-included web framework used for full-stack applications and complex backends.',
    highlight: 'DRF + Channels enable robust APIs and real-time features in the SSD and TaleTM projects.',
    useCases: ['Admin APIs', 'auth', 'WebSocket backends'],
    relatedProjects: ['rag-powered-helpdesk', 'taletm_acquisition']
  },
  {
    id: 'chromadb',
    name: 'ChromaDB',
    description: 'Embeddings-backed vector store used for semantic search, caching, and retrieval workflows.',
    highlight: 'Stores query and response embeddings for fast similarity lookup.',
    useCases: ['vector search', 'semantic cache', 'RAG retrieval'],
    relatedProjects: ['semantic-cache-llm', 'rag-powered-helpdesk']
  },
  {
    id: 'sentence-transformers',
    name: 'Sentence Transformers',
    description: 'Embedding models used to convert text into vectors for semantic search and intent classification.',
    highlight: 'Provides reliable semantic representations for matching and caching scenarios.',
    useCases: ['embedding generation', 'semantic indexing', 'intent classification'],
    relatedProjects: ['semantic-cache-llm', 'ai-interview-chatbot']
  },
  {
    id: 'streamlit',
    name: 'Streamlit',
    description: 'Simple framework for building interactive demos and chat frontends, used by the interview coach project.',
    highlight: 'Great for rapid prototypes and interactive UIs for AI tools.',
    useCases: ['interactive frontends', 'demos', 'tooling'],
    relatedProjects: ['ai-interview-chatbot']
  },
  {
    id: 'groq',
    name: 'Groq (LLM)',
    description: 'LLM integration used for structured parsing and justification generation in recruiting and ranking pipelines.',
    highlight: 'Used as a high-quality LLM backend when available.',
    useCases: ['LLM completions', 'structured extraction', 'justifications'],
    relatedProjects: ['taletm_acquisition', 'semantic-cache-llm']
  },
  {
    id: 'generative-ai',
    name: 'Generative AI',
    description: 'LLM-powered generation and adaptive content pipelines for modern AI workflows.',
    highlight: 'Used to build the portfolio assistant and smart content experiences.',
    useCases: ['LLM prompting', 'content generation', 'adaptive workflows'],
    relatedProjects: ['ai-interview-chatbot', 'semantic-cache-llm']
  },
  {
    id: 'rag',
    name: 'RAG',
    description: 'Retrieval-augmented generation combining vector search with knowledge retrieval.',
    highlight: 'Powering semantic answers with document embeddings and context-aware recall.',
    useCases: ['semantic search', 'knowledge retrieval', 'AI augmentation'],
    relatedProjects: ['rag-powered-helpdesk', 'semantic-cache-llm']
  },
  {
    id: 'django-rest',
    name: 'Django REST',
    description: 'REST APIs and backend services built with Django for scalable applications.',
    highlight: 'Supports data models, authentication, and admin workflows.',
    useCases: ['backend APIs', 'CRUD services', 'admin panels'],
    relatedProjects: ['smart-service-desk', 'clinic-management-system']
  },
  {
    id: 'graphic-design',
    name: 'Graphic Design',
    description: 'Visual identities, UI concepts, and illustration work for polished digital experiences.',
    highlight: 'Design systems crafted for clear brand storytelling.',
    useCases: ['branding', 'UI design', 'visual systems'],
    relatedProjects: ['smart-service-desk']
  }
]

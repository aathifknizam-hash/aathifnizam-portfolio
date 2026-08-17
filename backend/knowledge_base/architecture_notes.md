# Architecture Notes

The portfolio backend follows a retrieval-augmented generation flow centered on structured Markdown knowledge documents.

- User input is sent from the React frontend to the FastAPI backend.
- The backend embeds the question using a sentence-transformer model.
- ChromaDB stores vectorized knowledge from the portfolio markdown files.
- A similarity search retrieves the most relevant context chunks.
- The retrieved context is combined with the user question into a prompt.
- Groq generates the final answer from that prompt.

## Core components

- `backend/app/ingestion`: loads markdown files, chunks text, and builds the ChromaDB index.
- `backend/app/rag`: handles embeddings, retrieval, prompt construction, and model requests.
- `backend/app/api`: exposes project and chat endpoints for the frontend.
- `frontend`: provides the React + Vite interface for questions, project pages, and technology pages.

## Technology stack

- Frontend: React + TypeScript + Vite
- Backend: FastAPI
- AI: Sentence Transformers
- Retrieval: RAG + ChromaDB
- LLM: Groq
- Knowledge base: Markdown documents in `backend/knowledge_base`

## Flow

User
→ React
→ FastAPI
→ Embedding
→ ChromaDB
→ Retrieved Context
→ Groq
→ Response

## Design principles

- Keep retrieval logic separate from API routes.
- Use Markdown files as the source of truth for portfolio knowledge.
- Make the index rebuildable and repeatable.
- Keep responses grounded in retrieved context rather than open-ended generation.

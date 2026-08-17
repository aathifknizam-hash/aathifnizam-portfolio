# FastAPI

## What it is

FastAPI is a Python web framework for building high-performance APIs with automatic request validation and modern Python typing.

## Why Aathif used it

Aathif used FastAPI in the portfolio backend and in the AI Interview Chatbot project. It fits AI applications well because it can quickly expose endpoints for chat, embeddings, semantic search, and health checks.

## Where it was used

- Portfolio RAG API
- AI Interview Chatbot (`AI-Interview-Chatbot`)
- Semantic Cache LLM project (`semantic-cache-llm`) uses FastAPI for the request layer

## How it was implemented

In the portfolio backend, FastAPI exposes chat and project-specific question endpoints. In the AI Interview Chatbot repository, FastAPI provides the `/chat` and `/health` endpoints and is paired with a Streamlit interface. In the semantic cache project, FastAPI handles the query pipeline and routes requests through the embedding and cache logic.

## Components

- API routes
- Request validation
- Health endpoints
- AI workflow orchestration
- Backend integration with ChromaDB and Groq

## Interview Explanation

"FastAPI is one of the frameworks I use when I need a lightweight and fast API layer for AI features. It let me stand up chat endpoints quickly, validate input cleanly, and connect the frontend to embedding, retrieval, and LLM logic without significant overhead."

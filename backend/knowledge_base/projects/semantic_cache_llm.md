# Semantic Cache LLM

## Overview

Semantic Cache LLM is a production-inspired project for reducing LLM cost and latency by avoiding repeated calls for semantically similar questions. The repository describes it as a semantic caching layer for cost-optimized LLM applications.

## Problem

Large language model applications often receive the same question in different wording. A normal cache based only on exact string match misses those similar requests, which leads to unnecessary API calls, higher latency, and higher cost.

## Solution

The project embeds incoming queries with Sentence Transformers and searches a ChromaDB vector store for similar previously cached questions. If the similarity is high enough, the cached answer is returned immediately. If not, the query goes to Groq and the answer is stored for future reuse.

## Key Features

- Semantic similarity search
- Embedding generation using sentence-transformers
- ChromaDB vector database
- Cache hit and cache miss detection
- Configurable similarity threshold
- Groq LLM integration
- Real-time dashboard
- Benchmarking and latency comparison

## Architecture

The architecture is described directly in the README:

User
→ FastAPI
→ Generate embedding
→ Search ChromaDB
→ Cache hit or cache miss
→ Return cached answer or call Groq
→ Store response and return result

## Frontend

The project includes a frontend built with HTML, CSS, and JavaScript. The repo describes it as a real-time dashboard for visualizing cache behavior and performance.

## Backend

The backend is built with:

- Python
- FastAPI

The main logic is split into services for embedding, caching, similarity matching, and LLM generation.

## Database

The project uses ChromaDB as a persistent semantic cache store. The database stores entries as question, answer, and embedding metadata.

## AI / RAG

This is not a full RAG system in the document-retrieval sense. It is a semantic caching system for LLM requests. It uses embeddings and vector similarity to decide whether a stored answer can be reused before spending another LLM call.

## APIs

The project exposes a FastAPI chat endpoint and includes a backend API layer for the semantic cache workflow. The repository structure includes `app/api/chat.py`, which confirms the application includes a chat endpoint.

## Authentication

No authentication flow is described in the repository.

## Workflow

1. User sends a query to FastAPI.
2. The query is embedded with Sentence Transformers.
3. The embedding is compared against prior entries in ChromaDB.
4. If similarity is above threshold, the cached answer is returned.
5. Otherwise, Groq is called to generate the answer.
6. The question and answer are stored in ChromaDB for future reuse.

## Technologies

- Python
- FastAPI
- ChromaDB
- Sentence Transformers
- Groq API
- HTML
- CSS
- JavaScript

## Challenges

The main challenge is distinguishing between truly similar questions and unrelated ones. The repository solves this with semantic similarity using embeddings and a configurable threshold.

## Design Decisions

- Use ChromaDB as a persistent semantic cache rather than memory-only lookup.
- Use a similarity threshold to decide when a cached response is acceptable.
- Keep the cost-reduction pattern explicit instead of relying on exact-match caching.

## Interview Explanation

"Semantic Cache LLM is a cost-optimization project for production AI systems. Instead of calling the LLM every time a user asks a similar question, I embed the query and search ChromaDB for previous semantically similar requests. If the similarity threshold is met, I return the cached answer and save cost and latency. If not, I call Groq and store the new answer for later reuse."

# Smart Service Desk

## Overview

Smart Service Desk is a full-stack support platform built with Django REST API on the backend and React + Vite on the frontend. The project is designed for customer support workflows, including ticket management, knowledge base operations, admin analytics, and AI-assisted support.

The GitHub repository is `rag-powered-helpdesk`, and the README describes it as an AI-powered enterprise support platform. It combines role-based dashboards for customers, agents, and administrators with AI search, contextual recommendations, and ticket workflows.

## Problem

Support teams regularly handle repetitive questions, triage work, and knowledge lookup tasks. A support desk needs structured ticket flows, shared knowledge management, and faster access to relevant information when handling user issues.

## Solution

The project addresses that problem by combining a Django backend, React dashboards, and AI services for retrieval and recommendation. Users can authenticate, create and track tickets, upload or manage knowledge-base documents, and receive AI-assisted support grounded in the stored knowledge base.

## Architecture

The repository is organized around several Django apps:

- `authentication/` for login, registration, profile handling, and JWT/cookie-based authentication
- `tickets/` for ticket CRUD, messages, and workflow management
- `knowledge_base/` for document upload and knowledge operations
- `ai_services/` for embeddings, ChromaDB integration, copilot features, and diagnostic flows
- `admin_panel/` for admin APIs and management features
- `messaging/` for real-time communication support

The frontend is a Vite-based React application with role-based UI flows for customer, agent, and admin users.

## Backend

The backend is built with:

- Python
- Django
- Django REST Framework
- Django Channels
- JWT authentication
- SQLite by default for local development

The project also configures `rest_framework_simplejwt`, cookie-based JWT auth, and CORS support for frontend access.

## Frontend

The frontend is built with:

- React
- Vite
- React Router
- Axios
- Tailwind-style UI components

The repository includes separate interfaces for customer, agent, and admin workflows.

## Authentication

Authentication is implemented with JWT-based access and refresh tokens, stored in HTTP-only cookies. The Django settings include `CookieJWTAuthentication` and `rest_framework_simplejwt`, which confirms cookie-based JWT support for the application.

## RAG Pipeline

The project includes a real retrieval pipeline, not just a simple prompt wrapper:

User Query
→ Embedding
→ Vector Search in ChromaDB
→ Retrieved Context
→ Prompt Construction
→ Groq LLM
→ Response

The repository includes dedicated services for chunking, embeddings, document processing, and vector synchronization. The AI services package connects the knowledge base, retrieval layer, and LLM responses.

## Embeddings

The project uses the Sentence Transformers model `BAAI/bge-base-en-v1.5` in the embedding service.

The service defines:

- `MODEL_NAME = "BAAI/bge-base-en-v1.5"`
- `EMBEDDING_DIM = 768`

This confirms the project uses a transformer-based embedding model for semantic search.

## Vector Database

The project uses ChromaDB as its vector database. The service initializes a persistent ChromaDB client and creates a default collection named `smart_service_desk` with cosine similarity space.

Key implementation details from the repository:

- `chromadb.PersistentClient(path=persist_dir)`
- `get_or_create_collection(name="smart_service_desk", metadata={"hnsw:space": "cosine"})`
- vector upserts for document chunks with metadata such as `document_id`, `chunk_index`, and `source`

## LLM

The project expects Groq configuration through environment variables:

- `GROQ_API_KEY`
- `GROQ_MODEL`

This confirms Groq is used for AI assistance and generated responses, with the model configured through the backend environment.

## Knowledge Base

The repository includes a dedicated `knowledge_base/` Django app and AI services for document ingestion, chunking, and vector indexing. The architecture supports uploading documents and retrieving the most relevant content for user support queries.

## Features

- User authentication and session handling with JWT cookies
- Ticket creation, tracking, assignment, updates, and resolution flows
- Knowledge base upload and document management
- AI-powered search and contextual recommendations
- Admin dashboard with analytics, audit logs, user management, and settings
- Real-time communication support for messaging and live workflows
- Role-based dashboards for customers, agents, and administrators

## Database

The README states that SQLite is used by default for local development. The project uses a Django relational model structure with separate apps for authentication, tickets, knowledge base, messaging, and admin features.

## User Roles

The README explicitly identifies role-based dashboards for:

- Customers
- Support Agents
- Administrators

## API

The repository exposes API groups under these base paths:

- `/api/auth/`
- `/api/tickets/`
- `/api/knowledge_base/`
- `/api/ai/`
- `/api/admin/`

These routes support authentication, ticketing, knowledge management, AI features, and admin operations.

## Challenges / Design Decisions

The repository supports several clear design decisions:

- Django REST Framework provides the API layer while maintaining a standard enterprise-style support app structure.
- JWT cookie authentication is used for session handling in the browser.
- ChromaDB is used for persistent semantic retrieval rather than ad hoc keyword lookup.
- SQLite is used by default for local development, while production-style setups may rely on broader infrastructure.
- The project separates AI services from core ticket and auth workflows to keep support logic modular.

## Technologies

- Python
- Django
- Django REST Framework
- Django Channels
- React
- Vite
- JWT authentication
- ChromaDB
- Sentence Transformers
- Groq
- SQLite

## How I Explain This Project in an Interview

"Smart Service Desk is an AI-powered support platform that combines Django, React, and RAG. The backend manages tickets and knowledge-base content, while the frontend gives different roles access to customer, agent, and admin workflows. The AI layer embeds support documents and searches ChromaDB for relevant context before sending the prompt to Groq for grounded responses. The result is faster support resolution and more consistent access to institutional knowledge."

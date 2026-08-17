# ChromaDB

## What it is

ChromaDB is a vector database used for semantic search and retrieval. It stores embeddings and supports similarity search over large document collections.

## Why Aathif used it

Aathif used ChromaDB in AI projects where the system needed to retrieve relevant context before generating a response. The project repositories show persistent vector storage and cosine-similarity search as core parts of the architecture.

## Where it was used

- Smart Service Desk (`rag-powered-helpdesk`)
- Semantic Cache LLM (`semantic-cache-llm`)
- Portfolio knowledge-base retrieval for this project

## How it was implemented

In the Smart Service Desk project, ChromaDB is initialized as a persistent client and a collection named `smart_service_desk` is created with cosine distance. Documents are chunked, embedded, and stored as vectors with metadata such as document ID and chunk index.

In the semantic cache project, ChromaDB is used as a semantic cache store. Queries are embedded and matched against stored question-answer entries using cosine similarity before the LLM is called.

## Components

- Persistent vector collection
- Embedding storage
- Similarity search
- Metadata filtering and retrieval

## Interview Explanation

"ChromaDB was the retrieval layer in my AI applications. Instead of sending every user query directly to the model, I stored embeddings and used similarity search to find the most relevant content first. That made the Smart Service Desk and the semantic cache project faster and more grounded in retrieved context."

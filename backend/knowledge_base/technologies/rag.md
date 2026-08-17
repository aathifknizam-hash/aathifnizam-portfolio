# RAG

## What it is

RAG, or Retrieval-Augmented Generation, combines a vector search step with a language-model response. Instead of answering from model memory alone, the system retrieves relevant context and then generates a grounded answer from that context.

## Why Aathif used it

Aathif used RAG in the portfolio knowledge-base flow and in the Smart Service Desk project. This approach makes responses grounded in project and knowledge-base documents rather than generic model output.

## Where it was used

- Portfolio chat assistant
- Smart Service Desk AI assistance
- Knowledge-base retrieval in the portfolio backend

## How it was implemented

The portfolio backend embeds user questions, searches ChromaDB for the closest matching document chunks, and then passes that retrieved context into a prompt to Groq. In the Smart Service Desk repository, the AI services layer similarly embeds support content and uses ChromaDB for relevant retrieval before generating a response.

## Components

- Embeddings
- ChromaDB vector search
- Context chunk retrieval
- Prompt construction
- Groq generation

## Interview Explanation

"RAG is a practical pattern I use when I need trustworthy AI answers. The model sees the relevant documents first, and then it generates a response that is grounded in the retrieved context. That is especially important in support and portfolio applications, where factual accuracy matters."

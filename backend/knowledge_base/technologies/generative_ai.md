# Generative AI

## What it is

Generative AI refers to models that can generate text, reasoning, and structured responses from prompts. In Aathif's portfolio, it is used to turn retrieved context into grounded answers.

## Why Aathif used it

Aathif used Generative AI in projects where the goal was not just to return raw documents but to answer user questions in a useful and conversational way. In the Smart Service Desk and portfolio knowledge-base system, the model is used after retrieval so the answer is grounded in relevant content.

## Where it was used

- Smart Service Desk AI support features
- Portfolio chat assistant
- Semantic Cache LLM cache-miss responses
- AI Interview Chatbot interview answer generation

## How it was implemented

The Smart Service Desk project configures Groq in the backend and uses it after retrieval from ChromaDB. The semantic cache project calls Groq on cache misses and stores the result in ChromaDB for future reuse. The AI Interview Chatbot uses semantic matching and response generation around interview topics.

## Components

- Embedding generation
- Retrieval from ChromaDB
- Prompt construction
- Groq-backed generation
- Context-aware responses

## Interview Explanation

"My generative AI work is grounded in retrieval and practical task flows. I use the LLM to generate the final answer, but I also make sure relevant context is retrieved first so the model responds from actual project or knowledge-base information instead of guessing."

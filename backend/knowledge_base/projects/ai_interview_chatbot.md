# AI Interview Chatbot

## Overview

AI Interview Chatbot is an interview-preparation project designed to help students and freshers prepare for machine learning, deep learning, NLP, statistics, and AI-related interviews. The GitHub repository describes it as a semantic search and interview-coach system built with FastAPI, Streamlit, and Sentence Transformers.

## Problem

Interview preparation usually requires studying many topics across machine learning and AI. The project tackles this by making the learning experience more interactive and targeted, with semantic search helping users find the most relevant answers and topics.

## Solution

The project uses a similarity-based semantic intent system. It embeds interview questions and topics, stores them in a semantic index, and matches new user queries to the closest topic or response pattern before returning a relevant answer.

## Key Features

- AI interview coach for ML and AI topics
- Semantic intent classification using embeddings
- Real-time chatbot interface
- Mock interview question generation
- Support for machine learning, deep learning, NLP, statistics, and MLOps topics
- Resume and career guidance support

## Architecture

The repository structure shows a simple full-stack AI design:

- `backend/` contains the FastAPI service and training logic
- `frontend/` contains the Streamlit app
- `dataset/` includes the `intents.json` training dataset
- `model/` contains the serialized semantic index file

The flow is: training data → embeddings → semantic index → query embedding → cosine similarity → best intent → response.

## Frontend

The frontend is built with Streamlit. The README states that it includes:

- interactive chat interface
- session-based chat history
- quick topic suggestions
- backend health status
- real-time responses

## Backend

The backend is built with FastAPI and includes endpoints for:

- `/chat`
- `/health`
- `/docs`

The project also uses Python scripts for training, preprocessing, and prediction.

## Database

The repository does not show a traditional relational database. Instead, it stores the semantic intent index in a serialized file, `model/semantic_index.pkl`, and uses embeddings for matching.

## AI / RAG

This project uses semantic search rather than a classic knowledge-base RAG pipeline. It converts user input into embeddings with Sentence Transformers and compares them using cosine similarity to identify the best matching interview topic or intent.

## APIs

The FastAPI backend exposes:

- `/chat` for the chatbot interaction
- `/health` for health checks
- `/docs` for automatic API documentation

## Authentication

No authentication flow is described in the repository.

## Workflow

1. Load the training dataset.
2. Extract patterns and topics.
3. Convert patterns to embeddings with Sentence Transformers.
4. Store the semantic index.
5. Receive a user query.
6. Embed the query.
7. Compute cosine similarity against stored embeddings.
8. Select the best matching intent.
9. Return the response.

## Technologies

- Python
- FastAPI
- Streamlit
- Sentence Transformers
- NumPy
- Pydantic
- Uvicorn
- Pickle

## Challenges

The project focuses on semantic matching quality and response relevance. The challenge is matching user queries to the right concept without a large labeled database or full document retrieval pipeline.

## Design Decisions

- Use sentence-transformer embeddings instead of keyword-only matching.
- Keep the stack simple and easy to run locally.
- Separate training and inference logic into reusable backend scripts.

## Interview Explanation

"AI Interview Chatbot is a semantic interview-preparation system built with FastAPI and Streamlit. I used sentence-transformer embeddings to understand the meaning of user questions, match them to the closest interview topic, and return relevant explanations or mock interview guidance. The goal was to create a practical AI learning assistant for machine-learning interview preparation."

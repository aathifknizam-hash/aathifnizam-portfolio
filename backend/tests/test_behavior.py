import asyncio

import pytest

from app.config import settings
from app.rag.embeddings import EmbeddingModel
from app.rag.pipeline import RAGPipeline, classify_intent, normalize_query, resolve_entity_alias
from app.rag.retriever import retrieve_chunks
from app.rag.vectorstore import VectorStore


def test_greeting_intent():
    assert classify_intent("hi there") == "GREETING"


def test_contact_query_rewrite():
    assert normalize_query("aathifs contact") == "What are Aathif Nizam's contact details?"


def test_alias_resolution():
    assert resolve_entity_alias("ssd") == "Smart Service Desk"
    assert resolve_entity_alias("what is ssd") == "Smart Service Desk"


def test_project_count_policy():
    from app.rag.pipeline import PORTFOLIO_PROJECTS

    assert len(PORTFOLIO_PROJECTS) == 4


def test_project_scoped_retrieval_for_semantic_cache():
    vectorstore = VectorStore(settings.chroma_db_path, settings.collection_name)
    embedding_model = EmbeddingModel(settings.embedding_model)

    chunks = retrieve_chunks(
        "Why did Aathif use ChromaDB in this project?",
        vectorstore,
        embedding_model,
        top_k=5,
        project_id="semantic_cache_llm",
        intent="PROJECT_DETAIL",
    )

    assert len(chunks) > 0
    assert chunks[0]["metadata"].get("project_id") == "semantic_cache_llm"


def test_project_direct_answers_for_semantic_cache_prompts():
    from app.rag.pipeline import rag_pipeline

    answer_1 = rag_pipeline._project_direct_answer("Why did Aathif use ChromaDB in this project?", "semantic-cache-llm")
    answer_2 = rag_pipeline._project_direct_answer("What is the purpose of the RAG pipeline in this project?", "semantic-cache-llm")

    assert "ChromaDB" in answer_1
    assert "semantic caching" in answer_2.lower() or "cache" in answer_2.lower()


def test_direct_facts_for_short_portfolio_queries():
    pipeline = RAGPipeline()
    pipeline.initialize()

    cgpa_answer = asyncio.run(pipeline.answer_chat("why is aathif cgpa low"))["answer"]
    assert "6.35" in cgpa_answer
    assert "speculate" in cgpa_answer.lower() or "don't have information" in cgpa_answer.lower()

    skills_answer = asyncio.run(pipeline.answer_chat("skills"))["answer"]
    assert "Python" in skills_answer or "FastAPI" in skills_answer or "React" in skills_answer
    assert "Smart Service Desk" not in skills_answer or "project" not in skills_answer.lower()

    projects_answer = asyncio.run(pipeline.answer_chat("what are his projects"))["answer"]
    assert "Smart Service Desk" in projects_answer
    assert "Semantic Cache LLM" in projects_answer

    repo_answer = asyncio.run(pipeline.answer_chat("which repository"))["answer"]
    assert "specific repository" in repo_answer.lower() or "I don't see" in repo_answer.lower()

    reset_answer = asyncio.run(pipeline.answer_chat("i didn't ask that"))["answer"]
    assert "start fresh" in reset_answer.lower() or "what would you like" in reset_answer.lower()

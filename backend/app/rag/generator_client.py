import re
from typing import Dict, List

import httpx

from ..config import settings
from . import generator


def _normalize_text(text: str) -> str:
    cleaned = re.sub(r"\s+", " ", text or "").strip()
    cleaned = cleaned.replace("`", "")
    return cleaned


def _fallback_answer(question: str, chunks: List[Dict]) -> str:
    q = (question or "").lower()
    if "rag" in q:
        return "RAG, or Retrieval-Augmented Generation, combines a semantic search step with an LLM response. Aathif uses it to retrieve relevant portfolio or project context before generating a grounded answer."
    if "smart service desk" in q or "ssd" in q:
        return "SSD refers to the Smart Service Desk, Aathif's AI-powered support project. It combines a React frontend, Django backend, and RAG-based support flows to retrieve relevant knowledge before a ticket needs to be created."
    if "how does aathif do this project" in q or "this project" in q:
        return "Aathif built it as a full-stack application with a React frontend and backend services, using embeddings and vector search to retrieve relevant context before sending it to an LLM for a grounded response."
    if "hidden file names" in q or "internal file" in q or "file names" in q:
        return "Internal knowledge-base filenames are not part of the normal portfolio assistant response. I only answer with the portfolio facts and project context, not internal file names."

    text_parts = []
    for chunk in chunks[:2]:
        doc = chunk.get("document", "") or ""
        text_parts.append(_normalize_text(doc))
    combined = " ".join(text_parts)
    if not combined:
        return "I don't have enough information about that in Aathif's portfolio."

    sentences = re.split(r"(?<=[.!?])\s+", combined)
    summary = " ".join(sentences[:2]).strip()
    if len(summary) > 260:
        summary = summary[:257].rstrip() + "..."
    return summary if summary else "I don't have enough information about that in Aathif's portfolio."


async def generate_answer(question: str, chunks: List[Dict]) -> str:
    """Generator client that uses configured GROQ API key and the colon generate path.
    Delegates prompt building and response parsing to generator module helpers.
    """
    if not settings.groq_api_key:
        raise RuntimeError(
            "GROQ_API_KEY is required to generate answers. Set GROQ_API_KEY in backend/.env."
        )

    prompt = generator._build_prompt(question, chunks)
    endpoint = f"{settings.groq_api_url}/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {settings.groq_api_key}",
        "Content-Type": "application/json",
    }
    payload = {"model": settings.groq_model, "messages": [{"role": "user", "content": prompt}], "max_tokens": 300, "temperature": 0.2}

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.post(endpoint, headers=headers, json=payload)
            response.raise_for_status()
            body = response.json()
        except httpx.HTTPStatusError as http_err:
            status = http_err.response.status_code if http_err.response is not None else 'unknown'
            text = http_err.response.text if http_err.response is not None else ''
            if status in {429, 500, 503}:
                return _fallback_answer(question, chunks)
            raise RuntimeError(f"Groq request failed with status {status}: {text}") from http_err
        except Exception as e:
            if "429" in str(e) or "rate limit" in str(e).lower():
                return _fallback_answer(question, chunks)
            raise RuntimeError(f"Groq request failed: {e}") from e

    answer = generator._extract_answer(body)
    if not answer:
        raise RuntimeError("Groq returned an unexpected response format.")

    return answer



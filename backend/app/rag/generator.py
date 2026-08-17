import httpx
from typing import Dict, List, Optional

from ..config import settings


def _build_prompt(question: str, chunks: List[Dict]) -> str:
    prompt_lines = [
        "You are Aathif Nizam's portfolio AI assistant.",
        "Answer the user's exact question using only verified portfolio context.",
        "Be concise, conversational, and grounded. Keep normal answers to 1-4 sentences.",
        "Do not invent facts, do not mention internal filenames, and do not mention retrieval or context internals.",
        "Use recent conversation context when relevant, but do not expose internal implementation details.",
        "If the answer is unavailable in the portfolio, say: 'I don't have enough information about that in Aathif's portfolio.'",
        "",
        "Context:",
    ]

    for index, entry in enumerate(chunks, start=1):
        metadata = entry.get("metadata", {})
        source = metadata.get("source", "portfolio")
        prompt_lines.append(f"---\nSource #{index}: {source}\n{entry.get('document', '').strip()}")

    prompt_lines.extend(
        [
            "",
            f"Question: {question}",
            "Answer:",
        ]
    )

    return "\n".join(prompt_lines)


def _extract_answer(response_json: Dict) -> Optional[str]:
    if not isinstance(response_json, dict):
        return None

    # Groq / OpenAI-compatible Chat Completions response
    choices = response_json.get("choices")
    if isinstance(choices, list) and choices:
        first_choice = choices[0]

        if isinstance(first_choice, dict):
            message = first_choice.get("message")

            if isinstance(message, dict):
                content = message.get("content")

                if isinstance(content, str):
                    return content.strip()

                if isinstance(content, list):
                    pieces = []

                    for item in content:
                        if isinstance(item, dict):
                            text = item.get("text")
                            if isinstance(text, str):
                                pieces.append(text)

                    answer = "".join(pieces).strip()
                    if answer:
                        return answer

    # Keep compatibility with any previous response formats
    output = response_json.get("output")

    if isinstance(output, list) and output:
        first_item = output[0]

        if isinstance(first_item, dict):
            content = first_item.get("content")

            if isinstance(content, list):
                pieces = [
                    item.get("text", "")
                    for item in content
                    if isinstance(item, dict)
                ]
                return "".join(pieces).strip()

            if isinstance(content, str):
                return content.strip()

        elif isinstance(first_item, str):
            return first_item.strip()

    text = response_json.get("text")
    if isinstance(text, str):
        return text.strip()

    return None

async def generate_answer(question: str, chunks: List[Dict]) -> str:
    if not settings.groq_api_key:
        raise RuntimeError(
            "GROQ_API_KEY is required to generate answers. Set GROQ_API_KEY in backend/.env."
        )

    prompt = _build_prompt(question, chunks)
    endpoint = f"{settings.groq_api_url}/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {settings.groq_api_key}",
        "Content-Type": "application/json",
    }
    payload = {"model": settings.groq_model, "messages": [{"role": "user", "content": prompt}], "max_tokens": 300, "temperature": 0.2}

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(endpoint, headers=headers, json=payload)
        response.raise_for_status()
        body = response.json()

    answer = _extract_answer(body)
    if not answer:
        raise RuntimeError("Groq returned an unexpected response format.")

    return answer









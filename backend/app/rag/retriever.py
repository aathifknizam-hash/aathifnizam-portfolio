from typing import Dict, List, Optional

from .embeddings import EmbeddingModel
from .vectorstore import VectorStore


def _metadata_priority(metadata: Dict) -> int:
    kind = metadata.get("type")
    if kind == "project":
        return 0
    if kind == "technology":
        return 1
    if kind == "about":
        return 2
    if kind == "resume":
        return 2
    if kind == "experience":
        return 2
    if kind == "education":
        return 2
    if kind == "contact":
        return 3
    return 4


def retrieve_chunks(
    query: str,
    vectorstore: VectorStore,
    embedding_model: EmbeddingModel,
    top_k: int = 4,
    project_id: Optional[str] = None,
    intent: str = "UNKNOWN",
) -> List[Dict]:
    if not query or not query.strip():
        return []

    query_embedding = embedding_model.embed_query(query)
    results = vectorstore.query(query_embedding, top_k=max(top_k * 3, 8))

    documents = results.get("documents", [])
    metadatas = results.get("metadatas", [])
    distances = results.get("distances", [])
    if not documents:
        return []

    candidates = []
    for document_set, metadata_set, distance_set in zip(documents, metadatas, distances):
        for document, metadata, distance in zip(document_set, metadata_set, distance_set):
            if not isinstance(metadata, dict):
                metadata = {}
            item = {"document": document, "metadata": metadata, "distance": distance}
            candidates.append(item)

    if project_id is not None:
        project_chunks = [item for item in candidates if item["metadata"].get("project_id") == project_id]
        if project_chunks:
            candidates = project_chunks

    intent_filtered = []
    for item in candidates:
        metadata = item["metadata"]
        kind = metadata.get("type")
        if intent in {"PROJECT_ENTITY", "PROJECT_DETAIL", "PROJECT_LIST", "PROJECT_COMPARISON"}:
            if kind == "project" or kind is None:
                intent_filtered.append(item)
        elif intent in {"TECHNOLOGY", "TECHNOLOGY_PROJECT", "RAG", "ARCHITECTURE"}:
            if kind == "technology" or kind == "project" or kind in {"general", None}:
                intent_filtered.append(item)
        elif intent in {"ABOUT", "EXPERIENCE", "EDUCATION", "CONTACT"}:
            if kind in {"general", None, "about", "resume", "experience", "education", "contact"}:
                intent_filtered.append(item)
        else:
            intent_filtered.append(item)

    if not intent_filtered:
        intent_filtered = candidates

    scored = []
    for item in intent_filtered:
        metadata = item["metadata"]
        distance = item.get("distance")
        score = _metadata_priority(metadata)
        if isinstance(distance, (int, float)):
            score += distance * 0.1
        scored.append((score, item))

    scored.sort(key=lambda pair: pair[0])
    filtered = [item for _, item in scored[:top_k]]

    if not filtered:
        return []

    if intent in {"PROJECT_ENTITY", "PROJECT_DETAIL", "PROJECT_COMPARISON"}:
        # Project-specific queries should keep valid project matches even when the
        # embedding distance is moderately above the generic threshold. A project
        # doc can still be the correct answer for a targeted question, especially
        # when the query is about a specific implementation detail.
        if project_id is None:
            best_distance = filtered[0].get("distance")
            if isinstance(best_distance, (int, float)) and best_distance > 1.2:
                return []

    return filtered

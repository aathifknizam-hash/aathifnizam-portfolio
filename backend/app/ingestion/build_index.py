import gc
from pathlib import Path

from .loaders import load_documents
from ..rag.chunking import split_text
from ..rag.embeddings import EmbeddingModel
from ..rag.vectorstore import VectorStore
from ..config import settings


def build_index() -> None:
    knowledge_path = Path(__file__).resolve().parents[2] / "knowledge_base"
    documents = load_documents(knowledge_path)
    if not documents:
        return

    vectorstore = VectorStore(settings.chroma_db_path, settings.collection_name, settings.embedding_model)
    model = EmbeddingModel(settings.embedding_model)

    chunks = []
    for doc in documents:
        for chunk_index, chunk_text in enumerate(
            split_text(doc["text"], chunk_size=settings.chunk_size, overlap=settings.chunk_overlap),
            start=1,
        ):
            metadata = dict(doc["metadata"])
            metadata["source"] = doc["id"]
            # Sanitize metadata: Chroma requires primitive serializable values (no None)
            for k, v in list(metadata.items()):
                if v is None:
                    metadata[k] = ""
                elif not isinstance(v, (str, int, float, bool)):
                    metadata[k] = str(v)
            chunks.append(
                {
                    "id": f"{doc['id']}#{chunk_index}",
                    "text": chunk_text,
                    "metadata": metadata,
                }
            )

    if not chunks:
        return

    vectorstore.reset_collection()
    embeddings = model.embed_texts([item["text"] for item in chunks])
    vectorstore.add_documents(
        ids=[item["id"] for item in chunks],
        texts=[item["text"] for item in chunks],
        metadatas=[item["metadata"] for item in chunks],
        embeddings=embeddings,
    )
    del embeddings, chunks, model, vectorstore
    gc.collect()


if __name__ == "__main__":
    build_index()

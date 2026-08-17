from pathlib import Path
from typing import Dict, List

import chromadb


class VectorStore:
    def __init__(self, persist_path: Path, collection_name: str):
        self.persist_path = Path(persist_path)
        self.persist_path.mkdir(parents=True, exist_ok=True)

        try:
            self.client = chromadb.PersistentClient(path=str(self.persist_path))
        except Exception:
            self.client = chromadb.Client()

        self.collection_name = collection_name
        self.collection = self._load_or_create_collection()

    def _load_or_create_collection(self):
        import sqlite3
        try:
            return self.client.get_collection(name=self.collection_name)
        except sqlite3.OperationalError as op_err:
            # Persistent client DB schema may be incompatible with this chromadb version
            # Fall back to an in-memory client to avoid crashes caused by old/stale DB files.
            try:
                # create a fresh in-memory client
                self.client = chromadb.Client()
                return self.client.get_or_create_collection(name=self.collection_name)
            except Exception:
                # As a last resort, re-raise the original error for visibility
                raise op_err
        except Exception:
            return self.client.get_or_create_collection(name=self.collection_name)

    def has_documents(self) -> bool:
        try:
            return self.collection.count() > 0
        except Exception:
            return False

    def reset_collection(self):
        try:
            self.client.delete_collection(name=self.collection_name)
        except Exception:
            pass
        self.collection = self.client.get_or_create_collection(name=self.collection_name)

    def add_documents(
        self,
        ids: List[str],
        texts: List[str],
        metadatas: List[Dict],
        embeddings: List[List[float]],
    ):
        sanitized_metadatas = []
        for metadata in metadatas:
            sanitized = {}
            for key, value in metadata.items():
                if value is None:
                    sanitized[key] = ""
                elif isinstance(value, (str, int, float, bool)):
                    sanitized[key] = value
                else:
                    sanitized[key] = str(value)
            sanitized_metadatas.append(sanitized)

        self.collection.add(
            ids=ids,
            documents=texts,
            metadatas=sanitized_metadatas,
            embeddings=embeddings,
        )

    def query(self, query_embedding: List[float], top_k: int = 4) -> Dict:
        return self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            include=["documents", "metadatas", "distances"],
        )

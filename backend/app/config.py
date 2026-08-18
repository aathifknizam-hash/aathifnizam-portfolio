from pathlib import Path
from typing import Optional

from pydantic_settings import BaseSettings


def normalize_embedding_model_name(model_name: str) -> str:
    legacy_aliases = {
        "all-MiniLM-L6-v2": "sentence-transformers/all-MiniLM-L6-v2",
        "sentence-transformers/all-MiniLM-L6-v2": "sentence-transformers/all-MiniLM-L6-v2",
        "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2": "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
    }
    cleaned = (model_name or "").strip()
    if not cleaned:
        return "sentence-transformers/all-MiniLM-L6-v2"
    return legacy_aliases.get(cleaned, cleaned)


class Settings(BaseSettings):
    groq_api_key: Optional[str] = None
    chroma_db_path: Path = Path(__file__).resolve().parents[1] / "chroma_db"
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    groq_model: str = "openai/gpt-oss-20b"
    # Use base Groq API base URL; route helpers will add the specific path
    groq_api_url: str = "https://api.groq.com"
    frontend_url: str = "http://localhost:5173"
    collection_name: str = "portfolio"
    max_context_chunks: int = 5
    chunk_size: int = 500
    chunk_overlap: int = 80

    def __init__(self, **values):
        super().__init__(**values)
        if self.groq_api_key is not None:
            self.groq_api_key = self.groq_api_key.strip()
        self.embedding_model = normalize_embedding_model_name(self.embedding_model)

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()

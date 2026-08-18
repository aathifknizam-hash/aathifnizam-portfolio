import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .api.routes_chat import router as chat_router
from .api.routes_project import router as project_router

logger = logging.getLogger("uvicorn.error")

app = FastAPI(title="Aathif Portfolio AI")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(chat_router, prefix="/api")
app.include_router(project_router, prefix="/api")


@app.on_event("startup")
def startup_event():
    from .rag.pipeline import rag_pipeline
    try:
        rag_pipeline.initialize()
        logger.info("Embedding backend: %s", rag_pipeline.embedding_model.backend_name)
        logger.info("Embedding model: %s", rag_pipeline.embedding_model.model_name)
        logger.info("Chroma collection: %s", rag_pipeline.vectorstore.collection_name)
        logger.info("Chroma document count: %s", rag_pipeline.vectorstore.collection.count())
    except Exception as e:
        logger.exception("RAG pipeline failed to initialize: %s", e)


@app.get("/", tags=["health"])
def root():
    return {"status": "ok", "message": "Aathif Portfolio AI backend is ready"}


@app.get("/health", tags=["health"])
def health():
    return {"status": "ok", "message": "Aathif Portfolio AI backend is healthy"}

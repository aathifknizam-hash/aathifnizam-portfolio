from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .api.routes_chat import router as chat_router
from .api.routes_project import router as project_router

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
    except Exception as e:
        # Log initialization errors but don't stop the app; RAG features will be unavailable
        import logging

        logging.getLogger("uvicorn.error").exception("RAG pipeline failed to initialize: %s", e)


@app.get("/", tags=["health"])
def root():
    return {"status": "ok", "message": "Aathif Portfolio AI backend is ready"}


@app.get("/health", tags=["health"])
def health():
    return {"status": "ok", "message": "Aathif Portfolio AI backend is healthy"}

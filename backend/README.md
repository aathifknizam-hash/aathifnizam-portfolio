# Backend

This backend serves the portfolio AI API with a FastAPI application and a local Chroma vector store.

## Setup

1. Activate the virtual environment:
   ```powershell
   .venv\Scripts\Activate.ps1
   ```
2. Copy the example env file:
   ```powershell
   copy .env.example .env
   ```
3. Set your `GROQ_API_KEY` in `backend/.env` and ensure `GROQ_MODEL=openai/gpt-oss-20b`.

## Run

```powershell
.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

## Health check

- `GET /health` returns backend readiness.

## API endpoints

- `POST /api/chat` with JSON `{ "question": "..." }`
- `POST /api/projects/{project_id}/ask` with JSON `{ "question": "..." }`

If `GROQ_API_KEY` is not set, the endpoints return `503 Service Unavailable` with a clear message.

from fastapi import APIRouter, HTTPException

from ..models.schemas import ProjectAskRequest, ProjectAskResponse
from ..rag.pipeline import rag_pipeline

router = APIRouter()


@router.post("/projects/{project_id}/ask", response_model=ProjectAskResponse)
async def ask_project(project_id: str, request: ProjectAskRequest):
    try:
        return await rag_pipeline.answer_project(request.question, project_id)
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error))
    except RuntimeError as error:
        raise HTTPException(status_code=503, detail=str(error))
    except Exception as error:
        raise HTTPException(status_code=500, detail="Unable to process the project question at this time.")

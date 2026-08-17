from pydantic import BaseModel, Field
from typing import List


class ChatRequest(BaseModel):
    question: str = Field(..., min_length=1)


class ChatResponse(BaseModel):
    answer: str
    sources: List[str] = Field(default_factory=list)


class ProjectAskRequest(BaseModel):
    question: str = Field(..., min_length=1)


class ProjectAskResponse(BaseModel):
    answer: str
    sources: List[str] = Field(default_factory=list)

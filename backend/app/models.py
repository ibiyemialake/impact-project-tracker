from typing import Dict, Any, List
from pydantic import BaseModel, Field, validator
from enum import Enum

class ProjectStatus(str, Enum):
    PLANNED = "Planned"
    ONGOING = "Ongoing"
    COMPLETED = "Completed"

class Project(BaseModel):
    projectName: str = Field(..., min_length=1, description="Project name must be non-empty")
    status: ProjectStatus = Field(..., description="Project status")

class ProjectResponse(BaseModel):
    message: str
    data: Project

class ErrorResponse(BaseModel):
    message: str
    errors: List[str]

class JSONLDProject(BaseModel):
    context: Dict[str, Any] = Field(alias="@context")
    type: str = Field(alias="@type")
    projectName: str
    status: str
    
    class Config:
        allow_population_by_field_name = True
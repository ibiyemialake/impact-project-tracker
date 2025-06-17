from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Dict, Any
import json

from .models import Project, ProjectResponse, ErrorResponse
from .validators import validate_jsonld_structure, extract_project_data

# Initialize FastAPI app
app = FastAPI(
    title="Impact Project Tracker API",
    description="API for tracking impact projects with JSON-LD support",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

# In-memory storage
projects_storage: List[Dict[str, str]] = []

@app.get("/")
async def root():
    """Health check endpoint."""
    return {"message": "Impact Project Tracker API is running"}

@app.post("/projects", response_model=ProjectResponse, status_code=201)
async def create_project(request: Request):
    try:
        # Parse JSON body
        jsonld_data = await request.json()
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=400,
            detail=ErrorResponse(
                message="Invalid JSON format",
                errors=["Request body must be valid JSON"]
            ).dict()
        )
    
    # Validate JSON-LD structure
    is_valid, validation_errors = validate_jsonld_structure(jsonld_data)
    
    if not is_valid:
        raise HTTPException(
            status_code=400,
            detail=ErrorResponse(
                message="Validation failed or invalid JSON-LD",
                errors=validation_errors
            ).dict()
        )
    
    # Extract and create project
    project_data = extract_project_data(jsonld_data)
    
    try:
        project = Project(**project_data)
        
        # Store project in memory
        stored_project = project.dict()
        projects_storage.append(stored_project)
        
        return ProjectResponse(
            message="Project submitted successfully",
            data=project
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=ErrorResponse(
                message="Validation failed",
                errors=[str(e)]
            ).dict()
        )

@app.get("/projects")
async def get_projects() -> List[Dict[str, str]]:
    """
    Retrieve all projects.
    
    Returns:
        List of project objects with projectName and status.
    """
    return projects_storage

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Custom exception handler for consistent error responses."""
    return JSONResponse(
        status_code=exc.status_code,
        content=exc.detail
    )
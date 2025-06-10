from typing import Dict, Any, Tuple, List
from .models import ProjectStatus

def validate_jsonld_structure(data: Dict[str, Any]) -> Tuple[bool, List[str]]:
    """Validate JSON-LD structure and extract project data."""
    errors = []
    
    # Check required JSON-LD fields
    if "@context" not in data:
        errors.append("@context is required in JSON-LD")
    if "@type" not in data:
        errors.append("@type is required in JSON-LD")
    
    # Check project fields
    if "projectName" not in data:
        errors.append("projectName is required")
    elif not isinstance(data["projectName"], str) or not data["projectName"].strip():
        errors.append("projectName must be a non-empty string")
    
    if "status" not in data:
        errors.append("status is required")
    elif data["status"] not in [status.value for status in ProjectStatus]:
        errors.append(f"status must be one of {', '.join([status.value for status in ProjectStatus])}")
    
    return len(errors) == 0, errors

def extract_project_data(jsonld_data: Dict[str, Any]) -> Dict[str, str]:
    """Extract project data from JSON-LD."""
    return {
        "projectName": jsonld_data.get("projectName", "").strip(),
        "status": jsonld_data.get("status", "")
    }
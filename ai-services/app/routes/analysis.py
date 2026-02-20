from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from app.services.claude_service import claude_service

router = APIRouter()

class ConflictRequest(BaseModel):
    project_id: str
    brd_content: Dict

class Conflict(BaseModel):
    id: str
    type: str
    description: str
    sources: List[str]
    resolution_options: List[Dict]

class ConflictResponse(BaseModel):
    conflicts: List[Conflict]

@router.post("/conflicts", response_model=ConflictResponse)
async def detect_conflicts(request: ConflictRequest):
    """Detect conflicts in BRD requirements"""
    try:
        prompt = f"""
Analyze this BRD content for conflicting requirements:

{request.brd_content}

Identify any contradictions, inconsistencies, or conflicting statements.
For each conflict, provide:
1. Type (timeline, scope, budget, technical, etc.)
2. Description
3. Resolution options

Return as JSON array of conflicts.
"""
        
        response = await claude_service.generate_content(prompt)
        
        import json
        try:
            conflicts = json.loads(response)
            if isinstance(conflicts, list):
                conflicts = {"conflicts": conflicts}
        except:
            conflicts = {"conflicts": []}
        
        return ConflictResponse(**conflicts)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
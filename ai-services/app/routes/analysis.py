from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from app.services.gemini_service import gemini_service
import json

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
    """Detect conflicts in BRD requirements using Gemini"""
    try:
        prompt = f"""Analyze this Business Requirements Document for conflicts, contradictions, and inconsistencies:

BRD CONTENT:
{json.dumps(request.brd_content, indent=2)}

Look for conflicts in:
1. Timeline conflicts (different deadlines, conflicting schedules)
2. Scope conflicts (feature required in one place, out of scope in another)
3. Budget conflicts (different amounts mentioned)
4. Technical conflicts (incompatible technologies or approaches)
5. Stakeholder conflicts (different requirements from different stakeholders)

For each conflict found, provide:
- id: unique identifier
- type: category of conflict
- description: clear explanation
- sources: which sections conflict
- resolution_options: 2-3 ways to resolve

Return ONLY valid JSON array:
[
  {{
    "id": "conf_001",
    "type": "timeline_conflict",
    "description": "Section A requires Q2 launch but Section B needs 6 months (Q3)",
    "sources": ["executive_summary", "timeline"],
    "resolution_options": [
      {{"option": "Reduce scope for Q2 MVP", "impact": "Lower initial features"}},
      {{"option": "Extend to Q3", "impact": "Delayed market entry"}}
    ]
  }}
]

If NO conflicts found, return: []"""
        
        try:
            result = await gemini_service.generate_content_with_json(prompt, max_tokens=2000)
            
            # Handle different response formats
            if isinstance(result, list):
                conflicts_data = result
            elif isinstance(result, dict) and 'conflicts' in result:
                conflicts_data = result['conflicts']
            else:
                conflicts_data = []
            
            # Convert to Conflict objects
            conflicts = []
            for idx, conflict in enumerate(conflicts_data):
                if isinstance(conflict, dict):
                    conflicts.append(Conflict(
                        id=conflict.get('id', f'conf_{idx+1:03d}'),
                        type=conflict.get('type', 'general'),
                        description=conflict.get('description', 'Conflict detected'),
                        sources=conflict.get('sources', []),
                        resolution_options=conflict.get('resolution_options', [])
                    ))
            
            return ConflictResponse(conflicts=conflicts)
            
        except json.JSONDecodeError:
            # If parsing fails, return empty conflicts
            return ConflictResponse(conflicts=[])
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
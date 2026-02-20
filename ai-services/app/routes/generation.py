from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
from app.services.claude_service import claude_service
from app.services.template_service import template_service
import json

router = APIRouter()

class GenerateBRDRequest(BaseModel):
    project_id: str
    data_sources: Dict
    template: str = "comprehensive"

class GenerateBRDResponse(BaseModel):
    brd_content: Dict
    message: str

@router.post("/generate", response_model=GenerateBRDResponse)
async def generate_brd(request: GenerateBRDRequest):
    """Generate initial BRD from data sources"""
    try:
        # Load template structure
        template_structure = template_service.load_template(request.template)
        
        # Format data sources
        formatted_data = format_data_sources(request.data_sources)
        
        # Generate BRD with Claude
        prompt = f"""
You are an expert Business Analyst. Generate a comprehensive Business Requirements Document (BRD) from the following data sources.

DATA SOURCES:
{formatted_data}

REQUIRED BRD STRUCTURE:
{json.dumps(template_structure, indent=2)}

INSTRUCTIONS:
1. Extract all business requirements, objectives, stakeholder mentions, timelines, and decisions
2. Filter out noise (casual conversations, off-topic discussions)
3. Organize information into the provided BRD structure
4. Identify any conflicting requirements
5. For each section, provide clear, professional content

Generate the BRD content as a JSON object with keys matching the template structure.
"""
        
        response = await claude_service.generate_content(prompt, max_tokens=4000)
        
        # Parse response
        try:
            brd_content = json.loads(response)
        except:
            # If not valid JSON, create structured response
            brd_content = {
                "executive_summary": response[:500],
                "raw_content": response
            }
        
        return GenerateBRDResponse(
            brd_content=brd_content,
            message="BRD generated successfully"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def format_data_sources(data_sources: Dict) -> str:
    """Format data sources into readable text"""
    formatted = []
    
    if "emails" in data_sources:
        formatted.append("=== EMAILS ===")
        for email in data_sources["emails"][:20]:
            formatted.append(f"From: {email.get('from', 'Unknown')}")
            formatted.append(f"Subject: {email.get('subject', 'No subject')}")
            formatted.append(f"Body: {email.get('body', '')[:300]}")
            formatted.append("---")
    
    if "meetings" in data_sources:
        formatted.append("\n=== MEETING TRANSCRIPTS ===")
        for meeting in data_sources["meetings"][:10]:
            formatted.append(f"Meeting: {meeting.get('meeting_id', 'Unknown')}")
            formatted.append(f"Transcript: {meeting.get('transcript', '')[:500]}")
            formatted.append("---")
    
    if "slack" in data_sources:
        formatted.append("\n=== SLACK MESSAGES ===")
        for msg in data_sources["slack"][:30]:
            formatted.append(f"[{msg.get('user', 'Unknown')}]: {msg.get('text', '')}")
    
    return "\n".join(formatted)
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
from app.services.gemini_service import gemini_service
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
    """Generate initial BRD from data sources using Gemini"""
    try:
        # Load template structure
        template_structure = template_service.load_template(request.template)
        
        # Format data sources
        formatted_data = format_data_sources(request.data_sources)
        
        # Generate BRD with Gemini
        prompt = f"""You are an expert Business Analyst. Generate a comprehensive Business Requirements Document (BRD) from the following data sources.

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

Return the BRD as a JSON object with keys matching the section IDs from the template structure.
Each section should contain:
- "title": The section title
- "content": The actual content for that section (as a string)
- "completed": boolean indicating if the section has content

Example format:
{{
  "executive_summary": {{
    "title": "Executive Summary",
    "content": "This project aims to...",
    "completed": true
  }},
  "business_goals": {{
    "title": "Business Goals & Objectives",
    "content": "1. Increase revenue by 40%\\n2. Launch by Q3 2024",
    "completed": true
  }}
}}

Generate the complete BRD now."""
        
        # Use JSON-specific method
        brd_content = await gemini_service.generate_content_with_json(prompt, max_tokens=4000)
        
        # Ensure proper structure
        if not isinstance(brd_content, dict):
            brd_content = {"raw_content": str(brd_content)}
        
        return GenerateBRDResponse(
            brd_content=brd_content,
            message="BRD generated successfully using Gemini AI"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def format_data_sources(data_sources: Dict) -> str:
    """Format data sources into readable text"""
    formatted = []
    
    if "emails" in data_sources:
        formatted.append("=== EMAILS ===")
        emails = data_sources["emails"][:20] if isinstance(data_sources["emails"], list) else []
        for email in emails:
            formatted.append(f"From: {email.get('from', 'Unknown')}")
            formatted.append(f"Subject: {email.get('subject', 'No subject')}")
            formatted.append(f"Body: {email.get('body', '')[:300]}")
            formatted.append("---")
    
    if "meetings" in data_sources:
        formatted.append("\n=== MEETING TRANSCRIPTS ===")
        meetings = data_sources["meetings"][:10] if isinstance(data_sources["meetings"], list) else []
        for meeting in meetings:
            formatted.append(f"Meeting: {meeting.get('meeting_id', 'Unknown')}")
            formatted.append(f"Transcript: {meeting.get('transcript', '')[:500]}")
            formatted.append("---")
    
    if "slack" in data_sources:
        formatted.append("\n=== SLACK MESSAGES ===")
        slack = data_sources["slack"][:30] if isinstance(data_sources["slack"], list) else []
        for msg in slack:
            formatted.append(f"[{msg.get('user', 'Unknown')}]: {msg.get('text', '')}")
    
    return "\n".join(formatted)
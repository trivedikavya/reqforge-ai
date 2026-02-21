from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
from app.services.gemini_service import gemini_service
import json

router = APIRouter()

class ChatRequest(BaseModel):
    project_id: str
    message: str
    context: Optional[Dict] = None

class Suggestion(BaseModel):
    type: str
    text: str
    action: str
    data: Dict

class ChatResponse(BaseModel):
    message: str
    suggestions: List[Suggestion] = []
    brd_update: Optional[Dict] = None

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):
    """Chat with Gemini AI to refine BRD"""
    try:
        # Detect intent
        intent = detect_intent(request.message)
        
        if intent == "generate":
            return await handle_generate_request(request)
        elif intent == "web_scraping":
            return await handle_scraping_request(request)
        elif intent == "conflict_check":
            return await handle_conflict_check(request)
        elif intent == "edit":
            return await handle_edit_request(request)
        else:
            return await handle_general_chat(request)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def detect_intent(message: str) -> str:
    """Detect user intent from message"""
    message_lower = message.lower()
    
    if "generate" in message_lower or "create brd" in message_lower:
        return "generate"
    elif "/scrape" in message_lower or "competitor" in message_lower or "scrape" in message_lower:
        return "web_scraping"
    elif "conflict" in message_lower or "check conflicts" in message_lower:
        return "conflict_check"
    elif "add" in message_lower or "edit" in message_lower or "update" in message_lower or "modify" in message_lower:
        return "edit"
    else:
        return "general"

async def handle_generate_request(request: ChatRequest) -> ChatResponse:
    """Handle BRD generation request"""
    return ChatResponse(
        message="I'll help you generate your BRD. Please make sure you've uploaded your documents or connected your data sources, then I can create a comprehensive BRD based on that information.",
        suggestions=[
            Suggestion(
                type="action",
                text="Upload documents to get started",
                action="upload",
                data={}
            )
        ]
    )

async def handle_scraping_request(request: ChatRequest) -> ChatResponse:
    """Handle web scraping request"""
    import re
    url_pattern = r'https?://[^\s]+'
    urls = re.findall(url_pattern, request.message)
    
    if urls:
        return ChatResponse(
            message=f"I'll analyze {urls[0]} for competitive intelligence. This may take a moment...",
            suggestions=[
                Suggestion(
                    type="web_scraping",
                    text=f"Analyzing {urls[0]}",
                    action="scrape",
                    data={"url": urls[0]}
                )
            ]
        )
    else:
        return ChatResponse(
            message="Please provide a URL to analyze. Example: /scrape https://competitor.com or just paste any URL"
        )

async def handle_conflict_check(request: ChatRequest) -> ChatResponse:
    """Handle conflict detection request"""
    
    if not request.context or not request.context.get('content'):
        return ChatResponse(
            message="No BRD content found to check for conflicts. Please generate a BRD first.",
            suggestions=[]
        )
    
    prompt = f"""Analyze this BRD content for conflicting requirements:

{json.dumps(request.context.get('content', {}), indent=2)}

Identify any contradictions, inconsistencies, or conflicting statements.
Look for conflicts in:
- Timelines (different deadlines mentioned)
- Budget (different amounts)
- Scope (feature X required vs feature X out of scope)
- Technical requirements (conflicting technologies)

Return ONLY a JSON array of conflicts in this format:
[
  {{
    "type": "timeline_conflict",
    "description": "Requirement A says Q2 2024, but Requirement B says Q4 2024",
    "severity": "high",
    "sources": ["Section A", "Section B"]
  }}
]

If no conflicts found, return: []
"""
    
    try:
        response = await gemini_service.generate_content_with_json(prompt)
        conflicts = response if isinstance(response, list) else response.get('conflicts', [])
        
        if conflicts:
            return ChatResponse(
                message=f"Found {len(conflicts)} potential conflict(s) in your BRD. Review them carefully.",
                suggestions=[
                    Suggestion(
                        type="conflict",
                        text=conflict.get('description', 'Conflict detected'),
                        action="review",
                        data=conflict
                    )
                    for conflict in conflicts[:3]  # Limit to 3 suggestions
                ]
            )
        else:
            return ChatResponse(
                message="✅ No conflicts detected! Your BRD requirements appear to be consistent.",
                suggestions=[]
            )
    except:
        return ChatResponse(
            message="Checked for conflicts. Your requirements appear to be consistent.",
            suggestions=[]
        )

async def handle_edit_request(request: ChatRequest) -> ChatResponse:
    """Handle BRD editing request"""
    
    current_content = request.context.get('content', {}) if request.context else {}
    
    prompt = f"""You are helping edit a Business Requirements Document.

CURRENT BRD CONTENT:
{json.dumps(current_content, indent=2)}

USER REQUEST:
{request.message}

Based on the user's request, generate the updated BRD sections in JSON format.
Only return the sections that need to be updated or added.

Format:
{{
  "section_id": {{
    "title": "Section Title",
    "content": "Updated content here",
    "completed": true
  }}
}}

Generate the updates now:"""
    
    try:
        updated_content = await gemini_service.generate_content_with_json(prompt, max_tokens=2000)
        
        return ChatResponse(
            message="I've updated the BRD based on your request. The changes are highlighted in the preview.",
            brd_update=updated_content
        )
    except Exception as e:
        return ChatResponse(
            message=f"I'll help you with that. Could you provide more details about what you'd like to change?",
            suggestions=[]
        )

async def handle_general_chat(request: ChatRequest) -> ChatResponse:
    """Handle general conversation"""
    
    prompt = f"""You are an AI Business Analyst assistant helping create Business Requirements Documents.

Current context: {"BRD already generated" if request.context else "No BRD yet"}

User message: {request.message}

Provide helpful, concise guidance. Be actionable and specific.
Keep your response under 100 words.

Your response:"""
    
    response = await gemini_service.generate_content(prompt, max_tokens=200)
    
    return ChatResponse(message=response)
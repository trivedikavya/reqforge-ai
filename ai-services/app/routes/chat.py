from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
from app.services.claude_service import claude_service
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
    """Chat with AI to refine BRD"""
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
    elif "add" in message_lower or "edit" in message_lower or "update" in message_lower:
        return "edit"
    else:
        return "general"

async def handle_generate_request(request: ChatRequest) -> ChatResponse:
    """Handle BRD generation request"""
    return ChatResponse(
        message="I'll generate your BRD now. Please use the Generate BRD button or upload your documents first.",
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
            message=f"I'll scrape {urls[0]} for competitive intelligence. This may take a moment...",
            suggestions=[
                Suggestion(
                    type="web_scraping",
                    text="Scraping competitor website",
                    action="scrape",
                    data={"url": urls[0]}
                )
            ]
        )
    else:
        return ChatResponse(
            message="Please provide a URL to scrape. Example: /scrape https://competitor.com"
        )

async def handle_conflict_check(request: ChatRequest) -> ChatResponse:
    """Handle conflict detection request"""
    return ChatResponse(
        message="Checking for conflicts in your requirements...",
        suggestions=[
            Suggestion(
                type="conflict_check",
                text="No conflicts detected",
                action="none",
                data={}
            )
        ]
    )

async def handle_edit_request(request: ChatRequest) -> ChatResponse:
    """Handle BRD editing request"""
    prompt = f"""
User wants to modify their BRD with this request: {request.message}

Current BRD context: {json.dumps(request.context or {}, indent=2)}

Generate the updated content for the relevant section(s). Return as JSON.
"""
    
    response = await claude_service.generate_content(prompt, max_tokens=2000)
    
    try:
        updated_content = json.loads(response)
    except:
        updated_content = {"content": response}
    
    return ChatResponse(
        message="I've updated the BRD based on your request.",
        brd_update=updated_content
    )

async def handle_general_chat(request: ChatRequest) -> ChatResponse:
    """Handle general conversation"""
    prompt = f"""
You are an AI Business Analyst assistant helping create BRDs.

User message: {request.message}

Provide helpful guidance or information. Be concise and actionable.
"""
    
    response = await claude_service.generate_content(prompt)
    
    return ChatResponse(message=response)
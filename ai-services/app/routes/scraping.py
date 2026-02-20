from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict
from app.services.scraper_service import scraper_service
from app.services.claude_service import claude_service

router = APIRouter()

class ScrapeRequest(BaseModel):
    url: str
    project_id: str

class ScrapeResponse(BaseModel):
    insights: Dict
    suggestions: list

@router.post("/scrape", response_model=ScrapeResponse)
async def scrape_website(request: ScrapeRequest):
    """Scrape competitor website for insights"""
    try:
        # Scrape the website
        scraped_data = await scraper_service.scrape(request.url)
        
        # Analyze with Claude
        analysis_prompt = f"""
Analyze this competitor website data and provide actionable insights for a BRD:

URL: {request.url}
Title: {scraped_data.get('title', 'Unknown')}
Content Preview: {scraped_data.get('text', '')[:1000]}

Provide 3-5 specific suggestions in JSON format:
{{
  "insights": {{
    "competitive_advantages": [...],
    "feature_gaps": [...],
    "pricing_insights": [...]
  }},
  "suggestions": [
    {{"text": "...", "type": "requirement", "section": "..."}}
  ]
}}
"""
        
        analysis = await claude_service.generate_content(analysis_prompt)
        
        import json
        try:
            result = json.loads(analysis)
        except:
            result = {
                "insights": {"raw": analysis},
                "suggestions": []
            }
        
        return ScrapeResponse(**result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scraping failed: {str(e)}")
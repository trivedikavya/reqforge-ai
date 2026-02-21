from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List
from app.services.scraper_service import scraper_service
from app.services.gemini_service import gemini_service

router = APIRouter()

class ScrapeRequest(BaseModel):
    url: str
    project_id: str

class ScrapeResponse(BaseModel):
    insights: Dict
    suggestions: List[Dict]

@router.post("/scrape", response_model=ScrapeResponse)
async def scrape_website(request: ScrapeRequest):
    """Scrape competitor website for insights using Gemini"""
    try:
        # Scrape the website
        scraped_data = await scraper_service.scrape(request.url)
        
        # Analyze with Gemini
        analysis_prompt = f"""Analyze this competitor website data and provide actionable business insights:

URL: {request.url}
Title: {scraped_data.get('title', 'Unknown')}

KEY CONTENT:
{scraped_data.get('text', '')[:2000]}

HEADINGS FOUND:
{', '.join(scraped_data.get('headings', [])[:10])}

Provide a competitive analysis with:
1. Main product/service offerings
2. Key features highlighted
3. Competitive advantages (what they do well)
4. Potential gaps or weaknesses
5. 3-5 specific recommendations for our BRD

Return ONLY valid JSON in this format:
{{
  "insights": {{
    "main_offerings": "...",
    "key_features": ["feature1", "feature2"],
    "competitive_advantages": ["advantage1", "advantage2"],
    "gaps_identified": ["gap1", "gap2"]
  }},
  "suggestions": [
    {{
      "text": "Add feature X to match competitor capability",
      "type": "feature",
      "section": "functional_requirements",
      "priority": "high"
    }}
  ]
}}"""
        
        analysis = await gemini_service.generate_content_with_json(analysis_prompt, max_tokens=1500)
        
        # Ensure proper structure
        if not isinstance(analysis, dict):
            analysis = {"insights": {"summary": str(analysis)}, "suggestions": []}
        
        if 'insights' not in analysis:
            analysis['insights'] = {}
        if 'suggestions' not in analysis:
            analysis['suggestions'] = []
        
        return ScrapeResponse(
            insights=analysis.get('insights', {}),
            suggestions=analysis.get('suggestions', [])
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scraping failed: {str(e)}")
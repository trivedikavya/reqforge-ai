"""
Google Gemini AI Service
Using Google AI Studio API (free tier)
"""

import google.generativeai as genai
import os
from typing import Optional, List, Dict, Any
import json


class GeminiService:
    """Service for interacting with Google Gemini API"""
    
    def __init__(self):
        """Initialize Gemini API client"""
        api_key = os.getenv('GEMINI_API_KEY')
        
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable not set")
        
        genai.configure(api_key=api_key)
        
        # Use Gemini 1.5 Flash (free tier, fast, good quality)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Alternative: Use Gemini 1.5 Pro for better quality (also free)
        # self.model = genai.GenerativeModel('gemini-1.5-pro')
        
        print("✅ Gemini AI Service initialized")
    
    async def generate_content(
        self, 
        prompt: str, 
        max_tokens: int = 2000,
        temperature: float = 0.7
    ) -> str:
        """
        Generate content using Gemini API
        
        Args:
            prompt: Input prompt
            max_tokens: Maximum tokens to generate (Gemini uses this as guidance)
            temperature: Creativity level (0.0 to 1.0)
            
        Returns:
            Generated text content
        """
        try:
            # Configure generation parameters
            generation_config = genai.types.GenerationConfig(
                max_output_tokens=max_tokens,
                temperature=temperature,
            )
            
            # Generate content
            response = self.model.generate_content(
                prompt,
                generation_config=generation_config
            )
            
            # Extract text from response
            if response.text:
                return response.text
            else:
                print("⚠️  No text in Gemini response")
                return ""
                
        except Exception as e:
            print(f"❌ Gemini API error: {str(e)}")
            raise Exception(f"Failed to generate content: {str(e)}")
    
    async def generate_content_with_json(
        self, 
        prompt: str,
        max_tokens: int = 2000
    ) -> Dict[str, Any]:
        """
        Generate JSON content using Gemini
        
        Args:
            prompt: Input prompt (should request JSON output)
            max_tokens: Maximum tokens
            
        Returns:
            Parsed JSON dictionary
        """
        try:
            # Add JSON formatting instruction to prompt
            json_prompt = f"""{prompt}

IMPORTANT: Return ONLY valid JSON. No markdown, no code blocks, no explanations. Just pure JSON."""
            
            response_text = await self.generate_content(json_prompt, max_tokens=max_tokens)
            
            # Clean response - remove markdown code blocks if present
            cleaned_text = response_text.strip()
            
            # Remove ```json and ``` if present
            if cleaned_text.startswith('```json'):
                cleaned_text = cleaned_text[7:]
            elif cleaned_text.startswith('```'):
                cleaned_text = cleaned_text[3:]
            
            if cleaned_text.endswith('```'):
                cleaned_text = cleaned_text[:-3]
            
            cleaned_text = cleaned_text.strip()
            
            # Parse JSON
            try:
                return json.loads(cleaned_text)
            except json.JSONDecodeError:
                print(f"⚠️  Failed to parse JSON, returning as text wrapper")
                return {"content": cleaned_text}
                
        except Exception as e:
            print(f"❌ JSON generation error: {str(e)}")
            raise
    
    async def stream_content(self, prompt: str):
        """
        Stream content from Gemini (for future use)
        
        Args:
            prompt: Input prompt
            
        Yields:
            Text chunks as they're generated
        """
        try:
            response = self.model.generate_content(
                prompt,
                stream=True
            )
            
            for chunk in response:
                if chunk.text:
                    yield chunk.text
                    
        except Exception as e:
            print(f"❌ Gemini streaming error: {str(e)}")
            raise
    
    def count_tokens(self, text: str) -> int:
        """
        Count tokens in text (approximate)
        
        Args:
            text: Input text
            
        Returns:
            Approximate token count
        """
        try:
            result = self.model.count_tokens(text)
            return result.total_tokens
        except:
            # Fallback: rough estimate (1 token ≈ 4 characters)
            return len(text) // 4


# Singleton instance
gemini_service = GeminiService()
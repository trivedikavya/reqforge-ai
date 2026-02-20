import anthropic
import os
from typing import Optional

class ClaudeService:
    def __init__(self):
        self.client = anthropic.Anthropic(
            api_key=os.getenv('ANTHROPIC_API_KEY')
        )
        self.model = "claude-sonnet-4-20250514"
    
    async def generate_content(self, prompt: str, max_tokens: int = 2000) -> str:
        """Generate content using Claude"""
        try:
            message = self.client.messages.create(
                model=self.model,
                max_tokens=max_tokens,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            return message.content[0].text
            
        except Exception as e:
            print(f"Claude API error: {str(e)}")
            raise Exception(f"Failed to generate content: {str(e)}")
    
    async def stream_content(self, prompt: str):
        """Stream content from Claude"""
        try:
            with self.client.messages.stream(
                model=self.model,
                max_tokens=2000,
                messages=[{"role": "user", "content": prompt}]
            ) as stream:
                for text in stream.text_stream:
                    yield text
                    
        except Exception as e:
            print(f"Claude streaming error: {str(e)}")
            raise

claude_service = ClaudeService()
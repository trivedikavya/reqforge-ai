from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
from typing import Dict

class ScraperService:
    async def scrape(self, url: str) -> Dict:
        """Scrape website content"""
        try:
            async with async_playwright() as p:
                browser = await p.chromium.launch(headless=True)
                page = await browser.new_page()
                
                await page.goto(url, wait_until='domcontentloaded', timeout=30000)
                html = await page.content()
                await browser.close()
                
                soup = BeautifulSoup(html, 'html.parser')
                
                # Remove script and style elements
                for script in soup(["script", "style"]):
                    script.extract()
                
                text = soup.get_text()
                lines = (line.strip() for line in text.splitlines())
                chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
                text = ' '.join(chunk for chunk in chunks if chunk)
                
                return {
                    'url': url,
                    'title': soup.title.string if soup.title else '',
                    'text': text[:5000],  # Limit to 5000 chars
                    'meta_description': self._get_meta_description(soup),
                    'headings': [h.get_text() for h in soup.find_all(['h1', 'h2', 'h3'])[:10]]
                }
                
        except Exception as e:
            print(f"Scraping error: {str(e)}")
            raise Exception(f"Failed to scrape {url}: {str(e)}")
    
    def _get_meta_description(self, soup):
        """Extract meta description"""
        meta = soup.find('meta', attrs={'name': 'description'})
        return meta.get('content', '') if meta else ''

scraper_service = ScraperService()
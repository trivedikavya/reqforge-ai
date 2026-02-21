const axios = require('axios');
const cheerio = require('cheerio');

class ScraperService {
    /**
     * Scrapes text content from a given URL, attempting to extract the main meaningful text
     * while ignoring scripts, styles, and boilerplate navigation.
     * 
     * @param {string} url - The URL to scrape.
     * @returns {Promise<string>} The extracted text content.
     */
    async scrapeUrl(url) {
        try {
            // Basic validation
            if (!url || !url.startsWith('http')) {
                url = 'https://' + url;
            }

            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5'
                },
                timeout: 10000 // 10 second timeout
            });

            const html = response.data;
            const $ = cheerio.load(html);

            // Remove non-content elements
            $('script, style, noscript, nav, header, footer, iframe, img, svg').remove();

            // Extract text, try to get main content areas first if possible
            let textContent = '';

            const mainSelectors = ['main', 'article', '#content', '.content', '.main'];
            for (const selector of mainSelectors) {
                if ($(selector).length > 0) {
                    textContent += $(selector).text() + '\n';
                }
            }

            // If we didn't find specific main tags, just grab the body text
            if (!textContent.trim()) {
                textContent = $('body').text();
            }

            // Clean up the text: remove excess whitespace, empty lines, etc.
            const cleanedText = textContent
                .replace(/\s+/g, ' ')
                .replace(/\n\s*\n/g, '\n')
                .replace(/\t/g, '')
                .trim();

            // Truncate if it's absurdly long to prevent AI context window blowout
            // Assuming roughly 4 chars per token, 15000 chars is ~3-4k tokens
            const maxLength = 15000;
            if (cleanedText.length > maxLength) {
                return cleanedText.substring(0, maxLength) + '\n...[Content Truncated]...';
            }

            return cleanedText;

        } catch (error) {
            console.error(`Failed to scrape URL ${url}:`, error.message);
            throw new Error(`Could not extract content from ${url}. Please ensure the URL is accessible.`);
        }
    }
}

module.exports = new ScraperService();

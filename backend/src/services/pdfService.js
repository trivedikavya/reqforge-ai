const puppeteer = require('puppeteer');
const { marked } = require('marked');

class PDFService {
  async generatePDF(brd) {
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: 'new',
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
      });
      const page = await browser.newPage();

      // Convert Markdown to HTML
      const mdContent = typeof brd.content === 'object' ? JSON.stringify(brd.content) : brd.content;
      const htmlContent = marked.parse(mdContent || '# No Content');

      // Professional styling for the PDF
      const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <style>
              body {
                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 800px;
                  margin: 0 auto;
                  padding: 20px;
              }
              h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
              h2 { color: #2980b9; margin-top: 30px; }
              h3 { color: #34495e; }
              p { margin-bottom: 15px; }
              ul, ol { margin-bottom: 20px; }
              li { margin-bottom: 5px; }
              table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
              th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              th { background-color: #f8f9fa; font-weight: bold; }
              code { background-color: #f8f9fa; padding: 2px 4px; border-radius: 4px; font-family: monospace; }
              pre { background-color: #f8f9fa; padding: 15px; border-radius: 4px; overflow-x: auto; }
              blockquote { border-left: 4px solid #3498db; margin: 0; padding-left: 15px; color: #666; }
          </style>
      </head>
      <body>
          <h1>Business Requirements Document</h1>
          <hr>
          ${htmlContent}
      </body>
      </html>
      `;

      await page.setContent(htmlTemplate, { waitUntil: 'networkidle0' });

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
        printBackground: true
      });

      return pdfBuffer;
    } catch (error) {
      console.error("PDF Generation Error:", error);
      throw error;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}

module.exports = new PDFService();
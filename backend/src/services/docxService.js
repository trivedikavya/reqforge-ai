const HTMLToDOCX = require('html-to-docx');
const { marked } = require('marked');

class DOCXService {
  async generateDOCX(brd) {
    try {
      // Convert Markdown to HTML
      const mdContent = typeof brd.content === 'object' ? JSON.stringify(brd.content) : brd.content;
      const htmlContent = marked.parse(mdContent || '# No Content');

      // Add a professional title and wrapper to the HTML block
      const finalHtml = `
      <div style="font-family: Arial, sans-serif;">
        <h1 style="text-align: center; color: #2c3e50;">Business Requirements Document</h1>
        <hr />
        ${htmlContent}
      </div>
      `;

      // Convert the HTML straight to a DOCX Buffer
      const docxBuffer = await HTMLToDOCX(finalHtml, null, {
        table: { row: { cantSplit: true } },
        footer: true,
        pageNumber: true,
      });

      return docxBuffer;
    } catch (error) {
      console.error("DOCX Generation Error:", error);
      throw error;
    }
  }
}

module.exports = new DOCXService();
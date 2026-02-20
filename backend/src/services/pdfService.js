const PDFDocument = require('pdfkit');

class PDFService {
  async generatePDF(brd) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // Title
        doc.fontSize(24).text('Business Requirements Document', {
          align: 'center'
        });
        doc.moveDown();

        // Content
        if (brd.content) {
          Object.entries(brd.content).forEach(([key, section]) => {
            doc.fontSize(18).text(key.replace(/_/g, ' ').toUpperCase());
            doc.fontSize(12).text(
              typeof section === 'object' ? JSON.stringify(section, null, 2) : section
            );
            doc.moveDown();
          });
        }

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = new PDFService();
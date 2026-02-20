const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');

class DOCXService {
  async generateDOCX(brd) {
    const sections = [{
      children: [
        new Paragraph({
          text: 'Business Requirements Document',
          heading: HeadingLevel.HEADING_1
        }),
        new Paragraph({ text: '' })
      ]
    }];

    if (brd.content) {
      Object.entries(brd.content).forEach(([key, section]) => {
        sections[0].children.push(
          new Paragraph({
            text: key.replace(/_/g, ' ').toUpperCase(),
            heading: HeadingLevel.HEADING_2
          }),
          new Paragraph({
            text: typeof section === 'object' ? JSON.stringify(section, null, 2) : section
          }),
          new Paragraph({ text: '' })
        );
      });
    }

    const doc = new Document({ sections });
    return await Packer.toBuffer(doc);
  }
}

module.exports = new DOCXService();
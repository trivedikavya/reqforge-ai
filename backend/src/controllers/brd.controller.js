const BRD = require('../models/BRD.model');
const Project = require('../models/Project.model');
const pdfService = require('../services/pdfService');
const docxService = require('../services/docxService');
const aiService = require('../services/aiService');
const geminiClient = require('../services/geminiClient');

/**
 * NEW: Generates a BRD using Gemini AI based on user template and data
 */
exports.generateBRD = async (req, res) => {
  try {
    const { projectId, templateType, initialData } = req.body;

    // 1. Verify the project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // 2. Prepare the prompt for Gemini
    const templateInstructions = aiService.getTemplateInstructions(templateType);

    // Extract text context from any uploaded documents (if they were sent alongside)
    let documentContext = '';
    if (project.dataSources && project.dataSources.uploads && project.dataSources.uploads.length > 0) {
      documentContext = '\n--- Uploaded Document Context ---\n';
      project.dataSources.uploads.forEach((file, index) => {
        if (file.extractedText) {
          documentContext += `\nDocument ${index + 1} (${file.originalname}):\n${file.extractedText.substring(0, 15000)}\n`;
        }
      });
      documentContext += '\n--- End of Document Context ---\n';
    }

    const prompt = `
      Act as an expert Business Analyst. Generate a professional ${templateType} 
      Business Requirements Document (BRD) based on this input:
      
      "${initialData}"
      
      ${documentContext}

      ${templateInstructions}
      
      Format the output in clear Markdown ONLY. Do not wrap it in a JSON block. Just provide the raw markdown text.
    `;

    // 3. Call Gemini API
    const generatedContent = await geminiClient.executeWithRetry(prompt, "gemini-1.5-flash");

    // 4. Save or Update the BRD in MongoDB
    const brd = await BRD.findOneAndUpdate(
      { projectId: projectId },
      {
        content: generatedContent,
        updatedAt: Date.now()
      },
      { new: true, upsert: true } // Creates it if it doesn't exist
    );

    // 5. Update the Project status
    await Project.findByIdAndUpdate(projectId, { status: 'completed' });

    res.json({ success: true, brd });
  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate BRD with AI' });
  }
};

/**
 * EXISTING: Fetches the BRD for a specific project
 */
exports.getBRD = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const brd = await BRD.findOne({ projectId: req.params.projectId });

    if (!brd) {
      return res.status(404).json({ error: 'BRD not generated yet' });
    }

    res.json({ brd });
  } catch (error) {
    console.error('Get BRD error:', error);
    res.status(500).json({ error: 'Failed to fetch BRD' });
  }
};

/**
 * EXISTING: Manually updates BRD content (used by the Chat interface)
 */
exports.updateBRD = async (req, res) => {
  try {
    const brd = await BRD.findOneAndUpdate(
      { projectId: req.params.projectId },
      { ...req.body, updatedAt: Date.now() },
      { new: true, upsert: true }
    );

    res.json({ brd });
  } catch (error) {
    console.error('Update BRD error:', error);
    res.status(500).json({ error: 'Failed to update BRD' });
  }
};

/**
 * EXISTING: Exports the BRD to PDF or DOCX
 */
exports.exportBRD = async (req, res) => {
  try {
    const { format } = req.body;
    const brd = await BRD.findOne({ projectId: req.params.projectId });

    if (!brd) {
      return res.status(404).json({ error: 'BRD not found' });
    }

    if (format === 'pdf') {
      const pdfBuffer = await pdfService.generatePDF(brd);
      res.contentType('application/pdf');
      res.send(pdfBuffer);
    } else if (format === 'docx') {
      const docxBuffer = await docxService.generateDOCX(brd);
      res.contentType('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.send(docxBuffer);
    } else {
      res.status(400).json({ error: 'Invalid format' });
    }
  } catch (error) {
    console.error('Export BRD error:', error);
    res.status(500).json({ error: 'Failed to export BRD' });
  }
};
const BRD = require('../models/BRD.model');
const Project = require('../models/Project.model');
const pdfService = require('../services/pdfService');
const docxService = require('../services/docxService');

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
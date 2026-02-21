const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Project = require('../models/Project.model');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.docx', '.txt', '.json'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
}).array('files', 10);

exports.uploadFiles = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const processedFiles = [];

      for (const f of req.files) {
        let extractedText = null;
        const filePath = f.path;
        const ext = path.extname(f.originalname).toLowerCase();

        try {
          if (ext === '.txt' || ext === '.json') {
            extractedText = fs.readFileSync(filePath, 'utf8');
          } else if (ext === '.pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            const pdfData = await pdfParse(dataBuffer);
            extractedText = pdfData.text;
          } else if (ext === '.docx') {
            const docxData = await mammoth.extractRawText({ path: filePath });
            extractedText = docxData.value;
          }
        } catch (extractErr) {
          console.error(`Failed to extract text from ${f.originalname}:`, extractErr);
          // Fallback if extraction fails
          extractedText = `[Extraction failed for ${f.originalname}]`;
        }

        processedFiles.push({
          filename: f.filename,
          originalname: f.originalname,
          path: filePath,
          size: f.size,
          extractedText: extractedText,
          uploadedAt: new Date()
        });
      }

      if (req.body.projectId) {
        await Project.findByIdAndUpdate(req.body.projectId, {
          $push: { 'dataSources.uploads': { $each: processedFiles } }
        });
      }

      res.json({
        success: true,
        files: processedFiles.map(f => ({
          filename: f.filename,
          originalname: f.originalname,
          size: f.size
        }))
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Upload failed' });
    }
  });
};
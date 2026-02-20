const multer = require('multer');
const path = require('path');
const Project = require('../models/Project.model');

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
      const files = req.files.map(f => ({
        filename: f.filename,
        originalname: f.originalname,
        path: f.path,
        size: f.size,
        uploadedAt: new Date()
      }));

      if (req.body.projectId) {
        await Project.findByIdAndUpdate(req.body.projectId, {
          $push: { 'dataSources.uploads': { $each: files } }
        });
      }

      res.json({ 
        success: true, 
        files: files.map(f => ({
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
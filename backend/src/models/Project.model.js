const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  templateType: {
    type: String,
    enum: ['comprehensive', 'standard', 'agile'],
    default: 'comprehensive'
  },
  status: {
    type: String,
    enum: ['draft', 'in_review', 'approved', 'archived'],
    default: 'draft'
  },
  dataSources: {
    uploads: [{
      filename: String,
      originalname: String,
      path: String,
      size: Number,
      extractedText: String,
      uploadedAt: Date
    }]
  },
  progress: {
    completionPercentage: {
      type: Number,
      default: 0
    },
    sectionsCompleted: {
      type: Number,
      default: 0
    },
    totalSections: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', projectSchema);
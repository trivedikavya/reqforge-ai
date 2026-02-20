const mongoose = require('mongoose');

const brdSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    unique: true
  },
  templateType: {
    type: String,
    required: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  conflicts: [{
    id: String,
    type: String,
    description: String,
    status: {
      type: String,
      enum: ['open', 'resolved', 'ignored'],
      default: 'open'
    },
    resolutionOptions: [mongoose.Schema.Types.Mixed]
  }],
  marketIntelligence: [{
    url: String,
    scrapedAt: Date,
    insights: mongoose.Schema.Types.Mixed
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('BRD', brdSchema);
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  logoUrl: {
    type: String,
    required: true
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
  // Add other fields as needed
});

module.exports = mongoose.model('Job', jobSchema);

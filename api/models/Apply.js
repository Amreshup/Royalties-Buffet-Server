// Apply.js (Mongoose model)
const mongoose = require('mongoose');

const applySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  resume: {
    type: String,
  
  },
  position: {
    type: String, // Ensure position is defined as required
    required: true
  }
});

const Apply = mongoose.model('Apply', applySchema);

module.exports = Apply;

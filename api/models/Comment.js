// models/Comment.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
  userName: { type: String, required: true },
  foodName: { type: String, required: true },
  ratingEmoji: {
    type: String, // Store rating emoji as a string
    required: true
  },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;

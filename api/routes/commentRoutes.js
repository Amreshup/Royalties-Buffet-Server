// routes/comments.js
const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// Function to map numerical rating to emoji representation
function getRatingEmoji(rating) {
  // Define the mapping of ratings to emojis
  const ratingEmojiMap = {
    1: '⭐',
    2: '⭐⭐',
    3: '⭐⭐⭐',
    4: '⭐⭐⭐⭐',
    5: '⭐⭐⭐⭐⭐'
  };

  // Return the corresponding emoji for the rating
  return ratingEmojiMap[rating] || '';
}

// Route to get all comments with pagination
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 3; // Set the limit to 3 comments per page

  try {
    const totalCount = await Comment.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);

    const comments = await Comment.find()
      .skip((page - 1) * limit)
      .limit(limit);

      res.json({ comments, currentPage: page, totalPages });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

// Route to create a new comment
router.post('/', async (req, res) => {
  const { foodName, rating, comment, userName } = req.body;

  // Get the emoji representation of the rating
  const ratingEmoji = getRatingEmoji(rating);

  const newComment = new Comment({
    foodName,
    ratingEmoji, // Use ratingEmoji instead of rating
    comment,
    userName
  });

  try {
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to delete a comment by ID
router.delete('/:id', async (req, res) => {
  const commentId = req.params.id;

  try {
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if (!deletedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.status(200).json({ message: 'Comment deleted successfully', deletedComment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router({ mergeParams: true });

const {
  getComments,
  createComment,
} = require('../controllers/commentController');

const Comment = require('../models/tweetModel');
const { protect, checkOwnership } = require('../middleware/authMiddleware');

// prettier-ignore
router.route('/').get(getComments).post(protect, createComment);

router.route('/:id');

module.exports = router;

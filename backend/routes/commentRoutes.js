const express = require('express');
const router = express.Router({ mergeParams: true });
const Comment = require('../models/commentModel');
const { protect, checkOwnership } = require('../middleware/authMiddleware');

const {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} = require('../controllers/commentController');

// prettier-ignore
router.route('/')
  .get(getComments)
  .post(protect, createComment);

// prettier-ignore
router.route('/:id')
  .patch(protect, checkOwnership(Comment), updateComment)
  .delete(protect, checkOwnership(Comment), deleteComment)

module.exports = router;

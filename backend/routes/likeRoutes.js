const express = require('express');
const router = express.Router({ mergeParams: true });
const Like = require('../models/likeModel');
const { protect, checkOwnership } = require('../middleware/authMiddleware');

const {
  getLikes,
  addLike,
  removeLike,
} = require('../controllers/likeController');

// prettier-ignore
router.route('/')
  .get(getLikes)
  .post(protect, addLike)

// prettier-ignore
router.route('/:id')
  .delete(protect, checkOwnership(Like), removeLike)

module.exports = router;

const express = require('express');
const router = express.Router({ mergeParams: true });
const Like = require('../models/likeModel');
const { protect, checkOwnership } = require('../middleware/authMiddleware');

const {
  getLikes,
  getLikeUsers,
  createLike,
  deleteLike,
} = require('../controllers/likeController');

// prettier-ignore
router.route('/')
  .get(getLikes)
  .post(protect, createLike)

// prettier-ignore
router.route('/users')
  .get(getLikeUsers)

// prettier-ignore
router.route('/:id')
  .delete(protect, checkOwnership(Like), deleteLike)

module.exports = router;

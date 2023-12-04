const express = require('express');
const router = express.Router({ mergeParams: true });
const Retweet = require('../models/retweetModel');
const { protect, checkOwnership } = require('../middleware/authMiddleware');

const {
  getRetweets,
  createRetweet,
  deleteRetweet,
} = require('../controllers/retweetController');

// prettier-ignore
router.route('/')
  .get(getRetweets)
  .post(protect, createRetweet)

// prettier-ignore
router.route('/:id')
  .delete(protect, checkOwnership(Retweet), deleteRetweet)

module.exports = router;

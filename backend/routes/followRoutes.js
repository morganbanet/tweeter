const express = require('express');
const router = express.Router({ mergeParams: true });
const Follow = require('../models/followModel');
const { protect, checkOwnership } = require('../middleware/authMiddleware');

const {
  getFollowing,
  getFollowers,
  followUser,
  unfollowUser,
} = require('../controllers/followController');

// prettier-ignore
router.route('/followers')

// prettier-ignore
router.route('/')
  .get(getFollowing)
  .post(protect, followUser)

// prettier-ignore
router.route('/:id')
  .delete(protect, checkOwnership(Follow), unfollowUser)

module.exports = router;

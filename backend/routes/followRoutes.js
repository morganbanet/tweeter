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

router.route('/followers').get(getFollowers);
router.route('/following').get(getFollowing);
router.route('/').post(protect, followUser);
router.route('/:id').delete(protect, checkOwnership(Follow), unfollowUser);

module.exports = router;

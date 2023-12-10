const express = require('express');
const router = express.Router({ mergeParams: true });
const followRouter = require('./followRoutes');
const { protect, checkOwnership } = require('../middleware/authMiddleware');

const {
  getAllUsers,
  getSingleUser,
  getUserTweets,
  getUserComments,
  getUserLikes,
  getUserRetweets,
  getUserBookmarks,
} = require('../controllers/userController');

router.use('/:userId/follows', followRouter);

// prettier-ignore
router.route('/').get(getAllUsers)
router.route('/bookmarks').get(protect, getUserBookmarks);
router.route('/:id').get(getSingleUser);
router.route('/:id/tweets').get(getUserTweets);
router.route('/:id/comments').get(getUserComments);
router.route('/:id/likes').get(getUserLikes);
router.route('/:id/retweets').get(getUserRetweets);

module.exports = router;

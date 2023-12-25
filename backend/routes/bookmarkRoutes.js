const express = require('express');
const router = express.Router({ mergeParams: true });
const Bookmark = require('../models/bookmarkModel');
const { protect, checkOwnership } = require('../middleware/authMiddleware');

const {
  getBookmarks,
  getBookmarkUsers,
  createBookmark,
  deleteBookmark,
} = require('../controllers/bookmarkController');

// prettier-ignore
router.route('/')
  .get(getBookmarks)
  .post(protect, createBookmark)

// prettier-ignore
router.route('/users')
  .get(getBookmarkUsers)

// prettier-ignore
router.route('/:id')
  .delete(protect, checkOwnership(Bookmark), deleteBookmark)

module.exports = router;

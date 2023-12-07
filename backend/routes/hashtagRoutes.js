const express = require('express');
const router = express.Router();

const { getTrendingHashtags } = require('../controllers/hashtagController');

// prettier-ignore
router.route('/').get(getTrendingHashtags)

// prettier-ignore
router.route('/:id')

module.exports = router;

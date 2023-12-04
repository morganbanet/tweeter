const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/userModel');
const followRouter = require('./followRoutes');
const { protect, checkOwnership } = require('../middleware/authMiddleware');

const {} = require('../controllers/userController');

router.use('/:userId/follows', followRouter);

// prettier-ignore
router.route('/')

// prettier-ignore
router.route('/:id')

module.exports = router;

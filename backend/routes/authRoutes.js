const express = require('express');

const { registerUser } = require('../controllers/authControllers');

const router = express.Router();

router.route('/register').post(registerUser);

module.exports = router;

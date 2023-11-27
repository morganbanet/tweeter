const User = require('../models/userModel');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const generateToken = require('../utils/generateToken');

// @desc        Register user
// @route       POST /api/auth/register
// @access      Public
exports.registerUser = asyncHandler(async (req, res, next) => {
  console.log('test');

  const { name, email, password } = req.body;

  if ((!name, !email, !password)) {
    return next(new ErrorResponse('Please fill in all fields', 400));
  }

  const user = await User.create({ name, email, password });

  const { token, options } = generateToken(user);

  res.status(201).cookie(token, options).json({ success: true, data: user });
});

// @desc        Login user
// @route       POST /api/auth/login
// @access      Public
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if ((!email, !password)) {
    return next(new ErrorResponse('Please enter an email and password', 400));
  }

  // Generate token with external helper function

  // Respond
});

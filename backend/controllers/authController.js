const User = require('../models/userModel');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

const {
  passwordResetText,
  passwordResetHtml,
} = require('../utils/emailTemplates');

// @desc        Register user & generate token
// @route       POST /api/auth/register
// @access      Public
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new ErrorResponse('User already exists with that email', 401));
  }

  const user = await User.create({ name, email, password });

  const { token, options } = generateToken(user);

  res
    .status(201)
    .cookie('jwt', token, options)
    .json({ success: true, data: user });
});

// @desc        Login user & generate token
// @route       POST /api/auth/login
// @access      Public
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if ((!email, !password)) {
    return next(new ErrorResponse('Please enter an email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  const { token, options } = generateToken(user);

  res
    .status(200)
    .cookie('jwt', token, options)
    .json({ success: true, data: user });
});

// @desc        Logout user & clear token
// @route       POST /api/auth/logout
// @access      Private
exports.logoutUser = asyncHandler(async (req, res, next) => {
  res.clearCookie('jwt');

  res.status(200).json({ success: true, data: {} });
});

// @desc        Get current user
// @route       POST /api/auth/profile
// @access      Private
exports.userProfile = asyncHandler(async (req, res, next) => {
  const user = req.user;

  res.status(200).json({ success: true, data: user });
});

// @desc        Update user details
// @route       POST /api/auth/updatedetails
// @access      Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({ success: true, data: user });
});

// @desc        Update password
// @route       POST /api/auth/updatepassword
// @access      Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  const isMatch = await user.matchPassword(req.body.currentPassword);

  if (!isMatch) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  const { token, options } = generateToken(user);

  res
    .status(200)
    .cookie('jwt', token, options)
    .json({ success: true, data: user });
});

// @desc        Forgot Password
// @route       PUT /api/auth/forgotpassword
// @access      Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('User does not exist with that email', 404));
  }

  // Generate and apply the password reset token to the document
  const resetToken = user.getPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/auth/resetpassword/${resetToken}`;

  // Send the email
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset instructions for Tweeter account',
      text: passwordResetText(user.email, resetUrl),
      html: passwordResetHtml(user.email, resetUrl),
    });
  } catch (error) {
    // Clear password reset tokens on the user document
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse('Email could not be sent', 500));
  }

  return res.status(200).json({ success: true, data: 'Email sent!' });
});

// @desc        Reset password
// @route       PUT /api/auth/tokenId/resetpassword/:resettoken
// @access      Private

// @desc        Upload avatar
// @route       POST /api/auth/avatar
// @access      Private

// @desc        Update avatar
// @route       PUT /api/auth/avatar
// @access      Private

// @desc        Upload banner
// @route       POST /api/auth/banner
// @access      Private

// @desc        Update banner
// @route       PUT /api/auth/banner
// @access      Private

// @desc        Delete user
// @route       DELETE /api/auth/delete
// @access      Private

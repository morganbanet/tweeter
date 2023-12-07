const crypto = require('crypto');
const User = require('../models/userModel');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const { uploadFile, deleteFile } = require('../utils/storageBucket');
const Tweet = require('../models/tweetModel');
const Comment = require('../models/commentModel');
const Like = require('../models/likeModel');

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

// @desc        Update user bio
// @route       PATCH /api/auth/bio
// @access      Private
exports.updateBio = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    bio: req.body.bio,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    runValidators: true,
    new: true,
  });

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

  if (!req.body.currentPassword) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

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

// @desc        Forgot password
// @route       PUT /api/auth/forgotpassword
// @access      Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('User does not exist with that email', 404));
  }

  // Generate and apply password reset token and expiry to user document
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
    // Clear password reset token and expiry on the user document
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse('Email could not be sent', 500));
  }

  return res.status(200).json({ success: true, data: 'Email sent!' });
});

// @desc        Reset password
// @route       PUT /api/auth/tokenId/resetpassword/:resettoken
// @access      Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Hash the token from req.params
  const passwordResetToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  // Find user document that has the token, ensuring the expiry date
  // is greater than the current date
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid Token', 400));
  }

  // Set the new password in user document, clear token and expiry
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;
  await user.save();

  // Reset JSON web token
  const { token, options } = generateToken(user);

  res
    .status(200)
    .cookie('jwt', token, options)
    .json({ success: true, data: user });
});

// @desc        Delete user
// @route       DELETE /api/auth/delete
// @access      Private
exports.deleteUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.user.id).select('+password');

  if (!req.body.password) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  const isMatch = await user.matchPassword(req.body.password);

  if (!isMatch) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  // Pre-delete middleware on model?

  // @Todo: Delete user following
  // @Todo: Delete user bookmarks
  // @Todo: Delete user retweets
  // @Todo: Delete user likes

  // @Todo: Delete user comments and all associated comments data:
  // Comment likes
  // Delete comment bucket files
  // Delete comments

  // @Todo: Delete user tweets and all associated tweets data:
  // Comment likes
  // Delete comment bucket files
  // Delete comments
  // Tweet likes
  // Retweets
  // Bookmarks
  // Delete tweet bucket files
  // Tweet

  // Delete comments & bucket files
  const comments = await Comment.find({ user: req.user.id });
  comments.forEach(async (comm) => await deleteFile(comm, 'image', false));
  await Comment.deleteMany({ user: req.user.id });

  // Delete tweets & bucket files
  const tweets = await Tweet.find({ user: req.user.id });
  tweets.forEach(async (tweet) => await deleteFile(tweet, 'image', false));
  await Tweet.deleteMany({ user: user.id });

  // Delete likes
  await Like.deleteMany({ user: req.user.id });

  // Delete user avatar and banner & bucket files
  await deleteFile(user, 'avatar', false);
  await deleteFile(user, 'banner', false);

  // Delete user
  await user.deleteOne();

  res.status(200).clearCookie('jwt').json({ success: true, data: {} });
});

// @desc        Upload avatar
// @route       POST /api/auth/avatar
// @access      Private
exports.uploadAvatar = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const file = req.files.file;

  await uploadFile(file, user, 'avatar', 'avatars');

  res.status(200).json({ success: true, data: user.avatar });
});

// @desc        Delete avatar
// @route       DELETE /api/auth/avatar
// @access      Private
exports.deleteAvatar = asyncHandler(async (req, res, next) => {
  const user = req.user;

  if (!user.avatar.filename) {
    return next(
      new ErrorResponse('No avatar currently exists for this user', 400)
    );
  }

  await deleteFile(user, 'avatar');

  res.status(200).json({ success: true, data: user });
});

// @desc        Upload banner
// @route       POST /api/auth/banner
// @access      Private
exports.uploadBanner = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const file = req.files.file;

  await uploadFile(file, user, 'banner', 'banners');

  res.status(200).json({ success: true, data: user.banner });
});

// @desc        Delete banner
// @route       DELETE /api/auth/banner
// @access      Private
exports.deleteBanner = asyncHandler(async (req, res, next) => {
  const user = req.user;

  if (!user.banner.filename) {
    return next(
      new ErrorResponse('No banner currently exists for this user', 400)
    );
  }

  await deleteFile(user, 'banner');

  res.status(200).json({ success: true, data: user });
});

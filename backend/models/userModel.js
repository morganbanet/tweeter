const mongoose = require('mongoose');
const slugify = require('slugify');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const Like = require('./likeModel');
const Retweet = require('./retweetModel');
const Bookmark = require('./bookmarkModel');
const Tweet = require('./tweetModel');
const Comment = require('./commentModel');
const Follow = require('./followModel');
const { deleteFile } = require('../utils/storageBucket');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Username cannot be blank'],
      maxLength: [36, 'Username cannot exceed 36 characters'],
      trim: true,
    },
    email: {
      type: String,
      unique: [true, 'Email already in use'],
      required: [true, 'Email cannot be blank'],
      maxlength: [254, 'Email cannot exceed 254 characters'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    avatar: {
      url: String,
      filename: String,
    },
    banner: {
      url: String,
      filename: String,
    },
    bio: {
      type: String,
      maxLength: [160, 'Bio cannot exceed 160 characters.'],
      default: `Say Hi, I'm new to Tweeter! 👋`,
    },
    password: {
      type: String,
      required: [true, 'Password cannot be blank'],
      minlength: [6, 'Password must be a minimum of 6 characters'],
      select: false,
      match: [
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
        'Password must be a minimum of 6 characters, at least one letter, and one number',
      ],
    },
    passwordResetToken: String,
    passwordResetExpire: Date,
    slug: String,
  },
  {
    timestamps: true,
  }
);

userSchema.pre(['deleteOne', 'deletMany'], async function (next) {
  const user = await this.model.findOne(this.getQuery());

  if (user) {
    await Like.deleteMany({ user: user.id });
    await Bookmark.deleteMany({ user: user.id });
    await Retweet.deleteMany({ user: user.id });

    await Comment.deleteMany({ user: user.id });
    await Tweet.deleteMany({ user: user.id });

    await Follow.deleteMany({ user: user.id });
    await Follow.deleteMany({ following: user.id });

    await deleteFile(user, 'banner', false);
    await deleteFile(user, 'avatar', false);
  }

  next();
});

// Create slug from User name
userSchema.pre('save', async function (next) {
  if (!this.isModified('name')) next();
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Hash passwords
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password reset token with Node crypto module
userSchema.methods.getPasswordResetToken = function () {
  // Create token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token & set into passwordResetToken field on document
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set the tokens expiry timeframe & set into passwordResetExpire
  this.passwordResetExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

module.exports = mongoose.model('User', userSchema);

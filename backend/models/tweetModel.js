const mongoose = require('mongoose');

likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    body: {
      type: String,
      required: [true, 'Comment must contain some text'],
      maxLength: [280, 'Comment cannot exceeed 280 characters'],
    },
    image: {
      url: String,
      filename: String,
    },
    likes: [likeSchema],
  },
  {
    timestamps: true,
  }
);

const retweetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

const savedSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

const tweetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    body: {
      required: [true, 'Tweet must contain a body'],
      maxLength: [280, 'Tweet cannot exceed 280 characters'],
    },
    image: {
      url: String,
      filename: String,
    },
    public: {
      type: Boolean,
      default: true,
    },
    comments: [commentSchema],
    likes: [likeSchema],
    retweets: [retweetSchema],
    saved: [savedSchema],
  },
  {
    timestamps: true,
  }
);

export const Tweet = mongoose.model('Tweet', tweetSchema);

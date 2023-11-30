const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    text: {
      type: String,
      required: [true, 'Tweet must contain a body'],
      maxLength: [280, 'Tweet cannot exceed 280 characters'],
    },
    image: {
      url: String,
      filename: String,
    },
    public: {
      type: Boolean,
      required: true,
      default: true,
    },
    comments: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Comment',
      },
    ],
    likes: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Like',
      },
    ],
    retweets: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Retweet',
      },
    ],
    saved: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Saved',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Tweet', tweetSchema);

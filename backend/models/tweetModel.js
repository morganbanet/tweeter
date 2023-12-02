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
    retweets: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User',
      },
    ],
    saved: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Tweet', tweetSchema);

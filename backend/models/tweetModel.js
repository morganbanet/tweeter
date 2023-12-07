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
    private: {
      type: Boolean,
      required: true,
      default: false,
    },
    hashtags: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Hashtag',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Tweet', tweetSchema);

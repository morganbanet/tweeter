const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    tweet: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Tweet',
    },
    text: {
      type: String,
      required: [true, 'Comment must contain some text'],
      maxLength: [280, 'Comment cannot exceeed 280 characters'],
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
    likes: [
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

module.exports = mongoose.model('Comment', commentSchema);

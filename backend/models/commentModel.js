const mongoose = require('mongoose');

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
    likes: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Like',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Comment', commentSchema);

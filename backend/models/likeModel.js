const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    liked: {
      type: mongoose.Types.ObjectId,
      required: true,
      refPath: 'likedType',
    },
    likedType: {
      type: String,
      required: true,
      enum: ['Tweet', 'Comment'],
    },
  },
  {
    timestamps: true,
  }
);

// Make sure user can only like a post once
likeSchema.index({ liked: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema);

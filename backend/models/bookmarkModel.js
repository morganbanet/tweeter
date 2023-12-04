const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    bookmarked: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Tweet',
    },
    private: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Make sure user can only retweet a post once
bookmarkSchema.index({ bookmarked: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);

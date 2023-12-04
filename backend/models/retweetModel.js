const mongoose = require('mongoose');

const retweetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    retweeted: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Tweet',
    },
  },
  {
    timestamps: true,
  }
);

// Make sure user can only retweet a post once
retweetSchema.index({ retweeted: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Retweet', retweetSchema);

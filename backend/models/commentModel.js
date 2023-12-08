const mongoose = require('mongoose');
const Like = require('./likeModel');

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

commentSchema.pre('deleteOne', async function (next) {
  await Like.deleteMany({ liked: this._conditions._id });
  next();
});

module.exports = mongoose.model('Comment', commentSchema);

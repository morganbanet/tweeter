const mongoose = require('mongoose');
const Like = require('./likeModel');

const { deleteFile } = require('../utils/storageBucket');
const { removeHashtags } = require('../utils/hashtagHelper');

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
    hashtags: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Hashtag',
      },
    ],
    likeCount: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.methods.modifyCount = async function (field, val) {
  if (val === +1) {
    this[field] += 1;
    await this.save();
  }

  if (val === -1) {
    this[field] -= 1;
    await this.save();
  }
};

commentSchema.pre(['deleteOne', 'deleteMany'], async function (next) {
  const comments = await this.model.find(this.getQuery());

  if (comments) {
    for (const comment of comments) {
      await Like.deleteMany({ liked: comment.id });
      await removeHashtags(comment);
      await deleteFile(comment, 'image', false);
    }
  }

  next();
});

module.exports = mongoose.model('Comment', commentSchema);

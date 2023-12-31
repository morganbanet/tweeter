const mongoose = require('mongoose');

const Like = require('./likeModel');
const Retweet = require('./retweetModel');
const Bookmark = require('./bookmarkModel');
const Comment = require('./commentModel');
const { removeHashtags } = require('../utils/hashtagHelper');
const { deleteFile } = require('../utils/storageBucket');

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
    likeCount: {
      type: Number,
      min: 0,
      default: 0,
    },
    retweetCount: {
      type: Number,
      min: 0,
      default: 0,
    },
    bookmarkCount: {
      type: Number,
      min: 0,
      default: 0,
    },
    commentCount: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

tweetSchema.methods.modifyCount = async function (field, val) {
  if (val === +1) {
    this[field] += 1;
    await this.save();
  }

  if (val === -1) {
    this[field] -= 1;
    await this.save();
  }
};

tweetSchema.pre(['deleteOne', 'deleteMany'], async function (next) {
  const tweets = await this.model.find(this.getQuery());

  if (tweets) {
    for (const tweet of tweets) {
      await Comment.deleteMany({ tweet: tweet.id });
      await Like.deleteMany({ liked: tweet.id });
      await Retweet.deleteMany({ retweeted: tweet.id });
      await Bookmark.deleteMany({ bookmarked: tweet.id });

      await removeHashtags(tweet);
      await deleteFile(tweet, 'image', false);
    }
  }

  next();
});

module.exports = mongoose.model('Tweet', tweetSchema);

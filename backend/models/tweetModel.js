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
  },
  {
    timestamps: true,
  }
);

tweetSchema.pre(['deleteOne', 'deleteMany'], async function (next) {
  const tweet = await this.model.findOne(this.getQuery());

  if (tweet) {
    await Comment.deleteMany({ tweet: tweet.id });
    await Like.deleteMany({ liked: tweet.id });
    await Retweet.deleteMany({ retweeted: tweet.id });
    await Bookmark.deleteMany({ bookmarked: tweet.id });

    await removeHashtags(tweet);
    await deleteFile(tweet, 'image', false);
  }

  next();
});

module.exports = mongoose.model('Tweet', tweetSchema);

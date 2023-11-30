const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

const retweetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

const savedSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

const Like = mongoose.model('Like', likeSchema);
const Retweet = mongoose.model('Retweet', retweetSchema);
const Saved = mongoose.model('Saved', savedSchema);

module.exports = { Like, Retweet, Saved };

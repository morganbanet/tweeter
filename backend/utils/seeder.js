require('dotenv').config({ path: './secrets/.env' });

const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');

const User = require('../models/userModel');
const Follow = require('../models/likeModel');
const Tweet = require('../models/tweetModel');
const Comment = require('../models/commentModel');
const Like = require('../models/likeModel');
const Retweet = require('../models/retweetModel');
const Bookmark = require('../models/bookmarkModel');

const { createHashtags, removeHashtags } = require('../utils/hashtagHelper');
const { uploadFile } = require('../utils/storageBucket');

mongoose.connect(process.env.MONGO_URI);
console.log('Database connected');

const parseJson = (filename) => {
  const file = `${__dirname}/../_data/${filename}.json`;
  return JSON.parse(fs.readFileSync(file));
};

// Json files used for seeding
const users = parseJson('users');
// const follows = parseJson('follows');
// const tweets = parseJson('tweets');
// const comments = parseJson('comments');
// const likes = parseJson('likes');
// const retweets = parseJson('retweets');
// const bookmarks = parseJson('bookmarks');

// Import data
const importData = async () => {
  try {
    console.log('Seeding database...'.bgYellow);

    // Flush data first
    await Like.deleteMany();
    await Retweet.deleteMany();
    await Bookmark.deleteMany();
    await Comment.deleteMany();
    await Tweet.deleteMany();
    await Follow.deleteMany();
    await User.deleteMany();

    // Insert sample users
    const insertedUsers = await User.create(users);

    console.log('Database successfuly seeded!'.bgGreen);

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// Flush data
const flushData = async () => {
  try {
    console.log('Flushing database...'.bgYellow);

    await Like.deleteMany();
    await Retweet.deleteMany();
    await Bookmark.deleteMany();
    await Comment.deleteMany();
    await Tweet.deleteMany();
    await Follow.deleteMany();
    await User.deleteMany();

    console.log('Database successfully flushed!'.bgGreen);

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// Check command flags
if (process.argv[2] === '-f') {
  flushData();
} else {
  importData();
}

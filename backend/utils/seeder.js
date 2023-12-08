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
const { uploadFile, deleteFile } = require('../utils/storageBucket');

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
  console.log('Flushing old data before seeding...'.bgYellow);
  await flushData(true);

  try {
    console.log('Seeding database...'.bgYellow);
    // Insert sample users
    const insertedUsers = await User.create(users);

    for (let x = 0; x < insertedUsers.length; x++) {
      const insertedUser = insertedUsers[x];

      let userId = JSON.stringify(insertedUser._id).split(`"`)[1];
      const user = await User.findById(userId);

      const file = {
        name: `avatar_${x + 1}.jpg`,
        path: `${__dirname}/../_data/images/avatars/avatar_${x + 1}.jpg`,
      };

      const options = { local: true };
      await uploadFile(file, user, 'avatar', 'avatars', options);
    }

    console.log('Database successfuly seeded!'.bgGreen);

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// Flush data
const flushData = async (preSeed = false) => {
  try {
    !preSeed && console.log('Flushing database...'.bgYellow);

    await Like.deleteMany();
    await Retweet.deleteMany();
    await Bookmark.deleteMany();
    await Comment.deleteMany();
    await Tweet.deleteMany();
    await Follow.deleteMany();
    await User.deleteMany();

    !preSeed && console.log('Database successfully flushed!'.bgGreen);

    !preSeed && process.exit();
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

require('dotenv').config({ path: './secrets/.env' });

const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');

const User = require('../models/userModel');
const Follow = require('../models/followModel');
const Tweet = require('../models/tweetModel');
const Comment = require('../models/commentModel');
const Like = require('../models/likeModel');
const Retweet = require('../models/retweetModel');
const Bookmark = require('../models/bookmarkModel');

const { createHashtags, removeHashtags } = require('./hashtagHelper');
const { uploadFile, deleteFile } = require('./storageBucket');

mongoose.connect(process.env.MONGO_URI);
console.log('Database connected');

const parseJson = (filename) => {
  const file = `${__dirname}/../_data/${filename}.json`;
  return JSON.parse(fs.readFileSync(file));
};

// Json files used for seeding
const users = parseJson('users');
const tweets = parseJson('tweets');
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
      // Get insertedUser id in string format
      let userId = JSON.stringify(insertedUsers[x]._id).split(`"`)[1];
      const user = await User.findById(userId);

      // User sample image files config
      const avatar = {
        name: `avatar_${x + 1}.jpg`,
        path: `${__dirname}/../_data/images/avatars/avatar_${x + 1}.jpg`,
      };
      const banner = {
        name: `banner_${x + 1}.jpg`,
        path: `${__dirname}/../_data/images/banners/banner_${x + 1}.jpg`,
      };

      // Upload sample avatar & banner for each user
      const options = { local: true };
      // await uploadFile(avatar, user, 'avatar', 'avatars', options);
      // await uploadFile(banner, user, 'banner', 'banners', options);

      // Generate following & followers for each user
      const amountToFollow = Math.floor(Math.random() * 8) + 2;

      // prettier-ignore
      function getRandomNumberNoRepeat(length) {
        let numToPick = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,16,18,19];
        return numToPick.sort(() => Math.random() - 0.5).slice(0, length);
      }

      // Get an array of unique numbers
      const usersToFollow = getRandomNumberNoRepeat(amountToFollow);

      // Use the unique numbers as the index of insertedUsers
      for (let x = 0; x < usersToFollow.length; x++) {
        const randomUserIndex = usersToFollow[x];

        const userToFollow = JSON.stringify(
          insertedUsers[randomUserIndex]._id
        ).split(`"`)[1];

        const followToCreate = { user, following: userToFollow };

        await Follow.create(followToCreate);
      }

      let tweetIndex = x;

      // Create two tweets for each user
      for (let x = 0; x < 2; x++) {
        const tweetToCreate = {
          user: userId,
          text: tweets[tweetIndex].text,
        };

        console.log(tweetToCreate);

        // await Tweet.create(tweetToCreate)

        tweetIndex = tweetIndex + 1;
      }
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

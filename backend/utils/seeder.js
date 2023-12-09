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

const { createHashtags } = require('./hashtagHelper');
const { uploadFile } = require('./storageBucket');

mongoose.connect(process.env.MONGO_URI);
console.log('Database connected');

const parseJson = (filename) => {
  const file = `${__dirname}/../_data/${filename}.json`;
  return JSON.parse(fs.readFileSync(file));
};

const users = parseJson('users');
const tweets = parseJson('tweets');
const comments = parseJson('comments');

const avatars = fs.readdirSync(`${__dirname}/../_data/images/avatars`);
const banners = fs.readdirSync(`${__dirname}/../_data/images/banners`);

const importData = async () => {
  try {
    console.log('Flushing old data...'.bgYellow);
    await flush();

    console.log('Seeding database...'.bgYellow);
    await insertSampleUsers();
    await insertSampleTweets();
    await insertSampleComments();

    console.log('Database successfully seeded!'.bgGreen);
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const flushData = async () => {
  try {
    console.log('Flushing database...'.bgYellow);
    await flush();

    console.log('Database successfully flushed'.bgGreen);
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const flush = async () => {
  await Like.deleteMany();
  await Retweet.deleteMany();
  await Bookmark.deleteMany();
  await Comment.deleteMany();
  await Tweet.deleteMany();
  await Follow.deleteMany();
  await User.deleteMany();
};

const insertSampleUsers = async () => {
  const sampleUsers = await User.create(users);

  let userIndex = 0;

  for (const sampleUser of sampleUsers) {
    const user = await User.findById(sampleUser.id);

    // await uploadUserProfileMedia(user, userIndex);
    await genUserFollowers(user, sampleUsers);

    userIndex = userIndex + 1;
  }
};

const genUserFollowers = async (user, sampleUsers) => {
  const usersToFollow = genRandomNums(2, 14, 19);

  for (let x = 0; x < usersToFollow.length; x++) {
    const userToFollow = usersToFollow[x];
    const following = sampleUsers[userToFollow].id;

    await Follow.create({ user, following });
  }
};

const insertSampleTweets = async () => {
  const sampleUsers = await User.find({});

  let tweetIndex = 0;

  for (const sampleUser of sampleUsers) {
    for (let x = 0; x < 2; x++) {
      const user = sampleUser.id;
      const text = tweets[tweetIndex].text;
      const tweet = await Tweet.create({ user, text });

      const hashtags = text.match(/#\w+/g);
      if (hashtags) await createHashtags(hashtags, tweet);

      tweetIndex = tweetIndex + 1;
    }
  }
};

const insertSampleComments = async () => {
  const sampleUsers = await User.find({});
  const tweets = await Tweet.find({});

  let commentIndex = 0;

  for (const sampleUser of sampleUsers) {
    const tweetsToComment = genRandomNums(4, 4, 39);

    for (let x = 0; x < tweetsToComment.length; x++) {
      const tweetToComment = tweetsToComment[x];

      const user = sampleUser.id;
      const tweet = tweets[tweetToComment].id;
      const text = comments[commentIndex].text;

      const comment = await Comment.create({ user, tweet, text });

      const hashtags = text.match(/#\w+/g);
      if (hashtags) await createHashtags(hashtags, comment);

      commentIndex = commentIndex + 1;
    }
  }
};

const genRandomNums = (minLength, maxLength, maxNumber) => {
  let arrLength;

  maxLength === minLength
    ? (arrLength = maxLength)
    : (arrLength =
        Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength);

  let uniqueArr = [];

  for (let x = 0; x < arrLength; x++) {
    const randomNum = Math.floor(Math.random() * maxNumber + 1);

    uniqueArr.includes(randomNum) ? (x = x - 1) : uniqueArr.push(randomNum);
  }

  return uniqueArr;
};

const uploadUserProfileMedia = async (user, userIndex) => {
  const avatar = createFileObject(avatars, userIndex);
  const banner = createFileObject(banners, userIndex);

  const options = { local: true };
  await uploadFile(avatar, user, 'avatar', 'avatars', options);
  await uploadFile(banner, user, 'banner', 'banners', options);
};

const createFileObject = (type, index) => {
  const name = type[index];
  const path = `${__dirname}/../_data/images/${name.split('_')[0]}s/${name}`;
  return { name, path };
};

process.argv[2] === '-f' ? flushData() : importData();

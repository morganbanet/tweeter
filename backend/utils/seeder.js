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

const { uploadFile } = require('./storageBucket');

mongoose.connect(process.env.MONGO_URI);
console.log('Database connected');

const parseJson = (filename) => {
  const file = `${__dirname}/../_data/${filename}.json`;
  return JSON.parse(fs.readFileSync(file));
};

const users = parseJson('users');
const tweets = parseJson('tweets');

const avatars = fs.readdirSync(`${__dirname}/../_data/images/avatars`);
const banners = fs.readdirSync(`${__dirname}/../_data/images/banners`);

const importData = async () => {
  try {
    console.log('Flushing old data...'.bgYellow);
    await flush();

    console.log('Seeding database...'.bgYellow);
    await insertSampleUsers();

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
  let tweetIndex = 0;

  for (const sampleUser of sampleUsers) {
    const user = await User.findById(sampleUser.id);

    // await uploadUserProfileMedia(user, userIndex);
    await genUserFollowers(user, sampleUsers);
    await genUserTweets(user, tweetIndex);

    userIndex = userIndex + 1;
    tweetIndex = tweetIndex + 2;
  }
};

const genUserTweets = async (user, tweetIndex) => {
  for (let x = 0; x < 2; x++) {
    tweetIndex = tweetIndex + x;
    await Tweet.create({ user, text: tweets[tweetIndex].text });
  }
};

const genUserFollowers = async (user, sampleUsers) => {
  const usersToFollow = genRandomNums(8, 19);

  for (let x = 0; x < usersToFollow.length; x++) {
    const userToFollow = usersToFollow[x];
    const following = sampleUsers[userToFollow].id;

    await Follow.create({ user, following });
  }
};

const genRandomNums = (maxLength, maxNumber) => {
  const arryLength = Math.floor(Math.random() * maxLength) + 2;

  let uniqueArr = [];

  for (let x = 0; x < arryLength; x++) {
    const randomNum = Math.floor(Math.random() * maxNumber);

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

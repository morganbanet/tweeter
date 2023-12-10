require('dotenv').config({ path: './secrets/.env' });

const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');

const User = require('../models/userModel');
const Follow = require('../models/followModel');
const Tweet = require('../models/tweetModel');
const Comment = require('../models/commentModel');
const Hashtag = require('../models/hashtagModel');
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
const tweetImages = fs.readdirSync(`${__dirname}/../_data/images/tweets`);

const importData = async () => {
  try {
    console.log('Flushing old data...'.bgRed);
    await flush();

    console.log('Seeding database...'.bgCyan);

    console.log('Populating with users 👻 ...'.bgYellow);
    await insertSampleUsers();

    console.log('Writing tweets 🦜 ...'.bgYellow);
    await insertSampleTweets();

    console.log('Inserting comments 📖 ...'.bgYellow);
    await insertSampleComments();

    console.log('Adding likes 🍻 ...'.bgYellow);
    await genUserLikes();

    console.log('Generating retweets 🚀 ...'.bgYellow);
    await genUserRetweets();

    console.log('Saving bookmarks 🔖 ... '.bgYellow);
    await genUserBookmarks();

    console.log('Database successfully seeded!'.bgGreen);
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const flushData = async () => {
  try {
    console.log('Flushing database...'.bgRed);
    await flush();

    console.log('Database successfully flushed!'.bgGreen);
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const flush = async () => {
  console.log('Deleting likes 🚮 ...'.bgYellow);
  await Like.deleteMany();

  console.log('Deleting retweets 🚮 ...'.bgYellow);
  await Retweet.deleteMany();

  console.log('Deleting bookmarks 🚮 ...'.bgYellow);
  await Bookmark.deleteMany();

  console.log('Deleting comments 🚮 ...'.bgYellow);
  await Comment.deleteMany();

  console.log('Deleting tweets 🚮 ...'.bgYellow);
  await Tweet.deleteMany();

  console.log(`Deleting hashtags 🚮 ...`.bgYellow);
  await Hashtag.deleteMany();

  console.log('Deleting followers 🚮 ...'.bgYellow);
  await Follow.deleteMany();

  console.log('Deleting users 🚮 ...'.bgYellow);
  await User.deleteMany();
};

const insertSampleUsers = async () => {
  const sampleUsers = await User.create(users);

  let userIndex = 0;

  for (const sampleUser of sampleUsers) {
    const user = await User.findById(sampleUser.id);

    await uploadUserProfileMedia(user, userIndex);
    await genUserFollowers(user, sampleUsers);

    userIndex = userIndex + 1;
  }
};

const uploadUserProfileMedia = async (user, userIndex) => {
  const avatar = createFileObject(avatars, userIndex);
  const banner = createFileObject(banners, userIndex);

  const options = { local: true };
  await uploadFile(avatar, user, 'avatar', 'avatars', options);
  await uploadFile(banner, user, 'banner', 'banners', options);
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
  let imageIndex = 0;

  const tweetsToHaveImages = genRandomNums(16, 16, 39);

  for (const sampleUser of sampleUsers) {
    for (let x = 0; x < 2; x++) {
      const user = sampleUser.id;
      const text = tweets[tweetIndex].text;

      const tweet = await Tweet.create({ user, text });

      if (tweetsToHaveImages.includes(tweetIndex)) {
        await uploadTweetMedia(tweet, imageIndex);

        imageIndex = imageIndex + 1;
      }

      const hashtags = text.match(/#\w+/g);
      if (hashtags) await createHashtags(hashtags, tweet);

      tweetIndex = tweetIndex + 1;
    }
  }
};

const uploadTweetMedia = async (tweet, index) => {
  const file = createFileObject(tweetImages, index);

  const options = { local: true };
  await uploadFile(file, tweet, 'image', 'tweets', options);
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

const genUserLikes = async () => {
  const sampleUsers = await User.find({});
  const tweets = await Tweet.find({});
  const comments = await Comment.find({});

  for (const sampleUser of sampleUsers) {
    const tweetsToLike = genRandomNums(8, 26, 39);
    const commentsToLike = genRandomNums(16, 32, 79);

    for (let x = 0; x < tweetsToLike.length; x++) {
      const tweetToLike = tweetsToLike[x];

      const user = sampleUser.id;
      const liked = tweets[tweetToLike].id;
      const likedType = 'Tweet';

      await Like.create({ user, liked, likedType });
    }

    for (let x = 0; x < commentsToLike.length; x++) {
      const commentToLike = commentsToLike[x];

      const user = sampleUser.id;
      const liked = comments[commentToLike].id;
      const likedType = 'Comment';

      await Like.create({ user, liked, likedType });
    }
  }
};

const genUserRetweets = async () => {
  const sampleUsers = await User.find({});
  const tweets = await Tweet.find({});

  // Four random users to make one retweet each
  const usersToCreateRetweet = genRandomNums(4, 4, 19);
  const tweetsToRetweet = genRandomNums(4, 4, 39);

  for (let x = 0; x < usersToCreateRetweet.length; x++) {
    const userToCreateRetweet = usersToCreateRetweet[x];
    const tweetToRetweet = tweetsToRetweet[x];

    const user = sampleUsers[userToCreateRetweet].id;
    const retweeted = tweets[tweetToRetweet].id;

    // Skip retweet if user tries to retweet own tweet
    if (sampleUsers[userToCreateRetweet].id === tweets[tweetToRetweet].user) {
      return;
    }

    await Retweet.create({ user, retweeted });
  }
};

const genUserBookmarks = async () => {
  const sampleUsers = await User.find({});
  const tweets = await Tweet.find({});

  // Seven users to create between one and three different bookmarks
  const usersToCreateBookmarks = genRandomNums(7, 7, 19);

  for (let x = 0; x < usersToCreateBookmarks.length; x++) {
    const userToCreateBookmarks = usersToCreateBookmarks[x];

    const tweetsToBookmark = genRandomNums(1, 3, 39);

    for (let x = 0; x < tweetsToBookmark.length; x++) {
      const tweetToBookmark = tweetsToBookmark[x];

      const user = sampleUsers[userToCreateBookmarks].id;
      const bookmarked = tweets[tweetToBookmark].id;

      await Bookmark.create({ user, bookmarked });
    }
  }
};

// Generate array of random numbers
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

const createFileObject = (type, index) => {
  const name = type[index];
  const path = `${__dirname}/../_data/images/${name.split('_')[0]}s/${name}`;
  return { name, path };
};

process.argv[2] === '-f' ? flushData() : importData();

const Hashtag = require('../models/hashtagModel');

exports.createHashtags = async (hashtags, document) => {
  let finalDocument;

  for (const hashtag of hashtags) {
    const tagExists = await Hashtag.findOne({ hashtag });

    if (tagExists) {
      await tagExists.increaseCount();
      document.hashtags.push(tagExists.id);
    }

    if (!tagExists) {
      const newHashtag = await Hashtag.create({ hashtag, count: +1 });
      document.hashtags.push(newHashtag.id);
    }

    finalDocument = await document.save();
  }

  return finalDocument;
};

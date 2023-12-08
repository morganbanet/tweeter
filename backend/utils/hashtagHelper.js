const Hashtag = require('../models/hashtagModel');

exports.createHashtags = async (hashtags, document) => {
  let finalDocument;

  for (const hashtag of hashtags) {
    const tagExists = await Hashtag.findOne({ hashtag });

    // Increase count if hashtag already exists
    if (tagExists) {
      await tagExists.modifyCount(+1);
      document.hashtags.push(tagExists.id);
    }

    // Create new hashtag document if it doesn't exist
    if (!tagExists) {
      const newHashtag = await Hashtag.create({ hashtag, count: +1 });
      document.hashtags.push(newHashtag.id);
    }

    finalDocument = await document.save();
  }

  return finalDocument;
};

// Adjusts count on existing hashtags, and updates the input document
// hashtags field
exports.removeHashtags = async (document) => {
  let finalDocument;

  for (const hashtag of document.hashtags) {
    const existingTag = await Hashtag.findById(hashtag);
    await existingTag.modifyCount(-1);

    document.hashtags = document.hashtags.filter((tag) => tag !== hashtag);

    finalDocument = await document.save();
  }

  return finalDocument;
};

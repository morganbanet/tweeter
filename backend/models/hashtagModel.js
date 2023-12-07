const mongoose = require('mongoose');

const hashtagSchema = new mongoose.Schema(
  {
    hashtag: {
      type: String,
      required: [true, 'Hashtag text is required'],
    },
    count: {
      type: Number,
      required: [true, 'Hashtag must be a minimum of 0'],
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// @Todo: Pre save middleware, check if count is 0 and delete if so (?)

hashtagSchema.methods.increaseCount = async function () {
  this.count = this.count + 1;
  await this.save();
};

module.exports = mongoose.model('Hashtag', hashtagSchema);

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
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Increment or decrement count
hashtagSchema.methods.modifyCount = async function (value) {
  if (value === +1) {
    this.count = this.count + 1;
    await this.save();
  }

  if (value === -1) {
    this.count = this.count - 1;
    await this.save();
  }

  // Delete doc if count becomes 0
  if (this.count === 0) {
    await this.deleteOne();
  }
};

module.exports = mongoose.model('Hashtag', hashtagSchema);

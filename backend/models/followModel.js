const mongoose = require('mongoose');

const followSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    following: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Make sure users can only follow the same person once
followSchema.index({ following: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Follow', followSchema);

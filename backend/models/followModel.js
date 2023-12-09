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

// Make sure users can only follow once, documents should be able to
// exist both ways
followSchema.index({ following: 1, user: 1 }, { unique: true });
followSchema.index({ user: 1, following: 1 }, { unique: true });

module.exports = mongoose.model('Follow', followSchema);

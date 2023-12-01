const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    liked: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'docModel',
    },
    docModel: {
      type: String,
      required: true,
      enum: ['Tweet', 'Comment'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Like', likeSchema);

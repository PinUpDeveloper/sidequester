const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['tech', 'travel', 'food', 'lifestyle'],
      required: true,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    coverImageUrl: {
      type: String,
      default: null,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
  },
  { timestamps: true }
);

postSchema.index({ category: 1, status: 1 });
postSchema.index({ author: 1 });
postSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Post', postSchema);

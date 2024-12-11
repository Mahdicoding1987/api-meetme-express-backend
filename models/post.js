const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
      text: {
        type: String,
        required: true
      },
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    { timestamps: true }
  );

const postSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: false,
        default: 'https://i.pinimg.com/736x/7f/3b/b8/7f3bb8ca1c26444e3f87281bee19b42f.jpg',
        },
      category: {
        type: String,
        required: true,
        enum: ['Dating', 'Sports', 'Games', 'Movies', 'Music', 'Television'],
      },
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' 
      },
      comments: [commentSchema],
    },
    { timestamps: true }
  );

  const Post = mongoose.model('Post', postSchema);

  module.exports = Post;
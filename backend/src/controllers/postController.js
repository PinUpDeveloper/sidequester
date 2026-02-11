const Post = require('../models/Post');

const createPost = async (req, res, next) => {
  try {
    const post = await Post.create({ ...req.body, author: req.user._id });
    await post.populate('author', 'username');
    res.status(201).json({ success: true, data: { post } });
  } catch (err) {
    next(err);
  }
};

const getPosts = async (req, res, next) => {
  try {
    const { category, search, status, mine } = req.query;
    const filter = {};

    if (mine === 'true' && req.user) {
      filter.author = req.user._id;
    } else if (status) {
      filter.status = status;
    } else if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'moderator')) {
      filter.status = 'published';
    }

    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { content: new RegExp(search, 'i') },
      ];
    }

    const posts = await Post.find(filter)
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: { posts } });
  } catch (err) {
    next(err);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    if (post.status !== 'published' && req.user) {
      const isAuthor = post.author._id.toString() === req.user._id.toString();
      const isStaff = ['admin', 'moderator'].includes(req.user.role);
      if (!isAuthor && !isStaff) {
        return res.status(404).json({ success: false, message: 'Post not found' });
      }
    } else if (post.status !== 'published') {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.json({ success: true, data: { post } });
  } catch (err) {
    next(err);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'username');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.json({ success: true, message: 'Post updated', data: { post } });
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
};

const updatePostStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['draft', 'published'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('author', 'username');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.json({ success: true, message: 'Status updated', data: { post } });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  updatePostStatus,
};

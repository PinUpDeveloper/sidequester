const Post = require('../models/Post');

const ROLES = { user: 'user', moderator: 'moderator', admin: 'admin' };

const canEditPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    req.post = post;

    if (req.user.role === ROLES.admin) return next();
    if (req.user.role === ROLES.moderator) return next();
    if (post.author.toString() === req.user._id.toString()) return next();

    return res.status(403).json({ success: false, message: 'Forbidden: you can only edit your own posts' });
  } catch (err) {
    next(err);
  }
};

const canDeletePost = async (req, res, next) => {
  try {
    const post = req.post || await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    req.post = post;

    if (req.user.role === ROLES.admin) return next();
    if (post.author.toString() === req.user._id.toString()) return next();

    return res.status(403).json({ success: false, message: 'Forbidden: only admin or post author can delete' });
  } catch (err) {
    next(err);
  }
};

const canChangeStatus = async (req, res, next) => {
  try {
    const post = req.post || await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    req.post = post;

    if (req.user.role === ROLES.admin || req.user.role === ROLES.moderator) return next();
    if (post.author.toString() === req.user._id.toString()) return next();

    return res.status(403).json({ success: false, message: 'Forbidden: only moderator/admin or author can change status' });
  } catch (err) {
    next(err);
  }
};

module.exports = { canEditPost, canDeletePost, canChangeStatus, ROLES };

const Comment = require('../models/Comment');
const Post = require('../models/Post');

const getCommentsByPostId = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).select('status author');
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    if (post.status !== 'published') {
      const isAuthor = req.user && post.author && post.author.toString() === req.user._id.toString();
      const isStaff = req.user && ['admin', 'moderator'].includes(req.user.role);
      if (!isAuthor && !isStaff) {
        return res.status(404).json({ success: false, message: 'Post not found' });
      }
    }
    const comments = await Comment.find({ post: req.params.id })
      .populate('author', 'username')
      .sort({ createdAt: 1 })
      .lean();
    res.json({ success: true, data: { comments } });
  } catch (err) {
    next(err);
  }
};

const createComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).select('status');
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    if (post.status !== 'published') {
      return res.status(400).json({ success: false, message: 'Cannot comment on unpublished post' });
    }
    const comment = await Comment.create({
      post: req.params.id,
      author: req.user._id,
      content: req.body.content,
    });
    await comment.populate('author', 'username');
    res.status(201).json({ success: true, data: { comment } });
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }
    const isAuthor = comment.author.toString() === req.user._id.toString();
    const isStaff = ['admin', 'moderator'].includes(req.user.role);
    if (!isAuthor && !isStaff) {
      return res.status(403).json({ success: false, message: 'Not allowed to delete this comment' });
    }
    await comment.deleteOne();
    res.json({ success: true, message: 'Comment deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCommentsByPostId,
  createComment,
  deleteComment,
};

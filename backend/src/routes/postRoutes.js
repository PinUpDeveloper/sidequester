const express = require('express');
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  updatePostStatus,
} = require('../controllers/postController');
const {
  getCommentsByPostId,
  createComment,
  deleteComment,
} = require('../controllers/commentController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { canEditPost, canDeletePost, canChangeStatus } = require('../middleware/rbacMiddleware');
const {
  validate,
  createPostSchema,
  updatePostSchema,
  createCommentSchema,
} = require('../middleware/validateMiddleware');

const router = express.Router();

router.get('/', optionalAuth, getPosts);
router.get('/:id', optionalAuth, getPostById);
router.get('/:id/comments', optionalAuth, getCommentsByPostId);

router.use(protect);

router.post('/:id/comments', validate(createCommentSchema), createComment);
router.delete('/:id/comments/:commentId', deleteComment);

router.post('/', validate(createPostSchema), createPost);
router.patch('/:id/status', canChangeStatus, (req, res, next) => {
  req.body = req.body || {};
  next();
}, (req, res, next) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ success: false, message: 'status is required' });
  next();
}, updatePostStatus);
router.put('/:id', canEditPost, validate(updatePostSchema), updatePost);
router.delete('/:id', canEditPost, canDeletePost, deletePost);

module.exports = router;

const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string().min(2).max(50).trim().required(),
  email: Joi.string().email().trim().lowercase().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required(),
  password: Joi.string().required(),
});

const updateProfileSchema = Joi.object({
  username: Joi.string().min(2).max(50).trim(),
  email: Joi.string().email().trim().lowercase(),
  password: Joi.string().min(6),
}).min(1);

const createPostSchema = Joi.object({
  title: Joi.string().max(200).trim().required(),
  content: Joi.string().required(),
  category: Joi.string().valid('tech', 'travel', 'food', 'lifestyle').required(),
  tags: Joi.array().items(Joi.string().trim()).default([]),
  coverImageUrl: Joi.string().uri().allow('', null),
  status: Joi.string().valid('draft', 'published').default('draft'),
});

const updatePostSchema = Joi.object({
  title: Joi.string().max(200).trim(),
  content: Joi.string(),
  category: Joi.string().valid('tech', 'travel', 'food', 'lifestyle'),
  tags: Joi.array().items(Joi.string().trim()),
  coverImageUrl: Joi.string().uri().allow('', null),
  status: Joi.string().valid('draft', 'published'),
}).min(1);

const createCommentSchema = Joi.object({
  content: Joi.string().trim().max(2000).required(),
});

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const message = error.details.map((d) => d.message).join('; ');
    return res.status(400).json({ success: false, message });
  }
  req.body = value;
  next();
};

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  updateProfileSchema,
  createPostSchema,
  updatePostSchema,
  createCommentSchema,
};

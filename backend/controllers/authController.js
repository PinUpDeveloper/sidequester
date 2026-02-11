const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret, jwtExpiresIn } = require('../config/env');

const register = async (req, res, next) => {
  try {
    const user = await User.create({ ...req.body, role: 'user' });
    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: jwtExpiresIn });
    res.status(201).json({
      success: true,
      message: 'User registered',
      data: {
        user: { id: user._id, username: user.username, email: user.email, role: user.role },
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select('+password');
    if (!user || !(await user.comparePassword(req.body.password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: jwtExpiresIn });
    res.json({
      success: true,
      data: {
        user: { id: user._id, username: user.username, email: user.email, role: user.role },
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };

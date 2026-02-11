const User = require('../models/User');

const getProfile = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        user: { id: req.user._id, username: req.user.username, email: req.user.email, role: req.user.role },
      },
    });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (req.body.username != null) user.username = req.body.username;
    if (req.body.email != null) user.email = req.body.email;
    if (req.body.password != null) user.password = req.body.password;
    await user.save();
    const out = await User.findById(user._id).select('-password');
    res.json({
      success: true,
      message: 'Profile updated',
      data: { user: { id: out._id, username: out.username, email: out.email, role: out.role } },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile };

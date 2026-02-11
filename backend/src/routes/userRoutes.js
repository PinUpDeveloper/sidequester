const express = require('express');
const { getProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { validate, updateProfileSchema } = require('../middleware/validateMiddleware');

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', validate(updateProfileSchema), updateProfile);

module.exports = router;

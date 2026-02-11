const express = require('express');
const { register, login } = require('../controllers/authController');
const { validate, registerSchema, loginSchema } = require('../middleware/validateMiddleware');

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

module.exports = router;

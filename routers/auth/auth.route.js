const express = require('express');
const {
  registerUser,
  loginUser,
  loggedInUser,
} = require('../../controllers/auth/auth.controller');
const { protectRoute } = require('../../middleware/auth.middleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protectRoute, loggedInUser);

module.exports = router;

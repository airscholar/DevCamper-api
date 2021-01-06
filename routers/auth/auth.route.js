const express = require('express');
const {
  registerUser,
  loginUser,
  loggedInUser,
  forgotpassword,
  resetPassword,
  updateDetails,
} = require('../../controllers/auth/auth.controller');
const { protectRoute } = require('../../middleware/auth.middleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protectRoute, loggedInUser);
router.put('/updateDetails', protectRoute, updateDetails);
router.post('/forgotpassword', forgotpassword);
router.put('/resetpassword/:resetToken', resetPassword);

module.exports = router;

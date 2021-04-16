const express = require('express');
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUser,
} = require('../../controllers/users/user.controller');
const advancedResults = require('../../middleware/advancedResults.middleware');
const {
  protectRoute,

  authorize,
} = require('../../middleware/auth.middleware');
const User = require('../../models/User');

const router = express.Router();

router.use(protectRoute);
router.use(authorize('admin', 'super admin'));

router.route('/').get(advancedResults(User), getUsers).post(createUser);
router.route('/:userId').put(updateUser).get(getUser).delete(deleteUser);

module.exports = router;

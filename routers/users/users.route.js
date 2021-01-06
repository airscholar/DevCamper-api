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
  protectAdminRoute,
} = require('../../middleware/auth.middleware');
const User = require('../../models/User');

const router = express.Router();

router
  .route('/')
  .get(advancedResults(User, 'bootcamp'), getUsers)
  .post(protectAdminRoute, createUser)
  router
  .route('/:userId')
  .put(protectAdminRoute, updateUser)
  .get(protectAdminRoute, getUser)
  .delete(protectAdminRoute, deleteUser);
module.exports = router;

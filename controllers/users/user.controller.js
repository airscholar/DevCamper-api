const ErrorResponse = require('../../utils/errorResponse.helper');
const User = require('../../models/User');
const asyncHandler = require('../../middleware/asyncHandler.middleware');

// @desc      Get all users
// @route     GET /api/v1/auth/users
// @access    Private/Admin
const getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single user
// @route     GET /api/v1/auth/users/:userId
// @access    Private/Admin
const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId);

  if (!user) {
    return next(
      new ErrorResponse(`User with ${req.params.userId} not found`, 400)
    );
  }

  res.status(200).json({
    success: true,
    message: 'User fetched successfully',
    data: user,
  });
});

// @desc      Create user
// @route     POST /api/v1/auth/users
// @access    Private/Admin
const createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  if (!user) {
    return next(new ErrorResponse(`User cannot be created`, 500));
  }

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: user,
  });
});

// @desc      Update user
// @route     PUT /api/v1/auth/users/:userId
// @access    Private/Admin
const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new ErrorResponse(`Error occured while updating user`, 500));
  }

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: user,
  });
});

// @desc      Delete user
// @route     DELETE /api/v1/auth/users/:userId
// @access    Private/Admin
const deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.userId);

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
    data: {},
  });
});

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser };

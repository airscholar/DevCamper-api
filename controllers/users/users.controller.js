const ErrorResponse = require('../../utils/errorResponse.helper');
const User = require('../../models/User');
const asyncHandler = require('../../middleware/asyncHandler.middleware');

// @desc      Regiser User
// @route     POST /api/v1/auth/register
// @access    Public
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // Create signed JwtToken on the method
  //   Note the diff between statics and method
  // statics will be User.staticMethod()
  // method will be createdUser.method()
  const token = await user.getSignedJwtToken();

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: user,
    token,
  });
});

module.exports = { registerUser };

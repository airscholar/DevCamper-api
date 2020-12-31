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

// @desc      Login User
// @route     POST /api/v1/auth/login
// @access    Public
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  //   check if password matches
  const isMatch = await user.matchEnteredPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Create signed JwtToken on the method
  //   Note the diff between statics and method
  // statics will be User.staticMethod()
  // method will be createdUser.method()
  const token = await user.getSignedJwtToken();

  res.status(201).json({
    success: true,
    message: 'User logged in successfully',
    data: user,
    token,
  });
});

module.exports = { registerUser, loginUser };

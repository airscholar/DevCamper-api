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

  sendTokenResponse(user, 200, res);
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

  sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie, and send response
const sendTokenResponse = async (user, statusCode, res) => {
// Create signed JwtToken on the method
  //   Note the diff between statics and method
  // statics will be User.staticMethod()
  // method will be createdUser.method()
  const token = await user.getSignedJwtToken();

  const options = {
    //30 days to milliseconds
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  } 

  if(process.env.NODE_ENV === 'production'){
    options.secure = true 
  }

  res
  .status(statusCode)
  .cookie('token', token, options)
  .json({
    success: true,
    token
  })
}

module.exports = { registerUser, loginUser };

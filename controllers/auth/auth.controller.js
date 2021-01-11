const ErrorResponse = require('../../utils/errorResponse.helper');
const User = require('../../models/User');
const asyncHandler = require('../../middleware/asyncHandler.middleware');
const { sendEmail } = require('../../utils/sendEmail.utils');
const crypto = require('crypto');

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

  // when not matched
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }
  sendTokenResponse(user, 200, res);
});

// @desc      Get Logged In User
// @route     GET /api/v1/auth/me
// @access    Private
const loggedInUser = asyncHandler(async (req, res, next) => {
  // const user = User.findById(req.user.id);
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Forgot password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
const forgotpassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('User does not exist', 400));
  }

  // generate token
  const resetToken = await user.getResetPasswordToken();

  // create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;

  await user.save({ validateBeforeSave: false });

  const message = `You are receiving this email because you (or someone else) has request the reset of a password. Please make a PUT request to \n\n ${resetUrl}`;

  try {
    await sendEmail({
      recipients: user.email,
      subject: 'Password Reset Email',
      message,
    });

    return res.status(200).json({
      success: true,
      data: 'Email Sent!',
    });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent!', 500));
  }
});

// @desc      Reset Password
// @route     PUT /api/v1/auth/resetpassword/:resetToken
// @access    Public
const resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gte: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorResponse('Invalid password reset token. Please try again!', 400)
    );
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Update Details
// @route   /api/v1/auth/updateDetails
// @method  GET
// @access  Private
const updateDetails = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: user,
    message: `User ${req.user.id} updated successfully`,
  });
});

// @desc    Update Password
// @route   /api/v1/auth/updatePassword
// @method  GET
// @access  Private
const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');

  if (!user.matchEnteredPassword(req.body.currentPassword)) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  user.password = req.body.newPassword;

  await user.save();

  res.status(200).json({
    success: true,
    data: user,
    message: `User ${req.user.id} password changed successfully`,
  });
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
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  //add secure to options to determine running capacity
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};

module.exports = {
  registerUser,
  loginUser,
  loggedInUser,
  forgotpassword,
  resetPassword,
  updateDetails,
  updatePassword,
};

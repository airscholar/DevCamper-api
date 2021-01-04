const jwt = require('jsonwebtoken');
const errorResponse = require('./error.middleware');
const asyncHandler = require('./asyncHandler.middleware');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse.helper');

// protect route
const protectRoute = asyncHandler(async (req, res, next) => {
  let token;

  //extract token from headers sent with the request
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // check token in cookies
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  if (!token) {
    return next(
      new ErrorResponse('Access to this section is not authorized!', 401)
    );
  }

  try {
    //  verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return next(
      new ErrorResponse('Access to this section is not authorized!', 401)
    );
  }
});

// @desc      Authorize user based on role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `Role ${req.user.role} is not authorized to access the resource`,
          401
        )
      );
    }

    next();
  };
};

module.exports = { protectRoute, authorize };

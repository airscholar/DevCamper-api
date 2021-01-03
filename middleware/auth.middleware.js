const jwt = require('jsonwebtoken');
const errorResponse = require('./error.middleware');
const asyncHandler = require('./asyncHandler.middleware');
const User = require('../models/User');

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
  else if (req.cookies.token) {
    token = req.cookies.token;
  }
});

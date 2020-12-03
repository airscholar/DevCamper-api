const ErrorResponse = require('../utils/errorResponse.helper')

const errorHandler = (err, req, res, next) => {
  console.log(err.stack.red);
  console.log(err.name)
  let error = {...err}
  error.message = err.message;

  if(err.name === 'CastError'){
    const msg = `Bootcamp with id: ${err.value} not found`;

    error = new ErrorResponse(msg, 404)
  }
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server error'
  });
};

module.exports = { errorHandler };

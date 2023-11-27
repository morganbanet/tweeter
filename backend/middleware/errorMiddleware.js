const ErrorResponse = require('../utils/ErrorResponse');

const notFound = (req, res, next) => {
  const message = `Not found ${req.originalUrl}`;
  return next(new ErrorResponse(message));
};

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Dev debugging
  console.log(err.errors);
  // console.log(JSON.parse(JSON.stringify(error)));

  // Bad mongoose object id
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new ErrorResponse(message, 404);
  }

  // Duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 401);
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    // Return a string containing each err.errors.message
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    error = new ErrorResponse(message, 401);
  }

  // Json Web Token error
  if (err.name === 'jsonWebTokenError') {
    const message = 'Not authorized to access this resource';
    error = new ErrorResponse(message, 401);
  }

  // JSON Web Token expired
  if (err.name === 'JsonExpiredError') {
    const message = 'Token expired, please sign in again';
    error = new ErrorResponse(message, 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

module.exports = { notFound, errorHandler };

const ErrorResponse = require('../utils/ErrorResponse');

const notFound = (req, res, next) => {
  const message = `Not found ${req.originalUrl}`;
  return next(new ErrorResponse(message, 404));
};

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Bad mongoose object id
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new ErrorResponse(message, 404);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

module.exports = { notFound, errorHandler };

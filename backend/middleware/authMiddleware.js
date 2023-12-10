const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const User = require('../models/userModel');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  token = req.cookies.jwt;

  if (!token) {
    return next(
      new ErrorResponse('Not authorized to access this resource', 401)
    );
  }

  // Verify the token against signature
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Find the user via the tokens payload
  req.user = await User.findById(decoded.userId);

  console.log(req.user);

  next();
});

// Authorize specific roles defined in routes
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User with role ${req.user.role} not authorized to access this resource`
        )
      );
    }

    next();
  };
};

// Check ownership of resources, allow admins to bypass
exports.checkOwnership = (model) =>
  asyncHandler(async (req, res, next) => {
    if (req.user.role !== 'admin') {
      const resourceId = req.params.id;

      const resource = await model.findById(resourceId);

      if (!resource) {
        return next(
          new ErrorResponse(`Resource not found with id ${resourceId}`, 404)
        );
      }

      // Compare resource owner to req.user.id
      if (resource.user.toString() !== req.user.id) {
        return next(
          new ErrorResponse(
            `User ${req.user.id} not authorized to modify resource ${resourceId}`,
            403
          )
        );
      }
    }

    next();
  });

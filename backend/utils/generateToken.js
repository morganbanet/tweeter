const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const userId = user._id;

  // Generate token
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });

  // Cookie options
  const options = {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV !== 'production' ? false : true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  };

  return { token, options };
};

module.exports = generateToken;

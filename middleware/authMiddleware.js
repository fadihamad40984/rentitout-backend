// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token verification error:', err); // Log the error for debugging

      // Check for specific token errors
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ message: 'Token expired. Please log in again.' });
      }
      if (err.name === 'JsonWebTokenError') {
        return res.status(403).json({ message: 'Invalid token. Please log in again.' });
      }
      return res.status(403).json({ message: 'Could not authenticate token.' });
    }

    // If the token is valid, proceed
    req.user = user; // Attach the user info to the request object
    next();
  });
};

module.exports = authenticateToken;

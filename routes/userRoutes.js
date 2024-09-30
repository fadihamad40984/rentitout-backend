// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');
const { body } = require('express-validator');

// Register user with validation
router.post(
  '/register',
  [
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone_number').optional().isLength({ max: 15 }).withMessage('Phone number must not exceed 15 characters'),
    body('address').optional().isString().withMessage('Address must be a string'),
    body('role').optional().isIn(['admin', 'user', 'renter']).withMessage('Role must be one of: admin, user, renter'),
  ],
  userController.register
);

// Login user with validation
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  userController.login
);

// Protected profile route
router.get('/profile', authenticateToken, userController.getProfile);

// Update profile route (make sure the method is defined in userController)
router.put(
  '/profile',
  authenticateToken, // Protect the route
  [
    body('first_name').optional().notEmpty().withMessage('First name cannot be empty'),
    body('last_name').optional().notEmpty().withMessage('Last name cannot be empty'),
    body('phone_number').optional().isLength({ max: 15 }).withMessage('Phone number must not exceed 15 characters'),
    body('address').optional().isString().withMessage('Address must be a string'),
  ],
  userController.updateProfile // Ensure this method is defined in userController
);

module.exports = router;

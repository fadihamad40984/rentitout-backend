
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');
const { body } = require('express-validator');

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


router.post('/verify-email', userController.verifyEmail);


router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  userController.login
);

router.get('/profile', authenticateToken, userController.getProfile);

router.put(
  '/profile',
  authenticateToken, 
  [
    body('first_name').optional().notEmpty().withMessage('First name cannot be empty'),
    body('last_name').optional().notEmpty().withMessage('Last name cannot be empty'),
    body('phone_number').optional().isLength({ max: 15 }).withMessage('Phone number must not exceed 15 characters'),
    body('address').optional().isString().withMessage('Address must be a string'),
  ],
  userController.updateProfile 
);

module.exports = router;
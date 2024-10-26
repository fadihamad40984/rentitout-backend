const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');
const authenticateToken = require('../middleware/authMiddleware');
const { body } = require('express-validator');

router.post(
  '/',
  authenticateToken,
  [
    body('Car-Id').notEmpty().withMessage('Car ID is required'),  
    body('renter_id').notEmpty().withMessage('Renter ID is required'),
    body('start_date').notEmpty().withMessage('Start date is required').isDate().withMessage('Invalid date format'),
    body('end_date').notEmpty().withMessage('End date is required').isDate().withMessage('Invalid date format'),
    body('rental_duration').isInt({ min: 1 }).withMessage('Rental duration must be a positive integer representing the number of days'), // Updated validation for number of days
    body('rental_method').isIn(['delivery', 'pickup']).withMessage('Rental method must be delivery or pickup')
  ],
  rentalController.createRental
);

router.get('/user/:userId', authenticateToken, rentalController.getRentalsByUser);

router.patch(
  '/status',
  authenticateToken,
  [
    body('rentalId').notEmpty().withMessage('Rental ID is required'),
    body('status').isIn(['pending', 'approved', 'completed', 'canceled']).withMessage('Invalid rental status')
  ],
  rentalController.updateRentalStatus
);

router.post('/reviews', authenticateToken, rentalController.submitReview);


module.exports = router;

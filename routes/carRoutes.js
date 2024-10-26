const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController'); // Updated controller name
const authenticateToken = require('../middleware/authMiddleware');
const { body } = require('express-validator');

router.post(
  '/create',
  authenticateToken,
  [
    body('Name').notEmpty().withMessage('Name is required'),
    body('Model').notEmpty().withMessage('Model is required'),
    body('Rent-Price').isDecimal().withMessage('Rent Price must be a valid decimal number'),
    body('availability').optional().isBoolean().withMessage('Availability must be a boolean'),
    body('Image').notEmpty().withMessage('Image is required')
  ],
  carController.createCar // Updated function name
);

router.get('/', authenticateToken, carController.getAllCars);

router.get('/:id', authenticateToken, carController.getCarById);

router.put(
  '/:id',
  authenticateToken,
  [
    body('Name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('Model').optional().notEmpty().withMessage('Model cannot be empty'),
    body('Rent-Price').optional().isDecimal().withMessage('Rent Price must be a valid decimal number'),
    body('availability').optional().isBoolean().withMessage('Availability must be a boolean'),
    body('Image').optional().notEmpty().withMessage('Image cannot be empty')
  ],
  carController.updateCar
);

router.delete('/:id', authenticateToken, carController.deleteCar);

module.exports = router;

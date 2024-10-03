const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const authenticateToken = require('../middleware/authMiddleware');
const { body } = require('express-validator');

// Create an item
router.post(
  '/create',
  authenticateToken,
  [
    body('category').notEmpty().withMessage('Category is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('price').isDecimal().withMessage('Price must be a valid decimal number'),
    body('availability').isBoolean().optional().withMessage('Availability must be a boolean'),
  ],
  itemController.createItem
);

// Get all items
router.get('/', authenticateToken, itemController.getAllItems);

// Get item by ID
router.get('/:id', authenticateToken, itemController.getItemById);

// Update an item
router.put(
  '/:id',
  authenticateToken,
  [
    body('category').optional().notEmpty().withMessage('Category cannot be empty'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('price').optional().isDecimal().withMessage('Price must be a valid decimal number'),
    body('availability').optional().isBoolean().withMessage('Availability must be a boolean'),
  ],
  itemController.updateItem
);

// Delete an item
router.delete('/:id', authenticateToken, itemController.deleteItem);

module.exports = router;

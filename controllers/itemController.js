const { validationResult } = require('express-validator');
const itemsModel = require('../models/itemsModel');

// Create an item
const createItem = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { category, name, description, price, availability } = req.body;
  const user_id = req.user.id; // Get user_id from the authenticated user

  itemsModel.createItem({ user_id, category, name, description, price, availability }, (err, result) => {
    if (err) {
      console.error('Error creating item:', err);
      return res.status(500).json({ message: 'Error creating item' });
    }
    res.status(201).json({ message: 'Item created successfully', itemId: result.insertId });
  });
};

// Get all items
const getAllItems = (req, res) => {
  itemsModel.getAllItems((err, results) => {
    if (err) {
      console.error('Error fetching items:', err);
      return res.status(500).json({ message: 'Server error while fetching items.' });
    }
    res.json(results);
  });
};

// Get item by ID
const getItemById = (req, res) => {
  const { id } = req.params;
  itemsModel.getItemById(id, (err, item) => {
    if (err) {
      console.error('Error fetching item:', err);
      return res.status(500).json({ message: 'Server error while fetching item.' });
    }
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (!item.availability) {
        return res.status(400).json({ message: 'Item is not available' });
      }

    res.json(item);
  });
};

// Update an item
const updateItem = (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const updateData = req.body;
  itemsModel.updateItem(id, updateData, (err, result) => {
    if (err) {
      console.error('Error updating item:', err);
      return res.status(500).json({ message: 'Error updating item' });
    }
    res.status(200).json({ message: 'Item updated successfully' });
  });
};

// Delete an item
const deleteItem = (req, res) => {
  const { id } = req.params;
  itemsModel.deleteItem(id, (err, result) => {
    if (err) {
      console.error('Error deleting item:', err);
      return res.status(500).json({ message: 'Error deleting item' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  });
};

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
};

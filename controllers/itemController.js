const { validationResult } = require('express-validator');
const itemsModel = require('../models/itemsModel');

const createItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { category, name, description, price, availability } = req.body;
    const user_id = req.user.id; 

    const result = await itemsModel.createItem({ user_id, category, name, description, price, availability });
    return res.status(201).json({ message: 'Item created successfully', itemId: result.insertId });

  } catch (err) {
    console.error('Error creating item:', err);
    return res.status(500).json({ message: 'Error creating item' });
  }
};

const getAllItems = async (req, res) => {
  try {
    const items = await itemsModel.getAllItems();
    
    return res.status(200).json(items);
  } catch (err) {
    console.error('Error fetching items:', err);
    return res.status(500).json({ message: 'Server error while fetching items.' });
  }
};

const getItemById = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await itemsModel.getItemById(id); 
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    if (!item.availability) {
      return res.status(400).json({ message: 'Item is not available' });
    }
    return res.status(200).json(item); 
  } catch (err) {
    console.error('Error fetching item:', err);
    return res.status(500).json({ message: 'Server error while fetching item.' });
  }
};

const updateItem = async (req, res) => {
  const { id } = req.params;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const updateData = req.body;

  try {
    const result = await itemsModel.updateItem(id, updateData); 
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found or no changes detected' });
    }
    return res.status(200).json({ message: 'Item updated successfully' });
  } catch (err) {
    console.error('Error updating item:', err);
    return res.status(500).json({ message: 'Error updating item' });
  }
};

const deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await itemsModel.deleteItem(id); 
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    return res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error('Error deleting item:', err);
    return res.status(500).json({ message: 'Error deleting item' });
  }
};

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
};

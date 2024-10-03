const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Create new item
const createItem = (itemData, callback) => {
  const { user_id, category, name, description, price, availability } = itemData;
  const query = `
    INSERT INTO Items (user_id, category, name, description, price, availability)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [user_id, category, name, description, price, availability], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

// Get all items
const getAllItems = (callback) => {
  const query = 'SELECT * FROM Items WHERE availability = TRUE';
  db.query(query, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

// Get item by ID
const getItemById = (id, callback) => {
  const query = 'SELECT * FROM Items WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};

// Update item
const updateItem = (id, updateData, callback) => {
  const query = `
    UPDATE Items 
    SET 
      category = COALESCE(?, category),
      name = COALESCE(?, name),
      description = COALESCE(?, description),
      price = COALESCE(?, price),
      availability = COALESCE(?, availability),
      created_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.query(query, [
    updateData.category,
    updateData.name,
    updateData.description,
    updateData.price,
    updateData.availability,
    id,
  ], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

// Delete item
const deleteItem = (id, callback) => {
  const query = 'DELETE FROM Items WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
};

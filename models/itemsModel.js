const db = require('../config/db');

const createItem = (itemData) => {
  const { user_id, category, name, description, price, availability } = itemData;
  const query = `
    INSERT INTO Items (user_id, category, name, description, price, availability)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  return new Promise((resolve, reject) => {
    db.query(query, [user_id, category, name, description, price, availability], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const getAllItems = () => {
  const query = 'SELECT * FROM Items WHERE availability = TRUE';
  
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const getItemById = (id) => {
  const query = 'SELECT * FROM Items WHERE id = ?';
  
  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return reject(new Error('Item not found'));
      resolve(results[0]);
    });
  });
};

const updateItem = (id, updateData) => {
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

  return new Promise((resolve, reject) => {
    db.query(query, [
      updateData.category,
      updateData.name,
      updateData.description,
      updateData.price,
      updateData.availability,
      id,
    ], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const deleteItem = (id) => {
  const query = 'DELETE FROM Items WHERE id = ?';

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
};
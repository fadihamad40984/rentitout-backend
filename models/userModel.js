// models/userModel.js

const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Create user
const createUser = (userData, callback) => {
  const {
    first_name,
    last_name,
    email,
    password,
    phone_number,
    address,
    role,
    verification_status,
    rating,
  } = userData;
  
  const hashedPassword = bcrypt.hashSync(password, 10);

  const query = `
    INSERT INTO users 
      (first_name, last_name, email, password, phone_number, address, role, verification_status, rating) 
    VALUES 
      (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.query(
    query,
    [
      first_name,
      last_name,
      email,
      hashedPassword,
      phone_number || null,
      address || null,
      role,
      verification_status,
      rating,
    ],
    (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    }
  );
};

// Find user by email
const findUserByEmail = (email, callback) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};

const findUserById = (userId, callback) => {
  const query = 'SELECT * FROM users WHERE user_id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};

const updateUser = (userId, updateData, callback) => {
  const query = `
    UPDATE users 
    SET 
      first_name = COALESCE(?, first_name),
      last_name = COALESCE(?, last_name),
      phone_number = COALESCE(?, phone_number),
      address = COALESCE(?, address),
      updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `;

  db.query(query, [
    updateData.first_name,
    updateData.last_name,
    updateData.phone_number,
    updateData.address,
    userId
  ], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser, // Export the new method
};
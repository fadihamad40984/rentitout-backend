
const db = require('../config/db');
const bcrypt = require('bcryptjs');

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
    verification_code,
  } = userData;

  const query = `
    INSERT INTO users 
      (first_name, last_name, email, password, phone_number, address, role, verification_status, rating , verification_code) 
    VALUES 
      (?, ?, ?, ?, ?, ?, ?, ?, ? ,?)`;
  
  db.query(
    query,
    [
      first_name,
      last_name,
      email,
      password,  
      phone_number || null,
      address || null,
      role,
      verification_status,
      rating,
      verification_code,
    ],
    (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    }
  );
};

const verifyUserByCode = (email, verification_code, callback) => {
  const query = `UPDATE users SET verification_status = 1 WHERE email = ? AND verification_code = ?`;

  db.query(query, [email, verification_code], (err, result) => {
      if (err) return callback(err);
      callback(null, result);
  });
};


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
  verifyUserByCode,
  findUserByEmail,
  findUserById,
  updateUser, 
};
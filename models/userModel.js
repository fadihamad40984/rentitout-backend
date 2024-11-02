const db = require('../config/db');

const createUser = (userData, callback) => {
  const {
    first_name,
    last_name,
    email,
    password, 
    phone_number,
    role,
    verification_status,
    verification_code
  } = userData;

  const query = `
    INSERT INTO users 
      (first_name, last_name, email, password, phone_number, role, verification_status, verification_code) 
    VALUES 
      (?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.query(
    query,
    [
      first_name,
      last_name,
      email,
      password,  
      phone_number || null,
      role,
      verification_status,
      verification_code
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

const isVerified = (email, callback) => {
  const query = 'SELECT verification_status FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) return callback(err);
    if (results.length > 0 && results[0].verification_status === 1) {
      return callback(null, true); 
    } else {
      return callback(null, false); 
    }
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
      phone_number = COALESCE(?, phone_number)
    WHERE user_id = ?
  `;

  db.query(query, [
    updateData.first_name,
    updateData.last_name,
    updateData.phone_number,
    userId
  ], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};


const getAllRenters = () => {
  const query = 'SELECT first_name, last_name, email FROM users WHERE role = "renter"';
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};



module.exports = {
  createUser,
  verifyUserByCode,
  findUserByEmail,
  isVerified,  
  findUserById,
  updateUser,
  getAllRenters,
};

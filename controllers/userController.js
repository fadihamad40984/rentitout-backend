
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const { validationResult } = require('express-validator');
require('dotenv').config();

// Register a new user
const register = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    first_name,
    last_name,
    email,
    password,
    phone_number,
    address,
    role, 
  } = req.body;

  // Check if user already exists
  userModel.findUserByEmail(email, (err, user) => {
    if (err) {
      console.error('Error finding user:', err);
      return res.status(500).json({ message: 'Server error while checking user.' });
    }

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const userRole = role || 'user';
    const verification_status = 1; 
    const rating = null; 

    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create new user
    userModel.createUser(
      {
        first_name,
        last_name,
        email,
        password: hashedPassword,
        phone_number,
        address,
        role: userRole,
        verification_status,
        rating,
      },
      (err, result) => {
        if (err) {
          console.error('Error creating user:', err);
          return res.status(500).json({ message: 'Error creating user' });
        }
        res.status(201).json({ message: 'User registered successfully' });
      }
    );
  });
};

// Login user
const login = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  // Find user by email
  userModel.findUserByEmail(email, (err, user) => {
    if (err) {
      console.error('Error finding user:', err);
      return res.status(500).json({ message: 'Server error while finding user.' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check password
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user is verified
    if (!user.verification_status) {
      return res.status(403).json({ message: 'User is not verified.' });
    }

    // Create JWT token
    const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
};

// Get user profile
const getProfile = (req, res) => {
  const userId = req.user.id; 

  userModel.findUserById(userId, (err, user) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ message: 'Server error while fetching user.' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password, ...userData } = user;
    res.json(userData);
  });
};
const updateProfile = (req, res) => {
  const userId = req.user.id; 
  const { first_name, last_name, phone_number, address } = req.body;

  const updateData = {};
  if (first_name) updateData.first_name = first_name;
  if (last_name) updateData.last_name = last_name;
  if (phone_number) updateData.phone_number = phone_number;
  if (address) updateData.address = address;

  userModel.updateUser(userId, updateData, (err, result) => {
    if (err) {
      console.error('Error updating user profile:', err);
      return res.status(500).json({ message: 'Error updating profile' });
    }
    res.status(200).json({ message: 'Profile updated successfully' });
  });
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile, 
};
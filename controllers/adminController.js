const adminModel = require('../models/adminModel');

exports.createLocation = async (req, res) => {
  const { latitude, longitude } = req.body;

  try {
    const result = await adminModel.addLocation(latitude, longitude);
    res.status(201).json({ message: 'Location added successfully', location_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getLocations = async (req, res) => {
  try {
    const locations = await adminModel.getAllLocations();
    res.status(200).json(locations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await adminModel.getAllReviews();
    res.status(200).json(reviews);
  } catch (err) {
    console.error('Error in getAllReviews:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
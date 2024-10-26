const { validationResult } = require('express-validator');
const carsModel = require('../models/carsModel');

const createCar = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { Name, Model, "Rent-Price": rentPrice, Image } = req.body;
    const user_id = req.user.id;
    const availability = req.body.availability !== undefined ? req.body.availability : 1; 

    const result = await carsModel.createCar({ user_id, Name, Model, "Rent-Price": rentPrice, availability, Image });
    return res.status(201).json({ message: 'Car added successfully', carId: result.insertId });

  } catch (err) {
    console.error('Error creating car:', err);
    return res.status(500).json({ message: 'Error adding car' });
  }
};

const getAllCars = async (req, res) => {
  try {
    const cars = await carsModel.getAllCars();
    return res.status(200).json(cars);
  } catch (err) {
    console.error('Error fetching cars:', err);
    return res.status(500).json({ message: 'Server error while fetching cars.' });
  }
};

const getCarById = async (req, res) => {
  const { id } = req.params;

  try {
    const car = await carsModel.getCarById(id); 
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    if (!car.availability) {
      return res.status(400).json({ message: 'Car is not available' });
    }
    return res.status(200).json(car);
  } catch (err) {
    console.error('Error fetching car:', err);
    return res.status(500).json({ message: 'Server error while fetching car.' });
  }
};

const updateCar = async (req, res) => {
  const { id } = req.params;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const updateData = req.body;

  try {
    const result = await carsModel.updateCar(id, updateData); 
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Car not found or no changes detected' });
    }
    return res.status(200).json({ message: 'Car updated successfully' });
  } catch (err) {
    console.error('Error updating car:', err);
    return res.status(500).json({ message: 'Error updating car' });
  }
};

const deleteCar = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await carsModel.deleteCar(id); 
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Car not found' });
    }
    return res.status(200).json({ message: 'Car deleted successfully' });
  } catch (err) {
    console.error('Error deleting car:', err);
    return res.status(500).json({ message: 'Error deleting car' });
  }
};

module.exports = {
  createCar,
  getAllCars,
  getCarById,
  updateCar,
  deleteCar,
};

const db = require('../config/db');

const createCar = (carData) => {
  const { user_id, Name, Model, "Rent-Price": rentPrice, availability = 1, Image } = carData; 
  const query = `
    INSERT INTO cars (user_id, Name, Model, \`Rent-Price\`, availability, Image)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  return new Promise((resolve, reject) => {
    db.query(query, [user_id, Name, Model, rentPrice, availability, Image], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const getAllCars = () => {
  const query = 'SELECT * FROM cars WHERE availability = TRUE';

  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const getCarById = (id) => {
  const query = 'SELECT * FROM cars WHERE id = ?';

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return reject(new Error('Car not found'));
      resolve(results[0]);
    });
  });
};

const updateCar = (id, updateData) => {
  const query = `
    UPDATE cars 
    SET 
      Name = COALESCE(?, Name),
      Model = COALESCE(?, Model),
      \`Rent-Price\` = COALESCE(?, \`Rent-Price\`),
      availability = COALESCE(?, availability),
      Image = COALESCE(?, Image)
    WHERE id = ?
  `;

  return new Promise((resolve, reject) => {
    db.query(query, [
      updateData.Name,
      updateData.Model,
      updateData["Rent-Price"],
      updateData.availability,
      updateData.Image,
      id,
    ], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const deleteCar = (id) => {
  const query = 'DELETE FROM cars WHERE id = ?';

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

module.exports = {
  createCar,
  getAllCars,
  getCarById,
  updateCar,
  deleteCar,
};

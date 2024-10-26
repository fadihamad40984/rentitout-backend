const db = require('../config/db');

exports.addLocation = (latitude, longitude) => {
  const query = `
    INSERT INTO locations (latitude, longitude) 
    VALUES (?, ?)
  `;

  return new Promise((resolve, reject) => {
    db.query(query, [latitude, longitude], (err, result) => {
      if (err) {
        console.error('Error executing query', {
          query,
          params: [latitude, longitude],
          error: err
        });
        return reject(err);
      }
      resolve(result);
    });
  });
};

exports.getAllLocations = () => {
  const query = 'SELECT * FROM locations';

  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};


exports.getAllReviews = () => {
  const query = 'SELECT * FROM reviews';

  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching reviews:', err);
        return reject(err);
      }
      resolve(results);
    });
  });
};
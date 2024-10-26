const db = require('../config/db');


const BASE_PERCENTAGE = 0.5; 
const ITEM_RISK_FACTOR = 100; 

exports.createRental = (rentalData) => {
  const { Car_Id, renter_id, start_date, end_date, price, rental_duration, deposit_amount, rental_method } = rentalData;

  const query = `INSERT INTO rentals 
                  (Car_Id, renter_id, start_date, end_date, price, rental_duration, deposit_amount, rental_method) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  return new Promise((resolve, reject) => {
      db.query(query, [
        Car_Id,               
          renter_id,
          start_date,
          end_date,
          price,
          rental_duration,    
          deposit_amount,
          rental_method
      ], (err, result) => {
          if (err) {
              console.error('Error executing query', {
                  query,
                  params: [Car_Id, renter_id, start_date, end_date, price, rental_duration, deposit_amount, rental_method],
                  error: err 
              });
              return reject(err);
          }
          resolve(result);
      });
  });
};


exports.getRentalsByUser = (userId) => {
    const query = `SELECT * FROM rentals WHERE renter_id = ?`;
    return new Promise((resolve, reject) => {
        db.query(query, [userId], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

exports.getRentalsByItem = (carId) => {
    const query = `SELECT * FROM rentals WHERE \`Car-Id\` = ?`; 
    return new Promise((resolve, reject) => {
        db.query(query, [carId], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};




exports.updateStatus = async (rentalId , status) => {
  try {
    await exports.updateRentalStatus(rentalId, status);

    if (status === 'approved') {
        const rentalPrice = await new Promise((resolve, reject) => {
            exports.getPriceByRentalId(rentalId, (err, price) => {
                if (err) return reject(err);
                resolve(price);
            });
        });

        const totalPrice = rentalPrice; 

        await exports.addTotalPrice(rentalId, totalPrice);

        const depositAmount = calculateDepositAmount(rentalPrice);

        await exports.addSecurityDeposit(rentalId, depositAmount);
    }

    return { message: 'Status updated successfully' };
} catch (err) {
    console.error('Error updating status:', err);
    throw new Error('Failed to update rental status');
}
};


exports.updateRentalStatus = (rentalId, status) => {
    const query = `UPDATE rentals SET rental_status = ? WHERE rental_id = ?`;
    return new Promise((resolve, reject) => {
        db.query(query, [status, rentalId], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

exports.getPriceByRentalId = (rentalId, callback) => {
  const query = 'SELECT price FROM rentals WHERE rental_id = ?';
  db.query(query, [rentalId], (err, results) => {
      if (err) return callback(err);
      
      if (results.length === 0) {
          return callback(new Error('Price not found for this rental'));
      }

      callback(null, results[0].price); 
  });
};




exports.addTotalPrice = (rentalId, totalPrice) => {
  const query = `
    INSERT INTO rental_prices (rental_id, total_price) 
    VALUES (?, ?)
  `;

  return new Promise((resolve, reject) => {
    db.query(query, [rentalId, totalPrice], (err, result) => {
      if (err) {
        console.error('Error executing query', {
          query,
          params: [rentalId, totalPrice],
          error: err
        });
        return reject(err);
      }
      resolve(result);
    });
  });
};


exports.addSecurityDeposit = (rentalId, depositAmount) => {
  const query = `
    INSERT INTO security_deposits (rental_id, deposit_amount, status) 
    VALUES (?, ?, 'held')
  `;

  return new Promise((resolve, reject) => {
    db.query(query, [rentalId, depositAmount], (err, result) => {
      if (err) {
        console.error('Error executing query', {
          query,
          params: [rentalId, depositAmount],
          error: err
        });
        return reject(err);
      }
      resolve(result);
    });
  });
};



const calculateDepositAmount = (rentalPrice) => {
  return (BASE_PERCENTAGE * rentalPrice) + ITEM_RISK_FACTOR;
};

exports.addReview = (userId, rating, comment) => {
  const query = `
      INSERT INTO reviews (user_id, rating, comment) 
      VALUES (?, ?, ?)
  `;

  return new Promise((resolve, reject) => {
      db.query(query, [userId, rating, comment], (err, result) => {
          if (err) {
              console.error('Error executing query', {
                  query,
                  params: [userId, rating, comment],
                  error: err,
              });
              return reject(err);
          }
          resolve(result);
      });
  });
};

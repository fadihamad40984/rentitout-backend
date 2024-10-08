const db = require('../config/db');

exports.createRental = (rentalData) => {
    const { item_id, renter_id, start_date, end_date, price, rental_duration, deposit_amount, rental_method } = rentalData;

    const query = `INSERT INTO rentals 
                    (item_id, renter_id, start_date, end_date, price, rental_duration, deposit_amount, rental_method) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    return new Promise((resolve, reject) => {
        db.query(query, [
            item_id,
            renter_id,
            start_date,
            end_date,
            price,
            rental_duration,
            deposit_amount,
            rental_method
        ], (err, result) => {
            if (err) {
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



exports.getRentalsByItem = (itemId) => {
    const query = `SELECT * FROM rentals WHERE item_id = ?`;
    return db.query(query, [itemId]);
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
const db = require('../config/db');


exports.GetRentalById = (rental_id) => {
    const query = `SELECT * FROM rentals WHERE rental_id = ? AND rental_status = 'approved'`;
    return new Promise((resolve, reject) => {
        db.query(query, [rental_id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};


exports.createLogistice=(logisticData)=>{

    const {rental_id,rental_lat,rental_lng,pickupPlace,deliveryCost}=logisticData

    const query = `INSERT INTO rentals 
                    (rental_id, renter_lat, renter_lng, renter_place, delivery_cost) 
                    VALUES (?, ?, ?, ?, ?)`;

    return new Promise((resolve, reject) => {
        db.query(query, [
            rental_id,
            rental_lat,
            rental_lng,
            pickupPlace,
            deliveryCost
        ], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

exports.GetCompany=(company_id)=>{
    const query = `SELECT * FROM rentalcompany WHERE id =?`;
    return new Promise((resolve, reject) => {
        db.query(query, [company_id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });

}


exports.GetAllPickup =()=>{
    const deliveryCost =0;
    const query =' SELECT * FROM logistictable WHERE delivery_cost =?';
    return new Promise((resolve, reject) => {
        db.query(query, [deliveryCost], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });

}


exports.GetOnePickup=(pickup_id)=>{

    const deliveryCost =0;
    const query =' SELECT * FROM logistictable WHERE id=? AND delivery_cost =?';
    return new Promise((resolve, reject) => {
        db.query(query, [pickup_id,deliveryCost], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });

}


exports.GetAllDvlivry=()=>{
    const pickupPlace ='not_pickup';
    const query =' SELECT * FROM logistictable WHERE renter_place =?';
    return new Promise((resolve, reject) => {
        db.query(query, [pickupPlace], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });

}

exports.GetOneDelivry=(delivry_id)=>{
    const pickupPlace ='not_pickup';
    const query =' SELECT * FROM logistictable WHERE id=? AND renter_place =?';
    return new Promise((resolve, reject) => {
        db.query(query, [delivry_id,pickupPlace], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });

}

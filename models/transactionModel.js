const db = require('../config/db');


exports.GetRentalById = (rental_id) => {
    const query = `SELECT * FROM rentals WHERE rental_id = ?`;
    return new Promise((resolve, reject) => {
        db.query(query, [rental_id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};


exports.createTreansaction=(transactionData)=>{
    const{rentalId, owner_id, rentalAmount, platformCommission, securityDeposit, insuranceFee, totaltransactionCost}=transactionData
    const query =`INSERT INTO rental_transactions 
                (rental_id, user_id, rental_amount, platform_commission, security_deposit, insurance_fee, total_cost)
                VALUES(?, ?, ?, ?, ?, ?, ?)`;



return new Promise((resolve, reject) => {
    db.query(query, [
        rentalId,
        owner_id,
        rentalAmount,
        platformCommission,
        securityDeposit,
        insuranceFee,
        totaltransactionCost
    ], (err, result) => {
        if (err) {
            return reject(err);
        }
        resolve(result);
    });
});


};


exports.GETAllTransaction =()=>{
 const query =`SELECT * FROM rental_transactions`
 return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });

}


exports.GETTransactionOFUser=(user_id)=>{

    const query =`SELECT * FROM rental_transactions WHERE user_id =?`
    return new Promise((resolve, reject) => {
        db.query(query, [user_id], (err, results) => {
          if (err) return reject(err);
          if (results.length === 0) return reject(new Error('this user has no transaction yet'));
          resolve(results[0]);
        });
      });
}

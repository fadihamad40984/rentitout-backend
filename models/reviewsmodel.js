const db = require('../config/db');


    // Method to insert a new review
    exports.SetReview = (productId, oldNumReviews, oldRating, Rating) => {

        const newRating =  ((oldRating*oldNumReviews)+Rating)/(oldNumReviews+1)
        const newreviews = oldNumReviews+1

        const query =' UPDATE items SET Reviews_Rate = ?, Num_Reviews = ? WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [newRating,newreviews,productId], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

    }

    exports.getAllItems=()=>{

        const query = 'SELECT * FROM Items ORDER BY Reviews_Rate DESC';
  
        return new Promise((resolve, reject) => {
          db.query(query, (err, results) => {
            if (err) return reject(err);
            resolve(results);
          });
        });

    }



    


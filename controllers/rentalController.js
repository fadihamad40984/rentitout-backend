const rentalModel = require('../models/rentalModel');
const carModel = require('../models/carsModel'); 

const calculatePrice = (startDate, endDate, basePrice) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)); 
    return (basePrice * days) + 25;
};

exports.createRental = async (req, res) => {
  console.log('Request Body:', req.body);

  if (!req.body) {
      return res.status(400).json({ message: 'Request body is missing' });
  }

  const { Car_Id, renter_id, start_date, end_date, rental_method } = req.body;

  try {
      const car = await carModel.getCarById(Car_Id);
      console.log('Fetched Car:', car); 
      if (!car) return res.status(404).json({ message: 'Car not found' });

      const rentalDuration = Math.ceil((new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24));
      const price = calculatePrice(start_date, end_date, car["Rent-Price"]);

      const rentalData = {
          "Car_Id": Car_Id, 
          renter_id,
          start_date,
          end_date,
          price,
          rental_duration: rentalDuration,
          deposit_amount: car.deposit_amount || 0,
          rental_method,
          rental_status: 'pending'
      };

      console.log('Rental Data:', rentalData); 
      const result = await rentalModel.createRental(rentalData);
      res.status(201).json({ message: 'Rental created successfully', rental_id: result.insertId });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getRentalsByUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        const rentals = await rentalModel.getRentalsByUser(userId);
        if (rentals.length === 0) {
            return res.status(404).json({ message: 'No rentals found' });
        }

        res.status(200).json(rentals);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateRentalStatus = async (req, res) => {
  if(!(req.user.role === 'user')){
    return res.status(403).json({ message: 'You are not authorized to update status.' });
  }
  else{
    const { rentalId, status } = req.body;

    try {
        await rentalModel.updateStatus(rentalId, status);
        res.status(200).json({ message: 'Rental status updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
  }
};



exports.submitReview = async (req, res) => {

  if(!(req.user.role === 'renter')){
    return res.status(403).json({ message: 'You are not authorized to submit a review.' });
  }

  else{
  const { rating, comment } = req.body; 
  const user_id = req.user.id;
  //const role = req.user.role;
  //console.log(`role is ${role}`);
  try {
      if (rating < 1 || rating > 5) {
          return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
      }

      const result = await rentalModel.addReview(user_id, rating, comment);
      res.status(201).json({ message: 'Review submitted successfully', review_id: result.insertId });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error', error: err.message });
  }
}
};
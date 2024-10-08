const rentalModel = require('../models/rentalModel');
const itemModel = require('../models/itemsModel'); 

const calculatePrice = (startDate, endDate, basePrice, rentalDuration) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)); 

    let totalPrice = 0;
    switch (rentalDuration) {
        case 'daily':
            totalPrice = basePrice * days;
            break;
        case 'weekly':
            const weeks = Math.ceil(days / 7);
            totalPrice = basePrice * weeks;
            break;
        case 'hourly':
            const hours = days * 24;
            totalPrice = basePrice * hours;
            break;
        default:
            throw new Error('Invalid rental duration');
    }

    return totalPrice;
};

// Create rental
exports.createRental = async (req, res) => {
    const { item_id, renter_id, start_date, end_date, rental_duration, rental_method } = req.body;

    try {
        const item = await itemModel.getItemById(item_id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        const price = calculatePrice(start_date, end_date, item.price, rental_duration);

        const rentalData = {
            item_id,
            renter_id,
            start_date,
            end_date,
            price,
            rental_duration,
            deposit_amount: item.deposit_amount || 0,
            rental_method
        };

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
    const { rentalId, status } = req.body;

    try {
        await rentalModel.updateRentalStatus(rentalId, status);
        res.status(200).json({ message: 'Rental status updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const rentalModel = require('../models/rentalModel');
const LogisticsModel = require('../models/LogisticsModel');
const APIKey = 'af4a0f8b8a74428d84f5ecdbf00285c6';
const axios = require('axios');




function haversineDistance(lat1, lng1, lat2, lng2) {
    const toRadians = degree => degree * (Math.PI / 180);

    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in kilometers
    console.log(distance)
    return distance;
}





exports.MakePickup = async (req, res) => {
    const { rental_lat, rental_lng } = req.body;
    const query = 'mall';
    const radius = 5000; // Fixed typo from radiuss to radius
    const rental_id = req.params.id;

    if (!rental_lat || !rental_lng) {
        return res.status(400).json({ error: 'Latitude and Longitude are required.' });
    }
    if (!rental_id) {
        return res.status(400).json({ error: 'Rental ID is required.' });
    }

    try {
        const rental = await LogisticsModel.GetRentalById(rental_id);
        if (!rental.length) return res.status(404).json({ message: 'Rental not found' });
        if (rental[0].rental_method !== 'pickup') {
            return res.status(404).json({ message: 'Rental method not a pickup method' });
        }
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${rental_lat},${rental_lng}&radius=${radius}&keyword=${query}&key=${APIKey}`;

        try {
            const response = await axios.get(url);
            console.log("hello")
            if (response.data.results.length === 0) {
                return res.status(404).json({ message: 'No nearby pickup locations found' });
            }

            const firstPlace = response.data.results[0]; // Use the first place from the response
            const pickupPlace = `${firstPlace.name}, ${firstPlace.location.address}`;
            console.log(pickupPlace);
            const deliveryCost = 0;

            const logisticData = {
                rental_id,
                rental_lat,
                rental_lng,
                pickupPlace,
                deliveryCost
            };

            const result = await LogisticsModel.createLogistice(logisticData);

            res.json({
                pickupMethod: rental[0].rental_method,
                pickupAddress: firstPlace.location.address,
                pickupLocation: {
                    name: firstPlace.name,
                    address: firstPlace.location.address,
                    coordinates: {
                        lat: firstPlace.location.lat,
                        lng: firstPlace.location.lng
                    }
                },
                result: result
            });
        } catch (error) {
            console.error('Error fetching nearby pickup locations:', error);
            res.status(500).json({ error: 'Error fetching nearby pickup locations' });
        }
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


exports.MakeDelivery = async (req, res) => {
    const { renter_lat, renter_lng } = req.body; // Fixed typo from rentar_lat to renter_lat
    const rental_id = req.params.id;
    console.log(renter_lat)

    if (!renter_lat || !renter_lng) {
        return res.status(400).json({ error: 'Client lat and lng are required' });
    }
    if (!rental_id) {
        return res.status(400).json({ error: 'Rental ID is required' });
    }

    try {
        const rental = await LogisticsModel.GetRentalById(rental_id);
        if (!rental.length) return res.status(404).json({ message: 'Rental not found' });
        if (rental[0].rental_method !== 'delivery') {
            return res.status(404).json({ message: 'Rental method not a delivery method' });
        }

        const companyCoordinates = await LogisticsModel.GetCompany(1);
        const company_lat = companyCoordinates[0].company_lat;
        const company_lng = companyCoordinates[0].company_lng;

        try {
            const distanceKm = haversineDistance(company_lat, company_lng, renter_lat, renter_lng);
            const baseCost = 5; // Base cost for delivery
            const costPerKm = 1.5; // Cost per kilometer
            const deliveryCost = baseCost + (costPerKm * distanceKm);
            const pickupPlace = 'not_pickup';

            const logisticData = {
                rental_id,
                renter_lat,
                renter_lng,
                pickupPlace,
                deliveryCost
            };

            const result = await LogisticsModel.createLogistice(logisticData);

            res.json({
                distance_km: distanceKm,
                delivery_cost: deliveryCost,
                result: result
            });
        } catch (error) {
            console.error('Error calculating delivery cost:', error);
            res.status(500).json({ error: 'Error calculating delivery cost' });
        }
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


exports.GetAllPickup=async(req,res)=>{

    try{

        const rentals = await LogisticsModel.GetAllPickup();
        if (rentals.length === 0) {
            return res.status(404).json({ message: 'No pickup method rental found' });
        }

        res.status(200).json(rentals);


    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }

};

exports.GetOnePickup =async(req,res)=>{

    const pickup_id = req.params.id
    try{

        const rentals = await LogisticsModel.GetOnePickup(pickup_id)
        if (rentals.length === 0) {
            return res.status(404).json({ message: 'No pickup method rental found' });
        }

        res.status(200).json(rentals);


    }catch(err){

        console.error(err);
        res.status(500).json({ message: 'Server error' }); 
    }
};

exports.GetAllDelivry= async(req,res)=>{
    try{

        const rentals = await LogisticsModel.GetAllDvlivry();
        if (rentals.length === 0) {
            return res.status(404).json({ message: 'No Dvlivry method rental found' });
        }

        res.status(200).json(rentals);


    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }

};

exports.GetOneDelivry=async(req,res)=>{

    const delivry_id = req.params.id
    try{

        const rentals = await LogisticsModel.GetOneDelivry(delivry_id)
        if (rentals.length === 0) {
            return res.status(404).json({ message: 'No Delivry method rental found' });
        }

        res.status(200).json(rentals);


    }catch(err){

        console.error(err);
        res.status(500).json({ message: 'Server error' }); 
    }
};




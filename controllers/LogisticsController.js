const rentalModel = require('../models/rentalModel');
const LogisticsModel = require('../models/LogisticsModel');
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

exports.MakePickup =async(req,res)=>{

    const {rental_lat,rental_lng} = req.body
    const rental_id = req.params.id

    if(!rental_lat || !rental_lng){
        return res.status(400).json({ error: 'Client are required' });
    }
    if(!rental_id){
        return res.status(400).json({ error: 'rental ID is required' });
    }

    try{

        const rental = await LogisticsModel.GetRentalById(rental_id)
        if (!rental) return res.status(404).json({ message: 'rental not found' });
        if(rental.rental_method !='pickup'){
            return res.status(404).json({ message: 'rental method not a pickup method' });
        }else{

            try {
                // Fetch nearby pickup locations using Google Places API
                const { data } = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
                    params: {
                        location: `${rental_lat},${rental_lng}`,
                        radius: 5000, // Search within 5 km
                        type: 'store', // You can change this to other place types
                        key: GOOGLE_MAPS_API_KEY
                    }
                });
        
                
                if (data.results.length === 0) {
                    return res.status(404).send('No nearby pickup locations found');
                }
        
                // Example: Automatically select the first nearby location (you could change this based on user input)
                const selectedLocation = data.results[0];
                const pickupPlace=selectedLocation.name+","+selectedLocation.vicinity
                const deliveryCost =0;
                const logisticData={
                    rental_id,
                    rental_lat,
                    rental_lng,
                    pickupPlace,
                    deliveryCost
                    
                }
                const result = await LogisticsModel.createLogistice(logisticData)

        
                // Create a response with the pickup method and the selected pickup address
                res.json({
                    pickupMethod: rental.method,
                    pickupAddress: selectedLocation.vicinity, // Address of the selected pickup location
                    pickupLocation: {
                        name: selectedLocation.name,
                        address: selectedLocation.vicinity,
                        coordinates: {
                            lat: selectedLocation.geometry.location.lat,
                            lng: selectedLocation.geometry.location.lng
                        }
                    },
                    result:result
                });
            } catch (error) {
                console.error(error); // Log the error for debugging
                res.status(500).send('Error fetching nearby pickup locations');
            }



        }//else


    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }

};


exports.MakeDelivry=async(req,res)=>{

    const {rentar_lat,rentar_lng} = req.body
    const rental_id = req.params.id
    if(!rentar_lat || !rentar_lng){
        return res.status(400).json({ error: 'Client are required' });
    }
    if(!rental_id){
        return res.status(400).json({ error: 'rental ID is required' });
    }

    try{

        const rental = await LogisticsModel.GetRentalById(rental_id)
        if (!rental) return res.status(404).json({ message: 'rental not found' });
        if(rental.rental_method !='delivry'){
            return res.status(404).json({ message: 'rental method not a delivry method' });
        }else{

            const company_cordinate =await LogisticsModel.GetCompany(1)
            const company_lat=company_cordinate.company_lat
            const company_lng = company_cordinate.company_lng

            try {
                // Call the Google Distance Matrix API
                const response = await axios.get(
                  `https://maps.googleapis.com/maps/api/distancematrix/json`,
                  {
                    params: {
                      origins: `${company_lat},${company_lng}`, // Store location
                      destinations: `${rentar_lat},${rentar_lng}`, // Client location
                      key: GOOGLE_MAPS_API_KEY
                    }
                  }
                );
            
                // Extract distance from the API response
                const distanceInfo = response.data.rows[0].elements[0];
                if (distanceInfo.status === "ZERO_RESULTS") {
                  return res.status(404).json({ error: "No route found between store and client" });
                }
            
                const distance = distanceInfo.distance.value; // distance in meters
                const distanceKm = distance / 1000; // convert to kilometers
            
                //cost: my role
                const baseCost = 5; // Base cost for delivery
                const costPerKm = 1.5; // Cost per kilometer
                const deliveryCost = baseCost + (costPerKm * distanceKm);
                const pickupPlace ='not_pickup'

                const logisticData={
                    rental_id,
                    rentar_lat,
                    rentar_lng,
                    pickupPlace,
                    deliveryCost

                }

                const result = await LogisticsModel.createLogistice(logisticData)


            
                // Return the delivery cost
                res.json({
                  distance_km: distanceKm,
                  delivery_cost: deliveryCost,
                  result:result
                });
              } catch (error) {
                console.error('Error calculating delivery cost:', error);
                res.status(500).json({ error: 'Error calculating delivery cost' });
              }

        }//else


    }catch(err){
        console.error(err);
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




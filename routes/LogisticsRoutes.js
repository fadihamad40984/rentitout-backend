const express = require('express');
const router = express.Router();
const LogisticsControllers =require('../controllers/LogisticsController');
const authenticateToken = require('../middleware/authMiddleware');
const { body } = require('express-validator');



// last feature 4 work

// Admin add pickup postaion

router.post('/addlocation',
    // authenticateToken,
    [
        body('lat').notEmpty().withMessage('lat is required'),
        body('lng').notEmpty().withMessage('lng is required')
    ],
    LogisticsControllers.AddnewLocation
)


router.get('/getalllocations',
    // authenticateToken,
    LogisticsControllers.GetAllLocation
)




//add pickuplocation if method of rental is pickup
router.post('/pickup/:id',
    authenticateToken,
    [
        body('renter_lat').notEmpty().withMessage('renter lat is required'),
        body('renter_lng').notEmpty().withMessage('renter lng is required')
    ],
    LogisticsControllers.MakePickup
);


// add delivery cost if the method of rental is delivery
router.post('/delivry/:id',
    authenticateToken,
    [
        body('renter_lat').notEmpty().withMessage('renter lat is required'),
        body('renter_lng').notEmpty().withMessage('renter lng is required')
    ],
    LogisticsControllers.MakeDelivery

);


// get all pickup entity in the table
router.get('/pickup',
    authenticateToken,
    LogisticsControllers.GetAllPickup

);

//get one pickup according to the id 
router.get('/pickup/:id',
    authenticateToken,
    LogisticsControllers.GetOnePickup

);

//get all delivry entity in the table
router.get('/delivry',
    authenticateToken,
    LogisticsControllers.GetAllDelivry
);

//get one delivry according to the id 
router.get('/delivry/:id',
    authenticateToken,
    LogisticsControllers.GetOneDelivry
)



module.exports = router;

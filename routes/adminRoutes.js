const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticateToken = require('../middleware/authMiddleware'); 


router.post('/locations', authenticateToken, adminController.createLocation);

router.get('/locations', authenticateToken, adminController.getLocations);

router.get('/reviews', authenticateToken, adminController.getAllReviews);

module.exports = router;

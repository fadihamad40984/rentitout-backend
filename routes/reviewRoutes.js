const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const reviewController = require('../controllers/reviewController');
const authenticateToken = require('../middleware/authMiddleware')


router.put(
    '/:product_id',
    authenticateToken,
    [
        body('Rating').notEmpty().withMessage('Rating is required'),
    
    ],
     reviewController.SetReview
    );

    router.get(
        '/',
        authenticateToken,
        reviewController.getReviews
    );    

module.exports = router;
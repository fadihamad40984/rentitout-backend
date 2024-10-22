const express = require('express');
const router = express.Router();
const transactionControllers=require('../controllers/transactionController');
const authenticateToken = require('../middleware/authMiddleware');
const { body } = require('express-validator');


// make transaction
router.post('/process/:rental_id',
    authenticateToken,
    transactionControllers.processTarnsaction
);

//GET ALL transactions
router.get('/process',
    /*authenticateToken,*/
    transactionControllers.getALLTransaction
);


//GET one transaction according to user id
router.get('/process/:user_id',
    authenticateToken,
    transactionControllers.getOneUserTransaction

);


module.exports = router;
const rentalModel = require('../models/rentalModel');
const TransactionModel = require('../models/transactionModel');
const itemModel = require('../models/itemsModel')


const calculatePlatformCommission = (rentalAmount, commissionRate = 0.1) => rentalAmount * commissionRate;
const calculateSecurityDeposit = (rentalAmount, depositRate = 0.2) => rentalAmount * depositRate;
const calculateInsuranceFee = (rentalAmount, insuranceRate = 0.05) => rentalAmount * insuranceRate;


exports.processTarnsaction =async(req,res)=>{

        const rentalId = req.params.rental_id
        if (!rentalId) {
            return res.status(400).json({ message: 'Rental ID is required' });
        }

        try{

            const rental = await TransactionModel.GetRentalById(rentalId)
            const rentalAmount = rental[0].price
            const item_id= rental[0].item_id
            const item = await itemModel.getItemById(item_id)
            const owner_id = item.user_id

            const platformCommission = calculatePlatformCommission(rentalAmount);
            const securityDeposit = calculateSecurityDeposit(rentalAmount);
            const insuranceFee = calculateInsuranceFee(rentalAmount);
            const totaltransactionCost = platformCommission + securityDeposit + insuranceFee;

            const transactionData ={
                rentalId,
                owner_id,
                rentalAmount,
                platformCommission,
                securityDeposit,
                insuranceFee,
                totaltransactionCost,

            }

            const result = await TransactionModel.createTreansaction(transactionData)


            res.status(201).json({
                message: 'Transaction processed successfully',
                transactionID:result.insertId,
                transaction: {
                    rentalId,
                    platformCommission,
                    securityDeposit,
                    insuranceFee,
                    totaltransactionCost
                }
            });



        }catch(error){
            console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
        }
}


exports.getALLTransaction = async(req,res)=>{

        try{
            const transactions =await TransactionModel.GETAllTransaction();
            return res.status(200).json(transactions);

        }catch(err){
            console.error('Error fetching items:', err);
            return res.status(500).json({ message: 'Server error while fetching items.' });
        }

}


exports.getOneUserTransaction =async(req,res)=>{

    const user_id = req.params.user_id
    if(!user_id){
        return res.status(400).json({ message: 'User ID is required!!' });
    }

    try{

        const transactions = await TransactionModel.GETTransactionOFUser(user_id)
        return res.status(200).json(transactions);

    }catch(err){
        console.error('Error fetching items:', err);
            return res.status(500).json({ message: 'Server error while fetching items.' });
    }
}


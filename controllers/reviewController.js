const itemModel = require('../models/itemsModel')
const Review = require('../models/reviewsmodel');
    
exports.SetReview = async (req, res) => {
        try {
            const productId = req.params.product_id;
            const { Rating } = req.body;

            // Validate review is an integer and between 1 and 5
            if (!Number.isInteger(Rating) || Rating < 1 || Rating > 5) {
                return res.status(400).json({ error: 'Rating must be an integer between 1 and 5' });
            }

            // Check if the product exists
            const item = await itemModel.getItemById(productId)
            if (!item) {
                return res.status(404).json({ error: 'item not found' });
            }else{
            // Insert the Rating
            const oldRating = item.Reviews_Rate
            const oldNumReviews =item.Num_Reviews 
            const result = await Review.SetReview(productId,oldNumReviews,oldRating, Rating);
            res.status(201).json({ message: 'Rating added successfully'});
            }
        } catch (error) {
            console.error('Error adding Rating:', error);
            res.status(500).json({ error: 'Database error' });
        }
    }

    exports.getReviews = async (req, res) => {
        try {
            const items = await Review.getAllItems();
            
            return res.status(200).json(items);
          } catch (err) {
            console.error('Error fetching items:', err);
            return res.status(500).json({ message: 'Server error while fetching items.' });
          }
    }



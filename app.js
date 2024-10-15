const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const rentalRoutes = require('./routes/rentalRoutes');

//************ */
const LogisticsRoutes =require('./routes/LogisticsRoutes');
const transactionRoutes = require('./routes/transactionRoutes')


const app = express();

app.use(bodyParser.json());


app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/rentals', rentalRoutes);

//*********malik*********** */
app.use('/api/Logistics',LogisticsRoutes)
app.use('/api/transaction',transactionRoutes)



const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
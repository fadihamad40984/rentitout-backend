const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const carRoutes = require('./routes/carRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
const userModel = require('./models/userModel');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(bodyParser.json());
app.use(express.json());


app.use('/api/users', userRoutes);


app.use('/api/cars', carRoutes);

app.use('/api/rentals', rentalRoutes);

app.use('/api/admin', adminRoutes);
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



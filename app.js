const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
const app = express();

app.use(bodyParser.json());


app.use('/api/users', userRoutes);


app.use('/api/items', itemRoutes);

app.use('/api/rentals', rentalRoutes);
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
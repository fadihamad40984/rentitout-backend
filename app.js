const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const app = express();

app.use(bodyParser.json());


app.use('/api/users', userRoutes);


app.use('/api/items', itemRoutes);
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
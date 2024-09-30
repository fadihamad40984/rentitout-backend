const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use('/api/users', userRoutes);

// Start the server
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

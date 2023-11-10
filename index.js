const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const productsRouter = require('./routes/products');
const helmet = require('helmet');
const app = express();
const port = process.env.PORT || 5000; // Use environment variable for port or default to 5000

require('dotenv').config();

// Middleware
app.use(cors()); // Enable All CORS Requests for development purposes
app.use(express.json()); // Parses incoming JSON requests and puts the parsed data in `req.body`

// Use Helmet for HTTP security
app.use(helmet());

// Basic route for home page
app.get('/', (req, res) => {
  res.send('Welcome to the MERN Stack eCommerce Application!');
});

// Products Route
app.use('/api/products', productsRouter); // Updated to match the frontend route

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connection established'))
.catch(error => console.error('MongoDB connection error:', error));

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const productsRouter = require('./routes/products');
const helmet = require('helmet');
const app = express();
const port = process.env.PORT || 3000; // Use environment variable for port or default to 3000

require('dotenv').config();

// Middleware
app.use(cors()); // Enable All CORS Requests for development purposes
app.use(express.json()); // Parses incoming JSON requests and puts the parsed data in `req.body`

//use for http security
app.use(helmet());

// Basic route for home page
app.get('/', (req, res) => {
  res.send('Welcome to the MERN Stack eCommerce Application!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

//Route
app.use('/products', productsRouter);


  //connectToDatabase();
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connection established'))
  .catch(error => console.error('MongoDB connection error:', error));
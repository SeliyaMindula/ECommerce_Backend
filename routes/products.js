const express = require('express');
const multer = require('multer');
const Product = require('../models/product');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Middleware function to get product object by ID
async function getProduct(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.params.id);
    if (product == null) {
      return res.status(404).json({ message: 'Cannot find product' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.product = product;
  next();
}

// Place the search route before any 'get by id' routes
router.get('/search', async (req, res) => {
  try {
    const searchTerm = req.query.term;
    const regex = new RegExp(searchTerm, 'i');
    const products = await Product.find({
      $or: [
        { name: { $regex: regex } },
        { description: { $regex: regex } },
      ],
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Other routes should come after the search route
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new product with image upload
router.post('/', upload.array('images'), async (req, res) => {
  const { sku, quantity, name, description } = req.body;
  const images = req.files.map(file => file.path); // Extracting file paths

  const product = new Product({
    sku,
    quantity,
    name,
    images, // Storing image paths in the database
    description
  });

  try {
    // Save the new product to the database
    const newProduct = await product.save();
    res.status(201).json({ message: 'New product added successfully!', product: newProduct });
  } catch (error) {
    // If saving to the database fails
    console.error('Failed to add product:', error);
    res.status(400).json({ message: 'Failed to add product.', error: error.message });
  }
});

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT (update) a product by ID
router.put('/:id', upload.array('images'), getProduct, async (req, res) => {
  // Update fields that are provided in the request
  if (req.body.name != null) {
    res.product.name = req.body.name;
  }
  if (req.body.sku != null) {
    res.product.sku = req.body.sku;
  }
  if (req.body.quantity != null) {
    res.product.quantity = req.body.quantity;
  }
  if (req.body.description != null) {
    res.product.description = req.body.description;
  }
  if (req.files) {
    res.product.images = req.files.map(file => file.path);
  }
  // If you're allowing image updates, you'll need to handle file uploads here

  try {
    const updatedProduct = await res.product.save();
    res.json({ message: 'Product updated successfully!', product: updatedProduct });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update product.', error: error.message });
  }
});



// DELETE a product
router.delete('/:id', async (req, res) => {
  try {
    const result = await Product.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Deleted product' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = router;

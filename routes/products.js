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
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
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

// GET a single product by ID
router.get('/:id', getProduct, (req, res) => {
  res.json(res.product);
});

// PATCH (update) a product by ID
router.patch('/:id', getProduct, async (req, res) => {
  if (req.body.name != null) {
    res.product.name = req.body.name;
  }
  // Add other fields updates as needed
  try {
    const updatedProduct = await res.product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a product
router.delete('/:id', getProduct, async (req, res) => {
  try {
    await res.product.remove();
    res.json({ message: 'Deleted product' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

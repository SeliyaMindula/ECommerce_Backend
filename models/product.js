const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  quantity: { type: Number, required: true },
  name: { type: String, required: true },
  images: [{ type: String }], // Changed to an array to store multiple image paths
  description: { type: String, required: true }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

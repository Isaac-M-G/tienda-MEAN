const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  imageUrl: String,
  price: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  name: String,
  address: String,
  productId: String,
  trackingNumber: String,
  courier: String,
  status: { type: String, default: "Order Placed" },
});

module.exports = mongoose.model('Order', orderSchema); 
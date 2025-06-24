const express = require('express');
const router = express.Router();
const Order = require('../models/order');

// Place an order
router.post('/orders', async (req, res) => {
  const { trackingNumber } = req.body;
  let order = await Order.findOne({ trackingNumber });
  if (order) {
    return res.status(200).json({ message: 'Order already exists', order });
  }
  order = new Order(req.body);
  await order.save();
  res.status(201).json({ message: 'Order created', order });
});

// Add tracking info (simulate admin use)
router.put('/orders/:id/tracking', async (req, res) => {
  const { trackingNumber, courier } = req.body;
  const updated = await Order.findByIdAndUpdate(req.params.id, {
    trackingNumber,
    courier,
    status: 'Shipped'
  }, { new: true });
  res.json(updated);
});

// Get dummy tracking data
router.get('/track/:trackingNumber', async (req, res) => {
  const { trackingNumber } = req.params;
  // Simulate database search
  const order = await Order.findOne({ trackingNumber });
  if (!order) return res.status(404).json({ error: 'Not found' });

  // Dummy status updates
  const trackingSteps = [
    { status: 'Order Placed', timestamp: '2025-06-20 10:00' },
    { status: 'Dispatched from warehouse', timestamp: '2025-06-21 15:00' },
    { status: 'In Transit', timestamp: '2025-06-22 12:00' },
    { status: 'Out for Delivery', timestamp: '2025-06-23 08:00' },
    { status: 'Delivered', timestamp: '2025-06-23 17:00' },
  ];

  res.json({
    trackingNumber,
    courier: order.courier,
    status: order.status,
    history: trackingSteps,
  });
});

module.exports = router; 
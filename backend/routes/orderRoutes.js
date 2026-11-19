
const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

const {
  getOrders,
  getOrderById,
  getMyOrders,
  createOrder,
  confirmDemoPayment,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderController');

// Customer: Get their own order history
router.get('/my-orders', protect, getMyOrders);

// Admin: Get all orders
router.get('/', protect, adminOnly, getOrders);

// Customer: Create order
router.post('/', protect, createOrder);

// Customer: Confirm demo payment
router.post('/:id/demo-payment', protect, confirmDemoPayment);

// Admin: Get single order
router.get('/:id', protect, adminOnly, getOrderById);

// Admin: Update or delete orders
router.put('/:id', protect, adminOnly, updateOrderStatus);
router.delete('/:id', protect, adminOnly, deleteOrder);

module.exports = router;


const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderController');

// Only Admin can view all orders
router.get('/', protect, adminOnly, getOrders);

// Only Admin can view individual order details
router.get('/:id', protect, adminOnly, getOrderById);

// Logged-in customers can create orders
router.post('/', protect, createOrder);

// Only Admin can update or delete orders
router.put('/:id', protect, adminOnly, updateOrderStatus);
router.delete('/:id', protect, adminOnly, deleteOrder);

module.exports = router;

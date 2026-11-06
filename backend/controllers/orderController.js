const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// Get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('products.productId');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('products.productId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create order with automatic membership discount
const createOrder = async (req, res) => {
  try {
    const { products, address } = req.body;

    // Find logged-in customer
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: 'Customer not found'
      });
    }

    if (!address || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        message: 'Address and products are required'
      });
    }

    let subtotal = 0;
    const orderProducts = [];

    // Get actual product prices from database
    for (const item of products) {
      const product = await Product.findById(item.productId);
      const quantity = Number(item.quantity);

      if (!product) {
        return res.status(404).json({
          message: 'Product not found'
        });
      }

      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          message: 'Invalid product quantity'
        });
      }

      subtotal += product.price * quantity;

      orderProducts.push({
        productId: product._id,
        quantity
      });
    }

    // Calculate membership discount
const discountPercentage = user.membership?.isActive
? (user.membership.discountPercentage || 5)
: 0;

if (![5, 10, 15, 20].includes(discountPercentage)) {
  return res.status(400).json({
    message: 'Invalid membership discount'
  });
}

    const discountAmount = Number(
      (subtotal * discountPercentage / 100).toFixed(2)
    );

    const totalAmount = Number(
      (subtotal - discountAmount).toFixed(2)
    );

    // Create order
    const order = await Order.create({
      userId: user._id,
      customerName: user.fullName,
      email: user.email,
      phone: user.phone,
      address,
      products: orderProducts,
      subtotal,
      discountPercentage,
      discountAmount,
      totalAmount
    });

    res.status(201).json({
      message: 'Order created successfully',
      order
    });

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// Update order status and calculate membership loyalty
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      'Pending',
      'Processing',
      'Completed',
      'Cancelled'
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid order status'
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    // Add loyalty points only once when order becomes Completed
    if (status === 'Completed' && !order.loyaltyCredited) {
      if (!order.userId) {
        return res.status(400).json({
          message: 'This order is not linked to a customer account'
        });
      }

      const user = await User.findById(order.userId);

      if (!user) {
        return res.status(404).json({
          message: 'Customer not found'
        });
      }

      if (!user.membership) {
        user.membership = {
          isActive: true,
          level: 'standard',
          discountPercentage: 5,
          totalSpent: 0
        };
      }

      user.membership.totalSpent += order.totalAmount;

      const totalSpent = user.membership.totalSpent;

      if (totalSpent >= 50000) {
        user.membership.level = 'vip';
        user.membership.discountPercentage = 20;
      } else if (totalSpent >= 25000) {
        user.membership.level = 'gold';
        user.membership.discountPercentage = 15;
      } else if (totalSpent >= 10000) {
        user.membership.level = 'silver';
        user.membership.discountPercentage = 10;
      } else {
        user.membership.level = 'standard';
        user.membership.discountPercentage = 5;
      }

      await user.save();

      order.loyaltyCredited = true;
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      message: 'Order status updated successfully',
      order
    });

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder
};
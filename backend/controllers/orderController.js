
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// Admin: Get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('products.productId')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get single order
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

// Customer: Create order
const createOrder = async (req, res) => {
  const reservedProducts = [];

  try {
    const { products, address } = req.body;

    if (!address?.trim() || !Array.isArray(products) || !products.length) {
      return res.status(400).json({
        message: 'Delivery address and products are required'
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Combine repeated product IDs
    const quantities = new Map();

    for (const item of products) {
      const id = String(item.productId || '');
      const quantity = Number(item.quantity);

      if (!id || !Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          message: 'Invalid product or quantity'
        });
      }

      quantities.set(id, (quantities.get(id) || 0) + quantity);
    }

    let subtotal = 0;
    const orderProducts = [];

    // Validate and reserve stock
    for (const [productId, quantity] of quantities) {
      const product = await Product.findOneAndUpdate(
        {
          _id: productId,
          stock: { $gte: quantity }
        },
        {
          $inc: { stock: -quantity }
        },
        { new: true }
      );

      if (!product) {
        throw new Error(
          `Product unavailable or insufficient stock: ${productId}`
        );
      }

      reservedProducts.push({
        productId: product._id,
        quantity
      });

      subtotal += product.price * quantity;

      orderProducts.push({
        productId: product._id,
        quantity
      });
    }

    const discountPercentage = user.membership?.isActive
      ? (user.membership.discountPercentage || 5)
      : 0;

    if (![5, 10, 15, 20].includes(discountPercentage) &&
        discountPercentage !== 0) {
      throw new Error('Invalid membership discount');
    }

    const discountAmount = Number(
      (subtotal * discountPercentage / 100).toFixed(2)
    );

    const totalAmount = Number(
      (subtotal - discountAmount).toFixed(2)
    );

    const order = await Order.create({
      userId: user._id,
      customerName: user.fullName,
      email: user.email,
      phone: user.phone,
      address: address.trim(),
      products: orderProducts,
      subtotal,
      discountPercentage,
      discountAmount,
      totalAmount,
      status: 'Pending'
    });

    res.status(201).json({
      message: 'Order created successfully',
      order
    });

  } catch (error) {
    // Restore stock if order creation fails
    for (const item of reservedProducts) {
      await Product.updateOne(
        { _id: item.productId },
        { $inc: { stock: item.quantity } }
      ).catch(() => {});
    }

    res.status(400).json({ message: error.message });
  }
};

// Admin: Update order status and membership
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
      return res.status(404).json({ message: 'Order not found' });
    }

    if (status === 'Completed' && !order.loyaltyCredited) {
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

      const spent = user.membership.totalSpent;

      if (spent >= 50000) {
        user.membership.level = 'vip';
        user.membership.discountPercentage = 20;
      } else if (spent >= 25000) {
        user.membership.level = 'gold';
        user.membership.discountPercentage = 15;
      } else if (spent >= 10000) {
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
    res.status(400).json({ message: error.message });
  }
};

// Admin: Delete order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      message: 'Order deleted successfully'
    });
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


const express = require('express');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

const {
  getProducts,
  searchProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkImportProducts
} = require('../controllers/productController');


// ========================================
// PUBLIC ROUTES
// ========================================

// Get all products
router.get('/', getProducts);

// Search products directly from MongoDB
router.get('/search', searchProducts);

// Get a single product by ID
// Keep this route after /search to avoid route conflicts
router.get('/:id', getProductById);


// ========================================
// ADMIN ROUTES
// ========================================

// Bulk import products
router.post('/bulk', protect, adminOnly, bulkImportProducts);

// Create a new product
router.post('/', protect, adminOnly, createProduct);

// Update an existing product
router.put('/:id', protect, adminOnly, updateProduct);

// Delete a product
router.delete('/:id', protect, adminOnly, deleteProduct);


module.exports = router;

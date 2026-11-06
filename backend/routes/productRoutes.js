const express = require('express');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkImportProducts
} = require('../controllers/productController');

// Everyone can view products
router.get('/', getProducts);

// Only Admin can bulk import products
router.post('/bulk', protect, adminOnly, bulkImportProducts);

// Only Admin can manage individual products
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

// Get single product
router.get('/:id', getProductById);

module.exports = router;
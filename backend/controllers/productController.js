const Product = require('../models/Product');

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create product
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Bulk import products
const bulkImportProducts = async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        message: 'Please provide a non-empty products array.'
      });
    }

    if (products.length > 100) {
      return res.status(400).json({
        message: 'Maximum 100 products can be imported at once.'
      });
    }

    for (const product of products) {
      if (
        !product.name ||
        !product.brand ||
        !product.category ||
        product.price === undefined ||
        !Number.isFinite(Number(product.price)) ||
        Number(product.price) < 0
      ) {
        return res.status(400).json({
          message: 'Every product must have a name, brand, category and valid price.'
        });
      }
    }

    const existingProducts = await Product.find({
      $or: products.map((product) => ({
        name: product.name.trim(),
        brand: product.brand.trim()
      }))
    });

    const existingKeys = new Set(
      existingProducts.map(
        (product) =>
          `${product.name.toLowerCase()}|${product.brand.toLowerCase()}`
      )
    );

    const newProducts = products
      .filter((product) => {
        const key =
          `${product.name.trim().toLowerCase()}|${product.brand.trim().toLowerCase()}`;

        return !existingKeys.has(key);
      })
      .map((product) => ({
        name: product.name.trim(),
        brand: product.brand.trim(),
        category: product.category,
        price: Number(product.price),
        description: product.description || '',
        specifications: product.specifications || [],
        image: product.image || '',
        stock: Number(product.stock ?? 0)
      }));

    if (newProducts.length === 0) {
      return res.status(200).json({
        message: 'All products already exist.',
        imported: 0,
        skipped: products.length
      });
    }

    const importedProducts = await Product.insertMany(newProducts);

    res.status(201).json({
      message: 'Bulk import completed successfully.',
      imported: importedProducts.length,
      skipped: products.length - importedProducts.length
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkImportProducts
};
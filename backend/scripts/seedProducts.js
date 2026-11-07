
require('dotenv').config();

const mongoose = require('mongoose');
const Product = require('../models/Product');
const motoGTProducts = require('../data/motoGTProducts');

const seedProducts = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing from backend/.env');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Successfully!');

    const existingProducts = await Product.find(
      {},
      { name: 1, brand: 1 }
    );

    const existingKeys = new Set(
      existingProducts.map(
        (product) =>
          `${product.name.trim().toLowerCase()}|${product.brand.trim().toLowerCase()}`
      )
    );

    const newProducts = motoGTProducts.filter((product) => {
      const key =
        `${product.name.trim().toLowerCase()}|${product.brand.trim().toLowerCase()}`;

      return !existingKeys.has(key);
    });

    if (newProducts.length === 0) {
      console.log('All catalogue products already exist.');
      return;
    }

    const imported = await Product.insertMany(newProducts);

    console.log(`${imported.length} products imported successfully!`);
    console.log(`${motoGTProducts.length - imported.length} products skipped.`);
  } catch (error) {
    console.error('Product Import Error:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed.');
  }
};

seedProducts();

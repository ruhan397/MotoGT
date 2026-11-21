require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require('./routes/appointmentRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

const PORT = 5001;

// Import Routes
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require("./routes/userRoutes");

// Use Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes);
app.use((req, res, next) => {
  console.log("[GLOBAL CHECK]", req.method, req.originalUrl);
  next();
});
app.use('/api/appointments', appointmentRoutes);
app.use('/api/enquiries', enquiryRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('Welcome to MotoGT Backend!');
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully!');

    app.listen(PORT, () => {
      console.log(`MotoGT Backend Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB Connection Error:', error.message);
  });
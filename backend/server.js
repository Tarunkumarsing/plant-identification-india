const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Routes
app.use('/api/families', require('./routes/families'));
app.use('/api/genera', require('./routes/genera'));
app.use('/api/species', require('./routes/species'));
app.use('/api/identify', require('./routes/identify'));
app.use('/api/search', require('./routes/search'));
app.use('/api/characteristic-options', require('./routes/characteristicOptions'));
// Add this line with your other routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
// Basic route
app.get('/', (req, res) => {
  res.send('Plant Identification API is running');
});

// Define PORT
const PORT = process.env.PORT || 5001;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
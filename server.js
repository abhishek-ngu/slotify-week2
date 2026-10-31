require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const slotRoutes = require('./routes/slots');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI || MONGODB_URI.includes('<username>')) {
  console.error('❌ Please set your MONGODB_URI in the .env file');
  console.error('   Get your connection string from MongoDB Atlas: https://cloud.mongodb.com');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  });

// Routes
app.use('/slots', slotRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET    /slots       - Get all slots`);
  console.log(`   GET    /slots/:id   - Get a single slot`);
  console.log(`   POST   /slots       - Create a new slot`);
  console.log(`   PUT    /slots/:id   - Update a slot`);
  console.log(`   DELETE /slots/:id   - Delete a slot`);
  console.log(`   GET    /health      - Health check`);
});
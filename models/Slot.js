const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  date: {
    type: String,
    required: [true, 'Date is required'],
    trim: true
  },
  time: {
    type: String,
    required: [true, 'Time is required'],
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1']
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Slot', slotSchema);
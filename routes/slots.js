const express = require('express');
const router = express.Router();
const Slot = require('../models/Slot');

// GET /slots - Get all slots
router.get('/', async (req, res) => {
  try {
    const slots = await Slot.find().sort({ createdAt: -1 });
    res.json(slots);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch slots' });
  }
});

// GET /slots/:id - Get a single slot by ID
router.get('/:id', async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);
    if (!slot) {
      return res.status(404).json({ error: 'Slot not found' });
    }
    res.json(slot);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid slot ID' });
    }
    res.status(500).json({ error: 'Failed to fetch slot' });
  }
});

// POST /slots - Create a new slot
router.post('/', async (req, res) => {
  try {
    const { date, time, duration, isBooked } = req.body;

    if (!date || !time || !duration) {
      return res.status(400).json({ error: 'Date, time, and duration are required' });
    }

    const slot = await Slot.create({
      date,
      time,
      duration,
      isBooked: isBooked || false
    });

    res.status(201).json(slot);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    res.status(500).json({ error: 'Failed to create slot' });
  }
});

// PUT /slots/:id - Update a slot
router.put('/:id', async (req, res) => {
  try {
    const { date, time, duration, isBooked } = req.body;

    const slot = await Slot.findByIdAndUpdate(
      req.params.id,
      { date, time, duration, isBooked },
      { new: true, runValidators: true }
    );

    if (!slot) {
      return res.status(404).json({ error: 'Slot not found' });
    }

    res.json(slot);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid slot ID' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    res.status(500).json({ error: 'Failed to update slot' });
  }
});

// DELETE /slots/:id - Delete a slot
router.delete('/:id', async (req, res) => {
  try {
    const slot = await Slot.findByIdAndDelete(req.params.id);

    if (!slot) {
      return res.status(404).json({ error: 'Slot not found' });
    }

    res.json({ message: 'Slot deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid slot ID' });
    }
    res.status(500).json({ error: 'Failed to delete slot' });
  }
});

module.exports = router;
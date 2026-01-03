const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');

// Create a new trip
router.post('/', async (req, res) => {
  try {
    const { name, destination, startDate, endDate, budget, description } = req.body;
    const trip = new Trip({ name, destination, startDate, endDate, budget, description });
    await trip.save();
    res.status(201).json({ message: 'Trip created successfully', trip });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create trip', details: err.message });
  }
});

// (Optional) Get all trips
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find();
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

module.exports = router;

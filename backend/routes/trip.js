
import express from 'express';
import multer from 'multer';
import Trip from '../models/Trip.js';
import protect from '../middleware/authmiddleware.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Create a new trip
router.post('/', protect, upload.array('images', 10), async (req, res) => {
  try {
    const { name, destination, startDate, endDate, budget, description, status, stops, travelers } = req.body;
    const images = req.files ? req.files.map(file => file.path) : [];
    
    const trip = new Trip({ 
      userId: req.user.id,
      name, 
      destination, 
      startDate, 
      endDate, 
      budget: Number(budget), 
      description,
      images,
      status: status || 'planning',
      stops: stops || 1,
      travelers: travelers || 1
    });
    await trip.save();
    res.status(201).json({ message: 'Trip created successfully', trip });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create trip', details: err.message });
  }
});

// Get all trips for the authenticated user with search and filter
router.get('/', protect, async (req, res) => {
  try {
    const { search, status, sortBy } = req.query;
    let query = { userId: req.user.id };
    
    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { destination: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Status filter
    if (status) {
      query.status = status;
    }
    
    let trips = Trip.find(query);
    
    // Sorting
    if (sortBy === 'date') {
      trips = trips.sort({ startDate: -1 });
    } else if (sortBy === 'name') {
      trips = trips.sort({ name: 1 });
    } else {
      trips = trips.sort({ createdAt: -1 });
    }
    
    const result = await trips;
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trips', details: err.message });
  }
});

// Get a single trip by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trip', details: err.message });
  }
});

// Update a trip
router.put('/:id', protect, upload.array('images', 10), async (req, res) => {
  try {
    const { name, destination, startDate, endDate, budget, description, status, stops, travelers } = req.body;
    const updateData = { 
      name, 
      destination, 
      startDate, 
      endDate, 
      budget: Number(budget), 
      description,
      status,
      stops,
      travelers
    };
    
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => file.path);
    }
    
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updateData,
      { new: true }
    );
    
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    
    res.json({ message: 'Trip updated successfully', trip });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update trip', details: err.message });
  }
});

// Delete a trip
router.delete('/:id', protect, async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    res.json({ message: 'Trip deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete trip', details: err.message });
  }
});

export default router;

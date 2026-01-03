
import express from 'express';
import multer from 'multer';
import Trip from '../models/Trip.js';

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
router.post('/', upload.array('images', 10), async (req, res) => {
  try {
    const { name, destination, startDate, endDate, budget, description } = req.body;
    const images = req.files ? req.files.map(file => file.path) : [];
    
    const trip = new Trip({ 
      name, 
      destination, 
      startDate, 
      endDate, 
      budget: Number(budget), 
      description,
      images 
    });
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

export default router;

import express from 'express';
import User from '../models/User.js';
import Trip from '../models/Trip.js';
import protect from '../middleware/authmiddleware.js';

const router = express.Router();

// Get user profile with their trips
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const trips = await Trip.find({ userId: req.user.id }).sort({ createdAt: -1 });

        res.json({
            user,
            trips,
            stats: {
                totalTrips: trips.length,
                upcomingTrips: trips.filter(t => t.status === 'confirmed' || t.status === 'planning').length,
                completedTrips: trips.filter(t => t.status === 'completed').length,
                draftTrips: trips.filter(t => t.status === 'draft').length
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch profile', details: err.message });
    }
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, email },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'Profile updated successfully', user });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update profile', details: err.message });
    }
});

export default router;

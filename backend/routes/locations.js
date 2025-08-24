// routes/locations.js - CLEAN VERSION
const express = require('express');
const router = express.Router();
const Location = require('../models/Location');

// GET - Fetch all locations for heatmap
router.get('/locations', async (req, res) => {
  console.log('GET /locations called');
  try {
    const { userId, limit = 1000 } = req.query;
    console.log('Query params:', { userId, limit });
    
    let query = {};
    if (userId && userId !== 'undefined') {
      query.userId = userId;
    }

    const locations = await Location
      .find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    console.log(`Fetched ${locations.length} locations`);
    res.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ 
      error: 'Failed to fetch locations', 
      details: error.message 
    });
  }
});

// POST - Save new location
router.post('/locations', async (req, res) => {
  console.log('POST /locations called');
  console.log('Request body:', req.body);
  
  try {
    const { coordinates, timestamp, intensity, userId } = req.body;
    
    if (!coordinates || coordinates.length !== 2) {
      return res.status(400).json({ 
        error: 'Invalid coordinates format. Expected [longitude, latitude]' 
      });
    }

    const [longitude, latitude] = coordinates;
    
    if (longitude < -180 || longitude > 180) {
      return res.status(400).json({ 
        error: 'Longitude must be between -180 and 180' 
      });
    }
    
    if (latitude < -90 || latitude > 90) {
      return res.status(400).json({ 
        error: 'Latitude must be between -90 and 90' 
      });
    }
    
    const newLocation = new Location({
      userId: userId || 'anonymous',
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      intensity: intensity || 0.5,
      timestamp: timestamp || new Date()
    });

    const savedLocation = await newLocation.save();
    console.log('✅ Location saved successfully:', savedLocation._id);
    res.status(201).json(savedLocation);
  } catch (error) {
    console.error('❌ Error saving location:', error);
    res.status(500).json({ 
      error: 'Failed to save location', 
      details: error.message 
    });
  }
});

// GET - Get location statistics
router.get('/locations/stats', async (req, res) => {
  try {
    const totalCount = await Location.countDocuments();
    const uniqueUsers = await Location.distinct('userId');
    
    res.json({
      totalLocations: totalCount,
      uniqueUsers: uniqueUsers.length,
      users: uniqueUsers
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

// DELETE - Clear all locations
router.delete('/locations', async (req, res) => {
  try {
    const result = await Location.deleteMany({});
    console.log(`Deleted ${result.deletedCount} locations`);
    res.json({ message: `Deleted ${result.deletedCount} locations` });
  } catch (error) {
    console.error('Error deleting locations:', error);
    res.status(500).json({ error: 'Failed to delete locations' });
  }
});

module.exports = router;

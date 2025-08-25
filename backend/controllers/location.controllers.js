import {Location} from "../models/location.model.js";

export const saveLocation = async (req, res) => {
  try {
    const { userId, location, intensity } = req.body;

    if (!userId || !location || !location.coordinates) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const newLocation = new Location({
      userId,
      location,
      intensity: intensity || 0.5,
    });

    await newLocation.save();
    res.status(201).json(newLocation);
  } catch (error) {
    console.error("Error saving location:", error);
    res.status(500).json({ message: "Failed to save location" });
  }
};

export const getLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.json({ locations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addLocation = async (req, res) => {
  try {
    const newLocation = new Location(req.body);
    await newLocation.save();
    res.json({ message: "Location added", location: newLocation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const count = await Location.countDocuments();
    const latest = await Location.findOne().sort({ timestamp: -1 });

    res.json({
      totalLocations: count,
      lastUpdated: latest ? latest.timestamp : null,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

export const clearLocations = async (req, res) => {
  try {
    await Location.deleteMany({});
    res.status(200).json({ message: "All locations cleared" });
  } catch (err) {
    res.status(500).json({ message: "Failed to clear locations", error: err.message });
  }
};
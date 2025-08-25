// models/Location.js - CORRECTED VERSION
import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      validate: {
        validator: function(coordinates) {
          return coordinates.length === 2;
        },
        message: 'Coordinates must contain exactly 2 elements: [longitude, latitude]'
      }
    }
  },
  intensity: {
    type: Number,
    default: 0.5,
    min: 0,
    max: 1
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create geospatial index for efficient queries
locationSchema.index({ location: '2dsphere' });
locationSchema.index({ userId: 1 });
locationSchema.index({ timestamp: -1 });

// IMPORTANT: Use module.exports, not mongoose.exports
export const Location = mongoose.model('Location', locationSchema);

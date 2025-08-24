## server.js of heatmap

```
// server.js - CORS FIXED VERSION (without problematic wildcard route)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const locationRoutes = require('./routes/locations');

const app = express();
const PORT = process.env.PORT || 3001;

// ENHANCED CORS configuration for POST requests
const corsOptions = {
  origin: [
    'http://localhost:3000', 
    'http://127.0.0.1:3000',
    'http://localhost:5173',  // Add this for Vite
    'http://127.0.0.1:5173'   // Add this for Vite
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  credentials: true
};

// Apply CORS
app.use(cors(corsOptions));

// Handle preflight OPTIONS requests
app.options('*', cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(${new Date().toISOString()} - ${req.method} ${req.path});
  console.log('Origin:', req.headers.origin);
  next();
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/heatmap_db';

mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('Connected to MongoDB');
  console.log('Database:', mongoose.connection.db.databaseName);
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    port: PORT
  });
});

// API Routes
app.use('/api', locationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message
  });
});

// REMOVED THE PROBLEMATIC WILDCARD ROUTE - this was causing the error

app.listen(PORT, () => {
  console.log(Server running on http://localhost:${PORT});
  console.log(Health check: http://localhost:${PORT}/health);
  console.log(API endpoints: http://localhost:${PORT}/api/locations);
  console.log(CORS enabled for: ${corsOptions.origin.join(', ')});
});

module.exports = app;
```

## .env 
```
# .env file in backend directory
MONGODB_URI=mongodb://localhost:27017/heatmap_db
PORT=3001
NODE_ENV=development
```
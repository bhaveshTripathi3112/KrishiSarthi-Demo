import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const DynamicHeatMap = () => {
  const mapRef = useRef(null);
  const markersRef = useRef([]); 
  const [map, setMap] = useState(null);
  const [locations, setLocations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [visualizationType, setVisualizationType] = useState('circles'); // New state for visualization type

  const API_BASE_URL = 'http://localhost:3001/api';

  // Initialize map
  useEffect(() => {
    if (mapRef.current && !map) {
      try {
        const leafletMap = L.map(mapRef.current).setView([29.219577, 79.513203], 13);

        // Add tile layers
        L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          { attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Earthstar Geographics' }
        ).addTo(leafletMap);

        L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
          { attribution: 'Labels © Esri' }
        ).addTo(leafletMap);

        setMap(leafletMap);
        console.log('Map initialized successfully');
      } catch (error) {
        console.error('Map initialization failed:', error);
        setError('Failed to initialize map: ' + error.message);
      }
    }
  }, [map]);

  // Get user location
  const getCurrentLocation = () => {
    setIsLoading(true);
    setError('');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = {
            lat: latitude,
            lng: longitude,
            timestamp: new Date(),
            intensity: 1.0
          };
          
          setUserLocation(newLocation);
          saveLocationToMongoDB(newLocation);
          
          if (map) {
            map.setView([latitude, longitude], 15);
          }
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your location. Please enable location services.');
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setIsLoading(false);
    }
  };

  // Save location to MongoDB
  const saveLocationToMongoDB = async (location) => {
    try {
      console.log('Saving location:', location);
      const response = await axios.post(`${API_BASE_URL}/locations`, {
        coordinates: [location.lng, location.lat],
        timestamp: location.timestamp,
        intensity: location.intensity,
        userId: 'user-' + Math.random().toString(36).substr(2, 9)
      });
      
      console.log('Location saved successfully:', response.data);
      
      setTimeout(() => {
        fetchLocationsFromMongoDB();
        fetchStats();
      }, 500);
    } catch (error) {
      console.error('Error saving location:', error);
      setError('Failed to save location to database: ' + error.message);
    }
  };

  // Fetch all locations from MongoDB
  const fetchLocationsFromMongoDB = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/locations`);
      
      if (!response.data || response.data.length === 0) {
        console.log('No locations found in database');
        setLocations([]);
        setIsLoading(false);
        return;
      }

      const locationData = [];
      
      response.data.forEach((item, index) => {
        try {
          if (!item.location || !item.location.coordinates || !Array.isArray(item.location.coordinates)) {
            return;
          }
          
          const coordinates = item.location.coordinates;
          if (coordinates.length !== 2) return;
          
          const longitude = coordinates[0];
          const latitude = coordinates[1];
          const intensity = item.intensity || 0.5;
          
          if (typeof longitude !== 'number' || typeof latitude !== 'number' || 
              longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
            return;
          }
          
          locationData.push([latitude, longitude, intensity]);
          
        } catch (error) {
          console.error(`Error processing item ${index}:`, error);
        }
      });
      
      console.log('Final processed location data:', locationData);
      setLocations(locationData);
      updateMapWithVisualizations(locationData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setError('Failed to fetch locations from database: ' + error.message);
      setIsLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/locations/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // **NEW: Update map with different visualization types**
  const updateMapWithVisualizations = (locationData) => {
    console.log('🗺️ Updating map with visualization type:', visualizationType);
    
    if (!map) {
      console.error('Map not initialized');
      return;
    }

    // Clear existing markers
    if (markersRef.current && markersRef.current.length > 0) {
      markersRef.current.forEach(marker => map.removeLayer(marker));
      markersRef.current = [];
    }

    // Validate location data
    const validLocations = locationData.filter(([lat, lng, intensity]) => {
      return typeof lat === 'number' && typeof lng === 'number' && 
             lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
    });

    console.log(`Adding ${validLocations.length} markers`);

    validLocations.forEach(([lat, lng, intensity], index) => {
      let marker;

      switch (visualizationType) {
        case 'circles':
          // Red circles with size based on intensity
          const radius = 500 + (intensity * 70); 
          marker = L.circle([lat, lng], {
            color: '#ff0000',
            fillColor: '#ff4444',
            fillOpacity: 0.6,
            radius: radius,
            weight: 2
          }).addTo(map);
          break;

        case 'pulsing':
          // Pulsing red circles
          marker = L.circle([lat, lng], {
            color: '#ff0000',
            fillColor: '#ff0000',
            fillOpacity: 0.4,
            radius: 500 + (intensity * 50),
            weight: 3,
            className: 'pulsing-marker'
          }).addTo(map);
          break;

        default:
          // Default red circles
          marker = L.circle([lat, lng], {
            color: '#ff0000',
            fillColor: '#ff4444',
            fillOpacity: 0.5,
            radius: 40
          }).addTo(map);
      }

      // Add popup with location info
      if (marker) {
        marker.bindPopup(`
          <div style="font-family: Arial, sans-serif;">
            <strong>📍 Location ${index + 1}</strong><br>
            <strong>Coordinates:</strong><br>
            Lat: ${lat.toFixed(6)}<br>
            Lng: ${lng.toFixed(6)}<br>
            <strong>Intensity:</strong> ${(intensity * 100).toFixed(0)}%
          </div>
        `);
        markersRef.current.push(marker);
      }
    });

    console.log(`✅ Added ${markersRef.current.length} markers to map`);
  };

  // Add sample data
  const addSampleData = () => {
    const sampleLocations = [
      [29.199347, 79.452951, 0.3], 
      [29.231779, 79.424369, 0.8], 
      [29.231791, 79.494560, 0.6],  
      [29.223569, 79.498136, 0.9], 
      [29.229577, 79.533203, 0.4]
    ];
    
    setLocations(sampleLocations);
    updateMapWithVisualizations(sampleLocations);
  };

  // Clear all locations
  const clearAllLocations = async () => {
    if (window.confirm('Are you sure you want to clear all locations?')) {
      try {
        await axios.delete(`${API_BASE_URL}/locations`);
        setLocations([]);
        if (markersRef.current && markersRef.current.length > 0) {
          markersRef.current.forEach(marker => map.removeLayer(marker));
          markersRef.current = [];
        }
        fetchStats();
      } catch (error) {
        console.error('Error clearing locations:', error);
        setError('Failed to clear locations: ' + error.message);
      }
    }
  };

  // Update visualization when type changes
  useEffect(() => {
    if (locations.length > 0) {
      updateMapWithVisualizations(locations);
    }
  }, [visualizationType]);

  // Load initial data
  useEffect(() => {
    if (map) {
      fetchLocationsFromMongoDB();
      fetchStats();
    }
  }, [map]);

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      {/* CSS for animations */}
      <style>{`
        .pulsing-marker {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.6; }
          100% { transform: scale(1); opacity: 1; }
        }
        .square-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
      
      <div
        ref={mapRef}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        }}
      />
      
      {/* Control panel */}
      <div style={{
        position: 'absolute',
        top: 10,
        right: 10,
        background: 'white',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        zIndex: 1000,
        minWidth: '220px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>🗺️ Location Tracker</h3>
        
        {/* Visualization type selector */}
        <div style={{ marginBottom: '10px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#333' }}>
            Visualization Style:
          </label>
          <select 
            value={visualizationType} 
            onChange={(e) => setVisualizationType(e.target.value)}
            style={{
              width: '100%',
              padding: '6px',
              margin: '5px 0',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '12px'
            }}
          >
            <option value="circles">Red Circles</option>
            <option value="pulsing">Pulsing Circles</option>
          </select>
        </div>
        
        <button
          onClick={getCurrentLocation}
          disabled={isLoading}
          style={{
            display: 'block',
            width: '100%',
            margin: '5px 0',
            padding: '10px',
            backgroundColor: isLoading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '13px'
          }}
        >
          {isLoading ? '📍 Getting Location...' : '📍 Get My Location'}
        </button>

        <button
          onClick={fetchLocationsFromMongoDB}
          disabled={isLoading}
          style={{
            display: 'block',
            width: '100%',
            margin: '5px 0',
            padding: '10px',
            backgroundColor: isLoading ? '#ccc' : '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '13px'
          }}
        >
          🔄 Refresh Map
        </button>

        <button
          onClick={addSampleData}
          style={{
            display: 'block',
            width: '100%',
            margin: '5px 0',
            padding: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          ➕ Add Sample Data
        </button>

        <button
          onClick={clearAllLocations}
          style={{
            display: 'block',
            width: '100%',
            margin: '5px 0',
            padding: '10px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          🗑️ Clear All Data
        </button>

        {error && (
          <div style={{
            marginTop: '10px',
            padding: '8px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            ⚠️ {error}
          </div>
        )}

        {userLocation && (
          <div style={{ fontSize: '12px', marginTop: '10px', padding: '8px', backgroundColor: '#d4edda', borderRadius: '4px' }}>
            <strong>📍 Current Location:</strong><br />
            Lat: {userLocation.lat.toFixed(6)}<br />
            Lng: {userLocation.lng.toFixed(6)}
          </div>
        )}

        {stats && (
          <div style={{ fontSize: '12px', marginTop: '10px', padding: '8px', backgroundColor: '#e2e3e5', borderRadius: '4px' }}>
            <strong>📊 Statistics:</strong><br />
            Total Locations: {stats.totalLocations}<br />
            Unique Users: {stats.uniqueUsers}
          </div>
        )}

        <div style={{ fontSize: '12px', marginTop: '10px', padding: '8px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
          <strong>🎯 Active Points:</strong> {locations.length}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <DynamicHeatMap />
    </div>
  );
}

export default App;

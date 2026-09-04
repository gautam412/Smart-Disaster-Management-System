const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded images

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Store submitted incidents
let incidents = [];

// Store latest sensor data
let sensorData = {
  moisture: 0,
  rain: 'None',
  waterLevel: 'Empty',
  temperature: 0,
  humidity: 0,
  earthquake: false,
  earthquakeIntensity: 0, // New for earthquakes
  landslideRisk: 'Low', // New for landslides
  wildfireRisk: 'Low', // New for wildfires
  cycloneWindSpeed: 0, // New for cyclones
  activeDisaster: 'none', // New for active disaster scenario
  timestamp: null
};

// Endpoint for Arduino to POST sensor data
app.post('/api/sensors', (req, res) => {
  try {
    const data = req.body;
    sensorData = {
      ...data,
      timestamp: new Date().toISOString()
    };
    console.log('Received sensor data:', sensorData);
    res.status(200).json({ message: 'Data received successfully' });
  } catch (error) {
    console.error('Error receiving data:', error);
    res.status(500).json({ error: 'Failed to process data' });
  }
});

// Endpoint for website to GET sensor data
app.get('/api/sensors', (req, res) => {
  res.json(sensorData);
});

// Endpoint to POST incident reports
app.post('/api/incidents', upload.single('image'), (req, res) => {
  try {
    const { name, location, disasterType, description } = req.body;
    const image = req.file ? req.file.filename : null;
    const incident = {
      id: Date.now(),
      name,
      location,
      disasterType,
      description,
      image,
      timestamp: new Date().toISOString()
    };
    incidents.push(incident);
    console.log('Incident submitted:', incident);
    res.status(200).json({ message: 'Incident report submitted successfully' });
  } catch (error) {
    console.error('Error submitting incident:', error);
    res.status(500).json({ error: 'Failed to submit incident' });
  }
});

// Endpoint to GET all incidents
app.get('/api/incidents', (req, res) => {
  res.json(incidents);
});

// Serve static files (HTML, CSS, JS)
app.use(express.static('.'));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

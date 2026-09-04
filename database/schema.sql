-- SQLite schema for Smart Disaster Management System

-- Table for admin users
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,  -- Store hashed passwords
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table for sensor data
CREATE TABLE IF NOT EXISTS sensors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    moisture REAL,
    rain TEXT,
    waterLevel TEXT,
    temperature REAL,
    humidity REAL,
    earthquake BOOLEAN,
    earthquakeIntensity REAL,
    landslideRisk TEXT,
    wildfireRisk TEXT,
    cycloneWindSpeed REAL,
    activeDisaster TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table for incident reports
CREATE TABLE IF NOT EXISTS incidents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    disasterType TEXT NOT NULL,
    description TEXT,
    image TEXT,  -- filename of uploaded image
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table for alerts
CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alert_text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table for disaster statistics
CREATE TABLE IF NOT EXISTS disaster_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    floods INTEGER DEFAULT 0,
    landslides INTEGER DEFAULT 0,
    cloudbursts INTEGER DEFAULT 0,
    earthquakes INTEGER DEFAULT 0,
    wildfires INTEGER DEFAULT 0,
    cyclones INTEGER DEFAULT 0,
    people_affected INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table for active disaster scenario
CREATE TABLE IF NOT EXISTS active_disaster (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    disaster_type TEXT NOT NULL,  -- e.g., 'flood', 'landslide', etc.
    set_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table for government helplines
CREATE TABLE IF NOT EXISTS helplines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    number TEXT NOT NULL,
    category TEXT  -- e.g., 'NDMA', 'Fire', etc.
);

-- Table for institutions (schools, polytechnics)
CREATE TABLE IF NOT EXISTS institutions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,  -- 'School' or 'Polytechnic'
    district TEXT NOT NULL,
    latitude REAL,
    longitude REAL
);

-- Table for photo gallery metadata
CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    description TEXT,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sensors_timestamp ON sensors (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_incidents_timestamp ON incidents (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_disaster_stats_updated_at ON disaster_stats (updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_active_disaster_set_at ON active_disaster (set_at DESC);
CREATE INDEX IF NOT EXISTS idx_institutions_district ON institutions (district);
CREATE INDEX IF NOT EXISTS idx_gallery_uploaded_at ON gallery (uploaded_at DESC);

-- Insert default helplines
INSERT OR IGNORE INTO helplines (name, number, category) VALUES
('NDMA', '011-26701700', 'Central'),
('Uttarakhand SDMA', '0135-2710334', 'State'),
('State Control Room', '1070', 'State'),
('Fire Services', '101', 'Emergency'),
('Police', '100', 'Emergency'),
('NDRF Helpline', '+91-9711077372', 'Rescue');

-- Insert default disaster stats (initial values)
INSERT OR IGNORE INTO disaster_stats (floods, landslides, cloudbursts, earthquakes, wildfires, cyclones, people_affected) VALUES
(45, 28, 12, 5, 8, 3, 2500);

-- Insert default active disaster (none)
INSERT OR IGNORE INTO active_disaster (disaster_type) VALUES ('none');

-- Insert sample institutions (from script.js data)
INSERT OR IGNORE INTO institutions (name, type, district, latitude, longitude) VALUES
('Government Inter College Uttarkashi', 'School', 'Uttarkashi', 30.73, 78.44),
('Government Polytechnic Uttarkashi', 'Polytechnic', 'Uttarkashi', 30.72, 78.45),
('Kendriya Vidyalaya Uttarkashi', 'School', 'Uttarkashi', 30.74, 78.43),
('Doom''s Day School Dehradun', 'School', 'Dehradun', 30.31, 78.03),
('Government Polytechnic Dehradun', 'Polytechnic', 'Dehradun', 30.32, 78.04),
('Kendriya Vidyalaya Dehradun', 'School', 'Dehradun', 30.30, 78.02),
('Government Inter College Chamoli', 'School', 'Chamoli', 30.41, 78.03),
('Government Polytechnic Chamoli', 'Polytechnic', 'Chamoli', 30.42, 78.04),
('Kendriya Vidyalaya Chamoli', 'School', 'Chamoli', 30.40, 78.02),
('Government Inter College Rudraprayag', 'School', 'Rudraprayag', 30.28, 78.98),
('Government Polytechnic Rudraprayag', 'Polytechnic', 'Rudraprayag', 30.29, 78.99),
('Kendriya Vidyalaya Rudraprayag', 'School', 'Rudraprayag', 30.27, 78.97),
('Government Inter College Tehri', 'School', 'Tehri Garhwal', 30.39, 78.48),
('Government Polytechnic Tehri', 'Polytechnic', 'Tehri Garhwal', 30.40, 78.49),
('Kendriya Vidyalaya Tehri', 'School', 'Tehri Garhwal', 30.38, 78.47),
('Government Inter College Pithoragarh', 'School', 'Pithoragarh', 29.58, 78.78),
('Government Polytechnic Pithoragarh', 'Polytechnic', 'Pithoragarh', 29.59, 78.79),
('Kendriya Vidyalaya Pithoragarh', 'School', 'Pithoragarh', 29.57, 78.77),
('Government Inter College Pauri', 'School', 'Pauri Garhwal', 30.15, 80.22),
('Government Polytechnic Pauri', 'Polytechnic', 'Pauri Garhwal', 30.16, 80.23),
('Kendriya Vidyalaya Pauri', 'School', 'Pauri Garhwal', 30.14, 80.21),
('Government Inter College Almora', 'School', 'Almora', 29.38, 79.45),
('Government Polytechnic Almora', 'Polytechnic', 'Almora', 29.39, 79.46),
('Kendriya Vidyalaya Almora', 'School', 'Almora', 29.37, 79.44),
('Government Inter College Bageshwar', 'School', 'Bageshwar', 29.83, 79.78),
('Government Polytechnic Bageshwar', 'Polytechnic', 'Bageshwar', 29.84, 79.79),
('Kendriya Vidyalaya Bageshwar', 'School', 'Bageshwar', 29.82, 79.77),
('Government Inter College Champawat', 'School', 'Champawat', 29.33, 79.65),
('Government Polytechnic Champawat', 'Polytechnic', 'Champawat', 29.34, 79.66),
('Kendriya Vidyalaya Champawat', 'School', 'Champawat', 29.32, 79.64),
('Government Inter College Haridwar', 'School', 'Haridwar', 29.92, 78.07),
('Government Polytechnic Haridwar', 'Polytechnic', 'Haridwar', 29.93, 78.08),
('Kendriya Vidyalaya Haridwar', 'School', 'Haridwar', 29.91, 78.06),
('Government Inter College Nainital', 'School', 'Nainital', 29.38, 79.45),
('Government Polytechnic Nainital', 'Polytechnic', 'Nainital', 29.39, 79.46),
('Kendriya Vidyalaya Nainital', 'School', 'Nainital', 29.37, 79.44),
('Government Inter College Udham Singh Nagar', 'School', 'Udham Singh Nagar', 29.02, 79.48),
('Government Polytechnic Udham Singh Nagar', 'Polytechnic', 'Udham Singh Nagar', 29.03, 79.49),
('Kendriya Vidyalaya Udham Singh Nagar', 'School', 'Udham Singh Nagar', 29.01, 79.47);

-- Insert sample alerts
INSERT OR IGNORE INTO alerts (alert_text) VALUES
('⚠️ Flash Flood Warning - Uttarkashi (Sep 2025)'),
('⚠️ Landslide Risk - Gangotri Highway');

-- Insert sample incidents
INSERT OR IGNORE INTO incidents (name, location, disasterType, description) VALUES
('Cloudburst in Barkot', 'Barkot', 'Cloudburst', 'Heavy rainfall caused flooding, 3 rescued'),
('Landslide blocked Gangotri road', 'Gangotri Highway', 'Landslide', 'Road blocked due to landslide');

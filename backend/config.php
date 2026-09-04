<?php
// Database configuration for SQLite
$db_file = __DIR__ . '/disaster_management.db';

// Create database connection
try {
    $pdo = new PDO("sqlite:$db_file");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Function to get latest sensor data
function getLatestSensorData() {
    global $pdo;
    $stmt = $pdo->query("SELECT * FROM sensors ORDER BY timestamp DESC LIMIT 1");
    return $stmt->fetch();
}

// Function to get all alerts
function getAlerts() {
    global $pdo;
    $stmt = $pdo->query("SELECT alert_text FROM alerts ORDER BY created_at DESC");
    return $stmt->fetchAll(PDO::FETCH_COLUMN);
}

// Function to get recent incidents
function getRecentIncidents() {
    global $pdo;
    $stmt = $pdo->query("SELECT name, location, disasterType, description FROM incidents ORDER BY timestamp DESC LIMIT 5");
    return $stmt->fetchAll();
}

// Function to get disaster statistics
function getDisasterStats() {
    global $pdo;
    $stmt = $pdo->query("SELECT * FROM disaster_stats ORDER BY updated_at DESC LIMIT 1");
    return $stmt->fetch();
}

// Function to get active disaster
function getActiveDisaster() {
    global $pdo;
    $stmt = $pdo->query("SELECT disaster_type FROM active_disaster ORDER BY set_at DESC LIMIT 1");
    $result = $stmt->fetch();
    return $result ? $result['disaster_type'] : 'none';
}

// Function to get helplines
function getHelplines() {
    global $pdo;
    $stmt = $pdo->query("SELECT name, number FROM helplines ORDER BY name");
    return $stmt->fetchAll();
}
?>

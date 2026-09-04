<?php
require_once 'config.php';

// Get data for the dashboard
$sensorData = getLatestSensorData();
$alerts = getAlerts();
$incidents = getRecentIncidents();
$stats = getDisasterStats();
$activeDisaster = getActiveDisaster();
$helplines = getHelplines();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smart Disaster Management System - Uttarakhand</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
</head>
<body>

<section id="home" class="container">

    <!-- Hero Section -->
    <div class="hero">
      <div class="hero-content">
        <h1>Smart Disaster Management System (Uttarakhand)</h1>
        <p>Stay Informed, Stay Safe. Your gateway to real-time disaster alerts and resources.</p>
        <button class="hero-btn" onclick="scrollToDashboard()">Get Started</button>
      </div>
    </div>

    <marquee scrollamount="4" id="topMarquee" onmouseover="this.setAttribute('scrollamount', 0, 0); document.getElementById('topMarquee').stop();" onmouseout="this.setAttribute('scrollamount', 4, 0); document.getElementById('topMarquee').start();" style="border: 2px solid #444; border-radius: 5px; padding: 5px;">
        <div class="region region-highlights">
            <div class="block block-block first last odd">
                <p>Saving Lives &amp; Beyond "आपदा सेवा सदैव सर्वत्र" NDRF Helpline Number : +91-9711077372 Saving Lives &amp; Beyond "आपदा सेवा सदैव सर्वत्र" NDRF Helpline Number : +91-9711077372</p>
            </div>
        </div>
    </marquee>

    <!-- Navbar -->
    <nav>
        <a href="#home">🏠</a>
        <a href="map.html">Map</a>
        <a href="alerts.html" class="active">Alerts</a>
        <a href="report.html" class="active">🚨 Report Incident</a>
        <a href="resources.html" class="active">Resources</a>
        <a href="photo-gallery.html">📸 Photo Gallery</a>
        <a href="about.html">About</a>
        <a href="admin.html">Login</a>
        <button id="theme-toggle" class="theme-toggle-btn">🌙</button>
    </nav>

    <marquee behavior="scroll" direction="left" scrollamount="15">
        <div class="sos-buttons">
            <button class="sos" onclick="triggerSOS()">🆘 SOS</button>
            <button class="helpline" onclick="showHelplines()">☎️ Helplines</button>
            <button class="route" onclick="findSafeRoute()">🛣️ Safe Route</button>
        </div>
    </marquee>

    <!-- Quick Actions and Photo Gallery -->
    <div class="actions-gallery-container">
        <!-- Quick Actions -->
        <section class="quick-actions">
            <h2>Quick Actions</h2>
            <p>Take immediate steps to stay safe during emergencies.</p>
            <div class="action-buttons">
                <button onclick="window.location.href='shelter.html'">🏠 Find Shelter</button>
                <button onclick="showHelplines()">📞 Helplines</button>
            </div>
        </section>

        <!-- Rotating Photo Gallery -->
        <section class="photo-gallery">
            <h2>Disaster Awareness Gallery</h2>
            <div class="gallery-container">
                <img src="Disaster Awareness Gallery/d1.gif" alt="Disaster Awareness 1" class="gallery-image active">
                <img src="Disaster Awareness Gallery/d2.avif" alt="Disaster Awareness 2" class="gallery-image">
                <img src="Disaster Awareness Gallery/d3.jpg" alt="Disaster Awareness 3" class="gallery-image">
                <img src="Disaster Awareness Gallery/d4.jpg" alt="Disaster Awareness 4" class="gallery-image">
                <img src="Disaster Awareness Gallery/d5.jpg" alt="Disaster Awareness 5" class="gallery-image">
                <img src="uploads/download (2).jpg" alt="Disaster Awareness 6" class="gallery-image">
            </div>
        </section>
    </div>

    <!-- Home/Dashboard -->
    <div class="dashboard">
        <div class="card">
            <h2>Active Alerts</h2>
            <ul id="alerts-list">
                <?php foreach ($alerts as $alert): ?>
                    <li><?php echo htmlspecialchars($alert); ?></li>
                <?php endforeach; ?>
            </ul>
        </div>

        <div class="card">
            <h2>Recent Incidents</h2>
            <ul>
                <?php foreach ($incidents as $incident): ?>
                    <li><?php echo htmlspecialchars($incident['name'] . ' - ' . $incident['location']); ?></li>
                <?php endforeach; ?>
            </ul>
        </div>

        <div class="card">
            <h2>Disaster Statistics</h2>
            <ul id="disaster-stats">
                <?php if ($stats): ?>
                    <li>🌧️ Floods: <?php echo $stats['floods']; ?> incidents this year</li>
                    <li>🏔️ Landslides: <?php echo $stats['landslides']; ?> reported</li>
                    <li>☁️ Cloudbursts: <?php echo $stats['cloudbursts']; ?> events</li>
                    <li>🌋 Earthquakes: <?php echo $stats['earthquakes']; ?> events</li>
                    <li>🔥 Wildfires: <?php echo $stats['wildfires']; ?> incidents</li>
                    <li>🌪️ Cyclones: <?php echo $stats['cyclones']; ?> events</li>
                    <li>👥 People Affected: <?php echo $stats['people_affected']; ?>+</li>
                <?php endif; ?>
            </ul>
        </div>

        <div class="card">
            <h2>Government Helplines</h2>
            <ul>
                <?php foreach ($helplines as $helpline): ?>
                    <li><?php echo htmlspecialchars($helpline['name']); ?>: <?php echo htmlspecialchars($helpline['number']); ?></li>
                <?php endforeach; ?>
            </ul>
        </div>

        <div class="card">
            <h2>Live Sensor Data</h2>
            <ul>
                <li>🌱 Soil Moisture: <span id="moisture-value"><?php echo $sensorData['moisture'] ?? '--'; ?></span></li>
                <li>🌧️ Rain Status: <span id="rain-value"><?php echo $sensorData['rain'] ?? '--'; ?></span></li>
                <li>💧 Water Level: <span id="water-level-value"><?php echo $sensorData['waterLevel'] ?? '--'; ?></span></li>
                <li>🌡️ Temperature: <span id="temperature-value"><?php echo ($sensorData['temperature'] ?? '--') . '°C'; ?></span></li>
                <li>💨 Humidity: <span id="humidity-value"><?php echo ($sensorData['humidity'] ?? '--') . '%'; ?></span></li>
                <li>🏔️ Earthquake: <span id="earthquake-value"><?php echo ($sensorData['earthquake'] ?? false) ? 'DETECTED' : 'No'; ?></span></li>
                <li>🏔️ Landslide Risk: <span id="landslide-value"><?php echo $sensorData['landslideRisk'] ?? '--'; ?></span></li>
                <li>🔥 Wildfire Risk: <span id="wildfire-value"><?php echo $sensorData['wildfireRisk'] ?? '--'; ?></span></li>
                <li>🌪️ Cyclone Wind Speed: <span id="cyclone-value"><?php echo ($sensorData['cycloneWindSpeed'] ?? '--') . ' km/h'; ?></span></li>
            </ul>
            <p id="sensor-timestamp" style="font-size: 12px; color: #666; margin-top: 10px;">
                Last updated: <?php echo $sensorData ? date('M j, Y g:i A', strtotime($sensorData['timestamp'])) : 'Loading...'; ?>
            </p>
        </div>
    </div>

</section>

<!-- Official Government Websites -->
<section id="government-links" class="container">
    <h2>Official Government Websites</h2>
    <div class="gov-links-grid">
        <div class="gov-link-card">
            <h3>🇮🇳 National Disaster Management Authority (NDMA)</h3>
            <p>Central authority for disaster management in India.</p>
            <a href="https://ndma.gov.in/" target="_blank">Visit Website</a>
        </div>
        <div class="gov-link-card">
            <h3>🌤️ Indian Meteorological Department (IMD)</h3>
            <p>Weather forecasts and meteorological services.</p>
            <a href="https://mausam.imd.gov.in/" target="_blank">Visit Website</a>
        </div>
        <div class="gov-link-card">
            <h3>🏛️ Uttarakhand Government</h3>
            <p>Official website of the Uttarakhand Government.</p>
            <a href="https://uk.gov.in/" target="_blank">Visit Website</a>
        </div>
    </div>
</section>

<!-- Footer -->
<footer>
    <div class="footer-content">
        <div class="footer-section">
            <h3>Contact Us</h3>
            <p><a href="mailto:info@uttarakhanddisaster.gov.in">📧 info@uttarakhanddisaster.gov.in</a></p>
            <p><a href="tel:+91-135-2710334">📞 +91-135-2710334</a></p>
        </div>
        <div class="footer-section">
            <h3>Follow Us</h3>
            <p>🔗 <a href="https://www.facebook.com/UttarakhandGov" target="_blank">Facebook</a> | <a href="https://twitter.com/uttarakhandgov" target="_blank">Twitter</a> | <a href="https://www.instagram.com/uttarakhandgov/" target="_blank">Instagram</a></p>
        </div>
        <div class="footer-section">
            <h3>Quick Links</h3>
            <p><a href="map.html">Map</a> | <a href="alerts.html">Alerts</a> | <a href="report.html">Report</a></p>
        </div>
    </div>
    <div class="creators" style="text-align: center;">
        <p>Website Created by: Gautam Bijalwan, Prashant Ramola, Gauri Semwal</p>
        <p>Roles by: Shivom Rana & Hemant</p>
        <p>Mentor: shivom bhatt</p>
    </div>
    <div class="footer-bottom">
        <p>&copy; 2025 Smart Disaster Management System - Uttarakhand. All rights reserved.</p>
    </div>
</footer>

<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
<script src="script.js"></script>
</body>
</html>

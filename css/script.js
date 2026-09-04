// Global map variable
let map;

// Function to initialize the map
function initializeMap() {
    // Initialize the map
    map = L.map('mapid').setView([30.3165, 78.0322], 8); // Centered on Uttarakhand

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add markers for districts with hazard data
    var districts = {
        "Uttarkashi": { coords: [30.73, 78.44], hazard: "High", type: "Landslides, Earthquakes" },
        "Dehradun": { coords: [30.31, 78.03], hazard: "Medium", type: "Floods, Landslides" },
        "Chamoli": { coords: [30.41, 78.03], hazard: "High", type: "Landslides, Glacial Lake Outburst" },
        "Rudraprayag": { coords: [30.28, 78.98], hazard: "High", type: "Landslides, Floods" },
        "Tehri Garhwal": { coords: [30.39, 78.48], hazard: "High", type: "Landslides, Earthquakes" },
        "Pithoragarh": { coords: [29.58, 78.78], hazard: "Medium", type: "Landslides, Earthquakes" },
        "Pauri Garhwal": { coords: [30.15, 80.22], hazard: "High", type: "Landslides, Floods" },
        "Almora": { coords: [29.38, 79.45], hazard: "Medium", type: "Landslides, Earthquakes" },
        "Bageshwar": { coords: [29.83, 79.78], hazard: "Medium", type: "Landslides, Floods" },
        "Champawat": { coords: [29.33, 79.65], hazard: "Medium", type: "Landslides, Floods" },
        "Haridwar": { coords: [29.92, 78.07], hazard: "Low", type: "Floods" },
        "Nainital": { coords: [29.38, 79.45], hazard: "Medium", type: "Landslides, Floods" },
        "Udham Singh Nagar": { coords: [29.02, 79.48], hazard: "Low", type: "Floods" }
    };

    // Function to get marker icon based on hazard level
    function getHazardIcon(hazard) {
        var color;
        if (hazard === "High") color = "red";
        else if (hazard === "Medium") color = "orange";
        else color = "green";

        return L.divIcon({
            className: 'hazard-marker',
            html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
    }

    for (var district in districts) {
        var data = districts[district];
        L.marker(data.coords, { icon: getHazardIcon(data.hazard) }).addTo(map)
            .bindPopup(`<b>${district}</b><br>Hazard Risk: ${data.hazard}<br>Type: ${data.type}`);
    }

    // Add legend
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = '<h4>Hazard Risk Legend</h4>' +
            '<i style="background: red"></i> High Risk<br>' +
            '<i style="background: orange"></i> Medium Risk<br>' +
            '<i style="background: green"></i> Low Risk<br>';
        return div;
    };
    legend.addTo(map);
}

// Sample data for government schools and polytechnics by district
const institutionsData = {
    "Uttarkashi": [
        { name: "Government Inter College Uttarkashi", type: "School", lat: 30.73, lng: 78.44 },
        { name: "Government Polytechnic Uttarkashi", type: "Polytechnic", lat: 30.72, lng: 78.45 },
        { name: "Kendriya Vidyalaya Uttarkashi", type: "School", lat: 30.74, lng: 78.43 }
    ],
    "Dehradun": [
        { name: "Doom's Day School Dehradun", type: "School", lat: 30.31, lng: 78.03 },
        { name: "Government Polytechnic Dehradun", type: "Polytechnic", lat: 30.32, lng: 78.04 },
        { name: "Kendriya Vidyalaya Dehradun", type: "School", lat: 30.30, lng: 78.02 }
    ],
    "Chamoli": [
        { name: "Government Inter College Chamoli", type: "School", lat: 30.41, lng: 78.03 },
        { name: "Government Polytechnic Chamoli", type: "Polytechnic", lat: 30.42, lng: 78.04 },
        { name: "Kendriya Vidyalaya Chamoli", type: "School", lat: 30.40, lng: 78.02 }
    ],
    "Rudraprayag": [
        { name: "Government Inter College Rudraprayag", type: "School", lat: 30.28, lng: 78.98 },
        { name: "Government Polytechnic Rudraprayag", type: "Polytechnic", lat: 30.29, lng: 78.99 },
        { name: "Kendriya Vidyalaya Rudraprayag", type: "School", lat: 30.27, lng: 78.97 }
    ],
    "Tehri Garhwal": [
        { name: "Government Inter College Tehri", type: "School", lat: 30.39, lng: 78.48 },
        { name: "Government Polytechnic Tehri", type: "Polytechnic", lat: 30.40, lng: 78.49 },
        { name: "Kendriya Vidyalaya Tehri", type: "School", lat: 30.38, lng: 78.47 }
    ],
    "Pithoragarh": [
        { name: "Government Inter College Pithoragarh", type: "School", lat: 29.58, lng: 78.78 },
        { name: "Government Polytechnic Pithoragarh", type: "Polytechnic", lat: 29.59, lng: 78.79 },
        { name: "Kendriya Vidyalaya Pithoragarh", type: "School", lat: 29.57, lng: 78.77 }
    ],
    "Pauri Garhwal": [
        { name: "Government Inter College Pauri", type: "School", lat: 30.15, lng: 80.22 },
        { name: "Government Polytechnic Pauri", type: "Polytechnic", lat: 30.16, lng: 80.23 },
        { name: "Kendriya Vidyalaya Pauri", type: "School", lat: 30.14, lng: 80.21 }
    ],
    "Almora": [
        { name: "Government Inter College Almora", type: "School", lat: 29.38, lng: 79.45 },
        { name: "Government Polytechnic Almora", type: "Polytechnic", lat: 29.39, lng: 79.46 },
        { name: "Kendriya Vidyalaya Almora", type: "School", lat: 29.37, lng: 79.44 }
    ],
    "Bageshwar": [
        { name: "Government Inter College Bageshwar", type: "School", lat: 29.83, lng: 79.78 },
        { name: "Government Polytechnic Bageshwar", type: "Polytechnic", lat: 29.84, lng: 79.79 },
        { name: "Kendriya Vidyalaya Bageshwar", type: "School", lat: 29.82, lng: 79.77 }
    ],
    "Champawat": [
        { name: "Government Inter College Champawat", type: "School", lat: 29.33, lng: 79.65 },
        { name: "Government Polytechnic Champawat", type: "Polytechnic", lat: 29.34, lng: 79.66 },
        { name: "Kendriya Vidyalaya Champawat", type: "School", lat: 29.32, lng: 79.64 }
    ],
    "Haridwar": [
        { name: "Government Inter College Haridwar", type: "School", lat: 29.92, lng: 78.07 },
        { name: "Government Polytechnic Haridwar", type: "Polytechnic", lat: 29.93, lng: 78.08 },
        { name: "Kendriya Vidyalaya Haridwar", type: "School", lat: 29.91, lng: 78.06 }
    ],
    "Nainital": [
        { name: "Government Inter College Nainital", type: "School", lat: 29.38, lng: 79.45 },
        { name: "Government Polytechnic Nainital", type: "Polytechnic", lat: 29.39, lng: 79.46 },
        { name: "Kendriya Vidyalaya Nainital", type: "School", lat: 29.37, lng: 79.44 }
    ],
    "Udham Singh Nagar": [
        { name: "Government Inter College Udham Singh Nagar", type: "School", lat: 29.02, lng: 79.48 },
        { name: "Government Polytechnic Udham Singh Nagar", type: "Polytechnic", lat: 29.03, lng: 79.49 },
        { name: "Kendriya Vidyalaya Udham Singh Nagar", type: "School", lat: 29.01, lng: 79.47 }
    ]
};

// Array to hold current markers
let currentMarkers = [];

// Function to go to selected district and populate institutions
function goToDistrict() {
    var select = document.getElementById('districtSelect');
    var coords = select.value.split(',');
    var districtName = select.options[select.selectedIndex].text;

    if (coords.length === 2) {
        map.setView([parseFloat(coords[0]), parseFloat(coords[1])], 10);

        // Clear previous markers
        currentMarkers.forEach(marker => map.removeLayer(marker));
        currentMarkers = [];

        // Populate institutions list
        const schoolsList = document.getElementById('schools-list');
        schoolsList.innerHTML = '';

        if (institutionsData[districtName]) {
            institutionsData[districtName].forEach(inst => {
                // Add to list
                const li = document.createElement('li');
                li.textContent = `${inst.name} (${inst.type})`;
                li.onclick = () => {
                    map.setView([inst.lat, inst.lng], 15);
                };
                schoolsList.appendChild(li);

                // Add marker to map
                const marker = L.marker([inst.lat, inst.lng]).addTo(map)
                    .bindPopup(`${inst.name}<br>${inst.type}`);
                currentMarkers.push(marker);
            });
        }
    }
}

// Placeholder functions for buttons
function triggerSOS() {
    alert('SOS triggered!');
}

function showHelplines() {
    alert('Helplines: 108, 112');
}

function findSafeRoute() {
    alert('Finding safe route...');
}

// Function to scroll to dashboard
function scrollToDashboard() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Hide hero section after scrolling
    setTimeout(() => {
        document.querySelector('.hero').style.display = 'none';
    }, 1000);
}

// Function to download guide
function downloadGuide() {
    // Base64 encoded minimal PDF with disaster preparedness content
    const pdfBase64 = 'JVBERi0xLjQKMSAwIG9iago8PC9UeXBlIC9DYXRhbG9nCi9QYWdlcyAyIDAgUgo+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlIC9QYWdlcwovS2lkcyBbMyAwIFJdCi9Db3VudCAxCj4+CmVuZG9iagozIDAgb2JqCjw8L1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKL1Jlc291cmNlcyA8PC9Gb250IDw8L0YxIDUgMCBSPj4+PiAvUHJvY1NldCBbL1BERiAvVGV4dF0KPj4KZW5kb2JqCjQgMCBvYmoKPDwvTGVuZ3RoIDU5Pj4Kc3RyZWFtCkJUCi9GMSAxMiBUZgo3MiA3MjAgVGQoKERpc2FzdGVyIFByZXBhcmVkbmVzcyBHdWlkZSknIFRKClQKKC1JbnRyb2R1Y3Rpb246IFRoaXMgZ3VpZGUgcHJvdmlkZXMgZXNzZW50aWFsIGluZm9ybWF0aW9uIG9uIHByZXBhcmVkbmVzcyBmb3IgZGlzYXN0ZXJzIGluIFV0dGFyYWtoYW5kLiknIFRKCj4KZW5kc3RyZWFtCmVuZG9iagoxIDAgb2JqCjw8L1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhCj4+CmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTAgMDAwMDAgbiAKMDAwMDAwMDA3NCAwMDAwMCBuIAowMDAwMDAwMTM3IDAwMDAwIG4gCjAwMDAwMDAyNzkgMDAwMDAgbiAKMDAwMDAwMDM3NSAwMDAwMCBuIAowMDAwMDAwNDYxIDAwMDAwIG4gCnRyYWlsZXIKPDwvU2l6ZSA2Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo1NjUKJSVFT0YK';
    const byteCharacters = atob(pdfBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Disaster_Preparedness_Guide.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Function to download checklist
function downloadChecklist() {
    alert('Downloading Emergency Checklist...');
}

// Function to find shelter
function findShelter() {
    alert('Finding nearest shelter...');
}

// Function to download map
function downloadMap() {
    alert('Downloading District Risk Map...');
}

// Lightbox functions
function openLightbox(img) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = img.src;
    lightbox.style.display = 'flex';
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}

// Function to fetch and display sensor data
async function fetchSensorData() {
    try {
        const response = await fetch('/api/sensors');
        const data = await response.json();

        // Update sensor data card
        document.getElementById('moisture-value').textContent = data.moisture;
        document.getElementById('rain-value').textContent = data.rain;
        document.getElementById('water-level-value').textContent = data.waterLevel;
        document.getElementById('temperature-value').textContent = data.temperature + '°C';
        document.getElementById('humidity-value').textContent = data.humidity + '%';
        document.getElementById('earthquake-value').textContent = data.earthquake ? `DETECTED (${data.earthquakeIntensity})` : 'No';

        // Add new sensor displays if elements exist
        if (document.getElementById('landslide-value')) {
            document.getElementById('landslide-value').textContent = data.landslideRisk;
        }
        if (document.getElementById('wildfire-value')) {
            document.getElementById('wildfire-value').textContent = data.wildfireRisk;
        }
        if (document.getElementById('cyclone-value')) {
            document.getElementById('cyclone-value').textContent = data.cycloneWindSpeed + ' km/h';
        }

        // Update timestamp
        const timestamp = new Date(data.timestamp).toLocaleString();
        document.getElementById('sensor-timestamp').textContent = 'Last updated: ' + timestamp;

    } catch (error) {
        console.error('Error fetching sensor data:', error);
        document.getElementById('sensor-timestamp').textContent = 'Error loading data';
    }
}


setInterval(fetchSensorData, 5000);

// Initial fetch
fetchSensorData();

// Gallery rotation functionality
let currentImageIndex = 0;
const galleryImages = document.querySelectorAll('.gallery-image');

function rotateGallery() {
  // Remove active class from current image
  galleryImages[currentImageIndex].classList.remove('active');

  // Move to next image
  currentImageIndex = (currentImageIndex + 1) % galleryImages.length;

  // Add active class to new image
  galleryImages[currentImageIndex].classList.add('active');
}

function changeImage(direction) {
  // Remove active class from current image
  galleryImages[currentImageIndex].classList.remove('active');

  // Calculate new index
  currentImageIndex = (currentImageIndex + direction + galleryImages.length) % galleryImages.length;

  // Add active class to new image
  galleryImages[currentImageIndex].classList.add('active');
}

// Start gallery rotation every 3 seconds
setInterval(rotateGallery, 3000);

// Handle incident report form submission
document.addEventListener('DOMContentLoaded', () => {
  // Initialize map if the element exists
  if (document.getElementById('mapid')) {
    initializeMap();
  }

  const incidentForm = document.getElementById('incidentForm');
  if (incidentForm) {
    incidentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(incidentForm);
      try {
        const response = await fetch('/api/incidents', {
          method: 'POST',
          body: formData
        });
        const result = await response.json();
        if (response.ok) {
          alert('Incident report submitted successfully!');
          incidentForm.reset();
        } else {
          alert('Error submitting report: ' + result.error);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error submitting report.');
      }
    });
  }

  // Dark mode toggle functionality
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      themeToggle.textContent = '☀️';
    } else {
      themeToggle.textContent = '🌙';
    }

    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      themeToggle.textContent = isDark ? '☀️' : '🌙';
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  // Load and display updated disaster statistics from localStorage
  const savedStats = localStorage.getItem('disasterStats');
  if (savedStats) {
    const stats = JSON.parse(savedStats);
    updateDisasterStats(stats);
  }

  // Function to update disaster statistics on the main page
  function updateDisasterStats(stats) {
    const statsList = document.getElementById('disaster-stats');
    if (statsList) {
      statsList.innerHTML = `
        <li>🌧️ Floods: ${stats.floods} incidents this year</li>
        <li>🏔️ Landslides: ${stats.landslides} reported</li>
        <li>☁️ Cloudbursts: ${stats.cloudbursts} events</li>
        <li>🌋 Earthquakes: ${stats.earthquakes} events</li>
        <li>🔥 Wildfires: ${stats.wildfires} incidents</li>
        <li>🌪️ Cyclones: ${stats.cyclones} events</li>
        <li>👥 People Affected: ${stats.affected}+</li>
      `;
    }
  }
});

// =======================
// LIBRARIES
// =======================
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include "DHT.h"
#include <WiFiS3.h>
#include <ArduinoHttpClient.h>

// =======================
// OBJECT DEFINITIONS
// =======================
LiquidCrystal_I2C lcd(0x27, 16, 2);  // LCD I2C address
#define DHTPIN 5                     // DHT11 data pin
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// WiFi credentials (replace with your network details)
char ssid[] = "YOUR_WIFI_SSID";        // your network SSID (name)
char pass[] = "YOUR_WIFI_PASSWORD";    // your network password

WiFiClient wifi;
HttpClient client = HttpClient(wifi, "192.168.1.100", 3000);  // Replace with your computer's IP and port

// =======================
// PIN DEFINITIONS
// =======================

// --- Soil Moisture Sensor ---
#define MOISTURE_SENSOR A1
#define MOISTURE_LED 6

// --- Rain Sensor ---
#define RAIN_SENSOR A0
#define BUZZER 11
#define RED_LED 8
#define GREEN_LED 9
#define BLUE_LED 10

// --- Water Level Sensor ---
#define WATER_SENSOR_POWER 7
#define WATER_SENSOR_PIN A2
#define RED_WL_LED 2
#define YELLOW_WL_LED 3
#define GREEN_WL_LED 4

// --- ADXL335 Accelerometer ---
#define X_PIN A3
#define Y_PIN A4
#define Z_PIN A5

// =======================
// THRESHOLDS & VARIABLES
// =======================
int waterLevel = 0;
int lowerThreshold = 420;
int upperThreshold = 520;

float lastX = 0, lastY = 0, lastZ = 0;
bool earthquakeDetected = false;
const float quakeThreshold = 0.15;  // adjust sensitivity

// =======================
// SETUP
// =======================
void setup() {
  Serial.begin(9600);
  lcd.init();
  lcd.backlight();
  dht.begin();

  pinMode(MOISTURE_LED, OUTPUT);

  pinMode(RAIN_SENSOR, INPUT);
  pinMode(RED_LED, OUTPUT);
  pinMode(GREEN_LED, OUTPUT);
  pinMode(BLUE_LED, OUTPUT);
  pinMode(BUZZER, OUTPUT);

  pinMode(WATER_SENSOR_POWER, OUTPUT);
  pinMode(RED_WL_LED, OUTPUT);
  pinMode(YELLOW_WL_LED, OUTPUT);
  pinMode(GREEN_WL_LED, OUTPUT);

  // Connect to WiFi
  Serial.print("Connecting to WiFi...");
  int status = WL_IDLE_STATUS;
  while (status != WL_CONNECTED) {
    status = WiFi.begin(ssid, pass);
    delay(10000);
  }
  Serial.println("Connected to WiFi");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  lcd.setCursor(0, 0);
  lcd.print("System Initializing");
  delay(1500);
  lcd.clear();
  Serial.println("System Ready...");
}

// =======================
// LOOP
// =======================
void loop() {
  // --- 1. Soil Moisture Sensor ---
  int moistureValue = analogRead(MOISTURE_SENSOR);
  int mappedMoisture = map(moistureValue, 0, 1023, 255, 0);
  analogWrite(MOISTURE_LED, mappedMoisture);

  // --- 2. Rain Sensor ---
  int rainValue = analogRead(RAIN_SENSOR);
  String rainStatus;
  if (rainValue < 250) {
    rainStatus = "Heavy";
    digitalWrite(RED_LED, HIGH);
    digitalWrite(BUZZER, HIGH);
  } else if (rainValue >= 250 && rainValue <= 800) {
    rainStatus = "Moderate";
    digitalWrite(GREEN_LED, HIGH);
    digitalWrite(BUZZER, HIGH);
  } else {
    rainStatus = "None";
    digitalWrite(BLUE_LED, HIGH);
    digitalWrite(BUZZER, LOW);
  }

  // --- 3. Water Level Sensor ---
  waterLevel = readWaterLevel();
  String waterStatus;
  if (waterLevel == 0) {
    waterStatus = "Empty";
  } else if (waterLevel <= lowerThreshold) {
    waterStatus = "Low";
  } else if (waterLevel <= upperThreshold) {
    waterStatus = "Medium";
  } else {
    waterStatus = "High";
  }

  // --- 4. DHT11 (Temperature & Humidity) ---
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  // --- 5. ADXL335 Earthquake Detection ---
  float x = analogRead(X_PIN) * (5.0 / 1023.0);
  float y = analogRead(Y_PIN) * (5.0 / 1023.0);
  float z = analogRead(Z_PIN) * (5.0 / 1023.0);

  float diffX = abs(x - lastX);
  float diffY = abs(y - lastY);
  float diffZ = abs(z - lastZ);

  earthquakeDetected = (diffX > quakeThreshold || diffY > quakeThreshold || diffZ > quakeThreshold);

  lastX = x;
  lastY = y;
  lastZ = z;

  if (earthquakeDetected) {
    Serial.println("⚠ EARTHQUAKE DETECTED!");
    tone(BUZZER, 1000, 500);
  }

  // =======================
  // LCD DISPLAY SEQUENCE
  // =======================
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("T:");
  lcd.print((int)temperature);
  lcd.print("C H:");
  lcd.print((int)humidity);
  lcd.print("%");
  delay(1500);

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Soil:");
  lcd.print(moistureValue);
  lcd.setCursor(0, 1);
  lcd.print("Rain:");
  lcd.print(rainStatus);
  delay(1500);

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Water:");
  lcd.print(waterStatus);
  lcd.setCursor(0, 1);
  lcd.print("Level:");
  lcd.print(waterLevel);
  delay(1500);

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Earthquake:");
  if (earthquakeDetected)
    lcd.print("YES!");
  else
    lcd.print("No");
  lcd.setCursor(0, 1);
  lcd.print("X:");
  lcd.print(x, 2);
  lcd.print(" Y:");
  lcd.print(y, 2);
  delay(1500);

  // --- Serial Monitoring ---
  Serial.println("========================================");
  Serial.print("Moisture: "); Serial.println(moistureValue);
  Serial.print("Rain: "); Serial.println(rainStatus);
  Serial.print("Water Level: "); Serial.println(waterStatus);
  Serial.print("Temp: "); Serial.print(temperature); Serial.print("C  Humidity: "); Serial.print(humidity); Serial.println("%");
  Serial.print("X: "); Serial.print(x); Serial.print(" Y: "); Serial.print(y); Serial.print(" Z: "); Serial.println(z);
  Serial.print("Earthquake: "); Serial.println(earthquakeDetected ? "YES" : "No");
  Serial.println("========================================");

  // Send data to server
  sendSensorData(moistureValue, rainStatus, waterStatus, temperature, humidity, earthquakeDetected);

  // Reset rain LEDs
  digitalWrite(RED_LED, LOW);
  digitalWrite(GREEN_LED, LOW);
  digitalWrite(BLUE_LED, LOW);
  delay(500);
}

// =======================
// FUNCTION: Read Water Level
// =======================
int readWaterLevel() {
  digitalWrite(WATER_SENSOR_POWER, HIGH);
  delay(100);
  int val = analogRead(WATER_SENSOR_PIN);
  digitalWrite(WATER_SENSOR_POWER, LOW);
  return val;
}

// =======================
// FUNCTION: Send Sensor Data to Server
// =======================
void sendSensorData(int moisture, String rain, String water, float temp, float hum, bool quake) {
  // Create JSON payload
  String jsonPayload = "{";
  jsonPayload += "\"moisture\":" + String(moisture) + ",";
  jsonPayload += "\"rain\":\"" + rain + "\",";
  jsonPayload += "\"waterLevel\":\"" + water + "\",";
  jsonPayload += "\"temperature\":" + String(temp, 1) + ",";
  jsonPayload += "\"humidity\":" + String(hum, 1) + ",";
  jsonPayload += "\"earthquake\":" + String(quake ? "true" : "false");
  jsonPayload += "}";

  // Send HTTP POST request
  client.beginRequest();
  client.post("/api/sensors");
  client.sendHeader("Content-Type", "application/json");
  client.sendHeader("Content-Length", jsonPayload.length());
  client.beginBody();
  client.print(jsonPayload);
  client.endRequest();

  // Read response
  int statusCode = client.responseStatusCode();
  String response = client.responseBody();

  Serial.print("HTTP Status: ");
  Serial.println(statusCode);
  Serial.print("Response: ");
  Serial.println(response);
}

<?php
header('Content-Type: application/json');
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$endpoint = $_GET['endpoint'] ?? '';

switch ($endpoint) {
    case 'sensors':
        if ($method === 'GET') {
            $data = getLatestSensorData();
            echo json_encode($data ?: []);
        }
        break;

    case 'alerts':
        if ($method === 'GET') {
            $alerts = getAlerts();
            echo json_encode($alerts);
        }
        break;

    case 'incidents':
        if ($method === 'GET') {
            $incidents = getRecentIncidents();
            echo json_encode($incidents);
        } elseif ($method === 'POST') {
            // Handle incident submission
            $data = json_decode(file_get_contents('php://input'), true);
            if ($data) {
                $stmt = $pdo->prepare("INSERT INTO incidents (name, location, disasterType, description) VALUES (?, ?, ?, ?)");
                $stmt->execute([$data['name'], $data['location'], $data['disasterType'], $data['description']]);
                echo json_encode(['message' => 'Incident reported successfully']);
            }
        }
        break;

    case 'stats':
        if ($method === 'GET') {
            $stats = getDisasterStats();
            echo json_encode($stats ?: []);
        }
        break;

    case 'helplines':
        if ($method === 'GET') {
            $helplines = getHelplines();
            echo json_encode($helplines);
        }
        break;

    default:
        echo json_encode(['error' => 'Invalid endpoint']);
        break;
}
?>

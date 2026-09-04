<?php
require_once 'config.php';

// Read and execute the schema.sql file
$sql = file_get_contents('schema.sql');

try {
    $pdo->exec($sql);
    echo "Database initialized successfully!\n";
    echo "Tables created and sample data inserted.\n";
} catch (PDOException $e) {
    die("Error initializing database: " . $e->getMessage());
}
?>

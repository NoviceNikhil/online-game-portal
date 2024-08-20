<?php

// Database connection parameters
$dbHost = "localhost";      // Host name
$dbUsername = "root";       // MySQL username
$dbPassword = "pass123";           // MySQL password
$dbName = "epics";          // Database name

// Create a connection to the database
$conn = new mysqli($dbHost, $dbUsername, $dbPassword, $dbName);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

?>

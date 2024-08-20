<?php
require_once 'config.php';

// Assuming the form method is POST
$username = $_POST["username"];
$password = $_POST["password"];
$gender = $_POST["gender"];
$age = $_POST["age"];

// Prepare the SQL statement
$query = "INSERT INTO users (user_id, password, gender, age) VALUES (?, ?, ?, ?)";
$stmt = mysqli_prepare($conn, $query);

if ($stmt) {
    // Bind parameters
    mysqli_stmt_bind_param($stmt, "sssi", $username, $password, $gender, $age);

    // Execute the statement
    if (mysqli_stmt_execute($stmt)) {
        echo "Account created successfully!";
        // Redirect to a welcome page or any other page
        header("Location: welcome.php");
        exit();
    } else {
        echo "Error: " . mysqli_stmt_error($stmt);
    }

    // Close the statement
    mysqli_stmt_close($stmt);
} else {
    // Handle error if statement preparation fails
    echo "Error: " . mysqli_error($conn);
}

// Close the connection
mysqli_close($conn);
?>

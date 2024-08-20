<?php
require_once 'config.php';

// Assuming the form method is POST
$UserID = $_POST["username"];
$password = $_POST["password"];

// Prepare the SQL statement with a placeholder for the user ID
$query = "SELECT * FROM users WHERE user_id = ?";
$stmt = mysqli_prepare($conn, $query);

if ($stmt) {
    // Bind the user ID parameter
    mysqli_stmt_bind_param($stmt, "s", $UserID);

    // Execute the statement
    mysqli_stmt_execute($stmt);

    // Get the result
    $result = mysqli_stmt_get_result($stmt);

    // Fetch the user data
    $user = mysqli_fetch_array($result, MYSQLI_ASSOC);

    if ($user) {
        // Verify the password
        if (($password === $user["password"])) {
            echo "Welcome";
        } else {
            echo "Password does not match";
        }
    } else {
        echo "User ID does not exist";
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
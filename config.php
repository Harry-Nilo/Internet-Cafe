<?php
$conn = mysqli_connect('localhost', 'root', '', 'user_db');

// Check the connection
if (!$conn) {
    die('Connection failed: ' . mysqli_connect_error());
}
?>


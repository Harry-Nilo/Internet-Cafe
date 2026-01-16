<?php

@include 'config.php';

session_start();

if (isset($_POST['submit'])) {

   $name = mysqli_real_escape_string($conn, $_POST['name']);
   $pass = md5($_POST['password']);

   $select = "SELECT * FROM user_form WHERE name = '$name' && password = '$pass'";

   $result = mysqli_query($conn, $select);

   if (mysqli_num_rows($result) > 0) {

      $row = mysqli_fetch_array($result);

      if ($row['user_type'] == 'admin') {
         $_SESSION['admin_name'] = $row['name'];
         header('location: admin_page.php');
      } elseif ($row['user_type'] == 'user') {
         $_SESSION['user_name'] = $row['name'];
         header('Location: content.php');
         exit();  
      }

   } else {
      $error[] = 'Incorrect username or password!';
   }

}
?>

<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <meta http-equiv="X-UA-Compatible" content="IE=edge">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>login form</title>
   <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="form-container">
   <form action="" method="post">
      <h3>Welcome to EZ Internet Cafe</h3>
      <p class="member-login-text">Member Login</p>
      <?php
      if (isset($error)) {
         foreach ($error as $error) {
            echo '<span class="error-msg">' . $error . '</span>';
         }
      }
      ?>
      <input type="text" name="name" required placeholder="Username">
      <input type="password" name="password" required placeholder="Password">
      <input type="submit" name="submit" value="Login" class="form-btn">
      <p>Are you a new Member? <a href="register_form.php">Register Here</a></p>
   </form>
</div>

</body>
</html>

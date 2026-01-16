<?php
@include 'config.php';

session_start();

if (!isset($_SESSION['user_name'])) {
    header('location:login_form.php');
    exit();
}

$username = $_SESSION['user_name'];

$query = "SELECT email FROM user_form WHERE name = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $email = htmlspecialchars($row['email']); 
} else {
    $email = "Email not found"; 
}

$stmt->close();
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="content.css">
    <title>User Dashboard</title>
</head>
<body>
    <div class="container">
        <header>
            <h1>Internet Cafe Management System</h1>
            <p id="welcome-message">Welcome, <span id="username"><?php echo htmlspecialchars($username); ?></span>!</p>
            <div id="countdown-container">
                <p>Time Remaining: <span id="countdown-timer">Loading...</span></p>
                <button id="reset-timer-btn">Refresh</button>
            </div>
            <a href="login_form.php" id="logout">Log Out</a> <!-- Log Out Link -->
        </header>
        <div class="dashboard-menu">
            <h2>User Dashboard</h2>
            <div class="horizontal-menu">
                <a href="#profile" class="menu-item">Profile</a>
                <a href="#extendtime" class="menu-item">Extend Time</a>
                <a href="#purchasehistory" class="menu-item">Purchase History</a>
                <a href="#snackstore" class="menu-item">Foods & Drinks Store</a>
                <a href="#rewards" class="menu-item">Redeem Rewards</a>
                <a href="#redeemhistory" class="menu-item">Redeem History</a>
                <a href="#announcements" class="menu-item">Announcements and Events</a>
                <a href="#helpsupport" class="menu-item">Help/Support</a>
            </div>
        </div>

<!-- Content Sections -->
<div class="content-section" id="profile">
    <div class="section-header">
        <h3>Profile</h3>
        <button class="minimize-btn" onclick="toggleSection('profile')">+</button>
    </div>
    <div class="section-content" id="profile-content" style="display: none;">
        <p>View and update your profile information below:</p>
        <div class="profile-details">
            <p><strong>Username:</strong> <span id="profile-username"><?php echo htmlspecialchars($username); ?></span></p>
            <p><strong>Email:</strong> <span id="profile-email"><?php echo $email; ?></span></p>
        </div>
        <h4>Update Profile</h4>
        <form id="update-profile-form">
            <div class="input-group">
                <label for="new-email">New Email:</label>
                <input type="email" id="new-email" placeholder="Enter new email">
            </div>
            <div class="input-group">
                <label for="new-password">New Password:</label>
                <input type="password" id="new-password" placeholder="Enter new password">
            </div>         
            <button type="button" onclick="updateProfile()">Update Profile</button>
        </form>
    </div>
</div>

        <div class="content-section" id="extendtime">
            <div class="section-header">
                <h3>Extend Time</h3>
                <button class="minimize-btn" onclick="toggleSection('extendtime')">+</button>
            </div>
            <div class="section-content" id="extendtime-content" style="display: none;">
                <p>Choose a time extension option:</p>
                <ul>
                    <li>
                        <button type="button" onclick="extendTime(20)">Buy 1 Hour (20 Pesos)</button>
                    </li>
                    <li>
                        <button type="button" onclick="extendTime(60)">Buy 4 Hours (60 Pesos)</button>
                    </li>
                    <li>
                        <button type="button" onclick="extendTime(100)">Buy 8 Hours (100 Pesos)</button>
                    </li>
                </ul>
                
                <!-- Payment Options Modal -->
                <div id="payment-options" style="display: none;">
                    <h4>Payment Options</h4>
                    <p id="payment-message"></p>
                    <button onclick="payDirectly()">Pay Directly to Cashier</button>
                    <button onclick="payOnline()">Pay Online via QR Code</button>
                    <button onclick="closePaymentOptions()">Close</button>
                </div>
                
                <div id="qr-code-container" style="display:none;">
                    <h4>Scan to Pay:</h4>
                    <img src="QR CODE.jpg" alt="QR Code for Payment" />
                </div>
            </div>
        </div>

        <div class="content-section" id="purchasehistory">
            <div class="section-header">
                <h3>Purchase History</h3>
                <button class="minimize-btn" onclick="toggleSection('purchasehistory')">+</button>
            </div>
            <div class="section-content" id="purchasehistory-content" style="display: none;">
                <p>View your purchase history here.</p>
                <div id="purchase-history"></div> <!-- Container for purchase history -->
            </div>
        </div>

        <div class="content-section" id="snackstore">
            <div class="section-header">
                <h3>Foods & Drinks Store</h3>
                <button class="minimize-btn" onclick="toggleSection('snackstore')">+</button>
            </div>
            <div class="section-content" id="snackstore-content" style="display: none;">
                <p>Browse our Foods and drinks available for purchase.</p>

                <!-- Instant Noodles Section -->
                <div class="menu-section">
                    <h3>Instant Noodles</h3>
                    <ul>
                        <li><button onclick="showFlavors('pancitCanton')">Pancit Canton - 30 pesos (35 pesos with rice)</button></li>
                        <li><button onclick="showFlavors('cupNoodles')">Cup Noodles - 30 pesos</button></li>
                        <li><button onclick="showFlavors('paylessXtraBig')">Payless Xtra Big Pancit Canton - 40 pesos (45 pesos with rice)</button></li>
                    </ul>
                </div>

                <!-- Flavor options for Pancit Canton -->
                <div id="pancitCantonFlavors" class="flavor-options" style="display: none;">
                    <h4>Pancit Canton Flavors</h4>
                    <ul>
                        <li><button onclick="placeOrder('Pancit Canton - Original')">Original</button></li>
                        <li><button onclick="placeOrder('Pancit Canton - Kalamansi')">Kalamansi</button></li>
                        <li><button onclick="placeOrder('Pancit Canton - Chilimansi')">Chilimansi</button></li>
                        <li><button onclick="placeOrder('Pancit Canton - Sweet & Spicy')">Sweet & Spicy</button></li>
                        <li><button onclick="placeOrder('Pancit Canton - Extra Hot')">Extra Hot</button></li>
                    </ul>
                </div>

                <!-- Flavor options for Cup Noodles -->
                <div id="cupNoodlesFlavors" class="flavor-options" style="display: none;">
                    <h4>Cup Noodles Flavors</h4>
                    <ul>
                        <li><button onclick="placeOrder('Cup Noodles - Seafood')">Seafood</button></li>
                        <li><button onclick="placeOrder('Cup Noodles - Creamy Seafood')">Creamy Seafood</button></li>
                        <li><button onclick="placeOrder('Cup Noodles - Beef')">Beef</button></li>
                        <li><button onclick="placeOrder('Cup Noodles - Bulalo')">Bulalo</button></li>
                        <li><button onclick="placeOrder('Cup Noodles - Batchoy')">Batchoy</button></li>
                        <li><button onclick="placeOrder('Cup Noodles - Spicy Seafood')">Spicy Seafood</button></li>
                        <li><button onclick="placeOrder('Cup Noodles - Hot Creamy Seafood')">Hot Creamy Seafood</button></li>
                        <li><button onclick="placeOrder('Cup Noodles - Spicy Hot Beef')">Spicy Hot Beef</button></li>
                    </ul>
                </div>

                <!-- Flavor options for Payless Xtra Big -->
                <div id="paylessXtraBigFlavors" class="flavor-options" style="display: none;">
                    <h4>Payless Xtra Big Pancit Canton Flavors</h4>
                    <ul>
                        <li><button onclick="placeOrder('Payless Xtra Big - Original')">Original</button></li>
                        <li><button onclick="placeOrder('Payless Xtra Big - Kalamansi')">Kalamansi</button></li>
                        <li><button onclick="placeOrder('Payless Xtra Big - Chilimansi')">Chilimansi</button></li>
                        <li><button onclick="placeOrder('Payless Xtra Big - Sweet & Spicy')">Sweet & Spicy</button></li>
                        <li><button onclick="placeOrder('Payless Xtra Big - Extra Hot')">Extra Hot</button></li>
                    </ul>
                </div>

                <div class="menu-section">
                    <h4>Drinks</h4>
                    <ul>
                        <li><button onclick="placeDrinkOrder('Water')">Water - 15 Pesos</button></li>
                        <li><button onclick="placeDrinkOrder('Coke Mismo')">Coke Mismo - 20 Pesos</button></li>
                        <li><button onclick="placeDrinkOrder('Sprite Mismo')">Sprite Mismo - 20 Pesos</button></li>
                        <li><button onclick="placeDrinkOrder('Royal Mismo')">Royal Mismo - 20 Pesos</button></li>
                    </ul>
                </div>                
            </div>
        </div>

        <div class="content-section" id="rewards">
            <div class="section-header">
                <h3>Redeem Rewards</h3>
                <button class="minimize-btn" onclick="toggleSection('rewards')">+</button>
            </div>
            <div class="section-content" id="rewards-content" style="display: none;">
                <p>
                    You currently have <span id="user-points">0</span> Points 
                    <button onclick="updateUserPoints()">Update</button>
                </p>
                <p>Redeem your points for the following rewards:</p>
                <ul>
                    <li><button onclick="redeemPoints(10, '1 hour')">10 points = 1 hour</button></li>
                    <li><button onclick="redeemPoints(15, '2 hours')">15 points = 2 hours</button></li>
                    <li><button onclick="redeemPoints(30, '4 hours')">30 points = 4 hours</button></li>
                    <li><button onclick="redeemPoints(50, 'Loyal Member T-Shirt')">50 points = Loyal Member T-Shirt</button></li>
                </ul>
                <div id="redemption-message"></div>
            </div>
        </div>     
        <div class="content-section" id="redeemhistory">
            <div class="section-header">
                <h3>Redeem History</h3>
                <button class="minimize-btn" onclick="toggleSection('redeemhistory')">+</button>
            </div>
            <div class="section-content" id="redeemhistory-content" style="display: none;">
                <p>View your redeemed rewards history here.</p>
                <div id="redeem-history"></div> <!-- Container for redeem history -->
            </div>
        </div>        
        <div class="content-section" id="announcements">
            <div class="section-header">
                <h3>Announcements and Events</h3>
                <button class="minimize-btn" onclick="toggleSection('announcements')">+</button>
            </div>
            <div class="section-content" id="announcements-content" style="display: none;">
                <p>Stay updated with our latest announcements and events!</p>
                <div id="announcement-list"></div>
            </div>
        </div>

        <div class="content-section" id="helpsupport">
            <div class="section-header">
                <h3>Help/Support</h3>
                <button class="minimize-btn" onclick="toggleSection('helpsupport')">+</button>
            </div>
            <div class="section-content" id="helpsupport-content" style="display: none;">
                <p>If you need assistance, please contact our support team.</p>
                <div id="support-details"></div>
            </div>
        </div>
    </div>
<script>
const username = '<?php echo htmlspecialchars($username, ENT_QUOTES, 'UTF-8'); ?>';
if (username) {
    document.getElementById('username').textContent = username;
localStorage.setItem('username', '<?php echo htmlspecialchars($username, ENT_QUOTES, 'UTF-8'); ?>');
}
</script>

<script src="function.js"></script>
</body>
</html>
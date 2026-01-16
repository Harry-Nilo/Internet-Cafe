if (username) {
    document.getElementById('username').textContent = username;
}

let storedPoints = localStorage.getItem(`userPoints_${username}`);
let userPoints = JSON.parse(storedPoints);

if (typeof userPoints !== 'number' || isNaN(userPoints)) {
    userPoints = 0; 
}

function toggleSection(sectionId) {
    const content = document.getElementById(`${sectionId}-content`);
    const button = content.previousElementSibling.querySelector('.minimize-btn');

    if (content.style.display === "none" || content.style.display === "") {
        content.style.display = "block"; 
        button.textContent = "-"; 
    } else {
        content.style.display = "none"; 
        button.textContent = "+"; 
    }
}

function loadContent(section) {
    const dynamicContent = document.getElementById('dynamic-content');

    dynamicContent.innerHTML = '';

    switch (section) {
        case 'profile':
            const storedUsername = localStorage.getItem('username');
            const storedEmail = localStorage.getItem('email') || 'user@example.com'; 
        
            dynamicContent.innerHTML = `
                <div class="content-section" id="profile-content">
                    <h3>Profile</h3>
                    <p>View and update your profile information below:</p>
                    <div class="profile-details">
                        <p><strong>Username:</strong> <span id="profile-username">${storedUsername}</span></p>
                        <p><strong>Email:</strong> <span id="profile-email">${storedEmail}</span></p>
                        <!-- Removed Member Since line -->
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
                </div>`;
            break;        
        case 'extendtime':
            dynamicContent.innerHTML = `
                <div class="content-section" id="extendtime-content">
                    <h3>Extend Time</h3>
                    <p>Choose an option to extend your time:</p>
                    <ul>
                        <li>
                            <strong>20 Pesos</strong> = 1 Hour
                            <button onclick="extendTime(20)">Buy 1 Hour</button>
                        </li>
                        <li>
                            <strong>60 Pesos</strong> = 4 Hours (+1 Point)
                            <button onclick="extendTime(60)">Buy 4 Hours</button>
                        </li>
                        <li>
                            <strong>100 Pesos</strong> = 8 Hours (+2 Points)
                            <button onclick="extendTime(100)">Buy 8 Hours</button>
                        </li>
                    </ul>
                    <div id="payment-options" style="display:none;">
                        <h4>Payment Options</h4>
                        <p id="payment-message"></p>
                        <button onclick="payDirectly()">Pay Directly to Cashier</button>
                        <button onclick="payOnline()">Pay Online via QR Code</button>
                        <button onclick="closePaymentOptions()">Close</button>
                        <div id="qr-code-container" style="display:none;">
                            <h4>Scan to Pay:</h4>
                            <img src="QR CODE.jpg" alt="QR Code for Payment" />
                        </div>
                    </div>
                </div>`;
            break;
        case 'purchasehistory':
            dynamicContent.innerHTML = `
                <div class="content-section" id="purchasehistory-content">
                    <h3>Purchase History</h3>
                    <p>View your purchase history here.</p>
                    <div id="purchase-history"></div>
                </div>`;
            displayPurchaseHistory(); 
            break;
        case 'snackstore':
            dynamicContent.innerHTML = `
                <div class="content-section" id="snackstore-content">
                    <h3>Foods & Snacks Store</h3>
                    <p>Browse our snacks and drinks available for purchase.</p>
                </div>`;
            break;
            case 'rewards':
                userPoints = JSON.parse(localStorage.getItem(`userPoints_${username}`)) || 0;
            
                dynamicContent.innerHTML = `
                    <div class="content-section" id="rewards-content">
                        <h3>Redeem Rewards</h3>
                        <p>You currently have <span id="user-points">${userPoints}</span> points.</p>
                        <p>Redeem your points for the following rewards:</p>
                        <ul>
                            <li><button onclick="redeemPoints(10, '1 hour')">10 points = 1 hour</button></li>
                            <li><button onclick="redeemPoints(15, '2 hours')">15 points = 2 hours</button></li>
                            <li><button onclick="redeemPoints(30, '4 hours')">30 points = 4 hours</button></li>
                            <li><button onclick="redeemPoints(50, 'Loyal Member T-Shirt')">50 points = Loyal Member T-Shirt</button></li>
                        </ul>
                        <div id="redemption-message"></div>
                    </div>
                    <div class="content-section" id="redeem-history-content">
                        <h3>Redeem History</h3>
                        <p>View your redeemed rewards history here.</p>
                        <div id="redeem-history"></div>
                    </div>
                `;
                displayRedeemHistory(); 
                break;            
        case 'announcements':
            dynamicContent.innerHTML = `
                <div class="content-section" id="announcements-content">
                    <h3>Announcements & Events</h3>
                    <p>Stay updated with the latest announcements and events.</p>
                </div>`;
            break;
        case 'helpsupport':
            dynamicContent.innerHTML = `
                <div class="content-section" id="helpsupport-content">
                    <h3>Help/Support</h3>
                    <p>Find help and support options here.</p>
                </div>`;
            break;
        default:
            dynamicContent.innerHTML = '<p>Select a menu item to see content.</p>';
    }
}

function showPaymentOptions(amount) {
    const paymentMessage = document.getElementById('payment-message');
    let message;

    if (amount === 20) {
        message = "You are about to buy 1 Hour for 20 Pesos.";
    } else if (amount === 60) {
        message = "You are about to buy 4 Hours for 60 Pesos.";
    } else if (amount === 100) {
        message = "You are about to buy 8 Hours for 100 Pesos.";
    }

    paymentMessage.textContent = message; 
    document.getElementById('payment-options').style.display = 'block'; 
}

function payOnline() {
    const pendingPurchase = JSON.parse(localStorage.getItem('pendingPurchase'));
    if (pendingPurchase) {
        const hours = pendingPurchase.hours;
        
        const paymentContainer = document.getElementById('payment-options');
        
        let existingQRCode = document.getElementById('qr-code-img');
        if (existingQRCode) {
            existingQRCode.remove();
        }

        const qrCodeImage = document.createElement('img');
        qrCodeImage.src = 'QR CODE.jpg'; 
        qrCodeImage.id = 'qr-code-img'; 
        qrCodeImage.alt = 'QR Code for Online Payment';
        qrCodeImage.style.width = '300px'; 
        qrCodeImage.style.display = 'block';
        qrCodeImage.style.margin = '10px 0'; 

        paymentContainer.appendChild(qrCodeImage);

        alert("Please scan the QR code. Once the online payment goes through, your time will be extended!");

        const currentExpirationTime = localStorage.getItem(`expirationTime_${pendingPurchase.username}`);
        let newExpirationTime;

        if (currentExpirationTime) {
            newExpirationTime = parseInt(currentExpirationTime) + (hours * 60 * 60 * 1000);
        } else {
            newExpirationTime = new Date().getTime() + (hours * 60 * 60 * 1000);
        }

        localStorage.setItem(`expirationTime_${pendingPurchase.username}`, newExpirationTime);

        const purchaseHistory = JSON.parse(localStorage.getItem(`purchaseHistory_${pendingPurchase.username}`)) || [];
        purchaseHistory.push({
            username: pendingPurchase.username,
            hours: pendingPurchase.hours,
            date: new Date().toLocaleString() 
        });
        localStorage.setItem(`purchaseHistory_${pendingPurchase.username}`, JSON.stringify(purchaseHistory));

        localStorage.removeItem('pendingPurchase');

        updateCountdown();
    }
}

function payDirectly() {
    const pendingPurchase = JSON.parse(localStorage.getItem('pendingPurchase'));
    if (pendingPurchase) {
        const hours = pendingPurchase.hours;
        
        const currentExpirationTime = localStorage.getItem(`expirationTime_${username}`);
        let newExpirationTime;

        if (currentExpirationTime) {
            newExpirationTime = parseInt(currentExpirationTime) + (hours * 60 * 60 * 1000); 
        } else {
            newExpirationTime = new Date().getTime() + (hours * 60 * 60 * 1000); 
        }

        localStorage.setItem(`expirationTime_${username}`, newExpirationTime);

        const purchaseHistory = JSON.parse(localStorage.getItem(`purchaseHistory_${username}`)) || [];
        purchaseHistory.push({
            username: pendingPurchase.username,
            hours: pendingPurchase.hours,
            date: new Date().toLocaleString() 
        });
        localStorage.setItem(`purchaseHistory_${username}`, JSON.stringify(purchaseHistory)); 

        localStorage.removeItem('pendingPurchase');

        updateCountdown();
    }

    closePaymentOptions(); 

    alert("Please proceed to the cashier to complete your payment.");
}

function closePaymentOptions() {
    document.getElementById('payment-options').style.display = 'none'; 
    document.getElementById('qr-code-container').style.display = 'none'; 
}

function extendTime(amount) {
    let hours = 0;
    let points = 0;

    if (amount === 20) {
        hours = 1;
        points = 0; 
    } else if (amount === 60) {
        hours = 4;
        points = 1; 
    } else if (amount === 100) {
        hours = 8;
        points = 2; 
    }

    localStorage.setItem('pendingPurchase', JSON.stringify({ username, hours, amount, points }));

    showPaymentOptions(amount);

    userPoints += points; 
    localStorage.setItem(`userPoints_${username}`, JSON.stringify(userPoints)); 

    const userPointsDisplay = document.getElementById('user-points');
    if (userPointsDisplay) {
        userPointsDisplay.textContent = userPoints; 
    }
}

function displayPurchaseHistory() {
    const historyContainer = document.getElementById('purchase-history');
    historyContainer.innerHTML = ''; 

    const storedHistory = localStorage.getItem(`purchaseHistory_${username}`);
    purchaseHistory = JSON.parse(storedHistory) || []; 

    if (purchaseHistory.length === 0) {
        historyContainer.innerHTML = "<p>No purchase history available.</p>";
        return;
    }

    purchaseHistory.forEach((purchase) => {
        const purchaseEntry = document.createElement('div');

        if (purchase.hours) {
            purchaseEntry.innerHTML = `${purchase.date} - ${purchase.username} purchased ${purchase.hours} hour(s) of time.`;
        } else {
            purchaseEntry.innerHTML = `${purchase.date} - ${purchase.username} purchased ${purchase.quantity} ${purchase.item}(s).`;
        }

        historyContainer.appendChild(purchaseEntry);
    });
}

document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function() {
        const section = this.innerText.toLowerCase().replace(/ /g, '');
        loadContent(section);
    });
});

function logout() {
    localStorage.removeItem('username'); 
    window.location.href = 'login.html'; 
}

function loadProfile() {
    const username = localStorage.getItem('username'); 
    const email = localStorage.getItem('email'); 
}

document.addEventListener('DOMContentLoaded', loadProfile);

function updateProfile() {
    const newEmail = document.getElementById('new-email').value;
    const newPassword = document.getElementById('new-password').value;

    
    if (newEmail) {
        localStorage.setItem('email', newEmail); 
        console.log(`Updated Email: ${newEmail}`);
    }
    if (newPassword) {
        console.log(`Updated Password: ${newPassword}`);
    }

    alert('Profile updated successfully!');
}

function showFlavors(category) {
    document.querySelectorAll('.flavor-options').forEach(div => div.style.display = 'none');
    
    if (category === 'pancitCanton') {
        document.getElementById('pancitCantonFlavors').style.display = 'block';
    } else if (category === 'cupNoodles') {
        document.getElementById('cupNoodlesFlavors').style.display = 'block';
    } else if (category === 'paylessXtraBig') {
        document.getElementById('paylessXtraBigFlavors').style.display = 'block';
    }
}

function placeOrder(item) {
    const snackStoreSection = document.getElementById('snackstore-content');
    let paymentContainer = document.getElementById('payment-container');

    if (!paymentContainer) {
        paymentContainer = document.createElement('div');
        paymentContainer.id = 'payment-container';
        snackStoreSection.appendChild(paymentContainer);
    } else {
        paymentContainer.innerHTML = ''; 
    }

    paymentContainer.innerHTML = `<p>${item} is being prepared. How many would you like to order:</p>`;

    const quantityLabel = document.createElement('label');
    quantityLabel.textContent = 'Quantity: ';
    quantityLabel.style.marginRight = '5px';

    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.min = '1';
    quantityInput.style.width = '50px';
    quantityInput.style.marginBottom = '10px';

    paymentContainer.appendChild(quantityLabel);
    paymentContainer.appendChild(quantityInput);
    paymentContainer.appendChild(document.createElement('br')); 

    const paymentPrompt = document.createElement('p');
    paymentPrompt.textContent = "How would you like to pay?";
    paymentPrompt.style.marginTop = '10px';
    paymentContainer.appendChild(paymentPrompt);

    const payOnlineBtn = document.createElement('button');
    payOnlineBtn.textContent = 'Pay Online';
    payOnlineBtn.style.display = 'block';
    payOnlineBtn.style.marginTop = '10px';
    payOnlineBtn.onclick = function() {
        const quantity = quantityInput.value;
        if (quantity > 0) {
            saveUserExpirationTime(10, true);

            const qrCode = document.createElement('img');
            qrCode.src = 'QR CODE.jpg'; 
            qrCode.alt = 'QR Code for Payment';
            qrCode.style.width = '300px';
            qrCode.style.display = 'block';
            paymentContainer.innerHTML = ''; 
            paymentContainer.appendChild(qrCode);

            purchaseHistory.push({
                username: username,
                item: item,
                quantity: quantity,
                date: new Date().toLocaleString()
            });
            localStorage.setItem(`purchaseHistory_${username}`, JSON.stringify(purchaseHistory));

            alert(`Please scan the QR code to pay for ${quantity} ${item}(s). Once the online payment goes through, please wait for the food to be delivered.`);
        } else {
            alert('Please enter a valid quantity.');
        }
    };

    const payDirectlyBtn = document.createElement('button');
    payDirectlyBtn.textContent = 'Pay Directly';
    payDirectlyBtn.style.display = 'block';
    payDirectlyBtn.style.marginTop = '10px';
    payDirectlyBtn.onclick = function() {
        const quantity = quantityInput.value;
        if (quantity > 0) {
            saveUserExpirationTime(10, true);

            alert(`Please proceed to the cashier to pay for ${quantity} ${item}(s). Once payment is made, your order will be prepared.`);

            purchaseHistory.push({
                username: username,
                item: item,
                quantity: quantity,
                date: new Date().toLocaleString()
            });
            localStorage.setItem(`purchaseHistory_${username}`, JSON.stringify(purchaseHistory));

            paymentContainer.innerHTML = ''; 
        } else {
            alert('Please enter a valid quantity.');
        }
    };

    paymentContainer.appendChild(payOnlineBtn);
    paymentContainer.appendChild(payDirectlyBtn);
}

function showDrinks() {
    document.querySelectorAll('.flavor-options').forEach(div => div.style.display = 'none');
    
    document.getElementById('drinksOptions').style.display = 'block';
}

function placeDrinkOrder(drink) {
    const snackStoreSection = document.getElementById('snackstore-content');
    let paymentContainer = document.getElementById('payment-container');

    if (!paymentContainer) {
        paymentContainer = document.createElement('div');
        paymentContainer.id = 'payment-container';
        snackStoreSection.appendChild(paymentContainer);
    } else {
        paymentContainer.innerHTML = ''; 
    }

    paymentContainer.innerHTML = `        
        <p>${drink} is being prepared. How many would you like to order:</p>
        <label for="quantity">Quantity:</label>
        <input type="number" id="quantity" min="1" value="1" style="width: 50px;">
        <br><br>
        <p>How would you like to pay?</p>
    `;

    const payOnlineBtn = document.createElement('button');
    payOnlineBtn.textContent = 'Pay Online';
    payOnlineBtn.style.display = 'block'; 
    payOnlineBtn.style.marginTop = '10px'; 
    payOnlineBtn.onclick = function() {
        const quantity = document.getElementById('quantity').value;
        if (quantity > 0) {
            saveUserExpirationTime(10, true); 
    
            const qrCode = document.createElement('img');
            qrCode.src = 'QR CODE.jpg'; 
            qrCode.alt = 'QR Code for Payment';
            qrCode.style.width = '300px'; 
            qrCode.style.display = 'block';
            paymentContainer.innerHTML = ''; 
            paymentContainer.appendChild(qrCode);
            
            purchaseHistory.push({
                username: username,
                item: drink,
                quantity: quantity,
                date: new Date().toLocaleString() 
            });
            localStorage.setItem(`purchaseHistory_${username}`, JSON.stringify(purchaseHistory)); 
    
            alert(`Please scan the QR code to pay for ${quantity} ${drink}(s). Once the online payment goes through, please wait for the drinks to be delivered to you.`);
        } else {
            alert('Please enter a valid quantity.');
        }
    };

    const payDirectlyBtn = document.createElement('button');
    payDirectlyBtn.textContent = 'Pay Directly';
    payDirectlyBtn.style.display = 'block'; 
    payDirectlyBtn.style.marginTop = '10px'; 
    payDirectlyBtn.onclick = function() {
        const quantity = document.getElementById('quantity').value;
        if (quantity > 0) {
            saveUserExpirationTime(10, true); 
    
            alert(`Please proceed to the cashier for payment of ${quantity} ${drink}(s). Once the payment is made, please wait for the drinks to be delivered to you.`);
    
            purchaseHistory.push({
                username: username,
                item: drink,
                quantity: quantity,
                date: new Date().toLocaleString() 
            });
            localStorage.setItem(`purchaseHistory_${username}`, JSON.stringify(purchaseHistory)); 
    
            paymentContainer.innerHTML = ''; 
        } else {
            alert('Please enter a valid quantity.');
        }
    };
    
    paymentContainer.appendChild(payOnlineBtn);
    paymentContainer.appendChild(payDirectlyBtn);
}

function redeemPoints(pointsRequired, reward) {
    if (userPoints >= pointsRequired) {
        userPoints -= pointsRequired; 
        localStorage.setItem(`userPoints_${username}`, JSON.stringify(userPoints)); 
        document.getElementById('user-points').textContent = userPoints; 
        document.getElementById('redemption-message').textContent = `You have successfully redeemed ${reward}!`;

        const redeemHistory = JSON.parse(localStorage.getItem(`redeemHistory_${username}`)) || [];
        redeemHistory.push({
            date: new Date().toLocaleString(),
            reward: reward,
            pointsRequired: pointsRequired
        });
        localStorage.setItem(`redeemHistory_${username}`, JSON.stringify(redeemHistory));

        displayRedeemHistory();
    } else {
        document.getElementById('redemption-message').textContent = "You do not have enough points to redeem this reward.";
    }
}

function displayRedeemHistory() {
    const historyContainer = document.getElementById('redeem-history'); 
    historyContainer.innerHTML = ''; 

    const storedRedeemHistory = localStorage.getItem(`redeemHistory_${username}`);
    const redeemHistory = JSON.parse(storedRedeemHistory) || [];

    if (redeemHistory.length === 0) {
        historyContainer.innerHTML = "<p>No redeem history available.</p>";
        return;
    }

    redeemHistory.forEach((redemption) => {
        const redemptionEntry = document.createElement('div');
        redemptionEntry.innerHTML = `${redemption.date} - ${redemption.reward} redeemed for ${redemption.pointsRequired} points.`;
        historyContainer.appendChild(redemptionEntry);
    });
}

function updateUserPoints() {
    let storedPoints = localStorage.getItem(`userPoints_${username}`);
    let userPoints = storedPoints ? JSON.parse(storedPoints) : 0; 
    document.getElementById('user-points').textContent = userPoints; 
}

function updateCountdown() {
    const username = localStorage.getItem('username');
    if (!username) {
        console.log("No user logged in.");
        return;
    }

    const countdownElement = document.getElementById('countdown-timer');
    const expirationTime = localStorage.getItem(`expirationTime_${username}`); 
    const currentTime = new Date().getTime();

    if (expirationTime) {
        const remainingTime = expirationTime - currentTime;
        if (remainingTime <= 0) {
            countdownElement.textContent = "Time's up! Please extend your time.";
        } else {
            const hours = Math.floor(remainingTime / (1000 * 60 * 60));
            const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
            countdownElement.textContent = `${hours}h ${minutes}m ${seconds}s`;
        }
    } else {
        countdownElement.textContent = "No active session."; 
    }
}

function saveUserExpirationTime(time, isMinutes = false) {
    const username = localStorage.getItem('username'); 
    if (username) {
        let currentExpirationTime = localStorage.getItem(`expirationTime_${username}`);
        let expirationTime;

        if (!currentExpirationTime) {
            currentExpirationTime = new Date().getTime();
        } else {
            currentExpirationTime = parseInt(currentExpirationTime); 
        }

        if (isMinutes) {
            expirationTime = currentExpirationTime + (time * 60 * 1000); 
        } else {
            expirationTime = currentExpirationTime + (time * 60 * 60 * 1000); 
        }

        localStorage.setItem(`expirationTime_${username}`, expirationTime);

        clearInterval(window.countdownInterval);
        window.countdownInterval = setInterval(updateCountdown, 1000);
    }
}


function resetCountdown() {
    const username = localStorage.getItem('username');
    
    if (!username) {
        console.log("No user logged in.");
        return;
    }

    localStorage.removeItem(`expirationTime_${username}`);

    const countdownElement = document.getElementById('countdown-timer');
    countdownElement.textContent = "No active session.";

    clearInterval(window.countdownInterval);
}

document.getElementById('reset-timer-btn').addEventListener('click', resetCountdown);

setInterval(updateCountdown, 1000);

document.addEventListener('DOMContentLoaded', () => {
    displayPurchaseHistory();
    displayRedeemHistory();

document.addEventListener('DOMContentLoaded', () => {
    window.countdownInterval = setInterval(updateCountdown, 1000);
});
    
    document.getElementById('redeem-history-btn').addEventListener('click', function() {
        const historyContainer = document.getElementById('redeem-history');
        historyContainer.style.display = historyContainer.style.display === 'none' ? 'block' : 'none'; 
        displayRedeemHistory(); 
    });
});

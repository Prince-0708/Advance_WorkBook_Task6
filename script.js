// Sample users with different roles (Admin, Seller, Buyer)
const users = [
    { username: "admin", password: "admin123", role: "admin" },
    { username: "seller", password: "seller123", role: "seller" },
    { username: "buyer", password: "buyer123", role: "buyer" }
];

// Listings array (Example products)
let listings = [
    { title: "iPhone 12", price: "$500" },
    { title: "Gaming Laptop", price: "$1200" }
];

// Encrypt passwords using Base64 encoding
function hashPassword(password) {
    return btoa(password);  // Convert text to encoded format
}

// Store encrypted passwords instead of plain text
const secureUsers = users.map(user => ({
    username: user.username,
    password: hashPassword(user.password),
    role: user.role
}));

// Login Function with Role Management
let loginAttempts = 0;
let isBlocked = false;

function login() {
    if (isBlocked) {
        alert("Too many attempts! Try again later.");
        return;
    }

    let username = document.getElementById("username").value;
    let password = hashPassword(document.getElementById("password").value);

    let user = secureUsers.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem("role", user.role);
        document.getElementById("userRole").innerText = user.role;
        document.getElementById("login-section").style.display = "none";
        document.getElementById("marketplace-section").style.display = "block";

        setupUserPermissions(user.role);
        displayListings();
    } else {
        loginAttempts++;
        alert("Invalid login credentials!");

        if (loginAttempts > 3) {
            isBlocked = true;
            alert("Too many failed attempts. Blocking login for 30 seconds.");

            setTimeout(() => {
                loginAttempts = 0;
                isBlocked = false;
            }, 30000);  // Block login for 30 seconds
        }
    }
}

// Function to manage visibility of buttons based on user role
function setupUserPermissions(role) {
    if (role === "buyer") {
        document.getElementById("addBtn").style.display = "none";
        document.getElementById("deleteBtn").style.display = "none";
    } else if (role === "seller") {
        document.getElementById("deleteBtn").style.display = "none";
    }
}

// Function to display listings
function displayListings() {
    let table = document.getElementById("listingsTable");
    table.innerHTML = `<tr>
        <th>Title</th>
        <th>Price</th>
        <th>Actions</th>
    </tr>`;

    listings.forEach((item, index) => {
        let row = table.insertRow();
        row.innerHTML = `
            <td>${item.title}</td>
            <td>${item.price}</td>
            <td><button onclick="deleteListing(${index})">Delete</button></td>
        `;

        // Hide delete button for unauthorized users
        let role = localStorage.getItem("role");
        if (role !== "admin") {
            row.cells[2].innerHTML = "No Permission";
        }
    });
}

// Function to add a new listing
function addListing() {
    let role = localStorage.getItem("role");
    if (role === "seller" || role === "admin") {
        let title = prompt("Enter product title:");
        let price = prompt("Enter product price:");
        listings.push({ title, price });
        displayListings();
    } else {
        alert("Access Denied! Only sellers can add listings.");
    }
}

// Function to delete a listing
function deleteListing(index) {
    let role = localStorage.getItem("role");
    if (role === "admin") {
        listings.splice(index, 1);
        displayListings();
    } else {
        alert("Access Denied! Only admins can delete listings.");
    }
}

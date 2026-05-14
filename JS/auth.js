// TOGGLE FORMS (LOGIN ↔ REGISTER)
function showRegister() {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if (loginForm && registerForm) {
        loginForm.style.display = "none";
        registerForm.style.display = "block";
    }
}

function showLogin() {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if (loginForm && registerForm) {
        registerForm.style.display = "none";
        loginForm.style.display = "block";
    }
}

//REGISTER
function register() {
    const name = document.getElementById("name")?.value.trim();
    // const email = document.getElementById("email")?.value.trim();
    const email = document.getElementById("email")?.value.trim().toLowerCase();
    const password = document.getElementById("password")?.value;
    const confirmPassword = document.getElementById("confirmPassword")?.value;

    if (!name || !email || !password || !confirmPassword) {
        alert("All fields are required!");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // check if already exists
    let exists = users.find(u => u.email === email);

    if (exists) {
        alert("User already exists!");
        return;
    }

    users.push({
        name,
        email,
        password
    });

    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration Successful!");

    showLogin();
}

// LOGIN
function login() {
    // const email = document.getElementById("loginEmail").value.trim();
    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    //get all users
    const users = JSON.parse(localStorage.getItem("users")) || [];

    //find matching user
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {

        localStorage.setItem("isLoggedIn", "true");

        // store current user
        localStorage.setItem("currentUser", user.email);
        localStorage.setItem("currentUserName", user.name);

        alert("Login Successful!");
        window.location.href = "../index.html";

    } else {
        alert("Invalid Credentials!");
    }
}

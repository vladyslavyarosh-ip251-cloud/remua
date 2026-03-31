// Перехід до вікна реєстрації
function showRegister() {
    document.getElementById("loginPanel").style.display = "none";
    // Використовуємо flex, бо у твоєму CSS клас .login має display: flex
    document.getElementById("registerPanel").style.display = "flex"; 
}

// Повернення до вікна входу
function showLogin() {
    document.getElementById("registerPanel").style.display = "none";
    document.getElementById("loginPanel").style.display = "flex";
}

// Імітація реєстрації
function register() {
    alert("Реєстрація пройшла успішно! Тепер ви можете увійти.");
    showLogin(); // Після "реєстрації" повертаємо користувача на форму входу
}

// Існуюча функція для входу
function login() {
    const role = document.getElementById("roleSelect").value;
    const loginPanel = document.getElementById("loginPanel");
    const userPanel = document.getElementById("userPanel");
    const adminPanel = document.getElementById("adminPanel");

    loginPanel.style.display = "none";

    if (role === "user") {
        userPanel.style.display = "grid"; 
        adminPanel.style.display = "none";
    } else if (role === "admin") {
        userPanel.style.display = "none";
        adminPanel.style.display = "block";
    }
}

// Існуюча функція для виходу
function logout() {
    const loginPanel = document.getElementById("loginPanel");
    const userPanel = document.getElementById("userPanel");
    const adminPanel = document.getElementById("adminPanel");

    loginPanel.style.display = "flex";
    userPanel.style.display = "none";
    adminPanel.style.display = "none";
}
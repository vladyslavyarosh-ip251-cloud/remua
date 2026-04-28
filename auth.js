function handleLogin() {
  const name = document.getElementById("loginName").value.trim();
  const pass = document.getElementById("loginPass").value.trim();

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(
    (u) => u.name === name && u.pass === pass
  );

  if (!user) {
    alert("Невірний логін або пароль!");
    return;
  }

  localStorage.setItem("userRole", user.role);
  localStorage.setItem("userName", user.name);

  window.location.href = "index.html";
}

function handleRegister() {
  const name = document.getElementById("regName").value.trim();
  const pass = document.getElementById("regPass").value.trim();

  if (!name || !pass) {
    alert("Заповніть всі поля!");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.find(u => u.name === name)) {
    alert("Користувач вже існує!");
    return;
  }

  users.push({ name, pass, role: "user" });

  localStorage.setItem("users", JSON.stringify(users));

  alert("Реєстрація успішна!");
  toggleAuth();
}

function toggleAuth() {
  const loginF = document.getElementById("loginForm");
  const regF = document.getElementById("registerForm");

  loginF.style.display = loginF.style.display === "none" ? "block" : "none";
  regF.style.display = regF.style.display === "none" ? "block" : "none";
}
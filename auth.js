function toggleAuth() {
    const loginF = document.getElementById('loginForm');
    const registerF = document.getElementById('registerForm');
    loginF.style.display = loginF.style.display === 'none' ? 'block' : 'none';
    registerF.style.display = registerF.style.display === 'none' ? 'block' : 'none';
}


function handleRegister() {
    const name = document.getElementById('regName').value.trim();
    const pass = document.getElementById('regPass').value.trim();
    const role = document.getElementById('regRole').value;

    if (!name || !pass) {
        alert("Заповніть усі поля!");
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];

    
    if (users.find(u => u.name === name)) {
        alert("Користувач з таким ім'ям вже існує!");
        return;
    }

  
    users.push({ name, pass, role });
    localStorage.setItem('users', JSON.stringify(users));

    alert("Реєстрація успішна!");
    toggleAuth();
}

function handleLogin() {
    const name = document.getElementById('loginName').value.trim();
    const pass = document.getElementById('loginPass').value.trim();
    const role = document.getElementById('loginRole').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];

    
    const user = users.find(u => u.name === name && u.pass === pass && u.role === role);

    if (user) {
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userName', user.name);
        window.location.href = 'index.html';
    } else {
        alert("Невірний логін, пароль або роль!");
    }
}
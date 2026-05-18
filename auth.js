import { createClient } from "https://esm.sh/@supabase/supabase-js";

// Ініціалізуємо Supabase один раз тут і додаємо export
export const supabase = createClient(
  "https://wisuzgckvumcjkntnbkh.supabase.co",
  "sb_publishable_7bBz4u8RtEst45jyWOds5w_p-D64MNI"
);

// Логіка Входу
async function handleLogin() {
  const email = document.getElementById("loginName")?.value.trim();
  const password = document.getElementById("loginPass")?.value.trim();

  if (!email || !password) {
    alert("Заповніть всі поля!");
    return;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    alert("Помилка входу: " + error.message);
    return;
  }

  const user = data.user;
  const role = user.user_metadata.role || "user";

  // Зберігаємо дані в пам'ять браузера
  localStorage.setItem("userRole", role);
  localStorage.setItem("userName", user.email);

  // Перенаправляємо на головну сторінку
  window.location.href = "index.html";
}

// Логіка Реєстрації
async function handleRegister() {
  const email = document.getElementById("regName")?.value.trim();
  const password = document.getElementById("regPass")?.value.trim();

  if (!email || !password) {
    alert("Заповніть всі поля!");
    return;
  }

  if (password.length < 6) {
    alert("Пароль має містити мінімум 6 символів!");
    return;
  }

  let assignedRole = "user";
  if (email.toLowerCase() === "admin@example.com") {
    assignedRole = "admin";
  }

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        role: assignedRole
      }
    }
  });

  if (error) {
    alert("Помилка реєстрації: " + error.message);
  } else {
    alert(`Реєстрація успішна! Роль визначено як: ${assignedRole}`);
    toggleAuth(); // Перемикаємо на вікно входу
  }
}

// Перемикання між вікнами Вхід / Реєстрація
function toggleAuth() {
  const loginF = document.getElementById("loginForm");
  const regF = document.getElementById("registerForm");

  if (!loginF || !regF) return;

  if (loginF.style.display === "none") {
    loginF.style.display = "block";
    regF.style.display = "none";
  } else {
    loginF.style.display = "none";
    regF.style.display = "block";
  }
}

// Зробимо функції доступними для інлайн-кнопок onclick в HTML
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.toggleAuth = toggleAuth;
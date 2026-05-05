
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const SUPABASE_URL = "https://wisuzgckvumcjkntnbkh.supabase.co";
// Важливо: перевірте цей ключ у налаштуваннях Supabase (Project Settings -> API -> anon public)
const SUPABASE_KEY = "sb_publishable_7bBz4u8RtEst45jyWOds5w_p-D64MNI"; 


const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function handleLogin() {
  const email = document.getElementById("loginName").value.trim();
  const password = document.getElementById("loginPass").value.trim();

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

  localStorage.setItem("userRole", role);
  localStorage.setItem("userName", user.email);

  window.location.href = "index.html";
}

async function handleRegister() {
  const email = document.getElementById("regName").value.trim();
  const password = document.getElementById("regPass").value.trim();

  if (!email || !password) {
    alert("Заповніть всі поля!");
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        role: "user" 
      }
    }
  });

  if (error) {
    alert("Помилка реєстрації: " + error.message);
  } else {
    alert("Реєстрація успішна! Тепер ви можете увійти.");
    toggleAuth();
  }
}

function toggleAuth() {
  const loginF = document.getElementById("loginForm");
  const regF = document.getElementById("registerForm");

  if (loginF.style.display === "none") {
    loginF.style.display = "block";
    regF.style.display = "none";
  } else {
    loginF.style.display = "none";
    regF.style.display = "block";
  }
}

window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.toggleAuth = toggleAuth;
import { supabase } from "./auth.js";

let myOrders = JSON.parse(localStorage.getItem("myOrders")) || [];
const clientName = localStorage.getItem("userName");


if (!clientName) {
  window.location.href = "auth.html";
}


function renderCart() {
  const container = document.getElementById("cartContent");
  
  if (myOrders.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <p>Ваш кошик порожній 🛒</p>
        <button onclick="window.location.href='index.html'" style="margin-top:15px; padding:10px 20px; cursor:pointer; background:#3498db; color:white; border:none; border-radius:6px;">Перейти до каталогу</button>
      </div>
    `;
    return;
  }

  let total = 0;
  const itemsHtml = myOrders.map((item, index) => {
    total += Number(item.price);
    return `
      <div class="cart-item">
        <div class="cart-item-info">
          <img src="${item.image}" class="cart-item-img" onerror="this.src='https://placehold.co/60x40'">
          <div>
            <strong>${item.name}</strong><br>
            <span style="color: #e74c3c;">${item.price} грн</span>
          </div>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${index})">Видалити</button>
      </div>
    `;
  }).join("");

  container.innerHTML = `
    ${itemsHtml}
    <div class="cart-summary">
      Разом: <span style="color: #e74c3c;">${total} грн</span>
    </div>
    <button class="checkout-btn" id="checkoutBtn">Оформити замовлення</button>
  `;

  document.getElementById("checkoutBtn").addEventListener("click", checkout);
}

function removeFromCart(index) {
  myOrders.splice(index, 1);
  localStorage.setItem("myOrders", JSON.stringify(myOrders));
  renderCart();
}

async function checkout() {
  if (myOrders.length === 0) return;

  const btn = document.getElementById("checkoutBtn");
  btn.disabled = true;
  btn.textContent = "Обробка...";

  const orderData = myOrders.map(item => ({
    client_name: clientName,
    service_id: item.id,
    service_name: item.name,
    price: item.price
  }));

  const { error } = await supabase
    .from("order_items")
    .insert(orderData);

  if (error) {
    alert("Помилка при оформленні замовлення: " + error.message);
    btn.disabled = false;
    btn.textContent = "Оформити замовлення";
  } else {
    alert("🎉 Замовлення успішно оформлено! З вами зв'яжеться наш менеджер.");
    myOrders = [];
    localStorage.removeItem("myOrders");
    renderCart();
    loadHistory(); // Оновлюємо історію після покупки
  }
}



async function loadHistory() {
  const container = document.getElementById("historyContent");
  if (!container) return;

  container.innerHTML = "<p>Завантаження історії...</p>";

  
  const { data, error } = await supabase
    .from("order_items")
    .select("*")
    .eq("client_name", clientName)
    .order("created_at", { ascending: false });

  if (error) {
    container.innerHTML = `<p style="color:red;">Помилка завантаження: ${error.message}</p>`;
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = "<p class='empty-cart'>Ви ще нічого не замовляли.</p>";
    return;
  }

 
  const groupedOrders = {};
  data.forEach(item => {
    const dateStr = new Date(item.created_at).toLocaleString("uk-UA"); 
    if (!groupedOrders[dateStr]) {
      groupedOrders[dateStr] = [];
    }
    groupedOrders[dateStr].push(item);
  });

  
  let html = "";
  for (const [date, items] of Object.entries(groupedOrders)) {
    let orderTotal = 0;
    
    const itemsHtml = items.map(i => {
      orderTotal += Number(i.price);
      return `
        <div style="display:flex; justify-content:space-between; padding: 5px 0;">
          <span>🔹 ${i.service_name}</span>
          <strong>${i.price} грн</strong>
        </div>`;
    }).join("");

    html += `
      <div class="history-item">
        <div class="history-header">
          <strong>📅 ${date}</strong>
          <span style="color: #27ae60; font-weight: bold;">Оформлено</span>
        </div>
        ${itemsHtml}
        <div style="text-align: right; margin-top: 10px; border-top: 1px dashed var(--border-color); padding-top: 10px;">
          Сума замовлення: <strong style="color: #e74c3c;">${orderTotal} грн</strong>
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
}



function toggleTheme() {
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  updateThemeButton(isDark);
}

function updateThemeButton(isDark) {
  const btn = document.getElementById("themeBtn");
  if (btn) btn.textContent = isDark ? "☀️" : "🌙";
}

function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  const isDark = savedTheme === "dark";
  if (isDark) document.body.classList.add("dark");
  updateThemeButton(isDark);
}

function logout() {
  localStorage.clear();
  window.location.href = "auth.html";
}


window.removeFromCart = removeFromCart;
window.toggleTheme = toggleTheme;
window.logout = logout;


window.addEventListener("DOMContentLoaded", () => {
  initTheme();
  document.getElementById("welcomeText").textContent = "Вітаємо, " + clientName + "!";
  renderCart();
  loadHistory();
});
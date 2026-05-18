import { supabase } from "./auth.js";

let allServices = [];
let allMessages = [];
let myOrders = JSON.parse(localStorage.getItem("myOrders")) || [];
let currentPage = 1;
const itemsPerPage = 5;

async function loadCatalog() {
  const { data, error } = await supabase
    .from("services")
    .select();

  if (error) {
    console.log("Supabase error:", error);
    return;
  }

  allServices = data || [];

  updateCartCount();
  updateCatalogView();

  if (localStorage.getItem("userRole") === "admin") {
    renderAdminTable();
    loadMessages();
  }
}

function handleControlsChange() {
  currentPage = 1;
  updateCatalogView();
}

function updateCatalogView() {
  const search = (document.getElementById("searchInput")?.value || "").toLowerCase();
  const sort = document.getElementById("sortSelect")?.value || "default";

  let filtered = allServices.filter((s) =>
    s.name.toLowerCase().includes(search)
  );

  if (sort === "price-asc") filtered.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") filtered.sort((a, b) => b.price - a.price);
  if (sort === "name-asc") filtered.sort((a, b) => a.name.localeCompare(b.name));

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;

  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * itemsPerPage;
  const pageItems = filtered.slice(start, start + itemsPerPage);

  renderCatalog(pageItems);
  renderPagination(totalPages);
}

function renderCatalog(data) {
  const container = document.getElementById("catalogList");
  if (!container) return;

  if (!data.length) {
    container.innerHTML = "<p>Послуг не знайдено.</p>";
    return;
  }

  container.innerHTML = data
    .map(
      (s) => `
      <div class="service-card" onclick="window.location.href='service.html?id=${s.id}'" style="cursor: pointer;">
        <img src="${s.image}" 
             class="service-image"
             onerror="this.src='https://placehold.co/300x200'">

        <h3>${s.name}</h3>
        <p class="price">${s.price} грн</p>

        <button onclick="event.stopPropagation(); addToCart(${s.id})">
          Вибрати
        </button>
      </div>
    `
    )
    .join("");
}

function renderPagination(totalPages) {
  const container = document.getElementById("paginationControls");
  if (!container) return;

  container.innerHTML = "";

  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = i === currentPage ? "active" : "";

    btn.onclick = () => {
      currentPage = i;
      updateCatalogView();
    };

    container.appendChild(btn);
  }
}

function addToCart(id) {
  const item = allServices.find((s) => s.id === id);
  if (!item) return;

  myOrders.push(item);
  localStorage.setItem("myOrders", JSON.stringify(myOrders));

  updateCartCount();
  alert("Додано в кошик!");
}

function updateCartCount() {
  const el = document.getElementById("cartCount");
  if (el) el.textContent = myOrders.length;
}

function renderAdminTable() {
  const tbody = document.getElementById("adminTableBody");
  if (!tbody) return;

  tbody.innerHTML = allServices
    .map(
      (s) => `
      <tr>
        <td>${s.name}</td>
        <td>${s.price} грн</td>
        <td>
          <button onclick="editService(${s.id})">Ред.</button>
          <button onclick="deleteService(${s.id})">Видалити</button>
        </td>
      </tr>
    `
    )
    .join("");
}

async function saveService() {
  const id = document.getElementById("editId").value;
  const name = document.getElementById("adminName").value.trim();
  const price = document.getElementById("adminPrice").value.trim();
  let image = document.getElementById("adminImage").value.trim();
  let desc = document.getElementById("adminDesc").value.trim();

  if (!name || !price) {
    alert("Введіть дані!");
    return;
  }

  if (!image) image = "https://placehold.co/300x200";

  if (id) {
    await supabase
      .from("services")
      .update({ name, price: Number(price), image, description: desc })
      .eq("id", id);
  } else {
    await supabase
      .from("services")
      .insert([{ name, price: Number(price), image, description: desc }]);
  }

  cancelEdit();
  loadCatalog();
}

async function deleteService(id) {
  if (!confirm("Видалити?")) return;

  await supabase
    .from("services")
    .delete()
    .eq("id", id);

  loadCatalog();
}

function editService(id) {
  const s = allServices.find((x) => x.id === id);
  if (!s) return;

  document.getElementById("editId").value = s.id;
  document.getElementById("adminName").value = s.name;
  document.getElementById("adminPrice").value = s.price;
  document.getElementById("adminImage").value = s.image;
  document.getElementById("adminDesc").value = s.description || "";

  document.getElementById("adminSaveBtn").textContent = "Зберегти";
  document.getElementById("adminCancelBtn").style.display = "inline-block";
}

function cancelEdit() {
  document.getElementById("editId").value = "";
  document.getElementById("adminName").value = "";
  document.getElementById("adminPrice").value = "";
  document.getElementById("adminImage").value = "";
  document.getElementById("adminDesc").value = "";

  document.getElementById("adminSaveBtn").textContent = "Додати";
  document.getElementById("adminCancelBtn").style.display = "none";
}

async function loadMessages() {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log("Помилка завантаження повідомлень:", error);
    return;
  }

  allMessages = data || [];
  renderMessages();
}

function renderMessages() {
  const tbody = document.getElementById("adminMessagesBody");
  if (!tbody) return;

  if (!allMessages.length) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Немає нових повідомлень</td></tr>`;
    return;
  }

  tbody.innerHTML = allMessages
    .map(
      (m) => {
        const date = new Date(m.created_at).toLocaleDateString("uk-UA", { 
          day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
        });

        return `
        <tr>
          <td style="font-size: 14px; color: #7f8c8d;">${date}</td>
          <td>
            <strong>${m.name}</strong><br>
            <a href="mailto:${m.email}" style="color: #3498db; font-size: 14px;">${m.email}</a>
          </td>
          <td style="max-width: 300px; white-space: pre-wrap;">${m.message}</td>
          <td>
            <button onclick="deleteMessage(${m.id})" style="background: #e74c3c; padding: 5px 10px; color: white; border: none; border-radius: 4px; cursor: pointer;">Видалити</button>
          </td>
        </tr>
        `;
      }
    )
    .join("");
}

async function deleteMessage(id) {
  if (!confirm("Видалити цей запит?")) return;

  await supabase
    .from("messages")
    .delete()
    .eq("id", id);

  loadMessages();
}

window.loadCatalog = loadCatalog;
window.handleControlsChange = handleControlsChange;
window.addToCart = addToCart;
window.saveService = saveService;
window.deleteService = deleteService;
window.editService = editService;
window.cancelEdit = cancelEdit;
window.deleteMessage = deleteMessage;

window.addEventListener("DOMContentLoaded", () => {
  loadCatalog();
});
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(
  "https://wisuzgckvumcjkntnbkh.supabase.co",
  "ТВІЙ_ANON_KEY"
);

/* ---------------- STATE ---------------- */

let allServices = [];
let myOrders = JSON.parse(localStorage.getItem("myOrders")) || [];
let currentPage = 1;
const itemsPerPage = 4;

/* ---------------- LOAD DATA ---------------- */

async function loadCatalog() {
  console.log("Loading catalog...");
 console.log("LOADING CATALOG...");



console.log(data);
  const { data, error } = await supabase
    .from("services")
    .select("*");

  if (error) {
    console.log("Supabase error:", error);
    return;
  }

  console.log("DATA:", data);

  allServices = data || [];

  updateCartCount();
  updateCatalogView();

  if (localStorage.getItem("userRole") === "admin") {
    renderAdminTable();
  }
}

/* ---------------- USER CATALOG ---------------- */

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
  if (sort === "name-asc")
    filtered.sort((a, b) => a.name.localeCompare(b.name));

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
      <div class="service-card">
        <img src="${s.image}" 
             class="service-image"
             onerror="this.src='https://placehold.co/300x200'">

        <h3>${s.name}</h3>
        <p class="price">${s.price} грн</p>

        <button onclick="addToCart(${s.id})">
          Вибрати
        </button>
      </div>
    `
    )
    .join("");
}

/* ---------------- PAGINATION ---------------- */

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

/* ---------------- CART ---------------- */

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

/* ---------------- ADMIN ---------------- */

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

  if (!name || !price) {
    alert("Введіть дані!");
    return;
  }

  if (!image) image = "https://placehold.co/300x200";

  if (id) {
    await supabase
      .from("services")
      .update({ name, price: Number(price), image })
      .eq("id", id);
  } else {
    await supabase
      .from("services")
      .insert([{ name, price: Number(price), image }]);
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

  document.getElementById("adminSaveBtn").textContent = "Зберегти";
  document.getElementById("adminCancelBtn").style.display = "inline-block";
}

function cancelEdit() {
  document.getElementById("editId").value = "";
  document.getElementById("adminName").value = "";
  document.getElementById("adminPrice").value = "";
  document.getElementById("adminImage").value = "";

  document.getElementById("adminSaveBtn").textContent = "Додати";
  document.getElementById("adminCancelBtn").style.display = "none";
}

/* ---------------- GLOBAL ACCESS ---------------- */

window.loadCatalog = loadCatalog;
window.handleControlsChange = handleControlsChange;
window.addToCart = addToCart;
window.saveService = saveService;
window.deleteService = deleteService;
window.editService = editService;
window.cancelEdit = cancelEdit;

/* ---------------- START ---------------- */

window.addEventListener("DOMContentLoaded", () => {
  loadCatalog();
});
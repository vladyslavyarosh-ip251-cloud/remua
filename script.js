import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://wisuzgckvumcjkntnbkh.supabase.co",
  "sb_publishable_7bBz4u8RtEst45jyWOds5w_p-D64MNI",
);
const { data, error } = await supabase.from("services").select();
console.log(data);

let allServices = data || [];
console.log(allServices);
let myOrders = JSON.parse(localStorage.getItem("myOrders")) || [];
let currentPage = 1;
const itemsPerPage = 4;

// async function loadCatalog() {
// if (!allServices.length) {
// try {
// const res = await fetch('services.json');
// if (res.ok) {
// const data = await res.json();
// allServices = data.map((s, i) => ({ id: Date.now() + i, ...s }));
// localStorage.setItem('services', JSON.stringify(allServices));
// }
// } catch (e) {
// console.warn(e);
// }
// }

// updateCartCount();
// handleControlsChange();

if (localStorage.getItem('userRole') === 'admin') {
console.log("Admin mode: rendering admin table");
renderAdminTable();
}
// }

function handleControlsChange() {
  currentPage = 1;
  updateCatalogView();
}

function updateCatalogView() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const sort = document.getElementById("sortSelect").value;

  let filtered = allServices.filter((s) =>
    s.name.toLowerCase().includes(search),
  );

  if (sort === "price-asc") filtered.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") filtered.sort((a, b) => b.price - a.price);
  else if (sort === "name-asc")
    filtered.sort((a, b) => a.name.localeCompare(b.name));

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  currentPage = Math.max(1, Math.min(currentPage, totalPages));

  const start = (currentPage - 1) * itemsPerPage;
  renderCatalog(filtered.slice(start, start + itemsPerPage));
  renderPagination(totalPages);
}

function renderCatalog(data) {
  const container = document.getElementById("catalogList");
  if (!data.length) return (container.innerHTML = "<p>Послуг не знайдено.</p>");

  container.innerHTML = data
    .map(
      (s) => `
        <div class="service-card">
            <img src="${s.image}" alt="${s.name}" class="service-image" onerror="this.src='https://placehold.co/300x200'">
            <h3>${s.name}</h3>
            <p class="price">${s.price} грн</p>
            <button class="order-btn" onclick="addToCart(${s.id})">Вибрати</button>
        </div>
    `,
    )
    .join("");
}

function renderPagination(totalPages) {
  const container = document.getElementById("paginationControls");
  container.innerHTML = "";
  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = `page-btn ${i === currentPage ? "active" : ""}`;
    btn.textContent = i;
    btn.onclick = () => {
      currentPage = i;
      updateCatalogView();
    };
    container.appendChild(btn);
  }
}

function addToCart(id) {
  const service = allServices.find((s) => s.id === id);
  if (service) {
    myOrders.push(service);
    localStorage.setItem("myOrders", JSON.stringify(myOrders));
    updateCartCount();
    alert(`Послугу "${service.name}" додано до кошика!`);
  }
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
                <button onclick="editService(${s.id})" style="background:#ffc107; color:black;">Ред.</button>
                <button onclick="deleteService(${s.id})" style="background:#dc3545;">Видалити</button>
            </td>
        </tr>
    `,
    )
    .join("");
}

function saveService() {
  const id = document.getElementById("editId").value;
  const name = document.getElementById("adminName").value.trim();
  const price = document.getElementById("adminPrice").value.trim();
  let image = document.getElementById("adminImage").value.trim();

  if (!name || !price) return alert("Вкажіть назву та ціну!");
  if (!image) image = "https://placehold.co/300x200";

  if (id) {
    const index = allServices.findIndex((s) => s.id === Number(id));
    if (index !== -1)
      allServices[index] = {
        id: Number(id),
        name,
        price: Number(price),
        image,
      };
  } else {
    allServices.push({ id: Date.now(), name, price: Number(price), image });
  }

  localStorage.setItem("services", JSON.stringify(allServices));
  cancelEdit();
  renderAdminTable();
  updateCatalogView();
}

function deleteService(id) {
  if (!confirm("Ви впевнені, що хочете видалити цю послугу?")) return;
  allServices = allServices.filter((s) => s.id !== id);
  localStorage.setItem("services", JSON.stringify(allServices));
  renderAdminTable();
  updateCatalogView();
}

function editService(id) {
  const service = allServices.find((s) => s.id === id);
  if (!service) return;

  document.getElementById("editId").value = service.id;
  document.getElementById("adminName").value = service.name;
  document.getElementById("adminPrice").value = service.price;
  document.getElementById("adminImage").value = service.image;

  document.getElementById("adminSaveBtn").textContent = "Зберегти зміни";
  document.getElementById("adminCancelBtn").style.display = "inline-block";
}

function cancelEdit() {
  document.getElementById("editId").value = "";
  document.getElementById("adminName").value = "";
  document.getElementById("adminPrice").value = "";
  document.getElementById("adminImage").value = "";

  document.getElementById("adminSaveBtn").textContent = "Додати послугу";
  document.getElementById("adminCancelBtn").style.display = "none";
}

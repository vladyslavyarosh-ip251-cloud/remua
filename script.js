let allServices = []; 
let myOrders = JSON.parse(localStorage.getItem('myOrders')) || [];
let currentPage = 1;
const itemsPerPage = 4;

async function loadCatalog() {
    try {
        const res = await fetch('services.json');
        allServices = await res.json();
        renderOrders(); 
        handleControlsChange();
    } catch {
        document.getElementById('catalogList').innerHTML = "<p style='color:red;'>Помилка завантаження.</p>";
    }
}

function handleControlsChange() {
    currentPage = 1;
    updateCatalogView();
}

function updateCatalogView() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const sort = document.getElementById('sortSelect').value;
    
    let filtered = allServices.filter(s => s.name.toLowerCase().includes(search));

    if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'name-asc') filtered.sort((a, b) => a.name.localeCompare(b.name));

    const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
    currentPage = Math.max(1, Math.min(currentPage, totalPages));

    const start = (currentPage - 1) * itemsPerPage;
    renderCatalog(filtered.slice(start, start + itemsPerPage));
    renderPagination(totalPages);
}

function renderCatalog(data) {
    const container = document.getElementById('catalogList');
    if (!data.length) return container.innerHTML = '<p>Послуг не знайдено.</p>';

    container.innerHTML = data.map(s => `
        <div class="service-card">
            <img src="${s.image}" alt="${s.name}" class="service-image" onerror="this.src='https://placehold.co/300x200'">
            <h3>${s.name}</h3>
            <p class="price">${s.price} грн</p>
            <button class="order-btn" onclick="addToCart('${s.name}')">Вибрати</button>
        </div>
    `).join('');
}

function addToCart(name) {
    const service = allServices.find(s => s.name === name);
    if (service) {
        myOrders.push(service);
        localStorage.setItem('myOrders', JSON.stringify(myOrders));
        renderOrders();
        alert(`Послугу "${name}" додано до замовлень!`);
    }
}

function renderOrders() {
    const container = document.getElementById('myOrders');
    if (!myOrders.length) return container.innerHTML = '<li>Список порожній</li>';

    container.innerHTML = myOrders.map((s, index) => `
        <li>
            ${s.name} — <b>${s.price} грн</b>
            <button onclick="removeFromCart(${index})" style="margin-left:auto; background:none; color:red; cursor:pointer; border:none;">✕</button>
        </li>
    `).join('');
}

function removeFromCart(index) {
    myOrders.splice(index, 1);
    localStorage.setItem('myOrders', JSON.stringify(myOrders));
    renderOrders();
}

function renderPagination(totalPages) {
    const container = document.getElementById('paginationControls');
    container.innerHTML = '';
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        btn.textContent = i;
        btn.onclick = () => { currentPage = i; updateCatalogView(); };
        container.appendChild(btn);
    }
}
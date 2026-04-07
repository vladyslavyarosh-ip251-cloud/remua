// --- Глобальні змінні ---
let allServices = []; 
let myOrders = JSON.parse(localStorage.getItem('myOrders')) || [];
let currentPage = 1;
const itemsPerPage = 10;

// --- Ініціалізація при завантаженні сторінки ---
document.addEventListener('DOMContentLoaded', () => {
    // Оновлюємо лічильник кошика при завантаженні
    updateCartCount();

    // Перевірка авторизації
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');

    if (!role || !name) {
        window.location.href = 'auth.html';
        return; // Зупиняємо виконання, якщо не авторизований
    }

    // Встановлення привітального тексту
    const welcomeText = document.getElementById('welcomeText');
    if (welcomeText) {
        welcomeText.textContent = `Вітаємо, ${name}! (${role === 'admin' ? 'Адмін' : 'Користувач'})`;
    }

    // Відображення панелей залежно від ролі
    if (role === 'admin') {
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel) adminPanel.style.display = 'block';
    } else {
        const userPanel = document.getElementById('userPanel');
        if (userPanel) userPanel.style.display = 'block';
       
        // Завантажуємо каталог лише для звичайних користувачів
        loadCatalog(); 
    }
});

// --- Функції авторизації ---
function logout() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    window.location.href = 'auth.html';
}

// --- Функції каталогу та кошика ---
async function loadCatalog() {
    try {
        const res = await fetch('services.json'); 
        allServices = await res.json();
        handleControlsChange();
    } catch {
        const container = document.getElementById('catalogList');
        if (container) container.innerHTML = "<p style='color:red;'>Помилка завантаження каталогу.</p>";
    }
}

function handleControlsChange() {
    currentPage = 1;
    updateCatalogView();
}

function updateCatalogView() {
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    
    // Якщо елементів немає на сторінці (наприклад, у адміна), припиняємо виконання
    if (!searchInput || !sortSelect) return;

    const search = searchInput.value.toLowerCase();
    const sort = sortSelect.value;
    
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
    if (!container) return;

    if (!data.length) {
        container.innerHTML = '<p>Послуг не знайдено.</p>';
        return;
    }

    container.innerHTML = data.map(s => `
        <div class="service-card">
            <img src="${s.image}" alt="${s.name}" class="service-image" onerror="this.src='https://placehold.co/300x200'">
            <h3>${s.name}</h3>
            <p class="price">${s.price} грн</p>
            <button class="order-btn" onclick="addToCart('${s.name}')">Додати в кошик</button>
        </div>
    `).join('');
}

function addToCart(name) {
    const service = allServices.find(s => s.name === name);
    if (service) {
        myOrders.push(service);
        localStorage.setItem('myOrders', JSON.stringify(myOrders));
        updateCartCount();
        alert(`Послугу "${name}" додано до кошика!`);
    }
}

function updateCartCount() {
    const countEl = document.getElementById('cartCount');
    if (countEl) {
        countEl.textContent = myOrders.length;
    }
}

function renderPagination(totalPages) {
    const container = document.getElementById('paginationControls');
    if (!container) return;

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
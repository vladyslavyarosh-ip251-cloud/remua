document.addEventListener('DOMContentLoaded', () => {
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');

    if (!role) {
        window.location.href = 'auth.html';
        return;
    }

    document.getElementById('welcomeText').textContent = `Вітаємо, ${name}! (${role})`;

    if (role === 'admin') {
        document.getElementById('adminPanel').style.display = 'block';
    } else {
        document.getElementById('userPanel').style.display = 'block';
        loadCatalog(); 
    }
});


async function loadCatalog() {
    try {
        const response = await fetch('services.json');
        if (!response.ok) throw new Error('Файл не знайдено');
        
        const services = await response.json();
        renderCatalog(services);
    } catch (error) {
        console.error("Помилка:", error);
        document.getElementById('catalogList').innerHTML = "<p>Не вдалося завантажити каталог.</p>";
    }
}


function renderCatalog(data) {
    const container = document.getElementById('catalogList');
    container.innerHTML = ''; 

    data.forEach(service => {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.innerHTML = `
            <h3>${service.name}</h3>
            <p class="price">${service.price} грн</p>
            <button class="order-btn" onclick="addToCart('${service.name}')">Вибрати</button>
        `;
        container.appendChild(card);
    });
}

function addToCart(name) {
    const list = document.getElementById('myOrders');
    const li = document.createElement('li');
    li.textContent = name;
    list.appendChild(li);
}

function logout() {
    localStorage.clear();
    window.location.href = 'auth.html';
}
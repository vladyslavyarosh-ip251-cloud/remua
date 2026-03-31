
let services = [];


async function loadServices() {
    try {
        
        const response = await fetch("services.json");
        
        
        if (!response.ok) {
            throw new Error(`Помилка HTTP: ${response.status}`);
        }

        
        services = await response.json();
        
      
        renderCatalog();
        
    } catch (error) {
        console.error("Сталася помилка під час завантаження послуг:", error);
        document.getElementById("catalogList").innerHTML = "<p>Не вдалося завантажити каталог послуг.</p>";
    }
}

function renderCatalog() {
    const catalogList = document.getElementById("catalogList");
    catalogList.innerHTML = ""; // Очищаємо контейнер

    services.forEach(service => {
        const item = document.createElement("div");
        item.className = "service-item";
        
        item.innerHTML = `
            <div class="service-info">
                <h3>${service.name}</h3>
                <p>Ціна: <strong>${service.price} грн</strong></p>
            </div>
            <button class="order-btn" onclick="orderService(${service.id})">Замовити</button>
        `;
        
        catalogList.appendChild(item);
    });
}


function orderService(id) {
    alert("Ви обрали послугу №" + id);
}


loadServices();
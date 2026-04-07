document.addEventListener('DOMContentLoaded', () => {
    const role = localStorage.getItem('userRole');
    if (!role) {
        window.location.href = 'auth.html';
        return;
    }
    renderOrdersPage();
});

function renderOrdersPage() {
    let myOrders = JSON.parse(localStorage.getItem('myOrders')) || [];
    const container = document.getElementById('myOrdersPage');
    const totalContainer = document.getElementById('totalContainer');
    
    if (!myOrders.length) {
        container.innerHTML = '<li>Ваш кошик наразі порожній.</li>';
        totalContainer.innerHTML = '';
        return;
    }

    let totalSum = 0;
    container.innerHTML = myOrders.map((s, index) => {
        totalSum += Number(s.price);
        return `
        <li>
            <span><b>${s.name}</b></span>
            <span>
                <span style="margin-right: 20px;">${s.price} грн</span>
                <button class="remove-btn" title="Видалити" onclick="removeFromCart(${index})">✕</button>
            </span>
        </li>
    `}).join('');
    
    totalContainer.innerHTML = `<strong>Загальна сума: ${totalSum} грн</strong>`;
}

function removeFromCart(index) {
    let myOrders = JSON.parse(localStorage.getItem('myOrders')) || [];
    myOrders.splice(index, 1);
    localStorage.setItem('myOrders', JSON.stringify(myOrders));
    renderOrdersPage();
}

function logout() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    window.location.href = 'auth.html';
}
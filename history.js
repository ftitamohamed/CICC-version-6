window.addEventListener('DOMContentLoaded', (event) => {
    const loginLink = document.getElementById('loginLink');
    
    const userName = localStorage.getItem('userName');
    
    if (userName) {
        // If userName exists in localStorage, update the link to show the user's name
        loginLink.innerHTML = `<i class="fa-solid fa-user"></i> مرحبًا, ${userName}`;
        loginLink.setAttribute('href', 'Profile.html'); // Prevent navigation to login page
        
  
    }
  });

  window.onload = function() {
    updateCartCount();
};

function updateCartCount() {
    // Retrieve the cartData1 object from localStorage
    const cartData1 = JSON.parse(localStorage.getItem('cartData1')) || { cart: { orders: [] } };
    const orders = cartData1.cart.orders || [];

    // Get the cart count element
    const cartCount = document.getElementById('cart-count');

    // Check if orders array has any items
    if (orders.length > 0) {
        // Show the red dot with the number of items
        cartCount.style.display = 'block';
        cartCount.textContent = orders.length;
    } else {
        // Hide the red dot if no items
        cartCount.style.display = 'none';
    }
}

document.getElementById("home-logo").addEventListener("click", function (event) {
    if (event.target === event.currentTarget) {
        window.location.href = "index.html"; // Replace with your desired URL
    }
  });

const apiUrl = 'https://custmize.digitalgo.net/api/all_orders';

// Select DOM elements
let ordersSection = document.querySelector('.orders');
let resumeSection = document.querySelector('.resume'); // Container where item details will be displayed
let currentExpandedItem = null; // Variable to track the currently expanded item
const token = localStorage.getItem('accessToken');

// Fetch data from API
fetch(apiUrl, {
    headers: {
        'Authorization': `Bearer ${token}`
    }
})
    .then(response => response.json())
    .then(data => {
        console.log('data is ', data);
        if (data.success) {
            const orders = data.data || [];
            populateOrders(orders);
        } else {
            displayNoOrdersMessage();
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        displayNoOrdersMessage();
    });

function displayNoOrdersMessage() {
    const noOrdersMessage = document.createElement('p');
    noOrdersMessage.classList.add('empty');
    noOrdersMessage.textContent = 'لا توجد طلبات حتى الآن';
    ordersSection.appendChild(noOrdersMessage);
}

function populateOrders(orders) {
    if (orders.length === 0) {
        displayNoOrdersMessage();
    } else {
        orders.forEach((order, index) => {
            const itemElement = createOrderCard(order, index);
            ordersSection.appendChild(itemElement);
        });
    }
}

function createOrderCard(order, index) {
    if(order.order_status_info.id ===4 ){
        const card = document.createElement('div');
        card.classList.add('order-card');
        card.dataset.index = index;

        const orderCode = order.code || 'N/A';
        const totalAmount = order.total_amount || '0.00';
        const orderStatus = order.order_status || 'N/A';

        card.innerHTML = `
            <div class="order-header">
                <p class="order-code">رمز الطلب: ${orderCode}</p>
                <p class="order-total">الإجمالي: SAR ${totalAmount}</p>
            </div>
            <button class="order-details-btn">عرض التفاصيل</button>
        `;

        card.querySelector('.order-details-btn').addEventListener('click', () => toggleOrderDetails(order, card));

        return card;
    }
}

function toggleOrderDetails(order, card) {
    if (currentExpandedItem && currentExpandedItem !== card) {
        collapseOrderDetails(currentExpandedItem);
    }

    const isExpanded = card.classList.contains('expanded');

    if (isExpanded) {
        collapseOrderDetails(card);
    } else {
        displayOrderDetails(order);
        card.classList.add('expanded');
        currentExpandedItem = card;
    }
}

function collapseOrderDetails(card) {
    resumeSection.innerHTML = '';
    card.classList.remove('expanded');
}

function displayOrderDetails(order) {
    resumeSection.innerHTML = '';
    
    const header = document.createElement('h1');
    header.textContent = 'تفاصيل الطلب';
    resumeSection.appendChild(header);

    const details = document.createElement('div');
    details.classList.add('order-details');

    details.innerHTML = `
        ${order.order_detiles
            .map((detail) => `
            <p><strong>رمز الطلب:</strong> ${order.code}</p>
            <p><strong>الاسم:</strong> ${order.name || 'N/A'}</p>
            <p><strong>الإيميل:</strong> ${order.email || 'N/A'}</p>
            <p><strong>الإجمالي:</strong> SAR ${order.total_amount || '0.00'}</p>
            <p><strong>الحالة:</strong> ${order.order_status || 'N/A'}</p>
            <p><strong>اسم المنتج:</strong> ${detail.product.title || 'N/A'}</p>
            <p><strong>الكمية:</strong> ${detail.quantity || 'N/A'}</p>
            <p><strong>السعر:</strong> SAR ${detail.full_price || '0.00'}</p>
            <p><strong>المقاس:</strong> ${detail.size.size_name || 'N/A'}</p>
            <p><strong>اللون:</strong> ${detail.color.name || 'N/A'}</p>
            `).join('')}
    `;

    resumeSection.appendChild(details);
    const progressContainer = document.createElement('div');
    progressContainer.classList.add('main');

    progressContainer.innerHTML = `
        <ul>
            <li>
                <i class="icon uil uil-capture"></i>
                <div class="progress one"><p>1</p><i class="uil uil-check"></i></div>
                <p class="text"> معالجة الطلب</p>
            </li>
            <li>
                <i class="icon uil uil-clipboard-notes"></i>
                <div class="progress two"><p>2</p><i class="uil uil-check"></i></div>
                <p class="text">تجهيز الطلب</p>
            </li>
            <li>
                <i class="icon uil uil-exchange"></i>
                <div class="progress three"><p>3</p><i class="uil uil-check"></i></div>
                <p class="text"> شحن الطلب</p>
            </li>
            <li>
                <i class="icon uil uil-map-marker"></i>
                <div class="progress four"><p>4</p><i class="uil uil-check"></i></div>
                <p class="text"> تم التسليم</p>
            </li>
        </ul>
    `;

    resumeSection.appendChild(progressContainer);
    highlightCurrentStatus(progressContainer, order.order_status_info.id);
}

function highlightCurrentStatus(progressContainer, statusId) {
    const steps = progressContainer.querySelectorAll('.progress');
    steps.forEach((step, index) => {
        if (index < statusId) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

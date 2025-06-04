window.addEventListener('DOMContentLoaded', (event) => {
    console.log('ther is no username ')
    const loginLink = document.getElementById('loginLink');
    
    const userName = localStorage.getItem('userName');
    
    if (userName) {
        // If userName exists in localStorage, update the link to show the user's name
        loginLink.innerHTML = `<i class="fa-solid fa-user"></i> مرحبًا, ${userName}`;
        loginLink.setAttribute('href', 'Profile.html'); // Prevent navigation to login page
        
  
    }else{
        console.log('ther is no username ')
    }
  });
document.getElementById("home-logo").addEventListener("click", function (event) {
    if (event.target === event.currentTarget) {
        window.location.href = "index.html";
    }
});

const code = localStorage.getItem('TrackerCode');
const apiUrl = `https://custmize.digitalgo.net/api/track_order?code=${code}`;

// Select DOM elements
const ordersSection = document.querySelector('.orders');
const resumeSection = document.querySelector('.resume');
let currentExpandedItem = null;

// Fetch data from API
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            populateOrders(data.data.order_detiles || [], data.data);
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

function populateOrders(orders, orderSummary) {
    if (orders.length === 0) {
        displayNoOrdersMessage();
    } else {
        orders.forEach((order, index) => {
            if (order) {
                const itemElement = createCartItem(order, index, orderSummary);
                ordersSection.appendChild(itemElement);
            }
        });
    }
}

function createCartItem(order, index, orderSummary) {
    const item = document.createElement('div');
    item.classList.add('item');
    item.dataset.index = index;

    const productNameElement = document.createElement('p');
    productNameElement.textContent = ` الطلب: ${order.product?.title || 'Product'}`;

    const priceElement = document.createElement('p');
    priceElement.textContent = ` SAR ${order.full_price || 0} : الثمن `;

    item.appendChild(priceElement);
    item.appendChild(productNameElement);

    item.addEventListener('click', () => toggleOrderDetails(order, item, orderSummary));

    return item;
}

function toggleOrderDetails(order, item, orderSummary) {
    if (currentExpandedItem && currentExpandedItem !== item) {
        collapseOrderDetails(currentExpandedItem);
    }

    const isExpanded = item.classList.contains('expanded');
    if (isExpanded) {
        collapseOrderDetails(item);
    } else {
        displayOrderDetails(order, orderSummary);
        item.classList.add('expanded');
        currentExpandedItem = item;
    }
}

function collapseOrderDetails(item) {
    resumeSection.innerHTML = '';
    item.classList.remove('expanded');
}

function displayOrderDetails(order, orderSummary) {
    resumeSection.innerHTML = '';

    const header = document.createElement('h1');
    header.textContent = 'طلبك قيد الإنجاز';
    resumeSection.appendChild(header);

    const details = document.createElement('div');
    details.classList.add('order-details');

    const shippingInfo = orderSummary.shipping_info || { address: 'N/A', city: 'N/A', country: 'N/A' };

    details.innerHTML = `
        <p><strong>اسم المنتج:</strong> ${order.product?.title || 'N/A'}</p>
        <p>SAR ${order.price_without_size_color || 0} <strong>: سعر القطعة</strong></p>
        <h3>تفاصيل الطلب</h3>
        <p><strong>الكمية:</strong> ${order.quantity || 1}</p>
        <p>${order.size?.size_name || 'N/A'} :<strong>المقاس</strong></p>
        <p>${order.color?.name || 'N/A'} :<strong>اللون</strong></p>
        <p>SAR ${(order.full_price || 0)} : السعر الإجمالي</p>
        <p><strong>العنوان:</strong> ${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.country}</p>
        <p><strong>حالة الطلب:</strong> ${orderSummary.order_status || 'N/A'}</p>
    `;

    resumeSection.appendChild(details);

    const progressContainer = document.createElement('div');
    progressContainer.classList.add('main');

    progressContainer.innerHTML = `
        <ul>
            <li><i class="icon uil uil-capture"></i><div class="progress one"><p>1</p><i class="uil uil-check"></i></div><p class="text"> معالجة الطلب</p></li>
            <li><i class="icon uil uil-clipboard-notes"></i><div class="progress two"><p>2</p><i class="uil uil-check"></i></div><p class="text">تجهيز الطلب</p></li>
            <li><i class="icon uil uil-exchange"></i><div class="progress three"><p>3</p><i class="uil uil-check"></i></div><p class="text"> شحن الطلب</p></li>
            <li><i class="icon uil uil-map-marker"></i><div class="progress four"><p>4</p><i class="uil uil-check"></i></div><p class="text"> تم التسليم</p></li>
        </ul>
    `;

    resumeSection.appendChild(progressContainer);

    highlightCurrentStatus(progressContainer, orderSummary.order_status_info.id);
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


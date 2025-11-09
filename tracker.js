/* document.getElementById("home-logo").addEventListener("click", function (event) {
    if (event.target === event.currentTarget) {
        window.location.href = "index.html";
    }
});

const code = localStorage.getItem('TrackerCode');
const apiUrl = `https://custmize.digitalgo.net/api/track_order?code=${code}`;

const ordersSection = document.querySelector('.orders');
let status;
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const groupedOrders = groupOrders(data.data.order_detiles,data.data);
            
            populateOrders(groupedOrders);
        } else {
            displayNoOrdersMessage();
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        displayNoOrdersMessage();
    });

function displayNoOrdersMessage() {
    if (!ordersSection.querySelector('.empty')) {
        const noOrdersMessage = document.createElement('p');
        noOrdersMessage.classList.add('empty');
        noOrdersMessage.textContent = 'لا توجد طلبات حتى الآن';
        ordersSection.appendChild(noOrdersMessage);
    }
}

function groupOrders(orderDetails,data) {
    const groupedOrders = [];
    
    orderDetails.forEach(item => {
        // Check if order_status_info exists before using it
        const orderStatus = data.order_status || 'Unknown Status';

        // Check if the order already exists in groupedOrders
        const existingOrder = groupedOrders.find(order => order.id === item.id);

        if (existingOrder) {
            // Add item to the existing order
            existingOrder.items.push(item);
        } else {
            // Create a new order entry
            groupedOrders.push({
                id: item.id,
                status: orderStatus,
                totalAmount: item.full_price,
                items: [item]
            });
        }
    });

    return groupedOrders;
}

function populateOrders(groupedOrders) {
    if (!groupedOrders || groupedOrders.length === 0) {
        displayNoOrdersMessage();
        return;
    }

    groupedOrders.forEach(order => {
        const orderElement = createOrderCard(order);
        ordersSection.appendChild(orderElement);
    });
}

function createOrderCard(order) {
    const orderContainer = document.createElement('div');
    orderContainer.classList.add('order-card');

    // Order Header
    const orderHeader = document.createElement('div');
    orderHeader.classList.add('order-header');

    const orderNumber = document.createElement('span');
    orderNumber.classList.add('order-number');
    orderNumber.textContent = `#${order.id}`;

    const orderStatus = document.createElement('span');
    orderStatus.classList.add('order-status');
    orderStatus.textContent = order.status;

    orderHeader.appendChild(orderNumber);
    orderHeader.appendChild(orderStatus);

    // Total Price
    const orderInfo = document.createElement('div');
    orderInfo.classList.add('order-info');

    const totalPrice = document.createElement('span');
    totalPrice.classList.add('total-price');
    totalPrice.textContent = `SAR ${order.totalAmount || '0.00'}`;

    orderInfo.appendChild(totalPrice);

    orderContainer.appendChild(orderHeader);
    orderContainer.appendChild(orderInfo);

    // Ordered Items (Individual Containers)
    order.items.forEach(item => {
        const itemContainer = document.createElement('div');
        itemContainer.classList.add('order-item');

        const itemImage = document.createElement('img');
        itemImage.src = item.front_image;
        itemImage.classList.add("item-image");

        const itemName = document.createElement('span');
        itemName.textContent = item.product.title;
        itemName.classList.add("item-name");

        const itemQuantity = document.createElement('span');
        itemQuantity.textContent = `Quantity: ${item.quantity}`;
        itemQuantity.classList.add("item-quantity");

        itemContainer.appendChild(itemImage);
        itemContainer.appendChild(itemName);
        itemContainer.appendChild(itemQuantity);
        orderContainer.appendChild(itemContainer);
    });

    return orderContainer;
}
 */


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
            const groupedOrders = groupOrders(data.data.order_detiles, data.data);
            populateOrders(groupedOrders);
        } else {
            displayNoOrdersMessage();
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        displayNoOrdersMessage();
    });

function displayNoOrdersMessage() {
    if (!ordersSection.querySelector('.empty')) {
        const noOrdersMessage = document.createElement('p');
        noOrdersMessage.classList.add('empty');
        noOrdersMessage.textContent = 'لا توجد طلبات حتى الآن';
        ordersSection.appendChild(noOrdersMessage);
    }
}

function groupOrders(orderDetails, data) {
    const groupedOrders = [];
    
    orderDetails.forEach(item => {
        const orderStatus = data.order_status || 'Unknown Status';

        const existingOrder = groupedOrders.find(order => order.id === item.id);
        if (existingOrder) {
            existingOrder.items.push(item);
        } else {
            groupedOrders.push({
                id: item.id,
                status: orderStatus,
                totalAmount: item.full_price,
                items: [item]
            });
        }
    });

    return groupedOrders;
}

function populateOrders(groupedOrders) {
    if (!groupedOrders || groupedOrders.length === 0) {
        displayNoOrdersMessage();
        return;
    }

    groupedOrders.forEach(order => {
        const orderElement = createOrderCard(order);
        ordersSection.appendChild(orderElement);
    });
}

function createOrderCard(order) {
    const orderContainer = document.createElement('div');
    orderContainer.classList.add('order-card');

    // Order Header
    const orderHeader = document.createElement('div');
    orderHeader.classList.add('order-header');

    const orderNumber = document.createElement('span');
    orderNumber.classList.add('order-number');
    orderNumber.textContent = `#${order.id}`;

    const orderStatus = document.createElement('span');
    orderStatus.classList.add('order-status');
    orderStatus.textContent = order.status;

    orderHeader.appendChild(orderNumber);
    orderHeader.appendChild(orderStatus);

    // Total Price
    const orderInfo = document.createElement('div');
    orderInfo.classList.add('order-info');

    const totalPrice = document.createElement('span');
    totalPrice.classList.add('total-price');
    totalPrice.textContent = `SAR ${order.totalAmount || '0.00'}`;

    orderInfo.appendChild(totalPrice);

    orderContainer.appendChild(orderHeader);
    orderContainer.appendChild(orderInfo);

    // Ordered Items (Individual Containers)
    order.items.forEach(item => {
        const itemContainer = document.createElement('div');
        itemContainer.classList.add('order-item');

        const itemImage = document.createElement('img');
        itemImage.src = item.front_image;
        itemImage.classList.add("item-image");

        const itemName = document.createElement('span');
        itemName.textContent = item.product.title;
        itemName.classList.add("item-name");

        const itemQuantity = document.createElement('span');
        itemQuantity.textContent = `Quantity: ${item.quantity}`;
        itemQuantity.classList.add("item-quantity");

        itemContainer.appendChild(itemImage);
        itemContainer.appendChild(itemName);
        itemContainer.appendChild(itemQuantity);
        orderContainer.appendChild(itemContainer);
    });

    // Click event to toggle order details
    orderContainer.addEventListener('click', () => toggleOrderDetails(order, orderContainer));

    return orderContainer;
}

function toggleOrderDetails(order, item) {
    if (currentExpandedItem && currentExpandedItem !== item) {
        collapseOrderDetails(currentExpandedItem);
    }

    const isExpanded = item.classList.contains('expanded');
    if (isExpanded) {
        collapseOrderDetails(item);
    } else {
        displayOrderDetails(order);
        item.classList.add('expanded');
        currentExpandedItem = item;
    }
}

function collapseOrderDetails(item) {
    resumeSection.innerHTML = '';
    item.classList.remove('expanded');
}

function displayOrderDetails(order) {
    resumeSection.innerHTML = '';

    const header = document.createElement('h1');
    header.textContent = 'طلبك قيد الإنجاز';
    resumeSection.appendChild(header);

    const details = document.createElement('div');
    details.classList.add('order-details');

    const shippingInfo = order.items[0]?.shipping_info || { address: 'N/A', city: 'N/A', country: 'N/A' };

    details.innerHTML = `
        <p><strong>اسم المنتج:</strong> ${order.items[0]?.product?.title || 'N/A'}</p>
        <p>SAR ${order.items[0]?.price_without_size_color || 0} <strong>: سعر القطعة</strong></p>
        <h3>تفاصيل الطلب</h3>
        <p><strong>الكمية:</strong> ${order.items[0]?.quantity || 1}</p>
        <p>${order.items[0]?.size?.size_name || 'N/A'} :<strong>المقاس</strong></p>
        <p>${order.items[0]?.color?.name || 'N/A'} :<strong>اللون</strong></p>
        <p>SAR ${(order.totalAmount || 0)} : السعر الإجمالي</p>
        <p><strong>العنوان:</strong> ${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.country}</p>
        <p><strong>حالة الطلب:</strong> ${order.status || 'N/A'}</p>
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

    highlightCurrentStatus(progressContainer, order.items[0]?.order_status_info?.id || 0);
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

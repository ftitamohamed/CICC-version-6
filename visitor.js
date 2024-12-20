document.getElementById("home-logo").addEventListener("click", function (event) {
    if (event.target === event.currentTarget) {
        window.location.href = "index.html"; // Replace with your desired URL
    }
  });
const code = localStorage.getItem('TrackerCode');
const apiUrl = `https://custmize.digitalgo.net/api/track_order?code=${code}`;

// Select DOM elements
let ordersSection = document.querySelector('.orders');
let resumeSection = document.querySelector('.resume'); // Container where item details will be displayed
let currentExpandedItem = null; // Variable to track the currently expanded item

// Fetch data from API
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const orders = data.data.order_detiles || [];
            populateOrders(orders, data.data);
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
        // Loop through the orders and create cart items
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

    const productName = order.product.title || 'Product';
    const quantity = order.quantity || 1;
    const price = order.full_price || 0;

    // Create the content for the cart item
    const productNameElement = document.createElement('p');
    productNameElement.textContent = ` الطلب: ${productName}`;

    const priceElement = document.createElement('p');
    priceElement.textContent = ` SAR ${price}  : الثمن `;

    // Append product name and price to the item div
    item.appendChild(priceElement);
    item.appendChild(productNameElement);

    // Add click event to display the item details in the resume section
    item.addEventListener('click', () => toggleOrderDetails(order, item, orderSummary));

    return item;
}

function toggleOrderDetails(order, item, orderSummary) {
    // If another item is expanded, collapse it
    if (currentExpandedItem && currentExpandedItem !== item) {
        collapseOrderDetails(currentExpandedItem);
    }

    // Toggle the expanded state for the clicked item
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
    // Clear the resume section
    resumeSection.innerHTML = '';
    item.classList.remove('expanded');
}

function displayOrderDetails(order, orderSummary) {
    // Clear previous content in the resume section
    resumeSection.innerHTML = '';

    // Order Details Header
    const header = document.createElement('h1');
    header.textContent = 'طلبك قيد الإنجاز';
    resumeSection.appendChild(header);

    // Order information
    const details = document.createElement('div');
    details.classList.add('order-details');

    details.innerHTML = `
        <p><strong>اسم المنتج:</strong> ${order.product.title || 'N/A'}</p>
        <p>SAR ${order.price_without_size_color || 0} <strong>: سعر القطعة</strong></p>
        <h3>تفاصيل الطلب</h3>
        <p><strong>الكمية:</strong> ${order.quantity || 1}</p>
        <p>${order.size.size_name || 'N/A'} :<strong>المقاس</strong></p>
        <p>${order.color.name || 'N/A'} :<strong>اللون</strong></p>
        <p>SAR ${(order.full_price || 0)} : السعر الإجمالي</p>
        <p><strong>العنوان:</strong> ${orderSummary.shipping_info.address}, ${orderSummary.shipping_info.city}, ${orderSummary.shipping_info.country}</p>
        <p><strong>حالة الطلب:</strong> ${orderSummary.order_status}</p>
    `;

    // Append order details to the resume section
    resumeSection.appendChild(details);

    // Progress Section (Animated Step Progress Bar)
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

    // Append the progress bar to the resume section
    resumeSection.appendChild(progressContainer);
}

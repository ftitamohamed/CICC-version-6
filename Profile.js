import { saveCartToIndexedDB, getCartFromIndexedDB,clearIndexedDB } from "./indexedDBHelper.js";
getUserProfile();
document.getElementById("home-logo").addEventListener("click", function (event) {
    if (event.target === event.currentTarget) {
        window.location.href = "index.html"; // Replace with your desired URL
    }
  });
let offer = document.querySelector('.offer');
let tracker = document.querySelector('.tracker');
let trackerCommand = document.querySelector('.tracker-command');
let form =  document.querySelector('form');
let profile = document.querySelector('a.profile');
console.log(offer,form,profile);
profile.addEventListener('click',()=>{
    offer.style.display='flex';
    form.style.display='flex';
    tracker.style.display='none';

})
trackerCommand.addEventListener('click',()=>{
    offer.style.display='none';
    form.style.display='none';
    tracker.style.display='flex';

})

window.addEventListener('DOMContentLoaded', (event) => {
    const logoutLink = document.getElementById('logoutLink');
    
    logoutLink.addEventListener('click', (event) => {
        // Prevent the default anchor link behavior
        event.preventDefault();
        
        // Clear the localStorage
        localStorage.clear();
        clearIndexedDB()
        // Redirect to the home page
        window.location.href = 'index.html';  // Update the URL based on your home page
    });
});

window.addEventListener('DOMContentLoaded', (event) => {
    const loginLink = document.getElementById('loginLink');
    
    const userName = localStorage.getItem('userName');
    
    if (userName) {
        // If userName exists in localStorage, update the link to show the user's name
        loginLink.innerHTML = `<i class="fa-solid fa-user"></i> Hello, ${userName}`;
        loginLink.setAttribute('href', 'Profile.html'); // Prevent navigation to login page
        
  
    }
  });
/*   logoButton.addEventListener("click", () => {
    window.location.href = "index.html"; // Replace with your desired URL
}); */


const apiUrl = 'https://custmize.digitalgo.net/api/all_orders';

// Select DOM elements
let ordersSection = document.querySelector('.orders');
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
    const orderContainer = document.createElement('div');
    orderContainer.classList.add('order-card');
    orderContainer.dataset.index = index;

    // Order Header
    const orderHeader = document.createElement('div');
    orderHeader.classList.add('order-header');

    const orderNumber = document.createElement('span');
    orderNumber.classList.add('order-number');
    orderNumber.textContent = `#${order.code || 'N/A'}`;

    const orderStatus = document.createElement('span');
    orderStatus.classList.add('order-status');
    orderStatus.textContent = order.order_status || 'N/A';

    orderHeader.appendChild(orderNumber);
    orderHeader.appendChild(orderStatus);

    // Total Price
    const orderInfo = document.createElement('div');
    orderInfo.classList.add('order-info');

    const totalPrice = document.createElement('span');
    totalPrice.classList.add('total-price');
    totalPrice.textContent = `SAR ${order.total_amount || '0.00'}`;

    orderInfo.appendChild(totalPrice);
    orderContainer.appendChild(orderHeader);
    orderContainer.appendChild(orderInfo);

    // Ordered Items (Individual Containers)
    order.order_detiles.forEach(item => {
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

    // Click event to toggle order details **below the order card**
    orderContainer.addEventListener('click', () => toggleOrderDetails(order, orderContainer));

    return orderContainer;
}

function toggleOrderDetails(order, card) {
    let existingDetails = card.nextElementSibling;

    // If already expanded, remove it
    if (existingDetails && existingDetails.classList.contains('order-details-container')) {
        existingDetails.remove();
        return;
    }

    // Otherwise, insert new details below the order card
    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('order-details-container');

    const details = document.createElement('div');
    details.classList.add('order-details');

    details.innerHTML = `
        <h2>تفاصيل الطلب</h2>
        <p><strong>رمز الطلب:</strong> ${order.code}</p>
        <p><strong>الاسم:</strong> ${order.name || 'N/A'}</p>
        <p><strong>الإيميل:</strong> ${order.email || 'N/A'}</p>
        <p><strong>الإجمالي:</strong> SAR ${order.total_amount || '0.00'}</p>
        <p><strong>الحالة:</strong> ${order.order_status || 'N/A'}</p>
        ${order.order_detiles.map(detail => `
            <p><strong>اسم المنتج:</strong> ${detail.product.title || 'N/A'}</p>
            <p><strong>الكمية:</strong> ${detail.quantity || 'N/A'}</p>
            <p><strong>السعر:</strong> SAR ${detail.full_price || '0.00'}</p>
            <p><strong>المقاس:</strong> ${detail.size?.size_name || 'N/A'}</p>
            <p><strong>اللون:</strong> ${detail.color?.name || 'N/A'}</p>
        `).join('')}
    `;

    detailsContainer.appendChild(details);

    // Progress Bar (Order Status)
    const progressContainer = document.createElement('div');
    progressContainer.classList.add('progress-tracker');

 
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


highlightCurrentStatus(progressContainer, order.order_status_info.id);
    detailsContainer.appendChild(progressContainer);

    // Insert details **just after the order card**
    card.after(detailsContainer);
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
async function getUserProfile() {
    const token = localStorage.getItem('accessToken');

    try {
        const response = await fetch('https://custmize.digitalgo.net/api/myprofile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log(data);

        // Check if otp is null, then hide the OTP button
        if (data.success && data.data.otp !== null) {
            document.querySelector('.otpButton').style.display = 'block';
        }

    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}





window.addEventListener('DOMContentLoaded', (event) => {
    const loginLink = document.getElementById('loginLink');
    
    const userName = localStorage.getItem('userName');
    
    if (userName) {
        // If userName exists in localStorage, update the link to show the user's name
        loginLink.innerHTML = `<i class="fa-solid fa-user"></i> Hello, ${userName}`;
        loginLink.setAttribute('href', 'Profile.html'); // Prevent navigation to login page
        
  
    }
  });
// Select all progress elements
// Select all progress circles, icons, and text
const steps = document.querySelectorAll("ul li");

// Loop through all steps and add click event listeners
steps.forEach((step, index) => {
    step.addEventListener("click", () => {
        // Remove 'active' class from all steps
        steps.forEach((s) => {
            s.querySelector(".progress").classList.remove("active");
            s.querySelector(".icon").classList.remove("active");
            s.querySelector(".text").classList.remove("active");
        });

        // Add 'active' class to the clicked step
        step.querySelector(".progress").classList.add("active");
        step.querySelector(".icon").classList.add("active");
        step.querySelector(".text").classList.add("active");
    });
});

import { saveCartToIndexedDB, getCartFromIndexedDB, clearIndexedDB } from "./indexedDBHelper.js";

// ============== INITIALIZATION ==============
document.addEventListener('DOMContentLoaded', init);

function init() {
    // Initialize all components
    getUserProfile();
    setupEventListeners();
    updateCartCount();
    loadOrders();
    setupGlobalProgressTracker();
}
let showButton = document.getElementById('showAside');
showButton.addEventListener('click',()=>{

    showButton.innerText = 'PPPPPP'
    document.querySelector(' main aside').classList.toggle('hide');
    console.log(document.querySelector(' main aside'));
    showButton.classList.toggle('moveRight');
    console.log(showButton.innerText);
    showButton.innerText = '>';
    showButton.classList.remove('rotate-class');
});
// ============== EVENT LISTENERS ==============
function setupEventListeners() {
    // Home logo click
    const homeLogo = document.getElementById("home-logo");
    if (homeLogo) {
        homeLogo.addEventListener("click", function (event) {
            if (event.target === event.currentTarget) {
                window.location.href = "index.html";
            }
        });
    }

    // Profile click
    const profile = document.querySelector('a.profile');
    const offer = document.querySelector('.offer');
    const form = document.querySelector('form');
    const tracker = document.querySelector('.tracker');
    const breadCrumb = document.getElementById('breadcrumb');
    
    if (profile && offer && form && tracker && breadCrumb) {
        profile.addEventListener('click', (e) => {
            e.preventDefault();
            offer.style.display = 'none';
            form.style.display = 'flex';
            tracker.style.display = 'none';
            breadCrumb.style.display = 'flex';
        });
    }

    // Tracker command click
    const trackerCommand = document.querySelector('.tracker-command');
    if (trackerCommand && offer && form && tracker && breadCrumb) {
        trackerCommand.addEventListener('click', (e) => {
            e.preventDefault();
            offer.style.display = 'none';
            form.style.display = 'none';
            tracker.style.display = 'flex';
            breadCrumb.style.display = 'none';
        });
    }

    // Logout
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', handleLogout);
    }

    // Login/User link
    const loginLink = document.getElementById('loginLink');
    if (loginLink) {
        updateUserLink(loginLink);
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('orderModal');
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// ============== MODAL MANAGEMENT ==============
function createModal() {
    // Check if modal already exists
    let modal = document.getElementById('orderModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'orderModal';
        modal.classList.add('order-modal');
        
        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');
        
        const closeButton = document.createElement('button');
        closeButton.classList.add('modal-close');
        closeButton.innerHTML = '&times;';
        closeButton.onclick = closeModal;
        
        const modalBody = document.createElement('div');
        modalBody.classList.add('modal-body');
        
        modalContent.appendChild(closeButton);
        modalContent.appendChild(modalBody);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }
    return modal;
}

function openModal(order) {
    const modal = createModal();
    const modalBody = document.querySelector('.modal-body');
    
    // Generate modal content
    modalBody.innerHTML = createModalContent(order);
    
    // Show modal with animation
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeModal() {
    const modal = document.getElementById('orderModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

function createModalContent(order) {
    return `
        <div class="modal-header-custom">
            <h2>Order Details #${order.code || 'N/A'}</h2>
            <span class="modal-status ${getStatusClass(order.order_status_info?.id)}">
                ${getStatusText(order.order_status || 'N/A', order.order_status_info?.id)}
            </span>
        </div>
        
        <div class="modal-section">
            <h3><i class="fas fa-user"></i> Customer Information</h3>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Name</span>
                    <span class="info-value">${order.name || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Email</span>
                    <span class="info-value">${order.email || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Order Number</span>
                    <span class="info-value">#${order.code || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Order Date</span>
                    <span class="info-value">${formatDate(order.created_at)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Total Amount</span>
                    <span class="info-value total-value">${formatCurrency(order.total_amount)}</span>
                </div>
            </div>
        </div>

        <div class="modal-section">
            <h3><i class="fas fa-box"></i> Products</h3>
            <div class="products-list">
                ${order.order_detiles.map(item => `
                    <div class="product-item">
                        <img src="${item.front_image || '/api/placeholder/80/80'}" 
                             alt="${item.product.title}"
                             onerror="this.src='/api/placeholder/80/80'">
                        <div class="product-details">
                            <div class="product-title">${item.product.title}</div>
                            <div class="product-specs">
                                <span><i class="fas fa-hashtag"></i> Qty: ${item.quantity}</span>
                                <span><i class="fas fa-ruler"></i> Size: ${item.size?.size_name || 'N/A'}</span>
                                <span><i class="fas fa-palette"></i> Color: ${item.color?.name || 'N/A'}</span>
                                <span><i class="fas fa-tag"></i> Price: ${formatCurrency(item.full_price)}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="modal-section">
            <h3><i class="fas fa-truck"></i> Order Status</h3>
            ${createModalProgressTracker(order.order_status_info?.id || 1)}
        </div>
    `;
}

function getStatusText(status, statusId) {
    const statusMap = {
        1: 'Processing',
        2: 'Preparing',
        3: 'Shipping',
        4: 'Delivered'
    };
    return statusMap[statusId] || status;
}

function getStatusClass(statusId) {
    const classes = {
        1: 'status-processing',
        2: 'status-preparing',
        3: 'status-shipping',
        4: 'status-delivered'
    };
    return classes[statusId] || 'status-default';
}

function createModalProgressTracker(currentStep) {
    const steps = [
        'Order Received',
        'Processing',
        'Shipping',
        'Delivered'
    ];
    
    let html = `
        <div class="modal-progress">
            <div class="progress-steps">
    `;
    
    steps.forEach((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;
        
        html += `
            <div class="step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}">
                <div class="step-icon">
                    ${getStepIcon(stepNumber)}
                </div>
                <span class="step-label">${step}</span>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    return html;
}

function getStepIcon(stepNumber) {
    const icons = {
        1: '<i class="fas fa-clipboard-check"></i>',
        2: '<i class="fas fa-cogs"></i>',
        3: '<i class="fas fa-truck"></i>',
        4: '<i class="fas fa-check-circle"></i>'
    };
    return icons[stepNumber] || '<i class="fas fa-circle"></i>';
}

// ============== ORDERS MANAGEMENT ==============
const API_URL = 'https://dashboard.caduksa.com/api/all_orders';

function loadOrders() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        displayNoOrdersMessage();
        return;
    }

    fetch(API_URL, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
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
}

function populateOrders(orders) {
    const ordersSection = document.querySelector('.orders');
    if (!ordersSection) return;
    
    ordersSection.innerHTML = '';
    
    if (orders.length === 0) {
        displayNoOrdersMessage();
        return;
    }
    
    const ordersGrid = document.createElement('div');
    ordersGrid.classList.add('orders-grid');
    
    orders.forEach((order, index) => {
        const orderCard = createOrderCard(order, index);
        ordersGrid.appendChild(orderCard);
    });
    
    ordersSection.appendChild(ordersGrid);
}

function createOrderCard(order, index) {
    const card = document.createElement('div');
    card.classList.add('order-card');
    card.dataset.index = index;

    // Header
    const header = createCardHeader(order);
    
    // Body
    const body = createCardBody(order);
    
    // View Details Button
    const viewDetailsBtn = document.createElement('button');
    viewDetailsBtn.classList.add('view-details-btn');
    viewDetailsBtn.innerHTML = '<i class="fas fa-eye"></i> View Details';
    viewDetailsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal(order);
    });
    
    body.appendChild(viewDetailsBtn);

    card.appendChild(header);
    card.appendChild(body);

    return card;
}

function createCardHeader(order) {
    const header = document.createElement('div');
    header.classList.add('order-header');

    const orderNumber = document.createElement('span');
    orderNumber.classList.add('order-number');
    orderNumber.textContent = `#${order.code || 'N/A'}`;

    const orderStatus = document.createElement('span');
    orderStatus.classList.add('order-status');
    orderStatus.textContent = getStatusText(order.order_status || 'N/A', order.order_status_info?.id);
    
    setStatusColor(orderStatus, order.order_status_info?.id);

    header.appendChild(orderNumber);
    header.appendChild(orderStatus);

    return header;
}

function createCardBody(order) {
    const body = document.createElement('div');
    body.classList.add('order-body');

    // Total section
    const totalSection = document.createElement('div');
    totalSection.classList.add('total-section');

    const totalLabel = document.createElement('span');
    totalLabel.classList.add('total-label');
    totalLabel.textContent = 'Total Order';

    const totalPrice = document.createElement('span');
    totalPrice.classList.add('total-price');
    totalPrice.textContent = formatCurrency(order.total_amount);

    totalSection.appendChild(totalLabel);
    totalSection.appendChild(totalPrice);

    // Items preview
    const itemsPreview = createItemsPreview(order.order_detiles);

    body.appendChild(totalSection);
    body.appendChild(itemsPreview);

    return body;
}

function createItemsPreview(orderDetails) {
    const preview = document.createElement('div');
    preview.classList.add('items-preview');

    const thumbnailsContainer = document.createElement('div');
    thumbnailsContainer.classList.add('item-thumbnails');

    // Show first 3 items
    orderDetails.slice(0, 3).forEach((item) => {
        const thumb = document.createElement('img');
        thumb.src = item.front_image || '/api/placeholder/40/40';
        thumb.alt = item.product.title;
        thumb.classList.add('thumbnail');
        thumb.onerror = function() {
            this.src = '/api/placeholder/40/40';
        };
        thumbnailsContainer.appendChild(thumb);
    });

    const remainingCount = orderDetails.length - 3;
    if (remainingCount > 0) {
        const moreBadge = document.createElement('div');
        moreBadge.classList.add('more-items-badge');
        moreBadge.textContent = `+${remainingCount}`;
        thumbnailsContainer.appendChild(moreBadge);
    }

    const itemsCount = document.createElement('span');
    itemsCount.classList.add('items-count');
    itemsCount.textContent = `${orderDetails.length} ${orderDetails.length === 1 ? 'item' : 'items'}`;

    preview.appendChild(thumbnailsContainer);
    preview.appendChild(itemsCount);

    return preview;
}

function displayNoOrdersMessage() {
    const ordersSection = document.querySelector('.orders');
    if (!ordersSection) return;
    
    ordersSection.innerHTML = `
        <div class="empty-orders">
            <i class="fas fa-shopping-bag"></i>
            <p>No orders yet</p>
            <a href="wearHouseAllCategories.html" class="shop-now-btn">Shop Now</a>
        </div>
    `;
}

// ============== CART MANAGEMENT ==============
function updateCartCount() {
    const cartData = JSON.parse(localStorage.getItem('cartData1')) || { cart: { orders: [] } };
    const orders = cartData.cart.orders || [];
    const cartCount = document.getElementById('cart-count');
    
    if (!cartCount) return;
    
    if (orders.length > 0) {
        cartCount.style.display = 'flex';
        cartCount.textContent = orders.length;
    } else {
        cartCount.style.display = 'none';
    }
}

// ============== GLOBAL PROGRESS TRACKER ==============
function setupGlobalProgressTracker() {
    const steps = document.querySelectorAll("ul li");
    
    steps.forEach((step, index) => {
        step.addEventListener("click", () => {
            steps.forEach((s) => {
                s.querySelector(".progress")?.classList.remove("active");
                s.querySelector(".icon")?.classList.remove("active");
                s.querySelector(".text")?.classList.remove("active");
            });

            step.querySelector(".progress")?.classList.add("active");
            step.querySelector(".icon")?.classList.add("active");
            step.querySelector(".text")?.classList.add("active");
        });
    });
}

// ============== AUTHENTICATION ==============
async function getUserProfile() {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
        const response = await fetch('https://dashboard.caduksa.com/api/myprofile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        
        if (data.success && data.data.otp !== null) {
            const otpButton = document.querySelector('.otpButton');
            if (otpButton) {
                otpButton.style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}

function handleLogout(event) {
    event.preventDefault();
    localStorage.clear();
    clearIndexedDB();
    window.location.href = 'index.html';
}

function updateUserLink(loginLink) {
    const userName = localStorage.getItem('userName');
    
    if (userName) {
        loginLink.innerHTML = `<i class="fa-solid fa-user"></i> Hello, ${userName}`;
        loginLink.setAttribute('href', 'Profile.html');
    }
}

// ============== UTILITY FUNCTIONS ==============
function setStatusColor(element, statusId) {
    if (!element) return;
    
    const colors = {
        1: '#fff3cd', // Light yellow - Processing
        2: '#d5eee9', // Light cyan - Preparing
        3: '#dccde9', // Light purple - Shipping
        4: '#04cda3'  // Mint green - Delivered
    };
    
    const textColors = {
        1: '#856404',
        2: '#046355',
        3: '#4a2c5f',
        4: 'white'
    };
    
    element.style.backgroundColor = colors[statusId] || '#e6e6e6';
    element.style.color = textColors[statusId] || '#182631';
}

function formatCurrency(amount) {
    if (!amount) return 'SAR 0.00';
    return `SAR ${parseFloat(amount).toFixed(2)}`;
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch {
        return 'N/A';
    }
}

// ============== EXPORT FOR TESTING ==============
export { 
    loadOrders, 
    updateCartCount, 
    formatCurrency, 
    formatDate 
};
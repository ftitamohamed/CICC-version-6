// ============== INITIALIZATION ==============
document.addEventListener('DOMContentLoaded', init);

function init() {
    setupEventListeners();
    loadTrackedOrder();
    updateCartCount();
    verifyProfile();
    setNavLinks();
}

// ============== EVENT LISTENERS ==============
 // Logout
 

 // Login/User link
function setNavLinks(){
    const loginLink = document.getElementById('loginLink');
    const dropDownLoginLink = document.querySelector('.dropDown > a#loginLink');
    
    const userName = localStorage.getItem('userName');
    
    if (userName) {
        // If userName exists in localStorage, update the link to show the user's name
        /* loginLink.innerHTML = `<i class="fa-solid fa-user"></i> Hello, ${userName}`; */
        loginLink.innerHTML = `<a href="Profile.html" id="loginLink" >
        <div class="user">
            <img src="./images/icons8-user-48.png" alt="" >
            <div>
                <span>Hello</span>
                <p>${userName}</p>
            </div>
        </div>
  </a>`;
        loginLink.setAttribute('href', 'Profile.html'); // Prevent navigation to login page
        
        dropDownLoginLink.innerHTML=`<a href="Profile.html" id="loginLink" >
        <div class="user">
            <img src="./images/icons8-user-48.png" alt="" >
            <div>
                <span>Hello</span>
                <p>${userName}</p>
            </div>
        </div>
  </a>`;
  dropDownLoginLink.setAttribute('href', 'Profile.html'); 
    }};
function verifyProfile(){
    const token = localStorage.getItem('accessToken');
    if(token){
        document.getElementById('profile').innerHTML = '  <i class="fa-solid fa-user"></i> Profile';
        document.getElementById('profile').href = 'Profile.html'
    }
}
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

// ============== MODAL MANAGEMENT (EXACT SAME AS ORDERS PAGE) ==============
function createModal() {
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
    
    modalBody.innerHTML = createModalContent(order);
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('orderModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// ============== ORDER TRACKING ==============
function loadTrackedOrder() {
    const code = localStorage.getItem('TrackerCode');
    if (!code) {
        displayNoOrdersMessage();
        return;
    }

    const apiUrl = `https://dashboard.caduksa.com/api/track_order?code=${code}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Tracked order:', data);
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
}

function groupOrders(orderDetails, orderData) {
    const groupedOrders = [];
    
    orderDetails.forEach(item => {
        const orderStatus = orderData.order_status || 'Processing';
        const orderStatusId = orderData.order_status_info?.id || 1;

        groupedOrders.push({
            id: orderData.code || orderData.id,
            code: orderData.code,
            status: orderStatus,
            status_id: orderStatusId,
            total_amount: item.full_price,
            name: orderData.name,
            email: orderData.email,
            created_at: orderData.created_at,
            order_detiles: [item] // Each item as separate order
        });
    });

    return groupedOrders;
}

// ============== EXACT SAME ORDERS GRID AS ORDERS PAGE ==============
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

// ============== EXACT SAME ORDER CARD AS ORDERS PAGE ==============
function createOrderCard(order, index) {
    const card = document.createElement('div');
    card.classList.add('order-card');
    card.dataset.index = index;

    // Header
    const header = createCardHeader(order);
    
    // Body
    const body = createCardBody(order);
    
    // View Details Button (exactly same style)
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
    orderNumber.textContent = `#${order.code || order.id}`;

    const orderStatus = document.createElement('span');
    orderStatus.classList.add('order-status');
    orderStatus.textContent = getStatusText(order.status, order.status_id);
    
    setStatusColor(orderStatus, order.status_id);

    header.appendChild(orderNumber);
    header.appendChild(orderStatus);

    return header;
}

function createCardBody(order) {
    const body = document.createElement('div');
    body.classList.add('order-body');

    const item = order.order_detiles[0];

    // Total section (exactly same)
    const totalSection = document.createElement('div');
    totalSection.classList.add('total-section');

    const totalLabel = document.createElement('span');
    totalLabel.classList.add('total-label');
    totalLabel.textContent = 'Total Amount';

    const totalPrice = document.createElement('span');
    totalPrice.classList.add('total-price');
    totalPrice.textContent = formatCurrency(order.total_amount);

    totalSection.appendChild(totalLabel);
    totalSection.appendChild(totalPrice);

    // Items preview (exactly same as orders page)
    const itemsPreview = document.createElement('div');
    itemsPreview.classList.add('items-preview');

    const thumbnailsContainer = document.createElement('div');
    thumbnailsContainer.classList.add('item-thumbnails');

    // Product thumbnail
    const thumb = document.createElement('img');
    thumb.src = item.front_image || '/api/placeholder/40/40';
    thumb.alt = item.product?.title || 'Product';
    thumb.classList.add('thumbnail');
    thumb.onerror = function() {
        this.src = '/api/placeholder/40/40';
    };
    thumbnailsContainer.appendChild(thumb);

    const itemsCount = document.createElement('span');
    itemsCount.classList.add('items-count');
    itemsCount.textContent = `1 item`;

    itemsPreview.appendChild(thumbnailsContainer);
    itemsPreview.appendChild(itemsCount);

    body.appendChild(totalSection);
    body.appendChild(itemsPreview);

    return body;
}

// ============== EXACT SAME MODAL CONTENT AS ORDERS PAGE ==============
function createModalContent(order) {
    const item = order.order_detiles[0];
    
    return `
        <div class="modal-header-custom">
            <h2>Order Details #${order.code || order.id}</h2>
            <span class="modal-status ${getStatusClass(order.status_id)}">
                ${getStatusText(order.status, order.status_id)}
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
                    <span class="info-value">#${order.code || order.id}</span>
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
                <div class="product-item">
                    <img src="${item.front_image || '/api/placeholder/80/80'}" 
                         alt="${item.product?.title}"
                         onerror="this.src='/api/placeholder/80/80'">
                    <div class="product-details">
                        <div class="product-title">${item.product?.title || 'Product'}</div>
                        <div class="product-specs">
                            <span><i class="fas fa-hashtag"></i> Qty: ${item.quantity || 1}</span>
                            <span><i class="fas fa-ruler"></i> Size: ${item.size?.size_name || 'N/A'}</span>
                            <span><i class="fas fa-palette"></i> Color: ${item.color?.name || 'N/A'}</span>
                            <span><i class="fas fa-tag"></i> Price: ${formatCurrency(item.full_price)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal-section">
            <h3><i class="fas fa-truck"></i> Order Status</h3>
            ${createModalProgressTracker(order.status_id)}
            
            ${item.shipping_info ? `
            <div class="shipping-info" style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--light-primary-color);">
                <h4 style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; color: var(--dark-color);">
                    <i class="fas fa-map-marker-alt" style="color: var(--primary-color);"></i> Shipping Address
                </h4>
                <div style="background: var(--light-primary-color); padding: 1rem; border-radius: 16px;">
                    <p style="margin: 0; color: var(--secondary-color);">
                        ${item.shipping_info.address || ''}, ${item.shipping_info.city || ''}, ${item.shipping_info.country || ''}
                    </p>
                </div>
            </div>
            ` : ''}
        </div>
    `;
}

// ============== EXACT SAME PROGRESS TRACKER AS ORDERS PAGE ==============
function createModalProgressTracker(currentStep) {
    const steps = [
        { icon: 'clipboard-list', label: 'Order Received' },
        { icon: 'box', label: 'Processing' },
        { icon: 'truck', label: 'Shipping' },
        { icon: 'check-circle', label: 'Delivered' }
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
                    <i class="fas fa-${step.icon}"></i>
                </div>
                <span class="step-label">${step.label}</span>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    return html;
}

// ============== CART MANAGEMENT (EXACT SAME) ==============
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

// ============== UTILITY FUNCTIONS (EXACT SAME) ==============
function getStatusText(status, statusId) {
    const statusMap = {
        1: 'Processing',
        2: 'Preparing',
        3: 'Shipping',
        4: 'Delivered'
    };
    return statusMap[statusId] || status || 'Processing';
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

function setStatusColor(element, statusId) {
    if (!element) return;
    
    const colors = {
        1: '#fff3cd',
        2: '#d5eee9',
        3: '#dccde9',
        4: '#04cda3'
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

function displayNoOrdersMessage() {
    const ordersSection = document.querySelector('.orders');
    if (!ordersSection) return;
    
    ordersSection.innerHTML = `
        <div class="empty-orders">
            <i class="fas fa-search"></i>
            <p>No tracking information found</p>
            <a href="track-order.html" class="shop-now-btn">Try Again</a>
        </div>
    `;
}

// ============== EXPORT ==============
export { 
    loadTrackedOrder,
    updateCartCount
};
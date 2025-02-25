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
        
        // Redirect to the home page
        window.location.href = 'index.html';  // Update the URL based on your home page
    });
});

window.addEventListener('DOMContentLoaded', (event) => {
    const loginLink = document.getElementById('loginLink');
    
    const userName = localStorage.getItem('userName');
    
    if (userName) {
        // If userName exists in localStorage, update the link to show the user's name
        loginLink.innerHTML = `<i class="fa-solid fa-user"></i> مرحبًا, ${userName}`;
        loginLink.setAttribute('href', 'Profile.html'); // Prevent navigation to login page
        
  
    }
  });
/*   logoButton.addEventListener("click", () => {
    window.location.href = "index.html"; // Replace with your desired URL
}); */


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
        console.log('data is ',data);
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
        // Loop through the orders and create order items
        orders.forEach((order, index) => {
            const itemElement = createOrderItem(order, index);
            ordersSection.appendChild(itemElement);
        });
    }
}

function createOrderItem(order, index) {
    const item = document.createElement('div');
    item.classList.add('item');
    item.dataset.index = index;

    // Extract necessary details
    const orderCode = order.code || 'N/A';
    const totalAmount = order.total_amount || '0.00';
    const orderStatus = order.order_status || 'N/A';

    // Create the content for the order item
    const orderCodeElement = document.createElement('p');
    orderCodeElement.textContent = `رمز الطلب: ${orderCode}`;

    const totalAmountElement = document.createElement('p');
    totalAmountElement.innerHTML = `:الإجمالي <br/> SAR ${totalAmount} `;

    /* const orderStatusElement = document.createElement('p');
    orderStatusElement.textContent = `حالة الطلب: ${orderStatus}`; */

    // Append details to the item div
    item.appendChild(orderCodeElement);
    item.appendChild(totalAmountElement);
    /* item.appendChild(orderStatusElement); */

    // Add click event to display the item details in the resume section
    item.addEventListener('click', () => toggleOrderDetails(order, item));

    return item;
}

function toggleOrderDetails(order, item) {
    // If another item is expanded, collapse it
    if (currentExpandedItem && currentExpandedItem !== item) {
        collapseOrderDetails(currentExpandedItem);
    }

    // Toggle the expanded state for the clicked item
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
    // Clear the resume section
    resumeSection.innerHTML = '';
    item.classList.remove('expanded');
}

function displayOrderDetails(order) {
    // Clear previous content in the resume section
    resumeSection.innerHTML = '';

    // Order Details Header
    const header = document.createElement('h1');
    header.textContent = 'تفاصيل الطلب';
    resumeSection.appendChild(header);

    // Order information
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

    // Append order details to the resume section
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

    // Append the progress bar to the resume section
    
    resumeSection.appendChild(progressContainer);
    highlightCurrentStatus(progressContainer, order.order_status_info.id);
        }

    // Add the click behavior to the steps
 /*    const steps = ['one', 'two', 'three', 'four', 'five'];
    steps.forEach((step, index) => {
        document.querySelector(`.${step}`).onclick = () => {
            steps.forEach((s, i) => {
                const elem = document.querySelector(`.${s}`);
                if (i <= index) {
                    elem.classList.add('active');
                } else {
                    elem.classList.remove('active');
                }
            });
        };
    }); */


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



let message = JSON.parse(localStorage.getItem('message')) || "";
let email = JSON.parse(localStorage.getItem('email')) || "";

function showOTPDialog(message, email) {
    // Create the OTP popup HTML
    const otpPopupHTML = `
        <div class="otp-popup">
            <span class="close">X</span>
            <div class="otp-popup-content">
                <h2>تم إنشاء الحساب بنجاح</h2>
                <p>${message}</p>
                <p>يرجى إدخال رمز التفعيل المرسل إلى بريدك الإلكتروني.</p>
                <input type="text" id="otp-input" placeholder="أدخل رمز التفعيل" />
                <button id="submit-otp">تأكيد الرمز</button>
                <div id="timer">01:30</div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML("beforeend", otpPopupHTML);

    // Start the countdown timer for OTP
    let timer = 90; // 1 minute 30 seconds
    const timerDiv = document.getElementById("timer");
    const countdown = setInterval(() => {
        const minutes = Math.floor(timer / 60).toString().padStart(2, "0");
        const seconds = (timer % 60).toString().padStart(2, "0");
        timerDiv.textContent = `${minutes}:${seconds}`;
        if (timer === 0) {
            clearInterval(countdown);
            alert("انتهى الوقت! الرجاء المحاولة مرة أخرى.");
            removeOTPPopup();
        }
        timer--;
    }, 1000);

    // Handle closing the popup
    const close = document.querySelector('.close');
    close.addEventListener('click', removeOTPPopup);

    // Handle OTP submission
    document.getElementById("submit-otp").addEventListener("click", async () => {
        const otp = document.getElementById("otp-input").value.trim();
        if (!otp) {
            alert("الرجاء إدخال رمز التفعيل.");
            return;
        }

        try {
            const otpResponse = await fetch("https://custmize.digitalgo.net/api/verify_otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept-Language": "ar",
                },
                body: JSON.stringify({
                    otp,
                    email: email,
                }),
            });
            const otpData = await otpResponse.json();
            console.log('data:',otpData,'response:',otpResponse);
            if (otpData.success) {

                
                console.log('data:',otpData,'response:',otpResponse);
                alert("تم تفعيل الحساب بنجاح!");
                // Hide the button and close the popup
                document.querySelector('.otpButton').style.display = "none";
                removeOTPPopup();
                 // Redirect to homepage or dashboard
            } else {
                /* const otpError = await otpResponse.text(); */
                alert("فشل تأكيد الرمز: " + otpData.message);
            }
        } catch (error) {
            alert("فشل تأكيد الرمز: " );
        }
    });

    // Function to remove the OTP popup
    function removeOTPPopup() {
        const otpPopup = document.querySelector('.otp-popup');
        if (otpPopup) {
            otpPopup.remove();
            clearInterval(countdown); // Stop the timer
        }
    }
}

window.addEventListener('DOMContentLoaded', (event) => {
    const loginLink = document.getElementById('loginLink');
    
    const userName = localStorage.getItem('userName');
    
    if (userName) {
        // If userName exists in localStorage, update the link to show the user's name
        loginLink.innerHTML = `<i class="fa-solid fa-user"></i> مرحبًا, ${userName}`;
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

import { saveCartToIndexedDB, getCartFromIndexedDB,clearIndexedDB } from "./indexedDBHelper.js";
document.addEventListener('DOMContentLoaded', () => {
    const shoppingItemsSection = document.querySelector('.shopping-items');
    const cartTitle = document.querySelector('body > main > div > h1');
    const subtotalElement = document.querySelector('body > main > aside > div:nth-child(5) > span');
    const totalPriceElement = document.querySelector('body > main > aside > div:nth-child(9) > span');
    const payNowButton = document.querySelector('.pay-now');

    const baseTaxRate = 9.6;
    let shippingCost = 0;

    let cartData1 = JSON.parse(localStorage.getItem('cartData1')) || { cart: { orders: [] } };
    let cartData = JSON.parse(localStorage.getItem('cartData')) || { cart: { orders: [] } };
    let material = localStorage.getItem('material') || 'بولستر';
    let material1 = JSON.parse(material);
    console.log(material);
    let orders = cartData1.cart.orders || [];
    let orders1 = cartData.cart.orders || [];
    console.log('the order object is ',orders);
    let checkoutData = {
        cart: {
            orders: [...orders1],
        },
        subtotal: 0,
        total_amount: 0,
        discount: 0,
        promocode: '',
        shipping: 0,
    };

    const updateCartCounter = (count) => {
        if (cartTitle) {
            cartTitle.innerText = `Cart (${count} items)`;
        }
    };

    const updateOrderSummary = () => {
        let subtotal = 0;

        orders.forEach(order => {
            subtotal += order.full_price || 0;
        });

        const total = subtotal + shippingCost + baseTaxRate;

        subtotalElement.textContent = `${subtotal.toFixed(2)} SAR`;
        totalPriceElement.textContent = `${total.toFixed(2)} SAR`;
        payNowButton.textContent = `Pay now (SAR ${total.toFixed(2)})`;

        // Update checkoutData
        checkoutData.cart.orders = [...orders1];
        checkoutData.subtotal = subtotal;
        checkoutData.total_amount = total;
        console.log('Updated checkoutData:', checkoutData);
        localStorage.setItem('CheckoutData', JSON.stringify(checkoutData));
        console.log(JSON.parse(localStorage.getItem('CheckoutData')) );
        console.log(JSON.parse(localStorage.getItem('cartData')) );
         let cartData = JSON.parse(localStorage.getItem('cartData')) || { cart: { orders: [] } };
         
        
    };

    const refreshItems = (updatedOrders) => {
        shoppingItemsSection.innerHTML = '';
        updatedOrders.forEach((order, index) => {
            const itemElement = createCartItem(order, index);
            shoppingItemsSection.appendChild(itemElement);
        });
        updateOrderSummary();
    };


    const handleDeleteItem = (index) => {
        const userConfirmed = confirm('Are you sure you want to delete this item?');
        if (userConfirmed) {
            getCartFromIndexedDB().then((cartDataRequest) => {
                // Ensure cartDataRequest is properly structured
                if (!cartDataRequest || !cartDataRequest.cart) {
                    cartDataRequest = { cart: { orders: [] } };
                }
    
                // Remove the item from the orders array
                const orders = cartDataRequest.cart.orders || [];
    
                // Check if the order exists in the array before removing
                if (index < orders.length) orders.splice(index, 1);
    
                // Update the cart data in IndexedDB with the modified orders array
                const updatedCartData = { cart: { orders } };
    
                // Save the updated cart data back to IndexedDB
                saveCartToIndexedDB(updatedCartData)
                    .then(() => {
                        console.log('Updated cart saved to IndexedDB');
                        // Refresh the cart UI and counter
                        getCartFromIndexedDB().then(cart => console.log(cart));
                    })
                    .catch((error) => {
                        console.error('Error saving updated cart to IndexedDB:', error);
                    });
            }).catch((error) => {
                console.error('Error retrieving cart from IndexedDB:', error);
            });
            // Remove the item from the orders array
            orders.splice(index, 1);
            orders1.splice(index, 1);
            // Update the localStorage
            const updatedCartData = { cart: { orders1 } };
            const updatedCartData1 = { cart: { orders } };
            localStorage.setItem('cartData1', JSON.stringify(updatedCartData1));
            localStorage.setItem('cartData', JSON.stringify(updatedCartData));
            let cartData = JSON.parse(localStorage.getItem('cartData')) || { cart: { orders: [] } };
            console.log('this is cartData: ',cartData);
            // Refresh the cart UI and counter
            refreshItems(orders);
            updateCartCounter(orders.length);
        }
    };



    const createCartItem = (order, index) => {
        const item = document.createElement('div');
        item.classList.add('item');
        const color = order.color || '#fff';
        const size = order.size_id || null;
        const productName = order.product_name || 'Product';
        const quantity = order.quantity || 1;
        const price = order.full_price.toFixed(0) || 0;
        const unitPrice = order.price_without_size_color_price.toFixed(0) || 0;
        console.log('this is order data ',order,color,size);
        item.innerHTML = `
        <img src="${order.front_image}" alt="${productName}">
        <div>
            <div class="quality">
                <h3 style="color:#6929a4; margin:15px 0;">${productName}</h3>
                <div class="caracteristics">
                    <h4>Color</h4>
                    <h4 class="size-label">Size</h4>
                </div>
                <div class="caracteristics">
                    <li>${color}</li>
                    <li class="size-value">${size ?? ""}</li>
                </div>
                <i class="fa-regular fa-trash-can"></i>
                <div class="delivery">
                    <h4>Delivery</h4>
                    <p>4 - 9 October</p>
                </div>
            </div>
            <hr/>
            <div class="quantity">
                <h3>Price per Quantity</h3>
                <div class="quantity-sub">
                    <div class="counter">
                        <span style="color:light-gray; font-weight:600;"> Quantity: ${quantity}</span>
                    </div>
                    <span style="color:light-gray; font-weight:600;"> Unit price: ${unitPrice} SAR </span>
                    <span style="color:light-gray; font-weight:600;" class="price"> Total price: ${price} SAR </span>
                </div>
            </div>
        </div>
    `;
    
    // Remove size elements if size is null/empty
    if (!size) {
        item.querySelector(".size-label")?.remove();
        item.querySelector(".size-value")?.remove();
    }
    
        const trashIcon = item.querySelector('.fa-trash-can');
        trashIcon.addEventListener('click', () => handleDeleteItem(index));
        return item;
    };

    // Initialize cart
    refreshItems(orders);
    updateCartCounter(orders.length);
});
const toggleBtn = document.getElementById("toggleTracker");
const tracker = document.querySelector(".trackerDropDown");

toggleBtn.addEventListener("click", () => {
  tracker.classList.toggle("show");
});
document.querySelector('.trackerDropDown > div:nth-child(1) > img:nth-child(2)').addEventListener('click', function () {
    const wantedProduct = document.querySelector('.trackerDropDown > div:nth-child(1) > input:nth-child(1)').value;
    if (wantedProduct) {
        localStorage.setItem('TrackerCode', wantedProduct);
        window.location.href = 'visitor.html';
    } else {
        alert('يرجى إدخال رمز التتبع.');
    }
});

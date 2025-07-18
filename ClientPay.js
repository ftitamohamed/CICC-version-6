import { saveCartToIndexedDB, getCartFromIndexedDB,clearIndexedDB } from "./indexedDBHelper.js";
const form = document.querySelector('#checkoutForm');
    console.log(document.querySelector('#checkoutForm'));
    const shippingSelect = document.getElementById('shipping');
    const shippingDetails = document.getElementById('shippingDetails');
    let prices
/* 
    shippingSelect.addEventListener('change', () => {
        if (shippingSelect.value === '1') {
            shippingDetails.style.display = 'block';
        } else {
            shippingDetails.style.display = 'none';
        }
    }); */
    /* console.log(JSON.parse(localStorage.getItem('CheckoutData')) );
     */
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const cartDataRequest = await getCartFromIndexedDB();

    // Ensure cartDataRequest is properly structured
    if (!cartDataRequest || !cartDataRequest.cart) {
        cartDataRequest = { cart: { orders: [] } };
    }

    let CheckoutData =  localStorage.getItem('CheckoutData');

    CheckoutData = JSON.parse(CheckoutData);

        let orders = cartDataRequest
        console.log(orders.cart);
        console.log('this is the checkoutdata lenght',orders.cart.orders.length);
        const requestBody = {
        cart: {
            orders: orders.cart.orders, // Explicitly define the key "orders"
        },
        subtotal: CheckoutData.subtotal,
        total_amount: CheckoutData.subtotal,
        discount: 0,
        promocode: "",
        email: formData.get('email'),
        phone: formData.get('phone'),
        name: formData.get('name'),
        shipping: 0,
    };
    console.log(requestBody);

        if (requestBody.shipping === 1) {
            requestBody.receiver_name = formData.get('receiver_name');
            requestBody.receiver_email = formData.get('receiver_email');
            requestBody.receiver_phone = formData.get('receiver_phone');
            requestBody.address = formData.get('address');
            requestBody.city = formData.get('city');
            requestBody.postal_code = formData.get('postal_code');
            requestBody.country = formData.get('country');
        }

        try {
            document.getElementById("loader").style.display = "inline-block";
            const response = await fetch('https://custmize.digitalgo.net/api/v3/checkout_guest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
            document.getElementById("loader").style.display = "none";
            if (response.ok) {
                const result = await response.json();
                alert('Order submitted successfully!');
                /*  */
                console.log(result);
                localStorage.setItem('cartData', JSON.stringify({ cart: { orders: [] }}));
                localStorage.setItem('cartData1', JSON.stringify({ cart: { orders: [] }}));
                localStorage.setItem('Front',JSON.stringify({ version: "5.2.4", objects: [] }));
                localStorage.setItem('Back',JSON.stringify({ version: "5.2.4", objects: [] }));
                localStorage.setItem('Left',JSON.stringify({ version: "5.2.4", objects: [] }));
                localStorage.setItem('Right',JSON.stringify({ version: "5.2.4", objects: [] }));
                localStorage.setItem('logoprices', JSON.stringify([]));
                clearIndexedDB().then(() => console.log("DB is now empty."));
                window.open(result.data.link,'_self');
                document.getElementById("loader").style.display = "none";

            } else {
                alert('Failed to submit order.');
                document.getElementById("loader").style.display = "none";
            }
        } catch (error) {
            console.error(' this is the error of the day Error:', error);
            alert(`An error occurred while submitting the order.,${error}`);
            document.getElementById("loader").style.display = "none";
        }
    });
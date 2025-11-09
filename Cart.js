import { saveCartToIndexedDB, getCartFromIndexedDB,clearIndexedDB } from "./indexedDBHelper.js";
document.addEventListener('DOMContentLoaded', () => {
  const subtotalElement = document.querySelector('body > main > aside > div:nth-child(5) > span');
  const totalPriceElement = document.querySelector('body > main > aside > div:nth-child(9) > span');
  const payNowButton = document.querySelector('.pay-now');
  const itemsContainer = document.querySelector('.shopping-items');
  const deliveryCheckbox = document.getElementById('delivery');
  const pickupCheckbox = document.getElementById('pickUp');
  const token = localStorage.getItem('accessToken');
  let paimentName ; 
  let paimentEmail ; 
  let paimentPhone ; 
  let otpValue = true;
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
        paimentName = data.data.name;
        paimentEmail = data.data.email;
        paimentPhone = data.data.phone;
        console.log('this is the data :',paimentEmail,paimentName,paimentPhone);
        // Check if otp is null, then hide the OTP button
        if (data.success && data.data.otp !== null) {
            otpValue = false;
        }

    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}
getUserProfile()
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
  /* async function fetchCart() {
     cart = await getCartFromIndexedDB();
    
  }
  let cart ;
  fetchCart();
  
  console.log(cart); */
   let checkoutForm =  document.querySelector('#checkoutForm')
   let checkoutLabel = document.querySelector('.order-summary > h2:nth-child(15)');
   if(token){
    checkoutForm.style.display='none';
    checkoutLabel.style.display='none';
   }
   if(!token){
    payNowButton.style.display='none';
    
   }
   


  const modal = document.getElementById('shippingModal');
  const modalClose = document.querySelector('.modal .close');
  const shippingForm = document.getElementById('shippingForm');
  
  let shippingCost = 0;
  const baseTaxRate = 0;
  
  
  let checkoutData;
  let shippingDetails = null;

  const openModal = () => {
      modal.style.display = 'block';
  };

  const closeModal = () => {
      modal.style.display = 'none';
  };

  // Updated asynchronous updateOrderSummary function
const updateOrderSummary = async () => {
    let subtotal = 0;

    // Get ordersRequest inside the async callback
    const cartDataRequest = await getCartFromIndexedDB();

    // Ensure cartDataRequest is properly structured
    if (!cartDataRequest || !cartDataRequest.cart) {
        cartDataRequest = { cart: { orders: [] } };
    }

    // Get orders safely
    const ordersRequest = cartDataRequest.cart.orders1 || cartDataRequest.cart.orders || [];
    console.log("Orders:", ordersRequest);

    const items = itemsContainer.querySelectorAll('.item');

    items.forEach((item) => {
        const priceElement = item.closest('.item').querySelector('span.price');
        let price = parseFloat(priceElement.textContent.replace('SAR', '').trim());
        price = parseFloat(priceElement.textContent.replace('Total price:', ''));
        subtotal += price;
    });

    const shippingCost = deliveryCheckbox.checked ? 15.0 : 0.0;
    const total = subtotal + shippingCost + baseTaxRate;

    subtotalElement.textContent = `${subtotal.toFixed(2)} SAR`;
    totalPriceElement.textContent = `${total.toFixed(2)} SAR`;
    payNowButton.textContent = `Pay now (SAR ${total.toFixed(2)})`;

    const checkoutData = {
        cart: {
            orders: [...ordersRequest],
        },
        subtotal,
        total_amount: total,
        discount: 0,
        promocode: '',
        name:paimentName,
        phone:paimentPhone,
        email:paimentEmail,
        shipping: deliveryCheckbox.checked ? 1 : 0,
        ...shippingDetails,
    };
    
    console.log(checkoutData, total);
    
    // Return a promise to ensure async handling
    return checkoutData; 
};

// Call the function in different places
// Example 1: Calling with `await` in an async function
async function handleOrder() {
    const orderData = await updateOrderSummary();
    console.log(orderData);
}

// Example 2: Calling with `.then()` if not in an async function



// Call the function to update the order summary
updateOrderSummary();


  deliveryCheckbox.addEventListener('change', () => {
      if (deliveryCheckbox.checked) {
          pickupCheckbox.checked = false;
          if (!shippingDetails) openModal();
      }
      updateOrderSummary();
  });

  pickupCheckbox.addEventListener('change', () => {
      if (pickupCheckbox.checked) {
          deliveryCheckbox.checked = false;
      }
      updateOrderSummary();
  });

  modalClose.addEventListener('click', closeModal);
  window.addEventListener('click', (event) => {
      if (event.target === modal) closeModal();
  });

  shippingForm.addEventListener('submit', (event) => {
      event.preventDefault();
      
      const name = document.getElementById('receiverName').value;
      const receiver_email = document.getElementById('receiver_email').value;
      const receiver_phone = document.getElementById('receiver_phone').value;
      const address = document.getElementById('address').value;
      const city = document.getElementById('city').value;
      const postalCode = document.getElementById('postalCode').value;
      const country = document.getElementById('country').value;
      
      if (name && address && city && postalCode && country) {
          shippingDetails = {
              receiver_name: name,
              receiver_email:receiver_email,
              receiver_phone:receiver_phone,
              address,
              city,
              postal_code: postalCode,
              country,
          };
          alert('Shipping details saved!');
          closeModal();
          updateOrderSummary();
      } else {
          alert('Please fill all fields.');
      }
  });

  itemsContainer.addEventListener('click', (event) => {
      if (event.target.classList.contains('delete-item')) {
          const item = event.target.closest('.item');
          if (item) {
              item.remove();
              updateOrderSummary();
          }
      }
  });

  const sendDataToAPI = async (data, url) => {
      const token = localStorage.getItem('accessToken');
      console.log('this is the data :',data);
      //Alex@gmail.com
      
      try {
       
          const response = await fetch(url, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(data),
              
          });
          document.getElementById("loader").style.display = "none";
          document.getElementById("loader1").style.display = "none";
          if (response.ok) {
              const result = await response.json();
              
              console.log(result);
              localStorage.setItem('cartData', JSON.stringify({ cart: { orders: [] }}));
              localStorage.setItem('cartData1', JSON.stringify({ cart: { orders: [] }}));
              localStorage.setItem('Front',JSON.stringify({ version: "5.2.4", objects: [] }));
              localStorage.setItem('Back',JSON.stringify({ version: "5.2.4", objects: [] }));
              localStorage.setItem('Left',JSON.stringify({ version: "5.2.4", objects: [] }));
              localStorage.setItem('Right',JSON.stringify({ version: "5.2.4", objects: [] }));
              localStorage.setItem('logoprices', JSON.stringify([]));
              clearIndexedDB().then(() => console.log("DB is now empty."));
              alert('Order submitted successfully!');
              window.open(result.data.link, "_self");
              
          } else {
              alert('Failed to submit order.');
              document.getElementById("loader1").style.display = "none";
              let result = await response.json();
              console.log('this is the result :',result,response);
              
          }
      } catch (error) {
          console.error('Error:', error);
          alert('An error occurred while submitting the order.',error);
          document.getElementById("loader1").style.display = "none";
      }
  };

  payNowButton.addEventListener('click',  () => {
    if(!otpValue){
        alert('الرجاء توثيق الحساب ');
        window.location.href = "Profile.html";
        let clickOtp = true;
        localStorage.setItem('clickOtp',JSON.stringify(clickOtp));
        return;
    }
    updateOrderSummary().then((orderData) => {
        const token = localStorage.getItem('accessToken');
        document.getElementById("loader1").style.display = "inline-block";
        updateOrderSummary()
        if (deliveryCheckbox.checked && !shippingDetails) {
            alert('Please provide shipping details for delivery before proceeding.');
        } else {
          console.log(checkoutData);
            sendDataToAPI(orderData, 'https://custmize.digitalgo.net/api/v3/checkout_guest')
                .then((response) => {
                    console.log('API response:', response);
                    document.getElementById("loader1").style.display = "none";
                   /*  localStorage.setItem('cartData', JSON.stringify({ cart: { orders: [] }}));
                      localStorage.setItem('cartData1', JSON.stringify({ cart: { orders: [] }}));
                      localStorage.setItem('Front',JSON.stringify({ version: "5.2.4", objects: [] }));
                      localStorage.setItem('Back',JSON.stringify({ version: "5.2.4", objects: [] }));
                      localStorage.setItem('Left',JSON.stringify({ version: "5.2.4", objects: [] }));
                      localStorage.setItem('Right',JSON.stringify({ version: "5.2.4", objects: [] }));
                      console.log(localStorage.getItem('Front'));
                confirm('check if the data is reset'); */
                })
                .catch((error) => {
                    document.getElementById("loader1").style.display = "none";
                    console.error('Error sending data to API:', error);
                });
                
        }
       /*  localStorage.setItem('cartData', JSON.stringify({ cart: { orders: [] }}));
        localStorage.setItem('cartData1', JSON.stringify({ cart: { orders: [] }}));
   */
       /*  existingCart1.cart.orders.push(newOrder1); */
      });
     /*  localStorage.setItem('material', ''); */
  
    
    });
     
});
document.getElementById("home-logo").addEventListener("click", function (event) {
  if (event.target === event.currentTarget) {
      window.location.href = "index.html"; // Replace with your desired URL
  }
});

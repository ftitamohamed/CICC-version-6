document.addEventListener('DOMContentLoaded', () => {
  const subtotalElement = document.querySelector('body > main > aside > div:nth-child(5) > span');
  const totalPriceElement = document.querySelector('body > main > aside > div:nth-child(9) > span');
  const payNowButton = document.querySelector('.pay-now');
  const itemsContainer = document.querySelector('.shopping-items');
  const deliveryCheckbox = document.getElementById('delivery');
  const pickupCheckbox = document.getElementById('pickUp');
  const token = localStorage.getItem('accessToken');
  
   let checkoutForm =  document.querySelector('#checkoutForm')
   let checkoutLabel = document.querySelector('.order-summary > h2:nth-child(12)');
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

  const updateOrderSummary = () => {
      let subtotal = 0;
      const cartDataRequest = JSON.parse(localStorage.getItem('cartData')) || { cart: { orders: [] } };
      const ordersRequest = cartDataRequest.cart.orders1 || cartDataRequest.cart.orders || [];
      const items = itemsContainer.querySelectorAll('.item');

      items.forEach((item) => {
        const priceElement = item.closest('.item').querySelector('span.price');
        let price = parseFloat(priceElement.textContent.replace('SAR', '').trim());
        price = parseFloat(priceElement.textContent.replace('Total price:', ''));
          subtotal += price;
      });

      shippingCost = deliveryCheckbox.checked ? 15.0 : 0.0;

      const total = subtotal + shippingCost + baseTaxRate;

      subtotalElement.textContent = `${subtotal.toFixed(2)} SAR`;
      totalPriceElement.textContent = `${total.toFixed(2)} SAR`;
      payNowButton.textContent = `Pay now (SAR ${total.toFixed(2)})`;

      checkoutData = {
          cart: {
              orders: [...ordersRequest],
          },
          subtotal,
          total_amount: total,
          discount: 0,
          promocode: '',
          shipping: deliveryCheckbox.checked ? 1 : 0,
          ...shippingDetails,
      };
      console.log(checkoutData, total);
  };

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
      try {
          const response = await fetch(url, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(data),
          });

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
             
              alert('Order submitted successfully!');
              window.open(result.data.link, "_self");
              
          } else {
              alert('Failed to submit order.');
              let result = await response.json();
              console.log('this is the result :',result,response);
          }
      } catch (error) {
          console.error('Error:', error);
          alert('An error occurred while submitting the order.');
      }
  };

  payNowButton.addEventListener('click', () => {
      const token = localStorage.getItem('accessToken');
      updateOrderSummary()
      if (deliveryCheckbox.checked && !shippingDetails) {
          alert('Please provide shipping details for delivery before proceeding.');
      } else {
        console.log(checkoutData);
          sendDataToAPI(checkoutData, 'https://custmize.digitalgo.net/api/v2/checkout')
              .then((response) => {
                  console.log('API response:', response);
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
                  console.error('Error sending data to API:', error);
              });
      }
     /*  localStorage.setItem('cartData', JSON.stringify({ cart: { orders: [] }}));
      localStorage.setItem('cartData1', JSON.stringify({ cart: { orders: [] }}));
 */
      existingCart1.cart.orders.push(newOrder1);
    });
   /*  localStorage.setItem('material', ''); */

  updateOrderSummary();
});
document.getElementById("home-logo").addEventListener("click", function (event) {
  if (event.target === event.currentTarget) {
      window.location.href = "index.html"; // Replace with your desired URL
  }
});
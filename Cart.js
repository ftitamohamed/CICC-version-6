document.addEventListener('DOMContentLoaded', () => {
  const subtotalElement = document.querySelector('body > main > aside > div:nth-child(5) > span');
  const totalPriceElement = document.querySelector('body > main > aside > div:nth-child(9) > span');
  const payNowButton = document.querySelector('.pay-now');
  const itemsContainer = document.querySelector('.shopping-items');
  const deliveryCheckbox = document.getElementById('delivery');
  const pickupCheckbox = document.getElementById('pickUp');
  const token = localStorage.getItem('accessToken');
  if(!token){
   let checkboxes =  document.querySelectorAll('.checkboxes')
    checkboxes.forEach((box)=>{
        box.style.display='none';
    });
  };
  const modal = document.getElementById('shippingModal');
  const modalClose = document.querySelector('.modal .close');
  const shippingForm = document.getElementById('shippingForm');

  let shippingCost = 0;
  const baseTaxRate = 0;
  const cartDataRequest = JSON.parse(localStorage.getItem('cartData')) || { cart: { orders: [] } };
  const ordersRequest = cartDataRequest.cart.orders || [];
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
              alert('Order submitted successfully!');
              window.open(result.data.link, "_blank");
              console.log(result);
          } else {
              alert('Failed to submit order.');
          }
      } catch (error) {
          console.error('Error:', error);
          alert('An error occurred while submitting the order.');
      }
  };

  payNowButton.addEventListener('click', () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        localStorage.setItem('CheckoutData', JSON.stringify(checkoutData));
          window.location.href = 'Visitor_check_out.html';
      } else if (deliveryCheckbox.checked && !shippingDetails) {
          alert('Please provide shipping details for delivery before proceeding.');
      } else {
          sendDataToAPI(checkoutData, 'https://custmize.digitalgo.net/api/checkout')
              .then((response) => {
                  console.log('API response:', response);
              })
              .catch((error) => {
                  console.error('Error sending data to API:', error);
              });
      }
  });

  updateOrderSummary();
});
document.getElementById("home-logo").addEventListener("click", function (event) {
  if (event.target === event.currentTarget) {
      window.location.href = "index.html"; // Replace with your desired URL
  }
});
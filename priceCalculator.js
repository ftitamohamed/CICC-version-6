let priceCounter = 0; // Total price
let tracker; // Price tracker element
let countNumber; // Current count of items
let count; // Element to display the count
let logoPrices = new Map(); // Map to store prices for each logo object
let mainPrice ; // Base price of the product
let minimum = 0; // Minimum sale value

document.addEventListener('DOMContentLoaded', () => {
    fetch('https://custmize.digitalgo.net/api/get_single_product/LHYSE33287')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mainPrice = parseFloat(data.data.main_price);
                console.log(mainPrice);
                localStorage.setItem('mainPrice', mainPrice);
                minimum = parseInt(data.data.min_sale, 10);

                document.querySelector('.piecePrice').textContent = `${mainPrice} SAR`;

                countNumber = minimum;
                priceCounter = mainPrice * minimum;
                tracker = document.querySelector('#draggableDiv div span.totalPrice');
                count = document.querySelector('.count');

                if (tracker) tracker.innerText = `${priceCounter.toFixed(0)} SAR`;
                if (count) count.textContent = countNumber;

                setupCounterControls();
            } else {
                console.error("Product data not found or invalid:", data);
            }
        })
        .catch(error => {
            console.error("Error fetching product data:", error);
        });

    setupCanvas(); // Initialize canvas and related functionality
});
let flag = false;
export function updatePriceDisplay() {
  // Sum up logo prices */

     /*  console.log("Page loaded. Restoring data..."); */
  
      // Restore mainPrice from localStorage if available
      const storedMainPrice = localStorage.getItem('mainPrice');
      if (storedMainPrice) {
          mainPrice = parseInt(storedMainPrice);
         /*  console.log("mainPrice restored:", mainPrice); */
      } else {
         /*  console.log("No stored mainPrice found. Using default."); */
          mainPrice = 0; // Default value if not stored
      }
  if(!flag){
      flag = true;
      console.log(flag);
      setTimeout(()=>{
          console.log(logoPrices);
      let totalLogoPrice = Array.from(logoPrices.values()).reduce((acc, price) => acc + price, 0);
      totalLogoPrice = parseInt(totalLogoPrice);
      console.log('main Price is: ',mainPrice);
      console.log('total Logo  Price is: ',totalLogoPrice);
      
      // Update the mainPrice by including the totalLogoPrice
      const adjustedMainPrice = mainPrice + totalLogoPrice;
      /* console.log(adjustedMainPrice); */
      // Update the Unit Price in the HTML
      const unitPriceElement = document.querySelector('.piecePrice');
      if (unitPriceElement) {
          unitPriceElement.textContent = `${adjustedMainPrice.toFixed(0)} SAR`;
      }
  
      // Calculate the total price
      const totalPrice = adjustedMainPrice * countNumber;
  
      // Update the main price counter
      priceCounter = totalPrice;
  
      // Update the total price display
      if (tracker) {
          tracker.innerText = `${priceCounter.toFixed(0)} SAR`;
      }
      },1000);
  }else{
      
      console.log(logoPrices);
      let totalLogoPrice = Array.from(logoPrices.values()).reduce((acc, price) => acc + price, 0);
      totalLogoPrice = parseInt(totalLogoPrice);
      console.log('main Price is: ',mainPrice);
      console.log('total Logo  Price is: ',totalLogoPrice);
      
      // Update the mainPrice by including the totalLogoPrice
      const adjustedMainPrice = mainPrice + totalLogoPrice;
      /* console.log(adjustedMainPrice); */
      // Update the Unit Price in the HTML
      const unitPriceElement = document.querySelector('.piecePrice');
      if (unitPriceElement) {
          unitPriceElement.textContent = `${adjustedMainPrice.toFixed(0)} SAR`;
      }
  
      // Calculate the total price
      const totalPrice = adjustedMainPrice * countNumber;
  
      // Update the main price counter
      priceCounter = totalPrice;
  
      // Update the total price display
      if (tracker) {
          tracker.innerText = `${priceCounter.toFixed(0)} SAR`;
      }
      
  }}
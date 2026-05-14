import { saveCartToIndexedDB, getCartFromIndexedDB,clearIndexedDB } from "./indexedDBHelper.js";
let slugs = [];
let images = [];
let titles = [];
let Prices = [];

let productsFetshingSlug = localStorage.getItem('productsFetshingSlug');
console.log('your data is selected slug is  : ', productsFetshingSlug);
fetchslugs();
async function createPanel() {
    console.log('the slugs are: ', slugs);
    console.log('the titles are: ', titles);
    console.log('your data is: ', images);
    console.log('your data is prices : ', Prices);
  
    let container = document.querySelector('main');
    container.innerHTML = '';
    console.log(container);
  
    slugs.forEach((slug, index) => {
      let price = parseFloat(parseFloat(Prices[index]) + 50)
      let panel = document.createElement('div');
      panel.className = 'card';
      panel.id = `panel-${index}`;
      
      let img = document.createElement('img');
      img.src = images[index];
      panel.appendChild(img);
      /* panel.style.backgroundImage = `url('${images[index]}')`; */
  
      // Create title <h3> with data-full
      let title = document.createElement('h3');
      
      title.innerText = titles[index];
      panel.appendChild(title);
      let span = document.createElement('span');
      span.className = 'price';
      span.innerText =  `Price:  ${Prices[index]} SAR`;
      panel.appendChild(span);
     /*  let span1 = document.createElement('span');
      span1.className = 'price';
      span1.innerText =  `${price} SAR ${Prices[index]} SAR`;
      panel.appendChild(span1); */
      let button = document.createElement('button');
      button.innerText = "customize now";
      panel.appendChild(button);
      button.addEventListener('click', async () => {
        localStorage.setItem('selectedSlug', slug);
        localStorage.setItem('wearHouseImage',images[index]);
        localStorage.setItem('wearHouseTitle',titles[index]);
        await setGuidnessImages(`https://dashboard.caduksa.com/api/single-external-product/${slug}`,slug)
        // Add slug to URL so backend dev can share it
        
        /* window.location.href = 'wearHouseCustomize.html'; */
      });
      let cartButton = document.createElement('button');
      cartButton.innerText = "Buy now";
      cartButton.addEventListener('click', async () => {
        localStorage.setItem('selectedSlug', slug);
        localStorage.setItem('wearHouseImage',images[index]);
        localStorage.setItem('wearHouseTitle',titles[index]);
        await fetchAndsave(slug)
        // Add slug to URL so backend dev can share it
        
        /* window.location.href = 'wearHouseCustomize.html'; */
      });
      panel.appendChild(cartButton);
      
      // Add click to panel
   /*    panel.addEventListener('click', async () => {
        localStorage.setItem('selectedSlug', slug);
        localStorage.setItem('wearHouseImage',images[index]);
        localStorage.setItem('wearHouseTitle',titles[index]);
        await setGuidnessImages(`https://custmize.digitalgo.net/api/single-external-product/${slug}`,slug)
        // Add slug to URL so backend dev can share it
        
        
      });
      */
    
      container.appendChild(panel);
    });

    document.getElementById("home-logo").addEventListener("click", function (event) {
        if (event.target === event.currentTarget) {
            window.location.href = "index.html"; // Replace with your desired URL
        }
      });
  

  
    console.log('panel created successfully');
  }
async function fetchslugs() {
  const response = await fetch(`https://dashboard.caduksa.com/api/external-products`, {
    method: 'GET', // or 'POST' if needed
    headers: {
      'Accept-Language': 'en'
    }
  });
    const data = await response.json();
    console.log('wearhouse data is ', data);
    
    if (data.success) {
      let products = data.data;
      console.log('products are ', products);
      products.forEach(product => {
        slugs.push(product.id);
        images.push(product.image);
        titles.push(product.title);
        Prices.push(product.price);
      });
      }
  
      /* await fetchFrontImages(); */
      await createPanel();
     
  }

  async function setGuidnessImages(apiUrl,slug){
    
    fetch(apiUrl)
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          if (data.success) {
              console.log('this is the guidness pictures:', data.data.Guiding_pictures);
              const guidness_pictures = data.data.Guiding_pictures;
              localStorage.setItem('guidness_pictures', JSON.stringify(guidness_pictures));
              window.location.href = 'wearHouseCustomize.html';
              window.location.href = `wearHouseCustomize.html?id=${encodeURIComponent(slug)}`;
              
          } else {
              console.error("Error while fetching data");
          }
      })
      .catch(error => {
          console.error("Error fetching data from API:", error);
      });
  }


async function fetchAndsave(slug){
  const productUrl= `https://dashboard.caduksa.com/api/single-external-product/${slug}`
  fetch(productUrl)
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          console.log(response.json);
          return response.json();
      })
      .then(data => {
          if (data.success) {
             let product = data.data ;
             saveToLocalStorage(product);
             window.location.href = 'Cart.html';
            
              
          } else {
              console.error("Error while fetching data");
          }
      })
      .catch(error => {
          console.error("Error fetching data from API:", error);
      });
}



function  saveToLocalStorage(product) {
  let full_price = parseFloat(product.price * product.count);
        const newOrder =  {
            product_id: product.id, // Placeholder, replace with your product ID logic
            product_name: product.title || 'Product ', // Placeholder, replace with your product name logic
            color_id: product.colors?.[0]?.id || '',
            size_id: product.colors?.[0].sizes?.[0]?.id  || '',
            quantity: product.count,
            default_code:product.default_codes?.[0] || 'None',
            external_id:product.external_id || 'None',
            price_without_size_color_price: parseFloat(product.price ),
            price_for_size_color_price: parseFloat(product.price ),
            full_price: full_price,
            front_image: {
                url: product.colors?.[0]?.front_image||  "",
                logos:  [] // Ensure it's an array of objects
            },
            back_image: {
                url: product.colors?.[0]?.back_image||  product.colors?.[0]?.front_image ,
                logos:  []
            },
            right_side_image: {
                url: product.colors?.[0]?.right_side_image||  product.colors?.[0]?.front_image ,
                logos:  []
            },
            left_side_image: {
                url: product.colors?.[0]?.left_side_image||  product.colors?.[0]?.front_image ,
                logos:  []
            }
        };
      const price = Number(product.price);
      const newOrder1 = {
        product_id: product.id,
        product_name: product.title || 'Product',
        color_id: product.colors?.[0]?.id || '',
        color : product.colors?.[0]?.name,
        size_id: product.colors?.[0]?.sizes?.[0]?.id || '',
        quantity: product.count,
        price_without_size_color_price: price,
        price_for_size_color_price: price,
        full_price: full_price,
        front_image: product.colors?.[0]?.front_image || "",
        back_image: "",
        logos: ""
      };
      

      let existingCart = JSON.parse(localStorage.getItem('cartData')) || { cart: { orders: [] } };
      if (!existingCart.cart) existingCart.cart = { orders: [] };
      if (!existingCart.cart.orders) existingCart.cart.orders = [];
      let existingCart1 = JSON.parse(localStorage.getItem('cartData1')) || { cart: { orders: [] } };
      if (!existingCart1.cart) existingCart1.cart = { orders: [] };
      if (!existingCart1.cart.orders) existingCart1.cart.orders = [];
      // Add the new order to the cart
      /* existingCart.cart.orders.push(newOrder); */
      getCartFromIndexedDB().then((existingCart) => {
          existingCart.cart.orders.push(newOrder);
          saveCartToIndexedDB(existingCart).then(() => {
              console.log("Order saved successfully!");
          });
      }).catch(error => console.error("Error getting cart:", error));
      getCartFromIndexedDB().then(cart => console.log(cart));
      existingCart1.cart.orders.push(newOrder1);
      localStorage.setItem('cartData1', JSON.stringify(existingCart1));
      localStorage.setItem('material', JSON.stringify({ id: 4, name_ar: "قطن", name_en: "Cotton" }));
      /* alert('تم حفظ طلبك تحقق من سلة التسوق'); */
}



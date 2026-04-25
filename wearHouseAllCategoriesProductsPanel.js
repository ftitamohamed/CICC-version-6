let slugs = [];
let images = [];
let titles = [];
let container = document.querySelector('main');
let products

fetchslugs();

async function createPanel() {
    console.log('the slugs are: ', slugs);
    console.log('the titles are: ', titles);
    console.log('your data is: ', images);
    /* console.log('your data is prices : ', Prices); */
    let titleElement = document.querySelector('body > h1');
    titleElement.innerText = 'All categories';
    let container = document.querySelector('main');
    container.innerHTML = '';
    console.log(container);
   
      
    slugs.forEach((slug, index) => {
      /* let price = parseFloat(parseFloat(Prices[index]) + 50) */
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
      /* span.innerText =  `Price:  ${Prices[index]} SAR`; */
      panel.appendChild(span);
     /*  let span1 = document.createElement('span');
      span1.className = 'price';
      span1.innerText =  `${price} SAR ${Prices[index]} SAR`;
      panel.appendChild(span1); */
      let button = document.createElement('button');
      button.innerText = "See Products";
      panel.appendChild(button);
      
      // Add click to panel
      panel.addEventListener('click',() => {
        
        localStorage.setItem('subcategories',JSON.stringify(products[index]));
        console.log(JSON.parse(localStorage.getItem('subcategories')));
        /* setGuidnessImages(`https://custmize.digitalgo.net/api/single-external-product/${slug}`) */
        window.location.href = 'wearHouseSubCategories.html';
      });
  
      container.appendChild(panel);
    });

    console.log('panel created successfully');
}


async function fetchslugs() {
    const response = await fetch('https://dashboard.caduksa.com/api/main-category-external', {
      method: 'GET', // or 'POST' if needed
      headers: {
        'Accept-Language': 'en'
      }
    });
    const data = await response.json();
    console.log('wearhouse data is ', data);
    
    if (data.success) {
      products = data.data;
      const productLimit = products.length; // <<< Change this number to control how many products appear
    
      
      console.log('products are ', products);
    
      // Duplicate products if not enough
      while (products.length < productLimit) {
        products.push(...products.slice(0, productLimit - products.length));
      }
    
      // Trim the list to the desired number
      products = products.slice(0, productLimit);
    
      products.forEach(product => {
        slugs.push(product.products_link);
        images.push(product.image);
        titles.push(product.name);
        console.log('the wategory is ',product.categories[0]?.image)
      });
    }
    
  
      /* await fetchFrontImages(); */
      await createPanel();
     
  }

async function fetchFrontImages() {
    for (const slug of slugs) {
        const response = await fetch(`https://dashboard.caduksa.com/api/get_single_product/${slug}`);
        const data = await response.json();
        data.data.image?images.push(data.data.image):images.push(data.data.colors[0].front_image);
        
        titles.push(data.data.title);
    }
}

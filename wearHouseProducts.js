let slugs = [];
let images = [];
let titles = [];
let Prices = [];

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
      let panel = document.createElement('div');
      panel.className = 'card';
      panel.id = `panel-${index}`;
      let span = document.createElement('span');
      span.className = 'price';
      span.innerText =  `${Prices[index]} SAR`;
      panel.appendChild(span);
      let img = document.createElement('img');
      img.src = images[index];
      panel.appendChild(img);
      /* panel.style.backgroundImage = `url('${images[index]}')`; */
  
      // Create title <h3> with data-full
      let title = document.createElement('h3');
      
      title.innerText = titles[index];
      panel.appendChild(title);
      let button = document.createElement('button');
      button.innerText = "customize now";
      panel.appendChild(button);
  
      // Add click to panel
      panel.addEventListener('click', () => {
        localStorage.setItem('selectedSlug', slug);
        console.log('Clicked slug saved:', slug);
        window.location.href = 'customize.html';
      });
  
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
    const response = await fetch('https://custmize.digitalgo.net/api/external-products');
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
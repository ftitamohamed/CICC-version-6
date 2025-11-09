let slugs = [];
let images = [];
let titles = [];
let products =[];
fetchslugs();

async function createPanel() {
  console.log('the slugs are: ', slugs);
  console.log('the titles are: ', titles);
  console.log('your data is: ', images);

  let container = document.querySelector('#slider');
  container.innerHTML = '';
  console.log(container);

  slugs.forEach((slug, index) => {
    let panel = document.createElement('div');
    panel.className = 'panel';
    panel.id = `panel-${index}`;
    panel.style.backgroundImage = `url(${images[index]})`;

    // Create title <h3> with data-full
    let title = document.createElement('h3');
    title.className = 'js-trim';
    title.dataset.full = titles[index];
    panel.appendChild(title);

    // Add click to panel
    panel.addEventListener('click',() => {
      /* localStorage.setItem('productsFetshingSlug', slug);
      localStorage.setItem('wearHouseImage',images[index]);
      localStorage.setItem('wearHouseTitle',titles[index]);
      console.log('Clicked slug saved:', titles[index]); */
      localStorage.setItem('subcategories',JSON.stringify(products[index]));
      console.log(JSON.parse(localStorage.getItem('subcategories')));
      /* setGuidnessImages(`https://custmize.digitalgo.net/api/single-external-product/${slug}`) */
      window.location.href = 'wearHouseSubCategories.html';
    });

    container.appendChild(panel);
  });

  // Initialize trimming logic
  trimTitles();

  console.log('panel created successfully');
  attachLastPanelHover();
}



async function fetchslugs() {
  const response = await fetch('https://custmize.digitalgo.net/api/main-category-external', {
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
    });
  }
  

    /* await fetchFrontImages(); */
    await createPanel();
   
}
function trimTitles() {
  const containers = document.querySelectorAll('.js-trim');

  containers.forEach(p => {
    const full = p.dataset.full;
    if (!full) return;

    const short = full.length > 7 ? full.slice(0, 7) + '...' : full;
    p.textContent = short;

    // Get the parent element (e.g., .card or another container)
    const parentElement = p.closest('.card') || p.parentElement;

    // Show full text on parent hover
    parentElement.addEventListener('mouseenter', () => {
      p.textContent = full;
    });

    // Revert to short text when mouse leaves
    parentElement.addEventListener('mouseleave', () => {
      p.textContent = short;
    });
  });
}
function setGuidnessImages(apiUrl){

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
            
        } else {
            console.error("Error while fetching data");
        }
    })
    .catch(error => {
        console.error("Error fetching data from API:", error);
    });
}


const slider = document.getElementById('slider');
const leftArrow = document.getElementById('left-arrow');
const rightArrow = document.getElementById('right-arrow');

const scrollAmount = 300;

leftArrow.addEventListener('click', () => {
    slider.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
    });
});

rightArrow.addEventListener('click', () => {
    slider.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
});


// Function to (re)attach hover event to the last panel
function attachLastPanelHover() {
  const panels = document.querySelectorAll('.panel');
  const lastPanel = panels[panels.length - 1];

  if (!lastPanel) return;

  lastPanel.addEventListener('mouseenter', () => {
    console.log('Hovering on last panel');

      // Expand slider padding
      slider.style.paddingRight = '250px';
      slider.style.boxSizing = 'content-box';

      // Expand the panel
      lastPanel.style.flex = '5';
      

     
      setTimeout(()=>slider.scrollBy({
          left: scrollAmount,
          behavior: 'smooth'
      }),500);
  });

  lastPanel.addEventListener('mouseleave', () => {
      setTimeout(() => {
          slider.style.paddingRight = '';
          slider.style.boxSizing = '';
      }, 0);
  });
}

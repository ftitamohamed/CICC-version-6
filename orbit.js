let slugs = [];
let images = [];
let titles = [];

fetchslugs();

async function createPanel() {
  console.log('the slugs are: ', slugs);
  console.log('the titles are: ', titles);
  console.log('your data is: ', images);

  let container = document.querySelector('.container2');
  container.innerHTML = '';
  console.log(container);

  slugs.forEach((slug, index) => {
    let panel = document.createElement('div');
    panel.className = 'panel';
    panel.id = `panel-${index}`;
    panel.style.backgroundImage = `url('${images[index]}')`;

    // Create title <h3> with data-full
    let title = document.createElement('h3');
    title.className = 'js-trim';
    title.dataset.full = titles[index];
    panel.appendChild(title);

    // Add click to panel
    panel.addEventListener('click', () => {
      localStorage.setItem('selectedSlug', slug);
      console.log('Clicked slug saved:', slug);
      window.location.href = 'customize.html';
    });

    container.appendChild(panel);
  });

  // Initialize trimming logic
  trimTitles();

  console.log('panel created successfully');
}



async function fetchslugs() {
  const response = await fetch('https://custmize.digitalgo.net/api/external-products');
  const data = await response.json();
  console.log('wearhouse data is ', data);
  
  if (data.success) {
    let products = data.data;
    console.log('products are ', products);
    
    while (products.length < 8) {
      products.push(...products.slice(0, 8 - products.length));
    }
    products.forEach(product => {
      slugs.push(product.id);
      images.push(product.image);
      titles.push(product.title);
    });
    }

    /* await fetchFrontImages(); */
    await createPanel();
   
}
function trimTitles() {
  document.querySelectorAll('.js-trim').forEach(p => {
    const full = p.dataset.full;
    if (!full) return;

    const short = full.length > 7 ? full.slice(0, 7) + '...' : full;
    p.textContent = short;

    p.addEventListener('mouseenter', () => {
      p.textContent = full;
    });

    p.addEventListener('mouseleave', () => {
      p.textContent = short;
    });
  });
}



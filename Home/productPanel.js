let slugs = [];
let images = [];
let titles = [];

fetchslugs();

async function createPanel() {
    console.log('the slugs are: ', slugs);
    console.log('the titles are: ', titles);
    console.log('your data is: ', images);

    let container = document.querySelector('section.gallery > .container');
    container.innerHTML = '';
    console.log(container);

    slugs.forEach((slug, index) => {
        let panel = document.createElement('div');
        panel.className = 'panel';
        panel.id = `panel-${index}`;
        panel.innerHTML = `<h3>${titles[index]}</h3>`;
        panel.style.backgroundImage = `url('${images[index]}')`;

        // ➕ Add click event listener to save the slug
        panel.addEventListener('click', () => {
            // Save slug (e.g., in localStorage or just log it)
            localStorage.setItem('selectedSlug', slug);
            console.log('Clicked slug saved:', slug);
            window.location.href = 'customize.html';
            
        });

        container.appendChild(panel);
    });

    console.log('panel created successfully');
}


async function fetchslugs() {
    const response = await fetch('https://custmize.digitalgo.net/api/home');
    const data = await response.json();
    console.log(data);

    if (data.success) {
        let products = data.data.products;
        while (products.length < 8) {
            products.push(...products.slice(0, 8 - products.length));
        }
        products.forEach(product => {
            slugs.push(product.slug);
        });
    }

    await fetchFrontImages();
    await createPanel();
}

async function fetchFrontImages() {
    for (const slug of slugs) {
        const response = await fetch(`https://custmize.digitalgo.net/api/get_single_product/${slug}`);
        const data = await response.json();
        data.data.image?images.push(data.data.image):images.push(data.data.colors[0].front_image);
        
        titles.push(data.data.title);
    }
}

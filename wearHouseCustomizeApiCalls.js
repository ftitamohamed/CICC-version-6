

const params = new URLSearchParams(window.location.search);
const productId = params.get('id');
// Get stored product info
const slug = localStorage.getItem('selectedSlug');
const wearHouseImage = localStorage.getItem('wearHouseImage');
const wearHouseTitle = localStorage.getItem('wearHouseTitle');
console.log('Product title:', wearHouseTitle,'the slug is ',slug);

// API endpoint
const apiUrl = `https://custmize.digitalgo.net/api/single-external-product/${productId}`;

// DOM elements
const colorsList = document.querySelector('.colors');
const sizesList = document.querySelector('.Sizes');
const imageElement = document.getElementById('image');
const priceElement = document.querySelector('.price');
const productNameElement = document.querySelector('#productName');
const viewTogglers = {
    front: document.getElementById('front'),
    back: document.getElementById('back'),
    left: document.getElementById('Left'),
    right: document.getElementById('Right')
};

// Color name to hex mapping
/* const colorMap = {
    'Black': '#000000',
    'Charcoal Grey': '#36454F',
    'Green': '#008000',
    'Grey Melange': '#9E9E9E',
    'Maroon': '#800000',
    'Navy Blue': '#000080',
    'Royal blue': '#4169E1',
    'Red': '#FF0000',
    'Red (CS)': '#FF0000',
    'White': '#FFFFFF'
}; */

// Initialize product display
function initProductDisplay() {
    productNameElement.textContent = wearHouseTitle || 'Loading product...';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => handleProductData(data))
        .catch(error => {
            console.error("Error fetching product data:", error);
            productNameElement.textContent = 'Product loading failed';
        });
}

// Handle product data from API
function handleProductData(data) {
    if (!data.success) {
        console.error("API Error:", data.message);
        return;
    }

    const product = data.data;
    productNameElement.textContent = product.title;
    console.log('the product data.data object is ',product);
    updatePriceDisplay(product.price);
    createColorDropdown(product.colors, product.price);
}

// Create color dropdown
function createColorDropdown(colors, basePrice) {
    colorsList.innerHTML = '';

    if (!colors.length) {
        colorsList.remove();
        return;
    }

    const colorsDropdown = document.createElement('select');
    colorsDropdown.className = 'colors-dropdown';
    colorsList.appendChild(colorsDropdown);

    colors.forEach((color, index) => {
        const option = document.createElement('option');
        option.value = JSON.stringify(color);
        option.textContent = color.name;
        colorsDropdown.appendChild(option);
    });

    colorsDropdown.addEventListener('change', (event) => {
        const selectedColor = JSON.parse(event.target.value);
        handleColorSelection(selectedColor, basePrice);
    });

    colorsDropdown.selectedIndex = 0;
    colorsDropdown.dispatchEvent(new Event('change'));
}

function handleColorSelection(color, basePrice) {
    updateMainImage(color.front_image, color);
    updatePriceDisplay(basePrice);

    const colorData = {
        id: color.id,
        name: color.name,
        front_image: color.front_image,
        back_image: color.back_image,
        right_side_image: color.right_side_image,
        left_side_image: color.left_side_image,
        price: basePrice,
        has_front_image: !!color.front_image,
        has_back_image: !!color.back_image,
        has_left_side_image: !!color.left_side_image,
        has_right_side_image: !!color.right_side_image
    };
    localStorage.setItem('selectedColor', JSON.stringify(colorData));

    updateViewTogglers(colorData);

    if (colorData.has_front_image) {
        resetToFrontView(colorData);
    }

    updateSizeDropdown(color, basePrice);
}

function updateViewTogglers(color) {
    viewTogglers.front.style.display = color.has_front_image ? 'block' : 'none';
    viewTogglers.back.style.display = color.has_back_image ? 'block' : 'none';
    viewTogglers.left.style.display = color.has_left_side_image ? 'block' : 'none';
    viewTogglers.right.style.display = color.has_right_side_image ? 'block' : 'none';

    if (color.has_front_image) {
        viewTogglers.front.onclick = () => updateMainImage(color.front_image);
    }
    if (color.has_back_image) {
        viewTogglers.back.onclick = () => updateMainImage(color.back_image);
    }
    if (color.has_left_side_image) {
        viewTogglers.left.onclick = () => updateMainImage(color.left_side_image);
    }
    if (color.has_right_side_image) {
        viewTogglers.right.onclick = () => updateMainImage(color.right_side_image);
    }
}

function resetToFrontView(color) {
    if (color.front_image) {
        updateMainImage(color.front_image);
        if (viewTogglers.front) {
            document.querySelectorAll('.view-toggle').forEach(btn => btn.classList.remove('active'));
            viewTogglers.front.classList.add('active');
        }
    }
}

function updateMainImage(src, color) {
    imageElement.src = src || wearHouseImage;
    if (!src) updateViewTogglers(color);
}

function updatePriceDisplay(price) {
    if (!priceElement) return;
    priceElement.textContent = price && price !== "0.00"
        ? `$${parseFloat(price).toFixed(2)}`
        : "Price not available";
}

function updateSizeDropdown(color, basePrice) {
    sizesList.innerHTML = '';

    if (!color?.sizes || !color.sizes.length) {
        sizesList.remove();
        localStorage.setItem('selectedSize', null);
        return;
    }

    const sizesDropdown = document.createElement('select');
    sizesDropdown.className = 'sizes-dropdown';

    sizesList.appendChild(sizesDropdown);

    color.sizes.forEach((size, index) => {
        const option = document.createElement('option');
        option.value = JSON.stringify({
            size_id: size.size_id,
            size_name: size.size_name,
            external_id: size.external_id,
            default_code: size.default_code,
            price: basePrice
        });
        option.textContent = size.size_name;
        sizesDropdown.appendChild(option);
    });

    sizesDropdown.addEventListener('change', (event) => {
        const selectedSize = JSON.parse(event.target.value);
        localStorage.setItem('selectedSize', JSON.stringify(selectedSize));
    });

    sizesDropdown.selectedIndex = 0;
    sizesDropdown.dispatchEvent(new Event('change'));
}

// Initialize
initProductDisplay();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initProductDisplay);
    document.addEventListener('DOMContentLoaded', () => {
        // Fetch the data from the API
        fetch(apiUrl)
            .then(response => response.json())  // Parse the response as JSON
            .then(data => {
                if (data.success) {
                    const material = data.data.matiral;
                     // Extract the category name from the response
                    
                      // Extract the sub-category name from the response
    
                    // Update the product name in <h1>
                    document.querySelector('#material').textContent = material.name_en;
                    document.querySelector('#material').addEventListener('click', () => {
                                

                                // Highlight the selected size
                                document.querySelector('#material').style.border = '2px solid #6929a4';
                                document.querySelector('#material').style.borderRadius = '5px';

                                // Save the selected size to local storage
                                localStorage.setItem('material', JSON.stringify(material));
                            });
                    
                }
            })
            .catch(error => {
                console.error("Error fetching product data material:", error);
                document.querySelector('.material').remove();
            });
    });
    document.addEventListener('DOMContentLoaded', () => {
        // Fetch the data from the API
        fetch(apiUrl)
            .then(response => response.json())  // Parse the response as JSON
            .then(data => {
                if (data.success) {
                    const deliveryDate = data.data.delivery_date;  // Extract the delivery date from the response
                    const currentMonth = new Date().toLocaleString('default', { month: 'long' });  // Get the current month (e.g., "October")
                    const today = new Date();
                    const futureDate = new Date();
                    futureDate.setDate(today.getDate() + 15);
                    const formattedDate = `${String(futureDate.getDate()).padStart(2, '0')}/${String(futureDate.getMonth() + 1).padStart(2, '0')}/${String(futureDate.getFullYear()).slice(-2)}`;
                    console.log(futureDate.toDateString());
                    // Format the delivery date in the button
                    const deliveryText = `${deliveryDate} ${currentMonth}`;
                    
                    // Set the delivery text in the button
                    document.querySelector('.delivery').textContent = formattedDate;
                }
            })
            .catch(error => {
                console.error("Error fetching product data:", error);
            });
    });

    document.querySelectorAll('.size-option').forEach(item => {
item.addEventListener('click', () => {
   // Test the click listener
  localStorage.setItem('selectedSize', item.textContent);
  
});
});

    
// Fetch data from the API
fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTPs error! status: ${response.status}`);
        }
        return response.json(); // Parse the JSON from the response
    })
    .then(data => {
        // Ensure the API call was successful
        
        if (data.success && data.data.Guiding_pictures.length ===1) {
            // Get the first image from the guidness_image array
            const guidnessImage = data.data.Guiding_pictures[0];
           
            // Update the img element's src attribute
            const imgElement = document.getElementById("guidness");
            imgElement.src = guidnessImage;
            /* document.getElementById('imageSlider').remove(); */
            document.querySelector('.slider-container').remove();
        } else {
            console.error("No guidness images found in the API response.");
            document.getElementById("guidness").remove();
            
        }
    })
    .catch(error => {
        console.error("Error fetching data from API:", error);
        document.getElementById("guidness").remove();
        document.querySelector('.left-aside > h4:nth-child(8)').remove();
    });
fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTPs error! status: ${response.status}`);
        }
        return response.json(); // Parse the JSON from the response
    })
    .then(data => {
        // Ensure the API call was successful
        
        if (data.success ) {
            // Get the first image from the guidness_image array
            let external_id = data.data.external_id;
            let default_code = data.data.default_code || 'empty';
            localStorage.setItem('external_id',external_id);
            localStorage.setItem('default_code',default_code);
           console.log('external id and default code are ', external_id,default_code)
        } else {
            console.error("Error while fetching data ");
        }
    })
    .catch(error => {
        console.error("Error fetching data from API:", error);
    });

  
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

            
        } else {
            console.error("Error while fetching data");
        }
    })
    .catch(error => {
        console.error("Error fetching data from API:", error);
    });

    
// 1. Read ID from URL
const params = new URLSearchParams(window.location.search);
let productId = params.get('id');

// 2. Fallback to localStorage
if (!productId) {
    productId = localStorage.getItem('productId');

    // 🔥 Inject ID into the URL WITHOUT reloading
    if (productId) {
        const newUrl = `${window.location.pathname}?id=${encodeURIComponent(productId)}`;
        history.replaceState(null, '', newUrl);
    }else{
        window.location.href = "wearHouseAllCategories.html";
    }
}

// 3. Persist it
if (productId) {
    localStorage.setItem('productId', productId);
    localStorage.setItem('selectedSlug', productId);
}

// 4. Use it safely
const slug = productId;
const wearHouseImage = localStorage.getItem('wearHouseImage');
const wearHouseTitle = localStorage.getItem('wearHouseTitle');

console.log(
  'Product title:', wearHouseTitle,
  'slug:', slug,
  'id:', productId
);

console.log('Product title:', wearHouseTitle,'the slug is ',slug,'the id is ',productId);
// API endpoint
const apiUrl = `https://dashboard.caduksa.com/api/single-external-product/${productId}`;

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
                    const today = new Date();
                    const futureDate = new Date();
                    futureDate.setDate(today.getDate() + 15);
                
                    const formattedDate = futureDate.toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    });
                
                    console.log(formattedDate); // e.g. "14 April 2026"
                localStorage.setItem('deliveryDate',JSON.stringify(formattedDate));
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


    
    /* 
    
    const isOutOfStock = counts[index] < 50;
    
    
    
    */


const attachmentBtn = document.getElementById('attachement');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');

attachmentBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
        fileInfo.innerHTML = `
            <div style="background: #f0f0f0; padding: 8px; border-radius: 4px;">
                📄 ${file.name} (${(file.size / 1024).toFixed(2)} KB)
                <button onclick="removeFile()" style="margin-left: 10px;">✖</button>
            </div>
        `;
        
        // Your upload logic here
        uploadPDF(file);
    } else if (file) {
        alert('Please select a valid PDF file');
        fileInput.value = ''; // Clear the input
    }
});

function uploadPDF(file) {
    const formData = new FormData();
    formData.append('pdf', file);
    
    // Example upload
    fetch('/upload-pdf', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => console.log('Uploaded:', data))
    .catch(error => console.error('Upload failed:', error));
}

function removeFile() {
    fileInput.value = '';
    fileInfo.innerHTML = '';
}

const descriptionBtn = document.getElementById('descriptionBtn');
const modal = document.getElementById('descriptionModal');
const descriptionText = document.getElementById('descriptionText');
const cancelBtn = document.getElementById('cancelDescription');
const saveBtn = document.getElementById('saveDescription');
const savedNote = document.getElementById('savedNote');

// Hover effect for button (optional - add to your CSS or keep inline)
descriptionBtn.addEventListener('mouseenter', () => {
    descriptionBtn.style.background = '#e0e0e0';
});
descriptionBtn.addEventListener('mouseleave', () => {
    descriptionBtn.style.background = '#f0f0f0';
});

// Open modal
descriptionBtn.addEventListener('click', () => {
    // Load existing description if any
    const existingDescription = sessionStorage.getItem('fileDescription');
    if (existingDescription) {
        descriptionText.value = existingDescription;
    } else {
        descriptionText.value = '';
    }
    modal.style.display = 'block';
    descriptionText.focus();
});

// Function to show saved note
function showSavedNote() {
    savedNote.style.display = 'block';
    setTimeout(() => {
        savedNote.style.display = 'none';
    }, 2000);
}

// Close modal functions
function closeModal() {
    modal.style.display = 'none';
}

cancelBtn.addEventListener('click', closeModal);
saveBtn.addEventListener('click', () => {
    const description = descriptionText.value.trim();
    if (description) {
        console.log('Description saved:', description);
        sessionStorage.setItem('fileDescription', description);
        
        // Show the little note instead of alert
        showSavedNote();
        
        // Optional: Change button text to show description exists
        if (description) {
            descriptionBtn.innerHTML = '<i class="fa fa-comment" aria-hidden="true"></i> ';
            descriptionBtn.style.background = '#e8f5e9';
            descriptionBtn.style.borderColor = '#4caf50';
        }
        
        closeModal();
    } else {
        // Show error note instead of alert
        const errorNote = document.createElement('div');
        errorNote.textContent = '⚠ Please enter a description';
        errorNote.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: #dc3545; color: white; padding: 10px 20px; border-radius: 4px; z-index: 1001; font-size: 14px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);';
        document.body.appendChild(errorNote);
        setTimeout(() => {
            errorNote.remove();
        }, 2000);
    }
});

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// On page load, check if there's already a description
window.addEventListener('load', () => {
    const existingDescription = sessionStorage.getItem('fileDescription');
    if (existingDescription) {
        descriptionBtn.innerHTML = '<i class="fa fa-comment" aria-hidden="true"></i>';
       
    }
});
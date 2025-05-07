let slug = localStorage.getItem('selectedSlug');
console.log(slug);
const apiUrl = `https://custmize.digitalgo.net/api/get_single_product/${slug}`;
fetch(apiUrl)
    .then(response => response.json()) // Parse the response as JSON
    .then(data => {
        if (data.success) {
            // Colors Section
            const colorsList = document.querySelector('.colors'); // Get the colors ul element
            const imageElement = document.getElementById('image'); // Get the main image element

            if (!imageElement) {
                console.error("Main image element not found.");
                return;
            }

            const colors = data.data.colors; // Extract the colors array
            const defaultColor = colors[0]; // First color

            if (!defaultColor) {
                console.error("No colors available.");
                return;
            }

            // Save the default color to local storage
            localStorage.setItem('defaultColor', JSON.stringify(defaultColor));
            

            // Loop through each color and create a list item for it
            colors.forEach((color, colorIndex) => {
                const liElement = document.createElement('li'); // Create a new li element
                liElement.style.backgroundColor = color.color_code; // Set the background color using the color code
                liElement.classList.add('color-option'); // Add a class for styling
                liElement.title = color.name; // Set a tooltip with the color name
                colorsList.appendChild(liElement); // Add the li element to the colors list

                // Add a click event listener to each color
                liElement.addEventListener('click', () => {
                   
                    // Highlight the selected color
                    document.querySelectorAll('.colors li').forEach(item => item.style.border = '');
                    liElement.style.border = '2px solid green';
                    liElement.style.borderRadius = '5px';

                    // Update the main image
                    if (color.have_front_image && color.front_image) {
                        imageElement.src = color.front_image;
                        imageElement.alt = `Color: ${color.name}`;
                    } else {
                        console.error("Front image missing for color:", color.name);
                    }

                    // Save the selected color to local storage
                    localStorage.setItem('selectedColor', JSON.stringify({
                        id: color.id,
                        name: color.name,
                        color_code: color.color_code,
                        price: color.price,
                        back_image: color.back_image,
                        right_side_image: color.right_side_image,
                        left_side_image: color.left_side_image
                    }));

                    // Add view-switching logic
                    document.getElementById('back').addEventListener('click', () => {
                        if (color.have_back_image && color.back_image) {
                            imageElement.src = color.back_image;
                            imageElement.alt = `Back view of color: ${color.name}`;
                        } else {
                            console.error("Back image missing for color:", color.name);
                        }
                    });

                    document.getElementById('front').addEventListener('click', () => {
                        if (color.have_front_image && color.front_image) {
                            imageElement.src = color.front_image;
                            imageElement.alt = `Front view of color: ${color.name}`;
                        } else {
                            console.error("Front image missing for color:", color.name);
                        }
                    });

                    document.getElementById('Left').addEventListener('click', () => {
                        if (color.left_side_image) {
                            imageElement.src = color.left_side_image;
                            imageElement.alt = `Left view of color: ${color.name}`;
                        } else {
                            console.error("Left-side image missing for color:", color.name);
                        }
                    });

                    document.getElementById('Right').addEventListener('click', () => {
                        if (color.right_side_image) {
                            imageElement.src = color.right_side_image;
                            imageElement.alt = `Right view of color: ${color.name}`;
                        } else {
                            console.error("Right-side image missing for color:", color.name);
                        }
                    });

                    // Display sizes for the selected color
                    const sizesList = document.querySelector('.Sizes');
                    sizesList.innerHTML = '<h4>Sizes</h4>'; // Clear previous sizes
                    color.sizes.forEach((size, sizeIndex) => {
                        const sizeLi = document.createElement('li');
                        sizeLi.textContent = size.size_name || `Size ${size.size_id}`;
                        sizeLi.classList.add('size-option');
                        sizesList.appendChild(sizeLi);

                        // Add a click event listener for each size
                        sizeLi.addEventListener('click', () => {
                            

                            // Highlight the selected size
                            document.querySelectorAll('.Sizes li').forEach(item => item.style.border = '');
                            sizeLi.style.border = '2px solid green';
                            sizeLi.style.borderRadius = '5px';

                            // Save the selected size to local storage
                            localStorage.setItem('selectedSize', JSON.stringify({
                                id: size.size_id,
                                name: size.size_name,
                                price: size.price
                            }));
                        });

                        // Automatically click the first size for the selected color
                        if (colorIndex === 0 && sizeIndex === 0) {
                            sizeLi.click();
                        }
                    });
                });

                // Automatically click the first color
                if (colorIndex === 0) {
                    liElement.click();
                }
            });

        } else {
            console.error("Error: Data was not successful:", data.message);
        }
    })
    .catch(error => {
        console.error("Error fetching product data:", error);
    });
    document.addEventListener('DOMContentLoaded', () => {
        // Fetch the data from the API
        fetch(apiUrl)
            .then(response => response.json())  // Parse the response as JSON
            .then(data => {
                if (data.success) {
                    const productId = data.data.id;
                    const categoryName = data.data.category.name;  // Extract the category name from the response
                    
                    const subCategoryName = data.data.sub_category.name;  // Extract the sub-category name from the response
    
                    // Update the product name in <h1>
                    document.querySelector('#productName').textContent = categoryName;
    
                    // Update the sub-category name in <h2>
                    document.querySelector('#subCategoryName').textContent = subCategoryName;
                    localStorage.setItem('ProductInfo', JSON.stringify({
                                Product_id: productId,
                                name: categoryName,
                                
                            }));
                }
            })
            .catch(error => {
                console.error("Error fetching product data:", error);
            });
    });
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
                                document.querySelector('#material').style.border = '2px solid green';
                                document.querySelector('#material').style.borderRadius = '5px';

                                // Save the selected size to local storage
                                localStorage.setItem('material', JSON.stringify(material));
                            });
                    
                }
            })
            .catch(error => {
                console.error("Error fetching product data:", error);
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
        
        if (data.success && data.data.guidness_image.length > 0) {
            // Get the first image from the guidness_image array
            const guidnessImage = data.data.guidness_image[0];
           
            // Update the img element's src attribute
            const imgElement = document.getElementById("guidness");
            imgElement.src = guidnessImage;
        } else {
            console.error("No guidness images found in the API response.");
        }
    })
    .catch(error => {
        console.error("Error fetching data from API:", error);
    });
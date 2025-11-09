import { saveCartToIndexedDB, getCartFromIndexedDB,clearIndexedDB } from "./indexedDBHelper.js";
/* const slider = document.getElementById("imageSlider");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn"); */
const canvasElement = document.getElementById("canvas");
const canvas = new fabric.Canvas(canvasElement);
let slug = localStorage.getItem('selectedSlug')
let image = localStorage.getItem('wearHouseImage');
console.log('the image is ',image);
document.addEventListener('DOMContentLoaded', async () => {
    const slider = document.getElementById("imageSlider");
    slider.innerHTML = '';

    // Get guidance pictures from localStorage
    const guidness_pictures = JSON.parse(localStorage.getItem('guidness_pictures')) || [];
    console.log('we import guidness pictures from local storage:', guidness_pictures);

    // Ensure at least 6 images by repeating
    const repeatedImages = [];
    const sourceImages = guidness_pictures.length > 0 ? guidness_pictures : ['images/placeholder.png'];

    for (let i = 0; i < 6; i++) {
        repeatedImages.push(sourceImages[i % sourceImages.length]);
    }

    // Hide slider if no images
    if (!guidness_pictures.length) {
        document.querySelector('.slider-container').style.display = 'none';
        return;
    }

    // Create main slider images
    repeatedImages.forEach((picture) => {
        const element = document.createElement('img');
        element.src = picture;
        element.alt = "Guidance Image";
        element.style.cursor = 'pointer';

        // Open modal preview slider on click
        element.addEventListener('click', () => {
            openPreviewSlider(repeatedImages, picture);
        });

        slider.appendChild(element);
    });

    // Slider navigation (main page)
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    let currentIndex = 0;
    let counter = 0;

    const updateSliderPosition = () => {
        slider.style.transform = `translateX(-${currentIndex * 300}px)`;
    };

    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            counter -= 6;
            updateSliderPosition();
        }
    });

    nextBtn.addEventListener("click", () => {
        if (counter < slider.children.length - 1) {
            currentIndex++;
            counter += 6;
            updateSliderPosition();
        }
    });
});

/**
 * Opens a preview modal containing its own slider.
 */
 function openPreviewSlider(images, startImage) {
    // Remove any existing preview
    const existingPreview = document.getElementById('preview-container');
    if (existingPreview) existingPreview.remove();

    // Overlay background (clicking on this closes modal)
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0,0,0,0.5);
        z-index: 999;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });

    // Preview container
    const previewContainer = document.createElement('div');
    previewContainer.className = 'preview-container';
    previewContainer.id = 'preview-container';
    previewContainer.style.cssText = `
      background-color: white;
      padding: 20px;
      border: 1px solid #ddd;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      width: 600px;
      max-width: 90%;
    `;

    // Close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: none;
      border: none;
      font-size: 24px;
      color: white;
      padding: 0.2rem 0.5rem;
      background: red;
      cursor: pointer;
    `;
    closeButton.addEventListener('click', () => overlay.remove());
    previewContainer.appendChild(closeButton);

    // Slider wrapper inside modal
    const modalSliderWrapper = document.createElement('div');
    modalSliderWrapper.style.cssText = `
      position: relative;
      overflow: hidden;
      width: 500px;
      height: 500px;
    `;

    // Slider track
    const modalSliderTrack = document.createElement('div');
    modalSliderTrack.style.cssText = `
      display: flex;
      transition: transform 0.3s ease-in-out;
    `;

    // Add images to modal slider
    images.forEach((imgSrc) => {
        const img = document.createElement('img');
        img.src = imgSrc;
        img.style.cssText = 'width: 500px; height: 500px; object-fit: contain;';
        modalSliderTrack.appendChild(img);
    });

    modalSliderWrapper.appendChild(modalSliderTrack);

    // Prev button
    const modalPrevBtn = document.createElement('button');
    modalPrevBtn.innerHTML = '&#10094;';
    modalPrevBtn.style.cssText = `
      position: absolute;
      top: 50%;
      left: 10px;
      transform: translateY(-50%);
      font-size: 24px;
      background: rgba(0,0,0,0.5);
      color: white;
      border: none;
      cursor: pointer;
      padding: 10px;
    `;

    // Next button
    const modalNextBtn = document.createElement('button');
    modalNextBtn.innerHTML = '&#10095;';
    modalNextBtn.style.cssText = `
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      font-size: 24px;
      background: rgba(0,0,0,0.5);
      color: white;
      border: none;
      cursor: pointer;
      padding: 10px;
    `;

    // Set starting index to clicked image
    let modalIndex = images.indexOf(startImage);

    const updateModalSlider = () => {
        modalSliderTrack.style.transform = `translateX(-${modalIndex * 500}px)`;
    };

    modalPrevBtn.addEventListener('click', () => {
        modalIndex = (modalIndex - 1 + images.length) % images.length;
        updateModalSlider();
    });

    modalNextBtn.addEventListener('click', () => {
        modalIndex = (modalIndex + 1) % images.length;
        updateModalSlider();
    });

    modalSliderWrapper.appendChild(modalPrevBtn);
    modalSliderWrapper.appendChild(modalNextBtn);

    previewContainer.appendChild(modalSliderWrapper);
    overlay.appendChild(previewContainer);
    document.body.appendChild(overlay);

    updateModalSlider();
}




const draggable = document.getElementById("draggableDiv");

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

let pendingX = 0;
let pendingY = 0;
let animationFrame;

function clamp(val, min, max) {
  return Math.max(min, Math.min(val, max));
}

function startDrag(x, y) {
  const rect = draggable.getBoundingClientRect();
  offsetX = x - rect.left;
  offsetY = y - rect.top;
  isDragging = true;
}

function moveDrag(x, y) {
  if (!isDragging) return;

  pendingX = clamp(x - offsetX, 0, window.innerWidth - draggable.offsetWidth);
  pendingY = clamp(y - offsetY, 0, window.innerHeight - draggable.offsetHeight);

  if (!animationFrame) {
    animationFrame = requestAnimationFrame(updatePosition);
  }
}

function updatePosition() {
  draggable.style.left = `${pendingX}px`;
  draggable.style.top = `${pendingY}px`;
  animationFrame = null;
}

function stopDrag() {
  isDragging = false;
}

// Mouse Events
draggable.addEventListener("mousedown", (e) => {
  e.preventDefault();
  startDrag(e.clientX, e.clientY);
});

document.addEventListener("mousemove", (e) => {
  moveDrag(e.clientX, e.clientY);
});

document.addEventListener("mouseup", stopDrag);

// Touch Events
draggable.addEventListener("touchstart", (e) => {
  if (e.touches.length === 1) {
    startDrag(e.touches[0].clientX, e.touches[0].clientY);
  }
}, { passive: false });

document.addEventListener("touchmove", (e) => {
  if (e.touches.length === 1 && isDragging) {
    e.preventDefault(); // Prevent scrolling
    moveDrag(e.touches[0].clientX, e.touches[0].clientY);
  }
}, { passive: false });

document.addEventListener("touchend", stopDrag);

window.addEventListener("load", () => {
    const initialX = window.innerWidth - draggable.offsetWidth;
    const initialY = window.innerHeight - draggable.offsetHeight;
  
    draggable.style.left = `0px`;
    draggable.style.top = `80%`;
  });
  
let keyList  = document.querySelectorAll('.toggelers p');
keyList.forEach((key)=>{
    
    key.addEventListener("click",function(){
        for(let i=0; i<keyList.length;i++){
            keyList[i].classList.remove("toggelers-active");
            
        };
        key.classList.toggle("toggelers-active");
        
    }); 
    
}); 
/* window.addEventListener("scroll", () => {
    const rect = draggableDiv.getBoundingClientRect();

    // Check if the Tracker section is going out of view
    if (rect.top < 0) {
        draggableDiv.style.position = "fixed"; // Fix it to the viewport
        draggableDiv.style.top = "10px"; // Ensure it stays near the top
    } else {
        draggableDiv.style.position = "sticky"; // Return it to sticky behavior
        draggableDiv.style.top = "10px";
    }
}); */



function formatText(command, value = null) {
    document.execCommand(command, false, value);
  }


 
  document.getElementById("home-logo").addEventListener("click", function (event) {
    if (event.target === event.currentTarget) {
        window.location.href = "index.html"; // Replace with your desired URL
    }
  });


  let priceCounter = 0; // Total price
  let tracker; // Price tracker element
  let countNumber; // Current count of items
  let count; // Element to display the count
  let logoPrices = new Map(); // Map to store prices for each logo object
  let mainPrice ; // Base price of the product
  let minimum = 0; // Minimum sale value
  
  document.addEventListener('DOMContentLoaded', () => {
      fetch(`https://custmize.digitalgo.net/api/single-external-product/${slug}`)
          .then(response => response.json())
          .then(data => {
              if (data.success) {
                  mainPrice = parseFloat(data.data.price);
                  console.log(mainPrice);
                  localStorage.setItem('mainPrice', mainPrice);
                  minimum = parseInt(data.data.count, 10);
  
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
  function updatePriceDisplay() {
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
        
    }
   
    
}
const colorsList  = document.querySelector('.colors ');
colorsList.addEventListener('click',()=>{

    let storedColorPrice = localStorage.getItem('selectedColor');
    storedColorPrice = JSON.parse(storedColorPrice);
    console.log(storedColorPrice.price);
    localStorage.setItem('mainPrice', storedColorPrice.price);
    updatePriceDisplay();
    
});
const sizesList  = document.querySelector('.Sizes ');
sizesList.addEventListener('click',()=>{

    let storedSizePrice = localStorage.getItem('selectedSize');
    storedSizePrice = JSON.parse(storedSizePrice);
    console.log(storedSizePrice);
    if(storedSizePrice.price){
        localStorage.setItem('mainPrice', storedSizePrice.price);
        updatePriceDisplay();
    }
    
    
});

console.log('color item are ',colorsList);



let selectedColor = localStorage.getItem('selectedColor');
console.log('this is the selected color',selectedColor);
  
  function setupCounterControls() {
      const plus = document.querySelector('.fa-plus');
      const minus = document.querySelector('.fa-minus');
  
      if (plus) {
          plus.addEventListener('click', () => {
              countNumber += 1;
              if (count) count.textContent = countNumber;
              updatePriceDisplay();
          });
      }
  
      if (minus) {
          minus.addEventListener('click', () => {
              if (countNumber > minimum) {
                  countNumber -= 1;
                  if (count) count.textContent = countNumber;
                  updatePriceDisplay();
              }
          });
      }
  }
  const uploadedElements = [];
  function saveLogosToStorage() {
    const logos = uploadedElements.map((element) => {
        if (element.type === 'image') {
            return {
                type: element.type,
                id: element.id,
                url: element.url,
                properties: element.properties,
            };
        } else if (element.type === 'text') {
            return {
                type: element.type,
                id: element.id,
                content: element.content,
                properties: element.properties,
            };
        }
    });

    // Save logos array to localStorage or any other storage
    localStorage.setItem('logos', JSON.stringify(logos));
   
}
  function setupCanvas() {
      
      const imageInput = document.getElementById("imageInput");
      const textInput = document.getElementById("textInput");
      const addTextButton = document.getElementById("addTextButton");
      const deleteButton = document.getElementById("deleteButton");
      
  
      let priceRanges = null; // Global variable to store price ranges

// Function to fetch price ranges
function fetchPriceRanges() {
    return fetch('https://custmize.digitalgo.net/api/size_calculate_new_factor')
        .then(response => response.json())
        .then(data => {
            if (!data.success) throw new Error('Failed to fetch price ranges');
            return data.data;
        })
        .catch(error => {
            console.error("Error fetching price ranges:", error);
        });
}

// Fetch price ranges on initialization
fetchPriceRanges().then(ranges => {
    priceRanges = ranges;
});

canvas.on('object:scaling', (e) => {
    const activeObject = e.target;

    if (activeObject && priceRanges) {
        // Calculate scaled width and height
        let width = activeObject.width * activeObject.scaleX;
        let height = activeObject.height * activeObject.scaleY;
        width = width/10;
        height = height/10;
        // Calculate area
        const area = width * height * 0.5;

        // Extract price ranges
        const priceLessEqual3 = parseFloat(priceRanges.price_less_equal_3);
        const price3to8 = parseFloat(priceRanges.price_3_to_8);
        const price8to15 = parseFloat(priceRanges.price_8_to_15);
        const price15to21 = parseFloat(priceRanges.price_15_to_21);
        const price21to30 = parseFloat(priceRanges.price_21_to_30);

        let calculatedPrice;

        // Determine the price based on ranges
        if (area <= 3) {
            calculatedPrice = priceLessEqual3;
        } else if (area > 3 && area <= 8) {
            calculatedPrice = price3to8;
        } else if (area > 8 && area <= 15) {
            calculatedPrice = price8to15;
        } else if (area > 15 && area <= 21) {
            calculatedPrice = price15to21;
        } else if (area > 21 && area <= 30) {
            calculatedPrice = price21to30;
        } else {
            // Use formula for "price_greater_30"
           /*  calculatedPrice = eval(priceRanges.price_greater_30.replace('width', width).replace('length', height));
            calculatedPrice = calculatedPrice.toFixed(0); */
            calculatedPrice = parseFloat(area);
        }

        

        // Update the price for this specific object
        logoPrices.set(activeObject.id, calculatedPrice);
        updatePriceDisplay();
    }
});

    
    
          
       // Add album images to canvas on click
   // Add event listeners to each album item
   const albumItems = document.querySelectorAll(".album-item");

   albumItems.forEach((item) => {
       item.addEventListener("click", (event) => {
           event.preventDefault();
   
           // Extract the updated image URL
           const bgImage = item.querySelector("div").style.backgroundImage;
           const imageUrl = bgImage.slice(5, -2); // Extract URL from 'url("")'
   
           // Create a new image element for Fabric.js
           const imageElement = document.createElement("img");
   
           // Set the crossOrigin attribute to handle cross-origin images
           imageElement.crossOrigin = "anonymous"; // This allows the image to be used in the canvas
   
           imageElement.src = imageUrl;
           imageElement.style.width ="30px";
           imageElement.style.height ="30px";
           imageElement.onload = function () {
               const image = new fabric.Image(imageElement);
   
               image.set({
                   left: 0,
                   top: 0,
                   scaleY: 0.3,
                   scaleX: 0.3,
               });
   
               // Assign a unique ID for tracking prices
               image.id = `img_${Date.now()}`;
               logoPrices.set(image.id, 3); // Initialize price
               
               canvas.add(image);
               canvas.centerObject(image);
               canvas.setActiveObject(image);
               updatePriceDisplay();
               // Save image details for later use
               uploadedElements.push({
                   type: "image",
                   id: image.id,
                   url: imageUrl,
                   properties: {
                       left: image.left,
                       top: image.top,
                       scaleY: image.scaleY,
                       scaleX: image.scaleX,
                   },
               });
           };
   
           // Handle image loading errors
           imageElement.onerror = function () {
               console.error("Failed to load the image from: ", imageUrl);
           };
       });
   });
   

    let alertShown = false;
      imageInput.addEventListener("change", (e) => {
        if (!alertShown) {
            alert('يرجى استخدام صورة بخلفية شفافة');
            alertShown = true; // Set the flag to true after showing the alert
        }
          const imgObj = e.target.files[0];
          if (imgObj) {
              const reader = new FileReader();
              reader.onload = (e) => {
                  const imageUrl = e.target.result;
                  const imageElement = document.createElement("img");
                  imageElement.src = imageUrl;
                  imageElement.style.width ="30px";
                  imageElement.style.height ="30px";

                  imageElement.onload = function () {
                      const image = new fabric.Image(imageElement);
                      image.set({
                          left: 0,
                          top: 0,
                          scaleY: 0.055,
                          scaleX: 0.05,
                      });
  
                      // Assign a unique ID for tracking prices
                      image.id = `img_${Date.now()}`;
                      logoPrices.set(image.id, 3); // Initialize with no price
                      
                      canvas.add(image);
                      canvas.centerObject(image);
                      canvas.setActiveObject(image);
                      updatePriceDisplay();
                      uploadedElements.push({
                        type: 'image',
                        id: image.id,
                        url: imageUrl, // Save image URL for later use
                        properties: {
                            left: image.left,
                            top: image.top,
                            scaleY: image.scaleY,
                            scaleX: image.scaleX,
                        }
                    });
                  };
              };
  
              reader.readAsDataURL(imgObj);
          }
      });
  
      
      /* const addTextButton = document.querySelector('#addTextButton'); // Button to add text */
      const colorPicker = document.querySelector('input[type="color"]'); // Color picker
      
      addTextButton.addEventListener('click', () => {
          const editor = document.querySelector('.editor');
          const styledHTML = editor.innerHTML.trim();
      
          if (styledHTML) {
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = styledHTML;
      
              let topPosition = 50;
      
              Array.from(tempDiv.childNodes).forEach((node) => {
                  // Default styles
                  let color = 'blue'; // Default color
                  let fontFamily = 'Arial'; // Default font family
                  let fontWeight = 'normal'; // Default font weight
                  let fontStyle = 'normal'; // Default font style
                  let textDecoration = 'none'; // Default text decoration
      
                  // Check if the node has nested tags
                  const tempNodeHTML = node.outerHTML || node.textContent;
                  if (tempNodeHTML.includes('<b>') || tempNodeHTML.includes('<strong>')) {
                      fontWeight = 'bold';
                  }
                  if (tempNodeHTML.includes('<i>') || tempNodeHTML.includes('<em>')) {
                      fontStyle = 'italic';
                  }
                  if (tempNodeHTML.includes('<u>')) {
                      textDecoration = 'underline';
                  }
      
                  // Check for inline styles or nested attributes
                  const extractStyles = (element) => {
                      if (element.getAttribute) {
                          const nodeColor = element.getAttribute('color');
                          const nodeFontFamily = element.getAttribute('face');
      
                          if (nodeColor) color = nodeColor;
                          if (nodeFontFamily) fontFamily = nodeFontFamily;
                      }
      
                      // Recursively check child nodes for additional styles
                      Array.from(element.childNodes).forEach((childNode) => {
                          extractStyles(childNode);
                      });
                  };
      
                  extractStyles(node); // Extract styles recursively
      
                  // Create a fabric.js Text object with the extracted styles
                  const textObject = new fabric.Text(node.textContent.trim(), {
                      left: 50,
                      top: topPosition,
                      fontSize: 16,
                      fill: color, // Apply extracted color
                      fontFamily: fontFamily, // Apply extracted font family
                      fontWeight: fontWeight, // Apply extracted font weight
                      fontStyle: fontStyle, // Apply extracted font style
                      underline: textDecoration === 'underline', // Set underline
                  });
      
                  textObject.id = `text_${Date.now()}`; // Assign a unique ID
                  logoPrices.set(textObject.id, 3); // Initialize price for the text object
                  canvas.add(textObject);
                  canvas.setActiveObject(textObject); // Set the new text object as active
                  updatePriceDisplay();
      
                  // Automatically sync the color picker with the text color
                  colorPicker.value = textObject.fill;
      
                  // Add the text object properties to uploadedElements
                  uploadedElements.push({
                      type: 'text',
                      id: textObject.id,
                      content: node.textContent.trim(), // Save text content
                      properties: {
                          left: textObject.left,
                          top: textObject.top,
                          fontSize: textObject.fontSize,
                          fill: textObject.fill,
                          fontFamily: textObject.fontFamily,
                          fontWeight: textObject.fontWeight,
                          fontStyle: textObject.fontStyle,
                          underline: textObject.underline,
                      }
                  });
      
                  topPosition += 30; // Update position for the next text object
              });
      
              updatePriceDisplay();
          } else {
              alert('Please enter some text in the editor.');
          }
      });
      
      // Add event listener for the color picker to dynamically update text color
      colorPicker.addEventListener('input', (event) => {
          const selectedColor = event.target.value; // Get the selected color
      
          // Get the currently active fabric.js object
          const activeObject = canvas.getActiveObject();
      
          if (activeObject && activeObject.type === 'text') {
              activeObject.set('fill', selectedColor); // Update the text color
              canvas.renderAll(); // Re-render the canvas to apply changes
          }
      });
// Add event listeners for the bold, italic, and underline buttons
document.querySelector('#boldButton').addEventListener('click', () => {
    toggleStyle('fontWeight', 'bold', 'normal'); // Toggle bold
});

document.querySelector('#italicButton').addEventListener('click', () => {
    toggleStyle('fontStyle', 'italic', 'normal'); // Toggle italic
});

document.querySelector('#underlineButton').addEventListener('click', () => {
    toggleStyle('underline', true, false); // Toggle underline
});

// Add event listener for the font family dropdown
document.querySelector('#fontFamilyDropdown').addEventListener('change', (event) => {
    updateFontFamily(event.target.value); // Update font family
});

// Function to toggle styles
function toggleStyle(styleProperty, activeValue, defaultValue) {
    const activeObject = canvas.getActiveObject(); // Get the active object on the canvas

    if (activeObject && activeObject.type === 'text') {
        // Check the current value of the property and toggle
        const currentValue = activeObject.get(styleProperty);
        activeObject.set(styleProperty, currentValue === activeValue ? defaultValue : activeValue);

        canvas.renderAll(); // Re-render the canvas to apply changes
    } else {
        alert('Please select a text object to apply the style.');
    }
}

// Function to update font family
function updateFontFamily(fontFamily) {
    const activeObject = canvas.getActiveObject(); // Get the active object on the canvas

    if (activeObject && activeObject.type === 'text') {
        activeObject.set('fontFamily', fontFamily); // Set the new font family
        canvas.renderAll(); // Re-render the canvas to apply changes
    } else {
        alert('Please select a text object to change the font family.');
    }
}

// Create the tooltip div
const tooltip = document.createElement('div');
tooltip.style.position = 'absolute';
tooltip.style.background = 'linear-gradient(135deg, #2c3e50, #4ca1af)';
tooltip.style.color = '#ffffff';
tooltip.style.padding = '8px 12px';
tooltip.style.borderRadius = '8px';
tooltip.style.fontSize = '13px';
tooltip.style.display = 'none';
tooltip.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
tooltip.style.pointerEvents = 'none';
tooltip.style.fontFamily = 'Arial, sans-serif';
tooltip.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
tooltip.style.opacity = '0.95';
tooltip.style.zIndex = '9999';

document.body.appendChild(tooltip);


canvas.on('mouse:over', function(event) {
    if (event.target) {
        const obj = event.target;
        const width = Math.round(obj.getScaledWidth()* 0.087) ;
        const height = Math.round(obj.getScaledHeight()*0.087) ;

        tooltip.innerHTML = `Width: ${width}cm <br> Height: ${height}cm`;
        tooltip.style.display = 'block';
    }
});

canvas.on('mouse:move', function(event) {
    if (tooltip.style.display === 'block') {
        tooltip.style.left = `${event.e.pageX + 10}px`;
        tooltip.style.top = `${event.e.pageY + 10}px`;
    }
});

canvas.on('mouse:out', function() {
    tooltip.style.display = 'none';
});
canvas.on('object:scaling', function(event) {
    const obj = event.target;
    if (obj) {
        const width = Math.round(obj.getScaledWidth() * 0.087);
        const height = Math.round(obj.getScaledHeight() * 0.087);

        tooltip.innerHTML = `Width: ${width}cm <br> Height: ${height}cm`;
        tooltip.style.display = 'block';

        // Optional: Move tooltip near the object being scaled
        const bound = obj.getBoundingRect();
        tooltip.style.left = `${bound.left + bound.width + 10}px`;
        tooltip.style.top = `${bound.top}px`;
    }
});

canvas.on('object:scaled', function(event) {
    // Hide the tooltip when resizing is done, optional
    tooltip.style.display = 'none';
});


      
    
  // Delete button handler: Removes the object and updates `logoPrices`
// Delete button event listener: Removes active object and updates logoPrices
// Delete button event listener: Removes active object and updates logoPrices
deleteButton.addEventListener("click", () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
        // Remove the object from the canvas
        canvas.remove(activeObject);

        // If the object has an `id`, remove its entry from `logoPrices`
        if (activeObject.id) {
            logoPrices.delete(activeObject.id);
            // Save the updated logoPrices to localStorage
            localStorage.setItem('logoprices', JSON.stringify(Array.from(logoPrices.entries())));
            
            // Immediately update the display
            updatePriceDisplay();
        }
    } else {
        alert("No item selected to delete!");
    }
});

// Your existing click event
deleteButton.addEventListener("click", deleteActiveObject);

// Also listen for Delete key
document.addEventListener("keydown", (e) => {
    if (e.key === "Delete") {
        deleteActiveObject();
    }
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Backspace") {
        deleteActiveObject();
    }
});

// Extract the logic into a reusable function
function deleteActiveObject() {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
        canvas.remove(activeObject);

        if (activeObject.id) {
            logoPrices.delete(activeObject.id);
            localStorage.setItem('logoprices', JSON.stringify(Array.from(logoPrices.entries())));
            updatePriceDisplay();
        }
    } else {
        alert("No item selected to delete!");
    }
}

// Save canvas function: Serializes the canvas along with `id` and prices into localStorage
const saveCanvas = (side) => {
    // Serialize the canvas to JSON, including custom `id`
    const canvasData = canvas.toJSON();
    
    // Save the JSON string to localStorage or database
    const canvasJSON = JSON.stringify(canvasData);
    sessionStorage.setItem(`${side}`, canvasJSON);
    
   /*  console.log("Canvas saved:", canvasJSON); */
    
    // Save `logoPrices` to sessionStorage
    sessionStorage.setItem('logoprices', JSON.stringify(Array.from(logoPrices.entries())));
};

// Load canvas function: Restores the canvas and updates `logoPrices` from localStorage
const loadCanvas = (side) => {
    const canvasJSON = sessionStorage.getItem(`${side}`);
    /* console.log(side); */
    if (canvasJSON) {
        // Parse the JSON string and load it into the canvas
        canvas.loadFromJSON(JSON.parse(canvasJSON), () => {
            canvas.renderAll(); // Render the canvas after loading
            console.log(canvas.getObjects());
            /* console.log("Canvas loaded successfully"); */

            // Restore `logoPrices` from sessionStorage
            const storedMap = sessionStorage.getItem('logoprices');
            console.log(typeof(storedMap));
            if (storedMap) {
                // Parse the stored logoPrices Map and convert it to a Map object
                logoPrices = new Map(JSON.parse(storedMap));
               /*  console.log("logoPrices restored:", Array.from(logoPrices.entries())); */
                
                // Ensure the display updates immediately after restoring prices
                updatePriceDisplay();
            } else {
                // Set default prices if no saved prices exist
                canvas.getObjects().forEach((obj) => {
                    if (obj.id) {
                        logoPrices.set(obj.id, 3); // Default price
                    }
                });
                
                // Ensure the display updates immediately after setting default prices
                updatePriceDisplay();
            }
        });
    } else {
        alert("No saved canvas found!");
    }
};


// Ensure `id` is included during serialization
fabric.Object.prototype.toObject = (function (toObject) {
    return function () {
        return fabric.util.object.extend(toObject.call(this), {
            id: this.id,
             // Include `id` in the JSON representation
        });
    };
})(fabric.Object.prototype.toObject);

fabric.Text.prototype.toObject = (function (toObject) {
    return function () {
        return fabric.util.object.extend(toObject.call(this), {
            text: this.text, // Ensure text is saved
            fontWeight: this.fontWeight, // Save font weight (e.g., bold)
            fontStyle: this.fontStyle, // Save font style (e.g., italic)
            underline: this.underline, // Save underline property
            fontFamily: this.fontFamily, // Save font family
            fontSize: this.fontSize, // Save font size
        });
    };
})(fabric.Text.prototype.toObject);
 
const toggelers = document.querySelectorAll('.toggelers p');
// Convert NodeList to an array for easier manipulation
const toggelersArray = Array.from(toggelers);
// Track the currently active toggler
let activeToggler = null;
// Function to handle toggler clicks
function handleTogglerClick(toggeler) {
    const currentTogglerKey = toggeler.textContent; // Use the current toggler's text content as the key

    /* console.log(`Clicked toggler: ${currentTogglerKey}`); */

    // Save the current canvas content under the active toggler's name
    if (activeToggler) {
        const activeTogglerKey = activeToggler.textContent;
        saveCanvas(activeTogglerKey); // Save the canvas for the previous toggler
        /* console.log(`Saved canvas for previous toggler: ${activeTogglerKey}`); */
    }

    // Clear the canvas
    canvas.clear();
    /* console.log('Canvas cleared.'); */

    // Check if there is content for the current toggler and load it
    let canvasJSON = sessionStorage.getItem(currentTogglerKey);
    if (canvasJSON) {
        canvasJSON = JSON.parse(canvasJSON); // Parse the saved JSON
        loadCanvas(currentTogglerKey); // Load the canvas for the current toggler
        /* console.log(`Loaded canvas for toggler: ${currentTogglerKey}`); */
    } else {
        console.log(`No saved canvas data for toggler: ${currentTogglerKey}`);
    }

    // Update the active toggler to the current one
    activeToggler = toggeler;
}
console.log(canvas.getObjects());
// Attach click event listeners to all togglers
toggelersArray.forEach((toggeler) => {
    toggeler.addEventListener('click', () => handleTogglerClick(toggeler));
});

// Simulate a click on the first toggler when the page loads
window.onload = () => {
    console.log("Page loaded. Restoring data...");
    updateCartCount();
    console.log('loding the counter ')
  /* 
    const storedMap = localStorage.getItem('logoprices');
    if (storedMap) {
        logoPrices = new Map(JSON.parse(storedMap));
        console.log("logoPrices restored:", Array.from(logoPrices.entries()));
        console.log(logoPrices);
        // Update the price display to reflect the restored prices
        updatePriceDisplay();
        loadCanvas('Right');
    } else {
        console.log("No stored logoPrices found. Initializing empty prices.");
        logoPrices = new Map(); // Initialize with an empty map
    } */

    // Simulate a click on the first toggler to load the corresponding canvas
    if (toggelersArray.length > 0) {
        toggelersArray[0].click();/*
        console.log('Default toggler clicked.');*/
        /* updatePriceDisplay() ; */
    } else {
        console.log("No togglers found to click.");
    }
};



  }

  
 /*  function showPopup() {
    if (!confirm("اضغط على موافق للدفع الآن\nاضغط على إلغاء لمواصلة التسوق.")) {
      window.location.href = "index.html";
    }
  } */
  /* function showPopup1() {
    const token = localStorage.getItem('accessToken');
    if(!token){
        if (confirm("اضغط على موافق لتسجيل الدخول .\nاضغط على إلغاء لمواصلة التسوق كزائر.")) {
            window.location.href = "login.html";
          }else{
              window.location.href = "Cart.html";
          }
    }else{
        window.location.href = "Cart.html";
    }
    
  } */
 
  const toggelers1 = document.querySelectorAll('.toggelers p');
  const canvasContainer1 = document.getElementById('tshirt-div'); // Update if your canvas is wrapped in a container
  let images = [];
  
  console.log(canvas.getObjects());
  async function imagecollector() {
    const toggelers = document.querySelectorAll('.toggelers p');
    images = [];
    try {
        // Iterate over each toggler
        for (const toggler of toggelers) {
            toggler.click();
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait for the content to update

            // Store the original visibility state of the labels
            const labelVisibilityStates = [];

            canvas.getObjects().forEach(obj => {
                if (obj.type === 'group') {
                    const textObj = obj._objects.find(o => o.type === 'text' && o.text.includes('px'));
                    if (textObj) {
                        // Store the original visibility state and hide the label
                        labelVisibilityStates.push({ obj: textObj, visible: textObj.visible });
                        textObj.set({ visible: false }); // Hide the label
                    }
                }
            });

            canvas.renderAll(); // Update the canvas to reflect the changes

            // Wait a short delay to ensure the canvas is fully rendered
            await new Promise(resolve => setTimeout(resolve, 100));

            // Capture screenshot using html2canvas
            const dataURL = await html2canvas(canvasContainer, { useCORS: true }).then(canvas => {
                return canvas.toDataURL("image/png");
            });
            images.push(dataURL); // Store the captured image
            console.log(images);

            // After capturing, restore the visibility of the labels
            canvas.getObjects().forEach(obj => {
                if (obj.type === 'group') {
                    const textObj = obj._objects.find(o => o.type === 'text' && o.text.includes('px'));
                    if (textObj) {
                        // Restore the original visibility state
                        const labelState = labelVisibilityStates.find(state => state.obj === textObj);
                        if (labelState) {
                            textObj.set({ visible: labelState.visible });
                        }
                    }
                }
            });

            canvas.renderAll(); // Re-render the canvas after restoring the labels
        }

        return images; // Return the array of images
    } catch (error) {
        console.error("An error occurred:", error);
    }
}


let sidesData = [];
async function convertTextToDataURL(text, fontSize, fontFamily, fillColor) {
    // Fixed canvas size
    const canvasWidth = 300;
    const canvasHeight = 100;

    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d");

    // Set desired font
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = fillColor;
    ctx.fontFamily = fontFamily;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    // Optional: Scale text to fill canvas width
    const measuredWidth = ctx.measureText(text).width;
    const scaleFactor = canvasWidth / measuredWidth * 0.8; // 0.8 gives padding
    const adjustedFontSize = fontSize * scaleFactor;

    // Apply scaled font
    ctx.font = `${adjustedFontSize}px ${fontFamily}`;

    // Draw text in center
    ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);

    // Trigger download
     const dataURL = canvas.toDataURL();
     /*
    console.log('this is your data url ',dataURL);
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "text-image.png";
    link.click();
 */
    return dataURL;
}

        
        async function extractLogosAndText() {
            const toggelers = document.querySelectorAll('.toggelers p');
            const allTogglersData = {}; // To store data per toggler
        
            for (const toggler of toggelers) {
                const canvasJSON = localStorage.getItem(`${toggler.textContent}`);
                
                if (canvasJSON) {
                    const parsedData = JSON.parse(canvasJSON); // Convert string to object
                    if (!parsedData.objects) continue; // Skip if no objects
        
                    const logos = [];
                    const texts = [];
        
                    for (const obj of parsedData.objects) {
                        const width = (obj.width * 0.087 * obj.scaleX).toFixed(2);
                        const height = (obj.height * 0.087 * obj.scaleY).toFixed(2);
                        const size = `${width} * ${height}`;
        
                        if (obj.type === "image") {
                            logos.push({ url: obj.src, size });
                        } else if (obj.type === "text") {
                            // Convert text to data URL and include font size, family, and color
                            const textDataURL = await convertTextToDataURL(
                                obj.text,
                                obj.fontSize || 30,
                                obj.fontFamily || "Arial", // Use the font family from the object, default to Arial
                                obj.fill || "#000" // Use the fill color from the object, default to black
                            );
                            logos.push({ url: textDataURL, size });
                        }
                    }
        
                    // Save the data for each toggler
                    allTogglersData[toggler.textContent] = { logos };
                }
            }
        
            /* console.log(allTogglersData); */
            return allTogglersData;
        }

 async  function  saveToLocalStorage() {
    showLoader() 
    const toggelers = document.querySelectorAll('.toggelers p');
      await imagecollector();
      let allTogglersData = await extractLogosAndText()
      const toggelersArray = Array.from(toggelers);
      toggelersArray[0].click();
        const node = document.getElementById('tshirt-div'); 
        html2canvas(node, { useCORS: true }).then(function (canvas) {
            toggelersArray[0].click();
            // Convert the canvas to a data URL
            const dataUrl = canvas.toDataURL("image/png");

        // Retrieve existing images from local storage if available
        let tshirtImages = JSON.parse(localStorage.getItem('tshirtImages')) || [];
        let prices = JSON.parse(localStorage.getItem('fruits')) || [];

        // Add the new image to the array
       /*  tshirtImages.push(dataUrl); */
       let selectedSize = {};
       let selectedColor = {};
       let ProductInfo = {};
       
       try {
           selectedSize = JSON.parse(localStorage.getItem('selectedSize')) || {};
           selectedColor = JSON.parse(localStorage.getItem('selectedColor')) || {};
           ProductInfo = JSON.parse(localStorage.getItem('ProductInfo')) || {};
       } catch (error) {
           console.log('Error reading from localStorage:', error);
       }
        
        
        const defaultColor = JSON.parse(localStorage.getItem('defaultColor')) || {};
       
        let external_id = localStorage.getItem('external_id');
        let default_code = localStorage.getItem('default_code');
        let slug = localStorage.getItem('selectedSlug');
        let wearHouseTitle = localStorage.getItem('wearHouseTitle');
        localStorage.setItem('fruits', JSON.stringify(prices));
        /* localStorage.setItem('tshirtImages', JSON.stringify(tshirtImages)); */

       /*  tshirtImages = JSON.parse(localStorage.getItem('tshirtImages')) || []; */
        let priceForColorSize = priceCounter - (mainPrice * countNumber);
        
        localStorage.setItem('full_price', JSON.stringify(priceCounter));
        localStorage.setItem('initial_Price', JSON.stringify(mainPrice));
        localStorage.setItem('quantity', JSON.stringify(countNumber));
        localStorage.setItem('Price_for_color_size', JSON.stringify(priceForColorSize));
        

        const newOrder =  {
            product_id: slug, // Placeholder, replace with your product ID logic
            product_name: wearHouseTitle, // Placeholder, replace with your product name logic
            color_id: selectedColor.id || defaultColor,
            size_id: selectedSize.id || defaultColor.sizes?.[0]?.size_id || 'None',
            quantity: countNumber,
            default_code:default_code,
            external_id:external_id,
            price_without_size_color_price: mainPrice,
            price_for_size_color_price: priceForColorSize,
            full_price: priceCounter,
            front_image: {
                url: images[0] || tshirtImages[0] || "",
                logos: allTogglersData.Front || [] // Ensure it's an array of objects
            },
            back_image: {
                url: images[1] || selectedColor.back_image || "",
                logos: allTogglersData.Back || []
            },
            right_side_image: {
                url: images[2] || selectedColor.right_side_image || "",
                logos: allTogglersData.Right || []
            },
            left_side_image: {
                url: images[3] || selectedColor.left_side_image || "",
                logos: allTogglersData.Left || []
            }
        };
        
        console.log("images length is :",images.length);
        const newOrder1 = {
            product_id: slug, // Placeholder, replace with your product ID logic
            product_name: wearHouseTitle, // Placeholder, replace with your product name logic
            color: selectedColor.name || defaultColor,
            size_id: selectedSize.size_name || null,
            quantity: countNumber,
            price_without_size_color_price: mainPrice,
            price_for_size_color_price: priceForColorSize,
            full_price: priceCounter,
            front_image: images[0] || "",
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
        hideLoader()
        /* alert('تم حفظ طلبك تحقق من سلة التسوق'); */
        showPopup()
        // Clear the stored images
        /* tshirtImages = [];
        localStorage.setItem('tshirtImages', JSON.stringify(tshirtImages)); */

        saveLogosToStorage();

        // Log the cart data
        function logCartData() {
            const cartData = localStorage.getItem('cartData'); // Retrieve cart data from localStorage

            if (cartData) {
                const parsedCart = JSON.parse(cartData); // Parse the JSON string into an object
                console.log("Cart Data:", parsedCart); // Log the entire cart object

                // Optionally, log specific details for better readability
                if (parsedCart.cart && parsedCart.cart.orders) {
                    console.log("Orders in Cart:");
                    parsedCart.cart.orders.forEach((order, index) => {
                        console.log(`Order ${index + 1}:`, order);
                    });
                } else {
                    console.warn("Cart data is missing expected structure.");
                }
            } else {
                console.warn("No cart data found in localStorage.");
            }
        }

        logCartData();
        updateCartCount();
    }).catch(function (error) {
        console.error('oops, something went wrong!', error);
    });
}
function showLoader() {
    document.getElementById('loader').style.display = 'flex';
}
function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}




async  function  saveToLocalStorage1() {
    showLoader() 
    const toggelers = document.querySelectorAll('.toggelers p');
    await imagecollector();
    let allTogglersData = await extractLogosAndText()
    const toggelersArray = Array.from(toggelers);
    toggelersArray[0].click();
      const node = document.getElementById('tshirt-div'); 
      html2canvas(node, { useCORS: true }).then(function (canvas) {
          toggelersArray[0].click();
          // Convert the canvas to a data URL
          const dataUrl = canvas.toDataURL("image/png");

      // Retrieve existing images from local storage if available
      let tshirtImages = JSON.parse(localStorage.getItem('tshirtImages')) || [];
      let prices = JSON.parse(localStorage.getItem('fruits')) || [];

      // Add the new image to the array
     /*  tshirtImages.push(dataUrl); */
     let selectedSize = {};
     let selectedColor = {};
     let ProductInfo = {};
     
     try {
         selectedSize = JSON.parse(localStorage.getItem('selectedSize')) || {};
         
         selectedColor = JSON.parse(localStorage.getItem('selectedColor')) || {};
         ProductInfo = JSON.parse(localStorage.getItem('ProductInfo')) || {};
     } catch (error) {
         console.log('Error reading from localStorage:', error);
     }
    
      
      const defaultColor = JSON.parse(localStorage.getItem('defaultColor')) || {};
      
      let external_id = localStorage.getItem('external_id');
      let default_code = localStorage.getItem('default_code');
      let slug = localStorage.getItem('selectedSlug');
      let wearHouseTitle = localStorage.getItem('wearHouseTitle');
      localStorage.setItem('fruits', JSON.stringify(prices));
      /* localStorage.setItem('tshirtImages', JSON.stringify(tshirtImages)); */

     /*  tshirtImages = JSON.parse(localStorage.getItem('tshirtImages')) || []; */
      let priceForColorSize = priceCounter - (mainPrice * countNumber);
      
      localStorage.setItem('full_price', JSON.stringify(priceCounter));
      localStorage.setItem('initial_Price', JSON.stringify(mainPrice));
      localStorage.setItem('quantity', JSON.stringify(countNumber));
      localStorage.setItem('Price_for_color_size', JSON.stringify(priceForColorSize));
      

      const newOrder =  {
          product_id: slug, // Placeholder, replace with your product ID logic
          product_name: wearHouseTitle, // Placeholder, replace with your product name logic
          color_id: selectedColor.id || defaultColor,
          size_id: selectedSize.id || defaultColor.sizes?.[0]?.size_id || 'None',
          quantity: countNumber,
          default_code:default_code,
          external_id:external_id,
          price_without_size_color_price: mainPrice,
          price_for_size_color_price: priceForColorSize,
          full_price: priceCounter,
          front_image: {
              url: images[0] || tshirtImages[0] || "",
              logos: allTogglersData.Front || [] // Ensure it's an array of objects
          },
          back_image: {
              url: images[1] || selectedColor.back_image || "",
              logos: allTogglersData.Back || []
          },
          right_side_image: {
              url: images[2] || selectedColor.right_side_image || "",
              logos: allTogglersData.Right || []
          },
          left_side_image: {
              url: images[3] || selectedColor.left_side_image || "",
              logos: allTogglersData.Left || []
          }
      };
      console.log('the selected size is ',newOrder);
      console.log("images length is :",images.length);
      const newOrder1 = {
          product_id: slug, // Placeholder, replace with your product ID logic
          product_name: wearHouseTitle, // Placeholder, replace with your product name logic
          color: selectedColor.name || defaultColor,
          size_id: selectedSize.size_name || null,
          quantity: countNumber,
          price_without_size_color_price: mainPrice,
          price_for_size_color_price: priceForColorSize,
          full_price: priceCounter,
          front_image: images[0] || "",
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
      hideLoader()
      showPopup1()
      // Clear the stored images
      /* tshirtImages = [];
      localStorage.setItem('tshirtImages', JSON.stringify(tshirtImages)); */

      saveLogosToStorage();

      // Log the cart data
      function logCartData() {
          const cartData = localStorage.getItem('cartData'); // Retrieve cart data from localStorage

          if (cartData) {
              const parsedCart = JSON.parse(cartData); // Parse the JSON string into an object
              console.log("Cart Data:", parsedCart); // Log the entire cart object

              // Optionally, log specific details for better readability
              if (parsedCart.cart && parsedCart.cart.orders) {
                  console.log("Orders in Cart:");
                  parsedCart.cart.orders.forEach((order, index) => {
                      console.log(`Order ${index + 1}:`, order);
                  });
              } else {
                  console.warn("Cart data is missing expected structure.");
              }
          } else {
              console.warn("No cart data found in localStorage.");
          }
      }

      logCartData();
      updateCartCount();
  }).catch(function (error) {
      console.error('oops, something went wrong!', error);
  });
}



// Get the button and the file input
const triggerButton = document.getElementById('triggerButton');
const imageInput = document.getElementById('imageInput');

// Add click event listener to the button
triggerButton.addEventListener('click', () => {
    imageInput.click(); // Trigger the file input
});

window.addEventListener('DOMContentLoaded', (event) => {
  const loginLink = document.getElementById('loginLink');
  
  const userName = localStorage.getItem('userName');
  
  if (userName) {
      // If userName exists in localStorage, update the link to show the user's name
      loginLink.innerHTML = `<i class="fa-solid fa-user"></i> مرحبًا, ${userName}`;
      loginLink.setAttribute('href', 'Profile.html'); // Prevent navigation to login page
   
  }
});

/* window.onload = function() {
    updateCartCount();
    console.log('loding the counter ')
}; */

function updateCartCount() {
    // Retrieve the cartData1 object from localStorage
    const cartData1 = JSON.parse(localStorage.getItem('cartData1')) || { cart: { orders: [] } };
    const orders = cartData1.cart.orders || [];

    // Get the cart count element
    const cartCount = document.getElementById('cart-count');

    // Check if orders array has any items
    if (orders.length > 0) {
        // Show the red dot with the number of items
        cartCount.style.display = 'block';
        cartCount.textContent = orders.length;
        console.log(orders.length);
    } else {
        // Hide the red dot if no items
        cartCount.style.display = 'none';
    }
}


const imageSlider1 = document.querySelectorAll('.image-slider img'); // Get all images inside the imageSlider
           console.log('the image slider is ',imageSlider1)
            imageSlider1.forEach((img) => {
                img.addEventListener('click', () => {
                    const imageUrl = img.src; // Get the source of the clicked image
                    document.getElementById('image').src = imageUrl; 
                    console.log(imageUrl);// Change the main product image to the clicked image
                });
            });

            function waitForPreviewContainer(callback) {
                const observer = new MutationObserver((mutationsList, observer) => {
                    const node = document.querySelector('.preview-container');
                    if (node) {
                        observer.disconnect(); // Stop observing once found
                        callback(node);
                    }
                });
            
                observer.observe(document.body, { childList: true, subtree: true });
            }
            
            function downloadImage() {
                document.getElementById('preview').click();
            
                waitForPreviewContainer((node) => {
                    console.log(node);
            
                    html2canvas(node, { useCORS: true }).then((canvas) => {
                        const dataUrl = canvas.toDataURL("image/png");
                        const link = document.createElement('a');
                        link.href = dataUrl;
                        link.download = 'custom-tshirt.png';
                        link.click();
                    });
                    
                });
            }
            
window.addEventListener('DOMContentLoaded', (event) => {
                const loginLink = document.getElementById('loginLink');
                
                const userName = localStorage.getItem('userName');
                
                if (userName) {
                    // If userName exists in localStorage, update the link to show the user's name
                    loginLink.innerHTML = `<i class="fa-solid fa-user"></i> Hello, ${userName}`;
                    loginLink.setAttribute('href', 'Profile.html'); // Prevent navigation to login page
                    
              
                }
              });


            document.getElementById("home-logo").addEventListener("click", function (event) {
                if (event.target === event.currentTarget) {
                    window.location.href = "index.html"; // Replace with your desired URL
                }
              });
const buyNow = document.getElementById('buyNow');
buyNow.addEventListener('click',async ()=>{
    
       await  saveToLocalStorage1()
    
       /*  setTimeout(()=>{window.location.href = "Cart.html";},500)  */
        
    }
)
const saveBtn = document.getElementById('saveBtn');
saveBtn.addEventListener('click',async ()=>{
    
       await  saveToLocalStorage()
    
       /*  setTimeout(()=>{window.location.href = "Cart.html";},500)  */
        
    }
)

/* const dbClear = document.getElementById('dbClear');
dbClear.addEventListener('click',async ()=>{
    
       await  clearIndexedDB ()
       getCartFromIndexedDB().then(cart => console.log(cart));
       ()=>(localStorage.clear());
       
        
    }
) */
const gallery = document.getElementById('albumModal');
const search = document.querySelector('.Logo_Library');
console.log(search);
const imgLibrary = document.getElementById('imgLibrary');
imgLibrary.addEventListener('click',()=>{
    gallery.classList.toggle('show');
    search.classList.toggle('show');
    console.log(search.classList);
    
})


const canvasContainer = document.getElementById('tshirt-div'); // Update if your canvas is wrapped in a container

document.getElementById('preview').addEventListener('click', async () => {
    const toggelers = Array.from(document.querySelectorAll('.toggelers p'))
    .filter(el => el.offsetParent !== null);
console.log('Visible toggelers are', toggelers);

  try {
    const images = [];

    for (const toggler of toggelers) {
      toggler.click(); // Simulate a click to load the content
      console.log(toggler.textContent);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for content to load

      // Use html2canvas to capture the content of the node (canvas container)
      const dataURL = await html2canvas(canvasContainer, { useCORS: true }).then((canvas) => {
        return canvas.toDataURL("image/png"); // Convert canvas to DataURL
      });
      images.push(dataURL);
    }

    // Create a preview container
    const previewContainer = document.createElement('div');
    previewContainer.className = 'preview-container';
    previewContainer.id='preview-container';
    previewContainer.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: white;
      padding: 20px;
      border: 1px solid #ddd;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    `;

    // Add a close button (X icon)
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';  // HTML character for "X"
    closeButton.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: none;
      border: none;
      font-size: 24px;
      color: #333;
      cursor: pointer;
    `;
    closeButton.addEventListener('click', () => {
      previewContainer.remove(); // Remove the preview container on click
    });
    previewContainer.appendChild(closeButton);

    // Add captured images to the preview container
    images.forEach((dataURL) => {
      const img = document.createElement('img');
      img.src = dataURL;
      img.style.cssText = 'max-width: 250px; max-height: 250px;';
      previewContainer.appendChild(img);
    });

    // Append the preview container to the body
    document.body.appendChild(previewContainer);
  } catch (error) {
    console.error("An error occurred:", error);
  }
});
document.getElementById('downloadBtn').addEventListener('click', downloadImage);



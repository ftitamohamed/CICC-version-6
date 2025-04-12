import { saveCartToIndexedDB, getCartFromIndexedDB,clearIndexedDB } from "./indexedDBHelper.js";
const slider = document.getElementById("imageSlider");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const canvasElement = document.getElementById("canvas");
     
const canvas = new fabric.Canvas(canvasElement);
  
let currentIndex = 0;
let counter = 0;
/* clearIndexedDB (); */
getCartFromIndexedDB().then(cart => console.log(cart));
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

const draggableDiv = document.getElementById("draggableDiv");

// Variables for dragging
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

// Mouse down: Start dragging
draggableDiv.addEventListener("mousedown", (event) => {
    isDragging = true;

    // Calculate offset for dragging
    offsetX = event.clientX - draggableDiv.offsetLeft;
    offsetY = event.clientY - draggableDiv.offsetTop;

    // Add event listeners for dragging
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
});

// Handle dragging
function onMouseMove(event) {
    if (!isDragging) return;

    // Update position of the div during dragging
    const x = event.clientX - offsetX;
    const y = event.clientY - offsetY;

    draggableDiv.style.position = "absolute"; // Ensure it's positioned absolutely
    draggableDiv.style.left = `${x}px`;
    draggableDiv.style.top = `${y}px`;
}

// Mouse up: Stop dragging
function onMouseUp() {
    isDragging = false;

    // Remove event listeners
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
}

// Handle scroll visibility
window.addEventListener("scroll", () => {
    const rect = draggableDiv.getBoundingClientRect();

    // Check if the Tracker section is leaving the viewport
    if (rect.top < 0 || rect.bottom > window.innerHeight) {
        draggableDiv.style.position = "fixed"; // Fix it to the viewport
        draggableDiv.style.top = "85%"; // Ensure it's always visible
        draggableDiv.style.left = `${rect.left}px`; // Maintain horizontal position
    } else if (!isDragging) {
        draggableDiv.style.position = "absolute"; // Allow it to be dragged
    }
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
      fetch('https://custmize.digitalgo.net/api/get_single_product/LHYSE33287')
          .then(response => response.json())
          .then(data => {
              if (data.success) {
                  mainPrice = parseFloat(data.data.main_price);
                  console.log(mainPrice);
                  localStorage.setItem('mainPrice', mainPrice);
                  minimum = parseInt(data.data.min_sale, 10);
  
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
            calculatedPrice = eval(priceRanges.price_greater_30.replace('width', width).replace('length', height));
            calculatedPrice = calculatedPrice.toFixed(0);
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
   
           // Extract background image URL from 'url("...")'
           const bgImage = item.querySelector("div").style.backgroundImage;
           const imageUrl = bgImage.slice(5, -2); // Remove url("...")
   
           // Use Fabric.js built-in loader with crossOrigin
           fabric.Image.fromURL(imageUrl, function (image) {
               image.set({
                   left: 0,
                   top: 0,
                   scaleX: 0.3,
                   scaleY: 0.3,
               });
   
               // Calculate scaled width and height
               const actualWidth = Math.round(image.width * 0.087* image.scaleX );
               const actualHeight = Math.round(image.height * 0.087* image.scaleY);
   
               // Create label text under the image
               const sizeText = new fabric.Text(`${actualWidth}×${actualHeight} cm`, {
                   fontSize: 14,
                   fill: '#333',
                   left: image.left,
                   top: image.top + image.getScaledHeight() + 5,
                   selectable: false,
                   evented: false,
               });
   
               // Group the image and the text label
               const group = new fabric.Group([image, sizeText], {
                   left: image.left,
                   top: image.top,
               });
   
               // Assign unique ID to the group
               group.id = `img_${Date.now()}`;
               logoPrices.set(group.id, 3); // Track price
   
               canvas.add(group);
               canvas.centerObject(group);
               canvas.setActiveObject(group);
   
               updatePriceDisplay();
   
               // Save element details
               uploadedElements.push({
                   type: "image",
                   id: group.id,
                   url: imageUrl,
                   properties: {
                       left: group.left,
                       top: group.top,
                       scaleX: image.scaleX,
                       scaleY: image.scaleY,
                       width: actualWidth,
                       height: actualHeight,
                   },
               });
   
           }, { crossOrigin: 'anonymous' }); // Enable cross-origin handling
       });
   });
   
   canvas.on('object:scaling', handleObjectUpdate);
   canvas.on('object:modified', handleObjectUpdate);
   
   function handleObjectUpdate(e) {
       const group = e.target;
   
       if (!group || group.type !== 'group') return;
   
       let image = null;
       let label = null;
   
       if (group._objects) {
           const images = group._objects.filter(obj => obj.type === 'image');
           const texts = group._objects.filter(obj => obj.type === 'text');
   
           if (images.length && texts.length) {
               image = images[0];
               label = texts.find(txt => txt !== image);
           }
       }
   
       if (group.textElement) {
           image = group.textElement;
           label = group._objects.find(obj => obj !== image && obj.type === 'text');
           
       }
   
       if (!image || !label) return;
   
       // Get scaled dimensions
       const actualWidth = Math.round(image.width * 0.087* image.scaleX );
       const actualHeight = Math.round(image.height * 0.087* image.scaleY);
   
       // Update label text
       label.text = `${actualWidth}×${actualHeight} cm`;
   
       // Keep label font size fixed
       label.scaleX = 1;
       label.scaleY = 1;
       label.fontSize = 14; // <-- Set your fixed font size here
       label.fontFamily = 'arial'; // <-- Set your fixed font size here
       label.fill = 'purple';

       // Reposition label below image
       label.top = image.top + image.getScaledHeight() ;
   
       group.addWithUpdate();
       canvas.requestRenderAll();
   }
   

    let alertShown = false;

imageInput.addEventListener("change", (e) => {
    if (!alertShown) {
        alert('يرجى استخدام صورة بخلفية شفافة');
        alertShown = true;
    }

    const imgObj = e.target.files[0];
    if (imgObj) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target.result;
            const imageElement = document.createElement("img");
            imageElement.src = imageUrl;
            imageElement.style.width = "30px";
            imageElement.style.height = "30px";

            imageElement.onload = function () {
                const image = new fabric.Image(imageElement);
                image.set({
                    left: 0,
                    top: 0,
                    scaleY: 0.055,
                    scaleX: 0.05,
                });

                // Calculate actual dimensions
            
                const actualWidth = Math.round(image.width * 0.087* image.scaleX );
               const actualHeight = Math.round(image.height * 0.087* image.scaleY);

                // Create size label
                const sizeText = new fabric.Text(`${actualWidth}×${actualHeight} cm`, {
                    fontSize: 14,
                    fill: '#333',
                    left: image.left,
                    top: image.top + image.getScaledHeight() + 5,
                    selectable: false,
                    evented: false,
                });

                // Group image + label
                const group = new fabric.Group([image, sizeText], {
                    left: image.left,
                    top: image.top,
                });

                // Assign ID and track price
                group.id = `img_${Date.now()}`;
                logoPrices.set(group.id, 3);

                canvas.add(group);
                canvas.centerObject(group);
                canvas.setActiveObject(group);
                updatePriceDisplay();

                // Save element info
                uploadedElements.push({
                    type: 'image',
                    id: group.id,
                    url: imageUrl,
                    properties: {
                        left: group.left,
                        top: group.top,
                        scaleY: image.scaleY,
                        scaleX: image.scaleX,
                        width: actualWidth,
                        height: actualHeight,
                    },
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
    
        if (!styledHTML) {
            alert('Please enter some text in the editor.');
            return;
        }
    
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = styledHTML;
        let topPosition = 50;
    
        Array.from(tempDiv.childNodes).forEach((node) => {
            let color = 'blue';
            let fontFamily = 'Arial';
            let fontWeight = 'normal';
            let fontStyle = 'normal';
            let textDecoration = 'none';
    
            const tempNodeHTML = node.outerHTML || node.textContent;
            if (tempNodeHTML.includes('<b>') || tempNodeHTML.includes('<strong>')) fontWeight = 'bold';
            if (tempNodeHTML.includes('<i>') || tempNodeHTML.includes('<em>')) fontStyle = 'italic';
            if (tempNodeHTML.includes('<u>')) textDecoration = 'underline';
    
            const extractStyles = (element) => {
                if (element.getAttribute) {
                    const nodeColor = element.getAttribute('color');
                    const nodeFontFamily = element.getAttribute('face');
                    if (nodeColor) color = nodeColor;
                    if (nodeFontFamily) fontFamily = nodeFontFamily;
                }
                Array.from(element.childNodes).forEach(extractStyles);
            };
    
            extractStyles(node);
    
            const textObject = new fabric.Text(node.textContent.trim(), {
                left: 50,
                top: topPosition,
                fontSize: 16,
                fill: color,
                fontFamily: fontFamily,
                fontWeight: fontWeight,
                fontStyle: fontStyle,
                underline: textDecoration === 'underline',
            });
    
            const actualWidth = Math.round(textObject.width * 0.087* textObject.scaleX);
            const actualHeight = Math.round(textObject.height * 0.087* textObject.scaleY);
    
            const sizeText = new fabric.Text(`${actualWidth}×${actualHeight} cm`, {
                fontSize: 12,
                fill: '#444',
                left: textObject.left,
                top: textObject.top + textObject.height + 5,
                selectable: false,
                evented: false,
            });
    
            const group = new fabric.Group([textObject, sizeText], {
                left: textObject.left,
                top: textObject.top,
            });
    
            // 🔁 Store reference to text object
            group.textElement = textObject;
    
            group.id = `text_${Date.now()}`;
            logoPrices.set(group.id, 3);
            canvas.add(group);
            canvas.setActiveObject(group);
            colorPicker.value = textObject.fill;
    
            uploadedElements.push({
                type: 'text',
                id: group.id,
                content: node.textContent.trim(),
                properties: {
                    left: group.left,
                    top: group.top,
                    fontSize: textObject.fontSize,
                    fill: textObject.fill,
                    fontFamily: textObject.fontFamily,
                    fontWeight: textObject.fontWeight,
                    fontStyle: textObject.fontStyle,
                    underline: textObject.underline,
                }
            });
    
            topPosition += 60; // Space between added text blocks
        });
    
        updatePriceDisplay();
    });
    
    // 🎨 Color picker live update
    colorPicker.addEventListener('input', (event) => {
        let activeObject = canvas.getActiveObject();
        if (activeObject?.type === 'group' && activeObject.textElement) {
            activeObject = activeObject.textElement;
        }
    
        if (activeObject?.type === 'text') {
            activeObject.set('fill', event.target.value);
            canvas.renderAll();
        }
    });
    
    // 🔡 Toggle functions
    document.querySelector('#boldButton').addEventListener('click', () => {
        toggleStyle('fontWeight', 'bold', 'normal');
    });
    document.querySelector('#italicButton').addEventListener('click', () => {
        toggleStyle('fontStyle', 'italic', 'normal');
    });
    document.querySelector('#underlineButton').addEventListener('click', () => {
        toggleStyle('underline', true, false);
    });
    
    // 🧵 Font family dropdown
    document.querySelector('#fontFamilyDropdown').addEventListener('change', (event) => {
        updateFontFamily(event.target.value);
    });
    
    // 📐 Toggle style utility
    function toggleStyle(styleProperty, activeValue, defaultValue) {
        let activeObject = canvas.getActiveObject();
    
        if (activeObject?.type === 'group' && activeObject.textElement) {
            activeObject = activeObject.textElement;
        }
    
        if (activeObject?.type === 'text') {
            const currentValue = activeObject.get(styleProperty);
            activeObject.set(styleProperty, currentValue === activeValue ? defaultValue : activeValue);
            canvas.renderAll();
        } else {
            alert('Please select a text object to apply the style.');
        }
    }
    
    // 🧷 Font family update utility
    function updateFontFamily(fontFamily) {
        let activeObject = canvas.getActiveObject();
    
        if (activeObject?.type === 'group' && activeObject.textElement) {
            activeObject = activeObject.textElement;
        }
    
        if (activeObject?.type === 'text') {
            activeObject.set('fontFamily', fontFamily);
            canvas.renderAll();
        } else {
            alert('Please select a text object to change the font family.');
        }
    }
    
      
    
canvas.on('object:scaling', updateTextLabel);
canvas.on('object:modified', updateTextLabel);

function updateTextLabel(e) {
    const group = e.target;

    // Check if it's a group with a text object
    if (group?.type === 'group' && group.textElement) {
        const textObject = group.textElement;
        const labelObject = group._objects.find(obj => obj !== textObject && obj.type === 'text');

        if (!labelObject) return;

        // Get scaled dimensions
        const actualWidth = Math.round(textObject.width * 0.087* textObject.scaleX);
        const actualHeight = Math.round(textObject.height * 0.087* textObject.scaleY);

        // Update label text and position
        labelObject.text = `${actualWidth}×${actualHeight}cm`;
        labelObject.top = textObject.top + textObject.getScaledHeight() -(textObject.getScaledHeight()*0.2)  ;

        group.addWithUpdate();
        canvas.requestRenderAll();
    }
} 







// Create the tooltip div
/* const tooltip = document.createElement('div');
tooltip.style.position = 'absolute';
tooltip.style.background = 'rgba(0, 0, 0, 0.7)';
tooltip.style.color = 'white';
tooltip.style.padding = '5px';
tooltip.style.borderRadius = '4px';
tooltip.style.fontSize = '12px';
tooltip.style.display = 'none';
document.body.appendChild(tooltip);

canvas.on('mouse:over', function(event) {
    if (event.target) {
        const obj = event.target;
        const width = Math.round(obj.getScaledWidth()) ;
        const height = Math.round(obj.getScaledHeight()) ;

        tooltip.innerHTML = `Width: ${width}cm <br> Height: ${height}cm`;
        tooltip.style.display = 'block';
    }
});

canvas.on('mouse:move', function(event) {
    if (tooltip.style.display === 'block') {
        tooltip.style.left = `${event.e.pageX + 10}cm`;
        tooltip.style.top = `${event.e.pageY + 10}cm`;
    }
});

canvas.on('mouse:out', function() {
    tooltip.style.display = 'none';
});
 */
      
    
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

// Save canvas function: Serializes the canvas along with `id` and prices into localStorage
const saveCanvas = (side) => {
    // Serialize the canvas to JSON, including custom `id`
    const canvasData = canvas.toJSON();
    
    // Save the JSON string to localStorage or database
    const canvasJSON = JSON.stringify(canvasData);
    localStorage.setItem(`${side}`, canvasJSON);
    
   /*  console.log("Canvas saved:", canvasJSON); */
    
    // Save `logoPrices` to localStorage
    localStorage.setItem('logoprices', JSON.stringify(Array.from(logoPrices.entries())));
};

// Load canvas function: Restores the canvas and updates `logoPrices` from localStorage
const loadCanvas = (side) => {
    const canvasJSON = localStorage.getItem(`${side}`);
    /* console.log(side); */
    if (canvasJSON) {
        // Parse the JSON string and load it into the canvas
        canvas.loadFromJSON(JSON.parse(canvasJSON), () => {
            canvas.renderAll(); // Render the canvas after loading
            console.log(canvas.getObjects());
            /* console.log("Canvas loaded successfully"); */

            // Restore `logoPrices` from localStorage
            const storedMap = localStorage.getItem('logoprices');
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
    let canvasJSON = localStorage.getItem(currentTogglerKey);
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
                    const textObj = obj._objects.find(o => o.type === 'text' && o.text.includes('cm'));
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
                    const textObj = obj._objects.find(o => o.type === 'text' && o.text.includes('cm'));
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
        async function convertTextToDataURL(text, fontSize = 30, fontFamily = "Arial", fillColor = "#000") {
            // Create an invisible canvas to draw the text
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
        
            // Set font and color
            ctx.font = `${fontSize}px ${fontFamily}`;
            ctx.fillStyle = fillColor; // Set the text color
            const textWidth = ctx.measureText(text).width;
            const textHeight = fontSize; // Assuming single-line text with a height roughly equal to font size
        
            // Set canvas size
            canvas.width = textWidth;
            canvas.height = textHeight;
        
            // Draw text on the canvas
            ctx.fillText(text, 0, fontSize);
        
            // Return the data URL of the canvas
            return canvas.toDataURL();
        }
        
        async function extractLogosAndText() {
            const allTogglersData = {}; // Store data per toggler
        toggelers[0].click();
        
            for (const toggler of toggelers) {
                try {
                    const canvasJSON = localStorage.getItem(toggler.textContent);
                    if (!canvasJSON) continue; // Skip if no saved canvas data
        
                    const parsedData = JSON.parse(canvasJSON);
                    if (!parsedData.objects) continue; // Skip if no objects in canvas
        
                    const logos = await Promise.all(parsedData.objects.map(async (obj) => {
                        if (obj.type === "group" && obj.objects) {
                            const imageObj = obj.objects.find(o => o.type === "image");
                            const textObj = obj.objects.find(o => o.type === "text");
                    
                            if (imageObj) {
                                const width = (imageObj.width * 0.087 * imageObj.scaleX).toFixed(2);
                                const height = (imageObj.height * 0.087 * imageObj.scaleY).toFixed(2);
                                const size = `${width} * ${height}`;
                                return { type: "image", url: imageObj.src, size };
                            }
                    
                            if (textObj) {
                                try {
                                    const textDataURL = await convertTextToDataURL(
                                        textObj.text || "",
                                        textObj.fontSize || 30,
                                        textObj.fontFamily || "Arial",
                                        textObj.fill || "#000"
                                    );
                    
                                    const width = (textObj.width * 0.087 * textObj.scaleX).toFixed(2);
                                    const height = (textObj.height * 0.087 * textObj.scaleY).toFixed(2);
                                    const size = `${width} * ${height}`;
                    
                                    return {
                                        url: textDataURL,
                                        size
                                    };
                                } catch (error) {
                                    console.error("Error converting text to data URL:", error);
                                    return null;
                                }
                            }
                        }
                    
                        return null; // Not a group or no valid child
                    }));
                    
        
                    // Filter out any null entries (caused by failed conversions)
                    allTogglersData[toggler.textContent] = { logos: logos.filter(Boolean) };
                } catch (error) {
                    console.error(`Error processing toggler ${toggler.textContent}:`, error);
                }
            }
        
            return allTogglersData;
        }
        

 async  function  saveToLocalStorage() {
    let allTogglersData = await extractLogosAndText()
      await imagecollector();
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
        prices.push(priceCounter);

        const selectedSize = JSON.parse(localStorage.getItem('selectedSize')) || {};
        const selectedColor = JSON.parse(localStorage.getItem('selectedColor')) || {};
        const ProductInfo = JSON.parse(localStorage.getItem('ProductInfo')) || {};
        const defaultColor = JSON.parse(localStorage.getItem('defaultColor')) || {};
        
        localStorage.setItem('fruits', JSON.stringify(prices));
        /* localStorage.setItem('tshirtImages', JSON.stringify(tshirtImages)); */

       /*  tshirtImages = JSON.parse(localStorage.getItem('tshirtImages')) || []; */
        let priceForColorSize = priceCounter - (mainPrice * countNumber);
        
        localStorage.setItem('full_price', JSON.stringify(priceCounter));
        localStorage.setItem('initial_Price', JSON.stringify(mainPrice));
        localStorage.setItem('quantity', JSON.stringify(countNumber));
        localStorage.setItem('Price_for_color_size', JSON.stringify(priceForColorSize));

        const newOrder =  {
            product_id: ProductInfo.Product_id, // Placeholder, replace with your product ID logic
            product_name: ProductInfo.name, // Placeholder, replace with your product name logic
            color_id: selectedColor.id || defaultColor.id,
            size_id: selectedSize.id || defaultColor.sizes[0].size_id,
            quantity: countNumber,
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
            product_id: ProductInfo.Product_id, // Placeholder, replace with your product ID logic
            product_name: ProductInfo.name, // Placeholder, replace with your product name logic
            color: selectedColor.name || defaultColor.name,
            size_id: selectedSize.name || null,
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


async  function  saveToLocalStorage1() {
    let allTogglersData = await extractLogosAndText();
    await imagecollector();
    const toggelersArray = Array.from(toggelers);
    toggelersArray[0].click();
    

      const node = document.getElementById('tshirt-div'); // Div containing both the image and the canvas

      // Use html2canvas to capture the content of the node
      html2canvas(node, { useCORS: true }).then(function (canvas) {
          toggelersArray[0].click();
          // Convert the canvas to a data URL
          const dataUrl = canvas.toDataURL("image/png");

      // Retrieve existing images from local storage if available
      let tshirtImages = JSON.parse(localStorage.getItem('tshirtImages')) || [];
      let prices = JSON.parse(localStorage.getItem('fruits')) || [];

      // Add the new image to the array
      tshirtImages.push(dataUrl);
      prices.push(priceCounter);
      /* clearIndexedDB().then(() => console.log("DB is now empty.")); */
      const selectedSize = JSON.parse(localStorage.getItem('selectedSize')) || {};
      const selectedColor = JSON.parse(localStorage.getItem('selectedColor')) || {};
      const ProductInfo = JSON.parse(localStorage.getItem('ProductInfo')) || {};
      const defaultColor = JSON.parse(localStorage.getItem('defaultColor')) || {};
      
      localStorage.setItem('fruits', JSON.stringify(prices));
      /* localStorage.setItem('tshirtImages', JSON.stringify(tshirtImages)); */

      tshirtImages = JSON.parse(localStorage.getItem('tshirtImages')) || [];
      let priceForColorSize = priceCounter - (mainPrice * countNumber);
      
      localStorage.setItem('full_price', JSON.stringify(priceCounter));
      localStorage.setItem('initial_Price', JSON.stringify(mainPrice));
      localStorage.setItem('quantity', JSON.stringify(countNumber));
      localStorage.setItem('Price_for_color_size', JSON.stringify(priceForColorSize));

      const newOrder =  {
        product_id: ProductInfo.Product_id, // Placeholder, replace with your product ID logic
        product_name: ProductInfo.name, // Placeholder, replace with your product name logic
        color_id: selectedColor.id || defaultColor.id,
        size_id: selectedSize.id || defaultColor.sizes[0].size_id,
        quantity: countNumber,
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
          product_id: ProductInfo.Product_id, // Placeholder, replace with your product ID logic
          product_name: ProductInfo.name, // Placeholder, replace with your product name logic
          color: selectedColor.name || defaultColor.name,
          size_id: selectedSize.name || null,
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
      showPopup1();
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
                    loginLink.innerHTML = `<i class="fa-solid fa-user"></i> مرحبًا, ${userName}`;
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

const toggelers = document.querySelectorAll('.toggelers p');
const canvasContainer = document.getElementById('tshirt-div'); // Update if your canvas is wrapped in a container

document.getElementById('preview').addEventListener('click', async () => {
  try {
    const images = [];

    for (const toggler of toggelers) {
      toggler.click(); // Simulate a click to load the content
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




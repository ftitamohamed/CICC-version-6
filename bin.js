const albumItems = document.querySelectorAll(".album-item");

albumItems.forEach((item) => {
    item.addEventListener("click", (event) => {
        event.preventDefault();

        const bgImage = item.querySelector("div").style.backgroundImage;
        const imageUrl = bgImage.slice(5, -2); // Remove url("...")

        fabric.Image.fromURL(imageUrl, function (image) {
            image.set({
                left: 0,
                top: 0,
                scaleX: 0.3,
                scaleY: 0.3,
            });

            // Assign unique ID for tracking
            const uniqueId = `img_${Date.now()}`;
            image.id = uniqueId;
            logoPrices.set(image.id, 3); // Only assign price to image!

            canvas.add(image);
            canvas.centerObject(image);
            canvas.setActiveObject(image);

            updatePriceDisplay();

            // Create a label that follows the image (but not grouped)
            const updateLabelPosition = () => {
                const actualWidth = Math.round(image.width * image.scaleX);
                const actualHeight = Math.round(image.height * image.scaleY);

                label.set({
                    left: image.left,
                    top: image.top + image.getScaledHeight() + 5,
                    text: `${actualWidth}×${actualHeight} px`,
                });

                canvas.renderAll();
            };

            const actualWidth = Math.round(image.width * image.scaleX);
            const actualHeight = Math.round(image.height * image.scaleY);
            const label = new fabric.Text(`${actualWidth}×${actualHeight} px`, {
                fontSize: 14,
                fill: '#333',
                selectable: false,
                evented: false,
                left: image.left,
                top: image.top + image.getScaledHeight() + 5,
            });

            canvas.add(label);

            // When image moves or scales, update label position and text
            image.on('moving', updateLabelPosition);
            image.on('scaling', updateLabelPosition);
            image.on('rotating', updateLabelPosition);
            image.on('modified', updateLabelPosition);

            uploadedElements.push({
                type: "image",
                id: image.id,
                url: imageUrl,
                properties: {
                    left: image.left,
                    top: image.top,
                    scaleX: image.scaleX,
                    scaleY: image.scaleY,
                    width: actualWidth,
                    height: actualHeight,
                },
            });
        }, { crossOrigin: 'anonymous' });
    });
});
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
            const actualWidth = Math.round(image.width * image.scaleX);
            const actualHeight = Math.round(image.height * image.scaleY);

            // Create label text under the image
            const sizeText = new fabric.Text(`${actualWidth}×${actualHeight} px`, {
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
async function imagecollector() {
    const images = [];
    try {
        for (const toggler of toggelers) {
            toggler.click();
            await new Promise(resolve => setTimeout(resolve, 500));

            // TEMP: Remove all size labels before capturing
            const objectsToRemove = [];
            canvas.getObjects().forEach(obj => {
                if (obj.type === 'group') {
                    const textObj = obj._objects.find(o => o.type === 'text' && o.text.includes('px'));
                    if (textObj) {
                        // Remove label from group
                        obj.remove(textObj);
                        canvas.renderAll();
                    }
                }
            });

            // Screenshot after label is removed
            const dataURL = await html2canvas(canvasContainer, { useCORS: true }).then(canvas => {
                return canvas.toDataURL("image/png");
            });

            images.push(dataURL);

            // Optional: Restore the removed text label if needed
            // (only if you saved a reference to it before removal)
        }

        return images;
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

async function imagecollector() {
    const images = [];

    try {
       

        for (const toggler of toggelers) {
            toggler.click();
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait for the content to update

            // Remove size labels (like "100px") from fabric.js canvas groups
            canvas.getObjects().forEach(obj => {
                if (obj.type === 'group') {
                    const textObj = obj._objects.find(o => o.type === 'text' && o.text.includes('px'));
                    if (textObj) {
                        obj.remove(textObj); // Remove label
                        canvas.renderAll();  // Update the canvas
                    }
                }
            });

            // Ensure canvas has fully rendered before capturing
            await new Promise(resolve => setTimeout(resolve, 100)); // Add a short delay for rendering

            // Capture screenshot using html2canvas
            const dataURL = await html2canvas(canvasContainer, { useCORS: true }).then(canvas => {
                return canvas.toDataURL("image/png");
            });

            images.push(dataURL); // Store the captured image
            console.log(images);
            alert('...')
        }

        return images; // Return the array of images

    } catch (error) {
        console.error("An error occurred:", error);
    }
}

async function fetchModels() {
    const response = await fetch('https://custmize.digitalgo.net/api/home');
    const data = await response.json();
  
    if (data.success) {
      const product = data.data.products[0]; // Retrieve the first model, as the others are identical
      const angleStep = (2 * Math.PI) / numModels;
  
      // Load the model only once and clone it 8 times
      gltfLoader.load(product.image, (gltf) => {
        const model = gltf.scene.children[0];
  
        for (let index = 0; index < numModels; index++) {
          const angle = index * angleStep;
  
          // Clone the model and position it in a circular orbit
          const clonedModel = model.clone();
          clonedModel.position.set(
            orbitRadius * Math.cos(angle),
            0,
            orbitRadius * Math.sin(angle)
          );
  
          // Create a pedestal for the model
          const pedestal = new THREE.Mesh(
            new THREE.CylinderGeometry(1, 1, 0.3, 32),
            new THREE.MeshStandardMaterial({ color: 0xaaaaaa })
          );
          pedestal.position.set(
            clonedModel.position.x,
            3,
            clonedModel.position.z
          );
          pedestal.receiveShadow = true;
  
          clonedModel.scale.set(modelSize, modelSize, modelSize);
          clonedModel.castShadow = true;
  
          // Add cloned model and pedestal to the scene
          orbitGroup.add(clonedModel);
          orbitGroup.add(pedestal);
          models.push(clonedModel);
        }
      });
    }
  }
  async function fetchModels() {
    const response = await fetch('https://custmize.digitalgo.net/api/home');
    const data = await response.json();
  
    if (data.success) {
      const products = data.data.products;
      const angleStep = (2 * Math.PI) / products.length;
  
      products.forEach((product, index) => {
        gltfLoader.load(product.image, (gltf) => {
          const model = gltf.scene.children[0];
          const angle = index * angleStep;
  
          // Clone the model and position it in a circular orbit
          const clonedModel = model.clone();
          clonedModel.position.set(
            orbitRadius * Math.cos(angle),
            0,
            orbitRadius * Math.sin(angle)
          );
  
          // Create a pedestal for the model
          const pedestal = new THREE.Mesh(
            new THREE.CylinderGeometry(1, 1, 0.3, 32),
            new THREE.MeshStandardMaterial({ color: 0xaaaaaa })
          );
          pedestal.position.set(
            clonedModel.position.x,
            3,
            clonedModel.position.z
          );
          pedestal.receiveShadow = true;
  
          clonedModel.scale.set(modelSize, modelSize, modelSize);
          clonedModel.castShadow = true;
  
          // Add cloned model and pedestal to the scene
          orbitGroup.add(clonedModel);
          orbitGroup.add(pedestal);
          models.push(clonedModel);
        });
      });
    }
  }

   if (product.title === "كوب") {
          model.scale.set(-0.3, -0.3, -0.3);
          console.log('3d cup');
      } if (product.title === "كوب") {
          model.scale.set(-0.3, -0.3, -0.3);
          console.log('3d cup');
      }

      async function fetchModels() {
        const response = await fetch('https://custmize.digitalgo.net/api/home');
        const data = await response.json();
      
        if (data.success) {
          const products = data.data.products;
          angleStep = (2 * Math.PI) / products.length;
      
          products.forEach((product, index) => {
            gltfLoader.load(product.image, (gltf) => {
              const model = gltf.scene;
      
              // Normalize size
              const box = new THREE.Box3().setFromObject(model);
              const size = new THREE.Vector3();
              box.getSize(size);
      
              const maxDim = Math.max(size.x, size.y, size.z);
              const modelSize = 2; // Desired maximum dimension
              const scaleFactor = modelSize / maxDim;
      
              model.traverse((child) => {
                if (child.isMesh) {
                  child.scale.set(scaleFactor, scaleFactor, scaleFactor);
                }
              });
      
              // Recalculate bounding box after scaling
              const newBox = new THREE.Box3().setFromObject(model);
              const newSize = new THREE.Vector3();
              newBox.getSize(newSize);
              const center = new THREE.Vector3();
              newBox.getCenter(center);
      
              // Center model around origin
              model.position.sub(center);
      
              // Lift model to sit properly on pedestal
              model.position.y += newSize.y / 2;
      
              // Position around orbit
              const angle = index * angleStep;
              model.position.x = orbitRadius * Math.cos(angle);
              model.position.z = orbitRadius * Math.sin(angle);
      
              model.castShadow = true;
      
              // Create pedestal
              const pedestal = new THREE.Mesh(
                new THREE.CylinderGeometry(1, 1, 0.3, 32),
                new THREE.MeshStandardMaterial({ color: 0xaaaaaa })
              );
              pedestal.position.set(model.position.x, -1.5, model.position.z);
              pedestal.receiveShadow = true;
      
              orbitGroup.add(model);
              orbitGroup.add(pedestal);
              models.push(model);
      
              // Log for debugging
              console.log(
                `Scaled Model: ${product.title} | Size: x:${newSize.x.toFixed(2)} y:${newSize.y.toFixed(2)} z:${newSize.z.toFixed(2)}`
              );
            });
          });
        }
      }
/* import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Canvas & Renderer
const canvas = document.querySelector('#three-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2.5;
renderer.shadowMap.enabled = true;

// Scene
const scene = new THREE.Scene();

// Gradient background
const canvas1 = document.createElement('canvas');
canvas1.width = 512;
canvas1.height = 512;
const ctx = canvas1.getContext('2d');
const gradient = ctx.createLinearGradient(0, 0, 0, canvas1.height);
gradient.addColorStop(0, '#050505ee');
gradient.addColorStop(1, '#050505e8');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, canvas1.width, canvas1.height);
scene.background = new THREE.CanvasTexture(canvas1);

// Camera
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 3, 20.5);
scene.add(camera);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(10, 15, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(0, 15, 0);
spotLight.angle = Math.PI / 6;
spotLight.castShadow = true;
scene.add(spotLight);

// Parameters
const orbitRadius = 8.5;
const modelSize = 1.5;
const targetSize = modelSize * 1.2;
const tolerance = 0.05;

// Group
const orbitGroup = new THREE.Object3D();
scene.add(orbitGroup);

// Loaders and data
const gltfLoader = new GLTFLoader();
const models = [];
let angleStep = 0;
const targetPosition = new THREE.Vector3(0, 0, orbitRadius);

// Tooltip
const tooltip = document.getElementById('tooltip');
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Fetch models from API
async function fetchModels() {
  const response = await fetch('https://custmize.digitalgo.net/api/home');
  const data = await response.json();

  if (data.success) {
    let products = data.data.products;
    const originalCount = products.length;

    // Duplicate models to reach 8 if necessary
    while (products.length < 8) {
      products.push(...products.slice(0, 8 - products.length));
    }

    // Make sure we only use 8 even if more are returned
    products = products.slice(0, 8);

    angleStep = (2 * Math.PI) / products.length;

    let loadedCount = 0;

products.forEach((product, index) => {
  gltfLoader.load(product.image, (gltf) => {
    const model = gltf.scene;

    // Normalize size
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const modelSize = 2;
    const scaleFactor = modelSize / maxDim;

    model.traverse((child) => {
      if (child.isMesh) {
        child.scale.set(scaleFactor, scaleFactor, scaleFactor);
      }
    });

    const newBox = new THREE.Box3().setFromObject(model);
    const newSize = new THREE.Vector3();
    newBox.getSize(newSize);
    const center = new THREE.Vector3();
    newBox.getCenter(center);
    model.position.sub(center);
    model.position.y += newSize.y / 2;

    const angle = index * angleStep;
    model.position.x = orbitRadius * Math.cos(angle);
    model.position.z = orbitRadius * Math.sin(angle);
    model.castShadow = true;

    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(1, 1, 0.3, 32),
      new THREE.MeshStandardMaterial({ color: 0xaaaaaa })
    );
    pedestal.position.set(model.position.x, -1.5, model.position.z);
    pedestal.receiveShadow = true;

    orbitGroup.add(model);
    orbitGroup.add(pedestal);
    models.push(model);

    console.log(
      `Scaled Model: ${product.title} | Size: x:${newSize.x.toFixed(2)} y:${newSize.y.toFixed(2)} z:${newSize.z.toFixed(2)}`
    );

    // ✅ Check if all models loaded
    loadedCount++;
    if (loadedCount === 8) {
      // ✅ Start animation only after all 8 models loaded
      draw();
    }
  });
});

  }
}


fetchModels();

// Tooltip interaction
canvas.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / canvas.clientHeight) * 2 + 1;

  tooltip.style.left = `${event.clientX}px`;
  tooltip.style.top = `${event.clientY}px`;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(models, true);

  if (intersects.length > 0) {
    tooltip.style.display = 'block';
    tooltip.innerHTML = `انقر للتخصيص`;
  } else {
    tooltip.style.display = 'none';
  }
});

canvas.addEventListener('mouseout', () => {
  tooltip.style.display = 'none';
});

// Draw loop
function draw() {
  models.forEach((model) => {
    const worldPosition = model.getWorldPosition(new THREE.Vector3());

    if (worldPosition.distanceTo(targetPosition) < tolerance) {
      model.scale.set(targetSize + 0.2, targetSize, targetSize + 0.2);
      model.rotation.y = -orbitGroup.rotation.y;
    } else {
      model.scale.set(modelSize, modelSize, modelSize);
    }
  });

  renderer.render(scene, camera);
  renderer.setAnimationLoop(draw);
}



// Rotation Controls
let currentModelIndex = 0;

function rotateToModel(index) {
  const targetRotation = -index * angleStep;
  gsap.to(orbitGroup.rotation, {
    y: targetRotation,
    duration: 1,
    ease: 'power2.inOut',
  });
}

const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');

leftButton.addEventListener('click', () => {
  if (models.length === 0) return;
  currentModelIndex = (currentModelIndex - 1 + models.length) % models.length;
  rotateToModel(currentModelIndex);
});

rightButton.addEventListener('click', () => {
  if (models.length === 0) return;
  currentModelIndex = (currentModelIndex + 1) % models.length;
  rotateToModel(currentModelIndex);
});

// Resize Handler
function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', setSize);
 */
function draw() {
  models.forEach((model) => {
    const worldPosition = model.getWorldPosition(new THREE.Vector3());

    // Compare only X and Z (horizontal plane)
    const horizontalDistance = Math.hypot(
      worldPosition.x - targetPosition.x,
      worldPosition.z - targetPosition.z
    );

    if (horizontalDistance < tolerance) {
      model.scale.set(targetSize + 0.2, targetSize, targetSize + 0.2);
    
      // Face the camera directly
      const modelWorldPos = model.getWorldPosition(new THREE.Vector3());
      model.lookAt(camera.position);
      
      // Optional: freeze the Y rotation only
      model.rotation.y = -orbitGroup.rotation.y ;
      model.rotation.x = 0;
      model.rotation.z = 0;
    } else {
      model.scale.set(modelSize, modelSize, modelSize);
    
      // Let them rotate naturally as part of the orbitGroup
      model.rotation.set(0, 0, 0);
    }
    
  });

  renderer.render(scene, camera);
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
            const link = document.createElement("a");
            link.href = dataURL;
            link.download = "text-image.png";
            link.click();
        
            return dataURL;
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

       /*  رقم الطلب: 20250605-11380955 */
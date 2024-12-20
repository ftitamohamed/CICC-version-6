/* import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Renderer
const canvas = document.querySelector('#three-canvas');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 5;

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('white');

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);
scene.add(camera);

// Light
const ambientLight = new THREE.AmbientLight('white', 1);
scene.add(ambientLight);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Add grid and axes helpers
const gridHelper = new THREE.GridHelper(10, 50);
const axesHelper = new THREE.AxesHelper(5);
scene.add(gridHelper, axesHelper);

// Parameters
const orbitRadius = 5; // Distance of models from the center
const modelSize = 1; // Uniform size of models
const numModels = 5; // Number of models
const orbitSpeed = 0.2; // Speed of the orbit

// Create a parent object for all models
const orbitGroup = new THREE.Object3D();
scene.add(orbitGroup);

// GLTF Loader
const gltfLoader = new GLTFLoader();
const angleStep = (2 * Math.PI) / numModels; // Angle step for evenly spaced models

for (let i = 0; i < numModels; i++) {
  // Load the GLTF model
  gltfLoader.load('./models/scene.gltf', (gltf) => {
    const mesh = gltf.scene.children[0];
    const angle = i * angleStep; // Calculate position angle

    // Position the model at the orbit radius
    mesh.position.set(
      orbitRadius * Math.cos(angle), // X position
      0, // Y position
      orbitRadius * Math.sin(angle)  // Z position
    );

    // Scale the model uniformly
    mesh.scale.set(modelSize, modelSize, modelSize);

    // Add the model to the orbit group
    orbitGroup.add(mesh);
  });
}

// Animation loop
function draw() {
  // Rotate the orbit group to make the models orbit
  orbitGroup.rotation.y += orbitSpeed;

  // Render the scene
  renderer.render(scene, camera);
  renderer.setAnimationLoop(draw);
}

// Handle resizing
function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Event Listener
window.addEventListener('resize', setSize);

// Start the animation loop
draw();
 */
/* import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Renderer
const canvas = document.querySelector('#three-canvas');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2.5; // Adjusted for balanced lighting
renderer.shadowMap.enabled = true; // Enable shadows

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf7f7f7); // Subtle studio-like gray background

// Camera
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 6, 12); // Positioned for better visibility of models
scene.add(camera);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Soft ambient light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2); // Strong directional light
directionalLight.position.set(10, 15, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(0, 15, 0);
spotLight.angle = Math.PI / 6;
spotLight.castShadow = true;
scene.add(spotLight);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth controls

// Helpers
const gridHelper = new THREE.GridHelper(10, 50);
const axesHelper = new THREE.AxesHelper(5);
scene.add(gridHelper, axesHelper);

// Parameters
const orbitRadius = 5;
const modelSize = 1.8;
const numModels = 5;
const orbitSpeed = 0.08; // Slower orbit for elegance

// Parent object for models
const orbitGroup = new THREE.Object3D();
scene.add(orbitGroup);

// Raycaster and mouse for hover detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const models = []; // To keep track of loaded models

// GLTF Loader
const gltfLoader = new GLTFLoader();
const angleStep = (2 * Math.PI) / numModels;

for (let i = 0; i < numModels; i++) {
  gltfLoader.load('./models/scene.gltf', (gltf) => {
    const model = gltf.scene.children[0];
    const angle = i * angleStep;

    // Position the model
    model.position.set(
      orbitRadius * Math.cos(angle),
      0,
      orbitRadius * Math.sin(angle)
    );

    // Add a pedestal
    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32),
      new THREE.MeshStandardMaterial({ color: 0xaaaaaa })
    );
    pedestal.position.set(
      model.position.x,
      1, // Slightly below the model
      model.position.z
    );
    pedestal.receiveShadow = true;

    // Configure the model
    model.scale.set(modelSize, modelSize, modelSize);
    model.castShadow = true;

    // Add to orbit group and track the model
    orbitGroup.add(model);
    orbitGroup.add(pedestal);
    models.push(model);
  });
}

// Animation loop
function draw() {
  // Hover effect
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(models);

  // Reset all models to default size
  models.forEach((model) => model.scale.set(modelSize, modelSize, modelSize));

  if (intersects.length > 0) {
    const hoveredModel = intersects[0].object;
    hoveredModel.scale.set(modelSize * 1.2, modelSize * 1.2, modelSize * 1.2); // Enlarge the hovered model
  }

  // Rotate orbit group
  orbitGroup.rotation.y += orbitSpeed;

  // Render the scene
  renderer.render(scene, camera);
  renderer.setAnimationLoop(draw);
}

// Resize handler
function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Mouse movement handler
function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1; // Normalize to [-1, 1]
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1; // Normalize to [-1, 1]
}

// Event listeners
window.addEventListener('resize', setSize);
window.addEventListener('mousemove', onMouseMove);

// Start animation loop
draw(); */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Renderer
const canvas = document.querySelector('#three-canvas');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setSize(1300, 600);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2.5; // Adjusted for balanced lighting
renderer.shadowMap.enabled = true; // Enable shadows

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf7f7f7); // Subtle studio-like gray background

// Camera
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 6, 12); // Positioned for better visibility of models
scene.add(camera);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Soft ambient light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2); // Strong directional light
directionalLight.position.set(10, 15, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(0, 15, 0);
spotLight.angle = Math.PI / 6;
spotLight.castShadow = true;
scene.add(spotLight);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth controls

// Helpers
/* const gridHelper = new THREE.GridHelper(10, 50);
const axesHelper = new THREE.AxesHelper(5);
scene.add(gridHelper, axesHelper); */

// Parameters
const orbitRadius = 7;
const modelSize = 1.8;
const numModels = 8;
let isOrbiting = true; // Flag to control orbitation

// Parent object for models
const orbitGroup = new THREE.Object3D();
scene.add(orbitGroup);

// Raycaster and mouse for click detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const models = []; // To keep track of loaded models

// GLTF Loader
const gltfLoader = new GLTFLoader();
const angleStep = (2 * Math.PI) / numModels;

for (let i = 0; i < numModels; i++) {
  gltfLoader.load('./models/scene.gltf', (gltf) => {
    const model = gltf.scene.children[0];
    const angle = i * angleStep;

    // Position the model
    model.position.set(
      orbitRadius * Math.cos(angle),
      0,
      orbitRadius * Math.sin(angle)
    );

    // Add a pedestal
    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32),
      new THREE.MeshStandardMaterial({ color: 0xaaaaaa })
    );
    pedestal.position.set(
      model.position.x,
      1.8, // Slightly below the model
      model.position.z
    );
    pedestal.receiveShadow = true;

    // Configure the model
    model.scale.set(modelSize, modelSize, modelSize);
    model.castShadow = true;

    // Add to orbit group and track the model
    orbitGroup.add(model);
    orbitGroup.add(pedestal);
    models.push(model);
  });
}

// Animation loop
function draw() {
  // Rotate orbit group if orbiting
  if (isOrbiting) {
    orbitGroup.rotation.y += 0.01; // Slow orbit speed
  }

  // Render the scene
  renderer.render(scene, camera);
  renderer.setAnimationLoop(draw);
}

// Resize handler
function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Mouse click handler
function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1; // Normalize to [-1, 1]
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1; // Normalize to [-1, 1]

  // Raycast to detect clicks on models
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(models);

  if (intersects.length > 0) {
    // Stop orbitation when a model is clicked
    isOrbiting = false;

    // Optional: Add visual feedback for selection
    /* const clickedModel = intersects[0].object;
    clickedModel.scale.set(modelSize * 1.2, modelSize * 1.2, modelSize * 1.2); */ // Enlarge clicked model slightly
  } else {
    // Resume orbitation if clicking elsewhere
    isOrbiting = true;

    // Reset all model scales
    models.forEach((model) => model.scale.set(modelSize, modelSize, modelSize));
  }
}

// Event listeners
window.addEventListener('resize', setSize);
window.addEventListener('click', onMouseClick);

// Start animation loop
draw();


/* import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Renderer
const canvas = document.querySelector('#three-canvas');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2.5;
renderer.shadowMap.enabled = true;

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf7f7f7);

// Camera
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 6, 12);
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

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Helpers
const gridHelper = new THREE.GridHelper(10, 50);
const axesHelper = new THREE.AxesHelper(5);
scene.add(gridHelper, axesHelper);

// Parameters
const orbitRadius = 5;
const modelSize = 1;
const numModels = 5;
let isOrbiting = true;
let spinningModel = null; // Reference to the currently spinning model

// Parent object for models
const orbitGroup = new THREE.Object3D();
scene.add(orbitGroup);

// Raycaster and mouse for click detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const models = [];

// GLTF Loader
const gltfLoader = new GLTFLoader();
const angleStep = (2 * Math.PI) / numModels;

for (let i = 0; i < numModels; i++) {
  gltfLoader.load('./models/scene.gltf', (gltf) => {
    const model = gltf.scene.children[0];
    const angle = i * angleStep;

    // Position the model
    model.position.set(
      orbitRadius * Math.cos(angle),
      0,
      orbitRadius * Math.sin(angle)
    );

    // Add a pedestal
    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32),
      new THREE.MeshStandardMaterial({ color: 0xaaaaaa })
    );
    pedestal.position.set(
      model.position.x,
      -0.1,
      model.position.z
    );
    pedestal.receiveShadow = true;

    // Configure the model
    model.scale.set(modelSize, modelSize, modelSize);
    model.castShadow = true;

    // Add to orbit group and track the model
    orbitGroup.add(model);
    orbitGroup.add(pedestal);
    models.push(model);
  });
}

// Animation loop
function draw() {
  // Rotate orbit group if orbiting
  if (isOrbiting) {
    orbitGroup.rotation.y += 0.01;
  }

  // Spin the selected model
  if (spinningModel) {
    spinningModel.rotation.y += 0.05; // Spin the model on its Y-axis
  }

  // Render the scene
  renderer.render(scene, camera);
  renderer.setAnimationLoop(draw);
}

// Resize handler
function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Mouse click handler
function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Raycast to detect clicks on models
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(models);

  if (intersects.length > 0) {
    // Stop orbitation and make the clicked model spin
    isOrbiting = false;

    const clickedModel = intersects[0].object;

    // If a new model is clicked, reset the previous spinning model
    if (spinningModel && spinningModel !== clickedModel) {
      spinningModel.scale.set(modelSize, modelSize, modelSize);
    }

    spinningModel = clickedModel; // Set the clicked model as spinning model
    spinningModel.scale.set(modelSize * 1.2, modelSize * 1.2, modelSize * 1.2); // Enlarge it
  } else {
    // Resume orbitation if clicking elsewhere and stop any spinning model
    isOrbiting = true;

    if (spinningModel) {
      spinningModel.scale.set(modelSize, modelSize, modelSize);
      spinningModel = null; // Reset spinning model
    }
  }
}

// Event listeners
window.addEventListener('resize', setSize);
window.addEventListener('click', onMouseClick);

// Start animation loop
draw(); */


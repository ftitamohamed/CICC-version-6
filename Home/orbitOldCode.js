import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Renderer
const canvas = document.querySelector('#three-canvas');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2.5;
renderer.shadowMap.enabled = true;

// Scene
const scene = new THREE.Scene();

// Create a gradient background
const canvas1 = document.createElement('canvas');
const ctx = canvas1.getContext('2d');
canvas1.width = 512;
canvas1.height = 512;
const gradient = ctx.createLinearGradient(0, 0, 0, canvas1.height);
gradient.addColorStop(0, '#050505ee');
gradient.addColorStop(1, '#050505e8');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, canvas1.width, canvas1.height);
const texture = new THREE.CanvasTexture(canvas1);
scene.background = texture;

// Camera
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 7, 20.5);
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

// Orbit Parameters
const orbitRadius = 8.5;
const modelSize = 3.5;
const targetSize = modelSize * 1.2;
const tolerance = 0.05;
const numModels = 3; // Number of models to display
const angleStep = (2 * Math.PI) / numModels;

// Parent object for models
const orbitGroup = new THREE.Object3D();
scene.add(orbitGroup);

// GLTF Loader
const gltfLoader = new GLTFLoader();
const models = [];
const targetPosition = new THREE.Vector3(0, 0, orbitRadius);

// Tooltip element
const tooltip = document.getElementById('tooltip');
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Fetch models from API (Retrieving the same model 8 times)
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


fetchModels();

// Mouse events for tooltip
canvas.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
  mouse.y = -((event.clientY- rect.top) / canvas.clientHeight) * 2 + 1;

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

// Rotation and Scaling
function draw() {
  models.forEach((model) => {
    const worldPosition = model.getWorldPosition(new THREE.Vector3());

    if (worldPosition.distanceTo(targetPosition) < tolerance) {
      model.scale.set(targetSize + 0.2, targetSize, targetSize + 0.2);
      /* model.rotation.y = -orbitGroup.rotation.y; */
      model.rotation.y = -(orbitGroup.rotation.y )  ;
    } else {
      model.scale.set(modelSize, modelSize, modelSize);
    }
  });

  renderer.render(scene, camera);
  renderer.setAnimationLoop(draw);
}

draw();

// Rotation Controls
function rotateToModel(index) {
  const targetRotation = -index * angleStep;
  gsap.to(orbitGroup.rotation, {
    y: targetRotation,
    duration: 1,
    ease: 'power2.inOut',
  });
}

// Buttons for Navigation
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');
let currentModelIndex = 0;

leftButton.addEventListener('click', () => {
  currentModelIndex = (currentModelIndex - 1 + numModels) % numModels;
  rotateToModel(currentModelIndex);
});

rightButton.addEventListener('click', () => {
  currentModelIndex = (currentModelIndex + 1) % numModels;
  rotateToModel(currentModelIndex);
});

// Resize Handler
function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', setSize);
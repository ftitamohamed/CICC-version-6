/* import * as THREE from 'three';
import { Scene } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'; */

/* 
let currentIndex = 0;
            const totalSlides = 2;

            function moveToSlide(index) {
                currentIndex = index;
                const radioToCheck = document.getElementById(`radio${index + 1}`);
                if (radioToCheck) radioToCheck.checked = true;
            }

            setInterval(() => {
                currentIndex = (currentIndex + 1) % totalSlides;
                moveToSlide(currentIndex);
            }, 5000); 

let panelsElement = document.querySelectorAll('.panel'); */


/* let removeActiveClasses = () => {
    panelsElement.forEach(panel => {
        panel.classList.remove('active');
    });
};

panelsElement.forEach(panel => {
    panel.addEventListener('click', () => {
        removeActiveClasses();
        panel.classList.add('active');
    });
}); */

/* document.getElementById("three-canvas").addEventListener("click", function (event) {
  if (event.target === event.currentTarget) {
      window.location.href = "customize.html"; // Replace with your desired URL
  }
}); */
document.getElementById("home-logo").addEventListener("click", function (event) {
  if (event.target === event.currentTarget) {
      window.location.href = "index.html"; // Replace with your desired URL
  }
});
window.addEventListener('DOMContentLoaded', (event) => {
  const loginLink = document.getElementById('loginLink');
  
  const userName = localStorage.getItem('userName');
  
  if (userName) {
      // If userName exists in localStorage, update the link to show the user's name
      loginLink.innerHTML = `<i class="fa-solid fa-user"></i> Hello, ${userName}`;
      loginLink.setAttribute('href', 'Profile.html'); // Prevent navigation to login page
      

  }
});

/* 
const canvas = document.getElementById("three-canvas");
const tooltip = document.getElementById("tooltip");

canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    tooltip.style.left = `${e.clientX - rect.left}px`;
    tooltip.style.top = `${e.clientY - rect.top}px`;
});

canvas.addEventListener("mouseover", () => {
    tooltip.style.display = "block";

});

canvas.addEventListener("mouseout", () => {
    tooltip.style.display = "none";
});

window.onload = function() {
    updateCartCount();
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
    } else {
        // Hide the red dot if no items
        cartCount.style.display = 'none';
    }
}

/* document.getElementById('saveTrackerCodeButton').addEventListener('click', function () {
    const trackerCode = document.getElementById('trackerCodeInput').value;
    if (trackerCode) {
        localStorage.setItem('TrackerCode', trackerCode);
        window.location.href = 'visitor.html';
    } else {
        alert('يرجى إدخال رمز التتبع.');
    }
}); */

document.getElementById('saveTrackerCodeButton').addEventListener('click', function () {
    const wantedProduct = document.getElementById('trackerCodeInput').value;
    if (wantedProduct) {
        localStorage.setItem('wantedProduct', wantedProduct);
        window.location.href = 'wearHouseSearch.html';
    } else {
        alert('يرجى إدخال رمز التتبع.');
    }
});

window.onload = function() {
    updateCartCount();
};

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
    } else {
        // Hide the red dot if no items
        cartCount.style.display = 'none';
    }
}

let dropDown = document.querySelector(".dropDown");
let dropBtn = document.querySelector(".dropBtn");
let spanList= document.querySelectorAll(".dropBtn span");
dropBtn.addEventListener("click", () => {
    const isOpen = dropDown.style.display === 'flex';

    if (isOpen) {
        dropDown.classList.add("hide");
        setTimeout(() => dropDown.style.display = 'none', 500); // wait for animation to finish
    } else {
        dropDown.style.display = 'flex';
        dropDown.classList.remove("hide");
    }

    dropBtn.classList.toggle('btnInv');
    spanList.forEach(span => {
        span.classList.toggle('spanInv');
    });
});


window.addEventListener('resize', function() {
    // Define the laptop viewport width threshold (1024px)
    const laptopViewportWidth = 1024;

    // Get the current window width
    const windowWidth = window.innerWidth;

    // Get the element you want to add the .hide class to
   /*  const element = document.querySelector('.your-element'); */

    // Add or remove the .hide class based on the window width
    if (windowWidth > laptopViewportWidth) {
        dropDown.classList.add('hide');
    } 
});

const toggleBtn = document.getElementById("toggleTracker");
const tracker = document.querySelector(".trackerDropDown");

toggleBtn.addEventListener("click", () => {
  tracker.classList.toggle("show");
});

document.querySelector('.trackerDropDown > div:nth-child(1) > img:nth-child(2)').addEventListener('click', function () {
    const wantedProduct = document.querySelector('.trackerDropDown > div:nth-child(1) > input:nth-child(1)').value;
    if (wantedProduct) {
        localStorage.setItem('TrackerCode', wantedProduct);
        window.location.href = 'visitor.html';
    } else {
        alert('يرجى إدخال رمز التتبع.');
    }
});

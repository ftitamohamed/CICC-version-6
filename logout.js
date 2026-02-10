import { clearIndexedDB } from "./indexedDBHelper.js";
window.addEventListener('DOMContentLoaded', (event) => {
    const logoutLink = document.getElementById('logoutLink');
    
    logoutLink.addEventListener('click', (event) => {
        // Prevent the default anchor link behavior
        event.preventDefault();
        
        // Clear the localStorage
        localStorage.clear();
        clearIndexedDB()
        // Redirect to the home page
        window.location.href = 'index.html';  // Update the URL based on your home page
    });
});

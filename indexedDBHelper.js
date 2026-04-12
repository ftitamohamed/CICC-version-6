const DB_NAME = "CartDatabase";
const STORE_NAME = "cartStore";
const DB_VERSION = 1;

let db;

// Open IndexedDB (initialize once)
function initializeDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = function (event) {
            db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id" });
            }
        };

        request.onsuccess = function (event) {
            db = event.target.result;
            resolve(db);
        };

        request.onerror = function (event) {
            console.error("IndexedDB error:", event.target.errorCode);
            reject("Failed to open IndexedDB");
        };
    });
}

// Save cart to IndexedDB
function saveCartToIndexedDB(cartData) {
    return new Promise(async (resolve, reject) => {
        try {
            await initializeDB(); // Ensure the database is initialized before saving
            let transaction = db.transaction(STORE_NAME, "readwrite");
            let store = transaction.objectStore(STORE_NAME);
            let request = store.put({ id: "cartData", data: cartData });

            request.onsuccess = () => resolve(true);
            request.onerror = (event) => reject(event.target.error);
        } catch (error) {
            reject(error);
        }
    });
}

// Get cart from IndexedDB
function getCartFromIndexedDB() {
    return new Promise(async (resolve, reject) => {
        try {
            await initializeDB(); // Ensure the database is initialized before getting the data
            let transaction = db.transaction(STORE_NAME, "readonly");
            let store = transaction.objectStore(STORE_NAME);
            let request = store.get("cartData");

            request.onsuccess = () => {
                resolve(request.result ? request.result.data : { cart: { orders: [] } });
            };
            request.onerror = (event) => reject(event.target.error);
        } catch (error) {
            reject(error);
        }
    });
}

// Clear IndexedDB
function clearIndexedDB() {
    return new Promise(async (resolve, reject) => {
        try {
            await initializeDB(); // Ensure the database is initialized before clearing
            let transaction = db.transaction(STORE_NAME, "readwrite");
            let store = transaction.objectStore(STORE_NAME);

            let clearRequest = store.clear();

            clearRequest.onsuccess = () => {
                console.log("IndexedDB cleared successfully!");
                resolve(true);
            };

            clearRequest.onerror = (event) => {
                console.error("Error clearing IndexedDB:", event.target.error);
                reject(event.target.error);
            };
        } catch (error) {
            console.error("Error initializing IndexedDB:", error);
            reject(error);
        }
    });
}

// Export the functions for global usage
export { saveCartToIndexedDB, getCartFromIndexedDB, clearIndexedDB };

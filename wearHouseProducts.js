import {
  saveCartToIndexedDB,
  getCartFromIndexedDB
} from "./indexedDBHelper.js";

/* ================== GLOBAL DATA & SERVICES ================== */
class ProductManager {
  constructor() {
    this.products = [];
    this.isInitialized = false;
  }

  async initialize() {
    const productsFetshingSlug = localStorage.getItem('productsFetshingSlug');
    
    if (!productsFetshingSlug) {
      console.error("productsFetshingSlug is missing from localStorage");
      return false;
    }

    try {
      await this.fetchProducts(productsFetshingSlug);
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error("Failed to initialize ProductManager:", error);
      return false;
    }
  }

  async fetchProducts(apiUrl) {
    try {
      const response = await fetch(apiUrl, {
        headers: { 'Accept-Language': 'en' },
        cache: 'no-cache'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error('API response indicated failure');
      }
      console.log('this is the data ',data);
      this.products = data.data.map(product => ({
        id: product.id,
        image: product.image,
        title: product.title,
        price: Number(product.price),
        count: product.count,
        isOutOfStock: product.count < 3,
        rawData: product // Keep original data for reference
      }));

      return this.products;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  getProduct(index) {
    return this.products[index];
  }

  getAllProducts() {
    return this.products;
  }

  getProductCount() {
    return this.products.length;
  }
}

class CartService {
  static async addProduct(productSlug) {
    try {
      const productData = await this.fetchProductDetails(productSlug);
      const cartItem = this.createCartItem(productData);
      
      await this.saveToCart(cartItem);
      
      return {
        success: true,
        cartItem,
        message: 'Product added to cart successfully'
      };
    } catch (error) {
      console.error('Error adding product to cart:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async fetchProductDetails(slug) {
    const response = await fetch(
      `https://dashboard.caduksa.com/api/single-external-product/${slug}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch product details: HTTP ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error('Product details fetch failed');
    }

    return data.data;
  }

  static createCartItem(product) {
    const fullPrice = parseFloat(product.price * (product.count || 1));
    
    // Main cart item (for IndexedDB)
    const cartItem = {
      product_id: product.id,
      product_name: product.title || 'Product',
      color_id: product.colors?.[0]?.id || '',
      size_id: product.colors?.[0]?.sizes?.[0]?.id || '',
      quantity: product.count || 1,
      default_code: product.default_codes?.[0] || 'None',
      external_id: product.external_id || 'None',
      price_without_size_color_price: parseFloat(product.price),
      price_for_size_color_price: parseFloat(product.price),
      full_price: fullPrice,
      front_image: {
        url: product.colors?.[0]?.front_image || product.image || "",
        logos: []
      },
      back_image: {
        url: product.colors?.[0]?.back_image || product.colors?.[0]?.front_image || product.image || "",
        logos: []
      },
      right_side_image: {
        url: product.colors?.[0]?.right_side_image || product.colors?.[0]?.front_image || product.image || "",
        logos: []
      },
      left_side_image: {
        url: product.colors?.[0]?.left_side_image || product.colors?.[0]?.front_image || product.image || "",
        logos: []
      }
    };

    // Simplified cart item (for localStorage)
    const simplifiedCartItem = {
      product_id: product.id,
      product_name: product.title || 'Product',
      color_id: product.colors?.[0]?.id || '',
      color: product.colors?.[0]?.name || '',
      size_id: product.colors?.[0]?.sizes?.[0]?.id || '',
      quantity: product.count || 1,
      price_without_size_color_price: parseFloat(product.price),
      price_for_size_color_price: parseFloat(product.price),
      full_price: fullPrice,
      front_image: product.colors?.[0]?.front_image || product.image || "",
      back_image: "",
      logos: ""
    };

    return { cartItem, simplifiedCartItem };
  }

  static async saveToCart({ cartItem, simplifiedCartItem }) {
    // Save to IndexedDB
    const existingCart = await getCartFromIndexedDB() || { cart: { orders: [] } };
    existingCart.cart.orders.push(cartItem);
    await saveCartToIndexedDB(existingCart);

    // Save simplified version to localStorage
    const existingCart1 = JSON.parse(localStorage.getItem('cartData1')) || { cart: { orders: [] } };
    existingCart1.cart.orders.push(simplifiedCartItem);
    localStorage.setItem('cartData1', JSON.stringify(existingCart1));

    // Set default material
    localStorage.setItem('material', JSON.stringify({ 
      id: 4, 
      name_ar: "قطن", 
      name_en: "Cotton" 
    }));
  }

  static async getCart() {
    return await getCartFromIndexedDB();
  }
}

class ProductUI {
  constructor(productManager) {
    this.productManager = productManager;
    this.container = document.querySelector('main');
    this.debouncedHandlers = new Map();
  }

  async render() {
    if (!this.productManager.isInitialized) {
      console.error('ProductManager not initialized');
      return;
    }

    const products = this.productManager.getAllProducts();
    this.container.innerHTML = '';

    const fragment = document.createDocumentFragment();

    products.forEach((product, index) => {
      const card = this.createProductCard(product, index);
      fragment.appendChild(card);
    });

    this.container.appendChild(fragment);
    console.log('Product panels rendered successfully');
  }

  createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = `card ${product.isOutOfStock ? 'out-of-stock' : ''}`;
    card.id = `panel-${index}`;

    // Create card content
    const cardHTML = this.generateCardHTML(product);
    card.innerHTML = cardHTML;

    // Add event listeners if not out of stock
    if (!product.isOutOfStock) {
      this.attachEventListeners(card, product, index);
    }

    return card;
  }

  generateCardHTML(product) {
    return `
      ${product.isOutOfStock ? 
        '<div class="out-of-stock-label">Out of stock</div>' : 
        ''
      }
      <img src="${product.image}" 
           alt="${product.title}"
           ${product.isOutOfStock ? 'style="pointer-events: none; opacity: 0.6;"' : ''}>
      <h3>${this.escapeHtml(product.title)}</h3>
      <span class="price">Price: ${product.price.toFixed(2)} SAR</span>
      ${!product.isOutOfStock ? `
        <button class="buy-btn" data-action="buy">Buy now</button>
        <button class="customize-btn" data-action="customize">Customize now</button>
      ` : ''}
    `;
  }

  attachEventListeners(card, product, index) {
    const img = card.querySelector('img');
    const customizeBtn = card.querySelector('.customize-btn');
    const buyBtn = card.querySelector('.buy-btn');

    // Create debounced handlers
    const handleCustomize = this.debounce(() => this.handleProductAction(product, index, 'customize'), 300);
    const handleBuy = this.debounce(() => this.handleProductAction(product, index, 'buy'), 300);

    // Store handlers for cleanup if needed
    this.debouncedHandlers.set(`customize-${index}`, handleCustomize);
    this.debouncedHandlers.set(`buy-${index}`, handleBuy);

    // Attach event listeners
    img.addEventListener('click', handleCustomize);
    customizeBtn.addEventListener('click', handleCustomize);
    buyBtn.addEventListener('click', handleBuy);
  }

  async handleProductAction(product, index, action) {
    // Save selected product info
    this.saveSelectedProduct(product, index);

    if (action === 'customize') {
      await this.navigateToCustomization(product.id);
    } else if (action === 'buy') {
      await this.addToCartAndNavigate(product.id);
    }
  }

  saveSelectedProduct(product, index) {
    localStorage.setItem('selectedSlug', product.id);
    localStorage.setItem('wearHouseImage', product.image);
    localStorage.setItem('wearHouseTitle', product.title);
  }

  async navigateToCustomization(productId) {
    try {
      const guidingImages = await this.fetchGuidingImages(productId);
      if (guidingImages) {
        localStorage.setItem('guidness_pictures', JSON.stringify(guidingImages));
        window.location.href = `wearHouseCustomize.html?id=${encodeURIComponent(productId)}`;
      }
    } catch (error) {
      console.error('Failed to navigate to customization:', error);
      this.showError('Unable to load customization options. Please try again.');
    }
  }

  async fetchGuidingImages(productId) {
    const response = await fetch(
      `https://dashboard.caduksa.com/api/single-external-product/${productId}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success && data.data?.Guiding_pictures) {
      return data.data.Guiding_pictures;
    }
    
    throw new Error('Invalid guiding images response');
  }

  async addToCartAndNavigate(productId) {
    try {
      const result = await CartService.addProduct(productId);
      
      if (result.success) {
        window.location.href = 'Cart.html';
      } else {
        this.showError(`Failed to add product to cart: ${result.error}`);
      }
    } catch (error) {
      console.error('Error in addToCartAndNavigate:', error);
      this.showError('An error occurred while adding the product to cart.');
    }
  }

  showError(message) {
    // You can implement a better UI error display here
    console.error('UI Error:', message);
    alert(message); // Consider replacing with a modal or toast notification
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  cleanup() {
    // Cleanup debounced handlers if needed
    this.debouncedHandlers.clear();
  }
}

/* ================== MAIN APPLICATION ================== */
class ProductApplication {
  constructor() {
    this.productManager = new ProductManager();
    this.productUI = new ProductUI(this.productManager);
  }

  async initialize() {
    // Show loading state
    this.showLoadingState();

    try {
      const initialized = await this.productManager.initialize();
      
      if (initialized) {
        await this.productUI.render();
        this.hideLoadingState();
      } else {
        this.showErrorMessage('Failed to load products. Please refresh the page.');
      }
    } catch (error) {
      console.error('Application initialization failed:', error);
      this.showErrorMessage('An error occurred while loading products. Please try again.');
      this.hideLoadingState();
    }
  }

  showLoadingState() {
    const container = document.querySelector('main');
    if (container) {
      container.innerHTML = `
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      `;
    }
  }

  hideLoadingState() {
    const loadingContainer = document.querySelector('.loading-container');
    if (loadingContainer) {
      loadingContainer.remove();
    }
  }

  showErrorMessage(message) {
    const container = document.querySelector('main');
    if (container) {
      container.innerHTML = `
        <div class="error-container">
          <h3>Oops!</h3>
          <p>${message}</p>
          <button id="retry-btn">Retry</button>
        </div>
      `;

      document.getElementById('retry-btn').addEventListener('click', () => {
        this.initialize();
      });
    }
  }
}

/* ================== STYLES (Optional - add to your CSS) ================== */
const addStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      text-align: center;
    }
    
    .loading-spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .error-container {
      text-align: center;
      padding: 3rem;
      background-color: #fff3f3;
      border-radius: 8px;
      margin: 2rem;
    }
    
    .error-container h3 {
      color: #d32f2f;
      margin-bottom: 1rem;
    }
    
    #retry-btn {
      background-color: #3498db;
      color: white;
      border: none;
      padding: 0.5rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 1rem;
    }
    
    #retry-btn:hover {
      background-color: #2980b9;
    }
    
    .card.out-of-stock img {
      filter: grayscale(80%);
    }
    
    .out-of-stock-label {
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: #ff4444;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
      z-index: 1;
    }
  `;
  document.head.appendChild(style);
};

/* ================== INITIALIZE APPLICATION ================== */
document.addEventListener('DOMContentLoaded', () => {
  // Add styles
  addStyles();
  
  // Initialize the application
  const app = new ProductApplication();
  app.initialize();
  
  // Make app available globally for debugging if needed
  window.productApp = app;
});

// Utility functions for backward compatibility (if needed)
window.fetchAndSave = async function(slug) {
  const result = await CartService.addProduct(slug);
  if (result.success) {
    window.location.href = 'Cart.html';
  }
};

window.setGuidnessImages = async function(apiUrl, slug) {
  const ui = new ProductUI(null); // Create minimal UI instance
  try {
    const guidingImages = await ui.fetchGuidingImages(slug);
    if (guidingImages) {
      localStorage.setItem('guidness_pictures', JSON.stringify(guidingImages));
      window.location.href = `wearHouseCustomize.html?id=${encodeURIComponent(slug)}`;
    }
  } catch (error) {
    console.error(error);
    alert('Failed to load guiding images');
  }
};
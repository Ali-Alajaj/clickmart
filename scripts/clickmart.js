import {products, loadProducts} from '../data/products.js';
import {addToCart, cart} from '../data/cart.js';
import updateHeaderQuantity from './renderCheckoutHeader.js';
import './general-header.js';
import './general-nav.js';

const url = new URL(window.location.href);
const searchParam = url.searchParams.get('search');
const filteredTypesParam = url.searchParams.get('filteredtypes');

loadProducts().then(() => {
  updateHeaderQuantity();
  let productsHTML = '';

  let filteredProducts = products;

  if (searchParam) {
    filteredProducts = products.filter((product) => {
      let matchingKeyWord = false;
      
      product.keywords.forEach((word) => {
        if (word.includes(searchParam)) {
          matchingKeyWord = true;
        }
      });
      const productName = product.name.toLowerCase();
      return productName.includes(searchParam) || matchingKeyWord;
    });
  } else if (filteredTypesParam) {
    filteredProducts = products.filter((product) => {
      return filteredTypesParam.includes(product.type);
    });
  }

  filteredProducts.forEach((product) => {
    productsHTML += `
    <section class="product-section">
      <div class="product-image-container">
        <img class="product-image" src="${product.image}">
      </div>
      <div class="info-container">
        <div class="product-name">
          ${product.name}
        </div>
        <div class="ratings-container">
          <img class="rating-image" src="${product.getStarsUrl()}">
          <span class="rating-count">${product.rating.count}</span>
        </div>
        <div class="price-and-count-container">
          <p class="prodcut-price">$${product.price}</p>
          <div class="middle-part">
            <select class="select-product-count
            js-select-product-count-${product.id}">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
            <p class="added-message js-added-message-${product.id}">
            <img class="checkmark-icon" src="images/icons/checkmark.png">
            Added
            </p>
          </div>
        </div>
      </div>
      <div class="product-bottom-section">
          <button class="add-button js-add-button" 
          data-product-id="${product.id}">Add to Cart</button>
        </div>
    </section>
    `
  });

  document.querySelector('main').innerHTML = productsHTML;
  document.querySelectorAll('.js-add-button').forEach((button) => {
    let timeoutId;
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      const quantity = Number(document.querySelector(`.js-select-product-count-${productId}`).value);
      addToCart(productId, quantity);
      updateHeaderQuantity();

      document.querySelector(`.js-added-message-${productId}`)
        .classList.add('visible');
      
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        document.querySelector(`.js-added-message-${productId}`)
        .classList.remove('visible');
      }, 2500);
    });
  });
});
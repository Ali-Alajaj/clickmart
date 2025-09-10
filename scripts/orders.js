import {loadProducts, getProductDetails} from '../data/products.js';
import {orders} from '../data/orders.js';
import dayjs from 'https://cdn.jsdelivr.net/npm/dayjs@1.11.18/+esm';
import renderCheckoutHeader from './renderCheckoutHeader.js';
import {addToCart} from '../data/cart.js';
import './general-header.js';
import './general-nav.js';

loadProducts().then(() => {
  renderCheckoutHeader();
  let ordersHTML = '';

  console.log(orders);
  orders.forEach((order) => {
    const orderTime = dayjs(order.orderTime * 1000);
    const orderTimeFormat = orderTime.format('MMMM D');
    const totalCost = order.totalCostCents / 100;
    ordersHTML += `
    <section class="order-section">
      <div class="orders-header">
        <div class="orders-header-left-section">
          <div class="header-info">
            <p class="info-title">Order Placed:</p>
            <p>${orderTimeFormat}</p>
          </div>
          <div class="header-info">
            <p class="info-title">Total:</p>
            <p>$${totalCost}</p>
          </div>
        </div>
        <div class="orders-header-right-section">
          <div class="header-info">
            <p class="info-title">Order ID:</p>
            <p>${order.orderId}</p>
          </div>
        </div>
      </div>
      <div class="orders-main">
        <section class="order-info">
          ${getProductDetailsHTML(order.products, order.orderId)}
        </section>
      </div>
    </section>
    `
  });
  document.querySelector('.js-order-grid').innerHTML = ordersHTML;

  document.querySelectorAll('.js-track-package-button').forEach((button) => {
    button.addEventListener('click', () => {
      const {productId, orderId} = button.dataset;
      window.location.href = `
        tracking.html?orderId=${orderId}&productId=${productId}
      `;
    });
  });

  document.querySelectorAll('.js-buy-again-button').forEach((button) => {
    let timeoutId;
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      addToCart(productId, 1);
      renderCheckoutHeader();
      document.querySelector(`.${button.classList[2]} .clicked-message`)
        .classList.remove('invisible');
        
      document.querySelector(`.${button.classList[2]} .not-clicked`)
        .classList.add('invisible');

      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
      document.querySelector(`.${button.classList[2]} .clicked-message`)
        .classList.add('invisible');

      document.querySelector(`.${button.classList[2]} .not-clicked`)
        .classList.remove('invisible');
      }, 2200)
    });
  });

  function getProductDetailsHTML(productsArray, orderId) {
    let html = '';
    productsArray.forEach((product) => {
      const productDetails = getProductDetails(product.id);
      const deliveryDate = dayjs(product.estimatedDeliveryDate)
        .format('MMMM D');
      html += `
      <div class="product-image-container">
        <img class="product-image" src="${productDetails.image}">
      </div>
      <div class="product-info">
        <p class="product-name">${productDetails.name}</p>
        <p>Arriving on ${deliveryDate}</p>
        <p>Quantity: ${product.quantity}</p>
        <button class="buy-again-button js-buy-again-button
        js-buy-again-button-${product.id}"
        data-product-id="${product.id}">
          <span class="not-clicked">
          <img class="buy-again-icon" src="images/icons/buy-again.png">
          Buy it again
          </span>
          <span class="clicked-message invisible">
            &check; Added
          </span>
        </button>
      </div>
      <div class="product-actions">
        <button class="track-package-button js-track-package-button"
        data-order-id="${orderId}" data-product-id="${product.id}">Track package</button>
      </div>
      `;
    });

    return html;
  }
});
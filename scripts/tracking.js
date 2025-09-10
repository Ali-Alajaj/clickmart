import {loadProducts, getProductDetails} from '../data/products.js';
import {orders} from '../data/orders.js';
import dayjs from 'https://cdn.jsdelivr.net/npm/dayjs@1.11.18/+esm';
import updateHeaderQuantity from './renderCheckoutHeader.js';
import './general-header.js';
import './general-nav.js';

const url = new URL(window.location.href);
const orderIdUrl = url.searchParams.get('orderId');
const productIdUrl = url.searchParams.get('productId');

loadProducts().then(() => {
  updateHeaderQuantity();
  const productDetails = getProductDetails(productIdUrl);
  let matchingOrder;
  let matchingProduct;

  orders.forEach((order) => {
    if (order.orderId === orderIdUrl) {
      matchingOrder = order;
    }
  });

  matchingOrder.products.forEach((product) => {
    if (product.id === productIdUrl) {
      matchingProduct = product;
    }
  });

  const deliveryDate = dayjs(matchingProduct.estimatedDeliveryDate);
  const deliveryDateFormat = deliveryDate.format('dddd, MMMM D');

  const today = dayjs();
  const orderTime = matchingOrder.orderTime * 1000;
  let deliveryPercentage = Math.round(((today - orderTime) / (deliveryDate - orderTime)) * 100);
  console.log(((today - orderTime) / (deliveryDate - orderTime)) * 100);

  if (deliveryPercentage <= 5) {
    deliveryPercentage = 5;
  } else if (deliveryPercentage >= 100) {
    deliveryPercentage = 100;
  }
  console.log(deliveryPercentage);
  const html = `
  <div class="link-container">
    <a class="view-link" href="orders.html">View all orders</a>
  </div>
  <div class="delivery-date">
    Arriving on ${deliveryDateFormat}
  </div>
  <div class="product-name">
    ${productDetails.name}
  </div>
  <div class="product-quantity">
    Quantity: ${matchingProduct.quantity}
  </div>
  <div class="product-image-container">
    <img class="product-image" src="${productDetails.image}">
  </div>
  <div class="progress-container">
    <div class="delivery-levels">
      <p class="${
        deliveryPercentage >= 0 && deliveryPercentage < 50 ?
        'current-delivery-level' : ''
      }">Preparing</p>
      <p class="${
        deliveryPercentage >= 50 && deliveryPercentage < 100 ?
        'current-delivery-level' : ''
      }">Shipped</p>
      <p class="${
        deliveryPercentage >= 100 ?
        'current-delivery-level' : ''
      }">Delivered</p>
    </div>
    <div class="progress-bar">
      <div class="progress-line js-progress-line"></div>
    </div>
  </div>
  `;

  document.querySelector('.js-main').innerHTML = html;

  setTimeout(() => {
    document.querySelector('.js-progress-line')
      .style.width = `${deliveryPercentage}%`;
  }, 300);
});
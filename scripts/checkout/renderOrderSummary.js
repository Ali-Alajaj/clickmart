import {getProductDetails} from '../../data/products.js';
import {cart, removeFromCart, updateDeliveryOption, 
  updateItemQuantity} from '../../data/cart.js';
import dayjs from 'https://cdn.jsdelivr.net/npm/dayjs@1.11.18/+esm';
import {getDeliveryOption} from '../../data/deliveryOptions.js';
import renderPaymentSummary from './renderPaymentSummary.js';
import updateHeaderQuantity from '../renderCheckoutHeader.js';

export default function renderOrderSummary() {
  updateHeaderQuantity();
  console.log(cart.length);
  let orderSummaryHTML = '';

  if (cart.length === 0) {
    document.querySelector('.js-products').innerHTML = `
    <div class="empty-cart-msg">
      <p>Your cart is empty</p>
      <a href="/">View products</a>
    </div>
    `;
    return;
  };

  cart.forEach((cartItem) => {
    const matchingItem = getProductDetails(cartItem.id);
    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    orderSummaryHTML += `
    <section class="product-display">
      <div class="section-header">
        <p>Delivery date: ${getDeliveryDate(deliveryOption.deliveryDays)}</p>
      </div>
      <div class="main-section">
        <div class="image-container">
          <img class="product-image" src="${matchingItem.image}">
        </div>
        <div class="info">
          <p class="product-name">${matchingItem.name}</p>
          <p class="product-price">$${matchingItem.price}</p>
          <div class="update-links">
            Quantity: 
            <span class="product-quantity">${cartItem.quantity}</span>
            <span class="link-primary js-update-link 
            js-update-link-${cartItem.id}"
            data-product-id="${cartItem.id}">Update </span>
            
            <div class="quick-update js-quick-update-${cartItem.id}
            invisible">
              <span class="link-primary js-save-link"
              data-product-id="${cartItem.id}">Save</span>
              <input class="save-link-input js-save-input-${cartItem.id}"
              type="number">
            </div>

            <span class="link-primary js-delete-button"
            data-product-id="${cartItem.id}">Delete</span>
          </div>
        </div>
        <div class="delivery-options js-delivery-options">
        ${getDeliveryOptionHTML(cartItem)}
        </div>
      </div>
    </section>
    `;
  });
  
  document.querySelector('.js-products').innerHTML = orderSummaryHTML;
  document.querySelectorAll('.js-delete-button').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId
      removeFromCart(productId);
      renderPaymentSummary();
      updateHeaderQuantity();
      renderOrderSummary();
    });
  });

  document.querySelectorAll('.js-delivery-option').forEach((option) => {
    option.addEventListener('click', () => {
      const productId = option.dataset.productId;
      const deliveryOptionId = option.dataset.deliveryOptionId;

      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll('.js-update-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      document.querySelector(`.js-quick-update-${productId}`)
        .classList.remove('invisible');
      link.classList.add('invisible');
    });
  });

  document.querySelectorAll('.js-save-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      document.querySelector(`.js-update-link-${productId}`)
        .classList.remove('invisible');
      document.querySelector(`.js-quick-update-${productId}`)
        .classList.add('invisible');

      const newQuantity = Number(
        document.querySelector(`.js-save-input-${productId}`)
          .value
      );

      updateItemQuantity(productId, newQuantity);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  function getDeliveryDate(days) {
    const today = dayjs();
    const deliveryDate = today.add(days, 'day');
    const deliveryDateFormat = deliveryDate.format('dddd, MMMM D');
    return deliveryDateFormat;
  }

  function formatPrice(priceCents) {
    if (priceCents === 0) {
      return 'FREE - '
    }
    return `$${(priceCents / 100)} - `;
  };

  function getDeliveryOptionHTML(cartItem) {
    const firstDeliveryOption = getDeliveryOption('1');
    const secondDeliveryOption = getDeliveryOption('2')
    const thirdDeliveryOption = getDeliveryOption('3');
    let html = `
    <p class="delivery-options-title">Choose a delivery option:</p>
    <div class="delivery-option js-delivery-option"
    data-delivery-option-id="1" data-product-id="${cartItem.id}">
      <input class="radio-input" type="radio" name="${cartItem.id}"
      ${cartItem.deliveryOptionId === '1' ? 'checked' : ''}>
      <div>
        <p class="delivery-option-date">${getDeliveryDate(9)}</p>
        <p class="delivery-option-price">${formatPrice(firstDeliveryOption.priceCents)}Shipping</p>
      </div>
    </div>
    <div class="delivery-option js-delivery-option"
    data-delivery-option-id="2" data-product-id="${cartItem.id}">
      <input class="radio-input" type="radio" name="${cartItem.id}"
      ${cartItem.deliveryOptionId === '2' ? 'checked' : ''}>
      <div>
        <p class="delivery-option-date">${getDeliveryDate(4)}</p>
        <p class="delivery-option-price">${formatPrice(secondDeliveryOption.priceCents)}Shipping</p>
      </div>
    </div>
    <div class="delivery-option js-delivery-option"
    data-delivery-option-id="3" data-product-id="${cartItem.id}">
      <input class="radio-input" type="radio" name="${cartItem.id}"
      ${cartItem.deliveryOptionId === '3' ? 'checked' : ''}>
      <div>
        <p class="delivery-option-date">${getDeliveryDate(1)}</p>
        <p class="delivery-option-price">${formatPrice(thirdDeliveryOption.priceCents)}Shipping</p>
      </div>
    </div>
    `;

    return html;
  }
}
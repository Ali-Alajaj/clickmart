import {cart, clearCart} from '../../data/cart.js';
import {deliveryOptions, getDeliveryOption} from '../../data/deliveryOptions.js';
import {getProductDetails} from '../../data/products.js';
import dayjs from 'https://cdn.jsdelivr.net/npm/dayjs@1.11.18/+esm';
import {addNewOrder} from '../../data/orders.js';

export default function renderPaymentSummary() {
  let items = 0;
  let itemsPrice = 0;
  let shippingPrice = 0;
  
  function formatPrice(priceCents) {
    return (priceCents / 100)
  }

  cart.forEach((cartItem) => {
    items += cartItem.quantity;
    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPrice += deliveryOption.priceCents;
    const productDetails = getProductDetails(cartItem.id);
    itemsPrice += (productDetails.price * cartItem.quantity);
  });
  itemsPrice = itemsPrice * 100

  const totalBeforeTax = shippingPrice + itemsPrice;
  const taxPrice = Math.round(totalBeforeTax / 10);
  
  const orderTotal = totalBeforeTax + taxPrice;

  let paymentSummaryHTML = `
  <p class="payment-summary-title">Order Summary</p>
  <div class="payment-summary-row">
    <p>Items (${items}):</p>
    <p>$${formatPrice(itemsPrice)}</p>
  </div>
  <div class="payment-summary-row">
    <p>Shipping & handling:</p>
    <p>$${formatPrice(shippingPrice)}</p>
  </div>
  <div class="line"></div>
  <div class="payment-summary-row">
    <p>Total before tax:</p>
    <p>$${formatPrice(totalBeforeTax)}</p>
  </div>
  <div class="payment-summary-row">
    <p>Estimated tax (10%):</p>
    <p>$${formatPrice(taxPrice)}</p>
  </div>
  <div class="line"></div>
  <div class="payment-summary-total payment-summary-row">
    <p>Order Total</p>
    <p>${formatPrice(orderTotal)}</p>
  </div>
  <div class="payment-summary-footer">
    <button class="make-order-button
    js-make-order-button">Place your order</button>
  </div>
  `;

  document.querySelector('.js-payment-summary')
    .innerHTML = paymentSummaryHTML;
  
  if (cart.length === 0) {
    document.querySelector('.js-make-order-button')
      .classList.add('empty-cart-button');
    return;
  }

  document.querySelector('.js-make-order-button')
    .addEventListener('click', async () => {
      cart.forEach((cartItem) => {
        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
        const deliveryDate = dayjs().add(
          deliveryOption.deliveryDays, 'day'
        ).format();
        cartItem.estimatedDeliveryDate = deliveryDate;
      });

      const response = await fetch(
        'https://68b1f2bea860fe41fd6007a9.mockapi.io/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          totalCostCents: orderTotal,
          products: cart
        })
      });

      const order = await response.json();
      addNewOrder(order);
      clearCart();
      window.location.href = 'orders.html';
    });
};
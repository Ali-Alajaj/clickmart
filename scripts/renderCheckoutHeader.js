import {cart} from '../data/cart.js';

export default function updateHeaderQuantity() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  document.querySelectorAll('.js-cart-quantity')
    .forEach((quantity) => {
      quantity.innerHTML = cartQuantity;
    });
};
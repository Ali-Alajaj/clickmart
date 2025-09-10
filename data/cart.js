import {deliveryOptions} from './deliveryOptions.js';

export let cart = JSON.parse(localStorage.getItem('clickmartCart')) || [
  {
    id: '7f89a012-34b2-4d45-e789-abcdef012345',
    quantity: 2,
    deliveryOptionId: '1'
  }, {
    id: '4a56b789-01c9-4e12-f456-123456789abc',
    quantity: 1,
    deliveryOptionId: '2'
  }
]; // default cart

export function addToCart(productId, quantity) {
  let productFound = false;
  cart.forEach((cartItem) => {
    if (cartItem.id === productId) {
      cartItem.quantity += quantity;
      productFound = true;
    }
  });
  
  if (productFound === false) {
    cart.push({
      id: productId,
      quantity: quantity,
      deliveryOptionId: '1'
    });
  }
  saveToStorage();
}

export function removeFromCart(productId) {
  const newCart = [];

  cart.forEach((cartItem) => {
    if (cartItem.id !== productId) {
      newCart.push(cartItem);
    }
  });
  cart = newCart;
  saveToStorage();
}

function saveToStorage() {
  localStorage.setItem('clickmartCart', JSON.stringify(cart));
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let validDeliveryOptionId = false;
  deliveryOptions.forEach((option) => {
    if (deliveryOptionId === option.id) {
      validDeliveryOptionId = true;
    }
  });

  if (!validDeliveryOptionId) {
    return;
  }

  let matchingItem;
  cart.forEach((cartItem) => {
    if (cartItem.id === productId) {
      matchingItem = cartItem;
    }
  });

  if (!matchingItem) {
    return
  }

  matchingItem.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}

export function updateItemQuantity(cartItemId, quantity) {
  let matchingItem;
  cart.forEach((cartItem) => {
    if (cartItemId === cartItem.id) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity = quantity;
  }
  saveToStorage();
}

export function clearCart() {
  cart = [];
  saveToStorage();
}
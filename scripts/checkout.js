import {loadProducts} from '../data/products.js';
import renderOrderSummary from './checkout/renderOrderSummary.js';
import renderPaymentSummary from './checkout/renderPaymentSummary.js';

loadProducts().then(() => {
  renderOrderSummary();
  renderPaymentSummary();
});
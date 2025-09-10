import dayjs from 'https://cdn.jsdelivr.net/npm/dayjs@1.11.18/+esm';

export const orders = JSON.parse(localStorage.getItem(
  'clickmartOrders'
)) || [
  {
    orderTime: Math.round(dayjs() / 1000),
    totalCostCents: 5719,
    products: [
      {
        id: '8a90b123-45c3-4e56-f890-bcdef0123456',
        quantity: 1,
        deliveryOptionId: '1',
        estimatedDeliveryDate: dayjs().add(9, 'day').format()
      },
      {
        id: '1e23a456-789b-4cde-9123-456789abcdef',
        quantity: 2,
        deliveryOptionId: '2',
        estimatedDeliveryDate: dayjs().add(3, 'day').format()
      }
    ],
    orderId: 'cbd8a97dbd418daae1a9d7f7'
  }
];

export function addNewOrder(order) {
  orders.unshift(order);
  saveToStorage();
}

function saveToStorage() {
  localStorage.setItem('clickmartOrders', JSON.stringify(orders));
};
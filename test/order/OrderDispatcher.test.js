'use strict';

const OrderDispatcher = require('../../app/order/OrderDispatcher');
const orders = require('../sample_orders');

test('Dispatcher can be instantiated', () => {
  const dispatcher = new OrderDispatcher(orders);
  expect(dispatcher.orders.length).toEqual(orders.length);
});

// test('Orders can be handled correctly', () => {
//   const dispatcher = new OrderDispatcher(orders);
//   const numOrders = orders.length;
//   for (var i=0; i<numOrders; i++) {
//     dispatcher.handleOrder();
//   }
//
// });

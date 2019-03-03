'use strict';

const OrderDAO = require('./app/order/OrderDAO');
const OrderManager = require('./app/order/OrderManager');

OrderDAO.readAll((err, orders) => {
  if (err) {
    console.error('Reading orders failed, stop.');
    return;
  }

  const manager = new OrderManager(orders);

  manager.startProcessing(() => {
    manager.stopProcessing();
    console.log('Orders have been completed');
  });
});

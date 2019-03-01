'use strict';

const OrderDAO = require('./app/order/OrderDAO');
const OrderDispatcher = require('./app/order/OrderDispatcher');

OrderDAO.readAll((err, orders) => {
  if (err) {
    console.error('Reading orders failed, stop.');
    return;
  }

  const dispatcher = new OrderDispatcher(orders);

  dispatcher.startDispatching(() => {
    dispatcher.stopDispatching();
    console.log('Orders have been completed');
  });
});

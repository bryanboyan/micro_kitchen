'use strict';

import OrderDAO from './app_build/order/OrderDAO';
import {OrderManager} from './app_build/order/OrderManager';

process.env.STRATEGY = process.env.STRATEGY || 'timeout';

OrderDAO.readAll((err, orders) => {
  if (err) {
    console.error('Reading orders failed, stop.');
    return;
  }

  const start = Date.now();

  const manager = new OrderManager(orders);

  manager.startProcessing(() => {
    manager.stopProcessing();
    const end = Date.now();
    console.log(`Orders have been completed in ${end-start} milliseconds`);
  });
});

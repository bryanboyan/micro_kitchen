'use strict';

const winston = require('winston');
import OrderDAO from './app_build/order/OrderDAO';
import {OrderManager} from './app_build/order/OrderManager';
import RenderingFacade from './app_build/render/RenderingFacade';

process.env.STRATEGY = process.env.STRATEGY || 'timeout';

OrderDAO.readAll((err, orders) => {
  if (err) {
    console.error('Reading orders failed, stop.');
    return;
  }

  const start = Date.now();

  const manager = new OrderManager(orders);

  RenderingFacade.render();

  manager.startProcessing(() => {
    manager.stopProcessing();
    const end = Date.now();
    console.log(`Orders have been completed in ${end-start} milliseconds`);
  });
});

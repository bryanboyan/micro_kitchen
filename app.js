'use strict';

const inquirer = require('inquirer');
import OrderDAO from './app_build/order/OrderDAO';
import {OrderManager} from './app_build/order/OrderManager';
import RenderingFacade from './app_build/render/RenderingFacade';

function start(orders) {
  const start = Date.now();

  const manager = new OrderManager(orders);

  RenderingFacade.render();

  manager.startProcessing(() => {
    manager.stopProcessing();
  });
}

function prompt(ready) {
  inquirer.prompt([
    {
      type: 'input',
      name: 'poissonRate',
      message: 'Overwrite the poisson distribution rate? (default as 3.25)',
    },
    {
      type: 'list',
      name: 'cleanupStrategy',
      message: 'Pick a cleanup strategy to do order cleanup (default: timeout)',
      choices: ['timeout', 'operate'],
    },
    {
      type: 'list',
      name: 'decayStrategy',
      message: 'Choose strategy for order decay (default: static)',
      choices: ['static', 'dynamic'],
    },
    {type: 'input', name: 'ready', message: 'Ready to start?'},
  ]).then(({
    poissonRate,
    cleanupStrategy,
    decayStrategy,
    _enter,
  }) => {
    if (poissonRate != '') {
      process.env.POISSON_RATE = new Number(poissonRate);
    }
    process.env.CLEANUP_STRATEGY = cleanupStrategy === 'operate' ? cleanupStrategy : 'timeout';
    process.env.DECAY_STRATEGY = decayStrategy === 'dynamic' ? decayStrategy : 'static';

    ready();
  });
}

OrderDAO.readAll((err, orders) => {
  if (err) {
    console.error('Reading orders failed, stop.');
    return;
  }

  prompt(() => start(orders));
});

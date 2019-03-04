'use strict';

const inquirer = require('inquirer');
import OrderDAO from './app_build/order/OrderDAO';
import {OrderManager} from './app_build/order/OrderManager';
import RenderingFacade from './app_build/render/RenderingFacade';

process.env.STRATEGY = process.env.STRATEGY || 'timeout';

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
      type: 'list',
      name: 'strategy',
      message: 'Pick a strategy to do order cleanup (default: timeout)',
      choices: ['timeout', 'operate']
    },
    {
      type: 'input',
      name: 'poissonRate',
      message: 'Overwrite the poisson distribution rate? (default as 3.25)',
    },
    {type: 'input', name: 'ready', message: 'Ready to start?'},
  ]).then(({strategy, poissonRate, _enter}) => {
    process.env.STRATEGY = strategy === 'operate' ? strategy : 'timeout';
    if (poissonRate != '') {
      process.env.POISSON_RATE = new Number(poissonRate);
    }

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

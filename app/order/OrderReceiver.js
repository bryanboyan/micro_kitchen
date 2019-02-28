'use strict';

const poissonProcess = require('poisson-process');

const POISSON_DISTRIBUTION_LAMBDA = 3.25;

/**
 * Responsibility: Take orders from OrderReceiverDAO with simulated
 *  Poisson distribution in time.
 */
class OrderReceiver {


  constructor() {
    // TODO gets the fake latest order

    this.process = poissonProcess.create(1000/POISSON_DISTRIBUTION_LAMBDA, () => {
      this.dispatchOneOrder();
    });
  }

  startDispatching() {
    this.process.start();
  }

  stopDispatching() {
    this.process.stop();
  }

  dispatchOneOrder() {
    // TODO Dispatch one order
    console.log('Order dispatched');
  }
}

module.exports = OrderReceiver;

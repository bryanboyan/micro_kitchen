'use strict';

const poissonProcess = require('poisson-process');

const POISSON_DISTRIBUTION_LAMBDA = 3.25;

/**
 * Responsibility: Take orders and simulate Poisson distribution to dispatch.
 */
class OrderDispatcher {

  constructor(orders) {
    this.orders = orders;
    this.index = 0;

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
    const currentIndex = this.index++;
    console.log(this.orders[currentIndex]);
  }
}

module.exports = OrderDispatcher;

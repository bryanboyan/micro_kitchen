'use strict';

const poissonProcess = require('poisson-process');
const ShelfOperator = require('../shelves/ShelfOperator');

const POISSON_DISTRIBUTION_LAMBDA = 3.25;

/**
 * Responsibility: Take orders and simulate Poisson distribution to dispatch.
 */
class OrderDispatcher {

  constructor(orders) {
    this.index = 0;
    this.orders = orders;
    this.process = poissonProcess.create(1000/POISSON_DISTRIBUTION_LAMBDA, () => this.handleOrder());
  }

  handleOrder() {
    const orderID = this.index++;
    const order = this.orders[orderID];
    if (order == null) {
      this.postProcess();
      return;
    }

    // 1. Call driver first as it's time consuming
    this.callDriver(orderID);

    // 2. Clean up shelves before putting orders
    ShelfOperator.cleanUpShelves();

    // 3. Put the order onto a shelf
    ShelfOperator.putOrder(orderID, order);
  }

  callDriver(orderIndex) {
    // TODO implement.
  }

  startDispatching(postProcess) {
    this.postProcess = postProcess;
    this.process.start();
  }

  stopDispatching() {
    this.process.stop();
  }
}

module.exports = OrderDispatcher;

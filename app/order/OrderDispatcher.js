'use strict';

const poissonProcess = require('poisson-process');
const Order = require('./Order');
const ShelfOperator = require('../shelf/ShelfOperator');

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
    if (orderID >= this.orders.length) {
      this.postProcess();
      return;
    }

    const order = new Order(orderID, this.orders[orderID]);

    // 1. Call driver first as it's time consuming
    this.callDriver(order);

    // 2. Clean up shelves before putting orders
    ShelfOperator.cleanUpShelves();

    // 3. Put the order onto a shelf
    ShelfOperator.putOrder(order);
  }

  callDriver(order) {
    // Random seconds between 2 ~ 10 seconds
    const drivingTimeInSec = parseInt(Math.random() * 8 + 2, 10);
    setTimeout(() => ShelfOperator.pickOrder(order), drivingTimeInSec * 1000);
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

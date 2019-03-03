'use strict';

const poissonProcess = require('poisson-process');
const Order = require('./Order');
const ShelfOperator = require('../shelf/ShelfOperator');

const POISSON_DISTRIBUTION_LAMBDA = 3.25;

/**
 * Responsibility: Take orders and simulate Poisson distribution to dispatch.
 */
class OrderManager {

  constructor(orders) {
    this.index = 0;
    this.orders = orders;
    this.process = poissonProcess.create(1000/POISSON_DISTRIBUTION_LAMBDA, () => this.handleOrder());
  }

  handleOrder() {
    console.log('handleOrder');
    const orderID = this.index++;
    if (orderID >= this.orders.length) {
      'function' === typeof this.postProcess && this.postProcess();
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
    setTimeout(() => ShelfOperator.pickOrder(order), this.getDriverDelay() * 1000);
  }

  getDriverDelay() {
    return parseInt(Math.random() * 8 + 2, 10);
  }

  startDispatching(postProcess) {
    this.postProcess = postProcess;
    this.process.start();
  }

  stopDispatching() {
    this.process.stop();
  }
}

module.exports = OrderManager;

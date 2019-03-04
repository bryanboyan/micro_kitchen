'use strict';

import { Order } from './Order';
import { ShelfOperator } from '../shelf/ShelfOperator';
const poissonProcess = require('poisson-process');

const POISSON_DISTRIBUTION_LAMBDA = 3.25;

/**
 * Responsibility: Take orders and simulate Poisson distribution to dispatch.
 */
export class OrderManager {

  constructor(orders) {
    this.index = 0;
    this.orders = orders;
    this.process = this.setupProcess();
  }

  /**
   * Facade of handling an order
   */
  handleOrder(order) {
    // 1. Call driver first as it's time consuming
    this.callDriver(order);

    // 2. Put the order onto a shelf
    ShelfOperator.putOrder(order);
  }

  callDriver(order) {
    setTimeout(() => ShelfOperator.pickOrder(order), this.getDriverDelay() * 1000);
  }

  getDriverDelay() {
    return parseInt(Math.random() * 8 + 2, 10);
  }

  // In real world, this class will be switched and instead take incoming
  // requests from the outside which might directly call into handleOrder()
  setupProcess() {
    return poissonProcess.create(1000 / POISSON_DISTRIBUTION_LAMBDA, () => {
      const orderID = this.index++;
      if (orderID >= this.orders.length) {
        'function' === typeof this.postProcess && this.postProcess();
        return;
      }
      const order = new Order(orderID, this.orders[orderID]);
      // TODO
      // order.shelfLife /= 10;
      // order.shelfLife = parseInt(order.shelfLife, 10);
      this.handleOrder(order);
    });
  }

  startProcessing(postProcess) {
    this.postProcess = postProcess;
    this.process.start();
  }

  stopProcessing() {
    this.process.stop();
  }
}
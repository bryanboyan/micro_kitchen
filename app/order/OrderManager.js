'use strict';

// @flow

import type {OrderRawType} from './Order';
import {Order} from './Order';
import {ShelfOperator} from '../shelf/ShelfOperator';
const poissonProcess = require('poisson-process');

/**
 * Responsibility: Take orders and simulate Poisson distribution to dispatch.
 */
export class OrderManager {
  index: number;
  orders: Array<OrderRawType>;
  process: any;
  postProcess: ?() => void;

  constructor(orders: Array<OrderRawType>) {
    this.index = 0;
    this.orders = orders;
    this.process = this.setupProcess();
  }

  /**
   * Facade of handling an order
   */
  handleOrder(order: Order) {
    // 1. Call driver first as it's time consuming
    this.callDriver(order);

    // 2. Put the order onto a shelf
    ShelfOperator.putOrder(order);
  }

  callDriver(order: Order) {
    setTimeout(() => ShelfOperator.pickOrder(order), this.getDriverDelay() * 1000);
  }

  getDriverDelay() {
    return parseInt(Math.random() * 8 + 2, 10);
  }

  getPoissonDistributionRate(): number {
    const OVERWRITE_RATE = process.env.POISSON_RATE;
    return !isNaN(OVERWRITE_RATE) ? parseFloat(OVERWRITE_RATE) : 3.25;
  }

  // In real world, this class will be switched and instead take incoming
  // requests from the outside which might directly call into handleOrder()
  setupProcess() {
    return poissonProcess.create(1000/this.getPoissonDistributionRate(), () => {
      const orderID = this.index++;
      if (orderID >= this.orders.length) {
        'function' === typeof this.postProcess && this.postProcess();
        return;
      }
      const order = new Order(orderID, this.orders[orderID]);
      this.handleOrder(order);
    });
  }

  startProcessing(postProcess: () => void) {
    this.postProcess = postProcess;
    this.process.start();
  }

  stopProcessing() {
    this.process.stop();
  }
}

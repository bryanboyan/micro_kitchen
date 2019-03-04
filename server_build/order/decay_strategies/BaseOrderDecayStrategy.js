'use strict';

export class BaseOrderDecayStrategy {

  constructor(orderData) {
    this.orderData = orderData;
    this.orderCreatedAt = Date.now();
  }

  getCurrentValue() {
    throw 'Please implement the strategy functions';
  }

  getTimeToLive() {
    throw 'Please implement the strategy functions';
  }
}
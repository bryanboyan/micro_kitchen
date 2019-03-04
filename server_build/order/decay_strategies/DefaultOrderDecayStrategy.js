'use strict';

import { BaseOrderDecayStrategy } from './BaseOrderDecayStrategy';

/**
 * Default decaying model for an order.
 */
export class DefaultOrderDecayStrategy extends BaseOrderDecayStrategy {
  getTimeToLive() {
    return Math.ceil(this.orderData.shelfLife / (this.orderData.decayRate + 1));
  }

  getCurrentValue() {
    const orderAgeSec = parseInt((Date.now() - this.orderCreatedAt) / 1000, 10);
    return this.orderData.shelfLife - orderAgeSec - this.orderData.decayRate * orderAgeSec;
  }
}
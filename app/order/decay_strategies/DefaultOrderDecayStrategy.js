'use strict';

// @flow

import {BaseOrderDecayStrategy} from './BaseOrderDecayStrategy';

/**
 * Default decaying model for an order.
 */
export class DefaultOrderDecayStrategy extends BaseOrderDecayStrategy {
  getTimeToLive(): number {
    return Math.ceil(this.orderData.shelfLife / (this.orderData.decayRate + 1));
  }

  getCurrentValue(): number {
    const orderAgeSec = parseInt((Date.now() - this.orderCreatedAt) / 1000, 10);
    return this.orderData.shelfLife - orderAgeSec - this.orderData.decayRate * orderAgeSec;
  }
}

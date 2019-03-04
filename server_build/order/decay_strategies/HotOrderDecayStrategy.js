'use strict';

import { BaseOrderDecayStrategy } from './BaseOrderDecayStrategy';

/**
 * Hot orders die sooner, the decay happens faster.
 */
export class HotOrderDecayStrategy extends BaseOrderDecayStrategy {
  getTimeToLive() {
    return Math.ceil(this.orderData.shelfLife / (this.orderData.decayRate + 1) / 5);
  }

  getCurrentValue() {
    const orderAgeSec = parseInt((Date.now() - this.orderCreatedAt) / 1000, 10);
    const hotOrderAge = 5 * orderAgeSec;
    return this.orderData.shelfLife - hotOrderAge - this.orderData.decayRate * hotOrderAge;
  }
}
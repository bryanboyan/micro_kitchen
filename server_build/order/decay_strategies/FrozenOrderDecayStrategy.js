'use strict';

import { BaseOrderDecayStrategy } from './BaseOrderDecayStrategy';

/**
 * Frozen orders takes longer to expire.
 */
export class FrozenOrderDecayStrategy extends BaseOrderDecayStrategy {
  getTimeToLive() {
    return Math.ceil(3 * this.orderData.shelfLife / (this.orderData.decayRate + 1));
  }

  getCurrentValue() {
    const orderAgeSec = parseInt((Date.now() - this.orderCreatedAt) / 1000, 10);
    const frozenOrderAge = parseInt(orderAgeSec / 3, 10);
    return this.orderData.shelfLife - frozenOrderAge - this.orderData.decayRate * frozenOrderAge;
  }
}
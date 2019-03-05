'use strict';

// @flow

import {BaseOrderDecayStrategy} from './BaseOrderDecayStrategy';

/**
 * Frozen orders takes longer to expire.
 */
export class FrozenOrderDecayStrategy extends BaseOrderDecayStrategy {
  getTimeToLive(): number {
    return Math.ceil(3 * this.orderData.shelfLife / (this.getDecayRate() + 1));
  }

  getCurrentValue(): number {
    const orderAgeSec = parseInt((Date.now() - this.orderCreatedAt) / 1000, 10);
    const frozenOrderAge = parseInt(orderAgeSec / 3, 10);
    return this.orderData.shelfLife - frozenOrderAge - this.getDecayRate() * frozenOrderAge;
  }
}

'use strict';

// @flow
import type {OrderRawType} from '../Order';

export class BaseOrderDecayStrategy {
  orderData: OrderRawType;
  orderCreatedAt: number;
  decayMultiplier: number;

  constructor(orderData: OrderRawType) {
    this.orderData = orderData;
    this.orderCreatedAt = Date.now();
    this.decayMultiplier = 1;
  }

  setDoubleDecay(): void {
    this.decayMultiplier *= 2;
  }

  getDecayRate(): number {
    return this.orderData.decayRate * this.decayMultiplier;
  }

  getCurrentValue(): number {
    throw 'Please implement the strategy functions';
  }

  getTimeToLive(): number {
    throw 'Please implement the strategy functions';
  }
}

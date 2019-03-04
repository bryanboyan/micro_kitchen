'use strict';

// @flow
import type {OrderRawType} from '../Order';

export class BaseOrderDecayStrategy {
  orderData: OrderRawType;
  orderCreatedAt: number;

  constructor(orderData: OrderRawType) {
    this.orderData = orderData;
    this.orderCreatedAt = Date.now();
  }

  getCurrentValue(): number {
    throw 'Please implement the strategy functions';
  }

  getTimeToLive(): number {
    throw 'Please implement the strategy functions';
  }
}

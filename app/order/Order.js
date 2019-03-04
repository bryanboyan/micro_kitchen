'use strict';

// @flow

import {OrderDecayStrategyFacade} from './decay_strategies/OrderDecayStrategyFacade';
import {BaseShelf} from '../shelf/BaseShelf';

import type {BaseOrderDecayStrategy} from './decay_strategies/BaseOrderDecayStrategy';
export type OrderTemp = 'hot' | 'cold' | 'frozen';
export type OrderRawType = {
  name: string,
  temp: OrderTemp,
  shelfLife: number,
  decayRate: number,
};

/**
 * Responsibility: Represents an order which understands it's own time, name
 *  and other metadata.
 */
export class Order {
  id: number;
  name: string;
  temp: OrderTemp;
  shelfLife: number;
  decayRate: number;
  decayStrategy: BaseOrderDecayStrategy;

  shelf: ?BaseShelf;
  ttlTimer: number;

  constructor(id: number, orderData: OrderRawType) {
    this.id = id;
    this.name = orderData.name;
    this.temp = orderData.temp;
    this.shelfLife = orderData.shelfLife;
    this.decayRate = orderData.decayRate;
    this.decayStrategy = OrderDecayStrategyFacade.chooseStrategy(orderData);
  }

  putOnShelf(shelf: BaseShelf): void {
    this.shelf = shelf;
    if (process.env.STRATEGY === 'timeout') {
      this.ttlTimer = setTimeout(
        () => {
          this.shelf && this.shelf.removeOrderFromShelf(this);
        },
        this.getTimeToLive() * 1000,
      );
    }
  }

  removeFromShelf(): void {
    this.shelf = null;
    if (process.env.STRATEGY === 'timeout') {
      clearTimeout(this.ttlTimer);
    }
  }

  getTimeToLive(): number {
    return this.decayStrategy.getTimeToLive();
  }

  getValue(): number {
    return this.decayStrategy.getCurrentValue();
  }
}

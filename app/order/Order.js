'use strict';

// @flow

import {BaseShelf} from '../shelf/BaseShelf';

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
  createdAt: number;
  name: string;
  temp: OrderTemp;
  shelfLife: number;
  decayRate: number;
  shelf: ?BaseShelf;
  ttlTimer: number;

  constructor(id: number, order: OrderRawType) {
    this.id = id;
    this.createdAt = Date.now();
    this.name = order.name;
    this.temp = order.temp;
    this.shelfLife = order.shelfLife;
    this.decayRate = order.decayRate;
  }

  putOnShelf(shelf: BaseShelf): void {
    this.shelf = shelf;
    if (process.env.STRATEGY === 'timeout') {
      this.ttlTimer = setTimeout(
        () => this.removeFromShelf(),
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
    return Math.ceil(this.shelfLife / (this.decayRate + 1));
  }

  getValue(): number {
    const orderAgeSec = parseInt((Date.now() - this.createdAt) / 1000, 10);
    return this.shelfLife - orderAgeSec - this.decayRate * orderAgeSec;
  }
}

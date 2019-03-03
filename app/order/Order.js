'use strict';

// @flow

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

  constructor(id: number, order: OrderRawType) {
    this.id = id;
    this.createdAt = Date.now();
    this.name = order.name;
    this.temp = order.temp;
    this.shelfLife = order.shelfLife;
    this.decayRate = order.decayRate;
  }

  getValue(): number {
    const orderAgeSec = parseInt((Date.now() - this.createdAt) / 1000, 10);
    return this.shelfLife - orderAgeSec - this.decayRate * orderAgeSec;
  }
}

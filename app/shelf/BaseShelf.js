'use strict';

// @flow

const nullthrows = require('nullthrows');
import {Order} from '../order/Order';

/**
 * Base class of multitypes of shelf.
 */
export class BaseShelf {
  orders: Map<number, Order>;

  constructor() {
    this.orders = new Map();
  }

  getSize(): number {
    return 0;
  }

  putOrder(order: Order): void {
    if (this.getInventoryNumber() == this.getSize()) {
      throw new Error('Shelf full');
    }
    this.putOrderOnShelfImpl(order);
  }

  pickOrder(id: number): Order {
    if (!this.orders.has(id)) {
      throw new Error('Order ' + id + ' not available');
    }

    const order = nullthrows(this.orders.get(id));
    this.removeOrderFromShelfImpl(order);

    return order;
  }

  getInventoryNumber(): number {
    return this.orders.size;
  }

  removeWastedOrders(): void {
    for (var [id, order] of this.orders) {
      if (order.getValue() <= 0) {
        this.removeOrderFromShelfImpl(order);
      }
    }
  }

  putOrderOnShelfImpl(order: Order): void {
    this.orders.set(order.id, order);
    order.putOnShelf(this);
  }

  removeOrderFromShelfImpl(order: Order): void {
    this.orders.delete(order.id);
    order.removeFromShelf();
  }

  __removeOrders(): void {
    this.orders = new Map();
    for (var [id, order] of this.orders) {
      this.removeOrderFromShelfImpl(order);
    }
  }
}

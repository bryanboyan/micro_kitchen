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
    this.putOrderOnShelf(order);
  }

  pickOrder(id: number): Order {
    if (!this.orders.has(id)) {
      throw new Error('Order ' + id + ' not available');
    }

    const order = nullthrows(this.orders.get(id));
    this.removeOrderFromShelf(order);

    return order;
  }

  putOrderOnShelf(order: Order): void {
    this.orders.set(order.id, order);
    order.putOnShelf(this);
  }

  removeOrderFromShelf(order: Order): void {
    this.orders.delete(order.id);
    order.removeFromShelf();
  }

  getInventoryNumber(): number {
    return this.orders.size;
  }

  removeWastedOrders(): void {
    for (var [id, order] of this.orders) {
      if (order.getValue() <= 0) {
        console.log(`${id} value minus ${order.getValue()}`)
        this.removeOrderFromShelf(order);
      }
    }
  }

  __removeOrders(): void {
    for (var [id, order] of this.orders) {
      this.removeOrderFromShelf(order);
    }
    this.orders.clear();
  }
}

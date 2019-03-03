'use strict';

// @flow

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

    this.orders.set(order.id, order);
  }

  pickOrder(id: number): Order {
    if (!this.orders.has(id)) {
      throw new Error('Order ' + id + ' not available');
    }

    const order = this.orders.get(id);
    if (!order) {
      throw new Error('Order will be available');
    }
    this.orders.delete(id);

    return order;
  }

  getInventoryNumber(): number {
    return this.orders.size;
  }

  removeWastedOrders(): void {
    for (var [id, order] of this.orders) {
      if (order.getValue() <= 0) {
        this.orders.delete(id);
      }
    }
  }

  __removeOrders(): void {
    this.orders = new Map();
  }
}

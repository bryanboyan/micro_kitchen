'use strict';

import { Order } from '../order/Order';

/**
 * Base class of multitypes of shelf.
 */
export class BaseShelf {

  constructor() {
    this.orders = new Map();
  }

  getSize() {
    return 0;
  }

  putOrder(order) {
    if (this.getInventoryNumber() == this.getSize()) {
      throw new Error('Shelf full');
    }

    this.orders.set(order.id, order);
  }

  pickOrder(id) {
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

  getInventoryNumber() {
    return this.orders.size;
  }

  removeWastedOrders() {
    for (var [id, order] of this.orders) {
      if (order.getValue() <= 0) {
        this.orders.delete(id);
      }
    }
  }

  __removeOrders() {
    this.orders = new Map();
  }
}
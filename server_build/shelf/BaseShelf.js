'use strict';

const nullthrows = require('nullthrows');
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
    this.putOrderOnShelfImpl(order);
  }

  pickOrder(id) {
    if (!this.orders.has(id)) {
      throw new Error('Order ' + id + ' not available');
    }

    const order = nullthrows(this.orders.get(id));
    this.removeOrderFromShelfImpl(order);

    return order;
  }

  getInventoryNumber() {
    return this.orders.size;
  }

  removeWastedOrders() {
    for (var [id, order] of this.orders) {
      if (order.getValue() <= 0) {
        this.removeOrderFromShelfImpl(order);
      }
    }
  }

  putOrderOnShelfImpl(order) {
    this.orders.set(order.id, order);
    order.putOnShelf(this);
  }

  removeOrderFromShelfImpl(order) {
    this.orders.delete(order.id);
    order.removeFromShelf();
  }

  __removeOrders() {
    this.orders = new Map();
    for (var [id, order] of this.orders) {
      this.removeOrderFromShelfImpl(order);
    }
  }
}
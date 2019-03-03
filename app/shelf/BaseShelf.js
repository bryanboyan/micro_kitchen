'use strict';

const Exception = require('Exception');
const Map = require('Map');

/**
 * Base class of multitypes of shelf.
 */
class BaseShelf {

  constructor() {
    this.orders = new Map();
  }

  getSize() {
    return 0;
  }

  putOrder(order) {
    if (this.getInventoryNumber() == this.getSize()) {
      throw new Exception('Shelf full');
    }

    this.orders.set(order.id, order);
    console.log(`>>>>>>> Order ${order.id} put`);
  }

  pickOrder(id) {
    if (!this.orders.has(id)) {
      throw new Exception('Order ' + id + ' not available');
    }

    const order = this.orders.get(id);
    this.orders.delete(id);
    console.log(`Order ${id} picked`);

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

module.exports = BaseShelf;

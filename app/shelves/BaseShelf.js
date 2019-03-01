'use strict';

/**
 * Base class of multitypes of shelf.
 */
class BaseShelf {

  constructor(size) {
    this.size = size;
    this.orders = new Map();
  }

  putOrder(order) {
    if (this.orders.size == this.size) {
      return false;
    }

    this.orders.set(order.id, order);
    return true;
  }

  pickOrder(id) {
    if (!this.orders.has(id)) {
      throw new Exception('Order ' + id + ' not available');
    }

    const order = this.orders.get(id);
    this.orders.delete(id);

    return order;
  }

  removeWastedOrders() {
    for (var [id, order] of this.orders) {
      if (order.getValue() <= 0) {
        console.log('removing '+id+order);
        this.orders.delete(id);
      }
    }
  }
}

module.exports = BaseShelf;

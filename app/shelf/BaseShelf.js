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
    console.log(`put order into ${this.constructor.name}, current size: ${this.orders.size}`);
    if (this.orders.size == this.size) {
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
        console.log('removing '+id+order);
        this.orders.delete(id);
      }
    }
  }
}

module.exports = BaseShelf;

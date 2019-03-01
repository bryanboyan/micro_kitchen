'use strict';

const {hotShelf, coldShelf, frozenShelf, overflowShelf} = require('./MultiShelves');

class ShelfOperator {

  static putOrder(order) {
    const shelf = ShelfOperator.mapShelf(order);
    try {
      shelf.putOrder(order);
      return true;
    } catch (err) {
      console.error(`${shelf.constructor.name} full, put in overflow`);
      return overflowShelf.tryPutOrder(order);
    }
  }

  static pickOrder(order) {
    const shelf = ShelfOperator.mapShelf(order);
    try {
      return shelf.pickOrder(order.id);
    } catch (err) {
      console.error(`${shelf.constructor.name} pick failed, try overflow`);
      return overflowShelf.tryPickOrder(order);
    }
  }

  static mapShelf(order) {
    switch (order.temp) {
      case 'hot':
        return hotShelf;
      case 'cold':
        return coldShelf;
      case 'frozen':
        return frozenShelf;
      default:
        throw `Invalid temp ${order.temp}`;
    }
  }

  static cleanUpShelves() {
    hotShelf.removeWastedOrders();
    coldShelf.removeWastedOrders();
    frozenShelf.removeWastedOrders();
    overflowShelf.removeWastedOrders();
  }
}

module.exports = ShelfOperator;

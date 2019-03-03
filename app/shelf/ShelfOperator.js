'use strict';

const {coldShelf, frozenShelf, hotShelf, overflowShelf} = require('./MultiShelves');

class ShelfOperator {

  static putOrder(order) {
    ShelfOperator.cleanUpShelves();

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
    ShelfOperator.cleanUpShelves();

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
    [hotShelf, coldShelf, frozenShelf, overflowShelf]
      .map(shelf => shelf.removeWastedOrders());
  }

  static getAllInventoryNumber() {
    return [hotShelf, coldShelf, frozenShelf, overflowShelf].reduce(
      (acc, cur) => acc + cur.getInventoryNumber(),
      0,
    );
  }
}

module.exports = ShelfOperator;

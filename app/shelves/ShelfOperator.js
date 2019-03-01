'use strict';

const {hotShelf, coldShelf, frozenShelf, overflowShelf} = require('./MultiShelves');

class ShelfOperator {

  static putOrder(id, order) {
    // TODO switch between temprature
    console.log(id, order);
  }

  static pickOrder(id) {
    // TODO switch between temprature
  }

  static cleanUpShelves() {
    hotShelf.removeWastedOrders();
    coldShelf.removeWastedOrders();
    frozenShelf.removeWastedOrders();
    overflowShelf.removeWastedOrders();
  }
}

module.exports = ShelfOperator;

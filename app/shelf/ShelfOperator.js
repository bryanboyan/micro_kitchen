'use strict';

const {hotShelf, coldShelf, frozenShelf, overflowShelf} = require('./MultiShelves');

class ShelfOperator {

  static putOrder(id, order) {
    // TODO switch between temprature
    console.log(id, JSON.stringify(order));
  }

  static pickOrder(id) {
    // TODO switch between temprature
    console.log('Driving picking order '+id);
  }

  static cleanUpShelves() {
    hotShelf.removeWastedOrders();
    coldShelf.removeWastedOrders();
    frozenShelf.removeWastedOrders();
    overflowShelf.removeWastedOrders();
  }
}

module.exports = ShelfOperator;

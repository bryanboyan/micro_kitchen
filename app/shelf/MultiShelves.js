'use strict';

const BaseShelf = require('./BaseShelf');

class HotShelf extends BaseShelf {

  getSize() {
    return 15;
  }
}

class ColdShelf extends BaseShelf {

  getSize() {
    return 15;
  }
}

class FrozenShelf extends BaseShelf {

  getSize() {
    return 15;
  }
}

class OverflowShelf extends BaseShelf {

  getSize() {
    return 20;
  }

  tryPutOrder(order) {
    try {
      this.putOrder(order);
      return true;
    } catch (err) {
      console.log('Dropping order due to overflow shelf full');
      return false;
    }
  }

  tryPickOrder(id) {
    try {
      return this.pickOrder(id);
    } catch (err) {
      console.log(`Not able to pick order ${id} from overflowShelf`);
      return null;
    }
  }
}

module.exports = {
  hotShelf: new HotShelf(),
  coldShelf: new ColdShelf(),
  frozenShelf: new FrozenShelf(),
  overflowShelf: new OverflowShelf(),
};

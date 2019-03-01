'use strict';

const BaseShelf = require('./BaseShelf');

class HotShelf extends BaseShelf {

  constructor() {
    const shelfSize = 15;
    super(shelfSize);
  }
}

class ColdShelf extends BaseShelf {

  constructor() {
    const shelfSize = 15;
    super(shelfSize);
  }
}

class FrozenShelf extends BaseShelf {

  constructor() {
    const shelfSize = 15;
    super(shelfSize);
  }
}

class OverflowShelf extends BaseShelf {

  constructor() {
    const shelfSize = 20;
    super(shelfSize);
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

'use strict';

import { BaseShelf } from './BaseShelf';

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
      console.info('Dropping order due to overflow shelf full');
      return false;
    }
  }

  tryPickOrder(id) {
    try {
      return this.pickOrder(id);
    } catch (err) {
      console.info(`Not able to pick order ${id} from overflowShelf`);
      return null;
    }
  }
}

const hotShelf = new HotShelf();
const coldShelf = new ColdShelf();
const frozenShelf = new FrozenShelf();
const overflowShelf = new OverflowShelf();

export { hotShelf, coldShelf, frozenShelf, overflowShelf };
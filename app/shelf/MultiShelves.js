'use strict';

// @flow

import type {Order} from '../order/Order';
import {BaseShelf} from './BaseShelf';

class HotShelf extends BaseShelf {

  getSize(): number {
    return 15;
  }
}

class ColdShelf extends BaseShelf {

  getSize(): number {
    return 15;
  }
}

class FrozenShelf extends BaseShelf {

  getSize(): number {
    return 15;
  }
}

class OverflowShelf extends BaseShelf {

  getSize(): number {
    return 20;
  }

  tryPutOrder(order: Order): boolean {
    try {
      this.putOrder(order);
      return true;
    } catch (err) {
      return false;
    }
  }

  tryPickOrder(id: number): ?Order {
    try {
      return this.pickOrder(id);
    } catch (err) {
      return null;
    }
  }
}

const hotShelf = new HotShelf();
const coldShelf = new ColdShelf();
const frozenShelf = new FrozenShelf();
const overflowShelf = new OverflowShelf();

export {hotShelf, coldShelf, frozenShelf, overflowShelf};

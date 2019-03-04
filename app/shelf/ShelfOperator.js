'use strict';

// @flow

import type {Order} from '../order/Order';
import type {BaseShelf} from './BaseShelf';

import {coldShelf, frozenShelf, hotShelf, overflowShelf} from './MultiShelves';

export class ShelfOperator {

  static putOrder(order: Order): boolean {
    ShelfOperator.cleanUpShelves();

    const shelf = ShelfOperator.mapShelf(order);
    try {
      shelf.putOrder(order);
      return true;
    } catch (err) {
      return overflowShelf.tryPutOrder(order);
    }
  }

  static pickOrder(order: Order): ?Order {
    ShelfOperator.cleanUpShelves();

    const shelf = ShelfOperator.mapShelf(order);
    try {
      return shelf.pickOrder(order.id);
    } catch (err) {
      return overflowShelf.tryPickOrder(order.id);
    }
  }

  static mapShelf(order: Order): BaseShelf {
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

  static cleanUpShelves(): void {
    if (process.env.STRATEGY === 'operate') {
      [hotShelf, coldShelf, frozenShelf, overflowShelf]
        .map(shelf => shelf.removeWastedOrders());
    }
  }

  static getAllInventoryNumber(): number {
    return [hotShelf, coldShelf, frozenShelf, overflowShelf].reduce(
      (acc, cur) => acc + cur.getInventoryNumber(),
      0,
    );
  }
}

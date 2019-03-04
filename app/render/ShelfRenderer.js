'use strict';

// @flow

const Table = require('cli-table');

import {BaseShelf} from '../shelf/BaseShelf';

export class ShelfRenderer {
  shelf: BaseShelf;

  constructor(shelf: BaseShelf) {
    this.shelf = shelf;
  }

  renderShelfRow(): Array<string> {
    const orders = [];
    for (let order of this.shelf.orders.values()) {
      orders.push(`#${order.id}`);
    }
    return orders;
  }
}

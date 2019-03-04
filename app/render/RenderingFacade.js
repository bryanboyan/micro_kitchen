'use strict';

// @flow

const Table = require('cli-table');

import {coldShelf, frozenShelf, hotShelf, overflowShelf} from '../shelf/MultiShelves';
import {ShelfRenderer} from './ShelfRenderer';

class RenderingFacade {
  shelfRenderers: Map<string, ShelfRenderer>;
  header: Array<string>;

  constructor() {
    this.shelfRenderers = new Map();
    this.shelfRenderers.set('HotShelf', new ShelfRenderer(hotShelf));
    this.shelfRenderers.set('ColdShelf', new ShelfRenderer(coldShelf));
    this.shelfRenderers.set('FrozenShelf', new ShelfRenderer(frozenShelf));
    this.shelfRenderers.set('OverflowShelf', new ShelfRenderer(overflowShelf));
    this.header = this.buildHeader();
  }

  render(): void {
    this.clearScreen();
    const table = new Table({
      head: this.header,
      style: {
        head: ['blue', 'bold'],
      },
      colWidths: [16].concat(Array.apply(null, Array(this.getRightColumnSize())).map(a => 6)),
    });
    for (let [shelfName, shelfRender] of this.shelfRenderers.entries()) {
      table.push({[shelfName]: shelfRender.renderShelfRow()});
    }
    console.log(table.toString());
    console.info("In above example, each row is the shelf's ongoing orders. #<number> means order's number.");
    console.info("After every order is finished dispatching to driver (or wasted), the program will finish");
  }

  clearScreen(): void {
    process.stdout.write('\x1b[2J');
    process.stdout.write('\x1b[0f');
  }

  buildHeader(): Array<string> {
    const maxSize = this.getRightColumnSize();
    const headerSlots = [];
    for (let i=1; i<=maxSize; i++) {
      headerSlots.push("@"+i);
    }
    return ['Shelf Name'].concat(headerSlots);
  }

  getRightColumnSize(): number {
    const sizes = [coldShelf, frozenShelf, hotShelf, overflowShelf].map(shelf => shelf.getSize());
    return Math.max.apply(null, sizes);
  }
}

const facade = new RenderingFacade();
export default facade;

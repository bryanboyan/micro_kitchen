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
    const table = new Table({head: this.header});
    for (let [shelfName, shelfRender] of this.shelfRenderers.entries()) {
      table.push({[shelfName]: shelfRender.renderShelfRow()});
    }
    console.log(table.toString());

    setTimeout(() => this.render(), 2000);
  }

  clearScreen(): void {
    process.stdout.write('\x1b[2J');
    process.stdout.write('\x1b[0f');
  }

  buildHeader(): Array<string> {
    const sizes = [coldShelf, frozenShelf, hotShelf, overflowShelf].map(shelf => shelf.getSize());
    const maxSize = Math.max.apply(null, sizes);
    const headerSlots = [];
    for (let i=1; i<=maxSize; i++) {
      headerSlots.push("@"+i);
    }
    return ['Shelf Name'].concat(headerSlots);
  }
}

const facade = new RenderingFacade();
export default facade;

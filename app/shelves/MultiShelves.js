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
}

module.exports = {
  hotShelf: new HotShelf(),
  coldShelf: new ColdShelf(),
  frozenShelf: new FrozenShelf(),
  overflowShelf: new OverflowShelf(),
};

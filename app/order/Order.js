'use strict';

/**
 * Responsibility: Represents an order which understands it's own time, name
 *  and other metadata.
 */
class Order {

  constructor(order) {
    this.createdAt = Date.now();
    this.name = order.name;
    this.temp = order.temp;
    this.shelfLife = order.shelfLife;
    this.decayRate = order.decayRate;
  }

  getValue() {

  }
}

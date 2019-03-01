'use strict';

/**
 * Responsibility: Represents an order which understands it's own time, name
 *  and other metadata.
 */
class Order {

  constructor(id, order) {
    this.id = id;
    this.createdAt = Date.now();
    this.name = order.name;
    this.temp = order.temp;
    this.shelfLife = order.shelfLife;
    this.decayRate = order.decayRate;
  }

  getValue() {
    const orderAgeSec = parseInt((Date.now() - this.createdAt) / 1000, 10);
    return this.shelfLife - orderAgeSec - this.decayRate * orderAgeSec;
  }
}

module.exports = Order;

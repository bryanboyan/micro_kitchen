'use strict';

import { OrderDecayStrategyFacade } from './decay_strategies/OrderDecayStrategyFacade';
import { BaseShelf } from '../shelf/BaseShelf';

/**
 * Responsibility: Represents an order which understands it's own time, name
 *  and other metadata.
 */
export class Order {

  constructor(id, orderData) {
    this.id = id;
    this.name = orderData.name;
    this.temp = orderData.temp;
    this.shelfLife = orderData.shelfLife;
    this.decayRate = orderData.decayRate;
    this.decayStrategy = OrderDecayStrategyFacade.chooseStrategy(orderData);
  }

  putOnShelf(shelf) {
    this.shelf = shelf;
    if (process.env.STRATEGY === 'timeout') {
      this.ttlTimer = setTimeout(() => this.removeFromShelf(), this.getTimeToLive() * 1000);
    }
  }

  removeFromShelf() {
    this.shelf = null;
    if (process.env.STRATEGY === 'timeout') {
      clearTimeout(this.ttlTimer);
    }
  }

  getTimeToLive() {
    return this.decayStrategy.getTimeToLive();
  }

  getValue() {
    return this.decayStrategy.getCurrentValue();
  }
}
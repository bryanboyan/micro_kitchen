'use strict';

// @flow

import {OrderDecayStrategyFacade} from './decay_strategies/OrderDecayStrategyFacade';
import {BaseShelf} from '../shelf/BaseShelf';
import {overflowShelf} from '../shelf/MultiShelves';
import RenderingFacade from '../render/RenderingFacade';

import type {BaseOrderDecayStrategy} from './decay_strategies/BaseOrderDecayStrategy';
export type OrderTemp = 'hot' | 'cold' | 'frozen';
export type OrderRawType = {
  name: string,
  temp: OrderTemp,
  shelfLife: number,
  decayRate: number,
};

/**
 * Responsibility: Represents an order which understands it's own time, name
 *  and other metadata.
 */
export class Order {
  id: number;
  name: string;
  temp: OrderTemp;
  shelfLife: number;
  decayRate: number;
  decayStrategy: BaseOrderDecayStrategy;

  shelf: ?BaseShelf;
  ttlTimer: number;

  constructor(id: number, orderData: OrderRawType) {
    this.id = id;
    this.name = orderData.name;
    this.temp = orderData.temp;
    this.shelfLife = orderData.shelfLife;
    this.decayRate = orderData.decayRate;
    this.decayStrategy = OrderDecayStrategyFacade.chooseStrategy(orderData);
  }

  putOnShelf(shelf: BaseShelf): void {
    this.shelf = shelf;
    if (shelf === overflowShelf) {
      this.decayStrategy.setDoubleDecay();
    }
    if (process.env.CLEANUP_STRATEGY === 'timeout') {
      this.ttlTimer = setTimeout(
        () => {
          this.shelf && this.shelf.removeOrderFromShelf(this);
        },
        this.getTimeToLive() * 1000,
      );
    }
    this.triggerRerendering();
  }

  removeFromShelf(): void {
    this.shelf = null;
    if (process.env.CLEANUP_STRATEGY === 'timeout') {
      clearTimeout(this.ttlTimer);
    }
    this.triggerRerendering();
  }

  triggerRerendering(): void {
    RenderingFacade.render();
  }

  getTimeToLive(): number {
    return parseInt(this.decayStrategy.getTimeToLive(), 10);
  }

  getValue(): number {
    return parseInt(this.decayStrategy.getCurrentValue(), 10);
  }
}

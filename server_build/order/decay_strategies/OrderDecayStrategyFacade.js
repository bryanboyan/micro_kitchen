'use strict';

import { BaseOrderDecayStrategy } from './BaseOrderDecayStrategy';
import { DefaultOrderDecayStrategy } from './DefaultOrderDecayStrategy';
import { FrozenOrderDecayStrategy } from './FrozenOrderDecayStrategy';
import { HotOrderDecayStrategy } from './HotOrderDecayStrategy';

export class OrderDecayStrategyFacade {
  static chooseStrategy(orderData) {
    if (orderData.temp === 'hot') {
      return new HotOrderDecayStrategy(orderData);
    } else if (orderData.temp === 'frozen') {
      return new FrozenOrderDecayStrategy(orderData);
    }
    return new DefaultOrderDecayStrategy(orderData);
  }
}
'use strict';

// @flow
import type {OrderRawType} from '../Order';

import {BaseOrderDecayStrategy} from './BaseOrderDecayStrategy';
import {DefaultOrderDecayStrategy} from './DefaultOrderDecayStrategy';
import {FrozenOrderDecayStrategy} from './FrozenOrderDecayStrategy';
import {HotOrderDecayStrategy} from './HotOrderDecayStrategy';

export class OrderDecayStrategyFacade {
  static chooseStrategy(orderData: OrderRawType): BaseOrderDecayStrategy {
    return process.env.DECAY_STRATEGY === 'dynamic'
      ? OrderDecayStrategyFacade.chooseDynamicStrategy(orderData)
      : new DefaultOrderDecayStrategy(orderData);
  }

  static chooseDynamicStrategy(orderData: OrderRawType): BaseOrderDecayStrategy {
    if (orderData.temp === 'hot') {
      return new HotOrderDecayStrategy(orderData);
    } else if (orderData.temp === 'frozen') {
      return new FrozenOrderDecayStrategy(orderData);
    }
    return new DefaultOrderDecayStrategy(orderData);
  }
}

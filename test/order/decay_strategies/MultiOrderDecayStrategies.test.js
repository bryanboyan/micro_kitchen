'use strict';

import {DefaultOrderDecayStrategy} from '../../../app_build/order/decay_strategies/DefaultOrderDecayStrategy';
import {FrozenOrderDecayStrategy} from '../../../app_build/order/decay_strategies/FrozenOrderDecayStrategy';
import {HotOrderDecayStrategy} from '../../../app_build/order/decay_strategies/HotOrderDecayStrategy';
const orderData = require('../../sample_orders');

[DefaultOrderDecayStrategy, FrozenOrderDecayStrategy, HotOrderDecayStrategy].map(
  className => {
    test(`${className.name} construction and get functions work as expected`, () => {
      const strategy = new className(orderData[0]);
      expect(strategy.getCurrentValue()).not.toBeNaN();
      expect(strategy.getTimeToLive()).not.toBeNaN();
    });
  }
)

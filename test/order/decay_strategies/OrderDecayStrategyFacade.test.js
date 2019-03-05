'use strict';

import {OrderDecayStrategyFacade} from '../../../app_build/order/decay_strategies/OrderDecayStrategyFacade';
import {DefaultOrderDecayStrategy} from '../../../app_build/order/decay_strategies/DefaultOrderDecayStrategy';
import {BaseOrderDecayStrategy} from '../../../app_build/order/decay_strategies/BaseOrderDecayStrategy';
const orderData = require('../../sample_orders');

test('Is based on process.env.DECAY_STRATEGY to do static or dynamic', () => {
  process.env.DECAY_STRATEGY = 'static';
  expect(OrderDecayStrategyFacade.chooseStrategy(orderData[0])).toBeInstanceOf(DefaultOrderDecayStrategy);

  process.env.DECAY_STRATEGY = 'dynamic';
  expect(OrderDecayStrategyFacade.chooseStrategy(orderData[0])).toBeInstanceOf(BaseOrderDecayStrategy);
  expect(OrderDecayStrategyFacade.chooseStrategy(orderData[1])).toBeInstanceOf(BaseOrderDecayStrategy);
  expect(OrderDecayStrategyFacade.chooseStrategy(orderData[2])).toBeInstanceOf(BaseOrderDecayStrategy);
});

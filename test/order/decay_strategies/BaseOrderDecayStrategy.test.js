'use strict';

import {BaseOrderDecayStrategy} from '../../../app_build/order/decay_strategies/BaseOrderDecayStrategy';
const orderData = require('../../sample_orders');

test('Can construct with right data', () => {
  const strategy = new BaseOrderDecayStrategy(orderData[0]);
  expect(strategy.orderData).toBeInstanceOf(Object);
});

test('Calling base class get functions will throw', () => {
  const strategy = new BaseOrderDecayStrategy([]);
  expect(() => strategy.getCurrentValue()).toThrow();
  expect(() => strategy.getTimeToLive()).toThrow();
});

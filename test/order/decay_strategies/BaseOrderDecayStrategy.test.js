'use strict';

import {BaseOrderDecayStrategy} from '../../../app_build/order/decay_strategies/BaseOrderDecayStrategy';
import {Order} from '../../../app_build/order/Order';
import {overflowShelf} from '../../../app_build/shelf/MultiShelves';
const orderData = require('../../sample_orders');

test('Can construct with right data', () => {
  const strategy = new BaseOrderDecayStrategy(orderData[0]);
  expect(strategy.orderData).toBeInstanceOf(Object);
});

test('Calling base class get functions will throw', () => {
  const strategy = new BaseOrderDecayStrategy(orderData[0]);
  expect(() => strategy.getCurrentValue()).toThrow();
  expect(() => strategy.getTimeToLive()).toThrow();
});

test('Putting into overflowShelf will have double decay rates', () => {
  const order = new Order(1, orderData[0]);
  const decayRate1 = order.decayStrategy.getDecayRate();

  order.putOnShelf(overflowShelf);
  const decayRate2 = order.decayStrategy.getDecayRate();

  expect(decayRate2).toBeCloseTo(2 * decayRate1);
});

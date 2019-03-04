'use strict';

import {Order} from '../../server_build/order/Order';
const orders = require('../sample_orders');

test('Order can be constructed with correct values', () => {
  const orderID = 10;
  const orderData = orders[0];
  const order = new Order(orderID, orderData);
  expect(order.id).toEqual(orderID);
  expect(order.temp).toEqual(orderData.temp);
});

test('Order can have correct value returns, life decays', done => {
  const orderID = 10;
  const orderData = {
    "name": "FoodX",
    "temp": "cold",
    "shelfLife": 3,
    "decayRate": 0.3
  };
  const order = new Order(orderID, orderData);
  setTimeout(() => {
    expect(order.getValue()).toBeLessThan(order.shelfLife);
    done();
  }, 2000);
});

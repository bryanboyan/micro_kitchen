'use strict';

import {Order} from '../../app_build/order/Order';
import {OrderManager} from '../../app_build/order/OrderManager';
const ordersData = require('../sample_orders');

beforeEach(() => {
  jest.useFakeTimers();
});

test('Dispatcher can be instantiated', () => {
  const manager = new OrderManager(ordersData);
  expect(manager.orders.length).toEqual(ordersData.length);
});

test('Orders can be handled with right index increase', () => {
  const manager = new OrderManager(ordersData);
  const numOrders = ordersData.length;
  for (var i=0; i<numOrders; i++) {
    manager.handleOrder(new Order(i, ordersData[i]));
  }
  // One for order expire the other for driver pick up
  expect(setTimeout).toHaveBeenCalledTimes(numOrders * 2);
});

test('Calling dispatching start will correctly call back', done => {
  const manager = new OrderManager(ordersData);

  manager.startProcessing(() => {
    manager.stopProcessing();
    expect(manager.index).toEqual(ordersData.length + 1);
    done();
  });

  jest.runAllTimers();
});

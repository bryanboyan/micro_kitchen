'use strict';

const Order = require('../../app/order/Order');
const OrderManager = require('../../app/order/OrderManager');
const ordersData = require('../sample_orders');

const orders = ordersData.map((order, index) => new Order(index, order));

beforeEach(() => {
  jest.useFakeTimers();
});

test('Dispatcher can be instantiated', () => {
  const manager = new OrderManager(orders);
  expect(manager.orders.length).toEqual(orders.length);
});

test('Orders can be handled with right index increase', () => {
  const manager = new OrderManager(orders);
  const numOrders = orders.length;
  for (var i=0; i<numOrders; i++) {
    manager.handleOrder();
  }
  expect(manager.index).toEqual(numOrders);
  expect(setTimeout).toHaveBeenCalledTimes(numOrders);
});

test('When order inqueue finished, it finishes without over dispatching', () => {
  const manager = new OrderManager(orders);
  const numOrders = orders.length;
  const handleTimes = numOrders + 10;
  for (var i=0; i<handleTimes; i++) {
    manager.handleOrder();
  }
  expect(manager.index).toEqual(handleTimes);
  // Only called numOrders times
  expect(setTimeout).toHaveBeenCalledTimes(numOrders);
});

test('Calling dispatching start will correctly call back', done => {
  const manager = new OrderManager(orders);

  manager.startProcessing(() => {
    manager.stopProcessing();
    expect(manager.index).toEqual(orders.length + 1);
    done();
  });

  jest.runAllTimers();
});

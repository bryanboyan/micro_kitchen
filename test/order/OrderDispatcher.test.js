'use strict';


const Order = require('../../app/order/Order');
const OrderDispatcher = require('../../app/order/OrderDispatcher');
const ordersData = require('../sample_orders');
const orders = ordersData.map((order, index) => new Order(index, order));

beforeEach(() => {
  jest.useFakeTimers();
});

test('Dispatcher can be instantiated', () => {
  const dispatcher = new OrderDispatcher(orders);
  expect(dispatcher.orders.length).toEqual(orders.length);
});

test('Orders can be handled with right index increase', () => {
  const dispatcher = new OrderDispatcher(orders);
  const numOrders = orders.length;
  for (var i=0; i<numOrders; i++) {
    dispatcher.handleOrder();
  }
  expect(dispatcher.index).toEqual(numOrders);
  expect(setTimeout).toHaveBeenCalledTimes(numOrders);
});

test('When order inqueue finished, it finishes without over dispatching', () => {
  const dispatcher = new OrderDispatcher(orders);
  const numOrders = orders.length;
  const handleTimes = numOrders + 10;
  for (var i=0; i<handleTimes; i++) {
    dispatcher.handleOrder();
  }
  expect(dispatcher.index).toEqual(handleTimes);
  // Only called numOrders times
  expect(setTimeout).toHaveBeenCalledTimes(numOrders);
});

test('Calling dispatching start will correctly call back', done => {
  const dispatcher = new OrderDispatcher(orders);

  dispatcher.startDispatching(() => {
    dispatcher.stopDispatching();
    expect(dispatcher.index).toEqual(orders.length + 1);
    done();
  });

  jest.runAllTimers();
});

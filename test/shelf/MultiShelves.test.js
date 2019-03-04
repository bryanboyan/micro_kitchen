'use strict';

import {Order} from '../../server_build/order/Order';
import {overflowShelf} from '../../server_build/shelf/MultiShelves';
const orders = require('../sample_orders');

beforeEach(() => {
  overflowShelf.orders = new Map(); // reset
});

test('OverflowShelf could try putOrder with normal success return', () => {
  const orderID = 11;
  const order = new Order(orderID, orders[1]);
  const putResult = overflowShelf.tryPutOrder(order);
  expect(putResult).toBeTruthy();
});

test('OverflowShelf could try putOrder with falsy return when overloaded', () => {
  // Larger than overflowShelf's size
  for (var i=0; i<20; i++) {
    overflowShelf.orders.set(new Order(i, orders[0]));
  }

  // Now overflowShelf is already overloaded
  const orderID = 101;
  const order = new Order(orderID, orders[1]);
  const putResult = overflowShelf.tryPutOrder(order);
  expect(putResult).toBeFalsy();
});

test('OverflowShelf could try pick order with normal success return', () => {
  const orderID = 11;
  const order = new Order(orderID, orders[1]);
  const putResult = overflowShelf.tryPutOrder(order);
  expect(putResult).toBeTruthy();

  const pickedOrder = overflowShelf.tryPickOrder(order.id);
  expect(pickedOrder).toEqual(order);
});

test('OverflowShelf try pick order which is not available and return null', () => {
  const orderID = 11;
  const order = new Order(orderID, orders[1]);
  const putResult = overflowShelf.tryPutOrder(order);
  expect(putResult).toBeTruthy();

  const pickedOrder = overflowShelf.tryPickOrder(order.id + 1);
  expect(pickedOrder).toBeNull();
});

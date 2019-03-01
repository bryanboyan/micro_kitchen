'use strict';

const BaseShelf = require('../../app/shelf/BaseShelf');
const Order = require('../../app/order/Order');
const orders = require('../sample_orders');

const SHELF_SIZE = 10;
class TestShelf extends BaseShelf {
  constructor() {
    super(SHELF_SIZE);
  }
}

test('Be able to construct', () => {
  const testShelf = new TestShelf();
  expect(testShelf.size).toEqual(SHELF_SIZE);
});

test('Be able to put order', () => {
  const order = new Order(1, orders[1]);
  const testShelf = new TestShelf();
  testShelf.putOrder(order);
});

test('Be able to pick order', () => {
  const orderID = 11;
  const order = new Order(orderID, orders[1]);
  const testShelf = new TestShelf();
  testShelf.putOrder(order);

  const pickedOrder = testShelf.pickOrder(orderID);
  expect(pickedOrder.id).toEqual(orderID);
});

test('Be able to remove wasted orders', () => {
  const order1 = new Order(1, {
    "name": "FoodX",
    "temp": "cold",
    "shelfLife": -1, // mock to definitely have wastes
    "decayRate": 0.3
  });
  const order2 = new Order(2, {
    "name": "FoodY",
    "temp": "cold",
    "shelfLife": 100, // mock something last longer
    "decayRate": 0.1
  });

  const testShelf = new TestShelf();
  testShelf.putOrder(order1);
  testShelf.putOrder(order2);
  expect(testShelf.getInventoryNumber()).toEqual(2);

  testShelf.removeWastedOrders();
  expect(testShelf.getInventoryNumber()).toEqual(1);
});

'use strict';

import {Order} from '../../app_build/order/Order';
import {ShelfOperator} from '../../app_build/shelf/ShelfOperator';
const {coldShelf, frozenShelf, hotShelf, overflowShelf} = require('../../app_build/shelf/MultiShelves');
const ordersData = require('../sample_orders');

const orders = ordersData.map((data, index) => new Order(index, data));

beforeEach(() => {
  [hotShelf, coldShelf, frozenShelf, overflowShelf]
    .map(shelf => shelf.__removeOrders());
  // Clean the orders object
  ordersData.map((orderData, index) => {
    orders[index] = new Order(index, orderData);
  });
});

test('Can put orders', () => {
  expect(ShelfOperator.putOrder(orders[0])).toBeTruthy();
  expect(ShelfOperator.putOrder(orders[1])).toBeTruthy();
});

test('Can pick orders', () => {
  const order = orders[0];
  ShelfOperator.putOrder(order);
  const pickResult = ShelfOperator.pickOrder(order);
  expect(pickResult).toEqual(order);
})

test('If shelves are full, putting more will return false', () => {
  const orderData = Object.assign({}, ordersData[0]);
  orderData.temp = 'hot';

  const totalShelfSize = hotShelf.getSize() + overflowShelf.getSize();
  for (var i=0; i<totalShelfSize; i++) {
    let order = new Order(i, orderData);
    expect(ShelfOperator.putOrder(order)).toBeTruthy();
  }

  expect(ShelfOperator.putOrder(new Order(i++, orderData))).toBeFalsy();
  expect(ShelfOperator.putOrder(new Order(i++, orderData))).toBeFalsy();
});

test('Picking an unavailable order will return null', () => {
  expect(ShelfOperator.putOrder(orders[0])).toBeTruthy();

  // we don't have order1
  expect(ShelfOperator.pickOrder(orders[1])).toBeNull();

  expect(ShelfOperator.pickOrder(orders[0])).toEqual(orders[0]);

  // order0 is already picked, not available
  expect(ShelfOperator.pickOrder(orders[0])).toBeNull();
});

test('Mapping from temp to shelf should be correct', () => {
  const order = orders[0];
  new Map([['hot', hotShelf], ['cold', coldShelf], ['frozen', frozenShelf]]).forEach(
    (expectedShelf, temp) => {
      order.temp = temp;
      expect(ShelfOperator.mapShelf(order)).toEqual(expectedShelf);
    }
  );
  order.temp = 'random temp';
  // invalid order is exceptional
  expect(() => ShelfOperator.mapShelf(order)).toThrow();
});

test('Removing wasted orders will get rid of wasted orders', done => {
  const soonExpiredOrders = ordersData.map((orderData, index) => {
    let newOrderData = Object.assign({}, orderData, {shelfLife: 1});
    return new Order(index, newOrderData);
  });
  const indexOffsite = soonExpiredOrders.length;
  const longEnoughOrders = ordersData.map((orderData, index) => {
    let newOrderData = Object.assign({}, orderData, {shelfLife: 10000});
    return new Order(index+indexOffsite, newOrderData);
  });

  const allOrders = soonExpiredOrders.concat(longEnoughOrders);
  // Put all orders
  allOrders.map(order => {
    expect(ShelfOperator.putOrder(order)).toBeTruthy();
  });

  expect(ShelfOperator.getAllInventoryNumber())
    .toEqual(allOrders.length);

  setTimeout(() => {
    ShelfOperator.cleanUpShelves();

    expect(ShelfOperator.getAllInventoryNumber())
      .toEqual(longEnoughOrders.length);
    done();
  }, 1500); // in 1.5 seconds (> the life of soonExpiredOrders)
});

'use strict';

const OrderReceiver = require('./app/order/OrderReceiver');

const orderer = new OrderReceiver();
orderer.startDispatching();
setTimeout(() => orderer.stopDispatching(), 10000);

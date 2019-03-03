'use strict';

// @flow
const fs = require('fs');
const path = require('path');

/**
 * Responsibility: Takes care of reading the orders, and flush order history
 *  back to some storage.
 */
class OrderDAO {

  constructor() {
    // TODO Historical orders
  }

  readAll(cb: (err: ?Error, data: string) => void) {
    fs.readFile(path.join(__dirname, '../../assets/orders.json'), "utf8", (err, data) => {
      cb(err, JSON.parse(data));
    });
  }
}

const orderDAO = new OrderDAO();

export default orderDAO;

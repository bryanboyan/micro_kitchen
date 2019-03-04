'use strict';

// Use esm to transform to use import/export in node.
require = require('esm')(module);
module.exports = require("./server.js");

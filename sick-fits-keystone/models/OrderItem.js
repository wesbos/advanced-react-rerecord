const { byTracking, atTracking } = require('@keystonejs/list-plugins');
const Item = require('./Item');

// OrderItem shares all the same fields as Item, so we jsut copy it
module.exports = {
  ...Item,
};

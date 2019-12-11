const { Integer, Text } = require('@keystonejs/fields');
const Item = require('./Item');

// OrderItem shares all the same fields as Item, so we jsut copy it
module.exports = {
  fields: {
    ...Item.fields,
    quantity: { type: Integer, isRequired: true },
    image: { type: Text },
  },
  plugins: [...Item.plugins],
};

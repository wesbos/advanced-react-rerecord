const { Integer, Relationship } = require('@keystonejs/fields');
const { graphql } = require('graphql');
const { byTracking, atTracking } = require('@keystonejs/list-plugins');

module.exports = {
  // labelResolver: cartItem => `🛒 ${cartItem.item.name}`,
  labelResolver: async (cartItem, args, context, { schema }) => {
    const query = `
      query getItem($itemId: ID!) {
        Item(where: { id: $itemId }) {
          name
        }
      }
    `;
    const variables = { itemId: cartItem.item.toString() };
    const { data } = await graphql(schema, query, null, context, variables);
    return `🛒 ${data.Item.name}`;
  },
  fields: {
    quantity: { type: Integer, isRequired: true, defaultValue: 1 },
    item: {
      type: Relationship,
      ref: 'Item',
      isRequired: true,
    },
    user: {
      type: Relationship,
      ref: 'User',
      isRequired: true,
    },
  },
  plugins: [atTracking(), byTracking()],
};

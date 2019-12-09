const { Integer, Relationship } = require('@keystonejs/fields');
const { graphql } = require('graphql');
const { byTracking, atTracking } = require('@keystonejs/list-plugins');

module.exports = {
  // labelResolver: cartItem => `🛒 ${cartItem.item.name}`,
  labelResolver: async (cartItem, args, context, { schema }) => {
    console.log(cartItem);
    const query = `
      query getItem($itemId: ID!) {
        Item(where: { id: $itemId }) {
          name
        }
      }
    `;
    const variables = { itemId: cartItem.item.toString() };
    const { data } = await graphql(schema, query, null, context, variables);
    console.log(data);
    return `🛒 ${cartItem.quantity} of ${data.Item.name}`;
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
      ref: 'User.cart',
      isRequired: true,
    },
    // hooks: {
    //   resolveInput: async ({
    //     operation,
    //     existingItem,
    //     originalInput,
    //     resolvedData,
    //     context,
    //     actions,
    //   }) => {
    //     // jump in
    //     return resolvedData;
    //   },
    // },
  },
  plugins: [atTracking(), byTracking()],
};

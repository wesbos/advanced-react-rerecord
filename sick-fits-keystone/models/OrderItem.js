import { Integer, Text } from '@keystonejs/fields';
import Item from './Item';

// OrderItem shares all the same fields as Item, so we jsut copy it
export default {
  fields: {
    ...Item.fields,
    quantity: { type: Integer, isRequired: true },
    image: { type: Text },
  },
  plugins: [...Item.plugins],
};

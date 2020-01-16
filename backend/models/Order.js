import { Text, Integer, Relationship, DateTime } from '@keystonejs/fields';

import { byTracking, atTracking } from '@keystonejs/list-plugins';

export default {
  labelResolver: item => `Sale ${item.length}`,
  fields: {
    total: { type: Integer },
    items: {
      type: Relationship,
      ref: 'OrderItem',
      many: true,
    },
    user: {
      type: Relationship,
      ref: 'User',
    },
    charge: { type: Text },
    createdAt: {
      type: DateTime,
      format: 'MM/DD/YYYY h:mm A',
      yearRangeFrom: 1901,
      yearRangeTo: 2018,
      yearPickerType: 'auto',
    },
  },
  plugins: [atTracking(), byTracking()],
};

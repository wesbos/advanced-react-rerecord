const {
  Text,
  Integer,
  Relationship,
  DateTime,
  Virtual,
} = require('@keystonejs/fields');

const { byTracking, atTracking } = require('@keystonejs/list-plugins');

module.exports = {
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
    // TODO: Wait for virtual fields to be published
    // display_charge: {
    //   type: Virtual,
    //   resolver: item => `Charge # ${item.charge}`,
    // },
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

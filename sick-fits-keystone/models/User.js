const {
  Text,
  Select,
  Password,
  Checkbox,
  Relationship,
} = require('@keystonejs/fields');
const { byTracking, atTracking } = require('@keystonejs/list-plugins');
const access = require('../utils/access');

module.exports = {
  fields: {
    name: { type: Text },
    email: {
      type: Text,
      isUnique: true,
    },
    isAdmin: { type: Checkbox },
    password: {
      type: Password,
    },
    cart: {
      type: Relationship,
      ref: 'CartItem',
      many: true,
    },
    permissions: {
      type: Select,
      // TODO: Maybe simplify this to ADMIN and USER
      options: [
        'ADMIN',
        'USER',
        'ITEMCREATE',
        'ITEMUPDATE',
        'ITEMDELETE',
        'PERMISSIONUPDATE',
      ],
    },
    resetToken: { type: Text, isRequired: true },
    resetTokenExpiry: { type: Text, isRequired: true },
  },
  // To create an initial user you can temporarily remove access controls
  access: {
    read: access.userIsAdminOrOwner,
    update: access.userIsAdminOrOwner,
    create: access.userIsAdmin,
    delete: access.userIsAdmin,
    auth: true,
  },
  plugins: [atTracking(), byTracking()],
};

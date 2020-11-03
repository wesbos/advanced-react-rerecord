import { createSchema, list } from '@keystone-next/keystone/schema';
import {
  text,
  relationship,
  checkbox,
  password,
  timestamp,
  select,
  virtual,
  integer,
} from '@keystone-next/fields';

import formatMoney from './utils/formatMoney';
import type { AccessControl } from './types';

/*
  TODO
    - [ ] Access Control
    - [ ] Tracking (createdAt, updatedAt, updatedAt, updatedBy)
    - [ ] User: could create an isAdmin user?
    - [ ] CartItem: labelResolver -> virtual field
    - [ ] Item: price integer field missing defaultValue, isRequired
    - [ ] Item: relationship fields don't support isRequired?
    - [ ] Item: image field (need cloudinaryImage?)
    - [ ] Item: what does the `user` field do? -- permissions
    - [ ] OrderItem: should image be text()? or cloudinaryImage? (needs direct saving)
    - [ ] OrderItem: quantity integer field missing isRequired
*/

export const access: AccessControl = {
  userIsAdmin: ({ session }) =>
    session?.data && session.data.permissions === 'ADMIN',
  userIsEditor: ({ session }) =>
    session?.data && session.data.permissions === 'EDITOR',
  userOwnsItem: ({ session }) =>
    session?.itemId ? { user: { id: session.itemId } } : false,
  userIsItem: ({ session }) =>
    session?.itemId ? { id: session.itemId } : false,
};

access.userIsAdminOrOwner = args =>
  access.userIsAdmin(args) || access.userOwnsItem(args);

access.userCanAccessUsers = args =>
  access.userIsAdmin(args) || access.userIsItem(args);

access.userCanUpdateItem = args =>
  access.userIsAdmin(args) || access.userIsEditor(args) || access.userOwnsItem;

const itemFields = {
  name: text({ isRequired: true }),
  // description: text({ ui: { displayMode: 'textarea' } }),
  description: text({
    ui: { views: require.resolve('./admin/fields/Content') },
  }),
  price: integer(),
  user: relationship({ ref: 'User' }),
};

export const lists = createSchema({
  User: list({
    access: {
      // anyone should be able to create a user (sign up)
      create: true,
      // only admins can see the list of users
      read: access.userCanAccessUsers,
      update: access.userCanAccessUsers,
      delete: access.userIsAdmin,
    },
    ui: {
      listView: {
        initialColumns: ['name', 'email'],
      },
    },
    fields: {
      name: text({ isRequired: true }),
      email: text({ isRequired: true, isUnique: true }),
      password: password(),
      cart: relationship({ ref: 'CartItem.user', many: true }),
      permissions: select({
        options: [
          { label: 'User', value: 'USER' },
          { label: 'Editor', value: 'EDITOR' },
          { label: 'Admin', value: 'ADMIN' },
        ],
        access: {
          create: access.userIsAdmin,
          read: access.userIsAdmin,
          update: access.userIsAdmin,
        },
      }),
      resetToken: text({ isUnique: true }),
      resetTokenExpiry: timestamp({ isUnique: true }),
    },
  }),
  CartItem: list({
    fields: {
      quantity: integer({
        /* defaultValue: 1, isRequired: true */
      }),
      item: relationship({ ref: 'Item' /*, isRequired: true */ }),
      user: relationship({ ref: 'User.cart' /*, isRequired: true */ }),
    },
  }),
  Item: list({
    fields: itemFields,
  }),
  Order: list({
    ui: {
      labelField: 'label',
      listView: { initialColumns: ['label', 'user', 'items'] },
    },
    fields: {
      label: virtual({
        graphQLReturnType: 'String',
        resolver: item => formatMoney(item.total),
      }),
      total: integer(),
      items: relationship({ ref: 'OrderItem', many: true }),
      user: relationship({ ref: 'User' }),
      charge: text(),
    },
  }),
  OrderItem: list({
    fields: {
      ...itemFields,
      quantity: integer({
        /* isRequired: true */
      }),
      image: text(),
    },
  }),
});

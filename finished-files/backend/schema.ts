import { createSchema, list } from '@keystone-next/keystone/schema';
import {
  text,
  relationship,
  password,
  select,
  virtual,
  integer,
} from '@keystone-next/fields';
import { cloudinaryImage } from '@keystone-next/cloudinary';
import { KeystoneCrudAPI } from '@keystone-next/types';
import type { KeystoneListsTypeInfo } from './.keystone/schema-types';
import formatMoney from './utils/formatMoney';
import type { AccessControl } from './types';

/*
  TODO
    - [ ] Access Control
    - [ ] Tracking (createdAt, updatedAt, updatedAt, updatedBy)
    - [x] User: could create an isAdmin user?
    - [x] CartItem: labelResolver -> virtual field
    - [x] Item: price integer field missing defaultValue, isRequired
    - [x] Item: image field (need cloudinaryImage?)
    - [x] OrderItem: quantity integer field missing isRequired
    
    - [ ] Item / OrderItem: change image to relationship
    - [ ] Item: relationship fields don't support isRequired?
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
  userIsAdminOrOwner: args =>
    access.userIsAdmin(args) || access.userOwnsItem(args),
  userCanAccessUsers: args =>
    access.userIsAdmin(args) || access.userIsItem(args),
  userCanUpdateItem: args =>
    access.userIsAdmin(args) ||
    access.userIsEditor(args) ||
    access.userOwnsItem,
};

const cloudinary = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_KEY,
  apiSecret: process.env.CLOUDINARY_SECRET,
};

const itemFields = {
  name: text({ isRequired: true }),
  description: text({ ui: { displayMode: 'textarea' } }),
  price: integer(),
  image: cloudinaryImage({ cloudinary }),
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
          // only admins can create or change the permissions field
          create: access.userIsAdmin,
          update: access.userIsAdmin,
        },
        ui: {
          itemView: {
            // show the fieldMode as read-only if the user is not an admin
            fieldMode: args => (access.userIsAdmin(args) ? 'edit' : 'read'),
          },
        },
      }),
    },
  }),
  Item: list({
    fields: itemFields,
  }),
  CartItem: list({
    fields: {
      label: virtual({
        graphQLReturnType: 'String',
        resolver: async (cartItem, args, ctx) => {
          const crud: KeystoneCrudAPI<KeystoneListsTypeInfo> = ctx.crud;
          if (!cartItem.item) {
            return `🛒 ${cartItem.quantity} of (invalid item)`;
          }
          let item = await crud.Item.findOne({
            where: { id: cartItem.item },
          });
          if (item?.name) {
            return `🛒 ${cartItem.quantity} of ${item.name}`;
          }
          return `🛒 ${cartItem.quantity} of (invalid item)`;
        },
      }),
      quantity: integer({
        /* @ts-ignore */ // TODO: Should be fixed in @keystonejs/fields >= 2.0.2
        defaultValue: 1,
        isRequired: true,
      }),
      item: relationship({ ref: 'Item' /* , isRequired: true */ }),
      user: relationship({ ref: 'User.cart' /* , isRequired: true */ }),
    },
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
      quantity: integer({ isRequired: true }),
      image: text(),
    },
  }),
});

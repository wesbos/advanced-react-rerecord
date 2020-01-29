import {
  Text,
  Select,
  Password,
  Checkbox,
  Relationship,
} from '@keystonejs/fields';
import { byTracking, atTracking } from '@keystonejs/list-plugins';
import { DateTimeUtc } from '@keystonejs/fields-datetime-utc';
import { userIsAdmin, userCanAccessUsers } from '../utils/access';

export default {
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
      ref: 'CartItem.user',
      many: true,
    },
    permissions: {
      type: Select,
      defaultValue: 'USER',
      options: ['ADMIN', 'EDITOR', 'USER'],
    },
    resetToken: { type: Text, unique: true },
    resetTokenExpiry: { type: DateTimeUtc, unique: true },
  },
  // To create an initial user you can temporarily remove access controls
  access: {
    // anyone should be able to create a user (sign up)
    create: true,
    // only admins can see the list of users
    read: userCanAccessUsers,
    update: userCanAccessUsers,
    delete: userIsAdmin,
  },
  plugins: [atTracking(), byTracking()],
};

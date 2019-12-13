import {
  Text,
  Select,
  Password,
  Checkbox,
  Relationship,
  Integer,
  DateTime,
} from '@keystonejs/fields';
import { byTracking, atTracking } from '@keystonejs/list-plugins';
import { userIsAdminOrOwner, userIsAdmin } from '../utils/access';

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
    resetToken: { type: Text },
    resetTokenExpiry: { type: DateTime },
  },
  // To create an initial user you can temporarily remove access controls
  // access: {
  //   read: userIsAdminOrOwner,
  //   update: userIsAdminOrOwner,
  //   create: userIsAdmin,
  //   delete: userIsAdmin,
  //   auth: true,
  // },
  plugins: [atTracking(), byTracking()],
};

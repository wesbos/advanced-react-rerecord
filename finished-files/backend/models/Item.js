import {
  Text,
  Integer,
  Relationship,
} from '@keystonejs/fields';

const { CloudinaryImage } = require('@keystonejs/fields-cloudinary-image');

import { CloudinaryAdapter } from '@keystonejs/file-adapters';
import { byTracking, atTracking } from '@keystonejs/list-plugins';
import {
  userIsAdminOrOwner,
  userIsAdmin,
  userCanUpdateItem,
} from '../utils/access';

// const cloudinaryAdapter = new CloudinaryAdapter({
//   cloudName: process.env.CLOUDINARY_CLOUD_NAME,
//   apiKey: process.env.CLOUDINARY_KEY,
//   apiSecret: process.env.CLOUDINARY_SECRET,
//   folder: 'sick-fits-keystone',
// });

export default {
  fields: {
    name: { type: Text, isRequired: true },
    description: { type: Text, isMultiline: true },
    // image: { type: CloudinaryImage, adapter: cloudinaryAdapter },
    price: { type: Integer },
    user: {
      type: Relationship,
      ref: 'User',
    },
  },
  access: {
    create: true,
    read: true,
    update: userCanUpdateItem,
    delete: userIsAdminOrOwner,
  },
  plugins: [atTracking(), byTracking()],
};

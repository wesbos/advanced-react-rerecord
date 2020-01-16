import {
  Text,
  CloudinaryImage,
  Integer,
  Relationship,
} from '@keystonejs/fields';

import { CloudinaryAdapter } from '@keystonejs/file-adapters';
import { byTracking, atTracking } from '@keystonejs/list-plugins';

const cloudinaryAdapter = new CloudinaryAdapter({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_KEY,
  apiSecret: process.env.CLOUDINARY_SECRET,
  folder: 'sick-fits-keystone',
});

export default {
  fields: {
    name: { type: Text, isRequired: true },
    description: { type: Text, isMultiline: true },
    image: { type: CloudinaryImage, adapter: cloudinaryAdapter },
    largeImage: { type: CloudinaryImage, adapter: cloudinaryAdapter },
    price: { type: Integer },
    user: {
      type: Relationship,
      ref: 'User',
    },
  },
  plugins: [atTracking(), byTracking()],
};

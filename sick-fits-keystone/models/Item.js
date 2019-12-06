const {
  Text,
  CloudinaryImage,
  Integer,
  Relationship,
} = require('@keystonejs/fields');

const { Wysiwyg } = require('@keystonejs/fields-wysiwyg-tinymce');
const { CloudinaryAdapter } = require('@keystonejs/file-adapters');
const { byTracking, atTracking } = require('@keystonejs/list-plugins');

const cloudinaryAdapter = new CloudinaryAdapter({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_KEY,
  apiSecret: process.env.CLOUDINARY_SECRET,
  folder: 'sick-fits-keystone',
});

module.exports = {
  fields: {
    name: { type: Text, isRequired: true },
    description: { type: Text, isMultiline: true },
    image: { type: CloudinaryImage, adapter: cloudinaryAdapter },
    largeImage: { type: CloudinaryImage, adapter: cloudinaryAdapter },
    price: { type: Integer },
    seller: {
      type: Relationship,
      ref: 'User',
    },
  },
  plugins: [atTracking(), byTracking()],
};

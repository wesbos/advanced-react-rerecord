import {
  createSchema,
  list,
} from "@keystone-next/keystone/schema";
import {
  text,
  relationship,
  checkbox,
  password,
  timestamp,
  select,
  virtual,
} from "@keystone-next/fields";

import type { AccessArgs } from './types';

export const access = {
  isAdmin: ({ session }: AccessArgs) => !!session?.data?.isAdmin,
};

export const lists = createSchema({
  User: list({
    ui: {
      listView: {
        initialColumns: ["name", "email"],
      },
    },
    fields: {
      name: text({ isRequired: true }),
      email: text({ isRequired: true, isUnique: true }),
      password: password(),
      isAdmin: checkbox({
        access: {
          create: access.isAdmin,
          read: access.isAdmin,
          update: access.isAdmin,
        },
      }),
    },
  }),
});

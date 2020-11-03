import { config } from "@keystone-next/keystone/schema";
import {
  statelessSessions,
  withItemData,
} from "@keystone-next/keystone/session";
import { createAuth } from "@keystone-next/auth";

import { lists, extendGraphqlSchema } from "./schema";

let sessionSecret = "-- DEV COOKIE SECRET; CHANGE ME --";
let sessionMaxAge = 60 * 60 * 24 * 30; // 30 days

const auth = createAuth({
  listKey: "User",
  identityField: "email",
  secretField: "password",
  initFirstItem: {
    fields: ["name", "email", "password"],
    itemData: {
      isAdmin: true,
    },
  },
});

export default auth.withAuth(
  config({
    name: "Sick Fits",
    db: {
      adapter: "mongoose",
      url: "mongodb://localhost/sick-fits",
    },
    graphql: {
      /* TOOD: Path */
    },
    ui: {
      /* TOOD: Path */
      // isAccessAllowed,
    },
    lists,
    extendGraphqlSchema,
    session: withItemData(
      statelessSessions({
        maxAge: sessionMaxAge,
        secret: sessionSecret,
      }),
      { User: "name isAdmin" }
    ),
  })
);

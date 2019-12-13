import 'dotenv/config';
import { Keystone } from '@keystonejs/keystone';
import Auth from '@keystonejs/auth-password';
import { GraphQLApp } from '@keystonejs/app-graphql';
import { AdminUIApp } from '@keystonejs/app-admin-ui';
import { MongooseAdapter as Adapter } from '@keystonejs/adapter-mongoose';
import expressSession from 'express-session';
import MongoStoreMaker from 'connect-mongo';
import Item from './models/Item';
import User from './models/User';
import CartItem from './models/CartItem';
import OrderItem from './models/OrderItem';
import Order from './models/Order';
import { addToCart, checkout, requestReset, resetPassword } from './mutations';

const MongoStore = MongoStoreMaker(expressSession);

const PROJECT_NAME = 'sick-fits-keystone';

const keystone = new Keystone({
  name: PROJECT_NAME,
  adapter: new Adapter(),
  // persist logins when the app restarts
  sessionStore: new MongoStore({ url: process.env.DATABASE_URL }),
});

keystone.createList('User', User);
keystone.createList('Item', Item);
keystone.createList('CartItem', CartItem);
keystone.createList('OrderItem', OrderItem);
keystone.createList('Order', Order);

const authStrategy = keystone.createAuthStrategy({
  type: Auth.PasswordAuthStrategy,
  list: 'User',
});

keystone.extendGraphQLSchema({
  types: [{ type: 'type Message { message: String }' }],
  queries: [
    // {
    //   schema: 'me: User',
    //   resolver(parent, args, ctx, info) {
    //     return ctx.authedItem;
    //   },
    // },
  ],
  mutations: [
    {
      schema: 'addToCart(id: ID): CartItem',
      resolver: addToCart,
    },
    {
      schema: 'checkout(token: String!): Order',
      resolver: checkout,
    },
    {
      schema: 'requestReset(email: String!): Message',
      resolver: requestReset,
    },
    // TODO: This should return a message, not a user
    {
      schema:
        'resetPassword(resetToken: String!, password: String!, confirmPassword: String!): User',
      resolver: resetPassword,
    },
  ],
});

const apps = [
  new GraphQLApp(),
  // To create an initial user you can temporarily remove the authStrategy below
  new AdminUIApp({ enableDefaultRoute: true, authStrategy }),
];
export { keystone, apps };

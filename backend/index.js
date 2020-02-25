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
import * as mutations from './mutations';

const MongoStore = MongoStoreMaker(expressSession);

const PROJECT_NAME = 'sick-fits-keystone';

const keystone = new Keystone({
  name: PROJECT_NAME,
  adapter: new Adapter(),
  // persist logins when the app restarts
  sessionStore: new MongoStore({ url: process.env.DATABASE_URL }),
  async onConnect() {
    if (process.argv.includes('--dummy')) {
      console.log('--------INSERTING DUMMY DATA ------------');
      const { items } = await import('./src/dummy.js');
      const Item = keystone.adapters.MongooseAdapter.mongoose.model('Item');
      await Item.insertMany(items);
      console.log(
        '----- DUMMY DATA ADDED! Please start the process with `npm run dev` ------'
      );
      process.exit();
    }
  },
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
      resolver: mutations.addToCart,
    },
    {
      schema: 'checkout(token: String!): Order',
      resolver: mutations.checkout,
    },
    {
      schema: 'requestReset(email: String!): Message',
      resolver: mutations.requestReset,
    },
    {
      schema:
        'resetPassword(resetToken: String!, password: String!, confirmPassword: String!): Message',
      resolver: mutations.resetPassword,
    },
  ],
});

const apps = [new GraphQLApp(), new AdminUIApp({ authStrategy })];

const keystoneconfig = {
  secureCookies: false,
};
const configureExpress = app => {
  app.set('trust proxy', 1);
};

export { keystone, apps, keystoneconfig, configureExpress };

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
import { search } from './queries/search';

const MongoStore = MongoStoreMaker(expressSession);

const PROJECT_NAME = 'sick-fits-keystone';
console.log('TRYING TO CONNECT TO THE DB', process.env.DATABASE_URL);


const keystone = new Keystone({
  name: PROJECT_NAME,
  adapter: new Adapter(),
  secureCookies: false,
  cookieSecret: 'OMG123',
  // persist logins when the app restarts
  sessionStore: new MongoStore({ url: process.env.DATABASE_URL }),
  async onConnect() {
    console.log('Connected??', process.env.DATABASE_URL);

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
    {
      schema: 'search(where: ItemWhereInput): [Item]',
      resolver: search,
    },
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

const apps = [new GraphQLApp({
  apiPath: "/backend/admin/api",
  graphiqlPath: "/backend/admin/graphiql",
}), new AdminUIApp({ authStrategy, adminPath: "/backend/admin" })];

const configureExpress = app => {
  app.set('trust proxy', 1);
};


// Serverless Start
// const setup = keystone.prepare({
//     apps,
//     dev: process.env.NODE_ENV !== 'production',
//     configureExpress
// });


// module.exports.keystone = keystone;

// This code here is to make it serverless
// https://www.keystonejs.com/guides/custom-server#custom-server-as-a-lambda
// module.exports.handler = async (event, context) => {
//   const handler = await setup;
//   return handler(event, context);
// };

export { keystone, apps, configureExpress };

require('dotenv').config();
const { Keystone } = require('@keystonejs/keystone');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');

const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { MongooseAdapter: Adapter } = require('@keystonejs/adapter-mongoose');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);

const Item = require('./models/Item');
const User = require('./models/User');
const CartItem = require('./models/CartItem');
const OrderItem = require('./models/OrderItem');
const Order = require('./models/Order');

const PROJECT_NAME = 'sick-fits-keystone';

const { addToCart, createOrder } = require('./mutations');

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
  type: PasswordAuthStrategy,
  list: 'User',
});

keystone.extendGraphQLSchema({
  types: [{ type: 'type FooBar { foo: Int, bar: Float }' }],
  queries: [
    {
      schema: 'double(x: Int): Int',
      resolver: (_, { x }) => 2 * x,
    },
    // {
    //   schema: 'me: User',
    //   resolver(parent, args, ctx, info) {
    //     return ctx.authedItem;
    //   },
    // },
  ],
  mutations: [
    {
      schema: 'double(x: Int): Int',
      resolver: (_, { x }) => 2 * x,
    },
    {
      schema: 'addToCart(id: ID): CartItem',
      resolver: addToCart,
    },
    {
      schema: 'createOrder($token: String!): Order',
      resolver: createOrder,
    },
  ],
});

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    // To create an initial user you can temporarily remove the authStrategy below
    new AdminUIApp({ enableDefaultRoute: true, authStrategy }),
  ],
};

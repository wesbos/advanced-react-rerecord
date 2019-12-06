require('dotenv').config();
const { Keystone } = require('@keystonejs/keystone');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');

const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { MongooseAdapter: Adapter } = require('@keystonejs/adapter-mongoose');

const { NextApp } = require('@keystonejs/app-next');
const Item = require('./models/Item');
const User = require('./models/User');
const CartItem = require('./models/CartItem');
const OrderItem = require('./models/OrderItem');
const Order = require('./models/Order');

const PROJECT_NAME = 'sick-fits-keystone';

// persist sessions with mongodb
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);

const keystone = new Keystone({
  name: PROJECT_NAME,
  adapter: new Adapter(),
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

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    // To create an initial user you can temporarily remove the authStrategy below
    new AdminUIApp({ enableDefaultRoute: true, authStrategy }),
  ],
};

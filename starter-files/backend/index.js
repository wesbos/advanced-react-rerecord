// These are a few of the base imports to bootstrap a keystone app. It comes with all starters. Don't worry, we will write the code for each of these things. I'm only including them so you don't make a spelling mistake and ruin your day
import 'dotenv/config';
import { Keystone } from '@keystonejs/keystone';
import Auth from '@keystonejs/auth-password';
import { GraphQLApp } from '@keystonejs/app-graphql';
import { AdminUIApp } from '@keystonejs/app-admin-ui';
import { MongooseAdapter as Adapter } from '@keystonejs/adapter-mongoose';
import expressSession from 'express-session';
import MongoStoreMaker from 'connect-mongo';


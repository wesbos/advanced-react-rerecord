import React from 'react';
import gql from 'graphql-tag';
import { useUser } from './User';
import Form from './styles/Form';
import SignIn from './Signin';

function PleaseSignIn({ children }) {
  const me = useUser();
  if(!me)

}

function Account() {
  const me = useUser();
  if (!me) return <SignIn />;
  return <p>Hello {me.name}</p>;
}

export default Account;

import React, { Component, useState, useEffect } from 'react';
import { useMutation, Mutation } from '@apollo/client';

import gql from 'graphql-tag';
import useForm from '../lib/useForm';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        item {
          id
          email
          name
        }
      }
    }
  }
`;

function Signin() {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
  });
  const [signin, { error, loading }] = useMutation(SIGNIN_MUTATION, {
    variables: inputs,
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  return (
    <Form
      method="post"
      onSubmit={async e => {
        e.preventDefault();
        const res = await signin();
        console.log(res);
        resetForm();
      }}
    >
      <fieldset disabled={loading} aria-busy={loading}>
        <h2>Sign into your account</h2>
        <Error error={error} />
        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            placeholder="email"
            value={inputs.email}
            onChange={handleChange}
            autoComplete="email"
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            placeholder="password"
            value={inputs.password}
            onChange={handleChange}
            autoComplete="new-password"
          />
        </label>

        <button type="submit">Sign In!</button>
      </fieldset>
    </Form>
  );
}

export default Signin;

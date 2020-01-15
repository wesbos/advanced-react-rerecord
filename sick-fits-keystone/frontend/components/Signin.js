import React, { Component, useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import useForm from '../lib/useForm';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      item {
        id
        email
        name
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
        await signin();
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
          />
        </label>

        <button type="submit">Sign In!</button>
      </fieldset>
    </Form>
  );
}

export default Signin;

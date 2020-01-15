import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import Dump from '@wesbos/dump';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';
import useForm from '../lib/useForm';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    createUser(data: { email: $email, name: $name, password: $password }) {
      id
      email
      name
    }
  }
`;

function Signup() {
  const { inputs, handleChange } = useForm();
  const [signup, { error, loading, data }] = useMutation(SIGNUP_MUTATION, {
    variables: inputs,
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  return (
    <Form
      method="post"
      onSubmit={async e => {
        e.preventDefault();
        await signup();
      }}
    >
      <fieldset disabled={loading} aria-busy={loading}>
        {data && data.createUser && (
          <p>Signed up with {data.createUser.email} — Please Sign In now</p>
        )}
        <h2>Sign Up for An Account</h2>
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
        <label htmlFor="name">
          Name
          <input
            type="text"
            name="name"
            placeholder="name"
            value={inputs.name}
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

        <button type="submit">Sign Up!</button>
      </fieldset>
    </Form>
  );
}

export default Signup;
export { SIGNUP_MUTATION };

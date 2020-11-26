import React, { Component } from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import useForm from '../lib/useForm';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';
import Signin from './Signin';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $token: String!
    $password: String!
    $email: String!
  ) {
    redeemUserPasswordResetToken(
      token: $token
      password: $password
      email: $email
    ) {
      message
    }
  }
`;

function Reset({ token }) {
  const { inputs, handleChange, resetForm } = useForm({
    password: '',
    email: '',
  });
  const [resetPassword, { error, loading, data }] = useMutation(
    RESET_MUTATION,
    {
      variables: {
        token,
        password: inputs.password,
        email: inputs.email,
      },
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );

  const successfulReset = data?.redeemUserPasswordResetToken === null;
  if (successfulReset) {
    return <div>
      <h2>Success! Please Sign In</h2>
      <Signin/>
    </div>
  }
  return (
    <Form
      method="post"
      onSubmit={async e => {
        e.preventDefault();
        const res = await resetPassword();
        console.log(res);
        resetForm();
        // this.setState({ password: '', confirmPassword: '' });
      }}
    >
      <fieldset disabled={loading} aria-busy={loading}>
        <h2>Reset Your Password</h2>
        <Error error={data?.redeemUserPasswordResetToken} />

        <label htmlFor="email">
          Email Address
          <input
            type="email"
            name="email"
            placeholder="email"
            value={inputs.email}
            onChange={handleChange}
            required
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
            required
          />
        </label>


        <button type="submit">Reset Your Password!</button>
      </fieldset>
    </Form>
  );
}

export default Reset;

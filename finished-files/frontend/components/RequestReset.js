import React, { Component } from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import useForm from '../lib/useForm';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    sendUserPasswordResetLink(email: $email) {
      code
    }
  }
`;

function RequestReset() {
  const { inputs, handleChange, clearForm } = useForm({ email: '' });
  const [reset, { data, error, loading, called }] = useMutation(
    REQUEST_RESET_MUTATION,
    {
      variables: {
        email: inputs.email,
      },
    }
  );
  return (
    <Form
      method="post"
      data-testid="form"
      onSubmit={async e => {
        e.preventDefault();
        const res = await reset();
        console.log(res);
        clearForm();
      }}
    >
      <fieldset disabled={loading} aria-busy={loading}>
        <h2>Request a password reset</h2>
        <Error error={data?.sendUserPasswordResetLink} />
        {data?.sendUserPasswordResetLink === null && (
          <p>Success! Check your email for a reset link!</p>
        )}

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

        <button type="submit">Request Reset!</button>
      </fieldset>
    </Form>
  );
}

export default RequestReset;
export { REQUEST_RESET_MUTATION };

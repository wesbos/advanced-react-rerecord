import React, { useState, useEffect, useRef } from 'react';
import NProgress from 'nprogress';
import {
  CardElement,
  PaymentRequestButtonElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import Head from 'next/head';
import Router from 'next/router';
import { CURRENT_USER_QUERY, useUser } from './User';

const CREATE_ORDER_MUTATION = gql`
  mutation checkout($token: String!) {
    checkout(token: $token) {
      id
      charge
      total
      items {
        id
        name
      }
    }
  }
`;

function Checkout() {
  const stripe =
    typeof window === 'undefined'
      ? null
      : window.Stripe('pk_test_Vtknn6vSdcZWSG2JWvEiWSqC');
  return (
    <>
      <Head>
        <script src="https://js.stripe.com/v3/"></script>
      </Head>
      <Elements stripe={stripe}>
        <CheckoutForm />
      </Elements>
    </>
  );
}

function CheckoutForm() {
  const elements = useElements();
  const stripe = useStripe();

  console.log(stripe);
  if (!stripe) return <p>Loading...</p>;

  const [checkout] = useMutation(CREATE_ORDER_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  // manually call the mutation once we have the stripe token

  const handleSubmit = async event => {
    // 1. Stop the form from submitting
    event.preventDefault();
    // 2. Start the page transition so show the user something is happening
    NProgress.start();
    // 3. Create the payment method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    console.log({ error, paymentMethod });

    // 4. Send it to the server and charge it
    const order = await checkout({
      variables: {
        token: paymentMethod.id,
      },
    }).catch(err => {
      alert(err.message);
    });

    Router.push({
      pathname: '/order',
      query: { id: order.data.checkout.id },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit">Pay</button>
    </form>
  );
}

export default Checkout;

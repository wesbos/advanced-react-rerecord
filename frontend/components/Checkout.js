import React, { useState, useEffect, useRef } from 'react';
import NProgress from 'nprogress';
import {
  CardElement,
  CardCvcElement,
  CardNumberElement,
  CardExpiryElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
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

const style = {
  base: {
    color: '#32325d',
    border: '5px solid red',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4',
    },
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#ffc600',
  },
};

function Checkout() {
  // We use loadStripe because is load in their lib async
  const stripe = loadStripe('pk_test_Vtknn6vSdcZWSG2JWvEiWSqC');
  return (
    <>
      <Elements stripe={stripe}>
        <CheckoutForm />
      </Elements>
    </>
  );
}

function useCheckout() {
  const stripe = useStripe();
  const [error, setError] = useState();
  const elements = useElements();

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

    if (error) {
      return setError(error);
    }

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

  return { error, handleSubmit };
}

function CheckoutForm() {
  const { handleSubmit, error } = useCheckout();
  return (
    <form onSubmit={handleSubmit}>
      {error && <p>{error.message}</p>}
      <label htmlFor="cardNumber">
        Credit Card Number
        {/* <CardNumberElement /> */}
      </label>
      <CardElement />
      {/* <CardCvcElement /> */}
      <button type="submit">Pay</button>
    </form>
  );
}

export default Checkout;

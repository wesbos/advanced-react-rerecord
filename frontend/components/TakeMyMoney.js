import React from 'react';
import NProgress from 'nprogress';
import StripeCheckout from 'react-stripe-checkout';
import { Mutation, useMutation } from 'react-apollo';
import Router from 'next/router';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import calcTotalPrice from '../lib/calcTotalPrice';
import Error from './ErrorMessage';
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

function totalItems(cart) {
  return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
}

async function onToken(res, checkout) {
  NProgress.start();
  // manually call the mutation once we have the stripe token
  const order = await checkout({
    variables: {
      token: res.id,
    },
  }).catch(err => {
    alert(err.message);
  });
  Router.push({
    pathname: '/order',
    query: { id: order.data.checkout.id },
  });
}

function TakeMyMoney({ children }) {
  const me = useUser();
  const [checkout, { loading }] = useMutation(CREATE_ORDER_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  if (loading) return null;
  return (
    <StripeCheckout
      amount={calcTotalPrice(me.cart)}
      name="Sick Fits"
      description={`Order of ${totalItems(me.cart)} items!`}
      image={
        me.cart.length &&
        me.cart[0].item &&
        me.cart[0].item.image.publicUrlTransformed
      }
      stripeKey="pk_test_Vtknn6vSdcZWSG2JWvEiWSqC"
      currency="USD"
      email={me.email}
      token={res => onToken(res, checkout)}
    >
      {children}
    </StripeCheckout>
  );
}

export default TakeMyMoney;
export { CREATE_ORDER_MUTATION };

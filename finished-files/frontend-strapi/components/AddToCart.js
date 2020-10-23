import React from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { CURRENT_USER_QUERY, useUser } from './User';
import { CART_ITEMS_QUERY } from './LocalState';

// const ADD_TO_CART_MUTATION = gql`
//   mutation addToCart($id: ID!) {
//     addToCart(id: $id) {
//       id
//       quantity
//     }
//   }
// `;
const ADD_TO_CART_MUTATION = gql`
  mutation addToCart($id: ID!, $userId: ID!) {
    createCartItem(input: {
      data: {
        item: $id,
        quantity: 1,
        user: $userId
      }
    }) {
      cartItem {
        id
        quantity
      }
    }
  }
`;

function AddToCart({ id }) {
  const me = useUser();
  const [addToCart, { loading }] = useMutation(ADD_TO_CART_MUTATION, {
    variables: {
      id,
      userId: me.id
    },
    refetchQueries: [{ query: CURRENT_USER_QUERY }, {
      query: CART_ITEMS_QUERY, variables: {
        userId: me.id
      }
    }],
  });
  return (
    <button type="button" disabled={loading} onClick={addToCart}>
      Add{loading && 'ing'} To Cart 🛒
    </button>
  );
}

export default AddToCart;
export { ADD_TO_CART_MUTATION };

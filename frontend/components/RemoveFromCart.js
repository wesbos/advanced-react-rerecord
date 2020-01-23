import React from 'react';
import { useMutation } from '@apollo/client';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';

const REMOVE_FROM_CART_MUTATION = gql`
  mutation deleteCartItem($id: ID!) {
    deleteCartItem(id: $id) {
      id
    }
  }
`;

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${props => props.theme.red};
    cursor: pointer;
  }
`;

// This gets called as soon as we get a response back from the server after a mutation has been performed
function updateCart(cache, payload) {
  // 1. first read the cache
  const data = cache.readQuery({ query: CURRENT_USER_QUERY });
  // 2. remove that item from the cart
  const cartItemId = payload.data.deleteCartItem.id;
  const updatedCart = data.authenticatedUser.cart.filter(
    cartItem => cartItem.id !== cartItemId
  );
  // 3. write it back to the cache
  // WE have do do it in this weird way because the readQuery is immutable. We could also do a deep clone with lodash
  cache.writeQuery({
    query: CURRENT_USER_QUERY,
    data: {
      ...data,
      authenticatedUser: {
        ...data.authenticatedUser,
        cart: updatedCart,
      },
    },
  });
}

function RemoveFromCart({ id }) {
  const [removeFromCart, { loading }] = useMutation(REMOVE_FROM_CART_MUTATION, {
    variables: { id },
    update: updateCart,
    optimisticResponse: {
      __typename: 'Mutation',
      deleteCartItem: {
        __typename: 'CartItem',
        id,
      },
    },
  });
  return (
    <BigButton
      disabled={loading}
      onClick={() => {
        removeFromCart().catch(err => alert(err.message));
      }}
      title="Delete Item"
    >
      &times;
    </BigButton>
  );
}

export default RemoveFromCart;
export { REMOVE_FROM_CART_MUTATION };

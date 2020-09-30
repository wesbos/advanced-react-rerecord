import React from 'react';
import { useMutation } from '@apollo/client';
import styled from 'styled-components';
import gql from 'graphql-tag';

const REMOVE_FROM_CART_MUTATION = gql`
  mutation deleteCartItem($id: ID!) {
    deleteCartItem(input: { where: { id: $id}}) {
      cartItem {
        id
      }
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
  cache.evict({ id: `CartItem:${payload.data.deleteCartItem.id}` });
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
      title="Remove Item From Cart"
    >
      &times;
    </BigButton>
  );
}

export default RemoveFromCart;
export { REMOVE_FROM_CART_MUTATION };

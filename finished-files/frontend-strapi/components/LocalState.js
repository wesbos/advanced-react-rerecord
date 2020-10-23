// TODO: Rename this to be a acrt
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

import { createContext, useState, useContext } from 'react';
import { useUser } from './User';

const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;

const CART_ITEMS_QUERY = gql`
  query cartItems($userId: ID!){
    cartItems(where: {
      user: $userId
    }) {
      quantity
      id
      item {
        name
        price
        id
        photos {
          url
        }
      }
    }
  }
`

function CartStateProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  const me = useUser() || {};
  const {data:cart = [], error, loading} = useQuery(CART_ITEMS_QUERY, {
    variables: { userId: me.id }
  })

  function toggleCart() {
    setCartOpen(!cartOpen);
  }

  function closeCart() {
    setCartOpen(false);
  }

  function openCart() {
    setCartOpen(true);
  }

  return (
    <LocalStateProvider value={{ cartOpen, toggleCart, openCart, closeCart, cart: cart.cartItems || [] }}>
      {children}
    </LocalStateProvider>
  );
}

function useCart() {
  const all = useContext(LocalStateContext);
  return all;
}

export { CartStateProvider, LocalStateContext, useCart, CART_ITEMS_QUERY };

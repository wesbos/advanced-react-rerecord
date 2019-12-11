import { useQuery } from '@apollo/react-hooks';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { adopt } from 'react-adopt';

import { CURRENT_USER_QUERY, useUser } from './User';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';
import CartItem from './CartItem';
import calcTotalPrice from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';
import TakeMyMoney from './TakeMyMoney';

// TODO: Open and close of cart
const LOCAL_STATE_QUERY = gql`
  query {
    cartOpen @client
  }
`;

const TOGGLE_CART_MUTATION = gql`
  mutation {
    toggleCart @client
  }
`;
/* eslint-disable */
const Composed = adopt({
  toggleCart: ({ render }) => <Mutation mutation={TOGGLE_CART_MUTATION}>{render}</Mutation>,
  localState: ({ render }) => <Query query={LOCAL_STATE_QUERY}>{render}</Query>,
});
/* eslint-enable */

function Cart() {
  // const { data: { authenticatedUser: me } = {} } = useQuery(CURRENT_USER_QUERY);
  const me = useUser();
  if (!me) return null;
  console.log(me);

  return (
    <CartStyles open>
      <header>
        <CloseButton onClick={() => console.log('close cart')} title="close">
          &times;
        </CloseButton>
        <Supreme>{me.name}'s Cart</Supreme>
        <p>
          You Have {me.cart.length} Item{me.cart.length === 1 ? '' : 's'} in
          your cart.
        </p>
      </header>
      <ul>
        {me.cart.map(cartItem => (
          <CartItem key={cartItem.id} cartItem={cartItem} />
        ))}
      </ul>
      <footer>
        <p>{formatMoney(calcTotalPrice(me.cart))}</p>
        {me.cart.length && (
          <TakeMyMoney>
            <SickButton>Checkout</SickButton>
          </TakeMyMoney>
        )}
      </footer>
    </CartStyles>
  );
}

export default Cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };

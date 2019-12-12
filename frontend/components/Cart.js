import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { adopt } from 'react-adopt';
import { useUser } from './User';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';
import CartItem from './CartItem';
import calcTotalPrice from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';
import TakeMyMoney from './TakeMyMoney';

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

function Cart() {
  const client = useApolloClient();
  const me = useUser();
  const {
    data: { cartOpen = false },
  } = useQuery(LOCAL_STATE_QUERY);
  if (!me) return null;
  console.log(me);

  return (
    <CartStyles open={cartOpen}>
      <header>
        <CloseButton
          onClick={() => client.writeData({ data: { cartOpen: !cartOpen } })}
          title="close"
        >
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

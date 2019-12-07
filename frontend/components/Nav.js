import Link from 'next/link';
import { Mutation } from 'react-apollo';
import { useQuery } from '@apollo/react-hooks';
import { TOGGLE_CART_MUTATION } from './Cart';
import { CURRENT_USER_QUERY } from './User';
import NavStyles from './styles/NavStyles';

import CartCount from './CartCount';
import Signout from './Signout';

function Nav() {
  const { data: { me } = {} } = useQuery(CURRENT_USER_QUERY);
  return (
    <NavStyles data-test="nav">
      <Link href="/items">
        <a>Shop</a>
      </Link>
      {me && (
        <>
          <Link href="/sell">
            <a>Sell</a>
          </Link>
          <Link href="/orders">
            <a>Orders</a>
          </Link>
          <Link href="/me">
            <a>Account</a>
          </Link>
          <Signout />
          <Mutation mutation={TOGGLE_CART_MUTATION}>
            {toggleCart => (
              <button onClick={toggleCart}>
                My Cart
                <CartCount
                  count={me.cart.reduce(
                    (tally, cartItem) => tally + cartItem.quantity,
                    0
                  )}
                ></CartCount>
              </button>
            )}
          </Mutation>
        </>
      )}
      {!me && (
        <Link href="/signup">
          <a>Sign In</a>
        </Link>
      )}
    </NavStyles>
  );
}

export default Nav;

import Link from 'next/link';
import { useUser } from './User';
import NavStyles from './styles/NavStyles';
import { useCart } from './LocalState';
import CartCount from './CartCount';
import Signout from './Signout';

function Nav() {
  const me = useUser();
  const { toggleCart, cart } = useCart();
  return (
    <NavStyles data-testid="nav">
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

          <button type="button" onClick={toggleCart}>
            My Cart
            <CartCount
              count={cart.reduce(
                (tally, cartItem) => tally + cartItem.quantity,
                0
              )}
            ></CartCount>
          </button>
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
